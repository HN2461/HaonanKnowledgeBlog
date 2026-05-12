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
  }
]
