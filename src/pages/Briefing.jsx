import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './Briefing.module.css'
import { translations } from '../data/translations'
import { CONTACT_CONFIG } from '../config/contact'
import { 
  ArrowLeft, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Send,
  Mail
} from 'lucide-react'

export default function Briefing() {
  const { lang: paramLang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Detect language from URI or params
  const currentLang = useMemo(() => {
    if (paramLang === 'en') return 'en'
    if (paramLang === 'pt') return 'pt'
    const normalized = location.pathname.toLowerCase()
    if (normalized.includes('/en')) return 'en'
    return 'pt'
  }, [paramLang, location.pathname])

  const t = translations[currentLang]?.briefing || translations.pt.briefing

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    projectType: t.fields.projectTypeOptions[0],
    stage: t.fields.stageOptions[0],
    deadline: t.fields.deadlineOptions[1],
    budget: t.fields.budgetOptions[1],
    details: ''
  })

  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Handle language switch while preserving form data
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return
    navigate(newLang === 'en' ? '/en/briefing' : '/pt/briefing')
  }

  // Construct formatted WhatsApp message
  const formattedMessage = useMemo(() => {
    const greeting = t.greeting || 'Olá Yuran! Preenchi o briefing do meu projeto no seu site:'
    const lines = [
      `👋 *${greeting}*`,
      '',
      `👤 *${currentLang === 'en' ? 'Name / Company' : 'Nome / Empresa'}:* ${formData.name || (currentLang === 'en' ? '[Not specified]' : '[Não informado]')}`,
      `🎯 *${currentLang === 'en' ? 'Project Type' : 'Tipo de Projeto'}:* ${formData.projectType}`,
      `📋 *${currentLang === 'en' ? 'Current Stage' : 'Estágio Atual'}:* ${formData.stage}`,
      `⏱️ *${currentLang === 'en' ? 'Target Timeline' : 'Prazo Desejado'}:* ${formData.deadline}`,
      `💰 *${currentLang === 'en' ? 'Planned Investment' : 'Investimento Planejado'}:* ${formData.budget}`
    ]

    if (formData.details.trim()) {
      lines.push(`📝 *${currentLang === 'en' ? 'Details & Links' : 'Detalhes & Referências'}:* ${formData.details.trim()}`)
    }

    lines.push('', currentLang === 'en' ? 'Looking forward to hearing your thoughts and next steps!' : 'Gostaria de saber como podemos iniciar!')

    return lines.join('\n')
  }, [formData, currentLang, t.greeting])

  const whatsappUrl = useMemo(() => {
    const cleanNumber = CONTACT_CONFIG.whatsappNumber.replace(/\D/g, '')
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedMessage)}`
  }, [formattedMessage])

  const mailtoBriefingUrl = useMemo(() => {
    const emailTo = CONTACT_CONFIG.contactEmail
    const subject = `[Briefing ${currentLang.toUpperCase()}] ${formData.name || (currentLang === 'en' ? 'New Project' : 'Novo Projeto')}`
    return `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedMessage)}`
  }, [formData.name, formattedMessage, currentLang])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setValidationError(currentLang === 'en' ? 'Please enter your name or company.' : 'Por favor, informe seu nome ou empresa.')
      return
    }

    setValidationError('')
    setSubmitted(true)
    window.open(whatsappUrl, '_blank')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn('Clipboard write failed:', err)
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link to={currentLang === 'en' ? '/en' : '/pt'} className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>{t.backBtn}</span>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.headerSection}>
          <span className={styles.badge}>
            <Sparkles size={14} />
            {t.tag}
          </span>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.contentGrid}>
          {/* Form Side */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {validationError && (
                <div className={styles.alertError}>
                  <ShieldAlert size={16} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Step 1: Name */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="briefing-name">
                  1. {t.fields.name} <span className={styles.required}>*</span>
                </label>
                <input 
                  id="briefing-name"
                  type="text" 
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (validationError) setValidationError('')
                  }}
                  placeholder={t.fields.namePlaceholder}
                  className={styles.textInput}
                  required
                />
              </div>

              {/* Step 2: Project Type */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>2. {t.fields.projectType}</label>
                <div className={styles.chipGrid}>
                  {t.fields.projectTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectType: opt })}
                      className={`${styles.chip} ${formData.projectType === opt ? styles.chipActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Current Stage */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>3. {t.fields.stage}</label>
                <div className={styles.chipStack}>
                  {t.fields.stageOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, stage: opt })}
                      className={`${styles.chip} ${formData.stage === opt ? styles.chipActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Deadline */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>4. {t.fields.deadline}</label>
                <div className={styles.chipGrid}>
                  {t.fields.deadlineOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, deadline: opt })}
                      className={`${styles.chip} ${formData.deadline === opt ? styles.chipActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Budget */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>5. {t.fields.budget}</label>
                <div className={styles.chipGrid}>
                  {t.fields.budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: opt })}
                      className={`${styles.chip} ${formData.budget === opt ? styles.chipActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 6: Details */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="briefing-details">
                  6. {t.fields.details}
                </label>
                <textarea 
                  id="briefing-details"
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={t.fields.detailsPlaceholder}
                  className={styles.textareaInput}
                />
              </div>

              {/* Submit CTA */}
              <div className={styles.submitRow}>
                <button 
                  type="submit" 
                  className={styles.submitWhatsappBtn}
                >
                  <MessageCircle size={20} />
                  <span>{t.submitBtn}</span>
                </button>

                <a 
                  href={mailtoBriefingUrl} 
                  className={styles.submitEmailBtn}
                  title={currentLang === 'en' ? 'Open your Email app with this briefing' : 'Abrir aplicativo de E-mail com este briefing'}
                >
                  <Mail size={18} />
                  <span>{currentLang === 'en' ? 'Or send briefing via Email' : 'Ou enviar este briefing por E-mail'}</span>
                </a>
              </div>
            </form>
          </div>

          {/* WhatsApp Preview Side */}
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewHeaderUser}>
                <div className={styles.previewAvatar}>YP</div>
                <div>
                  <div className={styles.previewName}>Yuran Porto</div>
                  <div className={styles.previewStatus}>{currentLang === 'en' ? 'Online • Fast Reply' : 'Online • Resposta rápida'}</div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleCopy}
                className={styles.copyBtn}
                title={t.copyBtn}
              >
                {copied ? <Check size={16} className={styles.copyIconCheck} /> : <Copy size={16} />}
                <span>{copied ? t.copied : t.copyBtn}</span>
              </button>
            </div>

            <div className={styles.previewBody}>
              <span className={styles.previewNotice}>{t.previewTitle}</span>
              
              <div className={styles.whatsappBubble}>
                <pre className={styles.bubbleText}>{formattedMessage}</pre>
                <span className={styles.bubbleTime}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</span>
              </div>
            </div>

            <div className={styles.previewFooter}>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={styles.directLink}
              >
                <span>{currentLang === 'en' ? 'Open WhatsApp Directly' : 'Abrir WhatsApp Diretamente'}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

