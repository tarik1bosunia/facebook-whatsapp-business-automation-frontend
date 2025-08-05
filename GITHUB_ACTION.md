# GitHub Actions Deployment Guide for FBA Frontend

This guide explains how to set up and use the GitHub Actions workflow to deploy the FBA Frontend application directly to your Virtual Private Server (VPS) using Docker Compose. This strategy eliminates the need for a Docker Container Registry.

## 1. Workflow Overview

The GitHub Actions workflow will perform the following steps:

1. **Checkout Code**: Clones the latest code from your GitHub repository.
2. **Transfer to VPS**: Securely synchronizes the project files (excluding `.env`, `node_modules`, and `.next`) to a designated directory on your VPS using `rsync` over SSH.
3. **Deploy on VPS**: Connects to your VPS via SSH, stops any existing Docker Compose services, builds and runs the new containers using `docker compose up --build -d`, and cleans up unused Docker images.

## 2. Prerequisites

Before you can use this deployment workflow, ensure you have the following:

* **A Virtual Private Server (VPS)**:
  * **Docker and Docker Compose**: Must be installed on your VPS.
  * **SSH Access**: You need SSH access to your VPS.
* **GitHub Repository**: Your FBA Frontend project hosted on GitHub.
* **SSH Key Pair**: A private SSH key (preferably `ed25519`) for GitHub Actions to authenticate with your VPS, and the corresponding public key added to your VPS.
* **`.env` File**: Your production environment variables for the frontend application. This file is NOT transferred by the workflow and must be manually placed on the VPS.

## 3. GitHub Repository Setup

You need to add several secrets to your GitHub repository to allow the workflow to connect to your VPS.

1. **Generate an SSH Key Pair (if you don't have one for this purpose)**:
    On your local machine, open a terminal and run:

    ```bash
    ssh-keygen -t ed25519 -C "github-actions-deploy-key" -f ~/.ssh/github_actions_deploy_key
    ```

    * **Do NOT set a passphrase** for this key, as GitHub Actions cannot handle it.
    * This will create two files: `github_actions_deploy_key` (private key) and `github_actions_deploy_key.pub` (public key). Note: The workflow expects the private key to be named `id_ed25519` in the GitHub Actions runner's SSH directory.

2. **Add Public Key to your VPS**:
    Copy the content of `~/.ssh/github_actions_deploy_key.pub` to your VPS's `~/.ssh/authorized_keys` file for the user specified in `VPS_USER`.

    ```bash
    # On your local machine (replace with your actual public key path if different)
    cat ~/.ssh/github_actions_deploy_key.pub

    # On your VPS (replace 'your_user' with your actual VPS username)
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```

3. **Add GitHub Secrets**:
    In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` > `New repository secret`. Add the following secrets:

    * `VPS_HOST`: The IP address or hostname of your VPS.
    * `VPS_USER`: The username for SSH access on your VPS (e.g., `ubuntu`, `root`, `deploy`).
    * `VPS_SSH_KEY`: The **entire content** of your **private SSH key** (e.g., `~/.ssh/github_actions_deploy_key` or `~/.ssh/id_ed25519`), including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.

4. **Workflow Permissions**:
    Ensure your repository's "Workflow permissions" are set correctly. Go to `Settings` > `Actions` > `General` > `Workflow permissions` and select `Read and write permissions`.

## 4. VPS Setup

1. **Create Deployment Directory**:
    On your VPS, create the directory where the application code will reside. The workflow will deploy to `/var/www/fbafrontend`.

    ```bash
    sudo mkdir -p /var/www/fbafrontend
    sudo chown your_user:your_user /var/www/fbafrontend # Replace your_user with the VPS_USER
    ```

2. **Place `.env` File**:
    **Crucially**, you must manually place your production `.env` file in the `/var/www/fbafrontend/` directory on your VPS. The `rsync` command in the workflow explicitly excludes the `.env` file to prevent sensitive information from being overwritten or accidentally committed. This file will contain all necessary environment variables for your Next.js application and Docker Compose services.

    ```bash
    # Example: Copy from your local machine to VPS (if you haven't already)
    scp .env your_user@your_vps_host:/var/www/fbafrontend/.env
    ```

    Ensure this `.env` file contains variables like `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_WS_BACKEND_URL`, `GOOGLE_CLIENT_SECRET`, etc., as required by your `docker-compose.yml` and application.

## 5. `docker-compose.yml` Configuration

The `docker-compose.yml` file in your project's root directory will be transferred to the VPS. Ensure it is configured to read environment variables from the `.env` file. Docker Compose automatically looks for a `.env` file in the same directory as the `docker-compose.yml` file.

Example `docker-compose.yml` snippet for frontend service:

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      # These variables will be read from the .env file on the VPS
      - NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
      - NEXT_PUBLIC_WS_BACKEND_URL=${NEXT_PUBLIC_WS_BACKEND_URL}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      # Add any other environment variables your app needs
    restart: unless-stopped
```

## 6. Running the Deployment Workflow

The workflow will automatically run on every push to the `main` branch.

You can also trigger it manually:

1. Go to your GitHub repository.
2. Click on the `Actions` tab.
3. Select the `Deploy to VPS` workflow from the left sidebar.
4. Click the `Run workflow` dropdown on the right.
5. Click the `Run workflow` button.

## 7. Troubleshooting

* **SSH Connection Issues**: Double-check your `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY` secrets. Ensure the public key is correctly added to `~/.ssh/authorized_keys` on your VPS and that the private key format matches what GitHub Actions expects (e.g., `id_ed25519`).
* **`rsync` Permissions**: If `rsync` fails, ensure the `VPS_USER` has `sudo` privileges for `rsync` or direct write permissions to `/var/www/fbafrontend`.
* **`docker compose` Errors on VPS**: SSH into your VPS and manually run `cd /var/www/fbafrontend && sudo docker compose up --build -d` to debug any issues with your `docker-compose.yml` or `Dockerfile`.
* **`.env` File Not Found/Variables Not Loaded**: Ensure your `.env` file is correctly placed in `/var/www/fbafrontend/` on the VPS (it is NOT transferred by the workflow) and that its permissions allow the Docker Compose user to read it.
* **Permissions on VPS**: Ensure the `VPS_USER` has appropriate permissions to write to `/var/www/fbafrontend` and execute Docker commands.
