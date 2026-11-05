const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const adminUsername = req.app.get('adminUsername');
  const adminPasswordHash = req.app.get('adminPasswordHash');

  if (
    username !== adminUsername ||
    !bcrypt.compareSync(String(password || ''), adminPasswordHash)
  ) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '24h' }
  );
  res.json({ token });
});

module.exports = router;