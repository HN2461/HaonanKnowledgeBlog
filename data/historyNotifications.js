// 历史消息归档。
// 每次清空 dailyChangeSummary.js 前，将当天的 items 逐条归档到这里。
// 推荐结构：
// 1. 以 date 为当天日期分组；
// 2. items 中每条都保留 time、title、summary；
// 3. content 可选，不写时默认沿用 summary。
export const historyNotifications = [
  {
    id: 'history-2026-04-02',
    date: '2026-04-02',
    items: [
      {
        time: '16:10',
        title: '资料导出中心升级为双栏结构',
        summary: '支持单篇、整目录与多篇打包导出，导出入口更清晰。'
      },
      {
        time: '19:58',
        title: '站点头部接入消息通知中心',
        summary: '通知抽屉与详情弹窗上线，最近动态可以直接在站内查看。'
      },
      {
        time: '21:07',
        title: '历史消息归档能力接入通知中心',
        summary: '当日消息开始支持归档回看，旧摘要不会再随着次日清空而消失。'
      },
      {
        time: '21:12',
        title: '消息抽屉宽度调整到 520px',
        summary: '抽屉阅读区变宽，长标题和长摘要的浏览体验更稳定。'
      },
      {
        time: '23:55',
        title: '修复消息卡片纯英文内容溢出',
        summary: '长英文和长路径不再把消息卡片撑破，列表排版更稳。'
      },
      {
        time: '23:56',
        title: '修复卡片 hover 裁切与导出弹窗摘要溢出',
        summary: '修掉 hover 位移被裁切和导出弹窗右侧摘要溢出的问题。'
      }
    ]
  }
]
