#!/usr/bin/env bash
set -euo pipefail

PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-https://artenialab.com}"
EXPECTED_COMMIT="${EXPECTED_COMMIT:-}"
if [[ -z "${EXPECTED_COMMIT}" ]]; then
  echo "EXPECTED_COMMIT is required" >&2
  exit 2
fi

headers_for() {
  local url="$1"
  local encoding="${2:-identity}"
  curl -fsSL -H "Accept-Encoding: ${encoding}" -D - -o /dev/null "${url}" | tr -d '\r'
}

assert_public_route() {
  local route="$1"
  local headers
  headers="$(headers_for "${PUBLIC_ORIGIN}${route}")"
  printf '%s\n' "${headers}" | grep -Eq '^HTTP/[0-9.]+ 200 '
  if printf '%s\n' "${headers}" | grep -Eiq '^x-robots-tag:.*noindex'; then
    echo "Public route is noindexed: ${route}" >&2
    exit 3
  fi
}

for route in / /mapa /oficios /presentacion; do
  assert_public_route "${route}"
done

MARKER="$(curl -fsSL "${PUBLIC_ORIGIN}/deploy-version.json?commit=${EXPECTED_COMMIT}")"
printf '%s' "${MARKER}" | python3 -c 'import json,sys; expected=sys.argv[1]; actual=json.load(sys.stdin).get("commit"); raise SystemExit(0 if actual == expected else 1)' "${EXPECTED_COMMIT}"

for image in \
  presentacion_estrategica-1280.webp presentacion_estrategica-1920.webp \
  oficios_riesgo-1280.webp oficios_riesgo-1920.webp \
  impacto_economico-1280.webp impacto_economico-1920.webp; do
  IMAGE_HEADERS="$(headers_for "${PUBLIC_ORIGIN}/${image}")"
  printf '%s\n' "${IMAGE_HEADERS}" | grep -Eiq '^content-type: image/webp'
  printf '%s\n' "${IMAGE_HEADERS}" | grep -Eiq '^cache-control:.*max-age=31536000.*immutable'
done

DATA_HEADERS="$(headers_for "${PUBLIC_ORIGIN}/data/TALLERES_300PLUS.json" gzip)"
printf '%s\n' "${DATA_HEADERS}" | grep -Eiq '^content-encoding: gzip'
printf '%s\n' "${DATA_HEADERS}" | grep -Eiq '^cache-control:.*max-age=3600.*stale-while-revalidate=86400'
curl -fsSL --compressed "${PUBLIC_ORIGIN}/data/TALLERES_300PLUS.json" | python3 -c 'import json,sys; payload=json.load(sys.stdin); raise SystemExit(0 if isinstance(payload, list) and payload else 1)'

INDEX_HTML="$(curl -fsSL "${PUBLIC_ORIGIN}/")"
ASSET_PATH="$(printf '%s' "${INDEX_HTML}" | grep -Eo '/assets/index-[A-Za-z0-9_-]+\.js(\?v=[A-Za-z0-9._-]+)?' | head -n 1)"
if [[ -z "${ASSET_PATH}" ]]; then
  echo "Main JavaScript asset was not found in the public index" >&2
  exit 4
fi
ASSET_HEADERS="$(headers_for "${PUBLIC_ORIGIN}${ASSET_PATH}" gzip)"
printf '%s\n' "${ASSET_HEADERS}" | grep -Eiq '^content-encoding: gzip'
printf '%s\n' "${ASSET_HEADERS}" | grep -Eiq '^cache-control:.*max-age=31536000.*immutable'

echo "Production smoke tests passed for ${EXPECTED_COMMIT}"
