---
title: 第八篇：Cursor Bugbot PR 代码审查实践（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Bugbot
  - Pull Request
  - 代码审查
description: 基于 Cursor 官方 Bugbot 文档整理 PR 自动审查、GitHub 接入、手动触发、Fix in Cursor、.cursor/BUGBOT.md 规则文件和常见排障方式，适合团队把 AI 审查纳入代码合并流程。
order: 8
---

# 第八篇：Cursor Bugbot PR 代码审查实践（2026-04）

> 本篇基于 Cursor 官方 Bugbot 文档整理，资料快照时间：2026-04-14。价格、额度和套餐规则容易变化，具体以官方页面为准。

[[toc]]

---

## 1. Bugbot 是什么

Bugbot 是 Cursor 提供的 AI 代码审查能力，面向 Pull Request 场景。

官方文档描述它会分析 PR diff，并留下带解释和修复建议的评论，重点识别：

- bug
- 安全问题
- 代码质量问题

它不是替代人工 review，而是把“第一轮自动排查”前置，让人类 reviewer 更快聚焦高价值判断。

---

## 2. 它适合解决什么问题

适合：

- PR 改动较多，需要先扫一遍明显风险
- 团队想统一最低审查标准
- 作者想在人工 review 前先自查
- 需要对安全、边界条件和回归风险做额外提醒

不适合：

- 替代产品验收
- 替代架构决策
- 替代复杂业务语义判断
- 在没有测试和人工复核的情况下直接合并

一句话：Bugbot 是“自动审查助手”，不是“合并许可机器”。

---

## 3. 工作方式

官方文档里提到两种触发方式：

1. 自动运行：每次 PR 更新时运行审查
2. 手动触发：在 PR 评论中输入触发命令

常见手动触发评论：

```text
cursor review
```

或：

```text
bugbot run
```

部分文档也提到 `cursor run` 作为触发方式。实际以当前 GitHub App 和官方文档为准。

---

## 4. 基础接入流程

官方文档说明，接入通常需要 Cursor admin 权限和 GitHub 组织 admin 权限。

基础步骤：

1. 进入 `cursor.com/dashboard`
2. 打开 Bugbot 相关页面
3. 连接 GitHub
4. 按 GitHub App 安装流程授权
5. 回到 dashboard，为指定仓库开启 Bugbot

注意：这一步涉及仓库权限，团队项目最好由仓库管理员统一操作，不要个人私自授权生产仓库。

---

## 5. `.cursor/BUGBOT.md`：给审查提供项目规则

官方文档说明，可以创建 `.cursor/BUGBOT.md` 为 Bugbot 提供项目级上下文。

它的读取规则很有用：

- 根目录 `.cursor/BUGBOT.md` 总是会被包含
- 当审查某个文件时，会从变更文件向上查找额外的 `.cursor/BUGBOT.md`

也就是说，你可以这样组织：

```text
project/
  .cursor/BUGBOT.md
  backend/
    .cursor/BUGBOT.md
    api/
      .cursor/BUGBOT.md
  frontend/
    .cursor/BUGBOT.md
```

这样前端改动会带上前端规则，后端 API 改动会带上 API 规则。

---

## 6. 根目录 `BUGBOT.md` 模板

可以先从这个最小模板开始：

```markdown
# Bugbot Review Guide

## Focus
- 优先检查行为回归、安全边界、错误处理和缺失测试
- 对纯样式变更不要过度提出架构建议

## Project Rules
- 不要建议手动修改生成文件
- 涉及 public/notes 的内容变更后，应提醒运行 npm run generate:index
- 涉及移动端布局时，注意滚动容器和视口高度兼容

## Comment Style
- 评论要指出具体风险和建议修复方向
- 如果只是偏好问题，请标为 non-blocking
```

模板重点是让 Bugbot 关注“这个项目真正容易出问题的地方”。

---

## 7. 子目录规则模板

例如前端目录：

```markdown
# Frontend Review Rules

- 检查移动端布局和可访问性影响
- 检查组件状态是否会在路由切换后泄漏
- 检查事件监听是否在卸载时清理
- 检查新增异步逻辑是否处理 loading 和 error
```

例如后端目录：

```markdown
# Backend Review Rules

- 检查鉴权与权限边界
- 检查输入校验和异常处理
- 检查数据库查询是否可能引入 N+1 或注入风险
- 检查日志是否泄露敏感信息
```

这些规则不需要写成大文档，越具体越好。

---

## 8. Fix in Cursor 和 Fix in Web

官方文档提到，Bugbot 评论里会提供修复入口：

- Fix in Cursor：在 Cursor 中打开对应问题
- Fix in Web：在 `cursor.com/agents` 中打开对应问题

实操建议：

1. 先读完整评论，不要直接接受修复
2. 判断是否真是 bug，还是风格建议
3. 如果要修，尽量在新提交里单独处理
4. 修完后重新跑测试或让 Bugbot 再 review

---

## 9. 排障方式

如果 Bugbot 没有按预期工作，官方文档建议：

1. 检查权限，确认 Bugbot 有仓库访问权
2. 检查 GitHub App 是否安装并启用
3. 使用 verbose 模式获取详细日志和 request ID

verbose 触发示例：

```text
cursor review verbose=true
```

或：

```text
bugbot run verbose=true
```

报告问题时带上 request ID，会更容易定位。

---

## 10. 团队使用建议

### 10.1 先在低风险仓库试点

不要一开始就全组织启用。先选一个中等活跃仓库，观察评论质量和噪声。

### 10.2 给 Bugbot 明确审查重点

`.cursor/BUGBOT.md` 不要写“请提高代码质量”这种泛话，而要写项目真实风险。

### 10.3 评论要分级处理

可以在团队约定：

- 明确 bug：必须处理或解释
- 安全风险：必须处理或升级讨论
- 可维护性建议：按情况处理
- 风格偏好：不阻塞合并

### 10.4 不要跳过人工 review

Bugbot 可以帮你找问题，但不能承担上下文、业务目标、产品决策和发布风险的最终责任。

---

## 11. 适合写进 `BUGBOT.md` 的内容

- 本项目最常见的线上事故类型
- 哪些目录是生成文件
- 哪些模块对安全敏感
- 前端常见兼容性要求
- 后端权限与审计要求
- 测试缺失时应该提醒的边界
- 哪些建议是 non-blocking

不适合写：

- 密钥
- 内部账号
- 与审查无关的长篇项目历史
- 容易过期的临时需求

---

## 12. 一句话总结

Bugbot 的价值不在于“替你合并代码”，而在于把 PR 审查里可自动化的一部分提前做掉。

真正稳定的做法是：GitHub 接入 + `.cursor/BUGBOT.md` 明确规则 + 人工复核 + 测试验证。

---

## 参考资料

- Cursor Bugbot：`https://docs.cursor.com/en/bugbot`
