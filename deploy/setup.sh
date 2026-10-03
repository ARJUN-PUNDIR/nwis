#!/bin/bash
set -e

echo "=========================================================="
echo " OIL NWIS - Complete Production EC2 Deployment with Free SSL"
echo "=========================================================="

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

# 1. System packages
echo "[1/6] Installing system tools, Python, Node, Nginx, and Certbot..."
sudo apt-get update -y
sudo apt-get install -y python3-pip python3-venv build-essential git nginx curl certbot python3-certbot-nginx

# Install Node.js 20 LTS if needed
if ! command -v node >/dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Add 2GB swap if RAM is <= 2.5GB (e.g. t3.micro/t3.small)
TOTAL_RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM_MB" -le 2500 ] && [ ! -f /swapfile ]; then
    echo "Adding 2GB swapfile..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# 2. Python environment
echo "[2/6] Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r backend/requirements.txt

# 3. Build Frontend
echo "[3/6] Installing frontend dependencies & building production bundle..."
cd "$APP_DIR/frontend"
npm install
npm run build
cd "$APP_DIR"

# Fix Nginx permissions on /home/ubuntu
chmod 755 /home/ubuntu 2>/dev/null || true
chmod -R 755 "$APP_DIR/frontend/dist"

# 4. Determine Domain Name for Free SSL
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me || echo "127.0.0.1")
# Allow custom domain via environment variable or argument, fallback to free wildcard sslip.io
DOMAIN_NAME="${1:-$CUSTOM_DOMAIN}"
if [ -z "$DOMAIN_NAME" ]; then
    DOMAIN_NAME="${PUBLIC_IP}.sslip.io"
fi
echo "Using Domain: $DOMAIN_NAME"

# 5. Configure Nginx Reverse Proxy
echo "[4/6] Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/nwis > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME $PUBLIC_IP _;

    client_max_body_size 50M;

    # Serve built React frontend
    location / {
        root $APP_DIR/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /docs {
        proxy_pass http://127.0.0.1:8001/docs;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8001/openapi.json;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Proxy WebSockets
    location /ws {
        proxy_pass http://127.0.0.1:8001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/nwis /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 6. Configure Systemd Service for FastAPI
echo "[5/6] Configuring systemd background daemon for FastAPI..."
sudo tee /etc/systemd/system/nwis-backend.service > /dev/null <<EOF
[Unit]
Description=OIL NWIS FastAPI Multi-Agent Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8001
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nwis-backend
sudo systemctl restart nwis-backend

# 7. Obtain Free Let's Encrypt SSL Certificate
echo "[6/6] Requesting 100% Free SSL Certificate via Certbot..."
if [ -n "$DOMAIN_NAME" ] && [ "$DOMAIN_NAME" != "127.0.0.1" ]; then
    echo "Running Certbot for $DOMAIN_NAME..."
    sudo certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos -m "admin@$DOMAIN_NAME" --redirect || {
        echo "Note: If Certbot could not reach port 443, ensure HTTPS (Port 443) is allowed in your AWS Security Group."
    }
fi

echo "=========================================================="
echo " NWIS SYSTEM IS DEPLOYED AND ONLINE!"
echo " 🔒 Secure HTTPS URL:  https://$DOMAIN_NAME"
echo " 🌐 HTTP Direct URL:   http://$PUBLIC_IP"
echo " 📚 Swagger API Docs:  https://$DOMAIN_NAME/docs"
echo "=========================================================="
