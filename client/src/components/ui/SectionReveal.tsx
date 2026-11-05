import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function SectionReveal({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 50, opacity: 0 }} // Оставляем начальную прозрачность
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      // Добавляем will-change, чтобы браузер рендерил блюр без лагов
      style={{ willChange: 'transform, opacity' }} 
    >
      {children}
    </motion.div>
  );
}