import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';
import LiquidButton from '../components/ui/LiquidButton';

export default function Contacts() {
  const { content } = useContent();
  if (!content) return null;

  const { contacts } = content;

  return (
    <section id="contacts" className="section">
      <SectionReveal>
        <div className="glass-card contact-card">
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Обсудим проект?</h2>
          <p className="contact-desc">
            Никаких сложных форм и оплат на сайте. Напишите мне напрямую в удобном мессенджере, и мы обсудим все детали.
          </p>
          
          <div className="contact-links">
            {contacts.telegram && (
              <LiquidButton href={contacts.telegram} variant="primary">Telegram</LiquidButton>
            )}
            {contacts.whatsapp && (
              <LiquidButton href={contacts.whatsapp} variant="glass">WhatsApp</LiquidButton>
            )}
          </div>
          
          <div className="contact-info">
            {contacts.phone && <span>Тел: {contacts.phone}</span>}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}