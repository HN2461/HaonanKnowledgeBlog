<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    modal-class="sidebar-export-modal-shell"
    content-class="sidebar-export-modal-panel"
  >
    <div class="sidebar-export-modal">
      <div class="modal-head">
        <p class="modal-kicker">资料导出</p>
        <h2 class="modal-title">选择文档或目录</h2>
        <p class="modal-description">
          单篇会导出原始 Markdown 文件，整目录会打包成 ZIP，自选多篇文档也能一起打包，并附带这些文章已声明的附件资源。
        </p>
      </div>

      <div class="modal-layout">
        <section class="modal-list-panel">
          <div class="list-panel-head">
            <div>
              <p class="list-panel-kicker">{{ listPanelKicker }}</p>
              <h3 class="list-panel-title">{{ listPanelTitle }}</h3>
            </div>
            <span class="list-panel-count">{{ listPanelCount }}</span>
          </div>

          <div class="target-list-shell">
            <div class="target-list" v-if="filteredTargets.length > 0">
              <button
                v-for="target in filteredTargets"
                :key="target.path"
                type="button"
                class="target-card"
                :class="getTargetCardClasses(target)"
                :style="getTargetStyle(target)"
                @click="handleTargetClick(target)"
              >
                <div class="target-card-main">
                  <div class="target-card-topline">
                    <span class="target-kind">{{ isNoteMode ? '文档' : '目录' }}</span>
                    <span class="target-current" v-if="isCurrentTarget(target)">当前</span>
                    <span class="target-check" v-if="isNoteMultiMode" :class="{ active: isTargetSelected(target) }" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8.25 6.5 11.25 12.5 5.25" />
                      </svg>
                    </span>
                  </div>
                  <strong class="target-title">{{ getTargetTitle(target) }}</strong>
                  <span class="target-path">{{ target.path }}</span>
                </div>
                <div v-if="getTargetMeta(target)" class="target-card-meta">{{ getTargetMeta(target) }}</div>
              </button>
            </div>

            <div class="empty-state" v-else>
              <strong>没有匹配结果</strong>
              <span>{{ isNoteMode ? '试试换个关键词查找文章标题或路径。' : '试试输入根目录或子目录名称。' }}</span>
            </div>
          </div>
        </section>

        <aside class="modal-control-panel">
          <div class="control-panel-card">
            <div class="control-block">
              <span class="control-block-label">导出类型</span>
              <div class="mode-switch" role="tablist" aria-label="导出模式">
                <button
                  type="button"
                  class="mode-switch-btn"
                  :class="{ active: isNoteMode }"
                  :aria-selected="String(isNoteMode)"
                  @click="mode = 'note'"
                >
                  文档
                </button>
                <button
                  type="button"
                  class="mode-switch-btn"
                  :class="{ active: isDirectoryMode }"
                  :aria-selected="String(isDirectoryMode)"
                  @click="mode = 'directory'"
                >
                  文件夹
                </button>
              </div>
            </div>

            <div class="control-block" v-if="isNoteMode">
              <span class="control-block-label">选择方式</span>
              <div class="selection-switch" role="tablist" aria-label="文档选择方式">
                <button
                  type="button"
                  class="selection-switch-btn"
                  :class="{ active: noteSelectionMode === 'single' }"
                  :aria-selected="String(noteSelectionMode === 'single')"
                  @click="noteSelectionMode = 'single'"
                >
                  单选
                </button>
                <button
                  type="button"
                  class="selection-switch-btn"
                  :class="{ active: noteSelectionMode === 'multiple' }"
                  :aria-selected="String(noteSelectionMode === 'multiple')"
                  @click="noteSelectionMode = 'multiple'"
                >
                  多选打包
                </button>
              </div>
            </div>

            <div class="control-block" v-if="currentTarget">
              <span class="control-block-label">{{ currentShortcutLabel }}</span>
              <div class="current-shortcut">
                <div class="shortcut-copy">
                  <strong class="shortcut-name">{{ currentTargetTitle }}</strong>
                  <span class="shortcut-meta">{{ currentTargetMeta }}</span>
                </div>
                <button type="button" class="shortcut-action" @click="useCurrentTarget">
                  {{ currentShortcutAction }}
                </button>
              </div>
            </div>

            <div class="control-block">
              <label class="search-box">
                <span class="search-label">{{ searchLabel }}</span>
                <input
                  v-model="query"
                  class="search-input"
                  type="text"
                  :placeholder="searchPlaceholder"
                >
              </label>
            </div>

            <div class="control-block selection-tools-block" v-if="isNoteMultiMode">
              <div class="selection-tools">
                <span class="selection-tools-count">已选 {{ selectedNotes.length }} 篇</span>
                <div class="selection-tools-actions">
                  <button
                    type="button"
                    class="selection-tools-btn"
                    :disabled="filteredTargets.length === 0"
                    @click="selectAllFilteredNotes"
                  >
                    全选当前结果
                  </button>
                  <button
                    type="button"
                    class="selection-tools-btn"
                    :disabled="selectedNotes.length === 0"
                    @click="clearSelectedNotes"
                  >
                    清空已选
                  </button>
                </div>
              </div>
            </div>

            <div class="control-block" v-if="hasSelection">
              <div class="selection-summary">
                <span class="selection-label">已选择</span>
                <strong class="selection-title">{{ selectionTitle }}</strong>
                <span v-if="selectionMeta" class="selection-meta">{{ selectionMeta }}</span>
                <div v-if="showSelectionPreview" class="selection-preview-list">
                  <div
                    v-for="item in selectedPreviewItems"
                    :key="item.path"
                    class="selection-preview-item"
                  >
                    <span class="selection-preview-title">{{ item.title }}</span>
                    <span class="selection-preview-path">{{ item.path }}</span>
                  </div>
                  <div v-if="selectedOverflowCount > 0" class="selection-preview-more">
                    另有 {{ selectedOverflowCount }} 篇文档未展开
                  </div>
                </div>
              </div>
            </div>

            <p
              v-if="feedback.message"
              class="feedback-message"
              :class="`is-${feedback.type}`"
              role="status"
            >
              {{ feedback.message }}
            </p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="footer-btn secondary"
              :disabled="exporting"
              @click="$emit('update:modelValue', false)"
            >
              关闭
            </button>
            <button
              type="button"
              class="footer-btn primary"
              :disabled="!hasSelection || exporting"
              @click="handleExport"
            >
              {{ exportButtonText }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import {
  collectNoteExportEntries,
  exportDirectoryArchive,
  exportNoteSource,
  exportSelectedNotesArchive,
  flattenExportDirectories,
  flattenExportNotes
} from '@/utils/noteExport'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tree: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue'])

const route = useRoute()
const mode = ref('note')
const noteSelectionMode = ref('single')
const query = ref('')
const selectedPath = ref('')
const selectedNotePaths = ref([])
const exporting = ref(false)
const feedback = ref({
  type: 'info',
  message: ''
})

const noteOptions = computed(() => flattenExportNotes(props.tree))
const directoryOptions = computed(() => flattenExportDirectories(props.tree))
const isNoteMode = computed(() => mode.value === 'note')
const isDirectoryMode = computed(() => mode.value === 'directory')
const isNoteMultiMode = computed(() => isNoteMode.value && noteSelectionMode.value === 'multiple')
const activeTargets = computed(() => (isNoteMode.value ? noteOptions.value : directoryOptions.value))

const normalizedQuery = computed(() => {
  return String(query.value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKC')
})

const currentNotePath = computed(() => {
  return route.name === 'NoteDetail' && route.params.path
    ? `${route.params.path}.md`
    : ''
})

const currentDirectoryPath = computed(() => {
  if (route.name === 'NoteDetail') {
    const routePath = String(route.params.path || '')
    const segments = routePath.split('/').filter(Boolean)
    return segments.length > 1 ? segments.slice(0, -1).join('/') : ''
  }

  if (route.name === 'NoteList') {
    return String(route.params.category || '')
  }

  return ''
})

const currentNote = computed(() => {
  return noteOptions.value.find((item) => item.path === currentNotePath.value) || null
})

const currentDirectory = computed(() => {
  return directoryOptions.value.find((item) => item.path === currentDirectoryPath.value) || null
})

const currentTarget = computed(() => {
  return isNoteMode.value ? currentNote.value : currentDirectory.value
})

const filteredTargets = computed(() => {
  const result = !normalizedQuery.value
    ? [...activeTargets.value]
    : activeTargets.value.filter((target) => {
        const searchText = [
          getTargetTitle(target),
          target.path,
          isDirectoryMode.value ? getTargetMeta(target) : ''
        ]
          .join(' ')
          .toLowerCase()
          .normalize('NFKC')

        return searchText.includes(normalizedQuery.value)
      })

  if (!currentTarget.value) {
    return result
  }

  return result.sort((a, b) => {
    if (a.path === currentTarget.value.path) return -1
    if (b.path === currentTarget.value.path) return 1
    return 0
  })
})

const selectedTarget = computed(() => {
  return activeTargets.value.find((item) => item.path === selectedPath.value) || null
})

const selectedNotes = computed(() => {
  const pathMap = new Map(noteOptions.value.map((item) => [item.path, item]))
  return selectedNotePaths.value
    .map((path) => pathMap.get(path))
    .filter(Boolean)
})

const selectedNoteExportInfo = computed(() => {
  return collectNoteExportEntries(selectedNotes.value)
})

const hasSelection = computed(() => {
  return isNoteMultiMode.value ? selectedNotes.value.length > 0 : !!selectedTarget.value
})

const currentTargetTitle = computed(() => {
  return currentTarget.value ? getTargetTitle(currentTarget.value) : ''
})

const currentTargetMeta = computed(() => {
  return currentTarget.value ? getTargetMeta(currentTarget.value) : ''
})

const currentShortcutLabel = computed(() => {
  if (isNoteMultiMode.value) {
    return '当前文章'
  }

  return isNoteMode.value ? '当前文章' : '当前所在目录'
})

const currentShortcutAction = computed(() => {
  if (isNoteMultiMode.value) {
    return '加入当前文章'
  }

  return `选中当前${isNoteMode.value ? '文章' : '目录'}`
})

const searchLabel = computed(() => {
  if (isDirectoryMode.value) {
    return '查找文件夹'
  }

  return isNoteMultiMode.value ? '筛选可打包文档' : '查找文档'
})

const searchPlaceholder = computed(() => {
  if (isDirectoryMode.value) {
    return '输入目录名或路径筛选文件夹'
  }

  return isNoteMultiMode.value
    ? '输入标题或路径筛选后，可一键全选当前结果'
    : '输入标题或路径筛选文档'
})

const selectionTitle = computed(() => {
  if (isNoteMultiMode.value) {
    return `已勾选 ${selectedNotes.value.length} 篇文档`
  }

  return selectedTarget.value ? getTargetTitle(selectedTarget.value) : ''
})

const selectionMeta = computed(() => {
  if (isNoteMultiMode.value) {
    const attachmentCount = selectedNoteExportInfo.value.attachments.length
    return `${selectedNotes.value.length} 篇文档${attachmentCount > 0 ? ` · ${attachmentCount} 个附件` : ''}`
  }

  return selectedTarget.value ? getTargetMeta(selectedTarget.value) : ''
})

const selectedPreviewItems = computed(() => {
  if (!isNoteMultiMode.value) {
    return []
  }

  return selectedNotes.value.slice(0, 3).map((note) => ({
    path: note.path,
    title: note.title || note.filename || note.path
  }))
})

const selectedOverflowCount = computed(() => {
  if (!isNoteMultiMode.value) {
    return 0
  }

  return Math.max(0, selectedNotes.value.length - selectedPreviewItems.value.length)
})

const showSelectionPreview = computed(() => {
  return isNoteMultiMode.value && selectedPreviewItems.value.length > 0
})

const listPanelKicker = computed(() => {
  if (isDirectoryMode.value) {
    return '目录清单'
  }

  return isNoteMultiMode.value ? '可打包文档' : '文档清单'
})

const listPanelTitle = computed(() => {
  if (isDirectoryMode.value) {
    return '在左侧浏览目录，右侧确认导出范围'
  }

  return isNoteMultiMode.value
    ? '勾选需要一起打包的文章'
    : '选择一篇要导出的原始文档'
})

const listPanelCount = computed(() => {
  if (isDirectoryMode.value) {
    return `${filteredTargets.value.length} 个目录`
  }

  return `${filteredTargets.value.length} 篇文档`
})

const exportButtonText = computed(() => {
  if (exporting.value) {
    if (isDirectoryMode.value) {
      return '正在打包目录...'
    }

    return isNoteMultiMode.value ? '正在打包已选文档...' : '正在导出文档...'
  }

  if (isDirectoryMode.value) {
    return '导出 ZIP 压缩包'
  }

  if (isNoteMultiMode.value) {
    return `打包已选文档${selectedNotes.value.length > 0 ? ` (${selectedNotes.value.length})` : ''}`
  }

  return '导出 Markdown'
})

const clearFeedback = () => {
  feedback.value = {
    type: 'info',
    message: ''
  }
}

const getTargetTitle = (target) => {
  if (!target) {
    return ''
  }

  return isNoteMode.value ? target.title || target.filename || target.path : target.name || target.path
}

const getTargetMeta = (target) => {
  if (!target) {
    return ''
  }

  if (isNoteMode.value) {
    const attachmentCount = Array.isArray(target.attachments) ? target.attachments.length : 0
    return attachmentCount > 0 ? `${attachmentCount} 个附件` : ''
  }

  const noteCount = target.noteCount || 0
  const attachmentCount = target.attachmentCount || 0
  return `${noteCount} 篇文档${attachmentCount > 0 ? ` · ${attachmentCount} 个附件` : ''}`
}

const chooseFallbackTarget = () => {
  if (isNoteMultiMode.value) {
    selectedNotePaths.value = currentNote.value?.path ? [currentNote.value.path] : []
    return
  }

  if (currentTarget.value) {
    selectedPath.value = currentTarget.value.path
    return
  }

  selectedPath.value = activeTargets.value[0]?.path || ''
}

const useCurrentTarget = () => {
  if (!currentTarget.value) {
    return
  }

  if (isNoteMultiMode.value) {
    if (!selectedNotePaths.value.includes(currentTarget.value.path)) {
      selectedNotePaths.value = [...selectedNotePaths.value, currentTarget.value.path]
    }
    clearFeedback()
    return
  }

  selectedPath.value = currentTarget.value.path
  clearFeedback()
}

const isCurrentTarget = (target) => {
  return !!currentTarget.value && currentTarget.value.path === target.path
}

const isTargetSelected = (target) => {
  if (isNoteMultiMode.value) {
    return selectedNotePaths.value.includes(target.path)
  }

  return selectedPath.value === target.path
}

const getTargetCardClasses = (target) => {
  return {
    active: isTargetSelected(target),
    'is-multi-select': isNoteMultiMode.value
  }
}

const getTargetStyle = (target) => {
  if (isDirectoryMode.value) {
    const depth = Math.max(1, Number(target?.depth || 1))
    if (depth > 1) {
      return {
        '--target-indent': `${(depth - 1) * 14}px`
      }
    }
  }

  return {}
}

const toggleNoteSelection = (path) => {
  if (selectedNotePaths.value.includes(path)) {
    selectedNotePaths.value = selectedNotePaths.value.filter((item) => item !== path)
    return
  }

  selectedNotePaths.value = [...selectedNotePaths.value, path]
}

const handleTargetClick = (target) => {
  if (isNoteMultiMode.value) {
    toggleNoteSelection(target.path)
    return
  }

  selectedPath.value = target.path
}

const selectAllFilteredNotes = () => {
  if (!isNoteMultiMode.value) {
    return
  }

  selectedNotePaths.value = Array.from(new Set(filteredTargets.value.map((target) => target.path)))
}

const clearSelectedNotes = () => {
  selectedNotePaths.value = []
}

const handleExport = async () => {
  if (!hasSelection.value || exporting.value) {
    return
  }

  exporting.value = true
  clearFeedback()

  try {
    if (isDirectoryMode.value && selectedTarget.value) {
      const result = await exportDirectoryArchive(selectedTarget.value, {
        baseUrl: import.meta.env.BASE_URL
      })

      feedback.value = {
        type: 'success',
        message: `已开始下载 ${result.filename}，包含 ${result.noteCount} 篇文档${result.attachmentCount > 0 ? ` 和 ${result.attachmentCount} 个附件` : ''}`
      }
      return
    }

    if (isNoteMultiMode.value) {
      const result = await exportSelectedNotesArchive(selectedNotes.value, {
        baseUrl: import.meta.env.BASE_URL
      })

      feedback.value = {
        type: 'success',
        message: `已开始下载 ${result.filename}，包含 ${result.noteCount} 篇文档${result.attachmentCount > 0 ? ` 和 ${result.attachmentCount} 个附件` : ''}`
      }
      return
    }

    if (selectedTarget.value) {
      const filename = await exportNoteSource(selectedTarget.value, {
        baseUrl: import.meta.env.BASE_URL
      })

      feedback.value = {
        type: 'success',
        message: `已开始下载 ${filename}`
      }
    }
  } catch (error) {
    console.error('导出资料失败:', error)
    feedback.value = {
      type: 'error',
      message: error?.message || '导出失败，请稍后重试'
    }
  } finally {
    exporting.value = false
  }
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return
    }

    mode.value = currentNote.value ? 'note' : 'directory'
    noteSelectionMode.value = 'single'
    query.value = ''
    selectedNotePaths.value = []
    clearFeedback()
    chooseFallbackTarget()
  }
)

watch(mode, () => {
  noteSelectionMode.value = 'single'
  query.value = ''
  selectedNotePaths.value = []
  clearFeedback()
  chooseFallbackTarget()
})

watch(noteSelectionMode, (nextMode, previousMode) => {
  if (!isNoteMode.value || nextMode === previousMode) {
    return
  }

  clearFeedback()

  if (nextMode === 'multiple') {
    selectedNotePaths.value = selectedPath.value
      ? [selectedPath.value]
      : currentNote.value?.path
        ? [currentNote.value.path]
        : []
    return
  }

  selectedPath.value = selectedNotePaths.value[0]
    || currentNote.value?.path
    || noteOptions.value[0]?.path
    || ''
  selectedNotePaths.value = []
})

watch(activeTargets, (targets) => {
  if (isNoteMultiMode.value) {
    selectedNotePaths.value = selectedNotePaths.value.filter((path) => {
      return targets.some((item) => item.path === path)
    })
    return
  }

  if (targets.some((item) => item.path === selectedPath.value)) {
    return
  }

  selectedPath.value = targets[0]?.path || ''
})
</script>

<style scoped>
:global(.modal-content.sidebar-export-modal-panel) {
  width: min(1180px, calc(100vw - 32px));
  max-width: 1180px;
  padding: 0;
  overflow: hidden !important;
  max-height: min(90vh, 860px);
}

.sidebar-export-modal {
  height: min(82vh, 780px);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-head {
  padding-right: 12px;
}

.modal-kicker {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.modal-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.15;
}

.modal-description {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.modal-layout {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.32fr) minmax(360px, 420px);
  gap: 24px;
  overflow: hidden;
}

.modal-list-panel,
.modal-control-panel {
  min-height: 0;
}

.modal-list-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background:
    linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.06), rgba(var(--primary-color-rgb), 0.02)),
    var(--bg-primary);
  overflow: hidden;
}

.list-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.list-panel-kicker,
.control-block-label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.list-panel-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.3;
}

.list-panel-count {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.target-list-shell {
  min-height: 0;
  flex: 1;
  padding-right: 6px;
  overflow: hidden;
}

.modal-control-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
}

.control-panel-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--primary-color-rgb), 0.2) transparent;
}

.control-panel-card::-webkit-scrollbar {
  width: 8px;
}

.control-panel-card::-webkit-scrollbar-track {
  background: transparent;
}

.control-panel-card::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.18);
}

.control-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-switch,
.selection-switch {
  display: inline-flex;
  width: 100%;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  gap: 4px;
}

.mode-switch-btn,
.selection-switch-btn {
  flex: 1;
  min-width: 0;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.mode-switch-btn.active,
.selection-switch-btn.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.note-selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.selection-tools {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;
}

.selection-tools-count {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.selection-tools-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.selection-tools-btn {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
}

.selection-tools-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-shortcut {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.16);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08), rgba(var(--primary-color-rgb), 0.03));
}

.shortcut-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shortcut-label,
.selection-label,
.search-label {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.shortcut-name,
.selection-title {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.4;
}

.shortcut-meta,
.selection-meta {
  color: var(--text-secondary);
  font-size: 13px;
}

.shortcut-action {
  width: 100%;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.22);
  background: var(--bg-primary);
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 600;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-input {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: rgba(var(--primary-color-rgb), 0.34);
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.08);
}

.target-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 6px;
  overscroll-behavior: contain;
}

.target-card {
  min-height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  text-align: left;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.target-card:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--primary-color-rgb), 0.18);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

.target-card.active {
  border-color: rgba(var(--primary-color-rgb), 0.42);
  background: linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.1), rgba(var(--primary-color-rgb), 0.04));
  box-shadow: 0 16px 30px rgba(var(--primary-color-rgb), 0.14);
}

.target-card.is-multi-select {
  padding-right: 18px;
}

.target-card-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: var(--target-indent, 0px);
  position: relative;
}

.target-card-main::before {
  content: '';
  position: absolute;
  left: calc(var(--target-indent, 0px) - 10px);
  top: 4px;
  bottom: 4px;
  width: 2px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.14);
  opacity: 0;
}

.target-card[style*='--target-indent'] .target-card-main::before {
  opacity: 1;
}

.target-card-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.target-kind,
.target-current {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.target-kind {
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

.target-current {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.target-check {
  margin-left: auto;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1.5px solid rgba(var(--primary-color-rgb), 0.18);
  background: linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.04), rgba(var(--primary-color-rgb), 0.02));
  color: transparent;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.target-check svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.target-check.active {
  border-color: rgba(var(--primary-color-rgb), 0.95);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.92), rgba(var(--primary-color-rgb), 0.72));
  color: #fff;
  transform: scale(1.03);
  box-shadow:
    0 6px 14px rgba(var(--primary-color-rgb), 0.24),
    0 0 0 3px rgba(var(--primary-color-rgb), 0.12);
}

.target-title {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
}

.target-path {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
  word-break: break-word;
}

.target-card-meta {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 18px;
  border-radius: 18px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.18);
  background: rgba(var(--primary-color-rgb), 0.04);
  color: var(--text-secondary);
  text-align: center;
}

.empty-state strong {
  color: var(--text-primary);
}

.selection-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--bg-primary);
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
  min-width: 0;
}

.selection-summary .selection-title,
.selection-summary .selection-meta {
  min-width: 0;
  overflow-wrap: anywhere;
}

.selection-preview-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(var(--primary-color-rgb), 0.1);
}

.selection-preview-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.06), rgba(var(--primary-color-rgb), 0.02));
}

.selection-preview-title {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.selection-preview-path {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.selection-preview-more {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.feedback-message {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
}

.feedback-message.is-success {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.feedback-message.is-error {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.modal-footer {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: auto;
  padding: 14px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.footer-btn {
  flex: 1;
  min-width: 0;
  padding: 12px 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.footer-btn:disabled {
  opacity: 0.56;
  cursor: not-allowed;
}

.footer-btn.primary {
  background: var(--primary-color);
  color: #fff;
  border: 1px solid var(--primary-color);
}

.footer-btn.secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

@media (max-width: 960px) {
  :global(.sidebar-export-modal-panel) {
    width: min(100vw - 16px, 100%);
    overflow-y: auto;
  }

  .sidebar-export-modal {
    height: auto;
    min-height: auto;
  }

  .modal-layout {
    grid-template-columns: 1fr;
    overflow: visible;
  }

  .modal-list-panel {
    max-height: 46vh;
  }

  .modal-control-panel {
    min-height: auto;
  }

  .selection-tools-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar-export-modal {
    padding: 22px 18px 18px;
    gap: 16px;
  }

  .modal-title {
    font-size: 24px;
  }

  .note-selection-bar,
  .current-shortcut {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .footer-btn {
    width: 100%;
  }
}
</style>
