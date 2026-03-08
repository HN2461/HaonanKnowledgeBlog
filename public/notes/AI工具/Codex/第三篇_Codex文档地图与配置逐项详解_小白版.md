# 第三篇：Codex 文档地图与配置逐项详解（小白版）

> 更新时间：2026-03-08  
> 定位：主线 01（先建立配置心智模型）。  
> 前置：无。  
> 下一篇建议：第五篇（字段字典）。  
> 本篇不展开：三端具体点位与截图（看第六篇、第七篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。

章节导航（点击跳转）：

[[toc]]

---

## 1. 先说结论：为什么你会觉得 Codex 难配

大部分人卡住不是因为命令难，而是这 4 件事混在一起了：

1. 认证方式（ChatGPT 登录 vs API Key）
2. 权限控制（approval + sandbox）
3. 配置层级（全局、项目、profile、命令行覆盖）
4. 扩展能力（AGENTS.md、MCP、Rules、Non-interactive）

只要你把这 4 层分开理解，Codex 的配置会非常清晰。

---

## 2. 官方文档阅读顺序（建议照这个顺序）

先看“能跑”，再看“可控”，最后看“自动化”。

1. `CLI 概览`：你到底在用什么工具  
2. `Config Basics`：配置文件放哪、优先级怎么覆盖  
3. `Agent approvals & security`：权限和安全边界  
4. `AGENTS.md`：给 Codex 长期指令  
5. `MCP`：给 Codex 接第三方工具  
6. `Non-interactive`：CI/CD 自动化
7. `Config Reference + Sample Config`：字段字典和完整样例

---

## 3. 配置文件到底放哪里

官方默认目录是：

- 用户级：`~/.codex/config.toml`
- 用户缓存凭据：`~/.codex/auth.json`（或系统 keyring）
- 项目级：`<repo>/.codex/config.toml`

在 Windows 上，`~/.codex/` 对应用户目录下 `.codex` 文件夹。  
例如：`C:\Users\你的用户名\.codex\config.toml`

---

## 4. 配置优先级（这是最关键的一条）

同一个配置项，最终生效值按这个顺序覆盖（高 -> 低）：

1. CLI flags / `--config`
2. `--profile <name>`
3. 项目 `.codex/config.toml`（从仓库根到当前目录，越近越优先）
4. 用户 `~/.codex/config.toml`
5. 系统级配置（如 Unix 的 `/etc/codex/config.toml`）
6. 内置默认值

小白常见误区：

1. 改了用户配置但项目里有 `.codex/config.toml` 覆盖了
2. 项目标记为 untrusted，项目配置根本没加载

---

## 5. 先给一份“能用且稳”的基础配置（建议起步）

```toml
model = "gpt-5.4"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
model_reasoning_effort = "medium"
web_search = "cached"
model_provider = "openai"
file_opener = "vscode"

[history]
persistence = "save-all"

[shell_environment_policy]
include_only = ["PATH", "HOME"]

[windows]
sandbox = "elevated"
```

这套配置的含义是：

1. 模型默认用 `gpt-5.4`
2. 可改当前工作区文件，但高风险动作会提示你确认
3. Web 搜索默认走缓存索引，风险低于直接 live 抓网
4. 会保存历史会话，便于 `resume`

---

## 6. 每个高频配置项到底是什么意思（逐项解释）

### 6.1 `model`

默认模型。  
官方 CLI 文档当前推荐多数任务用 `gpt-5.4`。

### 6.2 `model_reasoning_effort`

模型思考强度：`minimal | low | medium | high | xhigh`。  
任务越复杂可以越高，但通常更慢、成本更高。

### 6.3 `approval_policy`

控制“什么时候弹确认框”：

- `untrusted`：仅已知安全读操作自动执行，其他多半要你确认
- `on-request`：模型按情况请求确认（常用默认）
- `never`：不弹确认（自动化常用，但风险高）

高级用法：

```toml
approval_policy = { reject = { sandbox_approval = true, rules = false, mcp_elicitations = false } }
```

这表示：某些类型审批请求直接拒绝，不弹给用户。

### 6.4 `sandbox_mode`

控制技术权限边界：

- `read-only`：只读
- `workspace-write`：可写工作区
- `danger-full-access`：全放开

注意：`approval_policy` 决定“要不要问你”，`sandbox_mode` 决定“技术上能不能做”。

### 6.5 `sandbox_workspace_write.*`

只在 `workspace-write` 下生效：

- `network_access = true/false`：是否允许联网
- `writable_roots = []`：额外可写目录
- `exclude_tmpdir_env_var` / `exclude_slash_tmp`：控制临时目录写权限

### 6.6 `web_search`

- `cached`：默认，走 OpenAI 维护的缓存索引
- `live`：实时抓网（等价 `--search`）
- `disabled`：禁用

### 6.7 `model_provider` + `[model_providers.<id>]`

用于切换服务提供方（例如官方 OpenAI、代理网关、本地模型）。

关键字段：

- `base_url`：接口地址
- `env_key`：从环境变量取 API Key（推荐）
- `experimental_bearer_token`：可直写 token（官方不推荐）
- `wire_api = "responses"`：当前只支持 responses 协议
- `requires_openai_auth`：是否使用 OpenAI 认证链路

### 6.8 `profile` 和 `[profiles.<name>]`

用来保存“场景预设”。例如开发、CI、高安全审阅三套参数。

### 6.9 `projects.<path>.trust_level`

指定某目录是 `trusted` 还是 `untrusted`。  
如果不信任，Codex 会跳过项目内 `.codex/` 配置层。

### 6.10 `project_doc_max_bytes` / `project_doc_fallback_filenames`

这两个是 `AGENTS.md` 相关：

- 最大加载字节数（默认 32 KiB）
- 允许把其他文件名也当“指令文档”加载

### 6.11 `file_opener`

定义点击引用时打开方式：`vscode | vscode-insiders | windsurf | cursor | none`。

### 6.12 `history.persistence`

- `save-all`：保存会话历史
- `none`：不保存

---

## 7. `AGENTS.md` 机制，怎么配才不会“失效”

Codex 的指令发现顺序（官方）：

1. 全局层：`~/.codex/AGENTS.override.md`（有则优先）否则 `~/.codex/AGENTS.md`
2. 项目层：从项目根一路到当前目录，每层最多取一个文件
3. 合并顺序：从上到下，离当前目录越近的规则覆盖力越强

每层的查找顺序：

1. `AGENTS.override.md`
2. `AGENTS.md`
3. 你配置的 `project_doc_fallback_filenames`

建议小白先这么做：

1. 全局只写通用协作习惯（比如“改 JS 后跑测试”）
2. 仓库根写项目级规则（比如 lint/build/test）
3. 子目录只放有强差异的 override

---

## 8. 认证与 `auth.json`：别再把它当普通配置文件

官方支持两种登录：

1. ChatGPT 登录（订阅额度体系）
2. API Key 登录（按 API 计费）

注意点：

1. Codex CLI/IDE 会缓存登录信息
2. 缓存在 `~/.codex/auth.json` 或系统 keyring
3. `auth.json` 是明文敏感信息，等同密码，严禁提交仓库

可配置凭据存储策略：

```toml
cli_auth_credentials_store = "keyring" # file | keyring | auto
```

CI 场景下，官方推荐 API key 路线（`CODEX_API_KEY` 供 `codex exec` 使用）。

---

## 9. 审批与沙箱，给你 4 套可直接用的组合

### 9.1 安全阅读模式（只看不改）

```bash
codex --sandbox read-only --ask-for-approval on-request
```

### 9.2 默认开发模式（推荐）

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

### 9.3 自动化只读模式（CI 安全版）

```bash
codex exec --sandbox read-only --ask-for-approval never "..."
```

### 9.4 全自动高风险模式（仅隔离环境）

```bash
codex --dangerously-bypass-approvals-and-sandbox
# 或
codex --sandbox danger-full-access --ask-for-approval never
```

---

## 10. Non-interactive：`codex exec` 怎么用才专业

### 10.1 基本执行

```bash
codex exec "summarize the repository structure and list top risks"
```

### 10.2 JSON 事件流（脚本友好）

```bash
codex exec --json "summarize the repo structure" | jq
```

### 10.3 强约束结构化输出

```bash
codex exec "Extract project metadata" --output-schema ./schema.json -o ./project-metadata.json
```

### 10.4 续跑会话

```bash
codex exec resume --last "continue"
```

### 10.5 Git 仓库检查

`codex exec` 默认要求在 Git 仓库中运行。  
确实需要时可显式跳过：

```bash
codex exec --skip-git-repo-check "..."
```

---

## 11. MCP 配置：从“能连上”到“可控”

CLI 添加：

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

`config.toml` 方式（核心字段）：

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

[mcp_servers.github]
url = "https://example.com/mcp"
bearer_token_env_var = "GITHUB_TOKEN"
enabled_tools = ["search", "list_prs"]
disabled_tools = ["delete_pr"]
startup_timeout_sec = 10
tool_timeout_sec = 60
enabled = true
required = true
```

字段解释：

1. `required = true`：服务起不来就直接失败，不“带病运行”
2. `enabled_tools`/`disabled_tools`：白名单 + 黑名单双保险
3. `startup_timeout_sec`/`tool_timeout_sec`：卡死保护

---

## 12. Rules（`.rules`）怎么理解

`rules` 解决的是“命令级放行策略”，和 `approval_policy` 互补。  
最常用是 `prefix_rule`。

示例：

```starlark
prefix_rule(
  pattern = ["gh", "pr", "view"],
  decision = "prompt", # allow | prompt | forbidden
  justification = "查看 PR 前先确认仓库与参数",
  match = ["gh pr view 1234"],
  not_match = ["gh pr --repo x/y view 1234"],
)
```

验证规则：

```bash
codex execpolicy check --pretty --rules ~/.codex/rules/default.rules -- gh pr view 1234
```

---

## 13. Windows 用户的最优路线（官方建议）

### 13.1 能用但更推荐：WSL 工作区

官方给出的 Windows 指南重点是：

1. Windows 原生可用，但复杂项目更建议 WSL
2. 仓库尽量放在 WSL Linux 路径（如 `~/code/...`），不要长期放 `/mnt/c/...`
3. WSL 下安装 Node + Codex CLI，体验更接近 Linux/macOS

### 13.2 如果你坚持原生 Windows

```toml
[windows]
sandbox = "unelevated" # 或 elevated
```

并可用：

```text
/sandbox-add-read-dir C:\absolute\directory\path
```

给沙箱补充只读目录访问。

---

## 14. 给小白的“排错顺序”（按这个查最快）

1. `codex --version` 是否正常
2. `~/.codex/config.toml` 是否有语法错误
3. 当前是否在受信任项目（否则 `.codex/config.toml` 不加载）
4. `codex /status` 看实际生效模型、权限、可写路径
5. 检查是否被 profile 或 `--config` 临时覆盖
6. 认证问题先看 `auth.json`/keyring 是否有效
7. MCP 问题先查 `startup_timeout_sec`、`required`、服务日志

---

## 15. 推荐的三套 profile（可直接抄）

```toml
[profiles.dev_safe]
model = "gpt-5.4"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"
model_reasoning_effort = "medium"

[profiles.readonly_audit]
model = "gpt-5.4"
approval_policy = "never"
sandbox_mode = "read-only"
web_search = "disabled"

[profiles.ci_guarded]
model = "gpt-5.4"
approval_policy = "never"
sandbox_mode = "read-only"
model_reasoning_effort = "high"
```

调用：

```bash
codex --profile dev_safe
codex exec --profile ci_guarded "..."
```

---

## 16. 你现在应该形成的“配置心智模型”

一句话总结：

1. 认证决定“你是谁”
2. sandbox 决定“技术上能做什么”
3. approval 决定“做之前要不要问你”
4. AGENTS 决定“怎么做才符合团队规范”
5. MCP 决定“还能用哪些外部工具”

理解这 5 层，Codex 基本不会再“玄学失效”。

---

## 参考文档（官方）

- CLI 概览：<https://developers.openai.com/codex/cli>
- CLI 功能：<https://developers.openai.com/codex/cli/features>
- CLI 命令参数：<https://developers.openai.com/codex/cli/reference>
- CLI Slash Commands：<https://developers.openai.com/codex/cli/slash-commands>
- Config Basics：<https://developers.openai.com/codex/config-basic>
- Advanced Config：<https://developers.openai.com/codex/config-advanced>
- Config Reference：<https://developers.openai.com/codex/config-reference>
- Sample Config：<https://developers.openai.com/codex/config-sample>
- Authentication：<https://developers.openai.com/codex/auth>
- AGENTS.md 指南：<https://developers.openai.com/codex/guides/agents-md>
- Agent approvals & security：<https://developers.openai.com/codex/agent-approvals-security>
- Non-interactive：<https://developers.openai.com/codex/noninteractive>
- MCP：<https://developers.openai.com/codex/mcp>
- Rules：<https://developers.openai.com/codex/rules>
- IDE Extension：<https://developers.openai.com/codex/ide>
- IDE Features：<https://developers.openai.com/codex/ide/features>
- Windows：<https://developers.openai.com/codex/windows>
