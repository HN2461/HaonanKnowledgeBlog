<template>
  <section class='knowledge-search' :class="[`is-${variant}`]">
    <header class='panel-head'>
      <div>
        <p class='panel-kicker'>知识检索</p>
        <h2 class='panel-title'>{{ panelTitle }}</h2>
        <p v-if='panelDescription' class='panel-description'>{{ panelDescription }}</p>
      </div>

      <button
        v-if='variant === "overlay"'
        class='panel-close'
        type='button'
        aria-label='关闭知识检索'
        @click="$emit('close')"
      >
        关闭
      </button>
    </header>

    <div class='search-box'>
      <svg class='search-icon' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
        <circle cx='11' cy='11' r='8'></circle>
        <path d='m21 21-4.35-4.35'></path>
      </svg>

      <input
        ref='searchInput'
        v-model='searchQuery'
        type='text'
        :placeholder='placeholder'
        @input='handleSearch'
        @keyup.enter='handleEnterSearch'
      />

      <span v-if='variant === "overlay" && !searchQuery' class='search-hint'>支持 / 与 Ctrl+K</span>

      <button v-if='searchQuery' class='clear-btn' type='button' aria-label='清空搜索词' @click='clearSearch'>
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
          <line x1='18' y1='6' x2='6' y2='18'></line>
          <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </button>
    </div>

    <div v-if='isLoadingIndex' class='status-row'>
      <span>正在载入检索索引…</span>
    </div>

    <template v-else-if='!hasQuery'>
      <div class='overview-grid'>
        <section class='overview-card'>
          <div class='section-head'>
            <h3>最近搜索</h3>
            <button v-if='searchHistory.length > 0' class='text-btn' type='button' @click='clearHistory'>清空</button>
          </div>

          <div v-if='searchHistory.length > 0' class='history-list'>
            <button
              v-for='(item, index) in searchHistory'
              :key='item'
              type='button'
              class='history-item'
              @click='applyQuery(item)'
            >
              <span class='history-order'>{{ String(index + 1).padStart(2, '0') }}</span>
              <span class='history-text'>{{ item }}</span>
              <span class='history-action'>重搜</span>
            </button>
          </div>

          <p v-else class='muted-copy'>这里会保留最近查过的问题。</p>
        </section>

        <section class='overview-card'>
          <div class='section-head'>
            <h3>根专题</h3>
            <span class='section-note'>按目录名直达</span>
          </div>

          <div class='topic-list' v-if='rootTopics.length > 0'>
            <button
              v-for='topic in rootTopics'
              :key='topic.path'
              type='button'
              class='topic-chip'
              @click='applyQuery(topic.name)'
            >
              <span>{{ topic.name }}</span>
              <strong>{{ topic.notesCount }}</strong>
            </button>
          </div>

          <p v-else class='muted-copy'>索引加载完成后，这里会显示可直接进入的根专题。</p>
        </section>
      </div>
    </template>

    <section v-else class='result-shell'>
      <div class='section-head'>
        <h3>找到 {{ visibleResults.length }} 条结果</h3>
        <span v-if='searchResults.length > visibleResults.length' class='section-note'>已截取前 {{ visibleResults.length }} 条</span>
      </div>

      <div class='results-list' v-if='visibleResults.length > 0'>
        <router-link
          v-for='result in visibleResults'
          :key='result.path'
          :to='`/note/${result.path.replace(".md", "")}`'
          class='result-item'
          @click='handleResultSelect'
        >
          <div class='result-head'>
            <div class='result-meta'>
              <span class='result-category'>{{ result.category }}</span>
              <span>{{ getNoteDateLabel(result) }}</span>
              <span>{{ formatWordCount(getNoteWordCount(result)) }} 字</span>
              <span>{{ getNoteReadingMinutes(result) }} 分钟</span>
            </div>
          </div>

          <h3 class='result-title' v-html='highlightText(result.title)'></h3>
          <p
            class='result-description'
            v-html='highlightText(getNoteExcerpt(result, { preferMatchedContent: result.matchedContent, maxLength: excerptLength }))'
          ></p>

          <div class='result-footer'>
            <div class='result-tags'>
              <span v-for='tag in (result.tags || []).slice(0, tagLimit)' :key='tag' class='result-tag'>
                {{ tag }}
              </span>
            </div>
            <span class='result-attachment'>{{ getAttachmentLabel(result.attachments) }}</span>
          </div>
        </router-link>
      </div>

      <div v-else class='empty-results'>
        <h3>没有找到相关内容</h3>
        <p>试试更短的关键词，或者直接搜专题名。</p>
        <div class='topic-list compact' v-if='rootTopics.length > 0'>
          <button
            v-for='topic in rootTopics.slice(0, 6)'
            :key='topic.path'
            type='button'
            class='topic-chip'
            @click='applyQuery(topic.name)'
          >
            <span>{{ topic.name }}</span>
            <strong>{{ topic.notesCount }}</strong>
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  buildRootTopics,
  escapeHtml,
  formatWordCount,
  getAttachmentLabel,
  getNoteDateLabel,
  getNoteExcerpt,
  getNoteReadingMinutes,
  getNoteWordCount
} from '@/utils/notePresentation'
import {
  clearSearchHistory,
  ensureSearchReady,
  getSearchHistory,
  saveSearchHistory,
  searchNotes
} from '@/utils/search'

const props = defineProps({
  variant: {
    type: String,
    default: 'page'
  },
  initialQuery: {
    type: String,
    default: ''
  },
  autoFocus: {
    type: Boolean,
    default: false
  },
  maxVisibleResults: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const searchInput = ref(null)
const searchQuery = ref((props.initialQuery || '').trim())
const searchResults = ref([])
const searchHistory = ref([])
const allNotes = ref([])
const isLoadingIndex = ref(false)

let searchTimeout = null

const hasQuery = computed(() => searchQuery.value.trim().length > 0)

const panelTitle = computed(() => {
  return props.variant === 'overlay' ? '直接找答案' : '完整检索视图'
})

const panelDescription = computed(() => {
  return props.variant === 'overlay'
    ? '输入报错、命令、工具名或专题名，直接回到对应笔记。'
    : '平时直接用头部搜索，这里保留完整结果列表与历史记录。'
})

const placeholder = computed(() => {
  return props.variant === 'overlay'
    ? '搜索报错、命令、专题或正文片段'
    : '搜索报错、命令、工具名、概念或专题'
})

const resultLimit = computed(() => {
  if (props.maxVisibleResults > 0) {
    return props.maxVisibleResults
  }

  return props.variant === 'overlay' ? 8 : 24
})

const excerptLength = computed(() => {
  return props.variant === 'overlay' ? 120 : 180
})

const tagLimit = computed(() => {
  return props.variant === 'overlay' ? 3 : 4
})

const visibleResults = computed(() => {
  return searchResults.value.slice(0, resultLimit.value)
})

const rootTopics = computed(() => {
  return buildRootTopics(allNotes.value)
    .sort((a, b) => {
      if (b.notesCount !== a.notesCount) {
        return b.notesCount - a.notesCount
      }

      return b.latestTimestamp - a.latestTimestamp
    })
    .slice(0, props.variant === 'overlay' ? 8 : 10)
})

const focusInput = async () => {
  await nextTick()
  searchInput.value?.focus()
}

const runSearch = () => {
  if (!hasQuery.value || allNotes.value.length === 0) {
    searchResults.value = []
    return
  }

  searchResults.value = searchNotes(searchQuery.value)
}

const commitSearchHistory = () => {
  const trimmedQuery = searchQuery.value.trim()

  if (trimmedQuery.length > 1) {
    saveSearchHistory(trimmedQuery)
    searchHistory.value = getSearchHistory()
  }
}

const handleSearch = (immediate = false) => {
  if (!hasQuery.value) {
    searchResults.value = []
    return
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (immediate) {
    runSearch()
    return
  }

  searchTimeout = setTimeout(runSearch, 180)
}

const handleEnterSearch = () => {
  handleSearch(true)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  focusInput()
}

const applyQuery = (query) => {
  searchQuery.value = query
  handleSearch(true)
  focusInput()
}

const clearHistory = () => {
  clearSearchHistory()
  searchHistory.value = []
}

const highlightText = (text) => {
  const safeText = escapeHtml(text)

  if (!searchQuery.value || !safeText) {
    return safeText
  }

  const escapedQuery = escapeHtml(searchQuery.value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')

  return safeText.replace(regex, '<mark>$1</mark>')
}

const handleResultSelect = () => {
  commitSearchHistory()
  emit('close')
}

const syncExternalQuery = (query) => {
  const nextQuery = (query || '').trim()

  if (nextQuery === searchQuery.value.trim()) {
    return
  }

  searchQuery.value = nextQuery

  if (!nextQuery) {
    searchResults.value = []
    return
  }

  if (allNotes.value.length > 0) {
    handleSearch(true)
  }
}

watch(
  () => props.initialQuery,
  (query) => {
    syncExternalQuery(query)
  }
)

onMounted(async () => {
  searchHistory.value = getSearchHistory()

  if (props.autoFocus) {
    focusInput()
  }

  isLoadingIndex.value = true

  try {
    allNotes.value = await ensureSearchReady()

    if (hasQuery.value) {
      handleSearch(true)
    }
  } catch (error) {
    console.error('初始化搜索失败:', error)
  } finally {
    isLoadingIndex.value = false
  }
})

onBeforeUnmount(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

defineExpose({
  focusInput
})
</script>

<style scoped>
.knowledge-search {
  display: grid;
  gap: 18px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-primary);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.dark-theme .knowledge-search {
  background: rgba(15, 23, 37, 0.98);
}

.knowledge-search.is-page {
  padding: 24px;
}

.knowledge-search.is-overlay {
  padding: 18px;
}

.panel-head,
.section-head,
.result-head,
.result-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-kicker {
  margin: 0 0 8px;
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  line-height: 1.2;
}

.knowledge-search.is-overlay .panel-title {
  font-size: 22px;
}

.panel-description {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.panel-close,
.clear-btn,
.text-btn {
  border: none;
  background: transparent;
}

.panel-close {
  padding: 0;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.panel-close:hover,
.text-btn:hover {
  color: var(--primary-color);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
}

.dark-theme .search-box {
  background: rgba(11, 19, 32, 0.88);
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
}

.search-box input:focus,
.search-box input:focus-visible {
  outline: none;
  box-shadow: none;
}

.search-hint {
  color: var(--text-tertiary);
  font-size: 11px;
  white-space: nowrap;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.clear-btn:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.08);
}

.status-row,
.muted-copy,
.empty-results p {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.overview-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.08);
  border-radius: 14px;
  background: var(--bg-secondary);
}

.dark-theme .overview-card,
.dark-theme .result-item {
  background: rgba(11, 19, 32, 0.88);
}

.section-head h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 15px;
}

.section-note,
.text-btn {
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

.topic-list,
.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-chip {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}

.history-list {
  display: grid;
  gap: 8px;
}

.history-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}

.history-order {
  color: var(--primary-color);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
  font-weight: 700;
}

.history-text {
  min-width: 0;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-action {
  color: var(--text-tertiary);
  font-size: 12px;
}

.topic-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  background: rgba(var(--primary-color-rgb), 0.04);
  color: var(--text-primary);
  font-size: 12px;
}

.topic-chip strong {
  color: var(--primary-color);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
}

.history-item:hover,
.topic-chip:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.28);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.history-item:hover .history-text,
.history-item:hover .history-action {
  color: inherit;
}

.result-shell {
  display: grid;
  gap: 14px;
}

.results-list {
  display: grid;
  gap: 10px;
}

.knowledge-search.is-overlay .results-list {
  max-height: min(52vh, 560px);
  overflow-y: auto;
  padding-right: 4px;
}

.result-item {
  display: block;
  padding: 15px 16px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.result-item:hover {
  border-color: rgba(var(--primary-color-rgb), 0.34);
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.result-category {
  color: var(--primary-color);
  font-weight: 700;
}

.result-title {
  margin: 10px 0 8px;
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.45;
}

.result-title :deep(mark),
.result-description :deep(mark) {
  padding: 0 3px;
  border-radius: 4px;
  background: rgba(var(--accent-color-rgb), 0.18);
  color: inherit;
}

.result-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.result-footer {
  margin-top: 12px;
}

.result-tag {
  padding: 3px 8px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.24);
  border-radius: 999px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.result-attachment {
  flex-shrink: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.empty-results {
  padding: 16px 0 4px;
  text-align: center;
}

.empty-results h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
}

.topic-list.compact {
  justify-content: center;
  margin-top: 14px;
}

@media (max-width: 900px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .knowledge-search.is-page,
  .knowledge-search.is-overlay {
    padding: 16px;
  }

  .panel-title {
    font-size: 22px;
  }

  .search-hint {
    display: none;
  }

  .result-head,
  .result-footer,
  .section-head,
  .panel-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
