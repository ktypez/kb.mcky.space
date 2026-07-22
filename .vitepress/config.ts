import { defineConfig } from 'vitepress'
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
    { text: 'Index', link: '/' },
    { text: 'Setup', link: '/setup' },
  ]

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
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      )
      return result !== code ? result : undefined
    },
  }
}

export default defineConfig({
  title: 'OKF Knowledge Base',
  description: 'Open Knowledge Framework — structured context for every project',
  lang: 'th',
  srcDir: './src',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  vite: {
    plugins: [escapeMdPlugin()],
  },
  markdown: {
    image: { lazyLoading: true },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#000000' }],
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
})
