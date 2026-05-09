import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  buildBookmarkId,
  buildCategorySummary,
  buildShelfSummary,
  buildTypeSummary,
  classifyBookmark,
  sortBookmarks
} from './bookmarkCatalogRules.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.join(__dirname, '..')
const OUTPUT_FILE = path.join(ROOT_DIR, 'public/bookmarks-index.json')

function decodeHtml(value = '') {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .trim()
}

function normalizeDomain(rawUrl = '') {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function parseBookmarksHtml(htmlContent = '') {
  const lines = String(htmlContent || '').split(/\r?\n/)
  const folderTrail = []
  const entries = []
  let pendingFolder = ''

  lines.forEach((line) => {
    const folderMatch = line.match(/<H3\b[^>]*>(.*?)<\/H3>/i)
    if (folderMatch) {
      pendingFolder = decodeHtml(folderMatch[1])
    }

    if (/<DL><p>/i.test(line) && pendingFolder) {
      folderTrail.push(pendingFolder)
      pendingFolder = ''
      return
    }

    if (/<\/DL><p>/i.test(line)) {
      folderTrail.pop()
      return
    }

    const linkMatch = line.match(/<A\b[^>]*HREF="([^"]+)"[^>]*>(.*?)<\/A>/i)
    if (!linkMatch) {
      return
    }

    const url = linkMatch[1]
    const title = decodeHtml(linkMatch[2])

    entries.push({
      title,
      url,
      domain: normalizeDomain(url),
      originalPath: folderTrail.join(' / '),
      folderTrail: [...folderTrail]
    })
  })

  return entries
}

function resolveSourceGroup(folderTrail = []) {
  const normalizedTrail = Array.isArray(folderTrail) ? folderTrail.filter(Boolean) : []
  const sourceGroup = normalizedTrail.find((item) => item && item !== '书签栏')
  return sourceGroup || '根入口'
}

function resolveSourceFile() {
  const requestedFile = process.argv[2]

  if (requestedFile) {
    const absolutePath = path.isAbsolute(requestedFile)
      ? requestedFile
      : path.join(ROOT_DIR, requestedFile)
    return fs.existsSync(absolutePath) ? absolutePath : ''
  }

  const bookmarkFiles = fs.readdirSync(ROOT_DIR)
    .filter((filename) => /^bookmarks_.*\.html$/i.test(filename))
    .map((filename) => path.join(ROOT_DIR, filename))
    .sort((fileA, fileB) => {
      const statA = fs.statSync(fileA)
      const statB = fs.statSync(fileB)
      return statB.mtimeMs - statA.mtimeMs
    })

  return bookmarkFiles[0] || ''
}

function ensureOutputDirectory() {
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
}

function writePayload(payload) {
  ensureOutputDirectory()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8')
}

function generateEmptyPayload(note = '') {
  return {
    generatedAt: new Date().toISOString(),
    sourceFile: '',
    totalCount: 0,
    note,
    categories: [],
    shelves: [],
    types: [],
    sourceGroups: [],
    entries: []
  }
}

function buildSourceGroupSummary(entries = []) {
  const counts = new Map()

  entries.forEach((entry) => {
    const sourceGroup = entry.sourceGroup || '根入口'
    counts.set(sourceGroup, (counts.get(sourceGroup) || 0) + 1)
  })

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((itemA, itemB) => itemB.count - itemA.count || itemA.name.localeCompare(itemB.name, 'zh-CN'))
}

function generateBookmarksIndex() {
  const sourceFile = resolveSourceFile()

  if (!sourceFile) {
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('! 未找到新的书签导出文件，保留现有 public/bookmarks-index.json')
      return
    }

    writePayload(generateEmptyPayload('未找到书签导出文件，暂时生成空书签索引'))
    console.log('! 未找到书签导出文件，已生成空索引')
    return
  }

  const htmlContent = fs.readFileSync(sourceFile, 'utf8')
  const parsedEntries = parseBookmarksHtml(htmlContent)
  const usedIds = new Set()
  const classifiedEntries = parsedEntries.map((entry) => {
    const classification = classifyBookmark(entry)

    return {
      id: buildBookmarkId(entry, usedIds),
      title: entry.title,
      url: entry.url,
      domain: entry.domain,
      originalPath: entry.originalPath,
      folderTrail: entry.folderTrail,
      sourceGroup: resolveSourceGroup(entry.folderTrail),
      ...classification
    }
  })
    .sort(sortBookmarks)

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.basename(sourceFile),
    totalCount: classifiedEntries.length,
    note: '当前书签页保留全部收藏，不再自动隐藏账号或平台入口，重点是按用途整理并方便你自己快速回找',
    categories: buildCategorySummary(classifiedEntries),
    shelves: buildShelfSummary(classifiedEntries),
    types: buildTypeSummary(classifiedEntries),
    sourceGroups: buildSourceGroupSummary(classifiedEntries),
    entries: classifiedEntries
  }

  writePayload(payload)

  console.log('✓ 书签索引生成成功!')
  console.log(`  - 来源文件: ${path.basename(sourceFile)}`)
  console.log(`  - 总计分析: ${payload.totalCount}`)
  console.log(`  - 输出文件: ${OUTPUT_FILE}`)
}

generateBookmarksIndex()
