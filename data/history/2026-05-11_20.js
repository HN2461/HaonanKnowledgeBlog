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
  }
]
