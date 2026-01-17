import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../services/supabase'
import styles from './ProjectModal.module.css'
import { X, Upload, Loader2 } from 'lucide-react'

export default function ProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repo_url: '',
    live_url: '',
    tech_stack: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
        image_url: project.image_url || ''
      })
      setPreviewUrl(project.image_url)
    }
  }, [project])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
    const fileName = `${Math.random()}.${fileExt}`
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
      
      const projectData = {
        title: formData.title,
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
      console.error('Error saving project:', err)
      setError('Erro ao salvar o projeto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }


return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>{project ? 'Editar Projeto' : 'Novo Projeto'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.imageUpload}>
            <div 
              className={styles.previewArea} 
              style={{backgroundImage: `url(${previewUrl})`}}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {!previewUrl && (
                <div className={styles.placeholder}>
                  <Upload size={32} />
                  <span>Carregar Imagem</span>
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

          <div className={styles.inputGroup}>
            <label>Título</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Ex: E-commerce API"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Descrição</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Breve descrição do projeto..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Repositório (GitHub)</label>
              <input 
                name="repo_url" 
                value={formData.repo_url} 
                onChange={handleChange} 
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Link Online (Live)</label>
              <input 
                name="live_url" 
                value={formData.live_url} 
                onChange={handleChange} 
                placeholder="https://meuprojeto.com"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Tecnologias (separadas por vírgula)</label>
            <input 
              name="tech_stack" 
              value={formData.tech_stack} 
              onChange={handleChange} 
              placeholder="Node.js, React, PostgreSQL"
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
