---
title: 第三篇：Claude Code 常见工作流与最佳实践（2026-05复核）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - 工作流
  - Plan Mode
  - Agents
  - 测试
  - 最佳实践
description: 按 2026-05-01 Claude Code 官方 Common Workflows、Best Practices、Interactive Mode 与 Commands 文档复核，在保留原文步骤、示例、验证与排障结构的基础上，补入 /effort、/loop、/schedule、/autofix-pr 与 transcript viewer 等新变化。
---

# 第三篇：Claude Code 常见工作流与最佳实践（2026-05复核）

> 本文基于 Claude Code 官方文档整理，并按 `2026-05-01` 重新复核。  
> 覆盖范围：常见工作流 + 最佳实践。  
> 适用：新手按步骤完成真实任务，也适合已经会用但想把工作流升级到新版命令体系的人。

[[toc]]

---

## 0. 小白先记一句话

这一篇主人可以先这么理解：

- Explore：先别急着改，先让 Claude 看懂项目
- Plan：先让它说准备怎么改
- Implement：再让它动手
- Verify：最后别信嘴，去看测试、页面、日志是不是真的对

如果只记一句最重要的话，就是：

- **Claude 最怕的是“你没说清楚，它却已经开始改”。**

所以这篇本质上是在教你怎么“下更稳的指令”。

---

## 1. 新手通用工作流（Explore → Plan → Implement → Verify）

步骤：

1. Explore：用“概览类问题”让 Claude 读懂代码库
2. Plan：在 Plan Mode 下生成计划，并确认目标和范围
3. Implement：逐步修改，并保持改动可验证
4. Verify：明确验证方式，比如运行测试或复现步骤

官方强调：给 Claude 一个可验证目标，并在开始前澄清需求与约束，能显著降低返工。

翻译成人话：

1. Explore：先问清楚“这是个什么项目”
2. Plan：先让它说“我准备怎么改”
3. Implement：再让它开始动手
4. Verify：最后确认“它是不是真的改对了”

2026-05 补充建议：

1. 如果问题复杂，先配合 `/effort high` 或 `/effort xhigh`
2. 如果任务会反复执行，可以在 Verify 后再进入 Automate 阶段，把动作固化为 skill、hook、`/loop` 或 `/schedule`

---

## 2. 理解新代码库

这一节最适合主人在第一次打开陌生仓库时照着问。  
目的不是聊天，而是避免 Claude 一上来就乱改。

步骤：

1. 进入仓库并启动 `claude`
2. 先问“这个仓库做什么”与“架构模式”
3. 再问“关键数据模型”与“认证如何处理”
4. 让 Claude 指出你应该先读的文件

示例提示：

```text
give me an overview of this codebase
explain the main architecture patterns used here
what are the key data models?
how is authentication handled?
list the first five files I should read
```

验证：让 Claude 给出入口文件与调用链，再手动打开确认。

排障：如果回答过于笼统，缩小范围并用 `@` 引用关键文件。

2026-05 补充：

- 如果你已经锁定模块，可以继续追问：

```text
trace the login flow from UI to database
show me where permissions are enforced
which files are most risky to modify?
```

---

## 3. 查找相关代码

小白版理解：

- 这一节不是让 Claude 写代码
- 而是让 Claude 先当“项目导游”
- 先把入口和调用链找出来，再决定要不要改

步骤：

1. 直接描述你要找的功能或模块
2. 让 Claude 解释这些文件如何协作
3. 要求追踪完整调用链

示例提示：

```text
find the files that handle user authentication
how do these authentication files work together?
trace the login process from front-end to database
```

验证：对照输出的文件列表，逐个打开看函数入口是否一致。

排障：若仓库过大，先让 Claude 给出最关键的 3 个文件，再逐步扩展。

---

## 4. 高效修复错误

如果主人平时最常见的场景是“报错了但不知道在哪”，那这一节就是最实用的。

步骤：

1. 说明错误现象与复现方式
2. 让 Claude 定位根因并给出修复方案
3. 要求运行测试或给出验证步骤

示例提示：

```text
I'm seeing an error when I run npm test
suggest a few ways to fix the @ts-ignore in user.ts
update user.ts to add the null check you suggested
```

更稳的新版问法：

```text
Here is the failing behavior.
1. Reproduce it
2. Explain the likely cause
3. Suggest the smallest safe fix
4. Run the relevant tests
```

验证：让 Claude 运行相关测试或给出复现步骤并人工确认。

排障：若修复不稳定，要求 Claude 提供多个备选方案并解释权衡。

---

## 5. 重构代码

重构最容易翻车的点是：

- 你想让代码更漂亮
- 结果行为也被一起改坏了

所以“行为必须不变”这句一定要明确写出来。

步骤：

1. 指定目标模块与风险
2. 明确“行为必须不变”
3. 要求先给计划再执行
4. 让 Claude 运行测试

示例提示：

```text
find deprecated API usage in our codebase
suggest how to refactor utils.js to use modern JavaScript features
refactor utils.js to use ES2024 features while maintaining the same behavior
run tests for the refactored code
```

新版补充提示：

```text
Refactor utils.js to modern syntax.
Do not change behavior.
Keep the public API stable.
Run the related tests after editing.
```

验证：对比关键逻辑的输入输出与测试结果。

排障：若计划太大，用 Plan Mode 把计划拆成多段。

---

## 6. 使用专门的 Subagent

小白版理解：

- 主对话像总指挥
- subagent 像分出去干专项活的小助手
- 好处是主对话不会被塞满一堆中间过程

步骤：

1. 用 `/agents` 查看已有 subagent
2. 让 Claude 使用指定 subagent 执行任务
3. 接收摘要并据此继续

示例提示：

```text
/agents
review my recent code changes for security issues
use the code-reviewer subagent to check the auth module
```

验证：让主对话复述 subagent 的关键结论，避免遗漏。

排障：若 subagent 未触发，直接指定 subagent 名称再试一次。

2026-05 补充：

- 如果是更大的并行任务，可以进一步考虑 agent teams
- 如果只是单点排查，subagent 往往已经够用，不必一上来就把体系做太重

---

## 7. Plan Mode（规划优先）

如果主人只想知道什么时候该开 Plan Mode，记这三种就够了：

1. 改动跨很多文件
2. 你自己也还没想清楚怎么改
3. 这次改错了会比较贵

适用场景：

- 多步骤实现
- 复杂重构
- 高风险改动

步骤：

1. `Shift+Tab` 切换到 Plan Mode
2. 写清楚目标、范围、约束
3. 在计划确认后再执行

无头规划模式：

```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

新版补充：

```text
/plan
/effort high
/effort xhigh
```

验证：计划必须包含目标、步骤、回滚方式或风险提示。

排障：如果计划过长，让 Claude 先输出“最小可行计划”。

---

## 8. 使用测试

这里最重要的不是“让 Claude 跑测试”，而是：

- 改完之后一定要让结果落到可验证的东西上

比如：

- 测试输出
- 页面变化
- 复现步骤
- 日志差异

步骤：

1. 告知测试失败的命令与日志
2. 让 Claude 修复并重新运行

示例提示：

```text
Here is a failing test. Find the cause, fix the code, and run the test suite.
```

验证：让 Claude 贴出测试输出摘要或失败已消失的说明。

排障：测试太慢时，要求只跑相关测试。

---

## 9. 处理文档

很多人会忽略这一节，但其实它很适合新手：

- 文档类任务风险通常比改业务逻辑低
- 又能很快观察 Claude 的输出风格
- 很适合拿来练“怎么下更清楚的指令”

步骤：

1. 让 Claude 找出文档缺口
2. 要求补全并符合项目规范

示例提示：

```text
find functions without proper JSDoc comments in the auth module
add JSDoc comments to the undocumented functions in auth.js
```

验证：打开生成的文档或运行文档构建命令。

2026-05 补充可交给 Claude 的非编码工作：

- 补 README
- 总结排障过程
- 生成变更说明
- 给 PR 写 review summary

---

## 10. 使用图像与文件引用

这节翻译成人话就是：

- 你别总靠描述
- 能给图就给图
- 能点名文件就点名文件

上下文越具体，Claude 胡猜的空间越小。

图像输入方式：

- 拖拽图片到 Claude Code
- 复制图片后按 `Ctrl+V` 粘贴
- Windows 环境也常见 `Alt+V`
- 直接提供图片路径

示例提示：

```text
Describe the UI elements in this screenshot
Generate CSS to match this design mockup
```

文件引用：

```text
Explain the logic in @src/utils/auth.js
What's the structure of @src/components?
```

验证：确认 Claude 引用的文件路径正确，并与实际文件一致。

排障：如果路径过大，先用 `@目录` 获取文件清单再精确引用。

---

## 11. 扩展思考（Thinking Mode）

旧版常见说法：

- 默认开启
- `Ctrl+O` 可切换是否展示详细推理
- `MAX_THINKING_TOKENS` 可限制推理 token，设置为 `0` 可关闭

2026-05 需要修正为：

- `Ctrl+O` 现在更准确的定位是 transcript viewer，用来看工具调用、命令执行和改动轨迹
- 日常更应该记住 `/effort low|medium|high|xhigh`
- 模型会按问题复杂度做自适应推理
- `MAX_THINKING_TOKENS` 这类旧环境变量仍有兼容价值，但不再是主工作流入口

验证：在复杂问题上比较 `medium`、`high`、`xhigh` 三档的计划深度差异。

如果主人现在只想先稳定用起来，不必一开始就研究 Thinking Mode 的所有细节。  
先记住一个够用原则：

- 简单任务 `medium`
- 难一点的问题 `high`
- 真复杂再 `xhigh`

---

## 12. 会话管理与 worktrees

小白版理解：

- 会话管理：管“聊天历史”
- worktree：管“代码工作区”

一个是上下文隔离，一个是文件隔离，两者不是一回事。

会话管理：

- `claude --continue` 继续当前目录最近会话
- `claude --resume` 打开会话选择器
- `/rename` 给会话命名

Worktree：

- `claude --worktree <name>` 创建隔离工作区
- 可与 git worktree 并用
- 高风险改动、并行方向验证、PR 修复都很适合放到 worktree

验证：在 worktree 中做修改，主分支不受影响。

---

## 13. 通知、后台任务与长期自动化

当 Claude 需要你介入时，可通过 Hook 触发系统通知。  
官方提供 macOS、Linux、Windows 的示例命令。

后台任务与新版长流程能力：

- `Ctrl+B`：把 Bash、Agent 或 MCP 任务放到后台
- `/tasks`：查看后台任务
- `/loop`：循环运行提示直到条件满足
- `/schedule`：定时运行提示
- `/autofix-pr`：按 PR 评论批量修复
- Monitor tool：持续观察进程或日志变化

验证：触发一个需要确认的操作，看是否收到通知；或把一个 dev server 放后台，确认主会话仍可继续操作。

如果主人现在只想先学最有用的，优先掌握这两个：

1. `Ctrl+B`
2. `/tasks`

---

## 14. 排障清单（通用）

1. 需求不清导致反复返工：先写清“成功标准”和“验证方式”
2. 输出太宽泛：缩小范围，限制到目录或文件
3. 修改过大：使用 Plan Mode 拆分
4. 上下文爆炸：用 subagent 或拆分任务
5. 测试耗时过长：仅跑相关测试
6. 长任务把主会话卡住：用 `Ctrl+B` 放后台，再用 `/tasks` 管理
7. 计划深度不够：调高 `/effort`

## 参考资料

- https://code.claude.com/docs/en/common-workflows
- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/how-claude-code-works
- https://code.claude.com/docs/en/interactive-mode
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/whats-new
