import { useState, FormEvent } from 'react';

export default function OrderForm({ 
  initialService, 
  services = [], 
  onSuccess 
}: { 
  initialService: string; 
  services?: string[]; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    messengerType: 'Telegram',
    messengerValue: '',
    service: initialService,
    comment: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setTimeout(() => { onSuccess(); }, 3000);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ color: 'var(--color-accent)', marginBottom: '16px' }}>Заявка отправлена!</h2>
        <p>Я свяжусь с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2 style={{ marginBottom: '8px' }}>Онлайн-заказ</h2>
      <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Заполните форму, и я свяжусь с вами для обсуждения деталей.
      </p>

      <div className="form-group-modal">
        <label>Ваше имя *</label>
        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Иван" />
      </div>

      <div className="form-group-modal">
        <label>Телефон (необязательно)</label>
        <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+7 999 000-00-00" />
      </div>

      <div className="form-group-modal">
        <label>Мессенджер для связи *</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={formData.messengerType} 
            onChange={e => setFormData({...formData, messengerType: e.target.value})}
            style={{ width: '120px' }}
          >
            <option value="Telegram">Telegram</option>
            <option value="VK">ВКонтакте</option>
            <option value="MAX">MAX</option>
          </select>
          <input 
            required 
            value={formData.messengerValue} 
            onChange={e => setFormData({...formData, messengerValue: e.target.value})} 
            placeholder="@username" 
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div className="form-group-modal">
        <label>Услуга</label>
        <select 
          value={formData.service} 
          onChange={e => setFormData({...formData, service: e.target.value})}
        >
          {services.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-group-modal">
        <label>Краткое ТЗ (комментарий)</label>
        <textarea 
          value={formData.comment} 
          onChange={e => setFormData({...formData, comment: e.target.value})} 
          placeholder="Опишите вашу задачу..." 
          rows={3}
        />
      </div>

      {status === 'error' && <p style={{ color: '#f87171', marginBottom: '16px' }}>Ошибка отправки. Попробуйте позже.</p>}

      <button type="submit" className="liquid-btn primary" disabled={status === 'loading'} style={{ width: '100%', marginTop: '16px' }}>
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}