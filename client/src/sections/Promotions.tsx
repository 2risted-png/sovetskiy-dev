import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';

export default function Promotions() {
  const { content } = useContent();
  if (!content || !content.promotions) return null;

  return (
    <section id="promotions" className="section">
      <SectionReveal>
        <h2 className="section-title">Акции</h2>
      </SectionReveal>
      
      <div className="guarantees-grid">
        {content.promotions.map((item: any, index: number) => (
          <SectionReveal key={item.id} delay={index * 0.1}>
            <div className="glass-card guarantee-card" style={{ borderColor: 'rgba(125, 211, 252, 0.3)' }}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}