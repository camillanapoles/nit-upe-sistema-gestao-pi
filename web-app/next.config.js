/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTA: Para deploy estático no GitHub Pages, habilitamos output: 'export'
  // Para desenvolvimento local com API Routes, comente esta linha
  output: 'export',

  // Desabilitar otimização de imagens (necessário para static export)
  images: {
    unoptimized: true,
  },

  // Desabilitar ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Base path para GitHub Pages
  // Configure se o repo for user.github.io/repo-name/
  // Deixe vazio para user.github.io ou custom domain
  basePath: '',

  // Adicionar trailing slash para compatibilidade
  trailingSlash: false,
}

module.exports = nextConfig
