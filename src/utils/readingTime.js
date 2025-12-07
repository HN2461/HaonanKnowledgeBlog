/**
 * 阅读时间计算工具
 * 基于中文阅读速度 200 字/分钟，代码阅读速度 100 字符/分钟
 */

/**
 * 提取代码块内容
 * @param {string} content - Markdown 内容
 * @returns {string[]} 代码块数组
 */
export function extractCodeBlocks(content) {
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g
  const matches = content.match(codeBlockRegex)
  return matches || []
}

/**
 * 计算代码块中的字符数
 * @param {string} content - Markdown 内容
 * @returns {number} 代码字符总数
 */
export function countCodeCharacters(content) {
  const codeBlocks = extractCodeBlocks(content)
  return codeBlocks.reduce((total, block) => {
    // 移除代码块标记 ``` 或 `
    const code = block.replace(/^```[\w]*\n?|```$/g, '').replace(/^`|`$/g, '')
    return total + code.length
  }, 0)
}

/**
 * 计算普通文本字数（排除代码块）
 * @param {string} content - Markdown 内容
 * @returns {number} 普通文本字数
 */
export function countWords(content) {
  // 移除代码块
  let text = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]+`/g, '')
  
  // 移除 Markdown 语法标记
  text = text
    .replace(/#{1,6}\s/g, '')           // 标题
    .replace(/\*\*|__/g, '')            // 粗体
    .replace(/\*|_/g, '')               // 斜体
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')   // 图片
    .replace(/>\s/g, '')                // 引用
    .replace(/[-*+]\s/g, '')            // 无序列表
    .replace(/\d+\.\s/g, '')            // 有序列表
    .replace(/\|/g, '')                 // 表格
    .replace(/---+/g, '')               // 分割线
    .replace(/\s+/g, '')                // 空白字符
  
  return text.length
}

/**
 * 计算预计阅读时间
 * @param {string} content - Markdown 内容
 * @param {Object} options - 配置选项
 * @param {number} options.wordsPerMinute - 中文阅读速度，默认 200
 * @param {number} options.codeCharsPerMinute - 代码阅读速度，默认 100
 * @returns {number} 预计阅读时间（分钟），最小为 1
 */
export function calculateReadingTime(content, options = {}) {
  const { wordsPerMinute = 200, codeCharsPerMinute = 100 } = options
  
  if (!content || typeof content !== 'string') {
    return 1
  }
  
  const wordCount = countWords(content)
  const codeCharCount = countCodeCharacters(content)
  
  const textMinutes = wordCount / wordsPerMinute
  const codeMinutes = codeCharCount / codeCharsPerMinute
  
  const totalMinutes = Math.ceil(textMinutes + codeMinutes)
  
  return Math.max(1, totalMinutes)
}
