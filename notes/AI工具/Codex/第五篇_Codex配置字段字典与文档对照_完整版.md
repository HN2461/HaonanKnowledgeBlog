---
title: 第五篇：Codex 配置字段字典与文档对照（完整版）
date: 2026-03-08
category: AI工具
tags:
  - Codex
  - config.toml
  - auth.json
  - 配置字段
  - 字典
description: 逐项整理 Codex 配置字段的含义、作用、默认行为与官方文档分工，适合作为长期使用中的 config.toml 与 auth.json 查询手册。
---

# 第五篇：Codex 配置字段字典与文档对照（完整版）

> 更新时间：2026-03-08  
> 定位：主线 02（字段查询手册 + 场景模板）。  
> 前置：第三篇（看完配置层级再看字段会更顺）。  
> 下一篇建议：第六篇（三端联动实战）。  
> 本篇不展开：安装、账号购买、截图点位（看第一篇/第七篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。

章节导航（点击跳转）：

[[toc]]

---

## 1. 先把文档分工讲透（你该去哪看什么）

## 1.1 官方文档分工

1. `config-basic`：配置文件在哪、优先级怎么覆盖  
2. `config-reference`：字段字典（每个字段是什么意思）  
3. `config-sample`：整份样例，可直接改成自己的  
4. `auth`：登录方式、`auth.json`、凭据存储策略  
5. `agent-approvals-security`：审批与沙箱的安全边界  
6. `rules`：允许/提示/禁止某类命令  
7. `noninteractive`：`codex exec` 自动化跑批  
8. `app/*`：桌面端（模式、worktree、automations、windows）

## 1.2 你给的第三方文档分工

1. PackyAPI：告诉你 `packycode` provider 怎么接、包月与普通地址差异  
2. 飞书 `KaQ...`：偏 rpcod 方案、套餐和模型切换经验  
3. 飞书 `Iq8...`：偏 yunyi 方案、激活器、常见错误  
4. B 站 `BV11erUBUEEX`：官方学习路径（从安装到 SDK）

---

## 2. 配置优先级（改了不生效先看这里）

官方优先级（高 -> 低）：

1. CLI flags / `--config`
2. `--profile <name>`
3. 项目 `.codex/config.toml`（从项目根到当前目录，越近越优先）
4. 用户 `~/.codex/config.toml`
5. 系统 `/etc/codex/config.toml`（Unix）
6. 内置默认值

补充：

1. 项目被标成 `untrusted` 时，项目层 `.codex/` 会被跳过  
2. 所以“改了用户配置没效果”往往是被项目层覆盖；反过来也常见

---

## 3. 字段字典（小白必改 + 进阶可改）

下面按“你最常改”的顺序来。

## 3.1 模型与提供方

### `model`

作用：默认模型名。  
示例：`gpt-5.4`、`gpt-5.3-codex`。

### `model_provider`

作用：选择后端 provider（默认 `openai`）。  
示例：`openai`、`packycode`、`yunyi`、`codex`（第三方文档命名）。

### `[model_providers.<id>]`

常见字段：

1. `base_url`：接口地址
2. `env_key`：从环境变量读取 key（推荐）
3. `experimental_bearer_token`：直接写 token（不推荐长期用）
4. `wire_api = "responses"`：协议（当前主用）
5. `requires_openai_auth`：某些 provider 需要

---

## 3.2 推理与输出风格

### `model_reasoning_effort`

可选：`minimal | low | medium | high | xhigh`  
解释：越高越“深思考”，通常更慢、更贵。

### `plan_mode_reasoning_effort`

作用：仅覆盖 Plan 模式的推理强度。  
可选：`none | minimal | low | medium | high | xhigh`

### `model_reasoning_summary`

可选：`auto | concise | detailed | none`  
作用：控制推理摘要详细度。

### `model_verbosity`

可选：`low | medium | high`  
作用：控制回复展开程度。

---

## 3.3 审批与沙箱（安全核心）

### `approval_policy`

可选：

1. `untrusted`
2. `on-request`
3. `never`
4. `approval_policy = { reject = { ... } }`（细粒度拒绝）

拒绝子项：

1. `approval_policy.reject.sandbox_approval`
2. `approval_policy.reject.rules`
3. `approval_policy.reject.mcp_elicitations`

### `sandbox_mode`

可选：

1. `read-only`
2. `workspace-write`
3. `danger-full-access`

### `[sandbox_workspace_write]`

仅在 `workspace-write` 生效：

1. `network_access = true/false`
2. `writable_roots = []`
3. `exclude_tmpdir_env_var = false/true`
4. `exclude_slash_tmp = false/true`

### `allow_login_shell`

作用：是否允许 shell 工具使用 login shell 语义（默认 true）。

---

## 3.4 搜索与工具

### `web_search`

可选：`disabled | cached | live`

1. `cached`：默认，走 OpenAI 维护的索引缓存
2. `live`：实时抓网
3. `disabled`：关闭搜索

兼容项（老配置，不推荐）：

1. `features.web_search`
2. `features.web_search_cached`
3. `features.web_search_request`
4. `tools.web_search`（legacy）

### `tools.view_image`

作用：本地图片查看工具开关。

---

## 3.5 身份认证

### `cli_auth_credentials_store`

可选：`file | keyring | auto`

1. `file`：保存在 `~/.codex/auth.json`
2. `keyring`：系统凭据库
3. `auto`：优先系统凭据库，不行再回退 `auth.json`

### `forced_login_method`

可选：`chatgpt | api`  
作用：强制登录方式。

### `forced_chatgpt_workspace_id`

作用：限制 ChatGPT 登录到指定 workspace。

---

## 3.6 项目文档与工作区信任

### `project_doc_max_bytes`

作用：读取 `AGENTS.md` 的最大字节数（常见默认 32768）。

### `project_doc_fallback_filenames`

作用：当 `AGENTS.md` 不存在时，额外尝试的文件名列表。

### `projects.<path>.trust_level`

可选：`trusted | untrusted`  
作用：项目信任级别；`untrusted` 会跳过项目 `.codex/` 层。

---

## 3.7 历史与体验

### `[history]`

1. `history.persistence = "save-all" | "none"`
2. `history.max_bytes = <number>`

### `file_opener`

可选：`vscode | vscode-insiders | windsurf | cursor | none`  
作用：引用路径点击后用哪个编辑器打开。

### `[windows]`

1. `sandbox = "unelevated" | "elevated"`（Windows 原生沙箱模式）
2. `windows_wsl_setup_acknowledged = true/false`（Windows onboarding 记录）

---

## 3.8 MCP（重点）

### 顶层

1. `mcp_oauth_credentials_store = "auto" | "file" | "keyring"`

### 服务级（`[mcp_servers.<id>]`）

1. `enabled = true/false`
2. `required = true/false`（启不来就失败退出）
3. `command` + `args`（stdio）
4. `url`（HTTP MCP）
5. `env` / `env_vars`
6. `bearer_token_env_var`
7. `startup_timeout_sec`（默认 10s）
8. `tool_timeout_sec`（默认 60s）
9. `enabled_tools` / `disabled_tools`
10. `scopes` / `oauth_resource`

---

## 3.9 Profiles（推荐一定要用）

`[profiles.<name>]` 可以覆盖几乎所有关键字段，比如：

1. `model`
2. `approval_policy`
3. `sandbox_mode`
4. `model_reasoning_effort`
5. `plan_mode_reasoning_effort`
6. `service_tier`
7. `web_search`
8. `windows.sandbox`
9. `personality`（`none | friendly | pragmatic`）

---

## 4. 六套可复制模板（按场景）

## 4.1 官方安全开发模板（推荐默认）

```toml
model_provider = "openai"
model = "gpt-5.4"
model_reasoning_effort = "medium"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

[history]
persistence = "save-all"
```

## 4.2 官方 CI 只读模板

```toml
model_provider = "openai"
approval_policy = "never"
sandbox_mode = "read-only"
web_search = "disabled"
```

## 4.3 PackyAPI 普通用户模板（来自 packy 文档）

```toml
disable_response_storage = true
model = "gpt-5.2"
model_provider = "packycode"
model_reasoning_effort = "xhigh"
model_verbosity = "high"

[features]
web_search_request = true

[model_providers.packycode]
base_url = "https://www.packyapi.com/v1"
name = "packycode"
requires_openai_auth = true
wire_api = "responses"
```

`auth.json`：

```json
{
  "OPENAI_API_KEY": "你的Key"
}
```

## 4.4 PackyAPI 包月用户差异

仅替换 `base_url`：

```toml
base_url = "https://codex-api.packycode.com/v1"
```

## 4.5 飞书 yunyi 模板（来自 `Iq8...`）

```toml
model_provider = "yunyi"
model_reasoning_effort = "medium"
disable_response_storage = true
preferred_auth_method = "apikey"
model = "gpt-5.4"

[model_providers.yunyi]
name = "yunyi"
base_url = "https://yunyi.rdzhvip.com/codex"
wire_api = "responses"
experimental_bearer_token = "卡号或令牌"
requires_openai_auth = true
```

## 4.6 飞书 rpcod 模板（来自 `KaQ...`）

```toml
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"
disable_response_storage = true
sandbox_mode = "danger-full-access"
approval_policy = "never"
model_provider = "codex"
web_search = "cached"

[model_providers.codex]
name = "codex"
base_url = "https://ai.rpcod.com"
wire_api = "responses"
requires_openai_auth = true
```

---

## 5. 命令模式对照（你该用哪个）

## 5.1 CLI 交互模式

```bash
codex
```

适合：边聊边改、人工确认。

## 5.2 非交互自动化

```bash
codex exec "summarize the repo structure"
codex exec --json "summarize the repo structure" | jq
codex exec "Extract project metadata" --output-schema ./schema.json -o ./output.json
codex exec resume --last "continue"
```

安全提醒：

1. `codex exec` 默认只读沙箱
2. 提权前先确认环境隔离（尤其 CI）
3. 非 Git 目录可用 `--skip-git-repo-check`，但要慎用

---

## 6. App 端你需要知道的关键行为

## 6.1 模式

1. `Local`：直接改当前目录
2. `Worktree`：隔离改动
3. `Cloud`：远端环境运行

## 6.2 自动化

1. 任务在本地 App 中执行（App 必须开着）
2. Git 项目默认跑在后台 worktree
3. 先手动试 prompt，再上 schedule
4. 高频任务要清理旧 worktree

## 6.3 Windows

1. Store 安装或 `winget install Codex -s msstore`
2. 默认 Windows-native agent（PowerShell）
3. 可切 WSL agent，切换后需重启 App

---

## 7. 审批/沙箱组合建议（直接抄）

1. 新手开发：`workspace-write + on-request`
2. 代码审计：`read-only + never`
3. 受控自动化：`read-only + never` 或 `workspace-write + on-request`
4. 超高风险（隔离环境才可）：`--dangerously-bypass-approvals-and-sandbox`

官方说明：

1. `--full-auto` 等价 `--sandbox workspace-write --ask-for-approval on-request`
2. `--yolo` 是危险别名，不建议日常环境使用

---

## 8. Rules：把“审批”做成可维护策略

最小示例：

```starlark
prefix_rule(
  pattern = ["gh", "pr", "view"],
  decision = "prompt",
  justification = "查看 PR 前确认参数",
  match = ["gh pr view 7888"],
  not_match = ["gh pr --repo openai/codex view 7888"],
)
```

`decision` 含义：

1. `allow`
2. `prompt`
3. `forbidden`

规则测试：

```bash
codex execpolicy check --pretty \
  --rules ~/.codex/rules/default.rules \
  -- gh pr view 7888 --json title,body,comments
```

---

## 9. 高概率问题与“最快排错顺序”

1. `codex --version` 是否正常
2. `model_provider` 与 `[model_providers.<id>]` 名字是否一致
3. `base_url` 是否用了正确线路（例如 packy 包月地址）
4. key 是否放在正确位置（环境变量或 `auth.json`）
5. 是否被 profile 或项目层 `.codex/config.toml` 覆盖
6. 项目是否是 `untrusted` 导致项目配置没加载
7. MCP 服务是否因 `required=true` 启动失败
8. 权限失败时先看 `approval_policy` + `sandbox_mode` 组合

---

## 10. 最后一句话（给小白）

配置 Codex 的本质不是“记命令”，而是先做三件事：

1. 选 provider（你连哪个后端）
2. 设权限边界（审批 + 沙箱）
3. 把常用场景写成 profiles

做到这三点，后面不管你换官方、Packy、yunyi 还是 rpcod，都只是改几行配置。

---

## 参考来源（本篇）

### 官方

1. <https://developers.openai.com/codex/config-basic>
2. <https://developers.openai.com/codex/config-reference>
3. <https://developers.openai.com/codex/config-sample>
4. <https://developers.openai.com/codex/auth>
5. <https://developers.openai.com/codex/agent-approvals-security>
6. <https://developers.openai.com/codex/rules>
7. <https://developers.openai.com/codex/noninteractive>
8. <https://developers.openai.com/codex/app>
9. <https://developers.openai.com/codex/app/features>
10. <https://developers.openai.com/codex/app/windows>
11. <https://developers.openai.com/codex/app/worktrees>
12. <https://developers.openai.com/codex/app/local-environments>
13. <https://developers.openai.com/codex/app/automations>
14. <https://developers.openai.com/codex/app/commands>
15. <https://developers.openai.com/codex/cli/slash-commands>

### 第三方与社区

1. <https://docs.packyapi.com/docs/cli/3-codex.html>
2. <https://docs.packyapi.com/docs/cli/>
3. <https://ncnnujysujcj.feishu.cn/wiki/KaQZwRaE6ivzlOku5rwcRdTHnPf>
4. <https://dcnp82fx8qqw.feishu.cn/wiki/Iq8KwRLF7i9pg4kN83HckdOVnUc>
5. <https://www.bilibili.com/video/BV11erUBUEEX>
