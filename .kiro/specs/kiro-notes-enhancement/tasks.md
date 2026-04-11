# Implementation Plan: kiro-notes-enhancement

## Overview

按顺序执行：先搭建测试基础设施（安装依赖 + 编写测试文件），再逐篇创建 6 篇 Kiro 笔记，然后更新目录文件，最后重建索引并验证所有测试通过。

## Tasks

- [x] 1. 搭建测试基础设施
  - [x] 1.1 安装 fast-check 依赖
    - 执行 `npm install --save-dev fast-check`，确认 `package.json` devDependencies 中出现 `fast-check`
    - _Requirements: 无（工程基础）_

  - [x] 1.2 创建测试文件 `src/utils/__tests__/kiro-notes.test.js`
    - 实现以下辅助函数：`parseFrontmatter(content)`、`stripFrontmatter(content)`、`stripFrontmatterAndCodeBlocks(content)`、`countChineseChars(str)`、`extractLinks(content)`
    - 实现 3 个单元测试：文件集合完整性（恰好 6 篇）、目录文件结构（4 个区块 + 6 条链接）、索引生成结果（6 条 Kiro 条目）
    - 实现 7 个属性测试（Property 1–7），每个测试注释标注 `// Feature: kiro-notes-enhancement, Property N: ...`，`numRuns: 100`
    - _Requirements: 2.1, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1, 5.3, 5.4, 5.5, 6.1–6.4_

- [x] 2. 创建第一篇笔记
  - [x] 2.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第一篇_Kiro快速上手与核心概念_2026-04.md`
    - frontmatter 字段：`title: 第一篇：Kiro 快速上手与核心概念（2026-04）`、`date: 2026-04-01`、`category: AI工具`、`tags: [Kiro, AI IDE, 快速上手, Spec驱动开发]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 2.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：Kiro 是什么、安装与启动、界面布局、核心概念速览、Spec 驱动开发 vs Vibe Coding、第一次对话、注意事项与常见问题、参考资料
    - 包含 kiro.dev 来源引用（参考资料区块）
    - 正文中文字符数（去除 frontmatter 和代码块）≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 2.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 3. 创建第二篇笔记
  - [x] 3.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第二篇_Kiro_Specs规格系统详解_2026-04.md`
    - frontmatter 字段：`title: 第二篇：Kiro Specs 规格系统详解（2026-04）`、`date: 2026-04-02`、`category: AI工具`、`tags: [Kiro, Specs, 规格驱动开发, requirements, design]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 3.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：Specs 系统概述、三层文档结构、Feature Spec vs Bugfix Spec、Requirements-First 工作流、Design-First 工作流、任务执行与状态追踪、Spec 文件存储位置、实战示例、注意事项与常见问题、参考资料
    - 包含代码块：requirements.md 示例（EARS 格式）、design.md 结构示例、tasks.md 任务列表示例、`.kiro/specs/` 目录结构
    - 正文中文字符数 ≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 3.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 4. 创建第三篇笔记
  - [x] 4.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第三篇_Kiro_Steering上下文管理_2026-04.md`
    - frontmatter 字段：`title: 第三篇：Kiro Steering 上下文管理（2026-04）`、`date: 2026-04-03`、`category: AI工具`、`tags: [Kiro, Steering, 上下文管理, AGENTS.md]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 4.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：Steering 是什么、三种作用域、三个基础 Steering 文件、四种 inclusion 模式详解、文件引用语法、与 AGENTS.md 的对比、作用域冲突规则、实战示例、注意事项与常见问题、参考资料
    - 包含代码块：Steering 文件 frontmatter 示例、fileMatch 模式配置、manual 模式引用语法、`.kiro/steering/` 目录结构
    - 正文中文字符数 ≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 4.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 5. 创建第四篇笔记
  - [x] 5.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第四篇_Kiro_Hooks自动化机制_2026-04.md`
    - frontmatter 字段：`title: 第四篇：Kiro Hooks 自动化机制（2026-04）`、`date: 2026-04-04`、`category: AI工具`、`tags: [Kiro, Hooks, 自动化, 事件驱动]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 5.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：Hooks 是什么、10 种触发事件类型、两种动作类型、工具类型过滤、Hook 文件格式、创建 Hook 的两种方式、Hook 存储位置、实战示例（文件保存后 lint）、实战示例（任务完成后通知）、注意事项与常见问题、参考资料
    - 包含代码块：Hook JSON 完整示例（含字段注释）、fileSave 触发 runCommand 示例、postTaskExecution 触发 askAgent 示例、`.kiro/hooks/` 目录结构
    - 正文中文字符数 ≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 5.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 6. 创建第五篇笔记
  - [x] 6.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第五篇_Kiro_MCP集成与工具扩展_2026-04.md`
    - frontmatter 字段：`title: 第五篇：Kiro MCP 集成与工具扩展（2026-04）`、`date: 2026-04-05`、`category: AI工具`、`tags: [Kiro, MCP, Model Context Protocol, 工具扩展]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 6.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：MCP 是什么、配置文件位置、本地 MCP 服务器配置、远程 MCP 服务器配置、关键配置字段详解、环境变量引用语法、内置 fetch MCP server、通过 Kiro 面板管理 MCP、实战示例、注意事项与常见问题、参考资料
    - 包含代码块：工作区级 mcp.json 完整示例（本地服务器）、远程服务器配置示例（含 headers）、环境变量引用示例、autoApprove 与 disabledTools 配置示例
    - 正文中文字符数 ≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 6.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 7. 创建第六篇笔记
  - [x] 7.1 写入 frontmatter
    - 文件路径：`public/notes/AI工具/Kiro/第六篇_Kiro工作流实战与最佳实践_2026-04.md`
    - frontmatter 字段：`title: 第六篇：Kiro 工作流实战与最佳实践（2026-04）`、`date: 2026-04-06`、`category: AI工具`、`tags: [Kiro, 工作流, 最佳实践, 对比分析]`、`description`（60-120 中文字符）
    - _Requirements: 3.1–3.8_

  - [x] 7.2 写入正文内容
    - 包含 `[[toc]]`、H1 标题、以下 H2 章节：端到端工作流概览、实战（从零开始一个功能）、Steering 最佳实践、Hooks 最佳实践、MCP 最佳实践、Kiro vs Claude Code vs Codex 横向对比、适合与不适合 Kiro 的场景、常见坑与解决方案、学习资源与社区、参考资料
    - 包含代码块：完整工作流 prompt 示例序列、Steering + Hooks 协同配置示例、三工具对比 Markdown 表格
    - 正文中文字符数 ≥ 1500
    - _Requirements: 1.2, 1.5, 2.1, 4.1–4.8_

  - [ ]\* 7.3 验证 Property 1–6 对本篇通过
    - **Property 1: Frontmatter 完整性**
    - **Property 2: Frontmatter 字段值合法性**
    - **Property 3: 文件命名规范**
    - **Property 4: 正文结构完整性**
    - **Property 5: 正文长度 ≥ 1500 中文字符**
    - **Property 6: 包含 kiro.dev 来源引用**
    - **Validates: Requirements 1.2, 1.5, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1**

- [x] 8. 更新目录文件
  - [x] 8.1 重写 `public/notes/AI工具/Kiro/目录.md`
    - 写入更新时间戳：`> 更新时间：2026-04-06`
    - 写入"推荐阅读顺序"区块：6 条有序列表，每条含链接（格式 `#/note/AI工具/Kiro/{filename_without_extension}`）和一行描述
    - 写入"覆盖主题"区块：按功能模块分组（Specs / Steering / Hooks / MCP / 工作流实战）
    - 写入"快速查找"区块：常见问题 → 对应篇目的映射表
    - _Requirements: 5.3, 6.1–6.4_

  - [ ]\* 8.2 验证 Property 7（目录链接有效性）
    - **Property 7: 目录导航链接格式与文件存在性**
    - **Validates: Requirements 5.3, 6.2**

- [x] 9. 重建索引与最终验证
  - [x] 9.1 运行 `npm run generate:index`
    - 确认脚本无报错退出
    - 确认 `public/notes-index.json` 中包含 6 条 `category` 为 `AI工具`、`tags` 含 `Kiro` 的条目
    - _Requirements: 5.4, 5.5_

  - [ ]\* 9.2 运行 `npm test -- --run` 验证所有测试通过
    - 7 个属性测试（Property 1–7）全部通过
    - 3 个单元测试（文件集合完整性、目录结构、索引生成结果）全部通过
    - **Validates: Requirements 2.1, 3.1–3.8, 4.2, 4.4, 4.7, 4.8, 5.1, 5.3–5.5, 6.1–6.4**

- [x] 10. 最终检查点
  - 确认所有测试通过，确认 `public/notes-index.json` 已更新，如有问题请告知。

## Notes

- 标有 `*` 的子任务为可选项，可跳过以加快 MVP 进度
- 每个笔记创建任务（2–7）均需满足：frontmatter 合法、正文 ≥ 1500 中文字符、包含 kiro.dev 引用、包含注意事项/常见问题小节
- 属性测试基于 `fc.constantFrom(...noteFiles)` 随机选取文件，`numRuns: 100`
- 索引生成前务必确认所有 frontmatter YAML 语法合法（冒号、引号、缩进）
