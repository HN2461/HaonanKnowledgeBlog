---
title: 第四篇：Claude Code 从 0 到 1 全攻略（视频精读 + 2026-05校订）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - 视频笔记
  - Hooks
  - Skills
  - Plugins
  - MCP
description: 基于公开视频与官方文档做长版视频精读，并按 2026-05-01 Claude Code 官方资料逐段校订，保留原分钟轴、步骤、验证与补充说明，只替换已过时的模式、命令、路径与插件/技能用法。
---

# 第四篇：Claude Code 从 0 到 1 全攻略（视频精读 + 2026-05校订）

> 资料来源：B 站视频《Claude Code 从 0 到 1 全攻略》公开内容 + LilysAI 转写脚本 + Claude Code 官方文档。  
> 目标：尽量保留原视频笔记的分钟轴和细节密度，同时把已经过时的命令、模式、目录路径、Hook 事件和插件/技能口径修成 2026-05 可用版。  
> 阅读方式：主人可以把这篇当成“视频复现稿 + 勘误版”，不是只看结论的速查页。

[[toc]]

---

## 0. 小白先看这 5 句

如果主人现在不想一口气读完整篇长文，先记这 5 句：

1. 这视频还能看，但很多命令和界面已经不是最新版
2. 视频真正值钱的是“它怎么一步步用 Claude 干活”的思路
3. 现在最容易过时的是：模式数量、危险权限命令、Skill 路径、Hook 事件、插件重载方式
4. 你可以把这篇当成“视频字幕稿 + 勘误本”
5. 遇到旧说法时，优先看我在每节补的“2026-05 校订”

---

## 1. 视频结构与学习路径

视频分为四大块（00:50）：

1. 环境搭建与基础交互
2. 复杂任务处理与终端控制
3. 多模态与上下文管理
4. 高级功能扩展与定制

建议学习顺序：

- 先按第 2 节逐步操作跑通完整流程
- 再读第 3 节理解“为什么这样做”
- 最后对照第 4 节官方补全，把隐性规则补齐

小白版理解：

- 第 2 节是“照着做”
- 第 3 节是“懂原理”
- 第 4 节是“把旧视频修到今天还能用”

---

## 2. 逐分钟复现（按视频时间）

### 2.1 安装与登录（02:20 - 04:22）

1. 进入官网复制安装命令 → 终端粘贴执行 `curl -fsSL https://claude.ai/install.sh | bash`
2. 新建项目并进入：

```bash
mkdir my-todo
cd my-todo
claude
```

3. 若未自动弹出登录，输入 `/login`
4. 登录方式两种：
   - 订阅（Pro / Max）
   - 官方 API Key（按 Token 计费）
5. 授权成功后回终端，按回车完成登录

补充：

- 视频强调 Claude Code 与模型解耦，无法使用官方订阅时可通过设置环境变量接第三方模型
- 2026-05 校订：Anthropic 官方当前仍优先推荐安装脚本和原生分发；部分第三方接入页还在使用 `npm install -g @anthropic-ai/claude-code`

---

### 2.2 第一个待办应用（05:54 - 07:59）

输入需求：

```text
给我做一个待办软件，使用 HTML 实现。
```

Claude Code 请求创建 `index.html`，出现 3 个选项：

1. Yes（单次授权）
2. Yes, allow all edits during this session（自动接受编辑）
3. 不同意（可继续补充需求后再确认）

选择第二项后，输入框底部出现 `accept edits on`，代表自动接受编辑开启。

---

### 2.3 三种模式与切换（08:15 - 11:49）

视频里用 **Shift + Tab** 在三种模式间循环：

1. **默认模式**：底部显示 `for shortcuts`（只是提示，不是模式名）
   - 每次写文件都要确认
2. **自动模式**：底部显示 `accept edits on`
   - 写文件不再询问
3. **规划模式**：底部显示 `Plan Mode On`
   - 只讨论方案，不改文件

2026-05 校订：

- 视频里展示的是当时最常见的三种
- 当前官方模式体系已经扩展为 `default`、`acceptEdits`、`plan`、`auto`、`bypassPermissions`、`dontAsk`
- `Shift+Tab` 现在也不是永远只循环固定三种，而是循环当前环境里可见的模式

主人如果觉得这一节容易乱，可以先只记：

- `default`：稳
- `acceptEdits`：省确认
- `plan`：先说方案不动手

---

### 2.4 Bash 模式与查看结果（12:51 - 13:47）

进入 Bash 模式：

```text
!
```

执行：

```bash
open index.html
```

打开页面验证待办运行正常。

补充：

- Windows 环境下对应会更常见 `start index.html`
- `!` 前缀仍然是很实用的“直接跑命令并把输出带回上下文”的入口

---

### 2.5 Plan Mode 重构（14:23 - 20:40）

目标：从单文件升级为 React + TypeScript + Vite。

操作要点：

1. Shift + Tab → 进入 Plan Mode
2. 输入重构请求
3. **Shift + 回车** 换行，避免提前提交
4. **Ctrl + G** 打开 VS Code 编辑输入（更方便写长指令）
5. Claude 产出计划，包含目标、清单、目录结构
6. 执行选项：
   - 执行计划 + 自动模式
   - 执行计划 + 默认模式
   - 继续修改计划
7. 视频示例：要求“每个待办项增加优先级并用颜色区分”，Claude 修改计划后执行

2026-05 校订：

- 现在复杂规划更建议配合 `/effort high` 或 `/effort xhigh`
- 如果你只想要计划，也可以直接用 `/plan`

---

### 2.6 终端命令权限与危险模式（21:16 - 27:10）

关键结论：

- **文件写入自动执行** ≠ **终端命令自动执行**
- 视频时代的自动模式主要放行文件写入，执行命令仍需逐次确认

视频演示：

1. Claude 在执行 `mkdir` 时仍弹授权。原因：命令属于 Bash
2. 没有“自动允许所有命令”的常规选项
3. 视频里演示了危险参数

旧视频写法：

```text
claude dangerously-skip-permissions
```

2026-05 正确写法应为：

```bash
claude --dangerously-skip-permissions
```

或显式指定：

```bash
claude --permission-mode bypassPermissions
```

补充：

- 现在 `acceptEdits` 已经比视频时代更强，会自动放行一部分低风险文件系统命令，如 `mkdir`、`touch`、`rm`、`mv`、`cp`、`sed`
- 但危险模式依然高风险，因为它等于把大部分保护网直接拆掉

小白版理解：

- `acceptEdits` 不是“无敌自动模式”
- `bypassPermissions` 才是真正接近“你点了就几乎都能干”
- 所以平时别轻易把这两个概念混了

---

### 2.7 启动服务与阻塞（27:31 - 29:30）

1. Claude 请求执行 `npm run dev`，视频先拒绝
2. 手动执行 `npm run dev`，服务启动
3. 服务运行会 **阻塞 Claude Code**，输入新请求不会响应

这个观察到今天仍然成立：  
长时间前台进程如果不做处理，依然会影响主会话交互。

---

### 2.8 后台任务与 /tasks（29:47 - 30:49）

1. 按 **Ctrl + B** 把运行中的服务放到后台
2. 输入 `/tasks` 查看后台任务
3. 任务列表显示 `npm run dev`
4. 按 `k` 可终止任务
5. 按 **ESC** 返回主界面，后台任务继续运行

2026-05 校订：

- 后台任务能力现在更重要了，因为除 `/tasks` 外，还多了 `/loop`、`/schedule`、Monitor tool 这类长任务辅助能力

如果主人只想学一个最实用技巧，这一节就是：

- **服务卡住主界面时，先按 `Ctrl+B`**

---

### 2.9 新需求与验证（31:01 - 31:39）

输入需求：右上角增加中英切换选项（默认中文）。

Claude 修改完成后打开页面，效果符合预期。

这一步到今天仍然适合新手模仿，因为它体现的是：

- 先做一个最小可视化需求
- 马上验证
- 立刻迭代

---

### 2.10 回滚（32:05 - 33:26）

回滚入口：

- `/rewind`
- 或 **ESC + ESC**

选中回滚点后有 4 种选择：

1. 回滚代码 + 会话
2. 只回滚会话
3. 只回滚代码
4. 放弃回滚

视频示例：回滚后功能消失，验证成功。

---

### 2.11 回滚限制（33:26 - 34:xx）

回滚到初始 `index.html` 后，用 `ls` 发现仍有大量目录。原因：

- 这些内容来自 Bash 命令（`mkdir`、`npm install`），**Claude 回滚无法覆盖**
- 这类清理由用户手动完成或使用 Git 回退

这点到今天仍然完全成立：  
Checkpoint 不是 Git 的替代品，只是会话级安全网。

---

### 2.12 多模态与 MCP（39:xx - 44:xx）

1. 在 Figma 导出 PNG
2. 图片输入方式：
   - 拖拽 PNG 到终端，显示 `image #2` 表示成功
   - 复制图片后 **Ctrl + V** 粘贴
3. 图片直读可能不够精准（字体、间距偏差）
4. 通过 MCP 精确还原：
   - 安装 Figma MCP Server，例如：`claude mcp add --transport http figma https://mcp.figma.com/mcp`
   - 用 `/resume` 或继续当前会话
   - `/mcp` → 选择 Figma → Authenticate 授权
   - 粘贴 Figma 链接，Claude 依次调用设计上下文与截图能力
5. 获取结构化信息后修改 HTML，精度明显提升

2026-05 校订：

- HTTP 方式仍是当前主流推荐
- SSE 方式在官方文档里已是 deprecated
- 这段视频最大的长期价值，是让人理解“结构化设计上下文 > 纯视觉猜测”

---

### 2.13 上下文管理与 Claude.md（44:xx - 48:xx）

1. `/compact` 压缩上下文，减少 Token 消耗
2. `/clear` 清空上下文，适合新任务
3. 使用 `/init` 生成 `CLAUDE.md`
4. 修改 `CLAUDE.md` 后开新会话验证最稳
5. `/memory` 查看项目级 / 用户级 `CLAUDE.md` 并编辑

2026-05 校订：

- 现在还可以配合 `/context` 看占用
- 项目里如果已经有 `AGENTS.md`，也可以在 `CLAUDE.md` 里用 `@AGENTS.md` 复用
- 不必再死记“必须整段重启 Claude Code 才会生效”，更稳的说法是“新会话验证最稳”

小白版理解：

- `/compact` 是“缩对话”
- `/clear` 是“开新题”
- `CLAUDE.md` 是“项目说明书”

---

### 2.14 Hook（49:xx - 53:xx）

视频示例：写完文件自动格式化。

#### 2.14.1 进入 `/hooks` 后看到的触发类型

视频界面会列出 5 类事件：

1. **PreToolUse**：工具执行前触发
2. **PostToolUse**：工具执行后触发
3. **PostToolUseFailure**：工具执行失败后触发
4. **Notification**：通知发送时触发
5. **UserPromptSubmit**：用户提交提示时触发

底部提示：按 **Enter** 确认选择，按 **Esc** 取消。

2026-05 校订：

- 这 5 类仍然成立，但已经不是全部
- 当前 Hook 体系还包括 `PermissionRequest`、`PostToolBatch`、`SessionStart/End`、`SubagentStart/Stop`、`PreCompact/PostCompact`、`ConfigChange`、`CwdChanged`、`FileChanged`、`WorktreeCreate/Remove`

#### 2.14.2 视频里的完整配置流程（自动格式化）

1. 输入 `/hooks` 进入配置界面
2. 选择 **PostToolUse**（工具执行后触发）
3. 设置 matcher（视频示例为 `write` 或 `edit`）
4. 添加 Hook 命令：`jq -r '.tool_input.file_path' | xargs prettier --write`
5. 选择保存范围：
   - 本地项目：`settings.local.json`（不共享）
   - 项目级：`settings.json`（共享）
   - 用户级：用户目录（全局）

#### 2.14.3 验证方式（视频思路）

- 让 Claude 写一个单行 `test.html`
- 写完后自动触发格式化，文件会被 `prettier` 改成规范格式
- 如果没有生效，先检查 matcher 是否写成了 `write` / `edit`，再检查保存范围

---

### 2.15 Agent Skill（54:xx - 58:xx）

场景：重复任务（如日报）。

#### 2.15.1 创建 Skill（视频流程）

旧视频思路：

1. 在用户目录 `claude/skills` 下新建文件夹 `daily-report`
2. 在文件夹内新建 `skill.md`
3. `skill.md` 内容分两部分：
   - 元数据：`name`、`description`
   - 具体指令：要求 Claude 输出日报的固定格式
4. 重启 Claude Code，让 Skill 被发现并加载

2026-05 校订后的正确结构：

1. 个人级目录：`~/.claude/skills/daily-report/SKILL.md`
2. 项目级目录：`.claude/skills/daily-report/SKILL.md`
3. 入口文件名必须是 **`SKILL.md`**
4. 新建的是 skill 目录，不是单文件散落在 `claude/skills`
5. 编辑已有 skill 时通常不需要重启；只有会话启动时还不存在的顶层 `skills/` 目录更可能需要重启或重载

一句话翻译：

- 旧视频里那套“`claude/skills` + `skill.md`”今天不能直接抄了
- 现在要记的是“`SKILL.md` 放在 `.claude/skills/<名字>/` 里面”

#### 2.15.2 调用方式（视频演示）

1. 输入 `/skills` 查看已加载的 Skill 列表
2. 直接输入 `/daily-report` 强制调用（更可控）
3. 也可以自然语言提示“写一份每日总结”，Claude 会提示使用该 Skill

#### 2.15.3 验证方式

- 让 Claude 生成一份日报，看输出是否严格遵循你写在 `SKILL.md` 中的格式
- 若没生效，优先检查：
  - 是否是 `SKILL.md`
  - 目录是否在正确的 `.claude/skills/` 或 `~/.claude/skills/` 下
  - 是否只是需要重载或开新会话确认

---

### 2.16 SubAgent（58:xx - 65:xx）

示例：代码审核 SubAgent。

#### 2.16.1 创建 SubAgent（视频流程）

视频里的创建流程大意是：

1. 输入 `/agent` → 选择 Create new agent
2. 选择保存范围：
   - **Project**（`.claude/agents/`）：项目级，团队共享
   - **Personal**（`~/.claude/agents/`）：个人级，仅本机可见
3. 选择 Claude 初始化
4. 选择创建方式：
   - **Generate with Claude (recommended)**
   - Manual configuration
5. 填写描述：代码审核 SubAgent
6. 选择工具权限
7. 选择模型
8. 选择颜色
9. 编辑描述，补充审查准则和输出格式

2026-05 校订：

- 现在更推荐记住 `/agents` 作为主入口
- Subagent 的核心价值仍然是“独立上下文、独立工具集、独立权限”

小白版理解：

- skill 更像“模板”
- subagent 更像“分身”

#### 2.16.2 使用方式（视频演示）

- 输入“给我做一下代码审核”
- SubAgent 会单独处理并返回最终报告

#### 2.16.3 Skill vs SubAgent（视频核心区分）

区别：

- Skill 共享主对话上下文，过程会写回
- SubAgent 独立上下文，主对话只接收结果

#### 2.16.4 验证方式

- 对同一代码段分别用主对话与 SubAgent 审查，比较输出是否更聚焦
- 若没触发 SubAgent，检查：描述是否清晰、是否选择了项目级可见、是否能在 `/agents` 中看到它

---

### 2.17 Plugin（65:xx - 70:xx）

示例：`frontend-design`。

#### 2.17.1 安装流程（视频演示）

1. 输入 `/plugin` 打开插件管理
2. 顶部标签包含：`Discover` / `Installed` / `Marketplaces`
3. 在 Discover 列表中找到 `frontend-design`
4. 回车进入详情页
5. 选择安装范围：
   - **Install for you (user scope)**
   - **Install for all collaborators on this repository (project scope)**
   - **Install for you, in this repo only (local scope)**
6. 确认安装后返回列表
7. 视频强调重启 Claude Code

#### 2.17.2 验证方式

1. `/plugin` → Installed，确认插件已在列表中
2. `/skills` 出现相关 Skill
3. 让 Claude 用该 Skill 重做页面，对比 UI 风格差异

2026-05 校订：

- 首次安装后重启当然最稳
- 但当前命令体系已经有 `/reload-plugins`
- 调试插件时不必每次都做整段重启
- Plugin Skill 需要命名空间，例如 `/frontend-design:landing-page`

小白版理解：

- plugin 不是单个按钮
- 它更像一整个功能包
- 里面可以带 skills、agents、hooks、MCP

#### 2.17.3 插件本质（视频强调）

- Plugin 是整套能力包，可包含 Skill / MCP / Hook / SubAgent

---

## 3. 视频解读：核心机制的“本质”

这一节其实就是把前面那些操作翻译成人话。  
如果主人觉得视频步骤很多，就重点看这一节和后面的官方补全。

1. **权限分层是核心安全边界**
   - 文件写入和 Bash 命令是两条不同的授权链
2. **Plan Mode 是高风险改动的最佳入口**
   - 先确认目标和结构，再执行；不需要在执行时反复回退
3. **后台任务是让 Claude “不停工” 的关键**
   - 长任务放后台，保证交互不中断
4. **Rewind 只解决“Claude 写的东西”**
   - Bash 产生的副作用必须用 Git 或手工清理
5. **图片输入适合粗对齐，MCP 适合精还原**
   - 视频用 Figma MCP 证明“结构化上下文 > 纯视觉”
6. **Skill / SubAgent / Plugin 是三层抽象**
   - Skill 是可复用 Prompt
   - SubAgent 是隔离上下文
   - Plugin 是能力打包

---

## 4. 官方文档补全（视频没说清楚的部分）

### 4.1 交互与命令（Interactive Mode）

官方补充的关键点：

- `/clear` 清空对话；`/compact` 压缩上下文；`/context` 查看当前上下文占用
- `Ctrl + B` 可把 Bash 命令或 Agent 放后台，任务会生成 ID；`/tasks` 管理任务
- 可用环境变量 `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` 禁用后台功能
- `Ctrl + V`（或 Windows 的 `Alt + V`）可直接粘贴图片
- `!` 前缀可直接执行 Bash 命令，并将输出加入上下文

### 4.2 回滚机制（Checkpointing）

官方补充：

- `/rewind` 或 `Esc Esc` 打开回滚面板
- 除“恢复代码 / 会话”外，还有“从此处总结”选项，等价于局部 `/compact`
- **Bash 修改不会被回滚**，与视频一致
- Checkpoint 不是 Git 的替代品，只是会话级安全网

### 4.3 MCP 细节补齐

官方补充：

- 推荐 HTTP 方式接入：

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

- SSE 方式已标注为 deprecated
- 本地 stdio 服务器示例：

```bash
claude mcp add --transport stdio airtable -- npx -y airtable-mcp-server
```

- **作用域**：
  - user scope 存于 `~/.claude.json`
  - project scope 写入 `.mcp.json`
- `/mcp` 用于查看状态和鉴权
- MCP 输出过大可通过 `MAX_MCP_OUTPUT_TOKENS` 增加限制

### 4.4 Hook 与 Settings 细节

官方补充：

- Hook 配置来源：
  - `~/.claude/settings.json`
  - `.claude/settings.json`
  - `.claude/settings.local.json`
- Hook 事件支持 `PreToolUse` / `PostToolUse` 等，`matcher` 支持正则
- 可通过 `disableAllHooks: true` 临时关闭所有 Hook
- Hook 可引用环境变量：
  - `CLAUDE_PROJECT_DIR`
  - `CLAUDE_PLUGIN_ROOT`

官方示例（自动格式化）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

### 4.5 Skill 规范补齐

官方补充：

- Skill 由 `SKILL.md` 组成，包含 YAML frontmatter
- `disable-model-invocation: true` 可以防止模型自动调用
- `allowed-tools` 可限制工具权限
- `context: fork` 可让 Skill 在 SubAgent 中运行

示例：

```md
---
name: deploy
description: Deploy the application
disable-model-invocation: true
---

Deploy $ARGUMENTS to production:

1. Run tests
2. Build
3. Deploy
```

### 4.6 SubAgent 补齐

官方补充：

- SubAgent 拥有独立上下文、独立权限、独立工具集
- Claude 会根据描述判断是否委派
- `/agents` 可以管理内置与自定义 SubAgent

### 4.7 Memory 与 CLAUDE.md / MEMORY.md

官方补充：

- 记忆分两类：
  - `CLAUDE.md`：你写的长期规则
  - Auto memory：Claude 自动记的偏好与经验
- Auto memory 默认开启，可用 `/memory` 关闭，或设置 `autoMemoryEnabled: false`
- Auto memory 存储在：`~/.claude/projects/<project>/memory/`，入口是 `MEMORY.md`
- `MEMORY.md` 只加载前 200 行或前 25KB，以先到者为准

### 4.8 Plugin 结构补齐

官方补充：

- 插件目录需包含 `.claude-plugin/plugin.json`，定义 name/description/version
- 组件目录必须在插件根目录：`skills/`、`agents/`、`hooks/`、`.mcp.json`
- Plugin Skill 需命名空间：`/plugin-name:skill`

### 4.9 2026-05 再补一层：视频时代还没有强调的新能力

这一段是给主人补“视频之后的新增重点”：

- `auto mode`
- `/effort`
- `/loop`
- `/schedule`
- `/autofix-pr`
- `/reload-plugins`
- Monitor tool
- Claude Code on the web

也就是说，视频不是不能看，而是它代表的是一个较早阶段的使用图谱。  
如果主人现在要实战，必须把这些新能力一起纳入心智模型。

---

## 5. 一页速查（视频 + 官方补全）

### 5.1 常用命令

- `/login` 登录
- `/tasks` 查看后台任务
- `/rewind` 回滚
- `/compact` 压缩上下文
- `/clear` 清空上下文
- `/context` 查看上下文占用
- `/memory` 查看 `CLAUDE.md` / Auto memory
- `/hooks` Hook 管理
- `/skills` Skill 管理
- `/agents` SubAgent 管理
- `/plugin` 插件管理
- `/reload-plugins` 重载插件
- `/mcp` MCP 管理
- `/plan` 规划
- `/effort` 调整思考强度
- `/loop` 循环执行
- `/schedule` 定时执行
- `/autofix-pr` 按 PR 评论修复

### 5.2 快捷键

- Shift + Tab：切换模式
- Ctrl + B：后台运行
- ESC + ESC：回滚
- Ctrl + O：打开 transcript viewer
- Ctrl + G：用编辑器写长提示
- Ctrl + V / Alt + V：粘贴图片

---

## 6. 常见坑与对策

1. 自动模式 ≠ 自动执行所有命令
   - 仍要区分 `acceptEdits`、`auto`、`bypassPermissions`
2. `/rewind` 不回滚 Bash 产物
   - 该类回退交给 Git
3. 运行服务会阻塞 Claude
   - 必须用 Ctrl + B 放后台
4. 图片还原不够准
   - 用 MCP 提供结构化数据再精修
5. 规则没生效
   - 修改 `CLAUDE.md` 后开新会话验证更稳
6. 技能没生效
   - 先检查是不是 `SKILL.md`、目录是否正确，再考虑重启或重载
7. 插件改完没反映
   - 优先试 `/reload-plugins`

---

## 参考资料

- https://www.bilibili.com/video/BV14rzQB9EJj
- https://lilys.ai/zh/notes/claude-code-20260127/claude-code-zero-to-one-guide
- https://code.claude.com/docs/en/interactive-mode
- https://code.claude.com/docs/en/checkpointing
- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/hooks-guide
- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/subagents
- https://code.claude.com/docs/en/slash-commands
- https://code.claude.com/docs/en/plugins
- https://code.claude.com/docs/en/plugins-reference
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/whats-new
