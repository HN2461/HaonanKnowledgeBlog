# Codex 终端零基础入门文章 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Codex 专题中新增一篇面向终端零基础用户的入门文章，并同步更新专题目录、站内索引与当日变更摘要。

**Architecture:** 以一篇独立 Markdown 文章承载正文，在 Codex 专题目录页补一个入口链接，随后用现有索引脚本刷新 `public/notes-index.json`。同时按仓库约定把本次内容类改动写入 `data/dailyChangeSummary.js`，保证站内消息汇总能感知这次更新。

**Tech Stack:** Markdown, Vue 博客内容约定, Node.js 索引脚本, PowerShell

---

### Task 1: 新增终端零基础文章

**Files:**
- Create: `public/notes/AI工具/02_终端Agent流/Codex/第十四篇_CloudCodex终端基础操作入门_零基础版_2026-06.md`
- Reference: `docs/superpowers/specs/2026-06-02-codex-terminal-basics-design.md`

- [ ] **Step 1: 写入 frontmatter 和文章结构**

```md
---
title: 第十四篇：Cloud Codex 终端基础操作入门（零基础版）
date: 2026-06-02
category: AI工具
tags:
  - Codex
  - 终端
  - PowerShell
  - CLI
  - 零基础
description: 面向经常打开 Cloud Codex、但终端基础较弱的用户，按“我现在想去哪、想看什么、想停什么、想跑什么”的真实场景讲清最常用的 PowerShell 基础操作。
---
```

- [ ] **Step 2: 按场景写正文**

```md
## 1. 先别背很多命令，先记住这件事

终端里最重要的不是一次性把命令背全，而是先搞清楚：

1. 我现在在哪个目录
2. 我眼前能看到什么
3. 我下一步是想进去、想查看、想新建，还是想停止
```

- [ ] **Step 3: 补“Cloud Codex 里最小操作流”和避坑提醒**

```md
## 10. 在 Cloud Codex 里最常用的一套最小操作流

1. 先用 `pwd` 看自己当前在哪
2. 用 `dir` 看当前目录里有什么
3. 用 `cd 路径` 进入项目目录
4. 用 `git status` 或 `dir` 确认自己确实进对了地方
5. 再执行 `npm run dev`、`npm test` 这类项目命令
6. 命令卡住或跑错时，先按 `Ctrl + C`
```

- [ ] **Step 4: 自查 frontmatter 与标题一致性**

Run: 人工检查文章最顶部 frontmatter、正文 H1、文件名中的篇名语义一致  
Expected: 标题统一，不把 frontmatter 渲染进正文

### Task 2: 更新 Codex 专题目录入口

**Files:**
- Modify: `public/notes/AI工具/02_终端Agent流/Codex/目录.md`

- [ ] **Step 1: 在主线区域新增文章入口**

```md
### X. 终端零基础补齐

[第十四篇：Cloud Codex 终端基础操作入门（零基础版）](#/note/AI工具/02_终端Agent流/Codex/第十四篇_CloudCodex终端基础操作入门_零基础版_2026-06)

这篇专门给“会用 `cd`，但其他终端操作还不顺手”的主人补最基础的一层。  
重点解决：

1. 我现在在哪
2. 我怎么进项目
3. 我怎么查看文件和目录
4. 命令卡住时怎么停
```

- [ ] **Step 2: 让目录页阅读顺序自然**

Run: 人工检查新入口前后文  
Expected: 新文章位置与“CLI 第一日上手”“英文终端界面排错”形成递进，不打乱现有目录逻辑

### Task 3: 刷新生成文件

**Files:**
- Modify: `public/notes-index.json`

- [ ] **Step 1: 先做 Node 运行时预检**

Run: `pwsh -File scripts/checkNodeRuntime.ps1`  
Expected: 预检通过，确认当前终端可安全执行 Node / npm 脚本

- [ ] **Step 2: 重新生成笔记索引**

Run: `npm run generate:index`  
Expected: `public/notes-index.json` 更新并收录新文章

- [ ] **Step 3: 抽查新文章是否进入索引**

Run: 在 `public/notes-index.json` 中搜索 `Cloud Codex 终端基础操作入门`  
Expected: 能找到新文章标题、路径或摘要字段

### Task 4: 更新当日汇总

**Files:**
- Modify: `data/dailyChangeSummary.js`

- [ ] **Step 1: 读取当前系统时间**

Run: `Get-Date -Format "HH:mm"`  
Expected: 返回当前时间字符串，用于 `time` 字段

- [ ] **Step 2: 追加一条当天摘要**

```js
{
  category: '内容上新',
  time: 'HH:mm',
  title: '补充 Cloud Codex 终端零基础入门文章',
  summary: '在 Codex 专题新增一篇面向终端零基础用户的入门文章，用真实场景讲解最常用的 PowerShell 基础操作，并同步更新专题目录与站内索引。',
  content: '第一点：新增终端零基础文章；第二点：补 Codex 专题目录入口；第三点：重新生成 notes 索引，确保站内搜索可见。'
}
```

- [ ] **Step 3: 人工检查当天日期未被误改**

Run: 人工检查 `date` 仍为 `2026-06-02`  
Expected: 只新增当天消息，不破坏已有当天条目

### Task 5: 最终验证

**Files:**
- Verify: `public/notes/AI工具/02_终端Agent流/Codex/第十四篇_CloudCodex终端基础操作入门_零基础版_2026-06.md`
- Verify: `public/notes/AI工具/02_终端Agent流/Codex/目录.md`
- Verify: `public/notes-index.json`
- Verify: `data/dailyChangeSummary.js`

- [ ] **Step 1: 查看工作区变更**

Run: `git status --short`  
Expected: 只看到本次新增 / 修改的目标文件

- [ ] **Step 2: 抽查文章标题与目录链接**

Run: 人工检查 Markdown 文件名、frontmatter 标题、目录页链接 slug  
Expected: 页面标题与路由路径一致，没有断链风险

- [ ] **Step 3: 记录验证结果**

Run: 汇总已执行的预检与生成命令  
Expected: 最终答复中明确说明哪些命令已执行、哪些仅做人工检查
