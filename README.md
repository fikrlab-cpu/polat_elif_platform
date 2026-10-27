# 🤍 Po'lat va Elif — Munosabat Platforma

Sevgi, xotira, va birgalikda bo'lish uchun **to'la raqamli ekotizim**.

---

## 📂 Loyiha Tuzilishi

```
polat-elif-platform/
├── backend/                    Node.js server
│   ├── server.js              Express + Telegram Bot
│   ├── database.sql           PostgreSQL schema
│   ├── package.json           Dependencies
│   └── .env                   Configuration (create this)
├── frontend/                   React app (qo'shiladi)
├── docs/                       Documentation
└── README.md                   (bu fayl)
```

---

## 🚀 Boshlash

### 1. Backend Setup

```bash
cd backend

# Dependencies o'rnatish
npm install

# Database setup (PostgreSQL kerak)
psql -U postgres -c "CREATE DATABASE polat_elif_platform;"
psql -U postgres -d polat_elif_platform -f database.sql

# Server boshlash
npm start
# yoki dev mode:
npm run dev
```

Server: `http://localhost:5000`

### 2. Telegram Bot

Bot token already configured:
```
TELEGRAM_BOT_TOKEN=9054617774:AAFMUj9ujp_BYw76zX0olWZrkhRMl23KLxo
```

Commands:
- `/start` — Boshlash
- `/post <matn>` — Xabar yuborish
- `/mood <1-10>` — Ko'ngil holati
- `/location` — Joylashuv
- `/distance` — Oramizda masofa
- `/help` — Qo'llanma

### 3. Frontend (Kelajakda)

```bash
cd frontend
npm install
npm start
```

---

## 📊 Database

PostgreSQL connection string (`.env` file):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polat_elif_platform
DB_USER=postgres
DB_PASSWORD=your_password
```

Tables:
- `users` — Po'lat va Elif
- `messages` — Xabarlar
- `moods` — Ko'ngil holati
- `locations` — Joylashuv
- `events` — Muhim sanalar
- `quotes` — She'rlar va fikrlar
- `media` — Suratlar va audiolar

---

## 🎯 API Endpoints

### Messages
- `GET /api/messages` — Barcha xabarlar
- `POST /api/messages` — Yangi xabar

### Moods
- `GET /api/moods` — Barcha ko'ngil holatlari

### Events
- `GET /api/events` — Barcha hodisalar

### Health
- `GET /health` — Server status

---

## 🤖 Telegram Bot Features (MVP)

✅ `/start` — Authentication
✅ `/post` — Message posting
✅ `/mood` — Mood tracking
✅ `/location` — Location sharing
✅ `/distance` — Distance calculation
✅ `/help` — Help menu

Coming soon:
- `/next` — Countdown
- `/memory` — On this day
- `/album` — Photo gallery
- `/draft` — Letter writing

---

## 📚 Documentation

Full specifications:
- [tz.md](../Po'lat%20va%20Elif%20—%20Munosabat%20Platforma/tz.md) — Technical spec
- [wireframes.md](../Po'lat%20va%20Elif%20—%20Munosabat%20Platforma/wireframes.md) — UI mockups
- [telegram-bot-strategy.md](../Po'lat%20va%20Elif%20—%20Munosabat%20Platforma/telegram-bot-strategy.md) — Bot strategy

---

## 🔐 Security

- `.env` file — NEVER commit
- Telegram token — in `.env`
- Database credentials — in `.env`
- JWT for authentication (kelajakda)

---

## 👤 Author

**fikrlab** (Hojimurod Abdurahmonov)  
Email: fikrlab.hojimurod@gmail.com

---

## 📞 Bot Info

- **Bot Name**: @PolatElifBot
- **Token**: `9054617774:AAFMUj9ujp_BYw76zX0olWZrkhRMl23KLxo`
- **Status**: 🟢 Active (polling mode)

---

## 🎯 Phase 1 (MVP) — Status

- [x] Backend structure
- [x] Telegram bot basic commands
- [x] Database schema
- [x] Location sharing + distance
- [ ] Frontend (React)
- [ ] Deployment (DigitalOcean)
- [ ] PostgreSQL setup (local)

---

**Created**: Oct 27, 2026  
**Status**: 🔨 In Development  
**Next**: Frontend + Deployment
