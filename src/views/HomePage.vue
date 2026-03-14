<template>
  <AppLayout>
    <div class='home-page'>
      <section class='hero-shell'>
        <div class='hero-grid'>
          <div class='hero-main'>
            <p class='hero-badge'>{{ siteConfig.hero.badge }}</p>
            <h1 class='hero-title'>{{ siteConfig.hero.title }}</h1>
            <p class='hero-subtitle'>{{ siteConfig.hero.subtitle }}</p>
            <p class='hero-description'>{{ siteConfig.description }}</p>

            <div class='search-box'>
              <label class='search-label' for='home-search'>全文检索</label>
              <div class='search-field'>
                <svg class='search-icon' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <circle cx='11' cy='11' r='8'></circle>
                  <path d='m21 21-4.35-4.35'></path>
                </svg>
                <input
                  id='home-search'
                  type='text'
                  v-model='searchQuery'
                  placeholder='搜索你想要的内容'
                  @keyup.enter='handleSearch'
                />
                <button class='search-button' @click='handleSearch'>搜索</button>
              </div>
            </div>

            <div class='hero-actions'>
              <router-link to='/editor' class='hero-action primary'>开始写作</router-link>
              <router-link to='/relaxation' class='hero-action'>放松模式</router-link>
            </div>
          </div>

          <aside class='hero-panel'>
            <h2 class='panel-title'>站点概览</h2>
            <div class='stats-grid'>
              <article class='stat-card'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
                  <path d='M14 2v6h6'></path>
                </svg>
                <p class='stat-value'>{{ stats.totalNotes }}</p>
                <p class='stat-label'>篇笔记</p>
              </article>
              <article class='stat-card'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M3 6h18'></path>
                  <path d='M3 12h18'></path>
                  <path d='M3 18h18'></path>
                </svg>
                <p class='stat-value'>{{ stats.totalCategories }}</p>
                <p class='stat-label'>个分类</p>
              </article>
              <article class='stat-card'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M20.59 13.41 12 22l-8.59-8.59a2 2 0 0 1 0-2.82L12 2l8.59 8.59a2 2 0 0 1 0 2.82Z'></path>
                  <path d='M7 12h10'></path>
                </svg>
                <p class='stat-value'>{{ stats.totalTags }}</p>
                <p class='stat-label'>个标签</p>
              </article>
            </div>

            <div class='panel-divider'></div>
            <h3 class='panel-subtitle'>最近三篇</h3>
            <div class='quick-list' v-if='quickNotes.length > 0'>
              <router-link
                v-for='note in quickNotes'
                :key='note.path'
                :to='`/note/${note.path.replace(".md", "")}`'
                class='quick-link'
              >
                <span class='quick-title'>{{ note.title }}</span>
                <span class='quick-meta'>
                  <span class='quick-category'>{{ note.category }}</span>
                  <span class='quick-dot'>·</span>
                  <span class='quick-date'>{{ formatDate(note.date, note.lastModified) }}</span>
                </span>
              </router-link>
            </div>
            <p class='quick-empty' v-else>索引加载后将显示最新内容</p>
          </aside>
        </div>
      </section>

      <section class='section-block'>
        <div class='section-head'>
          <h2 class='section-title'>最近更新</h2>
          <router-link class='section-link' to='/search'>查看全部</router-link>
        </div>
        <template v-if='loading'>
          <div class='notes-grid'>
            <SkeletonScreen type='card' :count='6' />
          </div>
        </template>
        <template v-else>
          <div class='notes-grid' v-if='recentNotes.length > 0'>
            <NoteCard
              v-for='note in recentNotes'
              :key='note.path'
              :note='note'
            />
          </div>
          <div v-else class='empty-state'>
            <p>暂无笔记，请在 <code>public/notes/</code> 目录下添加 Markdown 文件</p>
          </div>
        </template>
      </section>

      <section class='section-block'>
        <div class='section-head'>
          <h2 class='section-title'>按主题浏览</h2>
        </div>
        <div class='categories-grid' v-if='categorySummaries.length > 0'>
          <router-link
            v-for='category in categorySummaries'
            :key='category.path'
            :to='`/category/${category.path}`'
            class='category-card'
          >
            <div class='category-icon'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <path d='M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'></path>
              </svg>
            </div>
            <div class='category-content'>
              <h3 class='category-name'>{{ category.name }}</h3>
              <p class='category-count'>{{ category.notesCount }} 篇笔记</p>
              <p class='category-date' v-if='category.latestDate'>更新于 {{ formatDate(category.latestDate) }}</p>
            </div>
          </router-link>
        </div>
        <div class='empty-state' v-else>
          <p>暂无分类数据</p>
        </div>
      </section>

      <BackToTop />
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import BackToTop from '@/components/BackToTop.vue'
import NoteCard from '@/components/NoteCard.vue'
import SkeletonScreen from '@/components/SkeletonScreen.vue'
import { siteConfig } from '@/config/site'

const router = useRouter()
const searchQuery = ref('')
const notesData = ref(null)
const loading = ref(true)

const stats = computed(() => {
  if (!notesData.value) {
    return { totalNotes: 0, totalCategories: 0, totalTags: 0 }
  }

  const allTags = new Set()
  notesData.value.allNotes.forEach((note) => {
    note.tags.forEach((tag) => allTags.add(tag))
  })

  return {
    totalNotes: notesData.value.totalNotes || 0,
    totalCategories: notesData.value.totalCategories || 0,
    totalTags: allTags.size
  }
})

const getNoteTimestamp = (note) => {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const time = new Date(value).getTime()
    if (!Number.isNaN(time)) {
      return time
    }
  }

  return 0
}

const recentNotes = computed(() => {
  if (!notesData.value || !notesData.value.allNotes) {
    return []
  }
  return [...notesData.value.allNotes]
    .sort((a, b) => getNoteTimestamp(b) - getNoteTimestamp(a))
    .slice(0, 6)
})

const quickNotes = computed(() => {
  if (!notesData.value || !notesData.value.allNotes) {
    return []
  }
  return [...notesData.value.allNotes]
    .sort((a, b) => getNoteTimestamp(b) - getNoteTimestamp(a))
    .slice(0, 3)
})

const categorySummaries = computed(() => {
  if (!notesData.value || !notesData.value.categories) {
    return []
  }

  return notesData.value.categories.map((category) => {
    const dates = category.notes
      .map((note) => getNoteTimestamp(note))
      .filter((time) => time > 0)
      .sort((a, b) => b - a)

    return {
      name: category.name,
      path: category.path,
      notesCount: category.notes.length,
      latestDate: dates[0] ? new Date(dates[0]).toISOString() : ''
    }
  }).filter((category) => category.notesCount > 0)
})

const formatDate = (date, fallbackDate) => {
  const candidates = [date, fallbackDate]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  }

  return '未标注日期'
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    return
  }
  router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
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
.home-page {
  max-width: 1180px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.hero-shell {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid #dbe4f0;
  padding: 36px;
  margin-bottom: 36px;
  background:
    radial-gradient(circle at 10% 12%, rgba(37, 99, 235, 0.12), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(14, 116, 144, 0.12), transparent 46%),
    linear-gradient(145deg, #f9fcff 0%, #f6f9fe 45%, #f4f8fd 100%);
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
}

.hero-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  margin: 0 0 14px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.72);
}

.hero-title {
  margin: 0;
  color: #0f172a;
  font-size: clamp(34px, 5.4vw, 56px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  margin: 16px 0 0;
  color: #334155;
  font-size: 18px;
  line-height: 1.7;
}

.hero-description {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.8;
}

.search-box {
  width: 100%;
  max-width: 700px;
  margin-top: 24px;
}

.search-label {
  display: inline-block;
  margin-bottom: 8px;
  color: #475569;
  font-size: 13px;
  letter-spacing: 0.03em;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 14px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  background: #fff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-field:focus-within {
  border-color: #2563eb;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.2);
}

.search-icon {
  color: #64748b;
  flex-shrink: 0;
}

.search-field input {
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 15px;
  color: #0f172a;
  min-width: 0;
}

.search-field input:focus,
.search-field input:focus-visible {
  outline: none;
  box-shadow: none;
}

.search-field input::placeholder {
  color: #94a3b8;
}

.search-button {
  border-radius: 10px;
  background: linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  font-weight: 600;
  padding: 10px 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.28);
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-weight: 600;
  text-decoration: none;
  background: #fff;
  transition: all 0.2s ease;
}

.hero-action:hover {
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.hero-action.primary {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #fff;
}

.hero-action.primary:hover {
  border-color: #1e40af;
  background: #1e40af;
}

.hero-panel {
  border-radius: 18px;
  border: 1px solid #dbe4f0;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(4px);
  padding: 18px;
}

.panel-title {
  margin: 0;
  font-size: 17px;
  color: #0f172a;
}

.stats-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stat-card {
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  background: #fff;
  padding: 10px;
  color: #475569;
}

.stat-card svg {
  color: #2563eb;
}

.stat-value {
  margin: 10px 0 0;
  font-size: 22px;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 12px;
}

.panel-divider {
  height: 1px;
  background: #dbe4f0;
  margin: 14px 0 12px;
}

.panel-subtitle {
  margin: 0;
  color: #334155;
  font-size: 14px;
}

.quick-list {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.quick-link {
  display: grid;
  gap: 2px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.quick-link:hover {
  border-color: #93c5fd;
  background-color: #f8fbff;
}

.quick-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.quick-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-category {
  color: #475569;
  font-size: 12px;
}

.quick-dot {
  color: #94a3b8;
  font-size: 12px;
}

.quick-date {
  color: #64748b;
  font-size: 12px;
}

.quick-empty {
  margin: 10px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.section-block {
  margin-bottom: 32px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-title {
  margin: 0;
  color: #0f172a;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.section-link {
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
}

.section-link:hover {
  color: #1d4ed8;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(304px, 1fr));
  gap: 18px;
}

.notes-grid :deep(.note-card) {
  border-radius: 14px;
  border-color: #dbe4f0;
  box-shadow: none;
}

.notes-grid :deep(.note-card:hover) {
  transform: translateY(-4px);
  border-color: #93c5fd;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.1);
}

.notes-grid :deep(.card-gradient) {
  background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
}

.notes-grid :deep(.card-category) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.notes-grid :deep(.note-card:hover .tag) {
  color: #1d4ed8;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.category-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #fff;
  padding: 16px;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.category-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #1d4ed8;
  flex-shrink: 0;
}

.category-content {
  min-width: 0;
}

.category-name {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.4;
}

.category-count {
  margin: 6px 0 0;
  color: #475569;
  font-size: 13px;
}

.category-date {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  text-align: center;
  padding: 36px 20px;
  color: #64748b;
  background: #fff;
}

.empty-state code {
  color: #1d4ed8;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 6px;
}

@media (max-width: 1080px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    max-width: 560px;
  }
}

@media (max-width: 768px) {
  .hero-shell {
    padding: 24px;
    border-radius: 20px;
  }

  .hero-title {
    font-size: clamp(30px, 10vw, 42px);
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .search-field {
    padding: 8px;
  }

  .search-button {
    padding: 9px 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .notes-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-field,
  .search-button,
  .hero-action,
  .quick-link,
  .category-card,
  .notes-grid :deep(.note-card) {
    transition: none;
  }
}
</style>
