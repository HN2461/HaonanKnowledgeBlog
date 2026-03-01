# Codex 入门指南（B站视频）深度教学笔记（2026-03 更新）

- 视频：<https://www.bilibili.com/video/BV11erUBUEEX>
- 标题：`Codex 入门指南`
- 发布时间：`2026-01-17`
- 视频时长：`53:02`
- 本文目标：把视频中的 7 个知识点扩展成可落地的实战手册，并补充官方文档与 Cookbook/Blog 的进阶方法。

---

## 0. 研究边界与方法

先说明边界，避免你误以为这是逐句转写：

1. 该视频公开页当前没有可直接提取的字幕流，无法做逐句 transcript 讲解。
2. 本文基于视频简介中的 7 个主线知识点进行“知识点级深挖”。
3. 所有补充内容优先采用 OpenAI 官方一手资料（Codex docs、Cookbook、官方 Blog），并按 `2026-03-01` 现状校对。

---

## 1. 视频知识地图（7 个主线）

视频简介核心主线：

1. 安装 Codex（CLI + IDE）
2. 设置仓库并完成首次运行
3. 编写优秀的 AGENTS.md（模式与最佳实践）
4. 为环境配置 Codex
5. 用提示模式获得更一致结果
6. CLI/IDE 使用技巧
7. 高级工作流：无头模式 + SDK

下文对每个点按统一结构展开：

- 这节在解决什么问题
- 核心概念
- 可执行步骤
- 常见坑
- 验收清单

---

## 2. 知识点一：安装 Codex（CLI + IDE）

### 2.1 这节在解决什么问题

先把运行入口打通。没有稳定入口，后面所有“提示技巧”“自动化”等都无法复用。

### 2.2 核心概念

- CLI 是终端主入口，适合工程任务与自动化。
- IDE 扩展是开发主入口，适合边看代码边协作。
- CLI 与 IDE 共用配置层（`~/.codex/config.toml`）和同一套代理能力。

### 2.3 可执行步骤

```bash
# 方式1：npm
npm install -g @openai/codex

# 方式2：Homebrew
brew install codex

# 首次启动
codex
```

首次启动会要求登录：

- ChatGPT 账号登录（Plus/Pro/Business/Edu/Enterprise 含 Codex 能力）
- API key 登录（部分能力可能受限，例如某些云端能力）

IDE 扩展支持：

- VS Code
- Cursor
- Windsurf
- 其他 VS Code 兼容编辑器

### 2.4 常见坑

- 在错误目录启动 `codex`，导致读到的是别的仓库。
- 认为“能打开就算装好”，但没有做首次任务验收。
- Windows 直接本地跑到复杂场景后才发现兼容边界，建议尽早选 WSL 工作区路线。

### 2.5 验收清单

```bash
codex "Explain this codebase to me and list top 5 risky areas."
```

看到以下结果才算通过：

- 能读到当前仓库结构
- 能给出计划而不是泛泛而谈
- 能执行基础读取操作并回报证据

---

## 3. 知识点二：设置仓库并完成首次运行

### 3.1 这节在解决什么问题

让 Codex 在“可回滚、可审计、可验证”的工程环境里工作，而不是一次性聊天。

### 3.2 核心概念

- 工作目录就是权限与上下文边界。
- Git 是安全网，也是审查基线。
- 小步闭环比“大需求一次到位”更稳。

### 3.3 可执行步骤

1. 在仓库根目录启动

```bash
codex
# 或
codex --cd ./your-repo
```

2. 先用安全默认组合

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

3. 首轮任务建议顺序

- 任务 1：纯理解（架构、风险点）
- 任务 2：小改动（一个 bug + 一个验证）
- 任务 3：审查（`/review` + `/diff` + 本地测试）

### 3.4 常见坑

- 一上来给“重构整个项目”。
- 没有 checkpoint，出问题只能手工找回。
- 验证标准不写，最后只能靠感觉判断“好像可以”。

### 3.5 验收清单

- 至少 1 次可回滚提交
- 至少 1 次 `/review` 输出
- 至少 1 次本地测试或构建验证结果

---

## 4. 知识点三：AGENTS.md（模式与最佳实践）

### 4.1 这节在解决什么问题

把“你每次都要重复讲的规则”沉淀为持久约束，减少走偏与反复解释。

### 4.2 核心概念：指令链与覆盖

Codex 的 AGENTS 指令链可以理解为“分层政策”：

1. 全局层：`~/.codex/AGENTS.override.md`（优先）或 `~/.codex/AGENTS.md`
2. 项目层：从项目根到当前目录逐层搜索，每层最多取一个文件（`AGENTS.override.md` 优先）
3. 合并顺序：从根到叶，越靠近当前目录覆盖力越强

补充要点：

- 有总字节上限，超出会截断（可通过配置调整）。
- 可配置 fallback 文件名（例如 `TEAM_GUIDE.md`）纳入指令发现。

### 4.3 推荐写法（模板）

```markdown
# AGENTS.md

## Scope
- Only modify files directly related to the task.
- Avoid unrelated renames and formatting-only changes.

## Safety
- Never run destructive git commands unless explicitly requested.
- Ask before adding new dependencies.

## Validation
- Backend changes: pytest -q
- Frontend changes: npm test
- If tests cannot run, explain why and provide manual verification steps.

## Output
- Provide conclusion first, then evidence.
- List risks and rollback strategy.
```

### 4.4 如何写得“可执行”

- 写命令，不写口号。
- 写禁止项，不写“尽量”。
- 写验收项，不写“保证质量”。

### 4.5 常见坑

- 写成价值观宣言，缺少命令与边界。
- 目录层规则冲突但没人维护。
- 文件过长，把关键硬约束埋没。

### 4.6 验收清单

```bash
codex --ask-for-approval never "Summarize the current instructions."
```

检查输出是否包含你预期的全局 + 项目 + 子目录规则。

---

## 5. 知识点四：环境配置（config.toml）

### 5.1 这节在解决什么问题

把“默认行为”固定下来，让不同任务表现一致、可控、可审计。

### 5.2 核心概念：配置优先级

官方优先级（高到低）：

1. CLI flags / `--config` 一次性覆盖
2. `--profile` 指定 profile
3. 项目 `.codex/config.toml`（从根到当前目录，越近优先，且仅 trusted 项目生效）
4. 用户 `~/.codex/config.toml`
5. 系统配置（如 Unix 的 `/etc/codex/config.toml`）
6. 内建默认

### 5.3 常用配置样例

```toml
model = "gpt-5.3-codex"
approval_policy = "on-request" # untrusted | on-request | never
sandbox_mode = "workspace-write" # read-only | workspace-write | danger-full-access
web_search = "cached" # disabled | cached | live
model_reasoning_effort = "medium" # minimal | low | medium | high | xhigh
personality = "pragmatic" # none | friendly | pragmatic
```

### 5.4 进阶配置样例

```toml
profile = "deep_review"

[profiles.deep_review]
model = "gpt-5.3-codex"
model_reasoning_effort = "high"
approval_policy = "never"

[projects.'C:\Users\you\Desktop\repo']
trust_level = "trusted"

[sandbox_workspace_write]
network_access = false
```

CLI 一次性覆盖示例：

```bash
codex --config sandbox_workspace_write.network_access=true
codex --config 'shell_environment_policy.include_only=["PATH","HOME"]'
```

### 5.5 Windows 注意事项

- IDE 扩展在 Windows 仍属于实验性支持，官方建议优先 WSL 工作区。
- 原生 Windows 支持沙箱模式：

```toml
[windows]
sandbox = "unelevated" # or "elevated"
```

- Windows 原生下可用 `/sandbox-add-read-dir` 给额外目录开放只读权限。

### 5.6 常见坑

- 项目未 trusted，导致项目级 `.codex/config.toml` 不生效。
- 把 `approval_policy` 写成旧值（`on-failure` 已弃用语义）。
- 在不受控环境使用 `danger-full-access`。

---

## 6. 知识点五：提示模式（Prompting）获得稳定结果

### 6.1 这节在解决什么问题

让输出可复现，而不是“这次好、下次漂”。

### 6.2 官方原则（浓缩）

- 让模型可验证：写清复现步骤、测试命令、完成标准。
- 任务拆小：复杂任务拆成可验收小里程碑。
- 不确定时先让 Codex 产出计划再执行。

### 6.3 推荐 Prompt 骨架

```text
目标：
范围：
硬约束（禁止项）：
验证命令：
输出格式：
```

示例：

```text
目标：修复登录态偶发失效。
范围：仅修改 auth/ 与 session 相关文件。
硬约束：不改 public API，不新增依赖，不做无关重构。
验证命令：npm test && npm run lint。
输出格式：先根因，再改动点，再回归风险。
```

### 6.4 与 `/plan` 的配合

适合：

- 影响面大
- 多模块联动
- 需要分阶段验收

节奏：

1. `/plan` 拆里程碑
2. 你确认后执行
3. 每个里程碑跑验证命令
4. 失败先修复再推进

### 6.5 常见坑

- 只写需求，不写边界。
- 只写“修好它”，不写验证命令。
- 多个目标混在一条 prompt，导致结果不可审查。

---

## 7. 知识点六：CLI / IDE 高效技巧

### 7.1 CLI 高价值命令流

```bash
# 交互模式
codex

# 单次任务
codex "Explain this project"

# 恢复会话
codex resume --last

# 非交互恢复
codex exec resume --last "continue with remaining tasks"
```

### 7.2 必学 Slash Commands（按优先级）

- `/permissions`：切换安全策略（Auto / Read-only / Full Access）
- `/plan`：先规划后执行
- `/status`：看模型、审批、可写目录、token
- `/diff`：查看变更
- `/review`：做工作树审查
- `/compact`：长会话压缩上下文
- `/init`：生成 `AGENTS.md` 脚手架
- `/debug-config`：查配置层叠与生效来源
- `/resume` / `/fork` / `/new`：管理会话分支
- `/mcp` / `/apps`：看工具与集成可用性

### 7.3 IDE 高价值特性

- `@file` 引用文件，减少提示词冗余
- 自动带入 open files/selected range 上下文
- 模型与 reasoning effort 可直接切换
- 模式切换：`Chat` / `Agent` / `Agent (Full Access)`
- Cloud delegation：本地发起，云端跑大任务，再回本地收敛

### 7.4 常见提效套路

1. 长任务中固定节奏：`/plan -> 执行 -> /diff -> /review -> 本地测试`
2. 每 20~40 分钟 `/compact` 一次，避免上下文老化
3. 复杂任务用 `/fork` 开备选分支，不污染主线程

---

## 8. 知识点七：高级工作流（codex exec + SDK）

### 8.1 `codex exec` 的定位

用于脚本和 CI，不打开 TUI，适合自动化流水线。

### 8.2 关键行为（很重要）

- 默认 `read-only` 沙箱。
- 进度流写到 `stderr`。
- 默认只把最终消息输出到 `stdout`，方便管道衔接。

### 8.3 可执行示例

```bash
# 基础
codex exec "summarize top 5 risks in this repo"

# JSONL 事件流
codex exec --json "triage this repo" | jq

# 结构化输出
codex exec "Extract metadata" --output-schema ./schema.json -o ./out.json

# 无状态运行（不落盘 session rollout）
codex exec --ephemeral "quick triage"
```

继续上一次非交互任务：

```bash
codex exec resume --last "fix the race conditions you found"
```

CI 认证注意：

- `CODEX_API_KEY` 仅 `codex exec` 支持。
- 建议作为 CI secret 注入。

### 8.4 Codex SDK（TypeScript）

```bash
npm install @openai/codex-sdk
```

```ts
import { Codex } from '@openai/codex-sdk'

const codex = new Codex()
const thread = codex.startThread()

const plan = await thread.run('Make a plan to diagnose CI failures')
const impl = await thread.run('Implement the plan')
console.log({ plan, impl })
```

适用场景：

- 你要把 Codex 嵌入平台服务
- 你要控制线程生命周期与多轮编排
- 你要把结果接入工单/告警/质量平台

---

## 9. 进阶补充：视频之外但强相关的 4 套方法

### 9.1 长任务方法（Long-horizon）

Cookbook 给出的高成功率结构是“四文件法”：

1. `prompt/spec`：目标、非目标、硬约束、交付件
2. `plan`：里程碑 + 每里程碑验收标准 + 验证命令
3. `implement/runbook`：执行规则（失败先修复再前进）
4. `documentation/log`：状态与决策日志，保证可审计

核心不是“更聪明 prompt”，而是“可检查的执行系统”。

### 9.2 Skills + Shell + Compaction 联动

官方总结可视作三件套：

- Skills：可复用、版本化流程包（不是把全部模板塞系统提示）
- Shell：真实执行环境（本地或托管）
- Compaction：长会话自动压缩，避免上下文窗口爆掉

实操建议：

- Skill 描述写成“路由规则”，明确 `Use when / Don’t use when`
- 模板和示例放进 skill 内部，按需加载，减少无关 token

### 9.3 用 Evals 做技能迭代闭环

不要靠“感觉这个版本更好”，而是量化：

1. 触发是否正确（该触发时触发）
2. 过程是否合规（关键步骤是否执行）
3. 结果是否达标（DoD、质量评分、结构化 rubric）

建议混合两类评估：

- 硬规则：解析 `codex exec --json` 事件流做 deterministic 检查
- 软评分：用 schema/rubric 输出结构化分数

### 9.4 Figma MCP 前端协作流

对于 UI 类任务，官方给了“代码 <-> 设计”双向流：

1. 先让应用可渲染（本地或公开地址）
2. 通过 Figma MCP 让 Codex 生成/连接 Figma 文件
3. 采集界面画面到 Figma 做设计迭代
4. 再把决策回流到代码实现

这个流程非常适合“交互细节反复迭代”的前端团队。

---

## 10. 版本感知：避免学完即过时

截至 `2026-03-01` 的几个关键变化（建议你重点关注）：

1. `web_search` 已在 CLI/IDE 本地任务默认启用缓存模式（`cached`），可切 `live` 或 `disabled`。
2. CLI 版本持续快速迭代（例如 `2026-02-26` 已到 `0.106.0`）。
3. 功能有成熟度标签：`Under development / Experimental / Beta / Stable`，生产环境优先选稳定能力。

建议形成习惯：

- 每月看一次 changelog
- 新能力先看 feature maturity 再决定是否上生产

---

## 11. 故障排查矩阵（实战版）

| 症状 | 常见原因 | 处理建议 |
| --- | --- | --- |
| 登录后能力异常 | 认证方式或权限不同 | 先确认是 ChatGPT 登录还是 API key 登录 |
| 项目配置不生效 | 项目未 trusted | 检查 `projects.<path>.trust_level` 与实际路径 |
| `AGENTS.md` 没被读取 | 文件位置/命名/层级不对 | 用“Summarize current instructions”核验加载链 |
| 能改文件但不能联网 | `workspace-write` 默认无网络 | 显式配置 `[sandbox_workspace_write] network_access = true` |
| 非交互任务直接失败 | 不在 Git 仓库 | 用 Git 仓库运行，或明确 `--skip-git-repo-check`（谨慎） |
| Windows 路径访问异常 | 原生沙箱限制 | 优先 WSL；或使用 `/sandbox-add-read-dir`（Windows 原生） |
| 长任务逐渐跑偏 | 上下文膨胀/目标漂移 | 固定里程碑验证，周期性 `/compact`，失败先修复 |
| 本文与视频逐句对不上 | 视频无公开字幕接口 | 本文是“知识点级深挖”而非逐句 transcript |

---

## 12. 一周上手路线（可直接照着做）

1. Day 1：安装 CLI + IDE，完成首次任务验收
2. Day 2：为你常用仓库写最小 `AGENTS.md`
3. Day 3：配置 `config.toml`（模型、审批、沙箱、搜索）
4. Day 4：完成一次 `/plan -> 实施 -> /review -> 测试` 闭环
5. Day 5：把重复任务迁移到 `codex exec --json`
6. Day 6：引入 schema 输出，接入脚本或 CI
7. Day 7：用 SDK 做一个最小线程编排 demo

---

## 13. 命令速查（视频配套）

```bash
# 安装
npm install -g @openai/codex

# 启动
codex

# 指定目录
codex --cd ./your-repo

# 安全默认
codex --sandbox workspace-write --ask-for-approval on-request

# 快速提问
codex "Explain this codebase"

# 非交互
codex exec "Generate release notes"
codex exec --json "triage this repo" | jq

# 恢复会话
codex resume --last
codex exec resume --last "continue"
```

---

## 14. 参考资料（按优先级）

### 14.1 视频与仓库

- B站视频：<https://www.bilibili.com/video/BV11erUBUEEX>
- OpenAI Codex 仓库：<https://github.com/openai/codex>

### 14.2 Codex 官方文档

- Quickstart：<https://developers.openai.com/codex/quickstart>
- CLI：
  - <https://developers.openai.com/codex/cli>
  - <https://developers.openai.com/codex/cli/features>
  - <https://developers.openai.com/codex/cli/slash-commands>
- IDE：
  - <https://developers.openai.com/codex/ide>
  - <https://developers.openai.com/codex/ide/features>
  - <https://developers.openai.com/codex/ide/settings>
- AGENTS.md：<https://developers.openai.com/codex/guides/agents-md>
- Config：
  - <https://developers.openai.com/codex/config-basic>
  - <https://developers.openai.com/codex/config-advanced>
  - <https://developers.openai.com/codex/config-reference>
- Prompting：<https://developers.openai.com/codex/prompting>
- Non-interactive（`codex exec`）：<https://developers.openai.com/codex/noninteractive>
- SDK：<https://developers.openai.com/codex/sdk>
- Security：<https://developers.openai.com/codex/security>
- Windows：<https://developers.openai.com/codex/windows>
- Changelog：<https://developers.openai.com/codex/changelog>
- Feature Maturity：<https://developers.openai.com/codex/feature-maturity>

### 14.3 官方补充阅读（进阶）

- Cookbook: Codex Prompting Guide  
  <https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide>
- Cookbook: Long horizon tasks with Codex  
  <https://developers.openai.com/cookbook/examples/codex/long_horizon_tasks>
- Blog: Shell + Skills + Compaction  
  <https://developers.openai.com/blog/skills-shell-tips>
- Blog: Testing Agent Skills Systematically with Evals  
  <https://developers.openai.com/blog/eval-skills>
- Blog: Building frontend UIs with Codex and Figma  
  <https://developers.openai.com/blog/building-frontend-uis-with-codex-and-figma>

---

## 附：本笔记的结论

这支视频最适合做“Codex 全链路入门索引”。真正拉开效率差距的，不是单个命令，而是这 4 个长期能力：

1. AGENTS.md 约束化
2. config.toml 标准化
3. `/plan + 验证命令` 的工程节奏化
4. `codex exec + schema + eval` 的自动化闭环化
