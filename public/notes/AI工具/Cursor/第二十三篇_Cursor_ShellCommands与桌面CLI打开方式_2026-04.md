---
title: 第二十三篇：Cursor Shell Commands 与桌面 CLI 打开方式（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Shell Commands
  - CLI
  - 打开方式
description: 基于 Cursor 官方 Shell Commands 与 Cursor CLI 文档整理 `cursor` / `code` 命令安装、打开文件与文件夹、多窗口、等待退出和 VS Code 兼容命令，帮助把桌面版 Cursor 接入终端工作流。
order: 23
---

# 第二十三篇：Cursor Shell Commands 与桌面 CLI 打开方式（2026-04）

> 本篇基于 Cursor 官方 Shell Commands 与 Cursor CLI 文档整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. 这不是 `cursor-agent`

很多人会把桌面版的 `cursor` shell command 和 `cursor-agent` CLI 混在一起。

区别是：

| 命令 | 作用 |
| --- | --- |
| `cursor` / `code` | 从终端打开 Cursor 桌面版中的文件或项目 |
| `cursor-agent` | 在终端里直接和 AI agent 交互 |

本篇讲的是前者，也就是“像用 `code .` 一样打开 Cursor”。

---

## 2. 如何安装 shell commands

官方文档说明，可以通过 Command Palette 安装：

1. 打开 Command Palette
2. 输入 `Install`
3. 运行 `Install 'cursor' to shell`
4. 如有需要，再运行 `Install 'code' to shell`

安装后，这两个命令会进入你的 PATH，之后任何终端会话都可用。

---

## 3. 为什么还要装 `code`

官方文档说明，`code` 命令是为了 VS Code compatibility 提供的。

这意味着：

- 老脚本里如果写了 `code .`
- 你的肌肉记忆已经习惯 `code`
- 某些文档或工具默认提示用 `code`

你都可以继续沿用，而底层实际打开的是 Cursor。

---

## 4. 基本用法

官方文档给出的常见用法：

```bash
cursor file.js
cursor ./my-project
cursor .
```

也可以一次打开多个对象：

```bash
cursor file1.js file2.js folder1/
```

适合：

- 从终端快速回到当前项目
- 配合脚本定位到某个文件
- 在 README 或内部文档里直接给出打开方式

---

## 5. 常用参数

官方文档列出的常用选项：

| 参数 | 作用 |
| --- | --- |
| `-n` / `--new-window` | 新窗口打开 |
| `-w` / `--wait` | 等待窗口关闭后再返回 |

### 5.1 `--new-window`

适合：

- 你想把不同项目分不同窗口
- 避免复用当前窗口打断上下文

### 5.2 `--wait`

适合：

- 需要脚本等待你处理完某个文件
- 想把 Cursor 作为外部编辑器使用

---

## 6. 实战场景

### 6.1 在当前目录打开项目

```bash
cursor .
```

### 6.2 新窗口打开另一个项目

```bash
cursor -n ../another-project
```

### 6.3 把 Cursor 当外部编辑器

```bash
cursor -w file.md
```

---

## 7. 适合写进个人工作流的地方

可以放到：

- shell alias
- bat / ps1 脚本
- README 开发说明
- 内部 onboarding 文档

例如：

```bash
alias c='cursor .'
```

或者在 Windows PowerShell 里做一个简短函数。

---

## 8. 常见问题

### 8.1 `cursor` 和 `code` 有什么区别

官方 FAQ 说明，本质上都可以打开 Cursor；`code` 主要用于 VS Code 兼容。

### 8.2 一定要两个都装吗

不需要。按你的习惯装一个或两个都可以。

### 8.3 命令装到哪里

官方 FAQ 说明，会写入你的默认 shell 配置文件，例如 `.bashrc`、`.zshrc` 或 fish 配置文件。

---

## 9. 一句话总结

`cursor` shell command 的价值不是“炫技”，而是把 Cursor 真正纳入终端工作流。你可以像用 `code .` 一样快速打开项目，而不用每次手动点图标找目录。

---

## 参考资料

- Cursor Shell Commands：`https://docs.cursor.com/configuration/shell`
- Cursor CLI：`https://docs.cursor.com/tools/cli`
