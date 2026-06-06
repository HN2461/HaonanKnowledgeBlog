// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-06-06',
  items: [
    {
      category: '内容上新',
      time: '15:26',
      title: '按 MongoDB 官方资料重写整套入门到项目实战笔记',
      summary:
        '对 `public/notes/Node.js/MongoDB详解/` 目录下的 7 篇正文与系列目录逐篇按 MongoDB 官方手册、MongoDB Node.js Driver 官方文档和 Mongoose 官方文档重新校正，补齐当前版本认知、建模思路、索引与事务边界，并继续补成带行内解释的小白注释版代码示例。',
      content:
        '第一点：重写 `目录.md`，新增官方资料基线、学习路线、能力目标和快速查找，让整套系列从目录页开始就围绕“入门到项目落地”组织；第二点：重写第一篇到第七篇的知识结构，把安装、BSON、ObjectId、原生 CRUD、Mongoose 建模、中间件、关联查询、聚合、索引、事务和项目实战都改成更贴近当前官方文档与实际项目的讲法；第三点：补入 MongoDB Manual、mongosh、Node.js Driver、Mongoose 等官方来源，并重点纠正 `findOneAndUpdate` 返回结果、嵌入与引用取舍、复合索引 / ESR 思路、事务里不要 `Promise.all()` 等容易被旧教程讲偏的点；第四点：把第二篇到第七篇的关键代码示例继续补成“小白注释版”，让 CRUD、Schema、`lean()`、`populate()`、聚合、索引与事务示例都能直接看懂每一行在做什么，并顺手清理第二篇与第五篇残留的旧内容尾巴；第五点：按仓库要求先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检通过后，多次运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保新内容和注释版示例能被站内目录和搜索收录。',
    },
  ],
}
