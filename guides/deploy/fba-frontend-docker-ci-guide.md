# 🚀 Deploy Next.js App (`fba-frontend`) with Docker + GitHub Actions (Standalone Build)

This guide includes everything you need to:
- 🐳 Build and run your Next.js app using Docker (standalone mode)
- 🤖 Set up CI/CD with GitHub Actions
- 🔐 Inject `.env.production` securely using GitHub Secrets

---

## ✅ Directory Structure

```
/fba-frontend
├── .env.production         # Not committed, injected via GitHub secret
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
├── public/
├── pages/ or app/
├── .github/workflows/deploy.yml
```

---

## 📦 next.config.js

```js
// Enable standalone build output
module.exports = {
  output: "standalone",
};
```

---

## 🐳 Dockerfile

```Dockerfile
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
```

---

## 🧩 docker-compose.yml

```yaml
version: "3.9"
services:
  fba-frontend:
    build:
      context: .
      target: runner
    container_name: fba-frontend
    ports:
      - "3000:3000"
    restart: unless-stopped
    env_file:
      - .env
```

---

## 🔄 GitHub Actions: `.github/workflows/deploy.yml`

```yaml
name: Deploy fba-frontend to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_KEY }}

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies and build
        run: |
          npm ci
          npm run build
          cp -r .next/static .next/standalone/.next/
          cp -r public .next/standalone/

      - name: Create .env.production from GitHub secret
        run: |
          echo "${{ secrets.ENV_PRODUCTION }}" > .env.production

      - name: Package for deployment
        run: |
          mkdir deploy &&           cp -r .next/standalone/* deploy/ &&           cp -r .next/static deploy/.next/ &&           cp -r public deploy/ &&           cp Dockerfile docker-compose.yml package.json package-lock.json .env.production deploy/ &&           cd deploy && tar -czf ../fba-frontend.tar.gz .

      - name: Upload to VPS
        run: |
          scp -o StrictHostKeyChecking=no fba-frontend.tar.gz ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:/home/${{ secrets.VPS_USER }}/

      - name: Deploy on VPS
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << 'EOF'
            cd /home/${{ secrets.VPS_USER }}
            rm -rf fba-frontend && mkdir fba-frontend
            tar -xzf fba-frontend.tar.gz -C fba-frontend
            cd fba-frontend
            cp .env.production .env
            docker compose up --build -d
          EOF
```

---

## 🔐 Required GitHub Secrets

| Name             | Description                             |
|------------------|-----------------------------------------|
| `VPS_SSH_KEY`    | SSH private key for GitHub → VPS        |
| `VPS_USER`       | Username on VPS (`deploy` or `root`)    |
| `VPS_HOST`       | IP address of your VPS                  |
| `ENV_PRODUCTION` | Contents of your `.env.production` file |

---

## ✅ Summary

| Feature                  | Status  |
|--------------------------|---------|
| Standalone Docker build  | ✅ Yes  |
| GitHub Actions CI/CD     | ✅ Yes  |
| Secure env handling      | ✅ Yes  |
| Minimal image size       | ✅ Yes  |