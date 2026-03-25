<template>
  <div class='file-tree'>
    <div v-for='item in tree' :key='item.path' class='tree-item'>
      <button
        v-if="item.type === 'directory'"
        type='button'
        class='tree-node directory'
        :class="{ expanded: isExpanded(item.path) }"
        @click='toggleDirectory(item.path)'
      >
        <span class='expand-icon' aria-hidden='true'>
          <svg v-if='!isExpanded(item.path)' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <polyline points='9 18 15 12 9 6'></polyline>
          </svg>
          <svg v-else width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <polyline points='6 9 12 15 18 9'></polyline>
          </svg>
        </span>
        <span class='node-icon' aria-hidden='true'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <path d='M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z'></path>
          </svg>
        </span>
        <span class='node-label' :title='item.name'>{{ item.name }}</span>
      </button>

      <router-link
        v-else-if="item.type === 'file'"
        :to="`/note/${item.path.replace('.md', '')}`"
        class='tree-node file'
        :class="{ active: isActive(item.path) }"
        @click="$emit('select', item)"
      >
        <span class='node-icon' aria-hidden='true'>
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <path d='M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z'></path>
            <path d='M14 2v5h5'></path>
          </svg>
        </span>
        <span class='node-label' :title='item.title'>{{ item.title }}</span>
      </router-link>

      <div v-if="item.type === 'directory' && isExpanded(item.path)" class='tree-children'>
        <FileTree :tree='item.children' @select="$emit('select', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, inject, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  tree: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select'])

const route = useRoute()

const FILE_TREE_CTX = Symbol('file-tree')

const injectedCtx = inject(FILE_TREE_CTX, null)
const isRoot = injectedCtx === null

function isDescendantPath(parentPath, currentPath) {
  return currentPath !== parentPath && currentPath.startsWith(`${parentPath}/`)
}

function collapseDirectoryBranch(directorySet, path) {
  Array.from(directorySet).forEach((dirPath) => {
    if (dirPath === path || isDescendantPath(path, dirPath)) {
      directorySet.delete(dirPath)
    }
  })
}

function pruneNestedExpandedDirs(paths) {
  return [...new Set(paths)]
    .sort((a, b) => a.length - b.length)
    .filter((path, index, list) => {
      return !list.slice(0, index).some((candidate) => isDescendantPath(candidate, path))
    })
}

const loadExpandedDirs = () => {
  try {
    const raw = localStorage.getItem('file-tree-expanded-dirs')
    const value = raw ? JSON.parse(raw) : []
    return new Set(pruneNestedExpandedDirs(Array.isArray(value) ? value : []))
  } catch {
    return new Set()
  }
}

const expandedDirs = isRoot ? ref(loadExpandedDirs()) : injectedCtx.expandedDirs

const persistExpandedDirs = () => {
  if (!isRoot) {
    return
  }

  try {
    localStorage.setItem('file-tree-expanded-dirs', JSON.stringify(Array.from(expandedDirs.value)))
  } catch {
    // ignore
  }
}

const toggleDirectory = (path) => {
  const next = new Set(expandedDirs.value)

  if (next.has(path)) {
    collapseDirectoryBranch(next, path)
  } else {
    collapseDirectoryBranch(next, path)
    next.add(path)
  }

  expandedDirs.value = next
  persistExpandedDirs()
}

const expandPaths = (paths) => {
  const next = new Set(expandedDirs.value)
  let changed = false

  paths.forEach((path) => {
    if (!next.has(path)) {
      next.add(path)
      changed = true
    }
  })

  if (!changed) {
    return
  }

  expandedDirs.value = next
  persistExpandedDirs()
}

const isExpanded = (path) => {
  return expandedDirs.value.has(path)
}

if (isRoot) {
  provide(FILE_TREE_CTX, {
    expandedDirs
  })
}

const isActive = (path) => {
  const notePath = path.replace('.md', '')
  return route.path === `/note/${notePath}`
}

const expandToActiveNote = async () => {
  const activePath = route.params.path
  if (!activePath) {
    return
  }

  const filePath = `${activePath}.md`
  const segments = String(filePath).split('/').filter(Boolean)
  if (segments.length <= 1) {
    return
  }

  const parents = []
  for (let index = 0; index < segments.length - 1; index += 1) {
    parents.push(segments.slice(0, index + 1).join('/'))
  }

  expandPaths(parents)

  await nextTick()
  const activeEl = document.querySelector('.app-sidebar .tree-node.file.active')
  activeEl?.scrollIntoView({
    block: 'center'
  })
}

if (isRoot) {
  onMounted(() => {
    expandToActiveNote()
  })

  watch(
    () => route.params.path,
    () => {
      expandToActiveNote()
    }
  )
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
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-primary);
  text-align: left;
  text-decoration: none;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}

.tree-node:hover {
  border-color: rgba(var(--primary-color-rgb), 0.12);
  background: rgba(var(--primary-color-rgb), 0.04);
}

.tree-node.directory {
  color: var(--text-secondary);
  font-weight: 600;
}

.tree-node.directory.expanded {
  color: var(--text-primary);
}

.tree-node.active {
  border-color: rgba(var(--primary-color-rgb), 0.24);
  background: rgba(var(--primary-color-rgb), 0.08);
  color: var(--primary-color);
}

.expand-icon,
.node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-children {
  margin-left: 16px;
  padding-left: 10px;
  border-left: 1px solid rgba(var(--primary-color-rgb), 0.1);
}
</style>
