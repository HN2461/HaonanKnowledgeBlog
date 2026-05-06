import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../markdown'
import {
  buildCodeLineNumbers,
  CODE_BLOCK_COLLAPSE_LINES,
  countCodeLines,
  getCodeLanguageLabel,
  normalizeCodeLanguage
} from '../markdownCodeBlocks'

describe('markdown code block helpers', () => {
  it('normalizes fence info to a safe language token', () => {
    expect(normalizeCodeLanguage('JavaScript {1,3}')).toBe('javascript')
    expect(normalizeCodeLanguage('c++')).toBe('c++')
    expect(normalizeCodeLanguage('')).toBe('')
  })

  it('counts visible code lines without double-counting the trailing fence newline', () => {
    expect(countCodeLines('const a = 1\n')).toBe(1)
    expect(countCodeLines('line 1\r\nline 2\r\n')).toBe(2)
    expect(countCodeLines('')).toBe(1)
  })

  it('builds a line-number gutter string', () => {
    expect(buildCodeLineNumbers(4)).toBe('1\n2\n3\n4')
  })

  it('returns readable language labels', () => {
    expect(getCodeLanguageLabel('javascript')).toBe('JavaScript')
    expect(getCodeLanguageLabel('js')).toBe('JavaScript')
    expect(getCodeLanguageLabel('')).toBe('纯文本')
    expect(getCodeLanguageLabel('mermaid')).toBe('mermaid')
  })
})

describe('renderMarkdown code block UI', () => {
  it('renders metadata, line numbers and collapse state for long fenced code blocks', () => {
    const longCode = Array.from(
      { length: CODE_BLOCK_COLLAPSE_LINES + 1 },
      (_, index) => `console.log(${index + 1})`
    ).join('\n')

    const html = renderMarkdown(`\`\`\`js\n${longCode}\n\`\`\``)

    expect(html).toContain('class="code-block is-collapsible is-collapsed"')
    expect(html).toContain('class="code-block__line-count">共 11 行</span>')
    expect(html).toContain('class="code-block__gutter"')
    expect(html).toContain('class="code-block__toggle"')
    expect(html).toContain('class="code-block__language">JavaScript</span>')
  })

  it('renders short indented code blocks without a collapse button', () => {
    const html = renderMarkdown('    const value = 42')

    expect(html).toContain('class="code-block"')
    expect(html).toContain('共 1 行')
    expect(html).not.toContain('code-block__toggle')
  })

  it('renders mermaid fences with a dedicated diagram container', () => {
    const html = renderMarkdown('```mermaid\ngraph TD\nA-->B\n```')

    expect(html).toContain('class="mermaid-diagram"')
    expect(html).toContain('class="mermaid"')
    expect(html).toContain('graph TD')
    expect(html).toContain('mermaid-diagram__fallback')
  })
})
