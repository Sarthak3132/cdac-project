#!/bin/bash

PROJECT_DIR="$HOME/projects/cdac-project"
LOG_DIR="$PROJECT_DIR/log"
PID_FILE="$PROJECT_DIR/cdac-services.pid"

mkdir -p "$LOG_DIR"

echo "======================================"
echo " Starting CDAC Project"
echo "======================================"

# --------------------------------------------------
# Stop existing services if PID file exists
# --------------------------------------------------

if [ -f "$PID_FILE" ]; then
    echo "Checking for existing services..."

    while read -r PID SERVICE; do
        if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
            echo "Stopping existing $SERVICE (PID: $PID)..."
            kill "$PID" 2>/dev/null
        fi
    done < "$PID_FILE"

    sleep 2

    # Force kill anything still running
    while read -r PID SERVICE; do
        if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
            echo "Force stopping $SERVICE (PID: $PID)..."
            kill -9 "$PID" 2>/dev/null
        fi
    done < "$PID_FILE"

    rm -f "$PID_FILE"
fi

touch "$PID_FILE"


# --------------------------------------------------
# Helper function
# --------------------------------------------------

start_service() {
    local NAME="$1"
    local DIR="$2"
    local COMMAND="$3"
    local LOG="$4"

    echo "Starting $NAME..."

    cd "$DIR" || {
        echo "ERROR: Could not enter $DIR"
        return 1
    }

    nohup bash -c "$COMMAND" >> "$LOG" 2>&1 &

    local PID=$!

    echo "$PID $NAME" >> "$PID_FILE"

    echo "  $NAME started (PID: $PID)"
}


# --------------------------------------------------
# Backend
# --------------------------------------------------

start_service \
    "Backend" \
    "$PROJECT_DIR/backend" \
    "mvn spring-boot:run" \
    "$LOG_DIR/backend.log"


# --------------------------------------------------
# Code Runner
# --------------------------------------------------

start_service \
    "Code Runner" \
    "$PROJECT_DIR/codeRunner" \
    "mvn spring-boot:run" \
    "$LOG_DIR/codeRunner.log"


# --------------------------------------------------
# Problem Runner
# --------------------------------------------------

start_service \
    "Problem Runner" \
    "$PROJECT_DIR/problemRunner" \
    "mvn spring-boot:run" \
    "$LOG_DIR/problemRunner.log"


# --------------------------------------------------
# Problem Submit
# --------------------------------------------------

start_service \
    "Problem Submit" \
    "$PROJECT_DIR/problemSubmit" \
    "mvn spring-boot:run" \
    "$LOG_DIR/problemSubmit.log"


# --------------------------------------------------
# Frontend
# --------------------------------------------------

start_service \
    "Frontend" \
    "$PROJECT_DIR/frontend" \
    "npm run dev" \
    "$LOG_DIR/frontend.log"


# --------------------------------------------------
# AI Worker
# --------------------------------------------------

echo "Starting AI Worker..."

cd "$PROJECT_DIR/ai-worker" || {
    echo "ERROR: Could not enter AI worker directory"
} 

if [ -f "$PROJECT_DIR/ai-worker/.venv/bin/python" ]; then

    nohup "$PROJECT_DIR/ai-worker/.venv/bin/python" main.py \
        >> "$LOG_DIR/ai-worker.log" 2>&1 &

    AI_PID=$!

    echo "$AI_PID AI-Worker" >> "$PID_FILE"

    echo "  AI Worker started (PID: $AI_PID)"

elif command -v python3 >/dev/null 2>&1; then

    nohup python3 main.py \
        >> "$LOG_DIR/ai-worker.log" 2>&1 &

    AI_PID=$!

    echo "$AI_PID AI-Worker" >> "$PID_FILE"

    echo "  AI Worker started (PID: $AI_PID)"

elif command -v python >/dev/null 2>&1; then

    nohup python main.py \
        >> "$LOG_DIR/ai-worker.log" 2>&1 &

    AI_PID=$!

    echo "$AI_PID AI-Worker" >> "$PID_FILE"

    echo "  AI Worker started (PID: $AI_PID)"

else

    echo "ERROR: Python is not installed!"

fi


# --------------------------------------------------
# Done
# --------------------------------------------------

echo ""

echo "======================================"
echo " All services started"
echo "======================================"

echo ""
echo "Logs:"
echo "  Backend        -> $LOG_DIR/backend.log"
echo "  Code Runner    -> $LOG_DIR/codeRunner.log"
echo "  Problem Runner -> $LOG_DIR/problemRunner.log"
echo "  Problem Submit -> $LOG_DIR/problemSubmit.log"
echo "  Frontend       -> $LOG_DIR/frontend.log"
echo "  AI Worker      -> $LOG_DIR/ai-worker.log"

echo ""
echo "PID file:"
echo "  $PID_FILE"

echo ""
echo "To check processes:"
echo "  cat $PID_FILE"
echo ""
echo "To stop everything:"
echo "  ./stop.sh"

echo "======================================"