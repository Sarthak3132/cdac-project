#!/bin/bash

PROJECT_DIR="$HOME/projects/cdac-project"
LOG_DIR="$PROJECT_DIR/log"
PID_FILE="$PROJECT_DIR/cdac-services.pid"

echo "======================================"
echo " Stopping CDAC Project"
echo "======================================"

if [ ! -f "$PID_FILE" ]; then
    echo "No PID file found."
    echo "Nothing to stop."
    exit 0
fi


# --------------------------------------------------
# Stop services gracefully
# --------------------------------------------------

while read -r PID SERVICE; do

    if [ -z "$PID" ]; then
        continue
    fi

    if kill -0 "$PID" 2>/dev/null; then

        echo "Stopping $SERVICE (PID: $PID)..."

        kill "$PID" 2>/dev/null

    else

        echo "$SERVICE (PID: $PID) is not running."

    fi

done < "$PID_FILE"


# --------------------------------------------------
# Give processes time to stop
# --------------------------------------------------

sleep 3


# --------------------------------------------------
# Force kill remaining processes
# --------------------------------------------------

while read -r PID SERVICE; do

    if [ -z "$PID" ]; then
        continue
    fi

    if kill -0 "$PID" 2>/dev/null; then

        echo "Force stopping $SERVICE (PID: $PID)..."

        kill -9 "$PID" 2>/dev/null

    fi

done < "$PID_FILE"


# --------------------------------------------------
# Remove PID file
# --------------------------------------------------

rm -f "$PID_FILE"


# --------------------------------------------------
# Clear logs
# --------------------------------------------------

echo ""
echo "Clearing logs..."

if [ -d "$LOG_DIR" ]; then

    : > "$LOG_DIR/backend.log"
    : > "$LOG_DIR/codeRunner.log"
    : > "$LOG_DIR/problemRunner.log"
    : > "$LOG_DIR/problemSubmit.log"
    : > "$LOG_DIR/frontend.log"
    : > "$LOG_DIR/ai-worker.log"

fi


echo ""
echo "======================================"
echo " All services stopped"
echo " Logs cleared"
echo "======================================"