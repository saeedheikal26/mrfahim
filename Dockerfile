FROM node:22-alpine AS build
WORKDIR /app

RUN npm install --global npm@10.9.9
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
