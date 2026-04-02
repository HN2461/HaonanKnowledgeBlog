<template>
  <div class="notification-center">
    <button
      class="notification-trigger"
      type="button"
      aria-label="消息通知"
      :aria-expanded="String(isDrawerOpen)"
      @click="toggleDrawer"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"></path>
        <path d="M9 17a3 3 0 0 0 6 0"></path>
      </svg>
      <span class="notification-badge" v-if="badgeCount > 0">{{ badgeCount }}</span>
    </button>

    <Teleport to="body">
      <Transition name="notification-layer">
        <div v-if="isDrawerOpen" class="notification-layer">
          <button class="notification-backdrop" type="button" aria-label="关闭消息抽屉" @click="closeDrawer"></button>

          <aside class="notification-drawer" aria-label="消息通知抽屉">
            <div class="drawer-head">
              <div class="drawer-head-copy">
                <span class="drawer-kicker">消息通知</span>
                <h2 class="drawer-title">最近动态</h2>
                <p class="drawer-subtitle">展示 Git 提交记录，也支持手动补充公告消息。</p>
              </div>

              <button class="drawer-close" type="button" aria-label="关闭消息抽屉" @click="closeDrawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="drawer-meta">
              <span class="drawer-meta-chip">{{ notifications.length }} 条消息</span>
              <span class="drawer-meta-time" v-if="generatedAtLabel">生成于 {{ generatedAtLabel }}</span>
            </div>

            <div class="drawer-filters" v-if="categoryTabs.length > 1">
              <button
                v-for="tab in categoryTabs"
                :key="tab.value"
                type="button"
                class="drawer-filter-chip"
                :class="{ active: activeCategory === tab.value }"
                @click="activeCategory = tab.value"
              >
                <span>{{ tab.label }}</span>
                <span class="drawer-filter-count">{{ tab.count }}</span>
              </button>
            </div>

            <div class="drawer-content" v-if="loading">
              <div class="drawer-empty">
                <strong>正在加载消息</strong>
                <span>稍等一下，正在读取提交记录与手动消息。</span>
              </div>
            </div>

            <div class="drawer-content" v-else-if="errorMessage">
              <div class="drawer-empty is-error">
                <strong>消息加载失败</strong>
                <span>{{ errorMessage }}</span>
                <button type="button" class="drawer-retry" @click="loadNotifications">重新加载</button>
              </div>
            </div>

            <div class="drawer-content" v-else-if="notifications.length === 0">
              <div class="drawer-empty">
                <strong>暂时还没有消息</strong>
                <span>可以先在 `data/manualNotifications.js` 里手动补一条公告。</span>
              </div>
            </div>

            <div class="drawer-content" v-else-if="filteredNotifications.length === 0">
              <div class="drawer-empty">
                <strong>当前分类暂无消息</strong>
                <span>切换其他分类，或稍后再来看新的动态。</span>
              </div>
            </div>

            <div class="drawer-content" v-else>
              <button
                v-for="item in filteredNotifications"
                :key="item.id"
                type="button"
                class="notification-item"
                :class="{ 'is-pinned': item.pinned }"
                @click="openDetail(item)"
              >
                <div class="notification-item-topline">
                  <span class="notification-item-tag">{{ item.tag }}</span>
                  <span class="notification-item-meta">{{ formatNotificationMeta(item) }}</span>
                </div>
                <strong class="notification-item-title">{{ item.title }}</strong>
                <p class="notification-item-summary">{{ item.summary }}</p>
              </button>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <BaseModal
      :model-value="!!activeNotification"
      @update:modelValue="handleDetailVisible"
      modal-class="notification-detail-shell"
      content-class="notification-detail-panel"
    >
      <article v-if="activeNotification" class="notification-detail">
        <div class="notification-detail-head">
          <div class="notification-detail-kicker-row">
            <span class="notification-detail-tag">{{ activeNotification.tag }}</span>
            <span class="notification-detail-meta">{{ formatNotificationMeta(activeNotification) }}</span>
          </div>
          <h3 class="notification-detail-title">{{ activeNotification.title }}</h3>
        </div>

        <div class="notification-detail-body">
          <p v-for="(paragraph, index) in detailParagraphs" :key="`${activeNotification.id}-${index}`">
            {{ paragraph }}
          </p>
        </div>

        <div class="notification-detail-footer" v-if="activeNotification.source === 'git' && activeNotification.fullHash">
          <span>Git Commit</span>
          <code>{{ activeNotification.fullHash }}</code>
        </div>
      </article>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import {
  BUSINESS_NOTIFICATION_CATEGORIES,
  GIT_NOTIFICATION_CATEGORY,
  formatNotificationDate,
  formatNotificationMeta,
  normalizeNotificationsPayload
} from '@/utils/notifications'

const route = useRoute()
const isDrawerOpen = ref(false)
const notifications = ref([])
const generatedAt = ref('')
const loading = ref(false)
const errorMessage = ref('')
const activeNotification = ref(null)
const activeCategory = ref('all')

const badgeCount = computed(() => {
  return notifications.value.length > 9 ? '9+' : (notifications.value.length || '')
})

const generatedAtLabel = computed(() => {
  return generatedAt.value ? formatNotificationDate(generatedAt.value) : ''
})

const categoryTabs = computed(() => {
  const counts = new Map()

  notifications.value.forEach((item) => {
    const key = item.category || item.tag
    if (!key) {
      return
    }

    counts.set(key, (counts.get(key) || 0) + 1)
  })

  const orderedCategories = [
    ...BUSINESS_NOTIFICATION_CATEGORIES,
    GIT_NOTIFICATION_CATEGORY
  ].filter((category) => counts.has(category))

  return [
    {
      value: 'all',
      label: '全部',
      count: notifications.value.length
    },
    ...orderedCategories.map((category) => ({
      value: category,
      label: category,
      count: counts.get(category) || 0
    }))
  ]
})

const filteredNotifications = computed(() => {
  if (activeCategory.value === 'all') {
    return notifications.value
  }

  return notifications.value.filter((item) => {
    return (item.category || item.tag) === activeCategory.value
  })
})

const detailParagraphs = computed(() => {
  if (!activeNotification.value) {
    return []
  }

  return String(activeNotification.value.content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
})

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const toggleDrawer = async () => {
  if (isDrawerOpen.value) {
    closeDrawer()
    return
  }

  isDrawerOpen.value = true
  if (notifications.value.length === 0 && !loading.value) {
    await loadNotifications()
  }
}

const openDetail = (item) => {
  activeNotification.value = item
}

const handleDetailVisible = (visible) => {
  if (!visible) {
    activeNotification.value = null
  }
}

const loadNotifications = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notifications.json`)
    if (!response.ok) {
      throw new Error('通知数据读取失败')
    }

    const payload = await response.json()
    const normalized = normalizeNotificationsPayload(payload)
    notifications.value = normalized.notifications
    generatedAt.value = normalized.generatedAt
  } catch (error) {
    console.error('加载通知失败:', error)
    errorMessage.value = error?.message || '通知加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleKeydown = (event) => {
  if (event.key !== 'Escape') {
    return
  }

  if (activeNotification.value) {
    activeNotification.value = null
    return
  }

  closeDrawer()
}

watch(
  () => route.fullPath,
  () => {
    closeDrawer()
    activeNotification.value = null
  }
)

watch(notifications, () => {
  const hasActiveCategory = categoryTabs.value.some((item) => item.value === activeCategory.value)
  if (!hasActiveCategory) {
    activeCategory.value = 'all'
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  loadNotifications()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.notification-trigger {
  position: relative;
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

.notification-trigger:hover {
  color: var(--primary-color);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.notification-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.notification-layer {
  position: fixed;
  inset: 0;
  z-index: 240;
}

.notification-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(15, 23, 42, 0.28);
}

.notification-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(420px, calc(100vw - 16px));
  height: 100%;
  padding: 22px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 1px solid var(--border-color);
  background: rgba(252, 253, 255, 0.96);
  box-shadow: -18px 0 40px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.dark-theme .notification-drawer {
  background: rgba(15, 23, 37, 0.98);
}

.drawer-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.drawer-kicker {
  display: inline-flex;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.drawer-title {
  margin: 6px 0 0;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.1;
}

.drawer-subtitle {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.drawer-close {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--text-secondary);
}

.drawer-close:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.drawer-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.drawer-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.drawer-filter-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background: rgba(var(--primary-color-rgb), 0.04);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.drawer-filter-chip.active {
  border-color: rgba(var(--primary-color-rgb), 0.3);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

.drawer-filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.12);
  font-size: 11px;
}

.drawer-meta-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.drawer-meta-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.drawer-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
}

.notification-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
  background: linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.05), rgba(var(--primary-color-rgb), 0.02));
  text-align: left;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.notification-item:hover {
  transform: translateX(-2px);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.notification-item.is-pinned {
  border-color: rgba(37, 99, 235, 0.28);
}

.notification-item-topline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-item-tag {
  display: inline-flex;
  align-self: flex-start;
  min-height: 24px;
  padding: 0 10px;
  align-items: center;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 700;
}

.notification-item-meta {
  color: var(--text-tertiary);
  font-size: 11px;
  line-height: 1.5;
}

.notification-item-title {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.5;
}

.notification-item-summary {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.drawer-empty {
  margin: auto 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.18);
  color: var(--text-secondary);
  text-align: center;
}

.drawer-empty strong {
  color: var(--text-primary);
}

.drawer-empty.is-error {
  border-color: rgba(239, 68, 68, 0.24);
}

.drawer-retry {
  align-self: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.18);
  background: var(--bg-primary);
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 700;
}

:global(.modal-content.notification-detail-panel) {
  width: min(640px, calc(100vw - 24px));
  max-width: 640px;
  padding: 0;
  overflow: hidden !important;
}

.notification-detail {
  padding: 26px 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-detail-kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.notification-detail-tag {
  display: inline-flex;
  min-height: 28px;
  padding: 0 12px;
  align-items: center;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.notification-detail-meta {
  color: var(--text-secondary);
  font-size: 12px;
}

.notification-detail-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.35;
}

.notification-detail-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-detail-body p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.notification-detail-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid rgba(var(--primary-color-rgb), 0.1);
  color: var(--text-secondary);
  font-size: 12px;
}

.notification-detail-footer code {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.notification-layer-enter-active,
.notification-layer-leave-active {
  transition: opacity 0.2s ease;
}

.notification-layer-enter-from,
.notification-layer-leave-to {
  opacity: 0;
}

.notification-layer-enter-active .notification-drawer,
.notification-layer-leave-active .notification-drawer {
  transition: transform 0.24s ease;
}

.notification-layer-enter-from .notification-drawer,
.notification-layer-leave-to .notification-drawer {
  transform: translateX(18px);
}

@media (max-width: 768px) {
  .notification-drawer {
    width: 100%;
    padding: 18px 14px 14px;
  }

  .drawer-title {
    font-size: 24px;
  }

  .notification-detail {
    padding: 22px 18px 18px;
  }
}
</style>
