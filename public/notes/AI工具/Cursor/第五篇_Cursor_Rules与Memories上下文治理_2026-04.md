---
title: 第五篇：Cursor Rules 与 Memories 上下文治理（2026-04）
date: 2026-04-14
category: AI工具
tags:
  - Cursor
  - Rules
  - Memories
  - 上下文治理
description: 基于 Cursor 官方文档整理 Project Rules、User Rules、AGENTS.md、Legacy .cursorrules 与 Memories 的职责边界，帮助项目把长期规范、目录规则和对话记忆分层管理。
order: 5
---

# 第五篇：Cursor Rules 与 Memories 上下文治理（2026-04）

> 本篇基于 Cursor 官方 Rules 与 Memories 文档整理，资料快照时间：2026-04-14。

[[toc]]

---

## 1. 为什么要专门治理上下文

Cursor 能不能稳定工作，很大一部分取决于上下文是否稳定。

如果项目规范每次都靠临时 prompt 口头补充，常见问题是：

- 有时记得，有时忘记
- 一段对话后约束越来越散
- 同一个项目不同会话表现不一致
- 新成员不知道哪些约束必须写进 AI 上下文

Rules 和 Memories 解决的是“长期上下文”问题：哪些知识应该被反复带入，哪些知识应该被沉淀，哪些知识只属于当前任务。

---

## 2. Cursor 官方提供的长期上下文载体

官方文档把规则体系分成几类：

| 类型 | 适合内容 | 特点 |
| --- | --- | --- |
| Project Rules | 项目级规则、目录规则、团队约束 | 存在 `.cursor/rules`，可进入版本控制 |
| User Rules | 个人偏好、输出风格 | 全局生效，适合个人环境 |
| AGENTS.md | 简单项目说明 | Markdown 格式、适合快速起步，当前以仓库根目录为主 |
| .cursorrules | 旧版项目规则 | 仍支持，但官方建议迁移到 Project Rules |
| Memories | 对话中沉淀的项目记忆 | 项目级、跨会话，可在设置中管理 |

它们不是互相替代的关系，而是分层关系。

官方 Rules 文档还特别提醒：Rules 主要作用在 Agent 和 Inline Edit 这类会读取规则上下文的能力上，不直接控制 Tab 补全本身。

---

## 3. Project Rules：写项目里长期稳定的东西

Project Rules 存在 `.cursor/rules` 目录下，每条规则是一个文件，适合进入 Git 版本控制。

适合写进 Project Rules 的内容：

- 代码风格
- 架构约束
- 目录职责
- 禁止修改的生成文件
- 特定目录的实现模板
- 提交前或改动后的必跑命令

官方文档说明，Project Rules 可以通过路径模式、手动引用或相关性判断来控制加载方式；子目录也可以放自己的 `.cursor/rules`，用于更细粒度的作用域控制。

### 3.1 规则类型怎么选

常见规则类型可以这样理解：

| 类型 | 适合场景 |
| --- | --- |
| Always | 永远要带上的项目底线，比如语言、代码风格、安全禁区 |
| Auto Attached | 命中特定文件模式时带上，比如 `src/**/*.vue` 的 Vue 规范 |
| Agent Requested | 给 AI 一个描述，让它按需决定是否读取 |
| Manual | 只有你显式 `@ruleName` 时才带上 |

如果不确定，建议从少量 `Always` + 少量 `Auto Attached` 开始，不要一上来把所有内容都写成 Always。

### 3.2 一个 `.mdc` 规则示例

```mdc
---
description: Vue 页面组件规范
globs:
  - src/views/**/*.vue
alwaysApply: false
---

- 使用 Vue 3 SFC 写法
- 路由级页面放在 src/views
- 内部模块优先使用 @/ 别名导入
- 修改页面渲染逻辑后，优先检查移动端布局影响
```

这类规则适合跟项目一起提交，团队成员打开项目后可以复用同一套约束。

---

## 4. User Rules：只写你个人一直想要的习惯

User Rules 是个人全局规则，适合写：

- 回复语言
- 解释风格
- 是否先给计划
- 是否偏好简洁总结
- 是否默认补验证命令

不适合写：

- 某个项目的构建命令
- 某个仓库的目录结构
- 只对单个业务有效的禁区

一个实用原则是：如果换一个项目仍然成立，就可以考虑放 User Rules；否则应该放 Project Rules 或本次 prompt。

---

## 5. AGENTS.md：简单项目的低成本入口

`AGENTS.md` 的优点是简单、直观、容易审查。对个人项目和中小仓库来说，先写它往往比立刻设计完整 `.cursor/rules` 更快。
截至 2026 年 4 月 14 日的官方 Rules 页面，`AGENTS.md` 仍主要作为仓库根目录下的轻量项目指令入口使用；如果你需要按目录拆分、按文件模式自动命中，还是 `.cursor/rules` 更合适。

适合写：

- 项目技术栈
- 文件结构
- 构建与测试命令
- 代码风格
- 生成文件禁区
- 本仓库特有协作规则

当 `AGENTS.md` 变得很长，或者规则需要按目录自动命中时，再迁移到 `.cursor/rules`。

---

## 6. Memories：让对话经验跨会话保留

官方文档说明，Memories 是基于 Chat 对话自动生成的规则，作用域在当前项目内，可以跨会话保留上下文。

Memories 的来源主要有两种：

1. 自动提炼：Agent 会根据对话内容判断哪些项目事实值得沉淀，并在保存前请求你批准
2. 主动记录：当你明确要求“记住这件事”时，Agent 可以通过 memory tool 创建记忆

你可以在 `Cursor Settings -> Rules` 管理 Memories。

### 6.1 适合沉淀为 Memory 的内容

- “这个项目的通知数据由脚本生成，不要手动改最终 JSON”
- “这个项目的移动端页面优先考虑外层滚动容器”
- “这个仓库里发布笔记后必须重新生成索引”

### 6.2 不适合沉淀为 Memory 的内容

- 一次性任务目标
- 临时调试信息
- 过期 bug 现象
- 敏感密钥、账号、内部地址

记忆越干净，跨会话帮助越大。

---

## 7. 推荐分层方案

一个比较稳的分层是：

| 层级 | 放什么 |
| --- | --- |
| User Rules | 你的个人表达习惯和通用工作流偏好 |
| AGENTS.md | 仓库总览、命令、禁区、协作规则 |
| `.cursor/rules` | 可复用、可匹配路径的项目规则 |
| Memories | 对话中反复出现、值得跨会话保留的项目事实 |
| Prompt | 本次任务目标、范围、验收标准 |

这套分层的核心是：长期信息不要反复口述，短期信息不要污染长期记忆。

---

## 8. 规则写作的常见问题

### 8.1 规则写得太空

“注意代码质量”不如“不要修改 `dist/`，公共工具函数改动后运行 `npm test`”。

### 8.2 Always 过多

Always 规则太多会挤占上下文，也容易让模型被不相关规则干扰。

### 8.3 Agent Requested 没有清楚描述

如果规则依赖 Agent 自己判断是否读取，就要写清楚 description，否则它很难知道什么时候该用。

### 8.4 用 Memories 代替项目规则

Memories 适合补充经验，不适合承载完整项目规范。核心规则还是应该放在可审查、可版本控制的位置。

---

## 9. 建议落地顺序

1. 先写 `AGENTS.md`，把最重要的项目规则说明白
2. 把目录级、技术栈级规则拆到 `.cursor/rules`
3. 把个人偏好留在 User Rules
4. 工作中出现反复解释的信息，再批准为 Memories
5. 定期清理过期规则和无效记忆

---

## 参考资料

- Cursor Rules：`https://docs.cursor.com/en/context`
- Cursor Memories：`https://docs.cursor.com/en/context/memories`
- Cursor Ignore Files：`https://docs.cursor.com/en/context/ignore-files`
