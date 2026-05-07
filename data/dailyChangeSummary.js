// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-07',
  items: [
    {
      category: '功能更新',
      time: '21:32',
      title: '为字符串数组方法手册加入正文目录',
      summary: '在字符串数组方法速背卡开头加入自动目录，方便从正文内部快速跳转到参数边界、开发场景、面试快答和自测练习等章节。',
      content: '更新 `public/notes/我的总结/JS/辅助资料/字符串数组方法对比记忆手册.md`：1) 在文章开头目标说明后加入 `[[toc]]` 自动目录；2) 目录会跟随现有二级、三级标题自动生成，无需后续手工维护锚点；3) 执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站点数据与正文内容保持一致。'
    },
    {
      category: '问题修复',
      time: '21:27',
      title: '统一 JavaScript 常识专题的标题命名',
      summary: '批量对齐 JS 常识目录与 01 到 20 篇文章的 frontmatter、正文 H1 和目录入口文案，修复运行后列表标题、详情页标题和正文标题不一致的问题。',
      content: '更新 `public/notes/我的总结/JS/` 下整组文档：1) 为 `JS常识.md` 补齐 frontmatter 与统一目录页标题，并把目录中的文章入口文案同步改成正式标题；2) 将 01 到 20 篇文章统一收敛为“第XX篇：标题”命名格式，补齐缺失的 H1，修正 `05_this.md`、`13_offset_client_scroll.md`、`20_数组创建区别.md` 等文件中 frontmatter 与正文一级标题不一致的问题；3) 为 `07_es5构造函数与es6语法糖Class.md` 新增完整 frontmatter 与系列标题；4) 为 `附录_解构赋值.md` 补上统一 H1；5) 执行 `npm run generate:index`，重新生成 `public/notes-index.json` 与 `public/search-index.json`，让列表页、搜索页和详情页头部都读取到最新一致的标题。'
    },
    {
      category: '问题修复',
      time: '15:34',
      title: '纠偏宏任务与微任务笔记并改写为小白版',
      summary: '把《12_宏任务与微任务》改成更容易理解的入门版，用大白话和短例子讲清宏任务、微任务、Promise、await 和 setTimeout 的顺序。',
      content: '更新 `public/notes/我的总结/JS/辅助资料/12_宏任务与微任务.md`：1) 把原本偏规范解释的版本改成“小白速懂版”，先给出一轮事件循环的核心结论，再用“大活/小纸条”的比喻帮助理解；2) 保留正确的分类关系，明确 setTimeout、用户事件属于宏任务，Promise.then、await 后续、queueMicrotask、MutationObserver 属于微任务；3) 用两个短例子分别解释普通同步+Promise+定时器的输出顺序，以及 async/await 为什么是 A->C->B；4) 继续保留面试口述版和一句话速记，方便背诵；5) 保留规范/官方参考链接，作为深入复查入口。'
    },
    {
      category: '问题修复',
      time: '15:15',
      title: '把字符串数组方法手册改成速背详细版',
      summary: '在原有速背卡基础上补充参数边界、开发场景、易错点和更多示例，让内容既能快速背诵，也能支撑面试追问。',
      content: '更新 `public/notes/我的总结/JS/辅助资料/字符串数组方法对比记忆手册.md`：1) 继续保留"速背卡"主线，但把内容扩展成"开发+面试详细版"，补充查找、截取、拼接、参数边界和典型使用场景；2) 新增 `indexOf`、`includes`、`at`、`slice`、`substring`、`split`、`join` 的边界说明和代码示例，便于开发时直接速查；3) 增加"开发场景怎么选""面试常问快答""最容易答错的坑""速练题"几个部分，提升复习效率；4) 保留面试 30 秒口述模板和终极速记口诀，方便快速背诵；5) 通过这次扩充，让文章从单纯对比表升级为更适合直接发布的"速背+详细解释"版本。',
    },
    {
      category: '问题修复',
      time: '09:31',
      title: '修正 JavaScript 数组笔记的关键细节并补充示例',
      summary: '审查 `09_JavaScript数组.md` 并修正 `reduce()` 无初始值行为、`splice()` 替换示例变量冲突、`copyWithin()` 解读说明，补充 `fill()` 负数参数示例和 `sort()` 返回值说明。',
      content: '第一点：完善 `reduce()` 无初始值时的行为说明，明确空数组报 TypeError、单元素数组直接返回元素本身、2+ 元素数组从第二个开始累加，并补充对应代码示例；第二点：修复 `splice()` 替换示例的变量名冲突问题，将变量改为 `arrReplace` 并修正返回值说明为"返回被删除的元素数组"；第三点：优化 `copyWithin()` 的解读说明，将"覆盖逻辑"改为更清晰的"写入逻辑"，明确是从某位置读取、写入目标位置；第四点：补充 `fill()` 负数参数示例，展示 `-2`、`-1` 等负索引的填充行为；第五点：更准确说明 `sort()` 返回值是"返回原数组本身"而非模糊的"返回排序后的原数组"。',
    },
    {
      category: '内容上新',
      time: '09:51',
      title: '新增开发常用快捷键速查文档',
      summary: '创建 Windows 系统快捷键和浏览器快捷键速查表，覆盖窗口管理、文本编辑、命令行、浏览器标签页、开发者工具、VS Code 等高频场景。',
      content: '在 `public/notes/电脑/系统与文件/` 下新增 `开发常用快捷键速查.md`，内容包括：Windows 窗口管理快捷键（Win+D/E/L/Tab、Alt+Tab 等）、文件资源管理器快捷键、文本编辑通用快捷键、命令行与终端快捷键、浏览器标签页管理、页面操作、开发者工具（F12、Ctrl+Shift+I/J/C/M 等）、Console 面板快捷键、VS Code 常用快捷键补充。文章按场景分类，便于开发人员快速查阅。',
    },
    {
      category: '内容上新',
      time: '09:58',
      title: '新增开发必懂网络基础概念文档',
      summary: '创建面向开发者的网络基础知识速查，详解 127.0.0.1、localhost、端口、DNS 域名解析等核心概念，帮助理解"为什么本地服务要这样访问"。',
      content: '在 `public/notes/电脑/电脑网络/网络基础/` 下新增 `开发必懂网络基础概念.md`，内容包括：IP 地址基础（IPv4/IPv6、特殊 IP 地址）、127.0.0.1 与 localhost 的区别与联系、端口分类与常用服务默认端口、DNS 域名解析原理、开发常见场景对照（本地开发服务器、局域网访问、访问排障）、速查表。文章配合大量表格和示例，适合开发者快速理解网络基础概念。',
    },
    {
      category: '内容上新',
      time: '10:25',
      title: '创建美团CatPaw AI编辑器文档',
      summary: '在AI工具分类下新增CatPaw专题文档，包含快速上手指南和核心概念详解',
      content: '创建AI工具/CatPaw/目录和两篇核心文档：1) 目录.md - 概述CatPaw产品基本信息和主要功能特性；2) 第一篇_CatPaw快速上手与核心概念_2026-05.md - 详细介绍产品定位、核心优势、功能特性、界面交互、快速上手指南和适用场景。文档内容涵盖AI编程助手、智能错误处理、美团技术栈集成等企业级功能。',
    },
    {
      category: '内容上新',
      time: '11:35',
      title: '拆分CatPaw文档为多篇章专题指南',
      summary: '将CatPaw文档从单篇拆分为5个专题文件，涵盖介绍、核心功能、AI助手、CLI工具和美团生态集成的完整学习路径',
      content: '按照用户要求将CatPaw文档重组为系列专题：1) 第一篇_CatPaw介绍与快速上手 - 基础概念和安装入门；2) 第二篇_CatPaw核心功能详解 - AI编程引擎和智能功能深入解析；3) 第三篇_CatPaw_AI助手使用指南 - 对话编程技巧和高级用法；4) 第四篇_CatPaw_CLI工具与自动化 - 命令行工具和脚手架；5) 第五篇_CatPaw美团生态集成 - 宙斯、Micms、Caiyun、Mtd UI和SSO等深度集成。同时更新目录文件提供完整导航和学习建议。',
    },
    {
      category: '问题修复',
      time: '16:45',
      title: '修复宏任务与微任务文档格式',
      summary: '为该文档添加YAML frontmatter，清理HTML字体标签，规范化Markdown格式',
      content: '1. 添加必要的frontmatter元信息（title、date、category、tags、description）\n2. 清理所有残留的HTML <font> 标签，转换为标准的Markdown强调语法\n3. 修复文档开头的重复内容，保持结构清晰\n4. 重新生成笔记索引'
    },
    {
      category: '内容上新',
      time: '18:15',
      title: '全面完善DOM文档对象模型基础文档',
      summary: '将基础DOM概念文档扩充为完整的开发指南，涵盖节点类型、DOM树结构、操作方法、实际案例和最佳实践',
      content: '完善`public/notes/我的总结/JS/辅助资料/18_DOM.md`：1) 添加详细的12种DOM节点类型表格和代码示例；2) 补充DOM树形结构详解，包含节点关系属性和操作示例；3) 增加完整的DOM操作API说明，包括元素获取、创建插入、删除替换、内容属性操作；4) 添加3个实际应用案例（动态列表管理、表格数据渲染、表单验证）；5) 补充DOM操作最佳实践和性能优化原则；6) 提供模块化的DOM工具函数封装示例。文档从基础概念介绍升级为全面的DOM开发参考指南。'
    },
    {
      category: '内容上新',
      time: '19:30',
      title: '完善Map/Set文档并添加迭代器比喻',
      summary: '补充Map/Set创建方法和API详细对比，添加生动的糖果罐和班级花名册迭代器比喻',
      content: '完善`public/notes/我的总结/JS/辅助资料/15_Map_Set事件订阅管理.md`：1) 补充Map和Set的多种创建方法示例；2) 增强API表格，添加返回值和详细说明；3) 添加Map/Set API设计对称性分析；4) 提供实用的记忆口诀；5) 添加"糖果罐"和"班级花名册"双比喻，用生动的生活化场景解释抽象的迭代器概念；6) 补充完整的迭代器概念详解和使用示例。'
    },
    {
      category: '问题修复',
      time: '18:21',
      title: '发布级重构Map/Set事件订阅管理文档',
      summary: '修正关键表述准确性与章节结构，补齐完整EventManager实现并增强工程实践细节。',
      content: '更新`public/notes/我的总结/JS/辅助资料/15_Map_Set事件订阅管理.md`：1) 修正“对象键只能是字符串”为“字符串或Symbol”；2) 统一Set顺序描述，明确“无索引语义但保留插入顺序”；3) 规范章节编号并清理重复标题；4) 补充`SameValueZero`比较规则，增强Map/Set底层认知；5) 将EventManager整理为可直接复制的完整版本，新增`once`、`clear`、`listenerCount`，并在`off`中回收空桶；6) 在`emit`中加入回调快照逻辑，避免回调内增删监听导致当前轮遍历行为不稳定。'
    },
    {
      category: '问题修复',
      time: '21:06',
      title: '重写 CatPaw 专题为公开资料核实版',
      summary: '基于 CatPaw 官网、公开用户手册和美团技术团队公开文章，整组重写 AI工具/CatPaw 系列，删除无法公开证实的 CLI 与内网集成想象内容。',
      content: '更新 `public/notes/AI工具/CatPaw/` 目录下整组专题文档：1) 重写 `目录.md` 与前 3 篇内容，明确 CatPaw 的公开定位是“AI 编程 Agent + IDE”，补充官网可核实的发布时间、内部上线与公测时间线、系统兼容性、额度说明与核心功能主线；2) 将原 `第四篇_CatPaw_CLI工具与自动化.md` 更名并重写为 `第四篇_CatPaw_上下文与预览调试.md`，聚焦上下文、索引、`@Docs`、项目预览、页面元素编辑与 Browser Use；3) 将原 `第五篇_CatPaw美团生态集成.md` 更名并重写为 `第五篇_CatPaw_Rules与MCP扩展.md`，改为公开手册里可验证的 Rules、兼容规则与 MCP 说明；4) 全文删除未能在公开资料中核实的专属 CLI 命令、插件包名、内网平台接入细节，统一改为“只写官网和公开手册能证实的信息”；5) 完成后重新执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。'
    },
  ],
}
