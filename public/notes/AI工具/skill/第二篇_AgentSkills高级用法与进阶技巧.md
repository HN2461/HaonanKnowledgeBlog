---
title: Agent Skills 高级用法与进阶技巧
date: 2026-04-11
category: AI工具
tags:
  - Agent Skills
  - SKILL.md
  - Claude Code
  - 参数传递
  - 子代理
  - 动态注入
description: 深入讲解 Agent Skills 的高级特性：参数传递、动态上下文注入、context:fork 子代理隔离、hooks 生命周期、allowed-tools 权限控制，以及 Gemini CLI 的 activate_skill 机制。
---

# Agent Skills 高级用法与进阶技巧

> 本篇以 Claude Code 为主要示例（扩展字段最丰富），Kiro / Cursor / Gemini 的特有机制单独说明。

---

## 一、参数传递

### 1.1 基础用法

调用 skill 时可以附带参数，在 SKILL.md 里用占位符接收：

```markdown
---
name: fix-issue
description: Fix a GitHub issue by number. Use when asked to fix a specific issue.
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.

1. Read the issue description
2. Implement the fix
3. Write tests
4. Create a commit
```

调用：`/fix-issue 123` → `$ARGUMENTS` 替换为 `123`

### 1.2 多参数按位置接收

```markdown
---
name: migrate-component
description: Migrate a UI component from one framework to another.
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

调用：`/migrate-component SearchBar React Vue`

- `$0` → `SearchBar`
- `$1` → `React`
- `$2` → `Vue`

多词参数用引号包裹：`/migrate-component "Search Bar" React Vue`

`$ARGUMENTS[N]` 与 `$N` 等价，`$ARGUMENTS` 始终展开为完整原始字符串。

### 1.3 参数不存在时的兜底

如果调用时传了参数但 SKILL.md 里没有 `$ARGUMENTS`，Claude Code 会自动在内容末尾追加：

```
ARGUMENTS: <你输入的内容>
```

Claude 仍然能看到参数，不会丢失。

---

## 二、动态上下文注入（Shell 注入）

> 仅 Claude Code 支持，其他工具不支持此语法。

### 2.1 内联注入 `!`

在 SKILL.md 里用 `` !`command` `` 语法，skill 被激活时先执行命令，把输出插入到内容里，Claude 看到的是执行结果而不是命令本身。

```markdown
---
name: pr-summary
description: Summarize a pull request with live data. Use when reviewing or summarizing a PR.
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## PR 上下文（实时数据）

- Diff：!`gh pr diff`
- 评论：!`gh pr view --comments`
- 变更文件：!`gh pr diff --name-only`
- 当前分支：!`git branch --show-current`

## 任务

根据以上信息，生成一份简洁的 PR 摘要，包含：变更目的、影响范围、潜在风险。
```

执行顺序：

1. 所有 `` !`...` `` 命令先执行
2. 输出替换占位符
3. 完整内容发给 Claude

### 2.2 多行注入 ` ```! `

````markdown
## 环境信息

```!
node --version
npm --version
git log --oneline -5
git status --short
```
````

Claude 会看到这四条命令的实际输出。

````

### 2.3 引用 skill 自身目录

`${CLAUDE_SKILL_DIR}` 变量指向当前 SKILL.md 所在目录，适合引用 skill 内的脚本：

```markdown
---
name: codebase-audit
description: Run a full codebase audit and generate a report.
allowed-tools: Bash(python *)
---

运行审计脚本：

```!
python ${CLAUDE_SKILL_DIR}/scripts/audit.py .
````

````

### 2.4 Session ID 追踪

`${CLAUDE_SESSION_ID}` 可用于日志、临时文件命名：

```markdown
---
name: session-logger
description: Log all activity in this session.
---

将以下内容记录到 logs/${CLAUDE_SESSION_ID}.log：

$ARGUMENTS
````

---

## 三、context: fork — 子代理隔离运行

### 3.1 为什么需要 fork

默认情况下 skill 在当前对话上下文中内联运行，会消耗主会话的 token。对于需要大量读取文件、调用 API、生成报告的 skill，建议用 `context: fork` 在独立子代理中运行：

- 子代理有自己的上下文，不污染主会话
- 主会话只收到子代理的最终结果摘要
- 适合研究类、生成类、部署类任务

### 3.2 基本写法

```markdown
---
name: deep-research
description: Research a topic thoroughly across the codebase. Use when asked to investigate or analyze.
context: fork
agent: Explore
---

深入研究：$ARGUMENTS

1. 用 Glob 和 Grep 找相关文件
2. 阅读并分析代码
3. 返回带具体文件引用的分析报告
```

`agent` 字段可选值：

- `Explore`：只读工具，适合代码库探索
- `Plan`：规划类任务
- 省略：使用通用子代理
- 自定义子代理名（来自 `.claude/agents/`）

### 3.3 fork vs 内联对比

| 维度       | 内联（默认）   | context: fork          |
| ---------- | -------------- | ---------------------- |
| 上下文     | 共享主会话     | 独立隔离               |
| 历史访问   | 能看到对话历史 | 看不到对话历史         |
| Token 消耗 | 计入主会话     | 独立计算               |
| 适合场景   | 参考类、规范类 | 研究类、生成类、部署类 |
| 结果返回   | 直接在对话中   | 摘要注入主会话         |

---

## 四、allowed-tools — 预授权工具

### 4.1 作用

skill 激活时，`allowed-tools` 里列出的工具无需每次询问用户确认，直接执行。

```markdown
---
name: commit
description: Stage and commit current changes.
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *) Bash(git diff *)
---

提交当前变更：

1. `git status` 查看变更
2. `git add .` 暂存所有文件
3. 根据变更内容生成符合规范的 commit message
4. `git commit -m "..."` 提交
```

### 4.2 语法格式

```yaml
# 空格分隔字符串
allowed-tools: Read Grep Bash(git *)

# 或 YAML 列表
allowed-tools:
  - Read
  - Grep
  - Bash(git add *)
  - Bash(git commit *)
```

`allowed-tools` 只是预授权，不限制其他工具的使用——其他工具仍可调用，只是需要用户确认。

---

## 五、hooks — skill 生命周期钩子

> 仅 Claude Code 支持 skill 级别的 hooks。

在 SKILL.md frontmatter 里定义 `hooks`，格式与全局 hooks 完全一致，使用相同的事件名（`PreToolUse`、`PostToolUse`、`Stop` 等），但作用域仅限于该 skill 激活期间。

```markdown
---
name: code-review
description: Review code for quality and security issues.
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "jq -r '.tool_input.file_path' | xargs npx prettier --write"
  Stop:
    - hooks:
        - type: prompt
          prompt: 'Check if all review tasks are complete. If not, respond with {"ok": false, "reason": "what remains"}.'
---

## 代码审查流程

...
```

支持的 hook 事件（与全局 hooks 相同）：

| 事件               | 触发时机               |
| ------------------ | ---------------------- |
| `SessionStart`     | 会话开始或恢复时       |
| `UserPromptSubmit` | 用户提交 prompt 前     |
| `PreToolUse`       | 工具调用前（可阻止）   |
| `PostToolUse`      | 工具调用成功后         |
| `Stop`             | Claude 完成响应时      |
| `Notification`     | Claude Code 发送通知时 |

hook 类型支持 `command`（shell 命令）、`prompt`（LLM 判断）、`agent`（子代理验证）、`http`（HTTP 请求）。

常见用途：

- `PostToolUse` + `Edit|Write` matcher：每次文件编辑后自动格式化
- `Stop` + `type: prompt`：验证任务是否真正完成
- `PreToolUse`：阻止 skill 执行期间的特定危险操作

---

## 六、model 与 effort — 按 skill 指定模型

> 仅 Claude Code 支持。

```markdown
---
name: quick-fix
description: Apply a quick, simple fix. Use for trivial bugs and typos.
model: claude-haiku-4
effort: low
---

快速修复：$ARGUMENTS
```

```markdown
---
name: architecture-review
description: Deep architectural review of a system design.
model: claude-opus-4
effort: max
---

对以下设计进行深度架构审查：$ARGUMENTS
```

`effort` 可选值：`low` / `medium` / `high` / `max`（max 仅 Opus 4.6 支持）

实际价值：把简单任务路由到轻量模型节省 token，把复杂任务路由到强力模型保证质量。

---

## 七、paths — 按文件路径自动触发

> 仅 Claude Code 支持。

```markdown
---
name: react-conventions
description: React component conventions for this project.
paths: "src/components/**/*.tsx,src/components/**/*.jsx"
---

## React 组件规范

- 使用函数组件，不用 class 组件
- Props 用 TypeScript interface 定义
- 样式用 CSS Modules
  ...
```

当你编辑 `src/components/` 下的文件时，这个 skill 自动激活，无需手动调用。

---

## 八、Gemini CLI 的 activate_skill 机制

Gemini CLI 的激活流程与其他工具不同，有一个独特的**用户确认步骤**：

1. Gemini 识别到任务匹配某个 skill 的 description
2. 调用内部 `activate_skill` 工具
3. **弹出确认提示**，显示：skill 名称、用途描述、将获得访问权限的目录路径
4. 用户确认后，SKILL.md 正文和目录结构注入上下文
5. skill 目录被加入 agent 的允许文件路径，可读取 scripts/、references/ 等

这个设计的意义：防止恶意 skill 在用户不知情的情况下访问文件系统。

---

## 九、Kiro CLI 的 resources 配置

Kiro CLI 里 skill 不是自动扫描，需要在 agent 配置文件（`.kiro/agents/*.json`）里显式声明：

```json
{
  "name": "my-agent",
  "resources": [
    "skill://.kiro/skills/**/SKILL.md",
    "skill://~/.kiro/skills/**/SKILL.md"
  ]
}
```

`skill://` URI 与 `file://` 的区别：

- `file://`：启动时全量加载进上下文
- `skill://`：只加载 name + description，正文按需加载

---

## 十、skill 内容生命周期与压缩行为

这是一个容易忽略但很重要的机制：

**激活后**：SKILL.md 内容作为一条消息进入对话，**整个会话期间持续存在**，Claude Code 不会重新读取文件。

**上下文压缩时**：压缩会保留最近调用的 skill，每个 skill 保留前 5000 tokens，所有 skill 共享 25000 tokens 的总预算。从最近调用的 skill 开始填充，旧 skill 可能被完全丢弃。

**实际影响**：

- 如果 skill 在压缩后失效，重新调用 `/skill-name` 即可恢复
- 多个 skill 同时激活时，越早调用的越容易在压缩后丢失
- 用 `hooks` 可以在压缩后强制重新注入关键上下文（`SessionStart` + `compact` matcher）

```json
// 在 .claude/settings.json 里配置，压缩后重新注入上下文
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo '重要提醒：使用 Bun 而非 npm，提交前运行测试'"
          }
        ]
      }
    ]
  }
}
```

---

## 十一、常见问题排查

| 问题                  | 原因                       | 解决                                                    |
| --------------------- | -------------------------- | ------------------------------------------------------- |
| skill 不自动触发      | description 关键词不够精准 | 在 description 里加入用户自然会说的词                   |
| skill 触发太频繁      | description 太宽泛         | 缩窄 description，或加 `disable-model-invocation: true` |
| 激活后不再生效        | 上下文压缩后 skill 被丢弃  | 重新调用 `/skill-name`，或用 hooks 强制保持             |
| `$ARGUMENTS` 没有替换 | 调用时没传参数             | 正常，Claude 仍能看到末尾追加的 `ARGUMENTS:`            |
| shell 注入不执行      | 工具设置禁用了 shell 执行  | 检查 `disableSkillShellExecution` 设置                  |
| fork 子代理看不到历史 | 这是设计行为               | 在 skill 正文里用 `!` 注入需要的上下文数据              |

---

## 参考资料

- [Claude Code Skills 官方文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Gemini CLI Skills 文档](https://geminicli.com/docs/cli/skills/)
- [Agent Skills 高级实战](https://www.mejba.me/blog/agent-skills-advanced-claude-code)
