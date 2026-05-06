<template>
  <div class="markdown-renderer" ref="rendererRef">
    <div class="markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUpdated, nextTick } from 'vue'
import mermaid from 'mermaid'
import { renderMarkdown } from '../utils/markdown'
import { svgToDataUrl } from '../utils/mermaidPreview'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['imageClick'])

const rendererRef = ref(null)
let mermaidReady = false

const renderedContent = computed(() => {
  return renderMarkdown(props.content)
})

const ensureMermaidInitialized = () => {
  if (mermaidReady) return

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'antiscript',
    theme: 'default'
  })

  mermaidReady = true
}

// 复制图标 SVG
const copyIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
const checkIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
const errorIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`

const resetCopyButton = (btn) => {
  btn.innerHTML = copyIconSvg
  btn.classList.remove('success', 'error')
  btn.title = '复制代码'
  btn.setAttribute('aria-label', '复制代码')
}

const showCopyButtonState = (btn, state) => {
  if (state === 'success') {
    btn.innerHTML = checkIconSvg
    btn.classList.add('success')
    btn.title = '复制成功'
    btn.setAttribute('aria-label', '复制成功')
  } else {
    btn.innerHTML = errorIconSvg
    btn.classList.add('error')
    btn.title = '复制失败'
    btn.setAttribute('aria-label', '复制失败')
  }

  setTimeout(() => {
    resetCopyButton(btn)
  }, 2000)
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (fallbackErr) {
      return false
    }
  }
}

const createCopyButton = () => {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'code-copy-btn'
  btn.innerHTML = copyIconSvg
  btn.title = '复制代码'
  btn.setAttribute('aria-label', '复制代码')
  return btn
}

const bindCopyButton = (btn, getText) => {
  if (btn.dataset.copyBound) return

  btn.dataset.copyBound = 'true'

  btn.addEventListener('click', async () => {
    const text = getText()
    const copied = await copyText(text)
    showCopyButtonState(btn, copied ? 'success' : 'error')
  })
}

const addCopyButtons = () => {
  if (!rendererRef.value) return

  const codeBlocks = rendererRef.value.querySelectorAll('.code-block')

  codeBlocks.forEach((block) => {
    const actions = block.querySelector('.code-block__actions')
    const code = block.querySelector('.code-block__code')

    if (!actions || !code || actions.querySelector('.code-copy-btn')) return

    const btn = createCopyButton()
    actions.prepend(btn)
    bindCopyButton(btn, () => code.textContent || '')
  })

  const standaloneBlocks = rendererRef.value.querySelectorAll('pre:not(.code-block__pre)')

  standaloneBlocks.forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) return

    const code = pre.querySelector('code')
    const btn = createCopyButton()
    pre.appendChild(btn)
    bindCopyButton(btn, () => (code ? code.textContent : pre.textContent) || '')
  })
}

const updateCodeToggle = (block) => {
  const toggle = block.querySelector('.code-block__toggle')

  if (!toggle) return

  const expanded = !block.classList.contains('is-collapsed')
  toggle.innerHTML = expanded
    ? '<span class="code-block__toggle-label">收起</span><span class="code-block__toggle-icon" aria-hidden="true"></span>'
    : '<span class="code-block__toggle-label">展开</span><span class="code-block__toggle-icon" aria-hidden="true"></span>'
  toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false')
}

const addCodeBlockToggles = () => {
  if (!rendererRef.value) return

  const codeBlocks = rendererRef.value.querySelectorAll('.code-block.is-collapsible')

  codeBlocks.forEach((block) => {
    updateCodeToggle(block)

    const toggle = block.querySelector('.code-block__toggle')

    if (!toggle || toggle.dataset.toggleBound) return

    toggle.dataset.toggleBound = 'true'
    toggle.addEventListener('click', () => {
      block.classList.toggle('is-collapsed')
      updateCodeToggle(block)
    })
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

const addMermaidClickHandlers = () => {
  if (!rendererRef.value) return

  const diagrams = rendererRef.value.querySelectorAll('.mermaid-diagram')

  diagrams.forEach((diagram, index) => {
    const svg = diagram.querySelector('svg')
    if (!svg || svg.dataset.lightboxBound) return

    const alt = `Mermaid 图表 ${index + 1}`
    const previewSrc = svgToDataUrl(svg.outerHTML)

    if (!previewSrc) return

    svg.style.cursor = 'zoom-in'
    svg.dataset.lightboxBound = 'true'
    svg.setAttribute('role', 'button')
    svg.setAttribute('tabindex', '0')
    svg.setAttribute('aria-label', '点击放大查看图表')

    const openDiagramLightbox = () => {
      emit('imageClick', previewSrc, alt)
    }

    svg.addEventListener('click', openDiagramLightbox)
    svg.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openDiagramLightbox()
      }
    })
  })
}

const renderMermaidDiagrams = async () => {
  if (!rendererRef.value) return

  const diagrams = rendererRef.value.querySelectorAll('.mermaid-diagram')
  if (!diagrams.length) return

  ensureMermaidInitialized()

  diagrams.forEach((diagram) => {
    diagram.classList.remove('is-rendered', 'is-error')
  })

  try {
    await mermaid.run({
      nodes: rendererRef.value.querySelectorAll('.mermaid')
    })

    diagrams.forEach((diagram) => {
      diagram.classList.add('is-rendered')
    })
  } catch (error) {
    console.error('Mermaid 图表渲染失败:', error)
    diagrams.forEach((diagram) => {
      diagram.classList.add('is-error')
    })
  }
}

const setupInteractions = async () => {
  await nextTick()
  await renderMermaidDiagrams()
  addCopyButtons()
  addCodeBlockToggles()
  addImageClickHandlers()
  addMermaidClickHandlers()
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
  max-width: 72ch;
  line-height: 1.85;
  font-size: 1rem;
  --code-font-size: 0.92rem;
  --code-line-height: 1.7;
}

/* 标题样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 42px;
  margin-bottom: 14px;
  font-weight: 700;
  line-height: 1.32;
  color: var(--text-primary);
}

.markdown-body :deep(h1:first-child),
.markdown-body :deep(h2:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h1) {
  font-size: 2.1em;
  padding-bottom: 0.42em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body :deep(h2) {
  font-size: 1.55em;
  padding-bottom: 0.38em;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.markdown-body :deep(h3) {
  font-size: 1.28em;
}

.markdown-body :deep(h4) {
  font-size: 1em;
}

/* 段落样式 */
.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 18px;
}

/* 链接样式 */
.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration-line: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.14em;
}

.markdown-body :deep(a:hover) {
  text-decoration-thickness: 0.12em;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 18px;
}

.markdown-body :deep(li) {
  margin-bottom: 6px;
  line-height: 1.8;
}

/* 引用样式 */
.markdown-body :deep(blockquote) {
  margin: 24px 0;
  padding: 14px 16px;
  color: var(--text-secondary);
  border-left: 2px solid var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.04);
  border-radius: 12px;
}

/* 代码块样式 */
.markdown-body :deep(.code-block) {
  margin: 24px 0;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0) 56px),
    #1e1e1e;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
}

.markdown-body :deep(.code-block__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.markdown-body :deep(.code-block__meta) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.markdown-body :deep(.code-block__language) {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.14);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.markdown-body :deep(.code-block__line-count) {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.markdown-body :deep(.code-block__actions) {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.markdown-body :deep(.code-block__content) {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  overflow: hidden;
  font-size: var(--code-font-size);
  line-height: var(--code-line-height);
}

.markdown-body :deep(.code-block.is-collapsible.is-collapsed .code-block__content) {
  max-height: calc(var(--code-visible-lines) * var(--code-line-height) * 1em + 28px);
}

.markdown-body :deep(.code-block.is-collapsible.is-collapsed .code-block__content::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(30, 30, 30, 0), rgba(30, 30, 30, 0.94) 86%);
}

.markdown-body :deep(.code-block__collapse) {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  padding: 6px 0 7px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(30, 30, 30, 0), rgba(30, 30, 30, 0.86) 55%, rgba(30, 30, 30, 0.98));
}

.markdown-body :deep(.code-block__gutter) {
  min-width: 3.6em;
  padding: 14px 12px 14px 14px;
  white-space: pre;
  text-align: right;
  user-select: none;
  color: rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-variant-numeric: tabular-nums;
}

.markdown-body :deep(.code-block__viewport) {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.markdown-body :deep(.code-block__pre) {
  margin: 0;
  padding: 14px 16px;
  min-width: 100%;
  overflow: visible;
  background: transparent;
  border: 0;
  border-radius: 0;
  position: static;
}

.markdown-body :deep(pre:not(.code-block__pre)) {
  margin: 24px 0;
  padding: 18px 16px;
  overflow: auto;
  background-color: #1e1e1e;
  border-radius: 12px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre code),
.markdown-body :deep(.code-block__code) {
  display: block;
  background: none;
  padding: 0;
  white-space: pre;
  min-width: max-content;
  color: #d4d4d4;
}

.markdown-body :deep(:not(pre) > code) {
  padding: 2px 6px;
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  color: var(--primary-color);
}

/* 代码复制按钮 */
.markdown-body :deep(.code-copy-btn),
.markdown-body :deep(.code-block__toggle) {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition: all 0.2s;
}

.markdown-body :deep(.code-block__actions .code-copy-btn) {
  width: 32px;
  padding: 0;
}

.markdown-body :deep(pre:not(.code-block__pre) > .code-copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  padding: 0;
}

.markdown-body :deep(.code-copy-btn:hover),
.markdown-body :deep(.code-block__toggle:hover) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateY(-1px);
}

.markdown-body :deep(.code-block__toggle) {
  gap: 5px;
  min-width: 72px;
  padding: 0 4px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  pointer-events: auto;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  box-shadow: none;
}

.markdown-body :deep(.code-block.is-collapsed .code-block__toggle) {
  color: rgba(255, 255, 255, 0.8);
}

.markdown-body :deep(.code-block__toggle-icon) {
  position: relative;
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  opacity: 0.72;
}

.markdown-body :deep(.code-block__toggle-icon)::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 6px;
  height: 6px;
  border-right: 1.6px solid currentColor;
  border-bottom: 1.6px solid currentColor;
  transform: rotate(-135deg) translate(1px, 1px);
}

.markdown-body :deep(.code-block.is-collapsed .code-block__toggle-icon)::before {
  transform: rotate(45deg) translate(-1px, -1px);
}

.markdown-body :deep(.code-block__toggle-label) {
  line-height: 1;
}

.markdown-body :deep(.code-block__toggle:hover) {
  background: transparent;
  color: #fff;
  transform: none;
}

.markdown-body :deep(.code-copy-btn.success) {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.38);
  background: rgba(74, 222, 128, 0.14);
}

.markdown-body :deep(.code-copy-btn.error) {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.38);
  background: rgba(248, 113, 113, 0.14);
}

/* 表格样式 */
.markdown-body :deep(table) {
  width: 100%;
  margin: 18px 0;
  border-collapse: collapse;
  overflow: auto;
  display: block;
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 10px 12px;
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
  border-radius: 10px;
  margin: 18px 0;
  transition: transform 0.2s;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.markdown-body :deep(img:hover) {
  transform: scale(1.02);
}

.markdown-body :deep(.mermaid-diagram) {
  margin: 24px 0;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  border-radius: 18px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(var(--primary-color-rgb), 0.08), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98));
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.markdown-body :deep(.mermaid-diagram__canvas) {
  padding: 18px 16px;
  overflow-x: auto;
}

.markdown-body :deep(.mermaid-diagram .mermaid) {
  min-width: fit-content;
  text-align: center;
}

.markdown-body :deep(.mermaid-diagram svg) {
  max-width: 100%;
  height: auto;
  transition: transform 0.2s ease;
}

.markdown-body :deep(.mermaid-diagram svg:hover) {
  transform: scale(1.01);
}

.markdown-body :deep(.mermaid-diagram svg:focus-visible) {
  outline: 2px solid rgba(var(--primary-color-rgb), 0.55);
  outline-offset: 6px;
  border-radius: 12px;
}

.markdown-body :deep(.mermaid-diagram__error) {
  display: none;
  margin: 0;
  padding: 12px 16px 0;
  color: #b45309;
  font-size: 0.9rem;
}

.markdown-body :deep(.mermaid-diagram__fallback) {
  display: none;
  margin: 0;
  border-top: 1px solid rgba(var(--primary-color-rgb), 0.1);
  border-radius: 0;
}

.markdown-body :deep(.mermaid-diagram.is-error .mermaid-diagram__error),
.markdown-body :deep(.mermaid-diagram.is-error .mermaid-diagram__fallback) {
  display: block;
}

.markdown-body :deep(.mermaid-diagram.is-error .mermaid) {
  display: none;
}

/* 分割线样式 */
.markdown-body :deep(hr) {
  height: 1px;
  margin: 36px 0;
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

@media (prefers-reduced-motion: reduce) {
  .markdown-body :deep(img),
  .markdown-body :deep(.code-copy-btn),
  .markdown-body :deep(.code-block__toggle),
  .markdown-body :deep(.mermaid-diagram svg) {
    transition: none;
  }

  .markdown-body :deep(img:hover) {
    transform: none;
  }

  .markdown-body :deep(.mermaid-diagram svg:hover) {
    transform: none;
  }

  .markdown-body :deep(.code-copy-btn:hover),
  .markdown-body :deep(.code-block__toggle:hover) {
    transform: none;
  }
}

@media (max-width: 640px) {
  .markdown-body :deep(.code-block__header) {
    flex-wrap: wrap;
  }

  .markdown-body :deep(.code-block__actions) {
    width: 100%;
    justify-content: flex-end;
  }

  .markdown-body :deep(.code-block__gutter) {
    min-width: 3.1em;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
