FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./backend
WORKDIR /app/backend
CMD ["node", "src/server.js"]
