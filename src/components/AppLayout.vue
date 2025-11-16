<template>
  <div class="app-layout">
    <AppHeader @toggle-sidebar="toggleSidebar" :sidebar-visible="sidebarVisible" />
    <div class="layout-container">
      <AppSidebar :visible="sidebarVisible" @close="closeSidebar" />
      <main class="main-content">
        <slot name="breadcrumb"></slot>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const sidebarVisible = ref(true)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const closeSidebar = () => {
  sidebarVisible.value = false
}

onMounted(() => {
  // 移动端默认隐藏侧边栏
  if (window.innerWidth < 768) {
    sidebarVisible.value = false
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      sidebarVisible.value = false
    } else {
      sidebarVisible.value = true
    }
  })
})
</script>

<style scoped>
.app-layout {
  height: 100vh;
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
  background-color: var(--bg-secondary);
  padding: 20px;
  height: 100%;
}

/* 美化滚动条 */
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
    padding: 15px;
  }
}
</style>
