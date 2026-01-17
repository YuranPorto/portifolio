# Guia de Deploy no Netlify

Este guia explica como hospedar o seu portfólio gratuitamente no Netlify.

## 1. Preparação (GitHub)

1. Certifique-se de que todo o seu código está salvo e enviado para o seu repositório no GitHub.
   ```bash
   git add .
   git commit -m "Preparando para deploy"
   git push origin dev
   ```
   _(Nota: Se você estiver usando a branch `dev`, lembre-se de configurar o Netlify para usar essa branch ou faça merge para a `main`)._

## 2. Configuração no Netlify

1. Acesse [netlify.com](https://www.netlify.com/) e faça login (recomendo usar a conta do GitHub).
2. No Dashboard, clique em **"Add new site"** > **"Import an existing project"**.
3. Escolha **GitHub**.
4. Autorize o Netlify a acessar seus repositórios e selecione o repositório `portifolio`.

## 3. Configurações de Build

O Netlify deve detectar automaticamente que é um projeto Vite/React, mas confirme as configurações:

- **Base directory:** (deixe em branco)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## 4. Variáveis de Ambiente (Importante!)

Antes de clicar em "Deploy", você precisa configurar as chaves do Supabase.

1. Clique em **"Environment variables"** (ou "Advanced build settings" dependendo da tela).
2. Adicione as mesmas variáveis que estão no seu `.env` local:
   - Key: `VITE_SUPABASE_URL`
     - Value: `Sua URL do Supabase`
   - Key: `VITE_SUPABASE_ANON_KEY`
     - Value: `Sua chave Anon/Public do Supabase`

## 5. Finalizando

1. Clique em **"Deploy site"**.
2. O Netlify vai iniciar o processo de build. Você pode acompanhar os logs.
3. Assim que terminar, você receberá uma URL (ex: `yuran-portfolio.netlify.app`).

## 6. Configurações Extras

### Redirecionamentos (SPA)

O arquivo `netlify.toml` já foi criado na raiz do projeto para garantir que o roteamento do React funcione (evitando erro 404 ao recarregar páginas internas).

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
