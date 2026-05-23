---
title: 第二篇：Codex Plugin 体系详解与实战
date: 2026-05-23
category: AI工具
tags:
  - Plugin
  - Codex
  - OpenAI
  - Marketplace
  - plugin.json
  - .codex-plugin
  - 技能包
description: 深入解析 Codex Plugin 的目录结构、清单格式、Marketplace 三级分发机制、本机实装分析，以及安装与管理命令实战，帮助开发者在 Codex 生态中高效使用和开发插件。
---

# 第二篇：Codex Plugin 体系详解与实战

> 资料来源：OpenAI 2026-03-27 官方公告、Codex v0.117+ 实装、本机 `~/.codex/plugins/` 目录、社区实测文章。初稿整理：2026-05-23。

[[toc]]

---

## 一、Codex Plugin 的发布背景

2026 年 3 月 27 日，OpenAI 正式为 Codex 推出 **Plugin（插件）服务**，这是 Codex 从"代码生成工具"向"可扩展开发平台"演进的关键一步。

核心定位：

- **可安装的工作流集合**——把 Skills、应用集成和 MCP 服务器配置打包到一起
- **更快地分享统一开发配置**——团队成员一键安装，不再手动复制多个文件
- **生态共建**——社区开发者可以发布插件到 Marketplace

发布后的关键数据：

- 上月有超过 100 万名开发者使用 Codex
- 2026-04-17 更新后新增 90+ 插件，覆盖代码管理、CI、项目协作、数据处理
- 4 月更新还带来了 Chrome 扩展、Computer Use、并行 Agent 等能力

---

## 二、Plugin 与 Skill 的官方定位区分

OpenAI 在发布公告中明确区分了 Skill 和 Plugin：

| 维度 | Skill（技能） | Plugin（插件） |
|------|--------------|---------------|
| **定位** | 单一代码库或工作流中迭代 | 团队项目等场景的统一配置 |
| **风格** | 偏向"私人定制" | 偏向"团队复用" |
| **发布** | 无法对外发布 | 可在组织内部、Marketplace 分享 |
| **包含** | 1 个 SKILL.md + 辅助资源 | 多个 Skills + MCP 配置 + 应用集成 |

这段官方说明非常重要，因为它明确回答了"Skill 和 Plugin 到底是不是一回事"的问题——**不是，它们是两种不同的工具**。

---

## 三、Codex Plugin 目录结构

### 3.1 本机实装分析

当前本机 `~/.codex/plugins/` 的实际目录结构：

```text
~/.codex/plugins/
└── cache/
    └── openai-primary-runtime/
        ├── documents/
        │   └── 26.521.10419/           # 版本号
        │       ├── assets/
        │       │   ├── icon.png
        │       │   └── logo.png
        │       ├── README.md
        │       └── skills/documents/
        │           ├── agents/
        │           │   └── openai.yaml  # UI 展示元信息
        │           ├── assets/
        │           ├── examples/
        │           ├── scripts/          # 30+ Python 辅助脚本
        │           ├── references/       # 详细文档
        │           ├── tasks/            # 25+ 任务模板
        │           ├── troubleshooting/
        │           ├── SKILL.md
        │           └── render_docx.py
        ├── presentations/
        │   └── 26.521.10419/
        │       └── skills/presentations/
        │           ├── agents/openai.yaml
        │           ├── scripts/          # 18+ Python 脚本
        │           ├── templates/        # PPTX 模板
        │           ├── profiles/         # 7 个预设风格
        │           └── SKILL.md
        └── spreadsheets/
            └── 26.521.10419/
                └── skills/spreadsheets/
                    ├── agents/openai.yaml
                    ├── scripts/
                    ├── templates/
                    ├── SKILL.md
                    └── style_guidelines.md
```

从本机实装可以清楚看到：

1. **一个 Plugin 可以包含多个 Skills**——documents / presentations / spreadsheets 是三个独立 skill
2. **版本化管理**——`26.521.10419` 是版本标识
3. **缓存机制**——已安装插件缓存在 `cache/` 目录下
4. **agents/openai.yaml 是 UI 展示层**——不是通用标准，是 Codex 的专属扩展

### 3.2 agents/openai.yaml 格式

本机实际内容示例（documents 插件）：

```yaml
interface:
  display_name: "Documents"
  short_description: "Create and edit Word and Google Docs files"
  icon_small: "./assets/file-document.png"
  icon_large: "./assets/file-document.png"
  brand_color: "#2563EB"
  default_prompt: "Use $documents to create, edit, redline, or review a Word file or Google Doc."
```

这个文件更像 **Codex 的 UI/展示元信息**——定义插件在 Codex TUI 中的显示名称、图标、品牌色和默认提示语。它不属于 Agent Skills 最小通用标准，而是 Codex 平台专属的展示层。

---

## 四、Plugin 清单格式（.codex-plugin/plugin.json）

每个 Codex Plugin 必须在插件根目录下提供一个清单文件，用于声明插件的元信息和包含的能力。

### 4.1 最小必需结构

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A plugin that does X, Y, and Z"
}
```

### 4.2 完整结构示例

```json
{
  "name": "frontend-dev-toolkit",
  "version": "2.1.0",
  "description": "Complete frontend development toolkit with component generation, linting, and accessibility auditing",
  "skills": [
    "skills/component-gen",
    "skills/a11y-audit",
    "skills/style-check"
  ],
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp"]
    }
  },
  "hooks": {
    "PreToolUse": [
      {
        "command": "npm run lint"
      }
    ]
  }
}
```

### 4.3 关键字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 插件唯一标识，通常小写+连字符 |
| `version` | ✅ | 语义化版本号 |
| `description` | ✅ | 插件功能描述 |
| `skills` | ❌ | 包含的 Skills 目录路径数组 |
| `mcpServers` | ❌ | MCP 服务器配置 |
| `hooks` | ❌ | 事件钩子配置 |
| `agents` | ❌ | 子代理配置 |

---

## 五、Marketplace 三级分发

Codex Plugin 的 Marketplace 分三级：

### 5.1 官方仓库（openai-primary-runtime）

- 由 OpenAI 官方维护
- 预装插件：Documents、Presentations、Spreadsheets 等
- 已有 Slack、Figma、Notion、Cloudflare 等常用工具
- 用户可在 TUI 中直接浏览和安装

### 5.2 项目级 Marketplace

- 路径：`$REPO_ROOT/.agents/plugins/marketplace.json`
- 项目团队可以维护自己的插件源
- 适合团队内部统一工具链

### 5.3 用户级 Marketplace

- 路径：`~/.agents/plugins/marketplace.json`
- 个人用户可以添加自己的插件源
- 适合个人自定义配置

### 5.4 当前局限

截至 2026-05-23，社区实测反馈显示：

| 能力 | 当前状态 |
|------|---------|
| 官方插件安装 | ✅ 可用 |
| 社区插件远程安装 | ❌ 暂不支持 |
| 从 GitHub 直接拉取 | ❌ 暂不支持 |
| 社区 Marketplace 开放 | ❌ 尚未开放 |
| 本地路径安装 | ✅ 可用 |

这意味着社区插件目前只能通过**本地路径安装**——先把仓库 clone 到本地，再手动配置路径。官方社区 Marketplace 还没有正式开放，这限制了社区生态的发展。

---

## 六、Plugin 安装与管理命令

### 6.1 命令族

| 命令 | 说明 |
|------|------|
| `/plugins` | 浏览、搜索、安装或卸载插件 |
| `/plugin install <name>` | 安装指定插件 |
| `/plugin uninstall <name>` | 卸载指定插件 |
| `/plugin list` | 列出可用插件 |
| `/plugin list --installed` | 列出已安装插件 |
| `/plugin status <name>` | 查看插件状态 |
| `/plugin marketplace add <source>` | 添加 Marketplace 源 |

### 6.2 典型安装流程

```bash
# 1. 搜索插件
/plugins

# 2. 安装插件
/plugin install documents

# 3. 验证安装
/plugin status documents

# 4. 使用插件提供的能力
# 安装后自动获得：SKILL.md 中定义的流程、MCP 工具、Hooks 等
```

### 6.3 本地路径安装

当社区 Marketplace 未开放时，安装社区插件的方式：

1. 将插件仓库 clone 到本地
2. 在 `~/.agents/plugins/marketplace.json` 中添加本地路径
3. 使用 `/plugin install` 安装

---

## 七、实战：从本机实装理解 Plugin 的工作方式

以本机已安装的 **Documents Plugin** 为例：

### 7.1 安装后的能力

安装 Documents Plugin 后，Codex 自动获得：

| 能力 | 来源 | 说明 |
|------|------|------|
| 文档创建/编辑流程 | `skills/documents/SKILL.md` | 完整的 .docx 生成工作流 |
| 30+ 辅助脚本 | `skills/documents/scripts/` | 合并、水印、格式化等 |
| 25+ 任务模板 | `skills/documents/tasks/` | 评论管理、目录插入等 |
| OOXML 操作指南 | `skills/documents/ooxml/` | 底层格式操作参考 |
| UI 展示信息 | `skills/documents/agents/openai.yaml` | TUI 中的显示名称和图标 |
| 渲染验证脚本 | `skills/documents/render_docx.py` | 生成页面 PNG 做视觉 QA |

### 7.2 Plugin 跨 Skill 协作

本机实装中，Documents Plugin 的 SKILL.md 直接引用了其他 Plugin 的能力：

```markdown
## Google Docs-targeted output

For a net-new Google Docs request, create and verify a local `.docx` with this skill first.
The native Google Docs deliverable must then be produced by the Google Drive plugin's
document import action, `mcp__codex_apps__google_drive_import_document`.
```

这说明 **Plugin 之间可以互相引用能力**——Documents Plugin 知道如何调用 Google Drive Plugin 的 MCP 工具，实现跨插件协作。

---

## 八、Codex Plugin vs Claude Code Plugin 的关键差异

| 维度 | Codex Plugin | Claude Code Plugin |
|------|-------------|-------------------|
| **发布时间** | 2026-03-27 | 更早（社区实测已有） |
| **清单格式** | `.codex-plugin/plugin.json` | 类似但格式有差异 |
| **Marketplace** | 三级（官方/项目/用户） | 有 Marketplace，支持官方仓库 |
| **安装命令** | `/plugins`、`/plugin install` | `/plugin install` |
| **社区生态** | 尚未完全开放 | `anthropics/claude-code-plugins` 仓库 |
| **Skill 打包** | 支持，且 agents/openai.yaml 是展示层 | 支持，但格式有差异 |
| **MCP 集成** | Plugin 可包含 MCP 配置 | Plugin 可包含 MCP Servers |
| **成熟度** | 快速成长中，但社区 Marketplace 受限 | 相对更成熟 |

---

## 九、当前建议与注意事项

### 9.1 适合做的

- 使用官方预装 Plugin（Documents / Presentations / Spreadsheets）
- 关注官方 Marketplace 新增插件的动态
- 为团队内部开发自定义 Plugin，走项目级 Marketplace

### 9.2 暂时不要期待的

- 社区 Plugin 远程一键安装（Marketplace 尚未开放）
- 所有社区插件都经过严格审核（当前缺乏统一审核机制）
- Plugin 能力跨工具通用（Codex Plugin 和 Claude Code Plugin 格式不同）

### 9.3 实操建议

1. **先用官方插件**：从 Documents / Presentations / Spreadsheets 开始体验
2. **再尝试本地安装**：用本地路径方式安装社区插件
3. **最后考虑自研**：为团队特定工作流开发自定义 Plugin

---

## 十、参考资料

- [OpenAI 推出 Codex 插件 - IT之家 2026-03-27](https://www.ithome.com/0/933/409.htm)
- [Codex Plugins 来了 - CSDN 博客](https://blog.csdn.net/weixin_44829437/article/details/159659676)
- [OpenAI Codex 更新：90+ 插件 - 腾讯新闻 2026-04-17](https://news.qq.com/rain/a/20260417A02OKI00)
- [Codex for Chrome 扩展 - PHP 中文网](https://www.php.cn/faq/2441716.html)
- 本机 `~/.codex/plugins/cache/openai-primary-runtime/` 目录结构
