/**
 * 字体大小 localStorage 工具
 */

const STORAGE_KEY = 'article-font-size'
const DESKTOP_DEFAULT_FONT_SIZE = 17
const MOBILE_DEFAULT_FONT_SIZE = 16
const MOBILE_BREAKPOINT = 768
const DEFAULT_FONT_SIZE = DESKTOP_DEFAULT_FONT_SIZE
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 24

/**
 * 获取默认字体大小
 * @param {number} viewportWidth - 视口宽度
 * @returns {number} 默认字体大小（像素）
 */
export function getDefaultFontSize(viewportWidth) {
  const width = typeof viewportWidth === 'number'
    ? viewportWidth
    : (typeof window !== 'undefined' ? window.innerWidth : MOBILE_BREAKPOINT + 1)

  return width <= MOBILE_BREAKPOINT ? MOBILE_DEFAULT_FONT_SIZE : DESKTOP_DEFAULT_FONT_SIZE
}

/**
 * 获取保存的字体大小
 * @returns {number} 字体大小（像素）
 */
export function getFontSize(viewportWidth) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      return getDefaultFontSize(viewportWidth)
    }
    
    const size = parseInt(saved, 10)
    
    // 验证是否为有效值
    if (isNaN(size) || size < MIN_FONT_SIZE || size > MAX_FONT_SIZE) {
      return getDefaultFontSize(viewportWidth)
    }
    
    return size
  } catch (e) {
    // localStorage 不可用时返回默认值
    return getDefaultFontSize(viewportWidth)
  }
}

/**
 * 保存字体大小
 * @param {number} size - 字体大小（像素）
 * @returns {boolean} 是否保存成功
 */
export function setFontSize(size) {
  try {
    // 确保值在有效范围内
    const validSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size))
    localStorage.setItem(STORAGE_KEY, String(validSize))
    return true
  } catch (e) {
    // localStorage 不可用
    return false
  }
}

/**
 * 增加字体大小
 * @param {number} currentSize - 当前字体大小
 * @param {number} step - 增加步长，默认 2
 * @returns {number} 新的字体大小
 */
export function increaseFontSize(currentSize, step = 2) {
  return Math.min(currentSize + step, MAX_FONT_SIZE)
}

/**
 * 减小字体大小
 * @param {number} currentSize - 当前字体大小
 * @param {number} step - 减小步长，默认 2
 * @returns {number} 新的字体大小
 */
export function decreaseFontSize(currentSize, step = 2) {
  return Math.max(currentSize - step, MIN_FONT_SIZE)
}

/**
 * 重置为默认字体大小（按视口断点）
 * @param {number} viewportWidth - 视口宽度
 * @returns {number} 默认字体大小
 */
export function resetFontSize(viewportWidth) {
  const defaultSize = getDefaultFontSize(viewportWidth)
  setFontSize(defaultSize)
  return defaultSize
}

// 导出常量
export {
  DEFAULT_FONT_SIZE,
  DESKTOP_DEFAULT_FONT_SIZE,
  MOBILE_DEFAULT_FONT_SIZE,
  MOBILE_BREAKPOINT,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  STORAGE_KEY
}
