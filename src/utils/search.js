import Fuse from 'fuse.js'

let fuseInstance = null

// 初始化搜索引擎
export function initSearch(notes) {
  const options = {
    keys: [
      { name: 'title', weight: 0.3 },        // 标题权重最高
      { name: 'content', weight: 0.4 },      // 内容权重最高，这是关键改进
      { name: 'description', weight: 0.15 }, // 描述权重
      { name: 'tags', weight: 0.1 },        // 标签权重
      { name: 'category', weight: 0.05 }     // 分类权重最低
    ],
    threshold: 0.3,        // 降低阈值，提高搜索敏感度
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1, // 降低最小匹配长度
    distance: 1000,        // 增加搜索距离，允许更模糊的匹配
    ignoreLocation: true,  // 忽略位置，在整个文本中搜索
    findAllMatches: true   // 查找所有匹配项
  }

  fuseInstance = new Fuse(notes, options)
  return fuseInstance
}

// 搜索笔记
export function searchNotes(query) {
  if (!fuseInstance) {
    console.warn('搜索引擎未初始化')
    return []
  }

  if (!query || query.trim() === '') {
    return []
  }

  const trimmedQuery = query.trim()
  
  // 多重搜索策略
  let results = []
  
  // 1. 精确搜索（完整匹配）
  const exactResults = fuseInstance.search(`"${trimmedQuery}"`)
  
  // 2. 普通模糊搜索
  const fuzzyResults = fuseInstance.search(trimmedQuery)
  
  // 3. 分词搜索（对于中文和多词查询）
  const words = trimmedQuery.split(/[\s\u3000]+/).filter(word => word.length > 0)
  let wordResults = []
  if (words.length > 1) {
    words.forEach(word => {
      const wordMatches = fuseInstance.search(word)
      wordResults = wordResults.concat(wordMatches)
    })
  }
  
  // 合并并去重结果
  const allResults = [...exactResults, ...fuzzyResults, ...wordResults]
  const uniqueResults = []
  const seenPaths = new Set()
  
  allResults.forEach(result => {
    if (!seenPaths.has(result.item.path)) {
      seenPaths.add(result.item.path)
      
      // 计算增强的相关性得分
      const relevanceScore = calculateRelevanceScore(result, trimmedQuery)
      
      uniqueResults.push({
        ...result.item,
        score: result.score,
        matches: result.matches,
        relevanceScore: relevanceScore,
        matchedContent: extractMatchedContent(result.item, trimmedQuery)
      })
    }
  })
  
  // 按相关性得分排序
  return uniqueResults
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 50) // 限制最多50个结果
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
  if (!item.content) return item.description || ''
  
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
    
    return excerpt
  }
  
  // 如果没找到匹配，返回开头部分
  return content.substring(0, 200) + (content.length > 200 ? '...' : '')
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
  const history = getSearchHistory()
  
  // 移除重复项
  const filtered = history.filter(item => item !== query)
  
  // 添加到开头
  filtered.unshift(query)
  
  // 只保留最近10条
  const limited = filtered.slice(0, 10)
  
  localStorage.setItem('search-history', JSON.stringify(limited))
}

// 获取搜索历史
export function getSearchHistory() {
  try {
    const history = localStorage.getItem('search-history')
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('读取搜索历史失败:', error)
    return []
  }
}

// 清除搜索历史
export function clearSearchHistory() {
  localStorage.removeItem('search-history')
}
