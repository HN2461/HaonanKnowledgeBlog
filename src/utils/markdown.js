import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'
import hljs from 'highlight.js/lib/common'
import {
  buildCodeLineNumbers,
  CODE_BLOCK_COLLAPSE_LINES,
  countCodeLines,
  getCodeLanguageLabel,
  normalizeCodeLanguage
} from './markdownCodeBlocks'

// 创建 Markdown 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const escapeHtml = (value) => md.utils.escapeHtml(String(value ?? ''))

function highlightCode(str, language) {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(str, { language, ignoreIllegals: true }).value
    } catch (__) {}
  }

  return escapeHtml(str)
}

function renderCodeBlock(str, info = '') {
  const language = normalizeCodeLanguage(info)
  const lineCount = countCodeLines(str)
  const lineNumbers = buildCodeLineNumbers(lineCount)
  const highlightedCode = highlightCode(str, language)
  const languageClass = language ? ` language-${escapeHtml(language)}` : ''
  const languageLabel = escapeHtml(getCodeLanguageLabel(language))
  const isCollapsible = lineCount > CODE_BLOCK_COLLAPSE_LINES
  const collapsibleClasses = isCollapsible ? ' is-collapsible is-collapsed' : ''
  const toggleButton = isCollapsible
    ? `
      <div class="code-block__collapse">
        <button type="button" class="code-block__toggle" aria-expanded="false">展开</button>
      </div>
    `
    : ''

  return `
    <div class="code-block${collapsibleClasses}" data-line-count="${lineCount}" style="--code-visible-lines: ${CODE_BLOCK_COLLAPSE_LINES};">
      <div class="code-block__header">
        <div class="code-block__meta">
          <span class="code-block__language">${languageLabel}</span>
          <span class="code-block__line-count">共 ${lineCount} 行</span>
        </div>
        <div class="code-block__actions"></div>
      </div>
      <div class="code-block__content">
        <div class="code-block__gutter" aria-hidden="true">${lineNumbers}</div>
        <div class="code-block__viewport">
          <pre class="hljs code-block__pre"><code class="code-block__code${languageClass}">${highlightedCode}</code></pre>
        </div>
        ${toggleButton}
      </div>
    </div>
  `
}

function renderMermaidBlock(str = '') {
  const diagramSource = String(str || '').trim()
  const escapedSource = escapeHtml(diagramSource)

  return `
    <figure class="mermaid-diagram">
      <div class="mermaid-diagram__canvas">
        <div class="mermaid">${escapedSource}</div>
      </div>
      <figcaption class="mermaid-diagram__error">图表渲染失败，已回退为源码展示。</figcaption>
      <pre class="hljs mermaid-diagram__fallback"><code>${escapedSource}</code></pre>
    </figure>
  `
}

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

md.renderer.rules.fence = function (tokens, idx) {
  const token = tokens[idx]
  const language = normalizeCodeLanguage(token.info)

  if (language === 'mermaid') {
    return renderMermaidBlock(token.content)
  }

  return renderCodeBlock(token.content, token.info)
}

md.renderer.rules.code_block = function (tokens, idx) {
  return renderCodeBlock(tokens[idx].content)
}

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
