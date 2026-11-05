import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';
import Modal from '../components/ui/Modal';
import LiquidButton from '../components/ui/LiquidButton'; // <-- Добавили импорт кнопки

export default function Portfolio() {
  const { content } = useContent();
  const [activeWork, setActiveWork] = useState<any>(null);

  if (!content) return null;

  // Функция для перехода к услугам
  const handleOrderClick = () => {
    setActiveWork(null); // Закрываем модалку
    setTimeout(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }, 150); // Ждем 150мс, чтобы окно закрылось
  };

  return (
    <section id="portfolio" className="section">
      <SectionReveal>
        <h2 className="section-title">Примеры работ</h2>
      </SectionReveal>
      
      <div className="portfolio-grid">
        {content.portfolio.map((item: any, index: number) => (
          <SectionReveal key={item.id} delay={index * 0.1}>
            <div 
              className="glass-card portfolio-card"
              onClick={() => setActiveWork(item)}
            >
             <img 
  src={item.image || `https://picsum.photos/seed/${item.id}/800/600?grayscale`} 
  alt={item.title} 
  className="portfolio-image" 
/>
              <div className="portfolio-overlay">
                <span className="portfolio-category">{item.category}</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{item.description}</p>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>

      <Modal isOpen={!!activeWork} onClose={() => setActiveWork(null)}>
        {activeWork && (
          <div className="portfolio-modal-inner">
            <h2 style={{ marginBottom: '8px' }}>{activeWork.title}</h2>
            <span className="portfolio-category" style={{ display: 'inline-block', marginBottom: '16px' }}>
              {activeWork.category}
            </span>

            {/* Карусель с фото */}
            {activeWork.images && activeWork.images.length > 0 && (
              <div className="portfolio-carousel">
                {activeWork.images.map((img: string, i: number) => (
                  <img key={i} src={img} alt={`${activeWork.title} - ${i}`} className="carousel-img" />
                ))}
              </div>
            )}

            <div className="portfolio-details">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-accent)' }}>О проекте</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '24px' }}>
                {activeWork.fullDescription || activeWork.description}
              </p>
              
              <div className="portfolio-price" style={{ marginBottom: '24px' }}>
                <span>Стоимость:</span>
                <strong>{activeWork.price || 'По запросу'}</strong>
              </div>

              {/* НОВАЯ КНОПКА ЗАКАЗА */}
             <LiquidButton 
  onClick={handleOrderClick} 
  variant="primary"
  style={{ width: '100%' }} // <-- Растягиваем кнопку
>
  Сделать заказ
</LiquidButton>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}