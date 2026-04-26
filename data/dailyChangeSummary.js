// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-26',
  items: [
    {
      category: '内容上新',
      time: '20:10',
      title: '新增 CC Switch 完整使用指南（v3.14.1）',
      summary: '基于官方 CHANGELOG 和中文 README 全力核实，彻底重写 CC Switch 笔记：纠正支持工具数量（当前为 6 款含 Hermes Agent）、界面结构、功能命名（Local Routing 非 Local Proxy）等多处错误，内容与 v3.14.1 实际版本完全对齐。',
      content: '第一点：拉取官方完整 CHANGELOG（115KB）和中文 README，发现原文章存在多处错误：支持工具实为 6 款（v3.14.0 新增 Hermes Agent）、"本地代理"在 v3.14.0 已统一改名为"Local Routing"、界面操作描述与实际 v3.14.1 不符；第二点：彻底重写 public/notes/AI工具/CC Switch/第一篇_CCSwitch快速上手与核心概念_2026-04.md，新增界面结构解析、版本演进简史（v3.0.0 至 v3.14.1 关键里程碑）、Hermes Agent 说明、本地路由注意事项（开启时无法切换官方 Provider）、系统托盘操作方式等；第三点：同步更新目录.md 的描述与覆盖主题，重新生成 notes-index.json 索引。',
    },
    {
      category: '功能更新',
      time: '19:34',
      title: '站内搜索改为碎片记忆友好的混合检索',
      summary: '搜索从纯 includes 过滤升级为“多字段精确命中 + Fuse 模糊兜底”混合检索，支持空格分词、路径召回、逐词高亮和真正的搜索预热，更适合内容增多后的零星记忆回找。',
      content: '第一点：重写 src/utils/search.js，搜索字段覆盖 title、description、tags、category、filename、path、content，保留精确命中优先的排序，同时让 Fuse.js 真正参与模糊兜底；第二点：SearchPage.vue 与 KnowledgeSearchPanel.vue 改为支持空格或逗号分词，多词查询会逐词高亮，不再只认整句；第三点：searchWarmup.js 预热阶段改为直接初始化完整搜索引擎，而不是只拉取 JSON；第四点：新增 src/utils/__tests__/search.test.js，补上碎片词检索、路径召回、多词 AND/OR、高亮与历史归一化的测试样例；第五点：当前终端环境里的 Node 进程初始化异常，导致本次无法实际跑通 Vitest 与通知生成脚本，需在 Node 环境恢复后补一次验证。',
    },
  ],
}
