import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './ContactModal.module.css'
import { X, Send, Loader2, CheckCircle2, Mail, ExternalLink } from 'lucide-react'
import { translations } from '../data/translations'
import { CONTACT_CONFIG } from '../config/contact'

export default function ContactModal({ onClose, lang = 'pt' }) {
  const t = translations[lang]?.contactModal || translations.pt.contactModal

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Approach without SMTP: Direct JSON submission to FormSubmit endpoint
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_CONFIG.contactEmail)}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `[Portfólio ${lang.toUpperCase()}] Nova Proposta: ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      })

      if (!response.ok) {
        throw new Error('Falha no envio do formulário')
      }

      setStatus('success')
      setTimeout(() => {
        onClose()
      }, 3500)
    } catch (error) {
      console.warn('Form submission fallback:', error)
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Fallback mailto link in case network blocks or user prefers native email client
  const mailtoUrl = `mailto:${CONTACT_CONFIG.contactEmail}?subject=${encodeURIComponent(
    `[Projeto ${lang.toUpperCase()}] Contato de ${formData.name || 'Cliente'}`
  )}&body=${encodeURIComponent(
    `Nome: ${formData.name}\nEmail: ${formData.email}\n\nDetalhes do Projeto:\n${formData.message}`
  )}`

  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <div>
            <span className={styles.headerBadge}>
              {lang === 'en' ? 'Direct Message (Zero Spam)' : 'Mensagem Direta'}
            </span>
            <h2 className={styles.modalTitle}>{t.title}</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label={t.close}>
            <X size={20} />
          </button>
        </header>

        {status === 'success' ? (
          <div className={styles.successMessage}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={36} />
            </div>
            <h3>{t.successTitle}</h3>
            <p>{t.successDesc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {status === 'error' && (
              <div className={styles.errorMessage}>
                <p style={{ margin: '0 0 0.5rem 0' }}>{t.error}</p>
                <a 
                  href={mailtoUrl}
                  className={styles.fallbackMailto}
                >
                  <Mail size={16} />
                  <span>{lang === 'en' ? 'Click here to open your Email app' : 'Clique aqui para abrir no seu app de E-mail'}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="contact-name">{t.nameLabel}</label>
              <input 
                id="contact-name"
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder={t.namePlaceholder}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="contact-email">{t.emailLabel}</label>
              <input 
                id="contact-email"
                type="email"
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="contact-message">{t.messageLabel}</label>
              <textarea 
                id="contact-message"
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows={4}
                placeholder={t.messagePlaceholder}
              />
            </div>

            <div className={styles.footer}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                {t.close}
              </button>
              <button 
                type="submit" 
                disabled={status === 'sending'} 
                className={styles.sendBtn}
              >
                {status === 'sending' ? (
                  <><Loader2 className={styles.spin} size={16} /> {t.sendingBtn}</>
                ) : (
                  <><Send size={16} /> {t.submitBtn}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
