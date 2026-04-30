---
title: 第四篇：Codex 多来源完整配置手册（小白友好版）
date: 2026-03-08
category: AI工具
tags:
  - Codex
  - Packy
  - 中转站
  - 配置迁移
  - 多线路
description: 对比官方、Packy 与第三方中转等多条 Codex 接入路线，整理成小白友好的完整配置手册，帮助按服务商快速选路并完成迁移。
---

# 第四篇：Codex 多来源完整配置手册（小白友好版）

> 更新时间：2026-03-08  
> 定位：线路选读 A（官方 + Packy + 飞书方案对比与迁移）。  
> 前置：至少先读第三篇、第六篇（避免把“字段问题”误判成“线路问题”）。  
> 使用方式：按自己服务商对应小节阅读，不需要从头到尾通读。  
> 本篇不展开：逐字段截图核对（看第七篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。

章节导航（点击跳转）：

[[toc]]

---

## 阅读策略（去重版）

1. 如果你已经读过第三篇 + 第五篇，本篇 `2~4` 节只需快速过一遍
2. 真正需要细读的是 `5.x`（你所用服务商路线）
3. 三端联动与排障回看第六篇；逐字段截图核对回看第七篇

## 0. 先看这张“路线图”

你现在有 3 条路线可以用 Codex：

1. 官方路线（OpenAI）
2. 聚合网关路线（PackyAPI）
3. 第三方服务路线（飞书文档里的 yunyi / rpcod）

新手建议顺序：

1. 先用官方路线跑通（概念最标准）
2. 再按你购买的服务切到网关路线
3. 最后做 App / IDE / CLI 三端统一配置

---

## 1. 五个来源分别负责什么

1. 飞书 1（`KaQ...`）：偏“售后实操”，给了账号、套餐、模型、CLI 与插件配置
2. PackyAPI 文档：讲如何把 Codex 接到 Packy API（CLI + VS Code）
3. OpenAI `codex/app`：官方 Codex App 功能与使用边界
4. 飞书 2（`Iq8...`）：补了 `yunyi` 路线、激活器、常见错误（如 `YUNYI_KEY`）
5. B 站 `BV11erUBUEEX`：官方教程结构化学习路径（安装、AGENTS、工作流、无头模式、SDK）

---

## 2. 先统一基础环境（所有路线都需要）

这部分与第一篇/第三篇有重叠，这里只保留最小检查清单：

1. `node -v`、`npm -v` 正常（Node LTS/20+）
2. `npm i -g @openai/codex` 安装成功
3. `codex --version` 能输出版本
4. 网络慢再切镜像：`npm config set registry https://registry.npmmirror.com`

---

## 3. 配置文件放哪（这是第一高频坑）

只记三条结论：

1. 用户级：`~/.codex/config.toml`，项目级：`<repo>/.codex/config.toml`
2. Windows 常见路径：`C:\Users\你的用户名\.codex\config.toml`
3. 生效顺序是“命令行 > profile > 项目级 > 用户级 > 系统级 > 默认值”

如果你想看完整解释和排错案例，直接看第三篇第 4 节 + 第五篇第 2 节。

---

## 4. 关键配置项白话解释（先看懂再抄）

为避免和第五篇重复，这里压缩成“路线切换必看 5 字段”：

1. `model`：默认模型名（如 `gpt-5.4`）
2. `model_provider`：使用哪个提供方（如 `openai`/`packycode`/`yunyi`/`codex`）
3. `[model_providers.<id>].base_url`：服务地址
4. 凭据字段：`env_key` 或 `experimental_bearer_token` 或 `auth.json`
5. 安全组合：`approval_policy` + `sandbox_mode`

推荐默认组合：`workspace-write + on-request`。  
完整字段字典请直接查第五篇第 3 节。

---

## 5. 三条路线的可直接用模板

## 5.1 官方路线（OpenAI，推荐先跑通）

```toml
model_provider = "openai"
model = "gpt-5.4"
model_reasoning_effort = "medium"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"
```

逐行解释：

1. `model_provider = "openai"`：走官方 OpenAI 提供方。
2. `model = "gpt-5.4"`：默认模型设为 `gpt-5.4`。
3. `model_reasoning_effort = "medium"`：推理强度中档，速度和质量较平衡。
4. `approval_policy = "on-request"`：敏感动作由你确认后执行。
5. `sandbox_mode = "workspace-write"`：仅允许修改当前项目目录。
6. `web_search = "cached"`：默认使用缓存搜索索引，稳定性更高。

打开 `codex` 后按提示登录 ChatGPT 或 API Key 即可。

---

## 5.2 PackyAPI 路线（来自 packyapi 文档）

```toml
model_provider = "packy"
model = "gpt-5"
model_reasoning_effort = "high"

[model_providers.packy]
name = "packy"
base_url = "https://api.packyapi.com/v1"
env_key = "PACKY_API_KEY"
```

逐行解释：

1. `model_provider = "packy"`：默认走你自定义的 `packy` 提供方。
2. `model = "gpt-5"`：设置默认模型名（最终可用模型以服务商为准）。
3. `model_reasoning_effort = "high"`：提升推理深度，通常更慢。
4. `[model_providers.packy]`：声明一个名为 `packy` 的 provider 配置块。
5. `name = "packy"`：provider 显示名/标识名，保持和上面一致最稳。
6. `base_url = "https://api.packyapi.com/v1"`：Packy API 网关地址。
7. `env_key = "PACKY_API_KEY"`：从环境变量读取密钥，不把 key 写死在配置里。

然后把环境变量写好（PowerShell 示例）：

```powershell
[Environment]::SetEnvironmentVariable("PACKY_API_KEY","你的PackyKey","User")
```

逐行解释：

1. `SetEnvironmentVariable(..., "User")`：把 `PACKY_API_KEY` 写入当前用户级环境变量。
2. `"你的PackyKey"`：替换为真实密钥后，重开终端再运行 `codex` 更稳。

VS Code 插件侧，Packy 文档给的是：

1. Provider 选 OpenAI Compatible  
2. Base URL 填 `https://api.packyapi.com/v1`  
3. API Key 填 Packy 仪表盘里的 Key

---

## 5.3 飞书 yunyi 路线（来自 `Iq8...` 文档）

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
experimental_bearer_token = "这里填卡号或令牌"
requires_openai_auth = true
```

逐行解释：

1. `model_provider = "yunyi"`：默认走 `yunyi` 线路。
2. `model_reasoning_effort = "medium"`：推理强度中档。
3. `disable_response_storage = true`：减少响应落盘，偏隐私场景。
4. `preferred_auth_method = "apikey"`：优先使用 API key 认证方式。
5. `model = "gpt-5.4"`：默认模型名。
6. `[model_providers.yunyi]`：定义 yunyi 提供方细节。
7. `base_url`：yunyi 的网关地址。
8. `experimental_bearer_token`：直接写令牌，方便但安全性低于环境变量。
9. `wire_api = "responses"`：使用 responses 协议。
10. `requires_openai_auth = true`：要求 OpenAI 认证链路兼容。

文档里还给了激活器方式：

```bash
npx yunyi-activator
```

逐行解释：

1. `npx yunyi-activator`：临时下载并运行激活脚本，完成 yunyi 相关初始化。

常见错误（文档原意）：

1. 提示缺少 `YUNYI_KEY`：检查并移除冲突配置
2. 权限报错：尝试 `sudo npx yunyi-activator`（仅 Linux/macOS 场景）

---

## 5.4 飞书 rpcod 路线（来自 `KaQ...` 文档）

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

逐行解释：

1. `model = "gpt-5.3-codex"`：使用 rpcod 文档示例模型。
2. `model_reasoning_effort = "xhigh"`：高强度推理，成本和时延都更高。
3. `sandbox_mode = "danger-full-access"`：取消沙箱隔离，风险最高。
4. `approval_policy = "never"`：不弹审批，自动执行风险动作。
5. `model_provider = "codex"`：默认使用 `codex` provider 块。
6. `[model_providers.codex].base_url = "https://ai.rpcod.com"`：rpcod 后端地址。
7. `wire_api = "responses"`：采用 responses 协议。
8. `requires_openai_auth = true`：要求 OpenAI 认证链路兼容。

并配 `auth.json`：

```json
{
  "OPENAI_API_KEY": "sk-你的密钥"
}
```

逐行解释：

1. `OPENAI_API_KEY`：鉴权密钥字段名。
2. `sk-你的密钥`：替换成真实 key；该文件是敏感信息，禁止提交仓库。

这套权限很高，生产机不建议直接照搬。

---

## 6. Codex App（官方）你要知道的重点

OpenAI `codex/app` 页面可提炼成这些要点：

1. App 支持并行线程、内置 Git diff、Worktree、Automations
2. 模式有 `Local / Worktree / Cloud`
3. 与 IDE 扩展可自动同步上下文与线程
4. App、CLI、IDE 共享 MCP 配置
5. Web search、通知、图片输入、语音输入都可用

关于账号：

1. ChatGPT Plus/Pro/Business/Edu/Enterprise 包含 Codex
2. 用 API Key 登录时，部分能力（如 cloud threads）可能不可用

---

## 7. Windows 专项（官方 + 实操）

官方 `app/windows` 要点：

1. 可通过 Microsoft Store 安装
2. 命令行安装：

```bash
winget install Codex -s msstore
```

逐行解释：

1. `winget install Codex -s msstore`：通过 Microsoft Store 源安装 Codex 桌面端。

3. 集成终端可选 PowerShell / CMD / Git Bash / WSL
4. 默认 Windows-native agent（PowerShell）
5. 可切到 WSL agent，但需要重启 App 才生效

你如果用 Windows-native agent，官方建议优先把项目放 Windows 文件系统，稳定性更高。

---

## 8. Worktree / Local Environments / Automations（官方核心）

## 8.1 Worktree

1. 只在 Git 仓库有效
2. 可以并行跑多个任务而不互相污染
3. 支持 Local 和 Worktree 之间 handoff

## 8.2 Local Environments

作用：给 Worktree 自动执行初始化脚本，比如：

```bash
npm install
npm run build
```

逐行解释：

1. `npm install`：安装当前 worktree 依赖。
2. `npm run build`：验证项目是否可正常构建，提前暴露环境问题。

还能定义常用动作（Run/Test/Lint）作为快捷按钮。

## 8.3 Automations

1. 自动任务在本地运行（App 必须开着）
2. Git 仓库会在后台 worktree 跑，减少干扰
3. 上线前先手动试跑 prompt
4. 高频调度会产生大量 worktree，要定期清理归档

安全建议：

1. 不要直接用 full access 跑无人值守自动化
2. 用 `workspace-write` + rules 白名单更稳

---

## 9. App 内高频命令（官方 commands 页）

常见 slash commands：

- `/status`：看线程 ID、上下文、限额
- `/review`：进入审查模式
- `/mcp`：看 MCP 服务状态
- `/plan-mode`：启用计划模式
- `/feedback`：反馈问题并附日志

---

## 10. 飞书来源里最有价值的“真实坑位”

## 10.1 模型不显示 / 不能选

飞书文档明确提到：有些新模型不会立刻在 UI 下拉里出现，需要手动改 `config.toml`。

## 10.2 `stream disconnected before completion`

属于常见网络链路类错误，优先检查：

1. `base_url` 是否填错
2. 所用节点是否可达
3. key 是否可用且没过期

## 10.3 插件激活失败

优先按顺序排查：

1. Node/npm 是否正确安装
2. CLI 是否已能 `codex --version`
3. 插件 provider/base_url/key 三项是否一致

---

## 11. 一套稳妥的“新手默认配置”

如果你不想冒险，先用这套：

```toml
model = "gpt-5.4"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
model_reasoning_effort = "medium"
web_search = "cached"
```

逐行解释：

1. `model = "gpt-5.4"`：默认模型使用 `gpt-5.4`。
2. `approval_policy = "on-request"`：敏感动作需你确认。
3. `sandbox_mode = "workspace-write"`：只允许改当前项目目录。
4. `model_reasoning_effort = "medium"`：推理深度适中。
5. `web_search = "cached"`：默认走缓存搜索，稳定优先。

等稳定后，再逐步调高自动化程度。

---

## 12. 学习路径（按 B 站官方教程节奏）

`BV11erUBUEEX` 视频简介对应的学习顺序很合理：

1. 安装 CLI + IDE 扩展
2. 在真实仓库完成首次运行
3. 写 AGENTS.md 规范
4. 配置环境（权限、沙箱、模型）
5. 提示词模式化（计划 -> 执行 -> 验收）
6. 进阶到无头模式与 SDK

建议你每学完一节就做一个可验证动作，而不是只看视频。

---

## 13. 最后给你一份“30 分钟自检清单”

1. `node -v` / `npm -v` 正常
2. `codex --version` 正常
3. `config.toml` 路径与 provider 正确
4. key 可用（环境变量或 auth 文件）
5. `codex` 能开新会话并读写当前仓库
6. 插件能正常发起请求
7. `/status` 可看到当前会话信息
8. 出错时先看 provider/base_url/key，再看权限与沙箱

---

## 参考来源（本篇全部使用）

1. 飞书：Codex 使用大全  
   <https://ncnnujysujcj.feishu.cn/wiki/KaQZwRaE6ivzlOku5rwcRdTHnPf>
2. PackyAPI：Codex 配置文档  
   <https://docs.packyapi.com/docs/cli/3-codex.html>
3. OpenAI 官方：Codex App  
   <https://developers.openai.com/codex/app>
4. 飞书：Codex CLI/VSCode 插件版教程  
   <https://dcnp82fx8qqw.feishu.cn/wiki/Iq8KwRLF7i9pg4kN83HckdOVnUc>
5. Bilibili：Codex 入门指南（BV11erUBUEEX）  
   <https://www.bilibili.com/video/BV11erUBUEEX>
