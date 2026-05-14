// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-14',
  items: [
    {
      category: '内容上新',
      time: '11:22',
      title: '新增STOMP协议速查手册',
      summary: '在项目复用技术/WebSocket 目录下新增第10篇《STOMP协议速查手册》，用类比和最小记忆量把帧结构、核心命令、心跳协商、常见错误和调试清单讲清楚，适合长时间没碰 STOMP 后快速回忆。',
      content: '第一点：创建 `public/notes/项目复用技术/WebSocket/10-STOMP协议速查手册_帧结构命令心跳与调试清单.md`，定位为快速参考手册而非封装实战，目标是长时间没碰 STOMP 后翻阅即可快速回忆；第二点：手册内容涵盖一句话理解 STOMP、邮局类比概念映射、帧结构五个组成部分及记忆口诀、客户端与服务端核心命令速查、destination 三种类型（topic/queue/user）、心跳协商机制与超时规则、三个最容易出错的点（空行/大小写/结束符）、WebSocket 与 STOMP 分层关系、调试检查清单、前端使用模板（stomp.js 与 uni-app）、适用与不适用场景、五句核心要点总结；第三点：采用项目标准 Markdown 格式，包含规范的 YAML frontmatter（title、date、category、tags、description），标题、正文 H1 与 frontmatter 保持一致；第四点：将此前误放在 `public/notes/` 根目录的同名文件删除，按项目分类规范放入 `项目复用技术/WebSocket/` 目录；第五点：同步迁移 `data/dailyChangeSummary.js` 中 2026-05-12 的旧摘要到 `data/history/2026-05-11_20.js` 分片，并在 `data/historyNotifications.js` 中补充 import 和展开。'
    }
  ],
}
