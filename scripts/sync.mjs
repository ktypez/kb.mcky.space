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

function copyDir(srcDir, destDir, exclude = []) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    if (exclude.includes(entry.name)) continue;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      fs.copyFileSync(src, dest);
    }
  }
}

console.log('  Syncing OKF → src/');

// Root docs — okf index → workspace.md (index.md is custom home page)
fs.copyFileSync(path.join(OKF_ROOT, 'index.md'), path.join(SRC, 'workspace.md'));
if (fs.existsSync(path.join(OKF_ROOT, 'SETUP.md'))) {
  fs.copyFileSync(path.join(OKF_ROOT, 'SETUP.md'), path.join(SRC, 'setup.md'));
}

// System (exclude sync-log.md — kept in OKF only)
copyDir(path.join(OKF_ROOT, 'system'), path.join(SRC, 'system'), ['sync-log.md']);

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
console.log(`  Done — ${count} files synced`);
