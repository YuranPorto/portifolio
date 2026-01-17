import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'
import ProjectModal from '../components/ProjectModal'
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
  Loader2
} from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'profile'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
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
  }, [])

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
    console.log('Opening project modal...')
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

  return (
    <div className={styles.container}>
      {/* Modal */}
      {isModalOpen && (
        <ProjectModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
          onSave={fetchProjects}
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
          <button className={styles.navItem}>
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
                  <p>Nenhum projeto cadastrado ainda.</p>
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
      </main>
    </div>
  )
}
