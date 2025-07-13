# Stage 1: Builder
FROM node:24-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
# Copy Prisma
COPY --from=builder /usr/src/app/prisma ./prisma
RUN npx prisma generate