---
title: 第五篇：Claude Code 设置与个性化（2026-05复核）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - Settings
  - Permissions
  - Sandbox
  - Model Config
  - 1M Context
description: 按 2026-05-01 Claude Code 官方 Configuration、Permission Modes、Sandboxing、Model Config、Fast Mode、Statusline 与 Keybindings 文档复核，在保留原文分节、示例、验证与排障结构的基础上，更新设置优先级、auto mode、1M 上下文、effort 和 200K 计费口径。
---

# 第五篇：Claude Code 设置与个性化（2026-05复核）

> 本文基于 Claude Code 官方文档整理，并按 `2026-05-01` 重新复核。  
> 覆盖范围：settings、permissions、sandboxing、terminal config、model config、fast mode、statusline、keybindings。  
> 适用：新手一步步配置并能自检与排障。

[[toc]]

---

## 0. 小白先记一句话

这一篇主人可以先这么理解：

- User：你自己的长期习惯
- Project：这个项目要共享的规则
- Local：只在你这台机器上临时覆盖
- Managed：公司或团队强制下发

再翻得更白一点：

- 这一篇本质上就是在讲 Claude Code 的“设置面板”
- 只是它把设置拆成了权限、模型、沙箱、状态行、快捷键这些部分

如果主人现在只想先配一个够用版本，先记这 3 件事：

1. 先会看 `/status`
2. 先会看 `/permissions`
3. 默认模式先用 `default` 或 `acceptEdits`

---

## 1. 设置体系与作用域

常见作用域：

- Managed
- User
- Project
- Local
- Command line

当前优先级建议理解为：

1. Managed
2. Command line
3. Local
4. Project
5. User

这比旧版多出一层非常关键的“命令行覆盖”。

配置文件位置：

- 用户级：`~/.claude/settings.json`
- 项目级：`.claude/settings.json`
- 本地覆盖：`.claude/settings.local.json`
- 托管配置：`managed-settings.json`、MDM / 注册表

你可以在 `/config` 中交互式修改设置，也可直接编辑 JSON 文件。

小白版理解：

- User 像“你手机的个人偏好”
- Project 像“这个项目的团队默认值”
- Local 像“你在这个项目里偷偷给自己加的覆盖项”
- Managed 像“公司 IT 锁死的选项”

---

## 2. 新手配置步骤（最短路径）

1. 在 Claude Code 中运行 `/config`
2. 根据提示选择作用域（User / Project / Local）
3. 保存后运行 `/status` 查看当前生效的设置与来源
4. 需要版本控制的设置写入项目级 `settings.json`
5. 私人偏好写入用户级 `settings.json`

2026-05 补充：

- 如果你是临时试验某个模式或模型，优先用命令行参数或 `/model`、`/effort`
- 如果你改了文件却没生效，先怀疑是否被更高优先级覆盖

---

## 3. 权限系统（permissions）

### 3.1 规则与优先级

- 规则类型：`allow`、`ask`、`deny`
- 优先级：deny > ask > allow
- `/permissions` 可查看当前规则与来源

### 3.2 权限模式

- `default`：第一次使用工具时询问
- `acceptEdits`：自动放行工作目录内文件编辑，并会自动放行常见文件系统命令
- `plan`：只分析不执行
- `auto`：研究预览模式，分类器会替你处理一部分低风险权限请求
- `dontAsk`：默认拒绝工具，除非预先允许
- `bypassPermissions`：完全跳过提示，仅建议在强隔离环境使用

小白版理解：

- `default`：最稳
- `acceptEdits`：省点击
- `plan`：只出方案
- `auto`：介于保守和放开之间
- `bypassPermissions`：最猛，也最危险

这里最容易过时的点是：

- 旧文里把 `acceptEdits` 理解成“只自动编辑文件”
- 现在它还会自动放行一部分低风险文件系统命令，例如 `mkdir`、`touch`、`rm`、`mv`、`cp`、`sed`

### 3.3 规则语法

- 规则可写 `Tool` 或 `Tool(specifier)`
- 示例：

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ],
    "ask": [
      "Bash(npm run *)"
    ],
    "allow": [
      "Bash(npm run test)",
      "Edit(src/**)"
    ]
  }
}
```

### 3.4 Bash 与通配符

- `*` 支持 glob 匹配
- `Bash(ls *)` 与 `Bash(ls*)` 含义不同，注意空格

### 3.5 Read / Edit 路径规则

路径前缀：

- `//` 绝对路径
- `~/` 主目录
- `/` 项目根目录
- `./` 或无前缀 当前目录

路径语法遵循 gitignore 规则。

### 3.6 WebFetch / MCP / Agent

- `WebFetch(domain:example.com)` 控制域名
- `mcp__server__tool` 控制 MCP 工具
- `Agent(AgentName)` 控制 subagent

### 3.7 工作目录扩展

- 启动时 `--add-dir <path>`
- 会话内 `/add-dir`
- 持久配置 `additionalDirectories`

---

## 4. 沙箱隔离（sandboxing）

### 4.1 核心概念

- 沙箱仅限制 Bash 命令及其子进程
- 建议与 permissions 组合使用

### 4.2 支持平台

- macOS：Seatbelt
- Linux / WSL2：bubblewrap
- WSL1 不支持

### 4.3 开启步骤

1. 运行 `/sandbox` 打开菜单
2. Linux/WSL2 安装 `bubblewrap` 和 `socat`
3. 按提示启用并选择沙箱级别

### 4.4 文件系统限制

- 仅允许写入项目目录
- `sandbox.filesystem.allowWrite` 追加可写路径
- `sandbox.filesystem.denyRead` / `denyWrite` 阻止访问

### 4.5 网络限制

- 通过沙箱代理控制域名访问
- `allowManagedDomainsOnly` 可自动阻止未知域名
- `sandbox.allowedDomains` 可设置允许列表

---

## 5. 终端配置（terminal config）

### 5.1 换行

- `\ + Enter` 可在输入框中换行
- `Shift+Enter` 在 iTerm2、WezTerm、Ghostty、Kitty 原生可用
- `/terminal-setup` 可自动为 VS Code、Alacritty、Zed、Warp 配置

### 5.2 Option/Alt + Enter

- Terminal.app 需要勾选“Option 作为 Meta 键”
- iTerm2 / VS Code 终端可设置 Option 为 “Esc+”

---

## 6. 模型配置（model config）

### 6.1 模型别名

- `default`
- `sonnet`
- `opus`
- `haiku`
- `opusplan`

旧资料里常见的 `sonnet[1m]` 这种口径，已经不适合再当成唯一的 1M 入口记忆。

### 6.2 设置模型优先级

1. `/model <alias|name>`
2. `claude --model <alias|name>`
3. `ANTHROPIC_MODEL` 环境变量
4. `settings.json` 的 `model`

### 6.3 限制模型范围

- `availableModels` 限制可切换范围
- 多层级配置会合并，托管设置优先级最高

### 6.4 默认模型与降级

- 默认模型由账号类型决定
- Opus 达到阈值时可能自动回退 Sonnet

### 6.5 努力级别与自适应推理

- 努力级别：`low` / `medium` / `high` / `xhigh`
- `/effort` 可直接切换
- `effortLevel` 或 `CLAUDE_CODE_EFFORT_LEVEL` 控制
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1` 可禁用自适应推理

### 6.6 1M 上下文

当前更准确的口径是：

- `Opus 4.7`
- `Opus 4.6`
- `Sonnet 4.6`

都支持 1M context。

并且：

- 对 `Max`、`Team`、`Enterprise` 上的 Opus 默认会自动升级到 1M context
- 超过 200K 后 **没有额外 premium**

所以旧文里“`/model sonnet[1m]` 启用 1M”“超过 200K 后按长上下文计费”这两句都已经过时。

如果主人觉得这一段有点绕，可以只记结论：

- **现在 1M 已经不是某一个旧别名的专属能力了**
- **而是新模型体系里的正式能力**

---

## 7. 快速模式（fast mode）

要点：

- 研究预览功能，仍主要针对 Opus 路线
- `/fast` 切换，开启后会显示 `↯`
- 不是新模型，而是同一模型的高速配置
- `fastModePerSessionOptIn` 可要求每会话重新开启
- `CLAUDE_CODE_DISABLE_FAST_MODE=1` 可完全禁用
- 速率限制触发时自动回退到标准 Opus

---

## 8. 状态行（statusline）

这一节如果第一次看会觉得像“高级玩法”。  
其实翻译成人话就是：

- Claude 底部那一条状态信息，也可以让你自己定制

### 8.1 工作方式

- 状态行会运行你配置的脚本
- Claude Code 通过 stdin 传入 JSON，脚本输出文字即为状态行
- 每次消息处理后刷新，默认 300ms 防抖
- 不消耗 API 令牌

### 8.2 配置步骤

1. 创建脚本，例如 `~/.claude/statusline.sh`
2. 在 `settings.json` 配置 `statusLine`
3. 重新启动 Claude Code

示例配置：

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

### 8.3 常用字段

- `model.id` / `model.display_name`
- `workspace.project_dir`
- `context_window.used_percentage`
- `cost.total_cost_usd`

### 8.4 Windows 说明

- Windows 上由 Git Bash 执行状态行命令
- PowerShell 脚本可通过 Git Bash 调用

### 8.5 关闭状态行

- 删除 `statusLine` 配置
- 或用 `/statusline delete`

---

## 9. 快捷键（keybindings）

这一节适合等主人已经用顺手之后再回来看。  
刚开始不必急着改快捷键，先把权限和模型理解稳更重要。

步骤：

1. 运行 `/keybindings` 打开 `~/.claude/keybindings.json`
2. 按 JSON 格式编辑并保存
3. 保存后自动生效

示例：

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

说明：

- 通过 `context` 指定作用范围
- 将 action 设为 `null` 表示取消绑定
- 支持组合键与和弦（如 `ctrl+k ctrl+b`）

---

## 10. 验证清单

1. `/status` 能看到当前生效设置与来源
2. `/permissions` 能看到 allow/ask/deny 规则
3. `/sandbox` 能显示沙箱状态
4. `/fast` 切换后状态行出现 `↯`
5. `/statusline` 可生成或删除状态行配置
6. `/keybindings` 修改后快捷键立即生效
7. `/effort` 能切换思考强度
8. 1M context 相关模型在 `/status` 或模型信息里能确认生效

---

## 11. 排障清单

1. 设置不生效：检查 JSON 是否非法，并用 `/status` 确认生效范围
2. 权限规则无效：确认规则语法与路径前缀
3. 沙箱无法启用：Linux/WSL2 缺少 `bubblewrap` 或 `socat`
4. 状态行无输出：确认脚本可执行并能读 stdin JSON
5. Fast Mode 未开启：检查是否需要 per-session opt-in
6. 感觉 1M 规则和旧文不同：优先以当前 model-config 文档为准，不再按 `sonnet[1m]` 老口径判断

## 参考资料

- https://code.claude.com/docs/en/configuration
- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/sandboxing
- https://code.claude.com/docs/en/model-config
- https://code.claude.com/docs/en/fast-mode
- https://code.claude.com/docs/en/statusline
- https://code.claude.com/docs/en/keybindings
