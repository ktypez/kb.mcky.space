/**
 * OKF Sync — Copy ~/OKF/ markdown files to VitePress src/
 * Usage: node scripts/sync.mjs
 * Run as prebuild: auto-skips if ~/OKF/ doesn't exist (CI)
 */

import fs from 'fs';
import path from 'path';

const OKF_ROOT = '/home/OKF';
const SRC = path.resolve(import.meta.dirname, '../src');

// Graceful skip on CI
if (!fs.existsSync(OKF_ROOT)) {
  console.log('  OKF source not found — skipping sync (CI)');
  process.exit(0);
}

// Clean src — keep index.md (custom home page)
fs.mkdirSync(SRC, { recursive: true });
const preserve = ['index.md'];
for (const entry of fs.readdirSync(SRC)) {
  if (!preserve.includes(entry)) {
    fs.rmSync(path.join(SRC, entry), { recursive: true, force: true });
  }
}
// Remove old workspace.md if exists (will be recreated)
if (fs.existsSync(path.join(SRC, 'workspace.md'))) {
  fs.rmSync(path.join(SRC, 'workspace.md'));
}

function slug(name) {
  return name.replace(/\./g, '-').toLowerCase();
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      fs.copyFileSync(src, dest);
    }
  }
}

/**
 * Parse sync-log.md → structured entries with simple HTML body.
 */
function parseSyncLog(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const body = content.replace(/^---[\s\S]*?---\n?/, ''); // strip frontmatter

  // (?![\s\S]) = absolute end-of-string anchor (JS multiline $ matches line-end, not string-end)
  const entryRe = /^## (\d{4}-\d{2}-\d{2})(?: \d{2}:\d{2} UTC)?(?: \((.+?)\))?\n+([\s\S]*?)(?=\n## |\n---|(?![\s\S]))/gm;
  const entries = [];
  let match;
  while ((match = entryRe.exec(body)) !== null) {
    entries.push({
      date: match[1],
      title: match[2] || null,
      body: mdBodyToHtml(match[3].trim()),
    });
  }

  // last_updated from frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let updated = 'unknown';
  if (fmMatch) {
    const fm = fmMatch[1].split('\n').reduce((acc, line) => {
      const sep = line.indexOf(':');
      if (sep > 0) acc[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
      return acc;
    }, {});
    updated = fm.last_updated || updated;
  }

  return { updated: String(updated), entries };
}

/**
 * Minimal markdown‑to‑HTML for sync‑log body syntax.
 */
function mdBodyToHtml(md) {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, '<br>');
}

console.log('  Syncing OKF → src/');

// ── Sync-log JSON + wrapper page ──
let syncLogUpdated = 'unknown';
const syncLogSrc = path.join(OKF_ROOT, 'system', 'sync-log.md');
if (fs.existsSync(syncLogSrc)) {
  const data = parseSyncLog(syncLogSrc);
  syncLogUpdated = data.updated;
  const dataDir = path.join(SRC, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'sync-log.json'), JSON.stringify(data, null, 2));
  console.log(`  sync‑log: ${data.entries.length} entries → src/data/sync-log.json`);
}

// Root docs — okf index → workspace.md (index.md is custom home page)
fs.copyFileSync(path.join(OKF_ROOT, 'index.md'), path.join(SRC, 'workspace.md'));
if (fs.existsSync(path.join(OKF_ROOT, 'SETUP.md'))) {
  fs.copyFileSync(path.join(OKF_ROOT, 'SETUP.md'), path.join(SRC, 'setup.md'));
}

// System
copyDir(path.join(OKF_ROOT, 'system'), path.join(SRC, 'system'));

// Projects — slugify directory names
const projectsSrc = path.join(OKF_ROOT, 'projects');
if (fs.existsSync(projectsSrc)) {
  const projectDirs = fs.readdirSync(projectsSrc, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  for (const proj of projectDirs) {
    copyDir(
      path.join(projectsSrc, proj),
      path.join(SRC, 'projects', slug(proj)),
    );
  }
}

// Plans
if (fs.existsSync(path.join(OKF_ROOT, 'plan'))) {
  copyDir(path.join(OKF_ROOT, 'plan'), path.join(SRC, 'plans'));
}

const count = fs.readdirSync(SRC, { recursive: true })
  .filter(f => f.endsWith('.md')).length;
// Overwrite sync-log.md with component wrapper (replaces plain copy from OKF)
if (fs.existsSync(syncLogSrc)) {
  const wrapperPage = `---
type: system-doc
id: sync-log
last_updated: ${syncLogUpdated}
---

# Sync Log

<SyncTimeline />
`;
  fs.writeFileSync(path.join(SRC, 'system', 'sync-log.md'), wrapperPage);
  console.log(`  sync‑log page: wrapped with SyncTimeline component`);
}

console.log(`  Done — ${count} files synced`);
