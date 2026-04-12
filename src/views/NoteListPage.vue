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

      <section v-if="directoryGuideMarkdown" class="category-overview">
        <div class="category-overview-header">
          <p class="category-overview-eyebrow">目录导读</p>
          <h2 class="category-overview-title">{{ categoryName }}导览</h2>
          <p class="category-overview-description">
            当前分类的目录说明会直接显示在这里，方便先看结构再进入具体文章。
          </p>
        </div>

        <div class="category-overview-body">
          <MarkdownRenderer :content="directoryGuideMarkdown" />
        </div>
      </section>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import NoteCard from '@/components/NoteCard.vue'
import BackToTop from '@/components/BackToTop.vue'
import SkeletonScreen from '@/components/SkeletonScreen.vue'
import {
  compareNotesByNewest,
  compareNotesByOldest,
  compareNotesBySequence,
  stripLeadingSequencePrefix
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
const directoryGuideMarkdown = ref('')
let directoryGuideRequestId = 0

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

const encodePathSegments = (filePath) => {
  return String(filePath || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const normalizeTitleForCompare = (title) => {
  return stripLeadingSequencePrefix(title)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s_\-–—~`!@#$%^&*()+=[\]{}|\\:;"'<>,.?/·，。、《》？；：‘’“”（）【】]/g, '')
}

const stripDuplicateMarkdownTitle = (content, pageTitle) => {
  const titleMatch = String(content || '').match(/^#\s+(.+)\r?\n+/)
  if (!titleMatch) return String(content || '')

  const markdownTitle = titleMatch[1].trim()
  const normalizedMarkdownTitle = normalizeTitleForCompare(markdownTitle)
  const normalizedPageTitle = normalizeTitleForCompare(pageTitle)

  if (!normalizedMarkdownTitle || !normalizedPageTitle) {
    return String(content || '')
  }

  const isDuplicateTitle = normalizedMarkdownTitle.includes(normalizedPageTitle)
    || normalizedPageTitle.includes(normalizedMarkdownTitle)

  if (isDuplicateTitle) {
    return String(content || '').replace(/^#\s+.+\r?\n+/, '')
  }

  return String(content || '')
}

const stripMarkdownFrontmatter = (content) => {
  const normalizedContent = String(content || '').replace(/^\uFEFF/, '')
  const frontmatterMatch = normalizedContent.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/)

  if (!frontmatterMatch) {
    return normalizedContent
  }

  const frontmatterBody = frontmatterMatch[1] || ''
  const hasYamlKeyValue = /^[A-Za-z\u4e00-\u9fa5_][^:\r\n]*:\s*/m.test(frontmatterBody)
  if (!hasYamlKeyValue) {
    return normalizedContent
  }

  return normalizedContent.slice(frontmatterMatch[0].length)
}

const resolveRelativeNotePath = (basePath, targetPath) => {
  const stack = String(basePath || '').split('/').filter(Boolean)

  for (const rawSegment of String(targetPath || '').replace(/\\/g, '/').split('/')) {
    const segment = safeDecodeURIComponent(rawSegment.trim())
    if (!segment || segment === '.') {
      continue
    }

    if (segment === '..') {
      stack.pop()
      continue
    }

    stack.push(segment)
  }

  return stack.join('/')
}

const buildGuideLinkUrl = (targetPath, currentDirectoryPath) => {
  const normalizedTarget = String(targetPath || '').trim()
  if (!normalizedTarget || /^(?:[a-z]+:|#|\/)/i.test(normalizedTarget)) {
    return normalizedTarget
  }

  const [pathPart] = normalizedTarget.split('#')
  const resolvedPath = resolveRelativeNotePath(currentDirectoryPath, pathPart)

  if (/\.md$/i.test(resolvedPath)) {
    const notePath = resolvedPath.replace(/\.md$/i, '')

    if (/\/目录$/i.test(notePath)) {
      return `${import.meta.env.BASE_URL}#/category/${encodePathSegments(notePath.replace(/\/目录$/i, ''))}`
    }

    return `${import.meta.env.BASE_URL}#/note/${encodePathSegments(notePath)}`
  }

  return `${import.meta.env.BASE_URL}notes/${encodePathSegments(resolvedPath)}`
}

const rewriteRelativeMarkdownLinks = (content, currentDirectoryPath) => {
  return String(content || '').replace(/(!?\[[^\]]*]\()([^)]+)(\))/g, (match, prefix, target, suffix) => {
    const normalizedTarget = String(target || '').trim()
    if (!normalizedTarget || /^(?:[a-z]+:|#|\/)/i.test(normalizedTarget)) {
      return match
    }

    return `${prefix}${buildGuideLinkUrl(normalizedTarget, currentDirectoryPath)}${suffix}`
  })
}

const loadDirectoryGuide = async () => {
  const requestId = ++directoryGuideRequestId
  const currentCategoryPath = categoryPath.value

  if (!currentCategoryPath) {
    directoryGuideMarkdown.value = ''
    return
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes/${encodePathSegments(currentCategoryPath)}/目录.md`)
    if (!response.ok) {
      throw new Error(`Failed to load directory guide: ${response.status}`)
    }

    const content = await response.text()
    if (requestId !== directoryGuideRequestId) {
      return
    }

    const contentWithoutFrontmatter = stripMarkdownFrontmatter(content)
    const deduplicatedContent = stripDuplicateMarkdownTitle(contentWithoutFrontmatter, categoryName.value)
    const normalizedContent = rewriteRelativeMarkdownLinks(deduplicatedContent, currentCategoryPath).trim()

    directoryGuideMarkdown.value = normalizedContent
  } catch (error) {
    if (requestId !== directoryGuideRequestId) {
      return
    }

    directoryGuideMarkdown.value = ''
    if (error?.message && !error.message.includes('404')) {
      console.error('加载目录导读失败:', error)
    }
  }
}

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

watch(categoryPath, () => {
  loadDirectoryGuide()
}, { immediate: true })

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

.category-overview {
  margin-bottom: 28px;
  padding: 24px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.14);
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(var(--primary-color-rgb), 0.05), rgba(var(--primary-color-rgb), 0.015)),
    var(--bg-primary);
}

.category-overview-header {
  margin-bottom: 18px;
}

.category-overview-eyebrow {
  margin: 0 0 8px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.category-overview-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.3;
}

.category-overview-description {
  margin: 0;
  max-width: 68ch;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.category-overview-body {
  padding-top: 18px;
  border-top: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.category-overview-body :deep(.markdown-body) {
  max-width: none;
}

.category-overview-body :deep(h1:first-child) {
  display: none;
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

  .category-overview {
    padding: 18px;
    border-radius: 16px;
  }

  .category-overview-title {
    font-size: 22px;
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
