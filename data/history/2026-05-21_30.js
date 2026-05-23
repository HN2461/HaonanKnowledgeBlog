// 历史消息归档 —— 2026-05-21 至 2026-05-30
// 归档时追加到本文件末尾的数组即可。
export const history_2026_05_21_30 = [
  {
    id: 'history-2026-05-21',
    date: '2026-05-21',
    items: [
      {
        category: '内容上新',
        time: '21:30',
        title: '补充 Vue 后台管理与 JS 库专题笔记',
        summary: '继续围绕项目源码阅读补强专题内容：在既有 Vue 后台标签栏、SortableJS、Cropper.js、Axios 与 qrcode 笔记基础上，再新增 CryptoJS 前端加密处理实战说明，并同步扩充 JS库 专题目录与站内索引。',
        content: '第一点：保留并延续今天同一轮专题沉淀方向，继续围绕“项目里优先借成熟库解决通用功能，而不是反复手搓底层交互”补强 `项目复用技术` 资料；第二点：保留今天已新增的 `public/notes/项目复用技术/Vue后台管理/01-Vue后台标签栏TagsView中$route、fullPath、href与监听路由的理解.md`、`public/notes/项目复用技术/JS库/01-SortableJS拖拽排序库实战说明_标签拖拽列表重排与Vue接入.md`、`public/notes/项目复用技术/JS库/02-CropperJS图片裁剪库实战说明_上传前裁剪与Vue接入.md`、`public/notes/项目复用技术/JS库/03-Axios请求库实战说明_请求封装拦截器与文件上传.md` 与 `public/notes/项目复用技术/JS库/04-qrcode二维码生成库实战说明_登录码分享码与Vue接入.md`，分别沉淀标签栏路由驱动理解、拖拽排序库接入、图片上传前裁剪、请求封装统一鉴权与二维码生成功能；第三点：新增 `public/notes/项目复用技术/JS库/05-CryptoJS前端加密库实战说明_参数签名摘要与AES处理.md`，基于官方仓库 README、官方文档与 npm 页面，系统整理 `MD5`、`SHA256`、`HMAC`、`AES`、`PBKDF2` 等常见能力分别适合什么场景，并明确指出 `crypto-js` 虽然老项目中依然常见，但官方已停止维护，新项目需要同时评估原生 `Web Crypto API`；第四点：更新 `public/notes/项目复用技术/JS库/目录.md`，补上第 5 篇 CryptoJS 文章入口，同时保留 `dayjs`、`lodash`、`mitt`、`xlsx`、`viewerjs`、`ECharts` 等后续选题清单，方便专题持续扩展；第五点：分别执行 `pwsh -File scripts/checkNodeRuntime.ps1`、`npm run generate:index` 与 `npm run generate:notifications`，确认 Node 运行时预检通过，并重新生成 `public/notes-index.json`、`public/search-index.json` 与 `public/notifications.json`，当前索引统计更新为 399 篇笔记、89 个分类；第六点：今天较早时已按归档规则将旧的 `data/dailyChangeSummary.js` 中 2026-05-19 摘要迁移到 `data/history/2026-05-11_20.js`，避免覆盖丢失。'
      }
    ]
  },
  {
    id: 'history-2026-05-22',
    date: '2026-05-22',
    items: [
      {
        category: '功能更新',
        time: '22:28',
        title: '深度校准 Codex 专题并改造成小白可学的最新课程手册',
        summary: '继续把 Codex 专题从“资料库”推进成“小白也能学会的课程化手册”：在清理旧口径、补全当前常用功能之后，再补零基础导读、统一每篇的学习目标与阅读定位，并修正标题和 frontmatter 不一致问题。',
        content: '第一点：继续深度校对 `public/notes/AI工具/Codex/` 下主线、补丁篇与线路篇，对照官方当前 Codex 页面，把第三篇、第五篇、第六篇、第七篇、第八篇、第二篇、第四篇中的默认模型口径统一收紧为“优先参考官方当前本地默认示例，再结合当前线路真实可用模型”，并明确 `gpt-5.3-codex` 属于专门编码模型或第三方线路历史示例，不再把它写成长期固定默认答案；第二点：继续修正 App / IDE / Windows 相关认知，明确 CLI 与 IDE 共用核心配置，但 App 已发展出 `Local / Worktree / Cloud`、Git、Terminal、Browser、Review 等独立工作流层，并补充 Windows-native、WSL agent 与 `CODEX_HOME` 不自动共享的注意事项；第三点：重写 `public/notes/AI工具/Codex/第十一篇_Codex近期待补全更新总表_桌面版IDE云任务与Windows新能力_2026-05-22.md` 中证据不够硬的段落，去掉“记忆、个性化、宠物、深链”等缺少稳定官方页面支撑的必补判断，删除不存在的 `App Handoff` 独立页面链接，改为更稳妥地引用 `Worktrees`、`Automations`、`In-app Browser`、`Windows` 与 `Use Cases`，并保留一段专门解释“为什么这些说法被剔除”；第四点：继续修正文档层级中最容易误导实操的老内容，为 `public/notes/AI工具/Codex/目录.md` 补全符合站点规范的 frontmatter，把 `public/notes/AI工具/Codex/第一篇_Codex从0到1配置实战.md` 改成第三方线路安全版模板，把 `public/notes/AI工具/Codex/第四篇_Codex多来源完整配置手册_小白友好版.md` 中 Packy / yunyi / rpcod 示例统一改成“先填服务商后台当前开放模型”，并把 `public/notes/AI工具/Codex/第九篇_Codex本地数据目录详解_关键文件与Rules深入版.md` 中 `C:\\Users\\Administrator\\.codex` 这类本机快照改写成 `~/.codex` 通用路径 + 历史样本边界说明；第五点：把 `public/notes/AI工具/Codex/第十篇_Codex命令调用失败与PowerShell版本冲突排查修复实录_2026-04.md` 的旧产品叫法改成当前仍成立的“桌面端 / IDE 扩展 / Cursor 集成”表述，同时补上 Windows-native / WSL agent / `CODEX_HOME` 交叉排障提醒；第六点：新增 `public/notes/AI工具/Codex/第十二篇_Codex当前常用功能点详细手册_最新工作流版_2026-05-22.md`，系统梳理模型、App `Worktrees`、`Handoff`、`Local environments`、`Automations`、Built-in Git、Review pane、Integrated terminal、In-app browser、Computer use、Windows / WSL、IDE `Agent` / `Cloud delegation` / `Web search` / 图片拖拽 / 图像生成 / 设置项，以及 CLI `codex`、`codex exec`、`resume`、`AGENTS.md`、`MCP`、`profiles` 等当前仍在官方主线中的常用功能，并明确哪些旧描述该删、哪些旧能力该保留但降级为历史样本；第七点：新增 `public/notes/AI工具/Codex/零基础先读_小白学习路线与读完能力对照_2026-05-22.md`，专门面向零基础读者整理一页式学习路线，写清“先读什么、后读什么、每篇读完应该会什么、哪些篇不是一开始就该深挖”，把整套 Codex 文档从“可查资料”升级成“可学课程”；第八点：继续为第一篇、第二篇、第四篇、第五篇、第六篇、第七篇、第九篇、第十篇、第十一篇、目录页与零基础导读页补统一的“定位 / 适合谁 / 先读哪篇 / 小白读完目标”结构，并修正第二篇 frontmatter 标题与 H1 的版本不一致问题，让站点列表、搜索结果和正文标题彻底对齐；第九点：按仓库要求持续刷新 `data/dailyChangeSummary.js`，并在本轮改动后重新执行 `npm run generate:index` 与 `npm run generate:notifications`，同步更新 `public/notes-index.json`、`public/search-index.json` 与 `public/notifications.json`。'
      },
      {
        category: '问题修复',
        time: '22:23',
        title: '复核 Rules 系列并修正多处已过时的工具规则口径',
        summary: '系统重读 `public/notes/AI工具/Rules/` 下整套规则文档，按 2026-05-22 可核实的官方资料收紧过时或说得过满的描述，重点修正 Cursor、Windsurf、Claude Code、Gemini CLI 与 GitHub Copilot 的规则机制说明。',
        content: '第一点：重写 `第一篇_AI工具规则文档是什么与为什么_2026-04.md` 与 `第二篇_AGENTS_md开放标准完全指南_2026-04.md` 中最容易误导读者的 AGENTS.md 兼容性口径，不再把“所有工具都完全等价支持多级 AGENTS.md”写成绝对结论，而是明确区分 Codex / Windsurf / Copilot / Kiro / Gemini CLI / Claude Code 的当前支持边界；第二点：修正 `第四篇_Cursor_Windsurf_Kiro规则文档实战_2026-04.md` 中关于 Cursor 的旧说法，去掉“.cursorrules 在 Agent 模式下 0% 合规率、MDC 100% 合规率”这类容易过时且非官方口径的绝对表述，改为基于当前官方文档强调 `.cursorrules` 已是 legacy、`.cursor/rules/*.mdc` 才是主线，同时补清 `AGENTS.md` 在 Cursor 里目前更像根目录单文件的简单替代方案；第三点：同步修正 Windsurf 全局规则路径与预算描述，把 `global_rules.md` 的存放位置统一回 `~/.codeium/windsurf/memories/global_rules.md`，并把“token 预算”改写为官方文档明确给出的字符限制；第四点：收紧 `第三篇_CLAUDE_md与ClaudeCode记忆系统_2026-04.md` 中 Auto Memory 的内部分类表述，删除基于社区泄露分析得出的“四种记忆类型”等不稳口径，改成 Anthropic 官方当前明确说明的加载方式、`200 lines or 25KB` 阈值、topic files 按需读取、`/memory` 可审计与编辑等稳定事实；第五点：更新 `第五篇_GeminiCLI与Copilot规则文档_2026-04.md`，把 Gemini CLI 的版本信息从旧的 `v0.37.1` 更新为截至 2026-05-22 公开 release 页面可见的最新稳定版 `v0.41.2`，同时保留 preview / nightly 渠道持续演进的说明，并补清 `/memory reload`、`context.fileName` 与 `GEMINI.md` 的当前官方文档来源；第六点：修正 GitHub Copilot 章节里几处最容易混淆 IDE 的内容，不再把 VS Code 写成 Cursor 设置项，改为更稳妥地说明仓库级文件、Agent 指令、`.github/instructions/*.instructions.md` 的适用面，以及 VS Code 中子目录 `AGENTS.md` 默认需要手动启用的现实限制；第七点：同步刷新 `public/notes/AI工具/Rules/目录.md` 的更新时间与覆盖说明，让入口页直接提醒读者“不同工具即便都支持规则文档，也不代表目录层级、作用域与触发方式完全一致”。'
      },
      {
        category: '功能更新',
        time: '22:29',
        title: '重写 Agent Skills 专题并清理跨工具混写口径',
        summary: '把 `public/notes/AI工具/skill/` 下目录页与四篇主文按 2026-05-22 重新校准，不再把 Codex、Kiro、Cursor、Claude Code 混写成同一套机制，而是明确区分“最小可移植 SKILL.md 层”和各工具当前更稳的落地路径。',
        content: '第一点：重写 `public/notes/AI工具/skill/目录.md`，新增“这组文章已经按 2026-05-22 重新复核”的导读说明，明确这组笔记现在优先区分 `SKILL.md` 可移植思路、Kiro / Codex 当前可确认的 skills 目录方案，以及 Cursor / Claude Code 当前更明确的 `Rules`、`AGENTS.md`、自定义命令方案；第二点：重写第一篇 `public/notes/AI工具/skill/第一篇_AgentSkills开放标准与各工具兼容性全解.md`，删除“所有工具完全同一套玩法”“Cursor 官方以 skills 为主”“Claude Code 高级 frontmatter 就是开放标准通用字段”等容易过时或缺乏当前官方页面支撑的断言，改为以 Kiro 官方 skills 文档、OpenAI `openai/skills` 仓库、本地 `~/.codex/skills/` 实装结构、Cursor Rules 文档与 Claude Code slash commands 文档为当前复核依据；第三点：重写第二篇 `public/notes/AI工具/skill/第二篇_AgentSkills高级用法与进阶技巧.md`，把进阶能力重新分成“今天仍然稳”“工具专属但有价值”“版本敏感不应默认通用”三层，保留 `description`、`references/`、`scripts/`、Codex `agents/openai.yaml`、Kiro `skill://` 这类当前更稳的内容，同时把 `context: fork`、skill 级 hooks、固定 token 配额、跨工具目录别名等旧说法降级处理；第四点：重写第三篇 `public/notes/AI工具/skill/第三篇_AgentSkills场景模板与案例库.md`，不再把模板写成“复制到所有工具都能直接跑”，而是改成“先写 portable `SKILL.md` 母版，再分别落到 Codex/Kiro 的 skill 目录、Cursor 的 `.cursor/rules` / `AGENTS.md`、Claude Code 的 `.claude/commands/*.md`”；第五点：重写第四篇 `public/notes/AI工具/skill/第四篇_AgentSkills团队协作与社区资源.md`，把团队共享策略改成“Codex / Kiro 更适合共享 skills，Cursor 更适合共享 rules / `AGENTS.md`，Claude Code 更适合共享 commands / `CLAUDE.md`”，并把社区资源优先级收口为“先看官方与 GitHub 实仓，再看聚合站”；第六点：修正第三篇里多余的 Markdown 围栏，避免文章渲染时把后续正文误吞进代码块；第七点：本轮只调整 `public/notes/AI工具/skill/` 专题内容与当日汇总，后续会按仓库规范继续尝试执行索引重建，但仍需先通过 Node 运行时预检。'
      }
    ]
  }
]
