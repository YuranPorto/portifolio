import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './NichePageModal.module.css'
import { saveNichePage } from '../services/pagesService'
import { X, Save, Sparkles, ExternalLink, Globe, Plus, Trash2 } from 'lucide-react'

export default function NichePageModal({ page, onClose, onSave }) {
  const isEditing = !!page?.slug

  const [formData, setFormData] = useState({
    slug: '',
    category: '',
    title: '',
    badge: '',
    headlineStart: 'Transforme clientes da sua região com um ',
    headlineHighlight: 'site profissional de alta conversão.',
    subtitle: 'Pare de depender de indicações lentas. Crio sites modernos, rápidos e focados em WhatsApp para o seu negócio.',
    previewShopName: '',
    previewTagline: '',
    previewHours: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
    previewAddress: 'Av. Principal, 1000 - Centro',
    ctaWhatsapp: 'Solicitar Orçamento no WhatsApp',
    ctaButtonDemo: 'Agendar Atendimento pelo WhatsApp',
    whatsappMsg: '',
    servicesList: 'Serviço Especializado 1, Serviço Especializado 2, Avaliação Completa, Atendimento VIP'
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (page) {
      const ptData = page.pt || page
      setFormData({
        slug: page.slug || '',
        category: page.category || ptData.badge?.replace('Solução Especializada para ', '') || '',
        title: ptData.metaTitle?.split('|')[0]?.trim() || page.title || '',
        badge: ptData.badge || '',
        headlineStart: ptData.headlineStart || 'Transforme clientes da sua região com um ',
        headlineHighlight: ptData.headlineHighlight || '',
        subtitle: ptData.subtitle || '',
        previewShopName: ptData.demo?.previewShopName || '',
        previewTagline: ptData.demo?.previewTagline || '',
        previewHours: ptData.demo?.previewHours || 'Segunda a Sexta: 08h às 18h',
        previewAddress: ptData.demo?.previewAddress || 'Av. Principal, 1000',
        ctaWhatsapp: ptData.ctaWhatsapp || 'Solicitar Orçamento no WhatsApp',
        ctaButtonDemo: ptData.demo?.ctaButtonDemo || 'Agendar Atendimento pelo WhatsApp',
        whatsappMsg: ptData.ctaBanner?.whatsappMsg || '',
        servicesList: ptData.demo?.services ? ptData.demo.services.map(s => s.title).join(', ') : 'Serviço 1, Serviço 2, Serviço 3'
      })
    }
  }, [page])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSlugChange = (e) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/[^\w-]/g, '')
    setFormData(prev => ({ ...prev, slug: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.slug.trim()) {
      setError('Por favor, informe a URL amigável (slug) da página.')
      return
    }
    if (!formData.title.trim()) {
      setError('Por favor, informe o título da página / nicho.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const servicesArray = formData.servicesList
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(title => ({
          title,
          desc: `Atendimento e execução técnica com alto padrão de qualidade e garantia.`,
          icon: 'ShieldCheck'
        }))

      const payload = {
        slug: formData.slug.trim().replace(/^\//, ''),
        category: formData.category || 'Empresas & Serviços',
        title: formData.title,
        badge: formData.badge || `Solução Especializada para ${formData.category || 'Empresas'}`,
        headlineStart: formData.headlineStart,
        headlineHighlight: formData.headlineHighlight,
        subtitle: formData.subtitle,
        previewShopName: formData.previewShopName || formData.title,
        previewTagline: formData.previewTagline || 'Atendimento de Excelência com Especialistas',
        previewHours: formData.previewHours,
        previewAddress: formData.previewAddress,
        ctaWhatsapp: formData.ctaWhatsapp,
        ctaButtonDemo: formData.ctaButtonDemo,
        whatsappMsg: formData.whatsappMsg || `Olá Yuran! Vi a apresentação de sites para ${formData.category || 'meu nicho'} e gostaria de solicitar um orçamento.`,
        services: servicesArray
      }

      await saveNichePage(payload)
      if (onSave) onSave()
      onClose()
    } catch (err) {
      console.error('Error saving page:', err)
      setError('Ocorreu um erro ao salvar a página. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <div>
            <span className={styles.headerBadge}>
              <Sparkles size={13} />
              {isEditing ? 'Editar Apresentação' : 'Nova Apresentação de Nicho'}
            </span>
            <h2 className={styles.modalTitle}>
              {isEditing ? `Editar: /${formData.slug}` : 'Configurar Nova Página de Nicho'}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Section 1: URL & Identificação */}
          <div className={styles.sectionTitleGroup}>
            <h3>1. Endereço & Categoria</h3>
            <p>Defina o link e como o nicho será categorizado no portfólio.</p>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>URL Amigável (Slug) <span className={styles.req}>*</span></label>
              <div className={styles.slugInputWrapper}>
                <span className={styles.slugPrefix}>yuranporto.com.br/</span>
                <input 
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="ex: sites-para-clinicas"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Categoria do Nicho <span className={styles.req}>*</span></label>
              <input 
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Saúde & Clínicas, Advocacia, Restaurantes"
                required
              />
            </div>
          </div>

          {/* Section 2: Headline & Chamada */}
          <div className={styles.sectionTitleGroup}>
            <h3>2. Chamada Principal (Hero)</h3>
            <p>O que o cliente do nicho lê no primeiro segundo ao abrir a página.</p>
          </div>

          <div className={styles.inputGroup}>
            <label>Título da Página / Meta Title <span className={styles.req}>*</span></label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Sites de Alta Performance para Clínicas Médicas"
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>Início da Chamada</label>
              <input 
                name="headlineStart"
                value={formData.headlineStart}
                onChange={handleChange}
                placeholder="Ex: Conquiste mais pacientes com um "
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Destaque em Verde Esmeralda</label>
              <input 
                name="headlineHighlight"
                value={formData.headlineHighlight}
                onChange={handleChange}
                placeholder="Ex: site médico moderno e humanizado."
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Subtítulo / Proposta de Valor</label>
            <textarea 
              name="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Descreva por que ter esse site vai gerar mais agendamentos e autoridade..."
            />
          </div>

          {/* Section 3: Demonstração do Site Modelo */}
          <div className={styles.sectionTitleGroup}>
            <h3>3. Demonstração Interativa (Site Modelo)</h3>
            <p>Dados simulados que aparecem na tela do navegador demonstrativo.</p>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>Nome da Empresa Demo</label>
              <input 
                name="previewShopName"
                value={formData.previewShopName}
                onChange={handleChange}
                placeholder="Ex: Clínica MedVida Saúde Integrada"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Slogan da Empresa Demo</label>
              <input 
                name="previewTagline"
                value={formData.previewTagline}
                onChange={handleChange}
                placeholder="Ex: Consultas Especializadas, Exames e Checkups com Agilidade"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>Horário de Atendimento da Demo</label>
              <input 
                name="previewHours"
                value={formData.previewHours}
                onChange={handleChange}
                placeholder="Ex: Seg a Sex: 07h às 19h | Sáb: 08h às 13h"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Endereço Fictício da Demo</label>
              <input 
                name="previewAddress"
                value={formData.previewAddress}
                onChange={handleChange}
                placeholder="Ex: Av. Brasil, 1500 - Sala 402 - Centro Médico"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Serviços em Destaque na Demo (separados por vírgula)</label>
            <input 
              name="servicesList"
              value={formData.servicesList}
              onChange={handleChange}
              placeholder="Ex: Cardiologia, Pediatria, Dermatologia, Checkup Geral"
            />
          </div>

          {/* Section 4: WhatsApp & Conversão */}
          <div className={styles.sectionTitleGroup}>
            <h3>4. Conversão & Mensagem no WhatsApp</h3>
            <p>Configuração do clique de solicitação de orçamento.</p>
          </div>

          <div className={styles.inputGroup}>
            <label>Mensagem Pré-formatada que o Cliente vai Enviar no seu WhatsApp</label>
            <textarea 
              name="whatsappMsg"
              rows={2}
              value={formData.whatsappMsg}
              onChange={handleChange}
              placeholder="Ex: Olá Yuran! Vi a apresentação de sites para clínicas e gostaria de solicitar um orçamento para o meu consultório."
            />
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={styles.saveBtn}
            >
              <Save size={18} />
              <span>{saving ? 'Salvando...' : 'Salvar Página de Nicho'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

