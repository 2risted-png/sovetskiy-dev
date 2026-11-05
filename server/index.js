require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const leadRoutes = require('./routes/leads');

const app = express();

// --- НАСТРОЙКА ЗАГРУЗКИ ФАЙЛОВ ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// --- НАСТРОЙКИ АДМИНА ---
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

app.set('adminUsername', ADMIN_USERNAME);
app.set('adminPasswordHash', ADMIN_PASSWORD_HASH);

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- МАРШРУТЫ API ---
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- РАЗДАЧА ФРОНТЕНДА (REACT) ---
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
});

// fixed port