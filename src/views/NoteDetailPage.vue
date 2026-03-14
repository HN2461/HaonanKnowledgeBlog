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
      <div class="page-container" :class="{ 'sidebar-collapsed': isTocCollapsed }">
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

            <div class="note-attachments" v-if="attachments.length > 0">
              <h2 class="attachments-title">同目录附件</h2>
              <div class="attachments-list">
                <a
                  v-for="attachment in attachments"
                  :key="attachment.path"
                  :href="buildAttachmentUrl(attachment.path)"
                  class="attachment-item"
                  :download="attachment.name"
                  target="_blank"
                  rel="noopener"
                >
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <span class="attachment-meta">{{ formatAttachmentMeta(attachment) }}</span>
                </a>
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

        <aside class="note-sidebar" v-if="showTocSidebar && !isTocCollapsed">
          <TableOfContents :toc="toc" />
        </aside>
      </div>

      <button
        v-if="showTocSidebar"
        class="toc-toggle-btn"
        :class="{ 'is-collapsed': isTocCollapsed }"
        type="button"
        :aria-label="isTocCollapsed ? '展开右侧导航' : '折叠右侧导航'"
        :aria-expanded="String(!isTocCollapsed)"
        @click="toggleTocSidebar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>{{ isTocCollapsed ? '展开导航' : '折叠导航' }}</span>
      </button>
    </div>
    
    <!-- 悬浮阅读工具栏 -->
    <ReadingToolbar 
      v-if="!loading"
      @fontSizeChange="onFontSizeChange" 
      @enterFullscreen="enterFullscreen"
      @copyFullText="copyFullText"
      @exportDocument="exportDocument"
      @printDocument="printDocument"
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
    
    <!-- 阅读位置恢复提示 -->
    <Teleport to="body">
      <Transition name="position-prompt">
        <div v-if="showPositionPrompt" class="reading-position-prompt">
          <div class="prompt-content">
            <svg class="prompt-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <div class="prompt-text">
              <div class="prompt-title">发现上次阅读记录</div>
              <div class="prompt-desc">{{ formatReadingPosition(notePath) }}</div>
            </div>
            <div class="prompt-actions">
              <button class="action-btn restore-btn" @click="restoreReadingPosition">
                继续阅读
              </button>
              <button class="action-btn ignore-btn" @click="ignorePosition">
                从头开始
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="article-action-toast">
        <div
          v-if="actionToast.visible"
          class="article-action-toast"
          :class="`is-${actionToast.type}`"
        >
          {{ actionToast.message }}
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, onBeforeUnmount } from 'vue'
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
import { 
  getReadingPosition, 
  createDebouncedSave, 
  hasReadingPosition,
  formatReadingPosition,
  saveReadingPosition
} from '../utils/readingPosition'

const route = useRoute()
const loading = ref(true)
const note = ref({
  title: '加载中...',
  category: '',
  date: '',
  size: '',
  tags: [],
  attachments: []
})
const markdownContent = ref('')
const toc = ref([])
const notesData = ref(null)
const fontSize = ref(16)
// 目录折叠状态放在详情页层，保证同一篇阅读过程可持续生效
const isTocCollapsed = ref(false)
const actionToast = ref({
  visible: false,
  message: '',
  type: 'success'
})
let actionToastTimer = null

// 阅读位置相关
const scrollContainer = ref(null)
const debouncedSave = ref(null)
const hasRestored = ref(false)
const showPositionPrompt = ref(false)
const savedPosition = ref(null)

// 组件引用
const fullscreenRef = ref(null)
const lightboxRef = ref(null)

const notePath = computed(() => route.params.path)
const showTocSidebar = computed(() => !loading.value && toc.value.length > 0)
const attachments = computed(() => {
  return Array.isArray(note.value.attachments) ? note.value.attachments : []
})

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

const encodePathSegments = (filePath) => {
  return String(filePath || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

const buildAttachmentUrl = (filePath) => {
  return `${import.meta.env.BASE_URL}notes/${encodePathSegments(filePath)}`
}

const formatAttachmentMeta = (attachment) => {
  const ext = attachment.ext ? attachment.ext.toUpperCase() : 'FILE'
  const size = attachment.size || '--'
  return `${ext} · ${size}`
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

const toggleTocSidebar = () => {
  isTocCollapsed.value = !isTocCollapsed.value
}

const showActionToast = (message, type = 'success') => {
  actionToast.value = {
    visible: true,
    message,
    type
  }

  if (actionToastTimer) {
    clearTimeout(actionToastTimer)
  }

  actionToastTimer = setTimeout(() => {
    actionToast.value.visible = false
  }, 2200)
}

const sanitizeFileName = (name) => {
  const fallbackName = String(notePath.value || 'note').split('/').pop() || 'note'
  const sourceName = name || fallbackName
  const safeName = sourceName
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

  return safeName || 'note'
}

const buildShareableMarkdown = () => {
  const content = markdownContent.value.trim()
  if (!content) return ''

  if (content.startsWith('# ')) {
    return content
  }

  return '# ' + (note.value.title || '未命名笔记') + '\n\n' + content
}

const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch {
    return false
  }
}

const copyFullText = async () => {
  const shareableContent = buildShareableMarkdown()
  if (!shareableContent) {
    showActionToast('当前文章暂无可复制内容', 'error')
    return
  }

  const copied = await copyText(shareableContent)
  if (copied) {
    showActionToast('全文已复制到剪贴板', 'success')
  } else {
    showActionToast('复制失败，请手动复制', 'error')
  }
}

const exportDocument = () => {
  const shareableContent = buildShareableMarkdown()
  if (!shareableContent) {
    showActionToast('当前文章暂无可导出内容', 'error')
    return
  }

  const filename = sanitizeFileName(note.value.title) + '.md'

  try {
    const blob = new Blob([shareableContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showActionToast('已导出 ' + filename, 'success')
  } catch (error) {
    console.error('导出文档失败:', error)
    showActionToast('导出失败，请稍后重试', 'error')
  }
}

const printDocument = () => {
  try {
    window.print()
  } catch (error) {
    console.error('打开打印窗口失败:', error)
    showActionToast('当前环境暂不支持打印', 'error')
  }
}

const normalizeTitleForCompare = (title) => {
  return String(title || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s_\-–—~`!@#$%^&*()+=[\]{}|\\:;"'<>,.?/·，。、《》？；：‘’“”（）【】]/g, '')
}

const stripDuplicateMarkdownTitle = (content, pageTitle) => {
  const titleMatch = content.match(/^#\s+(.+)\r?\n+/)
  if (!titleMatch) return content

  const markdownTitle = titleMatch[1].trim()
  const normalizedMarkdownTitle = normalizeTitleForCompare(markdownTitle)
  const normalizedPageTitle = normalizeTitleForCompare(pageTitle)

  if (!normalizedMarkdownTitle || !normalizedPageTitle) return content

  const isDuplicateTitle = normalizedMarkdownTitle.includes(normalizedPageTitle)
    || normalizedPageTitle.includes(normalizedMarkdownTitle)

  // 页面头部已展示标题，遇到同名 Markdown 一级标题时去重，避免出现两个大标题
  if (isDuplicateTitle) {
    return content.replace(/^#\s+.+\r?\n+/, '')
  }

  return content
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

const loadNote = async () => {
  loading.value = true
  hasRestored.value = true // 改为true，允许保存位置
  showPositionPrompt.value = false
  
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
      
      // 移除 frontmatter（兼容 UTF-8 BOM 与 CRLF 换行）
      const contentWithoutFrontmatter = stripMarkdownFrontmatter(content)
      const deduplicatedContent = stripDuplicateMarkdownTitle(contentWithoutFrontmatter, note.value.title)
      markdownContent.value = deduplicatedContent
      
      // 提取目录
      toc.value = extractTOC(deduplicatedContent)
      
      // 检查是否有保存的阅读位置
      await checkAndRestoreReadingPosition()
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

// 检查并恢复阅读位置
const checkAndRestoreReadingPosition = async () => {
  await nextTick() // 等待内容渲染完成
  
  const articlePath = notePath.value
  savedPosition.value = getReadingPosition(articlePath)
  
  if (savedPosition.value && savedPosition.value.position > 100) {
    showPositionPrompt.value = true
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showPositionPrompt.value = false
    }, 8000)
  }
}

// 恢复阅读位置
const restoreReadingPosition = () => {
  if (!savedPosition.value || !scrollContainer.value) return
  
  scrollContainer.value.scrollTo({
    top: savedPosition.value.position,
    behavior: 'smooth'
  })
  
  hasRestored.value = true
  showPositionPrompt.value = false
}

// 忽略保存的位置
const ignorePosition = () => {
  showPositionPrompt.value = false
}

// 滚动事件监听
const onScroll = () => {
  if (!scrollContainer.value || !debouncedSave.value) return
  
  const scrollTop = scrollContainer.value.scrollTop
  const scrollHeight = scrollContainer.value.scrollHeight
  const clientHeight = scrollContainer.value.clientHeight
  
  // 只有滚动位置大于100px时才保存
  if (scrollTop > 100) {
    debouncedSave.value(scrollTop, scrollHeight - clientHeight)
    console.log(`保存阅读位置: ${scrollTop}px`) // 调试信息
  }
}

// 初始化滚动监听和阅读位置功能
const initializeReadingPosition = () => {
  // 等待DOM渲染完成后查找滚动容器
  setTimeout(() => {
    scrollContainer.value = document.querySelector('.main-content')
    
    if (scrollContainer.value && notePath.value) {
      console.log('找到滚动容器:', scrollContainer.value) // 调试信息
      console.log('当前文章路径:', notePath.value) // 调试信息
      
      // 创建防抖保存函数
      debouncedSave.value = createDebouncedSave(notePath.value, note.value.title)
      
      // 监听滚动事件
      scrollContainer.value.addEventListener('scroll', onScroll, { passive: true })
      console.log('已添加滚动事件监听') // 调试信息
    } else {
      console.error('未找到滚动容器或文章路径:', {
        scrollContainer: scrollContainer.value,
        notePath: notePath.value
      })
    }
  }, 100)
}

// 手动保存当前阅读位置（在切换文章前调用）
const saveCurrentPosition = () => {
  if (!scrollContainer.value || !notePath.value) return
  
  const scrollTop = scrollContainer.value.scrollTop
  
  // 只有滚动位置大于100px时才保存
  if (scrollTop > 100) {
    console.log(`💾 切换文章前保存位置: ${notePath.value} -> ${scrollTop}px`)
    
    if (debouncedSave.value) {
      // 取消防抖，立即保存
      const scrollHeight = scrollContainer.value.scrollHeight
      const clientHeight = scrollContainer.value.clientHeight
      
      // 直接调用保存函数，不使用防抖
      saveReadingPosition(notePath.value, scrollTop, note.value.title, scrollHeight - clientHeight)
    }
  }
}

// 清理事件监听器
const cleanupScrollListener = () => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', onScroll)
  }
}

onMounted(() => {
  loadNote()
  initializeReadingPosition()
  
  // 监听浏览器关闭/刷新事件
  const handleBeforeUnload = () => {
    saveCurrentPosition()
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // 在组件卸载时清理事件监听器
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
})

onUnmounted(() => {
  // 组件卸载前保存当前位置
  saveCurrentPosition()
  cleanupScrollListener()
  if (actionToastTimer) {
    clearTimeout(actionToastTimer)
    actionToastTimer = null
  }
})

onBeforeUnmount(() => {
  // 组件即将卸载前保存当前位置
  saveCurrentPosition()
})

watch(() => route.params.path, (newPath, oldPath) => {
  // 路由切换前保存旧文章的位置
  if (oldPath) {
    console.log(`🔄 路由切换: ${oldPath} -> ${newPath}`)
    saveCurrentPosition()
  }
  
  cleanupScrollListener()
  loadNote()
  initializeReadingPosition()
})
</script>

<style scoped>
.note-detail-page {
  width: 100%;
  height: 100%;
}

.page-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  align-items: start;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 16px;
  transition: grid-template-columns 0.25s ease;
}

.page-container.sidebar-collapsed {
  grid-template-columns: minmax(0, 1fr);
}

.note-content {
  min-width: 0;
  max-width: min(100%, 92ch);
  margin: 0 auto;
  width: 100%;
}

.note-header {
  margin-bottom: 28px;
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
  margin: 0 0 18px 0;
  line-height: 1.28;
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

.note-attachments {
  margin-bottom: 24px;
  padding: 18px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.attachments-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.attachment-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.attachment-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-meta {
  color: var(--text-tertiary);
  font-size: 12px;
  flex-shrink: 0;
}

.markdown-content {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  border: none;
  margin-bottom: 40px;
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
  top: 80px;
  align-self: start;
}

.toc-toggle-btn {
  position: fixed;
  top: 118px;
  right: 24px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
  transition: all 0.2s ease;
}

.toc-toggle-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.toc-toggle-btn.is-collapsed svg {
  transform: rotate(180deg);
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    max-width: 920px;
  }
  
  .note-sidebar {
    display: none;
  }

  .toc-toggle-btn {
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
    padding: 0;
    border-radius: 0;
  }
  
  .note-meta {
    gap: 16px;
  }
  
  .page-container {
    padding: 0 16px;
  }
}

.fullscreen-article-content :deep(h1) {
  color: var(--text-primary);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

/* 阅读位置恢复提示样式 */
.reading-position-prompt {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: all;
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  max-width: 480px;
  min-width: 320px;
}

.prompt-icon {
  color: var(--primary-color, #3b82f6);
  flex-shrink: 0;
}

.prompt-text {
  flex: 1;
  min-width: 0;
}

.prompt-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin-bottom: 2px;
}

.prompt-desc {
  font-size: 13px;
  color: var(--text-secondary, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prompt-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #e0e0e0);
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.restore-btn {
  background: var(--primary-color, #3b82f6);
  color: white;
  border-color: var(--primary-color, #3b82f6);
}

.restore-btn:hover {
  background: var(--primary-hover, #2563eb);
  border-color: var(--primary-hover, #2563eb);
}

.ignore-btn:hover {
  background: var(--bg-tertiary, #e0e0e0);
  border-color: var(--text-tertiary, #999);
}

/* 提示框动画 */
.position-prompt-enter-active,
.position-prompt-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.position-prompt-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.95);
}

.position-prompt-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.98);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .reading-position-prompt {
    top: 60px;
    left: 16px;
    right: 16px;
    transform: none;
  }
  
  .prompt-content {
    min-width: unset;
    width: 100%;
    padding: 14px 16px;
  }
  
  .prompt-title {
    font-size: 13px;
  }
  
  .prompt-desc {
    font-size: 12px;
  }
  
  .action-btn {
    padding: 5px 10px;
    font-size: 11px;
  }
  
  .position-prompt-enter-from {
    transform: translateY(-20px) scale(0.95);
  }
  
  .position-prompt-leave-to {
    transform: translateY(-10px) scale(0.98);
  }
}
.article-action-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10001;
  padding: 10px 14px;
  border-radius: 10px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.article-action-toast.is-success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.article-action-toast.is-error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.article-action-toast-enter-active,
.article-action-toast-leave-active {
  transition: all 0.22s ease;
}

.article-action-toast-enter-from,
.article-action-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .article-action-toast {
    left: 16px;
    right: 16px;
    top: 16px;
    text-align: center;
  }
}
</style>

