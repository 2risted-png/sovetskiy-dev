import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent, CSSProperties } from 'react'; // <-- Добавлено type

export default function LiquidButton({ 
  children, 
  onClick, 
  href,
  variant = 'primary',
  style
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  href?: string;
  variant?: 'primary' | 'glass';
  style?: CSSProperties;
}) {
  const baseClass = "liquid-btn " + variant;
  const Comp: any = href ? motion.a : motion.button;
  const isExternal = href && href.startsWith('http');

  const handleClick = (e: MouseEvent) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClick) onClick();
  };

  return (
    <Comp
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={baseClass}
      style={style}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </Comp>
  );
}