// server.js — сервер с картой и уведомлениями в Telegram
// Запуск: node server.js

const express = require('express');
const app = express();

// ===== НАСТРОЙКА TELEGRAM =====
// Вставь сюда свой токен бота и свой chat_id (как получить — в инструкции)
const TELEGRAM_TOKEN = '8622984485:AAENKoiM15I3He3M4nHoUPRnVRHqzVk_WAg';
const TELEGRAM_CHAT_ID = '627584323';

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Главная страница — форма для отправки местоположения
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Страница с картой
app.get('/view', (req, res) => {
  res.sendFile(__dirname + '/view.html');
});

// Храним последнее местоположение
let lastLocation = null;

// Отдаём последнее местоположение (JSON)
app.get('/location', (req, res) => {
  if (!lastLocation) {
    return res.json({ error: 'Пока нет данных' });
  }
  res.json(lastLocation);
});

// Принимает координаты (POST /location)
app.post('/location', async (req, res) => {
  const { latitude, longitude, accuracy } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Нет координат' });
  }

  lastLocation = { latitude, longitude, accuracy };
  console.log('Получено местоположение: ' + latitude + ', ' + longitude);

  // Отправляем уведомление в Telegram
  if (TELEGRAM_TOKEN !== 'ВСТАВЬ_ТОКЕН_БОТА' && TELEGRAM_CHAT_ID !== 'ВСТАВЬ_СВОЙ_CHAT_ID') {
    try {
      const text = '📍 Новое местоположение:\n' +
        'Широта: ' + latitude + '\n' +
        'Долгота: ' + longitude +
        (accuracy ? '\nТочность: ±' + accuracy + ' м' : '') +
        '\nКарта: https://www.google.com/maps?q=' + latitude + ',' + longitude;

      await fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text
        })
      });
      console.log('Уведомление отправлено в Telegram');
    } catch (e) {
      console.log('Не удалось отправить в Telegram: ' + e.message);
    }
  } else {
    console.log('Telegram не настроен (вставь токен и chat_id)');
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Сервер запущен: http://localhost:' + PORT);
});
