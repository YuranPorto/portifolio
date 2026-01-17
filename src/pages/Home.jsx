import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import styles from './Home.module.css'
import ContactModal from '../components/ContactModal'
import { Github, Linkedin, Mail, ExternalLink, Code2, Database, Cloud, Terminal, Menu, X } from 'lucide-react'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    // Fetch Projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!projectsError && projectsData) {
      setProjects(projectsData)
    }

    // Fetch Profile (Limit to the first one found or specific logic if multi-user)
    // Since this is a portfolio for one person, we'll just take the first profile we find or specific ID if known.
    // For now, let's grab the first row from profiles.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    if (!profileError && profileData) {
      setProfile(profileData)
    }
  }

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>{profile?.full_name || 'YuranPorto'}</div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className={styles.menuToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <a href="#about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Sobre</a>
          <a href="#skills" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Skills</a>
          <a href="#projects" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Projetos</a>
          
          <button 
            onClick={() => {
              setIsContactOpen(true);
              setIsMenuOpen(false);
            }}
            className={styles.ctaBtn}
            style={{border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
          >
            Contato
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Back-end Developer & API Specialist</span>
          <h1 className={styles.title}>
            Construindo soluções robustas<br/>e escaláveis para a web.
          </h1>
          <p className={styles.subtitle}>
            Especialista em criar APIs de alto desempenho, arquitetura de software e soluções em nuvem. 
            Transformando regras de negócio complexas em código limpo e eficiente.
          </p>
          
          <div className={styles.socialLinks}>
            {profile?.social_links?.github && (
              <a href={profile.social_links.github} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Github size={28} />
              </a>
            )}
            {profile?.social_links?.linkedin && (
              <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Linkedin size={28} />
              </a>
            )}
            {profile?.email && (
              <button 
                onClick={() => setIsContactOpen(true)}
                className={styles.socialIcon}
                style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
              >
                <Mail size={28} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <div className={styles.aboutGrid}>
            <div className={styles.aboutImageWrapper}>
                <img 
                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=3540&auto=format&fit=crop"} 
                    alt={profile?.full_name || "Setup"} 
                    className={styles.aboutImage}
                />
            </div>
            <div className={styles.aboutContent}>
                <h2>Sobre Mim</h2>
                <div style={{color: '#94a3b8', lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-line'}}>
                  {profile?.bio || "Carregando sobre mim..."}
                </div>
            </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`${styles.section} ${styles.skillsSection}`}>
        <h2 className={styles.sectionTitle}>Tecnologias que Domino</h2>
        <div className={styles.skillsGrid}>
            <SkillCard icon={<Code2 />} title="Back-end" desc="Node.js, C#, PHP" />
            <SkillCard icon={<Database />} title="Banco de Dados" desc="PostgreSQL, MySQL, SQL Server" />
            <SkillCard icon={<Cloud />} title="DevOps & Cloud" desc="AWS, Azure, Docker, CI/CD" />
            <SkillCard icon={<Terminal />} title="Arquitetura" desc="REST, Clean Arch, SOLID" />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.section}>
        <h2 className={styles.sectionTitle}>Projetos em Destaque</h2>
        <div className={styles.projectGrid}>
            {projects.length === 0 ? (
                <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#94a3b8'}}>
                    Carregando projetos ou nenhum projeto cadastrado...
                </p>
            ) : (
                projects.map(project => (
                    <div key={project.id} className={styles.projectCard}>
                        <img 
                            src={project.image_url || 'https://via.placeholder.com/400x200'} 
                            alt={project.title} 
                            className={styles.projectImg}
                        />
                        <div className={styles.projectContent}>
                            <div className={styles.projectTags}>
                                {project.tech_stack?.map(tech => (
                                    <span key={tech} className={styles.tag}>{tech}</span>
                                ))}
                            </div>
                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <p className={styles.projectDesc}>{project.description}</p>
                            <div className={styles.projectLinks}>
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                        <Github size={18} /> Código
                                    </a>
                                )}
                                {project.live_url && (
                                    <a href={project.live_url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                        <ExternalLink size={18} /> Acessar
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer style={{textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <p style={{color: '#64748b'}}>© 2024 Yuran Porto. Todos os direitos reservados.</p>
      </footer>

      {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
    </div>
  )
}

function SkillCard({ icon, title, desc }) {
    return (
        <div className={styles.skillCard}>
            <div className={styles.skillIcon}>{icon}</div>
            <div>
                <div className={styles.skillName}>{title}</div>
                <div style={{color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem'}}>{desc}</div>
            </div>
        </div>
    )
}
