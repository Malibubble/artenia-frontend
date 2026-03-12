#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURACIÓN BÁSICA ===
# Directorio del proyecto (la carpeta donde está este script)
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔹 Proyecto: $PROJECT_DIR"

cd "$PROJECT_DIR"

echo "1) Borrando carpeta dist anterior..."
rm -rf dist

echo "2) Comprobando dependencias..."
if [ ! -d "node_modules" ]; then
  echo "   node_modules no existe. Instalando dependencias..."
  npm install
else
  echo "   node_modules ya existe. Saltando npm install."
fi

echo "3) Construyendo proyecto (npm run build)..."
npm run build

echo "4) Build completado."
echo "--------------------------------------------"
echo "Ahora tienes un dist/ LIMPIO con solo archivos públicos."
echo "Sube SOLO el CONTENIDO de dist/ a /public en tu servidor."
echo ""
echo "Checklist rápido antes de subir:"
echo "  - NO subas: .env, src/, node_modules/, supabase/, .git, .vscode, package.json, etc."
echo "  - SÍ subes: dist/index.html, dist/assets/, imágenes, CSS, JS y vídeos públicos."
echo "--------------------------------------------"
