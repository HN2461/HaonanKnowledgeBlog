---
title: 第六篇：Claude Code 接入智谱 GLM 与 IDE 插件（2026-05复核）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - 智谱
  - GLM
  - IDE
  - VS Code
  - JetBrains
description: 按 2026-05-01 智谱 GLM Coding Plan 与 Claude for IDE 官方文档复核，在保留原文安装、配置、验证与排障结构的基础上，更新安装方式差异、GLM-5.1 与 glm-5-turbo 模型映射、IDE 登录提示处理和版本兼容边界。
---

# 第六篇：Claude Code 接入智谱 GLM 与 IDE 插件（2026-05复核）

> 本文基于智谱开放文档整理，并按 `2026-05-01` 重新复核。  
> 覆盖范围：GLM Coding Plan 接入、模型映射与切换、常见问题、IDE 插件。  
> 适用：新手按步骤完成接入并能自检与排障。

[[toc]]

---

## 0. 小白先记一句话

这一篇不是在教你“再装一个新 Claude Code”。  
它讲的是：

- **Claude Code 这个外壳继续用**
- **但底层实际调用智谱 GLM 模型**

主人可以把它理解成：

- 键盘和操作面板还是 Claude Code
- 发动机换成了智谱

如果主人现在只想知道“这方案值不值得折腾”，先看这一句：

- 适合已经习惯 Claude Code 交互、但想换底层模型和额度来源的人

---

## 1. 这套接入在解决什么问题

GLM Coding Plan 让 Claude Code 保持原有交互体验，但实际调用智谱 GLM 模型。文档强调：界面显示 Claude 模型名，实际走 GLM 模型。这使得成本更低、额度更多，适合大规模编码与调试场景。

补一句不适合的人群：

- 如果主人现在连 Claude Code 基础工作流都还没熟
- 那建议先把前面几篇读顺，再回来折腾这一篇

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

智谱当前接入页仍然使用：

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
claude --version
```

2026-05 校订说明：

- Anthropic 官方现在更推荐安装脚本、`winget`、`brew` 等原生分发路径
- 如果主人是严格跟智谱接入页走，可以继续按 `npm install -g`
- 如果主人是 Anthropic 原生账号用户，优先按 Anthropic 官方安装方式更稳

小白版理解：

- 不是“你之前装错了”
- 而是“Anthropic 官方文档”和“智谱接入文档”现在走了两套安装口径
- 所以你看到两种写法并不奇怪

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

补充说明：

- `hasCompletedOnboarding` 更适合理解为“兼容与跳过初始引导”的标记
- 不要把它误当成决定模型映射是否成功的唯一关键开关

小白版理解：

- 这更像“把首次引导那一步标记成已完成”
- 不是“真正决定能不能连上智谱”的核心密码

---

## 5. 启动与验证

步骤：

1. 重新打开终端
2. 运行 `claude`
3. 在 Claude Code 内输入 `/status` 查看模型状态

更稳的验证顺序：

1. `claude --version`
2. 启动 `claude`
3. `/status` 查看当前模型与连接状态
4. 发一个简单提问，确认实际响应正常
5. 再去 IDE 里验证面板是否接入成功

---

## 6. 模型映射与切换

### 6.1 默认映射

旧文档里常见映射为：

- `ANTHROPIC_DEFAULT_OPUS_MODEL` → `GLM-4.7`
- `ANTHROPIC_DEFAULT_SONNET_MODEL` → `GLM-4.7`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL` → `GLM-4.5-Air`

按 2026-05 智谱当前文档，主人更应该关注的新口径是：

- `ANTHROPIC_DEFAULT_OPUS_MODEL` → `GLM-5.1`
- `ANTHROPIC_DEFAULT_SONNET_MODEL` → `glm-5-turbo`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL` 也可按低成本模型路线配置

如果主人对这几个变量名有点头大，可以先这样记：

- `OPUS`：通常映射更强的大模型
- `SONNET`：通常映射主力编码模型
- `HAIKU`：通常映射更轻更便宜的模型

### 6.2 切换到当前推荐模型

步骤：

1. 编辑 `~/.claude/settings.json`
2. 将模型映射改成你要用的 GLM 路线
3. 重启 Claude Code

示例：

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5-turbo",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "GLM-5.1"
  }
}
```

成本提示：

- 旧笔记里的“GLM-5 高峰期 3 倍、非高峰期 2 倍”已经不够新
- 智谱当前文档还写了 `GLM-5.1` / `glm-5-turbo` 在非高峰期到 2026 年 6 月底按 1 倍抵扣
- 这类价格信息时效性很强，后续最好带日期一起写

这也是为什么主人以后写第三方模型笔记时，最好都顺手带上：

- 核对日期
- 文档链接
- 价格是否为活动期

---

## 7. MCP 服务器（视觉 / 搜索 / 网页读取）

文档提供视觉、搜索、网页读取 MCP 的接入指引，配置后可在 Claude Code 中直接调用。

---

## 8. 版本兼容

- 旧文档提示 Claude Code `v2.1.69` 存在 BUG，需要设置 `ENABLE_TOOL_SEARCH=0` 与 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`
- 可用 `claude --version` 查看版本

2026-05 校订说明：

- 这类环境变量更适合视为“版本性兼容补丁”
- 只有遇到对应版本回归问题时再启用
- 不建议把它们当作所有版本都必须长期保留的常驻配置

---

## 9. IDE 插件（VS Code / JetBrains）

### 9.1 VS Code 插件

步骤：

1. 在扩展市场搜索并安装「Claude Code」
2. 点击右上角 Claude Code 图标进入页面
3. 在对话框输入 `/config`
4. 需要时处理 `Disable Login Prompt`

VS Code 系列 IDE（Cursor、Trae）同样可用。

2026-05 校订说明：

- `Disable Login Prompt` 不是人人都必须勾
- 当底层其实已经走智谱，但 IDE 还在误导你走 Anthropic 登录时，再按智谱文档处理这一步更稳

小白版理解：

- 这不是“安装完插件必须做的第四步”
- 它更像“IDE 还在误弹官方登录时的修正开关”

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
5. 如果用了新版映射，`/status` 中的模型表现符合 `GLM-5.1` / `glm-5-turbo` 预期

---

## 11. 排障清单

1. 手工配置不生效：关闭所有 Claude Code 窗口并重新打开终端
2. JSON 报错：检查引号、逗号与括号
3. 版本问题：升级到最新版本
4. GLM 成本异常：检查是否处于高峰期，以及当前是否仍在活动时段
5. IDE 插件无法登录：确认已完成 GLM Coding Plan 配置，并只在需要时处理登录提示页
6. CLI 能用但 IDE 不通：先在 CLI 内确认 `/status` 正常，再回头看 IDE 集成

## 参考资料

- https://docs.bigmodel.cn/cn/coding-plan/tool/claude
- https://docs.bigmodel.cn/cn/guide/develop/claude-for-ide
- https://code.claude.com/docs/en/quickstart
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/whats-new
