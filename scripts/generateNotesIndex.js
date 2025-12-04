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
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { data: frontmatter, content: markdownContent } = matter(content)
      
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

      items.push({
        type: 'file',
        title: frontmatter.title || file.replace('.md', ''),
        filename: file,
        path: relPath,
        date: frontmatter.date || stat.mtime.toISOString().split('T')[0],
        tags: frontmatter.tags || [],
        category: frontmatter.category || relativePath.split('/')[0] || '未分类',
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
  
  // 对每个分类下的笔记进行排序
  Object.values(categories).forEach(category => {
    category.notes = smartSort(category.notes, (item) => item.filename);
  });
  
  return Object.values(categories)
}

// 主函数
function generateIndex() {
  console.log('开始生成笔记索引...')
  console.log(`扫描目录: ${NOTES_DIR}`)

  const items = scanDirectory(NOTES_DIR)
  const allNotes = flattenNotes(items)
  const categories = generateCategories(items)

  // 按日期排序笔记
  allNotes.sort((a, b) => new Date(b.date) - new Date(a.date))

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
