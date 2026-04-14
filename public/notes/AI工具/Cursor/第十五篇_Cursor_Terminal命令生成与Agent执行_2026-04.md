---
title: 第十五篇：Cursor Terminal 命令生成与 Agent 执行（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Terminal
  - Agent
  - 命令执行
description: 基于 Cursor 官方 Terminal 文档整理终端 Ctrl/Cmd+K 命令生成、Agent 自动执行命令、Skip 中断、复杂 shell prompt 排障和安全使用清单，帮助把命令行能力纳入可控工作流。
order: 15
---

# 第十五篇：Cursor Terminal 命令生成与 Agent 执行（2026-04）

> 本篇基于 Cursor 官方 Terminal 文档整理，并加入命令安全使用建议，资料快照时间：2026-04-14。

[[toc]]

---

## 1. Cursor 里的 Terminal 有两类 AI 用法

Cursor 的终端能力可以分成两类：

1. 你在终端里用自然语言生成命令
2. Agent 在任务过程中自动运行命令

这两类能力都很有用，但风险不同。

| 用法 | 适合场景 | 风险 |
| --- | --- | --- |
| 终端 `Ctrl/Cmd + K` | 你自己确认后执行命令 | 生成命令不一定完全符合意图 |
| Agent 执行命令 | 自动跑测试、安装、构建 | 可能长时间运行或执行高风险命令 |

所以终端能力的核心不是“让 AI 替你敲命令”，而是“让命令执行进入可审查流程”。

---

## 2. 终端里用 Ctrl/Cmd + K 生成命令

官方文档说明，在 Cursor 终端中按：

```text
Ctrl/Cmd + K
```

会打开底部 prompt bar。你描述想做的事情，Cursor 会生成对应命令。

例如：

```text
列出最近 10 条 git 提交，只显示哈希和标题
```

或：

```text
查找 public/notes 目录下最近修改的 10 个 Markdown 文件
```

官方文档也说明，终端 Inline Edit 会使用最近的终端历史、你的指令和 prompt 内容作为上下文。

---

## 3. 命令生成后的检查清单

执行前至少看三点：

1. 路径是否正确
2. 是否包含删除、覆盖、递归移动等危险动作
3. 是否会访问外部网络或泄露敏感信息

高风险关键词要特别小心：

```text
rm
del
Remove-Item
git reset
git clean
curl | bash
Invoke-Expression
```

在 Windows PowerShell 里，也要特别小心拼接字符串执行命令，避免误删路径。

---

## 4. Agent 自动执行终端命令

官方 Agent Terminal 文档说明，Agent 会在 Cursor 原生终端中执行命令，并保留历史。

适合自动执行：

- `npm test`
- `npm run build`
- `npm run lint`
- `git diff --stat`
- 只读搜索命令

不建议自动执行：

- 部署命令
- 数据库迁移
- 删除文件
- 清理 Git 工作区
- 带生产凭据的命令
- 不可信脚本下载后直接执行

你可以在 prompt 里限制：

```text
允许运行测试和只读检查命令。
不要执行删除、部署、重置 Git 状态或访问生产环境的命令。
```

---

## 5. Skip：中断正在运行的命令

官方文档说明，Agent 执行命令时可以点击 Skip，它会发送：

```text
Ctrl + C
```

用来中断命令。

适合：

- 测试卡住
- dev server 不需要继续跑
- 命令进入交互式等待
- 输出异常增长
- 你发现命令不该继续执行

看到命令不对时，不要等它跑完，直接中断。

---

## 6. shell 主题导致输出异常

官方文档提到，有些 shell 主题，例如 Powerlevel9k / Powerlevel10k，可能影响 Agent 的内联终端输出，导致截断或格式错乱。

官方建议在 Agent 运行时禁用复杂 prompt 或切换为简单 prompt。

可以利用环境变量：

```bash
CURSOR_AGENT
```

示例思路：

```bash
if [[ -n "$CURSOR_AGENT" ]]; then
  PS1='\u@\h \W \$ '
fi
```

也就是说，当检测到 Agent 环境时，简化终端 prompt，减少输出解析问题。

---

## 7. Windows 项目里的使用建议

如果你在 Windows PowerShell 中使用 Cursor，建议：

1. 让 Agent 优先使用当前 shell 原生命令
2. 不要把 PowerShell 枚举路径后传给另一个 shell 做删除
3. 递归删除前要求它先打印目标绝对路径
4. 涉及中文路径时，确认编码和引号处理
5. 对破坏性命令保持手动确认

示例 prompt：

```text
如果需要删除或移动文件，请先输出将操作的绝对路径和原因，等待我确认后再执行。
```

---

## 8. 适合写进规则的终端约束

可以把下面这段写进项目规则：

```markdown
## Terminal Safety
- 允许运行 npm test、npm run build、npm run lint 等验证命令
- 禁止自动执行部署、数据库迁移、递归删除和 git reset --hard
- 递归删除或移动文件前必须先说明目标绝对路径并等待确认
- 运行失败时必须如实报告错误输出，不要假设通过
```

这比每次 prompt 里重复安全说明更稳。

---

## 9. 一套安全工作流

1. Ask 先定位问题
2. Agent 给计划
3. 明确允许执行哪些命令
4. 修改后运行最小验证
5. 命令卡住时 Skip
6. 输出异常时先排查 shell prompt

---

## 10. 一句话总结

Cursor 的 Terminal 能力很强，但要把它当成“可审查的命令助手”。自然语言生成命令要先看再跑，Agent 自动执行命令要设边界，遇到异常要及时中断。

---

## 参考资料

- Cursor Terminal Prompt：`https://docs.cursor.com/zh/inline-edit/terminal`
- Cursor Agent Terminal：`https://docs.cursor.com/zh/agent/terminal`
- Cursor Keyboard Shortcuts：`https://docs.cursor.com/en/advanced/keyboard-shortcuts`
