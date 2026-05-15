#!/bin/bash
# FinanceOS — Quick Start Script
# Run from the root finance-analyzer/ directory

set -e

echo "╔══════════════════════════════════╗"
echo "║   FinanceOS — Quick Start        ║"
echo "╚══════════════════════════════════╝"
echo ""

# ── Backend ──────────────────────────────────────────────────
echo "▶ Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

echo "  Installing Python dependencies..."
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "  Created .env from .env.example — edit it to configure your database and AI keys."
fi

echo "  Running migrations..."
python manage.py makemigrations --verbosity 0 2>/dev/null || true
python manage.py migrate --verbosity 0

echo "  Starting Django server on http://localhost:8000 ..."
python manage.py runserver &
BACKEND_PID=$!
cd ..

# ── Frontend ─────────────────────────────────────────────────
echo ""
echo "▶ Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "  Installing npm packages..."
  npm install -q
fi

echo "  Starting React dev server on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!
cd ..

# ── Done ──────────────────────────────────────────────────────
echo ""
echo "✅ Both servers started!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000/api/"
echo "   Admin:    http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
