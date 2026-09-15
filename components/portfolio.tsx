'use client';
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  BriefcaseBusiness,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { copy, projects } from '../lib/content';
import {
  contactHref,
  normalizeLocale,
  type Locale,
} from '../lib/portfolio-state';
import StackExplorer from './stack-explorer';
const HeroScene = lazy(() => import('./hero-scene'));
let memoryLocale: Locale | null = null;
const localeListeners = new Set<() => void>();
function readLocale(): Locale {
  if (memoryLocale) return memoryLocale;
  try {
    return normalizeLocale(localStorage.getItem('wm-language'));
  } catch {
    return 'es';
  }
}
function subscribeLocale(listener: () => void) {
  localeListeners.add(listener);
  const syncStorage = () => {
    memoryLocale = null;
    listener();
  };
  window.addEventListener('storage', syncStorage);
  return () => {
    localeListeners.delete(listener);
    window.removeEventListener('storage', syncStorage);
  };
}
const serverLocale = (): Locale => 'es';

function ProjectVisual({ id, locale }: { id: string; locale: Locale }) {
  const en = locale === 'en';
  return (
    <div className={`project-visual ${id}`} aria-hidden="true">
      <div className="preview-top">
        <span className="preview-dots">● ● ●</span>
        <span>
          {id === 'delta'
            ? 'deltaforex.org'
            : id === 'techbrains'
              ? 'techbrains.com.do'
              : 'inscripciontorneo.bmcargo.com'}
        </span>
        <ArrowUpRight size={14} />
      </div>
      {id === 'delta' ? (
        <div className="delta-graphic">
          <span className="preview-label">
            {en ? 'TRADING COMMUNITY' : 'COMUNIDAD DE TRADING'}
          </span>
          <strong>
            DELTA<span>FOREX</span>
            <i>↗</i>
          </strong>
          <div className="data-flow">
            <span>{en ? 'Accounts' : 'Cuentas'}</span>
            <span>{en ? 'History' : 'Historial'}</span>
            <span>{en ? 'Results' : 'Resultados'}</span>
          </div>
        </div>
      ) : id === 'techbrains' ? (
        <div className="tech-graphic">
          <span className="preview-label">SOFTWARE & TECHNOLOGY</span>
          <strong>
            <Code2 />
            TechBrains<span>.</span>
          </strong>
          <p>
            {en
              ? 'Ideas. Technology. Possibilities.'
              : 'Ideas. Tecnología. Posibilidades.'}
          </p>
          <div className="tech-graphic-line">
            <span>DESIGN</span>
            <span>DEVELOP</span>
            <span>DELIVER</span>
          </div>
        </div>
      ) : (
        <div className="cargo-graphic">
          <span className="preview-label">
            {en ? 'TOURNAMENT REGISTRATION' : 'INSCRIPCIONES AL TORNEO'}
          </span>
          <strong>
            BM<span>CARGO</span>
            <sup>↗</sup>
          </strong>
          <div className="cargo-roles">
            <span>
              {en ? 'Player' : 'Jugador'} <ArrowRight size={16} />
            </span>
            <span>
              {en ? 'Sponsor' : 'Patrocinador'} <ArrowRight size={16} />
            </span>
          </div>
        </div>
      )}
      <span className="preview-caption">
        {en ? 'PROJECT OVERVIEW' : 'VISTA CONCEPTUAL DEL PROYECTO'}
      </span>
    </div>
  );
}

export default function Portfolio() {
  const locale = useSyncExternalStore(
    subscribeLocale,
    readLocale,
    serverLocale,
  );
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [intent, setIntent] = useState<'project' | 'opportunity'>('project');
  const [copied, setCopied] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState('home');
  const root = useRef<HTMLDivElement>(null);
  const c = copy[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    if (copied === 'idle') return;
    const timer = setTimeout(() => setCopied('idle'), 3000);
    return () => clearTimeout(timer);
  }, [copied]);
  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
          const context = gsap.context(() => {
            gsap.from('.hero-copy > *', {
              y: 24,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
            });
            gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) =>
              gsap.from(element, {
                y: 28,
                opacity: 0.25,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 92%',
                  once: true,
                },
              }),
            );
          }, root);
          return () => context.revert();
        });
        dispose = () => media.revert();
      })
      .catch(() => {});
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    root.current
      ?.querySelectorAll('section[id]')
      .forEach((section) => observer.observe(section));
    return () => {
      cancelled = true;
      dispose();
      observer.disconnect();
    };
  }, []);
  function switchLanguage(value: Locale) {
    memoryLocale = value;
    try {
      localStorage.setItem('wm-language', value);
    } catch {
      /* Still switch in memory. */
    }
    localeListeners.forEach((listener) => listener());
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('yeinsmancera@gmail.com');
      setCopied('success');
    } catch {
      setCopied('error');
    }
  }

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        {c.skip}
      </a>
      <header className="site-header">
        <nav
          className="navigation"
          aria-label={
            locale === 'es' ? 'Navegación principal' : 'Main navigation'
          }
        >
          <a className="wordmark" href="#home" aria-label="Wilder Mancera">
            wm<span>.</span>
          </a>
          <div className="nav-links">
            {['projects', 'stack', 'about'].map((id, i) => (
              <a
                key={id}
                className={activeSection === id ? 'current' : ''}
                href={`#${id}`}
              >
                {c.nav[i]}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <fieldset
              className="language-switch"

              aria-label={locale === 'es' ? 'Idioma' : 'Language'}
            >
              <button
                lang="es"
                aria-label="Español"
                aria-pressed={locale === 'es'}
                onClick={() => switchLanguage('es')}
              >
                ES
              </button>
              <span>/</span>
              <button
                lang="en"
                aria-label="English"
                aria-pressed={locale === 'en'}
                onClick={() => switchLanguage('en')}
              >
                EN
              </button>
            </fieldset>
            <a className="nav-contact" href="#contact">
              {c.talk}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              {c.available}
            </p>
            <h1>
              Wilder
              <br />
              <span>Mancera</span>
              <em>Full stack developer.</em>
            </h1>
            <p className="intro">
              {c.intro}
              <br />
              {c.intro2}
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#projects">
                {c.view}
                <ArrowUpRight size={18} />
              </a>
              <a className="quiet-link" href="#contact">
                {c.talk}
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="hero-visual">
                <div className="wm-fallback" aria-hidden="true">
                  WM
                </div>
              </div>
            }
          >
            <HeroScene locale={locale} />
          </Suspense>
          <div className="hero-bottom">
            <span>{c.signature}</span>
            <a href="#projects">
              {c.explore}
              <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <section id="projects" className="section projects-section">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">{c.workLabel}</p>
              <h2>
                {c.workTitle}
                <br />
                <span>{c.workTitle2}</span>
              </h2>
            </div>
            <p className="section-intro">{c.workIntro}</p>
          </div>
          <div className="project-list">
            {projects.map((project, i) => (
              <article
                className={`project-row reveal ${openProject === project.id ? 'opened' : ''}`}
                key={project.id}
              >
                <ProjectVisual id={project.id} locale={locale} />
                <div className="project-info">
                  <div className="project-meta">
                    <span className="mono">0{i + 1}</span>
                    <span>{project.type[locale]}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-summary">{project.summary[locale]}</p>
                  <div className="tags">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <button
                      className="text-button"
                      aria-expanded={openProject === project.id}
                      aria-controls={`detail-${project.id}`}
                      onClick={() =>
                        setOpenProject(
                          openProject === project.id ? null : project.id,
                        )
                      }
                    >
                      {openProject === project.id ? c.hide : c.details}
                      {openProject === project.id ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${c.visit}: ${project.name}`}
                    >
                      {c.visit}
                      <ArrowUpRight size={17} />
                    </a>
                  </div>
                </div>
                <div
                  id={`detail-${project.id}`}
                  className="project-detail"
                  hidden={openProject !== project.id}
                >
                  <div>
                    <h4>{c.challenge}</h4>
                    <p>{project.need[locale]}</p>
                  </div>
                  <div>
                    <h4>{c.contribution}</h4>
                    <p>{project.contribution[locale]}</p>
                    <div className="practice-tags">
                      {project.practices.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="stack" className="section stack-section">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">{c.stackLabel}</p>
              <h2>
                {c.stackTitle}
                <br />
                <span>{c.stackTitle2}</span>
              </h2>
            </div>
            <p className="section-intro">{c.stackIntro}</p>
          </div>
          <div className="reveal">
            <StackExplorer locale={locale} />
          </div>
        </section>
        <section id="about" className="section about-section">
          <div className="about-heading reveal">
            <p className="eyebrow">{c.aboutLabel}</p>
            <h2>
              {c.aboutTitle}
              <br />
              <span>{c.aboutTitle2}</span>
            </h2>
            <div className="about-signature" aria-hidden="true">
              W<span> / </span>M<span className="cyan">.</span>
            </div>
          </div>
          <div className="about-body reveal">
            <p className="bio-lead">{c.bio}</p>
            <p>{c.bio2}</p>
            <div className="principles">
              {c.principles.map(([title, text], i) => (
                <div key={title}>
                  <span className="mono">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="section contact-section">
          <p className="eyebrow reveal">
            <span className="status-dot" />
            {c.contactLabel}
          </p>
          <h2 className="reveal">
            {c.contactTitle}
            <br />
            <span>{c.contactTitle2}</span>
          </h2>
          <p className="contact-intro">{c.contactIntro}</p>
          <fieldset
            className="contact-intents"

            aria-label={
              locale === 'es' ? 'Motivo de contacto' : 'Contact reason'
            }
          >
            <button
              aria-pressed={intent === 'project'}
              onClick={() => setIntent('project')}
            >
              {c.projectIntent}
              <ArrowUpRight size={16} />
            </button>
            <button
              aria-pressed={intent === 'opportunity'}
              onClick={() => setIntent('opportunity')}
            >
              {c.jobIntent}
              <ArrowUpRight size={16} />
            </button>
          </fieldset>
          <div className="email-row">
            <a href={contactHref(locale, intent)}>
              yeinsmancera@gmail.com
              <ArrowUpRight />
            </a>
            <button
              className="copy-button"
              onClick={copyEmail}
              aria-label={c.copy}
            >
              {copied === 'success' ? <Check /> : <Copy />}
            </button>
          </div>
          <output className="copy-status">
            {copied === 'success'
              ? c.copied
              : copied === 'error'
                ? c.copyError
                : '\u00a0'}
          </output>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/wilder-mancera/"
              target="_blank"
              rel="noreferrer"
            >
              <BriefcaseBusiness size={17} />
              LinkedIn
              <ArrowUpRight size={15} />
            </a>
            <a
              href="https://github.com/YeinsM/YeinsM"
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={17} />
              GitHub
              <ArrowUpRight size={15} />
            </a>
          </div>
        </section>
      </main>
      <footer className="footer">
        <a
          className="wordmark"
          href="#home"
          aria-label={locale === 'es' ? 'Volver al inicio' : 'Back to top'}
        >
          wm<span>.</span>
        </a>
        <span>© {new Date().getFullYear()} Wilder Mancera</span>
        <span>{c.footer}</span>
        <a
          href="#home"
          aria-label={locale === 'es' ? 'Volver al inicio' : 'Back to top'}
        >
          ↑
        </a>
      </footer>
    </div>
  );
}
