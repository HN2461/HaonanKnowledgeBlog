<template>
  <div class="markdown-renderer" ref="rendererRef">
    <div class="markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUpdated, nextTick } from 'vue'
import { renderMarkdown } from '../utils/markdown'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['imageClick'])

const rendererRef = ref(null)

const renderedContent = computed(() => {
  return renderMarkdown(props.content)
})

// 复制图标 SVG
const copyIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
const checkIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
const errorIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`

// 添加复制按钮到代码块
const addCopyButtons = () => {
  if (!rendererRef.value) return
  
  const codeBlocks = rendererRef.value.querySelectorAll('pre')
  
  codeBlocks.forEach((pre) => {
    // 避免重复添加
    if (pre.querySelector('.code-copy-btn')) return
    
    // 创建复制按钮
    const btn = document.createElement('button')
    btn.className = 'code-copy-btn'
    btn.innerHTML = copyIconSvg
    btn.title = '复制代码'
    
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      const text = code ? code.textContent : pre.textContent
      
      try {
        await navigator.clipboard.writeText(text)
        btn.innerHTML = checkIconSvg
        btn.classList.add('success')
        
        setTimeout(() => {
          btn.innerHTML = copyIconSvg
          btn.classList.remove('success')
        }, 2000)
      } catch (err) {
        // 降级方案
        try {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
          
          btn.innerHTML = checkIconSvg
          btn.classList.add('success')
          
          setTimeout(() => {
            btn.innerHTML = copyIconSvg
            btn.classList.remove('success')
          }, 2000)
        } catch (fallbackErr) {
          btn.innerHTML = errorIconSvg
          btn.classList.add('error')
          btn.title = '复制失败'
          
          setTimeout(() => {
            btn.innerHTML = copyIconSvg
            btn.classList.remove('error')
            btn.title = '复制代码'
          }, 2000)
        }
      }
    })
    
    pre.appendChild(btn)
  })
}

// 添加图片点击事件
const addImageClickHandlers = () => {
  if (!rendererRef.value) return
  
  const images = rendererRef.value.querySelectorAll('.markdown-body img')
  
  images.forEach((img) => {
    if (img.dataset.lightboxBound) return
    
    img.style.cursor = 'zoom-in'
    img.dataset.lightboxBound = 'true'
    
    img.addEventListener('click', () => {
      emit('imageClick', img.src, img.alt)
    })
  })
}

const setupInteractions = async () => {
  await nextTick()
  addCopyButtons()
  addImageClickHandlers()
}

onMounted(setupInteractions)
onUpdated(setupInteractions)
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
}

.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
}

/* 标题样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-primary);
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(h4) {
  font-size: 1em;
}

/* 段落样式 */
.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

/* 链接样式 */
.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 4px;
}

/* 引用样式 */
.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 0 1em;
  color: var(--text-secondary);
  border-left: 4px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 4px;
}

/* 代码块样式 */
.markdown-body :deep(pre) {
  margin: 16px 0;
  padding: 16px;
  overflow: auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  position: relative;
}

.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #d4d4d4;
}

.markdown-body :deep(:not(pre) > code) {
  padding: 2px 6px;
  background-color: var(--bg-tertiary);
  border-radius: 3px;
  color: var(--danger-color);
}

/* 代码复制按钮 */
.markdown-body :deep(.code-copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #999;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.markdown-body :deep(.code-copy-btn:hover) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.markdown-body :deep(.code-copy-btn.success) {
  color: #4ade80;
  opacity: 1;
}

.markdown-body :deep(.code-copy-btn.error) {
  color: #f87171;
  opacity: 1;
}

/* 表格样式 */
.markdown-body :deep(table) {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
  overflow: auto;
  display: block;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
}

.markdown-body :deep(table th) {
  background-color: var(--bg-tertiary);
  font-weight: 600;
}

.markdown-body :deep(table tr:nth-child(even)) {
  background-color: var(--bg-secondary);
}

/* 图片样式 */
.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  transition: transform 0.2s;
}

.markdown-body :deep(img:hover) {
  transform: scale(1.02);
}

/* 分割线样式 */
.markdown-body :deep(hr) {
  height: 1px;
  margin: 24px 0;
  background-color: var(--border-color);
  border: 0;
}

/* 任务列表样式 */
.markdown-body :deep(input[type="checkbox"]) {
  margin-right: 8px;
}

/* 高亮文本 */
.markdown-body :deep(mark) {
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 2px;
}
</style>
