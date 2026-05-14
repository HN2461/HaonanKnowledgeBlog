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
    },
    {
      category: '问题修复',
      time: '21:01',
      title: '校准WebSocket专题中的协议级表述',
      summary: '修正 WebSocket 专题里几处容易误导读者的协议表述，重点收紧 STOMP ACK/NACK、destination 语义、WebSocket message 与 STOMP frame 的边界关系，以及 permessage-deflate 和二进制 body 的说明。',
      content: '第一点：更新 `03-StompClient封装实战`，把“一条 STOMP frame 分两条 WebSocket message 发”改为“一个 WebSocket message 只承载半个 STOMP frame，下一条消息继续补完”，避免把浏览器 WebSocket API 的 message 边界说错；第二点：更新 `10-STOMP协议速查手册`，将 ACK 示例改为 STOMP 1.2 风格的 `id` header，并补充说明旧项目里可能出现 `subscription` / `message-id` 的历史写法，同时把 topic / queue / user 从“协议固定分类”改为“常见 broker 约定”；第三点：更新 `11-WebSocket性能优化与高并发实战`，把 permessage-deflate 的描述从“每条帧自动压缩”校准为“按协商结果对 message 进行压缩”，把握手校验改成“协商成功”，删除不严谨的 Spring Boot compression 配置示例，补充“STOMP 本身支持二进制 body，但文本解析封装不能直接当文本发”的说明，并同步收紧核心要点总结里的绝对化表述。'
    },
    {
      category: '内容上新',
      time: '21:14',
      title: '完善前端里的各种帧全解文章',
      summary: '扩充《前端里的各种帧——Frame 全解》，收紧渲染帧与 requestAnimationFrame 的绝对化表述，补充 iframe sandbox 风险提示，并新增一节 WebSocket 数据帧，打通渲染、媒体与网络协议三类“帧”的认知边界。',
      content: '第一点：更新 `public/notes/常用缺易忘/浏览器与网络/前端里的各种帧_Frame全解.md` 的 frontmatter，为文章补充 `WebSocket` 标签，并把 description 从“渲染/关键帧/调用栈帧/视频帧/iframe”扩展到包含“WebSocket 数据帧”；第二点：在渲染帧部分把“浏览器自身约 6ms、留给开发者约 10ms”的固定口径改为更稳妥的预算表达，强调 `16.7ms` 是理论上限、真实页面里样式/布局/绘制/合成也会占时间；第三点：在 `requestAnimationFrame` 部分收紧与 `setInterval` 的对比，改成“后台页通常会被节流，但不和渲染帧对齐”，并新增“一个常见误区”小节，说明 rAF 并不会自动避免强制同步布局，仍需遵守先读后写的顺序；第四点：在 iframe 小节补充 `allow-scripts + allow-same-origin` 同时开启会显著降低隔离强度的风险提示；第五点：把“WebRTC / 媒体流帧”更准确地改成“媒体流帧（本地采集 / WebRTC 传输场景）”；第六点：新增“网络协议里的帧（WebSocket Frame）”一节，系统讲清 `WebSocket frame`、`WebSocket message`、`STOMP frame` 三层概念边界、常见帧类型、DevTools 观察方式和最常见误区；第七点：同步更新文章的一张图总结与快速记忆表，让新加的网络协议帧视角和原有渲染/动画/媒体/iframe/WebGL 结构保持一致。'
    },
    {
      category: '问题修复',
      time: '21:30',
      title: '校准 Codex 专题中的官方版本口径',
      summary: '批量更新 AI工具/Codex 目录下主线笔记，去除过时的默认模型与旧命令说法，补充 2026-05 官方页面校准结果，并清理本地数据目录文章中的敏感 key 示例。',
      content: '第一点：更新 `public/notes/AI工具/Codex/第二篇`、`第三篇`、`第五篇`、`第八篇` 等主线文档，把旧的 `gpt-5.4` 默认推荐口径统一收紧为“先看官方最新模型指南与当前线路实际可用模型”，并将示例默认模型改为 `gpt-5.3-codex`，避免继续把历史示例当成固定结论；第二点：同步修正文档中的旧命令表述，将 `--full-auto` 改为“旧资料常见兼容写法，当前更建议显式写 `--sandbox workspace-write --ask-for-approval on-request`”，并补充当前官方 slash commands 中更常见的 `/goal`、`/personality`、`/fast` 等命令，替换 `plan-mode` 这类过时写法；第三点：更新多篇关于认证的说明，明确登录缓存可能落在 `~/.codex/auth.json` 或系统 keyring，收紧“把 `auth.json` 放进项目目录覆盖”的不安全表述；第四点：清理 `第九篇_Codex本地数据目录详解` 里直接暴露的真实 key 与 bearer token，全部改为脱敏示例，并把模型迁移示例从 `gpt-5.2-codex -> gpt-5.3-codex -> gpt-5.4` 收紧为更稳妥的历史迁移说明；第五点：更新 `public/notes/AI工具/Codex/目录.md`，把总目录标题改为 2026-05 校准版，并补充“涉及默认模型、slash commands、认证方式时优先核对 OpenAI 官方当前页面”的维护约定。'
    }
  ],
}
