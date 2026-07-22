/**
 * OKF Site Builder — Convert OKF KB .md files to Starlight content
 *
 * Scans ~/OKF/ for knowledge and system .md files,
 * copies them to ~/kb.mcky.space/src/content/docs/ with Starlight-compatible frontmatter.
 * Generates sidebar config as JSON.
 *
 * Usage: node scripts/build-site.js
 */

const fs = require('fs');
const path = require('path');

const OKF_ROOT = '/home/OKF';
const SITE_ROOT = '/home/kb.mcky.space';
const DOCS_DIR = path.join(SITE_ROOT, 'src', 'content', 'docs');
const SIDEBAR_OUT = path.join(SITE_ROOT, 'src', 'data', 'sidebar.json');

function walkMd(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') continue;
      files.push(...walkMd(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { fm: null, body: content };
  const yaml = require('js-yaml');
  try {
    const fm = yaml.load(match[1]) || {};
    const body = content.slice(match[0].length).trim();
    return { fm, body };
  } catch {
    return { fm: null, body: content };
  }
}

function extractTitle(fm, body, filename) {
  // Try first heading from body
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  // Use frontmatter id + type
  if (fm?.id) {
    const type = fm.type || '';
    return `${fm.id}${type ? ' (' + type + ')' : ''}`;
  }

  // Fallback to filename
  return filename.replace(/\.md$/, '');
}

function serializeStarlightFm(title, fm, body) {
  const yaml = require('js-yaml');

  // Starlight frontmatter — only standard fields exposed
  const starlightFm = {
    title,
    description: fm?.description || '',
  };

  // Preserve original frontmatter as raw JSON for reference
  if (fm && Object.keys(fm).length > 0) {
    starlightFm.original_frontmatter = fm;
  }

  return `---\n${yaml.dump(starlightFm, { lineWidth: 120, noCompatMode: true, quotingType: "'" })}\n---\n\n${body}`;
}

function ensureCleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyFiles(srcDir, destSubdir, options = {}) {
  const { prefix = '' } = options;
  const files = walkMd(srcDir);
  const destDir = path.join(DOCS_DIR, destSubdir);
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const { fm, body } = parseFrontmatter(raw);
    const relPath = path.relative(srcDir, file);
    const destFile = path.join(destDir, prefix + relPath);

    // Ensure subdirectories exist
    fs.mkdirSync(path.dirname(destFile), { recursive: true });

    const title = extractTitle(fm, body, path.basename(file));
    const starlightContent = serializeStarlightFm(title, fm, body);
    fs.writeFileSync(destFile, starlightContent, 'utf-8');
  }

  console.log(`    ${destSubdir}/ (${files.length} files)`);
  return files.length;
}

// Astro/Starlight slugifies URLs: lowercase + strip dots (dashes kept).
// Sidebar links must match the generated slugs or they 404.
function slugify(s) {
  return s.toLowerCase().replace(/\./g, '');
}

function generateSidebar() {
  const yaml = require('js-yaml');
  const sidebar = [];

  // System docs
  const systemDir = path.join(DOCS_DIR, 'system');
  if (fs.existsSync(systemDir)) {
    const items = fs.readdirSync(systemDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => ({
        label: f.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        link: `/system/${slugify(f.replace(/\.md$/, ''))}`,
      }));
    if (items.length) {
      sidebar.push({ label: 'System', items, collapsed: false });
    }
  }

  // Project docs
  const projectsDir = path.join(DOCS_DIR, 'projects');
  if (fs.existsSync(projectsDir)) {
    const projectDirs = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();

    const projectItems = [];
    for (const proj of projectDirs) {
      const projDir = path.join(projectsDir, proj);
      const files = fs.readdirSync(projDir)
        .filter(f => f.endsWith('.md'))
        .sort();

      if (files.length) {
        const subItems = files.map(f => ({
          label: f.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          link: `/projects/${slugify(proj)}/${slugify(f.replace(/\.md$/, ''))}`,
        }));
        projectItems.push({ label: proj, items: subItems });
      }
    }
    if (projectItems.length) {
      sidebar.push({ label: 'Projects', items: projectItems, collapsed: true });
    }
  }

  // Plan docs
  const plansDir = path.join(DOCS_DIR, 'plans');
  if (fs.existsSync(plansDir)) {
    const items = fs.readdirSync(plansDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => ({
        label: f.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        link: `/plans/${slugify(f.replace(/\.md$/, ''))}`,
      }));
    if (items.length) {
      sidebar.push({ label: 'Plans', items, collapsed: true });
    }
  }

  fs.writeFileSync(SIDEBAR_OUT, JSON.stringify(sidebar, null, 2), 'utf-8');
  console.log(`  Generating sidebar...`);
  console.log(`    Written to ${path.relative(SITE_ROOT, SIDEBAR_OUT)}`);
}

// ---- Main ----
console.log('');
console.log('  OKF Site Builder');
console.log('  ' + '-'.repeat(40));
console.log('');

// 0. Clean docs directory first
console.log('  Cleaning docs directory...');
ensureCleanDir(DOCS_DIR);

// 1. Root index doc
const indexMd = path.join(OKF_ROOT, 'index.md');
if (fs.existsSync(indexMd)) {
  console.log('  Copied index.md');
  const raw = fs.readFileSync(indexMd, 'utf-8');
  const { fm, body } = parseFrontmatter(raw);
  const title = extractTitle(fm, body, 'index.md');
  const out = path.join(DOCS_DIR, 'index.md');
  fs.writeFileSync(out, serializeStarlightFm(title, fm, body), 'utf-8');
}

// 2. System docs
const systemSrc = path.join(OKF_ROOT, 'system');
console.log('  Copying system docs...');
copyFiles(systemSrc, 'system');

// 2. Project docs
const projectsSrc = path.join(OKF_ROOT, 'projects');
console.log('');
console.log('  Copying project docs...');
if (fs.existsSync(projectsSrc)) {
  const projectDirs = fs.readdirSync(projectsSrc, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const proj of projectDirs) {
    const projSrc = path.join(projectsSrc, proj);
    copyFiles(projSrc, `projects/${proj}`);
  }
}

// 3. Root setup doc
const setupMd = path.join(OKF_ROOT, 'SETUP.md');
if (fs.existsSync(setupMd)) {
  console.log('');
  console.log('  Copied SETUP.md');
  const raw = fs.readFileSync(setupMd, 'utf-8');
  const { fm, body } = parseFrontmatter(raw);
  const title = extractTitle(fm, body, 'SETUP.md');
  const out = path.join(DOCS_DIR, 'setup.md');
  fs.writeFileSync(out, serializeStarlightFm(title, fm, body), 'utf-8');
}

// 4. Plan docs
const plansSrc = path.join(OKF_ROOT, 'plan');
console.log('');
console.log('  Copying plan docs...');
if (fs.existsSync(plansSrc)) {
  copyFiles(plansSrc, 'plans');
}

// 5. Generate sidebar
console.log('');
generateSidebar();

const total = walkMd(DOCS_DIR).length;
console.log('');
console.log(`  Done — ${total} files copied`);
console.log('');
