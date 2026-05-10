const CATEGORY_DEFINITIONS = [
  {
    name: 'AI 模型与对话',
    description: '直接开聊、切模型、看开放平台能力时先回这一组'
  },
  {
    name: 'AI 编程与 Agent',
    description: 'Codex、Claude Code、OpenClaw、AI 工作流资料集中放这里'
  },
  {
    name: 'AI API 与服务商',
    description: '中转、监控、续费、小店和服务商后台入口统一收在这里'
  },
  {
    name: '前端框架与工程化',
    description: 'Vue、Vite、React、工程脚手架和构建配置资料'
  },
  {
    name: 'UI 组件与样式',
    description: '组件库、图表库、样式方案和交互引擎相关入口'
  },
  {
    name: '地图与地理服务',
    description: '地图展示、地理编码、轨迹和控制台相关资料'
  },
  {
    name: '可视化 / 3D / 动画',
    description: 'Three.js、数字孪生、3D 素材和动画资源'
  },
  {
    name: '移动端与开放平台',
    description: 'uni-app、小程序、企业微信、钉钉、Flutter 相关入口'
  },
  {
    name: '后端 / 数据库 / 接口',
    description: 'Koa、Mongoose、MQTT、接口文档和服务端资料'
  },
  {
    name: '开发文档与教程',
    description: 'MDN、教程站、博客文章和实战讲解集中放这里'
  },
  {
    name: '开发社区与代码托管',
    description: 'GitHub、Gitee、CSDN、LinuxDo 和导航社区入口'
  },
  {
    name: '设计灵感与案例',
    description: '后台、小程序、数字孪生、UI 风格案例与灵感收集'
  },
  {
    name: '在线工具与效率',
    description: '二维码、JSON、流程图、转换工具和日常效率网站'
  },
  {
    name: '网络 / VPN / 云服务',
    description: '机场、代理客户端、云服务和网络辅助工具'
  },
  {
    name: '个人 / 工作 / 校园入口',
    description: '个人站点、账号后台、校园政务和日常登录入口'
  }
]

const CATEGORY_ORDER = CATEGORY_DEFINITIONS.map((item) => item.name)
const CATEGORY_BY_NAME = new Map(CATEGORY_DEFINITIONS.map((item) => [item.name, item]))

const SHELF_ORDER = ['学习资料', '工作平台', '灵感收藏']
const TYPE_ORDER = ['官方文档', '教程 / 文章', '社区 / 导航', '控制台 / 服务', '账号 / 平台入口', '案例 / 灵感', '工具 / 素材']

const AI_MODEL_DOMAINS = new Set([
  'chatgpt.com',
  'chat.deepseek.com',
  'gemini.google.com',
  'grok.com',
  'kimi.com',
  'longcat.chat',
  'minimax.io',
  'agent.minimaxi.com',
  'open.bigmodel.cn',
  'platform.xiaomimimo.com'
])

const AI_CODING_DOMAINS = new Set([
  'code.claude.com',
  'claudecode.tangshuang.net',
  'developers.openai.com',
  'docs.packyapi.com',
  'openclaw101.dev',
  'clawd.org.cn',
  'orchids.app',
  'skillsmp.com'
])

const AI_SERVICE_DOMAINS = new Set([
  'pay.ldxp.cn',
  'pay.qxvx.cn',
  'fe.dtyuedan.cn',
  'ai.rpcod.com',
  'proxyhub.jzzcg.com',
  'yfy.zhouyang168.top',
  'yunyi.rdzhvip.com',
  'yfy-status.5imh.xyz',
  'api.lumio.games',
  'ai.jiexi6.cn',
  'deepl.micosoft.icu'
])

const FRONTEND_DOMAINS = new Set([
  'cn.vuejs.org',
  'cn.vite.dev',
  'cn.vitejs.dev',
  'vueuse.org',
  'vueuse.nodejs.cn',
  'pure-admin.cn',
  'doc.vben.pro',
  'docs.naiveadmin.com',
  'zh-hans.react.dev',
  'quanzhan.co',
  'lodashjs.com',
  'nvm.uihtm.com'
])

const UI_DOMAINS = new Set([
  'element-plus.org',
  'element.eleme.cn',
  'antdv.com',
  'vant-ui.github.io',
  'uviewui.com',
  'uvui.cn',
  'cn.windicss.org',
  'tailwindcss.com',
  'iconfont.cn',
  'echarts.apache.org',
  'isqqw.com',
  '07.logic-flow.cn',
  'x6.antv.vision',
  'animate.style',
  'limeui.qcoon.cn',
  'naiveui.com',
  'sortablejs.com'
])

const MAP_DOMAINS = new Set([
  'lbs.amap.com',
  'console.amap.com',
  'lbs.qq.com',
  'lbs.tianditu.gov.cn',
  'openlayers.org'
])

const VISUAL_DOMAINS = new Set([
  'threejs.org',
  'yanhuangxueyuan.com',
  'webgl3d.cn',
  'docs.icegl.cn',
  'mixamo.com'
])

const MOBILE_DOMAINS = new Set([
  'developer.work.weixin.qq.com',
  'developers.weixin.qq.com',
  'mp.weixin.qq.com',
  'work.weixin.qq.com',
  'open.dingtalk.com',
  'docs.flutter.cn',
  'dev.dcloud.net.cn',
  'ext.dcloud.net.cn',
  'uniapp.dcloud.net.cn',
  'developer.huawei.com',
  'qiyeweixin.apifox.cn',
  'foooor.com'
])

const BACKEND_DOMAINS = new Set([
  'mongoosejs.com',
  'itying.com',
  'api.qingnian8.com',
  'emqx.com'
])

const DOC_DOMAINS = new Set([
  'developer.mozilla.org',
  'm.w3cschool.cn',
  'runoob.com',
  'muyiy.cn',
  'cnblogs.com',
  'jb51.net',
  'bilibili.com'
])

const COMMUNITY_DOMAINS = new Set([
  'github.com',
  'gitee.com',
  'linux.do',
  'csdn.net',
  'open-vsx.org',
  'ai-bot.cn',
  'aigc.izzi.cn'
])

const DESIGN_DOMAINS = new Set([
  'zcool.com.cn',
  'uiverse.io',
  'stitch.withgoogle.com',
  'evolink.ai'
])

const TOOL_DOMAINS = new Set([
  'cli.im',
  'downforeveryoneorjustme.com',
  'bejson.com',
  'fly63.com',
  'colordrop.io',
  'quicklypdf.com',
  'processon.com',
  'whatsmyip.com',
  'zh.ifixit.com',
  'sayodevice.com',
  'camscape.com',
  'youtube.com'
])

const NETWORK_DOMAINS = new Set([
  'clash-verge.org',
  'youxin55.net',
  'user.dg5.biz',
  'jichang.pro',
  'xn--mes358aby2apfg.com',
  'ikuuu.nl',
  'ikuuu.win',
  'ikuuu.li',
  'xn--4gq62f.org',
  '13.212.175.5',
  'main.cute-cloud.de',
  'secure.shadowsocks.au'
])

const PERSONAL_DOMAINS = new Set([
  'eloans.ahrcu.com',
  'ahzwfw.gov.cn',
  'admin.runlan.ltd',
  'runlan.coding.net',
  'co.gocheck.cn',
  '2925.com',
  'ai.92xx.vip',
  'hn2461.github.io',
  'yuque.com',
  'qmjianli.com',
  'fanqienovel.com',
  'stu.tlu.edu.cn',
  'zhipin.com',
  'secure.rezserver.com'
])

const TAG_DEFINITIONS = [
  { tag: 'ChatGPT', keywords: ['chatgpt', 'openai'] },
  { tag: 'DeepSeek', keywords: ['deepseek'] },
  { tag: 'Gemini', keywords: ['gemini'] },
  { tag: 'Kimi', keywords: ['kimi'] },
  { tag: 'MiniMax', keywords: ['minimax'] },
  { tag: 'Codex', keywords: ['codex'] },
  { tag: 'Claude Code', keywords: ['claude code'] },
  { tag: 'OpenClaw', keywords: ['openclaw', 'clawd'] },
  { tag: 'Vue', keywords: ['vue'] },
  { tag: 'Vite', keywords: ['vite'] },
  { tag: 'React', keywords: ['react'] },
  { tag: 'Tailwind', keywords: ['tailwind'] },
  { tag: 'Element Plus', keywords: ['element plus'] },
  { tag: 'ECharts', keywords: ['echarts'] },
  { tag: 'Three.js', keywords: ['three.js', 'threejs'] },
  { tag: 'uni-app', keywords: ['uni-app', 'uniapp'] },
  { tag: '微信生态', keywords: ['微信', '企业微信', 'weixin', 'wecom'] },
  { tag: 'Flutter', keywords: ['flutter'] },
  { tag: 'VPN', keywords: ['vpn', '机场', '代理'] }
]

const GENERIC_FOLDER_TAGS = new Set([
  '书签栏',
  '程序网站',
  '官方资料库',
  '技术文档',
  '开发',
  '工具库',
  '辅助工具',
  '其他小工具',
  '项目',
  'ui',
  'ai',
  '框架',
  '移动端'
])

function normalizeText(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
}

function includesAny(source = '', keywords = []) {
  return keywords.some((keyword) => source.includes(normalizeText(keyword)))
}

function pushUnique(list, value) {
  const normalizedValue = String(value || '').trim()
  if (!normalizedValue || list.includes(normalizedValue)) {
    return
  }

  list.push(normalizedValue)
}

function orderIndex(list = [], value = '') {
  const index = list.indexOf(value)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function getFolderTrail(entry = {}) {
  return Array.isArray(entry.folderTrail) ? entry.folderTrail.filter(Boolean) : []
}

function buildMatchText(entry = {}) {
  return normalizeText([
    entry.title,
    entry.url,
    entry.domain,
    entry.originalPath,
    ...getFolderTrail(entry)
  ].join(' '))
}

function getCategoryDefinition(name = '') {
  return CATEGORY_BY_NAME.get(name) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1]
}

function trailIncludes(folderTrail = [], keywords = []) {
  const normalizedTrail = folderTrail.map((segment) => normalizeText(segment))
  return normalizedTrail.some((segment) => includesAny(segment, keywords))
}

function getDomain(entry = {}) {
  return normalizeText(entry.domain)
}

function isOfficialDoc(entry = {}, matchText = '') {
  const domain = getDomain(entry)

  if (
    domain === 'developers.openai.com' ||
    domain === 'code.claude.com' ||
    domain === 'docs.packyapi.com' ||
    domain === 'uniapp.dcloud.net.cn' ||
    domain === 'dev.dcloud.net.cn' ||
    domain === 'developers.weixin.qq.com' ||
    domain === 'developer.work.weixin.qq.com' ||
    domain === 'open.dingtalk.com' ||
    domain === 'docs.flutter.cn'
  ) {
    return true
  }

  if (
    FRONTEND_DOMAINS.has(domain) ||
    UI_DOMAINS.has(domain) ||
    MAP_DOMAINS.has(domain) ||
    MOBILE_DOMAINS.has(domain) ||
    BACKEND_DOMAINS.has(domain) ||
    VISUAL_DOMAINS.has(domain)
  ) {
    return includesAny(matchText, [
      '官方',
      'docs',
      'guide',
      '开发者中心',
      '开发',
      'overview',
      '介绍',
      '开始',
      '开放文档',
      '概述',
      '文档'
    ])
  }

  return includesAny(matchText, ['官方', 'docs', 'guide', 'overview', 'quickstart', '开发者中心', '开放文档'])
}

function resolveCategory(entry = {}, matchText = '') {
  const folderTrail = getFolderTrail(entry)
  const domain = getDomain(entry)

  if (domain === 'csdn.net') {
    return getCategoryDefinition('开发社区与代码托管')
  }

  if (domain === 'languagereactor.com') {
    return getCategoryDefinition('在线工具与效率')
  }

  if (domain === 'my.feishu.cn') {
    return getCategoryDefinition('AI 编程与 Agent')
  }

  if (domain === 'skillsmp.com') {
    return getCategoryDefinition('AI 编程与 Agent')
  }

  if (AI_SERVICE_DOMAINS.has(domain) || trailIncludes(folderTrail, ['api中转', '商家店铺'])) {
    return getCategoryDefinition('AI API 与服务商')
  }

  if (AI_CODING_DOMAINS.has(domain) || trailIncludes(folderTrail, ['ai编辑器', 'claude code', 'codex', 'openclaw', '卖家文档'])) {
    return getCategoryDefinition('AI 编程与 Agent')
  }

  if (AI_MODEL_DOMAINS.has(domain) || trailIncludes(folderTrail, ['国内ai', '国外ai'])) {
    return getCategoryDefinition('AI 模型与对话')
  }

  if (DESIGN_DOMAINS.has(domain) || trailIncludes(folderTrail, ['ui'])) {
    return getCategoryDefinition('设计灵感与案例')
  }

  if (MAP_DOMAINS.has(domain) || trailIncludes(folderTrail, ['地图'])) {
    return getCategoryDefinition('地图与地理服务')
  }

  if (VISUAL_DOMAINS.has(domain) || trailIncludes(folderTrail, ['3d'])) {
    return getCategoryDefinition('可视化 / 3D / 动画')
  }

  if (MOBILE_DOMAINS.has(domain) || trailIncludes(folderTrail, ['企业微信', '微信', 'flutter'])) {
    return getCategoryDefinition('移动端与开放平台')
  }

  if (BACKEND_DOMAINS.has(domain) || trailIncludes(folderTrail, ['后端'])) {
    return getCategoryDefinition('后端 / 数据库 / 接口')
  }

  if (FRONTEND_DOMAINS.has(domain) || trailIncludes(folderTrail, ['框架'])) {
    return getCategoryDefinition('前端框架与工程化')
  }

  if (UI_DOMAINS.has(domain) || trailIncludes(folderTrail, ['组件库'])) {
    return getCategoryDefinition('UI 组件与样式')
  }

  if (DOC_DOMAINS.has(domain) || trailIncludes(folderTrail, ['开发知识文档', '技术文档'])) {
    return getCategoryDefinition('开发文档与教程')
  }

  if (COMMUNITY_DOMAINS.has(domain)) {
    return getCategoryDefinition('开发社区与代码托管')
  }

  if (TOOL_DOMAINS.has(domain) || trailIncludes(folderTrail, ['辅助工具', '其他小工具'])) {
    return getCategoryDefinition('在线工具与效率')
  }

  if (NETWORK_DOMAINS.has(domain) || trailIncludes(folderTrail, ['vpn'])) {
    return getCategoryDefinition('网络 / VPN / 云服务')
  }

  if (
    PERSONAL_DOMAINS.has(domain) ||
    trailIncludes(folderTrail, ['个人网站', '公司']) ||
    normalizeText(folderTrail[0]) === 'hp'
  ) {
    return getCategoryDefinition('个人 / 工作 / 校园入口')
  }

  if (includesAny(matchText, ['github', 'gitee', 'linux do', 'open vsx', 'csdn'])) {
    return getCategoryDefinition('开发社区与代码托管')
  }

  if (includesAny(matchText, ['二维码', 'json', 'processon', 'webcams', 'youtube', 'ip address'])) {
    return getCategoryDefinition('在线工具与效率')
  }

  return getCategoryDefinition('个人 / 工作 / 校园入口')
}

function resolveType(entry = {}, categoryName = '', matchText = '') {
  const domain = getDomain(entry)

  if (categoryName === 'AI API 与服务商') {
    return '控制台 / 服务'
  }

  if (categoryName === '个人 / 工作 / 校园入口') {
    return '账号 / 平台入口'
  }

  if (categoryName === '开发社区与代码托管') {
    return '社区 / 导航'
  }

  if (categoryName === '在线工具与效率') {
    return '工具 / 素材'
  }

  if (categoryName === '设计灵感与案例') {
    return includesAny(matchText, ['uiverse', 'stitch', 'prompt', '模板']) ? '工具 / 素材' : '案例 / 灵感'
  }

  if (categoryName === 'AI 模型与对话') {
    return includesAny(matchText, ['开放平台', 'docs', '文档']) ? '官方文档' : '控制台 / 服务'
  }

  if (categoryName === 'AI 编程与 Agent') {
    if (domain === 'skillsmp.com') {
      return '社区 / 导航'
    }

    if (
      domain === 'developers.openai.com' ||
      domain === 'code.claude.com' ||
      domain === 'docs.packyapi.com'
    ) {
      return includesAny(matchText, ['教程', 'wiki', '指南', 'quickstart', '入门']) ? '教程 / 文章' : '官方文档'
    }

    if (includesAny(matchText, ['教程', '文档', 'wiki', '指南', 'quickstart', '入门', '使用全攻略', '深度教程'])) {
      return '教程 / 文章'
    }

    return '控制台 / 服务'
  }

  if (categoryName === '网络 / VPN / 云服务') {
    return includesAny(matchText, ['介绍', '最新域名']) ? '教程 / 文章' : '控制台 / 服务'
  }

  if (categoryName === '地图与地理服务' && domain === 'console.amap.com') {
    return '控制台 / 服务'
  }

  if (categoryName === '移动端与开放平台' && ['mp.weixin.qq.com', 'work.weixin.qq.com', 'ext.dcloud.net.cn'].includes(domain)) {
    return '控制台 / 服务'
  }

  if (categoryName === '可视化 / 3D / 动画' && domain === 'mixamo.com') {
    return '工具 / 素材'
  }

  if (
    categoryName === '前端框架与工程化' ||
    categoryName === 'UI 组件与样式' ||
    categoryName === '地图与地理服务' ||
    categoryName === '可视化 / 3D / 动画' ||
    categoryName === '移动端与开放平台' ||
    categoryName === '后端 / 数据库 / 接口'
  ) {
    return isOfficialDoc(entry, matchText) ? '官方文档' : '教程 / 文章'
  }

  if (categoryName === '开发文档与教程') {
    return includesAny(matchText, ['官网', 'docs', '文档']) ? '官方文档' : '教程 / 文章'
  }

  return '控制台 / 服务'
}

function resolveShelf(categoryName = '', typeName = '') {
  if (categoryName === '设计灵感与案例') {
    return '灵感收藏'
  }

  if (typeName === '官方文档' || typeName === '教程 / 文章' || typeName === '社区 / 导航') {
    return '学习资料'
  }

  return '工作平台'
}

function extractTopicTags(matchText = '', entry = {}, categoryName = '', typeName = '') {
  const tags = []

  TAG_DEFINITIONS.forEach((definition) => {
    if (includesAny(matchText, definition.keywords)) {
      pushUnique(tags, definition.tag)
    }
  })

  getFolderTrail(entry).forEach((segment) => {
    const normalizedSegment = normalizeText(segment)
    if (!normalizedSegment || GENERIC_FOLDER_TAGS.has(normalizedSegment)) {
      return
    }

    if (segment.length <= 12) {
      pushUnique(tags, segment)
    }
  })

  pushUnique(tags, categoryName)
  pushUnique(tags, typeName)

  return tags.slice(0, 6)
}

function buildReason(categoryName = '', typeName = '', tags = []) {
  const focusTag = tags.find((tag) => !CATEGORY_ORDER.includes(tag) && tag !== typeName) || ''

  if (categoryName === 'AI 模型与对话') {
    return focusTag ? `要切到 ${focusTag} 或回到模型平台时，直接来这一组最快` : '开聊、切模型或查看模型平台能力时，直接回这一组'
  }

  if (categoryName === 'AI 编程与 Agent') {
    return focusTag ? `和 ${focusTag} 工作流相关，查教程、配置或入口时更顺手` : 'AI 编程代理相关资料已经单独归拢，找入口和文档更快'
  }

  if (categoryName === 'AI API 与服务商') {
    return '中转、续费、监控和商家后台都放到了一起，回找时不用再翻目录'
  }

  if (categoryName === '开发文档与教程') {
    return '这组更偏学习资料，查语法、原理和实战文章时最省时间'
  }

  if (categoryName === '开发社区与代码托管') {
    return '需要继续扩展资料、找仓库或看社区讨论时，先回这里'
  }

  if (categoryName === '设计灵感与案例') {
    return '做后台、小程序或可视化页面时，用它来找风格和参考最合适'
  }

  if (categoryName === '在线工具与效率') {
    return '它偏即时可用型工具，适合临时处理任务时快速打开'
  }

  if (categoryName === '网络 / VPN / 云服务') {
    return '和外网访问、代理、加速有关的入口都收进来了，切换时更好找'
  }

  if (categoryName === '个人 / 工作 / 校园入口') {
    return '这类入口不需要解释太多，重点就是以后能一下子点回去'
  }

  if (typeName === '官方文档') {
    return '它更像稳定基准线，查 API、配置和官方示例时优先回这里'
  }

  if (typeName === '教程 / 文章') {
    return '当官方文档不够直白时，这一条通常更适合补理解'
  }

  if (typeName === '工具 / 素材') {
    return '它更偏直接可用的工具或素材，适合动手时快速回找'
  }

  return '这条链接已经按实际用途归好，回找时会比原始收藏夹更顺手'
}

export function slugifyBookmarkText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function buildBookmarkId(entry, usedIds = new Set()) {
  const baseId = slugifyBookmarkText(`${entry.domain}-${entry.title}`) || `bookmark-${usedIds.size + 1}`
  let candidateId = baseId
  let suffix = 2

  while (usedIds.has(candidateId)) {
    candidateId = `${baseId}-${suffix}`
    suffix += 1
  }

  usedIds.add(candidateId)
  return candidateId
}

export function classifyBookmark(entry = {}) {
  const matchText = buildMatchText(entry)
  const categoryDefinition = resolveCategory(entry, matchText)
  const type = resolveType(entry, categoryDefinition.name, matchText)
  const shelf = resolveShelf(categoryDefinition.name, type)
  const tags = extractTopicTags(matchText, entry, categoryDefinition.name, type)

  return {
    category: categoryDefinition.name,
    categoryDescription: categoryDefinition.description,
    type,
    shelf,
    tags,
    reason: buildReason(categoryDefinition.name, type, tags)
  }
}

export function sortBookmarks(bookmarkA = {}, bookmarkB = {}) {
  const categoryDiff = orderIndex(CATEGORY_ORDER, bookmarkA.category) - orderIndex(CATEGORY_ORDER, bookmarkB.category)
  if (categoryDiff !== 0) {
    return categoryDiff
  }

  const typeDiff = orderIndex(TYPE_ORDER, bookmarkA.type) - orderIndex(TYPE_ORDER, bookmarkB.type)
  if (typeDiff !== 0) {
    return typeDiff
  }

  const shelfDiff = orderIndex(SHELF_ORDER, bookmarkA.shelf) - orderIndex(SHELF_ORDER, bookmarkB.shelf)
  if (shelfDiff !== 0) {
    return shelfDiff
  }

  return String(bookmarkA.title || '').localeCompare(String(bookmarkB.title || ''), 'zh-CN')
}

export function buildCategorySummary(entries = []) {
  return CATEGORY_ORDER
    .map((name) => {
      const matchedItems = entries.filter((entry) => entry.category === name)
      if (matchedItems.length === 0) {
        return null
      }

      return {
        name,
        count: matchedItems.length,
        description: getCategoryDefinition(name).description
      }
    })
    .filter(Boolean)
}

export function buildShelfSummary(entries = []) {
  return SHELF_ORDER
    .map((name) => {
      const matchedItems = entries.filter((entry) => entry.shelf === name)
      if (matchedItems.length === 0) {
        return null
      }

      return {
        name,
        count: matchedItems.length
      }
    })
    .filter(Boolean)
}

export function buildTypeSummary(entries = []) {
  return TYPE_ORDER
    .map((name) => {
      const matchedItems = entries.filter((entry) => entry.type === name)
      if (matchedItems.length === 0) {
        return null
      }

      return {
        name,
        count: matchedItems.length
      }
    })
    .filter(Boolean)
}

export function getCategoryOrder() {
  return [...CATEGORY_ORDER]
}
