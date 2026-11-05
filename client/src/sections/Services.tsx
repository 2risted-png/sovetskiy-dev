import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';
import Modal from '../components/ui/Modal';
import OrderForm from '../components/ui/OrderForm';

export default function Services() {
  const { content } = useContent();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!content) return null;

  // Безопасно извлекаем список названий услуг
  const servicesList = content.services?.map((s: any) => s.title) || [];

  return (
    <section id="services" className="section">
      <SectionReveal>
        <h2 className="section-title">Мои услуги</h2>
      </SectionReveal>
      
      <div className="services-grid">
        {content.services?.map((service: any, index: number) => (
          <SectionReveal key={service.id || index} delay={index * 0.1}>
            <div 
              className="glass-card service-card" 
              onClick={() => setSelectedService(service.title)}
              style={{ cursor: 'pointer' }}
            >
              <h3 style={{ fontSize: '1.4rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--color-muted)' }}>{service.description}</p>
              <div className="service-price">{service.price}</div>
            </div>
          </SectionReveal>
        ))}
      </div>

      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)}>
        {selectedService && (
          <OrderForm 
            initialService={selectedService} 
            services={servicesList}
            onSuccess={() => setSelectedService(null)} 
          />
        )}
      </Modal>
    </section>
  );
}