import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-text">SOVETSKIY DEV</span>
          <p>© {new Date().getFullYear()} Все права защищены.</p>
        </div>
        <div className="footer-legal">
          <Link to="/privacy">Политика конфиденциальности</Link>
          <Link to="/terms">Пользовательское соглашение</Link>
          <Link to="/consent">Согласие на обработку данных</Link>
          <Link to="/admin" style={{ opacity: 0.3, marginTop: '10px' }}>Вход для админа</Link>
        </div>
      </div>
    </footer>
  );
}