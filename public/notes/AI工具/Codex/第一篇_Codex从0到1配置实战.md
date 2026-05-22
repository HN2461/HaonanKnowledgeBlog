---
title: 第一篇：Codex 从 0 到 1 配置实战（CLI）
date: 2026-03-08
category: AI工具
tags:
  - Codex
  - CLI
  - 配置实战
  - 中转站
  - API Key
description: 以 rpcod 路线为例，记录 Codex CLI 从账号、套餐、API Key 到首轮配置落地的完整打通流程，适合第一次接触第三方线路时快速跑通。
---

# 第一篇：Codex 从 0 到 1 配置实战（CLI）

> 参考文档：<https://ncnnujysujcj.feishu.cn/wiki/KaQZwRaE6ivzlOku5rwcRdTHnPf>  
> 记录时间：2026-03-08  
> 定位：线路选读 B（`rpcod` 路线的 CLI 快速打通）。  
> 前置：建议先读第三篇第 1~4 节（先懂通用配置层级）。  
> 使用方式：如果你不用 `rpcod`，这篇可跳过，改看第四篇对应线路。  
> 本篇不展开：三端联动与截图对照（看第六篇、第七篇）。
> 命令/配置看不懂时：回查第八篇《命令与配置文件作用全解》。
> 小白读完目标：你应该能按第三方 `rpcod` 路线把 Codex CLI 跑通，并知道这篇属于“线路样例”，不是官方通用默认配置模板。
> `2026-05-22` 校注：这篇属于第三方线路实操篇，不再把文中的模型名视作“官方默认答案”。真正落地前，请先核对 `rpcod` 后台当前开放模型，以及第三篇、第十一篇里的最新官方口径。

章节导航（点击跳转）：

[[toc]]

---

## 1. 先完成账号与套餐

1. 注册地址：<https://ai.rpcod.com/login>（这个是个人推荐的中转站，国内访问稳定，且套餐价格更友好）
2. 登录后进入侧边栏「兑换」，输入兑换码
3. 套餐规则（文档里的重点）：
   - 套餐额度按日刷新
   - 天卡是 24 小时有效
   - 同套餐叠加是续期（例如两张 100 刀天卡可连续用 2 天）
   - 不同套餐可做增量，按分组切换使用

## 2. 安装环境（Windows / Mac / Linux 通用主线）

### 2.1 安装 Node.js（20+）

下载：<https://nodejs.org/en/download>  
安装后验证：

```bash
node -v
```

逐行解释：

1. `node -v`：打印本机 Node 版本，确认是否达到 Codex CLI 运行要求（建议 20+）。

### 2.2 安装 Codex CLI

```bash
npm i -g @openai/codex
codex --version
```

逐行解释：

1. `npm i -g @openai/codex`：全局安装 Codex CLI，可在任意目录直接运行 `codex` 命令。
2. `codex --version`：校验安装是否成功，同时确认你当前使用的 CLI 版本。

如果安装很慢或失败（网络原因常见），先切镜像再重装：

```bash
npm config set registry https://registry.npmmirror.com
npm i -g @openai/codex
```

逐行解释：

1. `npm config set registry https://registry.npmmirror.com`：把 npm 下载源切到国内镜像，减少超时和下载失败。
2. `npm i -g @openai/codex`：在新镜像源下重新安装 Codex CLI。

### 2.3 Windows 额外建议

文档建议 Windows 用户优先用 `Windows Terminal`，比原生 `cmd` 体验更稳定。

## 3. 手动配置（最关键）

配置文件路径：

- Mac/Linux：`~/.codex/config.toml`
- Windows：`C:\Users\你的用户名\.codex\config.toml`

如果全局配置不生效，可在当前项目目录新建 `.codex/config.toml` 做工作区覆盖。  
`auth.json` 属于敏感凭据缓存，除非你非常清楚风险，否则不要把它作为项目内常规文件来管理。

### 3.1 `config.toml` 示例（按当前更稳妥写法重整）

```toml
# 先填 rpcod 后台当前实际开放的模型；若已开放 gpt-5.5，优先用它
model = "gpt-5.5"
model_reasoning_effort = "xhigh"
disable_response_storage = true
sandbox_mode = "workspace-write"
approval_policy = "on-request"
file_opener = "vscode"
model_provider = "codex"
web_search = "cached"

[history]
persistence = "save-all"

[model_providers.codex]
name = "codex"
base_url = "https://ai.rpcod.com"
wire_api = "responses"
requires_openai_auth = true
```

关键字段逐项解释（这段改成更适合今天直接上手的安全版）：

1. `model`：默认模型名，优先填你这条 `rpcod` 线路后台当前真实开放的模型；如果后台已开放 `gpt-5.5`，优先用它。
2. `model_reasoning_effort`：推理强度，`xhigh` 更深但通常更慢。
3. `disable_response_storage = true`：减少响应持久化，偏隐私/审慎场景。
4. `sandbox_mode = "workspace-write"`：只允许修改当前工作区，先保证安全边界。
5. `approval_policy = "on-request"`：敏感动作先询问你，适合刚接好线路时排错。
6. `file_opener = "vscode"`：引用文件时默认用 VS Code 打开。
7. `model_provider = "codex"`：默认走 `codex` 这个 provider 配置块。
8. `[history] persistence = "save-all"`：保存会话历史，便于后续 `resume`。
9. `[model_providers.codex].base_url`：该 provider 的后端地址。
10. `wire_api = "responses"`：使用 responses 协议与后端通信。
11. `requires_openai_auth = true`：要求 OpenAI 认证链路（配合 `auth.json` 或登录态）。

补一句最重要的边界：

1. 如果 `rpcod` 后台暂时没放出 `gpt-5.5`，不要硬填，直接以后台当前可见模型名为准
2. 第三方线路的“最新”永远是“官方最新能力 + 你这条网关当前开放集合”的交集

### 3.2 `auth.json` 示例（仅用户目录，不建议放项目目录）

```json
{
  "OPENAI_API_KEY": "sk-这里填你后台生成的密钥"
}
```

逐行解释：

1. `OPENAI_API_KEY`：Codex 调用后端时使用的密钥字段。
2. `sk-...`：真实密钥值，必须有效且未过期；这是敏感信息，不要提交到 Git。

## 4. 首次启动验证

```bash
codex
```

逐行解释：

1. `codex`：启动交互式会话，加载当前目录上下文和你的配置文件。

建议按这个顺序检查：

1. `codex --version` 能输出版本
2. 启动后无鉴权报错
3. 可在当前仓库正常提问与改代码

## 5. 常见问题速查

1. 安装失败：先切 `npmmirror`，再执行安装
2. 模型显示不全：手动检查 `config.toml` 的 `model` 与 `model_provider`
3. 改了配置不生效：确认路径是否正确，并重启终端 / Codex
4. KEY 报错：确认登录缓存或 API key 配置有效，且没有多余空格

## 6. 实操结论（第一篇）

1. 真正影响成败的是三件事：`Node 20+`、`config.toml`、有效认证
2. 网络环境不稳定时，先切镜像，能省大量排错时间
3. 配置不生效时，优先用项目内 `.codex/` 覆盖，定位最快

## 7. 安全提醒

文档里的示例是高权限配置（`danger-full-access` + `never`）。  
个人日常开发建议先用更稳妥组合：

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

逐行解释：

1. `sandbox_mode = "workspace-write"`：仅允许写当前工作区，避免误改系统其他目录。
2. `approval_policy = "on-request"`：需要敏感操作时先询问你，适合新手和日常开发。

确认流程稳定后，再按实际场景提高权限。
