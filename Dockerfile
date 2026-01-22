FROM node:24-alpine

# 1️⃣ Seteamos working dir
WORKDIR /app

# 2️⃣ Copiamos solo manifests primero (cache friendly)
COPY package*.json ./

# 3️⃣ Instalamos solo dependencias necesarias usa package-lock.json
RUN npm ci --only=production

# 4️⃣ Copiamos el código
COPY . .

# 5️⃣ Exponemos el puerto lógico (Traefik lo usa como referencia)
EXPOSE 8080

# 6️⃣ Usuario no root (buena práctica)
USER node

# 7️⃣ Comando de arranque
CMD ["npm", "run", "start"]