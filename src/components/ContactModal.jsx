import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './ContactModal.module.css'
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react'

export default function ContactModal({ onClose }) {
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
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to send email')

      setStatus('success')
      // Auto close after success
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Entre em Contato</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </header>

        {status === 'success' ? (
          <div className={styles.successMessage}>
            <CheckCircle2 size={48} style={{margin: '0 auto 1rem', display: 'block'}} />
            <h3>Mensagem Enviada!</h3>
            <p>Obrigado pelo contato. Responderei em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {status === 'error' && (
              <div className={styles.errorMessage}>
                Erro ao enviar mensagem. Por favor, tente novamente ou use o e-mail direto.
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Seu Nome</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Ex: João Silva"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Seu E-mail</label>
              <input 
                type="email"
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="exemplo@email.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Mensagem</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows={4}
                placeholder="Olá Yuran, gostaria de falar sobre um projeto..."
              />
            </div>

            <div className={styles.footer}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={status === 'sending'} 
                className={styles.sendBtn}
              >
                {status === 'sending' ? (
                  <><Loader2 className={styles.spin} size={18} /> Enviando...</>
                ) : (
                  <><Send size={18} /> Enviar Mensagem</>
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
