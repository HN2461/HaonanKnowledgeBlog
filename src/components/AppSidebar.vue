<template>
  <div class='sidebar-overlay' @click="emit('close')" v-if='isMobile && props.visible'></div>

  <aside
    class='app-sidebar'
    :class="{
      'sidebar-visible': props.visible,
      'has-wrap-labels': shouldWrapLabels
    }"
  >
    <div class='sidebar-content'>
      <div class='sidebar-header'>
        <h3>知识目录</h3>

        <div class='sidebar-header-actions'>
          <button
            class='width-toggle-btn'
            type='button'
            :class="{ active: props.expanded }"
            :aria-pressed="String(props.expanded)"
            :aria-label="props.expanded ? '恢复单行标题显示' : '展开完整标题模式'"
            :title="props.expanded ? '恢复单行标题显示' : '展开完整标题模式'"
            @click="emit('toggle-expand')"
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <path d='M4 9V5h4'></path>
              <path d='M20 9V5h-4'></path>
              <path d='M4 15v4h4'></path>
              <path d='M20 15v4h-4'></path>
              <path d='m9 5-5 5'></path>
              <path d='m15 5 5 5'></path>
              <path d='m9 19-5-5'></path>
              <path d='m15 19 5-5'></path>
            </svg>
            <span>{{ props.expanded ? '恢复' : '展开' }}</span>
          </button>

          <div class='sidebar-actions' ref='actionsRef'>
            <button
              class='actions-btn'
              type='button'
              aria-label='打开侧栏功能'
              aria-haspopup='menu'
              :aria-expanded="String(showActionsMenu)"
              :disabled='notesTree.length === 0'
              @click='toggleActionsMenu'
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <circle cx='5' cy='12' r='1.5'></circle>
                <circle cx='12' cy='12' r='1.5'></circle>
                <circle cx='19' cy='12' r='1.5'></circle>
              </svg>
            </button>

            <Transition name='actions-popover'>
              <div v-if='showActionsMenu' class='actions-menu' role='menu'>
                <div class='actions-menu-section-label'>快捷操作</div>

                <button
                  type='button'
                  class='actions-menu-item'
                  role='menuitem'
                  :disabled='!currentNote || !!runningAction'
                  @click='quickExportCurrentNote'
                >
                  <span class='actions-menu-title'>{{ runningAction === 'current-note' ? '正在导出当前文章...' : '导出当前文章' }}</span>
                  <span class='actions-menu-desc'>{{ currentNote ? currentNote.title : '仅在文章详情页可用' }}</span>
                </button>

                <button
                  type='button'
                  class='actions-menu-item'
                  role='menuitem'
                  :disabled='!currentDirectory || !!runningAction'
                  @click='quickExportCurrentDirectory'
                >
                  <span class='actions-menu-title'>{{ runningAction === 'current-directory' ? '正在打包当前目录...' : '导出当前目录' }}</span>
                  <span class='actions-menu-desc'>{{ currentDirectory ? getDirectoryActionDesc(currentDirectory) : '文章页或目录页可用' }}</span>
                </button>

                <button
                  type='button'
                  class='actions-menu-item'
                  role='menuitem'
                  :disabled='!currentDirectory || !!runningAction'
                  @click='copyCurrentDirectoryLink'
                >
                  <span class='actions-menu-title'>复制当前目录链接</span>
                  <span class='actions-menu-desc'>{{ currentDirectory ? '把当前目录的分享链接复制到剪贴板' : '文章页或目录页可用' }}</span>
                </button>

                <div class='actions-menu-divider'></div>
                <div class='actions-menu-section-label'>更多操作</div>

                <button type='button' class='actions-menu-item' role='menuitem' :disabled='!!runningAction' @click='openExportModal'>
                  <span class='actions-menu-title'>导出资料</span>
                  <span class='actions-menu-desc'>选择单篇文档或整个目录下载</span>
                </button>
              </div>
            </Transition>
          </div>

          <button class='close-btn' @click="emit('close')" v-if='isMobile' aria-label='关闭侧边栏'>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>
      </div>

      <div class='sidebar-body'>
        <FileTree :tree='notesTree' :wrap-labels='shouldWrapLabels' @select='handleSelect' />
      </div>
    </div>
  </aside>

  <SidebarExportModal v-model='showExportModal' :tree='notesTree' />

  <Teleport to='body'>
    <Transition name='sidebar-toast'>
      <div v-if='sidebarToast.visible' class='sidebar-toast' :class="`is-${sidebarToast.type}`">
        {{ sidebarToast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FileTree from './FileTree.vue'
import SidebarExportModal from './SidebarExportModal.vue'
import {
  encodePathSegments,
  exportDirectoryArchive,
  exportNoteSource,
  flattenExportDirectories,
  flattenExportNotes
} from '@/utils/noteExport'
import { loadNotesIndex } from '@/utils/indexData'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle-expand'])

const route = useRoute()
const notesTree = ref([])
const isMobile = ref(false)
const showActionsMenu = ref(false)
const showExportModal = ref(false)
const actionsRef = ref(null)
const runningAction = ref('')
const sidebarToast = ref({
  visible: false,
  message: '',
  type: 'success'
})

let resizeHandler = null
let pointerDownHandler = null
let keydownHandler = null
let sidebarToastTimer = null

const allNotes = computed(() => flattenExportNotes(notesTree.value))
const allDirectories = computed(() => flattenExportDirectories(notesTree.value))
const shouldWrapLabels = computed(() => props.expanded)

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
  return allNotes.value.find((item) => item.path === currentNotePath.value) || null
})

const currentDirectory = computed(() => {
  return allDirectories.value.find((item) => item.path === currentDirectoryPath.value) || null
})

const handleSelect = () => {
  if (isMobile.value) {
    emit('close')
  }
}

const toggleActionsMenu = () => {
  showActionsMenu.value = !showActionsMenu.value
}

const closeActionsMenu = () => {
  showActionsMenu.value = false
}

const openExportModal = () => {
  showActionsMenu.value = false
  showExportModal.value = true
}

const showSidebarToast = (message, type = 'success') => {
  sidebarToast.value = {
    visible: true,
    message,
    type
  }

  if (sidebarToastTimer) {
    clearTimeout(sidebarToastTimer)
  }

  sidebarToastTimer = setTimeout(() => {
    sidebarToast.value.visible = false
  }, 2600)
}

const getDirectoryActionDesc = (directory) => {
  const noteCount = directory?.noteCount || 0
  const attachmentCount = directory?.attachmentCount || 0
  return `${directory.path} · ${noteCount} 篇文档${attachmentCount > 0 ? ` · ${attachmentCount} 个附件` : ''}`
}

const buildCurrentDirectoryUrl = (directoryPath) => {
  const origin = window.location.origin
  return `${origin}${import.meta.env.BASE_URL}#/category/${encodePathSegments(directoryPath)}`
}

const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch {
    return false
  }
}

const quickExportCurrentNote = async () => {
  if (!currentNote.value || runningAction.value) {
    return
  }

  closeActionsMenu()
  runningAction.value = 'current-note'

  try {
    const filename = await exportNoteSource(currentNote.value, {
      baseUrl: import.meta.env.BASE_URL
    })
    showSidebarToast(`已开始下载 ${filename}`, 'success')
  } catch (error) {
    console.error('导出当前文章失败:', error)
    showSidebarToast(error?.message || '导出当前文章失败，请稍后重试', 'error')
  } finally {
    runningAction.value = ''
  }
}

const quickExportCurrentDirectory = async () => {
  if (!currentDirectory.value || runningAction.value) {
    return
  }

  closeActionsMenu()
  runningAction.value = 'current-directory'

  try {
    const result = await exportDirectoryArchive(currentDirectory.value, {
      baseUrl: import.meta.env.BASE_URL
    })
    showSidebarToast(`已开始下载 ${result.filename}`, 'success')
  } catch (error) {
    console.error('导出当前目录失败:', error)
    showSidebarToast(error?.message || '导出当前目录失败，请稍后重试', 'error')
  } finally {
    runningAction.value = ''
  }
}

const copyCurrentDirectoryLink = async () => {
  if (!currentDirectory.value || runningAction.value) {
    return
  }

  closeActionsMenu()
  runningAction.value = 'copy-directory-link'

  const copied = await copyText(buildCurrentDirectoryUrl(currentDirectory.value.path))
  if (copied) {
    showSidebarToast('当前目录链接已复制', 'success')
  } else {
    showSidebarToast('复制失败，请稍后重试', 'error')
  }

  runningAction.value = ''
}

onMounted(async () => {
  isMobile.value = window.innerWidth < 768

  resizeHandler = () => {
    isMobile.value = window.innerWidth < 768
  }

  pointerDownHandler = (event) => {
    if (!showActionsMenu.value) {
      return
    }

    if (actionsRef.value?.contains(event.target)) {
      return
    }

    closeActionsMenu()
  }

  keydownHandler = (event) => {
    if (event.key === 'Escape') {
      closeActionsMenu()
    }
  }

  window.addEventListener('resize', resizeHandler)
  document.addEventListener('pointerdown', pointerDownHandler)
  window.addEventListener('keydown', keydownHandler)

  try {
    const data = await loadNotesIndex()
    notesTree.value = data.tree || []
  } catch (error) {
    console.error('加载笔记索引失败:', error)
    notesTree.value = []
  }
})

watch(
  () => route.fullPath,
  () => {
    closeActionsMenu()
  }
)

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  if (pointerDownHandler) {
    document.removeEventListener('pointerdown', pointerDownHandler)
  }

  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler)
  }

  if (sidebarToastTimer) {
    clearTimeout(sidebarToastTimer)
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
  position: relative;
  transition: margin-left 0.25s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
}

.app-sidebar.has-wrap-labels {
  box-shadow: 8px 0 28px rgba(15, 23, 42, 0.06);
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

.sidebar-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-actions {
  position: relative;
}

.width-toggle-btn,
.actions-btn,
.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-secondary);
}

.width-toggle-btn {
  gap: 6px;
  padding: 0 12px;
  border-color: rgba(var(--primary-color-rgb), 0.12);
  background:
    linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08), rgba(var(--primary-color-rgb), 0.03));
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.width-toggle-btn.active {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.24);
  background:
    linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.12), rgba(var(--primary-color-rgb), 0.06));
}

.actions-btn,
.close-btn {
  width: 36px;
}

.actions-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.width-toggle-btn:hover,
.actions-btn:not(:disabled):hover,
.close-btn:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.2);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.actions-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 248px;
  padding: 8px;
  border-radius: 16px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background: var(--bg-primary);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
  z-index: 200;
}

.actions-menu-section-label {
  padding: 8px 10px 6px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.actions-menu-divider {
  height: 1px;
  margin: 8px 4px;
  background: rgba(var(--primary-color-rgb), 0.1);
}

.actions-menu-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  text-align: left;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.actions-menu-item:hover {
  background: rgba(var(--primary-color-rgb), 0.06);
  border-color: rgba(var(--primary-color-rgb), 0.14);
}

.actions-menu-item:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.actions-menu-item:disabled:hover {
  background: transparent;
  border-color: transparent;
}

.actions-menu-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.actions-menu-desc {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
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

.actions-popover-enter-active,
.actions-popover-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.actions-popover-enter-from,
.actions-popover-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.sidebar-toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 10002;
  min-width: 220px;
  max-width: min(360px, calc(100vw - 32px));
  padding: 12px 16px;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
  line-height: 1.6;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
}

.sidebar-toast.is-success {
  background: linear-gradient(135deg, #0f766e, #0d9488);
}

.sidebar-toast.is-error {
  background: linear-gradient(135deg, #b91c1c, #dc2626);
}

.sidebar-toast-enter-active,
.sidebar-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sidebar-toast-enter-from,
.sidebar-toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: var(--mobile-header-offset, 68px);
    bottom: 12px;
    z-index: 99;
    --sidebar-mobile-width: min(86vw, 320px);
    width: var(--sidebar-mobile-width);
    margin-left: 0;
    transform: translateX(calc(-100% - 18px));
    border-right: none;
    border-radius: 0 22px 22px 0;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(253, 253, 251, 0.98)),
      var(--bg-primary);
    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.22);
    transition: transform 0.26s ease, box-shadow 0.2s ease;
  }

  .app-sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .app-sidebar:not(.sidebar-visible) {
    box-shadow: none;
  }

  .dark-theme .app-sidebar {
    background:
      linear-gradient(180deg, rgba(15, 23, 37, 0.98), rgba(15, 23, 37, 0.95)),
      var(--bg-primary);
    box-shadow: 0 22px 52px rgba(2, 6, 23, 0.42);
  }

  .sidebar-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 14px 14px 12px;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .sidebar-header h3 {
    font-size: 15px;
  }

  .sidebar-header-actions {
    gap: 6px;
  }

  .width-toggle-btn {
    padding: 0 10px;
    font-size: 12px;
  }

  .sidebar-body {
    padding: 8px 10px 18px;
  }

  .sidebar-overlay {
    position: fixed;
    top: var(--mobile-header-offset, 68px);
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.46), rgba(15, 23, 42, 0.3));
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 98;
  }

  .actions-menu {
    width: min(248px, calc(100vw - 32px));
  }

  .sidebar-toast {
    left: 12px;
    right: 12px;
    bottom: 12px;
    max-width: none;
  }
}
</style>
