// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-06-05',
  items: [
    {
      category: '内容上新',
      time: '17:09',
      title: '核对并完善 Node.js 系列资料时效性',
      summary:
        '按官方资料重新核对 Node.js 系列笔记，把版本基线更新到 Node.js 24 LTS，补充 Node 26 Current、Node 20 EOL、Express 5、Mongoose 9 等最新状态，并移除容易误导的新旧写法混用。',
      content:
        '第一点：更新 `public/notes/Node.js/目录.md`，新增官方核对来源表，明确 Node.js 24 LTS 是学习和生产新项目基线，Node.js 26 属于 Current / Latest 线，Node.js 20 已 EOL；第二点：修订 `第一篇_Node.js入门与Buffer_2026-04.md`，更新安装建议、npm 版本提示、Node.js 新能力状态，并把 Buffer 旧 API 说明改成更准确的废弃 / 兼容提醒；第三点：修订 `第五篇_npm包管理与nvm版本管理_2026-04.md`，把旧教程中的 Node 14/22 示例改为历史项目与当前 LTS 的区别，补充 2026-06-05 的版本判断说明；第四点：修订 `第六篇_Express框架全解_2026-04.md`，按 Express 5 官方迁移思路强化通配路由、Promise 错误处理、Node 版本要求等重点；第五点：修订 Mongoose 相关两篇文章，明确 Mongoose 9 要求 Node.js 20.19+，建议搭配 Node.js 24 LTS；第六点：移除 Node.js 两篇 Markdown 文件头 BOM，并按规则归档 2026-06-04 的旧日报摘要。',
    },
  ],
}
