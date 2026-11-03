#!/bin/bash

set -Eeuo pipefail
trap 'echo "ERROR at line $LINENO"; exit 1' ERR

# ==============================
# CONFIGURATION
# ==============================

BASE_PATH="${BASE_PATH:-/home/rocky/WineEncyclopedia}"
BACKEND_PATH="${BACKEND_PATH:-$BASE_PATH}"
FRONTEND_PATH="${FRONTEND_PATH:-$BASE_PATH/wine-encyclopedia-frontend}"

# Quadlet services (/etc/containers/systemd/<name>.container -> <name>.service)
BACKEND_SERVICE="${BACKEND_SERVICE:-wine-encyclopedia-backend.service}"
FRONTEND_SERVICE="${FRONTEND_SERVICE:-wine-encyclopedia-frontend.service}"

BACKEND_PORT="${BACKEND_PORT:-6000}"
FRONTEND_PORT="${FRONTEND_PORT:-6001}"

BACKEND_IMAGE="${BACKEND_IMAGE:-wine-encyclopedia-node}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-wine-encyclopedia-frontend}"

# URL used by Angular at build time to reach the backend
BACKEND_PUBLIC_URL="${BACKEND_PUBLIC_URL:-https://example.com}"

LOG_FILE="${LOG_FILE:-$BASE_PATH/logs/deploy.log}"
mkdir -p "$(dirname "$LOG_FILE")"
exec > >(tee -a "$LOG_FILE") 2>&1

echo ""
echo "======================================"
echo "   WINE ENCYCLOPEDIA DEPLOY $(date)"
echo "======================================"

# ==============================
# HELPERS
# ==============================

# wait_for_url <url> [timeout_seconds]
wait_for_url() {
  local url="$1" timeout="${2:-30}" i
  for ((i = 0; i < timeout; i++)); do
    if curl -fs "$url" > /dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# rollback <image> <service> <prev_image_file>
# Re-tags the previous :latest image and restarts the service.
rollback() {
  local image="$1" service="$2" prev_file="$3" prev
  prev=$(cat "$prev_file" 2>/dev/null || true)
  if [ -n "$prev" ]; then
    echo "Rolling back $service to previous image $prev"
    sudo podman tag "$prev" "$image:latest"
    sudo systemctl restart "$service" || true
  else
    echo "No previous image available, rollback skipped"
  fi
}

# ==============================
# BACKEND
# ==============================

build_backend() {
  cd "$BACKEND_PATH"
  git pull
  VERSION=$(git rev-parse --short HEAD)

  echo "Building backend $VERSION"
  sudo podman image inspect --format '{{.Id}}' $BACKEND_IMAGE:latest > /tmp/backend_prev_image 2>/dev/null || : > /tmp/backend_prev_image
  sudo podman build -t $BACKEND_IMAGE:$VERSION .
  sudo podman tag $BACKEND_IMAGE:$VERSION $BACKEND_IMAGE:latest

  echo "$VERSION" > /tmp/backend_version
}

deploy_backend() {
  VERSION=$(cat /tmp/backend_version)

  echo "Deploying backend $VERSION"

  # The Quadlet unit uses the :latest tag (already updated by build_backend):
  # systemd recreates the container from the new image on restart.
  sudo systemctl daemon-reload
  sudo systemctl restart "$BACKEND_SERVICE"

  echo "Health check backend..."
  if wait_for_url "http://localhost:$BACKEND_PORT/health" 30; then
    echo "Backend health check passed"
    echo "Backend updated to $VERSION"
  else
    echo "ERROR: Backend health check failed - rolling back"
    sudo systemctl status "$BACKEND_SERVICE" --no-pager || true
    sudo journalctl -u "$BACKEND_SERVICE" -n 50 --no-pager || true
    rollback "$BACKEND_IMAGE" "$BACKEND_SERVICE" /tmp/backend_prev_image
    exit 1
  fi
}

# ==============================
# FRONTEND
# ==============================

build_frontend() {
  cd "$FRONTEND_PATH"
  git pull
  VERSION=$(git rev-parse --short HEAD)

  echo "Building frontend $VERSION"
  sudo podman image inspect --format '{{.Id}}' $FRONTEND_IMAGE:latest > /tmp/frontend_prev_image 2>/dev/null || : > /tmp/frontend_prev_image
  sudo podman build \
    --build-arg BACKEND_URL=$BACKEND_PUBLIC_URL \
    -t $FRONTEND_IMAGE:$VERSION .

  sudo podman tag $FRONTEND_IMAGE:$VERSION $FRONTEND_IMAGE:latest

  echo "$VERSION" > /tmp/frontend_version
}

deploy_frontend() {
  VERSION=$(cat /tmp/frontend_version)

  echo "Deploying frontend $VERSION"

  # The Quadlet unit uses the :latest tag (already updated by build_frontend):
  # systemd recreates the container from the new image on restart.
  sudo systemctl daemon-reload
  sudo systemctl restart "$FRONTEND_SERVICE"

  echo "Health check frontend..."
  if wait_for_url "http://localhost:$FRONTEND_PORT" 30; then
    echo "Frontend health check passed"
    echo "Frontend updated to $VERSION"
  else
    echo "ERROR: Frontend health check failed - rolling back"
    sudo systemctl status "$FRONTEND_SERVICE" --no-pager || true
    sudo journalctl -u "$FRONTEND_SERVICE" -n 50 --no-pager || true
    rollback "$FRONTEND_IMAGE" "$FRONTEND_SERVICE" /tmp/frontend_prev_image
    exit 1
  fi
}

# ==============================
# ROUTING
# ==============================

case "${1:-}" in
  backend)
    build_backend
    deploy_backend
    ;;
  frontend)
    build_frontend
    deploy_frontend
    ;;
  all)
    build_backend
    deploy_backend
    build_frontend
    deploy_frontend
    ;;
  *)
    echo "Usage: ./deploy.sh {backend|frontend|all}"
    exit 1
    ;;
esac

echo ""
echo "======================================"
echo " DEPLOY COMPLETED"
echo "======================================"
