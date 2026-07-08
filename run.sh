#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
    echo
    echo "Stopping services..."
    jobs -p | xargs -r kill 2>/dev/null || true
}

trap cleanup EXIT INT TERM

start_whisper() {
    (
        cd "$ROOT/backend/src/ai"
        uvicorn whisper_server:app --host 0.0.0.0 --port 8000
    ) &
}

start_backend() {
    (
        cd "$ROOT/backend"
        npm run start
    ) &
}

start_frontend() {
    (
        cd "$ROOT/frontend"
        npm run dev -- --host 0.0.0.0 --port 5173
    ) &
}

show_help() {
    cat <<EOF
Usage:
  ./run.sh [services...]

Available services:
  whisper     Start Whisper server
  backend     Start Node backend
  frontend    Start React frontend
  all         Start all services

Examples:
  ./run.sh whisper
  ./run.sh backend
  ./run.sh frontend
  ./run.sh backend frontend
  ./run.sh all
EOF
}

if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

for service in "$@"; do
    case "$service" in
        whisper)
            echo "Starting Whisper..."
            start_whisper
            ;;
        backend)
            echo "Starting Backend..."
            start_backend
            ;;
        frontend)
            echo "Starting Frontend..."
            start_frontend
            ;;
        all)
            echo "Starting all services..."
            start_whisper
            start_backend
            start_frontend
            ;;
        -h|--help|help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown service: $service"
            echo
            show_help
            exit 1
            ;;
    esac
done

echo
echo "Services started."

if jobs -p >/dev/null; then
    echo "Whisper : http://localhost:8000"
    echo "Backend : http://localhost:5000"
    echo "Frontend: http://localhost:5173"
    echo
    wait
fi