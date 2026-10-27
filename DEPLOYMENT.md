# 🚀 Deployment Guide — Po'lat va Elif Platform

**Status**: Local development ready  
**Next Step**: PostgreSQL + Deploy to DigitalOcean

---

## 🔧 Local Setup (Mac)

### Prerequisites
```
- Node.js 18+
- PostgreSQL 14+
- Git
```

### Install Node.js (if needed)
```bash
# Using Homebrew
brew install node
brew install postgresql
```

### Setup Steps

#### 1. Clone & Install Backend
```bash
cd polat-elif-platform/backend
npm install
```

#### 2. Setup PostgreSQL Database
```bash
# Start PostgreSQL
brew services start postgresql

# Create database
createdb polat_elif_platform

# Import schema
psql -U postgres -d polat_elif_platform -f database.sql

# Verify
psql -U postgres -d polat_elif_platform -c "\dt"
```

#### 3. Configure .env
```bash
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polat_elif_platform
DB_USER=postgres
DB_PASSWORD=  (leave empty if no password)
PORT=5000
TELEGRAM_BOT_TOKEN=9054617774:AAFMUj9ujp_BYw76zX0olWZrkhRMl23KLxo
JWT_SECRET=your_random_secret_key_here
ADMIN_EMAIL=fikrlab.hojimurod@gmail.com
```

#### 4. Start Backend
```bash
cd backend
npm start

# Should see:
# 🚀 Server running on http://localhost:5000
# 🤖 Telegram Bot started (polling mode)
```

#### 5. Setup Frontend
```bash
cd frontend
npm install
npm start

# Opens: http://localhost:3000
```

---

## 🌐 Production Deployment (DigitalOcean)

### Option A: Simple (App Platform)

#### 1. Create DigitalOcean Account
- Sign up at https://digitalocean.com
- Create API token

#### 2. Prepare App
```bash
cd polat-elif-platform

# Create .do/app.yaml
mkdir -p .do
```

#### 3. Push to GitHub
```bash
# Create repo first (you'll do this)
git remote add origin https://github.com/fikrlab-cpu/polat-elif-platform.git
git branch -M main
git push -u origin main
```

#### 4. Deploy via App Platform
```
DigitalOcean Console:
→ Apps
→ Create App
→ Connect GitHub repo
→ Configure:
  - Backend: Node.js
  - Frontend: React
→ Deploy
```

---

### Option B: VPS (More Control)

#### 1. Create Droplet
```
Droplet specs:
- Ubuntu 22.04
- $5-10/month
- Region: Europe (closest to Uzbekistan)
```

#### 2. SSH Access
```bash
# On Mac
ssh root@YOUR_DROPLET_IP

# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone repo
git clone https://github.com/fikrlab-cpu/polat-elif-platform.git
cd polat-elif-platform
```

#### 3. Setup Database
```bash
sudo -u postgres psql

postgres=# CREATE DATABASE polat_elif_platform;
postgres=# \q

psql -U postgres -d polat_elif_platform -f backend/database.sql
```

#### 4. Install & Run
```bash
# Backend
cd backend
npm install
npm start &

# Frontend
cd ../frontend
npm install
npm run build
# Serve with Nginx
```

#### 5. Setup Nginx (Reverse Proxy)
```bash
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/polat-elif

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
    }

    location / {
        root /home/username/polat-elif-platform/frontend/build;
        try_files $uri /index.html;
    }
}

# Enable
sudo ln -s /etc/nginx/sites-available/polat-elif /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Database Backup

### Local Backup
```bash
# Backup
pg_dump polat_elif_platform > backup.sql

# Restore
psql polat_elif_platform < backup.sql
```

### Scheduled Backups
```bash
# Add to crontab
0 2 * * * pg_dump polat_elif_platform > ~/backups/backup_$(date +\%Y\%m\%d).sql
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Change database password
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Setup firewall (allow 22, 80, 443 only)
- [ ] Keep dependencies updated
- [ ] Regular backups
- [ ] Monitor logs

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit
```

---

## 📱 Domain Setup

### Get Domain
- GoDaddy, Namecheap, or Reg.ru

### Point to Server
```
DNS Records:
A    record → YOUR_SERVER_IP
www  CNAME  → your-domain.com
```

### SSL Certificate (Free)
```bash
# Using Certbot
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
sudo certbot renew --dry-run
```

---

## 📊 Monitoring

### Logs
```bash
# Backend logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Health Check
```bash
# Bot status
curl http://localhost:5000/health

# API
curl http://localhost:5000/api/messages
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## 💡 Quick Troubleshooting

### Bot not responding
```bash
# Check if running
ps aux | grep node

# Restart
npm start
```

### Database connection error
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Verify connection
psql -U postgres -d polat_elif_platform -c "SELECT 1"
```

### Frontend not loading
```bash
# Build again
cd frontend
rm -rf build node_modules
npm install
npm run build
```

---

## 📞 Support Commands

```bash
# View all processes
pm2 list

# Stop all
pm2 stop all

# Restart
pm2 restart all

# View logs
pm2 logs

# Setup startup
pm2 startup
pm2 save
```

---

**Next Steps:**
1. ✅ Backend + Frontend ready
2. 🔄 Setup PostgreSQL locally
3. 🚀 Test locally
4. 📦 Push to GitHub
5. 🌐 Deploy to DigitalOcean ($5-10/month)
6. 🎉 Go live!

---

**Estimated Time**: 1-2 hours for full local setup + deployment
