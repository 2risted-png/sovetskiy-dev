const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const router = express.Router();

const CONTENT_FILE = path.join(__dirname, '..', 'data', 'content.json');

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
}
function writeContent(data) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
}

router.get('/', (req, res) => {
  try {
    res.json(readContent());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Не удалось прочитать контент' });
  }
});

router.put('/', auth, (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Неверный формат данных' });
    }
    writeContent(req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Не удалось сохранить' });
  }
});

module.exports = router;