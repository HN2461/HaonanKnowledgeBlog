# 第一篇：Claude Code 快速上手与工作原理（2026-03）

> 本文基于 Claude Code 官方文档整理，时间点为 `2026-03-10`。  
> 覆盖范围：快速开始 + Claude Code 如何工作。  
> 适用：第一次上手与新手入门。

[[toc]]

---

## 1. 开始前清单

准备清单：

- 一个可用的终端或命令提示符
- 一个需要处理的代码项目
- 可用账号类型之一：Claude 订阅、Claude Console 账户，或企业云提供商接入

Claude Code 不只可在 CLI 使用，也可以在网页版、桌面应用、VS Code、JetBrains、Slack 与 CI/CD 中使用。

---

## 2. 安装 Claude Code（CLI）

步骤：

1. 选择安装方式
2. 执行对应命令
3. 完成后进入下一步登录

安装命令：

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

```bat
:: Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

可选安装（不会自动更新）：

```bash
brew install --cask claude-code
```

```powershell
winget install Anthropic.ClaudeCode
```

补充说明：

- Windows 需要先安装 Git for Windows
- Native 安装会自动更新，Homebrew 和 WinGet 需要手动升级

---

## 3. 登录与启动会话

步骤：

1. 进入项目目录
2. 启动 Claude Code
3. 按提示登录

```bash
cd /path/to/your/project
claude
```

也可以用 `/login` 手动触发登录。登录后凭证会被保存，下次无需重复登录。

---

## 4. 第一个问题（让 Claude 读懂项目）

先用高层问题建立上下文：

```text
这个项目做什么？
主入口点在哪里？
解释文件夹结构
```

Claude 会按需读取文件，不需要你手动添加上下文。

---

## 5. 第一次修改（小步验证）

示例任务：

```text
在主文件中添加一个 hello world 函数
```

Claude 的典型流程：

1. 找到合适文件
2. 展示建议的改动
3. 请求批准
4. 执行修改

你可以单次批准，或在会话内开启“全部接受”模式。

---

## 6. 在 Claude Code 中使用 Git

示例提示：

```text
我更改了哪些文件？
用描述性消息提交我的更改
创建一个名为 feature/quickstart 的新分支
显示我最后的 5 次提交
帮我解决合并冲突
```

---

## 7. 修复错误或添加功能

示例提示：

```text
向用户注册表单添加输入验证
有一个错误，用户可以提交空表单 - 修复它
```

Claude 会定位相关代码、理解上下文、实现修复，并在可用时运行测试。

---

## 8. 其他常见工作流示例

```text
重构身份验证模块以使用 async/await 而不是回调
为计算器函数编写单元测试
使用安装说明更新 README
审查我的更改并建议改进
```

---

## 9. Claude Code 如何工作（代理循环）

核心心智：

- 代理循环包含三个阶段：收集上下文 → 采取行动 → 验证结果
- 你可以随时中断、纠偏或补充上下文

Claude Code 由“推理模型 + 工具”驱动，Claude Code 本身负责工具、上下文管理与执行环境，把模型变成可执行的代理。

---

## 10. 会话与上下文管理

会话与恢复：

- 会话保存在本地
- 每次编辑前会做快照
- `claude --continue` 或 `claude --resume` 可恢复会话
- `--fork-session` 可以从同一历史分叉新会话
- 恢复会话不会继承会话内权限，需要重新批准

上下文窗口：

- 包含对话、文件内容、命令输出、`CLAUDE.md`、skills 等
- 接近上限时自动压缩
- 接近上限时可用 `/compact` 控制压缩保留
- 大量 MCP server 会消耗上下文，可用 `/mcp` 查看成本

用 skills 与 subagents 管理上下文：

- skills 按需加载
- subagents 在隔离上下文中运行并返回摘要，适合长会话

---

## 11. 安全与权限模式

检查点：

- 编辑前自动快照
- `Esc + Esc` 可回滚文件改动
- 检查点只覆盖文件修改，不覆盖外部系统副作用

权限模式（`Shift+Tab` 循环）：

1. 默认：编辑与命令都询问
2. 自动接受编辑：文件编辑不再询问，但命令仍需确认
3. Plan Mode：只读分析与计划，不改文件不执行命令

你还可以在 `.claude/settings.json` 中预先允许可信命令，减少确认弹窗。

---

## 12. 新手验证清单

1. 运行 `claude` 后看到欢迎界面
2. 输入 `/help` 能看到命令列表
3. 输入“这个项目做什么？”得到结构化概览
4. 输入“在主文件中添加一个 hello world 函数”看到改动预览与批准流程
5. `Shift+Tab` 能切换到 Plan Mode 并只产出计划
6. 使用 `/compact` 能观察到上下文压缩与保留效果

---

## 13. 排障清单

1. Windows 无法安装或命令缺失：确认已安装 Git for Windows
2. Homebrew/WinGet 版本过旧：手动执行升级命令
3. 恢复会话后需要再次授权：这是正常行为，权限不会继承
4. 多个终端恢复同一会话导致对话混乱：改用 `--fork-session`
5. 不确定安装是否正常：在会话内运行 `/doctor` 做诊断
6. 上下文频繁被压缩：把规则写入 `CLAUDE.md` 并用 `/compact` 控制保留

## 参考资料

- https://code.claude.com/docs/zh-CN/quickstart
- https://code.claude.com/docs/zh-CN/how-claude-code-works
