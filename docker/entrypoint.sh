#!/bin/sh
set -e

SECRET_SRC="/run/secrets/firebase_service_account"
SECRET_DST="/app/secrets/serviceAccountKey.json"

echo "🔐 Preparando Firebase credentials"

if [ -f "$SECRET_SRC" ]; then
  cp "$SECRET_SRC" "$SECRET_DST"
  chown app:app "$SECRET_DST"
  chmod 600 "$SECRET_DST"
else
  echo "❌ Secret firebase_service_account no encontrado"
  exit 1
fi

# baja privilegios y arranca la app
exec su-exec app "$@"
