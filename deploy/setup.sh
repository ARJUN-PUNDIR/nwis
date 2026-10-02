#!/bin/bash
set -e

echo "=========================================================="
echo " OIL NWIS - Automated EC2 Instance Setup"
echo "=========================================================="

# 1. System packages
echo "[1/5] Updating packages and installing system tools..."
sudo apt-get update -y
sudo apt-get install -y python3-pip python3-venv git nginx curl

# Install Node.js 20 LTS
if ! command -v node >/dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Add 2GB swap if RAM is 2GB or less (e.g. t3.micro/t3.small)
TOTAL_RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM_MB" -le 2500 ] && [ ! -f /swapfile ]; then
    echo "Adding 2GB swap for smooth npm builds on small instances..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# 2. Python environment
echo "[2/5] Setting up Python virtual environment..."
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# 3. Build Frontend
echo "[3/5] Installing frontend dependencies & building production bundle..."
cd "$APP_DIR/frontend"
npm install
npm run build

# 4. Configure Nginx
echo "[4/5] Configuring Nginx reverse proxy..."
cd "$APP_DIR"
# Update root path in nginx config to match current path
sed -i "s|/home/ubuntu/nwis|$APP_DIR|g" "$APP_DIR/deploy/nginx.conf"
sudo cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/nwis
sudo ln -sf /etc/nginx/sites-available/nwis /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 5. Configure Systemd Service for FastAPI
echo "[5/5] Configuring systemd background daemon for FastAPI..."
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

echo "=========================================================="
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me || echo "YOUR-EC2-PUBLIC-IP")
echo " NWIS SYSTEM IS DEPLOYED AND ONLINE!"
echo " Mission Control Web UI: http://$PUBLIC_IP"
echo " FastAPI Backend API:    http://$PUBLIC_IP/api"
echo " Swagger API Docs:       http://$PUBLIC_IP/docs"
echo "=========================================================="
