import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC = resolve(ROOT, 'src')

function toLabel(name: string) {
  return name
    .replace(/\.md$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function readDir(dir: string) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
}

function buildSidebar() {
  const sidebar: any[] = [
    { text: 'Home', link: '/' },
    { text: 'Setup', link: '/setup' },

  ]
  // Workspace (OKF workspace index)
  if (existsSync(resolve(SRC, 'workspace.md'))) {
    sidebar.push({ text: 'Workspace', link: '/workspace' })
  }

  // System docs
  const systemDir = resolve(SRC, 'system')
  const systemFiles = readDir(systemDir)
    .filter(f => f.isFile() && f.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name))
  if (systemFiles.length) {
    sidebar.push({
      text: 'System',
      collapsed: false,
      items: systemFiles.map(f => ({
        text: toLabel(f.name),
        link: `/system/${f.name.replace(/\.md$/, '')}`,
      })),
    })
  }

  // Project docs
  const projectsDir = resolve(SRC, 'projects')
  const projectDirs = readDir(projectsDir).filter(d => d.isDirectory())
  if (projectDirs.length) {
    const projectItems = projectDirs
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(proj => {
        const projDir = resolve(projectsDir, proj.name)
        const files = readdirSync(projDir)
          .filter(f => f.endsWith('.md'))
          .sort()
        return {
          text: proj.name,
          items: files.map(f => ({
            text: toLabel(f),
            link: `/projects/${proj.name}/${f.replace(/\.md$/, '')}`,
          })),
        }
      })
    sidebar.push({ text: 'Projects', collapsed: true, items: projectItems })
  }

  // Plan docs
  const plansDir = resolve(SRC, 'plans')
  const planFiles = readDir(plansDir)
    .filter(f => f.isFile() && f.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name))
  if (planFiles.length) {
    sidebar.push({
      text: 'Plans',
      collapsed: true,
      items: planFiles.map(f => ({
        text: toLabel(f.name),
        link: `/plans/${f.name.replace(/\.md$/, '')}`,
      })),
    })
  }

  return sidebar
}

/** Escape Vue-template-conflicting patterns in .md files before Vue compiler sees them */
function escapeMdPlugin(): Plugin {
  return {
    name: 'escape-md',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return
      // Escape {{ }} inside inline code backticks (Framer Motion / React JSX object syntax)
      let result = code.replace(/(`[^`\n]+`)/g, m =>
        m
          .replace(/\{\{/g, '&#123;&#123;')
          .replace(/\}\}/g, '&#125;&#125;')
      )
      return result !== code ? result : undefined
    },
  }
}

export default withPwa(defineConfig({
  title: 'OKF Knowledge Base',
  description: 'Open Knowledge Framework — structured context for every project',
  lang: 'th',
  srcDir: './src',
  lastUpdated: true,
  ignoreDeadLinks: true,
  vite: {
    publicDir: resolve(ROOT, 'public'),
    plugins: [escapeMdPlugin()],
  },
  markdown: {
    image: { lazyLoading: true },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#f8fafc' }],
    ['meta', { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'preconnect', href: 'https://api.fontshare.com' }],
  ],
  themeConfig: {
    logo: { src: '/favicon.svg', width: 24, height: 24 },
    search: { provider: 'local' },
    sidebar: buildSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ktypez/OKF' },
    ],
    footer: {
      message: 'Open Knowledge Framework',
      copyright: 'MIT License',
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    outDir: resolve(ROOT, '.vitepress/dist'),
    manifest: {
      name: 'OKF Knowledge Base',
      short_name: 'OKF',
      description: 'Open Knowledge Framework — structured context for every project',
      theme_color: '#f8fafc',
      background_color: '#f8fafc',
      display: 'standalone',
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /\.(html|md)$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'okf-pages',
            expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
          },
        },
      ],
    },
  },
}))
