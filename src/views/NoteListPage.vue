<template>
  <AppLayout>
    <div class="note-list-page">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <template v-for="(item, index) in breadcrumbItems" :key="item.path">
            <span class="separator">/</span>
            <router-link
              v-if="index < breadcrumbItems.length - 1"
              :to="`/category/${item.path}`"
            >
              {{ item.name }}
            </router-link>
            <span v-else class="current">{{ item.name }}</span>
          </template>
        </div>
        <h1 class="page-title">{{ categoryName }}</h1>
        <p class="page-subtitle">{{ categorySubtitle }}</p>
      </div>

      <section v-if="guide && seriesGroups.length > 0" class="topic-guide">
        <div class="topic-guide-header">
          <p class="topic-guide-eyebrow">专题导读</p>
          <h2 class="topic-guide-title">{{ guide.title }}</h2>
          <p class="topic-guide-description">{{ guide.description }}</p>
        </div>

        <div class="topic-guide-grid">
          <router-link
            v-for="group in seriesGroups"
            :key="group.path"
            :to="`/category/${group.path}`"
            class="topic-guide-card"
          >
            <span class="topic-guide-card-eyebrow">{{ group.eyebrow || '专题' }}</span>
            <strong class="topic-guide-card-title">{{ group.title }}</strong>
            <p class="topic-guide-card-description">{{ group.description }}</p>
            <div class="topic-guide-card-meta">
              <span>{{ group.notes.length }} 篇</span>
              <span>{{ group.actionLabel }}</span>
            </div>
          </router-link>
        </div>
      </section>

      <div class="filter-bar">
        <div class="sort-options">
          <label>排序：</label>
          <select v-model="sortBy" @change="handleSort">
            <option value="sequence">默认顺序</option>
            <option value="date-desc">最新优先</option>
            <option value="date-asc">最旧优先</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>
        </div>
      </div>

      <template v-if="loading">
        <div class="notes-list">
          <SkeletonScreen type="card" :count="6" />
        </div>
      </template>

      <template v-else>
        <div v-if="seriesGroups.length > 0" class="series-stack">
          <section
            v-for="group in seriesGroups"
            :key="group.path"
            class="series-section"
          >
            <div class="series-header">
              <div class="series-copy">
                <span v-if="group.eyebrow" class="series-eyebrow">{{ group.eyebrow }}</span>
                <div class="series-title-row">
                  <h2 class="series-title">{{ group.title }}</h2>
                  <router-link :to="`/category/${group.path}`" class="series-link">
                    只看这一专题
                  </router-link>
                </div>
                <p class="series-description">{{ group.description }}</p>
              </div>
              <div class="series-meta">
                <span class="series-count">{{ group.notes.length }} 篇</span>
                <div v-if="group.tags.length > 0" class="series-tags">
                  <span v-for="tag in group.tags" :key="tag" class="series-tag">{{ tag }}</span>
                </div>
              </div>
            </div>

            <div class="notes-list">
              <NoteCard
                v-for="note in group.notes"
                :key="note.path"
                :note="note"
                :context-category-path="group.path"
              />
            </div>
          </section>
        </div>

        <div class="notes-list" v-else-if="sortedNotes.length > 0">
          <NoteCard
            v-for="note in sortedNotes"
            :key="note.path"
            :note="note"
            :context-category-path="categoryPath"
          />
        </div>

        <div v-else class="empty-state">
          <p>该分类下暂无笔记</p>
        </div>
      </template>

      <BackToTop />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import NoteCard from '../components/NoteCard.vue'
import BackToTop from '../components/BackToTop.vue'
import SkeletonScreen from '../components/SkeletonScreen.vue'
import {
  compareNotesByNewest,
  compareNotesByOldest,
  compareNotesBySequence
} from '@/utils/noteOrder'
import { getTopicGuide, getTopicGuideSection } from '@/config/topicGuides'
import {
  buildCategoryBreadcrumbs,
  groupNotesByImmediateChild,
  normalizeNotePath
} from '@/utils/noteSeries'

const route = useRoute()
const notesData = ref(null)
const sortBy = ref('sequence')
const loading = ref(true)

const categoryPath = computed(() => normalizeNotePath(route.params.category))

const breadcrumbItems = computed(() => {
  return buildCategoryBreadcrumbs(categoryPath.value)
})

const rootCategoryPath = computed(() => {
  return breadcrumbItems.value[0]?.path || categoryPath.value
})

const guide = computed(() => {
  return getTopicGuide(categoryPath.value)
})

const categoryEntry = computed(() => {
  if (!notesData.value || !Array.isArray(notesData.value.categories)) {
    return null
  }

  return notesData.value.categories.find((item) => normalizeNotePath(item.path) === categoryPath.value) || null
})

const categoryName = computed(() => {
  return categoryEntry.value?.name || breadcrumbItems.value.at(-1)?.name || categoryPath.value || '分类'
})

const notes = computed(() => {
  return Array.isArray(categoryEntry.value?.notes) ? categoryEntry.value.notes : []
})

const sortNotes = (inputNotes = []) => {
  const notesCopy = [...inputNotes]

  switch (sortBy.value) {
    case 'sequence':
      return notesCopy.sort(compareNotesBySequence)
    case 'date-desc':
      return notesCopy.sort(compareNotesByNewest)
    case 'date-asc':
      return notesCopy.sort(compareNotesByOldest)
    case 'title-asc':
      return notesCopy.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
    case 'title-desc':
      return notesCopy.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
    default:
      return notesCopy.sort(compareNotesBySequence)
  }
}

const sortedNotes = computed(() => {
  return sortNotes(notes.value)
})

const seriesGroups = computed(() => {
  if (!guide.value) {
    return []
  }

  const groups = groupNotesByImmediateChild(notes.value, categoryPath.value)

  return groups
    .map((group) => {
      const section = getTopicGuideSection(categoryPath.value, group.path)
      const fallbackDescription = group.notes[0]?.description || '这一组笔记正在整理中。'

      return {
        ...group,
        title: section?.title || group.name,
        eyebrow: section?.eyebrow || '',
        actionLabel: section?.actionLabel || '进入专题',
        description: section?.summary || fallbackDescription,
        tags: [...new Set(group.notes.flatMap((note) => Array.isArray(note.tags) ? note.tags : []))].slice(0, 3),
        notes: sortNotes(group.notes),
        order: Number.isFinite(section?.order) ? section.order : Number.MAX_SAFE_INTEGER
      }
    })
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order
      }

      return a.title.localeCompare(b.title, 'zh-CN')
    })
})

const categorySubtitle = computed(() => {
  if (seriesGroups.value.length > 0) {
    return `共 ${notes.value.length} 篇笔记，已按 ${seriesGroups.value.length} 条专题线整理`
  }

  return `共 ${notes.value.length} 篇笔记`
})

const handleSort = () => {
  // 排序逻辑已在 computed 中处理
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
    notesData.value = await response.json()
  } catch (error) {
    console.error('加载笔记索引失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.note-list-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--text-tertiary);
}

.current {
  color: var(--text-primary);
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.topic-guide {
  margin-bottom: 28px;
  padding: 24px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.14);
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(var(--primary-color-rgb), 0.08), rgba(var(--primary-color-rgb), 0.02)),
    var(--bg-primary);
}

.topic-guide-header {
  margin-bottom: 18px;
}

.topic-guide-eyebrow {
  margin: 0 0 8px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.topic-guide-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.3;
}

.topic-guide-description {
  margin: 0;
  max-width: 68ch;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.topic-guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.topic-guide-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.72);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
}

.dark-theme .topic-guide-card {
  background: rgba(15, 23, 37, 0.94);
}

.topic-guide-card:hover {
  border-color: rgba(var(--primary-color-rgb), 0.32);
  transform: translateY(-1px);
}

.topic-guide-card-eyebrow {
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.topic-guide-card-title {
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.4;
}

.topic-guide-card-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.topic-guide-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 24px;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-options label {
  font-size: 14px;
  color: var(--text-secondary);
}

.sort-options select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
}

.series-stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.series-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.series-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.series-copy {
  flex: 1;
  min-width: 0;
}

.series-eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.series-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.series-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  line-height: 1.2;
}

.series-link {
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.series-link:hover {
  text-decoration: underline;
}

.series-description {
  margin: 10px 0 0;
  max-width: 68ch;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.series-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.series-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 700;
}

.series-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.series-tag {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.24);
  color: var(--text-tertiary);
  font-size: 12px;
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .topic-guide {
    padding: 18px;
    border-radius: 16px;
  }

  .topic-guide-title {
    font-size: 22px;
  }

  .series-header {
    flex-direction: column;
  }

  .series-title {
    font-size: 22px;
  }

  .series-meta {
    align-items: flex-start;
  }

  .series-tags {
    justify-content: flex-start;
  }

  .notes-list {
    grid-template-columns: 1fr;
  }
}
</style>
