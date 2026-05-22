---
title: 第十一篇：Codex 近期待补全更新总表（桌面版、IDE、云任务与 Windows 新能力）
date: 2026-05-22
category: AI工具
tags:
  - Codex
  - 桌面版
  - IDE
  - 云任务
  - Windows
  - OpenAI官方
description: 基于 OpenAI 官方近期文档，对照 2026-05 中旬前的 Codex 笔记，集中补全桌面版、IDE 扩展、云端任务、Worktrees、本地环境、Automations、内置 Git、应用内浏览器与 Windows 原生沙箱等最近容易漏掉的新能力，并收紧没有官方证据支撑的表述。
---

# 第十一篇：Codex 近期待补全更新总表（桌面版、IDE、云任务与 Windows 新能力）

> 更新时间：2026-05-22  
> 定位：主线补丁篇。专门处理“前面几篇主线大体没错，但最近官方新增能力太快，尤其桌面版已经不止是一个壳子”的问题。  
> 适合谁看：已经读过第三篇、第六篇、第七篇、第二篇，但怀疑自己资料已经有点旧的人。  
> 本篇目标：不重复讲基础配置，而是直接指出“哪些地方没过时、哪些说法需要改、最近新增了哪些功能页面和能力”。  
> 结论先说：你之前的主线框架还有效，但如果停在 `2026-05-14` 的口径，桌面版、IDE 扩展和云任务相关内容已经明显不完整。
> 小白读完目标：你应该能分辨“旧能力仍在”与“旧说法已过时”这两回事，不再继续把 App、IDE、Windows 路线按更早的旧口径去理解。

章节导航（点击跳转）：

[[toc]]

---

## 1. 先说判断结果：你原来的内容哪里没问题，哪里已经不够新

### 1.1 还没过时的部分

下面这些主干判断仍然成立：

1. Codex 的核心理解仍然是：认证、配置层级、审批策略、沙箱、AGENTS.md、MCP、非交互执行
2. `approval_policy` 和 `sandbox_mode` 依旧是最重要的安全边界
3. 项目级 `.codex/config.toml`、用户级 `~/.codex/config.toml`、`--profile`、命令行覆盖之间的优先级思路没有变
4. `codex exec` 仍然是自动化、批处理、CI 场景的关键入口
5. IDE 和 App 仍然高度复用同一套 Codex 能力，而不是三套完全不同的产品

### 1.2 已经明显不够新的部分

下面这些地方，如果继续按旧文理解，就会漏掉最近最重要的变化：

1. 桌面版不再只是“一个读取同一份配置的图形壳”
2. IDE 扩展不再只是“在编辑器里调一下 CLI”
3. 云端任务现在已经是官方明确强调的主能力，不该只轻描淡写带过
4. Windows 相关说明需要从“原生能用，但建议 WSL”升级为“原生已补出更多官方能力与专门文档”
5. 模型建议不能继续写成某个固定模型名的长期结论，必须改成“先看官方最新模型页 + 当前线路真实可用模型”

---

## 2. 最近最值得补上的更新主题，到底有哪些

如果你只记一张清单，就记下面这 5 组：

1. 桌面版新增并独立成体系的能力：`worktrees`、`handoff`、`local environments`、`automations`
2. 桌面版工作流增强：内置 Git、集成终端、应用内浏览器
3. IDE 扩展增强：云端委托、图片拖拽、图像生成、对上下文引用方式的补充
4. Windows 专题增强：原生 Windows 的专门说明、桌面端 Windows 页面、原生沙箱说明、WSL 切换与 `CODEX_HOME` 共享边界
5. 模型口径更新：默认本地示例应优先对齐官方当前模型页，不再把历史模型名写成长期固定答案

---

## 3. 桌面版现在最大的变化：它已经不只是“桌面壳”

你旧资料里把 App 理解成“共享配置的一个桌面入口”，这个说法不算错，但已经太轻了。  
按 OpenAI 官方当前文档，桌面版已经形成一组完整的工作流能力。

### 3.1 `worktrees`：一个应用里并行处理多个代码分身

这个能力很关键，因为它改变了“一个仓库只能在一个工作目录里聊一条线程”的直觉。

现在更稳妥的理解是：

1. 你可以围绕同一仓库开多个 worktree
2. 不同 worktree 可以承载不同分支、不同任务、不同线程
3. 桌面版已经把“跨 worktree 继续工作”当成一等能力来讲，而不是高级 Git 玩家才会手搓的技巧

这意味着什么：

1. 以后写三端对照时，不能只写“打开一个仓库开始聊”
2. 要补“一个需求一个 worktree”的并行工作流
3. 桌面版已经更接近“任务中控台”，不只是聊天窗口

### 3.2 `handoff`：桌面端和云端之间的任务交接

这也是最近很容易漏掉的重点。  
以前很多人理解成“本地线程就是本地线程，云端任务就是另一套东西”。  
现在官方已经更明确地把“交接”和“接力”讲成主流程。

你可以把它理解成：

1. 本地先把任务和上下文整理好
2. 把大任务交给云端跑
3. 跑完以后再回到本地继续审查、合并、补改

它不只是“远程执行”，而是“任务在不同执行环境之间流转”。

### 3.3 `local environments`：不是所有任务都要直接拿当前工作区硬跑

桌面版现在单独讲了本地环境管理，这比“在本机上开个终端”更进一步。  
这里的重点不是一个命令，而是官方已经把“环境准备、环境复用、环境差异”抽成独立概念。

你后面写桌面版时应该补 3 个认知：

1. 环境不是只有一个默认当前目录
2. 长任务和自动化任务依赖的环境准备最好可重复
3. 项目如果需要特定依赖、脚本、工具链，最好把环境准备视为流程的一部分

### 3.4 `automations`：桌面版开始强调持续化和流程化

这说明桌面版不再只面向“我问一句，它答一句”的交互。  
它开始更像一个能承接重复性开发任务的入口。

你可以把这块理解成：

1. 把常见任务做成可以重复触发的流程
2. 把本地和云端能力串起来
3. 从一次性聊天，走向半自动工作流

如果后面你写“桌面版适合什么场景”，这块一定要补。

---

## 4. 桌面版最近该补的功能点，不止 Worktrees

官方当前 App 文档里，下面这些点也值得你统一补进去。

### 4.1 内置 Git

这点很重要，因为它会直接改变“用户要不要频繁切回外部终端”的体验预期。

更稳妥的说法是：

1. 桌面版已经把 Git 相关操作纳入原生工作流的一部分
2. 不能再把 App 简化为“看结果”，它已经参与实际开发闭环
3. 以后写桌面版时，Git、分支、改动审查、PR 流程要作为核心能力看待

### 4.2 集成终端

这意味着桌面端不是只会“发 prompt”，还强调和真实开发命令流共存。

写法建议改成：

1. App 不是纯聊天窗口
2. 它强调任务、代码、终端三者联动
3. 本地命令执行与线程上下文之间的切换成本更低

### 4.3 应用内浏览器

这个能力说明桌面版已经在补“看网页、看工具结果、看文档”这一块，而不是只靠外部浏览器。

对你的文章有什么影响：

1. 可以补“资料查询和任务执行都能在一个工作流里完成”
2. 截图对照篇里，桌面版的功能页不能只写设置页
3. 后面如果做演示截图，建议把浏览器/终端/Git 一起纳入 SOP

### 4.4 先删掉没有官方页面明示的“轻功能猜测”

这里需要专门提醒主人一句：  
我上一轮整理里把“记忆、个性化、宠物、深链”也算进了桌面版近期必补能力，但按 `2026-05-22` 我重新核对到的官方 Codex App 页面，这几项没有像 `Worktrees`、`Automations`、`In-app browser`、`Windows` 这样清晰、稳定的独立文档支撑。

所以现在更稳妥的处理是：

1. 不把它们继续写成“最近官方明确新增的主能力”
2. 如果以后官方页面单独列出，再补进主线
3. 当前先把篇幅留给已经有明确页面与工作流位置的能力

### 4.5 `computer use`

这点要单独提，因为它不是普通设置项，而是能力边界的扩展。  
但这里一定要写准：官方当前相关页面与用例强调的是“让 Codex 操作你的电脑”，而不是“所有桌面端、所有系统默认都已等价开放”。

写的时候建议收紧表述：

1. 不要把它写成“默认到处都能全自动点屏幕”
2. 应该写成“官方已经把 computer use 作为 Codex 能力方向明确写出来”
3. 实际可用性仍要看平台、版本、地区与权限边界

---

## 5. IDE 扩展最近该补的点：它也不是简单壳子了

你旧文里提到了 VS Code / Cursor / Windsurf 可用，这个方向没错。  
但按官方当前文档，IDE 侧该补的重点至少有下面几条。

### 5.1 云端委托任务

这和桌面版的 handoff 是同一趋势。  
IDE 现在不只是“在编辑器里发消息让本地 CLI 干活”，而是可以把更大的任务委托到云端。

这意味着：

1. IDE 和云任务的边界在变弱
2. “本地写代码 + 云端跑大任务 + 回本地接着改”已经是官方鼓励的路径
3. 后面写插件能力时，必须把“云端 delegation”列出来

### 5.2 图片拖拽与多模态上下文

这对很多“看报错图、看 UI、看设计稿”的场景很关键。  
如果你的文章还只把 IDE 描述成“文字对话 + 代码上下文”，就不够完整了。

更准确的说法是：

1. IDE 扩展已经强调可以直接把图片拖进对话
2. 视觉信息正在成为正式上下文来源
3. 对前端、设计还原、报错排查都更实用

### 5.3 内置图像生成入口

这不是每个人都会马上用，但它说明 IDE 已经不只是“代码补全/代码聊天”。

写法建议：

1. 作为“扩展边界在变宽”的证据提到
2. 不要写成所有工作流都依赖它
3. 但也别再把 IDE 简化成纯代码侧边栏

### 5.4 `@文件`、命令面板、工作区上下文仍然重要

旧文这部分没有过时，只是需要加一句：

1. 这些基础能力依旧存在
2. 但现在上层已经叠了云任务与多模态能力
3. 所以 IDE 的定位已经从“嵌入式聊天入口”升级成“编辑器内 Agent 工作台”

---

## 6. Windows 相关口径，也该从“能用”升级成“有专门能力页”

你以前写“复杂项目优先 WSL”这条，今天仍然没错。  
但如果只停在这里，会低估最近 Windows 路线的补强。

### 6.1 现在至少要区分两套 Windows 资料

1. CLI/通用 Windows 指南
2. 桌面版 App 的 Windows 专页

这说明官方已经不是顺手提一句 Windows，而是在认真补 Windows 体验。

### 6.2 `native Windows sandbox`

这是特别值得补的一点。  
以前很多人对 Windows 的直觉是：“能跑，但安全边界、执行体验、推荐程度不如 WSL 清晰。”  
现在官方已经把原生 Windows 沙箱能力单列出来讲。

更稳妥的写法是：

1. 原生 Windows 不再只是一种勉强兼容路径
2. 官方正在补它的原生执行与安全能力
3. 如果使用 Windows-native agent，项目优先放在 Windows 文件系统里更稳
4. 如果切到 WSL agent，需要重启 App；而且 WSL CLI 默认不会自动继承 Windows 下的 `~/.codex`

### 6.3 对你现有排障文的意义

你已经写了 PowerShell、Node 预检、中转切换等排障内容。  
这部分依然有价值，但建议新增一句边界说明：

1. 这些是你真实环境里遇到的问题
2. 不等于官方桌面版/CLI 的 Windows 能力停滞
3. 最近官方是在持续强化 Windows 体验，而不是放弃这条路线

---

## 7. 模型口径怎么写，才不容易再次过时

这部分你之前已经开始收紧了，但现在建议再统一一次。

### 7.1 不要再把某个模型写成“长期默认推荐”

最稳妥的表达是：

1. 通用最新推荐，先看 OpenAI 最新模型指南
2. Codex 当前可选模型，以你这条线路里 `/status`、`/model`、实际 provider 返回为准
3. 第三方网关环境下，模型名和官方公开页不一定完全一致

### 7.2 文章里怎么避免下个月又过时

建议以后都用这种句式：

1. “以下模型名仅作当前示例，更新前请先核对官方最新模型页”
2. “如果官方页、CLI `/status`、第三方网关后台三者不一致，以你实际线路可用结果为准”
3. “不要把历史示例模型名当永久标准答案”
4. “本地默认示例”和“专门的 Codex 编码模型”要分开写，不要混成一句

这样比直接写死一个固定模型更耐久。

---

## 8. 你现有文章里，建议立刻补的 4 处

### 8.1 第二篇：官方资料补充与进阶实践

建议新增一节“2026-05-22 增补：桌面版与 IDE 已进入任务工作台阶段”，把下面几项补进去：

1. worktrees
2. handoff
3. local environments
4. automations
5. IDE cloud delegation
6. Windows native sandbox / App Windows 页面

### 8.2 第七篇：三端逐字段截图对照版

建议把“App 专属设置”扩成“App 设置 + App 新工作流能力”：

1. Settings 页面还是要写
2. 但还要补 worktrees、Git、terminal、browser、MCP、handoff 这些非纯设置页能力
3. 否则标题叫“三端逐字段对照”，实际却只对照到老版设置菜单

### 8.3 目录页

目录页要新增“第十一篇”，并在维护约定里补一句：

1. 桌面版、IDE、Windows 这三类内容最近更新快
2. 更新前优先核对官方 App / IDE / Windows 页面

### 8.4 这件事现在已经落成第十二篇

这一轮整理后，第十二篇已经正式写成：

1. [第十二篇：Codex 当前常用功能点详细手册（最新工作流版）](#/note/AI工具/Codex/第十二篇_Codex当前常用功能点详细手册_最新工作流版_2026-05-22)
2. 它不重复讲底层配置，而是专门把“主人真正开发时最常用的功能点”讲细
3. 所以后面如果主人要查“这个旧功能还该不该保留、现在常用入口到底在哪”，优先跳到第十二篇

---

## 9. 我给你的“最新功能补全清单”

如果你想检查自己资料有没有补齐，可以逐项对照下面这份表：

### 9.1 桌面版必须补到的能力

1. Worktrees
2. Handoff
3. Local environments
4. Automations
5. Built-in Git
6. Integrated terminal
7. In-app browser
8. Computer use
9. Windows 专页

### 9.2 IDE 必须补到的能力

1. 云端任务委托
2. 图片拖拽
3. 多模态上下文
4. 内置图像生成
5. `@文件` 引用
6. 命令面板入口
7. 与 CLI 共享能力但不等于“只是套壳”

### 9.3 CLI / 通用层必须继续保留的能力

1. `codex exec`
2. `--json`
3. `resume`
4. `AGENTS.md`
5. `MCP`
6. `approval_policy`
7. `sandbox_mode`
8. `profiles`
9. `rules`
10. Windows / WSL 路线差异

---

## 10. 一句话总结：这次到底算不算“你写过时了”

严格说，不是“整套都过时了”，而是：

1. 基础配置主线没过时
2. 但最近最重要的增量能力，尤其桌面版和 IDE 的工作流升级，你原稿明显还没补全
3. 如果你现在继续把 App 写成“读同一份配置的桌面壳”、把 IDE 写成“编辑器里的 CLI 壳”，那就会越来越偏旧

所以最准确的结论是：

你的底层框架还在，但“产品形态升级”这部分需要立刻补课。

---

## 11. 官方资料入口（本篇补全时重点对照）

- 最新模型指南：<https://developers.openai.com/api/docs/guides/latest-model>
- CLI 概览：<https://developers.openai.com/codex/cli>
- CLI 功能：<https://developers.openai.com/codex/cli/features>
- CLI 参数参考：<https://developers.openai.com/codex/cli/reference>
- CLI Slash Commands：<https://developers.openai.com/codex/cli/slash-commands>
- Config Basics：<https://developers.openai.com/codex/config-basic>
- Config Reference：<https://developers.openai.com/codex/config-reference>
- AGENTS.md：<https://developers.openai.com/codex/guides/agents-md>
- Non-interactive：<https://developers.openai.com/codex/noninteractive>
- MCP：<https://developers.openai.com/codex/mcp>
- IDE 概览：<https://developers.openai.com/codex/ide>
- IDE 功能：<https://developers.openai.com/codex/ide/features>
- IDE 设置：<https://developers.openai.com/codex/ide/settings>
- App 功能：<https://developers.openai.com/codex/app/features>
- App 设置：<https://developers.openai.com/codex/app/settings>
- App Commands：<https://developers.openai.com/codex/app/commands>
- App Worktrees：<https://developers.openai.com/codex/app/worktrees>
- App Local Environments：<https://developers.openai.com/codex/app/local-environments>
- App Automations：<https://developers.openai.com/codex/app/automations>
- App In-app Browser：<https://developers.openai.com/codex/app/in-app-browser>
- Codex Use Cases（含 computer use 用例）：<https://developers.openai.com/codex/use-cases>
- App Windows：<https://developers.openai.com/codex/app/windows>
- Windows 指南：<https://developers.openai.com/codex/windows>
