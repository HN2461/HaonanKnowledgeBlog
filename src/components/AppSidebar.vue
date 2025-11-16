<template>
  <aside class="app-sidebar" :class="{ 'sidebar-visible': visible }">
    <div class="sidebar-overlay" @click="$emit('close')" v-if="isMobile"></div>
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3>笔记目录</h3>
        <button class="close-btn" @click="$emit('close')" v-if="isMobile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="sidebar-body">
        <FileTree :tree="notesTree" @select="handleSelect" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import FileTree from './FileTree.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const notesTree = ref([])
const isMobile = ref(false)

const handleSelect = (item) => {
  if (isMobile.value) {
    emit('close')
  }
}

onMounted(async () => {
  // 检测是否为移动端
  isMobile.value = window.innerWidth < 768
  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
  
  // 加载笔记索引
  try {
    const response = await fetch('/src/assets/notes-index.json')
    const data = await response.json()
    notesTree.value = data.tree || []
  } catch (error) {
    console.error('加载笔记索引失败:', error)
    notesTree.value = []
  }
})
</script>

<style scoped>
.app-sidebar {
  width: 260px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
}

.app-sidebar:not(.sidebar-visible) {
  margin-left: -260px;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 99;
    margin-left: -260px;
  }
  
  .app-sidebar.sidebar-visible {
    margin-left: 0;
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background-color: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: var(--bg-secondary);
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
}

/* 美化滚动条 */
.sidebar-body::-webkit-scrollbar {
  width: 6px;
}

.sidebar-body::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.sidebar-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>
