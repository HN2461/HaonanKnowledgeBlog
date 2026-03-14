import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NOTES_DIR = path.join(__dirname, '../public/notes')
const OUTPUT_FILE = path.join(__dirname, '../public/notes-index.json')

// 确保输出目录存在
const outputDir = path.dirname(OUTPUT_FILE)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 智能排序函数（可复用）
function smartSort(items, getFilename) {
  return items.sort((a, b) => {
    const filenameA = getFilename ? getFilename(a) : a.filename || a.name;
    const filenameB = getFilename ? getFilename(b) : b.filename || b.name;
    
    // 提取文件名中的数字（如"第1章"、"第10章"、"第一篇"、"第二篇"）
    const getNumberFromFilename = (filename) => {
      // 处理阿拉伯数字：第1章、第2篇等
      let match = filename.match(/第(\d+)[章篇]/);
      if (match) {
        return parseInt(match[1], 10);
      }
      
      // 处理中文数字：第一篇、第二篇等
      const chineseNums = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, 
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
      };
      
      match = filename.match(/第([一二三四五六七八九十]+)[章篇]/);
      if (match) {
        const chineseNum = match[1];
        return chineseNums[chineseNum] || null;
      }
      
      return null;
    }
    
    const numA = getNumberFromFilename(filenameA);
    const numB = getNumberFromFilename(filenameB);
    
    // 如果都有数字，按数字排序
    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    
    // 处理特殊文件（目录文件、补充篇等）
    const isSpecialA = filenameA.includes('目录') || filenameA.includes('补充') || filenameA.includes('番外');
    const isSpecialB = filenameB.includes('目录') || filenameB.includes('补充') || filenameB.includes('番外');
    
    // 如果只有一个有数字，有数字的排在前面（除非是特殊文件）
    if (numA !== null && numB === null) {
      return isSpecialB ? -1 : -1; // 数字文件优先，但特殊文件排最后
    }
    if (numA === null && numB !== null) {
      return isSpecialA ? 1 : 1; // 数字文件优先，但特殊文件排最后
    }
    
    // 都没有数字时，特殊文件排在后面
    if (isSpecialA && !isSpecialB) return 1;
    if (!isSpecialA && isSpecialB) return -1;
    
    // 都没有数字，按字母排序
    return filenameA.localeCompare(filenameB, 'zh-CN');
  });
}

function toTagArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(/[、,，|/]/))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/[、,，|/]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTags(tags) {
  const unique = new Set()

  tags.forEach((tag) => {
    const cleanedTag = String(tag).replace(/^#+/, '').trim()
    if (cleanedTag) {
      unique.add(cleanedTag)
    }
  })

  return Array.from(unique)
}

function extractInlineTags(markdownContent) {
  const lines = markdownContent.split('\n').slice(0, 50)
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
  const pathSegments = relPath.split('/').slice(0, -1).filter(Boolean)
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

  if (Array.isArray(value)) {
    return value
  }

  return [value]
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

  // 未带目录时，默认相对当前笔记所在目录解析
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
      size: Math.round(stat.size / 1024) + 'KB',
      lastModified: stat.mtime.toISOString()
    })

    seenPaths.add(normalizedPath)
  })

  return attachments
}

// 递归扫描目录
function scanDirectory(dir, relativePath = '') {
  const items = []
  
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`)
    return items
  }

  const files = fs.readdirSync(dir)
  
  // 使用智能排序
  const sortedFiles = smartSort(files.map(file => ({ name: file })), (item) => item.name).map(item => item.name)

  sortedFiles.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    const relPath = relativePath ? `${relativePath}/${file}` : file

    if (stat.isDirectory()) {
      // 递归扫描子目录
      const children = scanDirectory(fullPath, relPath)
      items.push({
        type: 'directory',
        name: file,
        path: relPath,
        children: children
      })
    } else if (file.endsWith('.md')) {
      // 处理 Markdown 文件
      const rawContent = fs.readFileSync(fullPath, 'utf-8')
      const content = rawContent.replace(/\u0000/g, '')
      const shouldSkipFrontmatter = file.includes('目录')

      let frontmatter = {}
      let markdownContent = content

      if (!shouldSkipFrontmatter) {
        try {
          ;({ data: frontmatter, content: markdownContent } = matter(content))
        } catch (e) {
          frontmatter = {}
          markdownContent = content
        }
      }
      
      // 提取摘要（取前200个字符）
      const excerpt = markdownContent
        .replace(/^#.*$/gm, '') // 移除标题
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接
        .replace(/[#*`_~]/g, '') // 移除 Markdown 符号
        .trim()
        .substring(0, 200)

      // 清理并提取纯文本内容用于搜索
      const searchableContent = markdownContent
        .replace(/```[\s\S]*?```/g, ' ') // 移除代码块但保留空格
        .replace(/`([^`]+)`/g, '$1') // 移除行内代码标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 提取链接文本
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 提取图片alt文本
        .replace(/^#{1,6}\s+/gm, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/~~(.*?)~~/g, '$1') // 移除删除线标记
        .replace(/^\s*[-*+]\s+/gm, '') // 移除列表标记
        .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
        .replace(/^\s*>\s+/gm, '') // 移除引用标记
        .replace(/\n{2,}/g, '\n') // 合并多个换行
        .replace(/\s+/g, ' ') // 合并多个空格
        .trim()

      const category = frontmatter.category || relativePath.split('/')[0] || '未分类'
      const tags = resolveTags(frontmatter, markdownContent, relPath, category)
      const noteDirRelPath = relativePath || ''
      const attachments = resolveAttachments(frontmatter, noteDirRelPath)

      items.push({
        type: 'file',
        title: frontmatter.title || file.replace('.md', ''),
        filename: file,
        path: relPath,
        date: frontmatter.date || null,
        hasRealDate: !!frontmatter.date,
        tags: tags,
        category: category,
        attachments: attachments,
        description: frontmatter.description || excerpt,
        content: searchableContent, // 添加完整的可搜索内容
        size: Math.round(stat.size / 1024) + 'KB',
        lastModified: stat.mtime.toISOString(),
        wordCount: markdownContent.length
      })
    }
  })

  return items
}

// 扁平化笔记列表
function flattenNotes(items, result = []) {
  items.forEach(item => {
    if (item.type === 'file') {
      result.push(item)
    } else if (item.type === 'directory' && item.children) {
      flattenNotes(item.children, result)
    }
  })
  return result
}

function getNoteTimestamp(note) {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const time = new Date(value).getTime()
    if (!Number.isNaN(time)) {
      return time
    }
  }

  return 0
}

// 生成分类结构
function generateCategories(items) {
  const categories = {}

  function processItems(items, parentPath = '') {
    items.forEach(item => {
      if (item.type === 'directory') {
        const categoryPath = item.path
        if (!categories[categoryPath]) {
          categories[categoryPath] = {
            name: item.name,
            path: item.path,
            notes: [],
            children: []
          }
        }
        
        if (item.children) {
          processItems(item.children, categoryPath)
        }
      } else if (item.type === 'file') {
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

  // 统计分类下所有层级的笔记，避免父级目录出现 0 篇
  Object.values(categories).forEach((category) => {
    if (category.path === '根目录') {
      category.notes = allNotes.filter((note) => !note.path.includes('/'))
    } else {
      category.notes = allNotes.filter((note) => note.path.startsWith(`${category.path}/`))
    }

    category.notes = smartSort(category.notes, (note) => note.filename)
  })
  
  return Object.values(categories).filter((category) => category.notes.length > 0)
}

// 主函数
function generateIndex() {
  console.log('开始生成笔记索引...')
  console.log(`扫描目录: ${NOTES_DIR}`)

  const items = scanDirectory(NOTES_DIR)
  const allNotes = flattenNotes(items)
  const categories = generateCategories(items)

  // 统一按可用时间倒序排序，优先 date，无则回退 lastModified
  allNotes.sort((a, b) => getNoteTimestamp(b) - getNoteTimestamp(a))

  const index = {
    categories: categories,
    allNotes: allNotes,
    tree: items,
    totalNotes: allNotes.length,
    totalCategories: categories.length,
    lastUpdated: new Date().toISOString()
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8')
  
  console.log(`✓ 索引生成成功!`)
  console.log(`  - 总笔记数: ${index.totalNotes}`)
  console.log(`  - 总分类数: ${index.totalCategories}`)
  console.log(`  - 输出文件: ${OUTPUT_FILE}`)
}

// 执行
try {
  generateIndex()
} catch (error) {
  console.error('生成索引时出错:', error)
  process.exit(1)
}
