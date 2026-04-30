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

const sidebarVisible = ref(true)
const isMobileViewport = ref(false)
const isDesktopSidebarExpanded = ref(false)
const mobileHeaderOffset = ref(72)

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

const syncSidebarViewportState = () => {
  const nextIsMobile = window.innerWidth < MOBILE_BREAKPOINT
  const viewportModeChanged = nextIsMobile !== isMobileViewport.value

  isMobileViewport.value = nextIsMobile

  if (nextIsMobile) {
    sidebarVisible.value = false
    isDesktopSidebarExpanded.value = false
  } else if (viewportModeChanged) {
    sidebarVisible.value = true
  }
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const closeSidebar = () => {
  sidebarVisible.value = false
}

const toggleDesktopSidebarExpanded = () => {
  if (isMobileViewport.value) {
    return
  }

  isDesktopSidebarExpanded.value = !isDesktopSidebarExpanded.value
}

onMounted(() => {
  syncSidebarViewportState()

  resizeHandler = () => {
    syncSidebarViewportState()
    updateMobileHeaderOffset()
  }

  window.addEventListener('resize', resizeHandler)

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
