---
title: 第十二篇：Cursor Modes 与 Tools 权限配置（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Agent Modes
  - Tools
  - Custom Modes
description: 基于 Cursor 官方 Modes 与 Tools 文档整理 Agent、Ask、Manual、Custom Modes 的使用边界，以及 Search、Edit、Run、MCP 工具分组、Auto-run、Auto-fix 和安全护栏的配置思路。
order: 12
---

# 第十二篇：Cursor Modes 与 Tools 权限配置（2026-04）

> 本篇基于 Cursor 官方 Modes 与 Tools 文档整理，并结合中文实战做模式配置建议。Custom Modes 相关能力仍可能变化，资料快照时间：2026-04-14。

[[toc]]

---

## 1. 为什么要理解 Modes 与 Tools

Cursor Agent 不是只有“一个聊天框”。官方文档把模式和工具拆开描述：

- Modes 决定这次交互偏理解、执行还是定制工作流
- Tools 决定 Agent 能搜索、编辑、运行命令或调用外部服务

如果不给边界，Agent 就可能：

- 该只读时改了文件
- 该局部编辑时跑去全仓库搜索
- 该先问时直接执行命令
- 该谨慎调用 MCP 时自动访问外部服务

所以模式和工具权限，本质上是 AI 编程的安全护栏。

---

## 2. 官方模式速览

结合当前官方文档与产品界面，最常见的几种使用方式可以整理为：

| 模式 | 适合场景 | 能力边界 |
| --- | --- | --- |
| Agent | 复杂功能、重构、多文件任务 | 自主探索、编辑多文件、运行命令 |
| Ask | 学习、理解、规划、问答 | 只读探索，不自动修改 |
| Manual | 精准、目标明确的编辑 | 只改你明确选择的文件 |
| Custom | 专门工作流 | 用户自定义工具和指令 |

注意：不同语言版本文档和产品版本里，Manual 的展示位置可能略有差异，实际以当前 Cursor 客户端为准。

---

## 3. Agent：默认执行模式

Agent 适合：

- 多文件功能开发
- bug 排查与修复
- 重构
- 需要跑命令验证的任务

但 Agent 权限也最大，所以 prompt 必须更清楚：

```text
任务：修复移动端目录高亮问题
范围：只改阅读相关组件
约束：不要改首页，不要新增依赖
验证：改完后运行相关测试或说明无法运行原因
```

适合 Agent 的关键词：

- 实现
- 修复
- 重构
- 执行
- 验证

---

## 4. Ask：只读理解模式

Ask 适合：

- 接手陌生项目
- 解释代码
- 做方案对比
- 先列风险
- 询问某个模块如何工作

示例：

```text
请只读分析，不要修改代码。
解释文章详情页的滚动容器是如何确定的，并指出可能影响移动端的文件。
```

Ask 的价值在于：先降低不确定性，再进入 Agent。

---

## 5. Manual：明确文件的精准编辑

官方的 Manual / 精确编辑思路，适合你已经知道要改哪些文件，并且不希望 Agent 自己搜索或跑命令时使用。

适合：

- 局部修文案
- 小范围 CSS 调整
- 单文件重写
- 对当前选择做明确编辑

示例：

```text
只修改当前选中文件，把这段逻辑改成更清晰的早返回写法。
不要搜索其他文件，不要运行命令。
```

如果你还不知道该改哪里，不要用 Manual，先用 Ask 或 Agent 进行定位。

---

## 6. Custom Modes：给固定工作流做专用模式

官方文档说明，Custom Modes 可以配置工具组合和自定义指令，适合专门工作流。目前属于 Beta 能力。

常见模板：

| 自定义模式 | 工具组合 | 指令重点 |
| --- | --- | --- |
| Learn | Search tools | 解释概念，避免改文件 |
| Refactor | Edit & Reapply | 不新增功能，只改善结构 |
| Plan | Codebase、Read file、Terminal | 生成详细计划，不直接实现 |
| Debug | Search、Terminal、Edit | 先调查，再修复 |

启用入口通常是：

```text
Cursor Settings -> Chat -> Custom Modes
```

---

## 7. Tools 分组怎么理解

官方 Tools 文档把工具大致分为：

### 7.1 Search

用于查找信息：

- Read File
- List Directory
- Codebase
- Grep
- Search Files
- Web
- Fetch Rules

适合只读理解和定位问题。

### 7.2 Edit

用于修改文件：

- Edit & Reapply
- Delete File

这是需要谨慎开放的工具组。尤其是 Delete File，适合高信任场景，不适合初学者默认开放。

### 7.3 Run

用于与终端交互：

- Terminal

它很有用，也有风险。终端能运行测试，也能运行危险命令。

### 7.4 MCP

用于调用外部服务：

- Toggle MCP Servers
- 连接数据库、第三方 API、文档系统等

MCP 工具要按服务来源和权限单独审查。

---

## 8. Auto-run 与 Auto-fix 的风险

官方文档提到 Agent 模式有 Auto-run 和 Auto-fix Errors 相关能力。

可以这样理解：

- Auto-run：让 Agent 自动执行命令
- Auto-fix Errors：让 Agent 根据错误继续自动修复

官方 Tools 页面还提供 Guardrails allow lists，可以单独指定哪些工具允许自动执行。团队如果准备开启 Auto-run，最好先把白名单收敛到 lint、测试、只读搜索这类低风险操作，再逐步扩大。

适合：

- 低风险本地测试
- lint、typecheck、单元测试
- sandbox 或专门测试仓库

不适合：

- 生产数据库相关命令
- 删除文件命令
- 部署命令
- 需要人工确认的迁移命令
- 含敏感数据的外部服务调用

---

## 9. 推荐模式配置

### 9.1 新手默认配置

- 日常理解：Ask
- 小改动：Manual 或 Inline Edit
- 多文件任务：Agent，但关闭高风险自动运行
- MCP：先手动审批，不开自动调用

### 9.2 熟练个人项目

- 常规任务：Agent
- 方案设计：Ask 或自定义 Plan
- 重构：自定义 Refactor
- 测试命令：允许自动运行白名单命令

### 9.3 团队项目

- 项目规则写入 `.cursor/rules`
- 高风险工具默认手动审批
- MCP 统一登记
- Background Agents 单独授权
- 合并前仍需人工 review

---

## 10. 自定义模式示例

### 10.1 Plan 模式

```text
你是规划模式。
请优先读取相关文件和项目规则，输出分阶段计划。
除非我明确要求，否则不要修改文件。
输出必须包含：目标、影响范围、风险、验证方式。
```

建议工具：

- Codebase
- Read File
- List Directory
- Terminal 可选

### 10.2 Review 模式

```text
你是代码评审模式。
只输出发现的问题，不要修改文件。
按严重程度排序，重点关注行为回归、安全风险、边界条件和测试缺失。
```

建议工具：

- Read File
- Grep
- Codebase

### 10.3 Safe Refactor 模式

```text
你是安全重构模式。
目标是在不改变行为的前提下提升可读性。
禁止新增功能，禁止修改公开 API。
改动后必须说明如何验证行为未变。
```

建议工具：

- Read File
- Edit & Reapply
- Terminal 可选

---

## 11. 一句话总结

Cursor 的模式选择可以记成：

- 不确定，先 Ask
- 明确文件，用 Manual
- 多文件执行，用 Agent
- 高频流程，做 Custom Mode
- 高风险工具，默认手动审批

---

## 参考资料

- Cursor Modes：`https://docs.cursor.com/chat/manual`
- Cursor Tools：`https://docs.cursor.com/agent/tools`
- Cursor MCP：`https://docs.cursor.com/en/context/mcp`
