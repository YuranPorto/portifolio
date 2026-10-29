import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import styles from './Home.module.css'
import { translations } from '../data/translations'
import { CONTACT_CONFIG } from '../config/contact'
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  BarChart3, 
  Layers, 
  Rocket, 
  CheckCircle2, 
  Globe2, 
  Menu, 
  X,
  MessageCircle,
  Terminal,
  Database,
  Cpu
} from 'lucide-react'

export default function Home() {
  const { lang: paramLang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Robust language detection from both useParams and location.pathname
  const currentLang = useMemo(() => {
    if (paramLang === 'en') return 'en'
    if (paramLang === 'pt') return 'pt'

    const normalizedPath = location.pathname.toLowerCase()
    if (normalizedPath === '/en' || normalizedPath.startsWith('/en/')) {
      return 'en'
    }
    if (normalizedPath === '/pt' || normalizedPath.startsWith('/pt/')) {
      return 'pt'
    }

    return 'pt' // default
  }, [paramLang, location.pathname])

  const t = translations[currentLang] || translations.pt
  const briefingPath = currentLang === 'en' ? '/en/briefing' : '/pt/briefing'

  const [dbProjects, setDbProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Direct mailto link (opens default email app directly without modal)
  const mailtoUrl = useMemo(() => {
    const emailTo = profile?.email || CONTACT_CONFIG.contactEmail
    const subject = currentLang === 'en' 
      ? 'Project Inquiry | High-Performance Landing Page' 
      : 'Solicitação de Orçamento | Landing Page'
    const body = currentLang === 'en'
      ? 'Hi Yuran,\n\nI saw your portfolio and would like to request a proposal for a landing page project.\n\nProject details:\n- Company / Product:\n- Target timeline:\n- Key goals:\n'
      : 'Olá Yuran,\n\nVi seu portfólio e gostaria de solicitar uma proposta para um projeto de landing page.\n\nDetalhes do projeto:\n- Empresa / Produto:\n- Prazo desejado:\n- Principais objetivos:\n'

    return `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [profile?.email, currentLang])

  // Switch language and navigate to corresponding URI
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return
    navigate(`/${newLang}${location.hash || ''}`)
  }

  // Update HTML lang attribute and page title dynamically
  useEffect(() => {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-BR'
    document.title = currentLang === 'en' 
      ? 'Yuran Porto | High-Performance Landing Pages & Software Engineering' 
      : 'Yuran Porto | Landing Pages de Alta Performance & Software Engineering'
  }, [currentLang])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch Projects from Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (!projectsError && projectsData && projectsData.length > 0) {
        setDbProjects(projectsData)
      }

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single()

      if (!profileError && profileData) {
        setProfile(profileData)
      }
    } catch (err) {
      console.warn('Using local fallbacks for data:', err)
    }
  }

  // Projects to display: database projects if available, otherwise localized demo projects
  const displayProjects = useMemo(() => {
    if (dbProjects.length > 0) {
      return dbProjects
    }
    return t.projects.demoProjects || []
  }, [dbProjects, t.projects.demoProjects])

  const getServiceIcon = (id) => {
    switch (id) {
      case 'saas': return <Layers className={styles.serviceIcon} />
      case 'sales': return <Rocket className={styles.serviceIcon} />
      case 'redesign': return <Zap className={styles.serviceIcon} />
      case 'integrations': return <Cpu className={styles.serviceIcon} />
      default: return <Zap className={styles.serviceIcon} />
    }
  }

  const getBentoIcon = (index) => {
    switch (index) {
      case 0: return <Zap size={22} className={styles.bentoIconAccent} />
      case 1: return <Smartphone size={22} className={styles.bentoIconAccent} />
      case 2: return <ShieldCheck size={22} className={styles.bentoIconAccent} />
      case 3: return <BarChart3 size={22} className={styles.bentoIconAccent} />
      default: return <Zap size={22} className={styles.bentoIconAccent} />
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <a href="#" className={styles.logoGroup}>
            <span className={styles.logoText}>{profile?.full_name || 'Yuran Porto'}</span>
            <span className={styles.statusPill}>
              <span className={styles.statusDot}></span>
              {currentLang === 'en' ? 'Open for Q1/Q2' : 'Vagas para projetos'}
            </span>
          </a>

          {/* Desktop Links */}
          <div className={styles.desktopNav}>
            <a href="#services" className={styles.navLink}>{t.nav.services}</a>
            <a href="#differentials" className={styles.navLink}>{t.nav.differentials}</a>
            <a href="#process" className={styles.navLink}>{t.nav.process}</a>
            <a href="#projects" className={styles.navLink}>{t.nav.projects}</a>
            <a href="#about" className={styles.navLink}>{t.nav.about}</a>
          </div>

          <div className={styles.navActions}>
            {/* Language Switcher */}
            <div className={styles.langSwitcher}>
              <button 
                type="button"
                onClick={() => handleLanguageChange('pt')} 
                className={`${styles.langBtn} ${currentLang === 'pt' ? styles.langActive : ''}`}
                title="Português"
              >
                PT
              </button>
              <span className={styles.langDivider}>/</span>
              <button 
                type="button"
                onClick={() => handleLanguageChange('en')} 
                className={`${styles.langBtn} ${currentLang === 'en' ? styles.langActive : ''}`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* CTA -> Opens the Briefing page */}
            <Link 
              to={briefingPath}
              className={styles.ctaPrimaryBtn}
            >
              {t.nav.cta}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileMenuToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
            <a href="#differentials" onClick={() => setIsMenuOpen(false)}>{t.nav.differentials}</a>
            <a href="#process" onClick={() => setIsMenuOpen(false)}>{t.nav.process}</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>{t.nav.projects}</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
            
            <div className={styles.mobileLangRow}>
              <span>{currentLang === 'en' ? 'Language:' : 'Idioma:'}</span>
              <div className={styles.langSwitcher}>
                <button 
                  onClick={() => { handleLanguageChange('pt'); setIsMenuOpen(false); }} 
                  className={`${styles.langBtn} ${currentLang === 'pt' ? styles.langActive : ''}`}
                >
                  Português (PT)
                </button>
                <button 
                  onClick={() => { handleLanguageChange('en'); setIsMenuOpen(false); }} 
                  className={`${styles.langBtn} ${currentLang === 'en' ? styles.langActive : ''}`}
                >
                  English (EN)
                </button>
              </div>
            </div>

            <Link 
              to={briefingPath}
              onClick={() => setIsMenuOpen(false)}
              className={styles.ctaPrimaryBtn}
              style={{ width: '100%', marginTop: '1rem', textDecoration: 'none' }}
            >
              {t.nav.cta}
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>
              <Globe2 size={15} />
              {t.hero.availabilityBadge}
            </span>
          </div>

          <h1 className={styles.headline}>
            {t.hero.headlineStart}
            <span className={styles.headlineHighlight}>{t.hero.headlineHighlight}</span>
          </h1>

          <p className={styles.subtitle}>
            {t.hero.subtitle}
          </p>

          <div className={styles.heroCtaGroup}>
            {/* Start a project -> Goes to Briefing */}
            <Link 
              to={briefingPath}
              className={styles.heroBtnPrimary}
            >
              {t.hero.ctaPrimary}
              <ArrowRight size={18} />
            </Link>

            <a href="#projects" className={styles.heroBtnSecondary}>
              {t.hero.ctaSecondary}
            </a>

            {/* Direct Briefing via WhatsApp */}
            <Link 
              to={briefingPath}
              className={styles.heroBtnWhatsapp}
              title={currentLang === 'en' ? 'Project Briefing' : 'Briefing do Projeto'}
            >
              <MessageCircle size={18} />
              <span>{currentLang === 'en' ? 'Briefing WhatsApp' : 'Briefing WhatsApp'}</span>
            </Link>
          </div>

          {/* Metrics Strip */}
          <div className={styles.metricsStrip}>
            {t.hero.metrics.map((metric, i) => (
              <div key={i} className={styles.metricItem}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t.services.tag}</span>
          <h2 className={styles.sectionTitle}>{t.services.title}</h2>
          <p className={styles.sectionSubtitle}>{t.services.subtitle}</p>
        </div>

        <div className={styles.servicesGrid}>
          {t.services.cards.map((card) => (
            <div key={card.id} className={styles.serviceCard}>
              <div className={styles.serviceIconContainer}>
                {getServiceIcon(card.id)}
              </div>
              <h3 className={styles.serviceTitle}>{card.title}</h3>
              <p className={styles.serviceDesc}>{card.description}</p>
              
              <ul className={styles.featureList}>
                {card.features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <CheckCircle2 size={16} className={styles.featureCheck} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Differentials */}
      <section id="differentials" className={`${styles.section} ${styles.differentialsSection}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t.differentials.tag}</span>
          <h2 className={styles.sectionTitle}>{t.differentials.title}</h2>
          <p className={styles.sectionSubtitle}>{t.differentials.subtitle}</p>
        </div>

        <div className={styles.bentoGrid}>
          {t.differentials.bento.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.bentoCard} ${index === 0 ? styles.bentoWide : ''}`}
            >
              <div className={styles.bentoCardHeader}>
                <div className={styles.bentoIconWrapper}>
                  {getBentoIcon(index)}
                </div>
                <span className={styles.bentoTag}>{item.tag}</span>
              </div>
              <h3 className={styles.bentoTitle}>{item.title}</h3>
              <p className={styles.bentoDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t.process.tag}</span>
          <h2 className={styles.sectionTitle}>{t.process.title}</h2>
          <p className={styles.sectionSubtitle}>{t.process.subtitle}</p>
        </div>

        <div className={styles.processGrid}>
          {t.process.steps.map((step, idx) => (
            <div key={idx} className={styles.processStep}>
              <div className={styles.stepNumberBadge}>{step.step}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t.projects.tag}</span>
          <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
          <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
        </div>

        <div className={styles.projectsGrid}>
          {displayProjects.length === 0 ? (
            <p className={styles.emptyState}>{t.projects.empty}</p>
          ) : (
            displayProjects.map((proj) => (
              <div key={proj.id} className={styles.projectCard}>
                <div className={styles.projectThumbWrapper}>
                  <img 
                    src={proj.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'} 
                    alt={proj.title} 
                    className={styles.projectImg}
                    loading="lazy"
                  />
                  <div className={styles.projectOverlay}>
                    {proj.live_url && proj.live_url !== '#' && (
                      <a 
                        href={proj.live_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={styles.overlayBtn}
                      >
                        <ExternalLink size={16} /> {t.projects.viewLive}
                      </a>
                    )}
                  </div>
                </div>

                <div className={styles.projectBody}>
                  <div className={styles.projectStack}>
                    {proj.tech_stack?.map((tech, i) => (
                      <span key={i} className={styles.techPill}>{tech}</span>
                    ))}
                  </div>

                  <h3 className={styles.projectTitle}>{proj.title}</h3>
                  <p className={styles.projectDesc}>{proj.description}</p>

                  <div className={styles.projectActions}>
                    {proj.live_url && proj.live_url !== '#' ? (
                      <a 
                        href={proj.live_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={styles.projectLinkMain}
                      >
                        <span>{t.projects.viewLive}</span>
                        <ArrowRight size={14} />
                      </a>
                    ) : (
                      <Link 
                        to={briefingPath}
                        className={styles.projectLinkMain}
                      >
                        <span>{t.projects.requestDemo}</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    {proj.repo_url && proj.repo_url !== '#' && (
                      <a 
                        href={proj.repo_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={styles.projectLinkGhost}
                      >
                        <Github size={16} />
                        <span>{t.projects.viewCode}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutImageFrame}>
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1534972195531-a756b1126f24?q=80&w=1200&auto=format&fit=crop"} 
                alt={profile?.full_name || "Yuran Porto"} 
                className={styles.aboutAvatar}
              />
            </div>
            
            <div className={styles.terminalBox}>
              <div className={styles.terminalHeader}>
                <span className={styles.termDotRed}></span>
                <span className={styles.termDotYellow}></span>
                <span className={styles.termDotGreen}></span>
                <span className={styles.termTitle}>core_profile.ts</span>
              </div>
              <pre className={styles.termCode}>
                <code>{`// Core Engineering DNA
const engineer = {
  name: "${profile?.full_name || 'Yuran Porto'}",
  focus: "High-Performance Landing Pages",
  background: "Back-end Architecture & APIs",
  locations: ["Brazil", "United States", "Global"],
  stack: ["React", "Vite", "Node.js", "PostgreSQL", "Cloud"]
};`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.aboutDetails}>
            <span className={styles.sectionTag}>{t.about.tag}</span>
            <h2 className={styles.aboutTitle}>{t.about.title}</h2>
            
            <p className={styles.aboutParagraph}>{t.about.p1}</p>
            <p className={styles.aboutParagraph}>{t.about.p2}</p>

            <div className={styles.aboutSkillsBlock}>
              <h4 className={styles.skillsHeading}>{t.about.skillsTitle}</h4>
              <div className={styles.skillsTagCloud}>
                <span className={styles.skillItem}><Zap size={14} /> React / Vite / Next.js</span>
                <span className={styles.skillItem}><Terminal size={14} /> Node.js & TypeScript</span>
                <span className={styles.skillItem}><Database size={14} /> PostgreSQL & Supabase</span>
                <span className={styles.skillItem}><Cpu size={14} /> Serverless & APIs REST</span>
                <span className={styles.skillItem}><BarChart3 size={14} /> Meta CAPI & GA4</span>
                <span className={styles.skillItem}><ShieldCheck size={14} /> Web Security & Anti-DDoS</span>
              </div>
            </div>

            <div className={styles.socialRow}>
              {profile?.social_links?.github && (
                <a href={profile.social_links.github} target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
              {profile?.social_links?.linkedin && (
                <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
              {/* Direct Mailto link */}
              <a 
                href={mailtoUrl}
                className={styles.socialLink}
                title={currentLang === 'en' ? 'Send an Email directly' : 'Enviar E-mail diretamente'}
              >
                <Mail size={20} />
                <span>E-mail</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Banner */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.ctaBannerCard}>
          <div className={styles.ctaBannerGlow}></div>
          <span className={styles.sectionTagLight}>{t.ctaBanner.tag}</span>
          <h2 className={styles.ctaBannerTitle}>{t.ctaBanner.title}</h2>
          <p className={styles.ctaBannerSubtitle}>{t.ctaBanner.subtitle}</p>

          <div className={styles.ctaBannerButtons}>
            <Link 
              to={briefingPath}
              className={styles.ctaBannerPrimary}
            >
              <MessageCircle size={18} />
              <span>{t.ctaBanner.btnPrimary}</span>
            </Link>

            {/* Direct Email link without modal */}
            <a 
              href={mailtoUrl}
              className={styles.ctaBannerSecondary}
              title={currentLang === 'en' ? 'Open your Email app' : 'Abrir aplicativo de E-mail'}
            >
              <Mail size={18} />
              <span>{t.ctaBanner.btnSecondary}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>{profile?.full_name || 'Yuran Porto'}</span>
            <p className={styles.footerRole}>{t.footer.role}</p>
          </div>

          <div className={styles.footerLinks}>
            <a href="#services">{t.nav.services}</a>
            <a href="#differentials">{t.nav.differentials}</a>
            <a href="#process">{t.nav.process}</a>
            <a href="#projects">{t.nav.projects}</a>
            <a href="#about">{t.nav.about}</a>
          </div>

          <div className={styles.footerCopy}>
            <p>© {new Date().getFullYear()} {profile?.full_name || 'Yuran Porto'}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
