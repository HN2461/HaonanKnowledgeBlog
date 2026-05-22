---
title: Agent Skills 场景模板与案例库
date: 2026-04-11
category: AI工具
tags:
  - Agent Skills
  - SKILL.md
  - 模板
  - Codex
  - Kiro
  - Cursor
  - Claude Code
description: 按 2026-05-22 重新整理的 Agent Skills 模板库，优先提供可移植基础模板，再说明如何分别落到 Codex、Kiro、Cursor Rules 与 Claude Code 自定义命令中。
---

# Agent Skills 场景模板与案例库

> 这一篇最大的更新是：**不再把所有模板都写成“所有工具可直接复制运行”。**
>
> 现在更推荐的做法是：
>
> 1. 先写一份可移植基础模板
> 2. 再按 Codex / Kiro / Cursor / Claude 各自落地

---

## 一、模板使用总原则

### 1.1 先写 portable 基础层

也就是只依赖：

- `name`
- `description`
- 正文流程
- `references/`
- `scripts/`

### 1.2 再补工具专属层

- Kiro：直接按 `.kiro/skills/` 收纳
- Codex：直接按 `~/.codex/skills/` 或项目 skills 收纳，并可补 `agents/openai.yaml`
- Cursor：通常把同样内容改写成 `.cursor/rules` 或根目录 `AGENTS.md`
- Claude Code：通常把同样内容改写成 `.claude/commands/*.md`

### 1.3 为什么要这样分

因为“模板能不能复制”本来就有两种含义：

- 内容逻辑能不能复用
- 文件形态能不能原样放进去

前者通常可以，后者不一定。

---

## 二、可移植基础模板

## 2.1 通用代码审查模板

目录：

```text
code-review/
└── SKILL.md
```

`SKILL.md`：

```markdown
---
name: code-review
description: Review changed code for bugs, edge cases, security issues, missing tests, and maintainability problems. Use when reviewing a patch, PR, or risky refactor.
---

## Review workflow

1. Read the changed files and identify the main behavior changes
2. Check correctness, edge cases, and error handling
3. Check security risks and secret exposure
4. Check tests, assumptions, and regression risk
5. Report findings with file path, impact, and suggested fix
```

这个版本适合当所有变体的母版。

---

## 2.2 通用调试模板

目录：

```text
debug/
└── SKILL.md
```

`SKILL.md`：

```markdown
---
name: debug
description: Diagnose and fix errors, failing tests, broken scripts, and unexpected behavior. Use when a command fails, a page breaks, or output is incorrect.
---

## Debug workflow

1. Capture the exact error and reproduction steps
2. Find the first failing location, not just the last stack frame
3. Inspect the smallest set of related files
4. Fix the root cause with the smallest safe change
5. Re-run the failing scenario and document residual risk
```

---

## 2.3 通用 README 生成模板

目录：

```text
write-readme/
├── SKILL.md
└── references/
    └── readme-sections.md
```

`SKILL.md`：

```markdown
---
name: write-readme
description: Create or refresh a project README with setup, usage, structure, and contribution guidance. Use when a repo lacks onboarding documentation or the README is outdated.
---

## Workflow

1. Inspect the project entry points and package metadata
2. Read `references/readme-sections.md`
3. Summarize the project in plain language
4. Generate or update the README with only relevant sections
```

这个模板的关键不是 fancy 字段，而是知道什么时候把固定结构拆进 `references/`。

---

## 三、Kiro / Codex 直接可落地的模板

## 3.1 Kiro / Codex 通用增强版代码审查

目录：

```text
code-review/
├── SKILL.md
└── references/
    └── checklist.md
```

`SKILL.md`：

```markdown
---
name: code-review
description: Review changed code for bugs, edge cases, security issues, missing tests, and maintainability problems. Use when reviewing a patch, PR, or risky refactor.
---

## Workflow

1. Read the changed files and summarize the behavior change
2. Read `references/checklist.md`
3. Look for correctness, safety, and regression issues
4. Report findings ordered by severity
```

为什么这个版本适合 Kiro / Codex：

- 都吃 `SKILL.md`
- 都适合目录化 references
- 没依赖高风险私有字段

---

## 3.2 Codex 风格 companion skill 模板

目录：

```text
release-audit/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   └── release-checklist.md
└── scripts/
    └── collect_release_notes.py
```

`SKILL.md`：

```markdown
---
name: release-audit
description: Audit release readiness by checking recent code changes, tests, rollout notes, and known risks. Use when preparing a release or deployment handoff.
---

## Workflow

1. Read `references/release-checklist.md`
2. Run `scripts/collect_release_notes.py` if release data needs to be gathered
3. Identify blockers, follow-ups, and rollout risks
4. Produce a concise release-readiness report
```

说明：

- `agents/openai.yaml` 更像 Codex UI 补充层
- 没它也能做 skill
- 但如果主人要把 skill 做得更完整、在 Codex 里展示更友好，这一层值得保留

---

## 四、Cursor 当前更推荐的等价改写

Cursor 当前官方文档主轴是 `.cursor/rules` 与根目录 `AGENTS.md`，所以更实用的不是“硬抄 skill 目录”，而是把同一套工作流改写成 rule。

## 4.1 用 `AGENTS.md` 承载项目级审查习惯

```markdown
# Project Instructions

## Code Review Expectations

- Prioritize bugs, regressions, and missing tests
- Call out risky edge cases before style issues
- Include file references when reporting findings
- Prefer the smallest safe fix over broad rewrites
```

适合：

- 每次都要生效的长期要求
- 团队统一口径

不适合：

- 只在某个任务里才会触发的复杂流程包

## 4.2 用 `.cursor/rules` 承载有范围的流程规则

如果主人已经在 Cursor 里用 Project Rules，那么同样的审查模板更适合变成：

- 某条 Agent Requested rule
- 某条 Auto Attached rule

而不是强行保留成 `SKILL.md` 文件夹。

---

## 五、Claude Code 当前更推荐的等价改写

Claude Code 这轮最稳的官方能力是自定义 slash commands，所以更实用的做法通常是：

## 5.1 改写成命令文件

目录：

```text
.claude/commands/review-pr.md
```

内容：

```markdown
---
description: Review a pull request for bugs, regression risks, and missing tests
allowed-tools: Bash(git status:*), Bash(git diff:*)
argument-hint: [pr-or-branch]
---

- Current git status: !`git status`
- Current diff: !`git diff`

Review the requested change and report findings ordered by severity.
Target: $ARGUMENTS
```

这样写的好处是：

- 贴合 Claude 当前官方文档
- 参数和命令注入都有明确出处
- 不需要把它伪装成“跨工具通用 skill”

---

## 六、三类高频模板

## 6.1 发布前检查

portable 版：

```markdown
---
name: pre-release-check
description: Verify release readiness by checking tests, risky changes, rollback notes, and deployment prerequisites. Use before a production rollout or important cut.
---

1. Identify the scope of the release
2. Read the release checklist
3. Confirm tests, risks, and rollback notes
4. Produce a go/no-go summary
```

适配建议：

- Kiro / Codex：保留 skill 目录
- Cursor：改成 rule
- Claude：改成自定义命令

## 6.2 文档生成

portable 版：

```markdown
---
name: docs-refresh
description: Refresh outdated project documentation by comparing the current codebase with existing docs. Use when a README, guide, or setup note has drifted from reality.
---

1. Read the current docs
2. Inspect the relevant code and commands
3. Mark outdated claims
4. Rewrite only the stale parts
```

## 6.3 安全复查

portable 版：

```markdown
---
name: security-review
description: Review code and configuration for auth mistakes, secret exposure, unsafe defaults, and input validation gaps. Use when touching login, payments, uploads, or external integrations.
---

1. Identify trust boundaries
2. Check auth and authorization paths
3. Check secrets and configuration exposure
4. Check validation and dangerous defaults
5. Report concrete risks with fixes
```

---

## 七、现在不再建议直接照抄的旧模板特点

以下模板写法这次都被降级处理：

- 开头就塞大量工具私有字段
- 一上来就假定所有工具都支持 `allowed-tools`
- 模板正文里把 `context: fork`、`hooks`、`paths` 当通用能力
- “这一份复制到 Codex、Cursor、Claude、Kiro 全都完全一样可跑”

原因不是这些写法一定没用，而是它们太容易随着产品版本变化而失真。

---

## 八、现在最实用的抄法

如果主人只想记一套最省心的模板流程，就按这个顺序：

1. 先写 portable `SKILL.md`
2. 把长内容放进 `references/`
3. 把重复命令变成 `scripts/`
4. 在 Codex 增加 `agents/openai.yaml`
5. 在 Cursor 改写成 `Rules` / `AGENTS.md`
6. 在 Claude 改写成 slash command

这样写出来的模板，不一定“最炫”，但最抗过时，也最容易真正落地。

## 参考资料

- [Kiro Agent Skills 文档](https://kiro.dev/docs/cli/skills/)
- [Cursor Rules 文档](https://docs.cursor.com/context/rules-for-ai)
- [Claude Code Slash Commands 文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [OpenAI Skills 仓库](https://github.com/openai/skills)
