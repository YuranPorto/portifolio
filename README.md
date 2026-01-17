# Portfólio - Yuran Porto (Dev Back-end)

Este é o repositório do meu portfólio pessoal, com foco em demonstrar minhas habilidades como desenvolvedor Back-end. O projeto consiste em um painel administrativo para gerenciamento de conteúdo e uma interface pública para apresentação.

## 🚀 Tecnologias

- **Front-end:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização:** CSS Vanilla (Modules/Global)
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/)
- **Hosting:** [Netlify](https://www.netlify.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Git](https://git-scm.com/)

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/YuranPorto/portifolio.git
cd portifolio
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Insira suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_projeto
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

## 🗄️ Configuração do Banco de Dados

O projeto utiliza o Supabase. Para configurar o banco:

1. Crie um novo projeto no [Supabase](https://supabase.com).
2. Vá até o **SQL Editor**.
3. Copie o conteúdo do arquivo `supabase/schema.sql` deste repositório e execute.
   - Isso criará as tabelas `profiles`, `projects` e o bucket de storage `portfolio-assets`.

## 🏃‍♂️ Executando Localmente

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará rodando em `http://localhost:5173`.

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido por [Yuran Porto](https://github.com/YuranPorto)
