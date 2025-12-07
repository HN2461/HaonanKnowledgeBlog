<template>
  <AppLayout>
    <div class="note-list-page">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span class="current">{{ categoryName }}</span>
        </div>
        <h1 class="page-title">{{ categoryName }}</h1>
        <p class="page-subtitle">共 {{ notes.length }} 篇笔记</p>
      </div>

      <div class="filter-bar">
        <div class="sort-options">
          <label>排序：</label>
          <select v-model="sortBy" @change="handleSort">
            <option value="date-desc">最新优先</option>
            <option value="date-asc">最旧优先</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>
        </div>
      </div>

      <!-- 骨架屏加载状态 -->
      <template v-if="loading">
        <div class="notes-list">
          <SkeletonScreen type="card" :count="6" />
        </div>
      </template>

      <!-- 实际内容 -->
      <template v-else>
        <div class="notes-list" v-if="sortedNotes.length > 0">
          <NoteCard v-for="note in sortedNotes" :key="note.path" :note="note" />
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

const route = useRoute()
const notesData = ref(null)
const sortBy = ref('date-desc')
const loading = ref(true)

const categoryPath = computed(() => route.params.category)

const categoryName = computed(() => {
  if (!notesData.value || !notesData.value.categories) {
    return '分类'
  }
  const category = notesData.value.categories.find(c => c.path === categoryPath.value)
  return category ? category.name : categoryPath.value
})

const notes = computed(() => {
  if (!notesData.value || !notesData.value.categories) {
    return []
  }
  const category = notesData.value.categories.find(c => c.path === categoryPath.value)
  return category ? category.notes : []
})

const sortedNotes = computed(() => {
  const notesCopy = [...notes.value]
  
  switch (sortBy.value) {
    case 'date-desc':
      return notesCopy.sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'date-asc':
      return notesCopy.sort((a, b) => new Date(a.date) - new Date(b.date))
    case 'title-asc':
      return notesCopy.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':
      return notesCopy.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return notesCopy
  }
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
  
  .notes-list {
    grid-template-columns: 1fr;
  }
}
</style>
