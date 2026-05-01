---
title: 第一篇：Claude Code 快速上手与工作原理（2026-05复核）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - 快速上手
  - 权限模式
  - 上下文
  - CLI
description: 按 2026-05-01 Claude Code 官方 Quickstart、Interactive Mode、Permission Modes 与 How Claude Code Works 文档复核，更新安装方式、会话恢复、上下文管理与当前权限模式说明。
---

# 第一篇：Claude Code 快速上手与工作原理（2026-05复核）

> 核对时间：2026-05-01  
> 适合人群：第一次上手 Claude Code，或者之前只看过 2026-03 左右教程、现在想知道哪些地方已经变了的人。  
> 结论先说：**快速开始主线没变，但模式、上下文管理和权限细节已经比早期教程丰富很多。**

[[toc]]

---

## 1. 开始前先准备什么

准备清单：

- 一个可用终端
- 一个真实代码仓库
- 可用账号之一：Claude 订阅、Claude Console 账户，或第三方云提供商接入

现在 Claude Code 不只在 CLI 里可用，也能在：

- Claude Code on the web
- Desktop
- VS Code
- JetBrains
- Slack
- CI / 自动化场景

如果主人只想先体验，CLI 仍然是最直接的入口。

---

## 2. 安装 Claude Code

Anthropic 官方当前主推的安装方式仍然是安装脚本或原生分发：

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

```bat
:: Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

补充：

- `brew install --cask claude-code`
- `winget install Anthropic.ClaudeCode`

什么时候还会看到 `npm install -g @anthropic-ai/claude-code`？

- 一些第三方接入文档还在用这个流程
- 比如智谱 GLM 当前官方接入页就还是这么写

但如果主人是走 Anthropic 官方路径，优先按官方安装脚本来。

---

## 3. 登录与启动会话

进入项目目录后直接启动：

```bash
cd /path/to/your/project
claude
```

如果没有自动进入登录流程，可手动运行：

```text
/login
```

现在还有几个很实用的入口：

- `/status`：看当前版本、模型、账号和连接状态
- `/ide`：看 IDE 集成状态
- `/doctor`：检查安装与设置问题

也可以用 `/login` 手动触发登录。登录后凭证会被保存，下次无需重复登录。

---

## 4. 第一轮提问，别急着让它改代码

第一次进入项目，先问高层问题最省心：

```text
这个项目做什么？
主入口点在哪里？
解释一下目录结构
列出我应该先读的 5 个文件
```

这样做的目的不是“聊天”，而是先让 Claude 建立正确上下文。  
如果一上来就让它改，很容易在没读懂仓库时就开始误操作。

---

## 5. 第一次改动，建议走“小步可验证”

示例任务：

```text
在主文件里加一个 hello world 函数，并告诉我你改了什么
```

更稳的节奏通常是：

1. 先让它说明准备改哪几个文件
2. 再执行改动
3. 最后让它给出验证方式

如果主人愿意放宽一步一步确认的成本，可以切到 `acceptEdits`。

### 5.1 在 Claude Code 中使用 Git

示例提示：

```text
我更改了哪些文件？
用描述性消息提交我的更改
创建一个名为 feature/quickstart 的新分支
显示我最后的 5 次提交
帮我解决合并冲突
```

### 5.2 修复错误或添加功能

示例提示：

```text
向用户注册表单添加输入验证
有一个错误，用户可以提交空表单 - 修复它
```

Claude 会定位相关代码、理解上下文、实现修复，并在可用时运行测试。

### 5.3 其他常见工作流示例

```text
重构身份验证模块以使用 async/await 而不是回调
为计算器函数编写单元测试
使用安装说明更新 README
审查我的更改并建议改进
```

---

## 6. Claude Code 如何工作

核心心智仍然是这一套：

1. 收集上下文
2. 调工具行动
3. 检查结果
4. 再决定下一步

也就是官方常说的 agentic loop。

Claude Code 本身不是单纯“聊天框”，而是：

- 模型
- 工具系统
- 上下文装配
- 权限与执行环境

这四者一起工作，才形成“能读代码、能改文件、能跑命令、能验证结果”的编码代理。

---

## 7. 会话、恢复与上下文管理

当前会话管理比旧教程里更重要，建议主人重点记住下面几个命令：

- `claude --continue`：继续当前目录最近一次会话
- `claude --resume`：打开会话选择器
- `--fork-session`：从现有历史分叉新会话
- `/context`：看当前上下文占用
- `/compact`：压缩上下文但保留主线
- `/clear`：开一个全新上下文
- `/recap`：手动生成当前会话一句话总结

几个要点：

- 恢复会话后，之前会话里的权限放行不会自动继承
- `/compact` 适合“继续同一个任务，但别再带着整个长对话跑”
- `/clear` 适合“我要做一个全新任务”

---

## 8. 当前权限模式，已经不止 3 个

这是 2026-05 和早期教程差异最大的地方之一。

当前常见模式：

1. `default`
   - 每次关键动作问你
2. `acceptEdits`
   - 自动接受工作目录内文件改动
   - 还会自动放行常见文件系统 Bash 命令，如 `mkdir`、`touch`、`rm`、`mv`、`cp`、`sed`
3. `plan`
   - 只分析和出计划，不执行改动
4. `auto`
   - 研究预览能力，由分类器替你处理一部分安全权限请求
   - 是“全手动”和 `--dangerously-skip-permissions` 之间的中间层
5. `bypassPermissions`
   - 完全跳过权限提示
6. `dontAsk`
   - 默认拒绝工具，除非预先允许

要点：

- `Shift+Tab` 只会循环当前环境里“可见”的模式，不是所有环境都有全部模式
- `auto` 和 `bypassPermissions` 需要额外条件或设置才会出现
- `dontAsk` 不会出现在循环里，通常要通过启动参数或配置指定

启动时可直接指定：

```bash
claude --permission-mode plan
claude --permission-mode acceptEdits
claude --dangerously-skip-permissions
```

---

## 9. 为什么很多老教程会误导你

如果主人看的是 2026-03 左右的视频或博客，最常见的误导点有这些：

- 把模式说成只有默认 / 自动接受编辑 / Plan 三种
- 把 `acceptEdits` 说成“只自动写文件，不会自动跑命令”
- 把危险模式命令写成 `claude dangerously-skip-permissions`
- 把 `Ctrl+O` 说成“展示详细思考”

现在更准确的说法是：

- 模式体系已经扩展
- `acceptEdits` 已经会自动放行一部分低风险文件系统命令
- 危险模式应该写成 `claude --dangerously-skip-permissions`
- `Ctrl+O` 是 transcript viewer，主要看工具调用与执行明细

---

## 10. 新手第一周最值得养成的习惯

我的建议是：

1. 先问清楚，再让它改
2. 复杂任务先 `/plan`
3. 改完就要验证，不要只看“它说改好了”
4. 长会话适时 `/compact`
5. 高风险命令别轻易开 `bypassPermissions`

这套习惯比记 50 个命令更值钱。

---

## 11. 最小验证清单

1. 运行 `claude` 能进入会话
2. `/help` 能看到命令列表
3. `/status` 能看到当前版本和模型
4. 输入“这个项目做什么？”能拿到结构化概览
5. `Shift+Tab` 或模式选择器能切换到 `plan`
6. `/context` 能看到上下文占用
7. `/compact` 能正常工作

---

## 12. 排障清单

1. Windows 无法安装或命令缺失：确认已安装 Git for Windows
2. Homebrew/WinGet 版本过旧：手动执行升级命令
3. 恢复会话后需要再次授权：这是正常行为，权限不会继承
4. 多个终端恢复同一会话导致对话混乱：改用 `--fork-session`
5. 不确定安装是否正常：在会话内运行 `/doctor` 做诊断
6. 上下文频繁被压缩：把规则写入 `CLAUDE.md` 并用 `/compact` 控制保留

---

## 13. 参考资料

- https://code.claude.com/docs/en/quickstart
- https://code.claude.com/docs/en/how-claude-code-works
- https://code.claude.com/docs/en/interactive-mode
- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/commands
