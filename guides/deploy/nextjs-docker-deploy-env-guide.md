# 🚀 Production-Ready Next.js Deployment with Docker, GitHub Actions & Environment Management

This guide walks you through deploying a **Next.js SSR app** using:

- 🐳 Docker + Docker Compose
- 🔁 GitHub Actions CI/CD
- 🔐 SSH into your VPS
- ⚙️ Standalone build output
- 🌐 Optional Nginx reverse proxy
- 🧪 Environment separation with `.env.local` and `.env.production`

---

## ✅ 1. Environment File Structure

```
/
├── .env.local            # Local development only (ignored by git)
├── .env.production       # Production deployment
├── Dockerfile
├── docker-compose.yml
```

- ✅ Add `.env.production` to your repo
- 🚫 Do NOT push `.env.local` (add to `.gitignore`)

---

## ✅ 2. Dockerfile (Multi-stage, no PM2, uses standalone)

```dockerfile
# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

COPY package*.json yarn.lock* ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Run Stage ----
FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/package.json ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ✅ 3. docker-compose.yml

```yaml
version: "3.9"
services:
  nextjs:
    container_name: nextjs_frontend
    build:
      context: .
      target: runner
    ports:
      - "3000:3000"
    restart: unless-stopped
    env_file:
      - .env
```

✅ In production, `.env` will be copied from `.env.production`.

---

## ✅ 4. GitHub Actions Workflow `.github/workflows/deploy.yml`

```yaml
name: Deploy Next.js to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_KEY }}

      - name: Build and package
        run: |
          npm ci
          npm run build
          tar -czf nextjs.tar.gz .next public package.json package-lock.json docker-compose.yml Dockerfile .env.production

      - name: Upload to VPS
        run: |
          scp nextjs.tar.gz ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:/home/${{ secrets.VPS_USER }}/

      - name: Deploy on VPS
        run: |
          ssh ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << 'EOF'
            cd /home/${{ secrets.VPS_USER }}
            rm -rf nextjs && mkdir nextjs
            tar -xzf nextjs.tar.gz -C nextjs
            cd nextjs
            cp .env.production .env
            docker compose up --build -d
          EOF
```

---

## ✅ 5. next.config.js

```js
module.exports = {
  output: "standalone",
};
```

---

## ✅ 6. Optional: Nginx Reverse Proxy with SSL

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload Nginx and issue SSL:

```bash
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🏁 Done! You Now Have:

| ✅ Feature                     | Value                     |
|-------------------------------|---------------------------|
| GitHub CI/CD                  | Yes                       |
| Dockerized SSR Build          | Yes (standalone)          |
| PM2-free Runtime              | Yes (Docker manages it)   |
| Environment-separated         | Yes (`.env.production`)   |
| Nginx Reverse Proxy Ready     | Optional, Recommended     |
| Smaller Image Size            | Yes (multi-stage build)   |
| Fast + Secure + Scalable      | Absolutely 🔥             |