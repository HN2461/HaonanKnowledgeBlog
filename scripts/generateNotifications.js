import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dailyChangeSummary } from '../data/dailyChangeSummary.js'
import { manualNotifications } from '../data/manualNotifications.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_FILE = path.join(__dirname, '../public/notifications.json')
const RECORD_SEPARATOR = '\u001e'
const FIELD_SEPARATOR = '\u001f'
const DEFAULT_TIMEZONE = 'Asia/Shanghai'
const BUSINESS_NOTIFICATION_CATEGORIES = [
  '系统公告',
  '功能更新',
  '内容上新',
  '问题修复'
]

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function buildSummary(content, fallbackTitle) {
  const source = normalizeText(content) || normalizeText(fallbackTitle)
  return source
    .split('\n')
    .filter(Boolean)
    .join(' ')
    .slice(0, 120)
}

function getTodayDate() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: DEFAULT_TIMEZONE
  }).format(new Date())
}

function normalizeManualNotifications(items = []) {
  return ensureArray(items)
    .map((item, index) => {
      const title = normalizeText(item?.title)
      const content = normalizeText(item?.content)
      const date = normalizeText(item?.date) || new Date().toISOString()

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

function normalizeDailySummaryNotifications(summary) {
  const summaryDate = normalizeText(summary?.date)
  const items = ensureArray(summary?.items)
    .map((item, index) => {
      const category = normalizeText(item?.category)
      const title = normalizeText(item?.title)
      const content = normalizeText(item?.content) || normalizeText(item?.summary)
      const summaryText = normalizeText(item?.summary)

      if (!BUSINESS_NOTIFICATION_CATEGORIES.includes(category) || !title || !content) {
        return null
      }

      return {
        id: normalizeText(item?.id) || `daily-${summaryDate}-${index + 1}`,
        title,
        content,
        summary: summaryText || buildSummary(content, title),
        date: `${summaryDate}T09:00:00+08:00`,
        tag: category,
        category,
        source: 'daily-summary',
        pinned: category === '系统公告',
        shortHash: '',
        fullHash: ''
      }
    })
    .filter(Boolean)

  if (!summaryDate || summaryDate !== getTodayDate() || items.length === 0) {
    return []
  }

  return items
}

function loadGitNotifications() {
  try {
    const raw = execSync(
      `git log --date=iso-strict --pretty=format:%H${FIELD_SEPARATOR}%h${FIELD_SEPARATOR}%cI${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%b${RECORD_SEPARATOR}`,
      {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }
    )

    return raw
      .split(RECORD_SEPARATOR)
      .map((record) => record.trim())
      .filter(Boolean)
      .map((record) => {
        const [fullHash, shortHash, date, title, body] = record.split(FIELD_SEPARATOR)
        const normalizedTitle = normalizeText(title)
        const normalizedBody = normalizeText(body)

        if (!normalizedTitle) {
          return null
        }

        return {
          id: `git-${fullHash}`,
          title: normalizedTitle,
          content: normalizedBody || `提交说明：${normalizedTitle}`,
          summary: buildSummary(normalizedBody, normalizedTitle),
          date: normalizeText(date) || new Date().toISOString(),
          tag: 'Git 提交',
          source: 'git',
          pinned: false,
          shortHash: normalizeText(shortHash),
          fullHash: normalizeText(fullHash)
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

function sortNotifications(items = []) {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

function generateNotifications() {
  const dailySummaryItems = normalizeDailySummaryNotifications(dailyChangeSummary)
  const manualItems = normalizeManualNotifications(manualNotifications)
  const gitItems = loadGitNotifications()
  const notifications = sortNotifications([
    ...dailySummaryItems,
    ...manualItems,
    ...gitItems
  ])

  const payload = {
    generatedAt: new Date().toISOString(),
    total: notifications.length,
    notifications
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8')

  console.log('✓ 通知消息生成成功!')
  console.log(`  - 今日摘要: ${dailySummaryItems.length}`)
  console.log(`  - 手动消息: ${manualItems.length}`)
  console.log(`  - Git 消息: ${gitItems.length}`)
  console.log(`  - 输出文件: ${OUTPUT_FILE}`)
}

generateNotifications()
