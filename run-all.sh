#!/bin/bash

PROJECT_DIR="$HOME/projects/cdac-project"
LOG_DIR="$PROJECT_DIR/log"
PID_FILE="$PROJECT_DIR/cdac-services.pid"

mkdir -p "$LOG_DIR"

echo "======================================"
echo " Starting CDAC Project"
echo "======================================"

# Clear old PID file
> "$PID_FILE"

# Backend
echo "Starting Backend..."
cd "$PROJECT_DIR/backend"
mvn spring-boot:run >> "$LOG_DIR/backend.log" 2>&1 &
echo $! >> "$PID_FILE"

# Code Runner
echo "Starting Code Runner..."
cd "$PROJECT_DIR/codeRunner"
mvn spring-boot:run >> "$LOG_DIR/codeRunner.log" 2>&1 &
echo $! >> "$PID_FILE"

# Problem Runner
echo "Starting Problem Runner..."
cd "$PROJECT_DIR/problemRunner"
mvn spring-boot:run >> "$LOG_DIR/problemRunner.log" 2>&1 &
echo $! >> "$PID_FILE"

# Problem Submit
echo "Starting Problem Submit..."
cd "$PROJECT_DIR/problemSubmit"
mvn spring-boot:run >> "$LOG_DIR/problemSubmit.log" 2>&1 &
echo $! >> "$PID_FILE"

# Frontend
echo "Starting Frontend..."
cd "$PROJECT_DIR/frontend"
npm run dev >> "$LOG_DIR/frontend.log" 2>&1 &
echo $! >> "$PID_FILE"

# AI Worker
echo "Starting AI Worker..."
cd "$PROJECT_DIR/ai-worker"

source .venv/bin/activate 2>/dev/null

if command -v python3 >/dev/null 2>&1; then
    python3 main.py >> "$LOG_DIR/ai-worker.log" 2>&1 &
    echo $! >> "$PID_FILE"
elif command -v python >/dev/null 2>&1; then
    python main.py >> "$LOG_DIR/ai-worker.log" 2>&1 &
    echo $! >> "$PID_FILE"
else
    echo "Python is not installed!"
fi

echo ""
echo "======================================"
echo " All services started in background"
echo "======================================"
echo ""
echo "Logs are continuously written to:"
echo "  Backend        -> log/backend.log"
echo "  Code Runner    -> log/codeRunner.log"
echo "  Problem Runner -> log/problemRunner.log"
echo "  Problem Submit -> log/problemSubmit.log"
echo "  Frontend       -> log/frontend.log"
echo "  AI Worker      -> log/ai-worker.log"
echo ""
echo "PID file -> cdac-services.pid"
echo "======================================"