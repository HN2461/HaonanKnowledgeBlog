---
title: 第二十六篇：Cursor Slack 集成与后台 Agent 协作（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Slack
  - Background Agents
  - 团队协作
description: 基于 Cursor 官方 Slack 集成文档整理 Slack App 安装、@Cursor 命令、频道默认仓库、隐私设置、状态更新和 handoff，帮助团队在 Slack 里直接驱动后台 Agent。
order: 26
---

# 第二十六篇：Cursor Slack 集成与后台 Agent 协作（2026-04）

> 本篇基于 Cursor 官方 Slack 集成文档整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. Slack 集成适合什么团队

官方文档说明，Cursor 的 Slack 集成可以让你在 Slack 中直接通过 `@Cursor` 触发 Background Agents。

适合：

- 团队大量在 Slack 中沟通需求
- 想把 issue / bug / PR 讨论和 Agent 执行衔接起来
- 需要异步推进任务，而不总回到编辑器里发起

这更像是“把 Agent 入口搬进协作工具”，而不是单纯消息提醒。

---

## 2. 安装步骤

官方文档给出的流程：

1. 打开 Cursor integrations
2. 在 Slack 旁点击 `Connect`
3. 安装 Cursor Slack App 到 workspace
4. 完成后返回 Cursor 完成配置
5. 连接 GitHub、选择默认 repo、开启 usage-based pricing、确认隐私设置

注意：Slack 集成和 GitHub 集成通常是联动的，因为后台 Agent 最终要在仓库里工作。

---

## 3. 基本用法

最常见的触发方式：

```text
@Cursor [prompt]
```

例如：

```text
@Cursor 修复登录页移动端按钮重叠问题，并给出 PR
```

官方文档说明，这已经覆盖大多数用例；如果你想先看命令清单，可以先输入：

```text
@Cursor help
```

另外，Slack 集成里有一个容易混淆的点：

- `@Cursor [prompt]` 更适合发起新任务，或者在你自己拥有的 agent 线程里追加 follow-up
- 如果线程里已经有 agent，且你想强制再开一个新的后台 agent，官方建议使用 `@Cursor agent [prompt]`

---

## 4. 频道默认仓库

官方文档提到，可以通过：

```text
@Cursor settings
```

在某个频道里设置默认仓库。

这很有价值，因为它能减少大家每次都手动指定 repo。文档也说明：

- 频道级设置优先于个人默认设置
- 显式参数仍可以覆盖频道默认值

如果你偶尔需要覆盖默认仓库、分支或自动建 PR 行为，也可以直接在消息里加参数，例如：

```text
@Cursor [repo=owner/repo, branch=main, autopr=false] 先分析这个回归问题
```

这对多团队、多仓库 Slack workspace 很实用。

---

## 5. 状态更新与 handoff

官方文档说明：

- Agent 运行时，会先出现 `Open in Cursor`
- 完成后，你会在 Slack 中收到通知
- 同时能看到查看 GitHub PR 的入口

也就是说，Slack 集成很适合：

- 发起任务
- 跟踪状态
- 接收 handoff

但真正的代码审查和收尾，仍然建议回到 Cursor 或 GitHub 里完成。

---

## 6. 管理后台 Agent

官方文档提到，可以用：

```text
@Cursor list my agents
```

查看所有运行中的后台 Agent。

而默认 repo、base branch、model、是否自动开 PR 这类长期默认值，则更适合回到 `Dashboard -> Background Agents` 里统一配置。

在消息右上角的上下文菜单里，还可以：

- Add follow-up
- Delete
- View request ID
- Give feedback

这说明 Slack 不只是“发起入口”，也有一套最基础的运行管理能力。

---

## 7. 隐私注意事项

官方文档特别提到：

- Background Agents 支持 Privacy Mode
- 但 Privacy Mode (Legacy) 不兼容
- 运行中的 Agent 需要临时存储代码
- `Display Agent Summary`、`Display Diff Images` 这类展示项可以单独控制是否显示

对于 Slack Connect 或外部成员参与的频道，文档还提到可以单独控制是否显示摘要，避免把 agent 结果直接暴露给外部协作方。

这点很重要：协作效率和信息暴露范围要一起考虑。

---

## 8. 一句话总结

Slack 集成最适合把“发起任务、跟踪状态、接收 handoff”前置到团队沟通流里，但真正的权限、隐私和仓库治理仍然要回到 Cursor 和 GitHub 层统一控制。

---

## 参考资料

- Cursor Slack Integration：`https://docs.cursor.com/en/integrations/slack`
