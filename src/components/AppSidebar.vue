<template>
  <div class='sidebar-overlay' @click="$emit('close')" v-if='isMobile && visible'></div>
  <aside class='app-sidebar' :class="{ 'sidebar-visible': visible }">
    <div class='sidebar-content'>
      <div class='sidebar-header'>
        <h3>知识目录</h3>
        <button class='close-btn' @click="$emit('close')" v-if='isMobile' aria-label='关闭侧边栏'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
      </div>

      <div class='sidebar-body'>
        <FileTree :tree='notesTree' @select='handleSelect' />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FileTree from './FileTree.vue'

defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const notesTree = ref([])
const isMobile = ref(false)

const handleSelect = () => {
  if (isMobile.value) {
    emit('close')
  }
}

onMounted(async () => {
  isMobile.value = window.innerWidth < 768

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
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
  width: 312px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s ease;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
}

.app-sidebar:not(.sidebar-visible) {
  margin-left: -312px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  padding: 18px;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.3;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-secondary);
}

.close-btn:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.2);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 10px 18px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-body::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 68px;
    bottom: 0;
    z-index: 99;
    margin-left: -312px;
  }

  .app-sidebar.sidebar-visible {
    margin-left: 0;
  }

  .sidebar-overlay {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.34);
    z-index: 98;
  }
}
</style>
