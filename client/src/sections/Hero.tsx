import { useContent } from '../context/ContentContext';
import LiquidButton from '../components/ui/LiquidButton';
import { motion } from 'framer-motion';

export default function Hero() {
  const { content } = useContent();
  if (!content) return null;

  const { hero } = content;

  return (
    <section className="hero-section">
      {/* Затемнение, чтобы текст читался поверх фото */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hero-text-block"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-title"
          >
            {hero.title}
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-subtitle"
          >
            {hero.subtitle}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hero-desc"
          >
            {hero.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hero-actions"
          >
            <LiquidButton href={hero.ctaPrimaryLink} variant="primary">
              {hero.ctaPrimaryText}
            </LiquidButton>
            <LiquidButton href={hero.ctaSecondaryLink} variant="glass">
              {hero.ctaSecondaryText}
            </LiquidButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}