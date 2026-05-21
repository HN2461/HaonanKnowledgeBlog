// 历史消息归档 —— 2026-05-11 至 2026-05-20
// 归档时追加到本文件末尾的数组即可。
export const history_2026_05_11_20 = [
  {
    id: 'history-2026-05-11',
    date: '2026-05-11',
    items: [
      {
        category: '内容上新',
        time: '09:55',
        title: 'WebSocket 专题新增第9篇：AI流式传输深度解析',
        summary: '在项目复用技术/WebSocket 目录下新增《WebSocket与AI流式传输深度解析》，深度对比 SSE 与 WebSocket 两大方案，讲解 OpenAI、Google、Anthropic 等主流 AI 厂商的流式 API 实现，提供完整的前后端代码示例与最佳实践。',
        content: '第一点：创建 `public/notes/项目复用技术/WebSocket/09-WebSocket与AI流式传输深度解析_SSE对比_实现方案与最佳实践.md`，包含为什么 AI 需要流式传输、主流 AI 厂商方案（SSE 与 WebSocket 模式）、SSE vs WebSocket 深度对比表、前端实现方案（SSE fetch/EventSource 与 WebSocket 完整代码）、后端实现方案（Node.js + Express 的 SSE 和 WebSocket 服务端）、常见问题与解决方案（Nginx 代理、断线重连、UTF-8 编码、背压处理）、性能优化实践（TTFB、消息体优化、DOM 批处理）、安全考虑（Token 验证、CSWSH 防护、速率限制）等八大章节；第二点：文档基于 OpenAI 官方资料、WebSocket.org、Railway、GetStream 等权威来源，解释了为什么所有主流 AI 提供商都使用 SSE 作为默认流式传输协议，以及 WebSocket 在 Agent 多轮对话、工具调用、用户中断等场景的优势；第三点：提供了完整的前后端代码示例，包括 SSE 的 async generator 实现、WebSocket 的双向通信封装、服务端流式转发、心跳保活、断线重连等生产级代码；第四点：同步更新 `public/notes/项目复用技术/WebSocket/目录.md`，将第9篇加入推荐阅读顺序；第五点：执行 `npm run generate:index`，索引已更新（387篇笔记，86个分类）。'
      },
      {
        category: '问题修复',
        time: '22:44',
        title: '前端超级面试题汇总去重并合并重复内容',
        summary: '整理《前端超级面试题汇总》中的重复面试题段落，将 Vue2/Vue3、兼容性问题、定位字段等重复内容合并为更完整的主段落，在尽量不删内容的前提下提升文章连贯性。',
        content: '第一点：将 `public/notes/面试/超级面试.md` 中原本分散重复的 Vue2/Vue3 对比内容合并到"Vue2 和 Vue3 的区别、Vue3 的优势"主段落，保留响应式、Composition API、TypeScript、生命周期、指令、过渡类名、全局 API 等信息；第二点：调整 Vue 数据绑定实现原理一节，统一 Vue2 使用 `Object.defineProperty`、Vue3 使用 `Proxy` 的表述，避免前后内容冲突；第三点：把"定位功能所需字段"的两处重复答案合并，补齐精度、分页、筛选、上下文字段等细节；第四点：将零散的兼容性问题速答内容并入更完整的兼容性章节，删除纯重复版本；第五点：执行 `npm run generate:index`，同步更新 `public/notes-index.json` 与 `public/search-index.json`。'
      },
      {
        category: '问题修复',
        time: '22:47',
        title: '前端面试题题库及答案恢复详细原稿并改为保守整理',
        summary: '恢复《前端面试题题库及答案》的详细长文版本，并按保守整理方式补齐尾部空壳题与缺失答案，避免再以压缩重写方式处理正文。',
        content: '第一点：将 `public/notes/面试/面试题题库及答案.md` 从此前压缩后的结构化短版恢复为原先的详细题库正文，保留大体量内容、原有题号顺序和长篇答案表达；第二点：撤回"将长文重构成高频总表"的处理方式，避免因为去重过度导致文章信息密度和覆盖面下降；第三点：明确后续整理策略改为"保留详细内容为主，只做重复合并、错误修正、空壳题补答案和表述统一"，不再以压缩篇幅为目标；第四点：先对缺失最明显的条目做局部补全，补上第20题以及第194题到第236题之间原本只有标题没有答案的空壳题，内容涵盖动态路由、异步函数、登录权限、发布流程、白名单、大数据可视化、接口封装、微信小程序、支付、Hooks、uni-app、axios、ECharts、ElementUI 树控件、项目表达等高频问题；第五点：继续做第二轮保守去重，不删除正文大段内容，而是在重复题位置补充"合并记忆/补充版"说明，例如把第47题与第164题的 keep-alive、前面的循环遍历与第171题、前面的 map/forEach 与第172题、网络类问题与第174题、Vuex 刷新丢失与第175题做前后呼应，并补充 `v-el / this.$els` 属于早期写法、现代项目优先记 `ref / this.$refs` 的说明；第六点：补全和保守去重后重新生成索引，确保站内目录和搜索描述同步回到详细原稿并收录新增答案内容。'
      },
      {
        category: '问题修复',
        time: '22:52',
        title: '前端开发常见面试题详解去重并校正题量',
        summary: '整理《前端开发常见面试题详解》中的重复与不严谨表述，统一题目数量为 35 问，并修正 Vue、Promise、Token、WebSocket、布局方案等章节中的关键说法。',
        content: '第一点：将 `public/notes/面试/前端开发常见面试题详解 (60问).md` 重命名并整理为 `public/notes/面试/前端开发常见面试题详解 (35问).md`，同步统一 frontmatter 标题、正文 H1 与摘要描述，修复"实际只有 35 题但标题写成 60 问"的不一致问题；第二点：补充文章开头说明，明确当前内容按专题整理为 35 道高频题，并对重复表述做过合并；第三点：修正多处答案准确性，例如 Promise 状态统一为 `pending/fulfilled/rejected`，Vue 生命周期中移除错误的 `onCreated` 表述，明确选项式 API 与组合式 API 的区别，调整 computed/watch 示例避免冗余字段写法；第四点：优化 Vuex、JWT、Token 存储、Refresh Token、WebSocket、Flex/Grid/绝对定位、clearfix 等章节的边界与表述，减少不同题目之间的内容重复，同时补充更贴近真实项目与面试表达的说明；第五点：执行 `npm run generate:index`，同步更新 `public/notes-index.json` 与 `public/search-index.json`。'
      }
    ]
  },
  {
    id: 'history-2026-05-12',
    date: '2026-05-12',
    items: [
      {
        category: '内容上新',
        time: '17:16',
        title: '新增Git分支追踪与VSCode发布提示排障指南',
        summary: '在项目复用技术分类下新增Git专题文档，详细解决VSCode中"发布分支"提示问题的完整排障方案，涵盖分支追踪、upstream配置和fetch配置等核心知识点。',
        content: '第一点：创建 `public/notes/项目复用技术/Git/` 目录，用于存放Git相关的技术文档；第二点：将桌面上的《架构-Git分支追踪与VSCode发布提示-排障指南.md》重新整理格式，添加符合项目规范的YAML frontmatter，包含title、date、category、tags、description等字段；第三点：文档内容涵盖问题背景、适用范围、根本原因分析、完整的解决方案步骤（检查分支状态、确认远程分支、检查fetch配置、修复顺序、验证结果）、风险边界说明、验证方式和快速排查清单；第四点：将文档保存为 `Git分支追踪与VSCode发布提示-排障指南.md`，标签包括Git、VSCode、分支管理、排障指南、upstream；第五点：执行 `npm run generate:index`，索引已更新（388篇笔记，87个分类），新增Git分类可被站内搜索和分类浏览访问。'
      },
      {
        category: '问题修复',
        time: '20:55',
        title: '重写 HTML CSS 面试笔记为小白详细讲解版',
        summary: '在修正错误知识点的基础上，将 HTML CSS 面试题文档改写为更适合小白阅读的详细讲解风格，并继续补充 `defer/async`、语义化标签、viewport、HTML5 新特性、响应式图片、存储、iframe、回流重绘、媒体查询、Grid 等高频面试题。',
        content: '第一点：重写 `public/notes/面试/html+css面试.md`，保留原有问答结构，但将内容从偏精简的"面试标准答案稿"调整为更白话、更适合初学者理解的详细讲解版；第二点：在保持知识点正确的前提下，重点扩写 `DOCTYPE`、`alt/title`、`strong/em`、`src/href`、图片格式、SEO、盒模型、BFC、Flex、定位、隐藏方式、清除浮动等高频题，增加"先说结论、再解释原理、最后补面试回答方式"的表达；第三点：继续补充此前缺失但面试里常见的题目，包括 `defer` 与 `async`、HTML5 语义化标签、`meta viewport`、HTML5 新特性、空元素、`srcset/sizes`、`cookie/localStorage/sessionStorage`、`iframe`、`box-sizing`、`sticky`、回流与重绘、`z-index` 失效、`overflow`、`transition` 与 `animation`、媒体查询、响应式与自适应、圣杯布局、双飞翼布局、Grid 与 Flex 区别等，使整篇更完整，更适合作为 HTML 与 CSS 面试复习总稿。'
      },
      {
        category: '内容上新',
        time: '22:23',
        title: '扩充开发常用快捷键速查笔记',
        summary: '将开发常用快捷键速查从 Windows 与浏览器场景扩展到代码编辑器和 AI 编程工具，新增 VS Code、Cursor、Windsurf、Kiro、Codex CLI、Claude Code 等高频操作入口。',
        content: '第一点：更新 `public/notes/电脑/系统与文件/开发常用快捷键速查.md` 的 frontmatter 描述和正文开场，使文章覆盖范围明确包含 Windows、浏览器、代码编辑器与 AI 编程工具；第二点：新增代码编辑器通用快捷键，按文件与命令入口、代码编辑、搜索导航、面板终端、调试等场景整理 VS Code 风格高频组合；第三点：分别补充 VS Code、Cursor、Windsurf、Kiro、Codex CLI、Claude Code 的使用入口和常用命令，并说明编辑器型工具与终端 Agent 的使用差异；第四点：执行 `npm run generate:index` 重新生成 `public/notes-index.json` 与 `public/search-index.json`，保持站内分类和搜索索引同步。'
      },
      {
        category: '内容上新',
        time: '22:27',
        title: '完善 JavaScript 面试题复习文档',
        summary: '系统修正 JavaScript 面试笔记中的类型判断、事件循环、this、let/const、数组方法、深浅拷贝等易错表述，并补充 Promise、Fetch/Axios、跨域、Set/Map 新方法、性能优化和工程化相关高频追问。',
        content: '第一点：重写 `public/notes/面试/js面试.md` 正文，在保留原有面试题结构的基础上修正 `null`、`typeof`、原始类型、`this` 指向、同步异步、微任务宏任务、`let/const` 暂时性死区、`map/forEach`、`split` 方法归属、`Map.groupBy()` 等容易误导的知识点；第二点：补充更适合面试回答的代码示例和解释，包括数组去重、事件委托、本地存储、作用域链、变量提升、原型链、闭包、内存泄漏、深拷贝、防抖节流、懒加载和预加载；第三点：扩展 ES 新特性与工程化内容，新增 Promise 组合方法、`async/await`、Ajax/Fetch/Axios、跨域、`Set/Map/WeakMap`、`Proxy/Reflect`、`Object.fromEntries()`、`matchAll()`、`Error cause`、`Intl`、HMR、性能优化和垃圾回收机制等高频追问。'
      }
    ]
  },
  {
    id: 'history-2026-05-14',
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
    ]
  },
  {
    id: 'history-2026-05-16',
    date: '2026-05-16',
    items: [
      {
        category: '内容上新',
        time: '23:20',
        title: '新增Git认证与账号密码辨析文档',
        summary: '在项目复用技术/Git 目录下新增一篇面向初学者的 Git 认证说明文，系统讲清 Git 本身、GitHub/Gitee/公司平台账号、HTTPS、SSH、Token 与 user.name/user.email 的边界，并补充 Git 专题目录页。',
        content: '第一点：新增 `public/notes/项目复用技术/Git/Git账号密码到底是什么_Git平台认证_HTTPS_SSH_Token全解.md`，围绕“拉代码时到底在验证谁”展开，系统拆解 Git 工具、代码托管平台、HTTPS 与 SSH 两种协议、平台密码与 Token、SSH key、本地提交署名 `user.name`/`user.email` 之间的区别；第二点：文章重点解释“Git 本身没有统一账号密码”“拉个人仓库和公司仓库为何要用不同身份”“QQ 邮箱可能只是平台注册邮箱或提交署名邮箱”“为什么同一台电脑会对不同仓库弹出不同认证方式”，并给出 `git remote -v`、`git config --global user.name`、`git config --show-origin --get-all credential.helper`、`ssh -T` 等排查命令；第三点：补充 `public/notes/项目复用技术/Git/目录.md`，将 Git 专题整理成可浏览的目录页，明确先看认证辨析再看分支追踪排障的阅读顺序；第四点：按协作规则将旧的 `data/dailyChangeSummary.js` 中 2026-05-14 摘要迁移归档到 `data/history/2026-05-11_20.js`，并将当日摘要重置为 2026-05-16 的本次内容。'
      }
    ]
  },
  {
    id: 'history-2026-05-19',
    date: '2026-05-19',
    items: [
      {
        category: '内容上新',
        time: '20:52',
        title: '补充统一登录中心与内外部系统跳转说明',
        summary: '新增并持续打磨一篇第三方登录对比笔记，用更容易理解的语言解释公司统一登录页如何既支持进入自己项目内的子系统，也支持跳转并登录公司对接的外部第三方系统。',
        content: '第一点：新增 `public/notes/项目复用技术/第三方登录对接/99-对比笔记/统一登录中心与子系统切换实战说明.md`，把“登录页选子系统，登录后当前标签页直接进入目标系统”的场景拆解为统一登录中心、一次性票据和子系统回跳换票三层；第二点：在原有 SSO 说明基础上补充“更白的话”版本，明确区分两类目标系统：一类是你们自己项目里的子系统或公司内部业务站点，另一类是公司对接的外部第三方系统，并解释二者在用户体验上看起来一样、但技术链路上一个可能是内部路由跳转、另一个通常是先换授权码再跳转；第三点：继续优化文档阅读体验，新增“零、先记最短版”“它和企业微信、微信、QQ 官方登录其实很像”“把几个名词翻译成人话”“钥匙/临时通行证”的类比解释，以及“第一次做这类功能最容易绕的三句话”，降低第一次阅读时的理解门槛；第四点：按“遗忘后快速复习”的场景再补一层复习入口，新增“先看哪里”“零点五、3 分钟回想卡片”和文末“复习时最该记住的 4 个关键词”，让后续回看时不用从头读完整篇也能迅速捡回主线；第五点：结合 `wisdomCampusClient` 现有登录代码补充实战说明，说明登录页应用下拉如何决定跳转目标、如何识别带 `secretID + redirectUrl` 的单点中转链接，以及如何通过 `thirdpartyapp.authorize` 获取一次性 `code` 后再交给目标系统建立自己的登录态；第六点：同步更新 `public/notes/项目复用技术/第三方登录对接/README.md` 的目录入口，并重新生成 `notes-index.json` 与 `search-index.json`，当前索引统计为 393 篇笔记、87 个分类。'
      },
      {
        category: '内容上新',
        time: '17:07',
        title: '补充模块导入路径解析专题并解释 index.js 命中逻辑',
        summary: '更新前端模块化笔记，新增“为什么 import 目录路径不会自动命中 index.vue”的专题说明，按 Node、Webpack、Vite 三种环境拆分解析规则，并给出快速排查清单。',
        content: '第一点：更新 `public/notes/我的总结/JS/辅助资料/16_前端模块导入与导出.md`，新增“十二、为什么 `import componentsMap from \'./widgets/components\'` 不是 `index.vue`”章节，围绕“目录导入由工具链解析规则决定，不是靠直觉”展开讲解；第二点：章节中补充 Node ESM、Webpack、Vite 三种环境的解析差异，说明为何常见情况下会优先命中 `index.js`，并解释 `require.context` 场景下的组件映射输出与动态组件渲染关系；第三点：新增一套可执行排查清单（路径省略检查、同目录入口文件检查、resolve 配置检查、Webpack/Vite 动态导入机制检查），帮助快速定位类似“以为走 index.vue 实际走 index.js”的问题；第四点：执行 `npm run generate:index` 重新生成笔记与搜索索引，当前索引统计为 392 篇笔记、87 个分类。'
      }
    ]
  }
]
