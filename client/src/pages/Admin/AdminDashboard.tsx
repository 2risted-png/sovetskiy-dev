import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(() => setStatus('Ошибка загрузки данных'));
  }, [token, navigate]);

  const handleSave = async () => {
    setStatus('Сохранение...');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        return;
      }
      
      setStatus('✓ Успешно сохранено');
      setTimeout(() => setStatus(''), 3000);
    } catch {
      setStatus('Ошибка сохранения');
    }
  };

  const handleArrayChange = (section: string, index: number, field: string, value: string) => {
    const newContent = { ...content };
    newContent[section][index][field] = value;
    setContent(newContent);
  };

  const addArrayItem = (section: string, template: any) => {
    const newContent = { ...content };
    if (!newContent[section]) newContent[section] = [];
    newContent[section] = [...newContent[section], { ...template, id: Date.now().toString() }];
    setContent(newContent);
  };

  const removeArrayItem = (section: string, index: number) => {
    const newContent = { ...content };
    newContent[section] = newContent[section].filter((_: any, i: number) => i !== index);
    setContent(newContent);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, index: number, field: string, isArray = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.url) {
        const newContent = { ...content };
        if (isArray) {
          if (!newContent[section][index][field]) newContent[section][index][field] = [];
          newContent[section][index][field].push(data.url);
        } else {
          newContent[section][index][field] = data.url;
        }
        setContent(newContent);
      }
    } catch {
      alert('Ошибка загрузки файла');
    }
  };

  if (!content) return <div className="admin-loading">Загрузка...</div>;

  // Исправленный список вкладок (без дубликатов)
  const tabs = [
    { id: 'hero', label: 'Главный экран' },
    { id: 'services', label: 'Услуги' },
    { id: 'portfolio', label: 'Портфолио' },
    { id: 'promotions', label: 'Акции' },
    { id: 'testimonials', label: 'Отзывы' },
    { id: 'guarantees', label: 'Гарантии' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'legal', label: 'Юр. документы' },
    { id: 'notifications', label: 'Уведомления' },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h3>SOVETSKIY DEV</h3>
        <nav>
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={activeTab === tab.id ? 'active' : ''} 
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>
          Выйти
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h2>Редактирование</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {status && <span className="admin-status">{status}</span>}
            <button className="liquid-btn primary" onClick={handleSave}>Сохранить</button>
          </div>
        </div>

        <div className="admin-form">
          {/* HERO */}
          {activeTab === 'hero' && (
            <div className="form-group">
              <label>Заголовок<input value={content.hero.title} onChange={e => setContent({...content, hero: {...content.hero, title: e.target.value}})} /></label>
              <label>Подзаголовок<input value={content.hero.subtitle} onChange={e => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})} /></label>
              <label>Описание<textarea value={content.hero.description} onChange={e => setContent({...content, hero: {...content.hero, description: e.target.value}})} /></label>
              <label>Текст кнопки 1<input value={content.hero.ctaPrimaryText} onChange={e => setContent({...content, hero: {...content.hero, ctaPrimaryText: e.target.value}})} /></label>
              <label>Ссылка кнопки 1 (Telegram)<input value={content.hero.ctaPrimaryLink} onChange={e => setContent({...content, hero: {...content.hero, ctaPrimaryLink: e.target.value}})} /></label>
            </div>
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <div>
              {content.services?.map((s: any, i: number) => (
                <div key={s.id || i} className="admin-card-edit">
                  <input value={s.title} onChange={e => handleArrayChange('services', i, 'title', e.target.value)} placeholder="Название" />
                  <input value={s.price} onChange={e => handleArrayChange('services', i, 'price', e.target.value)} placeholder="Цена" />
                  <textarea value={s.description} onChange={e => handleArrayChange('services', i, 'description', e.target.value)} placeholder="Описание" />
                  <button className="btn-remove" onClick={() => removeArrayItem('services', i)}>Удалить</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addArrayItem('services', { title: 'Новая услуга', description: '', price: '' })}>+ Добавить услугу</button>
            </div>
          )}

          {/* PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div>
              {content.portfolio?.map((p: any, i: number) => (
                <div key={p.id || i} className="admin-card-edit" style={{ border: '1px solid rgba(125, 211, 252, 0.3)' }}>
                  <input value={p.title} onChange={e => handleArrayChange('portfolio', i, 'title', e.target.value)} placeholder="Название проекта" />
                  <input value={p.category} onChange={e => handleArrayChange('portfolio', i, 'category', e.target.value)} placeholder="Категория (Лендинг, Сайт)" />
                  <input value={p.price || ''} onChange={e => handleArrayChange('portfolio', i, 'price', e.target.value)} placeholder="Стоимость (от 50 000 ₽)" />
                  <textarea value={p.description} onChange={e => handleArrayChange('portfolio', i, 'description', e.target.value)} placeholder="Краткое описание для карточки" />
                  <textarea value={p.fullDescription || ''} onChange={e => handleArrayChange('portfolio', i, 'fullDescription', e.target.value)} placeholder="Подробное описание для модального окна" rows={4} />
                  
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-muted)', display: 'block', marginBottom: '8px' }}>Главное фото (обложка):</label>
                    {p.image && <img src={p.image} alt="cover" style={{ width: '100px', borderRadius: '8px', marginBottom: '8px' }} />}
                    <input type="file" accept="image/*" id={`upload-cover-${p.id || i}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'portfolio', i, 'image')} />
                    <label htmlFor={`upload-cover-${p.id || i}`} className="btn-add" style={{ display: 'inline-block', cursor: 'pointer', padding: '8px 16px', width: 'auto' }}>Загрузить обложку</label>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-muted)', display: 'block', marginBottom: '8px' }}>Галерея работ:</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {p.images?.map((imgUrl: string, imgIdx: number) => (
                        <div key={imgIdx} style={{ position: 'relative' }}>
                          <img src={imgUrl} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <button
                            onClick={() => {
                              const newContent = { ...content };
                              newContent.portfolio[i].images = p.images.filter((_: any, idx: number) => idx !== imgIdx);
                              setContent(newContent);
                            }}
                            style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                    <input type="file" accept="image/*" id={`upload-gallery-${p.id || i}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'portfolio', i, 'images', true)} />
                    <label htmlFor={`upload-gallery-${p.id || i}`} className="btn-add" style={{ display: 'inline-block', cursor: 'pointer', padding: '8px 16px', width: 'auto' }}>+ Добавить фото в галерею</label>
                  </div>
                  <button className="btn-remove" onClick={() => removeArrayItem('portfolio', i)} style={{ marginTop: '20px' }}>Удалить проект</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addArrayItem('portfolio', { title: 'Новый проект', category: '', description: '', fullDescription: '', price: '', images: [] })}>+ Добавить проект</button>
            </div>
          )}

          {/* PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div>
              {content.promotions?.map((p: any, i: number) => (
                <div key={p.id || i} className="admin-card-edit">
                  <input value={p.title} onChange={e => handleArrayChange('promotions', i, 'title', e.target.value)} placeholder="Заголовок акции" />
                  <textarea value={p.text} onChange={e => handleArrayChange('promotions', i, 'text', e.target.value)} placeholder="Текст акции" />
                  <button className="btn-remove" onClick={() => removeArrayItem('promotions', i)}>Удалить</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addArrayItem('promotions', { title: 'Новая акция', text: '' })}>+ Добавить акцию</button>
            </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div>
              {content.testimonials?.map((t: any, i: number) => (
                <div key={t.id || i} className="admin-card-edit">
                  <input value={t.name} onChange={e => handleArrayChange('testimonials', i, 'name', e.target.value)} placeholder="Имя" />
                  <input value={t.role} onChange={e => handleArrayChange('testimonials', i, 'role', e.target.value)} placeholder="Должность" />
                  <textarea value={t.text} onChange={e => handleArrayChange('testimonials', i, 'text', e.target.value)} placeholder="Текст отзыва" />
                  <button className="btn-remove" onClick={() => removeArrayItem('testimonials', i)}>Удалить</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addArrayItem('testimonials', { name: '', role: '', text: '', rating: 5 })}>+ Добавить отзыв</button>
            </div>
          )}

          {/* GUARANTEES */}
          {activeTab === 'guarantees' && (
            <div>
              {content.guarantees?.map((g: any, i: number) => (
                <div key={g.id || i} className="admin-card-edit">
                  <input value={g.title} onChange={e => handleArrayChange('guarantees', i, 'title', e.target.value)} placeholder="Заголовок" />
                  <textarea value={g.text} onChange={e => handleArrayChange('guarantees', i, 'text', e.target.value)} placeholder="Текст" />
                  <button className="btn-remove" onClick={() => removeArrayItem('guarantees', i)}>Удалить</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addArrayItem('guarantees', { title: '', text: '' })}>+ Добавить гарантию</button>
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="form-group">
              <label>Telegram (ссылка)<input value={content.contacts?.telegram || ''} onChange={e => setContent({...content, contacts: {...content.contacts, telegram: e.target.value}})} /></label>
              <label>WhatsApp (ссылка)<input value={content.contacts?.whatsapp || ''} onChange={e => setContent({...content, contacts: {...content.contacts, whatsapp: e.target.value}})} /></label>
              <label>Телефон<input value={content.contacts?.phone || ''} onChange={e => setContent({...content, contacts: {...content.contacts, phone: e.target.value}})} /></label>
            </div>
          )}

          {/* LEGAL */}
          {activeTab === 'legal' && (
            <div className="form-group">
              <label>Политика конфиденциальности<textarea style={{height: '150px'}} value={content.legal?.privacy || ''} onChange={e => setContent({...content, legal: {...content.legal, privacy: e.target.value}})} /></label>
              <label>Пользовательское соглашение<textarea style={{height: '150px'}} value={content.legal?.terms || ''} onChange={e => setContent({...content, legal: {...content.legal, terms: e.target.value}})} /></label>
              <label>Согласие на обработку данных<textarea style={{height: '150px'}} value={content.legal?.consent || ''} onChange={e => setContent({...content, legal: {...content.legal, consent: e.target.value}})} /></label>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="form-group">
              <div style={{ background: 'rgba(125, 211, 252, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: '#ccc' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Как настроить:</strong></p>
                <p style={{ margin: '0 0 4px 0' }}>1. Создайте сообщество ВК и включите сообщения.</p>
                <p style={{ margin: '0 0 4px 0' }}>2. Получите токен доступа (Access Token) с правами <code>messages</code>.</p>
                <p style={{ margin: '0' }}>3. Напишите сообществу любое сообщение (чтобы разрешить ему писать вам).</p>
              </div>

              <label style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff' }}>
                <input 
                  type="checkbox" 
                  checked={content.vkSettings?.enabled || false} 
                  onChange={e => setContent({...content, vkSettings: {...(content.vkSettings || {}), enabled: e.target.checked}})} 
                  style={{ width: 'auto', height: 'auto', margin: 0 }}
                />
                Включить уведомления в ВК
              </label>

              <label>Токен доступа (Access Token)
                <input 
                  type="password"
                  value={content.vkSettings?.token || ''} 
                  onChange={e => setContent({...content, vkSettings: {...(content.vkSettings || {}), token: e.target.value}})} 
                  placeholder="vk1.a...." 
                />
              </label>
              
              <label>Ваш ID ВКонтакте (получатель)
                <input 
                  value={content.vkSettings?.userId || ''} 
                  onChange={e => setContent({...content, vkSettings: {...(content.vkSettings || {}), userId: e.target.value}})} 
                  placeholder="12345678" 
                />
              </label>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}