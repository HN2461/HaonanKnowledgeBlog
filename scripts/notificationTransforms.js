export const DEFAULT_TIMEZONE = 'Asia/Shanghai'
export const DEFAULT_TIMEZONE_OFFSET = '+08:00'
export const BUSINESS_NOTIFICATION_CATEGORIES = [
  '系统公告',
  '功能更新',
  '内容上新',
  '问题修复',
  '历史消息'
]

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_WITH_SECONDS_PATTERN = /^\d{2}:\d{2}:\d{2}$/
const TIME_WITHOUT_SECONDS_PATTERN = /^\d{2}:\d{2}$/

export function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

export function normalizeText(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .trim()
}

export function buildSummary(content, fallbackTitle) {
  const source = normalizeText(content) || normalizeText(fallbackTitle)
  return source.split('\n').filter(Boolean).join(' ').slice(0, 120)
}

export function getTodayDate() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: DEFAULT_TIMEZONE
  }).format(new Date())
}

function isDateOnlyValue(value) {
  return DATE_ONLY_PATTERN.test(normalizeText(value))
}

function isDateTimeValue(value) {
  const normalizedValue = normalizeText(value)
  return Boolean(normalizedValue) && !isDateOnlyValue(normalizedValue)
}

function normalizeTimeValue(value) {
  const normalizedValue = normalizeText(value)

  if (TIME_WITH_SECONDS_PATTERN.test(normalizedValue)) {
    return normalizedValue
  }

  if (TIME_WITHOUT_SECONDS_PATTERN.test(normalizedValue)) {
    return `${normalizedValue}:00`
  }

  return ''
}

export function resolveNotificationDate(item = {}, options = {}) {
  const {
    fallbackDate = '',
    timezoneOffset = DEFAULT_TIMEZONE_OFFSET
  } = options

  const explicitDateTime = normalizeText(
    item.dateTime || item.datetime || item.timestamp || item.occurredAt
  )
  if (isDateTimeValue(explicitDateTime)) {
    return explicitDateTime
  }

  const explicitDate = normalizeText(item.date)
  if (isDateTimeValue(explicitDate)) {
    return explicitDate
  }

  const baseDate = isDateOnlyValue(explicitDate)
    ? explicitDate
    : normalizeText(fallbackDate)
  if (!baseDate) {
    return explicitDateTime || explicitDate
  }

  const normalizedTime = normalizeTimeValue(item.time || item.at)
  if (!normalizedTime) {
    return baseDate
  }

  return `${baseDate}T${normalizedTime}${timezoneOffset}`
}

export function normalizeManualNotifications(items = []) {
  return ensureArray(items)
    .map((item, index) => {
      const title = normalizeText(item?.title)
      const content = normalizeText(item?.content)
      const date = resolveNotificationDate(item) || new Date().toISOString()

      if (!title || !content) {
        return null
      }

      return {
        id: normalizeText(item?.id) || `manual-${index + 1}`,
        title,
        content,
        summary: buildSummary(content, title),
        date,
        tag: normalizeText(item?.tag) || '手动消息',
        source: 'manual',
        pinned: Boolean(item?.pinned),
        shortHash: '',
        fullHash: ''
      }
    })
    .filter(Boolean)
}

function normalizeHistoryEntry(entry, entryIndex, group) {
  const title = normalizeText(entry?.title) || normalizeText(entry?.summary)
  const content =
    normalizeText(entry?.content) || normalizeText(entry?.summary) || title
  const summary = normalizeText(entry?.summary)
  const date =
    resolveNotificationDate(entry, {
      fallbackDate: group.date
    }) || normalizeText(group.date) || new Date().toISOString()

  if (!title || !content) {
    return null
  }

  return {
    id:
      normalizeText(entry?.id) ||
      `${normalizeText(group.id) || `history-${group.index + 1}`}-${entryIndex + 1}`,
    title,
    content,
    summary: summary || buildSummary(content, title),
    date,
    tag: '历史消息',
    category: '历史消息',
    source: 'history',
    pinned: false,
    shortHash: '',
    fullHash: ''
  }
}

export function normalizeHistoryNotifications(items = []) {
  return ensureArray(items)
    .flatMap((item, index) => {
      const entries = ensureArray(item?.items || item?.entries)
      if (entries.length > 0) {
        const group = {
          id: item?.id,
          date: normalizeText(item?.date),
          index
        }

        return entries
          .map((entry, entryIndex) => normalizeHistoryEntry(entry, entryIndex, group))
          .filter(Boolean)
      }

      const title = normalizeText(item?.title)
      const content = normalizeText(item?.content)
      const summary = normalizeText(item?.summary)
      const date = resolveNotificationDate(item) || new Date().toISOString()

      if (!title || !content) {
        return []
      }

      return [{
        id: normalizeText(item?.id) || `history-${index + 1}`,
        title,
        content,
        summary: summary || buildSummary(content, title),
        date,
        tag: '历史消息',
        category: '历史消息',
        source: 'history',
        pinned: false,
        shortHash: '',
        fullHash: ''
      }]
    })
}

export function normalizeDailySummaryNotifications(summary, options = {}) {
  const { todayDate = getTodayDate() } = options
  const summaryDate = normalizeText(summary?.date)
  const items = ensureArray(summary?.items)
    .map((item, index) => {
      const category = normalizeText(item?.category)
      const title = normalizeText(item?.title)
      const content =
        normalizeText(item?.content) || normalizeText(item?.summary)
      const summaryText = normalizeText(item?.summary)
      const date =
        resolveNotificationDate(item, {
          fallbackDate: summaryDate
        }) || summaryDate

      if (
        !BUSINESS_NOTIFICATION_CATEGORIES.includes(category) ||
        !title ||
        !content
      ) {
        return null
      }

      return {
        id: normalizeText(item?.id) || `daily-${summaryDate}-${index + 1}`,
        title,
        content,
        summary: summaryText || buildSummary(content, title),
        date,
        tag: category,
        category,
        source: 'daily-summary',
        pinned: category === '系统公告',
        shortHash: '',
        fullHash: ''
      }
    })
    .filter(Boolean)

  if (!summaryDate || summaryDate !== todayDate || items.length === 0) {
    return []
  }

  return items
}

export function sortNotifications(items = []) {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}
