import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'
import hljs from 'highlight.js'

// 创建 Markdown 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 统一的 slugify 函数
const slugify = (s) => {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')           // 空格转为连字符
    .replace(/[^\w\u4e00-\u9fa5\-]/g, '') // 保留中文、字母、数字、连字符
    .replace(/\-+/g, '-')           // 多个连字符合并为一个
    .replace(/^\-|\-$/g, '')        // 移除首尾的连字符
}

// 添加插件
md.use(anchor, {
  slugify: slugify,
  permalink: false,  // 不添加永久链接，只添加 id
  level: [1, 2, 3, 4, 5, 6]  // 为所有级别的标题添加 id
})

md.use(toc, {
  containerClass: 'table-of-contents',
  listType: 'ul',
  level: [2, 3, 4]
})

// 自定义渲染规则
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const aIndex = tokens[idx].attrIndex('target')
  
  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank'])
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank'
  }

  return defaultRender(tokens, idx, options, env, self)
}

// 图片懒加载
md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  const src = token.attrs[srcIndex][1]
  const alt = token.content
  const title = token.attrGet('title') || ''

  return `<img src="${src}" alt="${alt}" title="${title}" loading="lazy" />`
}

// 渲染 Markdown
export function renderMarkdown(content) {
  return md.render(content)
}

// 提取目录
export function extractTOC(content) {
  const tokens = md.parse(content, {})
  const toc = []
  
  tokens.forEach(token => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1))
      const nextToken = tokens[tokens.indexOf(token) + 1]
      if (nextToken && nextToken.type === 'inline') {
        const text = nextToken.content
        const slug = slugify(text)
        toc.push({
          level,
          text,
          slug
        })
      }
    }
  })
  
  return toc
}

export default md
