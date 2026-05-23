---
title: Agent Skills 开放标准与各工具兼容性全解
date: 2026-04-11
category: AI工具
tags:
  - Agent Skills
  - SKILL.md
  - Claude Code
  - Kiro
  - Cursor
  - Codex
  - 兼容性
description: 按 2026-05-22 重新复核 Agent Skills 的通用层与工具差异，重点说明 Kiro / Codex 当前可确认支持什么、Cursor / Claude Code 现在更推荐什么，以及哪些旧说法不应再当通用真相。
---

# Agent Skills 开放标准与各工具兼容性全解

## 一、先说结论

**不要再把所有工具写成“完全一套玩法”。**

到 2026-05-22 这次复核为止，更稳妥的结论是：

- `一个目录 + 一个 SKILL.md` 这件事，确实已经形成了可移植的技能包思路。
- Kiro 官方文档明确写了它遵循开放的 Agent Skills 标准。
- Codex 这边也已经有成型的 skills 生态，本地实装目录里能直接看到 `~/.codex/skills/`、预装 `.system` skills，以及 OpenAI 官方维护的 `openai/skills` 仓库。
- 但 Cursor 当前官方文档主轴是 `Rules` 和根目录 `AGENTS.md`，不是把 skills 当成唯一中心。
- Claude Code 这轮核对到的官方稳定页面，重点也是自定义 slash commands，而不是一份覆盖所有“高级 skill 字段”的单一总规范页。

所以现在最安全的理解方式是：

- **通用层**：`SKILL.md` 的目录化封装思路
- **Kiro / Codex 层**：当前可以明确落地的 skills 目录机制
- **Cursor / Claude 层**：当前官方文档更明确支持的规则与命令机制

---

## 二、这次复核到底依据了什么

本篇只把以下内容当作“这轮能确认的硬依据”：

- Kiro 官方 `Agent Skills` 文档
- OpenAI 官方 `openai/skills` 仓库
- 本机当前真实存在的 `~/.codex/skills/` 目录结构
- Cursor 官方 `Rules / AGENTS.md` 文档
- Claude Code 官方 `slash commands` 文档

凡是没有在这几类来源里再次确认的细节，这次都不再当成“稳定事实”写死。

---

## 三、最小可移植结构

跨工具最稳的一层，仍然是下面这个目录结构：

```text
my-skill/
├── SKILL.md
├── references/   # 可选
├── scripts/      # 可选
└── assets/       # 可选
```

### 3.1 哪些目录最常见

- `SKILL.md`：必需，放元信息和主流程
- `references/`：放长文档、规范、详细说明
- `scripts/`：放需要稳定执行的脚本
- `assets/`：放模板、图片、示例文件等

### 3.2 Codex 里还常见一个目录

在 Codex 当前自带 skills 里，还能看到：

```text
agents/
└── openai.yaml
```

这一层更像 **Codex 的 UI/展示元信息**，不是 Agent Skills 最小通用标准本身。也就是说：

- 在 Codex 里它很有价值
- 但不要把它误写成“所有工具都必须支持的标准字段”

---

## 四、现在最稳的 frontmatter 写法

到这次复核为止，跨工具最稳、最不容易过时的只有两个字段：

```yaml
---
name: pr-review
description: Review pull requests for code quality, security issues, and test coverage. Use when reviewing PRs or preparing code for review.
---
```

### 4.1 现在建议只默认依赖这两个字段

| 字段 | 现在的定位 | 说明 |
| ---- | ---------- | ---- |
| `name` | 稳定 | 技能标识，通常要求小写、数字、连字符 |
| `description` | 稳定 | 决定自动匹配和用途表达的核心字段 |

### 4.2 其他字段怎么理解

像下面这些字段：

- `allowed-tools`
- `disable-model-invocation`
- `context`
- `hooks`
- `paths`
- `model`
- `effort`
- `argument-hint`
- `metadata`
- `license`
- `compatibility`

这次统一降级为：

**“某些工具、某些版本、某些机制可能支持，但不要默认它们属于所有工具都稳定支持的通用标准。”**

如果主人追求跨工具复用，优先只写：

- `name`
- `description`
- 正文步骤
- `references/`、`scripts/`、`assets/`

---

## 五、按工具重新看兼容性

## 5.1 Kiro：当前最明确支持标准 skills 的一类

Kiro 官方文档这轮给出的信息相对清楚：

- 支持 workspace 级：`.kiro/skills/`
- 支持 global 级：`~/.kiro/skills/`
- 默认 agent 会自动发现这些 skills
- 自定义 agent 不会自动加载，需要在 `resources` 里显式声明 `skill://...`

一个当前仍成立的 Kiro 自定义 agent 示例：

```json
{
  "name": "my-agent",
  "resources": [
    "skill://.kiro/skills/*/SKILL.md",
    "skill://~/.kiro/skills/*/SKILL.md"
  ]
}
```

这说明 Kiro 对 skills 的支持不是“民间兼容”，而是官方文档已明确写出来的正式能力。

---

## 5.2 Codex：技能目录已经真实存在，并且有官方仓库

这轮最容易核实的，是 Codex 本机和官方仓库两侧都能对上：

### 本机侧

当前本机已经存在：

```text
~/.codex/skills/
```

里面能看到：

- `.system` 预装 skills
- 自定义 skills
- 每个 skill 目录里的 `SKILL.md`
- 部分 skills 还带 `agents/`、`references/`、`scripts/`、`assets/`

### 官方仓库侧

OpenAI 官方维护 `openai/skills` 仓库，并明确说明：

- `.system` skills 会随较新的 Codex 自动安装
- curated / experimental skills 可以通过 `skill-installer` 安装

所以对 Codex 来说，现在更稳的说法是：

- **skills 不是概念演示，而是已经实装的能力**
- 个人级目录以 `~/.codex/skills/` 为主
- 团队和项目也可以围绕 skill 目录来沉淀能力

---

## 5.3 Cursor：当前官方主轴是 Rules 和 `AGENTS.md`

Cursor 当前官方文档最明确讲的是：

- `.cursor/rules`
- 用户级 Rules
- 根目录 `AGENTS.md`
- `.cursorrules` 是 legacy

所以这轮我们不再把 Cursor 写成“和 Kiro / Codex 完全同形态的 skills 体系”，而改成更稳的结论：

- 如果主人在 Cursor 里要长期沉淀规范，**优先写 `.cursor/rules` 或根目录 `AGENTS.md`**
- 如果某个版本或社区工作流支持 skill 风格目录，那也应被视为“兼容层或变体”，不要反过来把它当 Cursor 当前官方主轴

这一点特别重要，因为很多旧文章会把：

- `Rules`
- `AGENTS.md`
- skill 目录
- slash commands

混写成同一件事，结果越看越乱。

---

## 5.4 Claude Code：这轮能确认的是“自定义命令”能力

Claude Code 当前这轮最好核对到的官方页面，是自定义 slash commands 文档。它明确展示了：

- `.claude/commands/`
- `~/.claude/commands/`
- `$ARGUMENTS`
- `$1`、`$2`
- `!` 命令注入
- `allowed-tools`
- `argument-hint`
- `model`

因此现在对 Claude Code 更稳的理解是：

- 如果主人想找**官方稳定文档**，先从自定义命令体系理解
- 某些“高级 skill 字段”即使在社区资料里常见，也不该直接写成“和 Kiro/Codex 一样的开放标准通用字段”

换句话说：

- Claude Code 确实很强
- 但“强”不等于“所有民间总结出来的字段都已经稳定官方化”

---

## 六、现在别再默认成立的旧说法

下面这些说法，这次都不再按“稳定事实”保留：

- “30+ 工具都完全遵循同一套字段和触发规则”
- “Cursor 官方就是 `.cursor/skills/` 为主”
- “Claude Code 的高级 frontmatter 可以直接视作开放标准的一部分”
- “所有工具都支持同样的自动激活、手动触发、权限控制、路径触发和子代理字段”
- “某个全局别名目录一定跨工具通用”

它们有的可能在某些版本、某些插件、某些社区实现里成立，但不适合继续写成“默认真相”。

---

## 七、现在最推荐的写法策略

### 7.1 如果目标是“跨工具复用”

请只写最小层：

```markdown
---
name: code-review
description: Review code for bugs, edge cases, security issues, and maintainability problems. Use when reviewing changed code or auditing a module.
---

## Review checklist

1. Check correctness and edge cases
2. Check security and secret exposure
3. Check tests and failure handling
4. Check naming and maintainability
```

然后把大段细则拆到：

- `references/`
- `scripts/`
- `assets/`

### 7.2 如果目标是“在 Codex 里用得更顺手”

可以在最小层之外，再加：

- `agents/openai.yaml`
- 更细的 references
- 确定可运行的辅助脚本

### 7.3 如果目标是“在 Cursor 里稳定长期使用”

优先考虑：

- `.cursor/rules`
- 根目录 `AGENTS.md`

### 7.4 如果目标是“在 Claude Code 里做强工作流”

优先先确认：

- 这件事是不是更适合做成 `.claude/commands/*.md`
- 里面是否真的需要 `allowed-tools`、参数占位和 `!` 注入

---

## 八、Skills、Rules、AGENTS.md 现在该怎么选

| 需求 | 更推荐什么 |
| ---- | ---------- |
| 某个特定任务的完整流程包 | `SKILL.md` + `references/` + `scripts/` |
| 长期项目规范 | `AGENTS.md` / `CLAUDE.md` / `.cursor/rules` |
| Codex 的个人能力包 | `~/.codex/skills/` |
| Kiro 的团队工作流 | `.kiro/skills/` |
| Cursor 的全局/项目指令 | `Rules` 与根目录 `AGENTS.md` |
| Claude Code 的快捷任务入口 | `.claude/commands/` |

一条最实用的判断线是：

- **总是要生效的规范**，写到 rules / AGENTS / memory 体系里
- **只在特定任务里触发的流程包**，再写 skill

---

## 九、总结

现在最值得记住的不是“谁支持最多字段”，而是下面三句话：

1. `SKILL.md` 仍然是一个很有价值的可移植封装思路。
2. Kiro 和 Codex 现在都能把这套思路落到清晰的官方或实装目录上。
3. Cursor 和 Claude Code 当前官方主文档的重心并不完全相同，所以别再把它们强行写成同一套产品形态。

如果主人后面只想记一个“不过时版本”，就记这个：

**跨工具先写最小 `SKILL.md`，落到具体工具时再分别接入 Kiro/Codex 的 skills 机制，或 Cursor/Claude 的 rules / commands 机制。**

---

## 十、参考资料

- [Agent Skills 官方规范](https://agentskills.io/specification)
- [Kiro Agent Skills 文档](https://kiro.dev/docs/cli/skills/)
- [Cursor Rules 文档](https://docs.cursor.com/context/rules-for-ai)
- [Claude Code Slash Commands 文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [OpenAI Skills 仓库](https://github.com/openai/skills)
