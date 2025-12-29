/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração obrigatória para GitHub Pages (Static Export)
  output: 'export',
  
  // Desabilitar otimização de imagens (necessário para static export)
  images: {
    unoptimized: true,
  },

  // Base path opcional se publicar em subdiretório
  // Se o site for user.github.io/repo/, use '/repo/'
  // Se for custom domain, deixe vazio.
  // basePath: '', 

  // Ignorar build padrão para criar /out (padrão do Next.js)
  distDir: 'out',
}

module.exports = nextConfig
