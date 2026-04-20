import dayjs from 'dayjs'

export const BUSINESS_NOTIFICATION_CATEGORIES = [
  '系统公告',
  '功能更新',
  '内容上新',
  '问题修复',
  '历史消息'
]

export const GIT_NOTIFICATION_CATEGORY = 'Git 提交'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function normalizeText(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function buildSummary(content, title) {
  const source = normalizeText(content) || normalizeText(title)
  return source.split('\n').filter(Boolean).join(' ').slice(0, 120)
}

export function normalizeNotificationItem(item = {}, index = 0) {
  const title = normalizeText(item.title) || `消息 ${index + 1}`
  const content = normalizeText(item.content) || title
  const date = normalizeText(item.date) || new Date().toISOString()
  const source = normalizeText(item.source) || 'manual'
  const preferredCategory =
    source === 'git'
      ? GIT_NOTIFICATION_CATEGORY
      : normalizeText(item.category) || normalizeText(item.tag) || '系统公告'

  return {
    id: normalizeText(item.id) || `notification-${index + 1}`,
    title,
    content,
    summary: normalizeText(item.summary) || buildSummary(content, title),
    date,
    tag: preferredCategory,
    category: preferredCategory,
    // 历史消息专属字段
    itemCategory: normalizeText(item.itemCategory) || '',
    historyDate: normalizeText(item.historyDate) || '',
    source,
    pinned: Boolean(item.pinned),
    shortHash: normalizeText(item.shortHash),
    fullHash: normalizeText(item.fullHash)
  }
}

export function sortNotifications(items = []) {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function normalizeNotificationsPayload(payload = {}) {
  const items = Array.isArray(payload.notifications)
    ? payload.notifications
    : []
  const notifications = sortNotifications(
    items.map((item, index) => normalizeNotificationItem(item, index))
  )

  // 透传 historyGroups（脚本生成的按日期分组结构）
  const historyGroups = Array.isArray(payload.historyGroups)
    ? payload.historyGroups
    : []

  return {
    generatedAt: normalizeText(payload.generatedAt) || '',
    total: Number(payload.total) || notifications.length,
    notifications,
    historyGroups
  }
}

export function formatNotificationDate(value) {
  const normalizedValue = normalizeText(value)
  if (DATE_ONLY_PATTERN.test(normalizedValue)) {
    const [year, month, day] = normalizedValue.split('-')
    return `${year}.${month}.${day}`
  }

  const parsed = dayjs(value)
  if (!parsed.isValid()) {
    return '时间未知'
  }

  return parsed.format('YYYY.MM.DD HH:mm')
}

export function formatNotificationMeta(item = {}) {
  const parts = [formatNotificationDate(item.date)]

  if (item.source === 'git' && item.shortHash) {
    parts.push(GIT_NOTIFICATION_CATEGORY, `#${item.shortHash}`)
  }

  return parts.filter(Boolean).join(' 路 ')
}
