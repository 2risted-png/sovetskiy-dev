require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // <-- ДОБАВИТЬ
const path = require('path');     // <-- ДОБАВИТЬ
const fs = require('fs');         // <-- ДОБАВИТЬ

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3001;

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

app.use('/uploads', express.static(uploadDir)); // Разрешаем доступ к папке с фото

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  res.json({ url: `/uploads/${req.file.filename}` });
});
// ----------------------------------

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

app.set('adminUsername', ADMIN_USERNAME);
app.set('adminPasswordHash', ADMIN_PASSWORD_HASH);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✓ Server: http://localhost:${PORT}`);
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
});