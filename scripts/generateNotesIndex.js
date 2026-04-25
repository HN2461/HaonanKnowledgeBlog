import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NOTES_DIR = path.join(__dirname, '../public/notes')
const NOTES_INDEX_FILE = path.join(__dirname, '../public/notes-index.json')
const SEARCH_INDEX_FILE = path.join(__dirname, '../public/search-index.json')

const outputDir = path.dirname(NOTES_INDEX_FILE)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function extractSequenceNumber(filename) {
  const normalizedName = String(filename || '').trim()

  let match = normalizedName.match(/^(\d{1,3})(?=[\s._\-、]|[^\d]|$)/)
  if (match) {
    return Number.parseInt(match[1], 10)
  }

  match = normalizedName.match(/第(\d+)[章节篇讲]/)
  if (match) {
    return Number.parseInt(match[1], 10)
  }

  const chineseNums = {
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9,
    '十': 10
  }

  match = normalizedName.match(/第([一二三四五六七八九十]+)[章节篇讲]/)
  if (match) {
    return chineseNums[match[1]] || null
  }

  return null
}

function compareByFilenameOrder(filenameA, filenameB) {
  const nameA = String(filenameA || '')
  const nameB = String(filenameB || '')
  const numA = extractSequenceNumber(nameA)
  const numB = extractSequenceNumber(nameB)
  const isSpecialA = nameA.includes('目录') || nameA.includes('补充') || nameA.includes('番外')
  const isSpecialB = nameB.includes('目录') || nameB.includes('补充') || nameB.includes('番外')

  if (numA !== null && numB !== null) {
    return numA - numB || nameA.localeCompare(nameB, 'zh-CN')
  }

  if (numA !== null) return -1
  if (numB !== null) return 1

  if (isSpecialA && !isSpecialB) return 1
  if (!isSpecialA && isSpecialB) return -1

  return nameA.localeCompare(nameB, 'zh-CN')
}

function smartSort(items, getFilename) {
  return items.sort((a, b) => {
    const filenameA = getFilename ? getFilename(a) : a.filename || a.name
    const filenameB = getFilename ? getFilename(b) : b.filename || b.name
    return compareByFilenameOrder(filenameA, filenameB)
  })
}

function normalizeOrderValue(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return null
  }

  return parsed
}

function isDirectoryIndexFile(filename = '') {
  return String(filename || '').trim() === '目录.md'
}

function resolveExplicitOrder(source = {}) {
  const candidates = [
    source.order,
    source.sort,
    source.sequence,
    source.index,
    source['排序'],
    source['顺序'],
    source['序号']
  ]

  for (const candidate of candidates) {
    const normalizedValue = normalizeOrderValue(candidate)
    if (normalizedValue !== null) {
      return normalizedValue
    }
  }

  return null
}

function compareByNoteOrder(noteA = {}, noteB = {}) {
  const orderA = resolveExplicitOrder(noteA)
  const orderB = resolveExplicitOrder(noteB)
  const hasOrderA = orderA !== null
  const hasOrderB = orderB !== null

  if (hasOrderA && hasOrderB) {
    const diff = orderA - orderB
    if (diff !== 0) {
      return diff
    }
  } else if (hasOrderA) {
    return -1
  } else if (hasOrderB) {
    return 1
  }

  return compareByFilenameOrder(noteA.filename || noteA.name, noteB.filename || noteB.name)
}

function sortDirectoryEntries(items = []) {
  return [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1
    }

    if (a.type === 'directory') {
      return compareByFilenameOrder(a.name, b.name)
    }

    return compareByNoteOrder(a, b)
  })
}

function toTagArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(/[、，,]/))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/[、，,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTags(tags) {
  const unique = new Set()

  tags.forEach((tag) => {
    const cleanedTag = String(tag || '').replace(/^#+/, '').trim()
    if (cleanedTag) {
      unique.add(cleanedTag)
    }
  })

  return Array.from(unique)
}

function extractInlineTags(markdownContent) {
  const lines = String(markdownContent || '').split('\n').slice(0, 50)
  const tagLine = lines.find((line) =>
    /^(?:>\s*)?(?:tags?|标签|关键词|关键字)\s*[:：]/i.test(line.trim())
  )

  if (!tagLine) {
    return []
  }

  const tagValue = tagLine
    .replace(/^(?:>\s*)?(?:tags?|标签|关键词|关键字)\s*[:：]\s*/i, '')
    .trim()

  return normalizeTags(toTagArray(tagValue))
}

function buildFallbackTags(relPath, category) {
  const pathSegments = String(relPath || '').split('/').slice(0, -1).filter(Boolean)
  const fallbackTags = []

  if (pathSegments.length > 0) {
    fallbackTags.push(pathSegments[0])
    fallbackTags.push(pathSegments[pathSegments.length - 1])
  }

  if (category) {
    fallbackTags.push(category)
  }

  return normalizeTags(fallbackTags)
}

function resolveTags(frontmatter, markdownContent, relPath, category) {
  const frontmatterTags = normalizeTags([
    ...toTagArray(frontmatter.tags),
    ...toTagArray(frontmatter.tag),
    ...toTagArray(frontmatter.keywords),
    ...toTagArray(frontmatter.keyword),
    ...toTagArray(frontmatter['标签']),
    ...toTagArray(frontmatter['关键词']),
    ...toTagArray(frontmatter['关键字'])
  ])

  if (frontmatterTags.length > 0) {
    return frontmatterTags
  }

  const inlineTags = extractInlineTags(markdownContent)
  if (inlineTags.length > 0) {
    return inlineTags
  }

  return buildFallbackTags(relPath, category)
}

function toAttachmentItems(value) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function normalizeAttachmentPath(rawPath, noteDirRelPath) {
  let filePath = String(rawPath || '').trim()
  if (!filePath) {
    return ''
  }

  filePath = filePath.replace(/\\/g, '/')

  if (filePath.startsWith('/')) {
    filePath = filePath.slice(1)
  }

  if (filePath.startsWith('notes/')) {
    filePath = filePath.slice(6)
  }

  if (!filePath.includes('/')) {
    filePath = noteDirRelPath ? `${noteDirRelPath}/${filePath}` : filePath
  }

  const normalizedPath = path.posix.normalize(filePath)
  if (!normalizedPath || normalizedPath.startsWith('..')) {
    return ''
  }

  return normalizedPath
}

function resolveAttachments(frontmatter, noteDirRelPath) {
  const rawAttachments = frontmatter.attachments
    || frontmatter.attachment
    || frontmatter.files
    || frontmatter['附件']

  const items = toAttachmentItems(rawAttachments)
  const attachments = []
  const seenPaths = new Set()

  items.forEach((item) => {
    let filePath = ''
    let fileName = ''

    if (typeof item === 'string') {
      filePath = item
    } else if (item && typeof item === 'object') {
      filePath = item.path || item.file || item.name || ''
      fileName = item.name || ''
    }

    const normalizedPath = normalizeAttachmentPath(filePath, noteDirRelPath)
    if (!normalizedPath || seenPaths.has(normalizedPath)) {
      return
    }

    const absolutePath = path.join(NOTES_DIR, normalizedPath)
    if (!fs.existsSync(absolutePath)) {
      return
    }

    const stat = fs.statSync(absolutePath)
    if (!stat.isFile()) {
      return
    }

    attachments.push({
      name: fileName || path.basename(normalizedPath),
      path: normalizedPath,
      ext: path.extname(normalizedPath).replace('.', '').toLowerCase(),
      size: `${Math.round(stat.size / 1024)}KB`,
      lastModified: stat.mtime.toISOString()
    })

    seenPaths.add(normalizedPath)
  })

  return attachments
}

function buildExcerpt(markdownContent) {
  return String(markdownContent || '')
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~]/g, '')
    .trim()
    .substring(0, 200)
}

function buildSearchableContent(markdownContent) {
  return String(markdownContent || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()
}

function toLightNote(note = {}) {
  const { searchContent, ...lightNote } = note
  return lightNote
}

function stripTreeSearchContent(items = []) {
  return items.map((item) => {
    if (item.type === 'directory') {
      return {
        ...item,
        children: stripTreeSearchContent(item.children || [])
      }
    }

    return toLightNote(item)
  })
}

function scanDirectory(dir, relativePath = '') {
  const items = []

  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`)
    return items
  }

  const files = fs.readdirSync(dir)
  const sortedFiles = smartSort(
    files.map((file) => ({ name: file })),
    (item) => item.name
  ).map((item) => item.name)

  sortedFiles.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    const relPath = relativePath ? `${relativePath}/${file}` : file

    if (stat.isDirectory()) {
      items.push({
        type: 'directory',
        name: file,
        path: relPath,
        children: scanDirectory(fullPath, relPath)
      })
      return
    }

    if (!file.endsWith('.md') || isDirectoryIndexFile(file)) {
      return
    }

    const rawContent = fs.readFileSync(fullPath, 'utf-8')
    const content = rawContent.replace(/\u0000/g, '')
    let frontmatter = {}
    let markdownContent = content

    try {
      ;({ data: frontmatter, content: markdownContent } = matter(content))
    } catch {
      frontmatter = {}
      markdownContent = content
    }

    const excerpt = buildExcerpt(markdownContent)
    const searchContent = buildSearchableContent(markdownContent)
    const category = frontmatter.category || relativePath.split('/')[0] || '未分类'
    const tags = resolveTags(frontmatter, markdownContent, relPath, category)
    const noteDirRelPath = relativePath || ''
    const attachments = resolveAttachments(frontmatter, noteDirRelPath)
    const order = resolveExplicitOrder(frontmatter)
    const fileTitle = file.replace(/\.md$/i, '')
    const frontmatterTitle = frontmatter.title || fileTitle

    items.push({
      type: 'file',
      title: frontmatterTitle,
      frontmatterTitle,
      fileTitle,
      filename: file,
      path: relPath,
      date: frontmatter.date || null,
      hasRealDate: !!frontmatter.date,
      order,
      tags,
      category,
      attachments,
      description: frontmatter.description || excerpt,
      searchContent,
      size: `${Math.round(stat.size / 1024)}KB`,
      lastModified: stat.mtime.toISOString(),
      wordCount: markdownContent.length
    })
  })

  return sortDirectoryEntries(items)
}

function flattenNotes(items, result = []) {
  items.forEach((item) => {
    if (item.type === 'file') {
      result.push(item)
      return
    }

    if (item.type === 'directory' && item.children) {
      flattenNotes(item.children, result)
    }
  })

  return result
}

function getNoteTimestamp(note) {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) continue
    const time = new Date(value).getTime()
    if (!Number.isNaN(time)) {
      return time
    }
  }

  return 0
}

function generateCategories(items) {
  const categories = {}

  function processItems(currentItems) {
    currentItems.forEach((item) => {
      if (item.type === 'directory') {
        if (!categories[item.path]) {
          categories[item.path] = {
            name: item.name,
            path: item.path,
            notes: [],
            children: []
          }
        }

        if (item.children) {
          processItems(item.children)
        }

        return
      }

      if (item.type === 'file') {
        const categoryPath = item.path.substring(0, item.path.lastIndexOf('/')) || '根目录'

        if (!categories[categoryPath]) {
          categories[categoryPath] = {
            name: categoryPath.split('/').pop() || '根目录',
            path: categoryPath,
            notes: [],
            children: []
          }
        }

        categories[categoryPath].notes.push(item)
      }
    })
  }

  processItems(items)

  const allNotes = flattenNotes(items)

  Object.values(categories).forEach((category) => {
    if (category.path === '根目录') {
      category.notes = allNotes.filter((note) => !note.path.includes('/'))
    } else {
      category.notes = allNotes.filter((note) => note.path.startsWith(`${category.path}/`))
    }

    category.notes = [...category.notes].sort(compareByNoteOrder)
  })

  return Object.values(categories).filter((category) => category.notes.length > 0)
}

function generateIndex() {
  console.log('开始生成笔记索引...')
  console.log(`扫描目录: ${NOTES_DIR}`)

  const treeWithSearch = scanDirectory(NOTES_DIR)
  const allNotesWithSearch = flattenNotes(treeWithSearch)
  const categoriesWithSearch = generateCategories(treeWithSearch)

  allNotesWithSearch.sort((a, b) => {
    const timeDiff = getNoteTimestamp(b) - getNoteTimestamp(a)
    if (timeDiff !== 0) {
      return timeDiff
    }

    return compareByNoteOrder(a, b)
  })

  const lastUpdated = new Date().toISOString()
  const lightTree = stripTreeSearchContent(treeWithSearch)
  const lightAllNotes = allNotesWithSearch.map((note) => toLightNote(note))
  const lightCategories = categoriesWithSearch.map((category) => ({
    ...category,
    notes: category.notes.map((note) => toLightNote(note))
  }))

  const searchNotes = allNotesWithSearch.map((note) => ({
    ...toLightNote(note),
    content: note.searchContent || ''
  }))

  const notesIndex = {
    categories: lightCategories,
    allNotes: lightAllNotes,
    tree: lightTree,
    totalNotes: lightAllNotes.length,
    totalCategories: lightCategories.length,
    lastUpdated
  }

  const searchIndex = {
    allNotes: searchNotes,
    tree: lightTree,
    totalNotes: searchNotes.length,
    totalCategories: lightCategories.length,
    lastUpdated
  }

  fs.writeFileSync(NOTES_INDEX_FILE, JSON.stringify(notesIndex, null, 2), 'utf-8')
  fs.writeFileSync(SEARCH_INDEX_FILE, JSON.stringify(searchIndex, null, 2), 'utf-8')

  console.log('✓ 索引生成成功!')
  console.log(`  - 总笔记数: ${notesIndex.totalNotes}`)
  console.log(`  - 总分类数: ${notesIndex.totalCategories}`)
  console.log(`  - 输出文件: ${NOTES_INDEX_FILE}`)
  console.log(`  - 搜索索引: ${SEARCH_INDEX_FILE}`)
}

try {
  generateIndex()
} catch (error) {
  console.error('生成索引时出错:', error)
  process.exit(1)
}
