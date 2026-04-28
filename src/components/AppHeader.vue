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
          <span class='logo-mark' aria-hidden='true'>
            <img class='logo-mark-image' :src='siteLogoUrl' alt='' loading='eager' decoding='async'>
          </span>
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
        <span class='search-entry-copy search-entry-copy-desktop'>直接搜索笔记、报错、专题</span>
        <span class='search-entry-copy search-entry-copy-mobile'>搜索笔记、专题、报错</span>
        <span class='search-shortcut'>/</span>
      </button>

      <div class='header-right'>
        <div class='desktop-header-tools'>
          <RandomReadingPlanner />

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
          </div>

          <button class='icon-btn' @click='goToEditor' aria-label='写作台' title='写作台'>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
              <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
            </svg>
          </button>
        </div>

        <NotificationCenter />

        <button class='icon-btn desktop-theme-btn' @click='toggleTheme' aria-label='切换主题' title='切换主题'>
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

        <button
          class='icon-btn mobile-more-btn'
          :class="{ active: isMobileActionsOpen }"
          type='button'
          aria-label='展开更多功能'
          :aria-expanded='String(isMobileActionsOpen)'
          @click='toggleMobileActions'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <circle cx='5' cy='12' r='1.6'></circle>
            <circle cx='12' cy='12' r='1.6'></circle>
            <circle cx='19' cy='12' r='1.6'></circle>
          </svg>
        </button>

        <div class='author-profile-shell' :class="{ 'is-search-loading': searchWarmupStatus === 'loading' }">
          <AuthorProfile />
          <span v-if="searchWarmupStatus === 'loading'" class='author-search-ring' aria-hidden='true'></span>
        </div>
      </div>
    </div>
  </header>

  <Teleport to='body'>
    <div v-if='isCornerOpen' ref='cornerPopoverRef' class='corner-popover'>
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
  </Teleport>

  <Teleport to='body'>
    <Transition name='mobile-actions-layer'>
      <div v-if='isMobileActionsOpen' class='mobile-actions-layer'>
        <button class='mobile-actions-backdrop' type='button' aria-label='关闭更多功能' @click='closeMobileActions'></button>

        <section class='mobile-actions-sheet' aria-label='移动端更多功能'>
          <div class='mobile-actions-sheet-head'>
            <div class='mobile-actions-sheet-copy'>
              <p class='mobile-actions-kicker'>移动端头部</p>
              <h3>更多功能</h3>
              <p>把低频操作收进这里，顶部先留给品牌和搜索。</p>
            </div>

            <button class='mobile-actions-close' type='button' aria-label='关闭更多功能' @click='closeMobileActions'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>

          <div class='mobile-actions-grid'>
            <button class='mobile-action-card' type='button' @click='openCornerFromMobile'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <path d='M12 3v4'></path>
                <path d='M12 17v4'></path>
                <path d='m5.64 5.64 2.83 2.83'></path>
                <path d='m15.53 15.53 2.83 2.83'></path>
                <path d='M3 12h4'></path>
                <path d='M17 12h4'></path>
                <path d='m5.64 18.36 2.83-2.83'></path>
                <path d='m15.53 8.47 2.83-2.83'></path>
              </svg>
              <span class='mobile-action-title'>个人角落</span>
              <span class='mobile-action-desc'>天气、提醒和放松模式都放在这里。</span>
            </button>

            <button class='mobile-action-card' type='button' @click='goToEditor'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
              </svg>
              <span class='mobile-action-title'>写作台</span>
              <span class='mobile-action-desc'>需要记灵感或补笔记时再打开，不占顶栏位置。</span>
            </button>

            <button class='mobile-action-card' type='button' @click='toggleThemeFromMobile'>
              <svg v-if='!isDark' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
              </svg>
              <svg v-else width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
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
              <span class='mobile-action-title'>切换主题</span>
              <span class='mobile-action-desc'>{{ isDark ? '当前是暗色，点一下回到浅色。' : '当前是浅色，点一下切到暗色。' }}</span>
            </button>

            <div class='mobile-action-card mobile-action-card--random'>
              <div class='mobile-action-copy'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M16 3h5v5'></path>
                  <path d='m4 20 17-17'></path>
                  <path d='M21 16v5h-5'></path>
                  <path d='m15 15 6 6'></path>
                  <path d='m4 4 5 5'></path>
                </svg>
                <span class='mobile-action-title'>随机阅读</span>
                <span class='mobile-action-desc'>今天想随手抽一篇时，入口留在这里就够了。</span>
              </div>

              <div class='mobile-random-entry'>
                <RandomReadingPlanner />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>

  <Teleport to='body'>
    <div v-if='isSearchOpen' class='search-layer'>
      <button class='search-backdrop' type='button' aria-label='关闭知识检索' @click='closeSearchPanel'></button>
      <div class='search-dialog'>
        <KnowledgeSearchPanel variant='overlay' auto-focus @close='closeSearchPanel' />
      </div>
    </div>
  </Teleport>

  <Teleport to='body'>
    <Transition name='search-ready-toast'>
      <div v-if='showSearchReadyNotice' class='search-ready-toast'>
        搜索索引已准备完成，现在可以直接全站搜索了
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTheme, toggleTheme as toggle } from '@/utils/theme'
import { siteConfig } from '@/config/site'
import AuthorProfile from './AuthorProfile.vue'
import NotificationCenter from './NotificationCenter.vue'
import RandomReadingPlanner from './RandomReadingPlanner.vue'
import { ensureSearchWarmup, searchWarmupStatus } from '@/utils/searchWarmup'

const KnowledgeSearchPanel = defineAsyncComponent(() => import('./KnowledgeSearchPanel.vue'))
const MotivationalQuote = defineAsyncComponent(() => import('./MotivationalQuote.vue'))
const TimeWeather = defineAsyncComponent(() => import('./TimeWeather.vue'))

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
const isMobileActionsOpen = ref(false)
const cornerRef = ref(null)
const cornerPopoverRef = ref(null)
const siteLogoUrl = `${import.meta.env.BASE_URL}favicon.png`
const showSearchReadyNotice = ref(false)
let searchReadyNoticeTimer = null

const goToEditor = () => {
  closeMobileActions()
  router.push('/editor')
}

const toggleTheme = () => {
  const newTheme = toggle()
  isDark.value = newTheme === 'dark'
}

const openSearchPanel = () => {
  closeCornerPanel()
  closeMobileActions()
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
  closeMobileActions()
  isCornerOpen.value = !isCornerOpen.value
}

const closeCornerPanel = () => {
  isCornerOpen.value = false
}

const toggleMobileActions = () => {
  closeSearchPanel()
  closeCornerPanel()
  isMobileActionsOpen.value = !isMobileActionsOpen.value
}

const closeMobileActions = () => {
  isMobileActionsOpen.value = false
}

const openCornerFromMobile = () => {
  closeMobileActions()
  closeSearchPanel()
  isCornerOpen.value = true
}

const toggleThemeFromMobile = () => {
  toggleTheme()
  closeMobileActions()
}

const handleThemeChange = (event) => {
  isDark.value = event.detail.isDark
}

const handleDocumentPointerDown = (event) => {
  if (!isCornerOpen.value || !cornerRef.value) {
    return
  }

  if (
    !cornerRef.value.contains(event.target) &&
    !cornerPopoverRef.value?.contains(event.target)
  ) {
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
    closeMobileActions()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeSearchPanel()
    closeCornerPanel()
    closeMobileActions()
  }
)

watch(isSearchOpen, (nextValue) => {
  if (nextValue) {
    ensureSearchWarmup()
  }
})

watch(searchWarmupStatus, (nextStatus, prevStatus) => {
  if (nextStatus === 'ready' && prevStatus === 'loading') {
    showSearchReadyNotice.value = true

    if (searchReadyNoticeTimer) {
      clearTimeout(searchReadyNoticeTimer)
    }

    searchReadyNoticeTimer = setTimeout(() => {
      showSearchReadyNotice.value = false
    }, 4000)
  }
})

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

  if (searchReadyNoticeTimer) {
    clearTimeout(searchReadyNoticeTimer)
  }
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

.header-right > * {
  flex-shrink: 0;
}

.desktop-header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
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
.icon-btn.active,
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
  overflow: hidden;
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(var(--primary-color-rgb), 0.14);
}

.logo-mark-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.search-entry-copy-mobile,
.mobile-more-btn {
  display: none;
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
  position: fixed;
  top: 84px;
  right: 24px;
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

.mobile-actions-layer {
  position: fixed;
  inset: 0;
  z-index: 245;
}

.mobile-actions-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(15, 23, 42, 0.36);
}

.mobile-actions-sheet {
  position: absolute;
  right: 14px;
  bottom: 14px;
  left: 14px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(var(--primary-color-rgb), 0.12), transparent 38%),
    var(--bg-primary);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
}

.dark-theme .mobile-actions-sheet {
  background:
    radial-gradient(circle at top right, rgba(var(--primary-color-rgb), 0.16), transparent 38%),
    rgba(15, 23, 37, 0.98);
}

.mobile-actions-sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mobile-actions-sheet-copy h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
}

.mobile-actions-sheet-copy p:last-child {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.mobile-actions-kicker {
  margin: 0 0 6px;
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mobile-actions-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--text-tertiary);
}

.mobile-actions-close:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.mobile-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.mobile-action-card {
  min-height: 120px;
  padding: 14px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.14);
  border-radius: 18px;
  background: rgba(var(--primary-color-rgb), 0.05);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
  transition: border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
}

.mobile-action-card:hover {
  border-color: rgba(var(--primary-color-rgb), 0.24);
  background: rgba(var(--primary-color-rgb), 0.08);
  transform: translateY(-1px);
}

.mobile-action-card svg,
.mobile-action-copy svg {
  color: var(--primary-color);
}

.mobile-action-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.mobile-action-desc {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.mobile-action-card--random {
  grid-column: 1 / -1;
  min-height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mobile-action-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.mobile-random-entry {
  flex-shrink: 0;
}

.mobile-random-entry :deep(.daily-reading-entry) {
  display: flex;
}

.mobile-random-entry :deep(.daily-reading-trigger) {
  width: 44px;
  height: 44px;
}

.mobile-actions-layer-enter-active,
.mobile-actions-layer-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-actions-layer-enter-from,
.mobile-actions-layer-leave-to {
  opacity: 0;
}

.mobile-actions-layer-enter-active .mobile-actions-sheet,
.mobile-actions-layer-leave-active .mobile-actions-sheet {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.mobile-actions-layer-enter-from .mobile-actions-sheet,
.mobile-actions-layer-leave-to .mobile-actions-sheet {
  opacity: 0;
  transform: translateY(16px);
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
    height: auto;
  }

  .header-content {
    height: auto;
    padding: 12px 14px 14px;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'left right'
      'search search';
    gap: 10px 12px;
  }

  .header-left {
    grid-area: left;
    gap: 8px;
  }

  .header-right {
    grid-area: right;
    gap: 8px;
  }

  .desktop-header-tools,
  .desktop-theme-btn,
  .search-entry-copy-desktop,
  .logo-subtitle,
  .corner-btn-label {
    display: none;
  }

  .search-entry-copy-mobile {
    display: block;
  }

  .mobile-more-btn {
    display: inline-flex;
  }

  .search-entry {
    grid-area: search;
    min-width: 0;
    height: 44px;
    justify-content: flex-start;
    padding: 0 14px;
  }

  .search-shortcut {
    display: none;
  }

  .logo {
    gap: 10px;
  }

  .logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 11px;
  }

  .corner-popover {
    top: 126px;
    right: 14px;
    left: 14px;
    width: auto;
  }

  .search-dialog {
    top: 126px;
    width: calc(100vw - 20px);
  }
}

@media (max-width: 560px) {
  .logo-title {
    max-width: 118px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-actions-grid {
    grid-template-columns: 1fr;
  }

  .mobile-action-card,
  .mobile-action-card--random {
    grid-column: auto;
  }

  .mobile-action-card--random {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 420px) {
  .header-content {
    gap: 8px 10px;
  }

  .header-right {
    gap: 6px;
  }

  .logo {
    gap: 8px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .logo-title {
    max-width: 86px;
    font-size: 14px;
  }
}
</style>
<style scoped>
.author-profile-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-search-ring {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid rgba(56, 189, 248, 0.14);
  border-top-color: rgba(14, 165, 233, 0.92);
  border-right-color: rgba(59, 130, 246, 0.56);
  pointer-events: none;
  animation: authorSearchSpin 1s linear infinite;
}

.search-ready-toast-enter-active,
.search-ready-toast-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.search-ready-toast-enter-from,
.search-ready-toast-leave-to {
  opacity: 0;
  transform: translate3d(0, -10px, 0);
}

.search-ready-toast {
  position: fixed;
  top: 86px;
  right: 24px;
  z-index: 2100;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(14px);
}

@keyframes authorSearchSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .search-ready-toast {
    top: 122px;
    right: 16px;
    left: 16px;
    text-align: center;
  }
}
</style>
