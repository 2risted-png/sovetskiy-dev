import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';

export default function Guarantees() {
  const { content } = useContent();
  if (!content) return null;

  return (
    <section id="guarantees" className="section">
      <SectionReveal>
        <h2 className="section-title">Гарантии</h2>
      </SectionReveal>
      
      <div className="guarantees-grid">
        {content.guarantees.map((item: any, index: number) => (
          <SectionReveal key={item.id} delay={index * 0.1}>
            <div className="glass-card guarantee-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}