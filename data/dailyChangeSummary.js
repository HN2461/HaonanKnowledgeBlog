// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-24',
  items: [
    {
      category: '功能更新',
      time: '21:09',
      title: '修正文档 frontmatter、MCP 导航归位与 Codex Plugin 官方口径',
      summary: '补齐 `AI工具` 目录下多篇缺 frontmatter 的正式文档与目录页，清理 Gemini 目录里重复错位的“谷歌MCP”正文副本，并按 OpenAI 官方资料修正 Codex Plugin 文章中的发布日期与规模口径。',
      content: '第一点：为 `public/notes/AI工具/01_AI编辑器流/` 下的 Cursor、Kiro、Trae、Windsurf 目录页补齐 frontmatter，为 `public/notes/AI工具/02_终端Agent流/Gemini/目录.md` 补齐 frontmatter，修复这些目录页在索引中只能回退到文件名显示的问题；第二点：将 `public/notes/AI工具/02_终端Agent流/Gemini/谷歌MCP_配置手册.md` 从重复正文改成导览说明页，明确真正的实操正文统一放在 `public/notes/AI工具/03_规则机制层/MCP/谷歌MCP_配置手册.md` 维护，避免搜索与列表出现两篇同内容同文件名文章；第三点：为 MCP 主文补齐 frontmatter，并把标题从“Codex MCP 复刻配置手册”校准为更符合目录语义的“谷歌 MCP 配置手册（Windows，Chrome DevTools MCP 复刻）”；第四点：为 `public/notes/AI工具/04_Agent框架层/龙虾/` 下 6 篇正式文章与 `目录.md` 统一补齐 frontmatter，修复站内索引里出现 `第一篇_OpenClaw...`、`第六篇_龙虾命令与配置文件一页速查图` 这类下划线文件名直出的问题；第五点：为 `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/对比报告/` 下两份 Node 环境报告补齐 frontmatter，让它们在站内搜索和详情页中显示为人类可读标题；第六点：将 `public/notes/AI工具/03_规则机制层/Plugin/02_Codex插件体系/第二篇_CodexPlugin体系详解与实战_2026-05.md` 中关于 Codex Plugin 的官方口径改为 2026-03-26 官方帮助中心更新，并把“100 万开发者”修正为基于 OpenAI 官方产品页可确认的“300 万+ 开发者每周使用 Codex”和“90+ 插件”；第七点：按仓库规则先把昨日 `data/dailyChangeSummary.js` 的 2026-05-23 三条摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的当日摘要。'
    }
  ],
}
