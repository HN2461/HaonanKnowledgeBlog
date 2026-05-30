# CC Switch v3.16.0 专题口径刷新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 `ccswitch.io/zh`、官方 GitHub `README / FAQ / Settings / latest release` 的最新口径，把 `CCSwitch` 专题中最容易过时的总览与跨机相关文章刷新到 `v3.16.0`。

**Architecture:** 只刷新最影响判断的内容，不重写整组专题。优先更新目录页、第一篇总览、第四篇跨机迁移、第五篇绝对路径污染手册，并对第二篇里已经明显错误的 latest release 说明做最小纠偏。

**Tech Stack:** Markdown frontmatter、站内 `#/note/...` 路由、官方 GitHub Releases / FAQ / Settings 文档、索引与通知生成脚本

---

### Task 1: 锁定最新官方口径与差异点

**Files:**
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/第一篇_CCSwitch快速上手与核心概念_2026-04.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/第五篇_CCSwitch跨机同步后绝对路径污染排障手册_2026-05.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/第二篇_CCSwitch接入中转站与计费排查_2026-04.md`

- [ ] **Step 1: 以最新 Release 为版本基准**

Use:
- GitHub latest release API result: `v3.16.0`
- Published at: `2026-05-29`

- [ ] **Step 2: 以 FAQ + Settings 为跨机与配置事实基准**

Keep aligned with:
- `~/.cc-switch/` structure
- `cc-switch.db` as SSOT
- `settings.json` as device-level settings
- export/import/WebDAV semantics
- manual DB editing not recommended

### Task 2: 刷新目录页与第一篇总览

**Files:**
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/第一篇_CCSwitch快速上手与核心概念_2026-04.md`

- [ ] **Step 1: 更新目录页版本口径**

Update:
- `description` 与推荐顺序中的第一篇文字从 `v3.15.0` 改到 `v3.16.0`
- 覆盖主题补工具生命周期管理、来源感知诊断、zh-TW 本地化等 `v3.16.0` 级别增量

- [ ] **Step 2: 更新第一篇总览**

Update:
- title / H1 / 当前版本 / 资料核对时间
- Homebrew 安装说明改为官方 cask，无需 `brew tap`
- 增加一段说明：官方资料内部有少量表述不同步，本篇以 latest release + Settings/FAQ 为准
- 在核心功能中补“工具安装与生命周期管理”
- 在版本简史里新增 `v3.16.0`

### Task 3: 刷新跨机迁移与路径污染文档

**Files:**
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/第五篇_CCSwitch跨机同步后绝对路径污染排障手册_2026-05.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/第二篇_CCSwitch接入中转站与计费排查_2026-04.md`

- [ ] **Step 1: 更新第四篇**

Update:
- title / 资料核对时间
- 补充 WebDAV v2、远程快照确认、下载前自动安全备份
- 解释导出 JSON 与 device-level settings 的边界

- [ ] **Step 2: 更新第五篇**

Update:
- 加入 FAQ 中“safe to edit manually / not recommended to edit manually”的边界
- 加入 export not included: usage logs / device-level settings
- 让“程序员兜底修库”建议更清楚地区分官方建议与工程实践

- [ ] **Step 3: 最小纠偏第二篇**

Update:
- latest release line from `v3.15.0` to `v3.16.0`
- one sentence from `v3.13.0 ~ v3.15.0` to `v3.13.0 ~ v3.16.0`

### Task 4: 合并当日摘要并刷新索引

**Files:**
- Modify: `data/dailyChangeSummary.js`
- Generate: `public/notes-index.json`
- Generate: `public/search-index.json`
- Generate: `public/notifications.json`

- [ ] **Step 1: 合并到现有 CC Switch 摘要**

Update existing CC Switch item so it also covers:
- official v3.16.0 refresh
- directory + first/fourth/fifth refresh

- [ ] **Step 2: 运行验证**

Run:
- `pwsh -File scripts/checkNodeRuntime.ps1`
- `npm run generate:index`
- `npm run generate:notifications`

Expected:
- Node precheck passes
- note/search index regenerated
- notifications regenerated
