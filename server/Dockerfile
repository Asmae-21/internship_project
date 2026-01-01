FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ .

EXPOSE 5000

CMD ["npm", "start"]
