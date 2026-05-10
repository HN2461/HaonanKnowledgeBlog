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
    }
  ],
}
