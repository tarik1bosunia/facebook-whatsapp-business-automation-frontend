# Push Docker Image to GitHub Container Registry (GHCR) using GitHub Actions

Follow these steps to build and push a Docker image to GHCR using GitHub Actions.

---

## 1. Set up Workflow Permissions
1. Go to your **GitHub repository**.
2. Navigate to **Settings > Actions > General**.
3. Under **Workflow permissions**, select **Read and write permissions**.  
   ✅ This allows the `GITHUB_TOKEN` to push images to GHCR.

---

## 2. Create a GitHub Actions Workflow File
Create a new file named `.github/workflows/build-and-push.yml` in your repository.

---

## 3. Define the Workflow

### **Trigger**
The workflow will run when you push to the `main` branch.

### **Jobs**
We will create a job to:
1. Checkout the repository code.
2. Authenticate to GHCR.
3. Build and push the Docker image.

---

### **Example Workflow File**
```yaml
name: Build and Push Docker Image to GHCR

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the code
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2: Log in to GitHub Container Registry
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Step 3: Build and push the Docker image
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```