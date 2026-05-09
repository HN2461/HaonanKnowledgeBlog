<template>
  <AppLayout>
    <div class='bookmarks-page'>
      <section class='bookmark-toolbar' v-if='!loading && !errorMessage'>
        <div class='toolbar-copy'>
          <p class='toolbar-kicker'>书签收藏</p>
          <h1 class='toolbar-title'>快速找网址，不走文章阅读</h1>
          <p class='toolbar-description'>
            这里保留主人全部收藏，并按我重新整理过的用途分类。现在重点不是展开讲解，而是让你能更快搜到、看到、点进去。
          </p>
        </div>

        <div class='toolbar-stats' v-if='summary'>
          <div class='toolbar-stat'>
            <span>总数</span>
            <strong>{{ summary.totalCount }}</strong>
          </div>
          <div class='toolbar-stat'>
            <span>分类</span>
            <strong>{{ categories.length }}</strong>
          </div>
          <div class='toolbar-stat'>
            <span>原收藏夹</span>
            <strong>{{ sourceGroups.length }}</strong>
          </div>
        </div>
      </section>

      <section class='search-panel' v-if='!loading && !errorMessage'>
        <div class='search-shell'>
          <svg class='search-icon' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <circle cx='11' cy='11' r='8'></circle>
            <path d='m21 21-4.35-4.35'></path>
          </svg>

          <input
            v-model='searchQuery'
            type='text'
            placeholder='搜标题、域名、分类、原收藏夹...'
          >

          <button v-if='searchQuery' class='clear-btn' type='button' aria-label='清空搜索词' @click='searchQuery = ""'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>

        <div class='current-state'>
          <span>当前显示 {{ filteredBookmarks.length }} / {{ allBookmarks.length }} 条</span>
          <span v-if='summary?.sourceFile'>来源：{{ summary.sourceFile }}</span>
        </div>

        <div class='filter-block'>
          <div class='filter-head'>
            <span>整理分类</span>
            <button
              class='filter-reset'
              type='button'
              v-if='activeCategory'
              @click='activeCategory = ""'
            >
              清空
            </button>
          </div>

          <div class='chip-row'>
            <button
              class='filter-chip'
              :class="{ active: !activeCategory }"
              type='button'
              @click='activeCategory = ""'
            >
              全部
              <strong>{{ allBookmarks.length }}</strong>
            </button>

            <button
              v-for='category in categories'
              :key='category.name'
              class='filter-chip'
              :class="{ active: activeCategory === category.name }"
              type='button'
              @click='activeCategory = activeCategory === category.name ? "" : category.name'
            >
              {{ category.name }}
              <strong>{{ category.count }}</strong>
            </button>
          </div>
        </div>

        <div class='filter-block'>
          <div class='filter-head'>
            <span>原收藏夹</span>
            <button
              class='filter-reset'
              type='button'
              v-if='activeSourceGroup'
              @click='activeSourceGroup = ""'
            >
              清空
            </button>
          </div>

          <div class='chip-row'>
            <button
              class='filter-chip secondary'
              :class="{ active: !activeSourceGroup }"
              type='button'
              @click='activeSourceGroup = ""'
            >
              全部原目录
            </button>

            <button
              v-for='group in sourceGroupPreview'
              :key='group.name'
              class='filter-chip secondary'
              :class="{ active: activeSourceGroup === group.name }"
              type='button'
              @click='activeSourceGroup = activeSourceGroup === group.name ? "" : group.name'
            >
              {{ group.name }}
              <strong>{{ group.count }}</strong>
            </button>
          </div>
        </div>

        <div class='filter-block compact'>
          <div class='filter-head'>
            <span>条目类型</span>
            <button
              class='filter-reset'
              type='button'
              v-if='activeType'
              @click='activeType = ""'
            >
              清空
            </button>
          </div>

          <div class='chip-row'>
            <button
              class='filter-chip tertiary'
              :class="{ active: !activeType }"
              type='button'
              @click='activeType = ""'
            >
              全部类型
            </button>

            <button
              v-for='type in types'
              :key='type.name'
              class='filter-chip tertiary'
              :class="{ active: activeType === type.name }"
              type='button'
              @click='activeType = activeType === type.name ? "" : type.name'
            >
              {{ type.name }}
              <strong>{{ type.count }}</strong>
            </button>
          </div>
        </div>
      </section>

      <div v-if='loading' class='status-panel'>
        正在载入书签收藏...
      </div>

      <div v-else-if='errorMessage' class='status-panel error'>
        {{ errorMessage }}
      </div>

      <template v-else>
        <section
          v-for='group in groupedBookmarks'
          :key='group.category'
          class='bookmark-group'
        >
          <div class='group-head'>
            <div>
              <p class='group-kicker'>{{ group.description }}</p>
              <h2 class='group-title'>{{ group.category }}</h2>
            </div>
            <span class='group-count'>{{ group.items.length }} 条</span>
          </div>

          <div class='bookmark-grid'>
            <a
              v-for='bookmark in group.items'
              :key='bookmark.id'
              class='bookmark-item'
              :href='bookmark.url'
              target='_blank'
              rel='noreferrer'
              :title='`${bookmark.title}\n${bookmark.originalPath}`'
            >
              <div class='bookmark-top'>
                <h3 class='bookmark-title' v-html='highlightText(bookmark.title)'></h3>
                <svg class='bookmark-arrow' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M7 17 17 7'></path>
                  <path d='M7 7h10v10'></path>
                </svg>
              </div>

              <div class='bookmark-meta'>
                <span class='bookmark-domain' v-html='highlightText(bookmark.domain)'></span>
                <span>{{ bookmark.type }}</span>
                <span v-html='highlightText(bookmark.sourceGroup)'></span>
              </div>

              <p class='bookmark-path' v-html='highlightText(bookmark.originalPath)'></p>
            </a>
          </div>
        </section>

        <div v-if='groupedBookmarks.length === 0' class='status-panel empty'>
          没有匹配到书签，主人可以换个关键词或者把筛选清掉试试。
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import {
  filterBookmarks,
  groupBookmarksByCategory,
  highlightBookmarkText
} from '@/utils/bookmarkCatalog'
import { loadBookmarksIndex } from '@/utils/bookmarksData'

const loading = ref(true)
const errorMessage = ref('')
const summary = ref(null)
const searchQuery = ref('')
const activeCategory = ref('')
const activeSourceGroup = ref('')
const activeType = ref('')

function highlightText(value = '') {
  return highlightBookmarkText(value, searchQuery.value)
}

const allBookmarks = computed(() => {
  return Array.isArray(summary.value?.entries) ? summary.value.entries : []
})

const categories = computed(() => {
  return Array.isArray(summary.value?.categories) ? summary.value.categories : []
})

const types = computed(() => {
  return Array.isArray(summary.value?.types) ? summary.value.types : []
})

const sourceGroups = computed(() => {
  return Array.isArray(summary.value?.sourceGroups) ? summary.value.sourceGroups : []
})

const sourceGroupPreview = computed(() => {
  return sourceGroups.value.slice(0, 12)
})

const filteredBookmarks = computed(() => {
  return filterBookmarks(allBookmarks.value, {
    query: searchQuery.value,
    category: activeCategory.value,
    type: activeType.value,
    sourceGroup: activeSourceGroup.value
  })
})

const groupedBookmarks = computed(() => {
  return groupBookmarksByCategory(filteredBookmarks.value, categories.value)
})

onMounted(async () => {
  try {
    summary.value = await loadBookmarksIndex()
  } catch (error) {
    console.error('加载书签索引失败:', error)
    errorMessage.value = '书签索引加载失败，请稍后再试。'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.bookmarks-page {
  max-width: 1220px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.bookmark-toolbar,
.search-panel,
.bookmark-group {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-primary);
}

.bookmark-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 22px;
  margin-bottom: 16px;
}

.toolbar-kicker,
.group-kicker,
.filter-head span {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.toolbar-title,
.group-title {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.toolbar-title {
  font-size: 28px;
}

.toolbar-description {
  margin: 10px 0 0;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 760px;
}

.toolbar-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(88px, 1fr));
  gap: 10px;
  flex-shrink: 0;
}

.toolbar-stat {
  min-height: 86px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background: rgba(var(--primary-color-rgb), 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.toolbar-stat span {
  color: var(--text-secondary);
  font-size: 12px;
}

.toolbar-stat strong {
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1;
}

.search-panel {
  padding: 18px;
  margin-bottom: 16px;
}

.search-shell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 50px;
  padding: 0 14px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.14);
  border-radius: 12px;
  background: rgba(var(--primary-color-rgb), 0.04);
}

.search-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.search-shell input {
  width: 100%;
  min-width: 0;
  height: 48px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
}

.search-shell input:focus {
  outline: none;
}

.clear-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--text-secondary);
}

.current-state {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

.filter-block + .filter-block {
  margin-top: 14px;
}

.filter-block.compact {
  margin-top: 12px;
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.filter-reset {
  color: var(--text-secondary);
  font-size: 12px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background: rgba(var(--primary-color-rgb), 0.03);
  color: var(--text-secondary);
  font-size: 13px;
  transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.filter-chip strong {
  color: var(--text-primary);
  font-size: 12px;
}

.filter-chip.active {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.08);
}

.filter-chip.secondary {
  background: rgba(var(--primary-color-rgb), 0.02);
}

.filter-chip.tertiary {
  background: transparent;
}

.bookmark-group {
  padding: 18px;
}

.bookmark-group + .bookmark-group {
  margin-top: 14px;
}

.group-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.group-kicker {
  margin-bottom: 8px;
}

.group-title {
  font-size: 22px;
}

.group-count {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.08);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
}

.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.bookmark-item {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
  background: rgba(var(--primary-color-rgb), 0.02);
  text-decoration: none;
  transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
}

.bookmark-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.bookmark-title {
  flex: 1;
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.55;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bookmark-arrow {
  flex-shrink: 0;
  color: var(--text-secondary);
  margin-top: 2px;
}

.bookmark-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.bookmark-meta span:not(:last-child)::after {
  content: '·';
  margin-left: 10px;
}

.bookmark-domain {
  color: var(--primary-color);
}

.bookmark-path {
  margin: 6px 0 0;
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-panel {
  padding: 24px 18px;
  border-radius: 14px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.03);
  color: var(--text-secondary);
}

.status-panel.error {
  color: #b91c1c;
  border-color: rgba(185, 28, 28, 0.2);
  background: rgba(185, 28, 28, 0.05);
}

.status-panel.empty {
  margin-top: 16px;
}

:deep(mark) {
  padding: 0 2px;
  border-radius: 4px;
  background: rgba(250, 204, 21, 0.34);
  color: inherit;
}

.filter-chip:hover,
.bookmark-item:hover,
.clear-btn:hover,
.filter-reset:hover {
  color: var(--primary-color);
}

.bookmark-item:hover {
  border-color: rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.05);
  transform: translateY(-1px);
}

@media (max-width: 960px) {
  .bookmark-toolbar,
  .group-head {
    flex-direction: column;
  }

  .toolbar-stats {
    width: 100%;
  }

  .bookmark-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .toolbar-title {
    font-size: 24px;
  }

  .bookmark-toolbar,
  .search-panel,
  .bookmark-group {
    padding: 16px;
  }

  .toolbar-stats {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .bookmark-meta {
    gap: 4px 8px;
  }

  .bookmark-meta span:not(:last-child)::after {
    margin-left: 8px;
  }
}
</style>
