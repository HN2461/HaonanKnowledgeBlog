# 第五篇：Claude Code 设置与个性化（2026-03）

> 本文基于 Claude Code 官方文档整理，时间点为 `2026-03-10`。  
> 覆盖范围：settings、permissions、sandboxing、terminal config、model config、fast mode、statusline、keybindings。  
> 适用：新手一步步配置并能自检与排障。

[[toc]]

---

## 1. 设置体系与作用域

作用域四层：Managed、User、Project、Local。  
优先级：Managed > Local > Project > User。  
CLI 参数会覆盖 settings 文件内的配置。

配置文件位置：

- 用户级：`~/.claude/settings.json`
- 项目级：`.claude/settings.json`
- 本地覆盖：`.claude/settings.local.json`
- 托管配置：`managed-settings.json`、MDM / 注册表

你可以在 `/config` 中交互式修改设置，也可直接编辑 JSON 文件。

---

## 2. 新手配置步骤（最短路径）

1. 在 Claude Code 中运行 `/config`
2. 根据提示选择作用域（User / Project / Local）
3. 保存后运行 `/status` 查看当前生效的设置与来源
4. 需要版本控制的设置写入项目级 `settings.json`
5. 私人偏好写入用户级 `settings.json`

---

## 3. 权限系统（permissions）

### 3.1 规则与优先级

- 规则类型：`allow`、`ask`、`deny`
- 优先级：deny > ask > allow
- `/permissions` 可查看当前规则与来源

### 3.2 权限模式

- `default`：第一次使用工具时询问
- `acceptEdits`：自动放行文件编辑
- `plan`：只分析不执行
- `dontAsk`：默认拒绝工具，除非预先允许
- `bypassPermissions`：完全跳过提示，仅建议在强隔离环境使用

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

- `default` / `sonnet` / `opus` / `haiku` / `sonnet[1m]` / `opusplan`

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

- 努力级别：`low` / `medium` / `high`
- `effortLevel` 或 `CLAUDE_CODE_EFFORT_LEVEL` 控制
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1` 可禁用自适应推理

### 6.6 1M 上下文

- `/model sonnet[1m]` 启用 1M 上下文
- `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` 可禁用
- 超过 200K 后按长上下文计费

---

## 7. 快速模式（fast mode）

要点：

- 研究预览功能，针对 Opus 4.6
- `/fast` 切换，开启后会显示 `↯`
- 不是新模型，而是同一模型的高速配置，成本更高
- `fastModePerSessionOptIn` 可要求每会话重新开启
- `CLAUDE_CODE_DISABLE_FAST_MODE=1` 可完全禁用
- 速率限制触发时自动回退到标准 Opus

---

## 8. 状态行（statusline）

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

---

## 11. 排障清单

1. 设置不生效：检查 JSON 是否非法，并用 `/status` 确认生效范围
2. 权限规则无效：确认规则语法与路径前缀
3. 沙箱无法启用：Linux/WSL2 缺少 `bubblewrap` 或 `socat`
4. 状态行无输出：确认脚本可执行并能读 stdin JSON
5. Fast Mode 未开启：检查是否需要 per-session opt-in

## 参考资料

- https://code.claude.com/docs/zh-CN/settings
- https://code.claude.com/docs/zh-CN/permissions
- https://code.claude.com/docs/zh-CN/sandboxing
- https://code.claude.com/docs/zh-CN/terminal-config
- https://code.claude.com/docs/zh-CN/model-config
- https://code.claude.com/docs/zh-CN/fast-mode
- https://code.claude.com/docs/zh-CN/statusline
- https://code.claude.com/docs/zh-CN/keybindings
