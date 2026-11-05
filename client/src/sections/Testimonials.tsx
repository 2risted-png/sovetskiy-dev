import { useContent } from '../context/ContentContext';
import SectionReveal from '../components/ui/SectionReveal';

export default function Testimonials() {
  const { content } = useContent();
  if (!content) return null;

  return (
    <section id="testimonials" className="section">
      <SectionReveal>
        <h2 className="section-title">Отзывы клиентов</h2>
      </SectionReveal>
      
      <div className="testimonials-grid">
        {content.testimonials.map((review: any, index: number) => (
          <SectionReveal key={review.id} delay={index * 0.1}>
            <div className="glass-card testimonial-card">
              <div className="testimonial-stars">
                {'★'.repeat(review.rating || 5)}
              </div>
              <p className="testimonial-text">"{review.text}"</p>
              <div className="testimonial-author">
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}