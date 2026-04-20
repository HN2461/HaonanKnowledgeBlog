<template>
  <div class="notification-center">
    <button class="notification-trigger" type="button" aria-label="消息通知" :aria-expanded="String(isDrawerOpen)"
      @click="toggleDrawer">
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
              <button v-for="tab in categoryTabs" :key="tab.value" type="button" class="drawer-filter-chip"
                :class="[
                  tab.value === 'all' ? 'drawer-filter-chip--all' : 'drawer-filter-chip--' + getCategoryClass(tab.value),
                  { active: activeCategory === tab.value }
                ]"
                @click="activeCategory = tab.value">
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

            <!-- 历史消息：时间轴视图 -->
            <div class="drawer-content" v-else-if="activeCategory === '历史消息'">
              <div class="history-timeline" v-if="historyGroups.length > 0">
                <!-- 左侧日期条 -->
                <nav class="timeline-dates" aria-label="历史日期">
                  <button
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeHistoryDate === null }"
                    @click="activeHistoryDate = null"
                  >
                    <span class="tdb-label">全部</span>
                    <span class="tdb-count">{{ historyGroups.reduce((s, g) => s + g.items.length, 0) }}</span>
                  </button>
                  <button
                    v-for="group in historyGroups"
                    :key="group.date"
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeHistoryDate === group.date }"
                    @click="activeHistoryDate = group.date"
                  >
                    <span class="tdb-label">{{ group.date.slice(5).replace('-', '/') }}</span>
                    <span class="tdb-count">{{ group.items.length }}</span>
                  </button>
                </nav>

                <!-- 右侧消息列表 -->
                <div class="timeline-entries">
                  <div
                    v-for="group in historyTimelineItems"
                    :key="group.date"
                    class="timeline-group"
                  >
                    <div class="timeline-group-header">
                      <span class="tgh-date">{{ group.date }}</span>
                      <span class="tgh-count">{{ group.items.length }} 条</span>
                    </div>
                    <div
                      v-for="(entry, idx) in group.items"
                      :key="`${group.date}-${idx}`"
                      class="timeline-entry te-clickable"
                      role="button"
                      tabindex="0"
                      @click="openHistoryDetail(entry)"
                      @keydown.enter="openHistoryDetail(entry)"
                      @keydown.space.prevent="openHistoryDetail(entry)"
                    >
                      <div class="te-dot-wrap">
                        <span class="te-dot" :class="getCategoryClass(entry.itemCategory)"></span>
                        <span v-if="idx < group.items.length - 1" class="te-line"></span>
                      </div>
                      <div class="te-body">
                        <div class="te-meta">
                          <span class="te-cat" :class="getCategoryClass(entry.itemCategory)">{{ entry.itemCategory }}</span>
                          <span class="te-time" v-if="entry.time">{{ entry.time }}</span>
                        </div>
                        <p class="te-title">{{ entry.title }}</p>
                        <p class="te-summary" v-if="entry.summary && entry.summary !== entry.title">{{ entry.summary }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="drawer-empty" v-else>
                <strong>暂无历史消息</strong>
                <span>每次清空当日摘要时，会自动归档到历史消息。</span>
              </div>
            </div>

            <!-- 全部消息：时间轴视图（与历史消息风格统一） -->
            <div class="drawer-content" v-else-if="activeCategory === 'all'">
              <div class="history-timeline">
                <!-- 左侧日期条 -->
                <nav class="timeline-dates" aria-label="消息日期">
                  <button
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeAllDate === null }"
                    @click="activeAllDate = null"
                  >
                    <span class="tdb-label">全部</span>
                    <span class="tdb-count">{{ filteredNotifications.length }}</span>
                  </button>
                  <button
                    v-for="dateKey in allDateKeys"
                    :key="dateKey"
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeAllDate === dateKey }"
                    @click="activeAllDate = dateKey"
                  >
                    <span class="tdb-label">{{ dateKey.slice(5).replace('-', '/') }}</span>
                    <span class="tdb-count">{{ allDateGroups[dateKey].length }}</span>
                  </button>
                </nav>

                <!-- 右侧时间轴列表 -->
                <div class="timeline-entries">
                  <div
                    v-for="dateKey in visibleAllDateKeys"
                    :key="dateKey"
                    class="timeline-group"
                  >
                    <div class="timeline-group-header">
                      <span class="tgh-date">{{ dateKey }}</span>
                      <span class="tgh-count">{{ allDateGroups[dateKey].length }} 条</span>
                    </div>
                    <button
                      v-for="(item, idx) in allDateGroups[dateKey]"
                      :key="item.id"
                      type="button"
                      class="timeline-entry te-clickable"
                      @click="openDetail(item)"
                    >
                      <div class="te-dot-wrap">
                        <span class="te-dot" :class="getCategoryClass(getItemDisplayCategory(item))"></span>
                        <span v-if="idx < allDateGroups[dateKey].length - 1" class="te-line"></span>
                      </div>
                      <div class="te-body">
                        <div class="te-meta">
                          <span class="te-cat" :class="getCategoryClass(getItemDisplayCategory(item))">{{ getItemDisplayCategory(item) }}</span>
                          <span class="te-time" v-if="getItemTime(item)">{{ getItemTime(item) }}</span>
                          <span class="te-hash-inline" v-if="item.source === 'git' && item.shortHash">#{{ item.shortHash }}</span>
                        </div>
                        <p class="te-title">{{ item.title }}</p>
                        <p class="te-summary" v-if="item.summary && item.summary !== item.title">{{ item.summary }}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 其他分类：时间轴视图 -->
            <div class="drawer-content" v-else>
              <div class="history-timeline">
                <!-- 左侧日期条 -->
                <nav class="timeline-dates" aria-label="消息日期">
                  <button
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeFilteredDate === null }"
                    @click="activeFilteredDate = null"
                  >
                    <span class="tdb-label">全部</span>
                    <span class="tdb-count">{{ filteredNotifications.length }}</span>
                  </button>
                  <button
                    v-for="dateKey in filteredDateKeys"
                    :key="dateKey"
                    type="button"
                    class="timeline-date-btn"
                    :class="{ active: activeFilteredDate === dateKey }"
                    @click="activeFilteredDate = dateKey"
                  >
                    <span class="tdb-label">{{ dateKey.slice(5).replace('-', '/') }}</span>
                    <span class="tdb-count">{{ filteredDateGroups[dateKey].length }}</span>
                  </button>
                </nav>

                <!-- 右侧时间轴 -->
                <div class="timeline-entries">
                  <div
                    v-for="dateKey in visibleFilteredDateKeys"
                    :key="dateKey"
                    class="timeline-group"
                  >
                    <div class="timeline-group-header">
                      <span class="tgh-date">{{ dateKey }}</span>
                      <span class="tgh-count">{{ filteredDateGroups[dateKey].length }} 条</span>
                    </div>
                    <button
                      v-for="(item, idx) in filteredDateGroups[dateKey]"
                      :key="item.id"
                      type="button"
                      class="timeline-entry te-clickable"
                      @click="openDetail(item)"
                    >
                      <div class="te-dot-wrap">
                        <span class="te-dot" :class="getCategoryClass(getItemDisplayCategory(item))"></span>
                        <span v-if="idx < filteredDateGroups[dateKey].length - 1" class="te-line"></span>
                      </div>
                      <div class="te-body">
                        <div class="te-meta">
                          <span class="te-cat" :class="getCategoryClass(getItemDisplayCategory(item))">{{ getItemDisplayCategory(item) }}</span>
                          <span class="te-time" v-if="getItemTime(item)">{{ getItemTime(item) }}</span>
                          <span class="te-hash-inline" v-if="item.source === 'git' && item.shortHash">#{{ item.shortHash }}</span>
                        </div>
                        <p class="te-title">{{ item.title }}</p>
                        <p class="te-summary" v-if="item.summary && item.summary !== item.title">{{ item.summary }}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <BaseModal :model-value="!!activeNotification" @update:modelValue="handleDetailVisible"
      modal-class="notification-detail-shell" content-class="notification-detail-panel">
      <article v-if="activeNotification" class="notification-detail">
        <div class="notification-detail-head">
          <div class="notification-detail-kicker-row">
            <span class="notification-detail-tag" :class="getCategoryClass(activeNotification.category || activeNotification.tag)">{{ activeNotification.tag }}</span>
            <span class="notification-detail-meta">{{ formatNotificationMeta(activeNotification) }}</span>
          </div>
          <h3 class="notification-detail-title">{{ activeNotification.title }}</h3>
        </div>

        <div class="notification-detail-body">
          <p v-for="(paragraph, index) in detailParagraphs" :key="`${activeNotification.id}-${index}`">
            {{ paragraph }}
          </p>
        </div>

        <div class="notification-detail-footer"
          v-if="activeNotification.source === 'git' && activeNotification.fullHash">
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
const historyGroups = ref([])
const generatedAt = ref('')
const loading = ref(false)
const errorMessage = ref('')
const activeNotification = ref(null)
const activeCategory = ref('all')
// 时间轴视图：当前选中的日期（null = 全部）
const activeHistoryDate = ref(null)
// 全部消息视图：当前选中的日期（null = 全部）
const activeAllDate = ref(null)

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

// 历史消息时间轴：当前选中日期下的条目
const historyTimelineItems = computed(() => {
  if (!activeHistoryDate.value) {
    return historyGroups.value
  }
  return historyGroups.value.filter((g) => g.date === activeHistoryDate.value)
})

// 全部消息：按日期分组
const allDateGroups = computed(() => {
  const groups = {}
  notifications.value.forEach((item) => {
    // 取日期部分 YYYY-MM-DD
    const d = item.date ? item.date.slice(0, 10) : '未知日期'
    if (!groups[d]) groups[d] = []
    groups[d].push(item)
  })
  return groups
})

const allDateKeys = computed(() => {
  return Object.keys(allDateGroups.value).sort((a, b) => b.localeCompare(a))
})

const visibleAllDateKeys = computed(() => {
  if (!activeAllDate.value) return allDateKeys.value
  return allDateKeys.value.filter((d) => d === activeAllDate.value)
})

// 其他分类（非 all/历史消息）：按日期分组
const activeFilteredDate = ref(null)

const filteredDateGroups = computed(() => {
  const groups = {}
  filteredNotifications.value.forEach((item) => {
    const d = item.date ? item.date.slice(0, 10) : '未知日期'
    if (!groups[d]) groups[d] = []
    groups[d].push(item)
  })
  return groups
})

const filteredDateKeys = computed(() => {
  return Object.keys(filteredDateGroups.value).sort((a, b) => b.localeCompare(a))
})

const visibleFilteredDateKeys = computed(() => {
  if (!activeFilteredDate.value) return filteredDateKeys.value
  return filteredDateKeys.value.filter((d) => d === activeFilteredDate.value)
})

// 分类颜色映射
const CATEGORY_COLOR = {
  '内容上新': 'cat-new',
  '功能更新': 'cat-feature',
  '问题修复': 'cat-fix',
  '系统公告': 'cat-announce',
  '历史消息': 'cat-history',
  'Git 提交': 'cat-git'
}

function getCategoryClass(cat) {
  return CATEGORY_COLOR[cat] || 'cat-history'
}

// 获取条目的真实展示分类（历史消息条目用 itemCategory，其他用 category/tag）
function getItemDisplayCategory(item) {
  if (item.source === 'history' && item.itemCategory) return item.itemCategory
  return item.category || item.tag || '历史消息'
}

// 从 date 字段提取时间部分 HH:mm
function getItemTime(item) {
  if (!item.date) return ''
  // 格式如 2026-04-19T17:55:00+08:00
  const match = item.date.match(/T(\d{2}:\d{2})/)
  return match ? match[1] : ''
}

// 历史消息时间轴条目点击弹框（构造一个临时 notification 对象）
function openHistoryDetail(entry) {
  activeNotification.value = {
    id: `history-detail-${entry.title}`,
    title: entry.title,
    summary: entry.summary || entry.title,
    content: entry.summary || entry.title,
    tag: entry.itemCategory || '历史消息',
    category: entry.itemCategory || '历史消息',
    date: entry.time ? `${entry.time}` : '',
    source: 'history',
    pinned: false,
    shortHash: '',
    fullHash: ''
  }
}

const detailParagraphs = computed(() => {
  if (!activeNotification.value) {
    return []
  }

  // 分割策略：
  // 1. 先按换行符分段
  // 2. 再按全角分号「；」拆分条目
  // 3. 对含「内容包含：」的前缀行，把前缀单独作为一条，后续条目再拆分
  return String(activeNotification.value.content || '')
    .split('\n')
    .flatMap((line) => {
      // 如果行内含「内容包含：」，把它前面的部分单独提出来
      const splitMark = '内容包含：'
      const markIdx = line.indexOf(splitMark)
      if (markIdx !== -1) {
        const prefix = line.slice(0, markIdx).trim()
        const rest = line.slice(markIdx + splitMark.length)
        const items = rest.split('；').map((s) => s.trim()).filter(Boolean)
        return prefix ? [prefix, ...items] : items
      }
      return line.split('；').map((s) => s.trim()).filter(Boolean)
    })
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
    historyGroups.value = normalized.historyGroups
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

// 切换分类时重置日期筛选
watch(activeCategory, () => {
  activeAllDate.value = null
  activeHistoryDate.value = null
  activeFilteredDate.value = null
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
  width: min(620px, calc(100vw - 16px));
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
  min-height: 100px;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.notification-item:hover {
  transform: translateY(-1px);
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
  font-size: 11px;
  font-weight: 700;
  /* 颜色由 cat-* 类控制，此处不设默认色 */
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color);
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
  word-break: break-all;
  overflow-wrap: break-word;
}

.notification-item-summary {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
  word-break: break-all;
  overflow-wrap: break-word;
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
  /* 限制弹框最大高度，内容多时内部滚动，不撑大弹框 */
  max-height: min(80vh, 640px);
  padding: 0;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}

.notification-detail {
  padding: 26px 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 超出时滚动，头部和底部固定 */
  overflow-y: auto;
  min-height: 0;
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
  font-size: 12px;
  font-weight: 700;
  /* 颜色由 cat-* 类控制 */
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
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

.history-timeline {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 0;
  overflow: hidden;
  /* drawer-content 是 flex column，这里需要撑满 */
  margin: -2px;
}

/* 左侧日期导航条 */
.timeline-dates {
  flex-shrink: 0;
  width: 76px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding: 2px 0 2px 2px;
  border-right: 1px solid rgba(var(--primary-color-rgb), 0.1);
}

.timeline-date-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 11px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  text-align: center;
}

.timeline-date-btn:hover {
  background: rgba(var(--primary-color-rgb), 0.06);
  color: var(--text-primary);
}

.timeline-date-btn.active {
  background: rgba(var(--primary-color-rgb), 0.1);
  border-color: rgba(var(--primary-color-rgb), 0.22);
  color: var(--primary-color);
}

.tdb-label {
  font-weight: 700;
  line-height: 1.3;
}

.tdb-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.12);
  font-size: 10px;
  font-weight: 700;
}

/* 右侧条目区 */
.timeline-entries {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 2px 4px 2px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.tgh-date {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.tgh-count {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 单条时间轴条目 */
.timeline-entry {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.timeline-entry.te-clickable {
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  border-radius: 12px;
  text-align: left;
  width: calc(100% + 16px);
  transition: background 0.15s ease;
}

.timeline-entry.te-clickable:hover {
  background: rgba(var(--primary-color-rgb), 0.04);
}

.timeline-entry.te-clickable:hover .te-title {
  color: var(--primary-color);
}

.te-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
}

.te-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.te-line {
  width: 2px;
  flex: 1;
  min-height: 16px;
  background: rgba(var(--primary-color-rgb), 0.12);
  margin-top: 4px;
}

.te-body {
  flex: 1;
  min-width: 0;
  min-height: 64px;
  padding-bottom: 12px;
}

.te-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.te-cat {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.te-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.te-hash-inline {
  font-size: 10px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  letter-spacing: 0.02em;
  opacity: 0.7;
}

.te-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
  word-break: break-all;
  overflow-wrap: break-word;
}

.te-summary {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-all;
  overflow-wrap: break-word;
}

/* 分类颜色 — 活泼主题色系 */
.cat-new     { background: rgba(16, 185, 129, 0.12); color: #059669; border: 1px solid rgba(16, 185, 129, 0.25); }
.cat-feature { background: rgba(14, 165, 233, 0.12); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.25); }
.cat-fix     { background: rgba(245, 158, 11, 0.12); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.25); }
.cat-announce{ background: rgba(244, 63, 94, 0.12);  color: #e11d48; border: 1px solid rgba(244, 63, 94, 0.25); }
.cat-history { background: rgba(168, 85, 247, 0.12); color: #9333ea; border: 1px solid rgba(168, 85, 247, 0.25); }
.cat-git     { background: rgba(249, 115, 22, 0.12); color: #ea580c; border: 1px solid rgba(249, 115, 22, 0.25); }

/* te-dot 颜色 */
.te-dot.cat-new      { background: #10b981; }
.te-dot.cat-feature  { background: #0ea5e9; }
.te-dot.cat-fix      { background: #f59e0b; }
.te-dot.cat-announce { background: #f43f5e; }
.te-dot.cat-history  { background: #a855f7; }
.te-dot.cat-git      { background: #f97316; }

/* 深色模式 */
.dark-theme .cat-new     { background: rgba(16, 185, 129, 0.18); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
.dark-theme .cat-feature { background: rgba(14, 165, 233, 0.18); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3); }
.dark-theme .cat-fix     { background: rgba(245, 158, 11, 0.18); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); }
.dark-theme .cat-announce{ background: rgba(244, 63, 94, 0.18);  color: #fb7185; border-color: rgba(244, 63, 94, 0.3); }
.dark-theme .cat-history { background: rgba(168, 85, 247, 0.18); color: #c084fc; border-color: rgba(168, 85, 247, 0.3); }
.dark-theme .cat-git     { background: rgba(249, 115, 22, 0.18); color: #fb923c; border-color: rgba(249, 115, 22, 0.3); }

/* 全部 tab — 深灰黑，中性聚合色 */
.drawer-filter-chip--all { color: #374151; border-color: rgba(55, 65, 81, 0.25); }
.drawer-filter-chip--all.active { background: rgba(55, 65, 81, 0.1); border-color: #374151; color: #111827; font-weight: 800; }
.dark-theme .drawer-filter-chip--all { color: #d1d5db; border-color: rgba(209, 213, 219, 0.25); }
.dark-theme .drawer-filter-chip--all.active { background: rgba(209, 213, 219, 0.12); border-color: #9ca3af; color: #f9fafb; }

/* 筛选 tab — 未激活带分类色，激活时鲜明高亮 */
.drawer-filter-chip--cat-new     { color: #059669; border-color: rgba(16, 185, 129, 0.2); }
.drawer-filter-chip--cat-new.active     { background: rgba(16, 185, 129, 0.14); border-color: #10b981; color: #059669; font-weight: 800; }

.drawer-filter-chip--cat-feature { color: #0284c7; border-color: rgba(14, 165, 233, 0.2); }
.drawer-filter-chip--cat-feature.active { background: rgba(14, 165, 233, 0.14); border-color: #0ea5e9; color: #0284c7; font-weight: 800; }

.drawer-filter-chip--cat-fix     { color: #d97706; border-color: rgba(245, 158, 11, 0.2); }
.drawer-filter-chip--cat-fix.active     { background: rgba(245, 158, 11, 0.14); border-color: #f59e0b; color: #d97706; font-weight: 800; }

.drawer-filter-chip--cat-announce{ color: #e11d48; border-color: rgba(244, 63, 94, 0.2); }
.drawer-filter-chip--cat-announce.active{ background: rgba(244, 63, 94, 0.14);  border-color: #f43f5e; color: #e11d48; font-weight: 800; }

.drawer-filter-chip--cat-history { color: #9333ea; border-color: rgba(168, 85, 247, 0.2); }
.drawer-filter-chip--cat-history.active { background: rgba(168, 85, 247, 0.14); border-color: #a855f7; color: #9333ea; font-weight: 800; }

.drawer-filter-chip--cat-git     { color: #ea580c; border-color: rgba(249, 115, 22, 0.2); }
.drawer-filter-chip--cat-git.active     { background: rgba(249, 115, 22, 0.14); border-color: #f97316; color: #ea580c; font-weight: 800; }

/* 深色模式 tab */
.dark-theme .drawer-filter-chip--cat-new     { color: #34d399; }
.dark-theme .drawer-filter-chip--cat-new.active     { color: #34d399; border-color: #10b981; }
.dark-theme .drawer-filter-chip--cat-feature { color: #38bdf8; }
.dark-theme .drawer-filter-chip--cat-feature.active { color: #38bdf8; border-color: #0ea5e9; }
.dark-theme .drawer-filter-chip--cat-fix     { color: #fbbf24; }
.dark-theme .drawer-filter-chip--cat-fix.active     { color: #fbbf24; border-color: #f59e0b; }
.dark-theme .drawer-filter-chip--cat-announce{ color: #fb7185; }
.dark-theme .drawer-filter-chip--cat-announce.active{ color: #fb7185; border-color: #f43f5e; }
.dark-theme .drawer-filter-chip--cat-history { color: #c084fc; }
.dark-theme .drawer-filter-chip--cat-history.active { color: #c084fc; border-color: #a855f7; }
.dark-theme .drawer-filter-chip--cat-git     { color: #fb923c; }
.dark-theme .drawer-filter-chip--cat-git.active     { color: #fb923c; border-color: #f97316; }
</style>
