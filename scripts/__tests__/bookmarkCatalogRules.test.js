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

  test('将服务面板归入 AI API 与服务商', () => {
    const result = classifyBookmark({
      title: '云驿 - API 使用监控',
      url: 'https://yunyi.rdzhvip.com/user/dashboard',
      domain: 'yunyi.rdzhvip.com',
      originalPath: '书签栏 / Ai / API中转',
      folderTrail: ['书签栏', 'Ai', 'API中转']
    })

    expect(result.category).toBe('AI API 与服务商')
    expect(result.type).toBe('控制台 / 服务')
    expect(result.shelf).toBe('工作平台')
  })

  test('将机构登录类入口归入个人 / 工作 / 校园入口', () => {
    const result = classifyBookmark({
      title: '登录团队 - CODING',
      url: 'https://runlan.coding.net/login?redirect=%2Fvcs%2Fdepots',
      domain: 'runlan.coding.net',
      originalPath: '书签栏 / 公司',
      folderTrail: ['书签栏', '公司']
    })

    expect(result.category).toBe('个人 / 工作 / 校园入口')
    expect(result.type).toBe('账号 / 平台入口')
  })

  test('将 CSDN 社区入口归入开发社区与代码托管', () => {
    const result = classifyBookmark({
      title: 'CSDN_专业开发者社区_已接入DeepSeekR1满血版',
      url: 'https://www.csdn.net/',
      domain: 'csdn.net',
      originalPath: '书签栏',
      folderTrail: ['书签栏']
    })

    expect(result.category).toBe('开发社区与代码托管')
    expect(result.type).toBe('社区 / 导航')
  })

  test('将 DCloud 文档归入移动端与开放平台', () => {
    const result = classifyBookmark({
      title: 'uni-app快速上手 | uni-app官网',
      url: 'https://uniapp.dcloud.net.cn/',
      domain: 'uniapp.dcloud.net.cn',
      originalPath: '书签栏 / 移动端',
      folderTrail: ['书签栏', '移动端']
    })

    expect(result.category).toBe('移动端与开放平台')
    expect(result.type).toBe('官方文档')
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
