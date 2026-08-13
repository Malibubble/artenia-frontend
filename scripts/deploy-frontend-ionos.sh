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
OBSOLETE_FRONTEND_FILES=(
  "assets/index-Y5rcVJnd.js"
  "assets/index-DG1PJESt.js"
  "assets/index-BYpZwrWj.js"
  "assets/index-BLA6Q0v4.js"
  "assets/index-BzDuFwii.js"
  "assets/index-Bk3O1g6E.js"
  "assets/index-XZUT9Dt7.js"
  "assets/index-BINyAkHY.js"
  "assets/index-CS6lWza6.js"
  "assets/index-DGfrSBlf.js"
  "assets/index-jlywY9IH.css"
  "assets/index-LUidY5u8.css"
  "assets/index-CdMptbKE.css"
  "assets/index-2L7uZpIo.css"
  "assets/index-DjCaV47V.css"
  "assets/index-Pq4q7apM.css"
  "assets/index-CBvDcYkM.css"
  "assets/index-4shjpPA7.css"
  "assets/index-DLg7OXdQ.css"
  "assets/index-BbnxY0XX.css"
  "assets/ArteniaAtmosphere3D-LWgAyvQh.js"
  "assets/ArteniaAtmosphere3D-F6gORR-k.js"
  "assets/ArteniaAtmosphere3D-CroXeoXy.js"
  "assets/ArteniaAtmosphere3D-AtPMxUIP.js"
  "artenia-atmosphere.mp4"
  "artenia-atmosphere.webm"
  "2234584047_max.jpg"
  "fondo-hex-grid.png"
  "informe_visualizaciones.png"
  "informe_visualizaciones_271.png"
  "datos/ TALLERES_AMPLIADOS.json"
  "datos/ TALLERES_EXTENDED.json"
  "datos/ASOCIACIONES.json"
  "datos/OFICIOS_AMPLIADOS.json"
  "datos/OFICIOS_CV_completo.json"
  "datos/OFICIOS_MAPA.json"
  "datos/RED_OFICIOS.json"
  "datos/TALLERES_271.json"
  "datos/TALLERES_ENRIQUECIDOS.csv"
  "datos/TALLERES_ENRIQUECIDOS.json"
  "datos/artesanos_censo_import_CLEAN.csv"
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

printf -v CLEANUP_ARGS ' %q' "${REMOTE_ROOT}" "${BACKUP_PATH}" "${OBSOLETE_FRONTEND_FILES[@]}"
echo "Backing up and removing allowlisted obsolete frontend files"
ssh "${SSH_ARGS[@]}" "${IONOS_USER}@${IONOS_HOST}" "bash -s --${CLEANUP_ARGS}" <<'REMOTE_CLEANUP'
set -euo pipefail

remote_root="$1"
backup_root="$2/obsolete-frontend"
shift 2

if [[ "${remote_root}" != "/home/www/htdocs" ]]; then
  echo "Refusing obsolete-file cleanup outside the frontend document root" >&2
  exit 5
fi

for relative_path in "$@"; do
  if [[ -z "${relative_path}" || "${relative_path}" == /* || "${relative_path}" == *".."* ]]; then
    echo "Refusing unsafe obsolete-file path: ${relative_path}" >&2
    exit 6
  fi

  target_path="${remote_root}/${relative_path}"
  if [[ ! -e "${target_path}" && ! -L "${target_path}" ]]; then
    continue
  fi
  if [[ ! -f "${target_path}" && ! -L "${target_path}" ]]; then
    echo "Refusing to remove non-file obsolete path: ${relative_path}" >&2
    exit 7
  fi

  backup_path="${backup_root}/${relative_path}"
  mkdir -p -- "$(dirname -- "${backup_path}")"
  cp -p -- "${target_path}" "${backup_path}"
  rm -f -- "${target_path}"
done
REMOTE_CLEANUP
echo "Remote backup: ${BACKUP_PATH}"
