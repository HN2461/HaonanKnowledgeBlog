import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dailyChangeSummary } from '../data/dailyChangeSummary.js'
import { manualNotifications } from '../data/manualNotifications.js'
import { historyNotifications } from '../data/historyNotifications.js'
import {
  buildSummary,
  normalizeDailySummaryNotifications,
  normalizeHistoryNotifications,
  normalizeManualNotifications,
  normalizeText,
  sortNotifications,
  ensureArray
} from './notificationTransforms.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_FILE = path.join(__dirname, '../public/notifications.json')
const RECORD_SEPARATOR = '\u001e'
const FIELD_SEPARATOR = '\u001f'

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

function buildHistoryGroups(rawHistoryNotifications) {
  // 先按日期合并同日的多个 group
  const dateMap = new Map()

  ensureArray(rawHistoryNotifications).forEach((group) => {
    const date = normalizeText(group?.date)
    if (!date) return

    const items = ensureArray(group?.items || group?.entries)
      .map((entry) => {
        const title = normalizeText(entry?.title) || normalizeText(entry?.summary)
        const summary = normalizeText(entry?.summary) || title
        const time = normalizeText(entry?.time)
        const rawCategory = normalizeText(entry?.category)
        // 有明确业务分类就用；否则尝试从 content/summary 字段推断；最后回退"历史消息"
        let itemCategory = '历史消息'
        if (['内容上新', '功能更新', '问题修复', '系统公告'].includes(rawCategory)) {
          itemCategory = rawCategory
        } else {
          const hint = normalizeText(entry?.content) || normalizeText(entry?.summary)
          if (/内容上新/.test(hint)) itemCategory = '内容上新'
          else if (/功能更新/.test(hint)) itemCategory = '功能更新'
          else if (/问题修复/.test(hint)) itemCategory = '问题修复'
          else if (/系统公告/.test(hint)) itemCategory = '系统公告'
        }
        return title ? { title, summary, time, itemCategory } : null
      })
      .filter(Boolean)

    if (items.length === 0) return

    if (dateMap.has(date)) {
      // 同日期合并：按 time 顺序追加
      dateMap.get(date).push(...items)
    } else {
      dateMap.set(date, items)
    }
  })

  return Array.from(dateMap.entries())
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function generateNotifications() {
  const dailySummaryItems = normalizeDailySummaryNotifications(dailyChangeSummary)
  const manualItems = normalizeManualNotifications(manualNotifications)
  const historyItems = normalizeHistoryNotifications(historyNotifications)
  const gitItems = loadGitNotifications()
  const notifications = sortNotifications([
    ...dailySummaryItems,
    ...manualItems,
    ...historyItems,
    ...gitItems
  ])

  const payload = {
    generatedAt: new Date().toISOString(),
    total: notifications.length,
    notifications,
    historyGroups: buildHistoryGroups(historyNotifications)
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8')

  console.log('✓ 通知消息生成成功!')
  console.log(`  - 今日摘要: ${dailySummaryItems.length}`)
  console.log(`  - 手动消息: ${manualItems.length}`)
  console.log(`  - 历史消息: ${historyItems.length}`)
  console.log(`  - Git 消息: ${gitItems.length}`)
  console.log(`  - 输出文件: ${OUTPUT_FILE}`)
}

generateNotifications()
