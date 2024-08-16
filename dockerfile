# Dockerfile
FROM node:16
WORKDIR C:\Users\gmtn9\OneDrive/ドキュメント/GitHub/DisGassen
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
COPY . .
CMD ["node", "index.js"]