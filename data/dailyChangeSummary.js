// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-19',
  items: [
    {
      category: '内容上新',
      time: '11:05',
      title: 'Node.js 第五篇补充包管理基础概念与纠错',
      summary: '为 npm 包管理与 nvm 版本管理篇新增"零、基础概念"章节，补充包/包管理工具/常用工具表格的定义说明，并纠正 exports 字段版本号、nvm-windows 不支持 .nvmrc、npm audit fix --force 风险等三处错误。',
      content: '新增零章节：① 包的定义（package = 一组特定功能的源码集合）；② 包管理工具的作用（下载/更新/删除/上传）及跨语言类比；③ 前端常用工具对比表（npm/yarn/pnpm/cnpm）。纠错三处：① exports 字段从"Node 12+"改为"Node 12.7+ 引入，12.17+ 稳定"；② nvm-windows 明确标注不支持 .nvmrc 文件；③ npm audit fix --force 补充破坏性变更风险说明。'
    }
  ]
}
