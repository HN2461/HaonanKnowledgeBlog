# CC Switch 绝对路径污染排障文章落库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将桌面的 `CC-switch-跨机同步绝对路径排障手册.md` 整理为站内正式文章，并接入 `CCSwitch` 专题目录、索引和当日摘要。

**Architecture:** 新增一篇 `CCSwitch` 正式文章作为跨机同步后的专项排障篇，正文明确区分“官方可证实的信息”和“结合这次排障得出的实战结论”。保留现有 `Codex切换后Node排障` 专题不动，两者形成“跨机同步总排障”与“Codex Node 特例排障”的前后关系。

**Tech Stack:** Markdown frontmatter、站内 `#/note/...` 路由、官方 GitHub 文档链接、索引与通知生成脚本

---

### Task 1: 核对官方依据并确定文章定位

**Files:**
- Inspect: `C:/Users/HN246/Desktop/CC-switch-跨机同步绝对路径排障手册.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`
- Create: `docs/superpowers/plans/2026-05-30-ccswitch-path-pollution-article.md`

- [ ] **Step 1: 确定专题位置**

Decision:
- 文章落在 `public/notes/AI工具/05_辅助工具层/CCSwitch/`
- 编号为 `第五篇`
- 标题围绕“跨机同步后绝对路径污染排障”

- [ ] **Step 2: 记录官方可核对依据**

Official basis to reference:
- `~/.cc-switch/`、`cc-switch.db`、`settings.json`、SSOT、回填机制
- 导出 / 导入、设备级设置不跨设备
- WebDAV 上传下载覆盖与安全备份
- Common Config runtime overlay 与 live config / restore snapshot 行为

### Task 2: 新增正式文章并写入专题目录

**Files:**
- Create: `public/notes/AI工具/05_辅助工具层/CCSwitch/第五篇_CCSwitch跨机同步后绝对路径污染排障手册_2026-05.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`

- [ ] **Step 1: 新建文章**

Article requirements:
- 合法 frontmatter：`title/date/category/tags/description`
- 正文保留桌面手册的核心排障结构
- 增加“哪些是官方可证实、哪些是结合这次实战的推断”说明
- 加入关联阅读：`第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`
- 加入关联专题：`Codex切换后Node排障/目录.md`

- [ ] **Step 2: 更新 CCSwitch 目录**

Directory updates:
- 推荐顺序加入第五篇
- 覆盖主题补“绝对路径污染、旧用户名扫描、数据库源头修复”

### Task 3: 合并当日摘要并刷新站点数据

**Files:**
- Modify: `data/dailyChangeSummary.js`
- Generate: `public/notes-index.json`
- Generate: `public/search-index.json`
- Generate: `public/notifications.json`

- [ ] **Step 1: 合并到今天已有的 CC Switch 摘要**

Update existing `17:55` item so it also covers:
- 新增第五篇绝对路径污染排障文章
- 和已迁移的 `Codex切换后Node排障` 专题形成关系

- [ ] **Step 2: 运行验证与生成**

Run:
- `pwsh -File scripts/checkNodeRuntime.ps1`
- `npm run generate:index`
- `npm run generate:notifications`

Expected:
- 预检通过
- 索引成功
- 通知成功
