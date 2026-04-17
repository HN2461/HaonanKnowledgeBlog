// 这里只保留“当天”的消息摘要。
// 主人说“汇总消息”时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-17',
  items: [
    {
      category: '内容上新',
      time: '14:34',
      title: '新增 uni-app 头像上传与圆形裁剪封装专题',
      summary: '项目复用技术目录下新增第 5 篇 uni-app 文章，系统整理头像修改场景里的选图、进入裁剪页、单指拖拽、双指缩放、Canvas 导出、上传回填和重复提交保护整条链路。',
      content: '今天在 public/notes/项目复用技术/uni-app 下新增了第 5 篇文章，主题聚焦“头像上传与圆形裁剪封装”。文章把头像修改这类高频需求拆成入口页、裁剪页、上传层和回填层四部分，重点讲清圆形裁剪框为什么更适合只做视觉提示、为什么最终上传圆形外接正方形图片、如何用 Canvas 实现拖拽缩放与导出，以及怎么用上传锁、事件回传和本地先回显来把这条链路做得更稳。'
    },
    {
      category: '功能更新',
      time: '14:34',
      title: '刷新项目复用技术目录的笔记索引',
      summary: '新增头像裁剪文章后同步重建 notes 索引，让首页、搜索和目录页都能立即检索到这篇新内容。',
      content: '今天新增头像上传与圆形裁剪文章后，同步刷新了 public/notes-index.json，对应的目录树、全文检索和分类列表都会立即收录这篇新文章，不需要再手动补列表数据。'
    },
    {
      category: '功能更新',
      time: '14:34',
      title: '通知中心同步归档 4 月 16 日摘要并切换到今日消息',
      summary: '将 2026-04-16 的内容摘要归档到历史消息，同时把通知中心的当日消息切换成今天的新上新记录，保证头部通知抽屉的时间线连续可查。',
      content: '今天按博客仓库的消息汇总规则，先把 2026-04-16 的摘要整体归档进 data/historyNotifications.js，再将 data/dailyChangeSummary.js 切换为 2026-04-17 的新消息，并重新生成通知数据，让通知中心既能看到今天新增的头像裁剪专题，也不会丢失昨天整组项目复用技术与 WebSocket 专题的历史记录。'
    },
    {
      category: '内容上新',
      time: '22:17',
      title: '新增 GitHub Pages 部署 Vue 项目教程',
      summary: 'Vue3 目录下新增一篇面向初学者的 GitHub Pages 部署教程，覆盖 Vite base、Hash 路由、手动分支部署、Actions 自动部署与常见问题排查。',
      content: '今晚在 public/notes/Vue/vue3 下新增“GitHub Pages 部署 Vue 项目完整教程”，把主人提供的部署流程整理成更适合博客阅读的完整笔记：从 npm run build、vite.config.js 的 base 配置、createWebHashHistory 路由模式讲起，再补充 dist 手动发布、GitHub Actions 自动部署、访问地址验证和页面空白、刷新 404、图片加载失败等排查清单。'
    }
  ]
}
