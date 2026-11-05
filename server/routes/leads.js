const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const LEADS_FILE = path.join(__dirname, '..', 'data', 'leads.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'content.json');

router.post('/', async (req, res) => {
  try {
    const { name, phone, messengerType, messengerValue, service, comment } = req.body;
    
    if (!name || !messengerValue) {
      return res.status(400).json({ error: 'Имя и контакт мессенджера обязательны' });
    }

    const newLead = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name,
      phone: phone || 'Не указан',
      contact: `${messengerType}: ${messengerValue}`,
      service,
      comment
    };

    // 1. Сохраняем в файл
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // 2. Отправляем уведомление в ВК (если настроено)
    try {
      if (fs.existsSync(CONTENT_FILE)) {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        const vk = content.vkSettings;

        if (vk && vk.enabled && vk.token && vk.userId) {
          const messageText = `🔥 НОВАЯ ЗАЯВКА!\n\n👤 Имя: ${name}\n📞 Тел: ${phone || 'Не указан'}\n💬 Связь: ${messengerType} (${messengerValue})\n📦 Услуга: ${service}\n📝 ТЗ: ${comment || 'Без комментария'}`;
          
          // Отправляем запрос к API ВКонтакте
          await fetch('https://api.vk.com/method/messages.send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              user_id: vk.userId,
              message: messageText,
              random_id: Date.now(),
              access_token: vk.token,
              v: '5.131'
            })
          });
        }
      }
    } catch (vkError) {
      console.error('Ошибка отправки в ВК:', vkError);
      // Мы не прерываем работу, даже если ВК упал. Заявка уже сохранена.
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка при сохранении заявки' });
  }
});

module.exports = router;