# CC Switch Codex Node 排障专题迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前放在 `Codex` 目录下、实际根因属于 `CC Switch` 的 Node 排障资料包迁移到 `CCSwitch` 专题，并修复相关目录入口、文内路径和站点索引。

**Architecture:** 保持“主文 + 目录页 + 脚本 + 对比报告”这一资料包结构不变，只调整专题归属与链接层。迁移后在 `CCSwitch` 保留主入口，在 `Codex` 总目录保留导流入口，避免读者按症状或按根因两条路径都找不到资料。

**Tech Stack:** Markdown frontmatter、站内 `#/note/...` 路由、PowerShell 文件迁移、索引与通知生成脚本

---

### Task 1: 迁移前定位与目录结构确认

**Files:**
- Modify: `docs/superpowers/plans/2026-05-30-ccswitch-codex-node-triage-migration.md`
- Inspect: `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/目录.md`
- Inspect: `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/第一篇_Codex中转切换后Node调用失败排查修复实录_2026-04.md`
- Inspect: `public/notes/AI工具/02_终端Agent流/Codex/目录.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`

- [ ] **Step 1: 确认现有资料包组成**

Run: `Get-ChildItem -Recurse -LiteralPath 'public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障'`
Expected: 看到 `目录.md`、主文、采集脚本和 `对比报告/`

- [ ] **Step 2: 确认外部引用位置**

Run: `rg -n --hidden '中转切换与Node排障|第一篇_Codex中转切换后Node调用失败排查修复实录' public/notes src data`
Expected: 至少命中 Codex 总目录、专题目录页和主文内部路径

### Task 2: 调整专题归属与文内表述

**Files:**
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/目录.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/第一篇_CCSwitch切换CodexProvider后Node调用失败排查修复实录_2026-04.md`
- Move: `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/*`

- [ ] **Step 1: 整体迁移专题目录**

Run: `Move-Item -LiteralPath 'public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障' -Destination 'public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障'`
Expected: `Codex` 目录下旧专题消失，`CCSwitch` 下出现新专题目录

- [ ] **Step 2: 修正目录页 frontmatter、标题与文案**

Update `目录.md` so that:
- `title` 改为 `CC Switch 切换 Codex 后 Node 排障目录`
- 正文首段明确“症状发生在 Codex，根因属于 CC Switch provider 快照与配置回写”
- 站内链接全部改到新 `#/note/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/...`

- [ ] **Step 3: 修正主文标题与内部路径**

Update main article so that:
- `title` 改为 `第一篇：CC Switch 切换 Codex Provider 后 Node 调用失败排查修复实录`
- H1 同步改名
- 旧的 `public/notes/AI工具/Codex/...`、`02_终端Agent流/Codex/中转切换与Node排障/...` 文本路径改成新 `CCSwitch/Codex切换后Node排障/...`

### Task 3: 更新双专题入口与站点索引

**Files:**
- Modify: `public/notes/AI工具/02_终端Agent流/Codex/目录.md`
- Modify: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`
- Modify: `data/dailyChangeSummary.js`
- Generate: `public/notes-index.json`

- [ ] **Step 1: 在 Codex 总目录保留导流入口**

Update `public/notes/AI工具/02_终端Agent流/Codex/目录.md` so that:
- 继续保留故障入口
- 文案改成“故障表现在 Codex，根因定位与资料包已迁到 CCSwitch 专题”
- 链接改到新专题目录页

- [ ] **Step 2: 在 CCSwitch 总目录新增专题入口**

Update `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md` so that:
- 推荐顺序中加入该专题
- 覆盖主题中补“跨机同步 / provider 快照污染 / Codex Node 终端排障”

- [ ] **Step 3: 更新当日摘要**

Append one `内容上新` item to `data/dailyChangeSummary.js` describing:
- `Codex` Node 排障专题迁入 `CCSwitch`
- 为什么迁
- 双目录入口如何保留

- [ ] **Step 4: 重新生成索引与通知**

Run:
- `pwsh -File scripts/checkNodeRuntime.ps1`
- `npm run generate:index`
- `npm run generate:notifications`

Expected:
- Node 预检通过
- 索引脚本成功
- 通知脚本成功

### Task 4: 最终复核

**Files:**
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障/目录.md`
- Inspect: `public/notes/AI工具/02_终端Agent流/Codex/目录.md`
- Inspect: `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`

- [ ] **Step 1: 检查旧路径是否仍残留**

Run: `rg -n --hidden '02_终端Agent流/Codex/中转切换与Node排障|public/notes/AI工具/Codex/中转切换与Node排障' public/notes data`
Expected: 不再命中新旧专题正文里的旧路径，只允许历史归档文件命中

- [ ] **Step 2: 检查新专题入口是否都可追踪**

Run: `rg -n --hidden '#/note/AI工具/05_辅助工具层/CCSwitch/Codex切换后Node排障' public/notes`
Expected: 命中 `Codex/目录.md`、`CCSwitch/目录.md` 和新专题目录页
