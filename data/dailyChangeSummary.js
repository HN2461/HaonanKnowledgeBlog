// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-30',
  items: [
    {
      category: '内容上新',
      time: '17:33',
      title: '把 Claude Code 系列重构为程序员深度实战版',
      summary:
        '围绕 `public/notes/AI工具/02_终端Agent流/ClaudeCode/` 重新按程序员真实使用路径重写整组核心文章，重点补齐安装更新、终端英文提示、`CLAUDE.md`、配置作用域、工作流模板、skills/MCP/plugin 调用链与第三方线路判断，并清理掉价值偏弱的冗余第四篇；其中第七篇已进一步改成“终端界面逐屏翻译版”，第一篇与第七篇也继续补上以 Mermaid 文字图为主的图文速记块，现专题篇名也已按保留文章顺延整理为连续的第一篇到第六篇，这一轮还继续补写了主人截图里 `/agents`、`/effort`、`/background`、`/add-dir`、`/export`、`/loop`、`/simplify`、`/insights` 与 `claude agents/attach/logs/stop` 的官方性对照说明。',
      content:
        '第一点：重写 `public/notes/AI工具/02_终端Agent流/ClaudeCode/第一篇_ClaudeCode快速上手与工作原理_2026-03.md`，把内容从“新手导览”升级为程序员上手稿，并在后续继续压缩成更适合快速阅读的版本，重点保留 `npm` 安装更新、终端常见英文提示、权限模式与第一轮最小任务主线；第二点：重写 `第二篇_ClaudeCode功能全景与记忆机制_2026-03.md` 与原 `第五篇_ClaudeCode设置与个性化_2026-03.md`，把规则层、权限层、记忆层、扩展层拆开说明，重点补清 `CLAUDE.md`、`CLAUDE.local.md`、`.claude/rules/*.md` 的职责边界，明确 `@AGENTS.md` 的复用方式、memory 应沉淀什么信息、skills 与 hooks / MCP / plugins 的差异，以及 settings 的 `User / Project / Local / Managed` 作用域、模式选择、sandbox、模型、`effort` 与上下文的工程化理解；第三点：重写 `第三篇_ClaudeCode常见工作流与最佳实践_2026-03.md`，把内容升级成程序员日常任务模板库，系统补齐“看陌生仓库、修 bug、做重构、补测试、改文档、并行任务、会话管理”的可复用 prompt 骨架与验证方式；第四点：重写原 `第七篇_ClaudeCode的Skills_MCP_Plugin怎么安装调用与排错_2026-05.md`，把偏概念内容彻底改成“终端界面逐屏翻译 + 官方文档对照讲解”版本，围绕主人真实看到的 `/mcp`、`/skills`、`/plugin` 与斜杠命令列表，逐项解释 `connected`、`failed`、`plugin`、`locked by plugin`、`~40 tok`、`Discover`、`Installed`、`Errors` 等英文提示是什么意思，并补上“内置命令 / plugin skill / MCP prompt 怎么区分”和“装完后到底去哪一层调用”的最小判断法；这一次又继续补写“主人截图里这些命令哪些是官方的”小节，按官方 `commands`、`sub-agents`、`agents`、`agent-view`、`interactive-mode` 文档对 `/add-dir`、`/agents`、`/background`、`/effort`、`/export`、`/insights`、`/tasks`、`/loop`、`/simplify` 以及 `claude agents`、`claude attach <id>`、`claude logs <id>`、`claude stop <id>` 做了逐项对照，并补充 `Running / Library / Built-in (always available)`、后台 session shell 子命令、`Skill(update-config)` 权限提示应如何理解，以及把文末官方参考链接修正为真实可打开的 `skills`、`sub-agents`、`agents`、`agent-view`、`interactive-mode`、`model-config`、`scheduled-tasks` 等页面；第五点：将原 `第六篇_ClaudeCode接入智谱GLM与IDE插件_2026-03.md` 重写并改名为 `第六篇_ClaudeCode接入中转_LLMGateway与多模型线路实战_2026-03.md`，把方向从“GLM + IDE 判断”调整为更贴近真实使用场景的“Claude Code 接入中转、LLM Gateway 与多模型线路实战”，并补上手改 `settings.json`、多模型映射、CC Switch 场景和最小自检流程模板；第六点：重写 `public/notes/AI工具/02_终端Agent流/ClaudeCode/目录.md`，把整个系列按“跑通本体 -> 稳定主线 -> 加能力层 -> 再折腾扩展”的学习路径重排，并在这次继续把篇章顺序收整为连续编号：保留现有 6 篇文章，统一改成 `第一篇` 到 `第六篇`，同步完成文件名、frontmatter 标题、正文 H1、目录页文案和站内跳转链接改名；第七点：在中途试写过一版视频复盘型第四篇后，最终判断其信息与第一篇、第三篇重叠过高、独立价值偏弱，因此已删除 `第四篇_ClaudeCode从0到1全攻略_视频笔记_2026-03.md`，并同步从目录页与站内索引中移除入口；第八点：修复了 Claude Code 专题内一处误写成 `</Users/...>` 本地绝对路径的正文链接，改回站内 `#/note/...` 路由，并顺手对 `public/notes/` 做了本地路径链接体检，确认当前不再残留 `</Users/...>`、`/Users/...`、`C:\\...`、`file://...` 这类不该出现在站内文章里的本地路径链接；第九点：按仓库归档规则先将旧 `data/dailyChangeSummary.js` 中 `2026-05-27` 的摘要迁移到 `data/history/2026-05-21_30.js`，再重建今天摘要；第十点：执行 `pwsh -File scripts/checkNodeRuntime.ps1` 通过 Node 运行时预检，并持续刷新索引与通知，让站内搜索、目录与消息抽屉同步展示这轮 Claude Code 系列重构后的最终状态；第十一步：把第一篇和原第七篇里原本单独生成的 SVG 速认卡改回更适合笔记维护的 Mermaid 文字图，直接在正文里用可编辑语法展示欢迎页结构、终端状态词、快捷键分组、`/mcp` 阅读顺序、`/plugin` 安装判断、斜杠命令来源和详细转录阅读逻辑。',
    },
  ],
}
