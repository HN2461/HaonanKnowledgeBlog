---
title: 第二篇：Claude Code 功能全景与记忆机制（2026-05复核）
date: 2026-05-01
category: AI工具
tags:
  - Claude Code
  - CLAUDE.md
  - Memory
  - Skills
  - Hooks
  - Plugins
description: 按 2026-05-01 Claude Code 官方 Features、Memory、Skills、Hooks 与 Plugins 文档复核，更新 CLAUDE.local.md、SKILL.md、自动记忆边界、插件命名空间与 hooks 事件体系。
---

# 第二篇：Claude Code 功能全景与记忆机制（2026-05复核）

> 核对时间：2026-05-01  
> 这一篇的目标不是教命令，而是帮主人建立正确“分层心智”：哪些内容是在教 Claude 怎么做，哪些内容是在限制它能不能做，哪些内容是在帮它下次更快进入状态。

[[toc]]

---

## 0. 小白先记一句话

如果主人是第一次看这些词，可以先把这一篇理解成：

1. `CLAUDE.md` / rules / skills：是在教 Claude “应该怎么干活”
2. permissions / hooks / sandbox：是在限制 Claude “哪些能做，哪些不能做”
3. Auto memory：是在帮 Claude “下次别再从 0 开始学”

再翻得更白一点：

- `CLAUDE.md` 像“项目说明书”
- rules 像“分目录的补充说明”
- skills 像“常用流程模板”
- permissions 像“门禁”
- hooks 像“自动触发的小脚本”
- memory 像“项目经验本”

如果主人现在只想先上手，不想一开始就学全套，记住这个顺序就够了：

1. 先写 `CLAUDE.md`
2. 再配 permissions
3. 规则太多再拆 rules
4. 重复流程再做 skills
5. 最后才碰 hooks、plugins、agent teams

---

## 1. 先记住现在这三层

可以把 Claude Code 理解成三层：

1. `CLAUDE.md` / `CLAUDE.local.md` / `.claude/rules/*.md`
   - 告诉 Claude“应该怎么做”
2. `.claude/settings.json` 里的 permissions / hooks / sandbox
   - 限制 Claude“能不能做”
3. Auto memory
   - 记录 Claude 在当前工作树里学到的经验

这三层的作用完全不同，不要混着用。

小白版理解：

- 前两层是在“管现在”
- 第三层是在“帮下次”

---

## 2. 现在有哪些扩展能力

按官方当前体系，常用扩展能力包括：

- `CLAUDE.md`
- `CLAUDE.local.md`
- `.claude/rules/*.md`
- skills
- subagents
- agent teams
- MCP
- hooks
- plugins

一句话速记：

- 想写长期规则，用 `CLAUDE.md`
- 想写只给自己看的项目偏好，用 `CLAUDE.local.md`
- 想把规则按目录和语言拆开，用 rules
- 想把一段可复用工作流做成“随叫随到”的能力，用 skill
- 想把任务隔离给独立上下文，用 subagent
- 想让多个代理协同，用 agent teams
- 想接外部服务，用 MCP
- 想做确定性自动化，用 hooks
- 想把一整套能力打包分发，用 plugin

如果主人觉得上面一串词很多，可以先只记这一句：

- **Claude.md 管规则，permissions 管边界，skills 管流程，MCP 管外部，hooks 管自动化。**

### 2.1 选型速记（什么时候用什么）

1. 任何“每次都必须遵守”的规则，放到 `CLAUDE.md`
2. 需要按需调用的固定流程，用 skill
3. 需要访问外部系统，用 MCP
4. 需要隔离上下文或并行调查，用 subagent
5. 需要自动化脚本（非模型），用 hook
6. 需要把一整套能力分发复用，用 plugin
7. 需要“硬拦截”的权限控制，用 `.claude/settings.json` 的 permissions

### 2.2 上下文成本与加载时机

不同能力加载时机不同，会影响上下文成本：

- `CLAUDE.md`：会话开始时完整加载
- `CLAUDE.local.md`：同样属于会话启动时的重要规则上下文
- rules：无 `paths` 的规则启动加载；有 `paths` 的规则在命中文件时按需加载
- skills：启动时加载描述，调用时加载完整内容
- MCP：工具定义加入上下文
- subagents：独立上下文，不膨胀主对话
- hooks：外部运行，不占模型上下文

经验法则：

- `CLAUDE.md` 尽量精炼
- Auto memory 入口 `MEMORY.md` 也别写得过长
- 参考资料、流程清单、长模板更适合拆去 rules 或 skills

---

## 3. `CLAUDE.md`、`CLAUDE.local.md`、rules 到底怎么分工

先翻译成人话：

- `CLAUDE.md`：团队都要遵守的总说明
- `CLAUDE.local.md`：只有你自己本机想加的私货说明
- rules：按目录或语言拆开的分说明

### 3.1 `CLAUDE.md`

适合放：

- 代码风格
- 测试命令
- 目录结构说明
- 高风险禁区
- 团队通用约定

### 3.2 `CLAUDE.local.md`

适合放：

- 只属于主人的项目偏好
- 本机调试地址
- 私人测试数据路径
- 不想提交进仓库的个人备注

它会和 `CLAUDE.md` 一起加载，但建议加入 `.gitignore`。

### 3.3 `.claude/rules/*.md`

适合放：

- 语言专用规则
- 目录专用规则
- 大仓库里的子模块约束

如果规则只在某些路径生效，用 frontmatter 的 `paths` 来限制加载范围。

---

## 4. `AGENTS.md` 和 Claude Code 的关系

这是这次复核里一个很实用的新点。

Claude Code 本身读取的是 `CLAUDE.md`，不是 `AGENTS.md`。  
但如果仓库已经有 `AGENTS.md`，官方建议可以在 `CLAUDE.md` 里直接复用：

```md
@AGENTS.md

## Claude Code

这里补充 Claude Code 专属规则
```

这样做的好处是：

- 其他代理继续读 `AGENTS.md`
- Claude Code 也不会丢掉仓库已有规范
- 不用维护两份几乎重复的规则

---

## 5. Skill 现在的正确结构

这一点是旧笔记里最容易过时的地方之一。

小白版理解：

- skill 本质上就是“把你经常重复说的话，封成一个可复用按钮”
- 以后你不用每次都重新打一大段提示词
- Claude 也可以根据 `description` 自动判断什么时候该用它

当前标准写法：

- 个人级：`~/.claude/skills/<skill-name>/SKILL.md`
- 项目级：`.claude/skills/<skill-name>/SKILL.md`
- 插件级：`<plugin>/skills/<skill-name>/SKILL.md`

关键点：

- 入口文件名是 **`SKILL.md`**
- 不是旧写法里的 `skill.md`
- 目录名会变成 `/skill-name`
- frontmatter 的 `description` 决定 Claude 什么时候自动调用

另外，Claude Code 现在会监控 skill 目录变化：

- 编辑已有 skill，一般当前会话就能生效
- 只有“会话启动时不存在的顶层 `skills/` 目录”才通常需要重启

---

## 6. Skills、Subagents、Plugins 的关系

这三者经常被混在一起，实际上层级不同。

先用最白的话说：

- skill：像“工具卡片”
- subagent：像“分出去单独干活的小助手”
- plugin：像“工具包”

### 6.1 Skill

本质是：

- 一段可复用指令
- 可直接 `/skill-name`
- 也可让 Claude 在合适时自动调用

### 6.2 Subagent

本质是：

- 独立上下文
- 独立工具集
- 独立权限与角色

适合：

- 让它单独做代码审查
- 并行调查 bug
- 让主对话保持干净

### 6.3 Plugin

本质是：

- 能力打包

一个插件里可以包含：

- `skills/`
- `agents/`
- `hooks/`
- `.mcp.json`
- `.claude-plugin/plugin.json`

插件 skill 要带命名空间，例如：

```text
/frontend-design:landing-page
```

---

## 7. Auto memory 现在是怎么工作的

Auto memory 仍然很有价值，但官方文档现在写得更细了。

小白版理解：

- 它不是你手写的规则
- 而是 Claude 在项目里慢慢记下来的“经验”
- 但它不会无脑把全部经验都塞进上下文，所以要把最重要的规则写回 `CLAUDE.md`

核心要点：

1. Auto memory 以工作树为单位记录
2. 入口文件是 `MEMORY.md`
3. 启动时自动加载 `MEMORY.md` 的前 200 行或前 25KB，以先到者为准
4. 更细的主题文件按需加载，不会在会话开始时全部塞进上下文

这意味着：

- `MEMORY.md` 应该尽量短
- 细节要拆到 `debugging.md`、`patterns.md` 之类主题文件
- 真正必须每次都读到的规则，不要放 Auto memory，要放 `CLAUDE.md`

---

## 8. 当前加载顺序，怎么理解最稳

这一节如果主人第一次看，会容易觉得抽象。  
其实你只要抓住一个感觉：

- **总规则先加载**
- **局部规则按需加载**
- **流程模板用到时再加载**
- **自动化脚本不占主要思考上下文**

可以这样理解：

1. 启动会话时，Claude 会沿目录树向上读取 `CLAUDE.md` 和 `CLAUDE.local.md`
2. 同时载入当前工作树的 Auto memory 入口
3. 遇到具体文件时，再按需加载命中的 rules
4. 技能只在被调用或被判定相关时才加载主体
5. subagent 在自己的隔离上下文里工作
6. hooks 不直接占用模型上下文，而是在生命周期事件上触发

这也是为什么：

- `CLAUDE.md` 适合“总规则”
- rules 适合“局部规则”
- skills 适合“按需流程”
- memory 适合“下次别再重复学”

---

## 9. Hooks 事件已经不止早期教程里的 5 个

旧视频里常见的 5 类只是入门版视角。  
按当前 hooks 参考，主人需要知道事件体系已经更完整，包括：

- `SessionStart` / `SessionEnd`
- `UserPromptSubmit`
- `PreToolUse`
- `PermissionRequest`
- `PostToolUse`
- `PostToolUseFailure`
- `PostToolBatch`
- `Notification`
- `SubagentStart` / `SubagentStop`
- `PreCompact` / `PostCompact`
- `ConfigChange`
- `CwdChanged`
- `FileChanged`
- `WorktreeCreate` / `WorktreeRemove`

所以如果主人以后要写自动化，不要再拿“只有 5 种触发器”的旧认知来设计。

但如果主人现在只是刚入门，不用一口气记完全部事件。  
先记住最常用的这 4 个就够了：

1. `PreToolUse`
2. `PostToolUse`
3. `PermissionRequest`
4. `SessionStart`

---

## 10. 推荐目录模板

```text
.
├─ CLAUDE.md
├─ CLAUDE.local.md
└─ .claude
   ├─ settings.json
   ├─ rules
   │  ├─ 00-general.md
   │  ├─ 10-backend.md
   │  └─ 20-frontend.md
   ├─ skills
   │  └─ deploy
   │     └─ SKILL.md
   └─ agents
      └─ reviewer.md
```

---

## 11. 可直接复用的最小配置示例

### 11.1 `.claude/settings.json`（硬约束示例）

```json
{
  "permissions": {
    "deny": [
      "Bash(git reset --hard*)",
      "Bash(rm -rf *)",
      "Bash(curl * | sh*)"
    ],
    "ask": [
      "Bash(git push*)",
      "Bash(npm publish*)"
    ],
    "allow": [
      "Read(*)",
      "Write(./*)",
      "Bash(git status)",
      "Bash(git diff*)"
    ]
  }
}
```

### 11.2 `.claude/rules/10-backend-java.md`（按路径加载示例）

```md
---
paths:
  - "src/main/java/**"
  - "src/test/java/**"
  - "**/*.java"
---

# Java 后端规则

1. 文件编码必须 UTF-8 无 BOM。
2. 关键逻辑注释说明“为什么这样做”。
3. 出现 `非法字符: '\ufeff'` 时，仅做去 BOM 和最小修复。
```

---

## 12. 新手落地流程（一步一步做）

1. 用 `/init` 生成项目级 `CLAUDE.md`
2. 把“永远要遵守”的内容写进 `CLAUDE.md`
3. 把参考资料、清单、可复用流程放进 skills
4. 如果上下文太大或规则太多，把部分规则拆分到 `.claude/rules/`
5. 运行 `/memory` 检查加载情况，必要时关闭自动记忆
6. 在 `.claude/settings.json` 配置高风险命令的 `deny/ask`

如果主人想走最省脑子的路径，可以直接缩成这 3 步：

1. `/init`
2. 写 `CLAUDE.md`
3. 配危险命令拦截

---

## 13. 主人现在最值得建立的习惯

建议顺序：

1. 先把团队长期规则写进 `CLAUDE.md`
2. 只属于主人的偏好写进 `CLAUDE.local.md`
3. 重复步骤做成 skill
4. 高风险自动化放 hook，但先从只读和通知开始
5. 真正需要外部系统时再加 MCP

这个顺序最稳，不容易一开始就把体系做复杂。

---

## 14. 验证清单

1. 运行 `/memory` 能看到当前会话加载的 `CLAUDE.md`、`CLAUDE.local.md`、规则或记忆入口
2. 修改 `CLAUDE.md` 后，新会话能遵循新的规则
3. `MEMORY.md` 前 200 行或前 25KB 的内容能在会话开始被加载
4. 关闭自动记忆后不会再写入新记忆
5. 命中 `deny` 的命令会被直接拦截，命中 `ask` 的命令会弹确认

---

## 15. 排障清单

1. Claude 不遵循 `CLAUDE.md`：运行 `/memory` 确认文件被加载，检查指令是否模糊或冲突
2. `CLAUDE.md` 太大：压缩或拆到 skills/rules
3. 规则不生效：确认规则路径是否匹配当前文件
4. 自动记忆内容不清楚：用 `/memory` 打开记忆目录查看 `MEMORY.md`
5. 指令在 `/compact` 后丢失：把关键规则放入 `CLAUDE.md`
6. 权限配置不生效：检查 permissions 匹配顺序是否被前面的规则提前命中

---

## 16. 参考资料

- https://code.claude.com/docs/en/features-overview
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/plugins
- https://code.claude.com/docs/en/subagents
- https://code.claude.com/docs/en/agent-teams
