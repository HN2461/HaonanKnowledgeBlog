// 仅保留“当天”的消息摘要。
// 后续主人说“汇总消息”时，Codex 会基于当天 git / 文件变动刷新这里的内容。
// 规则：
// 1. 只保留当天日期；若 date 不是今天，先清空旧内容再写新内容。
// 2. items 中每条消息都必须带 category，供通知中心分类展示。
// 3. Git 提交不写进这里，Git 会单独作为“Git 提交”分类展示。

export const dailyChangeSummary = {
  date: "2026-04-02",
  items: [
    {
      id: "2026-04-02-feature-notification-center",
      category: "功能更新",
      title: "头部消息通知中心已接入",
      summary: "新增铃铛入口、右侧抽屉和消息详情弹窗，可直接查看最近项目动态。",
      content:
        "头部新增通知入口，支持打开消息抽屉查看项目动态，并可点开查看完整消息详情。",
    },
    {
      id: "2026-04-02-feature-export-upgrade",
      category: "功能更新",
      title: "资料导出中心支持多选打包",
      summary: "导出弹窗已支持当前文章、当前目录和多篇文章打包导出。",
      content:
        "资料导出弹窗升级为双栏结构，支持单篇导出、整目录导出和多篇文档打包导出。",
    },
    {
      id: "2026-04-02-fix-export-panel",
      category: "问题修复",
      title: "导出弹窗滚动与选中样式已修复",
      summary:
        "修复了多选打包时右侧摘要溢出、勾选态杂乱和多滚动区域抢焦点的问题。",
      content:
        "优化导出弹窗的滚动层级、右侧摘要区域和勾选态表现，桌面端交互更加稳定。",
    },
    {
      id: "2026-04-02-feature-notification-drawer-wider",
      category: "功能更新",
      title: "消息通知抽屉加宽",
      summary: "消息抽屉宽度从 420px 调整为 520px，内容展示更宽裕。",
      content:
        "消息通知抽屉最大宽度由 420px 提升至 520px，移动端仍保持自适应全宽。",
    },
    {
      id: "2026-04-02-fix-notification-text-overflow",
      category: "问题修复",
      title: "消息卡片纯英文内容溢出已修复",
      summary:
        "标题与摘要加入 word-break 规则，长英文和 URL 不再撑出卡片边界。",
      content:
        "为消息卡片的标题和摘要添加 word-break: break-all 与 overflow-wrap: break-word，解决纯英文 Git 提交信息溢出问题。",
    },
    {
      id: "2026-04-02-fix-notification-hover-clip",
      category: "问题修复",
      title: "消息卡片悬浮截断已修复",
      summary: "鼠标悬浮时卡片不再被滚动容器裁切，改为垂直方向轻微上移效果。",
      content:
        "将 hover 动画从 translateX(-2px) 改为 translateY(-1px)，避免横向位移被 overflow-y 容器裁掉。",
    },
    {
      id: "2026-04-02-feature-history-notifications",
      category: "功能更新",
      title: "消息抽屉新增历史消息分类",
      summary:
        "新增 historyNotifications.js 归档文件，清空当日消息前可将内容存入历史，抽屉中永久可查。",
      content:
        "新增 data/historyNotifications.js 作为历史归档数据源，脚本自动读取并合并进通知 JSON，前端分类顺序同步更新，历史消息 tab 永久展示。",
    },
  ],
};
