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
    }
  ],
}
