---
title: 第十八篇：Cursor Checkpoints 回滚与恢复（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Checkpoints
  - 回滚
  - Agent
description: 基于 Cursor 官方 Checkpoints 文档整理 Agent 自动快照、Restore Checkpoint 的两种入口、适用边界以及和 Git 的分工，帮助在 Agent 改坏代码时更快恢复状态。
order: 18
---

# 第十八篇：Cursor Checkpoints 回滚与恢复（2026-04）

> 本篇基于 Cursor 官方 Checkpoints 文档整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. Checkpoints 是什么

官方文档说明，Checkpoints 是 Cursor 自动创建的快照，用来保存 Agent 对代码库的修改状态，方便你在需要时回滚 Agent 改动。

它的定位非常明确：

- 只针对 Agent 改动
- 本地保存
- 独立于 Git
- 会自动清理

这意味着它非常适合“Agent 改坏了，想退回上一步”，但不适合当长期版本管理工具。

---

## 2. 怎么恢复 Checkpoint

官方文档给出两种恢复方式：

1. 在输入框附近，点击历史请求上的 `Restore Checkpoint`
2. 把鼠标移到某条消息上，点击 `+` 按钮

实操建议：

- 恢复前先确认是哪一轮 Agent 改动出了问题
- 只把 Checkpoint 当短期撤销工具
- 长期历史和重要节点仍然交给 Git

---

## 3. Checkpoints 和 Git 的分工

这两者不是替代关系。

| 能力 | 适合用途 |
| --- | --- |
| Checkpoints | 回滚最近的 Agent 改动 |
| Git | 保存长期历史、分支、合并、审查、协作 |

可以这样理解：

- Agent 改坏了但你还没提交：先看 Checkpoints
- 你要保留一个正式版本：用 Git commit
- 你要比较多人协作历史：用 Git

官方文档也明确提醒：Checkpoints 不是版本控制系统。

---

## 4. 它不会记录什么

官方文档说明，Checkpoints 不记录手动编辑。

这点很关键：

- 你自己手改的代码，不在 Checkpoints 里
- 它主要服务于 Agent 的自动修改过程

所以如果你混合做了很多手动编辑，再想完全依赖 Checkpoints 回退，就容易误判。

---

## 5. 适合使用的场景

适合：

- Agent 一轮改动明显跑偏
- 你想撤销刚刚那次自动修改
- 想快速比较“改前 / 改后”感觉
- 还没进入正式 Git 提交阶段

不适合：

- 替代 Git 分支
- 做长期里程碑记录
- 回滚大量手动编辑
- 当作团队共享历史

---

## 6. 推荐工作流

1. 让 Agent 做一轮可控范围修改
2. 先看 diff
3. 如果明显跑偏，立刻 Restore Checkpoint
4. 重新给更清晰的 prompt 再试
5. 确认稳定后再进入 Git 提交

这比“硬着头皮继续补丁式修复”更稳。

---

## 7. 常见误区

### 7.1 把 Checkpoints 当成 Git

Checkpoints 只适合短期回退，不承担正式历史管理。

### 7.2 手动改了很多还指望完全恢复

官方文档已经说明，手动编辑不会被跟踪。

### 7.3 回滚后不重新收敛 prompt

如果 prompt 本身不清楚，恢复后再跑一次还是会偏。

---

## 8. 一句话总结

Checkpoints 最适合做 Agent 改动的“本地短期后悔药”，而 Git 才是长期正式历史。能用 Checkpoint 快速回退时就别硬修，确认方向正确后再交给 Git。

---

## 参考资料

- Cursor Checkpoints：`https://docs.cursor.com/en/agent/chat/checkpoints`
