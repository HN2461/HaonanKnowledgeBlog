/**
 * 阅读位置状态管理工具
 * @description 用于保存和恢复用户在文章中的阅读位置
 * @author Cascade AI
 * @version 1.0.0
 */

const STORAGE_KEY = 'reading-positions'
const POSITION_DEBOUNCE_TIME = 500 // 0.5秒防抖，更快响应
const MAX_POSITIONS = 100 // 最多保存100篇文章的阅读位置
const POSITION_THRESHOLD = 50 // 滚动位置变化阈值（px）

/**
 * 获取所有已保存的阅读位置
 * @returns {Object} 阅读位置对象 {[articlePath]: {position, timestamp, title}}
 */
export function getAllReadingPositions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to get reading positions:', error)
    return {}
  }
}

/**
 * 保存文章的阅读位置
 * @param {string} articlePath - 文章路径（唯一标识）
 * @param {number} position - 滚动位置
 * @param {string} title - 文章标题（可选）
 * @param {number} totalHeight - 文档总高度（可选）
 */
export function saveReadingPosition(articlePath, position, title = '', totalHeight = 0) {
  try {
    if (!articlePath || position < 0) return

    const positions = getAllReadingPositions()
    const timestamp = Date.now()
    
    // 检查位置变化是否足够大
    if (positions[articlePath] && 
        Math.abs(positions[articlePath].position - position) < POSITION_THRESHOLD) {
      return
    }

    // 更新位置信息
    positions[articlePath] = {
      position,
      timestamp,
      title,
      totalHeight,
      percentage: totalHeight > 0 ? Math.round((position / totalHeight) * 100) : 0
    }

    // 清理旧记录，保持记录数量在限制内
    const entries = Object.entries(positions)
    if (entries.length > MAX_POSITIONS) {
      // 按时间戳排序，删除最旧的记录
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
      const cleanedPositions = Object.fromEntries(entries.slice(0, MAX_POSITIONS))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedPositions))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    }
    
    // 调试信息
    if (import.meta.env.DEV) {
      console.debug(`Reading position saved: ${articlePath} -> ${position}px (${positions[articlePath].percentage}%)`)
    }
  } catch (error) {
    console.error('Failed to save reading position:', error)
  }
}

/**
 * 获取文章的已保存阅读位置
 * @param {string} articlePath - 文章路径
 * @returns {Object|null} 位置信息对象或null
 */
export function getReadingPosition(articlePath) {
  try {
    if (!articlePath) return null
    
    const positions = getAllReadingPositions()
    const position = positions[articlePath]
    
    if (position) {
      // 检查记录是否过期（30天）
      const daysSinceRead = (Date.now() - position.timestamp) / (1000 * 60 * 60 * 24)
      if (daysSinceRead > 30) {
        // 删除过期记录
        deleteReadingPosition(articlePath)
        return null
      }
      return position
    }
    
    return null
  } catch (error) {
    console.error('Failed to get reading position:', error)
    return null
  }
}

/**
 * 删除文章的阅读位置记录
 * @param {string} articlePath - 文章路径
 */
export function deleteReadingPosition(articlePath) {
  try {
    const positions = getAllReadingPositions()
    if (positions[articlePath]) {
      delete positions[articlePath]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    }
  } catch (error) {
    console.error('Failed to delete reading position:', error)
  }
}

/**
 * 清空所有阅读位置记录
 */
export function clearAllReadingPositions() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear reading positions:', error)
  }
}

/**
 * 创建防抖的保存函数
 * @param {string} articlePath - 文章路径
 * @param {string} title - 文章标题
 * @returns {Function} 防抖的保存函数
 */
export function createDebouncedSave(articlePath, title = '') {
  let timeoutId = null
  
  return function(position, totalHeight = 0) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      console.log(`🔄 防抖延迟后执行保存: ${articlePath} -> ${position}px`)
      saveReadingPosition(articlePath, position, title, totalHeight)
    }, POSITION_DEBOUNCE_TIME)
  }
}

/**
 * 获取阅读位置统计信息
 * @returns {Object} 统计信息
 */
export function getReadingStats() {
  try {
    const positions = getAllReadingPositions()
    const entries = Object.entries(positions)
    
    return {
      totalArticles: entries.length,
      recentArticles: entries
        .filter(([, data]) => (Date.now() - data.timestamp) < 7 * 24 * 60 * 60 * 1000) // 7天内
        .length,
      articlesWithProgress: entries
        .filter(([, data]) => data.percentage > 10 && data.percentage < 90)
        .length
    }
  } catch (error) {
    console.error('Failed to get reading stats:', error)
    return {
      totalArticles: 0,
      recentArticles: 0,
      articlesWithProgress: 0
    }
  }
}

/**
 * 获取最近阅读的文章列表
 * @param {number} limit - 返回数量限制
 * @returns {Array} 最近阅读的文章列表
 */
export function getRecentReadingList(limit = 10) {
  try {
    const positions = getAllReadingPositions()
    const entries = Object.entries(positions)
    
    return entries
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, limit)
      .map(([path, data]) => ({
        path,
        title: data.title || '无标题',
        percentage: data.percentage,
        timestamp: data.timestamp,
        readTime: new Date(data.timestamp).toLocaleString()
      }))
  } catch (error) {
    console.error('Failed to get recent reading list:', error)
    return []
  }
}

/**
 * 检查是否有保存的阅读位置
 * @param {string} articlePath - 文章路径
 * @returns {boolean} 是否有保存的位置
 */
export function hasReadingPosition(articlePath) {
  return getReadingPosition(articlePath) !== null
}

/**
 * 格式化阅读位置信息用于显示
 * @param {string} articlePath - 文章路径
 * @returns {string|null} 格式化的位置信息
 */
export function formatReadingPosition(articlePath) {
  const position = getReadingPosition(articlePath)
  if (!position) return null
  
  const daysAgo = Math.floor((Date.now() - position.timestamp) / (1000 * 60 * 60 * 24))
  const timeText = daysAgo === 0 ? '今天' : 
                  daysAgo === 1 ? '昨天' : 
                  daysAgo < 7 ? `${daysAgo}天前` : 
                  new Date(position.timestamp).toLocaleDateString()
  
  return `上次阅读至 ${position.percentage}% (${timeText})`
}
