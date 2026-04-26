<template>
  <AppLayout>
    <div class='search-page'>
      <!-- 搜索框区域 -->
      <div class='search-header'>
        <div class='search-box'>
          <svg class='search-icon' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <circle cx='11' cy='11' r='8'></circle>
            <path d='m21 21-4.35-4.35'></path>
          </svg>
          <input
            ref='searchInput'
            v-model='searchQuery'
            type='text'
            placeholder='搜索关键词，空格或逗号分隔多词…'
            @input='handleSearch'
            @keyup.enter='handleSearch(true)'
          />

          <!-- 多词匹配模式切换（分词后超过 1 个词时显示） -->
          <div class='match-mode' v-if='hasMultipleWords'>
            <button
              class='mode-btn'
              :class='{ active: matchMode === "AND" }'
              type='button'
              title='全部包含：文章必须同时包含所有词'
              @click='matchMode = "AND"'
            >全部</button>
            <button
              class='mode-btn'
              :class='{ active: matchMode === "OR" }'
              type='button'
              title='任意包含：文章包含其中一个词即可'
              @click='matchMode = "OR"'
            >任意</button>
          </div>

          <button v-if='searchQuery' class='clear-btn' type='button' aria-label='清空' @click='clearSearch'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>

        <div class='search-meta' v-if='hasQuery'>
          <span class='result-count' v-if='!isLoading'>
            共找到 <strong>{{ filteredResults.length }}</strong> 条结果
            <span v-if='activeCategory'> · {{ activeCategory }}</span>
          </span>
          <span class='result-count' v-else>搜索中…</span>

          <div class='sort-bar'>
            <button
              v-for='opt in sortOptions'
              :key='opt.value'
              class='sort-btn'
              :class='{ active: sortBy === opt.value }'
              type='button'
              @click='sortBy = opt.value'
            >{{ opt.label }}</button>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if='isLoading' class='status-tip'>正在载入检索索引…</div>

      <!-- 有搜索词 -->
      <template v-else-if='hasQuery'>
        <!-- 分类筛选（单选） -->
        <div class='category-bar' v-if='categoryList.length > 1'>
          <button
            class='cat-chip'
            :class='{ active: !activeCategory }'
            type='button'
            @click='activeCategory = ""'
          >
            全部
            <strong>{{ allResults.length }}</strong>
          </button>
          <button
            v-for='cat in categoryList'
            :key='cat.name'
            class='cat-chip'
            :class='{ active: activeCategory === cat.name }'
            type='button'
            @click='activeCategory = activeCategory === cat.name ? "" : cat.name'
          >
            {{ cat.name }}
            <strong>{{ cat.count }}</strong>
          </button>
        </div>

        <!-- 结果列表 -->
        <div class='results-list' v-if='filteredResults.length > 0'>
          <router-link
            v-for='result in pagedResults'
            :key='result.path'
            :to='`/note/${result.path.replace(".md", "")}`'
            class='result-item'
            @click='saveHistory'
          >
            <div class='result-head'>
              <div class='result-meta'>
                <span class='result-category'>{{ result.category }}</span>
                <span>{{ getNoteDateLabel(result) }}</span>
                <span>{{ formatWordCount(getNoteWordCount(result)) }} 字</span>
                <span>{{ getNoteReadingMinutes(result) }} 分钟</span>
              </div>
            </div>
            <h3 class='result-title' v-html='highlight(result.title)'></h3>
            <p class='result-desc' v-html='highlight(getNoteExcerpt(result, { preferMatchedContent: result.matchedContent, maxLength: 200 }))'></p>
            <div class='result-footer'>
              <div class='result-tags'>
                <span v-for='tag in (result.tags || []).slice(0, 5)' :key='tag' class='result-tag'>{{ tag }}</span>
              </div>
              <span class='result-attach'>{{ getAttachmentLabel(result.attachments) }}</span>
            </div>
          </router-link>
        </div>

        <!-- 分页器 -->
        <div class='pagination' v-if='totalPages > 1 || filteredResults.length > 0'>
          <div class='page-size-bar'>
            <span class='page-size-label'>每页</span>
            <button
              v-for='n in PAGE_SIZE_OPTIONS'
              :key='n'
              class='page-btn size-btn'
              :class='{ active: pageSize === n }'
              type='button'
              @click='pageSize = n'
            >{{ n }}</button>
            <span class='page-size-label'>条</span>
          </div>

          <div class='page-nav' v-if='totalPages > 1'>
            <button
              class='page-btn'
              :disabled='currentPage === 1'
              type='button'
              aria-label='上一页'
              @click='currentPage--; scrollToTop()'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'>
                <path d='m15 18-6-6 6-6'></path>
              </svg>
            </button>

            <template v-for='p in pageNumbers' :key='p'>
              <span v-if='p === "..."' class='page-ellipsis'>…</span>
              <button
                v-else
                class='page-btn'
                :class='{ active: currentPage === p }'
                type='button'
                @click='currentPage = p; scrollToTop()'
              >{{ p }}</button>
            </template>

            <button
              class='page-btn'
              :disabled='currentPage === totalPages'
              type='button'
              aria-label='下一页'
              @click='currentPage++; scrollToTop()'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'>
                <path d='m9 18 6-6-6-6'></path>
              </svg>
            </button>

            <span class='page-info'>{{ currentPage }} / {{ totalPages }} 页</span>
          </div>
        </div>

        <!-- 无结果 -->
        <div v-else class='empty-state'>
          <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'>
            <circle cx='11' cy='11' r='8'></circle>
            <path d='m21 21-4.35-4.35'></path>
          </svg>
          <h3>没有找到"{{ searchQuery }}"</h3>
          <p>试试更短的关键词，或者切换分类筛选。</p>
        </div>
      </template>

      <!-- 无搜索词：显示历史 + 专题 -->
      <template v-else>
        <div class='overview-grid'>
          <section class='overview-card'>
            <div class='card-head'>
              <h3>最近搜索</h3>
              <button v-if='searchHistory.length > 0' class='text-btn' type='button' @click='clearHistory'>清空</button>
            </div>
            <div v-if='searchHistory.length > 0' class='history-list'>
              <button
                v-for='(item, i) in searchHistory'
                :key='item'
                type='button'
                class='history-item'
                @click='applyQuery(item)'
              >
                <span class='history-order'>{{ String(i + 1).padStart(2, '0') }}</span>
                <span class='history-text'>{{ item }}</span>
                <span class='history-action'>重搜</span>
              </button>
            </div>
            <p v-else class='muted'>这里会保留最近查过的问题。</p>
          </section>

          <section class='overview-card'>
            <div class='card-head'>
              <h3>根专题</h3>
              <span class='card-note'>按目录名直达</span>
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
            <p v-else class='muted'>索引加载完成后显示可直接进入的根专题。</p>
          </section>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import {
  buildRootTopics,
  formatWordCount,
  getAttachmentLabel,
  getNoteDateLabel,
  getNoteExcerpt,
  getNoteReadingMinutes,
  getNoteWordCount,
  getRootDirectoryPaths
} from '@/utils/notePresentation'
import {
  clearSearchHistory,
  ensureSearchReady,
  getSearchTerms,
  getSearchHistory,
  highlightSearchText,
  saveSearchHistory,
  searchNotes
} from '@/utils/search'

const route = useRoute()
const router = useRouter()
const searchInput = ref(null)
const searchQuery = ref('')
const allResults = ref([])
const searchHistory = ref([])
const searchIndex = ref(null)
const isLoading = ref(false)
const activeCategory = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const PAGE_SIZE_OPTIONS = [10, 20, 50]
const pageSize = ref(10)
const matchMode = ref('AND') // AND=全部包含，OR=任意包含

let searchTimeout = null
let isInitializing = true // 初始化阶段不触发 URL 同步

const sortOptions = [
  { value: 'relevance', label: '相关度' },
  { value: 'date', label: '最新' },
  { value: 'wordCount', label: '字数' }
]

const hasQuery = computed(() => searchQuery.value.trim().length > 0)

// 是否有多个词（空格或逗号分词后）
const hasMultipleWords = computed(() => {
  return getSearchTerms(searchQuery.value).length > 1
})

const allNotes = computed(() =>
  Array.isArray(searchIndex.value?.allNotes) ? searchIndex.value.allNotes : []
)

const rootTopics = computed(() =>
  buildRootTopics(allNotes.value, {
    orderedPaths: getRootDirectoryPaths(searchIndex.value?.tree)
  })
)

// 按分类统计
const categoryList = computed(() => {
  const map = {}
  allResults.value.forEach(r => {
    const cat = r.category || '未分类'
    map[cat] = (map[cat] || 0) + 1
  })
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// 筛选 + 排序
const filteredResults = computed(() => {
  let list = activeCategory.value
    ? allResults.value.filter(r => r.category === activeCategory.value)
    : allResults.value

  if (sortBy.value === 'date') {
    list = [...list].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  } else if (sortBy.value === 'wordCount') {
    list = [...list].sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0))
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize.value))

const pagedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredResults.value.slice(start, start + pageSize.value)
})

// 分页器显示的页码列表（最多显示 7 个）
const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) {
    pages.push(i)
  }
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const highlight = (text) => highlightSearchText(text, searchQuery.value)

const runSearch = () => {
  if (!hasQuery.value || allNotes.value.length === 0) {
    allResults.value = []
    return
  }
  allResults.value = searchNotes(searchQuery.value, matchMode.value)
  activeCategory.value = ''
  currentPage.value = 1
}

const handleSearch = (immediate = false) => {
  if (!hasQuery.value) {
    allResults.value = []
    return
  }
  if (searchTimeout) clearTimeout(searchTimeout)
  if (immediate) { runSearch(); return }
  searchTimeout = setTimeout(runSearch, 180)
}

const clearSearch = () => {
  searchQuery.value = ''
  allResults.value = []
  activeCategory.value = ''
  router.replace({ path: '/search' })
  nextTick(() => searchInput.value?.focus())
}

const applyQuery = (q) => {
  searchQuery.value = q
  handleSearch(true)
  nextTick(() => searchInput.value?.focus())
}

const saveHistory = () => {
  if (searchQuery.value.trim().length > 1) {
    saveSearchHistory(searchQuery.value.trim())
    searchHistory.value = getSearchHistory()
  }
}

const clearHistory = () => {
  clearSearchHistory()
  searchHistory.value = []
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 同步 URL query 参数（初始化阶段跳过，避免空格被截断）
watch(searchQuery, (val) => {
  if (isInitializing) return
  const q = val.trim()
  router.replace({ path: '/search', query: q ? { q } : {} })
})

// 切换分类/排序/每页条数时回到第1页
watch([activeCategory, sortBy, pageSize], () => {
  currentPage.value = 1
})

// 切换匹配模式时重新搜索
watch(matchMode, () => {
  if (hasQuery.value) runSearch()
})

onMounted(async () => {
  searchHistory.value = getSearchHistory()

  // hash 模式下直接从 hash 解析 q 参数，避免 Vue Router 对空格的处理问题
  const hashMatch = window.location.hash.match(/[?&]q=([^&]*)/)
  const q = hashMatch ? decodeURIComponent(hashMatch[1]).trim() : ''
  if (q) searchQuery.value = q

  isLoading.value = true
  try {
    searchIndex.value = await ensureSearchReady()
    if (hasQuery.value) runSearch()
  } catch (e) {
    console.error('搜索索引加载失败:', e)
  } finally {
    isLoading.value = false
    isInitializing = false // 初始化完成，后续 watch 正常触发 URL 同步
  }

  nextTick(() => searchInput.value?.focus())
})
</script>

<style scoped>
.search-page {
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 40px;
  display: grid;
  gap: 20px;
}

/* 搜索框 */
.search-header {
  display: grid;
  gap: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-primary);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.dark-theme .search-box {
  background: rgba(15, 23, 37, 0.98);
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
  font-size: 16px;
}

.search-box input:focus,
.search-box input:focus-visible {
  outline: none;
  box-shadow: none;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.18s, background 0.18s;
}

.clear-btn:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.08);
}

/* 多词匹配模式切换 */
.match-mode {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  padding: 3px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.mode-btn {
  padding: 3px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.mode-btn.active {
  background: var(--primary-color);
  color: #fff;
}

.mode-btn:not(.active):hover {
  color: var(--primary-color);
}

/* 结果统计 + 排序 */
.search-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.result-count {
  color: var(--text-secondary);
  font-size: 13px;
}

.result-count strong {
  color: var(--primary-color);
  font-weight: 700;
}

.sort-bar {
  display: flex;
  gap: 6px;
}

.sort-btn {
  padding: 5px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}

.sort-btn.active,
.sort-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

/* 分类筛选 */
.category-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}

.cat-chip strong {
  color: var(--text-tertiary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.cat-chip.active,
.cat-chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.cat-chip.active strong,
.cat-chip:hover strong {
  color: var(--primary-color);
}

/* 结果列表 */
.results-list {
  display: grid;
  gap: 10px;
}

.result-item {
  display: block;
  padding: 16px 18px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  text-decoration: none;
  transition: border-color 0.18s, background 0.18s;
}

.dark-theme .result-item {
  background: rgba(11, 19, 32, 0.88);
}

.result-item:hover {
  border-color: rgba(var(--primary-color-rgb), 0.34);
}

.result-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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
.result-desc :deep(mark) {
  padding: 0 3px;
  border-radius: 4px;
  background: rgba(var(--accent-color-rgb), 0.18);
  color: inherit;
}

.result-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.result-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.result-tag {
  padding: 3px 8px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.24);
  border-radius: 999px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.result-attach {
  flex-shrink: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

/* 空状态 */
.empty-state {
  padding: 48px 0;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 加载 */
.status-tip {
  color: var(--text-secondary);
  font-size: 14px;
  padding: 24px 0;
}

/* 无搜索词：历史 + 专题 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.overview-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.08);
  border-radius: 14px;
  background: var(--bg-secondary);
}

.dark-theme .overview-card {
  background: rgba(11, 19, 32, 0.88);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-head h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 15px;
}

.card-note,
.text-btn {
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

.text-btn {
  border: none;
  background: transparent;
  cursor: pointer;
}

.text-btn:hover {
  color: var(--primary-color);
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
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}

.history-order {
  color: var(--primary-color);
  font-family: 'JetBrains Mono', monospace;
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

.history-item:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.28);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.history-item:hover .history-text,
.history-item:hover .history-action {
  color: inherit;
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.04);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}

.topic-chip strong {
  color: var(--primary-color);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.topic-chip:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.28);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.muted {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .search-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 分页器 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  flex-wrap: wrap;
}

.page-size-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-size-label {
  color: var(--text-tertiary);
  font-size: 12px;
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}

.size-btn {
  min-width: 40px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.page-btn.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-ellipsis {
  color: var(--text-tertiary);
  font-size: 13px;
  padding: 0 4px;
  line-height: 36px;
}

.page-info {
  color: var(--text-tertiary);
  font-size: 12px;
  margin-left: 6px;
}

/* 清除筛选按钮 */
.cat-chip.clear-cat {
  border-style: dashed;
  color: var(--text-tertiary);
  gap: 4px;
}

.cat-chip.clear-cat:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
}
</style>
