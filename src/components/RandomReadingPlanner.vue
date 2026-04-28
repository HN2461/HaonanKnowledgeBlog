<template>
  <div class='daily-reading-entry' ref='triggerRef'>
    <button
      class='daily-reading-trigger'
      :class="{
        active: isOpen,
        complete: progress.isComplete
      }"
      type='button'
      :disabled='isLoading'
      :aria-label='buttonLabel'
      :aria-expanded='String(isOpen)'
      :title='buttonLabel'
      @click='togglePanel'
    >
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
        <path d='M16 3h5v5'></path>
        <path d='m4 20 17-17'></path>
        <path d='M21 16v5h-5'></path>
        <path d='m15 15 6 6'></path>
        <path d='m4 4 5 5'></path>
      </svg>

      <span v-if='progress.completedCount > 0' class='daily-reading-badge'>
        {{ badgeLabel }}
      </span>
    </button>
  </div>

  <Teleport to='body'>
    <Transition name='daily-reading-popover'>
      <div
        v-if='isOpen'
        ref='panelRef'
        class='daily-reading-popover'
      >
        <div class='daily-reading-popover-head'>
          <div class='daily-reading-popover-copy'>
            <p class='daily-reading-eyebrow'>随机阅读</p>
            <h3>今日已随机 {{ progress.completedCount }} 篇</h3>
            <p>{{ statusText }}</p>
          </div>

          <button
            class='daily-reading-close'
            type='button'
            aria-label='关闭随机阅读面板'
            @click='closePanel'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>

        <div class='daily-reading-status-card'>
          <div class='daily-reading-status-row'>
            <span>最低目标</span>
            <strong>{{ progress.completedCount }}/{{ progress.target }}</strong>
          </div>

          <div class='daily-reading-progress-track' aria-hidden='true'>
            <span :style="{ width: `${progress.percent}%` }"></span>
          </div>
        </div>

        <div class='daily-reading-actions'>
          <button
            class='daily-reading-action daily-reading-action-primary'
            type='button'
            :disabled='isLoading'
            @click='handleRandomJump'
          >
            随机跳一篇
          </button>

          <button
            class='daily-reading-action daily-reading-action-secondary'
            type='button'
            :disabled='progress.completedCount === 0'
            @click='handleReset'
          >
            重置今日计数
          </button>
        </div>

        <p class='daily-reading-footnote'>3 篇只是最低标准，达标后你仍然可以继续随机抽读。</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Teleport, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadNotesIndex } from '@/utils/indexData'
import {
  getDailyRandomReadingProgress,
  loadDailyRandomReadingState,
  pickNextDailyRandomReading,
  resetDailyRandomReadingState,
  saveDailyRandomReadingState
} from '@/utils/dailyRandomReading'

const router = useRouter()
const route = useRoute()
const triggerRef = ref(null)
const panelRef = ref(null)
const isLoading = ref(false)
const isOpen = ref(false)
const notesData = ref(null)
const state = ref(loadDailyRandomReadingState())

const progress = computed(() => getDailyRandomReadingProgress(state.value))
const currentNotePath = computed(() => {
  return route.name === 'NoteDetail'
    ? String(route.params.path || '')
    : ''
})

const badgeLabel = computed(() => {
  return progress.value.completedCount > 99
    ? '99+'
    : String(progress.value.completedCount)
})

const buttonLabel = computed(() => {
  if (isLoading.value) {
    return '正在准备随机文章'
  }

  return `随机阅读入口，今日已随机 ${progress.value.completedCount} 篇，最低目标 ${progress.value.target} 篇`
})

const statusText = computed(() => {
  if (progress.value.completedCount === 0) {
    return '还没开始，点一下就交给随机机制。'
  }

  if (progress.value.isComplete) {
    return '已经达标了，今天还可以继续随机抽读。'
  }

  return `距离最低目标还差 ${progress.value.remainingCount} 篇。`
})

function syncState() {
  state.value = loadDailyRandomReadingState()
}

async function ensureNotesLoaded() {
  if (notesData.value || isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    notesData.value = await loadNotesIndex()
  } finally {
    isLoading.value = false
  }
}

async function handleRandomJump() {
  syncState()
  await ensureNotesLoaded()

  const result = pickNextDailyRandomReading(
    state.value,
    notesData.value?.allNotes || [],
    currentNotePath.value
  )

  state.value = saveDailyRandomReadingState(result.state)

  if (result.nextItem?.path) {
    closePanel()
    await router.push(`/note/${result.nextItem.path}`)
  }
}

function handleReset() {
  state.value = saveDailyRandomReadingState(resetDailyRandomReadingState())
}

function togglePanel() {
  syncState()
  isOpen.value = !isOpen.value
}

function closePanel() {
  isOpen.value = false
}

function handleDocumentPointerDown(event) {
  if (!isOpen.value) {
    return
  }

  const clickTarget = event.target
  if (triggerRef.value?.contains(clickTarget) || panelRef.value?.contains(clickTarget)) {
    return
  }

  closePanel()
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<style scoped>
.daily-reading-entry {
  flex-shrink: 0;
}

.daily-reading-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.daily-reading-trigger:hover:not(:disabled),
.daily-reading-trigger.active {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.daily-reading-trigger.complete {
  color: #059669;
  border-color: rgba(16, 185, 129, 0.22);
  background: rgba(16, 185, 129, 0.08);
}

.daily-reading-trigger:disabled {
  opacity: 0.72;
  cursor: default;
}

.daily-reading-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #10b981);
  color: #fff;
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 10px;
  font-weight: 700;
  line-height: 17px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
}

.daily-reading-popover {
  position: fixed;
  top: 84px;
  right: 24px;
  z-index: 250;
  width: min(300px, calc(100vw - 24px));
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background:
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 40%),
    var(--bg-primary);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14);
}

.dark-theme .daily-reading-popover {
  background:
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.16), transparent 40%),
    rgba(15, 23, 37, 0.98);
}

.daily-reading-popover-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.daily-reading-popover-copy {
  min-width: 0;
}

.daily-reading-eyebrow {
  margin: 0 0 5px;
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.daily-reading-popover-head h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.25;
}

.daily-reading-popover-copy p:last-child {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.daily-reading-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.daily-reading-close:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.daily-reading-status-card {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  border-radius: 14px;
  background: rgba(var(--primary-color-rgb), 0.04);
}

.daily-reading-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.daily-reading-status-row strong {
  color: var(--text-primary);
  font-size: 13px;
}

.daily-reading-progress-track {
  height: 6px;
  margin-top: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(var(--primary-color-rgb), 0.12);
}

.daily-reading-progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #10b981);
}

.daily-reading-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 14px;
}

.daily-reading-action {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, opacity 0.18s ease;
}

.daily-reading-action-primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.18);
}

.daily-reading-action-secondary {
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.daily-reading-action-secondary:hover:not(:disabled) {
  border-color: rgba(var(--primary-color-rgb), 0.18);
  color: var(--text-primary);
  background: rgba(var(--primary-color-rgb), 0.04);
}

.daily-reading-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.daily-reading-footnote {
  margin: 12px 0 0;
  color: var(--text-tertiary);
  font-size: 11px;
  line-height: 1.6;
}

.daily-reading-popover-enter-active,
.daily-reading-popover-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.daily-reading-popover-enter-from,
.daily-reading-popover-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 768px) {
  .daily-reading-popover {
    top: 78px;
    right: 14px;
    left: 14px;
    width: auto;
  }
}
</style>
