# Despliegue del frontend de ARTENIA

La web pública `artenialab.com` se sirve desde IONOS (`/home/www/htdocs`). Railway continúa activo durante esta transición, pero su estado no confirma que el dominio público se haya actualizado.

El workflow `Frontend production · IONOS` valida cada pull request contra `main`. Solo un push a `main`, o una ejecución manual sobre `main` con `deploy=true`, puede publicar. El flujo ejecuta `npm ci`, construye `dist/`, añade un marcador con el SHA, crea un backup remoto y sincroniza exclusivamente `dist/` sin `--delete`. Las exclusiones impiden publicar API, backend, auth, admin, PHP, bases de datos o secretos.

Configurar el environment protegido `production-ionos` con estos secrets:

- `IONOS_HOST`
- `IONOS_USER`
- `IONOS_PORT` (opcional; usa `22` por defecto)
- `IONOS_SSH_PRIVATE_KEY`
- `IONOS_KNOWN_HOSTS`

El job solo termina con éxito si el marcador coincide con el commit, las rutas públicas responden 200 sin `noindex`, los seis WebP existen con caché inmutable y el JavaScript y `TALLERES_300PLUS.json` responden comprimidos con las cabeceras esperadas. Si falla, consultar el backup indicado por el job antes de cualquier rollback manual.
