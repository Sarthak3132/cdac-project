#!/bin/bash

PROJECT_DIR="$HOME/cdac-project"
LOG_DIR="$PROJECT_DIR/log"

echo "======================================"
echo " Stopping CDAC Project"
echo "======================================"

# Stop Backend
echo "Stopping Backend..."
pkill -f "$PROJECT_DIR/backend.*spring-boot:run" 2>/dev/null

# Stop Code Runner
echo "Stopping Code Runner..."
pkill -f "$PROJECT_DIR/codeRunner.*spring-boot:run" 2>/dev/null

# Stop Problem Runner
echo "Stopping Problem Runner..."
pkill -f "$PROJECT_DIR/problemRunner.*spring-boot:run" 2>/dev/null

# Stop Problem Submit
echo "Stopping Problem Submit..."
pkill -f "$PROJECT_DIR/problemSubmit.*spring-boot:run" 2>/dev/null

# Stop Frontend
echo "Stopping Frontend..."
pkill -f "$PROJECT_DIR/frontend.*npm run dev" 2>/dev/null

# Stop AI Worker
echo "Stopping AI Worker..."
pkill -f "$PROJECT_DIR/ai-worker.*main.py" 2>/dev/null

# Clear logs
echo ""
echo "Clearing logs..."

if [ -d "$LOG_DIR" ]; then
    truncate -s 0 "$LOG_DIR/backend.log"
    truncate -s 0 "$LOG_DIR/codeRunner.log"
    truncate -s 0 "$LOG_DIR/problemRunner.log"
    truncate -s 0 "$LOG_DIR/problemSubmit.log"
    truncate -s 0 "$LOG_DIR/frontend.log"
    truncate -s 0 "$LOG_DIR/ai-worker.log"
fi

echo ""
echo "======================================"
echo " All services stopped"
echo " Logs cleared"
echo "======================================"