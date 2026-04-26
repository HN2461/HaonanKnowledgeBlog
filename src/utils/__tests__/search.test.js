import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearSearchHistory,
  getSearchHistory,
  getSearchTerms,
  highlightSearchText,
  initSearch,
  saveSearchHistory,
  searchNotes
} from '@/utils/search'

const notes = [
  {
    title: 'Vue 路由 hash 模式排查',
    frontmatterTitle: 'Vue 路由 hash 模式排查',
    fileTitle: 'Vue 路由 hash 模式排查',
    filename: 'Vue 路由 hash 模式排查.md',
    path: '前端/Vue/路由/Vue 路由 hash 模式排查.md',
    category: '前端',
    tags: ['vue-router', 'hash'],
    description: '处理 hash history 下的 query 空格丢失问题',
    content: '这篇笔记记录 hash history、query 参数与空格编码的排查过程。',
    wordCount: 200
  },
  {
    title: '钉钉扫码绑定方案',
    frontmatterTitle: '钉钉扫码绑定方案',
    fileTitle: '钉钉扫码绑定方案',
    filename: '钉钉扫码绑定方案.md',
    path: 'uni-app/第三方登录/01-钉钉/02-PC微应用/钉钉扫码绑定方案.md',
    category: 'uni-app',
    tags: ['扫码绑定'],
    description: 'PC 微应用账号绑定实现',
    content: '这里整理桌面钉钉扫码绑定链路。',
    wordCount: 200
  },
  {
    title: '企业微信 JSSDK 签名流程',
    frontmatterTitle: '企业微信 JSSDK 签名流程',
    fileTitle: '企业微信 JSSDK 签名流程',
    filename: '企业微信 JSSDK 签名流程.md',
    path: 'uni-app/第三方登录/02-企业微信/01-H5微应用/企业微信 JSSDK 签名流程.md',
    category: 'uni-app',
    tags: ['jssdk'],
    description: '企业微信 H5 微应用签名',
    content: '包含 agentConfig 和签名调试记录。',
    wordCount: 200
  },
  {
    title: 'Webpack cannot resolve module',
    frontmatterTitle: 'Webpack cannot resolve module',
    fileTitle: 'Webpack cannot resolve module',
    filename: 'Webpack cannot resolve module.md',
    path: '前端/Webpack/Webpack cannot resolve module.md',
    category: '前端',
    tags: ['webpack'],
    description: 'cannot resolve module 报错排查',
    content: '遇到 cannot resolve module 时，先检查 alias 和扩展名。',
    wordCount: 200
  }
]

describe('search', () => {
  beforeEach(() => {
    initSearch(notes, { allNotes: notes })
    clearSearchHistory()
  })

  it('supports multi-term queries split by spaces', () => {
    const results = searchNotes('hash 空格')

    expect(results[0]?.title).toBe('Vue 路由 hash 模式排查')
  })

  it('can match directory fragments from note path', () => {
    const results = searchNotes('钉钉 PC微应用', 'AND')

    expect(results[0]?.title).toBe('钉钉扫码绑定方案')
  })

  it('supports fuzzy fallback when exact phrase is incomplete', () => {
    const results = searchNotes('cannot resolv module')

    expect(results[0]?.title).toBe('Webpack cannot resolve module')
  })

  it('supports AND and OR mode with multiple topics', () => {
    const andResults = searchNotes('钉钉,企业微信', 'AND')
    const orResults = searchNotes('钉钉,企业微信', 'OR')

    expect(andResults).toHaveLength(0)
    expect(orResults.map((item) => item.title)).toEqual(
      expect.arrayContaining(['钉钉扫码绑定方案', '企业微信 JSSDK 签名流程'])
    )
  })

  it('highlights each matched term instead of only the full query', () => {
    const highlighted = highlightSearchText('hash query 空格问题', 'hash query')

    expect(highlighted).toContain('<mark>hash</mark>')
    expect(highlighted).toContain('<mark>query</mark>')
  })

  it('normalizes search terms and history entries', () => {
    saveSearchHistory(' hash 空格 ')
    saveSearchHistory('钉钉')
    saveSearchHistory('hash 空格')

    expect(getSearchTerms('hash 空格, 钉钉')).toEqual(['hash', '空格', '钉钉'])
    expect(getSearchHistory()).toEqual(['hash 空格', '钉钉'])
  })
})
