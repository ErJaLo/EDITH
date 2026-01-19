FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "dist/server.js"]