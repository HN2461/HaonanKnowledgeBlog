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
]
