import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'
import { 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Settings 
} from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'profile'
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

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

  return (
    <div className={styles.container}>
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
              <button className={styles.primaryBtn}>
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
                      <button className={styles.actionBtn} title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button className={styles.actionBtnDanger} title="Excluir">
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
              </header>
              <div className={styles.card}>
                 <div className={styles.cardContent}>
                    <p style={{color: '#888'}}>Formulário de perfil em desenvolvimento...</p>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  )
}
