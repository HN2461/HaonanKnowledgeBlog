// 仅保留“当天”的消息摘要。
// 后续主人说“汇总消息”时，Codex 会基于当天 git / 文件变动刷新这里的内容。
// 规则：
// 1. 只保留当天日期；若 date 不是今天，先清空旧内容再写新内容。
// 2. items 中每条消息都必须带 category，供通知中心分类展示。
// 3. Git 提交不写进这里，Git 会单独作为“Git 提交”分类展示。

export const dailyChangeSummary = {
  date: '2026-04-02',
  items: [
    {
      id: '2026-04-02-feature-notification-center',
      category: '功能更新',
      title: '头部消息通知中心已接入',
      summary: '新增铃铛入口、右侧抽屉和消息详情弹窗，可直接查看最近项目动态。',
      content: '头部新增通知入口，支持打开消息抽屉查看项目动态，并可点开查看完整消息详情。'
    },
    {
      id: '2026-04-02-feature-export-upgrade',
      category: '功能更新',
      title: '资料导出中心支持多选打包',
      summary: '导出弹窗已支持当前文章、当前目录和多篇文章打包导出。',
      content: '资料导出弹窗升级为双栏结构，支持单篇导出、整目录导出和多篇文档打包导出。'
    },
    {
      id: '2026-04-02-fix-export-panel',
      category: '问题修复',
      title: '导出弹窗滚动与选中样式已修复',
      summary: '修复了多选打包时右侧摘要溢出、勾选态杂乱和多滚动区域抢焦点的问题。',
      content: '优化导出弹窗的滚动层级、右侧摘要区域和勾选态表现，桌面端交互更加稳定。'
    }
  ]
}
