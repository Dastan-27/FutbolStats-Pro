# ✅ ERROR 3 Corregido: Usando node:24-slim
FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ✅ ERROR 4 Corregido: Expone el puerto 3000
EXPOSE 3000

CMD ["npm", "start"]