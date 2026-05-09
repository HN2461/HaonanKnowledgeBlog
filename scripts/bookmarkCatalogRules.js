const CATEGORY_DEFINITIONS = [
  {
    name: 'API 面板与服务商',
    description: '中转、配额、监控、购买和服务商后台入口统一收在这里',
    keywords: [
      'api中转',
      'api gateway',
      'new api',
      '云驿',
      '监控',
      'codexusage',
      'proxyhub',
      'lumioapi',
      'purchase',
      '小店',
      '发卡',
      'rdzhvip',
      'rpcod',
      'jiexi6'
    ]
  },
  {
    name: 'VPN 与网络服务',
    description: '机场、加速器、云服务和外网辅助入口集中放这里',
    keywords: [
      'vpn',
      '机场',
      '加速',
      'cloud',
      '优信云',
      'ikuuu',
      'cutecloud',
      'dg5.biz',
      '狗狗加速',
      'language reactor'
    ]
  },
  {
    name: '工作与机构入口',
    description: '公司、学校、机构和认证系统相关入口统一归档',
    keywords: [
      '智慧校园',
      '统一身份认证',
      '政务',
      '公司',
      '学校',
      '格子达',
      '毕业论文',
      '助学贷款',
      '安徽政务',
      '机构'
    ]
  },
  {
    name: '个人服务入口',
    description: '个人博客、写作、邮箱、文档和私人常用站点放这里',
    keywords: [
      '语雀',
      '番茄',
      '作家专区',
      '邮箱',
      '简历',
      '个人网站',
      '小说',
      '个人中心'
    ]
  },
  {
    name: 'AI 助手与模型',
    description: '切模型、查能力边界、直接开聊时回到这一组',
    keywords: [
      'chatgpt',
      'deepseek',
      'grok',
      'gemini',
      'kimi',
      'minimax',
      '智谱',
      'bigmodel',
      'mimo',
      'longcat',
      'agent.minimaxi'
    ]
  },
  {
    name: 'AI 开发工具',
    description: '和 Codex、Claude Code、智能代理工作流相关的工具与资料',
    keywords: [
      'claude code',
      'codex',
      'openclaw',
      'agent skills',
      'skillsmp',
      'packyapi',
      'orchids',
      'ai 编辑器',
      'ai开发工具',
      'clawd',
      '编程ai'
    ]
  },
  {
    name: '前端框架与工程化',
    description: '查框架语法、构建配置、工程实践时最常回来的入口',
    keywords: [
      'vue.js',
      'cn.vuejs.org',
      'vite',
      'react',
      'vueuse',
      'luch-request',
      'lodash',
      'mdn',
      'w3cschool',
      'runoob',
      'pure admin',
      'vben',
      'naive ui admin',
      'nvm',
      '单文件组件',
      '前端'
    ]
  },
  {
    name: '组件库与样式资源',
    description: '写界面、查组件 API、补动效和图表时回这里',
    keywords: [
      'element plus',
      'element -',
      'uview',
      'uv-ui',
      'vant',
      'windicss',
      'animate.css',
      'echarts',
      'iconfont',
      'naive ui',
      '组件库',
      'tailwind css',
      'logicflow'
    ]
  },
  {
    name: '地图与地理服务',
    description: '做定位、地图展示、地理编码与轨迹能力时回这里',
    keywords: [
      '高德',
      'amap',
      'lbs.qq.com',
      '腾讯位置服务',
      '天地图',
      'openlayers',
      '地理',
      '地图'
    ]
  },
  {
    name: '可视化与 3D',
    description: '大屏、图形效果、Three.js 和三维交互相关入口',
    keywords: [
      'three.js',
      'threejs',
      'webgl',
      '3d',
      '数字孪生',
      'tvt.js',
      '可视化'
    ]
  },
  {
    name: '移动端与开放平台',
    description: '做 uni-app、小程序、微信、企微、钉钉这类接入时回这里',
    keywords: [
      'uni-app',
      'uniapp',
      '小程序',
      '微信',
      'wecom',
      '企业微信',
      '钉钉',
      'flutter',
      '开放平台',
      '移动端'
    ]
  },
  {
    name: '后端与数据库',
    description: 'Node 服务、Koa、Mongoose 这类后端资料集中在这里',
    keywords: [
      'koa',
      'mongoose',
      'mongodb',
      '后端',
      '数据库'
    ]
  },
  {
    name: '设计灵感与案例',
    description: '找后台、可视化、小程序和 UI 风格参考时最有用',
    keywords: [
      'zcool',
      'uiverse',
      'stitch',
      'prompt 模板',
      '设计',
      '项目分享',
      '案例',
      '后台管理',
      '驾驶舱'
    ]
  },
  {
    name: '开发社区与工具平台',
    description: '逛社区、找仓库、进平台和翻资料入口的杂而有用集合',
    keywords: [
      'github',
      'gitee',
      'linux do',
      '开发者',
      'ai工具集',
      'aigc',
      'open vsx',
      'csdn',
      '工具集',
      'registry',
      '平台'
    ]
  },
  {
    name: '效率工具与通用网站',
    description: '不专属于某个技术栈，但日常开发经常顺手会用到',
    keywords: [
      'processon',
      'pdf',
      'ifixit',
      'webcams',
      'youtube',
      'what\'s my ip',
      'downforeveryoneorjustme',
      '二维码',
      'json',
      '效率',
      '工具箱'
    ]
  }
]

const TOPIC_TAG_DEFINITIONS = [
  { tag: 'ChatGPT', keywords: ['chatgpt', 'openai'] },
  { tag: 'DeepSeek', keywords: ['deepseek'] },
  { tag: 'Gemini', keywords: ['gemini'] },
  { tag: 'Kimi', keywords: ['kimi'] },
  { tag: 'MiniMax', keywords: ['minimax'] },
  { tag: 'Claude Code', keywords: ['claude code'] },
  { tag: 'Codex', keywords: ['codex'] },
  { tag: 'OpenClaw', keywords: ['openclaw', 'clawd'] },
  { tag: 'Vue', keywords: ['vue.js', 'vue '] },
  { tag: 'Vite', keywords: ['vite'] },
  { tag: 'React', keywords: ['react'] },
  { tag: 'VueUse', keywords: ['vueuse'] },
  { tag: 'Element Plus', keywords: ['element plus'] },
  { tag: 'uView', keywords: ['uview', 'uv-ui'] },
  { tag: 'Vant', keywords: ['vant'] },
  { tag: 'Naive UI', keywords: ['naive ui'] },
  { tag: 'ECharts', keywords: ['echarts'] },
  { tag: 'Three.js', keywords: ['three.js', 'threejs'] },
  { tag: '地图', keywords: ['高德', '腾讯位置服务', '天地图', '地图'] },
  { tag: 'uni-app', keywords: ['uni-app', 'uniapp'] },
  { tag: '微信生态', keywords: ['微信', 'wecom', '企业微信'] },
  { tag: '钉钉', keywords: ['钉钉'] },
  { tag: 'Flutter', keywords: ['flutter'] },
  { tag: 'Mongoose', keywords: ['mongoose'] },
  { tag: 'Koa', keywords: ['koa'] },
  { tag: '设计灵感', keywords: ['zcool', 'uiverse', 'stitch', '设计'] }
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
  '框架'
])

const CATEGORY_ORDER = [
  'AI 助手与模型',
  'AI 开发工具',
  'API 面板与服务商',
  '前端框架与工程化',
  '组件库与样式资源',
  '地图与地理服务',
  '可视化与 3D',
  '移动端与开放平台',
  '后端与数据库',
  '设计灵感与案例',
  '开发社区与工具平台',
  'VPN 与网络服务',
  '工作与机构入口',
  '个人服务入口',
  '效率工具与通用网站'
]

const SHELF_ORDER = ['学习资料', '工作平台', '灵感收藏']
const TYPE_ORDER = ['官方文档', '教程 / 文章', '控制台 / 平台', '账号 / 平台入口', '社区 / 导航', '案例 / 灵感', '工具网站']

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

function buildMatchText(entry = {}) {
  return normalizeText([
    entry.title,
    entry.url,
    entry.domain,
    entry.originalPath,
    ...(Array.isArray(entry.folderTrail) ? entry.folderTrail : [])
  ].join(' '))
}

function resolveCategory(matchText) {
  const designCategory = CATEGORY_DEFINITIONS.find((definition) => definition.name === '设计灵感与案例')
  if (designCategory && includesAny(matchText, ['zcool', 'uiverse', 'stitch'])) {
    return designCategory
  }

  const foundDefinition = CATEGORY_DEFINITIONS.find((definition) => includesAny(matchText, definition.keywords))
  return foundDefinition || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1]
}

function resolveType(categoryName, matchText) {
  if (categoryName === 'API 面板与服务商' || categoryName === 'VPN 与网络服务') {
    return '控制台 / 平台'
  }

  if (categoryName === '工作与机构入口' || categoryName === '个人服务入口') {
    return '账号 / 平台入口'
  }

  if (categoryName === '设计灵感与案例') {
    return includesAny(matchText, ['stitch', 'prompt 模板', 'uiverse']) ? '工具网站' : '案例 / 灵感'
  }

  if (categoryName === '效率工具与通用网站') {
    return '工具网站'
  }

  if (categoryName === '开发社区与工具平台') {
    return includesAny(matchText, ['github', 'gitee', 'linux do']) ? '社区 / 导航' : '控制台 / 平台'
  }

  if (categoryName === '地图与地理服务') {
    return includesAny(matchText, ['console.', '控制台', 'developer']) ? '控制台 / 平台' : '官方文档'
  }

  if (categoryName === 'AI 助手与模型') {
    return includesAny(matchText, ['开放平台', 'docs', '文档']) ? '官方文档' : '控制台 / 平台'
  }

  if (categoryName === 'AI 开发工具') {
    if (includesAny(matchText, ['教程', '文档', 'docs', 'quickstart', '深度教程'])) {
      return '教程 / 文章'
    }

    return '控制台 / 平台'
  }

  if (
    categoryName === '前端框架与工程化' ||
    categoryName === '组件库与样式资源' ||
    categoryName === '移动端与开放平台' ||
    categoryName === '后端与数据库' ||
    categoryName === '可视化与 3D'
  ) {
    return includesAny(matchText, ['官方', 'docs', 'guide', '开始', '介绍', 'overview', 'quickstart', '开发者中心', '开放文档'])
      ? '官方文档'
      : '教程 / 文章'
  }

  return '控制台 / 平台'
}

function resolveShelf(categoryName, typeName) {
  if (categoryName === '设计灵感与案例') {
    return '灵感收藏'
  }

  if (typeName === '官方文档' || typeName === '教程 / 文章') {
    return '学习资料'
  }

  return '工作平台'
}

function extractTopicTags(matchText, entry, categoryName, typeName) {
  const tags = []

  TOPIC_TAG_DEFINITIONS.forEach((definition) => {
    if (includesAny(matchText, definition.keywords)) {
      pushUnique(tags, definition.tag)
    }
  })

  const folderTrail = Array.isArray(entry.folderTrail) ? entry.folderTrail : []
  folderTrail.forEach((segment) => {
    const normalizedSegment = String(segment || '').trim()
    if (!normalizedSegment || GENERIC_FOLDER_TAGS.has(normalizedSegment.toLowerCase())) {
      return
    }

    if (normalizedSegment.length <= 12) {
      pushUnique(tags, normalizedSegment)
    }
  })

  pushUnique(tags, categoryName)
  pushUnique(tags, typeName)

  return tags.slice(0, 6)
}

function buildReason(categoryName, typeName, tags = []) {
  const focusTag = tags.find((tag) => !CATEGORY_ORDER.includes(tag) && tag !== typeName) || ''

  if (categoryName === 'API 面板与服务商') {
    return '这类链接偏后台和配额管理，找监控、购买或控制台时最省事'
  }

  if (categoryName === 'VPN 与网络服务') {
    return '切网络、查套餐或处理外网访问时，通常先回这一组'
  }

  if (categoryName === '工作与机构入口' || categoryName === '个人服务入口') {
    return '这类入口不需要记太多，只要下次能快速点开就够了'
  }

  if (categoryName === 'AI 助手与模型') {
    return focusTag ? `需要切到 ${focusTag} 或对比模型能力时，直接回这一条` : '需要切模型、开聊或查能力边界时，直接回这一条'
  }

  if (categoryName === 'AI 开发工具') {
    return focusTag ? `和 ${focusTag} 工作流相关，查配置或文档时会更顺手` : '和 AI 编程代理工作流相关，适合查配置、权限和使用姿势'
  }

  if (categoryName === '设计灵感与案例') {
    return '做后台、可视化或移动端界面时，用它来找方向和细节参考'
  }

  if (typeName === '官方文档') {
    return focusTag ? `查 ${focusTag} 的 API、配置或官方示例时优先回这里` : '它更像稳定基准线，查 API、配置和官方示例时优先回这里'
  }

  if (typeName === '教程 / 文章') {
    return focusTag ? `当官方文档不够直白时，用这条补 ${focusTag} 的细节理解` : '当官方文档不够直白时，用这条补充理解会更快'
  }

  if (typeName === '社区 / 导航') {
    return '需要继续往外扩展资料、找社区讨论或切换入口时，这条最省时间'
  }

  return '它偏工具或平台入口，适合需要直接动手时迅速返回'
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
  const categoryDefinition = resolveCategory(matchText)
  const type = resolveType(categoryDefinition.name, matchText)
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
  const categoryDiff =
    CATEGORY_ORDER.indexOf(bookmarkA.category) - CATEGORY_ORDER.indexOf(bookmarkB.category)
  if (categoryDiff !== 0) {
    return categoryDiff
  }

  const typeDiff = TYPE_ORDER.indexOf(bookmarkA.type) - TYPE_ORDER.indexOf(bookmarkB.type)
  if (typeDiff !== 0) {
    return typeDiff
  }

  const shelfDiff = SHELF_ORDER.indexOf(bookmarkA.shelf) - SHELF_ORDER.indexOf(bookmarkB.shelf)
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
        description: CATEGORY_DEFINITIONS.find((item) => item.name === name)?.description || ''
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
