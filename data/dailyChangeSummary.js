// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-01',
  items: [
    {
      category: '内容上新',
      time: '14:22',
      title: 'MiMo Token Plan 接入说明已归档到 CC Switch 知识库',
      summary: '将根目录草稿整理为 CC Switch 第三篇正式笔记，按 MiMo 官方 Claude Code 与 Token Plan 文档核对 tp/sk 区分、区域 Base URL、模型映射、使用边界与 CC Switch 同步排查要点，并同步更新目录与通知归档。',
      content: '第一点：新增 `public/notes/AI工具/CC Switch/第三篇_ClaudeCode对接小米MiMoTokenPlan配置说明_2026-05.md`，将原始草稿整理成带 frontmatter 的正式知识库文章；第二点：补入 MiMo 官方文档明确写到、但原稿里未完整覆盖的边界条件，包括 `sgp/ams` 区域地址、`tp-` 与 `sk-` 不能混用、Token Plan 仅限编程工具场景、Key 仅在订阅有效期内可用；第三点：把“模型映射四项都配齐”的结论改写为“官方示例 + 实战推断”口径，避免把一次性经验误写成无条件官方定论；第四点：同步更新 `public/notes/AI工具/CC Switch/目录.md`，将这篇文章挂入现有 CC Switch 学习目录；第五点：按仓库规则将 2026-04-30 的旧日摘要归档到 `data/history/2026-04-21_30.js`，并刷新当天摘要内容。',
    },
    {
      category: '内容上新',
      time: '15:01',
      title: 'CC Switch 跨电脑导出导入与云同步教程已补入专题',
      summary: '新增 CC Switch 第四篇笔记，基于官方 README、Settings 手册与 Configuration Files FAQ 核对导出/导入、设备级设置边界、自动备份与 WebDAV/云盘同步能力，整理出适合多电脑多中转用户的迁移流程。',
      content: '第一点：新增 `public/notes/AI工具/CC Switch/第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`，明确回答“CC Switch 是否支持一键导出导入完整配置”；第二点：把官方已明确写出的关键边界单独拆出来说明，包括“导入会覆盖现有配置，不是自动合并”“`~/.cc-switch/settings.json` 属于设备级设置，不跨设备同步”“导入前会自动创建安全备份并默认保留最近 10 个”；第三点：结合 README 中的 Cloud Sync、Custom config directory、WebDAV 与 Shared Config Snippet 说明，给出手动主版本分发、云盘目录同步、WebDAV 自动同步三种适用场景；第四点：同步更新 `public/notes/AI工具/CC Switch/目录.md`，把跨电脑迁移主题纳入现有学习目录。',
    },
  ],
}
