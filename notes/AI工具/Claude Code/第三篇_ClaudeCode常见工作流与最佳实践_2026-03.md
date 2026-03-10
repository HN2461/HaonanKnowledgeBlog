# 第三篇：Claude Code 常见工作流与最佳实践（2026-03）

> 本文基于 Claude Code 官方文档整理，时间点为 `2026-03-10`。  
> 覆盖范围：常见工作流 + 最佳实践。  
> 适用：新手按步骤完成真实任务。

[[toc]]

---

## 1. 新手通用工作流（Explore → Plan → Implement → Verify）

步骤：

1. Explore：用“概览类问题”让 Claude 读懂代码库
2. Plan：在 Plan Mode 下生成计划，并确认目标和范围
3. Implement：逐步修改，并保持改动可验证
4. Verify：明确验证方式，比如运行测试或复现步骤

官方强调：给 Claude 一个可验证目标，并在开始前澄清需求与约束，能显著降低返工。

---

## 2. 理解新代码库

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

---

## 3. 查找相关代码

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

验证：让 Claude 运行相关测试或给出复现步骤并人工确认。

排障：若修复不稳定，要求 Claude 提供多个备选方案并解释权衡。

---

## 5. 重构代码

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

验证：对比关键逻辑的输入输出与测试结果。

排障：若计划太大，用 Plan Mode 把计划拆成多段。

---

## 6. 使用专门的 Subagent

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

---

## 7. Plan Mode（规划优先）

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

验证：计划必须包含目标、步骤、回滚方式或风险提示。

排障：如果计划过长，让 Claude 先输出“最小可行计划”。

---

## 8. 使用测试

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

步骤：

1. 让 Claude 找出文档缺口
2. 要求补全并符合项目规范

示例提示：

```text
find functions without proper JSDoc comments in the auth module
add JSDoc comments to the undocumented functions in auth.js
```

验证：打开生成的文档或运行文档构建命令。

---

## 10. 使用图像与文件引用

图像输入方式：

- 拖拽图片到 Claude Code
- 复制图片后按 `Ctrl+V` 粘贴
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

要点：

- 默认开启
- `Ctrl+O` 可切换是否展示详细推理
- `MAX_THINKING_TOKENS` 可限制推理 token，设置为 `0` 可关闭

验证：在复杂问题上比较开启与关闭的答案差异。

---

## 12. 会话管理与 worktrees

会话管理：

- `claude --continue` 继续当前目录最近会话
- `claude --resume` 打开会话选择器
- `/rename` 给会话命名

Worktree：

- `claude --worktree <name>` 创建隔离工作区
- 目录位于 `.claude/worktrees/<name>`，分支名为 `worktree-<name>`
- 可与 git worktree 并用

验证：在 worktree 中做修改，主分支不受影响。

---

## 13. 通知与 Hook

当 Claude 需要你介入时，可通过 Hook 触发系统通知。  
官方提供 macOS、Linux、Windows 的示例命令。

验证：触发一个需要确认的操作，看是否收到通知。

---

## 14. 排障清单（通用）

1. 需求不清导致反复返工：先写清“成功标准”和“验证方式”
2. 输出太宽泛：缩小范围，限制到目录或文件
3. 修改过大：使用 Plan Mode 拆分
4. 上下文爆炸：用 subagent 或拆分任务
5. 测试耗时过长：仅跑相关测试

## 参考资料

- https://code.claude.com/docs/zh-CN/common-workflows
- https://code.claude.com/docs/zh-CN/best-practices
- https://code.claude.com/docs/zh-CN/how-claude-code-works
