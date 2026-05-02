// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-02',
  items: [
    {
      category: '功能更新',
      time: '15:40',
      title: '组件库专题目录已统一收口',
      summary: '将 ElementPlus 和 uvui 统一迁入 `public/notes/组件库/`，新增组件库总目录，为后续继续扩充 ECharts 图表专题预留同层结构。',
      content: '第一点：新建 `public/notes/组件库/` 一级目录，并把原来的 `public/notes/ElementPlus/` 与 `public/notes/uvui/` 整体迁入其中，避免 PC 端组件库和移动端组件库继续分散在根层；第二点：补充 `public/notes/组件库/目录.md`，把 `ElementPlus`、`uvui` 与未来可继续扩展的 `ECharts` 放在同一专题入口下，方便后续按组件库主题持续补文；第三点：后续重新生成 notes 索引后，站内分类页会自动跟随新的目录结构收口，便于统一浏览与维护。',
    },
  ],
}
