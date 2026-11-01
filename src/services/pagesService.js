import { supabase } from './supabase'
import { nicheLandingPages as defaultNichePages } from '../data/nicheLandingPages'

const STORAGE_KEY = 'custom_niche_landing_pages'

/**
 * Normalizes page object into format expected by NicheLanding component
 */
export function normalizePageData(raw) {
  if (!raw) return null

  // If already structured with pt/en
  if (raw.pt) return raw

  // Otherwise convert flat admin form fields into standard structure
  return {
    pt: {
      metaTitle: `${raw.title} | Yuran Porto`,
      metaDescription: raw.subtitle || 'Site de alta performance sob medida para o seu negócio.',
      badge: raw.badge || `Solução Especializada para ${raw.category || 'Empresas'}`,
      headlineStart: raw.headlineStart || 'Atraia mais clientes e transmita autoridade com um ',
      headlineHighlight: raw.headlineHighlight || raw.title || 'site profissional sob medida.',
      subtitle: raw.subtitle || 'Pare de depender de templates lentos. Crio sites rápidos, modernos e focados em WhatsApp para o seu negócio.',
      ctaWhatsapp: raw.ctaWhatsapp || 'Solicitar Orçamento no WhatsApp',
      ctaSecondary: 'Ver Demonstração Interativa',
      metrics: raw.metrics || [
        { value: '+80%', label: 'dos clientes pesquisam no Google antes de entrar em contato' },
        { value: '< 1s', label: 'Carregamento instantâneo no celular, sem travar' },
        { value: '100%', label: 'Focado em cliques diretos para agendamento no seu WhatsApp' },
        { value: 'Google Maps', label: 'Integração para traçar rota direta até seu endereço' },
      ],
      demo: {
        tag: 'DEMONSTRAÇÃO AO VIVO',
        title: 'Como fica a experiência do seu cliente ao acessar seu site',
        subtitle: 'Um design moderno, limpo e direto ao ponto que transmite credibilidade imediata.',
        previewShopName: raw.previewShopName || raw.title || 'Sua Empresa Modelo',
        previewTagline: raw.previewTagline || 'Atendimento de Excelência e Especialistas Qualificados',
        previewRating: '4.9 ★ (Mais de 250 avaliações no Google)',
        previewHours: raw.previewHours || 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
        previewAddress: raw.previewAddress || 'Av. Principal da Cidade, 1000 - Centro',
        ctaButtonDemo: raw.ctaButtonDemo || 'Agendar Atendimento pelo WhatsApp',
        services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : [
          { title: 'Serviço Principal 1', desc: 'Atendimento especializado com rapidez e garantia de qualidade.', icon: 'ShieldCheck' },
          { title: 'Serviço Principal 2', desc: 'Tecnologia de ponta e equipe treinada para o melhor resultado.', icon: 'Cpu' },
          { title: 'Diagnóstico & Consultoria', desc: 'Avaliação completa das necessidades com orçamento transparente.', icon: 'Wrench' },
          { title: 'Atendimento Personalizado', desc: 'Suporte dedicado e acompanhamento do início ao fim.', icon: 'Clock' },
          { title: 'Manutenção & Preventiva', desc: 'Evite surpresas com planos sob medida para sua necessidade.', icon: 'Gauge' },
          { title: 'Garantia de Qualidade', desc: 'Total segurança e conformidade com as melhores práticas.', icon: 'CheckCircle' },
        ],
        trustPills: [
          'Garantia em todos os serviços',
          'Atendimento ágil pelo WhatsApp',
          'Orçamento transparente sem custos ocultos',
          'Avaliações reais comprovadas'
        ]
      },
      benefits: {
        tag: 'POR QUE INVESTIR?',
        title: `Os benefícios reais de um site profissional para ${raw.category || 'sua empresa'}`,
        subtitle: 'Seus clientes querem certeza de que estão lidando com uma empresa séria e confiável.',
        cards: Array.isArray(raw.benefits) && raw.benefits.length > 0 ? raw.benefits : [
          { title: 'Confiança imediata para novos clientes', desc: 'Quem não conhece sua empresa julga pela apresentação na internet. Um site profissional elimina desconfiança.', icon: 'CheckCircle' },
          { title: 'Mais orçamentos qualificados no WhatsApp', desc: 'O botão de WhatsApp fica sempre visível e com mensagem já configurada para facilitar a resposta.', icon: 'MessageCircle' },
          { title: 'Destaque no Google Maps e buscas locais', desc: 'Quando alguém da sua cidade procurar pelo seu serviço, sua empresa estará no topo das pesquisas.', icon: 'MapPin' },
          { title: 'Fim das dúvidas repetitivas no telefone', desc: 'Endereço, horários, catálogo de serviços e formas de pagamento ficam claros 24 horas por dia.', icon: 'Clock' }
        ]
      },
      whatsIncluded: {
        tag: 'PACOTE COMPLETO',
        title: 'O que está incluso no projeto do seu site?',
        subtitle: 'Você não precisa se preocupar com tecnologia. Entrego tudo pronto para receber clientes.',
        items: Array.isArray(raw.whatsIncluded) && raw.whatsIncluded.length > 0 ? raw.whatsIncluded : [
          { title: 'Design exclusivo com a identidade da sua marca', desc: 'Cores, logomarca e fotos organizadas de forma moderna e atraente.' },
          { title: '100% Otimizado para Smartphones', desc: 'Mais de 85% dos seus clientes vão acessar pelo celular na rua ou em casa.' },
          { title: 'Botão Flutuante de WhatsApp inteligente', desc: 'Com mensagem automática pré-configurada para agilizar o atendimento.' },
          { title: 'Localização Google Maps & Rotas GPS', desc: 'Facilidade para seu cliente traçar a rota com um único toque.' },
          { title: 'Carregamento ultrarrápido (< 1 segundo)', desc: 'Código limpo de alta performance para não perder nenhum clique.' },
          { title: 'Domínio próprio e Certificado SSL de Segurança', desc: 'Seu endereço oficial na web protegido com cadeado seguro de criptografia.' }
        ]
      },
      process: {
        tag: 'PASSO A PASSO',
        title: 'Como funciona o desenvolvimento? (Rápido e direto ao ponto)',
        subtitle: 'Não tomo o seu tempo de trabalho. Um fluxo ágil em 4 passos:',
        steps: [
          { number: '01', title: 'Alinhamento Rápido', desc: 'Coletamos os serviços que você quer destacar, fotos e contatos em 15 minutos.' },
          { number: '02', title: 'Design & Textos Persuasivos', desc: 'Escrevo os textos comerciais e monto o visual focado em conversão.' },
          { number: '03', title: 'Programação de Alta Performance', desc: 'Codifico o site com velocidade extrema e integrações de mapas e botões.' },
          { number: '04', title: 'Publicação & Testes', desc: 'Seu site entra no ar pronto para receber clientes no WhatsApp.' }
        ]
      },
      faq: {
        tag: 'DÚVIDAS FREQUENTES',
        title: 'Perguntas comuns sobre o projeto',
        items: [
          { q: 'Em quanto tempo o site fica pronto?', a: 'Geralmente entre 5 e 10 dias úteis após o envio das informações básicas.' },
          { q: 'Como os clientes entram em contato?', a: 'Através de botões de WhatsApp inteligentes estrategicamente distribuídos pela página.' },
          { q: 'O site funciona bem em celulares mais simples?', a: 'Sim! É desenvolvido com código ultraleve que carrega em menos de 1 segundo mesmo em 3G/4G.' }
        ]
      },
      ctaBanner: {
        tag: 'VAMOS INICIAR SEU PROJETO?',
        title: `Pronto para destacar sua empresa da concorrência?`,
        subtitle: 'Clique no botão abaixo para conversarmos no WhatsApp e receber uma proposta personalizada.',
        whatsappMsg: raw.whatsappMsg || `Olá Yuran! Vi a apresentação de sites para ${raw.category || 'meu nicho'} e gostaria de solicitar um orçamento.`
      }
    },
    en: {
      metaTitle: `${raw.title} | Yuran Porto`,
      metaDescription: raw.subtitle || 'High-performance landing page tailored for your business.',
      badge: raw.badge || `Specialized Solution for ${raw.category || 'Businesses'}`,
      headlineStart: raw.headlineStart || 'Attract more clients and build immediate authority with a ',
      headlineHighlight: raw.headlineHighlight || raw.title || 'tailored high-converting website.',
      subtitle: raw.subtitle || 'Stop losing visitors to sluggish templates. I build sub-second, custom-engineered landing pages designed for high conversion.',
      ctaWhatsapp: raw.ctaWhatsapp || 'Request Quote on WhatsApp',
      ctaSecondary: 'View Interactive Demo',
      metrics: [
        { value: '+80%', label: 'of customers search online before making a booking' },
        { value: '< 1s', label: 'Ultra-fast load times on any cellular connection' },
        { value: '100%', label: 'Engineered for direct inquiries and call actions' },
        { value: 'Google Maps', label: 'GPS navigation directly to your location' },
      ],
      demo: {
        tag: 'LIVE SHOWCASE DEMO',
        title: 'What your customers see when visiting your page',
        subtitle: 'A clean, authoritative layout that builds instant credibility and guides clients directly to contact.',
        previewShopName: raw.previewShopName || raw.title || 'Sample Business Showcase',
        previewTagline: raw.previewTagline || 'Certified Specialists, Premium Care & Transparent Estimates',
        previewRating: '4.9 ★ (250+ Verified Google Reviews)',
        previewHours: raw.previewHours || 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: 8:00 AM - 1:00 PM',
        previewAddress: raw.previewAddress || '1000 Main Street - Downtown',
        ctaButtonDemo: raw.ctaButtonDemo || 'Book Appointment on WhatsApp',
        services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : [
          { title: 'Core Service 1', desc: 'Fast, certified service with top tier satisfaction guarantee.', icon: 'ShieldCheck' },
          { title: 'Core Service 2', desc: 'Modern tools and trained specialists delivering precision outcomes.', icon: 'Cpu' },
          { title: 'Diagnostics & Assessment', desc: 'Comprehensive inspection with upfront transparent pricing.', icon: 'Wrench' },
          { title: 'Dedicated Support', desc: 'Attentive customer care from kickoff to completion.', icon: 'Clock' },
          { title: 'Preventative Care', desc: 'Avoid expensive breakdowns with tailored maintenance plans.', icon: 'Gauge' },
          { title: 'Quality Guarantee', desc: 'Full peace of mind with documented warranties.', icon: 'CheckCircle' },
        ],
        trustPills: [
          'Documented warranty on all services',
          'Fast direct WhatsApp booking',
          'Upfront pricing with zero hidden fees',
          'Verified customer reviews'
        ]
      },
      benefits: {
        tag: 'WHY IT MATTERS',
        title: `The real return of a professional web presence for ${raw.category || 'your business'}`,
        subtitle: 'Your clients want the certainty that they are choosing reputable, proven professionals.',
        cards: [
          { title: 'Instant credibility for first-time visitors', desc: 'First-time visitors judge your skill by your visual presence. A professional page removes hesitations.', icon: 'CheckCircle' },
          { title: 'More qualified bookings on WhatsApp', desc: 'A prominent WhatsApp button lets customers describe their needs and receive immediate responses.', icon: 'MessageCircle' },
          { title: 'Dominate local Google searches', desc: 'When locals search for your services in your area, your page is structured to stand out.', icon: 'MapPin' },
          { title: 'Eliminate repetitive phone inquiries', desc: 'Hours, location, service menu, and FAQs are accessible 24/7.', icon: 'Clock' }
        ]
      },
      whatsIncluded: {
        tag: 'ALL-INCLUSIVE DELIVERABLE',
        title: 'Everything included in your tailored package',
        subtitle: 'Zero technical headache for you. I deliver a turn-key digital asset ready to convert.',
        items: [
          { title: 'Custom Brand Identity & Color Scheme', desc: 'Tailored to your business branding, logos, and real facility photos.' },
          { title: '100% Mobile-First Engineering', desc: 'Over 85% of your customers browse on smartphones.' },
          { title: 'Intelligent Direct WhatsApp Trigger', desc: 'Pre-populated messages so customers start the conversation immediately.' },
          { title: 'Google Maps & GPS 1-Click Navigation', desc: 'Let customers launch GPS routes directly to your door.' },
          { title: 'Sub-Second Load Speed (< 1s)', desc: 'Lightweight hand-coded build so you never lose a click.' },
          { title: 'Custom Domain & SSL Security Padlock', desc: 'Your official web address with green padlock encryption.' }
        ]
      },
      process: {
        tag: 'WORKFLOW',
        title: 'How we build it (Fast and hassle-free)',
        subtitle: 'I respect your daily operations. The workflow is streamlined:',
        steps: [
          { number: '01', title: 'Quick Discovery', desc: 'We gather your core service specialties and shop photos in a brief 15-min chat.' },
          { number: '02', title: 'Design & Persuasive Copy', desc: 'I draft high-converting copy and a sleek layout tailored to client psychology.' },
          { number: '03', title: 'High-Performance Development', desc: 'Hand-coding the site for instant load times, map integrations, and mobile actions.' },
          { number: '04', title: 'Launch & Verification', desc: 'Deploying to your domain and verifying direct lead routing to your WhatsApp.' }
        ]
      },
      faq: {
        tag: 'FAQ',
        title: 'Frequently asked questions',
        items: [
          { q: 'How long until my site is live?', a: 'Typically between 5 to 10 business days once basic info is provided.' },
          { q: 'How do customers reach out?', a: 'Via prominent WhatsApp and phone buttons pre-filled with inquiry details.' },
          { q: 'Does it work well on slower cellular connections?', a: 'Yes! It is hand-coded to load under 1 second even on spotty cellular networks.' }
        ]
      },
      ctaBanner: {
        tag: 'READY TO GROW?',
        title: 'Ready to position your business ahead of competitors?',
        subtitle: 'Click below to message me on WhatsApp. I will analyze your local area and propose the ideal setup.',
        whatsappMsg: raw.whatsappMsg || `Hi Yuran! I checked out your website presentation for ${raw.category || 'my niche'} and would like to request a quote.`
      }
    }
  }
}

/**
 * Loads all custom pages from localStorage and Supabase
 */
export async function getAllNichePages() {
  const customPages = {}

  // 1. Try to read from localStorage first for instant reactivity
  try {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      const parsed = JSON.parse(local)
      Object.assign(customPages, parsed)
    }
  } catch (err) {
    console.warn('Could not read from localStorage:', err)
  }

  // 2. Try to fetch from Supabase if table exists
  try {
    const { data, error } = await supabase
      .from('niche_pages')
      .select('*')
      .eq('active', true)

    if (!error && data && data.length > 0) {
      data.forEach(item => {
        customPages[item.slug] = normalizePageData(item)
      })
    }
  } catch (err) {
    // Table might not exist yet, fallback to localStorage/defaults silently
  }

  // 3. Merge with default built-in templates (e.g. sites-para-oficinas)
  return {
    ...defaultNichePages,
    ...customPages
  }
}

/**
 * Gets a single niche page by slug
 */
export async function getNichePageBySlug(slug) {
  if (!slug) return null
  const all = await getAllNichePages()
  return all[slug] || null
}

/**
 * Saves a page to localStorage and attempts to save to Supabase
 */
export async function saveNichePage(pageData) {
  const slug = pageData.slug.toLowerCase().trim().replace(/^\//, '').replace(/\s+/g, '-')
  const normalized = normalizePageData({ ...pageData, slug })

  // 1. Save to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY)
    const existing = local ? JSON.parse(local) : {}
    existing[slug] = normalized
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch (err) {
    console.error('Error saving page to localStorage:', err)
  }

  // 2. Attempt to save to Supabase table `niche_pages`
  try {
    const dbPayload = {
      slug,
      category: pageData.category,
      title: pageData.title,
      headline_start: pageData.headlineStart,
      headline_highlight: pageData.headlineHighlight,
      subtitle: pageData.subtitle,
      badge: pageData.badge,
      preview_shop_name: pageData.previewShopName,
      preview_tagline: pageData.previewTagline,
      preview_hours: pageData.previewHours,
      preview_address: pageData.previewAddress,
      whatsapp_msg: pageData.whatsappMsg,
      services: pageData.services,
      active: true,
      updated_at: new Date()
    }

    const { error } = await supabase
      .from('niche_pages')
      .upsert(dbPayload, { onConflict: 'slug' })

    if (error) {
      console.warn('Notice: Supabase niche_pages table save deferred or table not found (saved in local store):', error.message)
    }
  } catch (err) {
    console.warn('Supabase save error (local store active):', err)
  }

  return { success: true, slug }
}

/**
 * Deletes a custom page by slug
 */
export async function deleteNichePage(slug) {
  if (!slug) return false

  // 1. Remove from localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      const existing = JSON.parse(local)
      delete existing[slug]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    }
  } catch (err) {
    console.error('Error deleting from localStorage:', err)
  }

  // 2. Remove from Supabase
  try {
    await supabase
      .from('niche_pages')
      .delete()
      .eq('slug', slug)
  } catch (err) {
    console.warn('Error deleting from Supabase:', err)
  }

  return true
}

