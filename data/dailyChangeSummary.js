// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-08',
  items: [
    {
      category: '问题修复',
      time: '09:18',
      title: '修复打包后通知中心缺失当日摘要',
      summary: '将 `2026-05-07` 的当日摘要归档到历史分片，并将 `dailyChangeSummary` 切换到 `2026-05-08`，解决构建后只显示 Git/历史消息导致的异常观感。',
      content: '第一点：排查 `scripts/notificationTransforms.js` 后确认脚本只会展示“当天日期”的 `dailyChangeSummary`，因此 `data/dailyChangeSummary.js` 仍停留在 `2026-05-07` 时，会在打包后被自动过滤；第二点：按仓库归档规则把 2026-05-07 的 6 条摘要完整迁移到 `data/history/2026-05-01_10.js` 新增的 `history-2026-05-07` 分组，保留 `category/time/title/summary/content` 明细字段；第三点：重置 `data/dailyChangeSummary.js` 为当天日期 `2026-05-08` 并写入本次修复记录，保证通知中心构建产物与“仅展示当天摘要”的规则一致。'
    }
  ],
}
