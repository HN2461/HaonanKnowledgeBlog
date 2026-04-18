// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-18',
  items: [
    {
      category: '内容上新',
      time: '15:24',
      title: '网络基础笔记重构为前端手册',
      summary: '将常用缺易忘/网络目录下的碎片短文收敛为两篇主线手册：《前端 HTTP 请求与接口联调手册》和《前端认证、安全与文件上传协作手册》，同步清理重复稿件。',
      content: '将 public/notes/常用缺易忘/开发的基础知识/网络 目录下按单点拆开的碎片短文（状态码、缓存、跨域、认证、上传下载、实时通信等）收敛为两篇按前端真实工作流组织的主线文章，删除重复碎片稿，目录结构更干净，搜索结果不再重复分散。'
    },
    {
      category: '内容上新',
      time: '18:00',
      title: 'Node.js 从零到实战系列 8 篇全部完结',
      summary: '新增 Node.js 系列第八篇《接口开发与会话控制》，至此 8 篇全部完成，覆盖 Buffer、fs、HTTP、模块化、npm、Express、MongoDB、RESTful 接口与 JWT 认证完整链路。',
      content: '新增第八篇，内容涵盖 RESTful 设计规范、apipost 测试工具、Cookie/Session/JWT 三种会话控制方案、bcrypt 密码加密、express-validator 参数校验、express-rate-limit 限流、helmet 安全头，以及完整的用户注册登录实战代码。系列基于 B 站课程 BV1gM411W7ex 与配套课件整理。'
    },
    {
      category: '功能更新',
      time: '18:37',
      title: 'Node.js 系列 8 篇深度升级：废弃标记 + 参数说明 + 最新特性',
      summary: '逐篇核查官方文档，标记废弃 API、补全函数参数说明、新增 Node.js 22+ 新特性和 Mongoose 9 变更，确保内容与当前最新版本一致。',
      content: '核查要点：① 废弃标记：buf.slice() 改 subarray()、fs.rmdir recursive 改 fs.rm()、Mongoose 7+ 移除回调、Mongoose 9 pre 中间件不再接收 next()、Express 5 移除 res.json(status,obj)/req.param() 等；② 参数补全：fs.readFile/writeFile/rm/createReadStream、http.createServer/listen、res.cookie、jwt.sign/verify 等所有主要函数；③ 新特性：Node.js 22 内置 fetch（稳定）/WebSocket 客户端/node:test 测试框架/SQLite（实验性）/TypeScript 直接运行（实验性）；④ npm 新增 exports 条件导出字段和 overrides 依赖覆盖字段；⑤ Mongoose 9 新增 Double/Int32 SchemaType，UUID 返回 bson.UUID 实例。'
    }
  ]
}
