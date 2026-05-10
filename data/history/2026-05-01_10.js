// 历史消息归档 —— 2026-05-01 至 2026-05-10
// 归档时追加到本文件末尾的数组即可。
export const history_2026_05_01_10 = [
  {
    id: 'history-2026-05-01',
    date: '2026-05-01',
    items: [
      {
        category: '内容上新',
        time: '14:22',
        title: 'MiMo Token Plan 接入说明已归档到 CC Switch 知识库',
        summary: '将根目录草稿整理为 CC Switch 第三篇正式笔记，按 MiMo 官方 Claude Code 与 Token Plan 文档核对 tp/sk 区分、区域 Base URL、模型映射、使用边界与 CC Switch 同步排查要点，并同步更新目录与通知归档。',
        content: '第一点：新增 `public/notes/AI工具/CC Switch/第三篇_ClaudeCode对接小米MiMoTokenPlan配置说明_2026-05.md`，将原始草稿整理成带 frontmatter 的正式知识库文章；第二点：补入 MiMo 官方文档明确写到、但原稿里未完整覆盖的边界条件，包括 `sgp/ams` 区域地址、`tp-` 与 `sk-` 不能混用、Token Plan 仅限编程工具场景、Key 仅在订阅有效期内可用；第三点：把“模型映射四项都配齐”的结论改写为“官方示例 + 实战推断”口径，避免把一次性经验误写成无条件官方定论；第四点：同步更新 `public/notes/AI工具/CC Switch/目录.md`，将这篇文章挂入现有 CC Switch 学习目录；第五点：按仓库规则将 2026-04-30 的旧日摘要归档到 `data/history/2026-04-21_30.js`，并刷新当天摘要内容。',
      },
      {
        category: '内容上新',
        time: '15:01',
        title: 'CC Switch 跨电脑导出导入与云同步教程已补入专题',
        summary: '新增 CC Switch 第四篇笔记，基于官方 README、Settings 手册与 Configuration Files FAQ 核对导出/导入、设备级设置边界、自动备份与 WebDAV/云盘同步能力，整理出适合多电脑多中转用户的迁移流程。',
        content: '第一点：新增 `public/notes/AI工具/CC Switch/第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`，明确回答“CC Switch 是否支持一键导出导入完整配置”；第二点：把官方已明确写出的关键边界单独拆出来说明，包括“导入会覆盖现有配置，不是自动合并”“`~/.cc-switch/settings.json` 属于设备级设置，不跨设备同步”“导入前会自动创建安全备份并默认保留最近 10 个”；第三点：结合 README 中的 Cloud Sync、Custom config directory、WebDAV 与 Shared Config Snippet 说明，给出手动主版本分发、云盘目录同步、WebDAV 自动同步三种适用场景；第四点：同步更新 `public/notes/AI工具/CC Switch/目录.md`，把跨电脑迁移主题纳入现有学习目录。',
      },
      {
        category: '问题修复',
        time: '20:32',
        title: 'Claude Code 六篇专题已按 2026-05 官方文档整体校订',
        summary: '重写 Claude Code 专题目录与六篇笔记，按 Anthropic 官方文档和智谱最新接入页修正过时命令、模式、Skill 路径、Hook 事件、1M 上下文和 GLM 模型映射等信息，并在第二到第六篇补回更适合小白阅读的白话解释层。',
        content: '第一点：为 `public/notes/AI工具/Claude Code/` 下的目录页与六篇正文统一补上 frontmatter，并把标题统一更新为“2026-05复核/校订”口径；第二点：第一篇和第五篇重点修正权限模式、`acceptEdits` 的当前行为、`--dangerously-skip-permissions` 写法、设置优先级、`/effort` 与 1M 上下文说明；第三点：第二篇和第四篇重点修正 `SKILL.md` 目录结构、`CLAUDE.local.md`、Auto memory 的 `200 行或 25KB` 加载边界、Hook 事件扩展、`/reload-plugins`、`Ctrl+O` transcript viewer 等旧教程已过时信息；第四点：第三篇补入 `/loop`、`/schedule`、`/autofix-pr`、后台任务与代理协作的新工作流；第五点：第六篇按智谱当前官方文档把 GLM 接入口径更新为 `GLM-5.1` / `glm-5-turbo`，并重新解释 IDE 登录提示与版本兼容变量的适用边界；第六点：根据阅读反馈，把第二篇到第六篇额外补上“小白先记一句话”“小白版理解”“翻译成人话”等解释层，尽量保留原有信息量，同时降低新手第一次阅读时的生涩感。',
      },
    ],
  },
  {
    id: 'history-2026-05-02',
    date: '2026-05-02',
    items: [
      {
        category: '内容上新',
        time: '16:22',
        title: 'ECharts 专题继续扩写到项目落地与交互联动',
        summary: '在前四篇基础上，继续补出第五篇交互与联动手册，把 Vue 3 + Vite 项目里最常用的 tooltip、legend、dataZoom、事件监听、dispatchAction、双轴交互和移动端指针优化系统讲清，让前端能更快把图表做成真正可分析的业务页面。',
        content: '第一点：更新 `public/notes/组件库/ECharts/目录.md`，把第一篇到第五篇和推荐阅读顺序补完整；第二点：新增 `public/notes/组件库/ECharts/第四篇_Vue3_Vite_项目落地_把ECharts封成能直接上项目的图表组件.md`，基于 Apache ECharts 官方 chart size、dynamic data、canvas vs svg、安全与 Aria 文档，以及 vue-echarts 官方 README 和 Releases，整理 Vue 3 + Vite 项目里最稳的图表封装方式；第三点：新增 `public/notes/组件库/ECharts/第五篇_交互与联动_tooltip_legend_dataZoom_dispatchAction怎么配合.md`，基于 Apache ECharts 官方 Event and Action、Legend、Axis、Intelligent Pointer Snapping 与 Feature 文档，系统讲清 `tooltip`、`legend`、`dataZoom`、`chart.on(...)`、`dispatchAction(...)`、双轴图交互和移动端 coarse pointer 优化；第四点：第四篇重点收口 `vue-echarts` 的 `autoresize`、`manual-update`、`THEME_KEY`、`loading`、事件绑定、`native:` 原生事件、`setOption`、`resize`、`dispatchAction` 与 `dispose`，第五篇则重点收口后台分析页里最常用的交互组合和图表联动思路；第五点：后续重新生成索引和通知后，ECharts 专题第一到第五篇都能立刻进入站内检索，更适合前端按“认识 -> 选图 -> 数据组织 -> 项目落地 -> 交互联动”的顺序快速上手。',
      },
    ],
  },
  {
    id: 'history-2026-05-03',
    date: '2026-05-03',
    items: [
      {
        category: '内容上新',
        time: '19:59',
        title: 'ECharts 专题补充选图模板与项目开发速查清单',
        summary: '基于 2026-05-03 核对的 Apache ECharts 官方 Handbook、Release 与 vue-echarts 官方资料，补强 ECharts 第二篇选图文章并新增第六篇项目开发速查清单，让读者能按安装、封装、dataset、交互、性能、安全和排错流程快速落地业务图表。',
        content: '第一点：更新 `public/notes/组件库/ECharts/第二篇_常见四类图表_折线图_柱状图_饼图_散点图怎么选.md`，把原有四类图选择说明扩展为“业务需求 -> 图表类型 -> 关键配置 -> 注意点”的项目速查表，并补入 `dataset.source + encode` 的组合图模板和开发前 30 秒检查清单；第二点：新增 `public/notes/组件库/ECharts/第六篇_项目开发速查清单_从安装到上线排查的ECharts实战路线.md`，按官方资料串起 Vue 3 + Vite 项目里从 `echarts + vue-echarts` 安装、按需注册、`BaseChart` 封装、接口数据映射、交互联动、性能选择、安全无障碍到上线排错的完整路线；第三点：更新 `public/notes/组件库/ECharts/目录.md`，把第六篇纳入专题目录与推荐阅读顺序；第四点：校准第四篇 `vue-echarts` 版本表述，明确 Release 页顶部存在 `8.1.0-beta` 预发布，而普通业务项目优先使用标记为 Latest 的稳定版 `v8.0.1`；第五点：按仓库规则将 2026-05-02 的旧日摘要归档到 `data/history/2026-05-01_10.js`，并重新生成笔记索引和通知数据。',
      },
      {
        category: '内容上新',
        time: '20:32',
        title: 'uv-ui 专题补充总览目录与项目开发路线',
        summary: '基于 2026-05-03 核对的 uv-ui 官方介绍、安装、扩展配置、Http、常见问题、更新日志、GitHub 与 npm 资料，为 `组件库/uvui` 专题补出目录页和总览型研究笔记，并统一调整成“目录 + 第一篇 + 第二篇 + 第三篇”的阅读型命名，帮助读完后更快进入 uni-app 项目开发。',
        content: '第一点：新增 `public/notes/组件库/uvui/目录.md`，整理 `uv-ui` 专题的阅读顺序、组件学习优先级和后续扩写方向；第二点：新增 `public/notes/组件库/uvui/第一篇_快速认识uv-ui_安装_扩展配置_组件地图与项目开发路线.md`，集中讲清 `uv-ui` 的定位、公开版本状态、推荐安装路径、扩展配置、组件地图、项目起手顺序与多端兼容坑位；第三点：把原有两篇文章统一更名为 `第二篇_uv-ui入门安装与小程序配置.md` 与 `第三篇_uv-ui请求封装与使用指南.md`，并同步更新 frontmatter 标题、正文 H1、目录页入口文案和文内交叉引用；第四点：更新 `public/notes/组件库/目录.md` 中的专题显示名称，从 `uvui` 调整为更易读的 `uv-ui`；第五点：按仓库规则重新执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
      },
    ],
  },
  {
    id: 'history-2026-05-07',
    date: '2026-05-07',
    items: [
      {
        category: '问题修复',
        time: '22:52',
        title: '修复 Vue 代码块高亮识别',
        summary: '为 `vue` fenced code block 补上高亮别名映射，让前端文章里的 Vue 代码块恢复主题色，不再显示成纯黑白文本。',
        content: '更新 `src/utils/markdown.js`，为 `vue` 代码块补充高亮别名映射，并顺手兼容 `ps1` / `pwsh` 等常见脚本语言别名；同步补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，确保 ` ```vue ` 代码块会产出带主题色的高亮标记，方便前端文章里的 Vue SFC 示例正常阅读。',
      },
      {
        category: '内容上新',
        time: '22:35',
        title: '新增 JavaScript for 家族完全指南',
        summary: '新增一篇专门讲解 for、for...of、for...in、forEach 和异步循环的 JS 专题文章，重点帮初学者建立“索引、值、键、异步结果”四种判断框架。',
        content: '更新 `public/notes/我的总结/JS/辅助资料/21_for家族完全指南.md`，系统讲解普通 `for`、`for...of`、`for...in`、`forEach`、`for...of + await`、`for await...of` 的语法、适用场景、常见坑和选择口诀；同步更新 `public/notes/我的总结/JS/JS常识.md`，把 JavaScript 常识目录扩展到第 21 篇；随后执行 `npm run generate:index`，刷新站点笔记索引与搜索索引，让新文章能在列表页和搜索页正常显示。',
      },
      {
        category: '功能更新',
        time: '21:32',
        title: '为字符串数组方法手册加入正文目录',
        summary: '在字符串数组方法速背卡开头加入自动目录，方便从正文内部快速跳转到参数边界、开发场景、面试快答和自测练习等章节。',
        content: '更新 `public/notes/我的总结/JS/辅助资料/字符串数组方法对比记忆手册.md`：1) 在文章开头目标说明后加入 `[[toc]]` 自动目录；2) 目录会跟随现有二级、三级标题自动生成，无需后续手工维护锚点；3) 执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站点数据与正文内容保持一致。',
      },
      {
        category: '问题修复',
        time: '21:27',
        title: '统一 JavaScript 常识专题的标题命名',
        summary: '批量对齐 JS 常识目录与 01 到 20 篇文章的 frontmatter、正文 H1 和目录入口文案，修复运行后列表标题、详情页标题和正文标题不一致的问题。',
        content: '更新 `public/notes/我的总结/JS/` 下整组文档：1) 为 `JS常识.md` 补齐 frontmatter 与统一目录页标题，并把目录中的文章入口文案同步改成正式标题；2) 将 01 到 20 篇文章统一收敛为"第XX篇：标题"命名格式，补齐缺失的 H1，修正 `05_this.md`、`13_offset_client_scroll.md`、`20_数组创建区别.md` 等文件中 frontmatter 与正文一级标题不一致的问题；3) 为 `07_es5构造函数与es6语法糖Class.md` 新增完整 frontmatter 与系列标题；4) 为 `附录_解构赋值.md` 补上统一 H1；5) 执行 `npm run generate:index`，重新生成 `public/notes-index.json` 与 `public/search-index.json`，让列表页、搜索页和详情页头部都读取到最新一致的标题。',
      },
      {
        category: '问题修复',
        time: '22:29',
        title: '审核并修正 Vue 指令与自定义指令文档',
        summary: '搜索官方资料验证文档准确性，修正事件修饰符、v-model 本质、v-for key 使用、binding.instance 等关键描述。',
        content: '更新 `public/notes/我的总结/Vue/vue辅助/第02篇_Vue指令与自定义指令.md`：1) 修正 `.passive` 修饰符描述，从"顺从/不抵抗"改为准确的"告诉浏览器不会调用 preventDefault()，可立即执行默认行为提升性能"；2) 补充 v-on 事件处理说明，增加"同时传递自定义参数和事件对象需使用 $event"；3) 完善 v-model 本质说明，明确不同表单元素监听的事件不同（input 监听 input 事件，select/checkbox/radio 监听 change 事件）；4) 强化 v-for key 使用建议，明确"仅在列表仅展示且永不变化时才可用 index，涉及增删改排序时 index 会导致状态错乱"；5) 修正 Vue3 自定义指令 binding.instance 说明，区分选项式 API 和组合式 API 的访问方式。',
      },
      {
        category: '功能更新',
        time: '23:59',
        title: '新增代码主题切换功能与 Vue SFC 高亮支持',
        summary: '新增代码主题切换弹窗，支持 GitHub Dark、Atom One Dark、VS2015 等 8 种主题；同时实现 Vue 单文件组件的分区块语法高亮。',
        content: '1) 新增 `src/components/CodeThemeModal.vue` 代码主题切换弹窗组件，提供 8 种预设主题（GitHub Dark、Atom One Dark、VS2015、Monokai Sublime、Tokyo Night、Dracula、Nord、Solarized Dark）和自定义主题上传功能；2) 新增 `src/utils/codeTheme.js` 主题管理工具，支持动态加载 CSS、localStorage 持久化、自定义主题上传与删除；3) 新增 `src/styles/code-theme-custom.css` 自定义主题样式文件；4) 更新 `src/utils/markdown.js`，实现 Vue 单文件组件的 `<template>`、`<script>`、`<style>` 三区块分别高亮，支持 `lang` 属性识别（如 `<script lang="ts">`、`<style lang="scss">`）；5) 更新 `src/components/MarkdownRenderer.vue`，移除硬编码的 `github-dark.css` 引入，改用动态主题加载机制；6) 更新 `src/components/AppSidebar.vue`，在侧边栏操作菜单中新增"代码主题"入口；7) 更新 `CLAUDE.md` 文档，补充 Vue SFC 高亮支持说明。',
      },
    ],
  },
  {
    id: 'history-2026-05-06',
    date: '2026-05-06',
    items: [
      {
        category: '内容上新',
        time: '18:15',
        title: '重写 JavaScript 数组笔记并修正关键概念错误',
        summary: '重构 `09_JavaScript数组.md` 为"纠错 + 深入版"，系统修正数组 `length`、空位、`splice()` 返回值、`map()` 对稀疏数组行为、`copyWithin()` 示例等高频误区，并补上现代不可变数组方法与权威参考链接。',
        content: '第一点：为 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 补齐 frontmatter，统一标题、日期、分类、标签与摘要，保证文章元信息可被列表页与搜索正确读取；第二点：重写数组本质与 `length` 章节，明确数组是特殊对象、合法索引如何与 `length` 联动、`length` 更接近"最大索引 + 1"而非真实元素个数，并强调空位不等于 `undefined`；第三点：集中修正原文中的关键错误，包括把 `length` 误写成访问器属性、把 `splice()` 误写成返回修改后的原数组、把 `push/unshift` 误说成只看第一个参数、把 `map()` 对空位的行为写错，以及 `copyWithin()` 第二个示例串用前一个执行结果导致的结论偏差；第四点：新增稀疏数组专节，系统解释 `delete`、空位、`forEach`、`map`、`filter`、`reduce`、`flat` 对空位的不同处理，降低初学者后续学习迭代方法时的理解断层；第五点：补充 `toSorted()`、`toSpliced()`、`toReversed()`、`with()` 等现代复制型方法，帮助区分"改原数组"和"不改原数组"的两套思维；第六点：按仓库要求完成 UTF-8 无 BOM 校验，执行运行时预检与 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
      },
      {
        category: '内容上新',
        time: '22:27',
        title: '按原笔记风格回调数组文章并只保留必要纠错',
        summary: '将 `09_JavaScript数组.md` 从"改写式整理"回调为更接近主人原有讲法和注释风格的版本，仅保留 `length`、`splice()`、`map()`、`copyWithin()` 等确实有误的内容修正。',
        content: '第一点：保留并恢复 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 里原本偏"小白解释 + 注释辅助理解"的写法，不再按另一套结构重写整篇；第二点：继续保留 frontmatter，保证列表页、搜索页和详情页标题、日期、分类、标签与摘要可稳定读取；第三点：仅修正几处明确错误，包括把 `length` 误写成访问器属性、把 `splice()` 误写成返回修改后的原数组、把 `push/unshift` 误说成只看第一个参数、把 `map()` 对空位的行为写错，以及 `copyWithin()` 第二个示例沿用上一次执行结果导致的错误结论；第四点：同步把 `forEach` 的 `undefined` 拼写、`filter` 对"空位"的表述，以及总结表里的返回值说明改准，其余原有讲法尽量不碰；第五点：按仓库要求重新执行 Node 运行时预检与 `npm run generate:index`，同步刷新 `public/notes-index.json` 和 `public/search-index.json`。',
      },
      {
        category: '内容上新',
        time: '22:56',
        title: '补充数组笔记的空位速查与现代数组方法',
        summary: '在不改动原有主体内容和注释的前提下，为 `09_JavaScript数组.md` 新增空位行为速查、`includes()`/`indexOf()` 差异、`slice()` 与展开运算符在稀疏数组下的区别、ES2023 复制型数组方法，以及查找场景下的 `Set` 补充说明。',
        content: '第一点：本次只对 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 做插入式补充，不覆盖主人已有段落，不删除原注释；第二点：新增"空位在不同方法中的表现速查"，集中对比 `forEach`、`map`、`filter`、`some`、`every`、`reduce`、`find`、`Array.from()`、展开运算符、`slice()`、`concat()`、`flat()`、`join()` 对稀疏数组空位的不同处理；第三点：补充 `includes()` 与 `indexOf()` 在 `NaN` 和空位场景下的行为差异，降低后续学习查找方法时的混淆；第四点：新增 `slice()` 与 `[...arr]` 在稀疏数组下"不完全等价"的提醒，并补充 `toSorted()`、`toReversed()`、`toSpliced()`、`with()` 这组现代不改原数组的方法；第五点：按仓库要求先执行 `scripts/checkNodeRuntime.ps1` 预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
      },
      {
        category: '内容上新',
        time: '22:36',
        title: '补强 JavaScript 字符串笔记并修正 Unicode 与正则细节',
        summary: '在尽量保留 `10_字符串.md` 原有结构和内容的前提下，补齐 frontmatter，修正 `slice()`、`replaceAll()`、`matchAll()`、`substr()`、`String.raw()`、字符串反转示例等高频误区，并补充 Unicode 与官方参考资料。',
        content: '第一点：为 `public/notes/我的总结/JS/辅助资料/10_字符串.md` 补齐 frontmatter，统一标题、日期、分类、标签与摘要，保证详情页、列表页和搜索页后续能稳定读取一致标题；第二点：保留原有"创建、查找、截取、修改、转换、示例、兼容性"的主体结构不动，只对明确错误或容易误导的知识点做增补式修正，包括把字符串 `slice()` 的"返回空数组"纠正为"返回空字符串"，把 `substr()` 的标准状态改为"已废弃、仅为兼容旧网页保留"，把 `replaceAll()` 与 `matchAll()` 对正则的全局标志要求补全为会抛 `TypeError` 的规范行为；第三点：把 `String.raw()` 的 Windows 路径示例改成真正可执行且不自相矛盾的写法，避免正文里出现本身就会被错误转义的字符串字面量；第四点：修复"字符串反转"示例中函数内连续 `return` 导致后两种写法永远不会执行的问题，改成三个独立函数，并补上表情符号场景，顺带说明 `split("")` 会按 UTF-16 代码单元拆分；第五点：新增 `at()`、`isWellFormed()`、`toWellFormed()`、Unicode 代理对与 `Array.from()`/扩展运算符的补充说明，让主人晚上继续扩写时可以直接从"负索引、Unicode、坏字符串、现代 API"几条线往下写；第六点：文末补上 MDN 官方参考链接，便于后续继续查证和扩写。',
      },
      {
        category: '问题修复',
        time: '22:43',
        title: '隐藏笔记详情页头部的标签胶囊显示',
        summary: '移除详情页头部对 `note.tags` 的可视化渲染，避免主人误以为是 Markdown 正文把 `tags` 原文渲染出来。',
        content: '第一点：排查后确认 `09_JavaScript数组.md` 与 `10_字符串.md` 的 frontmatter 都能被正文剥离，页面上看到的并不是 YAML 原文残留，而是 `src/views/NoteDetailPage.vue` 头部主动把 `note.tags` 渲染成了一排标签胶囊；第二点：本次仅删除详情页模板里的 `note-tags` 展示块以及对应样式，保留 frontmatter 数据本身不变，因此搜索、索引、分类和后续脚本逻辑仍可继续使用 `tags`；第三点：这样处理后，页面不再显示这排标签，但不会影响 `public/notes-index.json` 和 `public/search-index.json` 里基于标签的检索能力。',
      },
      {
        category: '问题修复',
        time: '22:46',
        title: '清理字符串笔记正文里的 font HTML 标签',
        summary: '按主人的反馈清理 `10_字符串.md` 正文里残留的 `<font>` / `</font>` 标签，只保留文本内容与 Markdown 语义，不改动知识点本身。',
        content: '第一点：重新核对后确认主人说的是 Markdown 正文里的 HTML 标签，而不是页面头部显示的标签胶囊；第二点：本次对 `public/notes/我的总结/JS/辅助资料/10_字符串.md` 做的是纯清洗操作，批量移除所有 `<font ...>` 与 `</font>`，保留原有文字、行内代码、强调和段落结构，不借机改写原有知识点；第三点：复查后该文件里不再有残留 `font` 标签，当前只剩模板字符串代码示例中的 `<strong>`，那属于代码演示内容本身，不是正文污染。',
      },
      {
        category: '问题修复',
        time: '23:03',
        title: '修复当日汇总消息中的字符串转义错误',
        summary: '修正 `data/dailyChangeSummary.js` 中 `split("")` 示例文本的引号冲突，解决 `generate:notifications` 读取汇总文件时报 `SyntaxError` 导致构建中断的问题。',
        content: '第一点：排查构建日志后确认失败并非出在 Vite 打包阶段，而是 `npm run generate:notifications` 导入 `data/dailyChangeSummary.js` 时，某条 `content` 单引号字符串里直接写入了 `split(\'\')` 形式的示例文本，导致 JavaScript 字符串被意外截断；第二点：本次仅对该条汇总消息做最小修复，将描述改成不与外层单引号冲突的 `split("")` 写法，不改动其他当日摘要内容；第三点：修复后需要重新执行运行时预检与构建命令，确认通知生成、索引生成和 `vite build` 都能顺利走完。',
      },
      {
        category: '功能更新',
        time: '21:15',
        title: '图片灯箱升级为可缩放拖拽的成熟查看器',
        summary: '将站内图片与 Mermaid 图预览从"静态弹层"升级为支持滚轮缩放、双击放大、拖拽平移和键盘控制的查看器，放大后可左右上下拖动查看细节。',
        content: '第一点：重写 `src/components/ImageLightbox.vue`，将原先只做居中展示的简易弹层升级为带顶部工具栏的查看器，支持放大、缩小、重置、Esc 关闭，并实时显示当前缩放比例；第二点：新增滚轮缩放、双击快速放大/还原、按住拖拽平移和方向键平移能力，让图片和 Mermaid 图在放大后可以像成熟产品那样查看局部细节，而不是只能弹出一个固定大小的预览；第三点：新增 `src/utils/lightboxTransform.js`，抽离缩放边界、拖拽边界和以鼠标位置为中心缩放的几何计算，避免复杂交互逻辑全部堆在组件里；第四点：补充 `src/utils/__tests__/lightboxTransform.test.js`，覆盖缩放夹取、边界约束和缩放投影计算，降低后续继续打磨查看器时引入交互回归的风险。',
      },
      {
        category: '功能更新',
        time: '21:01',
        title: 'Mermaid 图表现已支持点击放大预览',
        summary: '把 Markdown 中渲染出的 Mermaid 图接入现有图片灯箱，站内图表现在支持点击放大和键盘触发预览，不再只能原尺寸查看。',
        content: '第一点：在 `src/components/MarkdownRenderer.vue` 中为 Mermaid 渲染后的 `svg` 绑定点击与键盘事件，直接复用现有 `imageClick` 事件和 `ImageLightbox` 组件，不额外新建一套预览弹层；第二点：新增 `src/utils/mermaidPreview.js`，把渲染后的 SVG 标记安全转成 `data:image/svg+xml` 地址，保证灯箱可以像预览普通图片一样预览站内 Mermaid 图；第三点：补充 `src/utils/__tests__/mermaidPreview.test.js`，覆盖 SVG 预览地址生成逻辑，避免后续修改时把图表放大能力悄悄弄坏；第四点：为 Mermaid SVG 增加 `cursor`、`focus` 和轻微 hover 反馈，让主人更容易意识到"这张图可以点开看大图"。',
      },
      {
        category: '功能更新',
        time: '20:46',
        title: 'Markdown 现已支持 Mermaid 图表渲染并重写第八篇类型检测笔记',
        summary: '为站内 Markdown 渲染器补上 Mermaid 支持，修复 `mermaid` 代码块不显示的问题，同时重写 `08_类型检测与原型链深度解析.md`，补齐各类类型检测方法的适用场景、缺点与面试回答模板。',
        content: '第一点：在 `src/utils/markdown.js` 中为 `mermaid` fenced code block 增加专门渲染分支，输出独立的 Mermaid 容器与源码兜底结构，不再把图表当普通代码块处理；第二点：在 `src/components/MarkdownRenderer.vue` 中接入 `mermaid` 运行时，采用 `initialize` + `run` 的方式在 DOM 更新后自动把 `.mermaid` 节点渲染为 SVG，并在失败时自动回退到源码展示；第三点：补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，覆盖 Mermaid fenced block 的 HTML 输出，确保后续回归能及时发现图表渲染结构变化；第四点：重写 `public/notes/我的总结/JS/辅助资料/08_类型检测与原型链深度解析.md`，补齐 `typeof`、`instanceof`、`constructor`、`Array.isArray()`、`Object.prototype.toString.call()` 的适用场景与缺点，新增原型链关系图、面试追问版回答模板和自测题，方便主人直接拿来复述；第五点：补齐该笔记的 frontmatter，统一标题、日期、分类、标签和摘要，方便列表页与搜索页稳定读取。',
      },
      {
        category: '功能更新',
        time: '20:41',
        title: 'Markdown 代码块新增行号与自动折叠',
        summary: '给站点 Markdown 代码块补上头部信息、行号 gutter 和超过 10 行自动折叠/展开能力，同时保留原有语法高亮与复制按钮。',
        content: '第一点：在 `src/utils/markdown.js` 里接管 fenced code block 渲染，统一输出代码块头部、语言标签、总行数、行号 gutter 与折叠按钮，不再依赖后置 DOM 拼装来生成结构；第二点：新增 `src/utils/markdownCodeBlocks.js` 作为代码块辅助工具，集中处理语言名规范化、行数统计、行号生成和折叠阈值，方便后续复用与维护；第三点：重构 `src/components/MarkdownRenderer.vue` 的交互层，保留原有复制按钮能力，并把复制逻辑改成更稳的事件绑定方式，同时为超过 10 行的代码块补上展开/收起交互；第四点：补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，覆盖语言标签、行数统计与渲染输出的关键断言，确保新代码块样式和折叠规则可回归验证。',
      },
      {
        category: '内容上新',
        time: '17:59',
        title: '补充 Class 与构造函数双链继承的开场总述',
        summary: '在 `07_es5构造函数与es6语法糖Class.md` 开头新增一段"快速理解"分点总结，先整体串起实例成员链与静态成员链，方便进入正文前快速建立全局图。',
        content: '第一点：按主人的原文表述把总结拆成 4 个分点，完整保留"函数 `prototype`、构造函数 `__proto__`、实例查找链、静态查找链、两链互不交叉"的核心描述；第二点：将该总结放到笔记最开头，作为正文前的快速理解入口，减少后文阅读时来回拼接概念的成本；第三点：不改动原有正文结构，仅在顶部新增概览，保持后续详细讲解与示例代码可继续顺序阅读。',
      },
      {
        category: '问题修复',
        time: '15:19',
        title: '纠正 Class 与构造函数笔记中的关键错误并清理 HTML 标记',
        summary: '修订 `07_es5构造函数与es6语法糖Class.md` 的高风险错误示例，并把残留的 `<font>` 富文本标记清理成纯 Markdown，提升可读性与可维护性。',
        content: '第一点：修正 `super` 章节的规则描述，明确"`super()` 仅用于子类 constructor 调父类构造函数"，并补充 `super.method()` / `super.prop` 可在实例方法或静态方法中访问父类成员，避免两种语义混淆；第二点：修正私有字段示例，移除类外直接写 `obj.#field` 的误导性 try/catch 写法，改为注释说明其属于解析期 `SyntaxError`，并用 `eval` 演示可捕获错误；第三点：修复用户示例中的密码校验逻辑，去掉哈希函数里的 `Date.now()`，改为确定性结果，确保 `verifyPassword` 示例具备可验证一致性；第四点：补充"易错点速记（纠错版）"，集中解释 `super`、私有字段、`instanceof` 与运行环境差异；第五点：清理 `instanceof` 小节里残留的 `<font>` 富文本标记，统一改成纯 Markdown 强调与列表，避免正文混杂 HTML；第六点：按规范执行运行时预检与 `npm run generate:index`，同步更新笔记索引文件。',
      },
      {
        category: '内容上新',
        time: '14:50',
        title: '原型链笔记补回图解并升级为小白详细版',
        summary: '按"先图后文"重写 `06_JavaScript原型链.md`，新增 Mermaid + ASCII 双图解，补充属性查找流程图与 new 执行图，并把每个核心概念改成白话解释 + 可运行示例。',
        content: '第一点：在 `public/notes/我的总结/JS/辅助资料/06_JavaScript原型链.md` 增加三张图（关系图、属性查找流程图、new 执行流程图），并保留 ASCII 兜底图，避免渲染器不支持 Mermaid 时无法阅读；第二点：正文改为小白路径，按"关键词拆分 -> 最小例子 -> 查找流程 -> 易错点 -> 自测题"展开，重点区分 `prototype`、`[[Prototype]]`、`__proto__`、`constructor`；第三点：新增 `constructor` 的"小三角关系图"，单独解释"构造函数 -> prototype -> constructor 回指 -> 实例内部原型"这一圈关系，并补充它为什么会失真、为什么不适合单独拿来做类型判断；第四点：新增高频误区纠正（如 constructor 失真、instanceof 本质、class 语法糖关系）和可直接复制执行的验证代码，降低记忆负担；第五点：修复 Mermaid 兼容性问题，移除图 1 与图 3 节点文字中会触发解析器误判的 `[[Prototype]]`、括号与引号，改为"内部原型"等普通文本并在图下补解释；第六点：完成 UTF-8 无 BOM 校验，并执行运行时预检与 `npm run generate:index` 同步更新索引文件。',
      },
      {
        category: '内容上新',
        time: '14:40',
        title: '重写 JavaScript 原型链笔记并完成概念纠错',
        summary: '重构 `06_JavaScript原型链.md` 为"纠错 + 完整版"，补齐 frontmatter，统一 `prototype`、`[[Prototype]]`、`__proto__`、`constructor`、`instanceof` 与 `new` 流程的准确表述，新增可运行自测代码与复习口诀。',
        content: '第一点：重写 `public/notes/我的总结/JS/辅助资料/06_JavaScript原型链.md` 全文结构，改为"核心概念 -> 查找机制 -> 误区纠正 -> 代码自测"的学习路径，降低阅读跳跃；第二点：修正"prototype 是每个对象都有""实例通过 prototype 找原型""constructor 恒等可靠"等常见误解，明确函数属性与对象内部原型的边界；第三点：新增 `instanceof` 本质说明与简化实现，补充 `new` 五步流程、原型方法节省内存原因和 class 语法糖关系；第四点：补充可直接运行的断言示例与复习口诀，便于主人快速自检是否真正掌握原型链；第五点：按仓库规范完成 UTF-8 无 BOM 写入校验，并执行 Node 运行时预检与 `npm run generate:index`，同步刷新索引文件。',
      },
      {
        category: '内容上新',
        time: '14:34',
        title: '补全 JS this 规则并完善箭头函数小白说明',
        summary: '重写并扩充 `05_this.md`，将"this 永远是 window"等不严谨表述修正为严格模式/调用方式区分，新增"箭头函数小白版"与 `setTimeout`/事件监听丢 this 的并排对照拆解，并附 MDN 权威参考链接。',
        content: '第一点：重构 `public/notes/我的总结/JS/辅助资料/05_this.md` 的整体结构，保留原有学习主线但改为"规则 + 反例 + 修复"方式，降低理解门槛；第二点：明确普通函数、对象方法、构造调用、call/apply/bind 在严格模式与非严格模式下的 this 差异，修正"默认就是 window"的过度简化；第三点：新增回调 this 误区章节，区分"接收回调的方法 this"和"回调函数 this"两套独立规则，并补充 `forEach(thisArg)`、`setTimeout`、`addEventListener` 的可执行示例；第四点：新增"箭头函数小白版（最通俗）"章节，并把 `setTimeout(this.fn)` 与 `addEventListener("click", this.fn)` 按"等价拆解 -> this 指向 -> 直接后果 -> 共同点/区别"并排讲解，帮助快速建立场景判断；第五点：补充终极防丢模板与一步判断法，文末保留 MDN 参考资料链接便于持续核验。',
      },
      {
        category: '问题修复',
        time: '11:11',
        title: 'JS 与 Vue 目录页顺序化改造完成',
        summary: '将 `JS常识.md` 与 `Vue.md` 统一改为纯目录页，并把 JS 辅助资料、Vue 辅助资料与 Vue 随记统一重命名为"章节号/附录号_标题"格式，补齐缺失章节文件与本地链接，解决阅读顺序不明确和跳读成本高的问题。',
        content: '第一点：重构 `public/notes/我的总结/JS/JS常识.md` 为目录页，仅保留阅读顺序与章节入口，并将 `辅助资料` 统一重命名为 `01` 到 `20` 的有序文件名；第二点：新增 `public/notes/我的总结/JS/辅助资料/02_数据访问安全机制.md`、`03_闭包与垃圾回收.md`、`04_arguments的使用.md`，把主线章节拆分成独立文档；第三点：重构 `public/notes/我的总结/Vue/Vue.md` 为目录页，仅保留 1 到 11 的阅读路径，并新增 `public/notes/我的总结/Vue/vue辅助/01_插值语法.md` 作为本地入口；第四点：将 `public/notes/我的总结/Vue/vue辅助/` 原有文件统一重命名为 `02` 到 `11` 的有序文件名（如 `02_Vue指令与自定义指令.md`、`11_Vue3_Composition_API核心笔记.md`），并同步修正目录链接；第五点：将 `public/notes/我的总结/Vue/vue随记/` 统一为附录命名（`附录01_Vue2的Webpack工程化详解.md`、`附录02_Vue3的Vite工程化详解.md`、`附录03_Vue的name属性.md`），并在 `Vue.md` 的扩展阅读区使用同名入口；第六点：按仓库规则执行运行时预检和 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
      },
    ],
  },
  {
    id: 'history-2026-05-08',
    date: '2026-05-08',
    items: [
      {
        category: '问题修复',
        time: '09:18',
        title: '修复打包后通知中心缺失当日摘要',
        summary: '将 `2026-05-07` 的当日摘要归档到历史分片，并将 `dailyChangeSummary` 切换到 `2026-05-08`，解决构建后只显示 Git/历史消息导致的异常观感。',
        content: '第一点：排查 `scripts/notificationTransforms.js` 后确认脚本只会展示"当天日期"的 `dailyChangeSummary`，因此 `data/dailyChangeSummary.js` 仍停留在 `2026-05-07` 时，会在打包后被自动过滤；第二点：按仓库归档规则把 2026-05-07 的 6 条摘要完整迁移到 `data/history/2026-05-01_10.js` 新增的 `history-2026-05-07` 分组，保留 `category/time/title/summary/content` 明细字段；第三点：重置 `data/dailyChangeSummary.js` 为当天日期 `2026-05-08` 并写入本次修复记录，保证通知中心构建产物与"仅展示当天摘要"的规则一致。'
      },
      {
        category: '内容上新',
        time: '10:56',
        title: '完成 Windsurf 文档系列全面更新验证',
        summary: '基于 2026-05 官方最新资料，逐一验证并更新了全部 5 篇 Windsurf 文档，新增第五篇涵盖 Windsurf 2.0、Devin 集成等重大更新，确保文档内容与官方资料完全一致。',
        content: '第一点：搜索并分析 Windsurf 官方最新 changelog 和文档，发现 2026-05 发布的 Windsurf 2.0 带来了 Devin 集成、Adaptive 智能路由、Agent Command Center 等重大更新；第二点：逐一验证第一至第四篇文档与官方资料的一致性，更新过时信息，包括将 Cascade 模式从 Code/Chat 更正为 Code/Plan/Ask，添加 Windsurf 2.0 说明；第三点：创建第五篇全新文档《Windsurf 2.0 与 Devin 集成实战（2026-05）》，深度拆解 Devin 云代理、Adaptive 智能路由、Agent Command Center、Spaces 任务管理、Devin Review 等革命性功能；第四点：更新目录文件，将专题从 4 篇扩展到 5 篇，更新时间戳为 2026-05-08，完善快速查找表；第五点：所有文档内容均经过官方资料验证，确保无过时或错误信息，形成完整的 Windsurf 学习路径。'
      },
      {
        category: '内容上新',
        time: '15:11',
        title: '补充 Windsurf 自动执行命令 FAQ',
        summary: '在第一篇 Windsurf 入门文档中新增"为什么还要手动确认、如何开启更高自动化"的 FAQ，并按仓库规则重新生成笔记索引。',
        content: '第一点：基于官方 Terminal 文档，在"AI 执行中的交互控制"小节补入常见疑问说明，明确 Windsurf 支持自动执行命令，但是否仍需手动确认取决于 Auto-Execution Level、allow/deny list、风险判断、premium model 条件与企业管理员限制；第二点：补充 Disabled、Allowlist Only、Auto、Turbo 的实际使用理解，帮助读者理解为什么有时仍会出现接受/拒绝按钮；第三点：按仓库规则执行 `npm run generate:index`，同步更新 `public/notes-index.json` 与 `public/search-index.json`，保证文档内容调整后站内索引保持一致。'
      },
      {
        category: '问题修复',
        time: '15:39',
        title: '收紧 Windsurf 2.0 文档中的不稳口径',
        summary: '修正第五篇中 Devin、Quick Review、Agent Command Center 等表述过满的问题，并在第一篇补充旧版总览页口径提示，避免把滚动发布内容误写成稳定版定论。',
        content: '第一点：重写第五篇中"Devin 在 Windsurf 中的具体形态"部分，改为以官方正式页明确写出的"本地 Cascade + 云端 Devin"协作为主，不再把 `Devin Local` 与 `Devin Cloud` 并列写成 Windsurf 2.0 主文档里的两种正式形态；第二点：将代码审查部分改写为"先按 Quick Review 正式功能页理解"，明确其当前只支持 Devin Local agent，并移除自动触发、批量审查、完整 Devin Review 分层等证据不足的写法；第三点：收紧 Agent Command Center 与 Spaces 段落中过度推断的 UI/协作细节，只保留 Kanban 视图、Space 上下文继承、编辑器内协同等已在正式页确认的能力；第四点：在第一篇补充输入框与 slash command 的来源说明，提示读者这部分主要参考总览页与较早文档，若与当前界面存在差异，应优先以更细分的新功能页和实际版本为准；第五点：按仓库规则重新执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。'
      },
      {
        category: '内容上新',
        time: '16:07',
        title: '修订 Vue2 组件五大核心配置项笔记',
        summary: '纠正 `data`、`methods`、`computed`、`watch` 章节中的多处 Vue 2 概念误差，并同步修正示例代码与排版细节。',
        content: '第一点：重写 `data` 章节中的响应式说明，明确只有初始化声明过的属性会被转为响应式，并补充对象新增属性与数组下标变更的常见限制；第二点：调整 `props` 示例，拆开默认值与必传校验的演示，避免把 `required` 与 `default` 混写成教学歧义；第三点：修正 `methods` 示例中直接给未声明字段赋值的问题，改为先在 `data` 中声明 `remoteData` 与 `loading`；第四点：整体重写 `computed` 关键特点，改正通过实例访问、依赖来源、getter/setter 触发时机与副作用边界等表述；第五点：更新 `watch` 核心说明与 `$watch` 示例，使其与前文范围和实际代码保持一致。'
      },
      {
        category: '内容上新',
        time: '16:53',
        title: '新增 Vue2 vs Vue3 核心写法差异笔记',
        summary: '整理并发布了《Vue2 vs Vue3 核心写法差异》详细学习笔记，深度对比了 Options API 与 Composition API 的心智模型、this 枢纽的变化及生命周期执行顺序。',
        content: '第一点：根据主人提供的详细草案，创建了第12篇 Vue 辅助笔记《Vue2 vs Vue3 核心写法差异：从 this 魔法到函数式组合》；第二点：文章采用"餐厅点菜"与"自己下厨"的生动类比，拆解了 setup() 中 this = undefined 的根本原因，以及如何通过闭包 and 控制反转实现逻辑复用；第三点：同步更新了 YAML frontmatter 规范，包含 title、date、category、tags 和 description 字段，确保详情页标题显示与目录一致；第四点：按仓库规则执行了 npm run generate:index，完成了笔记索引的同步刷新。'
      },
      {
        category: '内容上新',
        time: '17:09',
        title: '精简并重构 Vue 响应式原理笔记',
        summary: '对《第03篇：Vue 响应式原理》进行了深度重组，消除了冗余内容，并按 Vue 2 与 Vue 3 的演进逻辑重新梳理了核心架构与避坑指南。',
        content: '第一点：将原本堆叠的多个版本内容合并为统一的逻辑流，从 Vue 2 的 Object.defineProperty 局限性平滑过渡到 Vue 3 的 Proxy + Reflect 优势；第二点：保留并优化了 Mermaid 流程图与核心角色对比表，新增了 reactive 丢失响应式、原始对象 vs 代理对象等实战避坑小节；第三点：同步修正了 Frontmatter 中的 title 与正文 H1 的一致性，确保详情页展示规范。'
      },
      {
        category: '问题修复',
        time: '17:17',
        title: '压缩 Vue3 响应式笔记中的重复段落',
        summary: '对《第03篇：Vue响应式原理》做最小整理，修正 Reflect.get 的错误说明，并将重复的 Proxy/Reflect 展开内容压缩为速记版。',
        content: '第一点：保留前文对 Vue3 响应式、Proxy 与 Reflect 的主体讲解，只修改了"Reflect.get 返回布尔结果"这类不准确表述；第二点：将后半段重复较重的 `Proxy & Reflect 核心笔记` 改为复习速记，减少和前文大段示例、语法解释的重叠；第三点：保留 `reactive` 与 `ref` 的整体替换边界说明，不动原有详细讲解结构。'
      },
      {
        category: '内容上新',
        time: '21:17',
        title: '完成 uni-app 系统整理版主体重写',
        summary: '将 `public/notes/我的总结/uni-app` 下 `02` 到 `06` 全部重写为系统整理风格，使整套内容与第 1 篇保持一致的技术密度。',
        content: '第一点：将第 2 篇重写为《uni-app生命周期、页面时序与常见页面事件》，系统展开应用生命周期、页面生命周期、下拉刷新、触底加载、页面滚动、页面回流与组件生命周期边界，不再停留在简短答题式内容；第二点：将第 3 篇重写为《uni-app工程结构、配置分层与文件职责边界》，围绕 `main.js`、`App.vue`、`pages.json`、`manifest.json`、`uni.scss`、`static` 的职责和常见配置误区展开，强化工程化视角；第三点：将第 4 篇重写为《uni-app跨端开发方法与微信小程序常见能力接入》，重新梳理通用能力、微信协议能力、平台专属能力、条件编译、登录、支付、`web-view` 等内容，突出"为什么这样组织更稳"；第四点：将第 5 篇重写为《uni-app性能优化、包体治理与稳定性维护》，从包体、初始化、渲染、资源、登录态、本地缓存与权限状态等多个维度系统展开；第五点：将第 6 篇从"速记小抄"调整为《uni-app高频问题补充问答》，定位改为系统整理版的补充回看入口，而不是独立的轻量小册子。'
      },
      {
        category: '问题修复',
        time: '22:07',
        title: '修正 Axios 笔记中的不严谨与示例冲突',
        summary: '修订 Axios 学习笔记中的绝对化表述、代理注释与 Router 参数说明，并补齐文件下载和响应拦截器之间的真实项目兼容点。',
        content: '第一点：将 Promise 与 `async/await` 相关表述改得更严谨，避免"不会无限等待""必须配合 try...catch"这类容易误导初学者的绝对化说法；第二点：更新 `data` 与 `paramsSerializer` 配置说明，使其更贴近 Axios 1.x 官方文档和当前工程实践；第三点：修正企业级封装示例，在响应拦截器中补充 `blob` / `arraybuffer` 直返逻辑，解决统一业务码判断与文件下载示例互相冲突的问题；第四点：细化开发代理与生产 Nginx 说明，避免把 `changeOrigin` 误写成"允许跨域"，并提示生产环境仍需处理 `OPTIONS` 预检等细节；第五点：修正 Vue Router `params` 刷新是否保留的描述，明确只有体现在最终 URL 中的路径参数才会稳定保留。'
      },
      {
        category: '问题修复',
        time: '22:19',
        title: '统一 Vue Router 第十篇的站内标题显示',
        summary: '将 Router 笔记的 frontmatter、正文 H1 与 Vue 目录入口统一为同一系列标题，解决运行后页面标题与文件名语义不一致的问题。',
        content: '第一点：将 `public/notes/我的总结/Vue/vue辅助/第10篇_Router.md` 的 frontmatter `title` 与正文 H1 统一改为 `第10篇：Vue Router 超详细总笔记`；第二点：同步更新 `public/notes/我的总结/Vue/Vue.md` 中第十篇目录入口文案和链接路径，避免目录页仍显示旧的 `10_Router` 文案；第三点：按仓库规则执行 Node 运行时预检与索引重建，让详情页、目录页、搜索页与站内系列导航统一显示新标题。'
      }
    ]
  },
  {
    id: 'history-2026-05-09',
    date: '2026-05-09',
    items: [
      {
        category: '内容上新',
        time: '10:49',
        title: '新增《绝对路径与相对路径详解》',
        summary: '在 JS 辅助资料中新增第 22 篇文章，系统讲解绝对路径与相对路径的概念、区别、使用场景及常见陷阱',
        content: '文章包含：路径基础概念、Windows/Linux/URL 路径格式、相对路径符号详解、HTML/CSS/JS/Node.js 中的路径使用、常见陷阱（Node.js 相对路径、Windows 分隔符等）、实战练习题、最佳实践建议。适合前端初学者系统学习路径知识。'
      },
      {
        category: '内容上新',
        time: '11:17',
        title: '完善《第10篇：Vue Router 超详细总笔记》守卫章节',
        summary: '大幅扩充路由守卫相关内容，新增完整导航解析流程、next 进化对比、守卫实战示例等核心知识点',
        content: '补充内容包括：完整的 12 步导航解析流程、Vue Router 3/4 中 next 的进化对比表、beforeRouteEnter 在组合式 API 中的写法、afterEach 的 failure 参数详解、8 个守卫实战示例（登录权限、动态权限、保存草稿、数据刷新、Loading 控制、埋点统计等）、嵌套路由 meta 检查注意事项、高频面试问答补充（守卫执行顺序、next 区别、meta 合并等）、踩坑清单扩充（新增 7 个守卫相关常见错误）。使文档更适合长期复习和实战参考。'
      },
      {
        category: '内容上新',
        time: '18:14',
        title: '完善 uni-app 通用基础系列 4 篇文章',
        summary: '对 uni-app 系列前 4 篇文章进行全面补充和完善，新增页面栈管理、网络超时配置、缓存容量限制、临时文件处理等实战内容',
        content: '第 1 篇补充：扩充跨端编译原理、运行时架构、平台边界等核心概念说明。第 2 篇补充：完善生命周期执行顺序、页面事件处理、常见场景实战示例。第 3 篇补充：扩充工程结构说明、配置文件详解、样式与静态资源管理。第 4 篇补充：新增页面栈层级限制说明、manifest.json 网络超时配置示例、不同平台缓存容量限制详解（微信/支付宝小程序 10MB 限制）、临时文件上传下载完整代码示例、开发规则从 10 条扩展到 13 条。所有补充内容均经过官方文档和社区最佳实践验证，使系列文章更适合作为 uni-app 跨端开发的实用参考指南。'
      },
      {
        category: '功能更新',
        time: '23:24',
        title: '深度整理书签分类：按内容重新归档全部 174 条',
        summary: '完全无视原有浏览器文件夹结构，基于每条 URL 的实际内容重新设计 17 个语义分类，修正多处归类错误',
        content: '重新整理 public/bookmarks-index.json，17 个新分类：AI 对话工具（11）、AI 开发编辑器（10）、AI API 中转服务（8）、AI 会员购买（6，链动小铺系列独立）、AI 工具导航（4）、前端框架与构建（12）、组件库与样式（14）、可视化与 3D（9）、地图与位置服务（9）、移动端与开放平台（含 Flutter，11）、后端与工具库（7）、学习资料与文档（16）、设计灵感与案例（含站酷 12 个案例，14）、代码托管与职业（5）、VPN 与网络工具（14）、效率工具与通用（8）、个人与机构入口（Language Reactor、政务、助学贷款等，16）。主要修正：CSDN 归入 AI 对话工具；Language Reactor 移出 VPN 归入个人入口；链动小铺等商店归入 AI 会员购买新分类；Flutter 归入移动端与开放平台；Vue SFC 文档页归入前端框架与构建。'
      },
      {
        category: '功能更新',
        time: '22:36',
        title: '重构个人书签库入口与高密度检索体验',
        summary: '把浏览器书签整理成功能型站内书签库，入口放进头像弹窗，保留全部收藏并支持按分类、原收藏夹、类型快速筛找',
        content: '新增 scripts/generateBookmarksIndex.js 与 scripts/bookmarkCatalogRules.js，自动解析 bookmarks_*.html 导出文件并生成 public/bookmarks-index.json；将 174 条书签重新整理为 AI 助手、AI 开发工具、前端框架、组件库、地图、移动端、设计灵感、VPN 与网络服务、个人服务入口等用途分类，不再自动隐藏账号、平台或私人入口。前端新增 /bookmarks 路由页面，采用紧凑双列列表展示，支持关键词搜索、高亮命中、按整理分类筛选、按原收藏夹 sourceGroup 筛选、按条目类型筛选；作者头像弹窗新增“书签收藏”按钮作为主入口，并在弹窗统计区显示书签总数，整体更适合主人快速查看、快速定位并立即打开目标网址。'
      }
    ]
  }
]
