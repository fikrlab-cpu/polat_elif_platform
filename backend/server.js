import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => console.error('Database error:', err));

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log('🤖 Telegram Bot started (polling mode)');

// ============================================
// TELEGRAM BOT COMMANDS
// ============================================

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  await bot.sendMessage(
    chatId,
    `Assalom, ${userName}! 🤍\n\nQo'sh kelibsiz Po'lat va Elif platformasiga.\n\n` +
    `Komanda'lar:\n` +
    `/post <matn> — @amanati'ga xabar\n` +
    `/mood <1-10> — Ko'ngil holati\n` +
    `/location — Joylashuv yuborish\n` +
    `/distance — Oramizda masofa\n` +
    `/help — To'liq qo'llanma`
  );
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `📖 Qo'llanma:\n\n` +
    `/start — Boshlash\n` +
    `/post <matn> — @amanati kanaliga xabar yuborish\n` +
    `/mood <1-10> — Bugun qanday? (1=juda yomon, 10=juda xurjili)\n` +
    `/location — Telegram'dan joylashuv yuborish\n` +
    `/distance — Oramizda qancha masofa?\n` +
    `/next — Navbatiy uchrashuvgacha necha kun\n` +
    `/memory — Bu sutkada 1 yil oldin nima qilgan?\n` +
    `/help — Shu qo'llanma`
  );
});

bot.onText(/\/post (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name;
  const text = match[1];

  try {
    // Save to database
    const result = await pool.query(
      `INSERT INTO messages (user_id, text, type, created_at, published_at)
       VALUES ($1, $2, 'text', NOW(), NOW())
       RETURNING id`,
      [userId, text]
    );

    const messageId = result.rows[0].id;

    // Send confirmation
    await bot.sendMessage(
      chatId,
      `✅ Xabar qabul qilindi!\n\nMatn: "${text}"\n\n[Kanalni tekshirish]`
    );

    console.log(`✅ Message #${messageId} saved from ${userName}`);
  } catch (err) {
    console.error('Error saving message:', err);
    await bot.sendMessage(chatId, '❌ Xatoli: xabar saqlanmadi');
  }
});

bot.onText(/\/mood (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const mood = parseInt(match[1]);

  if (mood < 1 || mood > 10) {
    await bot.sendMessage(chatId, '❌ Raqam 1-10 orasida bo\'lishi kerak');
    return;
  }

  const emojis = ['😢', '😟', '😐', '🙂', '😊', '😃', '😄', '😍', '🤩'];
  const emoji = emojis[mood - 1] || '😐';

  try {
    await pool.query(
      `INSERT INTO moods (user_id, mood, created_at)
       VALUES ($1, $2, NOW())`,
      [userId, mood]
    );

    await bot.sendMessage(
      chatId,
      `${emoji} Bugun ${mood}/10 — Qabul qilindi!\n\n[Timeline'da ko'rish]`
    );
  } catch (err) {
    console.error('Error saving mood:', err);
    await bot.sendMessage(chatId, '❌ Xatoli: mood saqlanmadi');
  }
});

bot.onText(/\/location/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    '📍 Joylashuv yuborish uchun:\n\n' +
    '1. Telegram"da 📎 (attach) tugmasini bosing\n' +
    '2. "Location" tanlang\n' +
    '3. Joylashuvingizni yuborish'
  );
});

bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const { latitude, longitude } = msg.location;

  try {
    await pool.query(
      `INSERT INTO locations (user_id, latitude, longitude, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
       latitude = EXCLUDED.latitude,
       longitude = EXCLUDED.longitude,
       created_at = NOW()`,
      [userId, latitude, longitude]
    );

    await bot.sendMessage(
      chatId,
      `📍 Joylashuv qabul qilindi!\n\n` +
      `Lat: ${latitude.toFixed(4)}\n` +
      `Lon: ${longitude.toFixed(4)}\n\n` +
      `/distance — Oramizda masofani ko'rish`
    );
  } catch (err) {
    console.error('Error saving location:', err);
    await bot.sendMessage(chatId, '❌ Xatoli: joylashuv saqlanmadi');
  }
});

bot.onText(/\/distance/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Get both users' locations
    const result = await pool.query(
      `SELECT u.id, u.user_type, l.latitude, l.longitude
       FROM locations l
       JOIN users u ON l.user_id = u.id
       ORDER BY l.created_at DESC LIMIT 2`
    );

    if (result.rows.length < 2) {
      await bot.sendMessage(chatId, '❌ Ikkala tomoniya ham joylashuv yuborishi kerak');
      return;
    }

    const [loc1, loc2] = result.rows;
    const distance = calculateDistance(
      loc1.latitude, loc1.longitude,
      loc2.latitude, loc2.longitude
    );

    await bot.sendMessage(
      chatId,
      `📍 Oramizda XOZIR:\n\n` +
      `🗺️ ${distance.toFixed(1)} KM\n\n` +
      `[Web'da xaritani ko'rish]`
    );
  } catch (err) {
    console.error('Error calculating distance:', err);
    await bot.sendMessage(chatId, '❌ Xatoli: masofani hisoblashda muammo');
  }
});

bot.onText(/\/next/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const result = await pool.query(
      `SELECT date FROM events
       WHERE type = 'meeting' AND date > NOW()
       ORDER BY date ASC LIMIT 1`
    );

    if (result.rows.length === 0) {
      await bot.sendMessage(chatId, '📅 Keyingi uchrashhuv noto\'riqlandi');
      return;
    }

    const nextDate = new Date(result.rows[0].date);
    const today = new Date();
    const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

    await bot.sendMessage(
      chatId,
      `⏰ Navbatiy uchrashuvgacha:\n\n` +
      `📍 Namangan\n` +
      `🗓️ ${nextDate.toLocaleDateString('uz-UZ')}\n` +
      `⏳ ${daysLeft} kun qoldi\n\n` +
      `[Tayyorlash ro\'yxati]`
    );
  } catch (err) {
    console.error('Error:', err);
    await bot.sendMessage(chatId, '❌ Xatoli');
  }
});

// ============================================
// REST API ENDPOINTS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Platform ishlayapti' });
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, text, created_at
       FROM messages
       ORDER BY created_at DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Post a message
app.post('/api/messages', async (req, res) => {
  const { user_id, text } = req.body;

  if (!user_id || !text) {
    return res.status(400).json({ error: 'user_id va text kerak' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (user_id, text, type, created_at, published_at)
       VALUES ($1, $2, 'text', NOW(), NOW())
       RETURNING *`,
      [user_id, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Message saqlanmadi' });
  }
});

// Get moods
app.get('/api/moods', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, mood, created_at
       FROM moods
       ORDER BY created_at DESC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// Get events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events ORDER BY date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// ============================================
// UTILITIES
// ============================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/messages`);
  console.log(`🤖 Bot: @PolatElifBot`);
  console.log(`\nTo stop: Press Ctrl+C\n`);
});

export default app;
