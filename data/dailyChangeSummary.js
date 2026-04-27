// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-27',
  items: [
    {
      category: '内容上新',
      time: '11:41',
      title: 'Git 命令速查与常见问题笔记',
      summary: '新增 Git 命令行速查手册，覆盖日常操作、分支管理、撤销回退、VSCode 按钮对照表，以及国内连不上 GitHub 443 端口的多种解决方案。',
      content: '第一点：在 public/notes/常用缺易忘/技术/ 下新增《Git命令速查与常见问题.md》，内容包含日常基础操作（status/add/commit/pull/push）、分支操作、撤销回退、远程仓库管理、stash 暂存、SSH Key 配置；第二点：专门整理国内连不上 GitHub 443 端口的排查步骤，涵盖清残留代理、ghproxy 镜像、SSH 协议切换、梯子代理配置四种方案；第三点：附 VSCode 插件按钮与命令行对照表，方便从点按钮过渡到命令行操作；第四点：重新生成 notes-index.json 索引，总笔记数 324 篇。',
    },
    {
      category: '内容上新',
      time: '14:04',
      title: 'AI开发基础：Token、输入输出与缓存计费全解（2026-04最新版）',
      summary: '新增并更新 AI 开发必备基础知识文档，基于 2026-04 最新定价数据，覆盖 OpenAI GPT-5 系列、Claude 4.6、Gemini 2.5 最新价格，以及 Claude 双 TTL 缓存机制、OpenAI 缓存升至 90% 折扣等最新变化。',
      content: '第一点：在 public/notes/AI工具/ 下新建《AI开发基础》目录，新增第一篇《Token、输入输出与缓存——AI开发计费全解》；第二点：价格表更新为 2026-04 最新数据，包含 GPT-5.5/5.4/5.4mini、GPT-4.1 系列（1M上下文）、Claude Opus/Sonnet/Haiku 4.x、Gemini 2.5 Pro/Flash 全系列；第三点：更新 Prompt Caching 对比，OpenAI 缓存折扣已升至 90%（原为50%），Claude 新增 1小时 TTL 选项（写入成本+100%，读取仍为10%）；第四点：补充 Claude 4.6 的 1M 上下文于 2026-03-13 正式 GA 的信息；第五点：新增 Claude vs OpenAI 缓存设计差异对比表（手动标记 vs 自动检测）；第六点：重新生成 notes-index.json 索引，总笔记数 325 篇。',
    },
    {
      category: '内容上新',
      time: '14:14',
      title: '中转站、CC Switch 与开发计费规则说明补全（2026-04核对）',
      summary: '新增两篇面向开发者的说明文档，一篇系统解释中转站、官转、余额、倍率、缓存、长上下文和买前排查问题，一篇落到 CC Switch 的 Provider 配置、模型映射、余额与用量排查，统一按 2026-04-27 官方资料重新核对。',
      content: '第一点：在 public/notes/AI工具/AI开发基础/ 新增第二篇《中转站、官转与计费规则到底怎么回事》，把官方计费层、中转售卖层、客户端耗费层拆开解释，并给出买前买后 10 个必问问题；第二点：按 OpenAI、Anthropic、Gemini 最新官方定价页和缓存文档核对输入、输出、缓存、长上下文、Batch、搜索等关键规则，避免把中转站报价和上游成本混为一谈；第三点：在 public/notes/AI工具/CC Switch/ 新增第二篇《CC Switch 接入中转站与计费排查实战》，把卖家手册翻译为 Base URL、API Key、模型 ID、余额与限速等实际配置项；第四点：补充 OpenRouter credits 与 BYOK 费用、CC Switch 最新 Releases 中的余额可视化、用量追踪、模型自动发现等开发相关信息；第五点：同步更新 AI开发基础 与 CC Switch 的目录页，方便后续检索与串联阅读。',
    },
  ],
}
