FROM node:18-alpine
WORKDIR /app

COPY server/package*.json ./server/
COPY shared/package*.json ./shared/
RUN npm install --prefix ./server

COPY server ./server
COPY shared ./shared

WORKDIR /app/server
EXPOSE 5000
CMD ["npm", "run", "dev"]
