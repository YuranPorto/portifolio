export const translations = {
  pt: {
    nav: {
      services: 'Serviços',
      differentials: 'Diferenciais',
      process: 'Processo',
      projects: 'Projetos',
      about: 'Sobre',
      cta: 'Solicitar Orçamento',
    },
    hero: {
      availabilityBadge: 'Disponível para projetos • Brasil & Internacional',
      headlineStart: 'Landing pages de alta conversão construídas com ',
      headlineHighlight: 'engenharia sob medida.',
      subtitle:
        'Elimine templates lentos e genéricos. Crio páginas ultrarrápidas, com design de autoridade e arquitetura sólida para transformar seu tráfego em vendas.',
      ctaPrimary: 'Iniciar um Projeto',
      ctaSecondary: 'Ver Projetos',
      metrics: [
        { value: '< 0.8s', label: 'Carregamento ultrarrápido' },
        { value: '98+', label: 'Score no Google PageSpeed' },
        { value: '100%', label: 'Código sob medida, zero plugins pesados' },
        { value: 'Global', label: 'Clientes no Brasil, EUA e Europa' },
      ],
    },
    services: {
      tag: 'O QUE EU FAÇO',
      title: 'Páginas que vendem e infraestrutura que escala',
      subtitle:
        'Combinando visão estratégica de conversão com padrão de qualidade de engenharia de software.',
      cards: [
        {
          id: 'saas',
          title: 'Landing Pages para Startups & SaaS',
          description:
            'Apresente seu produto com autoridade máxima. Onboarding claro, hierarquia visual precisa e foco total em conversão de trials e demos.',
          features: ['Showcase interativo de features', 'Otimização de funil', 'Design system consistente'],
        },
        {
          id: 'sales',
          title: 'Páginas de Vendas & Lançamentos',
          description:
            'Páginas de alta tensão para tráfego pago (Meta, Google, LinkedIn Ads). Carregamento instantâneo que não queima o seu investimento em mídia.',
          features: ['Mobile-first rigoroso', 'Checkouts integrados', 'Micro-interações de retenção'],
        },
        {
          id: 'redesign',
          title: 'Redesign & Migração de Performance',
          description:
            'Sua página atual em WordPress, Elementor ou Wix está lenta e derrubando leads? Reescrevo em código limpo e moderno para disparar a pontuação no Core Web Vitals.',
          features: ['Redução drástica do custo por lead (CPA)', 'SEO técnico avançado', 'Zero dependências frágeis'],
        },
        {
          id: 'integrations',
          title: 'Integrações de APIs & Automação',
          description:
            'Aproveite a minha base sólida de back-end: conexões seguras com CRMs (HubSpot, RD Station), gateways (Stripe, Mercado Pago), webhooks e pipelines de dados.',
          features: ['Webhooks & Serverless functions', 'Tracking preciso (Pixel, GA4, CAPI)', 'Validação de dados em tempo real'],
        },
      ],
    },
    differentials: {
      tag: 'ENGENHARIA VS. TEMPLATES',
      title: 'Por que empresas contratam um engenheiro de software para suas páginas?',
      subtitle:
        'A maioria dos sites perde 30% a 50% dos visitantes nos primeiros 3 segundos por causa de lentidão e layouts quebrados.',
      bento: [
        {
          title: 'Velocidade que protege o seu ROI',
          description:
            'Cada 100ms a menos no tempo de carregamento aumenta a taxa de conversão em até 8%. Construo páginas em React/Vite com bundles ultra-otimizados que carregam antes que o usuário pense em desistir.',
          tag: 'Performance Extrema',
        },
        {
          title: 'Mobile-First Impecável',
          description:
            'Mais de 80% do seu público compra pelo celular. A experiência mobile é desenhada do zero, com touch-targets confortáveis e navegação fluida.',
          tag: 'Responsividade Real',
        },
        {
          title: 'Arquitetura Resiliente & Segurança',
          description:
            'Páginas preparadas para suportar picos massivos de tráfego em lançamentos e promoções sem cair, com proteção contra spam e validação de ponta a ponta.',
          tag: 'Back-end Robustness',
        },
        {
          title: 'Mensuração & Analytics sem falhas',
          description:
            'Sem scripts duplicados travando a página. Eventos de conversão configurados cirurgicamente no Google Tag Manager, GA4 e Meta Conversions API (CAPI).',
          tag: 'Data & Tracking',
        },
      ],
    },
    process: {
      tag: 'COMO FUNCIONA',
      title: 'Do briefing ao lançamento em dias, sem fricção',
      subtitle: 'Um fluxo ágil, transparente e testado com clientes do mundo todo.',
      steps: [
        {
          step: '01',
          title: 'Diagnóstico & Estratégia',
          desc: 'Análise de público-alvo, proposta de valor, referências visuais e definição dos objetivos de conversão.',
        },
        {
          step: '02',
          title: 'Design UI/UX & Copywriting',
          desc: 'Desenho da interface com foco na psicologia de decisão, hierarquia de leitura e provas sociais.',
        },
        {
          step: '03',
          title: 'Desenvolvimento Sob Medida',
          desc: 'Codificação limpa, animações refinadas, integrações de formulários, CRMs e testes cross-browser.',
        },
        {
          step: '04',
          title: 'Otimização, Testes & Deploy',
          desc: 'Auditoria Lighthouse 95+, configuração de domínio e CDN global rápida para acesso instantâneo em qualquer país.',
        },
      ],
    },
    projects: {
      tag: 'PORTFÓLIO',
      title: 'Projetos e Trabalhos Selecionados',
      subtitle: 'Uma seleção de landing pages, plataformas e sistemas desenvolvidos sob medida.',
      empty: 'Carregando projetos ou nenhum projeto publicado ainda.',
      viewLive: 'Visitar Site',
      viewCode: 'Código Fonte',
      requestDemo: 'Ver Detalhes',
      demoProjects: [
        {
          id: 'demo-1',
          title: 'Landing Page SaaS Analytics',
          description: 'Página de alta conversão para startup de dados, com preview interativo e tempo de abertura de 0.6s.',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['React', 'Vite', 'Tailwind', 'Stripe'],
          live_url: '#',
          repo_url: '#'
        },
        {
          id: 'demo-2',
          title: 'Funil de Vendas Fintech Global',
          description: 'Página de vendas multimoeda otimizada para tráfego pago massivo com retenção máxima no mobile.',
          image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['React', 'Node.js', 'Webhooks', 'Meta CAPI'],
          live_url: '#',
          repo_url: '#'
        },
        {
          id: 'demo-3',
          title: 'Portal de APIs & Nuvem Corporativa',
          description: 'Hub institucional de engenharia para desenvolvedores com arquitetura resiliente e testes de endpoint.',
          image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
          live_url: '#',
          repo_url: '#'
        }
      ]
    },
    about: {
      tag: 'SOBRE MIM',
      title: 'A união entre engenharia técnica e visão de produto',
      p1: 'Sou desenvolvedor de software com profunda experiência em desenvolvimento back-end, arquitetura de sistemas e soluções em nuvem. Ao longo da minha carreira, percebi que o maior gargalo das empresas não era apenas o produto, mas a incapacidade de apresentá-lo de forma rápida, persuasiva e estável na internet.',
      p2: 'Hoje, utilizo esse rigor técnico de engenharia para construir landing pages de alta conversão para empresas e startups no Brasil, Estados Unidos e Europa. Cada projeto é tratado como um produto de software: rápido, seguro, escalável e com foco absoluto em gerar retorno comercial.',
      skillsTitle: 'Stack & Ferramentas',
    },
    ctaBanner: {
      tag: 'VAMOS TRABALHAR JUNTOS?',
      title: 'Sua empresa está pronta para uma página que realmente converte?',
      subtitle:
        'Vamos agendar uma conversa rápida de 15 minutos para analisar o seu projeto e desenhar a melhor solução.',
      btnPrimary: 'Falar no WhatsApp',
      btnSecondary: 'Enviar E-mail',
    },
    footer: {
      rights: 'Todos os direitos reservados.',
      role: 'Landing Pages de Alta Performance & Engenharia de Software.',
    },
    contactModal: {
      title: 'Iniciar um Projeto',
      nameLabel: 'Seu Nome / Empresa',
      namePlaceholder: 'Ex: Sofia Mendes (Startup XYZ)',
      emailLabel: 'Seu E-mail Corporativo',
      emailPlaceholder: 'voce@empresa.com',
      messageLabel: 'Conte sobre o projeto e seus objetivos',
      messagePlaceholder: 'Descreva seu produto, prazo estimado ou links de referência...',
      submitBtn: 'Enviar Proposta',
      sendingBtn: 'Enviando...',
      successTitle: 'Mensagem Enviada!',
      successDesc: 'Recebi sua mensagem e retornarei com uma proposta em até 24 horas úteis.',
      error: 'Ocorreu um erro ao enviar. Por favor, tente pelo WhatsApp ou e-mail direto.',
      close: 'Fechar',
    },
    briefing: {
      tag: 'BRIEFING RÁPIDO',
      title: 'Vamos planejar sua próxima página de alta conversão',
      subtitle: 'Leva menos de 2 minutos. Com essas informações, já abro nossa conversa no WhatsApp com escopo, estimativas e ideias práticas para seu projeto.',
      fields: {
        name: 'Seu Nome / Empresa',
        namePlaceholder: 'Ex: Lucas Silva (SaaS Finanças)',
        projectType: 'Tipo de Projeto Principal',
        projectTypeOptions: [
          'Landing Page para SaaS / Startup',
          'Página de Vendas de Alta Conversão',
          'Redesign & Aceleração de Performance',
          'Integrações de APIs & Automações',
          'Outro'
        ],
        stage: 'Qual o estágio atual do projeto?',
        stageOptions: [
          'Tenho design/copy prontos (só preciso do desenvolvimento)',
          'Preciso de tudo do zero (estratégia, design e código)',
          'Já tenho uma página no ar que precisa ser recriada/melhorada',
          'Outro'
        ],
        deadline: 'Prazo desejado para entrega',
        deadlineOptions: [
          'Urgente (em até 10 dias)',
          'Médio prazo (2 a 3 semanas)',
          'Flexível / Planejando para o próximo mês',
          'Outro'
        ],
        budget: 'Faixa de investimento planejada',
        budgetOptions: [
          'Até R$ 2.500',
          'R$ 2.500 a R$ 5.000',
          'Acima de R$ 5.000',
          'A combinar na proposta',
          'Outro'
        ],
        otherPlaceholder: 'Digite sua resposta personalizada...',
        details: 'Resumo do projeto e links de referência (opcional)',
        detailsPlaceholder: 'Ex: Links de sites que você gosta, sua página atual ou objetivos principais...',
      },
      submitBtn: 'Continuar no WhatsApp',
      copyBtn: 'Copiar Mensagem',
      copied: 'Copiado para a área de transferência!',
      backBtn: 'Voltar ao Portfólio',
      previewTitle: 'Mensagem que será encaminhada no WhatsApp:',
      greeting: 'Olá Yuran! Preenchi o briefing do meu projeto no seu site:'
    },
  },
  en: {
    nav: {
      services: 'Services',
      differentials: 'Why Custom Code',
      process: 'Process',
      projects: 'Work',
      about: 'About',
      cta: 'Request a Quote',
    },
    hero: {
      availabilityBadge: 'Available for projects worldwide • US, UK & Global',
      headlineStart: 'High-converting landing pages built with ',
      headlineHighlight: 'tailored engineering.',
      subtitle:
        'Stop losing traffic to sluggish website templates. I build sub-second, custom-engineered landing pages designed to maximize your advertising ROI and convert visitors into paying clients.',
      ctaPrimary: 'Start a Project',
      ctaSecondary: 'View Selected Work',
      metrics: [
        { value: '< 0.8s', label: 'Average global load time' },
        { value: '98+', label: 'Google PageSpeed score' },
        { value: '100%', label: 'Tailored code, zero bulky plugins' },
        { value: 'Global', label: 'Serving clients across US, LATAM & Europe' },
      ],
    },
    services: {
      tag: 'WHAT I DO',
      title: 'Pages that sell, infrastructure that scales',
      subtitle: 'Blending conversion-focused UI/UX with rigorous software engineering standards.',
      cards: [
        {
          id: 'saas',
          title: 'SaaS & Tech Startup Landing Pages',
          description:
            'Showcase your product with maximum clarity and authority. Intuitive onboarding, clean visual hierarchy, and laser focus on driving demo requests and trial sign-ups.',
          features: ['Interactive product tours', 'Funnel optimization', 'Scalable design systems'],
        },
        {
          id: 'sales',
          title: 'High-Ticket & Direct Sales Pages',
          description:
            'Engineered for paid ad traffic (Meta, Google, LinkedIn). Instant load times ensure you never waste ad spend on bounced clicks.',
          features: ['Strict mobile-first layout', 'Embedded checkouts', 'Scroll-depth retention triggers'],
        },
        {
          id: 'redesign',
          title: 'Redesign & Performance Migration',
          description:
            'Tired of a bloated WordPress, Elementor, or Wix site dropping leads? I rewrite your page in modern, ultra-clean code (Vite/React) to score 95+ on Core Web Vitals.',
          features: ['Lower customer acquisition cost (CAC)', 'Advanced technical SEO', 'Zero plugin vulnerabilities'],
        },
        {
          id: 'integrations',
          title: 'API Integrations & Automation',
          description:
            'Leverage my core back-end background: robust, resilient connections to CRMs (HubSpot, Salesforce), payment providers (Stripe), webhooks, and analytics pipelines.',
          features: ['Webhooks & Serverless logic', 'Bulletproof tracking (Pixel, GA4, CAPI)', 'Real-time data validation'],
        },
      ],
    },
    differentials: {
      tag: 'ENGINEERING VS. TEMPLATES',
      title: 'Why companies hire a software engineer for their landing pages',
      subtitle:
        'Most landing pages lose 30% to 50% of visitors in the first 3 seconds due to slow load times and broken mobile layouts.',
      bento: [
        {
          title: 'Speed that protects your ad ROI',
          description:
            'Every 100ms decrease in load time boosts conversion rates by up to 8%. Built in React/Vite with lightweight, tree-shaken bundles that load before visitors can blink.',
          tag: 'Extreme Performance',
        },
        {
          title: 'True Mobile-First UX',
          description:
            'Over 80% of paid ad clicks originate from mobile devices. I design mobile experiences from scratch with natural touch targets, zero lag, and flawless viewport responsiveness.',
          tag: 'Flawless Mobile',
        },
        {
          title: 'Back-end Rigor & Resilience',
          description:
            'Pages built to handle viral traffic spikes and major launch events without breaking, backed by serverless validation and anti-spam shielding.',
          tag: 'High Reliability',
        },
        {
          title: 'Clean, Accurate Attribution',
          description:
            'No duplicate scripts slowing down your user journey. Clean, server-friendly tracking setup for Meta Conversions API (CAPI), Google Tag Manager, and GA4.',
          tag: 'Precision Analytics',
        },
      ],
    },
    process: {
      tag: 'THE WORKFLOW',
      title: 'From kickoff to launch in days, frictionless',
      subtitle: 'A streamlined, transparent workflow tested with clients worldwide.',
      steps: [
        {
          step: '01',
          title: 'Discovery & Strategy',
          desc: 'Target audience analysis, value proposition refinement, and concrete conversion metric definitions.',
        },
        {
          step: '02',
          title: 'UI/UX Design & Copy Structure',
          desc: 'Crafting the interface based on consumer psychology, visual hierarchy, and persuasive trust badges.',
        },
        {
          step: '03',
          title: 'Precision Development',
          desc: 'Clean, hand-coded frontend, smooth animations, and integrations with forms, CRMs, and payment gateways.',
        },
        {
          step: '04',
          title: 'Audit, Optimization & Deployment',
          desc: 'Lighthouse 95+ testing, custom domain setup, and global edge CDN deployment for instant access across continents.',
        },
      ],
    },
    projects: {
      tag: 'SELECTED WORK',
      title: 'Recent Projects & Digital Products',
      subtitle: 'A curated selection of high-performance landing pages, web applications, and backend systems.',
      empty: 'Loading projects or no projects published yet.',
      viewLive: 'Live Demo',
      viewCode: 'Source Code',
      requestDemo: 'View Details',
      demoProjects: [
        {
          id: 'demo-1',
          title: 'SaaS Analytics Launch Page',
          description: 'High-performance landing page with interactive dashboard previews and sub-second load times.',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['React', 'Vite', 'Tailwind', 'Stripe'],
          live_url: '#',
          repo_url: '#'
        },
        {
          id: 'demo-2',
          title: 'Fintech Global Checkout Funnel',
          description: 'Multi-currency direct sales landing page engineered for high-volume paid media campaigns.',
          image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['React', 'Node.js', 'Webhooks', 'Meta CAPI'],
          live_url: '#',
          repo_url: '#'
        },
        {
          id: 'demo-3',
          title: 'Enterprise Cloud API Gateway',
          description: 'Developer hub and landing page showcasing backend architecture, documentation, and live sandbox.',
          image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
          tech_stack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
          live_url: '#',
          repo_url: '#'
        }
      ]
    },
    about: {
      tag: 'ABOUT ME',
      title: 'Where technical engineering meets business conversion',
      p1: 'I am a software developer with deep roots in backend architecture, database optimization, and cloud solutions. Throughout my career, I realized that the primary roadblock for great businesses was not just the product itself, but failing to communicate its value quickly and reliably on the web.',
      p2: 'Today, I bring this engineering precision to high-converting landing pages for businesses and startups across Brazil, the United States, and Europe. Every project is built as software: ultra-fast, secure, scalable, and focused on tangible commercial growth.',
      skillsTitle: 'Tech Stack & Capabilities',
    },
    ctaBanner: {
      tag: 'LET’S BUILD SOMETHING GREAT',
      title: 'Ready for a landing page that turns clicks into revenue?',
      subtitle:
        'Let’s schedule a quick 15-minute call to review your current funnel and map out the highest-converting solution.',
      btnPrimary: 'Chat on WhatsApp',
      btnSecondary: 'Send an Email',
    },
    footer: {
      rights: 'All rights reserved.',
      role: 'High-Performance Landing Pages & Software Engineering.',
    },
    contactModal: {
      title: 'Start a Project',
      nameLabel: 'Your Name / Company',
      namePlaceholder: 'e.g., Alex Johnson (XYZ Labs)',
      emailLabel: 'Work Email',
      emailPlaceholder: 'you@company.com',
      messageLabel: 'Project details and goals',
      messagePlaceholder: 'Tell me about your product, expected timeline, and target audience...',
      submitBtn: 'Send Inquiry',
      sendingBtn: 'Sending...',
      successTitle: 'Message Received!',
      successDesc: 'Thank you for reaching out. I will get back to you with a proposal within 24 business hours.',
      error: 'An error occurred while sending. Please reach out directly via WhatsApp or email.',
      close: 'Close',
    },
    briefing: {
      tag: 'PROJECT BRIEFING',
      title: 'Let’s architect your next high-converting page',
      subtitle: 'Takes under 2 minutes. These details help me respond on WhatsApp with clear scope, timeline, and tailored recommendations.',
      fields: {
        name: 'Your Name / Company',
        namePlaceholder: 'e.g., Alex Reed (TechFlow SaaS)',
        projectType: 'Primary Project Goal',
        projectTypeOptions: [
          'SaaS & Tech Startup Landing Page',
          'High-Ticket Direct Sales Page',
          'Redesign & Performance Re-engineering',
          'API Integrations & Custom Webhooks',
          'Other'
        ],
        stage: 'Current Project Stage',
        stageOptions: [
          'I have design/copy ready (need clean code only)',
          'Need end-to-end delivery (strategy, UI/UX & code)',
          'Existing live page that needs a complete overhaul',
          'Other'
        ],
        deadline: 'Target Launch Timeline',
        deadlineOptions: [
          'Urgent (within 10 days)',
          'Standard (2 to 3 weeks)',
          'Flexible / Planning next month',
          'Other'
        ],
        budget: 'Planned Investment Tier',
        budgetOptions: [
          'Up to $600',
          '$600 to $1,500',
          '$1,500+',
          'To be determined based on proposal',
          'Other'
        ],
        otherPlaceholder: 'Type your custom answer...',
        details: 'Product summary & reference links (optional)',
        detailsPlaceholder: 'e.g., Competitor sites you admire, your current site, or key conversion goals...',
      },
      submitBtn: 'Continue to WhatsApp',
      copyBtn: 'Copy Message',
      copied: 'Copied to clipboard!',
      backBtn: 'Back to Portfolio',
      previewTitle: 'Message ready to be sent on WhatsApp:',
      greeting: 'Hello Yuran! I filled out the project briefing on your website:'
    },
  },
}
