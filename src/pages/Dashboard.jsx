import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Dashboard.module.css'
import ProjectModal from '../components/ProjectModal'
import NichePageModal from '../components/NichePageModal'
import { getAllNichePages, deleteNichePage } from '../services/pagesService'
import { CONTACT_CONFIG } from '../config/contact'
import { 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Settings, 
  Upload, 
  Loader2,
  ExternalLink,
  Globe,
  Sparkles,
  MessageCircle,
  Mail,
  CheckCircle2
} from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'profile' | 'settings'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  // Niche pages state
  const [nichePages, setNichePages] = useState({})
  const [isPageModalOpen, setIsPageModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState(null)

  // Contact settings state
  const [contactSettings, setContactSettings] = useState({
    whatsapp: CONTACT_CONFIG.whatsappNumber,
    email: CONTACT_CONFIG.contactEmail
  })
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false)

  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    email: '',
    avatar_url: '',
    social_links: { github: '', linkedin: '' }
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
    fetchProfile()
    fetchNichePages()
  }, [])

  async function fetchNichePages() {
    try {
      const pages = await getAllNichePages()
      setNichePages(pages)
    } catch (err) {
      console.warn('Error fetching niche pages:', err)
    }
  }

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (data) {
      setProfileData({
        ...data,
        social_links: data.social_links || { github: '', linkedin: '' },
        email: data.email || ''
      })
      if (data.avatar_url) setAvatarPreview(data.avatar_url)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return profileData.avatar_url

    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `avatar-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, avatarFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleUpdateProfile() {
    setSavingProfile(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const avatarUrl = await uploadAvatar()
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.full_name,
          bio: profileData.bio,
          email: profileData.email,
          avatar_url: avatarUrl,
          social_links: profileData.social_links,
          updated_at: new Date()
        })

      if (error) throw error
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      alert('Erro ao atualizar perfil')
      console.error(error)
    } finally {
      setSavingProfile(false)
    }
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) console.error('Error fetching projects:', error)
    else setProjects(data)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function handleAddProject() {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  function handleEditProject(project) {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  async function handleDeleteProject(id) {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Erro ao excluir projeto')
      console.error(error)
    } else {
      fetchProjects()
    }
  }

  // Niche Pages Handlers
  function handleAddNichePage() {
    setEditingPage(null)
    setIsPageModalOpen(true)
  }

  function handleEditNichePage(slug, pageData) {
    setEditingPage({ slug, ...pageData })
    setIsPageModalOpen(true)
  }

  async function handleDeleteNichePage(slug) {
    if (!window.confirm(`Tem certeza que deseja remover a apresentação "/${slug}"?`)) return
    await deleteNichePage(slug)
    fetchNichePages()
  }

  function handleSaveContactSettings(e) {
    e.preventDefault()
    CONTACT_CONFIG.whatsappNumber = contactSettings.whatsapp
    CONTACT_CONFIG.contactEmail = contactSettings.email
    setSavedSettingsNotice(true)
    setTimeout(() => setSavedSettingsNotice(false), 3000)
  }

  return (
    <div className={styles.container}>
      {/* Project Modal */}
      {isModalOpen && (
        <ProjectModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
          onSave={fetchProjects}
        />
      )}

      {/* Niche Page Configuration Modal */}
      {isPageModalOpen && (
        <NichePageModal 
          page={editingPage}
          onClose={() => setIsPageModalOpen(false)}
          onSave={fetchNichePages}
        />
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>YP</div>
          <span>Admin<strong>Panel</strong></span>
        </div>

        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'projects' ? styles.active : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderGit2 size={20} /> Projetos
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Perfil
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Tab 1: Projects */}
        {activeTab === 'projects' && (
          <div className={styles.contentFade}>
            <header className={styles.pageHeader}>
              <div>
                <h1>Meus Projetos</h1>
                <p>Gerencie os projetos exibidos no seu portfólio.</p>
              </div>
              <button onClick={handleAddProject} className={styles.primaryBtn}>
                <Plus size={20} /> Novo Projeto
              </button>
            </header>

            <div className={styles.grid}>
              {projects.length === 0 ? (
                <div className={styles.emptyState}>
                  <LayoutDashboard size={48} opacity={0.2} />
                  <p>Nenhum projeto cadastrado no banco ainda.</p>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={styles.card}>
                    <div className={styles.cardImage}>
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} />
                      ) : (
                        <div className={styles.imagePlaceholder}>Sem Imagem</div>
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{project.title}</h3>
                      <p>{project.description?.substring(0, 80)}...</p>
                      <div className={styles.tags}>
                        {project.tech_stack?.slice(0,3).map(tech => (
                          <span key={tech} className={styles.tag}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        onClick={() => handleEditProject(project)} 
                        className={styles.actionBtn} 
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className={styles.actionBtnDanger} 
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <div className={styles.contentFade}>
            <header className={styles.pageHeader}>
              <div>
                <h1>Editar Perfil</h1>
                <p>Atualize suas informações pessoais e bio.</p>
              </div>
              <button 
                onClick={handleUpdateProfile} 
                className={styles.primaryBtn}
                disabled={savingProfile}
              >
                {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </header>
            
            <div className={styles.formCard}>
              <div className={styles.inputGroup}>
                <label>Foto de Perfil (Sobre Mim)</label>
                <div 
                  style={{
                    width: '120px', 
                    height: '120px', 
                    border: '2px dashed #334155', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: avatarPreview ? `url(${avatarPreview}) center/cover no-repeat` : '#0f172a',
                    marginBottom: '1rem'
                  }}
                  onClick={() => document.getElementById('avatarInput').click()}
                >
                  {!avatarPreview && <Upload size={24} color="#64748b" />}
                  <input 
                    id="avatarInput" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    hidden 
                  />
                </div>
                {avatarPreview && (
                   <button 
                     type="button" 
                     onClick={() => document.getElementById('avatarInput').click()} 
                     className={styles.actionBtn}
                     style={{width: 'fit-content', fontSize: '0.8rem'}}
                   >
                     Alterar Foto
                   </button>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Nome Completo</label>
                <input 
                  value={profileData.full_name || ''} 
                  onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                  placeholder="Seu nome"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Bio (Home)</label>
                <textarea 
                  value={profileData.bio || ''} 
                  onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  placeholder="Um breve resumo sobre você..."
                />
              </div>

              <div className={styles.sectionDivider}>
                 <h3>Contato & Redes Sociais</h3>
              </div>

              <div className={styles.inputGroup}>
                <label>E-mail de Contato</label>
                <input 
                  type="email"
                  value={profileData.email || ''} 
                  onChange={e => setProfileData({...profileData, email: e.target.value})}
                  placeholder="seu@email.com"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>GitHub URL</label>
                  <input 
                    value={profileData.social_links?.github || ''} 
                    onChange={e => setProfileData({
                      ...profileData, 
                      social_links: { ...profileData.social_links, github: e.target.value }
                    })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>LinkedIn URL</label>
                  <input 
                    value={profileData.social_links?.linkedin || ''} 
                    onChange={e => setProfileData({
                      ...profileData, 
                      social_links: { ...profileData.social_links, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Settings & Niche Landing Pages */}
        {activeTab === 'settings' && (
          <div className={styles.contentFade}>
            <header className={styles.pageHeader}>
              <div>
                <h1>Configurações do Portfólio</h1>
                <p>Gerencie páginas de prospecção nichadas e canais de atendimento.</p>
              </div>
            </header>

            <div className={styles.settingsContainer}>
              {/* Section 1: Subpages / Niche Landing Pages */}
              <div className={styles.settingsCard}>
                <div className={styles.settingsCardHeader}>
                  <div>
                    <h2>Páginas de Apresentação & Nichos</h2>
                    <p>Subpáginas personalizadas para prospecção ativa de empresas (Ex: Oficinas, Clínicas, etc.)</p>
                  </div>
                  <button onClick={handleAddNichePage} className={styles.primaryBtn}>
                    <Plus size={18} /> Nova Página de Nicho
                  </button>
                </div>

                <div className={styles.pagesList}>
                  {Object.keys(nichePages).length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>Nenhuma página configurada ainda.</p>
                  ) : (
                    Object.entries(nichePages).map(([slug, pageData]) => {
                      const pt = pageData.pt || pageData
                      const title = pt.metaTitle?.split('|')[0] || pageData.title || slug
                      const category = pageData.category || pt.badge || 'Solução'
                      const pageUrl = `/${slug}`

                      return (
                        <div key={slug} className={styles.pageItem}>
                          <div className={styles.pageItemInfo}>
                            <div className={styles.pageItemHeader}>
                              <span className={styles.pageItemTitle}>{title}</span>
                              <span className={styles.categoryTag}>{category}</span>
                            </div>
                            <span className={styles.pageItemSlug}>yuranporto.com.br{pageUrl}</span>
                          </div>

                          <div className={styles.pageItemActions}>
                            <a 
                              href={pageUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className={styles.viewPageBtn}
                              title="Visualizar Página ao Vivo"
                            >
                              <ExternalLink size={15} />
                              <span>Abrir Página</span>
                            </a>

                            <button 
                              onClick={() => handleEditNichePage(slug, pageData)}
                              className={styles.actionBtn}
                              title="Editar Página"
                            >
                              <Pencil size={17} />
                            </button>

                            {slug !== 'sites-para-oficinas' && (
                              <button 
                                onClick={() => handleDeleteNichePage(slug)}
                                className={styles.actionBtnDanger}
                                title="Excluir Página"
                              >
                                <Trash2 size={17} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Section 2: Contact & WhatsApp Channels */}
              <div className={styles.settingsCard}>
                <div className={styles.settingsCardHeader}>
                  <div>
                    <h2>Canais de Contato & Orçamento</h2>
                    <p>Defina o número do WhatsApp e e-mail que recebem os orçamentos do portfólio e briefing.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveContactSettings}>
                  {savedSettingsNotice && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <CheckCircle2 size={18} />
                      <span>Configurações de contato salvas com sucesso!</span>
                    </div>
                  )}

                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <label>Número do WhatsApp (com DDI e DDD)</label>
                      <input 
                        type="text"
                        value={contactSettings.whatsapp}
                        onChange={e => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                        placeholder="Ex: 5512982096857"
                        required
                      />
                      <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        Formato numérico sem traços ou parênteses (ex: 55 + DDD + número).
                      </small>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>E-mail Oficial para Receber Briefings</label>
                      <input 
                        type="email"
                        value={contactSettings.email}
                        onChange={e => setContactSettings({ ...contactSettings, email: e.target.value })}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryBtn} style={{ marginTop: '0.5rem' }}>
                    Salvar Canais de Contato
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
