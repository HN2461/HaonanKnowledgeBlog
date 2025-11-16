import Fuse from 'fuse.js'

let fuseInstance = null

// 初始化搜索引擎
export function initSearch(notes) {
  const options = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 }
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2
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

  const results = fuseInstance.search(query)
  return results.map(result => ({
    ...result.item,
    score: result.score,
    matches: result.matches
  }))
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
