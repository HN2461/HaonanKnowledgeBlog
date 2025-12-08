<template>
  <AppLayout>
    <div class="editor-page">
      <!-- 头部工具栏 -->
      <div class="editor-header">
        <div class="header-left">
          <input
            v-model="noteTitle"
            class="title-input"
            placeholder="输入笔记标题..."
            @input="autoSave"
          />
        </div>
        
        <div class="header-center">
          <span class="save-status" :class="saveStatusClass">
            {{ saveStatusText }}
          </span>
        </div>
        
        <div class="header-right">
          <button @click="togglePreview" class="tool-btn" title="切换预览模式">
            <svg v-if="!previewMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            {{ previewMode ? '编辑' : '预览' }}
          </button>
          
          <button @click="exportMarkdown" class="tool-btn primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            导出
          </button>
          
          <button @click="clearEditor" class="tool-btn danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            清空
          </button>
        </div>
      </div>

      <!-- 编辑器主体 -->
      <div class="editor-container" :class="{ 'split-view': splitView }">
        <!-- 编辑区 -->
        <div v-show="!previewMode || splitView" class="editor-pane">
          <div class="editor-toolbar">
            <button @click="insertBold" class="toolbar-btn" title="粗体">
              <strong>B</strong>
            </button>
            <button @click="insertItalic" class="toolbar-btn" title="斜体">
              <em>I</em>
            </button>
            <button @click="insertHeading" class="toolbar-btn" title="标题">
              H
            </button>
            <button @click="insertLink" class="toolbar-btn" title="链接">
              🔗
            </button>
            <button @click="insertImage" class="toolbar-btn" title="图片">
              🖼️
            </button>
            <button @click="insertCode" class="toolbar-btn" title="代码块">
              &lt;/&gt;
            </button>
            <button @click="insertQuote" class="toolbar-btn" title="引用">
              ❝
            </button>
            <button @click="insertList" class="toolbar-btn" title="列表">
              ☰
            </button>
            <button @click="insertTable" class="toolbar-btn" title="表格">
              ⊞
            </button>
            <span class="toolbar-separator"></span>
            <button @click="toggleSplitView" class="toolbar-btn" title="分屏模式">
              {{ splitView ? '⬜' : '◫' }}
            </button>
          </div>
          
          <div 
            class="editor-textarea-wrapper"
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <textarea
              ref="editorTextarea"
              v-model="markdownContent"
              class="editor-textarea"
              placeholder="开始编写你的笔记..."
              @input="handleInput"
              @scroll="syncScroll"
              spellcheck="false"
            ></textarea>
            
            <!-- 拖拽提示 -->
            <div v-if="isDragging" class="drag-overlay">
              <div class="drag-hint">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>拖拽图片到此处上传</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览区 -->
        <div v-show="previewMode || splitView" class="preview-pane" ref="previewPane">
          <div class="preview-content">
            <h1 v-if="noteTitle" class="preview-title">{{ noteTitle }}</h1>
            <MarkdownRenderer :content="markdownContent" />
          </div>
        </div>
      </div>

      <!-- 字数统计栏 -->
      <div class="editor-footer">
        <div class="footer-left">
          <span>字符：{{ charCount }}</span>
          <span>字数：{{ wordCount }}</span>
          <span>行数：{{ lineCount }}</span>
        </div>
        <div class="footer-right">
          <span>预计阅读时间：{{ readingTime }} 分钟</span>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { calculateReadingTime } from '../utils/readingTime'

const router = useRouter()

// 编辑器状态
const noteTitle = ref('')
const markdownContent = ref('')
const previewMode = ref(false)
const splitView = ref(true)
const isDragging = ref(false)
const saveStatus = ref('saved') // saved, saving, error
const lastSavedTime = ref(null)

// DOM引用
const editorTextarea = ref(null)
const previewPane = ref(null)

// 自动保存定时器
let autoSaveTimer = null

// 计算属性
const charCount = computed(() => markdownContent.value.length)
const wordCount = computed(() => {
  const text = markdownContent.value.replace(/[#*`_~\[\]()!]/g, '').trim()
  return text ? text.split(/\s+/).length : 0
})
const lineCount = computed(() => {
  return markdownContent.value ? markdownContent.value.split('\n').length : 0
})
const readingTime = computed(() => calculateReadingTime(markdownContent.value))

const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return '保存中...'
    case 'error': return '保存失败'
    case 'saved': 
      return lastSavedTime.value ? 
        `已保存 ${formatTime(lastSavedTime.value)}` : 
        '已保存'
    default: return ''
  }
})

const saveStatusClass = computed(() => ({
  'is-saving': saveStatus.value === 'saving',
  'is-error': saveStatus.value === 'error',
  'is-saved': saveStatus.value === 'saved'
}))

// 格式化时间
const formatTime = (date) => {
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return date.toLocaleDateString()
}

// 切换预览模式
const togglePreview = () => {
  previewMode.value = !previewMode.value
  if (previewMode.value) {
    splitView.value = false
  }
}

// 切换分屏模式
const toggleSplitView = () => {
  splitView.value = !splitView.value
  if (splitView.value) {
    previewMode.value = false
  }
}

// 自动保存到localStorage
const autoSave = () => {
  saveStatus.value = 'saving'
  
  // 清除之前的定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 延迟1秒保存
  autoSaveTimer = setTimeout(() => {
    try {
      const draft = {
        title: noteTitle.value,
        content: markdownContent.value,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('editor-draft', JSON.stringify(draft))
      saveStatus.value = 'saved'
      lastSavedTime.value = new Date()
    } catch (error) {
      console.error('保存失败:', error)
      saveStatus.value = 'error'
    }
  }, 1000)
}

// 处理输入
const handleInput = () => {
  autoSave()
}

// 导出Markdown文件
const exportMarkdown = () => {
  const filename = (noteTitle.value || '未命名笔记') + '.md'
  const content = markdownContent.value
  
  // 如果有标题，在内容前添加标题
  const fullContent = noteTitle.value ? 
    `# ${noteTitle.value}\n\n${content}` : 
    content
  
  const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// 清空编辑器
const clearEditor = () => {
  if (confirm('确定要清空所有内容吗？此操作不可恢复。')) {
    noteTitle.value = ''
    markdownContent.value = ''
    localStorage.removeItem('editor-draft')
    saveStatus.value = 'saved'
  }
}

// 插入格式化文本的辅助函数
const insertText = (before, after = '') => {
  const textarea = editorTextarea.value
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = markdownContent.value.substring(start, end)
  const replacement = before + (selectedText || '文本') + after
  
  markdownContent.value = 
    markdownContent.value.substring(0, start) +
    replacement +
    markdownContent.value.substring(end)
  
  // 重新设置光标位置
  setTimeout(() => {
    textarea.focus()
    const newCursorPos = start + before.length
    textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText || '文本').length)
  }, 0)
  
  autoSave()
}

// 工具栏功能
const insertBold = () => insertText('**', '**')
const insertItalic = () => insertText('*', '*')
const insertHeading = () => {
  const textarea = editorTextarea.value
  if (!textarea) return
  
  const start = textarea.selectionStart
  const lineStart = markdownContent.value.lastIndexOf('\n', start - 1) + 1
  const before = markdownContent.value.substring(0, lineStart)
  const after = markdownContent.value.substring(lineStart)
  
  markdownContent.value = before + '## ' + after
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(lineStart + 3, lineStart + 3)
  }, 0)
  
  autoSave()
}
const insertLink = () => insertText('[', '](url)')
const insertImage = () => insertText('![', '](image-url)')
const insertCode = () => insertText('\n```javascript\n', '\n```\n')
const insertQuote = () => insertText('\n> ', '')
const insertList = () => insertText('\n- ', '')
const insertTable = () => {
  const table = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n'
  insertText(table, '')
}

// 处理图片拖拽上传
const handleDrop = async (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer.files)
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  for (const file of imageFiles) {
    await insertImageFile(file)
  }
}

// 插入图片文件（转换为base64）
const insertImageFile = async (file) => {
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      const imageMarkdown = `![${file.name}](${base64})\n`
      markdownContent.value += imageMarkdown
      autoSave()
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}

// 监听拖拽事件
const setupDragListeners = () => {
  let dragCounter = 0
  
  document.addEventListener('dragenter', (e) => {
    e.preventDefault()
    dragCounter++
    if (e.dataTransfer.types.includes('Files')) {
      isDragging.value = true
    }
  })
  
  document.addEventListener('dragleave', (e) => {
    e.preventDefault()
    dragCounter--
    if (dragCounter === 0) {
      isDragging.value = false
    }
  })
  
  document.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
  
  document.addEventListener('drop', (e) => {
    e.preventDefault()
    dragCounter = 0
    isDragging.value = false
  })
}

// 同步滚动
const syncScroll = () => {
  if (!splitView.value || !previewPane.value) return
  
  const textarea = editorTextarea.value
  const preview = previewPane.value
  
  if (!textarea || !preview) return
  
  const scrollPercentage = textarea.scrollTop / 
    (textarea.scrollHeight - textarea.clientHeight)
  
  preview.scrollTop = scrollPercentage * 
    (preview.scrollHeight - preview.clientHeight)
}

// 加载草稿
const loadDraft = () => {
  try {
    const saved = localStorage.getItem('editor-draft')
    if (saved) {
      const draft = JSON.parse(saved)
      noteTitle.value = draft.title || ''
      markdownContent.value = draft.content || ''
      lastSavedTime.value = new Date(draft.timestamp)
    }
  } catch (error) {
    console.error('加载草稿失败:', error)
  }
}

// 键盘快捷键
const setupKeyboardShortcuts = (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 's':
        e.preventDefault()
        autoSave()
        break
      case 'b':
        e.preventDefault()
        insertBold()
        break
      case 'i':
        e.preventDefault()
        insertItalic()
        break
      case 'k':
        e.preventDefault()
        insertLink()
        break
      case 'e':
        e.preventDefault()
        exportMarkdown()
        break
    }
  }
}

// 生命周期
onMounted(() => {
  loadDraft()
  setupDragListeners()
  document.addEventListener('keydown', setupKeyboardShortcuts)
})

onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  document.removeEventListener('keydown', setupKeyboardShortcuts)
})
</script>

<style scoped>
.editor-page {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
}

/* 头部工具栏 */
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  gap: 20px;
}

.header-left {
  flex: 1;
}

.title-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
}

.title-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.header-center {
  display: flex;
  align-items: center;
}

.save-status {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 4px 12px;
  background-color: var(--bg-tertiary);
  border-radius: 12px;
  transition: all 0.3s;
}

.save-status.is-saving {
  color: var(--warning-color);
  background-color: rgba(255, 193, 7, 0.1);
}

.save-status.is-error {
  color: var(--danger-color);
  background-color: rgba(220, 53, 69, 0.1);
}

.save-status.is-saved {
  color: var(--success-color);
  background-color: rgba(40, 167, 69, 0.1);
}

.header-right {
  display: flex;
  gap: 8px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-btn:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-1px);
}

.tool-btn.primary {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.tool-btn.primary:hover {
  background-color: var(--primary-hover);
}

.tool-btn.danger {
  color: var(--danger-color);
}

.tool-btn.danger:hover {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: var(--danger-color);
}

/* 编辑器主体 */
.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  gap: 1px;
  background-color: var(--border-color);
}

.editor-container.split-view {
  .editor-pane,
  .preview-pane {
    flex: 1;
    width: 50%;
  }
}

.editor-pane,
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  overflow: hidden;
}

/* 工具栏 */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-primary);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background-color: var(--border-color);
  margin: 0 8px;
}

/* 编辑区 */
.editor-textarea-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  padding: 20px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: none;
  resize: none;
  overflow-y: auto;
}

.editor-textarea:focus {
  outline: none;
}

/* 拖拽提示 */
.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border: 2px dashed var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.drag-hint {
  text-align: center;
}

.drag-hint svg {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.drag-hint p {
  font-size: 16px;
  font-weight: 500;
  color: var(--primary-color);
}

/* 预览区 */
.preview-pane {
  overflow-y: auto;
}

.preview-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.preview-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

/* 底部状态栏 */
.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
}

.footer-left,
.footer-right {
  display: flex;
  gap: 20px;
}

/* 滚动条美化 */
.editor-textarea::-webkit-scrollbar,
.preview-pane::-webkit-scrollbar {
  width: 8px;
}

.editor-textarea::-webkit-scrollbar-track,
.preview-pane::-webkit-scrollbar-track {
  background: transparent;
}

.editor-textarea::-webkit-scrollbar-thumb,
.preview-pane::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.editor-textarea::-webkit-scrollbar-thumb:hover,
.preview-pane::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 响应式 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
  
  .header-left,
  .header-center,
  .header-right {
    width: 100%;
  }
  
  .header-right {
    justify-content: center;
  }
  
  .editor-container.split-view {
    flex-direction: column;
  }
  
  .editor-container.split-view .editor-pane,
  .editor-container.split-view .preview-pane {
    width: 100%;
    height: 50%;
  }
  
  .editor-toolbar {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .editor-textarea {
    padding: 12px;
    font-size: 13px;
  }
  
  .preview-content {
    padding: 12px;
  }
}

/* 暗色主题适配 */
.dark-theme .editor-textarea {
  caret-color: var(--primary-color);
}
</style>
