<script setup lang="ts">
import { ref, computed } from 'vue'
import raw from '../../../src/data/sync-log.json'

interface Entry {
  date: string
  title: string | null
  body: string
}

const data: { updated: string; entries: Entry[] } = raw as any

const expanded = ref<Set<string>>(new Set())
const showArchived = ref(false)
const selectedMonth = ref('all')

const months = computed(() => {
  const seen = new Set<string>()
  for (const e of data.entries) {
    seen.add(e.date.slice(0, 7))
  }
  return Array.from(seen).sort().reverse()
})

const recentThreshold = computed(() => {
  if (months.value.length <= 3) return ''
  return months.value[2]
})

function toLocalLabel(ym: string) {
  const d = new Date(ym + '-01T00:00:00Z')
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', timeZone: 'UTC' })
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function toggle(date: string) {
  if (expanded.value.has(date)) expanded.value.delete(date)
  else expanded.value.add(date)
}

const visible = computed(() => {
  let list = data.entries
  if (selectedMonth.value !== 'all') {
    list = list.filter(e => e.date.startsWith(selectedMonth.value))
  }
  if (!recentThreshold.value) return { recent: list, archived: [] }
  const recent: Entry[] = []
  const archived: Entry[] = []
  for (const e of list) {
    if (e.date.slice(0, 7) >= recentThreshold.value) recent.push(e)
    else archived.push(e)
  }
  return { recent, archived }
})
</script>

<template>
  <div class="okf-timeline">
    <div class="tl-header">
      <div class="tl-header-top">
        <h1>Sync Log</h1>
        <select v-model="selectedMonth" class="tl-month-picker">
          <option value="all">All months</option>
          <option v-for="m in months" :key="m" :value="m">{{ toLocalLabel(m) }}</option>
        </select>
      </div>
      <p class="tl-meta">{{ data.entries.length }} entries · last updated {{ data.updated }}</p>
    </div>

    <!-- Recent -->
    <div class="tl-track">
      <div v-for="e in visible.recent" :key="e.date" class="tl-item">
        <div class="tl-dot" />
        <div class="tl-card" :class="{ open: expanded.has(e.date) }" @click="toggle(e.date)">
          <div class="tl-card-header">
            <time class="tl-date">{{ fmtDate(e.date) }}</time>
            <span v-if="e.title" class="tl-title">{{ e.title }}</span>
            <span v-else class="tl-title muted">(no title)</span>
            <span class="tl-chevron">{{ expanded.has(e.date) ? '▴' : '▾' }}</span>
          </div>
          <div v-if="expanded.has(e.date)" class="tl-card-body">
            <div class="tl-body-inner" v-html="e.body" />
          </div>
        </div>
      </div>
    </div>

    <!-- Archived -->
    <div v-if="visible.archived.length" class="tl-archived">
      <button class="tl-archive-btn" @click="showArchived = !showArchived">
        <span class="tl-chevron">{{ showArchived ? '▾' : '▸' }}</span>
        Archived entries ({{ visible.archived.length }})
      </button>
      <div v-if="showArchived" class="tl-track">
        <div v-for="e in visible.archived" :key="e.date" class="tl-item">
          <div class="tl-dot muted" />
          <div class="tl-card" :class="{ open: expanded.has(e.date) }" @click="toggle(e.date)">
            <div class="tl-card-header">
              <time class="tl-date">{{ fmtDate(e.date) }}</time>
              <span v-if="e.title" class="tl-title">{{ e.title }}</span>
              <span v-else class="tl-title muted">(no title)</span>
              <span class="tl-chevron">{{ expanded.has(e.date) ? '▴' : '▾' }}</span>
            </div>
            <div v-if="expanded.has(e.date)" class="tl-card-body">
              <div class="tl-body-inner" v-html="e.body" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!data.entries.length" class="tl-empty">No entries yet.</p>
  </div>
</template>

<style scoped>
.okf-timeline {
  max-width: 760px;
  margin: 0 auto;
}

/* ── header ── */
.tl-header {
  margin-bottom: 2rem;
}
.tl-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tl-header-top h1 {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.3;
}
.tl-month-picker {
  font-size: 0.875rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.tl-meta {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

/* ── timeline track ── */
.tl-track {
  position: relative;
  padding-left: 28px;
}
.tl-track::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--vp-c-border);
}

/* ── item ── */
.tl-item {
  position: relative;
  margin-bottom: 12px;
}

/* ── dot ── */
.tl-dot {
  position: absolute;
  left: -18px;
  top: 14px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  z-index: 1;
}
.tl-dot.muted {
  background: var(--vp-c-text-3);
}

/* ── card ── */
.tl-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tl-card:hover {
  border-color: var(--vp-c-brand-1);
}
.tl-card.open {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.tl-card-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 10px 14px;
}
.tl-date {
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}
.tl-title {
  flex: 1;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tl-title.muted {
  color: var(--vp-c-text-3);
  font-style: italic;
}
.tl-chevron {
  flex-shrink: 0;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  transition: transform 0.15s;
}

.tl-card-body {
  border-top: 1px solid var(--vp-c-border);
  padding: 0 14px 12px;
}
.tl-body-inner {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  padding-top: 8px;
}
.tl-body-inner :deep(strong) {
  color: var(--vp-c-text-1);
}
.tl-body-inner :deep(code) {
  font-size: 0.82em;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  background: var(--vp-c-mute);
  color: var(--vp-c-text-1);
}
.tl-body-inner :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
.tl-body-inner :deep(br) {
  display: block;
  content: '';
  margin: 0.25em 0;
}

/* ── archived ── */
.tl-archived {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-border);
}
.tl-archive-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0;
}
.tl-archive-btn:hover {
  color: var(--vp-c-brand-1);
}

/* ── empty ── */
.tl-empty {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 3rem 0;
}
</style>
