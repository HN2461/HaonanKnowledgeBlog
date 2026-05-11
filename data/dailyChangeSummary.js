// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-11',
  items: [
    {
      category: '内容上新',
      time: '09:55',
      title: 'WebSocket 专题新增第9篇：AI流式传输深度解析',
      summary: '在项目复用技术/WebSocket 目录下新增《WebSocket与AI流式传输深度解析》，深度对比 SSE 与 WebSocket 两大方案，讲解 OpenAI、Google、Anthropic 等主流 AI 厂商的流式 API 实现，提供完整的前后端代码示例与最佳实践。',
      content: '第一点：创建 `public/notes/项目复用技术/WebSocket/09-WebSocket与AI流式传输深度解析_SSE对比_实现方案与最佳实践.md`，包含为什么 AI 需要流式传输、主流 AI 厂商方案（SSE 与 WebSocket 模式）、SSE vs WebSocket 深度对比表、前端实现方案（SSE fetch/EventSource 与 WebSocket 完整代码）、后端实现方案（Node.js + Express 的 SSE 和 WebSocket 服务端）、常见问题与解决方案（Nginx 代理、断线重连、UTF-8 编码、背压处理）、性能优化实践（TTFB、消息体优化、DOM 批处理）、安全考虑（Token 验证、CSWSH 防护、速率限制）等八大章节；第二点：文档基于 OpenAI 官方资料、WebSocket.org、Railway、GetStream 等权威来源，解释了为什么所有主流 AI 提供商都使用 SSE 作为默认流式传输协议，以及 WebSocket 在 Agent 多轮对话、工具调用、用户中断等场景的优势；第三点：提供了完整的前后端代码示例，包括 SSE 的 async generator 实现、WebSocket 的双向通信封装、服务端流式转发、心跳保活、断线重连等生产级代码；第四点：同步更新 `public/notes/项目复用技术/WebSocket/目录.md`，将第9篇加入推荐阅读顺序；第五点：执行 `npm run generate:index`，索引已更新（387篇笔记，86个分类）。'
    }
  ],
}
