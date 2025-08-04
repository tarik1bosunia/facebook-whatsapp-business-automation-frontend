# Ensure Remote Directory Exists
## SSH into your VPS and create the target directory if it doesn’t exist:

```bash
ssh youruser@your-vps-ip
sudo mkdir -p /var/www/fbafrontend
sudo chown youruser:youruser /var/www/fbafrontend
```

## nano .env then copy the .env file for production and paste there 