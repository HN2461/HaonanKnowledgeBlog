# 第二篇：Codex 官方资料补充与进阶实践（2026-03）

> 本文基于 OpenAI 官方 Codex 文档整理，时间点为 `2026-03-08`。  
> 定位：主线 05（进阶能力：自动化、治理、团队标准化）。  
> 前置：建议先读第三篇、第五篇、第六篇、第七篇。  
> 本篇不展开：第三方服务商具体线路（看第四篇、第一篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。

章节导航（点击跳转）：

[[toc]]

---

## 1. 先更新一个关键信息：模型建议会变化

官方 CLI 文档当前写法是：多数任务优先使用 `gpt-5.4`，并可在会话中用 `/model` 切换。  
如果你使用第三方网关，最终可用模型仍以网关后台为准，不一定和官方默认完全一致。

常用切换方式：

```bash
codex --model gpt-5.4
```

逐行解释：

1. `codex --model gpt-5.4`：仅对当前这次会话临时切模型，不会修改 `config.toml` 默认值。

## 2. 安装与平台策略（官方口径）

这部分和第一篇/第三篇重复，这里只保留“官方差异提醒”：Windows 原生可用，但官方仍建议复杂项目优先在 WSL 工作区运行。

安装与升级命令（留作速查）：

```bash
npm i -g @openai/codex
codex
npm i -g @openai/codex@latest
```

逐行解释：

1. `npm i -g @openai/codex`：全局安装 Codex CLI。
2. `codex`：启动交互会话，确认 CLI 可正常运行。
3. `npm i -g @openai/codex@latest`：升级到最新版，排查问题时建议先做这一步。

## 3. 配置分层：别再“改了不生效”

这里仅保留结论，完整解释看第三篇第 4 节和第五篇第 2 节。  
官方给出的优先级（高到低）：

1. CLI flags 与 `--config`
2. `--profile <name>` 对应配置
3. 项目级 `.codex/config.toml`（从根到当前目录，最近的优先）
4. 用户级 `~/.codex/config.toml`
5. 系统级配置（如 Unix 的 `/etc/codex/config.toml`）
6. 内置默认值

注意：项目级配置只在“项目被信任”时加载。

## 4. 审批与沙箱：效率和安全分开配

高频参数：

- `approval_policy`：`untrusted | on-request | never`
- `sandbox_mode`：`read-only | workspace-write | danger-full-access`
- `--full-auto`：等价于 `--ask-for-approval on-request` + `--sandbox workspace-write`
- `--yolo`：绕过审批和沙箱，仅建议在外部隔离环境使用

官方对 `codex exec` 的默认行为是 `read-only` 沙箱。  
自动化场景里，建议只给最小必要权限。

## 5. AGENTS.md 进阶：真正影响稳定性的核心

官方说明的加载顺序：

1. 全局层：`~/.codex/AGENTS.override.md`（有则优先）否则 `~/.codex/AGENTS.md`
2. 项目层：从项目根目录一路到当前目录，每层最多取一个说明文件
3. 越靠近当前目录的说明，覆盖效果越强

两个关键参数：

- `project_doc_max_bytes`：默认 `32 KiB`
- `project_doc_fallback_filenames`：可扩展非 `AGENTS.md` 的文件名

## 6. 非交互自动化：`codex exec` 的正确打开方式

最小用法：

```bash
codex exec "summarize the repository structure and list the top 5 risky areas"
```

逐行解释：

1. `codex exec "..."`：非交互执行一次性任务，适合脚本和流水线场景。

机器可读输出：

```bash
codex exec --json "summarize the repo structure" | jq
```

逐行解释：

1. `codex exec --json "..."`：输出机器可读事件流。
2. `| jq`：把 JSON 输出格式化，便于查看和后续脚本处理。

结构化 JSON 输出：

```bash
codex exec "Extract project metadata" --output-schema ./schema.json -o ./project-metadata.json
```

逐行解释：

1. `codex exec "Extract project metadata"`：执行一次“提取项目元数据”任务。
2. `--output-schema ./schema.json`：强制输出结构遵循给定 JSON Schema。
3. `-o ./project-metadata.json`：把结果写入文件，便于后续程序消费。

会话续跑：

```bash
codex exec resume --last "continue from previous run"
```

逐行解释：

1. `codex exec resume --last`：续跑最近一次 `codex exec` 任务。
2. `"continue from previous run"`：告诉模型本次续跑的目标。

额外要点：

- `codex exec` 默认要求在 Git 仓库内运行，可用 `--skip-git-repo-check` 覆盖
- `~/.codex/auth.json` 包含敏感 token，必须按密码文件对待，不要提交到仓库

## 7. MCP 生态：从“能连上”到“可控可治理”

CLI 添加 MCP 服务：

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp --help
```

逐行解释：

1. `codex mcp add context7 -- npx -y @upstash/context7-mcp`：把名为 `context7` 的 MCP 服务注册到 Codex（通过 `npx` 启动）。
2. `codex mcp --help`：查看 MCP 子命令，确认当前 CLI 的可用管理能力。

官方支持两类：

1. STDIO 服务（本地进程）
2. Streamable HTTP 服务（URL 方式，支持 Bearer/OAuth）

`config.toml` 可配置：

- `enabled_tools` / `disabled_tools`
- `startup_timeout_sec` / `tool_timeout_sec`
- `required = true`（服务起不来时直接 fail-fast）

## 8. CLI 高频斜杠命令（建议背下来）

- `/model`：切模型与推理强度
- `/permissions`：会话中切审批策略
- `/status`：看模型、权限、可写目录、token 使用
- `/diff`：审查当前改动
- `/review`：让 Codex 做工作树审查
- `/init`：生成 `AGENTS.md` 模板
- `/mcp`：查看当前 MCP 工具
- `/plan`：先做计划再执行

## 9. IDE 扩展补充（VS Code / Cursor / Windsurf）

官方文档提到：

1. 扩展支持 VS Code 及其分支（Cursor、Windsurf）
2. 可用 `@文件名` 在提示词中显式引用代码上下文
3. 支持把大任务委托到云端运行，再拉回本地续做

## 10. 一套实用的双 Profile 模板

```toml
[profiles.safe]
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

[profiles.ci]
approval_policy = "never"
sandbox_mode = "read-only"
```

逐字段解释：

1. `[profiles.safe]`：定义日常开发 profile。
2. `approval_policy = "on-request"`：风险动作先确认。
3. `sandbox_mode = "workspace-write"`：可改工作区代码。
4. `web_search = "cached"`：默认使用缓存搜索。
5. `[profiles.ci]`：定义 CI/批处理 profile。
6. `approval_policy = "never"`：无人值守时不弹确认。
7. `sandbox_mode = "read-only"`：CI 场景只读更稳。

使用：

```bash
codex --profile safe
codex exec --profile ci "run CI triage and output a short report"
```

逐行解释：

1. `codex --profile safe`：以 `safe` 配置进入交互会话。
2. `codex exec --profile ci "..."`：用 `ci` 配置执行自动化任务，输出简短报告。

## 11. 官方资料入口（建议收藏）

- CLI 概览：<https://developers.openai.com/codex/cli>
- CLI 功能：<https://developers.openai.com/codex/cli/features>
- CLI 命令参数：<https://developers.openai.com/codex/cli/reference>
- CLI 斜杠命令：<https://developers.openai.com/codex/cli/slash-commands>
- 配置基础：<https://developers.openai.com/codex/config-basic>
- 配置参考：<https://developers.openai.com/codex/config-reference>
- AGENTS.md：<https://developers.openai.com/codex/guides/agents-md>
- Non-interactive：<https://developers.openai.com/codex/noninteractive>
- MCP：<https://developers.openai.com/codex/mcp>
- IDE 扩展：<https://developers.openai.com/codex/ide>
- IDE 功能：<https://developers.openai.com/codex/ide/features>
- Windows 指南：<https://developers.openai.com/codex/windows>
- Agent approvals & security：<https://developers.openai.com/codex/agent-approvals-security>
