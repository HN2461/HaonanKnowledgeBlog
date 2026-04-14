---
title: 第七篇：Cursor CLI 与 Background Agents 工作流（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - CLI
  - Background Agents
  - 自动化工作流
description: 基于 Cursor 官方 CLI 与 Background Agents 文档整理终端 Agent、非交互式任务、会话恢复、远程后台 Agent、environment.json 环境配置和安全边界，帮助区分本地前台任务与远程异步任务。
order: 7
---

# 第七篇：Cursor CLI 与 Background Agents 工作流（2026-04）

> 本篇前半部分基于 Cursor 官方 CLI 文档，后半部分结合 Background Agents 官方文档做中文工作流整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. 为什么还需要 CLI 和 Background Agents

Cursor 编辑器适合前台交互式开发，但并不是所有任务都必须在编辑器里完成。

有两类场景值得单独看：

- Cursor CLI：你想在终端里直接和 Agent 交互，或把它接到脚本和 CI 里
- Background Agents：你想把一个相对独立的任务交给远程后台环境异步跑

简单区分：

| 能力 | 适合场景 |
| --- | --- |
| Cursor 编辑器 Agent | 本地前台开发、需要你随时看 diff |
| Cursor CLI | 终端工作流、脚本化、快速 review |
| Background Agents | 远程异步任务、可并行推进、可随时接管 |

---

## 2. Cursor CLI 是什么

官方文档说明，Cursor CLI 允许你直接在终端里与 AI agent 交互，用来写代码、审查代码、修改代码。

它有两个典型模式：

- 交互式模式：像终端聊天一样推进任务
- 非交互式模式：适合脚本、CI、自动化输出

官方也提示 Cursor CLI 当前处于 beta 阶段，实际命令和体验后续可能继续变化。

---

## 3. 安装 Cursor CLI

官方安装命令：

```bash
curl https://cursor.com/install -fsS | bash
```

验证命令：

```bash
cursor-agent --version
```

启动交互式会话：

```bash
cursor-agent
```

如果命令找不到，官方文档建议把 `~/.local/bin` 加到 PATH。

---

## 4. 交互式模式

最简单的用法：

```bash
cursor-agent
```

也可以带初始 prompt：

```bash
cursor-agent "refactor the auth module to use JWT tokens"
```

适合：

- 在终端里快速分析一段问题
- 边看命令输出边推进
- 不想打开完整 IDE 时处理小任务

不适合：

- 需要大量视觉化 diff 审查的复杂 UI 改动
- 需要频繁点击页面验证的前端交互任务

---

## 5. 非交互式模式

官方文档给出的典型模式是 `-p`：

```bash
cursor-agent -p "find and fix performance issues" --model "gpt-5"
```

也可以用于审查当前 Git 改动：

```bash
cursor-agent -p "review these changes for security issues" --output-format text
```

适合：

- 脚本化 review
- CI 里生成文本结果
- 批量检查某类问题

注意：非交互式任务要特别谨慎，prompt 要写清楚是否允许改文件、是否只输出建议、是否需要退出码约定。

---

## 6. 会话恢复

官方文档提供了会话相关命令：

```bash
cursor-agent ls
cursor-agent resume
cursor-agent --resume="chat-id-here"
```

使用建议：

- 短任务直接新会话
- 连续排查同一问题时 resume
- 切换任务时不要混用旧会话，避免上下文污染

---

## 7. Background Agents 是什么

Background Agents 是 Cursor 的远程异步 Agent。官方文档描述它可以在远程环境中编辑和运行代码，你可以查看状态、继续追问，或者随时接管。

它适合：

- 任务相对独立
- 需要长时间跑测试或构建
- 你不想一直盯着前台
- 多个方向可以并行探索

不适合：

- 高风险、大范围无边界任务
- 需要大量人工即时判断的 UI 微调
- 依赖本机私有环境且无法复现的任务

---

## 8. Background Agents 怎么运行

官方文档说明：

- 默认运行在隔离的 Ubuntu-based 机器里
- Agent 有互联网访问能力，可以安装包
- 通过 GitHub 克隆仓库
- 在单独分支上工作，并把改动推回仓库方便交接

这意味着你要先考虑：

- 仓库是否可以授权给 GitHub App
- 依赖是否能在远程环境安装
- 是否需要私有子模块或内部包源
- 任务是否允许远程自动运行命令

---

## 9. 远程环境配置：`environment.json`

官方文档给出了 `environment.json` 形式，用来描述安装命令和后台终端。

示例：

```json
{
  "snapshot": "POPULATED_FROM_SETTINGS",
  "install": "npm install",
  "terminals": [
    {
      "name": "Run Next.js",
      "command": "npm run dev"
    }
  ]
}
```

实操理解：

- `install`：Agent 开始前安装依赖
- `terminals`：Agent 工作时保持运行的后台进程
- `snapshot`：用于复用已配置好的远程环境

如果项目需要 Docker、特定编译器或系统依赖，官方文档也提到可以用 Dockerfile 做更高级的机器配置。

---

## 10. 安全边界必须看清楚

Background Agents 的能力更强，安全边界也更重。

官方文档里特别说明了几个点：

1. 需要给 GitHub App 仓库读写权限
2. 代码会在 Cursor 的 AWS 基础设施中的隔离 VM 里运行
3. Agent 有互联网访问能力
4. Agent 会自动运行终端命令，用来迭代测试
5. 自动运行命令会带来数据外泄和 prompt injection 风险
6. 隐私模式开关对运行中的后台 Agent 有自己的生效边界

所以 Background Agents 不是“随便丢给后台就行”。它更适合边界清楚、风险可控、环境可复现的任务。

---

## 11. 一套推荐工作流

### 11.1 本地前台任务

适合用编辑器 Agent：

```text
请修复这个具体 bug，范围只限 A、B、C 三个文件。
改完后运行相关测试，并说明验证结果。
```

### 11.2 终端审查任务

适合用 CLI：

```bash
cursor-agent -p "review the current git changes for security and regression risks" --output-format text
```

### 11.3 异步探索任务

适合用 Background Agents：

```text
请在独立分支上探索将测试框架升级到新版本的最小改动方案。
不要修改业务代码。
完成后给出变更清单、失败测试和风险说明。
```

---

## 12. 使用建议

1. 小任务优先前台 Agent
2. 终端审查和自动化输出用 CLI
3. 长耗时、独立探索任务再用 Background Agents
4. 后台任务 prompt 必须写清楚禁区
5. 授权远程环境前先确认仓库安全边界
6. 合并后台分支前仍要人工 review

---

## 参考资料

- Cursor CLI Overview：`https://docs.cursor.com/en/cli/overview`
- Cursor CLI Installation：`https://docs.cursor.com/en/cli/installation`
- Cursor MCP for CLI：`https://docs.cursor.com/cli/mcp`
- Cursor Background Agents：`https://docs.cursor.com/background-agents`
