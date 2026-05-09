import {
  buildBookmarkId,
  classifyBookmark
} from '../bookmarkCatalogRules.js'

describe('bookmarkCatalogRules', () => {
  test('将官方文档归入前端框架与工程化', () => {
    const result = classifyBookmark({
      title: '开始 | Vite 官方中文文档',
      url: 'https://cn.vitejs.dev/guide/',
      domain: 'cn.vitejs.dev',
      originalPath: '书签栏 / 程序网站 / 官方资料库 / 框架',
      folderTrail: ['书签栏', '程序网站', '官方资料库', '框架']
    })

    expect(result.category).toBe('前端框架与工程化')
    expect(result.type).toBe('官方文档')
    expect(result.shelf).toBe('学习资料')
  })

  test('将设计案例归入设计灵感与案例', () => {
    const result = classifyBookmark({
      title: '可视化智慧水厂- 数字孪生平台_Kay_小凯-站酷ZCOOL',
      url: 'https://www.zcool.com.cn/work/ZNzA4ODk3MDA=.html',
      domain: 'zcool.com.cn',
      originalPath: '书签栏 / 工具库 / 项目',
      folderTrail: ['书签栏', '工具库', '项目']
    })

    expect(result.category).toBe('设计灵感与案例')
    expect(result.type).toBe('案例 / 灵感')
    expect(result.shelf).toBe('灵感收藏')
  })

  test('将服务面板归入 API 面板与服务商', () => {
    const result = classifyBookmark({
      title: '云驿 - API 使用监控',
      url: 'https://yunyi.rdzhvip.com/user/dashboard',
      domain: 'yunyi.rdzhvip.com',
      originalPath: '书签栏 / Ai / API中转',
      folderTrail: ['书签栏', 'Ai', 'API中转']
    })

    expect(result.category).toBe('API 面板与服务商')
    expect(result.type).toBe('控制台 / 平台')
    expect(result.shelf).toBe('工作平台')
  })

  test('将机构登录类入口归入工作与机构入口', () => {
    const result = classifyBookmark({
      title: '登录团队 - CODING',
      url: 'https://runlan.coding.net/login?redirect=%2Fvcs%2Fdepots',
      domain: 'runlan.coding.net',
      originalPath: '书签栏 / 公司',
      folderTrail: ['书签栏', '公司']
    })

    expect(result.category).toBe('工作与机构入口')
    expect(result.type).toBe('账号 / 平台入口')
  })

  test('生成稳定且不重复的书签 id', () => {
    const usedIds = new Set()
    const firstId = buildBookmarkId({
      title: 'Vue.js - 渐进式 JavaScript 框架',
      domain: 'cn.vuejs.org'
    }, usedIds)
    const secondId = buildBookmarkId({
      title: 'Vue.js - 渐进式 JavaScript 框架',
      domain: 'cn.vuejs.org'
    }, usedIds)

    expect(firstId).toBe('cn-vuejs-org-vue-js-渐进式-javascript-框架')
    expect(secondId).toBe('cn-vuejs-org-vue-js-渐进式-javascript-框架-2')
  })
})
