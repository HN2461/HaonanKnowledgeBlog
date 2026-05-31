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
  },
  {
    id: 'history-2026-05-23',
    date: '2026-05-23',
    items: [
      {
        category: '内容上新',
        time: '16:50',
        title: '重构 MCP、Agent Skills、Rules 专题为可扩展分类体系',
        summary: '将 `public/notes/AI工具/Mcp/`、`public/notes/AI工具/skill/`、`public/notes/AI工具/Rules/` 统一整理为"概念认知 + 分类清单/实战资料"的长期维护结构，便于面试复盘与开发中按场景持续扩展。',
        content: '第一点：在 `public/notes/AI工具/Mcp/` 新增并修订 `00_导航与学习路线.md`，明确"概念与原理 + 常用MCP清单 + 面试题库 + 个人实践"四层维护方案，并将既有 `谷歌MCP_配置手册.md` 作为单个 MCP server 实操资料纳入体系；第二点：将概念首篇重构并更名为 `01_概念与原理/第一篇_MCP是什么与开放标准核心认知.md`，核心改为解释 MCP 的协议定位、角色模型、工作流程、价值边界与常见误区，不再把"浏览器 MCP"当成整体定义；第三点：将清单首篇重构并更名为 `02_常用MCP清单/第一篇_常用MCP分类与选型总览.md`，按能力分类整理浏览器自动化、文件系统、命令执行、数据库、检索、多媒体等常见方向，强调"先按能力分类选型，再选具体工具"；第四点：同步修订 `03_面试题库与回答模板/README.md` 与 `04_个人实践与踩坑记录/README.md` 口径为通用 MCP；第五点：将 `public/notes/AI工具/skill/` 从平铺结构拆分为 `01_概念与原理/`、`02_高级用法与进阶技巧/`、`03_场景模板与案例库/`、`04_团队协作与社区资源/` 四个子目录，并把四篇主文分别归位，同时更新 `skill/目录.md` 内全部相对链接与目录结构说明；第六点：将 `public/notes/AI工具/Rules/` 从平铺结构拆分为 `01_概念与原理/`、`02_AGENTS开放标准/`、`03_CLAUDE记忆系统/`、`04_Cursor_Windsurf_Kiro实战/`、`05_Gemini与Copilot/` 五个子目录，并把五篇主文分别归位，同时更新 `Rules/目录.md` 的推荐阅读链接与目录结构说明；第七点：按仓库规则先将旧 `data/dailyChangeSummary.js`（2026-05-22）的三条明细迁移归档到 `data/history/2026-05-21_30.js`，再重建当天摘要；第八点：执行 `pwsh -File scripts/checkNodeRuntime.ps1` 与 `npm run generate:index`，已更新 `public/notes-index.json` 和 `public/search-index.json`，当前索引统计为 407 篇笔记、102 个分类。'
      },
      {
        category: '内容上新',
        time: '17:17',
        title: '新增 Plugin 插件体系四篇系列文章',
        summary: '在 `public/notes/AI工具/plugin/` 下新增"概念与原理 + Codex插件体系 + Claude Code插件体系 + 选型指南与团队落地"四篇系列文章，系统介绍 Plugin 作为 AI 工具"第四大扩展机制"的概念、实战与选型策略。',
        content: '第一点：新增 `plugin/目录.md` 作为系列目录页，覆盖推荐阅读顺序、四大主题概述与快速查找表；第二点：新增 `01_概念与原理/第一篇_Plugin插件是什么与为什么_2026-05.md`，从"功能分散难以共享"的痛点出发，解释 Plugin 的本质、解决的核心问题，横向对比 Plugin 与 Skill/MCP/Rules 的区别，速览各工具 Plugin 支持现状；第三点：新增 `02_Codex插件体系/第二篇_CodexPlugin体系详解与实战_2026-05.md`，解析 Codex Plugin 的目录结构、plugin.json 清单格式、Marketplace 三级分发、本机 `~/.codex/plugins/` 实装分析、安装与管理命令；第四点：新增 `03_ClaudeCode插件体系/第三篇_ClaudeCodePlugin体系详解与实战_2026-05.md`，解析 Claude Code 七大扩展组件关系、Plugin 作为最高级扩展的定位、打包机制、/plugin 命令族、前端开发者实战场景；第五点：新增 `04_选型指南与团队落地/第四篇_Plugin选型指南与团队落地_2026-05.md`，提供四大机制对比矩阵、选型决策树、按工具选型速查、无 Plugin 工具替代方案、团队协作策略、常见误区与避坑；第六点：执行 `npm run generate:index`，索引统计更新为 415 篇笔记、107 个分类。'
      },
      {
        category: '功能更新',
        time: '18:01',
        title: 'AI工具目录重组为五层架构',
        summary: '将 `public/notes/AI工具/` 从扁平结构重组为"主类按本质，子类按工具"的五层架构：01_AI编辑器流、02_终端Agent流、03_规则机制层、04_Agent框架层、05_辅助工具层，并去除目录名空格。',
        content: '第一点：创建5个分组目录（01_AI编辑器流、02_终端Agent流、03_规则机制层、04_Agent框架层、05_辅助工具层），将原有15个工具目录按本质模式归入对应分组；第二点：Cursor/Windsurf/Trae/CatPaw/Kiro归入01_AI编辑器流，ClaudeCode/Codex/Gemini归入02_终端Agent流，MCP/Rules/Skill/Plugin归入03_规则机制层，龙虾归入04_Agent框架层，CCSwitch/AI开发基础归入05_辅助工具层；第三点：去除目录名空格（Claude Code→ClaudeCode、CC Switch→CCSwitch、Mcp→MCP、skill→Skill、plugin→Plugin）；第四点：新增 `AI工具/00_总导航.md`，按五层架构聚合链接并提供快速定位表；第五点：批量更新所有目录页和正文中引用的旧路径（#/note/AI工具/XX/→#/note/AI工具/0X_分组名/XX/）；第六点：重新生成索引，当前统计 412 篇笔记、112 个分类。'
      }
    ]
  },
  {
    id: 'history-2026-05-24',
    date: '2026-05-24',
    items: [
      {
        category: '功能更新',
        time: '21:09',
        title: '修正文档 frontmatter、MCP 导航归位与 Codex Plugin 官方口径',
        summary: '补齐 `AI工具` 目录下多篇缺 frontmatter 的正式文档与目录页，清理 Gemini 目录里重复错位的“谷歌MCP”正文副本，并按 OpenAI 官方资料修正 Codex Plugin 文章中的发布日期与规模口径。',
        content: '第一点：为 `public/notes/AI工具/01_AI编辑器流/` 下的 Cursor、Kiro、Trae、Windsurf 目录页补齐 frontmatter，为 `public/notes/AI工具/02_终端Agent流/Gemini/目录.md` 补齐 frontmatter，修复这些目录页在索引中只能回退到文件名显示的问题；第二点：将 `public/notes/AI工具/02_终端Agent流/Gemini/谷歌MCP_配置手册.md` 从重复正文改成导览说明页，明确真正的实操正文统一放在 `public/notes/AI工具/03_规则机制层/MCP/谷歌MCP_配置手册.md` 维护，避免搜索与列表出现两篇同内容同文件名文章；第三点：为 MCP 主文补齐 frontmatter，并把标题从“Codex MCP 复刻配置手册”校准为更符合目录语义的“谷歌 MCP 配置手册（Windows，Chrome DevTools MCP 复刻）”；第四点：为 `public/notes/AI工具/04_Agent框架层/龙虾/` 下 6 篇正式文章与 `目录.md` 统一补齐 frontmatter，修复站内索引里出现 `第一篇_OpenClaw...`、`第六篇_龙虾命令与配置文件一页速查图` 这类下划线文件名直出的问题；第五点：为 `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/对比报告/` 下两份 Node 环境报告补齐 frontmatter，让它们在站内搜索和详情页中显示为人类可读标题；第六点：将 `public/notes/AI工具/03_规则机制层/Plugin/02_Codex插件体系/第二篇_CodexPlugin体系详解与实战_2026-05.md` 中关于 Codex Plugin 的官方口径改为 2026-03-26 官方帮助中心更新，并把“100 万开发者”修正为基于 OpenAI 官方产品页可确认的“300 万+ 开发者每周使用 Codex”和“90+ 插件”；第七点：按仓库规则先把昨日 `data/dailyChangeSummary.js` 的 2026-05-23 三条摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的当日摘要。'
      },
      {
        category: '问题修复',
        time: '21:19',
        title: '修复个人角落弹层在笔记页被遮挡',
        summary: '为头部“角落”弹层补上独立层级和小屏高度兜底，避免在文章详情页被吸顶条或其它浮层压住。',
        content: '第一点：在 `src/components/AppHeader.vue` 为 `corner-popover` 补充显式 `z-index`，让 Teleport 到 `body` 的个人角落面板稳定高于笔记页吸顶条与内容层；第二点：补充 `max-height` 和 `overflow-y: auto`，让窄屏或较矮视口下的天气、提醒、问候内容可以完整显示并支持内部滚动；第三点：同步按仓库规则把昨日 `2026-05-23` 的三条开发摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的 `data/dailyChangeSummary.js`。'
      },
      {
        category: '问题修复',
        time: '22:07',
        title: '收紧 MCP 概念口径并补齐面试题库',
        summary: '修正 MCP 主文里把协议过度简化成“工具层”的表述，补上官方 `tools`、`resources`、`prompts` 原语，并把面试题库拆成概念、架构安全、项目落地 3 组正式稿。',
        content: '第一点：更新 `public/notes/AI工具/03_规则机制层/MCP/01_概念与原理/第一篇_MCP是什么与开放标准核心认知.md`，把 MCP 从“可被 Agent 调用的工具层”收紧为更准确的“标准能力入口协议”，补充官方 `tools`、`resources`、`prompts` 三类常见原语，并把 `Host / Client / Server` 的定义改得更接近官方架构语义；第二点：同步修正文中“浏览器 MCP 属于哪一层”的解释，明确“浏览器类、文件类、搜索类”是面向选型的业务分类，不等于协议层 primitive；第三点：更新 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第一篇_常用MCP分类与选型总览.md`，把“搜索与知识检索类”扩写为“搜索、阅读与知识检索类”，并补充“搜索资料偏 tool、阅读内容偏 resource、知识问答通常是组合结果”的说明；第四点：把 `public/notes/AI工具/03_规则机制层/MCP/03_面试题库与回答模板/README.md` 从占位说明升级成正式导航，并新增 `第一组_概念与主流度问题.md`、`第二组_架构与安全边界问题.md`、`第三组_项目落地与收益评估问题.md` 三篇带 frontmatter 的正式题库稿，统一采用“问题原文 + 30 秒回答 + 2 分钟展开 + 追问应对 + 可反问面试官的问题”结构，方便后续继续扩写和直接面试复述。'
      },
      {
        category: '内容上新',
        time: '22:11',
        title: '更新 CC Switch 专题到 v3.15.0 并补 MiMo 1M 长上下文说明',
        summary: '刷新 `CCSwitch` 专题目录与 4 篇正文的官方口径，把版本基线更新到 2026-05-24，补入 Claude Desktop 面板、Routing Support、Full URL Endpoint Mode 与 MiMo `[1m]` 长上下文配置说明。',
        content: '第一点：更新 `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`，把专题说明改为以 `2026-05-24` 官方资料为准，并同步调整 4 篇文章的入口文案；第二点：更新 `第一篇_CCSwitch快速上手与核心概念_2026-04.md`，把版本基线从 `v3.14.1` 刷到 `v3.15.0`，补充 Claude Desktop 独立管理面板、Provider Routing Support 标识、Full URL Endpoint Mode、Codex OAuth 实时模型列表与 Claude Code `supports1m` 角色映射，同时修正 `OpenCode` 配置路径和“导出为 SQL”这两处过时表述；第三点：更新 `第二篇_CCSwitch接入中转站与计费排查_2026-04.md`，把“最新版本”从 `v3.13.0` 校正到 `v3.15.0`，并补充新版模型发现、Anthropic 兼容 `/models`、Full URL Endpoint Mode 与模型探测失败时的更稳排障判断；第四点：更新 `第三篇_ClaudeCode对接小米MiMoTokenPlan配置说明_2026-05.md`，补入 MiMo 当前文档对 `mimo-v2.5-pro[1m]` 的 1M 长上下文写法和 `/context` 自检方式；第五点：更新 `第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`，将核对时间刷新到 `2026-05-24`，并明确本文讨论的是应用内 `JSON` 备份导出路径。'
      },
      {
        category: '问题修复',
        time: '22:25',
        title: '重写 Plugin 系列官方口径并修正命令与 Marketplace 说明',
        summary: '按 OpenAI 与 Claude Code 官方资料重写 Plugin 系列 4 篇正文和目录页，集中修正 Codex / Claude Code 的命令入口、Marketplace 名称、manifest 规则与能力边界，避免把两套插件体系混写。',
        content: '第一点：重写 `public/notes/AI工具/03_规则机制层/Plugin/目录.md` 与四篇正文，统一把 Plugin 收紧为“打包与分发层”，不再把 Skill、MCP、Rules 与 Plugin 的边界写混；第二点：更新 `第一篇_Plugin插件是什么与为什么_2026-05.md`，修正“Skill 无法对外发布”“所有工具都可一行命令安装”等过于绝对的说法，并把支持现状收敛到已核对的 Codex、Claude Code、Cursor、Windsurf、Kiro 五类工具；第三点：重写 `第二篇_CodexPlugin体系详解与实战_2026-05.md`，改用 `openai/plugins` 官方仓库、本机 `~/.codex/plugins/cache/` 与 `~/.codex/config.toml` 为主线，明确 `codex plugin marketplace add|upgrade|remove` 才是当前可直接确认的 CLI 入口，修正旧稿把 Codex 写成 `/plugin install`、把用户配置误写成 `~/.agents/plugins/marketplace.json`、把 Marketplace 简化成固定“官方/项目/用户三级”的问题；第四点：重写 `第三篇_ClaudeCodePlugin体系详解与实战_2026-05.md`，补入 `claude-plugins-official` 官方市场、`anthropics/claude-plugins-community` 社区市场、`anthropics/claude-code` demo 市场，以及 `user / project / local / managed` 四种 scope，改正旧稿中“每个插件必须有 plugin.json”“最小 manifest 必须含 name/version/description”“/plugin status 是主命令”等过时口径；第五点：重写 `第四篇_Plugin选型指南与团队落地_2026-05.md`，把选型建议改成更贴近工程实践的四层判断，并补上“不要把 Codex 命令写成 Claude Code 命令”“不要把 marketplace 仓库结构和用户配置路径混为一谈”两类高频误区。'
      },
      {
        category: '问题修复',
        time: '22:32',
        title: '校正 Agent Skills 系列对 Cursor 与 Claude 的过时口径',
        summary: '重写 Skill 系列目录页和 4 篇正文中关于 Cursor、Claude Code 与 Agent Skills 标准字段的表述，修正“Cursor 只有 rules”“Claude 只有 commands”这类已过时结论，并同步重建站内笔记索引。',
        content: '第一点：更新 `public/notes/AI工具/03_规则机制层/Skill/目录.md` 与四篇正文，把复核时间统一刷新到 `2026-05-24`，并把总口径从“Codex/Kiro 用 skills，Cursor 偏 rules，Claude 偏 commands”修正为“各家都已正式支持 skills，但长期规范与快捷入口仍应分别落在 rules / AGENTS / CLAUDE / commands”；第二点：在 `第一篇_AgentSkills开放标准与各工具兼容性全解.md` 中补入 Cursor `2.4` 已官方支持 Agent Skills、Claude Code 已有正式 skills 文档且 custom commands 并入 skills 的结论，同时把 `metadata`、`license`、`compatibility` 从“统一降级字段”改为 Agent Skills 规范层字段；第三点：在 `第二篇_AgentSkills高级用法与进阶技巧.md` 中重分“规范层字段”“产品专属扩展”“版本敏感说法”，避免再把 Claude 已文档化的能力与真正缺乏跨工具共识的能力混写；第四点：在 `第三篇_AgentSkills场景模板与案例库.md` 与 `第四篇_AgentSkills团队协作与社区资源.md` 中改写 Cursor 与 Claude 的落地建议，明确 Cursor 现在是 skills 与 rules 并存、Claude 现在是 skills 为主再按需补 commands；第五点：按仓库规则执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检并成功运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表与搜索能读到这轮修正文案。'
      },
      {
        category: '内容上新',
        time: '22:34',
        title: '新增前端开发搜索资料 MCP 详细推荐清单',
        summary: '在 `MCP/02_常用MCP清单` 下新增面向前端开发者的搜索资料型 MCP 推荐稿，结合官方资料详细对比 Context7、Exa、GitHub MCP、Brave Search、Tavily 的定位、场景、优缺点和组合建议。',
        content: '第一点：新增 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第二篇_前端开发常用搜索资料MCP推荐_2026-05.md`，按“查官方文档、找最新资料、读源码与 Issue、批量抽取页面内容”四类前端高频场景，详细推荐 `Context7`、`Exa MCP`、`GitHub MCP`、`Brave Search MCP`、`Tavily MCP` 五个资料检索型 MCP，并给出优先级、适用场景、优势局限和组合建议；第二点：更新 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第一篇_常用MCP分类与选型总览.md`，为“搜索、阅读与知识检索类 MCP”补上第二篇详细清单入口，让总览页和单篇深挖页形成前后承接；第三点：按仓库规则先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 做 Node 运行时预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表与搜索立刻能检索到这篇新清单；第四点：本次推荐优先采用官方资料与官方仓库核对当前口径，包括 Context7 官方文档、Exa 官方文档、GitHub 官方 MCP 文档与仓库、Brave Search MCP 官方仓库、Tavily MCP 官方文档，尽量避免把过时的社区二手整理直接写进笔记。'
      },
      {
        category: '内容上新',
        time: '23:08',
        title: '补充前端开发常用 Skills 清单并接入 Skill 场景目录',
        summary: '新增一篇面向前端开发者的 Skills 推荐清单，按“现成可参考”和“强烈建议自定义”两类整理 `frontend-design`、`browser`、`responsive-debug`、`accessibility-audit`、`component-patterns`、`performance-audit` 的适用场景与优先级，并把它挂到 Skill 场景模板目录下。',
        content: '第一点：新增 `public/notes/AI工具/03_规则机制层/Skill/03_场景模板与案例库/补充篇_前端开发常用Skills清单与选型建议_2026-05.md`，围绕“前端开发最常用哪些 skills”这个问题，按“现成可参考”和“更适合自己做”两类整理前端技能清单，重点解释为什么页面实现应优先看 `frontend-design`、真实验收应优先看 `browser`，以及为什么 `responsive-debug`、`accessibility-audit`、`component-patterns`、`performance-audit` 更适合团队自己沉淀；第二点：更新 `public/notes/AI工具/03_规则机制层/Skill/03_场景模板与案例库/第三篇_AgentSkills场景模板与案例库.md`，补一段“延伸阅读”，把这篇前端补充清单接到主文末尾；第三点：更新 `public/notes/AI工具/03_规则机制层/Skill/目录.md`，让根目录页也能直接把“前端开发常用 skills 清单”引导给主人；第四点：本次整理优先依据 Kiro 官方 Agent Skills 文档、Cursor 官方 Agent Skills 文档与 `2.4` 更新说明、Claude Code 官方 skills 文档，以及本机当前可确认存在的 Codex `frontend-design` 与 `browser` skills，不把“官方支持 skills 机制”和“官方已经自带某个前端 skill”混写；第五点：按仓库规则先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表和搜索立即收录这篇补充清单。'
      }
    ]
  },
  {
    id: 'history-2026-05-25',
    date: '2026-05-25',
    items: [
      {
        category: '内容上新',
        time: '09:51',
        title: '聚焦前端 UI 设计搜索补强 MCP 与 Skill 专项方案',
        summary: '在既有前端常用清单基础上，新增“前端设计/UI 资料搜索”专项内容，补齐 UI 检索组合、关键词模板、筛选标准与从搜索到实现的流程化落地方案。',
        content: '第一点：更新 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第二篇_前端开发常用搜索资料MCP推荐_2026-05.md`，新增“前端 UI 设计资料搜索专项”，明确 `Figma Dev Mode MCP + Context7 + shadcn MCP + Exa MCP` 的组合分工；第二点：在同文补充 UI 检索关键词模板、资料筛选标准与“搜索 -> 设计信息抽取 -> 组件落地 -> 浏览器验收 -> 回归验证”的最短流程；第三点：更新 `public/notes/AI工具/03_规则机制层/Skill/03_场景模板与案例库/补充篇_前端开发常用Skills清单与选型建议_2026-05.md`，新增 `ui-research-to-implementation` 专项 skill，补充输入输出定义、执行流程与触发词示例，让“前端 UI 搜索资料”从概念建议升级为可直接执行的任务模板。'
      }
    ]
  },
  {
    id: 'history-2026-05-27',
    date: '2026-05-27',
    items: [
      {
        category: '内容上新',
        time: '21:05',
        title: '重构 Claude Code 系列为更适合小白顺读的小文章',
        summary:
          '围绕 `public/notes/AI工具/02_终端Agent流/ClaudeCode/` 整组系列，先按官方资料重构目录与 6 篇正文，再补做一轮官方最新口径复核，修正模式、skills、1M context、`/loop`、`/schedule` 与智谱 GLM 映射等时效性更强的说明。',
        content:
          '第一点：重写 `public/notes/AI工具/02_终端Agent流/ClaudeCode/目录.md`，改为“先说结论 + 推荐阅读顺序 + 每篇解决什么问题 + 最适合主人的阅读方式”的新手导向目录页，并补齐 Claude Code 与智谱 GLM 官方参考链接；第二点：重写第一篇到第六篇正文，统一加入“这篇读完能做什么”“先学主线、后学扩展”的节奏，把 `第一篇_ClaudeCode快速上手与工作原理_2026-03.md`、`第二篇_ClaudeCode功能全景与记忆机制_2026-03.md`、`第三篇_ClaudeCode常见工作流与最佳实践_2026-03.md`、`第四篇_ClaudeCode从0到1全攻略_视频笔记_2026-03.md`、`第五篇_ClaudeCode设置与个性化_2026-03.md`、`第六篇_ClaudeCode接入智谱GLM与IDE插件_2026-03.md` 分别改造成更像顺读型教程的小文章；第三点：按 2026-05-27 官方文档补精确口径，明确 Claude Code 当前完整权限模式是 `default / acceptEdits / plan / auto / dontAsk / bypassPermissions`，补充 custom commands 已并入 skills、`AGENTS.md` 需要通过 `CLAUDE.md` 的 `@AGENTS.md` 复用、`/loop` 与 `/schedule` 的当前官方语义，以及 `default` 模型别名和 1M context 的当前订阅规则；第四点：在 GLM 接入篇里显式写出智谱官方文档之间关于 `GLM-5.1` 映射当前仍存在页内不一致，分别列出主指南页、`using5-1` 页面和 FAQ 的三套口径，避免主人误以为是自己配置出错；第五点：按仓库归档规则先将旧 `data/dailyChangeSummary.js` 中 `2026-05-25` 的消息迁移到 `data/history/2026-05-21_30.js`，再重建今天摘要；第六点：后续已按要求执行运行时预检和索引/通知生成，让站内目录、搜索与通知同步更新。'
      }
    ]
  },
  {
    id: 'history-2026-05-30',
    date: '2026-05-30',
    items: [
      {
        category: "内容上新",
        time: "17:33",
        title: "把 Claude Code 系列重构为程序员深度实战版",
        summary: "围绕 `public/notes/AI工具/02_终端Agent流/ClaudeCode/` 重新按程序员真实使用路径重写整组核心文章，重点补齐安装更新、终端英文提示、`CLAUDE.md`、配置作用域、工作流模板、skills/MCP/plugin 调用链与第三方线路判断，并清理掉价值偏弱的冗余第四篇；其中第七篇已进一步改成“终端界面逐屏翻译版”，第一篇与第七篇也继续补上以 Mermaid 文字图为主的图文速记块，现专题篇名也已按保留文章顺延整理为连续的第一篇到第六篇，这一轮还继续补写了主人截图里 `/agents`、`/effort`、`/background`、`/add-dir`、`/export`、`/loop`、`/simplify`、`/insights` 与 `claude agents/attach/logs/stop` 的官方性对照说明。",
        content: "第一点：重写 `public/notes/AI工具/02_终端Agent流/ClaudeCode/第一篇_ClaudeCode快速上手与工作原理_2026-03.md`，把内容从“新手导览”升级为程序员上手稿，并在后续继续压缩成更适合快速阅读的版本，重点保留 `npm` 安装更新、终端常见英文提示、权限模式与第一轮最小任务主线；第二点：重写 `第二篇_ClaudeCode功能全景与记忆机制_2026-03.md` 与原 `第五篇_ClaudeCode设置与个性化_2026-03.md`，把规则层、权限层、记忆层、扩展层拆开说明，重点补清 `CLAUDE.md`、`CLAUDE.local.md`、`.claude/rules/*.md` 的职责边界，明确 `@AGENTS.md` 的复用方式、memory 应沉淀什么信息、skills 与 hooks / MCP / plugins 的差异，以及 settings 的 `User / Project / Local / Managed` 作用域、模式选择、sandbox、模型、`effort` 与上下文的工程化理解；第三点：重写 `第三篇_ClaudeCode常见工作流与最佳实践_2026-03.md`，把内容升级成程序员日常任务模板库，系统补齐“看陌生仓库、修 bug、做重构、补测试、改文档、并行任务、会话管理”的可复用 prompt 骨架与验证方式；第四点：重写原 `第七篇_ClaudeCode的Skills_MCP_Plugin怎么安装调用与排错_2026-05.md`，把偏概念内容彻底改成“终端界面逐屏翻译 + 官方文档对照讲解”版本，围绕主人真实看到的 `/mcp`、`/skills`、`/plugin` 与斜杠命令列表，逐项解释 `connected`、`failed`、`plugin`、`locked by plugin`、`~40 tok`、`Discover`、`Installed`、`Errors` 等英文提示是什么意思，并补上“内置命令 / plugin skill / MCP prompt 怎么区分”和“装完后到底去哪一层调用”的最小判断法；这一次又继续补写“主人截图里这些命令哪些是官方的”小节，按官方 `commands`、`sub-agents`、`agents`、`agent-view`、`interactive-mode` 文档对 `/add-dir`、`/agents`、`/background`、`/effort`、`/export`、`/insights`、`/tasks`、`/loop`、`/simplify` 以及 `claude agents`、`claude attach <id>`、`claude logs <id>`、`claude stop <id>` 做了逐项对照，并补充 `Running / Library / Built-in (always available)`、后台 session shell 子命令、`Skill(update-config)` 权限提示应如何理解，以及把文末官方参考链接修正为真实可打开的 `skills`、`sub-agents`、`agents`、`agent-view`、`interactive-mode`、`model-config`、`scheduled-tasks` 等页面；第五点：将原 `第六篇_ClaudeCode接入智谱GLM与IDE插件_2026-03.md` 重写并改名为 `第六篇_ClaudeCode接入中转_LLMGateway与多模型线路实战_2026-03.md`，把方向从“GLM + IDE 判断”调整为更贴近真实使用场景的“Claude Code 接入中转、LLM Gateway 与多模型线路实战”，并补上手改 `settings.json`、多模型映射、CC Switch 场景和最小自检流程模板；第六点：重写 `public/notes/AI工具/02_终端Agent流/ClaudeCode/目录.md`，把整个系列按“跑通本体 -> 稳定主线 -> 加能力层 -> 再折腾扩展”的学习路径重排，并在这次继续把篇章顺序收整为连续编号：保留现有 6 篇文章，统一改成 `第一篇` 到 `第六篇`，同步完成文件名、frontmatter 标题、正文 H1、目录页文案和站内跳转链接改名；第七点：在中途试写过一版视频复盘型第四篇后，最终判断其信息与第一篇、第三篇重叠过高、独立价值偏弱，因此已删除 `第四篇_ClaudeCode从0到1全攻略_视频笔记_2026-03.md`，并同步从目录页与站内索引中移除入口；第八点：修复了 Claude Code 专题内一处误写成 `</Users/...>` 本地绝对路径的正文链接，改回站内 `#/note/...` 路由，并顺手对 `public/notes/` 做了本地路径链接体检，确认当前不再残留 `</Users/...>`、`/Users/...`、`C:\\...`、`file://...` 这类不该出现在站内文章里的本地路径链接；第九点：按仓库归档规则先将旧 `data/dailyChangeSummary.js` 中 `2026-05-27` 的摘要迁移到 `data/history/2026-05-21_30.js`，再重建今天摘要；第十点：执行 `pwsh -File scripts/checkNodeRuntime.ps1` 通过 Node 运行时预检，并持续刷新索引与通知，让站内搜索、目录与消息抽屉同步展示这轮 Claude Code 系列重构后的最终状态；第十一步：把第一篇和原第七篇里原本单独生成的 SVG 速认卡改回更适合笔记维护的 Mermaid 文字图，直接在正文里用可编辑语法展示欢迎页结构、终端状态词、快捷键分组、`/mcp` 阅读顺序、`/plugin` 安装判断、斜杠命令来源和详细转录阅读逻辑。"
      },
      {
        category: "内容上新",
        time: "19:17",
        title: "整理 CC Switch 跨机同步排障专题与 Codex 关联资料",
        summary: "将原 `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/` 整体迁移到 `public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/`，新增 `第五篇_CCSwitch跨机同步后绝对路径污染排障手册_2026-05.md`，并继续按官方 `v3.16.0`、Settings 与 FAQ 刷新 `CCSwitch` 专题的目录、总览、云同步与排障边界，把“症状爆在 Codex、根因落在 CC Switch provider 快照、SSOT 与跨机路径污染”的两层资料收成一组且修正到最新口径。",
        content: "第一点：将原 `Codex` 目录下的 `中转切换与Node排障` 整组资料包整体迁移到 `public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/`，保留 `目录.md`、主文、`Node环境一键对比采集脚本.ps1` 与 `对比报告/` 结构不变；第二点：把主文文件名改为 `第一篇_CCSwitch切换CodexProvider后Node调用失败排查修复实录_2026-04.md`，同步修正 frontmatter 标题、H1 和导语，让“根因在 CC Switch provider 快照与 `cc-switch.db`，症状出现在 Codex 终端”这层归因更加明确；第三点：根据桌面手册新增 `public/notes/AI工具/05_辅助工具层/CCSwitch/第五篇_CCSwitch跨机同步后绝对路径污染排障手册_2026-05.md`，系统整理跨机导出导入 / 云同步后为什么会出现旧机器绝对路径污染、为什么只修 live 配置不够、以及如何按“先修源头、再修结果文件、最后验证”的顺序处理；第四点：正文中把 CC Switch 官方 FAQ 与 Settings 手册能直接确认的内容单列出来，包括 `~/.cc-switch/`、`cc-switch.db` 作为 SSOT、导出 / 导入覆盖语义、设备级设置不跨设备、WebDAV 下载前自动备份等，再把这次实际踩中的 `npm_config_cache`、旧用户名目录、`bundled-marketplaces`、项目路径污染归纳为实战排障结论；第五点：重写 `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`，把新第五篇和 `Codex切换后Node排障` 专题一起纳入推荐顺序，并保留 `public/notes/AI工具/02_终端Agent流/Codex/目录.md` 中的导流入口，让读者既能按根因从 CCSwitch 读，也能按症状从 Codex 目录找回来；第六点：基于官方 latest release `v3.16.0`、Settings 与 FAQ，对 `CCSwitch/目录.md`、第一篇、第四篇、第五篇以及第二篇中的版本口径做了二次校准，修正了 Homebrew 安装方式、WebDAV `v2` / 远程快照 / 下载前安全备份、export 不包含 `usage logs` 与 `device-level settings`，以及“哪些文件可手改、哪些不建议手改”的官方边界，避免专题继续停留在 `v3.15.0` / `2026-05-24` 口径。"
      }
    ]
  }
]
