// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-07',
  items: [
    {
      category: '问题修复',
      time: '22:52',
      title: '修复 Vue 代码块高亮识别',
      summary: '为 `vue` fenced code block 补上高亮别名映射，让前端文章里的 Vue 代码块恢复主题色，不再显示成纯黑白文本。',
      content: '更新 `src/utils/markdown.js`，为 `vue` 代码块补充高亮别名映射，并顺手兼容 `ps1` / `pwsh` 等常见脚本语言别名；同步补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，确保 ` ```vue ` 代码块会产出带主题色的高亮标记，方便前端文章里的 Vue SFC 示例正常阅读。'
    },
    {
      category: '内容上新',
      time: '22:35',
      title: '新增 JavaScript for 家族完全指南',
      summary: '新增一篇专门讲解 for、for...of、for...in、forEach 和异步循环的 JS 专题文章，重点帮初学者建立“索引、值、键、异步结果”四种判断框架。',
      content: '更新 `public/notes/我的总结/JS/辅助资料/21_for家族完全指南.md`，系统讲解普通 `for`、`for...of`、`for...in`、`forEach`、`for...of + await`、`for await...of` 的语法、适用场景、常见坑和选择口诀；同步更新 `public/notes/我的总结/JS/JS常识.md`，把 JavaScript 常识目录扩展到第 21 篇；随后执行 `npm run generate:index`，刷新站点笔记索引与搜索索引，让新文章能在列表页和搜索页正常显示。'
    },
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
      content: '更新 `public/notes/我的总结/JS/` 下整组文档：1) 为 `JS常识.md` 补齐 frontmatter 与统一目录页标题，并把目录中的文章入口文案同步改成正式标题；2) 将 01 到 20 篇文章统一收敛为"第XX篇：标题"命名格式，补齐缺失的 H1，修正 `05_this.md`、`13_offset_client_scroll.md`、`20_数组创建区别.md` 等文件中 frontmatter 与正文一级标题不一致的问题；3) 为 `07_es5构造函数与es6语法糖Class.md` 新增完整 frontmatter 与系列标题；4) 为 `附录_解构赋值.md` 补上统一 H1；5) 执行 `npm run generate:index`，重新生成 `public/notes-index.json` 与 `public/search-index.json`，让列表页、搜索页和详情页头部都读取到最新一致的标题。'
    },
    {
      category: '问题修复',
      time: '22:29',
      title: '审核并修正 Vue 指令与自定义指令文档',
      summary: '搜索官方资料验证文档准确性，修正事件修饰符、v-model 本质、v-for key 使用、binding.instance 等关键描述。',
      content: '更新 `public/notes/我的总结/Vue/vue辅助/第02篇_Vue指令与自定义指令.md`：1) 修正 `.passive` 修饰符描述，从"顺从/不抵抗"改为准确的"告诉浏览器不会调用 preventDefault()，可立即执行默认行为提升性能"；2) 补充 v-on 事件处理说明，增加"同时传递自定义参数和事件对象需使用 $event"；3) 完善 v-model 本质说明，明确不同表单元素监听的事件不同（input 监听 input 事件，select/checkbox/radio 监听 change 事件）；4) 强化 v-for key 使用建议，明确"仅在列表仅展示且永不变化时才可用 index，涉及增删改排序时 index 会导致状态错乱"；5) 修正 Vue3 自定义指令 binding.instance 说明，区分选项式 API 和组合式 API 的访问方式。'
    },
    {
      category: '功能更新',
      time: '00:00',
      title: '新增代码主题切换功能与 Vue SFC 高亮支持',
      summary: '新增代码主题切换弹窗，支持 GitHub Dark、Atom One Dark、VS2015 等 8 种主题；同时实现 Vue 单文件组件的分区块语法高亮。',
      content: '1) 新增 `src/components/CodeThemeModal.vue` 代码主题切换弹窗组件，提供 8 种预设主题（GitHub Dark、Atom One Dark、VS2015、Monokai Sublime、Tokyo Night、Dracula、Nord、Solarized Dark）和自定义主题上传功能；2) 新增 `src/utils/codeTheme.js` 主题管理工具，支持动态加载 CSS、localStorage 持久化、自定义主题上传与删除；3) 新增 `src/styles/code-theme-custom.css` 自定义主题样式文件；4) 更新 `src/utils/markdown.js`，实现 Vue 单文件组件的 `<template>`、`<script>`、`<style>` 三区块分别高亮，支持 `lang` 属性识别（如 `<script lang="ts">`、`<style lang="scss">`）；5) 更新 `src/components/MarkdownRenderer.vue`，移除硬编码的 `github-dark.css` 引入，改用动态主题加载机制；6) 更新 `src/components/AppSidebar.vue`，在侧边栏操作菜单中新增"代码主题"入口；7) 更新 `CLAUDE.md` 文档，补充 Vue SFC 高亮支持说明。'
    },
  ],
}
