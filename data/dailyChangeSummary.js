// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-30',
  items: [
    {
      category: '内容上新',
      time: '11:01',
      title: '新增《前端里的各种帧 Frame 全解》',
      summary: '在"常用缺易忘/浏览器与网络"下新增一篇系统梳理前端所有"帧"概念的文章，覆盖渲染帧、关键帧、rAF、调用栈帧、视频帧、iframe、媒体流帧、帧缓冲共 8 类。',
      content: '第一点：新增文章 `public/notes/常用缺易忘/浏览器与网络/前端里的各种帧_Frame全解.md`，系统梳理前端开发中所有叫"帧"的概念；第二点：覆盖渲染帧（60fps/16.7ms 帧预算、掉帧 jank）、CSS 关键帧（@keyframes）、Web Animations API 关键帧、requestAnimationFrame（与 setInterval 对比）、调用栈帧（Stack Frame、火焰图）、视频帧（canvas 抓帧、VideoFrame API）、iframe（内联框架、sandbox）、WebRTC 媒体流帧、WebGL 帧缓冲共 8 类；第三点：文章末尾附有一张树状总结图和快速记忆对照表，方便查阅。',
    },
    {
      category: '功能更新',
      time: '09:48',
      title: '精简 Node 问题目录并保留报告归档结构',
      summary: '保留 Node问题 下的对比报告目录结构，删除不再需要的对比入口模板文件，并重新生成笔记索引。',
      content: '第一点：保留 `public/notes/Node问题/对比报告/公司电脑/` 与 `public/notes/Node问题/对比报告/个人电脑/` 两个归档子目录，继续作为公司电脑基准报告和个人电脑报告的固定存放位置；第二点：删除 `public/notes/Node问题/对比入口模板_公司电脑_vs_个人电脑.md`，避免 Node问题 目录里多一份重复性的说明文档；第三点：同步更新 `public/notes/Node问题/目录.md`，移除已删除模板的入口，保持目录页只展示真正需要保留的内容；第四点：执行 `npm run generate:index`，确认删除模板后索引已刷新，当前总站笔记数更新为 338 篇。',
    },
  ],
}
