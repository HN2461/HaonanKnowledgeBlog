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
    },
    {
      category: '功能更新',
      time: '15:08',
      title: '新增通知消息更新技能',
      summary: '创建 .catpaw/skills/notification-update 技能，将消息更新全流程（写入每日摘要、归档历史分片、生成通知索引、汇总消息、添加手动公告）封装为可复用的技能文件，后续只需调用即可自动完成整个更新流程。',
      content: '第一点：创建 `.catpaw/skills/notification-update/SKILL.md`，遵循 CatPaw 技能规范，包含 YAML frontmatter（name: notification-update，description 描述技能用途与触发场景）；第二点：技能涵盖五个核心流程——流程一：写入当日变更摘要（前置日期检查、写入规则、同对话合并、时间必须执行命令获取、category 四选一、模板示例）；流程二：归档旧消息（分片命名规则、迁移条目不得压缩改写、同日期对象合并、更新 historyNotifications.js 的 import 和展开、清空旧摘要）；流程三：生成通知索引（npm run generate:notifications 和 npm run generate:index）；流程四：汇总消息（用户主动触发时的 git 变动查看和刷新逻辑）；流程五：添加手动公告（manualNotifications.js 的写法和约束）；第三点：提供完整工作流 Checklist，确保执行顺序不会遗漏步骤；第四点：所有规则与 AGENTS.md 中的消息汇总协作规则保持一致，技能只是将分散在 AGENTS.md 中的规则集中为可复用流程。'
    },
    {
      category: '内容上新',
      time: '15:29',
      title: '新增WebSocket性能优化与高并发实战',
      summary: '在项目复用技术/WebSocket 目录下新增第11篇《WebSocket性能优化与高并发实战》，覆盖单连接vs多连接拆分、permessage-deflate压缩、二进制帧vs文本帧、大消息分片、前端消息节流渲染、内存泄漏排查、Vue/uni-app组件频繁挂载卸载时的连接管理。',
      content: '第一点：创建 `public/notes/项目复用技术/WebSocket/11-WebSocket性能优化与高并发实战_单连接拆分_压缩_节流_内存泄漏与组件生命周期.md`，定位为性能优化实战篇，连接前面封装篇讲完"怎么连"之后回答"跑得稳不稳、快不快"的问题；第二点：全文九章，依次为——单连接vs多连接（决策树、拆分时机、ConnectionPool管理）、permessage-deflate压缩（原理、Nginx/Node.js/Spring配置、应用层pako退路）、二进制帧vs文本帧（性能对比、Protobuf完整示例、场景选择表）、大消息分片策略（应用层分片协议、发送端分片、接收端ChunkReassembler重组、分片大小选择）、前端消息队列与节流（四种方案：缓冲+定时批量、requestAnimationFrame、虚拟列表、采样聚合）、内存泄漏排查（五种常见泄漏模式、Chrome DevTools排查步骤、useAutoCleanup防御性Composable）、Vue/uni-app组件频繁mount/unmount时的连接管理（应用级vs页面级连接生命周期、KeepAlive处理、小程序onShow保活）、完整性能检查清单、核心要点总结；第三点：同步更新目录文件 `目录.md`，补充第10篇和第11篇的链接及描述，新增三条回看场景；第四点：运行 `npm run generate:index` 重新生成索引，新文章已正确收录。'
    }
  ],
}
