# 第二篇：Claude Code 功能全景与记忆机制（2026-03）

> 本文基于 Claude Code 官方文档整理，时间点为 `2026-03-12`。  
> 本版是“原文保留 + 增强版”：保留原有核心内容，并补充 `CLAUDE.md` 与 `rules` 关系和运行机制。

[[toc]]

---

## 0. 先记住这一句话（小白版）

可以把 Claude Code 理解成三层：

1. `CLAUDE.md` / `.claude/rules/*.md`：告诉 Claude“应该怎么做”（软约束）。
2. `.claude/settings.json` 的 permissions：决定 Claude“能不能做”（硬约束）。
3. Auto Memory：记录项目经验，帮助下次更快进入状态。

---

## 1. 功能全景（新手视角）

Claude Code 的扩展能力可以插入代理循环的不同位置：

- `CLAUDE.md`：每次会话都会加载的持久上下文。
- skills：可重用知识与可调用的工作流。
- MCP：连接外部服务和工具。
- subagents：隔离上下文运行并返回摘要。
- agent teams：多个独立会话协作，支持共享任务与点对点消息。
- hooks：在循环外运行的确定性脚本。
- plugins：打包并分发以上能力。

官方建议新手从 `CLAUDE.md` 开始，按需再加入其他扩展。

---

## 2. 选型速记（什么时候用什么）

1. 任何“每次都必须遵守”的规则，放到 `CLAUDE.md`。
2. 需要按需调用的固定流程，用 skill。
3. 需要访问外部系统，用 MCP。
4. 需要隔离上下文或并行调查，用 subagent。
5. 需要自动化脚本（非模型），用 hook。
6. 需要把一整套能力分发复用，用 plugin。
7. 需要“硬拦截”的权限控制，用 `.claude/settings.json` 的 permissions。

---

## 3. 上下文成本与加载时机

不同能力加载时机不同，会影响上下文成本：

- `CLAUDE.md`：会话开始时完整加载。
- rules：无 `paths` 的规则启动加载；有 `paths` 的规则在命中文件时按需加载。
- skills：启动时加载描述，调用时加载完整内容。
- MCP：工具定义加入上下文。
- subagents：独立上下文，不膨胀主对话。
- hooks：外部运行，不占上下文。

经验法则：`CLAUDE.md` 控制在 200 行以内；若增长，把参考内容移到 skills，或拆分到 `.claude/rules/`。

---

## 4. CLAUDE.md 与 rules（新手上手步骤）

### 4.1 新手上手步骤

1. 在项目根目录创建 `CLAUDE.md`。
2. 写入“必须遵守”的规则，要求具体且可验证。
3. 当规则开始膨胀时，把特定目录/语言的规则拆分到 `.claude/rules/`。
4. 在大型 monorepo 使用 `claudeMdExcludes` 排除不相关的 `CLAUDE.md`。

### 4.2 关系与分工（重点）

1. `CLAUDE.md` 和 rules 都属于“指令上下文（memory/instructions）”。
2. `CLAUDE.md` 适合放全局规则；rules 适合做模块化和按路径加载。
3. 它们都不是硬权限策略，不能替代 permissions/hooks。

可写的典型内容：

- 代码风格与缩进。
- 构建与测试命令。
- 关键目录与入口点。
- 禁止执行的命令或危险操作。

---

## 5. 自动记忆（Auto Memory）

Claude Code 的记忆分两类：

- `CLAUDE.md`：你写的规则。
- 自动记忆：Claude 在项目里自动记录的学习。

自动记忆要点：

1. 默认开启，可用 `/memory` 切换或设置 `autoMemoryEnabled: false`。
2. 记忆存放在 `~/.claude/projects/<project>/memory/`。
3. `MEMORY.md` 是入口索引，前 200 行会在会话开始加载。
4. 主题文件（如 `debugging.md`）按需读取，不在启动时加载。
5. `/memory` 可以查看已加载的规则与记忆，并直接编辑文件。

---

## 6. 运行机制（新增，解释“如何生效”）

下面是 `CLAUDE.md`、rules、permissions 的真实链路：

1. 会话启动：加载 `CLAUDE.md`、无 `paths` 的 rules、auto memory 入口。
2. 读文件时：如果命中 `paths` 规则，动态加载对应 rule。
3. 调工具前：触发 `PreToolUse` hooks（若配置）。
4. 权限评估：按 `deny -> ask -> allow`，首个匹配生效。
5. 通过后执行工具调用。
6. 调用后触发 PostToolUse/通知类 hooks（若配置）。
7. 自动记忆按配置写入项目 memory 目录。

结论：

1. `CLAUDE.md/rules` 影响“行为倾向”。
2. permissions/hooks 负责“硬约束”。

---

## 7. 推荐目录模板（可直接落地）

```text
.
├─ CLAUDE.md
└─ .claude
   ├─ settings.json
   └─ rules
      ├─ 00-general.md
      ├─ 10-backend-java.md
      └─ 20-frontend-web.md
```

---

## 8. 可直接复用的最小配置示例

### 8.1 `.claude/settings.json`（硬约束示例）

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
      "Bash(mvn deploy*)",
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

### 8.2 `.claude/rules/10-backend-java.md`（按路径加载示例）

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

## 9. 新手落地流程（一步一步做）

1. 用 `/init` 生成项目级 `CLAUDE.md`。
2. 把“永远要遵守”的内容写进 `CLAUDE.md`。
3. 把参考资料、清单、可复用流程放进 skills。
4. 如果上下文太大或规则太多，把部分规则拆分到 `.claude/rules/`。
5. 运行 `/memory` 检查加载情况，必要时关闭自动记忆。
6. 在 `.claude/settings.json` 配置高风险命令的 `deny/ask`。

---

## 10. 验证清单

1. 运行 `/memory` 能看到当前会话加载的 `CLAUDE.md` 和规则文件。
2. 修改 `CLAUDE.md` 后，新会话能遵循新的规则。
3. `MEMORY.md` 前 200 行能在会话开始被加载。
4. 关闭自动记忆后不会再写入新记忆。
5. 命中 `deny` 的命令会被直接拦截，命中 `ask` 的命令会弹确认。

---

## 11. 排障清单

1. Claude 不遵循 `CLAUDE.md`：运行 `/memory` 确认文件被加载，检查指令是否模糊或冲突。
2. `CLAUDE.md` 太大：压缩到 200 行以内，或拆到 skills/rules。
3. 规则不生效：确认规则路径是否匹配当前文件。
4. 自动记忆内容不清楚：用 `/memory` 打开记忆目录查看 `MEMORY.md`。
5. 指令在 `/compact` 后丢失：把关键规则放入 `CLAUDE.md`。
6. 权限配置不生效：检查 permissions 匹配顺序是否被前面的规则提前命中。

---

## 12. 参考资料（官方）

- https://code.claude.com/docs/zh-CN/features-overview
- https://code.claude.com/docs/zh-CN/memory
- https://code.claude.com/docs/zh-CN/settings
- https://code.claude.com/docs/zh-CN/permissions
- https://code.claude.com/docs/zh-CN/how-claude-code-works
