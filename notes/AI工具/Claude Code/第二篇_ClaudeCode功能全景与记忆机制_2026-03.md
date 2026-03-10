# 第二篇：Claude Code 功能全景与记忆机制（2026-03）

> 本文基于 Claude Code 官方文档整理，时间点为 `2026-03-10`。  
> 覆盖范围：功能全景 + 记忆与规则体系。  
> 适用：新手建立“扩展能力 + 规则/记忆”心智。

[[toc]]

---

## 1. 功能全景（新手视角）

Claude Code 的扩展能力可以插入代理循环的不同位置：

- `CLAUDE.md`：每次会话都会加载的持久上下文
- skills：可重用知识与可调用的工作流
- MCP：连接外部服务和工具
- subagents：隔离上下文运行并返回摘要
- agent teams：多个独立会话协作，支持共享任务与点对点消息
- hooks：在循环外运行的确定性脚本
- plugins：打包并分发以上能力

官方建议新手从 `CLAUDE.md` 开始，按需再加入其他扩展。

---

## 2. 选型速记（什么时候用什么）

1. 任何“每次都必须遵守”的规则，放到 `CLAUDE.md`。
2. 需要按需调用的固定流程，用 skill。
3. 需要访问外部系统，用 MCP。
4. 需要隔离上下文或并行调查，用 subagent。
5. 需要自动化脚本（非模型），用 hook。
6. 需要把一整套能力分发复用，用 plugin。

---

## 3. 上下文成本与加载时机

不同能力加载时机不同，会影响上下文成本：

- `CLAUDE.md`：会话开始时完整加载
- skills：启动时加载描述，调用时加载完整内容
- MCP：工具定义加入上下文
- subagents：独立上下文，不膨胀主对话
- hooks：外部运行，不占上下文

经验法则：CLAUDE.md 控制在 200 行以内；若增长，把参考内容移到 skills，或拆分到 `.claude/rules/`。

---

## 4. CLAUDE.md 与 rules（新手上手步骤）

步骤：

1. 在项目根目录创建 `CLAUDE.md`。
2. 写入“必须遵守”的规则，要求具体且可验证。
3. 当规则开始膨胀时，把特定目录/语言的规则拆分到 `.claude/rules/`。
4. 在大型 monorepo 使用 `claudeMdExcludes` 排除不相关的 CLAUDE.md。

可写的典型内容：

- 代码风格与缩进
- 构建与测试命令
- 关键目录与入口点
- 禁止执行的命令或危险操作

---

## 5. 自动记忆（Auto Memory）

Claude Code 的记忆分两类：

- `CLAUDE.md`：你写的规则
- 自动记忆：Claude 在项目里自动记录的学习

自动记忆要点：

1. 默认开启，可用 `/memory` 切换或设置 `autoMemoryEnabled: false`。
2. 记忆存放在 `~/.claude/projects/<project>/memory/`。
3. `MEMORY.md` 是入口索引，前 200 行会在会话开始加载。
4. 主题文件（如 `debugging.md`）按需读取，不在启动时加载。
5. `/memory` 可以查看已加载的规则与记忆，并直接编辑文件。

---

## 6. 新手落地流程（一步一步做）

1. 用 `/init` 生成项目级 `CLAUDE.md`。
2. 把“永远要遵守”的内容写进 `CLAUDE.md`。
3. 把参考资料、清单、可复用流程放进 skills。
4. 如果上下文太大或规则太多，把部分规则拆分到 `.claude/rules/`。
5. 运行 `/memory` 检查加载情况，必要时关闭自动记忆。

---

## 7. 验证清单

1. 运行 `/memory` 能看到当前会话加载的 `CLAUDE.md` 和规则文件
2. 修改 `CLAUDE.md` 后，新会话能遵循新的规则
3. `MEMORY.md` 前 200 行能在会话开始被加载
4. 关闭自动记忆后不会再写入新记忆

---

## 8. 排障清单

1. Claude 不遵循 CLAUDE.md：运行 `/memory` 确认文件被加载，检查指令是否模糊或冲突
2. CLAUDE.md 太大：压缩到 200 行以内，或拆到 skills / rules
3. 规则不生效：确认规则路径匹配当前文件
4. 自动记忆内容不清楚：用 `/memory` 打开记忆目录查看 `MEMORY.md`
5. 指令在 `/compact` 后丢失：把关键规则放入 `CLAUDE.md`

## 参考资料

- https://code.claude.com/docs/zh-CN/features-overview
- https://code.claude.com/docs/zh-CN/memory
- https://code.claude.com/docs/zh-CN/how-claude-code-works
