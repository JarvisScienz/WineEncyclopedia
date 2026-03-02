#!/bin/bash

set -Eeuo pipefail
trap 'echo "ERROR at line $LINENO"; exit 1' ERR

# ==============================
# CONFIGURATION
# ==============================

BASE_PATH="${BASE_PATH:-/home/user/wine-encyclopedia}"
BACKEND_PATH="${BACKEND_PATH:-$BASE_PATH}"
FRONTEND_PATH="${FRONTEND_PATH:-$BASE_PATH/wine-encyclopedia-frontend}"

ENV_FILE_PATH="${ENV_FILE_PATH:-$BACKEND_PATH/.env}"
NETWORK="${NETWORK:-wine-encyclopedia-network}"

BACKEND_CONTAINER="${BACKEND_CONTAINER:-wine-encyclopedia-backend}"
FRONTEND_CONTAINER="${FRONTEND_CONTAINER:-wine-encyclopedia-frontend}"

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
# BACKEND
# ==============================

build_backend() {
  cd "$BACKEND_PATH"
  git pull
  VERSION=$(git rev-parse --short HEAD)

  echo "Building backend $VERSION"
  sudo podman build -t $BACKEND_IMAGE:$VERSION .
  sudo podman tag $BACKEND_IMAGE:$VERSION $BACKEND_IMAGE:latest

  echo "$VERSION" > /tmp/backend_version
}

deploy_backend() {
  VERSION=$(cat /tmp/backend_version)

  echo "Deploying backend $VERSION (zero downtime)"

  sudo podman run -d \
    --name ${BACKEND_CONTAINER}-new \
    --env-file $ENV_FILE_PATH \
    -p $BACKEND_PORT:$BACKEND_PORT \
    $BACKEND_IMAGE:$VERSION

  echo "Health check backend..."
  sleep 5

  echo "--- Container status ---"
  sudo podman ps -a --filter name=${BACKEND_CONTAINER}-new

  echo "--- Container logs ---"
  sudo podman logs ${BACKEND_CONTAINER}-new || true

  echo "--- Curl response ---"
  curl -v http://localhost:$BACKEND_PORT/health 2>&1 || true

  if curl -f http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
    echo "Backend health check passed"

    if sudo podman container exists $BACKEND_CONTAINER; then
      echo "Stopping existing backend container"
      sudo systemctl stop container-${BACKEND_CONTAINER}.service || true

      echo "Removing old backend container"
      sudo podman rm $BACKEND_CONTAINER || true
    else
      echo "No existing backend container found"
    fi

    sudo podman rename ${BACKEND_CONTAINER}-new $BACKEND_CONTAINER
    sudo systemctl restart container-${BACKEND_CONTAINER}.service

    echo "Backend updated to $VERSION"
  else
    echo "ERROR: Backend health check failed - rolling back"
    sudo podman rm -f ${BACKEND_CONTAINER}-new
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
  sudo podman build \
    --build-arg BACKEND_URL=$BACKEND_PUBLIC_URL \
    -t $FRONTEND_IMAGE:$VERSION .

  sudo podman tag $FRONTEND_IMAGE:$VERSION $FRONTEND_IMAGE:latest

  echo "$VERSION" > /tmp/frontend_version
}

deploy_frontend() {
  VERSION=$(cat /tmp/frontend_version)

  echo "Deploying frontend $VERSION (zero downtime)"

  sudo podman run -d \
    --name ${FRONTEND_CONTAINER}-new \
    --network $NETWORK \
    -p $FRONTEND_PORT:$FRONTEND_PORT \
    $FRONTEND_IMAGE:$VERSION

  echo "Health check frontend..."
  sleep 5

  if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
    echo "Frontend health check passed"

    if sudo podman container exists $FRONTEND_CONTAINER; then
      echo "Stopping existing frontend container"
      sudo systemctl stop container-${FRONTEND_CONTAINER}.service || true

      echo "Removing old frontend container"
      sudo podman rm $FRONTEND_CONTAINER || true
    else
      echo "No existing frontend container found"
    fi

    sudo podman rename ${FRONTEND_CONTAINER}-new $FRONTEND_CONTAINER
    sudo systemctl restart container-${FRONTEND_CONTAINER}.service

    echo "Frontend updated to $VERSION"
  else
    echo "ERROR: Frontend health check failed - rolling back"
    sudo podman rm -f ${FRONTEND_CONTAINER}-new
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
