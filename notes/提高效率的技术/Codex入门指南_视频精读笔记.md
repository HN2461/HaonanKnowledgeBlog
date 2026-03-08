# Codex 入门指南（BV11erUBUEEX）视频精读笔记

> 目标：把视频里提到的每个知识点，整理成可直接执行的学习与实操清单。  
> 说明：该视频在播放器接口中未提供公开字幕，本笔记依据视频简介列出的知识点，结合 OpenAI 官方 Codex 文档做系统化展开。

## 一、视频信息与学习范围

- 视频标题：`Codex 入门指南`
- B 站 BV 号：`BV11erUBUEEX`
- 时长：`3182s`（约 `53:02`）
- 发布时间：`2026-01-17 13:16:18 +08:00`
- 视频简介给出的核心知识点：
  - 安装 Codex（CLI + IDE）
  - 设置仓库并完成首次运行
  - 编写优秀的 AGENTS.md（模式与最佳实践）
  - 为环境配置 Codex
  - 提示模式以获得更一致结果
  - 在 CLI 和 IDE 中使用 Codex 的技巧
  - 高级工作流程：无头模式 + SDK

## 二、知识点 1：安装 Codex（CLI + IDE）

### 2.1 CLI 安装与升级

```bash
npm i -g @openai/codex
codex
```

首次运行会引导登录（ChatGPT 账号或 API Key）。

升级：

```bash
npm i -g @openai/codex@latest
```

### 2.2 IDE 扩展安装

Codex IDE 扩展支持：

- VS Code
- Cursor
- Windsurf
- VS Code Insiders
- JetBrains IDEs（单独集成）

安装后能力与 CLI 共用同一套核心 Agent 和配置体系。

### 2.3 平台注意事项

- 官方文档明确：Windows 原生支持为实验态。
- 实操建议：Windows 用户优先在 WSL 工作区里跑 Codex。

## 三、知识点 2：设置仓库并完成首次运行

### 3.1 首次运行最小流程

```bash
git clone <your-repo>
cd <your-repo>
codex
```

一个推荐的首个提示词：

```text
请先阅读当前仓库结构，给出模块关系图、关键风险点和建议的首轮改进任务清单。
```

### 3.2 为什么强调“在仓库内启动”

- Codex 默认围绕当前工作目录理解上下文。
- `codex exec` 在自动化模式下默认要求在 Git 仓库内运行（防误操作）。
- 你可以用 `--cd`、`--add-dir` 控制作用范围，避免“改错目录”。

### 3.3 会话恢复（高频实用）

```bash
codex resume
codex resume --last
codex resume <SESSION_ID>
```

这能避免每次重新喂上下文，显著降低重复 token 消耗。

## 四、知识点 3：编写优秀的 AGENTS.md（模式与最佳实践）

### 4.1 AGENTS.md 的作用

AGENTS.md 是 Codex 的“长期行为约束 + 团队协作协议”载体。  
它会在任务开始前被读取，用于统一风格、流程、测试与安全边界。

### 4.2 指令发现与覆盖顺序（很关键）

Codex 会构建一条指令链，核心顺序是：

1. 全局层：`~/.codex/AGENTS.override.md`（若存在）否则 `~/.codex/AGENTS.md`
2. 项目层：从项目根目录走到当前目录，每层最多取一个（优先 override）
3. 合并规则：越靠近当前目录的文件，优先级越高

并且有大小上限（默认 `32 KiB`，可调 `project_doc_max_bytes`）。

### 4.3 实战写法模板

```md
# AGENTS.md

## 代码与工程约束
- 修改 JavaScript 后必须运行 npm test
- 新增依赖前先说明收益与风险
- 提交前执行 lint 与构建验证

## 输出与沟通约束
- 先给结论，再给证据
- 改动需附文件路径和验证命令

## 安全与边界
- 禁止删除生产数据
- 涉及密钥/凭据的操作必须先确认
```

### 4.4 常见误区

- 只写“目标”，不写“可执行约束”（例如缺少“改完必须跑什么命令”）
- 全局规则过重，导致所有仓库都被同一套细则拖慢
- 忘记分层（根目录 + 子目录 override），导致特定子项目规则失效

## 五、知识点 4：为环境配置 Codex

### 5.1 配置文件分层

- 用户级：`~/.codex/config.toml`
- 项目级：`<repo>/.codex/config.toml`

配置优先级（高到低）：

1. CLI flags / `--config`
2. `--profile` 对应配置
3. 项目级 `.codex/config.toml`（近目录优先）
4. 用户级配置
5. 系统级配置（如有）
6. 内置默认值

### 5.2 常用配置项（建议先掌握）

```toml
model = "gpt-5.2-codex"
approval_policy = "on-request"      # 常用：on-request / never
sandbox_mode = "workspace-write"    # 常用：read-only / workspace-write / danger-full-access
web_search = "cached"               # cached / live / disabled
model_reasoning_effort = "high"     # low / medium / high
```

### 5.3 审批与沙箱策略建议

- 开发日常：`on-request + workspace-write`
- 仅审阅/理解代码：`read-only`
- 自动化修复任务（受控 CI 环境）：`--full-auto + workspace-write`
- `danger-full-access` 只在隔离环境使用

### 5.4 规则系统（Rules）

可用 `.rules` 文件定义“哪些命令可无提示放行”：

```rules
prefix_rule(
  pattern = ["gh", "pr", "view"],
  decision = "prompt",
  justification = "查看 PR 需要确认"
)
```

建议只放行明确安全前缀，避免“宽匹配”。

## 六、知识点 5：提示模式（让结果更稳定）

> 视频提到“提示模式”，可落地理解为：把提示词组织成固定工作流，而不是随手一句话。

### 6.1 官方建议的提示原则

- 给可验证目标（复现步骤、测试命令、验收标准）
- 大任务拆小步（先计划后执行）
- 明确范围（哪些文件可改，哪些不能动）

### 6.2 推荐三段式提示模式

1. 计划模式（Plan）
2. 执行模式（Implement）
3. 验收模式（Verify）

示例：

```text
阶段1（计划）：
先不要改代码。请阅读 src/ 下相关模块，输出：
1) 根因假设
2) 最小改动方案
3) 风险点与回滚方案

阶段2（执行）：
只按方案做最小改动；不要重构无关文件。

阶段3（验收）：
运行 npm test 和 npm run build；列出结果与剩余风险。
```

### 6.3 线程与上下文管理

- 一个 Thread 可多轮跟进，不必每轮重开
- 避免多个线程同时改同一文件
- 上下文过长时 Codex 会做压缩，关键信息要反复显式重申

## 七、知识点 6：CLI 使用技巧（高频）

### 7.1 交互与快捷能力

- `codex`：进入 TUI
- `codex "..."`：单提示快速运行
- `/model`：切换模型
- `/permissions`：切换审批模式
- `/review`：本地代码审查
- `@文件名`：快速注入文件上下文
- `!命令`：执行本地 shell 命令并回注输出

### 7.2 图像与多模态输入

```bash
codex -i screenshot.png "解释这个报错"
codex --image img1.png,img2.jpg "对比这两版界面差异"
```

### 7.3 云任务能力

```bash
codex cloud exec --env ENV_ID "Summarize open bugs"
```

适合长任务与并行探索，再把结果应用回本地。

## 八、知识点 7：IDE 使用技巧（VS Code/Cursor/Windsurf）

### 8.1 上下文输入更高效

- 利用打开文件 + 选区自动上下文
- 在提示词中用 `@file` 精确引用

示例：

```text
请参考 @api.ts 和 @types.ts，把 @page.tsx 的请求改成分页模式，并补充错误处理。
```

### 8.2 模式与思考强度

- Chat：偏问答和方案讨论
- Agent：可读写与执行（默认）
- Agent (Full Access)：高权限模式，谨慎使用
- 推理强度：`low / medium / high`，复杂问题可上调到 `high`

### 8.3 IDE 云代理工作流

- 本地开题 -> Run in Cloud 跑重任务 -> 回本地验收与收尾
- 云任务会继承上下文，适合大规模修改与并行方案对比

## 九、知识点 8：高级工作流（无头模式 + SDK）

### 9.1 无头模式：`codex exec`

基础：

```bash
codex exec "summarize the repository structure"
```

结构化输出：

```bash
codex exec --json "summarize the repo structure" | jq
codex exec "Extract project metadata" --output-schema ./schema.json -o ./metadata.json
```

CI 场景常见组合：

```bash
codex exec --full-auto --sandbox workspace-write "<task>"
```

恢复上次无头会话：

```bash
codex exec resume --last "continue from previous run"
```

### 9.2 SDK：程序化调用 Codex

安装：

```bash
npm install @openai/codex-sdk
```

最小示例：

```ts
import { Codex } from '@openai/codex-sdk'

const codex = new Codex()
const thread = codex.startThread()
const result = await thread.run('Make a plan to diagnose and fix CI failures')
console.log(result)
```

继续同一线程：

```ts
await thread.run('Implement the plan')
```

恢复历史线程：

```ts
const thread2 = codex.resumeThread('<thread-id>')
await thread2.run('Pick up where you left off')
```

### 9.3 何时选 exec，何时选 SDK

- 只做自动化脚本/CI：优先 `codex exec`
- 需要在你自己的产品中嵌入 Codex：优先 SDK

## 十、建议学习路径（按视频顺序）

1. 先把 CLI 和 IDE 都跑通，完成一次真实仓库任务  
2. 写出你团队第一版 AGENTS.md（能约束测试、代码风格、安全边界）  
3. 把 `config.toml` 调到“可用且安全”的平衡点（推荐 `on-request + workspace-write`）  
4. 固化一套“三段式提示模式”（计划-执行-验收）  
5. 用 `codex exec` 做一个最小 CI 自动化任务  
6. 再决定是否引入 SDK 做平台级集成  

## 参考资料

- B 站视频：`https://www.bilibili.com/video/BV11erUBUEEX/`
- Codex CLI：`https://developers.openai.com/codex/cli`
- Codex CLI Features：`https://developers.openai.com/codex/cli/features`
- Codex IDE Extension：`https://developers.openai.com/codex/ide`
- Codex IDE Features：`https://developers.openai.com/codex/ide/features`
- AGENTS.md 指南：`https://developers.openai.com/codex/guides/agents-md`
- Config Basics：`https://developers.openai.com/codex/config-basic`
- Rules：`https://developers.openai.com/codex/rules`
- Prompting：`https://developers.openai.com/codex/prompting`
- Non-interactive mode：`https://developers.openai.com/codex/noninteractive`
- Codex SDK：`https://developers.openai.com/codex/sdk`
