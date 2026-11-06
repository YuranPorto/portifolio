import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import styles from './ProjectDetailModal.module.css'
import ScrollableTags from './ScrollableTags'
import { X, ExternalLink, Github, ArrowRight, MessageSquareCode } from 'lucide-react'

export default function ProjectDetailModal({ project, onClose, currentLang = 'pt', briefingPath = '/briefing' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!project) return null

  const isEn = currentLang === 'en'

  return createPortal(
    <div 
      className={styles.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" 
      aria-modal="true"
    >
      <div className={styles.modal}>
        {/* Compact Banner Header */}
        <div className={styles.bannerWrapper}>
          <img 
            src={project.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'} 
            alt={project.title}
            className={styles.bannerImg}
          />
          <div className={styles.bannerGradient} />
          <button 
            type="button" 
            onClick={onClose} 
            className={styles.closeBtn} 
            aria-label={isEn ? 'Close' : 'Fechar'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          <div className={styles.metaRow}>
            {project.category && (
              <span className={styles.categoryTag}>{project.category}</span>
            )}
          </div>

          <h2 className={styles.modalTitle}>{project.title}</h2>

          {/* Tags */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <ScrollableTags tags={project.tech_stack} />
          )}

          {/* Full Description */}
          <div className={styles.descBox}>
            <div className={styles.descLabel}>
              {isEn ? 'Project Overview' : 'Descrição Completa'}
            </div>
            <p className={styles.fullDescription}>
              {project.description || (isEn ? 'No detailed description provided.' : 'Nenhuma descrição detalhada fornecida.')}
            </p>
          </div>

          {/* Access Links / Actions */}
          <div className={styles.actionsSection}>
            <div className={styles.actionsGrid}>
              {project.niche_url ? (
                <Link 
                  to={project.niche_url}
                  onClick={onClose}
                  className={styles.nicheLink}
                >
                  <ExternalLink size={16} />
                  <span>{isEn ? 'View Presentation' : 'Ver Apresentação'}</span>
                </Link>
              ) : project.live_url && project.live_url !== '#' ? (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.primaryLink}
                >
                  <ExternalLink size={16} />
                  <span>{isEn ? 'Access Live Project' : 'Acessar Projeto Online'}</span>
                </a>
              ) : null}

              {project.repo_url && project.repo_url !== '#' && (
                <a 
                  href={project.repo_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.githubLink}
                >
                  <Github size={16} />
                  <span>{isEn ? 'GitHub Repo' : 'Ver Código'}</span>
                </a>
              )}
            </div>

            <Link 
              to={briefingPath}
              onClick={onClose}
              className={styles.briefingPromptLink}
            >
              <MessageSquareCode size={14} />
              <span>
                {isEn 
                  ? 'Interested in a similar solution? Request a quote' 
                  : 'Gostou deste estilo? Solicite um orçamento para seu projeto'}
              </span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

