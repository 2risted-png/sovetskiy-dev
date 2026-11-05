import { useLocation, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function Legal() {
  const { content } = useContent();
  const location = useLocation();
  const navigate = useNavigate();

  if (!content) return null;

  const path = location.pathname;
  let title = '';
  let text = '';

  if (path === '/privacy') {
    title = 'Политика конфиденциальности';
    text = content.legal.privacy;
  } else if (path === '/terms') {
    title = 'Пользовательское соглашение';
    text = content.legal.terms;
  } else {
    title = 'Согласие на обработку персональных данных';
    text = content.legal.consent;
  }

  return (
    <div className="legal-page">
      <button onClick={() => navigate('/')} className="back-btn">← Вернуться на главную</button>
      <h1 className="section-title" style={{ textAlign: 'left' }}>{title}</h1>
      <div className="legal-text glass-card">
        <p>{text}</p>
        <p style={{ marginTop: '20px', color: '#888' }}>(Редактируется в админ-панели)</p>
      </div>
    </div>
  );
}