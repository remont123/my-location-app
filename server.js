// server.js — сервер, который показывает страницу и принимает координаты
// Запуск: node server.js  (после npm install express)

const express = require('express');
const app = express();

// Разрешаем серверу читать JSON из запросов
app.use(express.json());

// Разрешаем запросы с другой страницы (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Показываем страницу index.html при открытии http://localhost:3000
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Храним последнее полученное местоположение
let lastLocation = null;

// Принимает координаты (POST /location)
app.post('/location', (req, res) => {
  const { latitude, longitude, accuracy } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Нет координат' });
  }

  lastLocation = { latitude, longitude, accuracy };

  // Логируем в консоль сервера
  console.log('Получено местоположение:');
  console.log('  Широта:  ' + latitude);
  console.log('  Долгота: ' + longitude);
  if (accuracy) console.log('  Точность: ±' + accuracy + ' м');

  res.json({ ok: true });
});

// Показываем последнее местоположение на странице /view
app.get('/view', (req, res) => {
  if (!lastLocation) {
    return res.send('Пока нет данных. Открой http://localhost:3000 и нажми кнопку.');
  }
  res.send(
    'Последнее местоположение:<br>' +
    'Широта: ' + lastLocation.latitude + '<br>' +
    'Долгота: ' + lastLocation.longitude
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Сервер запущен: http://localhost:' + PORT);
});
