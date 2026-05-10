// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-10',
  items: [
    {
      category: '功能更新',
      time: '18:39',
      title: '重做书签分类规则并核对 174 条链接完整性',
      summary: '确认书签源 HTML 与站内 JSON 均为 174 条、零缺失零多出，并将分类逻辑改为按原目录、域名和标题三层判断，集中修正 CSDN、DCloud、Language Reactor 等归类错误',
      content: '第一点：核对 `bookmarks_2026_5_9.html` 与 `public/bookmarks-index.json` 后确认源书签与生成结果均为 174 条，`missingInJsonCount` 与 `extraInJsonCount` 都为 0，这次没有删掉主人的任何网址；第二点：重写 `scripts/bookmarkCatalogRules.js`，不再靠一层粗关键词全局匹配，而是按“人工修正规则优先 -> 原目录路径 -> 域名集合 -> 标题关键词”的顺序分类，将书签重新整理为 AI 模型与对话、AI 编程与 Agent、AI API 与服务商、前端框架与工程化、UI 组件与样式、开发文档与教程、开发社区与代码托管、在线工具与效率、网络 / VPN / 云服务、个人 / 工作 / 校园入口等 15 组；第三点：重点修正了此前最明显的误判，例如把 `csdn.net` 从 AI 类移回开发社区，把 `uniapp.dcloud.net.cn`、`dev.dcloud.net.cn`、`ext.dcloud.net.cn` 从 VPN 类移回移动端与开放平台，把 `languagereactor.com` 从网络类移回在线工具，把 `mixamo.com` 调整到可视化 / 3D / 动画，并保留全部书签不隐藏；第四点：补充并更新 `scripts/__tests__/bookmarkCatalogRules.test.js`，覆盖 Vite 官方文档、站酷案例、AI API 面板、公司登录入口、CSDN 社区入口与 DCloud 文档等关键场景；第五点：重新执行 `npm run generate:bookmarks` 与 `npm test`，当前 18 个测试文件、94 个测试全部通过。'
    },
    {
      category: '内容上新',
      time: '19:49',
      title: 'Vue 总结新增第13篇：虚拟DOM、Diff、编译优化与面试补充',
      summary: '深度通读主人 Vue 总结目录后，发现前12篇已覆盖响应式、生命周期、组件通讯（含 Vuex/Pinia、插槽、refs）、Composition API 等绝大多数面试点，仅缺少虚拟DOM/Diff原理、Vue3 编译期优化、nextTick、性能优化清单、Teleport/Suspense/Fragment、MVVM/SPA 概念这些底层与面试加分项，因此新增一篇综合补充篇，并同步更新目录与笔记索引。',
      content: '第一点：在 `public/notes/我的总结/Vue/vue辅助/` 下新增 `第13篇_虚拟DOM_Diff_编译优化与面试补充.md`，包含十大章节——虚拟 DOM 与 VNode 本质、Vue2 双端 Diff 与 Vue3 快速 Diff（最长递增子序列）、key 的本质作用与不能用 index 的原理示例、Vue3 编译期四大优化（静态提升 / PatchFlag / Block Tree / cacheHandlers）、nextTick 异步队列与降级策略、按渲染层/响应式层/组件层/构建层分类的性能优化清单、Teleport/Suspense/Fragment 三剑客、MVVM/SPA/SSR 概念题、面试高频追问 Q&A 表、知识图谱 mermaid 图；第二点：补全 `public/notes/我的总结/Vue/Vue.md` 目录，把此前漏列的第12篇补回，同时把第13篇加入；第三点：执行 `npm run generate:index`，`public/notes-index.json` 与 `public/search-index.json` 同步刷新，新文章可被列表与搜索页正确检索。'
    },
    {
      category: '内容上新',
      time: '19:53',
      title: '补齐 JavaScript 面试补强专题 3 篇并扩展目录到 25 篇',
      summary: '围绕主人当前 JS 总结中最容易在面试追问时断层的部分，新增执行上下文、对象系统、高频手写题 3 篇专题框架，并把 JS 学习目录扩展补齐到 25 篇。',
      content: '第一点：在 `public/notes/我的总结/JS/辅助资料/` 下新增 `23_执行上下文作用域链与调用栈.md`、`24_对象系统与属性描述符.md`、`25_高频手写题思路总纲.md` 三篇补强专题，统一补好 frontmatter、核心问题、面试口述模板、记忆口诀和后续扩写方向；第二点：这 3 篇分别补足了主人资料里较薄弱的执行模型总纲、对象属性系统、函数与异步手写题知识地图，后续可以直接在现有骨架上继续充实案例和代码实现；第三点：同步更新 `public/notes/我的总结/JS/JS常识.md`，把原先遗漏的第 22 篇“绝对路径与相对路径详解”补回主目录，并将目录说明从 1 到 21 调整为 1 到 25；第四点：按仓库规范在变更 `public/notes/` 后执行 `npm run generate:index`，已成功刷新 `public/notes-index.json` 与 `public/search-index.json`，新增 JS 专题现在可以被站内列表和搜索正常收录。'
    },
    {
      category: '内容上新',
      time: '22:18',
      title: '整理面试笔记《前端零碎知识点》的结构与排版',
      summary: '将 `public/notes/面试/零碎知识.md` 按主题重新编排为 12 个清晰章节，统一 frontmatter、H1、标题层级、列表样式与代码块格式，保留原有知识点但显著提升可读性和后续补充体验。',
      content: '第一点：保留主人原本收集的 Vuex getters、ECharts 柱状图倒置、Vue Diff、uni-app/web-view、小程序互跳、公众号跳转、Flex 布局、2D/3D 技术、长轮询、插槽和退款流程等内容，不删核心知识点；第二点：将原先连续堆叠的段落拆成统一编号主题，补上总标题与过渡说明，清理混用的 `+`、`1、`、口语化说明和多余空行，让整篇更像可复习的正式笔记；第三点：同步把示例代码块语言标记整理为 `javascript`、`vue`、`json`、`html`，方便后续站内渲染与阅读；第四点：按仓库规则在修改 `public/notes/` 后重新生成索引，确保列表页与搜索页能同步读取整理后的内容。'
    },
    {
      category: '内容上新',
      time: '22:29',
      title: '合并两篇面试笔记并收拢为一篇总复习稿',
      summary: '将 `public/notes/面试/郭齐龙面试题.md` 与 `public/notes/面试/零碎知识.md` 合并为一篇新的《前端面试知识点整理》，尽量保留两篇原有内容，仅对重复知识点做去重和归并，并删除旧的独立文件。',
      content: '第一点：以 `public/notes/面试/零碎知识.md` 作为最终承载文件，重写 frontmatter、H1 与章节结构，把 Vue2/Vue3 区别、响应式、虚拟 DOM、Diff、组件通讯、Vuex/Pinia、生命周期、路由、小程序、WebSocket、JavaScript 基础、CSS/ECharts、Three.js、工程化与项目经验等内容统一收口；第二点：对两篇里重复出现的 getters、Diff、ECharts 柱状图倒置、小程序跳 web-view、互跳小程序与公众号等内容做了合并，优先保留信息量更完整的版本，并把原文件中断裂的虚拟 DOM 代码示例单独补成完整章节；第三点：删除 `public/notes/面试/郭齐龙面试题.md`，让目录里最终只保留一篇主笔记，避免后续继续出现重复维护；第四点：按仓库规范在变更 `public/notes/` 后重新生成索引，确保列表页与搜索页只展示合并后的单篇内容。'
    },
    {
      category: '内容上新',
      time: '22:38',
      title: '校订并扩写面试笔记《WebSocket 协议详解》',
      summary: '审阅 `public/notes/面试/WebSocket.md` 后修订 HTTP 半双工措辞、`ws@8+` 库示例与过时浏览器兼容描述，并新增握手过程、数据帧结构、心跳保活与断线重连、与轮询/SSE 对比、鉴权与 CSWSH 防护等面试加分章节。',
      content: '第一点：把"HTTP 是半双工"改写为"HTTP/1.1 采用请求—响应模型，应用语义上为半双工"，并补充 keep-alive 仅复用 TCP、最小帧头 2 字节、原生二进制等准确表述，避免被面试官就 TCP 全双工反问；第二点：将 Node.js `ws` 库示例改为 `function(message, isBinary)` 并补 `message.toString()`，对齐 `ws@8+` 默认 `nodebuffer` 行为；第三点：删除"老旧浏览器不支持"等 2026 年已过时的兼容说法，改写为代理/网关穿透与应用层消息可靠性两个真正的工程局限；第四点：新增"WebSocket 握手过程"章节，给出 `Sec-WebSocket-Key/Accept` 计算所用固定 GUID `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`、状态码 `101 Switching Protocols` 与完整请求/响应示例；第五点：新增"数据帧结构"章节，覆盖 FIN、opcode（0x1/0x2/0x8/0x9/0xA）、客户端帧必须掩码、Payload length 三档变长字段；第六点：新增"心跳保活与断线重连"章节，区分协议层 ping/pong 与浏览器侧应用层心跳，给出指数退避 + 抖动重连策略；第七点：新增"与轮询/长轮询/SSE 对比"章节，明确各自适用边界与 Nginx `proxy_http_version 1.1` + `Upgrade` 头转发要点；第八点：扩充安全章节，列出 URL token、子协议、Cookie/Session 三种鉴权方式，并强调握手阶段必须校验 `Origin` 头以防 CSWSH 跨站 WebSocket 劫持。'
    },
    {
      category: '内容上新',
      time: '22:46',
      title: '整理《前端面试题题库及答案》标题结构并清理重复题目',
      summary: '为 `public/notes/面试/面试题题库及答案.md` 补齐 frontmatter 与 H1，统一公司来源分隔标题，去掉多处重复题目和冗余高亮标签，让整篇大题库更适合继续维护。',
      content: '第一点：给 `public/notes/面试/面试题题库及答案.md` 增加规范 frontmatter 与正文 H1，并补一段说明文字，让这篇长文在列表页、搜索页和正文页的标题展示保持一致；第二点：把原先混在题目里的公司来源统一整理为三级标题，例如智课教育、鹿鼎科技、安徽创世科技股份有限公司等，减少整篇连续 `##` 标题带来的阅读噪音；第三点：删除或合并了几组明显重复的问题，包括“页面刷新数据丢失”“如何和后端对接”“keep-alive 怎么保持几十个页面缓存”“跟后端进行数据联调”以及一组重复列出的 axios 封装题，同时把“浏览器解析过程”类题目标题改得更清晰，避免看起来像重复收录；第四点：清理了一批题目标题中的旧 `font` 高亮标签和不统一写法，保留原有知识点主体内容；第五点：按仓库规范执行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保整理后的题库可被站内列表与搜索正确读取。'
    }
  ],
}
