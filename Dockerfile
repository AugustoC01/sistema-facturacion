FROM node:24-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -S app && adduser -S app -G app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/secrets \
    && chown -R app:app /app

# Para bajar privilegios
RUN apk add --no-cache su-exec

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "src/index.js"]
