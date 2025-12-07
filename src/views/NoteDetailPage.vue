<template>
  <AppLayout>
    <template #breadcrumb>
      <Breadcrumb>
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <router-link :to="`/category/${note.category}`">{{ note.category }}</router-link>
        <span class="separator">/</span>
        <span class="current">{{ note.title }}</span>
      </Breadcrumb>
    </template>
    
    <div class="note-detail-page" style="padding-top: 20px;">
      <div class="page-container">
        <!-- 骨架屏加载状态 -->
        <template v-if="loading">
          <article class="note-content">
            <SkeletonScreen type="article" />
          </article>
        </template>

        <!-- 实际内容 -->
        <template v-else>
          <article class="note-content">
            <div class="note-header">
              <h1 class="note-title">{{ note.title }}</h1>
              
              <div class="note-meta">
                <span class="meta-item" v-if="note.hasRealDate">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {{ formatDate(note.date) }}
                </span>
                <span class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  {{ note.size }}
                </span>
                <span class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {{ wordCount }} 字
                </span>
                <span class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  预计 {{ readingTime }} 分钟
                </span>
              </div>
              
              <div class="note-tags" v-if="note.tags && note.tags.length > 0">
                <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>

            <div class="markdown-content" :style="{ fontSize: fontSize + 'px' }">
              <MarkdownRenderer :content="markdownContent" @imageClick="openLightbox" />
            </div>

            <div class="note-footer">
              <router-link v-if="prevNote" :to="`/note/${prevNote.path.replace('.md', '')}`" class="nav-link prev">
                <span class="nav-label">上一篇</span>
                <span class="nav-title">{{ prevNote.title }}</span>
              </router-link>
              <router-link v-if="nextNote" :to="`/note/${nextNote.path.replace('.md', '')}`" class="nav-link next">
                <span class="nav-label">下一篇</span>
                <span class="nav-title">{{ nextNote.title }}</span>
              </router-link>
            </div>
          </article>
        </template>

        <aside class="note-sidebar" v-if="!loading && toc.length > 0">
          <TableOfContents :toc="toc" />
        </aside>
      </div>
    </div>
    
    <!-- 悬浮阅读工具栏 -->
    <ReadingToolbar 
      v-if="!loading"
      @fontSizeChange="onFontSizeChange" 
      @enterFullscreen="enterFullscreen"
    />
    
    <!-- 全屏阅读模式 -->
    <FullscreenReader ref="fullscreenRef">
      <div class="fullscreen-article-content" :style="{ fontSize: fontSize + 'px' }">
        <h1>{{ note.title }}</h1>
        <MarkdownRenderer :content="markdownContent" @imageClick="openLightbox" />
      </div>
    </FullscreenReader>
    
    <!-- 图片灯箱 -->
    <ImageLightbox ref="lightboxRef" />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import AppLayout from '../components/AppLayout.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import TableOfContents from '../components/TableOfContents.vue'
import SkeletonScreen from '../components/SkeletonScreen.vue'
import ImageLightbox from '../components/ImageLightbox.vue'
import ReadingToolbar from '../components/ReadingToolbar.vue'
import FullscreenReader from '../components/FullscreenReader.vue'
import { extractTOC } from '../utils/markdown'
import { calculateReadingTime } from '../utils/readingTime'

const route = useRoute()
const loading = ref(true)
const note = ref({
  title: '加载中...',
  category: '',
  date: '',
  size: '',
  tags: []
})
const markdownContent = ref('')
const toc = ref([])
const notesData = ref(null)
const fontSize = ref(16)

// 组件引用
const fullscreenRef = ref(null)
const lightboxRef = ref(null)

const notePath = computed(() => route.params.path)

// 使用新的阅读时间计算器
const readingTime = computed(() => {
  return calculateReadingTime(markdownContent.value)
})

// 计算字数（不含代码块）
const wordCount = computed(() => {
  if (!markdownContent.value) return 0
  
  // 移除代码块
  let text = markdownContent.value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
  
  // 移除 Markdown 语法
  text = text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/>\s/g, '')
    .replace(/[-*+]\s/g, '')
    .replace(/\d+\.\s/g, '')
    .replace(/\|/g, '')
    .replace(/---+/g, '')
    .replace(/\s+/g, '')
  
  return text.length.toLocaleString()
})

const currentIndex = computed(() => {
  if (!notesData.value || !notesData.value.allNotes) return -1
  return notesData.value.allNotes.findIndex(n => n.path.replace('.md', '') === notePath.value)
})

const prevNote = computed(() => {
  if (currentIndex.value > 0 && notesData.value) {
    return notesData.value.allNotes[currentIndex.value - 1]
  }
  return null
})

const nextNote = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < notesData.value.allNotes.length - 1) {
    return notesData.value.allNotes[currentIndex.value + 1]
  }
  return null
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

const onFontSizeChange = (size) => {
  fontSize.value = size
}

const enterFullscreen = () => {
  if (fullscreenRef.value) {
    fullscreenRef.value.enterFullscreen()
  }
}

const openLightbox = (src, alt) => {
  if (lightboxRef.value) {
    lightboxRef.value.open(src, alt)
  }
}

const loadNote = async () => {
  loading.value = true
  
  try {
    // 加载笔记索引
    if (!notesData.value) {
      const indexResponse = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
      notesData.value = await indexResponse.json()
    }

    // 查找当前笔记信息
    const currentNote = notesData.value.allNotes.find(n => n.path.replace('.md', '') === notePath.value)
    if (currentNote) {
      note.value = currentNote
    }

    // 加载 Markdown 内容
    const response = await fetch(`${import.meta.env.BASE_URL}notes/${notePath.value}.md`)
    if (response.ok) {
      const content = await response.text()
      
      // 移除 frontmatter
      const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '')
      markdownContent.value = contentWithoutFrontmatter
      
      // 提取目录
      toc.value = extractTOC(contentWithoutFrontmatter)
    } else {
      markdownContent.value = '# 笔记未找到\n\n无法加载该笔记内容。'
    }
  } catch (error) {
    console.error('加载笔记失败:', error)
    markdownContent.value = '# 加载失败\n\n加载笔记时出错，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNote()
})

watch(() => route.params.path, () => {
  loadNote()
})
</script>

<style scoped>
.note-detail-page {
  width: 100%;
  height: 100%;
}

.page-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 32px;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.note-content {
  min-width: 0;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.note-header {
  margin-bottom: 32px;
  padding-top: 24px;
}

/* 面包屑样式 */
:deep(.separator) {
  color: var(--text-tertiary);
  margin: 0 4px;
}

:deep(.current) {
  color: var(--text-primary);
}

.note-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.note-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-item svg {
  opacity: 0.6;
}

.note-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 12px;
}

.markdown-content {
  background-color: var(--bg-primary);
  padding: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 32px;
  transition: font-size 0.2s ease;
}

.fullscreen-article-content {
  line-height: 1.8;
}

.fullscreen-article-content h1 {
  font-size: 2em;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.note-footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.nav-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.2s;
}

.nav-link:hover {
  border-color: var(--primary-color);
}

.nav-link.next {
  text-align: right;
}

.nav-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.note-sidebar {
  position: sticky;
  top: 50px;
  align-self: start;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
  
  .note-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .note-header {
    padding-top: 16px;
    margin-bottom: 24px;
  }
  
  .note-title {
    font-size: 28px;
  }
  
  .markdown-content {
    padding: 24px;
    border-radius: 12px;
  }
  
  .note-meta {
    gap: 16px;
  }
  
  .page-container {
    padding: 0 16px;
  }
}
</style>
