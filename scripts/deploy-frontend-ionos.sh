#!/usr/bin/env bash
set -euo pipefail

DEPLOY_SOURCE="${DEPLOY_SOURCE:-dist}"
IONOS_PORT="${IONOS_PORT:-22}"
REMOTE_ROOT="/home/www/htdocs"

for required in IONOS_HOST IONOS_USER IONOS_SSH_KEY_PATH IONOS_KNOWN_HOSTS_PATH; do
  if [[ -z "${!required:-}" ]]; then
    echo "Missing required deployment setting: ${required}" >&2
    exit 2
  fi
done
if [[ ! -s "${DEPLOY_SOURCE}/index.html" || ! -s "${DEPLOY_SOURCE}/.htaccess" || ! -s "${DEPLOY_SOURCE}/deploy-version.json" ]]; then
  echo "Refusing to deploy an incomplete dist artifact" >&2
  exit 3
fi

SSH_ARGS=(
  -i "${IONOS_SSH_KEY_PATH}"
  -p "${IONOS_PORT}"
  -o "UserKnownHostsFile=${IONOS_KNOWN_HOSTS_PATH}"
  -o StrictHostKeyChecking=yes
  -o BatchMode=yes
)
SSH_TRANSPORT="ssh -i ${IONOS_SSH_KEY_PATH} -p ${IONOS_PORT} -o UserKnownHostsFile=${IONOS_KNOWN_HOSTS_PATH} -o StrictHostKeyChecking=yes -o BatchMode=yes"
RSYNC_EXCLUDES=(
  --exclude "/api/***"
  --exclude "/admin/***"
  --exclude "/auth/***"
  --exclude "/backend/***"
  --exclude "/.env*"
  --exclude "*.php"
  --exclude "*.sqlite*"
  --exclude "*.db"
)

echo "Preflighting frontend-only rsync"
DEPLOY_PLAN="$(rsync -azn --itemize-changes "${RSYNC_EXCLUDES[@]}" -e "${SSH_TRANSPORT}" "${DEPLOY_SOURCE}/" "${IONOS_USER}@${IONOS_HOST}:${REMOTE_ROOT}/")"
if printf '%s\n' "${DEPLOY_PLAN}" | grep -Eiq '(^|/)(api|admin|auth|backend)(/|$)|(^|/)\.env|\.(php|sqlite|db)$'; then
  echo "Refusing deployment: protected path detected in rsync plan" >&2
  exit 4
fi
printf '%s\n' "${DEPLOY_PLAN}"

BACKUP_STAMP="$(date -u +%Y%m%d_%H%M%S)"
BACKUP_PATH="/home/www/artenia-deploy-backups/${BACKUP_STAMP}-${GITHUB_SHA:-manual}"
ssh "${SSH_ARGS[@]}" "${IONOS_USER}@${IONOS_HOST}" "mkdir -p '${BACKUP_PATH}'"

echo "Publishing dist without global deletion; replaced files go to ${BACKUP_PATH}"
rsync -az --itemize-changes --backup --backup-dir="${BACKUP_PATH}" "${RSYNC_EXCLUDES[@]}" -e "${SSH_TRANSPORT}" "${DEPLOY_SOURCE}/" "${IONOS_USER}@${IONOS_HOST}:${REMOTE_ROOT}/"
echo "Remote backup: ${BACKUP_PATH}"
