<template>
  <Teleport to="body">
    <div 
      class="reading-toolbar-container"
      :style="positionStyle"
      ref="containerRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 主悬浮按钮 - 显示阅读进度 -->
      <div 
        class="reading-fab"
        :class="{ 'is-expanded': isExpanded, 'is-dragging': isDragging }"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="handleClick"
      >
        <!-- 进度环 -->
        <svg class="progress-ring" viewBox="0 0 44 44">
          <circle 
            class="progress-ring-bg"
            cx="22" cy="22" r="18"
            fill="none"
            stroke-width="3"
          />
          <circle 
            class="progress-ring-fill"
            cx="22" cy="22" r="18"
            fill="none"
            stroke-width="3"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
        <span class="progress-text">{{ Math.round(progress) }}%</span>
      </div>

      <!-- 展开的工具面板 -->
      <Transition name="panel-slide">
        <div v-if="isExpanded" class="toolbar-panel" :class="panelPosition" :style="panelStyle">
          <div class="panel-header">
            <span class="panel-title">阅读工具</span>
            <button class="panel-close" @click.stop="isExpanded = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- 阅读进度 -->
          <div class="panel-section">
            <div class="section-label">阅读进度</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-info">{{ Math.round(progress) }}%</div>
          </div>

          <!-- 字体大小 -->
          <div class="panel-section">
            <div class="section-label">字体大小</div>
            <div class="font-controls">
              <button 
                class="font-btn" 
                @click.stop="decreaseFontSize"
                :disabled="fontSize <= 12"
              >A-</button>
              <span class="font-size-value">{{ fontSize }}px</span>
              <button 
                class="font-btn" 
                @click.stop="increaseFontSize"
                :disabled="fontSize >= 24"
              >A+</button>
              <button 
                class="font-btn reset-btn" 
                @click.stop="resetFontSize"
                :disabled="fontSize === 16"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- 恢复阅读位置 -->
          <div class="panel-section">
            <button 
              class="action-btn restore-position-btn" 
              :class="{ 'disabled': !hasSavedPosition }"
              :disabled="!hasSavedPosition"
              @click.stop="restoreSavedPosition"
              :title="hasSavedPosition ? '恢复到上次阅读位置' : '暂无保存的阅读位置'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{{ hasSavedPosition ? '恢复阅读' : '无记录' }}</span>
            </button>
          </div>

          <!-- 回到顶部 -->
          <div class="panel-section">
            <button class="action-btn" @click.stop="scrollToTop">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <span>回到顶部</span>
            </button>
          </div>

          <!-- 全屏阅读 -->
          <div class="panel-section">
            <button class="action-btn" @click.stop="enterFullscreen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              <span>全屏阅读</span>
            </button>
          </div>

          <!-- 主题切换 -->
          <div class="panel-section">
            <button class="action-btn" @click.stop="toggleTheme">
              <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { calculateScrollProgress, getDocumentScrollInfo } from '../utils/scrollProgress'
import { 
  getFontSize, 
  setFontSize,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE
} from '../utils/fontSizeStorage'
import { getReadingPosition } from '../utils/readingPosition'

const emit = defineEmits(['fontSizeChange', 'enterFullscreen'])

const route = useRoute()
const containerRef = ref(null)
const isExpanded = ref(false)
const progress = ref(0)
const fontSize = ref(16)
const isDark = ref(false)
const hasSavedPosition = ref(false)

// 滚动容器引用
const scrollContainer = ref(null)

// 拖拽相关状态
const isDragging = ref(false)
const hasDragged = ref(false)
const position = ref({ x: null, y: null })
const dragStart = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })

// 进度环计算
const circumference = 2 * Math.PI * 18
const progressOffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

// 位置样式
const positionStyle = computed(() => {
  if (position.value.x === null) {
    return {
      bottom: '24px',
      right: '24px'
    }
  }
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    bottom: 'auto',
    right: 'auto'
  }
})

// 面板位置和样式（根据按钮位置动态计算）
const panelPosition = computed(() => 'panel-dynamic')

const panelStyle = computed(() => {
  if (position.value.x === null) {
    return {
      bottom: '70px',
      right: '0px'
    }
  }
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const panelWidth = viewportWidth <= 768 ? Math.min(280, viewportWidth - 32) : 240
  const panelHeight = 320 // 固定面板高度
  const buttonSize = viewportWidth <= 768 ? 48 : 56
  const padding = 16
  
  const buttonX = position.value.x
  const buttonY = position.value.y
  
  let left, top, right, bottom
  let transformOrigin = 'center'
  
  // 移动端特殊处理
  if (viewportWidth <= 768) {
    left = '50%'
    if (buttonY < viewportHeight / 2) {
      // 按钮在上半部，面板显示在下方
      top = `${buttonY + buttonSize + padding}px`
      transformOrigin = 'center top'
    } else {
      // 按钮在下半部，面板显示在上方
      bottom = `${viewportHeight - buttonY + padding}px`
      transformOrigin = 'center bottom'
    }
    return {
      left,
      top,
      bottom,
      right: 'auto',
      transform: 'translateX(-50%)',
      transformOrigin,
      width: `${panelWidth}px`,
      maxHeight: `${Math.min(panelHeight, viewportHeight - 120)}px`
    }
  }
  
  // 桌面端位置计算
  // 先检查右侧空间
  if (buttonX + buttonSize + panelWidth + padding <= viewportWidth) {
    // 右侧有空间
    left = `${buttonX + buttonSize + padding}px`
    transformOrigin = 'left center'
  } else if (buttonX - panelWidth - padding >= 0) {
    // 左侧有空间
    right = `${viewportWidth - buttonX + padding}px`
    transformOrigin = 'right center'
  } else {
    // 水平空间不足，选择较少被饴挡的一侧
    if (buttonX < viewportWidth / 2) {
      left = `${padding}px`
      transformOrigin = 'left center'
    } else {
      right = `${padding}px`
      transformOrigin = 'right center'
    }
  }
  
  // 垂直位置计算
  if (buttonY + panelHeight + padding <= viewportHeight) {
    // 下方有空间
    top = `${buttonY}px`
  } else if (buttonY - panelHeight + buttonSize >= padding) {
    // 上方有空间
    top = `${buttonY + buttonSize - panelHeight}px`
  } else {
    // 垂直空间不足，居中显示
    top = `${Math.max(padding, (viewportHeight - panelHeight) / 2)}px`
  }
  
  return {
    left,
    top,
    right,
    bottom: 'auto',
    transformOrigin,
    width: `${panelWidth}px`,
    maxHeight: `${Math.min(panelHeight, viewportHeight - 40)}px`
  }
})

let ticking = false

const updateProgress = () => {
  try {
    if (!scrollContainer.value) return
    
    // 获取滚动容器的滚动信息
    const scrollTop = scrollContainer.value.scrollTop
    const scrollHeight = scrollContainer.value.scrollHeight
    const clientHeight = scrollContainer.value.clientHeight
    
    // 更新进度值
    const newProgress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight)
    progress.value = newProgress
    
    // 调试信息（仅在开发模式下）
    if (import.meta.env.DEV) {
      console.debug(`Scroll progress: ${newProgress.toFixed(1)}% (${scrollTop}/${scrollHeight - clientHeight})`)
    }
  } catch (error) {
    console.error('Error updating scroll progress:', error)
  }
}

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress()
      ticking = false
    })
    ticking = true
  }
}

// 拖拽功能
const startDrag = (e) => {
  // 阻止默认行为和事件冒泡
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  hasDragged.value = false
  
  // 拖拽开始时关闭悬停展开的面板
  isExpanded.value = false
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  dragStart.value = { x: clientX, y: clientY }
  
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    dragOffset.value = {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }
  
  document.addEventListener('mousemove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
  
  // 防止选中文本
  document.body.style.userSelect = 'none'
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  
  // 检测是否真的在拖拽（移动超过5px）
  const deltaX = Math.abs(clientX - dragStart.value.x)
  const deltaY = Math.abs(clientY - dragStart.value.y)
  if (deltaX > 5 || deltaY > 5) {
    hasDragged.value = true
  }
  
  // 计算新位置
  let newX = clientX - dragOffset.value.x
  let newY = clientY - dragOffset.value.y
  
  // 边界限制
  const fabSize = 56
  const padding = 16
  const maxX = window.innerWidth - fabSize - padding
  const maxY = window.innerHeight - fabSize - padding
  
  newX = Math.max(padding, Math.min(newX, maxX))
  newY = Math.max(padding, Math.min(newY, maxY))
  
  position.value = { x: newX, y: newY }
  
  // 保存位置到 localStorage
  localStorage.setItem('reading-toolbar-position', JSON.stringify(position.value))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
  
  // 恢复文本选择
  document.body.style.userSelect = ''
  
  // 拖拽结束后短暂延迟，防止立即触发悬停
  setTimeout(() => {
    if (hasDragged.value) {
      hasDragged.value = false
    }
  }, 100)
}

const handleClick = () => {
  // 如果刚刚拖拽过，不触发点击
  if (hasDragged.value) {
    hasDragged.value = false
    return
  }
  // 点击时不再切换展开状态，因为现在使用悬停
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 悬停事件处理
const handleMouseEnter = () => {
  if (!isDragging.value && !hasDragged.value) {
    isExpanded.value = true
  }
}

const handleMouseLeave = () => {
  if (!isDragging.value) {
    isExpanded.value = false
  }
}

const increaseFontSize = () => {
  if (fontSize.value < MAX_FONT_SIZE) {
    fontSize.value = Math.min(fontSize.value + 2, MAX_FONT_SIZE)
    setFontSize(fontSize.value)
    emit('fontSizeChange', fontSize.value)
  }
}

const decreaseFontSize = () => {
  if (fontSize.value > MIN_FONT_SIZE) {
    fontSize.value = Math.max(fontSize.value - 2, MIN_FONT_SIZE)
    setFontSize(fontSize.value)
    emit('fontSizeChange', fontSize.value)
  }
}

const resetFontSize = () => {
  fontSize.value = DEFAULT_FONT_SIZE
  setFontSize(fontSize.value)
  emit('fontSizeChange', fontSize.value)
}

const enterFullscreen = () => {
  isExpanded.value = false
  emit('enterFullscreen')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: isDark.value } }))
}

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  isExpanded.value = false
}

// 检查是否有保存的阅读位置
const checkSavedPosition = () => {
  const currentPath = route.params.path
  if (currentPath) {
    const savedPosition = getReadingPosition(currentPath)
    hasSavedPosition.value = savedPosition !== null && savedPosition.position > 100
  }
}

// 恢复保存的阅读位置
const restoreSavedPosition = () => {
  const currentPath = route.params.path
  if (currentPath) {
    const savedPosition = getReadingPosition(currentPath)
    if (savedPosition && scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: savedPosition.position,
        behavior: 'smooth'
      })
      isExpanded.value = false
    }
  }
}

// 恢复保存的位置
const restorePosition = () => {
  const saved = localStorage.getItem('reading-toolbar-position')
  if (saved) {
    try {
      const pos = JSON.parse(saved)
      // 验证位置是否在视口内
      const fabSize = 56
      const padding = 16
      if (pos.x >= padding && pos.x <= window.innerWidth - fabSize - padding &&
          pos.y >= padding && pos.y <= window.innerHeight - fabSize - padding) {
        position.value = pos
      }
    } catch (e) {
      // 忽略解析错误
    }
  }
}

onMounted(() => {
  // 等待DOM渲染完成后查找滚动容器
  setTimeout(() => {
    // 查找.main-content滚动容器
    scrollContainer.value = document.querySelector('.main-content')
    
    if (scrollContainer.value) {
      // 监听滚动容器的滚动事件
      scrollContainer.value.addEventListener('scroll', onScroll, { passive: true })
      
      // 监听窗口大小变化，重新计算进度
      window.addEventListener('resize', () => {
        setTimeout(updateProgress, 100)
      }, { passive: true })
      
      // 初始化进度
      updateProgress()
    } else {
      console.warn('Could not find .main-content scroll container')
      // 降级到监听window滚动
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    
    // 检查是否有保存的阅读位置
    checkSavedPosition()
  }, 100)
  
  fontSize.value = getFontSize()
  isDark.value = localStorage.getItem('theme') === 'dark'
  emit('fontSizeChange', fontSize.value)
  restorePosition()
})

onUnmounted(() => {
  // 清理所有事件监听器
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', onScroll)
  }
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateProgress)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
})

// 监听路由变化，更新保存位置状态
watch(() => route.params.path, (newPath, oldPath) => {
  // 路由切换时重新检查按钮状态
  console.log(`🔄 ReadingToolbar: 路由切换 ${oldPath} -> ${newPath}`)
  
  // 延时检查，确保新页面已经加载
  setTimeout(() => {
    checkSavedPosition()
  }, 200) // 稍微增加延时确保页面加载完成
}, { immediate: true })
</script>

<style>
.reading-toolbar-container {
  position: fixed;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* 主悬浮按钮 */
.reading-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
  touch-action: none;
}

.reading-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
}

.reading-fab.is-dragging {
  cursor: grabbing;
  transform: scale(1.1);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.6);
}

.reading-fab.is-expanded {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  cursor: pointer;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-bg {
  stroke: rgba(255, 255, 255, 0.2);
}

.progress-ring-fill {
  stroke: #fff;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  z-index: 1;
  pointer-events: none;
}

/* 工具面板 */
.toolbar-panel {
  position: fixed;
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 16px;
  padding: 16px;
  height: 320px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  z-index: 10001;
  transition: all 0.2s ease;
}

/* 动态面板位置 */
.toolbar-panel.panel-dynamic {
  position: fixed;
}

/* 面板滚动条样式 */
.toolbar-panel::-webkit-scrollbar {
  width: 4px;
}

.toolbar-panel::-webkit-scrollbar-track {
  background: transparent;
}

.toolbar-panel::-webkit-scrollbar-thumb {
  background: var(--border-color, #e0e0e0);
  border-radius: 2px;
}

.toolbar-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary, #999);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #333);
}

.panel-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary, #666);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.panel-close:hover {
  background: var(--bg-tertiary, #f0f0f0);
  color: var(--text-primary, #333);
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 12px;
  color: var(--text-secondary, #666);
  margin-bottom: 8px;
}

/* 进度条 */
.progress-bar-container {
  height: 6px;
  background: var(--bg-tertiary, #e0e0e0);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  transition: width 0.2s ease;
}

.progress-info {
  font-size: 12px;
  color: var(--text-secondary, #666);
  text-align: right;
}

/* 字体控制 */
.font-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.font-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color, #e0e0e0);
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.font-btn:hover:not(:disabled) {
  background: var(--bg-tertiary, #e0e0e0);
  border-color: var(--primary-color, #3b82f6);
}

.font-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.font-size-value {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: var(--text-primary, #333);
  font-weight: 500;
}

.reset-btn {
  margin-left: auto;
}

/* 操作按钮 */
.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-tertiary, #e0e0e0);
  border-color: var(--primary-color, #3b82f6);
}

.restore-position-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-color: #10b981;
}

.restore-position-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  border-color: #059669;
}

.restore-position-btn.disabled,
.restore-position-btn:disabled {
  background: var(--bg-tertiary, #e0e0e0);
  color: var(--text-tertiary, #999);
  border-color: var(--border-color, #e0e0e0);
  cursor: not-allowed;
  opacity: 0.6;
}

.restore-position-btn.disabled:hover,
.restore-position-btn:disabled:hover {
  background: var(--bg-tertiary, #e0e0e0);
  border-color: var(--border-color, #e0e0e0);
  transform: none;
}

/* 面板动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .reading-fab {
    width: 48px;
    height: 48px;
  }
  
  .progress-text {
    font-size: 10px;
  }
  
  .toolbar-panel {
    height: 280px !important;
    max-height: calc(100vh - 120px) !important;
    padding: 12px;
  }
  
  .panel-section {
    margin-bottom: 12px;
  }
  
  .section-label {
    font-size: 11px;
  }
}
</style>
