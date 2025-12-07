<template>
  <div class="fullscreen-reader" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 全屏模式容器 -->
    <Teleport to="body">
      <Transition name="fullscreen-fade">
        <div v-if="isFullscreen" class="fullscreen-overlay">
          <div class="fullscreen-content">
            <!-- 浮动工具栏 -->
            <div class="fullscreen-toolbar">
              <FontSizeController @change="onFontSizeChange" />
              
              <button class="toolbar-btn" @click="toggleTheme" title="切换主题">
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
              </button>
              
              <button class="toolbar-btn exit-btn" @click="exitFullscreen" title="退出全屏">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- 文章内容 -->
            <div class="fullscreen-article" :style="{ fontSize: fontSize + 'px' }">
              <slot></slot>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FontSizeController from './FontSizeController.vue'

const emit = defineEmits(['enter', 'exit'])

const isFullscreen = ref(false)
const isDark = ref(false)
const fontSize = ref(16)

const enterFullscreen = () => {
  isFullscreen.value = true
  document.body.style.overflow = 'hidden'
  emit('enter')
}

const exitFullscreen = () => {
  isFullscreen.value = false
  document.body.style.overflow = ''
  emit('exit')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: isDark.value } }))
}

const onFontSizeChange = (size) => {
  fontSize.value = size
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})

defineExpose({ enterFullscreen, exitFullscreen, isFullscreen })
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-primary, #fff);
  z-index: 10000;
  overflow-y: auto;
}

.fullscreen-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px 80px;
  min-height: 100vh;
}

.fullscreen-toolbar {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: var(--bg-secondary, #f5f5f5);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10001;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #666);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: var(--bg-tertiary, #e0e0e0);
  color: var(--text-primary, #333);
}

.exit-btn {
  margin-left: 8px;
  border-left: 1px solid var(--border-color, #e0e0e0);
  padding-left: 12px;
}

.fullscreen-article {
  line-height: 1.8;
  color: var(--text-primary, #333);
}

/* 过渡动画 */
.fullscreen-fade-enter-active,
.fullscreen-fade-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-fade-enter-from,
.fullscreen-fade-leave-to {
  opacity: 0;
}
</style>
