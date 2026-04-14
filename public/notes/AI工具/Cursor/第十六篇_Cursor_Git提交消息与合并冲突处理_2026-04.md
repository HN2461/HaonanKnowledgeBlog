---
title: 第十六篇：Cursor Git 提交消息与合并冲突处理（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Git
  - Commit Message
  - Merge Conflict
description: 基于 Cursor 官方 Git 文档整理 AI Commit Message、快捷键绑定、合并冲突智能处理和人工审查清单，帮助把 Cursor 的 Git 辅助能力放进安全的提交与冲突解决流程。
order: 16
---

# 第十六篇：Cursor Git 提交消息与合并冲突处理（2026-04）

> 本篇基于 Cursor 官方 Git 文档整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. Cursor 的 Git 辅助能力

官方 Git 文档里，Cursor 提供两类常用 AI Git 能力：

- AI Commit Message：根据 staged changes 生成提交消息
- AI Resolve Conflicts：辅助理解并解决 merge conflicts

它们都能提高效率，但不能替代你对代码变更的审查。

特别是合并冲突，AI 可以给建议，但最终仍要由人确认业务语义是否正确。

---

## 2. AI Commit Message 怎么用

官方文档给出的流程是：

1. 把要提交的文件 stage
2. 打开侧边栏 Git 面板
3. 点击 commit message 输入框旁边的生成按钮
4. Cursor 根据 staged changes 和仓库 Git 历史生成提交消息

如果你的仓库使用 Conventional Commits 之类的约定，官方文档说明 Cursor 会尝试跟随已有提交模式。

---

## 3. 生成提交消息前先做什么

不要把所有改动一股脑 stage。

推荐顺序：

1. `git status` 看改动范围
2. `git diff` 或编辑器 diff 审查内容
3. 按主题 stage 文件
4. 再让 Cursor 生成 commit message

这样生成出来的提交消息才更准确。

如果一个 commit 同时包含“修 bug、加文章、改样式、重构工具函数”，AI 也很难生成清晰标题。

---

## 4. 给提交消息加快捷键

官方文档说明，可以给生成提交消息命令绑定快捷键。它给出的命令名是：

```json
{
  "key": "cmd+m",
  "command": "cursor.generateGitCommitMessage"
}
```

设置入口：

1. 打开 Keyboard Shortcuts
2. 或通过 `Ctrl+Shift+P` 搜索 `Open Keyboard Shortcuts (JSON)`
3. 添加对应 keybinding
4. 保存

注意：快捷键示例里的 `cmd+m` 更适合 macOS。Windows 可按自己的键位习惯调整。

---

## 5. 生成后一定要人工改

AI 生成的 commit message 可以当草稿，但不要无脑提交。

检查点：

- 范围是否正确
- 是否遗漏关键改动
- 是否夸大影响
- 是否符合仓库语言和格式
- 是否包含敏感信息

本仓库历史偏中文、功能导向标题，就应该保持这一风格，而不是突然切成不一致的英文标题。

---

## 6. 合并冲突怎么让 Cursor 辅助

官方文档说明，当发生 merge conflict 时，文件中会出现冲突标记，冲突界面中会出现 Resolve in Chat 按钮。

推荐流程：

1. 先看冲突文件和冲突范围
2. 点击 Resolve in Chat
3. 让 Agent 分析双方版本
4. 审查它给出的解决方案
5. 应用后运行相关测试或手动验证

示例 prompt：

```text
请解释这个合并冲突双方分别改了什么。
先给出解决方案，不要直接应用。
重点说明是否可能丢失任一侧的业务逻辑。
```

---

## 7. 合并冲突最怕什么

最怕把冲突当成纯文本问题。

冲突两边可能分别代表：

- 两个功能都新增了不同逻辑
- 一边修 bug，一边重构
- 一边改类型，一边改调用方
- 一边改业务规则，一边改 UI

AI 可以帮你看结构，但你要确认业务意图。

---

## 8. 冲突处理后的验证清单

冲突解决后建议至少做：

1. `git diff` 看最终文件
2. 搜索冲突标记，确认没有残留
3. 运行相关测试或构建
4. 手动打开关键页面或功能
5. 确认没有丢失任一侧的重要改动

搜索冲突标记可以用：

```bash
rg "<<<<<<<|=======|>>>>>>>"
```

如果项目没有 `rg`，用编辑器全局搜索也可以。

---

## 9. 适合写进项目规则的 Git 约束

```markdown
## Git Workflow
- 生成 commit message 前先确认 staged changes 只包含同一主题
- 提交标题使用中文祈使句，格式建议为 <范围>: <变更>
- 合并冲突解决后必须搜索冲突标记残留
- 不能使用 git reset --hard 或丢弃他人改动，除非用户明确要求
```

这类规则能减少 Agent 在 Git 操作里犯危险错误。

---

## 10. 常见误区

### 10.1 未审查 staged changes 就生成提交消息

提交消息再漂亮，也掩盖不了 commit 范围混乱。

### 10.2 冲突解决后不跑验证

冲突标记没了，不代表逻辑正确。

### 10.3 让 AI 直接决定保留哪一边

保留 ours 或 theirs 往往会丢逻辑。更稳的是让它先解释双方差异。

### 10.4 提交消息不符合仓库历史风格

官方文档说 Cursor 会尝试跟随现有风格，但你仍然要人工检查。

---

## 参考资料

- Cursor AI Commit Message：`https://docs.cursor.com/features/generate-commit-message`
- Cursor AI Resolve Conflicts：`https://docs.cursor.com/zh/more/ai-merge-conflicts`
- Cursor Keyboard Shortcuts：`https://docs.cursor.com/en/advanced/keyboard-shortcuts`
