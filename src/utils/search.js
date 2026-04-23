import Fuse from 'fuse.js'
import { cleanNoteText, getNoteExcerpt } from '@/utils/notePresentation'

let fuseInstance = null
let indexedNotes = []
let indexedData = null
let searchInitPromise = null
const SEARCH_HISTORY_KEY = 'search-history'
const SEARCH_HISTORY_LIMIT = 10

// 初始化搜索引擎
export function initSearch(notes, data = null) {
  indexedNotes = Array.isArray(notes) ? notes : []
  indexedData = data && typeof data === 'object'
    ? {
      ...data,
      allNotes: indexedNotes
    }
    : {
      allNotes: indexedNotes
    }

  const options = {
    keys: [
      { name: 'title', weight: 0.35 },
      { name: 'content', weight: 0.4 },
      { name: 'description', weight: 0.15 },
      { name: 'tags', weight: 0.07 },
      { name: 'category', weight: 0.03 }
    ],
    threshold: 0.1,        // 严格匹配，减少误判（原 0.3）
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2, // 至少 2 个字符才算匹配
    distance: 200,         // 缩短搜索距离（原 1000）
    ignoreLocation: true,  // 全文搜索
    findAllMatches: true
  }

  fuseInstance = new Fuse(indexedNotes, options)
  return fuseInstance
}

export async function ensureSearchReady() {
  if (fuseInstance && indexedData) {
    return indexedData
  }

  if (!searchInitPromise) {
    searchInitPromise = fetch(`${import.meta.env.BASE_URL}notes-index.json`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`notes-index request failed: ${response.status}`)
        }

        const data = await response.json()
        const notes = data.allNotes || []
        initSearch(notes, data)
        return indexedData
      })
      .catch((error) => {
        searchInitPromise = null
        throw error
      })
  }

  return searchInitPromise
}

// 搜索笔记
export function searchNotes(query, mode = 'AND') {
  if (!fuseInstance) {
    console.warn('搜索引擎未初始化')
    return []
  }

  if (!query || query.trim() === '') {
    return []
  }

  const trimmedQuery = query.trim()

  // 逗号分隔 → 多词；否则单词
  const hasSeparator = trimmedQuery.includes(',') || trimmedQuery.includes('，')
  const words = hasSeparator
    ? trimmedQuery.split(/[,，]+/).map(w => w.trim()).filter(w => w.length > 0)
    : [trimmedQuery]

  const wordsLower = words.map(w => w.toLowerCase())

  const results = []
  indexedNotes.forEach(item => {
    const titleLower = (item.title || '').toLowerCase()
    const text = [
      item.title || '',
      item.content || '',
      item.description || '',
      (item.tags || []).join(' '),
      item.category || ''
    ].join(' ').toLowerCase()

    // AND：每个词都必须出现；OR：至少一个词出现
    const matched = mode === 'AND'
      ? wordsLower.every(w => text.includes(w))
      : wordsLower.some(w => text.includes(w))

    if (!matched) return

    // 相关度：标题命中词越多、内容出现频率越高得分越高
    const titleHits = wordsLower.filter(w => titleLower.includes(w)).length
    const contentHits = wordsLower.reduce((acc, w) => {
      const matches = (text.match(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      return acc + matches
    }, 0)
    const relevanceScore = titleHits * 2 + Math.min(contentHits * 0.05, 1)

    results.push({
      ...item,
      relevanceScore,
      matchedContent: extractMatchedContent(item, words[0])
    })
  })

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 100)
}

// 计算相关性得分
function calculateRelevanceScore(result, query) {
  const item = result.item
  const queryLower = query.toLowerCase()
  let score = 1 - (result.score || 0) // Fuse.js的得分是越低越好，我们要反转
  
  // 标题完全匹配加分
  if (item.title && item.title.toLowerCase().includes(queryLower)) {
    score += 0.5
  }
  
  // 标题开头匹配加分更多
  if (item.title && item.title.toLowerCase().startsWith(queryLower)) {
    score += 0.3
  }
  
  // 内容中匹配次数加分
  if (item.content) {
    const contentLower = item.content.toLowerCase()
    const matchCount = (contentLower.match(new RegExp(queryLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    score += matchCount * 0.1
  }
  
  // 标签精确匹配加分
  if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
    score += 0.2
  }
  
  // 文档长度调节（较短的文档如果匹配应该得分更高）
  if (item.wordCount) {
    score += Math.max(0, (1000 - item.wordCount) / 10000)
  }
  
  return Math.max(0, score)
}

// 提取匹配的内容片段
function extractMatchedContent(item, query) {
  if (!item.content) {
    return getNoteExcerpt(item, {
      maxLength: 160
    })
  }
  
  const queryLower = query.toLowerCase()
  const content = item.content
  const contentLower = content.toLowerCase()
  
  // 查找匹配位置
  let matchIndex = contentLower.indexOf(queryLower)
  if (matchIndex === -1) {
    // 如果没有完全匹配，尝试查找第一个词
    const firstWord = query.split(/\s+/)[0]
    if (firstWord && firstWord.length > 1) {
      matchIndex = contentLower.indexOf(firstWord.toLowerCase())
    }
  }
  
  if (matchIndex !== -1) {
    // 提取匹配周围的文本
    const start = Math.max(0, matchIndex - 100)
    const end = Math.min(content.length, matchIndex + query.length + 100)
    let excerpt = content.substring(start, end)
    
    // 如果不是从开头开始，添加省略号
    if (start > 0) excerpt = '...' + excerpt
    if (end < content.length) excerpt = excerpt + '...'
    
    return cleanNoteText(excerpt)
  }
  
  // 如果没找到匹配，返回开头部分
  return getNoteExcerpt(item, {
    maxLength: 180
  })
}

// 高亮匹配文本
export function highlightMatches(text, matches) {
  if (!matches || matches.length === 0) {
    return text
  }

  let result = text
  const replacements = []

  matches.forEach(match => {
    match.indices.forEach(([start, end]) => {
      replacements.push({
        start,
        end: end + 1,
        text: text.substring(start, end + 1)
      })
    })
  })

  // 按位置倒序排序，避免替换时位置偏移
  replacements.sort((a, b) => b.start - a.start)

  replacements.forEach(({ start, end, text }) => {
    result = result.substring(0, start) + 
             `<mark>${text}</mark>` + 
             result.substring(end)
  })

  return result
}

// 保存搜索历史
export function saveSearchHistory(query) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : ''

  if (normalizedQuery.length <= 1) {
    return
  }

  const nextHistory = normalizeSearchHistory([
    normalizedQuery,
    ...getSearchHistory().filter(item => item !== normalizedQuery)
  ])

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory))
}

// 获取搜索历史
export function getSearchHistory() {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    const parsedHistory = history ? JSON.parse(history) : []
    const normalizedHistory = normalizeSearchHistory(parsedHistory)

    if (JSON.stringify(parsedHistory) !== JSON.stringify(normalizedHistory)) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(normalizedHistory))
    }

    return normalizedHistory
  } catch (error) {
    console.error('读取搜索历史失败:', error)
    return []
  }
}

// 清除搜索历史
export function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}

function normalizeSearchHistory(history) {
  if (!Array.isArray(history)) {
    return []
  }

  return history
    .map((item) => typeof item === 'string' ? item.trim() : '')
    .filter((item, index, list) => item.length > 1 && list.indexOf(item) === index)
    .slice(0, SEARCH_HISTORY_LIMIT)
}
