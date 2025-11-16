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

// 递归扫描目录
function scanDirectory(dir, relativePath = '') {
  const items = []
  
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`)
    return items
  }

  const files = fs.readdirSync(dir)

  files.forEach(file => {
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

      items.push({
        type: 'file',
        title: frontmatter.title || file.replace('.md', ''),
        filename: file,
        path: relPath,
        date: frontmatter.date || stat.mtime.toISOString().split('T')[0],
        tags: frontmatter.tags || [],
        category: frontmatter.category || relativePath.split('/')[0] || '未分类',
        description: frontmatter.description || excerpt,
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
