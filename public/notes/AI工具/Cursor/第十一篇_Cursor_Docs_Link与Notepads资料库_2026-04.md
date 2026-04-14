---
title: '第十一篇：Cursor @Docs、@Link 与 Notepads 资料库（2026-04）'
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - '@Docs'
  - Notepads
  - 上下文资料库
description: '基于 Cursor 官方 @Docs、@Link、@Web、@Past Chats 与 Notepads 文档整理文档上下文管理方式，帮助把一次性链接、可复用资料、团队文档和历史对话分层使用。'
order: 11
---

# 第十一篇：Cursor @Docs、@Link 与 Notepads 资料库（2026-04）

> 本篇基于 Cursor 官方 @ Symbols 与 Notepads 文档整理。Notepads 仍属于 Beta 能力，资料快照时间：2026-04-14，后续可能变化或移除。

[[toc]]

---

## 1. 为什么要建立“资料库”意识

很多 Cursor 任务失败，不是模型不会写，而是上下文来源不稳定：

- 今天贴了文档链接，明天忘了
- 同一份 SDK 文档每次都重新解释
- 团队规则和临时需求混在一起
- 旧对话里的关键决策找不到

Cursor 提供了多种资料上下文入口：

- `@Docs`
- `@Link`
- `@Web`
- Notepads
- `@Past Chats`
- `@Files` / `@Folders`

它们解决的问题不同，不能混着用。

---

## 2. `@Docs`：把文档站加入上下文

官方文档说明，`@Docs` 可以把文档作为 AI 编码辅助的上下文。Cursor 自带一些常见框架和库的文档，也支持添加自己的文档 URL。

使用方式：

1. 在 Chat 里输入 `@Docs`
2. 选择已有文档，或选择 Add new doc
3. 粘贴文档站 URL
4. Cursor 会读取并理解文档及其子页面
5. 后续像引用其他文档一样使用

管理位置：

```text
Cursor Settings -> Indexing & Docs
```

适合：

- 框架官方文档
- SDK 文档
- 组件库文档
- 团队公开文档站
- 版本较稳定的接口说明

---

## 3. `@Link`：一次性引用网页和 PDF

官方文档说明，在 Chat 中粘贴 URL 时，Cursor 会自动把它标记为 `@Link` 并抓取内容作为上下文。它还支持公开可访问的 PDF URL，会抽取并解析 PDF 文本。

适合：

- 临时 PRD 链接
- 公开 API 文档链接
- 一次性 PDF 说明
- 某个 issue 或设计稿说明页

如果你只想把 URL 当普通文本，不想让 Cursor 抓取内容，可以：

- 点击标记后的链接选择 Unlink
- 粘贴时按住 `Shift`，避免自动标记

### `@Link` 和 `@Docs` 的区别

| 能力 | 适合场景 |
| --- | --- |
| `@Link` | 一次性网页、单页资料、临时 PDF |
| `@Docs` | 可复用文档站、框架库文档、团队长期资料 |

不要把每个临时链接都加到 `@Docs`，否则文档库会越来越乱。

---

## 4. `@Web`：搜索最新资料

官方文档说明，`@Web` 会使用搜索能力查找当前信息并加入上下文，也支持从直接链接解析 PDF。

注意点：

- Web search 默认关闭
- 需要在 `Settings -> Features -> Web Search` 启用
- 适合查最新资料
- 对高风险内容仍要人工核对来源

适合：

- 查新版本 API
- 查报错是否有近期变化
- 查当前文档是否迁移
- 查依赖库的最新说明

不适合：

- 需要完全离线或私有资料的场景
- 不能把信息发到外部搜索的企业项目

---

## 5. Notepads：可复用上下文集合

官方文档说明，Notepads 是 Cursor 中用于共享上下文的 Beta 工具，可以在 Composer 和 Chat 之间共享内容，扩展了 `.cursorrules` 的能力。

Notepads 可以包含：

- 想法
- 规则
- 文档
- 文件附件
- 动态模板

并且可以用 `@` 语法引用。

### 5.1 适合写进 Notepads 的内容

- 组件生成模板
- 项目架构说明
- 设计系统使用说明
- 常用 prompt 模板
- 模块开发清单
- 需要反复引用的一组文件和说明

### 5.2 不适合写进 Notepads 的内容

- 密钥
- 临时 bug 现象
- 已经过期的一次性需求
- 需要强制长期生效的底线规则

强制项目规则更适合放 `AGENTS.md` 或 `.cursor/rules`，Notepads 更适合做“可引用资料包”。

---

## 6. `@Past Chats`：复用历史对话摘要

官方文档说明，`@Past Chats` 可以把历史聊天的摘要作为上下文带入当前任务。

适合：

- 上次讨论过方案，这次继续实现
- 旧会话里有关键决策
- 同一个复杂任务被拆成多天推进
- 想把过去的推理过程带给新对话

注意：

- 它引用的是摘要，不是完整历史
- 重要结论最好沉淀到规则或文档
- 不要长期依赖历史对话当项目知识库

---

## 7. 一套资料分层建议

| 资料类型 | 推荐放哪里 |
| --- | --- |
| 项目长期规则 | `AGENTS.md` / `.cursor/rules` |
| SDK 官方文档 | `@Docs` |
| 临时网页或 PDF | `@Link` |
| 最新外部信息 | `@Web` |
| 可复用上下文包 | Notepads |
| 旧会话决策 | `@Past Chats`，再沉淀到文档 |
| 本次修改文件 | `@Files` / `@Folders` |

这套分层能减少两类问题：

- 资料重复粘贴
- 临时资料污染长期规则

---

## 8. 实战示例：接入一个 UI 组件库

推荐流程：

1. 用 `@Docs` 添加组件库官方文档
2. 用 `@Link` 引用本次需求设计稿或 PRD
3. 用 `@Files` 引用项目现有页面和组件
4. 如果有团队 UI 规范，写进 Notepad 或 `.cursor/rules`
5. 让 Agent 先给实现方案，不要直接改代码

示例 prompt：

```text
@Docs uv-ui
@Link https://example.com/product-requirement
@src/views/ProfilePage.vue
请先基于组件库文档和当前页面结构，给出改造方案。
不要直接修改代码。
重点说明会用到哪些组件、有哪些兼容风险。
```

---

## 9. 常见误区

### 9.1 所有链接都加到 `@Docs`

长期稳定的文档站才适合 `@Docs`。一次性链接用 `@Link`。

### 9.2 Notepads 替代 Rules

Notepads 是可复用上下文，不是强制规则系统。

### 9.3 旧对话不沉淀

`@Past Chats` 可以续上下文，但重要项目知识应该写进文档或规则。

### 9.4 Web 搜索结果不核对

`@Web` 适合找资料，但重要结论仍要看来源质量和日期。

---

## 10. 一句话总结

Cursor 的上下文资料库应该分层管理：长期规则写规则文件，长期文档进 `@Docs`，临时链接用 `@Link`，可复用资料包放 Notepads，旧决策用 `@Past Chats` 过渡后沉淀。

---

## 参考资料

- Cursor @Docs：`https://docs.cursor.com/es/context/%40-symbols/%40-docs`
- Cursor @Link：`https://docs.cursor.com/context/%40-symbols/%40-link`
- Cursor @Web：`https://docs.cursor.com/en/context/%40-symbols/%40-web`
- Cursor @Past Chats：`https://docs.cursor.com/context/%40-symbols/%40-past-chats`
- Cursor Notepads：`https://docs.cursor.com/beta/notepads`
