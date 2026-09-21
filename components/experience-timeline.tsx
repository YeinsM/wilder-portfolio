import { experience } from '../lib/experience';
import type { Locale } from '../lib/portfolio-state';

export default function ExperienceTimeline({ locale }: { locale: Locale }) {
  return (
    <section id="experience" className="section experience-section">
      <div className="section-heading reveal">
        <p className="eyebrow">
          {locale === 'es'
            ? 'MI RECORRIDO PROFESIONAL'
            : 'MY PROFESSIONAL JOURNEY'}
        </p>
        <h2>
          {locale === 'es' ? 'Experiencia' : 'Work experience'}
          <span className="cyan">.</span>
        </h2>
        <p className="section-intro">
          {locale === 'es'
            ? 'De enseñar a programar a construir soluciones empresariales. Cada etapa, una nueva perspectiva.'
            : 'From teaching code to building enterprise solutions. Each chapter, a new perspective.'}
        </p>
      </div>
      <ol className="experience-timeline">
        {experience.map((job, index) => (
          <li className="timeline-item" key={job.company}>
            <div className="timeline-marker" aria-hidden="true">
              {job.initials}
            </div>
            <article className="experience-card reveal">
              <p className="timeline-date">
                {job.dates[locale]}
                {index === 0 && (
                  <span className="current-role">
                    {locale === 'es' ? 'Actual' : 'Current'}
                  </span>
                )}
              </p>
              <h3>{job.role[locale]}</h3>
              <p className="company-name">{job.company}</p>
              <ul>
                {job.points[locale].map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="tags">
                {job.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
