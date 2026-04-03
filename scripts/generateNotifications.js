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
  sortNotifications
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
    notifications
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
