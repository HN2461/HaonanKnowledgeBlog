// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-06-07',
  items: [
    {
      category: '内容上新',
      time: '14:41',
      title: '补强 MongoDB 第四至第六篇小白化讲解',
      summary:
        '根据主人阅读反馈，扩充 MongoDB 详解第四篇到第六篇中 `select()`、`lean()`、Mongoose 中间件、关联查询、聚合管道、索引和事务的入门解释，并进一步补强第五篇里 `$` 语义与 `$lookup` 字段匹配逻辑，让后半段内容更适合零基础读者顺着读懂。',
      content:
        '第一点：在第四篇补齐 `.select()` 独立讲解，说明它是控制返回字段，并补充只返回字段、排除敏感字段、`_id` 特例和列表 / 用户接口中的真实用途；第二点：重写 `.lean()` 段落，把“普通对象”和“Mongoose 文档实例”的区别讲清楚，补充为什么列表接口适合用、为什么用了以后不能再 `save()`；第三点：扩充 Mongoose 中间件部分，补上 `pre` / `post` 的前置与后置含义、文档中间件和查询中间件的区别、`this` 指向以及为什么中间件里通常不用箭头函数；第四点：在第五篇补充嵌入、引用、`populate()`、`.select()` 与 `.populate(..., 字段)`、`$group`、`$lookup`、`$unwind` 的白话解释和执行顺序，并进一步单独补清“不同聚合阶段里 `$` 的含义不完全一样”“`$match` / `$group` / `$project` / `$lookup` 左右两侧字段分别代表什么”“`localField` 和 `foreignField` 到底是谁和谁匹配”这些最容易卡住新手的点；第五点：在第六篇补充索引像目录、`COLLSCAN` / `IXSCAN`、`explain()` 关键字段、复合索引顺序、单文档原子性、事务边界、`session` 和事务内不要 `Promise.all()` 的入门讲解；第六点：按规则先执行 Node 运行时预检，再运行 `npm run generate:index` 与 `npm run generate:notifications`，同步刷新站内索引与通知数据。',
    },
  ],
}
