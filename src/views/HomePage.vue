<template>
  <AppLayout>
    <div class="home-page">
      <div class="hero-section">
        <div class="hero-background">
          <div class="hero-gradient"></div>
          <div class="hero-pattern"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badge">{{ siteConfig.hero.badge }}</div>
          <h1 class="hero-title">{{ siteConfig.hero.title }}</h1>
          <p class="hero-subtitle">{{ siteConfig.hero.subtitle }}</p>
          
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索你想要的内容..."
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch" class="search-button">
              搜索
            </button>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalNotes }}</div>
            <div class="stat-label">篇笔记</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📁</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalCategories }}</div>
            <div class="stat-label">个分类</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalTags }}</div>
            <div class="stat-label">个标签</div>
          </div>
        </div>
      </div>

      <section class="recent-section">
        <h2 class="section-title">最近更新</h2>
        <div class="notes-grid" v-if="recentNotes.length > 0">
          <NoteCard v-for="note in recentNotes" :key="note.path" :note="note" />
        </div>
        <div v-else class="empty-state">
          <p>暂无笔记，请在 <code>public/notes/</code> 目录下添加 Markdown 文件</p>
        </div>
      </section>

      <section class="categories-section">
        <h2 class="section-title">笔记分类</h2>
        <div class="categories-grid" v-if="categories.length > 0">
          <router-link
            v-for="category in categories"
            :key="category.path"
            :to="`/category/${category.path}`"
            class="category-card"
          >
            <div class="category-icon">📂</div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.notes.length }} 篇笔记</p>
          </router-link>
        </div>
      </section>

      <BackToTop />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { siteConfig } from '../config/site'
import AppLayout from '../components/AppLayout.vue'
import NoteCard from '../components/NoteCard.vue'
import BackToTop from '../components/BackToTop.vue'

const router = useRouter()
const searchQuery = ref('')
const notesData = ref(null)

const stats = computed(() => {
  if (!notesData.value) {
    return { totalNotes: 0, totalCategories: 0, totalTags: 0 }
  }
  
  const allTags = new Set()
  notesData.value.allNotes.forEach(note => {
    note.tags.forEach(tag => allTags.add(tag))
  })
  
  return {
    totalNotes: notesData.value.totalNotes || 0,
    totalCategories: notesData.value.totalCategories || 0,
    totalTags: allTags.size
  }
})

const recentNotes = computed(() => {
  if (!notesData.value || !notesData.value.allNotes) {
    return []
  }
  return notesData.value.allNotes.slice(0, 6)
})

const categories = computed(() => {
  if (!notesData.value || !notesData.value.categories) {
    return []
  }
  return notesData.value.categories
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
    notesData.value = await response.json()
  } catch (error) {
    console.error('加载笔记索引失败:', error)
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  text-align: center;
  padding: 80px 20px;
  margin-bottom: 60px;
  overflow: hidden;
  border-radius: 24px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0.9;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.95;
  font-weight: 400;
  letter-spacing: 1px;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 6px 6px 6px 20px;
  border-radius: 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.search-box:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  color: #666;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  padding: 12px 8px;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.search-box input::placeholder {
  color: #999;
}

.search-button {
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.recent-section,
.categories-section {
  margin-bottom: 40px;
}

.section-title {
  position: relative;
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 32px 0;
  padding-left: 20px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 32px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  position: relative;
  padding: 32px 24px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.4);
}

.category-icon {
  font-size: 56px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.4s;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.category-name {
  position: relative;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  z-index: 1;
}

.category-count {
  position: relative;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
  z-index: 1;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state code {
  color: var(--primary-color);
  background-color: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 15px;
  }
  
  .search-box {
    padding: 6px;
  }
  
  .search-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .notes-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
