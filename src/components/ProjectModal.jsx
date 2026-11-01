import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../services/supabase'
import styles from './ProjectModal.module.css'
import { getAllNichePages } from '../services/pagesService'
import { X, Upload, Loader2, Plus, Tag } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  'Oficinas & Automotivo',
  'Startups & SaaS',
  'Fintech & Vendas',
  'Engenharia & Back-end',
  'Saúde & Clínicas',
  'Advocacia & Jurídico',
  'E-commerce & Varejo'
]

export default function ProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    description: '',
    repo_url: '',
    live_url: '',
    niche_url: '',
    tech_stack: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableCategories, setAvailableCategories] = useState(DEFAULT_CATEGORIES)
  const [availablePages, setAvailablePages] = useState([])
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  useEffect(() => {
    async function loadOptions() {
      try {
        const pages = await getAllNichePages()
        const slugs = Object.keys(pages)
        setAvailablePages(slugs)

        const pageCategories = Object.values(pages)
          .map(p => p.category || p.pt?.badge?.replace('Solução Especializada para ', '') || '')
          .filter(Boolean)

        const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...pageCategories]))
        setAvailableCategories(merged)
      } catch (err) {
        console.warn('Could not load niche pages options:', err)
      }
    }
    loadOptions()
  }, [])

  useEffect(() => {
    if (project) {
      const isKnown = availableCategories.includes(project.category)
      setFormData({
        title: project.title || '',
        category: project.category || availableCategories[0],
        customCategory: isKnown ? '' : (project.category || ''),
        description: project.description || '',
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        niche_url: project.niche_url || '',
        tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
        image_url: project.image_url || ''
      })
      setIsCustomCategory(!isKnown && !!project.category)
      setPreviewUrl(project.image_url)
    } else {
      setFormData(prev => ({ ...prev, category: availableCategories[0] || 'Oficinas & Automotivo' }))
    }
  }, [project, availableCategories])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCategorySelect = (e) => {
    const val = e.target.value
    if (val === '__custom__') {
      setIsCustomCategory(true)
      setFormData(prev => ({ ...prev, category: '__custom__' }))
    } else {
      setIsCustomCategory(false)
      setFormData(prev => ({ ...prev, category: val, customCategory: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `project-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, imageFile)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const imageUrl = await uploadImage()
      const finalCategory = isCustomCategory ? (formData.customCategory.trim() || 'Geral') : formData.category
      
      const projectData = {
        title: formData.title,
        category: finalCategory,
        description: formData.description,
        repo_url: formData.repo_url,
        live_url: formData.live_url,
        tech_stack: formData.tech_stack.split(',').map(tech => tech.trim()).filter(t => t),
        image_url: imageUrl,
        user_id: (await supabase.auth.getUser()).data.user.id
      }

      let error
      if (project?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
        error = updateError
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('projects')
          .insert([projectData])
        error = insertError
      }

      if (error) throw error

      onSave()
      onClose()
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h2>{project ? 'Editar Projeto' : 'Novo Projeto'}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.imageUploadGroup}>
            <label>Capa do Projeto</label>
            <div 
              className={styles.previewArea} 
              style={{backgroundImage: `url(${previewUrl})`}}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {!previewUrl && (
                <div className={styles.placeholder}>
                  <Upload size={32} />
                  <span>Carregar Imagem de Capa</span>
                </div>
              )}
              <input 
                id="imageInput" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                hidden 
              />
            </div>
            {previewUrl && (
              <button 
                type="button" 
                onClick={() => document.getElementById('imageInput').click()} 
                className={styles.changeImgBtn}
              >
                Alterar Capa
              </button>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Título do Projeto *</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Ex: AutoTech Centro Automotivo"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Categoria do Projeto *</label>
              <select 
                value={isCustomCategory ? '__custom__' : formData.category}
                onChange={handleCategorySelect}
                className={styles.categorySelect}
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">+ Digitar outra categoria...</option>
              </select>

              {isCustomCategory && (
                <input 
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  placeholder="Digite o nome da nova categoria..."
                  className={styles.customCatInput}
                  autoFocus
                  required
                />
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Descrição do Projeto</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Breve descrição do projeto, objetivos e diferenciais..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Link Online (Live ou Rota de Apresentação)</label>
              <input 
                name="live_url" 
                value={formData.live_url} 
                onChange={handleChange} 
                placeholder="https://exemplo.com ou /sites-para-oficinas"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Repositório (GitHub - Opcional)</label>
              <input 
                name="repo_url" 
                value={formData.repo_url} 
                onChange={handleChange} 
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Tecnologias Utilizadas (separadas por vírgula)</label>
            <input 
              name="tech_stack" 
              value={formData.tech_stack} 
              onChange={handleChange} 
              placeholder="React, Vite, Google Maps, WhatsApp CAPI"
            />
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              {loading ? (
                <><Loader2 className={styles.spin} size={18} /> Salvando...</>
              ) : (
                'Salvar Projeto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
