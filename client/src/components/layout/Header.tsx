import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="header-glass"
    >
      <div className="header-container">
        <Link to="/" className="logo-link">
          {/* Логотип Могильный Крест */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Тонкая рамка */}
            <rect x="1" y="1" width="38" height="38" rx="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            
            {/* Голубое свечение (тень) креста */}
            <path d="M20 9 V30 M13 17 H27" stroke="#7dd3fc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
            
            {/* Сам крест (белый) */}
            <path d="M20 10 V30 M14 18 H26" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Холмик земли */}
            <path d="M14 34 C16 32 24 32 26 34" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">SOVETSKIY DEV</span>
        </Link>

        <nav className="header-nav">
          <a href="#services">Услуги</a>
          <a href="#portfolio">Работы</a>
          <a href="#testimonials">Отзывы</a>
          <a href="#contacts" className="nav-btn">Связаться</a>
        </nav>
      </div>
    </motion.header>
  );
}