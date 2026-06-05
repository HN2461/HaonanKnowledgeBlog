<template>
  <div class='app-layout' :style='layoutStyleVars'>
    <AppHeader @toggle-sidebar='toggleSidebar' :sidebar-visible='sidebarVisible' />
    <div class='layout-container'>
      <AppSidebar
        :visible='sidebarVisible'
        :expanded='isDesktopSidebarExpanded'
        @close='closeSidebar'
        @toggle-expand='toggleDesktopSidebarExpanded'
      />
      <main class='main-content'>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const MOBILE_BREAKPOINT = 768
const DESKTOP_SIDEBAR_EXPANDED_KEY = 'desktop-sidebar-expanded'

const sidebarVisible = ref(true)
const isMobileViewport = ref(false)
const isDesktopSidebarExpanded = ref(loadDesktopSidebarExpanded())
const mobileHeaderOffset = ref(72)
const immersiveSidebarSnapshot = ref(null)

let resizeHandler = null
let headerResizeObserver = null

const layoutStyleVars = computed(() => ({
  '--mobile-header-offset': `${mobileHeaderOffset.value}px`
}))

const updateMobileHeaderOffset = () => {
  const headerEl = document.querySelector('.app-header')
  if (!headerEl) {
    return
  }

  mobileHeaderOffset.value = Math.round(headerEl.getBoundingClientRect().height)
}

function loadDesktopSidebarExpanded() {
  try {
    return localStorage.getItem(DESKTOP_SIDEBAR_EXPANDED_KEY) === 'true'
  } catch {
    return false
  }
}

function persistDesktopSidebarExpanded(value) {
  try {
    localStorage.setItem(DESKTOP_SIDEBAR_EXPANDED_KEY, String(value))
  } catch {
    // 忽略隐私模式或存储不可用场景，当前页面内的状态仍然可用。
  }
}

const syncSidebarViewportState = () => {
  if (immersiveSidebarSnapshot.value) {
    isMobileViewport.value = window.innerWidth < MOBILE_BREAKPOINT
    return
  }

  const nextIsMobile = window.innerWidth < MOBILE_BREAKPOINT
  const viewportModeChanged = nextIsMobile !== isMobileViewport.value

  isMobileViewport.value = nextIsMobile

  if (nextIsMobile) {
    sidebarVisible.value = false
    isDesktopSidebarExpanded.value = false
  } else if (viewportModeChanged) {
    sidebarVisible.value = true
    isDesktopSidebarExpanded.value = loadDesktopSidebarExpanded()
  }
}

const toggleSidebar = () => {
  immersiveSidebarSnapshot.value = null
  sidebarVisible.value = !sidebarVisible.value
}

const closeSidebar = () => {
  immersiveSidebarSnapshot.value = null
  sidebarVisible.value = false
}

const toggleDesktopSidebarExpanded = () => {
  if (isMobileViewport.value) {
    return
  }

  isDesktopSidebarExpanded.value = !isDesktopSidebarExpanded.value
  persistDesktopSidebarExpanded(isDesktopSidebarExpanded.value)
}

const handleReadingImmersiveChange = (event) => {
  const enabled = !!event.detail?.enabled

  if (enabled) {
    if (!immersiveSidebarSnapshot.value) {
      immersiveSidebarSnapshot.value = {
        visible: sidebarVisible.value,
        expanded: isDesktopSidebarExpanded.value
      }
    }

    sidebarVisible.value = false
    isDesktopSidebarExpanded.value = false
    return
  }

  if (!immersiveSidebarSnapshot.value) {
    return
  }

  const previousState = immersiveSidebarSnapshot.value
  immersiveSidebarSnapshot.value = null
  sidebarVisible.value = previousState.visible
  isDesktopSidebarExpanded.value = isMobileViewport.value ? false : previousState.expanded
}

onMounted(() => {
  syncSidebarViewportState()

  resizeHandler = () => {
    syncSidebarViewportState()
    updateMobileHeaderOffset()
  }

  window.addEventListener('resize', resizeHandler)
  window.addEventListener('reading-immersive-change', handleReadingImmersiveChange)

  nextTick(() => {
    updateMobileHeaderOffset()

    const headerEl = document.querySelector('.app-header')
    if (headerEl && typeof window.ResizeObserver !== 'undefined') {
      headerResizeObserver = new window.ResizeObserver(() => {
        updateMobileHeaderOffset()
      })
      headerResizeObserver.observe(headerEl)
    }
  })
})

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  window.removeEventListener('reading-immersive-change', handleReadingImmersiveChange)

  if (headerResizeObserver) {
    headerResizeObserver.disconnect()
  }
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: transparent;
  padding: 24px 20px;
  height: 100%;
}

.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

@media (max-width: 768px) {
  .main-content {
    padding: 18px 14px;
  }
}
</style>
