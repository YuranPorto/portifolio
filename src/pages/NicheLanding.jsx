import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './NicheLanding.module.css'
import { nicheLandingPages as defaultNichePages } from '../data/nicheLandingPages'
import { getNichePageBySlug } from '../services/pagesService'
import { CONTACT_CONFIG } from '../config/contact'
import { supabase } from '../services/supabase'
import { 
  ArrowLeft, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Wrench,
  ShieldCheck,
  Cpu,
  Droplet,
  Gauge,
  Wind,
  MapPin,
  Clock,
  Sparkles,
  Star,
  ChevronDown,
  Layers,
  FolderGit2,
  Check
} from 'lucide-react'

export default function NicheLanding({ nicheSlug = 'sites-para-oficinas' }) {
  const { lang: paramLang, slug: routeSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Support both direct route (/sites-para-oficinas) and parameterized (/solucoes/:slug)
  const activeSlug = routeSlug || nicheSlug || 'sites-para-oficinas'

  // Detect language from URI or params
  const currentLang = useMemo(() => {
    if (paramLang === 'en') return 'en'
    if (paramLang === 'pt') return 'pt'
    const normalized = location.pathname.toLowerCase()
    if (normalized.startsWith('/en')) return 'en'
    return 'pt'
  }, [paramLang, location.pathname])

  const [dynamicPage, setDynamicPage] = useState(null)
  const [dbProjects, setDbProjects] = useState([])
  const [activeFaq, setActiveFaq] = useState(null)
  const [demoSelectedService, setDemoSelectedService] = useState(0)

  useEffect(() => {
    async function loadPage() {
      const page = await getNichePageBySlug(activeSlug)
      if (page) {
        setDynamicPage(page)
      }
    }
    loadPage()
  }, [activeSlug])

  const nicheData = dynamicPage || defaultNichePages[activeSlug] || defaultNichePages['sites-para-oficinas']
  const content = nicheData ? (nicheData[currentLang] || nicheData.pt) : null

  // Fetch projects from Supabase matching this category
  useEffect(() => {
    async function loadCategoryProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          const categoryKeywords = ['oficina', 'automotiv', 'mecanic', 'car', 'auto', activeSlug.replace('sites-para-', '')]
          const matched = data.filter(p => {
            const cat = (p.category || '').toLowerCase()
            const title = (p.title || '').toLowerCase()
            const desc = (p.description || '').toLowerCase()
            return categoryKeywords.some(kw => cat.includes(kw) || title.includes(kw) || desc.includes(kw))
          })
          setDbProjects(matched)
        }
      } catch (err) {
        console.warn('Could not query category projects:', err)
      }
    }
    loadCategoryProjects()
  }, [activeSlug])

  // Merge database projects with template demonstrations for this niche
  const displayedCategoryProjects = useMemo(() => {
    const defaultItems = content?.categoryProjects?.items || []
    if (dbProjects.length > 0) {
      return [
        ...dbProjects.map(db => ({
          id: db.id,
          title: db.title,
          category: db.category || (currentLang === 'en' ? 'Automotive' : 'Oficinas & Automotivo'),
          description: db.description,
          image_url: db.image_url,
          tech_stack: db.tech_stack || ['React', 'Vite', 'WhatsApp'],
          live_url: db.live_url || '#demo'
        })),
        ...defaultItems.filter(item => !dbProjects.some(db => db.title.toLowerCase() === item.title.toLowerCase()))
      ]
    }
    return defaultItems
  }, [dbProjects, content?.categoryProjects?.items, currentLang])

  // Language switcher preserving current niche
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return
    navigate(newLang === 'en' ? `/en/${activeSlug}` : `/pt/${activeSlug}`)
  }

  // WhatsApp click handler with pre-formatted message
  const whatsappUrl = useMemo(() => {
    const cleanNumber = CONTACT_CONFIG.whatsappNumber.replace(/\D/g, '')
    const msg = content?.ctaBanner?.whatsappMsg || 'Olá Yuran! Gostaria de um orçamento para o site da minha oficina mecânica.'
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`
  }, [content?.ctaBanner?.whatsappMsg])

  // Update document title and meta
  useEffect(() => {
    if (content?.metaTitle) {
      document.title = content.metaTitle
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [content?.metaTitle])

  // Icon mapper for services
  const renderServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu size={22} />
      case 'ShieldCheck': return <ShieldCheck size={22} />
      case 'Wrench': return <Wrench size={22} />
      case 'Droplet': return <Droplet size={22} />
      case 'Gauge': return <Gauge size={22} />
      case 'Wind': return <Wind size={22} />
      default: return <Wrench size={22} />
    }
  }

  if (!content) return null

  return (
    <div className={styles.container}>
      {/* Top Header / Navigation */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link to={currentLang === 'en' ? '/en' : '/pt'} className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>{currentLang === 'en' ? 'Back to Portfolio' : 'Voltar ao Portfólio'}</span>
          </Link>

          <div className={styles.topActions}>
            <div className={styles.langSwitcher}>
              <button 
                type="button"
                onClick={() => handleLanguageChange('pt')}
                className={`${styles.langBtn} ${currentLang === 'pt' ? styles.langActive : ''}`}
              >
                PT
              </button>
              <span className={styles.langDivider}>/</span>
              <button 
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`${styles.langBtn} ${currentLang === 'en' ? styles.langActive : ''}`}
              >
                EN
              </button>
            </div>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.headerCtaBtn}
            >
              <MessageCircle size={16} />
              <span>{currentLang === 'en' ? 'WhatsApp Quote' : 'Orçamento Rápido'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroInner}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>
              <Wrench size={14} />
              {content.badge}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            {content.headlineStart}
            <span className={styles.heroTitleHighlight}>{content.headlineHighlight}</span>
          </h1>

          <p className={styles.heroSubtitle}>
            {content.subtitle}
          </p>

          <div className={styles.heroCtaGroup}>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.heroBtnWhatsapp}
            >
              <MessageCircle size={20} />
              <span>{content.ctaWhatsapp}</span>
              <ArrowRight size={18} />
            </a>

            <a href="#demo" className={styles.heroBtnSecondary}>
              <Layers size={18} />
              <span>{content.ctaSecondary}</span>
            </a>
          </div>

          {/* Metrics Bar */}
          <div className={styles.metricsGrid}>
            {content.metrics?.map((metric, i) => (
              <div key={i} className={styles.metricCard}>
                <span className={styles.metricVal}>{metric.value}</span>
                <span className={styles.metricDesc}>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Section */}
      <section id="demo" className={styles.demoSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{content.demo.tag}</span>
          <h2 className={styles.sectionTitle}>{content.demo.title}</h2>
          <p className={styles.sectionSubtitle}>{content.demo.subtitle}</p>
        </div>

        {/* Browser Mockup Frame */}
        <div className={styles.browserFrame}>
          <div className={styles.browserTopBar}>
            <div className={styles.browserDots}>
              <span className={styles.dotRed}></span>
              <span className={styles.dotYellow}></span>
              <span className={styles.dotGreen}></span>
            </div>
            <div className={styles.browserUrlBar}>
              <span className={styles.lockIcon}>🔒</span>
              <span className={styles.urlText}>https://autotech-centroautomotivo.com.br</span>
            </div>
            <span className={styles.liveTag}>{currentLang === 'en' ? 'Interactive Preview' : 'Demonstração Interativa'}</span>
          </div>

          <div className={styles.mockupContent}>
            {/* Mockup Header */}
            <div className={styles.mockupHeader}>
              <div className={styles.mockupLogo}>
                <Wrench className={styles.mockupLogoIcon} size={20} />
                <span>{content.demo.previewShopName}</span>
              </div>
              <div className={styles.mockupHeaderInfo}>
                <span><Clock size={13} /> {content.demo.previewHours}</span>
                <span><MapPin size={13} /> {content.demo.previewAddress}</span>
              </div>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.mockupHeaderCta}
              >
                <MessageCircle size={14} />
                <span>{content.demo.ctaButtonDemo}</span>
              </a>
            </div>

            {/* Mockup Hero */}
            <div className={styles.mockupHero}>
              <div className={styles.mockupRating}>
                <div className={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#eab308" color="#eab308" />
                  ))}
                </div>
                <span>{content.demo.previewRating}</span>
              </div>

              <h3 className={styles.mockupTitle}>{content.demo.previewTagline}</h3>
              <p className={styles.mockupSubtext}>
                {currentLang === 'en' 
                  ? 'Brakes, computerized diagnostics, suspension, and routine scheduled checkups with OEM warranty and zero surprise costs.'
                  : 'Freios, suspensão, injeção eletrônica e revisões completas para você rodar com total segurança e garantia por escrito.'}
              </p>

              <div className={styles.mockupHeroButtons}>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.mockupMainBtn}
                >
                  <MessageCircle size={18} />
                  <span>{content.demo.ctaButtonDemo}</span>
                </a>
              </div>
            </div>

            {/* Mockup Trust Highlights */}
            <div className={styles.mockupTrustBar}>
              {content.demo.trustPills?.map((pill, idx) => (
                <div key={idx} className={styles.trustItem}>
                  <CheckCircle2 size={16} className={styles.trustCheck} />
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            {/* Mockup Services Grid */}
            <div className={styles.mockupServicesSection}>
              <div className={styles.mockupServicesHeader}>
                <h4>{currentLang === 'en' ? 'Our Specialized Services' : 'Serviços Especializados na Oficina'}</h4>
                <p>{currentLang === 'en' ? 'Select a category to view diagnostic details:' : 'Toque em um serviço para ver detalhes do diagnóstico:'}</p>
              </div>

              <div className={styles.mockupServicesGrid}>
                {content.demo.services?.map((srv, index) => (
                  <div 
                    key={index} 
                    className={`${styles.mockupServiceCard} ${demoSelectedService === index ? styles.mockupServiceActive : ''}`}
                    onClick={() => setDemoSelectedService(index)}
                  >
                    <div className={styles.serviceIconFrame}>
                      {renderServiceIcon(srv.icon)}
                    </div>
                    <h5>{srv.title}</h5>
                    <p>{srv.desc}</p>
                    <div className={styles.serviceAction}>
                      <span>{currentLang === 'en' ? 'Inquire about this service' : 'Orçar este serviço'}</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Footer Map Simulation */}
            <div className={styles.mockupMapBox}>
              <div className={styles.mapPinInfo}>
                <MapPin size={24} className={styles.mapPinIcon} />
                <div>
                  <strong>{content.demo.previewShopName}</strong>
                  <span>{content.demo.previewAddress}</span>
                </div>
              </div>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={styles.mapRouteBtn}
              >
                <span>{currentLang === 'en' ? 'Traçar Rota no Waze / Maps' : 'Traçar Rota no Waze / Maps'}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Connected to This Category */}
      {displayedCategoryProjects.length > 0 && (
        <section className={styles.categoryProjectsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              {content.categoryProjects?.tag || (currentLang === 'en' ? 'CATEGORY SHOWCASE' : 'CASES DESTA CATEGORIA')}
            </span>
            <h2 className={styles.sectionTitle}>
              {content.categoryProjects?.title || (currentLang === 'en' ? 'Demonstrations & Projects in this Industry' : 'Projetos e Demonstrações Desta Categoria')}
            </h2>
            <p className={styles.sectionSubtitle}>
              {content.categoryProjects?.subtitle || (currentLang === 'en' ? 'Selected web applications and landing pages engineered for this market.' : 'Modelos e apresentações de alta conversão desenvolvidos sob medida para este segmento.')}
            </p>
          </div>

          <div className={styles.categoryProjectsGrid}>
            {displayedCategoryProjects.map((proj, idx) => (
              <div key={proj.id || idx} className={styles.categoryProjectCard}>
                <div className={styles.catProjectThumb}>
                  <img 
                    src={proj.image_url || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop'} 
                    alt={proj.title} 
                    loading="lazy"
                  />
                  <div className={styles.catProjectOverlay}>
                    <a 
                      href={proj.live_url || '#demo'} 
                      target={proj.live_url?.startsWith('#') ? '_self' : '_blank'}
                      rel="noreferrer" 
                      className={styles.catOverlayBtn}
                    >
                      <ExternalLink size={15} />
                      <span>{content.categoryProjects?.viewLive || (currentLang === 'en' ? 'View Demo' : 'Ver Demonstração')}</span>
                    </a>
                  </div>
                </div>

                <div className={styles.catProjectBody}>
                  <span className={styles.catProjectBadge}>{proj.category || 'Oficinas & Automotivo'}</span>
                  <div className={styles.catProjectStack}>
                    {proj.tech_stack?.map((tech, tIdx) => (
                      <span key={tIdx} className={styles.catTechPill}>{tech}</span>
                    ))}
                  </div>

                  <h3 className={styles.catProjectTitle}>{proj.title}</h3>
                  <p className={styles.catProjectDesc}>{proj.description || proj.desc}</p>

                  <div className={styles.catProjectFooter}>
                    <a 
                      href={proj.live_url || '#demo'}
                      target={proj.live_url?.startsWith('#') ? '_self' : '_blank'}
                      rel="noreferrer"
                      className={styles.catProjectLink}
                    >
                      <span>{content.categoryProjects?.viewLive || (currentLang === 'en' ? 'View Demo' : 'Ver Demonstração')}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{content.benefits.tag}</span>
          <h2 className={styles.sectionTitle}>{content.benefits.title}</h2>
          <p className={styles.sectionSubtitle}>{content.benefits.subtitle}</p>
        </div>

        <div className={styles.benefitsGrid}>
          {content.benefits.cards?.map((b, i) => (
            <div key={i} className={styles.benefitCard}>
              <div className={styles.benefitIconBox}>
                {i === 0 && <ShieldCheck size={24} />}
                {i === 1 && <MessageCircle size={24} />}
                {i === 2 && <MapPin size={24} />}
                {i === 3 && <Clock size={24} />}
              </div>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section className={styles.includedSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{content.whatsIncluded.tag}</span>
          <h2 className={styles.sectionTitle}>{content.whatsIncluded.title}</h2>
          <p className={styles.sectionSubtitle}>{content.whatsIncluded.subtitle}</p>
        </div>

        <div className={styles.includedGrid}>
          {content.whatsIncluded.items?.map((item, idx) => (
            <div key={idx} className={styles.includedCard}>
              <div className={styles.includedHeader}>
                <div className={styles.includedCheckIcon}>
                  <Check size={16} />
                </div>
                <h4 className={styles.includedTitle}>{item.title}</h4>
              </div>
              <p className={styles.includedDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{content.process.tag}</span>
          <h2 className={styles.sectionTitle}>{content.process.title}</h2>
          <p className={styles.sectionSubtitle}>{content.process.subtitle}</p>
        </div>

        <div className={styles.processGrid}>
          {content.process.steps?.map((step, idx) => (
            <div key={idx} className={styles.processCard}>
              <div className={styles.stepBadge}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{content.faq.tag}</span>
          <h2 className={styles.sectionTitle}>{content.faq.title}</h2>
        </div>

        <div className={styles.faqList}>
          {content.faq.items?.map((item, idx) => (
            <div 
              key={idx} 
              className={`${styles.faqItem} ${activeFaq === idx ? styles.faqActive : ''}`}
            >
              <button 
                type="button" 
                className={styles.faqQuestion}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span>{item.q}</span>
                <ChevronDown size={18} className={styles.faqChevron} />
              </button>
              {activeFaq === idx && (
                <div className={styles.faqAnswer}>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className={styles.finalCtaSection}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaGlow}></div>
          <span className={styles.ctaTag}>{content.ctaBanner.tag}</span>
          <h2 className={styles.ctaTitle}>{content.ctaBanner.title}</h2>
          <p className={styles.ctaSubtitle}>{content.ctaBanner.subtitle}</p>

          <div className={styles.ctaButtonGroup}>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaWhatsappLarge}
            >
              <MessageCircle size={22} />
              <span>{content.ctaWhatsapp}</span>
              <ArrowRight size={18} />
            </a>

            <Link 
              to={currentLang === 'en' ? '/en/briefing' : '/pt/briefing'}
              className={styles.ctaBriefingBtn}
            >
              <span>{currentLang === 'en' ? 'Fill 1-Min Briefing' : 'Preencher Briefing Rápido'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to={currentLang === 'en' ? '/en' : '/pt'} className={styles.footerBack}>
            ← {currentLang === 'en' ? 'Back to Yuran Porto Portfolio' : 'Voltar ao Portfólio de Yuran Porto'}
          </Link>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Yuran Porto. {currentLang === 'en' ? 'Specialized High-Performance Landing Pages.' : 'Landing Pages de Alta Conversão para Negócios Locais e Empresas.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
