#!/bin/sh
set -e

SECRET_SRC="/run/secrets/firebase_service_account"
SECRET_DST="/app/secrets/serviceAccountKey.json"

if [ -f "$SECRET_SRC" ]; then
  cp "$SECRET_SRC" "$SECRET_DST"
  chmod 400 "$SECRET_DST"
fi

exec "$@"
