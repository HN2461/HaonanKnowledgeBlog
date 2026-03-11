# 第六篇：Claude Code 接入智谱 GLM 与 IDE 插件（2026-03）

> 本文基于智谱开放文档整理，时间点为 `2026-03-10`。  
> 覆盖范围：GLM Coding Plan 接入、模型映射与切换、常见问题、IDE 插件。  
> 适用：新手按步骤完成接入并能自检与排障。

[[toc]]

---

## 1. 这套接入在解决什么问题

GLM Coding Plan 让 Claude Code 保持原有交互体验，但实际调用智谱 GLM 模型。文档强调：界面显示 Claude 模型名，实际走 GLM 模型。这使得成本更低、额度更多，适合大规模编码与调试场景。

---

## 2. 前置条件

- Node.js 18+
- Windows 需要 Git for Windows
- macOS 建议用 nvm 或 Homebrew 安装 Node.js

---

## 3. 安装 Claude Code（CLI）

步骤：

1. 安装 CLI
2. 验证版本

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
claude --version
```

---

## 4. 配置 GLM Coding Plan（三种方式）

核心目标是：把 GLM 的 API Key 与 Base URL 写入 `~/.claude/settings.json`。

### 4.1 方式一：自动化助手（推荐）

步骤：

1. 运行 `npx @z_ai/coding-helper`
2. 按提示完成配置

该工具会自动处理：Claude Code 安装、套餐配置、MCP 服务器管理。

### 4.2 方式二：自动化脚本（macOS / Linux）

步骤：

1. 下载脚本
2. 执行脚本

```bash
curl -O "https://cdn.bigmodel.cn/install/claude_code_env.sh" && bash ./claude_code_env.sh
```

脚本会修改 `~/.claude/settings.json`，并在 `~/.claude.json` 中写入 `hasCompletedOnboarding`。

### 4.3 方式三：手动配置（全平台）

步骤：

1. 新建或编辑 `~/.claude/settings.json`
2. 写入 API Key 与 Base URL
3. 补充 `~/.claude.json` 的 `hasCompletedOnboarding`
4. 关闭所有 Claude Code 窗口并重新打开终端

示例：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
```

```json
{
  "hasCompletedOnboarding": true
}
```

安全提示：不要把 API Key 写进代码或提交到仓库。

---

## 5. 启动与验证

步骤：

1. 重新打开终端
2. 运行 `claude`
3. 在 Claude Code 内输入 `/status` 查看模型状态

---

## 6. 模型映射与切换

### 6.1 默认映射

默认配置下模型别名映射为：

- `ANTHROPIC_DEFAULT_OPUS_MODEL` → `GLM-4.7`
- `ANTHROPIC_DEFAULT_SONNET_MODEL` → `GLM-4.7`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL` → `GLM-4.5-Air`

### 6.2 切换 GLM-5

步骤：

1. 编辑 `~/.claude/settings.json`
2. 将 Opus 映射为 `glm-5`
3. 重启 Claude Code

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5"
  }
}
```

成本提示：文档指出 GLM-5 高峰期为 3 倍价格，非高峰期为 2 倍价格，高峰时间为 UTC+8 14:00-18:00。

---

## 7. MCP 服务器（视觉 / 搜索 / 网页读取）

文档提供视觉、搜索、网页读取 MCP 的接入指引，配置后可在 Claude Code 中直接调用。

---

## 8. 版本兼容

- 文档提示 Claude Code `v2.1.69` 存在 BUG，需要设置 `ENABLE_TOOL_SEARCH=0` 与 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` 才能使用 `claude-opus-4-6`。
- 可用 `claude --version` 查看版本。

---

## 9. IDE 插件（VS Code / JetBrains）

### 9.1 VS Code 插件

步骤：

1. 在扩展市场搜索并安装「Claude Code」
2. 点击右上角 Claude Code 图标进入页面
3. 在对话框输入 `/config`
4. 勾选 `Disable Login Prompt`

VS Code 系列 IDE（Cursor、Trae）同样可用。

### 9.2 JetBrains 插件

步骤：

1. 在 JetBrains 插件市场搜索「Claude Code」
2. 安装后重启 IDE

---

## 10. 验证清单

1. `claude --version` 能输出版本号
2. `claude` 启动后 `/status` 显示 GLM 对应模型
3. 修改 `settings.json` 后重启生效
4. IDE 插件能正常打开 Claude Code 面板

---

## 11. 排障清单

1. 手工配置不生效：关闭所有 Claude Code 窗口并重新打开终端
2. JSON 报错：检查引号、逗号与括号
3. 版本问题：升级到最新版本
4. GLM-5 成本异常：检查是否处于高峰期
5. IDE 插件无法登录：确认已完成 GLM Coding Plan 配置并关闭登录提示页

## 参考资料

- https://docs.bigmodel.cn/cn/guide/develop/claude
- https://docs.bigmodel.cn/cn/guide/develop/claude-for-ide
