# ---- Builder ----
FROM node:22-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only standalone output + static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]