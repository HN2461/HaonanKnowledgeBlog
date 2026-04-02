<template>
  <header class='app-header'>
    <div class='header-content'>
      <div class='header-left'>
        <button
          class='menu-btn'
          :class="{ active: sidebarVisible }"
          @click="$emit('toggle-sidebar')"
          aria-label='切换侧边栏'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <line x1='3' y1='12' x2='21' y2='12'></line>
            <line x1='3' y1='6' x2='21' y2='6'></line>
            <line x1='3' y1='18' x2='21' y2='18'></line>
          </svg>
        </button>

        <router-link to='/' class='logo'>
          <span class='logo-mark' aria-hidden='true'>KB</span>
          <span class='logo-copy'>
            <span class='logo-title'>{{ siteConfig.title }}</span>
            <span class='logo-subtitle'>{{ siteConfig.author.title }}</span>
          </span>
        </router-link>
      </div>

      <button
        class='search-entry'
        :class="{ active: isSearchOpen }"
        type='button'
        aria-label='打开知识检索'
        :aria-expanded='String(isSearchOpen)'
        @click='toggleSearchPanel'
      >
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
          <circle cx='11' cy='11' r='8'></circle>
          <path d='m21 21-4.35-4.35'></path>
        </svg>
        <span class='search-entry-copy'>直接搜索笔记、报错、专题</span>
        <span class='search-shortcut'>/</span>
      </button>

      <div class='header-right'>
        <div class='corner-entry' ref='cornerRef'>
          <button
            class='corner-btn'
            :class="{ active: isCornerOpen }"
            type='button'
            aria-label='展开个人角落'
            :aria-expanded='String(isCornerOpen)'
            @click='toggleCornerPanel'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <path d='M12 3v4'></path>
              <path d='M12 17v4'></path>
              <path d='m5.64 5.64 2.83 2.83'></path>
              <path d='m15.53 15.53 2.83 2.83'></path>
              <path d='M3 12h4'></path>
              <path d='M17 12h4'></path>
              <path d='m5.64 18.36 2.83-2.83'></path>
              <path d='m15.53 8.47 2.83-2.83'></path>
            </svg>
            <span class='corner-btn-label'>角落</span>
          </button>

          <div v-if='isCornerOpen' class='corner-popover'>
            <div class='corner-popover-head'>
              <h3>天气与提醒</h3>
              <button class='corner-close' type='button' aria-label='收起个人角落' @click='closeCornerPanel'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
              </button>
            </div>

            <div class='corner-popover-body'>
              <TimeWeather />
              <MotivationalQuote />
              <router-link to='/relaxation' class='corner-link' @click='closeCornerPanel'>进入放松模式</router-link>
            </div>
          </div>
        </div>

        <button class='icon-btn' @click='goToEditor' aria-label='写作台' title='写作台'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
            <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
          </svg>
        </button>

        <button class='icon-btn' @click='toggleAIAssistant' aria-label='AI 助手' title='AI 助手'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <rect x='5' y='5' width='14' height='14' rx='3'></rect>
            <path d='M9 10h6'></path>
            <path d='M9 14h4'></path>
          </svg>
        </button>

        <NotificationCenter />

        <button class='icon-btn' @click='toggleTheme' aria-label='切换主题' title='切换主题'>
          <svg v-if='!isDark' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
          </svg>
          <svg v-else width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <circle cx='12' cy='12' r='5'></circle>
            <line x1='12' y1='1' x2='12' y2='3'></line>
            <line x1='12' y1='21' x2='12' y2='23'></line>
            <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
            <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
            <line x1='1' y1='12' x2='3' y2='12'></line>
            <line x1='21' y1='12' x2='23' y2='12'></line>
            <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
            <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
          </svg>
        </button>

        <AuthorProfile />
      </div>
    </div>
  </header>

  <Teleport to='body'>
    <div v-if='isSearchOpen' class='search-layer'>
      <button class='search-backdrop' type='button' aria-label='关闭知识检索' @click='closeSearchPanel'></button>
      <div class='search-dialog'>
        <KnowledgeSearchPanel variant='overlay' auto-focus @close='closeSearchPanel' />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTheme, toggleTheme as toggle } from '@/utils/theme'
import { siteConfig } from '@/config/site'
import AuthorProfile from './AuthorProfile.vue'
import KnowledgeSearchPanel from './KnowledgeSearchPanel.vue'
import MotivationalQuote from './MotivationalQuote.vue'
import NotificationCenter from './NotificationCenter.vue'
import TimeWeather from './TimeWeather.vue'

defineProps({
  sidebarVisible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const isDark = ref(false)
const isSearchOpen = ref(false)
const isCornerOpen = ref(false)
const cornerRef = ref(null)

const goToEditor = () => {
  router.push('/editor')
}

const toggleAIAssistant = () => {
  window.dispatchEvent(new CustomEvent('ai-assistant:toggle'))
}

const toggleTheme = () => {
  const newTheme = toggle()
  isDark.value = newTheme === 'dark'
}

const openSearchPanel = () => {
  closeCornerPanel()
  isSearchOpen.value = true
}

const toggleSearchPanel = () => {
  if (isSearchOpen.value) {
    closeSearchPanel()
    return
  }

  openSearchPanel()
}

const closeSearchPanel = () => {
  isSearchOpen.value = false
}

const toggleCornerPanel = () => {
  closeSearchPanel()
  isCornerOpen.value = !isCornerOpen.value
}

const closeCornerPanel = () => {
  isCornerOpen.value = false
}

const handleThemeChange = (event) => {
  isDark.value = event.detail.isDark
}

const handleDocumentPointerDown = (event) => {
  if (!isCornerOpen.value || !cornerRef.value) {
    return
  }

  if (!cornerRef.value.contains(event.target)) {
    closeCornerPanel()
  }
}

const handleDocumentKeydown = (event) => {
  const isTypingTarget = event.target instanceof HTMLElement && (
    event.target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
  )

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearchPanel()
    return
  }

  if (!isTypingTarget && event.key === '/') {
    event.preventDefault()
    openSearchPanel()
    return
  }

  if (event.key === 'Escape') {
    closeSearchPanel()
    closeCornerPanel()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeSearchPanel()
    closeCornerPanel()
  }
)

onMounted(() => {
  isDark.value = getTheme() === 'dark'
  window.addEventListener('theme-change', handleThemeChange)
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onUnmounted(() => {
  window.removeEventListener('theme-change', handleThemeChange)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 72px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(252, 253, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.dark-theme .app-header {
  background: rgba(15, 23, 37, 0.92);
}

.header-content {
  height: 100%;
  padding: 0 20px;
  display: grid;
  grid-template-columns: auto minmax(0, 420px) auto;
  align-items: center;
  gap: 18px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.header-right {
  justify-content: flex-end;
}

.menu-btn,
.icon-btn,
.corner-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text-secondary);
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.menu-btn:hover,
.icon-btn:hover,
.corner-btn:hover,
.corner-btn.active,
.menu-btn.active {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: var(--text-primary);
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--primary-color);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.logo-title {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.logo-subtitle {
  color: var(--text-tertiary);
  font-size: 11px;
  white-space: nowrap;
}

.search-entry {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.search-entry-copy {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.search-shortcut {
  flex-shrink: 0;
  padding: 2px 7px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.16);
  border-radius: 999px;
  color: var(--text-tertiary);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.3;
}

.dark-theme .search-entry {
  background: rgba(11, 19, 32, 0.9);
}

.search-entry:hover,
.search-entry.active {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.28);
  background: rgba(var(--primary-color-rgb), 0.04);
}

.search-entry:hover .search-shortcut,
.search-entry.active .search-shortcut {
  border-color: rgba(var(--primary-color-rgb), 0.22);
  color: var(--primary-color);
}

.corner-entry {
  position: relative;
}

.corner-btn {
  width: auto;
  padding: 0 12px;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.corner-btn-label {
  white-space: nowrap;
}

.corner-popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(320px, calc(100vw - 24px));
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-primary);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
}

.dark-theme .corner-popover {
  background: rgba(15, 23, 37, 0.98);
}

.corner-popover-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.corner-popover-head h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
}

.corner-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--text-tertiary);
}

.corner-close:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.corner-popover-body {
  display: grid;
  gap: 14px;
  padding-top: 12px;
}

.corner-link {
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 700;
}

.search-layer {
  position: fixed;
  inset: 0;
  z-index: 220;
}

.search-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(15, 23, 42, 0.26);
}

.search-dialog {
  position: absolute;
  top: 86px;
  left: 50%;
  width: min(920px, calc(100vw - 32px));
  transform: translateX(-50%);
}

@media (max-width: 1120px) {
  .header-content {
    grid-template-columns: auto 1fr auto;
  }

  .search-entry-copy {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 68px;
  }

  .header-content {
    padding: 0 14px;
    gap: 10px;
  }

  .logo-subtitle,
  .search-entry-copy,
  .corner-btn-label {
    display: none;
  }

  .search-entry {
    width: 42px;
    justify-content: center;
    padding: 0;
  }

  .search-shortcut {
    display: none;
  }

  .corner-btn {
    width: 40px;
    padding: 0;
  }

  .corner-popover {
    position: fixed;
    top: 78px;
    right: 14px;
    left: 14px;
    width: auto;
  }

  .search-dialog {
    top: 78px;
    width: calc(100vw - 20px);
  }
}

@media (max-width: 560px) {
  .logo-title {
    max-width: 132px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
