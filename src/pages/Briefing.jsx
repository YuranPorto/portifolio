import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './Briefing.module.css'
import { translations } from '../data/translations'
import { CONTACT_CONFIG } from '../config/contact'
import { 
  ArrowLeft, 
  MessageCircle, 
  Sparkles, 
  ShieldAlert, 
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

  const otherLabel = currentLang === 'en' ? 'Other' : 'Outro'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    projectType: t.fields.projectTypeOptions[0],
    customProjectType: '',
    stage: t.fields.stageOptions[0],
    customStage: '',
    deadline: t.fields.deadlineOptions[1],
    customDeadline: '',
    budget: t.fields.budgetOptions[1],
    customBudget: '',
    details: ''
  })

  const [validationError, setValidationError] = useState('')

  // Handle language switch while preserving form data
  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return
    navigate(newLang === 'en' ? '/en/briefing' : '/pt/briefing')
  }

  // Resolve values (either standard option or custom text)
  const resolvedProjectType = useMemo(() => {
    if (formData.projectType === 'Outro' || formData.projectType === 'Other') {
      return formData.customProjectType.trim() || otherLabel
    }
    return formData.projectType
  }, [formData.projectType, formData.customProjectType, otherLabel])

  const resolvedStage = useMemo(() => {
    if (formData.stage === 'Outro' || formData.stage === 'Other') {
      return formData.customStage.trim() || otherLabel
    }
    return formData.stage
  }, [formData.stage, formData.customStage, otherLabel])

  const resolvedDeadline = useMemo(() => {
    if (formData.deadline === 'Outro' || formData.deadline === 'Other') {
      return formData.customDeadline.trim() || otherLabel
    }
    return formData.deadline
  }, [formData.deadline, formData.customDeadline, otherLabel])

  const resolvedBudget = useMemo(() => {
    if (formData.budget === 'Outro' || formData.budget === 'Other') {
      return formData.customBudget.trim() || otherLabel
    }
    return formData.budget
  }, [formData.budget, formData.customBudget, otherLabel])

  // Construct formatted WhatsApp and Email message
  const formattedMessage = useMemo(() => {
    const greeting = t.greeting || 'Olá Yuran! Preenchi o briefing do meu projeto no seu site:'
    const lines = [
      `👋 *${greeting}*`,
      '',
      `👤 *${currentLang === 'en' ? 'Name / Company' : 'Nome / Empresa'}:* ${formData.name.trim() || (currentLang === 'en' ? '[Not specified]' : '[Não informado]')}`,
      `🎯 *${currentLang === 'en' ? 'Project Type' : 'Tipo de Projeto'}:* ${resolvedProjectType}`,
      `📋 *${currentLang === 'en' ? 'Current Stage' : 'Estágio Atual'}:* ${resolvedStage}`,
      `⏱️ *${currentLang === 'en' ? 'Target Timeline' : 'Prazo Desejado'}:* ${resolvedDeadline}`,
      `💰 *${currentLang === 'en' ? 'Planned Investment' : 'Investimento Planejado'}:* ${resolvedBudget}`
    ]

    if (formData.details.trim()) {
      lines.push(`📝 *${currentLang === 'en' ? 'Details & Links' : 'Detalhes & Referências'}:* ${formData.details.trim()}`)
    }

    lines.push('', currentLang === 'en' ? 'Looking forward to hearing your thoughts and next steps!' : 'Gostaria de saber como podemos iniciar!')

    return lines.join('\n')
  }, [formData.name, formData.details, resolvedProjectType, resolvedStage, resolvedDeadline, resolvedBudget, currentLang, t.greeting])

  const whatsappUrl = useMemo(() => {
    const cleanNumber = CONTACT_CONFIG.whatsappNumber.replace(/\D/g, '')
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedMessage)}`
  }, [formattedMessage])

  const mailtoBriefingUrl = useMemo(() => {
    const emailTo = CONTACT_CONFIG.contactEmail
    const subject = `[Briefing ${currentLang.toUpperCase()}] ${formData.name.trim() || (currentLang === 'en' ? 'New Project' : 'Novo Projeto')}`
    return `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedMessage)}`
  }, [formData.name, formattedMessage, currentLang])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setValidationError(currentLang === 'en' ? 'Please enter your name or company.' : 'Por favor, informe seu nome ou empresa.')
      window.scrollTo({ top: 120, behavior: 'smooth' })
      return
    }

    setValidationError('')
    window.open(whatsappUrl, '_blank')
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

        {/* Centralized Form Container */}
        <div className={styles.formContainer}>
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
                {(formData.projectType === 'Outro' || formData.projectType === 'Other') && (
                  <input
                    type="text"
                    value={formData.customProjectType}
                    onChange={(e) => setFormData({ ...formData, customProjectType: e.target.value })}
                    placeholder={t.fields.otherPlaceholder || 'Digite sua resposta...'}
                    className={styles.customTextInput}
                    autoFocus
                  />
                )}
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
                {(formData.stage === 'Outro' || formData.stage === 'Other') && (
                  <input
                    type="text"
                    value={formData.customStage}
                    onChange={(e) => setFormData({ ...formData, customStage: e.target.value })}
                    placeholder={t.fields.otherPlaceholder || 'Digite sua resposta...'}
                    className={styles.customTextInput}
                    autoFocus
                  />
                )}
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
                {(formData.deadline === 'Outro' || formData.deadline === 'Other') && (
                  <input
                    type="text"
                    value={formData.customDeadline}
                    onChange={(e) => setFormData({ ...formData, customDeadline: e.target.value })}
                    placeholder={t.fields.otherPlaceholder || 'Digite sua resposta...'}
                    className={styles.customTextInput}
                    autoFocus
                  />
                )}
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
                {(formData.budget === 'Outro' || formData.budget === 'Other') && (
                  <input
                    type="text"
                    value={formData.customBudget}
                    onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                    placeholder={t.fields.otherPlaceholder || 'Digite sua resposta...'}
                    className={styles.customTextInput}
                    autoFocus
                  />
                )}
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

              {/* Action Buttons */}
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
        </div>
      </main>
    </div>
  )
}
