import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <a href="#hero">Главная</a>
      <a href="#services">Услуги</a>
      <a href="#portfolio">Портфолио</a>
      <a href="#promotions">Акции</a>
    </nav>
  );
}