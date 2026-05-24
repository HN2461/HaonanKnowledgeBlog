// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-24',
  items: [
    {
      category: '问题修复',
      time: '21:19',
      title: '修复个人角落弹层在笔记页被遮挡',
      summary: '为头部“角落”弹层补上独立层级和小屏高度兜底，避免在文章详情页被吸顶条或其它浮层压住。',
      content: '第一点：在 `src/components/AppHeader.vue` 为 `corner-popover` 补充显式 `z-index`，让 Teleport 到 `body` 的个人角落面板稳定高于笔记页吸顶条与内容层；第二点：补充 `max-height` 和 `overflow-y: auto`，让窄屏或较矮视口下的天气、提醒、问候内容可以完整显示并支持内部滚动；第三点：同步按仓库规则把昨日 `2026-05-23` 的三条开发摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的 `data/dailyChangeSummary.js`。'
    }
  ],
}
