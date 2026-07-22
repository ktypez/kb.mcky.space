<script setup lang="ts">
import { ref, computed } from 'vue'
import raw from '../../../src/data/sync-log.json'

interface Entry {
  id: number
  date: string
  title: string | null
  body: string
}

const data: { updated: string; entries: Entry[] } = raw as any

const expanded = ref<Set<number>>(new Set())
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

function toggle(id: number) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

function shortDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', timeZone: 'UTC' })
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
      <div v-for="e in visible.recent" :key="e.id" class="tl-item">
        <div class="tl-marker">
          <span class="tl-dot" />
          <time class="tl-date-label">{{ shortDate(e.date) }}</time>
        </div>
        <div
          class="tl-card"
          :class="{ open: expanded.has(e.id) }"
          @click="toggle(e.id)"
        >
          <div class="tl-card-header">
            <span v-if="e.title" class="tl-title">{{ e.title }}</span>
            <span v-else class="tl-title muted">(no title)</span>
            <span class="tl-chevron">{{ expanded.has(e.id) ? '▴' : '▾' }}</span>
          </div>
          <div v-if="expanded.has(e.id)" class="tl-card-body">
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
      <Transition name="fade">
        <div v-if="showArchived" class="tl-track">
          <div v-for="e in visible.archived" :key="e.id" class="tl-item">
            <div class="tl-marker">
              <span class="tl-dot muted" />
              <time class="tl-date-label muted">{{ shortDate(e.date) }}</time>
            </div>
            <div
              class="tl-card"
              :class="{ open: expanded.has(e.id) }"
              @click="toggle(e.id)"
            >
              <div class="tl-card-header">
                <span v-if="e.title" class="tl-title">{{ e.title }}</span>
                <span v-else class="tl-title muted">(no title)</span>
                <span class="tl-chevron">{{ expanded.has(e.id) ? '▴' : '▾' }}</span>
              </div>
              <div v-if="expanded.has(e.id)" class="tl-card-body">
                <div class="tl-body-inner" v-html="e.body" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
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
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-border);
}

/* ── item ── */
.tl-item {
  margin-bottom: 16px;
}

/* ── marker (dot + date label) ── */
.tl-marker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}
.tl-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  margin-left: -19px; /* pull left so center aligns with timeline line */
}
.tl-dot.muted {
  background: var(--vp-c-text-3);
}
.tl-date-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.tl-date-label.muted {
  color: var(--vp-c-text-3);
}

/* ── card ── */
.tl-card {
  position: relative;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tl-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: -1px;
  width: 3px;
  border-radius: 8px 0 0 8px;
  background: transparent;
  transition: background 0.2s;
}
.tl-card:hover {
  border-color: var(--vp-c-border);
}
.tl-card:hover::before {
  background: var(--vp-c-brand-1);
}
.tl-card.open {
  border-color: var(--vp-c-brand-1);
}
.tl-card.open::before {
  background: var(--vp-c-brand-1);
}

.tl-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 14px;
}
.tl-title {
  flex: 1;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
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

/* ── archived section fade ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── empty ── */
.tl-empty {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 3rem 0;
}
</style>
