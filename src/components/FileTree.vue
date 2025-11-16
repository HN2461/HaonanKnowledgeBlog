<template>
  <div class="file-tree">
    <div v-for="item in tree" :key="item.path" class="tree-item">
      <div
        v-if="item.type === 'directory'"
        class="tree-node directory"
        @click="toggleDirectory(item.path)"
      >
        <span class="expand-icon">
          <svg v-if="!isExpanded(item.path)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
        <span class="folder-icon">📁</span>
        <span class="node-label">{{ item.name }}</span>
      </div>
      
      <router-link
        v-else-if="item.type === 'file'"
        :to="`/note/${item.path.replace('.md', '')}`"
        class="tree-node file"
        :class="{ active: isActive(item.path) }"
        @click="$emit('select', item)"
      >
        <span class="file-icon">📄</span>
        <span class="node-label">{{ item.title }}</span>
      </router-link>
      
      <div v-if="item.type === 'directory' && isExpanded(item.path)" class="tree-children">
        <FileTree :tree="item.children" @select="$emit('select', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  tree: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const route = useRoute()
const expandedDirs = ref(new Set())

const toggleDirectory = (path) => {
  if (expandedDirs.value.has(path)) {
    expandedDirs.value.delete(path)
  } else {
    expandedDirs.value.add(path)
  }
}

const isExpanded = (path) => {
  return expandedDirs.value.has(path)
}

const isActive = (path) => {
  const notePath = path.replace('.md', '')
  return route.path === `/note/${notePath}`
}
</script>

<style scoped>
.file-tree {
  font-size: 14px;
}

.tree-item {
  margin-bottom: 2px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.tree-node:hover {
  background-color: var(--bg-secondary);
}

.tree-node.active {
  background-color: var(--primary-color);
  color: white;
}

.tree-node.directory {
  font-weight: 500;
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.folder-icon,
.file-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-children {
  margin-left: 20px;
  margin-top: 2px;
}
</style>
