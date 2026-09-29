#!/bin/bash
# ==============================================================================
# OIL INDIA LIMITED - Nearby Wells Intelligence System (NWIS)
# Startup Script for Backend & Frontend Services
# ==============================================================================

echo "=========================================================="
echo " Starting Oil India Limited - NWIS Decision Support System"
echo " Multi-Agent Swarm + eRTMAC Telemetry Simulation"
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 1. Start Python FastAPI Backend on port 8001
echo "[1/2] Launching NWIS Multi-Agent Backend on port 8001..."
"$ROOT_DIR/venv/bin/uvicorn" backend.main:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!

# 2. Start React Vite Frontend on port 5173
echo "[2/2] Launching Mission Control Frontend on port 5173..."
cd "$ROOT_DIR/frontend"
npm run dev -- --port 5173 --host 0.0.0.0 &
FRONTEND_PID=$!

echo "=========================================================="
echo " NWIS System is ONLINE!"
echo " Mission Control UI: http://localhost:5173"
echo " Backend REST & WS:  http://localhost:8001"
echo " API Documentation:  http://localhost:8001/docs"
echo " Press Ctrl+C to terminate both servers."
echo "=========================================================="

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
