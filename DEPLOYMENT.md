# ManaCity VPS Deployment Guide

**Server IP**: `147.93.107.21`  
**Server User**: `root`  
**Official App Path**: `/var/www/manacity`

---

## ⚡ Quick 1-Liner Update Command

Run this command inside `root@147.93.107.21`:

```bash
cd /var/www/manacity && git pull origin main && cd backend && npm install && pm2 restart all && cd ../web && npm install && npm run build && systemctl reload nginx
```

---

## 🛠️ Detailed Step-by-Step Commands

```bash
# 1. Go to project folder
cd /var/www/manacity

# 2. Pull latest code from GitHub
git pull origin main

# 3. Update backend & restart PM2
cd /var/www/manacity/backend
npm install
pm2 restart all
pm2 status

# 4. Build web frontend
cd /var/www/manacity/web
npm install
npm run build

# 5. Reload Nginx
systemctl reload nginx
```
