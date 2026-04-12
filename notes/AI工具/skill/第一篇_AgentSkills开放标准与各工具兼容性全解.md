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
  - Gemini CLI
description: 深入解析 Agent Skills 开放标准的目录结构与 SKILL.md 写法，并逐一对比 Claude Code、Kiro、Cursor、Codex 等主流工具的兼容性与差异点。
---

# Agent Skills 开放标准与各工具兼容性全解

## 一、结论先行

**写法基本一样。**

Claude Code、Kiro、Cursor、Codex、Gemini CLI、VS Code Copilot 等 30+ 工具都遵循同一个开放标准：[Agent Skills](https://agentskills.io/specification)。核心格式完全相同——一个文件夹 + 一个 `SKILL.md`，frontmatter 字段通用。

各工具的差异主要体现在：

- **存放路径**不同（`.claude/skills/` vs `.kiro/skills/` vs `~/.cursor/skills/` 等）
- **扩展字段**不同（Claude Code 有更多高级字段，Kiro 字段更精简）
- **调用方式**略有差异（斜杠命令 `/skill-name` 是通用的，但自动激活逻辑各有实现）

---

## 二、标准起源

Agent Skills 标准由 Anthropic 于 2025 年 10 月随 Claude Code 一同发布，随后开放为独立规范，托管于 [agentskills.io](https://agentskills.io)。

目前已支持该标准的工具（部分）：

| 工具                     | 厂商             |
| ------------------------ | ---------------- |
| Claude Code              | Anthropic        |
| Kiro IDE                 | AWS              |
| Cursor                   | Anysphere        |
| OpenAI Codex             | OpenAI           |
| Gemini CLI               | Google           |
| GitHub Copilot (VS Code) | Microsoft/GitHub |
| Windsurf                 | Codeium          |
| Roo Code                 | Roo              |
| Cline                    | —                |
| Goose                    | Block            |

---

## 三、标准目录结构

所有工具都认可以下目录结构：

```
my-skill/
├── SKILL.md          # 必须，元信息 + 指令正文
├── scripts/          # 可选，可执行脚本（Python / Bash / JS）
├── references/       # 可选，详细参考文档
└── assets/           # 可选，模板、图片、数据文件
```

---

## 四、SKILL.md 格式规范（通用）

### 4.1 基础模板

```markdown
---
name: pr-review
description: Review pull requests for code quality, security issues, and test coverage. Use when reviewing PRs or preparing code for review.
---

## 操作步骤

1. 检查安全漏洞
2. 验证错误处理
3. 确认测试覆盖率
4. 审查命名与结构
```

### 4.2 frontmatter 字段（标准规范）

| 字段            | 必填 | 说明                                                                     |
| --------------- | ---- | ------------------------------------------------------------------------ |
| `name`          | ✅   | 技能名称，最多 64 字符，只允许小写字母、数字、连字符，必须与文件夹名一致 |
| `description`   | ✅   | 描述技能用途与触发时机，最多 1024 字符，建议包含关键词                   |
| `license`       | ❌   | 许可证名称或许可证文件引用                                               |
| `compatibility` | ❌   | 环境要求说明，最多 500 字符                                              |
| `metadata`      | ❌   | 任意键值对，存放作者、版本等附加信息                                     |
| `allowed-tools` | ❌   | 空格分隔的预授权工具列表（实验性）                                       |

### 4.3 name 字段规则

- 1-64 个字符
- 只能包含小写字母 `a-z`、数字 `0-9`、连字符 `-`
- 不能以连字符开头或结尾
- 不能包含连续连字符 `--`
- **必须与父目录名完全一致**

---

## 五、各工具对比（基于官方文档核实）

### 5.1 存放路径

| 工具        | 项目级路径                                                           | 全局路径                                                                 | 备注                                               |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| Claude Code | `.claude/skills/<name>/SKILL.md`                                     | `~/.claude/skills/<name>/SKILL.md`                                       | 还支持企业级和插件级                               |
| Kiro IDE    | `.kiro/skills/<name>/SKILL.md`                                       | `~/.kiro/skills/<name>/SKILL.md`                                         | —                                                  |
| Cursor      | `.cursor/skills/<name>/SKILL.md` 或 `.agents/skills/<name>/SKILL.md` | `~/.cursor/skills/<name>/SKILL.md`                                       | 同时兼容读取 `.claude/skills/` 和 `.codex/skills/` |
| Codex CLI   | `.codex/skills/<name>/SKILL.md`                                      | `~/.codex/skills/<name>/SKILL.md`                                        | —                                                  |
| Gemini CLI  | `.gemini/skills/<name>/SKILL.md` 或 `.agents/skills/<name>/SKILL.md` | `~/.gemini/skills/<name>/SKILL.md` 或 `~/.agents/skills/<name>/SKILL.md` | `.agents/skills/` 为通用别名，跨工具兼容           |

> Cursor 有个实用特性：它会自动兼容读取 `.claude/skills/`、`.codex/skills/`、`~/.claude/skills/`、`~/.codex/skills/`，所以放在 Claude Code 目录的 skill 在 Cursor 里也能直接用。

### 5.2 frontmatter 字段支持对比

| 字段                       | 标准规范  | Claude Code                   | Kiro    | Cursor       | Codex        |
| -------------------------- | --------- | ----------------------------- | ------- | ------------ | ------------ |
| `name`                     | ✅ 必填   | ⚠️ 可选（省略则用目录名）     | ✅ 必填 | ✅ 必填      | ✅ 必填      |
| `description`              | ✅ 必填   | ⚠️ 推荐（省略则用正文第一段） | ✅ 必填 | ✅ 必填      | ✅ 必填      |
| `license`                  | ❌ 可选   | ✅                            | ✅      | ✅           | ✅           |
| `compatibility`            | ❌ 可选   | ✅                            | ✅      | ✅           | ✅           |
| `metadata`                 | ❌ 可选   | ✅                            | ✅      | ✅           | ✅           |
| `allowed-tools`            | ❌ 实验性 | ✅                            | ✅      | 未明确文档化 | 未明确文档化 |
| `disable-model-invocation` | ❌ 扩展   | ✅                            | ❌      | ✅           | 未明确文档化 |
| `user-invocable`           | ❌ 扩展   | ✅                            | ❌      | ❌           | ❌           |
| `context`                  | ❌ 扩展   | ✅（fork 子代理）             | ❌      | ❌           | ❌           |
| `argument-hint`            | ❌ 扩展   | ✅                            | ❌      | ❌           | ❌           |
| `model` / `effort`         | ❌ 扩展   | ✅                            | ❌      | ❌           | ❌           |
| `paths`                    | ❌ 扩展   | ✅（文件匹配触发）            | ❌      | ❌           | ❌           |
| `hooks`                    | ❌ 扩展   | ✅                            | ❌      | ❌           | ❌           |
| `shell`                    | ❌ 扩展   | ✅（bash/powershell）         | ❌      | ❌           | ❌           |

> ⚠️ 注意：Claude Code 的 `name` 和 `description` 实际上都是可选的（省略时有默认值），但标准规范和 Kiro、Cursor 都要求必填。为了跨工具兼容，建议始终写上这两个字段。

### 5.3 调用方式详解

#### Claude Code

| 方式               | 操作                                            | 说明                                                         |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| 自动激活           | 直接描述任务                                    | Claude 根据 description 判断，description 始终预加载在上下文 |
| 手动调用           | `/skill-name`                                   | chat 输入框输入，支持 Tab 补全                               |
| 带参数调用         | `/skill-name arg1 arg2`                         | 参数通过 `$ARGUMENTS` / `$0` `$1` 接收                       |
| 仅手动（禁止自动） | frontmatter 加 `disable-model-invocation: true` | description 不再预加载，只有手动 `/` 才触发                  |
| 仅自动（隐藏命令） | frontmatter 加 `user-invocable: false`          | 不出现在 `/` 菜单，只由 Claude 自动决定                      |
| 权限控制           | `/permissions` 中添加 `Skill(name)`             | 可精确允许或拒绝特定 skill 被 Claude 调用                    |

> Claude Code 内置了 `/simplify`、`/batch`、`/debug`、`/loop`、`/claude-api` 等 bundled skills，用法与自定义 skill 完全一致。

#### Kiro IDE

| 方式     | 操作                                | 说明                                    |
| -------- | ----------------------------------- | --------------------------------------- |
| 自动激活 | 直接描述任务                        | Kiro 根据 description 匹配，自动加载    |
| 手动调用 | 在 Chat 输入 `/`，从弹出列表选择    | 支持搜索 skill 名称                     |
| 管理入口 | Kiro 面板 → Agent Steering & Skills | 可查看、导入、新建 skill（需 IDE 0.9+） |

#### Cursor

| 方式               | 操作                                               | 说明                                                   |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------ |
| 自动激活           | 直接描述任务                                       | Agent 根据 description 判断相关性后自动加载            |
| 手动调用           | 在 Agent 对话输入 `/`，搜索 skill 名称             |                                                        |
| 仅手动（禁止自动） | frontmatter 加 `disable-model-invocation: true`    | 行为等同传统斜杠命令                                   |
| 查看已发现的 skill | `Ctrl+Shift+J` → Rules → Agent Decides 区域        | Mac 为 `Cmd+Shift+J`                                   |
| 从 GitHub 导入     | Settings → Rules → Add Rule → Remote Rule (Github) |                                                        |
| 迁移旧规则         | 在 Agent chat 输入 `/migrate-to-skills`            | 将动态 rules 和斜杠命令转换为 skill（Cursor 2.4 内置） |

#### Codex CLI

| 方式             | 操作                       | 说明                                  |
| ---------------- | -------------------------- | ------------------------------------- |
| 自动激活         | 直接描述任务               | Codex 根据 description 隐式匹配       |
| 手动调用（TUI）  | 输入 `$` 后选择 skill 名称 | TUI 界面中的 skill 选择器             |
| 查看列表         | `/skills` 命令             | 显示已安装的 skill                    |
| 启用 skills 功能 | `codex --enable skills`    | skills 目前仍为实验性功能，需手动开启 |

#### Gemini CLI

| 方式            | 操作                                      | 说明                                                        |
| --------------- | ----------------------------------------- | ----------------------------------------------------------- |
| 自动激活        | 直接描述任务                              | Gemini 识别匹配后调用 `activate_skill` 工具，**需用户确认** |
| 查看 skill 列表 | `/skills list`                            | 显示所有已发现的 skill 及状态                               |
| 禁用某个 skill  | `/skills disable <name>`                  | 默认 user 范围，加 `--scope workspace` 为项目级             |
| 启用某个 skill  | `/skills enable <name>`                   |                                                             |
| 重新扫描        | `/skills reload`                          | 刷新 skill 列表                                             |
| 安装 skill      | `gemini skills install <url 或路径>`      | 支持 Git URL、本地目录、`.skill` 压缩包                     |
| 链接本地目录    | `gemini skills link /path/to/skills-repo` | 通过 symlink 链接，不复制文件                               |
| 卸载 skill      | `gemini skills uninstall <name>`          |                                                             |

> Gemini CLI 有一个独特的安全机制：每次 Gemini 决定使用某个 skill 时，**会弹出确认提示**，显示 skill 名称、用途和目录路径，用户确认后才正式注入上下文。其他工具没有这个设计。

### 5.4 优先级规则

当多个层级存在同名 skill 时：

- **Claude Code**：企业级 > 个人全局 > 项目级 > 插件
- **Kiro**：工作区（项目级）> 全局
- **Cursor**：项目级（`.cursor/skills/` 或 `.agents/skills/`）> 全局（`~/.cursor/skills/`）
- **Codex**：项目级 > 全局

---

## 六、Kiro IDE 使用 Skills 实操

> Skills 在 Kiro IDE **0.9 版本（2026年2月5日）** 才正式加入，低于此版本看不到相关入口。

### 6.1 在 IDE 里找到 Skills

1. 点击左侧活动栏的 Kiro 图标（Kiro 面板）
2. 找到 "Agent Steering & Skills" 区域
3. 点 `+` 按钮，可以选择：
   - "Import a skill"：从 GitHub URL 或本地文件夹导入
   - "Create a skill"：新建一个空白 skill

也可以直接手动创建文件夹，Kiro 启动时会自动扫描：

```
.kiro/skills/
└── my-skill/
    └── SKILL.md
```

### 6.2 在 Chat 里调用

- 自动激活：直接描述任务，Kiro 根据 description 判断是否加载
- 手动调用：在 Chat 输入框输入 `/`，从弹出列表选择 skill 名称

### 6.3 Kiro CLI 的特殊用法

Kiro CLI 里 skills 不是自动扫描目录，而是通过 **agent 配置文件**的 `resources` 字段显式引用：

```json
{
  "resources": ["skill://.kiro/skills/**/SKILL.md"]
}
```

agent 配置文件放在 `.kiro/agents/` 目录下（JSON 格式）。这是 Kiro CLI 独有的机制，IDE 不需要这样配置。

### 6.4 从其他工具迁移

官方明确说明：其他工具（Claude Code、Cursor 等）的 skill 格式完全兼容，直接把文件夹复制到 `.kiro/skills/` 即可使用，无需修改。

---

## 七、实战写法示例

### 7.1 最简版（所有工具通用）

```markdown
---
name: code-review
description: Review code for bugs, security issues, and best practices. Use when asked to review or check code quality.
---

## 代码审查清单

1. 检查潜在 bug 和边界条件
2. 识别安全漏洞（SQL 注入、XSS 等）
3. 验证错误处理是否完整
4. 确认命名规范与代码可读性
5. 检查是否有重复代码可以抽象
```

### 7.2 带脚本的完整版

```
code-review/
├── SKILL.md
├── scripts/
│   └── lint-check.sh
└── references/
    └── standards.md
```

`SKILL.md`：

```markdown
---
name: code-review
description: Review code for bugs, security issues, and best practices. Use when asked to review or check code quality.
compatibility: Requires git and Node.js
metadata:
  author: team
  version: "1.0"
---

## 代码审查流程

1. 运行静态检查：`scripts/lint-check.sh`
2. 参考团队规范：[standards.md](references/standards.md)
3. 逐项检查安全、性能、可读性

## 输出格式

每个问题按以下格式报告：

- **位置**：文件名:行号
- **级别**：error / warning / suggestion
- **说明**：问题描述与修复建议
```

### 7.3 Claude Code 专有扩展（仅 Claude Code 有效）

```markdown
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
context: fork
allowed-tools: Bash(git *) Bash(npm *)
effort: high
---

部署流程：

1. 运行测试套件
2. 构建生产包
3. 推送到部署目标
4. 验证部署结果
```

> `disable-model-invocation: true` 防止 Claude 自动触发，只允许用户手动 `/deploy`。
> `context: fork` 在独立子代理中运行，不共享对话历史。

---

## 八、渐进式披露原则

Agent Skills 标准的核心设计思想是**渐进式披露（Progressive Disclosure）**：

| 阶段   | 加载内容                                      | Token 消耗         |
| ------ | --------------------------------------------- | ------------------ |
| 启动时 | 所有 skill 的 `name` + `description`          | ~100 tokens/个     |
| 激活时 | 完整 `SKILL.md` 正文                          | 建议 < 5000 tokens |
| 按需时 | `scripts/`、`references/`、`assets/` 中的文件 | 按需加载           |

**最佳实践**：

- `SKILL.md` 正文控制在 500 行以内
- 详细参考文档放到 `references/` 目录
- `description` 前置关键词，因为超过 250 字符会被截断（Claude Code）

### description 写法技巧

description 是决定 skill 能否被自动激活的核心，写法直接影响效果：

| 写法           | 示例                                                                                                                                                            | 问题                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ❌ 太模糊      | `Helps with code review`                                                                                                                                        | 关键词不足，很难匹配       |
| ❌ 太宽泛      | `General coding assistant`                                                                                                                                      | 几乎什么都能匹配，会误触发 |
| ✅ 具体 + 场景 | `Review pull requests for security vulnerabilities, test coverage, and code quality. Use when reviewing PRs, checking code before merge, or auditing security.` | 包含具体动作、场景、关键词 |

建议格式：`[做什么] + [用于什么场景/何时使用]`，把最重要的关键词放在前 250 字符内。

---

## 九、总结

| 维度                 | 结论                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| 核心格式             | 完全一致，一个文件夹 + `SKILL.md`                                             |
| frontmatter 基础字段 | 完全通用                                                                      |
| 调用方式             | 斜杠命令 `/skill-name` 通用；Codex 额外支持 `$` 选择器；Gemini 有确认弹窗机制 |
| 存放路径             | 规律一致，只是工具名不同                                                      |
| 扩展字段             | Claude Code 最丰富，Kiro 精简，其他居中                                       |
| 可移植性             | 写一次，大多数工具都能用                                                      |

写 skill 时，建议只用标准字段（`name`、`description`），这样在所有工具间完全可移植。如果只用 Claude Code，可以按需加 `disable-model-invocation`、`context: fork` 等扩展字段。

---

## 十、参考资料

- [Agent Skills 官方规范](https://agentskills.io/specification)
- [Claude Code Skills 文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Kiro Agent Skills 文档](https://kiro.dev/docs/skills/)
- [Agent Skills 101 实践指南](https://blog.serghei.pl/posts/agent-skills-101/)
