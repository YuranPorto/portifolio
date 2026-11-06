/**
 * Project and Category translator for multilingual support (PT / EN).
 */

const CATEGORY_MAP = {
  // PT to EN
  'oficinas & automotivo': 'Auto Repair & Services',
  'oficinas e automotivo': 'Auto Repair & Services',
  'automotivo': 'Auto Repair & Services',
  'oficinas': 'Auto Repair & Services',
  'restaurantes e gastronomia': 'Restaurants & Gastronomy',
  'restaurantes & gastronomia': 'Restaurants & Gastronomy',
  'gastronomia': 'Restaurants & Gastronomy',
  'startups & saas': 'Startups & SaaS',
  'startups e saas': 'Startups & SaaS',
  'fintech & vendas': 'Fintech & Sales',
  'fintech e vendas': 'Fintech & Sales',
  'engenharia & back-end': 'Engineering & Backend',
  'engenharia & backend': 'Engineering & Backend',
  'engenharia e back-end': 'Engineering & Backend',
  'engenharia e backend': 'Engineering & Backend',
  'saúde & clínicas': 'Healthcare & Clinics',
  'saude & clinicas': 'Healthcare & Clinics',
  'saúde e clínicas': 'Healthcare & Clinics',
  'advocacia & jurídico': 'Legal & Law Firms',
  'advocacia e jurídico': 'Legal & Law Firms',
  'e-commerce & varejo': 'E-commerce & Retail',
  'e-commerce e varejo': 'E-commerce & Retail',
  'imobiliárias & corretores': 'Real Estate & Brokers',
  'imobiliarias & corretores': 'Real Estate & Brokers',
  'educação & cursos': 'Education & Courses',
  'educacao & cursos': 'Education & Courses',
  'academias & fitness': 'Gyms & Fitness',
  'empresas & serviços': 'Business & Services',
  'empresas e serviços': 'Business & Services',
  'geral': 'General',

  // EN to PT
  'auto repair & services': 'Oficinas & Automotivo',
  'backend & cloud': 'Engenharia & Back-end',
  'engineering & backend': 'Engenharia & Back-end',
  'fintech & sales': 'Fintech & Vendas',
  'restaurants & gastronomy': 'Restaurantes e Gastronomia',
  'healthcare & clinics': 'Saúde & Clínicas',
  'legal & law firms': 'Advocacia & Jurídico',
  'e-commerce & retail': 'E-commerce & Varejo',
  'real estate & brokers': 'Imobiliárias & Corretores',
  'education & courses': 'Educação & Cursos',
  'gyms & fitness': 'Academias & Fitness',
  'business & services': 'Empresas & Serviços',
  'general': 'Geral'
}

/**
 * Known descriptions translation mapping for portfolio items
 */
const KNOWN_DESCRIPTIONS = [
  {
    keywords: ['oficina', 'centro automotivo', 'agendamento direto no whatsapp', 'gps'],
    en: 'Specialized landing page for auto care centers with instant WhatsApp booking, service menus, and integrated GPS routing.'
  },
  {
    keywords: ['restaurante', 'gastronomia', 'cardápio', 'cardapio', 'pedidos'],
    en: 'Interactive digital menu, table reservations, and delivery orders directly integrated with WhatsApp.'
  },
  {
    keywords: ['startup de dados', 'preview interativo', '0.6s'],
    en: 'High-performance landing page for data startups, with interactive preview and sub-second load times.'
  },
  {
    keywords: ['fintech', 'multimoeda', 'tráfego pago'],
    en: 'Multi-currency checkout landing page engineered for high-volume paid media campaigns and maximum mobile retention.'
  },
  {
    keywords: ['apis & nuvem', 'hub institucional', 'endpoint'],
    en: 'Enterprise developer hub and cloud API portal showcasing resilient system architecture and documentation.'
  }
]

/**
 * Translates a category label to the target language
 */
export function translateCategory(category, targetLang = 'pt') {
  if (!category) return category
  const normalized = category.trim().toLowerCase()

  if (targetLang === 'en') {
    return CATEGORY_MAP[normalized] || category
  } else {
    // If it's in EN and target is PT
    return CATEGORY_MAP[normalized] || category
  }
}

/**
 * Translates project description to English if needed
 */
export function translateDescription(description, title = '', category = '', targetLang = 'pt') {
  if (!description) return ''
  if (targetLang !== 'en') return description

  const lowerDesc = description.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const lowerCat = category.toLowerCase()

  // 1. Check known templates
  for (const item of KNOWN_DESCRIPTIONS) {
    if (item.keywords.some(kw => lowerDesc.includes(kw) || lowerTitle.includes(kw) || lowerCat.includes(kw))) {
      return item.en
    }
  }

  // 2. Common phrase replacements for auto-translation to fluent English
  let enText = description
    .replace(/Página especializada para centros automotivos/gi, 'Specialized landing page for auto care centers')
    .replace(/Página de alta conversão/gi, 'High-converting landing page')
    .replace(/com agendamento direto no WhatsApp/gi, 'with instant WhatsApp booking')
    .replace(/diretamente integrado ao WhatsApp/gi, 'directly integrated with WhatsApp')
    .replace(/catálogo de serviços e rotas GPS integradas/gi, 'service menus and integrated GPS routing')
    .replace(/otimizada para tráfego pago massivo/gi, 'engineered for high-volume paid media traffic')
    .replace(/tempo de abertura de 0.6s/gi, 'sub-second loading speed of 0.6s')
    .replace(/com retenção máxima no mobile/gi, 'with maximum mobile retention')
    .replace(/desenvolvimento sob medida/gi, 'custom engineered development')
    .replace(/para empresas no Brasil e no exterior/gi, 'for companies in Brazil and abroad')
    .replace(/com foco em gerar retorno comercial/gi, 'focused on driving measurable commercial return')

  return enText
}

/**
 * Formats a project object for the current language
 */
export function localizeProject(project, lang = 'pt') {
  if (!project) return project

  const isEn = lang === 'en'

  return {
    ...project,
    // Title and tags stay intact as requested: "o titulo e as tags podem se manter"
    title: project.title,
    tech_stack: project.tech_stack,
    // Category translated
    category: isEn ? translateCategory(project.category, 'en') : project.category,
    // Description translated
    description: isEn 
      ? (project.description_en || translateDescription(project.description, project.title, project.category, 'en'))
      : project.description
  }
}

