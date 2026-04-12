/**
 * 计算滚动进度百分比
 * @param {number} scrollTop - 当前滚动位置
 * @param {number} scrollHeight - 文档总高度
 * @param {number} clientHeight - 视口高度
 * @returns {number} 进度百分比 (0-100)
 */
export function calculateScrollProgress(scrollTop, scrollHeight, clientHeight) {
  // 参数验证
  if (typeof scrollTop !== 'number' || typeof scrollHeight !== 'number' || typeof clientHeight !== 'number') {
    console.warn('Invalid parameters for calculateScrollProgress:', { scrollTop, scrollHeight, clientHeight })
    return 0
  }
  
  // 计算可滚动距离
  const maxScroll = scrollHeight - clientHeight
  
  // 没有可滚动内容时，阅读进度应保持在起点
  if (maxScroll <= 0) {
    return 0
  }
  
  // 计算进度百分比
  let progress = (scrollTop / maxScroll) * 100

  // 确保结果在 0-100 范围内
  return Math.min(100, Math.max(0, progress))
}

/**
 * 获取文档的实际滚动信息
 * @returns {Object} 包含滚动信息的对象
 */
export function getDocumentScrollInfo() {
  const scrollTop = Math.max(
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  )
  
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight || 0,
    document.body.scrollHeight || 0
  )
  
  const clientHeight = window.innerHeight || 
    document.documentElement.clientHeight || 
    document.body.clientHeight || 0
  
  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    maxScroll: Math.max(0, scrollHeight - clientHeight)
  }
}
