---
title: 第七篇：Codex 三端逐字段截图对照版（每一步可复现）
date: 2026-03-08
category: AI工具
tags:
  - Codex
  - 截图对照
  - CLI
  - 插件
  - App
description: 按统一结构逐字段对照 Codex CLI、插件和 App 的界面与配置点位，适合作为团队核对 SOP 或手把手复现配置过程的操作手册。
---

# 第七篇：Codex 三端逐字段截图对照版（每一步可复现）

> 更新时间：2026-03-08  
> 定位：主线 04（截图核对与SOP落地）。  
> 前置：第六篇（先懂三端关系，再对照截图效率最高）。  
> 下一篇建议：第二篇（进阶能力与长期治理）。  
> 本篇不展开：字段原理深讲（看第三篇、第五篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。

章节导航（点击跳转）：

[[toc]]

---

## 0. 这篇怎么用（别跳过）

这篇不是“看懂概念”版，而是“照抄也能成功”版。  
每个字段我都按同一结构写：

1. 字段作用
2. CLI 怎么改
3. 插件在哪看
4. App 在哪看
5. 怎么验证
6. 常见报错
7. 截图点位

---

## 1. 先准备三份基础文件

## 1.1 用户配置文件

- Windows：`C:\Users\你的用户名\.codex\config.toml`
- macOS/Linux：`~/.codex/config.toml`

## 1.2 认证文件

- `~/.codex/auth.json`

```json
{
  "OPENAI_API_KEY": "你的Key"
}
```

## 1.3 项目规则文件

- `<项目根目录>/AGENTS.md`

---

## 2. 字段 01：`model`（模型名）

## 2.1 作用

设置默认模型，例如：`gpt-5.4`、`gpt-5.3-codex`。

## 2.2 CLI 怎么改

`config.toml`：

```toml
model = "gpt-5.4"
```

临时覆盖：

```bash
codex --model gpt-5.4
```

## 2.3 插件在哪看

插件本身一般不单独存 `model`，它走 CLI 共享配置。  
你在 VS Code/Cursor 里改完 `~/.codex/config.toml` 即可生效。

## 2.4 App 在哪看

App 也读取同一份配置；线程里可用命令面板/状态查看当前模型。

## 2.5 验证

1. CLI：输入 `/status`，看 active model
2. 插件：发一条消息后看状态信息是否显示目标模型
3. App：线程状态里看 model

## 2.6 常见错

1. 改了用户配置但项目 `.codex/config.toml` 覆盖了它
2. `model_provider` 对不上，导致模型名无效

## 2.7 截图点位

1. `config.toml` 中 `model` 行
2. 三端各自的状态页/`/status` 结果

---

## 3. 字段 02：`model_provider` + `[model_providers.<id>]`

## 3.1 作用

指定后端服务与接口地址。

## 3.2 CLI 怎么改

```toml
model_provider = "openai"

[model_providers.openai]
base_url = "https://api.openai.com/v1"
wire_api = "responses"
```

第三方示例（Packy）：

```toml
model_provider = "packycode"

[model_providers.packycode]
base_url = "https://www.packyapi.com/v1"
name = "packycode"
requires_openai_auth = true
wire_api = "responses"
```

## 3.3 插件在哪看

插件走共享配置；如果插件里有 Provider/Base URL 输入框，务必与 `config.toml` 保持一致。

## 3.4 App 在哪看

App 设置里的 Agent 配置/MCP 与共享配置关联，但 provider 仍以 `config.toml` 为准。

## 3.5 验证

1. `codex /status` 看 provider
2. 发起一次请求，确认不再报 401/404/provider not found

## 3.6 常见错

1. `model_provider = "packy"`，但 `[model_providers.packycode]`（名字不一致）
2. 包月用户用了普通 `base_url`

## 3.7 截图点位

1. `model_provider` 行
2. `[model_providers.<id>]` 配置块
3. 运行后状态页 provider 字段

---

## 4. 字段 03：`approval_policy`（审批策略）

## 4.1 作用

控制 Codex 执行命令前是否询问你。

## 4.2 CLI 怎么改

```toml
approval_policy = "on-request"
```

可选常见值：`untrusted | on-request | never`

会话内临时切换：

- `/permissions`

## 4.3 插件在哪看

插件不单独维护审批策略，读共享配置。

## 4.4 App 在哪看

App 设置 -> Agent configuration（审批与沙箱相关设置）

## 4.5 验证

让 Codex 执行一个会触发审批的命令（如写文件/运行命令）观察是否弹确认。

## 4.6 常见错

1. 你以为是 `never`，但实际上被 profile 覆盖回 `on-request`
2. 自动化任务默认无人值守，风险判断错误

## 4.7 截图点位

1. 配置文件 `approval_policy`
2. 审批弹窗（有/无）
3. `/status` 中 policy

---

## 5. 字段 04：`sandbox_mode`（沙箱范围）

## 5.1 作用

控制可读写范围和安全边界。

常见值：

1. `read-only`
2. `workspace-write`
3. `danger-full-access`

## 5.2 CLI 怎么改

```toml
sandbox_mode = "workspace-write"
```

临时覆盖：

```bash
codex --sandbox workspace-write
```

## 5.3 插件在哪看

共享配置生效；Windows 下插件还有 `chatgpt.runCodexInWindowsSubsystemForLinux` 可影响执行环境。

## 5.4 App 在哪看

App 设置 -> Agent configuration（沙箱相关）

## 5.5 验证

1. 在工作区内写文件成功
2. 在工作区外写文件被拦截（`workspace-write` 下）

## 5.6 常见错

1. 为了省事直接上 `danger-full-access + never`
2. 自动化任务跑在高权限模式，风险极高

## 5.7 截图点位

1. `sandbox_mode` 行
2. 被拦截提示
3. App Agent 配置页

---

## 6. 字段 05：`web_search`

## 6.1 作用

控制联网搜索行为。

常见值：`disabled | cached | live`

## 6.2 CLI 怎么改

```toml
web_search = "cached"
```

临时 live：

```bash
codex --search
```

## 6.3 插件/App 在哪看

都读共享配置；全量行为以 `config.toml` 为准。

## 6.4 验证

1. 让 Codex 搜索“今天的某个新闻”
2. 观察结果是否来自缓存或实时

## 6.5 常见错

把旧字段 `features.web_search_request` 和新字段 `web_search` 混用，导致理解偏差。

## 6.6 截图点位

1. `web_search` 配置行
2. 搜索结果输出片段

---

## 7. 字段 06：`[profiles.<name>]`（场景配置）

## 7.1 作用

用一组预设快速切换场景（开发/审计/自动化）。

## 7.2 CLI 怎么改

```toml
[profiles.dev_safe]
model = "gpt-5.4"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"
```

调用：

```bash
codex --profile dev_safe
```

## 7.3 插件/App 在哪看

两端都受 profile 影响（如果启动参数或上层策略应用了 profile）。

## 7.4 验证

`/status` 看生效后的 model/policy/sandbox 是否按 profile 切换。

## 7.5 常见错

以为改了根配置就会生效，但其实一直在跑某个 profile。

## 7.6 截图点位

1. `profiles` 段
2. 启动命令 `--profile`
3. `/status` 对照

---

## 8. 字段 07：`mcp_servers`（外部工具）

## 8.1 作用

接入外部工具（数据库、浏览器、知识库、内部系统）。

## 8.2 CLI 怎么改

示例（stdio）：

```toml
[mcp_servers.my_tool]
enabled = true
command = "npx"
args = ["-y", "my-mcp-server"]
startup_timeout_sec = 10
tool_timeout_sec = 60
```

也可用命令：

```bash
codex mcp list
codex mcp add my_tool -- npx -y my-mcp-server
```

## 8.3 插件/App 在哪看

1. 插件可用 `/mcp` 看状态
2. App 设置有 Integrations & MCP 面板

## 8.4 验证

1. `codex mcp list`
2. 会话内 `/mcp` 能看到服务在线和工具列表

## 8.5 常见错

1. `required = true` 时服务起不来，直接导致任务失败
2. 超时太短，工具偶发不可用

## 8.6 截图点位

1. MCP 配置块
2. `codex mcp list` 输出
3. `/mcp` 状态面板

---

## 9. 插件专属字段（只在 IDE 里改）

以下是官方 IDE 设置文档给出的重点项：

1. `chatgpt.cliExecutable`
2. `chatgpt.commentCodeLensEnabled`
3. `chatgpt.localeOverride`
4. `chatgpt.openOnStartup`
5. `chatgpt.runCodexInWindowsSubsystemForLinux`

操作入口：

1. VS Code -> Settings
2. 搜索 `Codex` 或字段名
3. 改值后重载窗口

验证：

1. 打开命令面板执行 Codex 命令
2. 看侧边栏、CodeLens、语言、WSL 行为是否符合预期

截图点位：

1. Settings 搜索结果页
2. 改值前后对比

---

## 10. App 专属设置（只在桌面端改）

官方设置页重点：

1. General（输出、打开方式、防休眠）
2. Appearance（主题与字体）
3. Notifications（通知策略）
4. Git（分支/提交/PR）
5. Integrations & MCP（工具接入）
6. Personalization（Friendly/Pragmatic/None）

验证：

1. 线程执行完成是否按通知策略提醒
2. `Prevent sleep while running` 打开后长任务不中断
3. MCP 面板能看到已接入工具

截图点位：

1. App Settings 总页
2. 每个分组页

---

## 11. 一份可直接照抄的“统一三端模板”

```toml
model_provider = "openai"
model = "gpt-5.4"
model_reasoning_effort = "medium"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"
file_opener = "vscode"

[history]
persistence = "save-all"

[profiles.audit]
model = "gpt-5.4"
approval_policy = "never"
sandbox_mode = "read-only"
web_search = "disabled"
```

用法：

1. 日常开发：默认配置
2. 审计模式：`codex --profile audit`

---

## 12. 排障顺序（严格按顺序）

1. `codex --version`
2. `codex login status`
3. `model_provider` 与 `[model_providers.<id>]` 名称一致性
4. `base_url` 线路是否正确
5. `auth.json` 或环境变量 key 是否正确
6. `--profile` / 项目 `.codex/config.toml` 是否覆盖
7. `/status` 与 `/debug-config` 看实际生效值
8. 插件/App 是否读取同一个 `CODEX_HOME`
9. MCP 服务是否启动成功（尤其 `required=true`）
10. Windows 场景是否需要切到 WSL 并重启

---

## 13. 本篇“截图对照”建议命名（直接落地）

建议保存路径（仓库内真实目录）：`public/notes/images/codex/`  
文章里引用图片时写（发布到 GitHub Pages 可直接访问）：`notes/images/codex/<文件名>.png`  
建议命名：

1. `codex-07-01-config-model.png`
2. `codex-07-02-status-model.png`
3. `codex-07-03-provider-block.png`
4. `codex-07-04-approval-popup.png`
5. `codex-07-05-sandbox-blocked.png`
6. `codex-07-06-vscode-settings-codex.png`
7. `codex-07-07-app-settings-general.png`
8. `codex-07-08-app-settings-mcp.png`
9. `codex-07-09-mcp-list-cli.png`
10. `codex-07-10-debug-config.png`

可直接复制的 Markdown 示例：

```md
![CLI 模型配置](notes/images/codex/codex-07-01-config-model.png)
![MCP 列表](notes/images/codex/codex-07-09-mcp-list-cli.png)
```

避免 404 的三条规则：

1. 不要写本机绝对路径（如 `C:\Users\...`）
2. 不要写以 `/` 开头的根路径（如 `/notes/images/...`，在 GitHub Pages 子路径下会失效）
3. 不要假设 `./xxx.png` 会自动按笔记同目录解析

---

## 参考来源（本篇使用）

### OpenAI 官方

1. <https://developers.openai.com/codex/cli/reference>
2. <https://developers.openai.com/codex/cli/features>
3. <https://developers.openai.com/codex/cli/slash-commands>
4. <https://developers.openai.com/codex/ide/settings>
5. <https://developers.openai.com/codex/ide/commands>
6. <https://developers.openai.com/codex/ide/slash-commands>
7. <https://developers.openai.com/codex/app/settings>
8. <https://developers.openai.com/codex/app/features>
9. <https://developers.openai.com/codex/app/commands>
10. <https://developers.openai.com/codex/app/worktrees>
11. <https://developers.openai.com/codex/app/local-environments>
12. <https://developers.openai.com/codex/app/automations>
13. <https://developers.openai.com/codex/app/windows>
14. <https://developers.openai.com/codex/config-basic>
15. <https://developers.openai.com/codex/config-reference>

### 第三方/社区

1. <https://docs.packyapi.com/docs/cli/3-codex.html>
2. <https://ncnnujysujcj.feishu.cn/wiki/KaQZwRaE6ivzlOku5rwcRdTHnPf>
3. <https://dcnp82fx8qqw.feishu.cn/wiki/Iq8KwRLF7i9pg4kN83HckdOVnUc>
4. <https://www.bilibili.com/video/BV11erUBUEEX>
