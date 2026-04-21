---
title: MongoDB 详解第二篇：原生 CRUD 操作
date: 2026-04-21
category: Node.js
tags:
  - MongoDB
  - CRUD
  - 查询操作符
  - 更新操作符
  - mongosh
description: 系统掌握 MongoDB 原生增删改查命令，覆盖所有常用查询操作符（$gt/$in/$regex 等）、更新操作符（$set/$inc/$push 等）、排序分页和投影。
---

# MongoDB 详解第二篇：原生 CRUD 操作

> 在用 Mongoose 之前，先把 MongoDB 原生命令搞清楚。这些命令在 mongosh 里直接跑，也是 Mongoose 底层在做的事情。

---

## 一、准备工作

打开终端，连接数据库，切换到练习用的数据库：

```javascript
mongosh

use learn_mongo
// 切换到 learn_mongo 数据库（不存在会自动创建）
```

后面所有命令都在 mongosh 里执行。

---

## 二、插入文档（Create）

### 2.1 insertOne — 插入单条

```javascript
// db.集合名.insertOne(文档对象)
// 返回：{ acknowledged: true, insertedId: ObjectId('...') }

db.users.insertOne({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  role: 'user',
  isActive: true,
  createdAt: new Date()
})
```

插入后 MongoDB 自动给这条文档加上 `_id` 字段（ObjectId 类型）。

如果你想自己指定 `_id`，可以手动传：

```javascript
db.users.insertOne({
  _id: 'custom-id-001',  // 自定义 _id，可以是任意类型
  name: '自定义ID用户'
})
// ⚠️ 自定义 _id 后，如果再插入相同 _id 会报错（唯一约束）
```

### 2.2 insertMany — 批量插入

```javascript
// db.集合名.insertMany([文档数组])
// 返回：{ acknowledged: true, insertedIds: { '0': ObjectId, '1': ObjectId, ... } }

db.users.insertMany([
  { name: '李四', age: 30, email: 'lisi@example.com', role: 'admin' },
  { name: '王五', age: 28, email: 'wangwu@example.com', role: 'user' },
  { name: '赵六', age: 22, email: 'zhaoliu@example.com', role: 'user' },
  { name: '钱七', age: 35, email: 'qianqi@example.com', role: 'moderator' }
])
```

**有序插入 vs 无序插入**：

```javascript
// 默认 ordered: true（有序插入）
// 遇到错误（如重复 _id）立即停止，后面的文档不再插入

// ordered: false（无序插入）
// 遇到错误跳过这条，继续插入其他文档
db.users.insertMany(
  [{ _id: 1, name: 'A' }, { _id: 1, name: 'B' }, { _id: 2, name: 'C' }],
  { ordered: false }
)
// _id: 1 重复报错，但 _id: 2 的 C 仍然会插入
```

---

## 三、查询文档（Read）

### 3.1 find — 查询多条

```javascript
// db.集合名.find(查询条件, 投影)
// 查询条件为空对象 {} 或不传，表示查询所有

// 查询所有文档
db.users.find()

// 加 .pretty() 格式化输出（mongosh 默认已经格式化，老版本需要）
db.users.find().pretty()

// 按条件查询：精确匹配
db.users.find({ role: 'user' })

// 多个条件：AND 关系（同时满足）
db.users.find({ role: 'user', isActive: true })
```

### 3.2 findOne — 查询单条

```javascript
// 返回第一条匹配的文档，没有则返回 null
db.users.findOne({ name: '张三' })

// 按 _id 查询（需要用 ObjectId 包装）
db.users.findOne({ _id: ObjectId('6642a1b2c3d4e5f678901234') })
```

### 3.3 查询操作符

当你需要"大于"、"包含"、"正则匹配"这类条件时，就要用操作符。MongoDB 的操作符都以 `$` 开头。

**比较操作符**：

```javascript
// $eq：等于（通常直接写值，不用 $eq）
db.users.find({ age: { $eq: 25 } })
// 等价于：
db.users.find({ age: 25 })

// $ne：不等于
db.users.find({ role: { $ne: 'admin' } })

// $gt：大于（greater than）
db.users.find({ age: { $gt: 25 } })

// $gte：大于等于（greater than or equal）
db.users.find({ age: { $gte: 25 } })

// $lt：小于（less than）
db.users.find({ age: { $lt: 30 } })

// $lte：小于等于（less than or equal）
db.users.find({ age: { $lte: 30 } })

// 范围查询：25 <= age <= 35
db.users.find({ age: { $gte: 25, $lte: 35 } })
```

**数组操作符**：

```javascript
// $in：值在数组中（类似 SQL 的 IN）
db.users.find({ role: { $in: ['admin', 'moderator'] } })

// $nin：值不在数组中（NOT IN）
db.users.find({ role: { $nin: ['admin'] } })
```

**逻辑操作符**：

```javascript
// $and：与（多个条件都满足）
// 注意：多个条件直接写在对象里默认就是 AND，$and 用于同一字段多个条件
db.users.find({
  $and: [
    { age: { $gte: 20 } },
    { age: { $lte: 30 } }
  ]
})

// $or：或（满足其中一个条件）
db.users.find({
  $or: [
    { role: 'admin' },
    { age: { $gt: 30 } }
  ]
})

// $nor：都不满足
db.users.find({
  $nor: [
    { role: 'admin' },
    { isActive: false }
  ]
})

// $not：取反
db.users.find({ age: { $not: { $gt: 30 } } })
// 等价于：age <= 30
```

**字段存在性**：

```javascript
// $exists：字段是否存在
db.users.find({ phone: { $exists: true } })   // 有 phone 字段的文档
db.users.find({ phone: { $exists: false } })  // 没有 phone 字段的文档
```

**正则匹配**：

```javascript
// $regex：正则表达式匹配
db.users.find({ name: { $regex: /张/ } })

// 不区分大小写
db.users.find({ email: { $regex: /gmail/i } })

// 也可以写成字符串形式
db.users.find({ name: { $regex: '张', $options: 'i' } })
```

**类型查询**：

```javascript
// $type：按字段类型查询
db.users.find({ age: { $type: 'number' } })
db.users.find({ _id: { $type: 'objectId' } })
```

### 3.4 投影（只返回指定字段）

```javascript
// find 的第二个参数是投影
// 1 = 包含，0 = 排除
// 注意：_id 默认包含，需要显式排除

// 只返回 name 和 email（_id 默认也会返回）
db.users.find({}, { name: 1, email: 1 })

// 排除 _id
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排除某些字段（其他字段都返回）
db.users.find({}, { password: 0, __v: 0 })

// ⚠️ 不能混用包含和排除（_id 除外）
// 错误写法：
// db.users.find({}, { name: 1, age: 0 })  // 报错！
```

### 3.5 排序、分页、统计

```javascript
// sort：排序
// 1 = 升序（从小到大），-1 = 降序（从大到小）
db.users.find().sort({ age: 1 })          // 按年龄升序
db.users.find().sort({ age: -1 })         // 按年龄降序
db.users.find().sort({ age: -1, name: 1 }) // 先按年龄降序，再按名字升序

// limit：限制返回数量
db.users.find().limit(5)  // 只返回前 5 条

// skip：跳过前 n 条（用于分页）
db.users.find().skip(10).limit(5)  // 跳过前 10 条，取第 11-15 条

// 分页公式：
// 第 page 页，每页 pageSize 条
// skip = (page - 1) * pageSize
// limit = pageSize
const page = 2
const pageSize = 10
db.users.find().skip((page - 1) * pageSize).limit(pageSize)

// countDocuments：统计数量
db.users.countDocuments()                    // 总数
db.users.countDocuments({ role: 'user' })    // 满足条件的数量

// 链式调用（顺序不影响结果）
db.users.find({ isActive: true })
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10)
```

---

## 四、更新文档（Update）

### 4.1 updateOne — 更新单条

```javascript
// db.集合名.updateOne(查询条件, 更新操作)
// 只更新第一条匹配的文档

db.users.updateOne(
  { name: '张三' },          // 查询条件：找到 name 为张三的文档
  { $set: { age: 26 } }     // 更新操作：把 age 改为 26
)

// 返回：
// {
//   acknowledged: true,
//   matchedCount: 1,    // 匹配到的文档数
//   modifiedCount: 1    // 实际修改的文档数
// }
```

### 4.2 updateMany — 更新多条

```javascript
// 更新所有匹配的文档
db.users.updateMany(
  { role: 'user' },
  { $set: { isActive: true } }
)
```

### 4.3 更新操作符

**$set — 设置字段值**（最常用）：

```javascript
// 修改已有字段
db.users.updateOne({ name: '张三' }, { $set: { age: 26 } })

// 添加新字段（字段不存在时自动创建）
db.users.updateOne({ name: '张三' }, { $set: { phone: '13800138000' } })

// 修改嵌套字段（用点号）
db.users.updateOne(
  { name: '张三' },
  { $set: { 'address.city': '上海' } }
)

// 同时修改多个字段
db.users.updateOne(
  { name: '张三' },
  { $set: { age: 26, email: 'new@example.com', updatedAt: new Date() } }
)
```

**$unset — 删除字段**：

```javascript
// 删除 phone 字段（值写什么都行，通常写空字符串）
db.users.updateOne({ name: '张三' }, { $unset: { phone: '' } })
```

**$inc — 数值增减**：

```javascript
// 登录次数 +1
db.users.updateOne({ name: '张三' }, { $inc: { loginCount: 1 } })

// 减少（传负数）
db.users.updateOne({ name: '张三' }, { $inc: { score: -10 } })
```

**$rename — 重命名字段**：

```javascript
// 把 name 字段改名为 username
db.users.updateMany({}, { $rename: { name: 'username' } })
```

**数组操作符**：

```javascript
// $push：向数组末尾添加元素
db.users.updateOne({ name: '张三' }, { $push: { tags: 'vip' } })

// $push + $each：一次添加多个元素
db.users.updateOne(
  { name: '张三' },
  { $push: { tags: { $each: ['vip', 'premium'] } } }
)

// $pull：从数组中删除指定元素
db.users.updateOne({ name: '张三' }, { $pull: { tags: 'vip' } })

// $addToSet：添加元素，但不重复（类似 Set）
db.users.updateOne({ name: '张三' }, { $addToSet: { tags: 'vip' } })
// 如果 tags 里已经有 'vip'，不会重复添加

// $pop：删除数组第一个或最后一个元素
db.users.updateOne({ name: '张三' }, { $pop: { tags: 1 } })   // 删除最后一个
db.users.updateOne({ name: '张三' }, { $pop: { tags: -1 } })  // 删除第一个
```

### 4.4 upsert — 不存在则插入

```javascript
// upsert: true — 找不到匹配文档时，自动插入一条新文档
db.users.updateOne(
  { email: 'newuser@example.com' },
  { $set: { name: '新用户', age: 20 } },
  { upsert: true }
)
// 如果 email 不存在：插入新文档
// 如果 email 存在：更新该文档
```

### 4.5 replaceOne — 替换整条文档

```javascript
// 注意：replaceOne 会替换整条文档（_id 保留），而不是只更新指定字段
db.users.replaceOne(
  { name: '张三' },
  { name: '张三', age: 26, email: 'new@example.com' }
  // 原来文档的其他字段（如 role、isActive）会被删除！
)
```

> **$set vs replaceOne 的区别**：`$set` 只修改指定字段，其他字段保留；`replaceOne` 用新文档替换整条，未指定的字段会消失。

---

## 五、删除文档（Delete）

### 5.1 deleteOne — 删除单条

```javascript
// 删除第一条匹配的文档
db.users.deleteOne({ name: '张三' })

// 返回：{ acknowledged: true, deletedCount: 1 }
```

### 5.2 deleteMany — 删除多条

```javascript
// 删除所有 isActive 为 false 的文档
db.users.deleteMany({ isActive: false })

// 删除集合里的所有文档（集合本身保留）
db.users.deleteMany({})

// ⚠️ 和 db.users.drop() 的区别：
// deleteMany({}) — 删除所有文档，集合和索引保留
// drop() — 删除整个集合（包括索引）
```

---

## 六、综合练习

用下面这批数据练习一下：

```javascript
// 先清空集合
db.products.deleteMany({})

// 插入测试数据
db.products.insertMany([
  { name: 'iPhone 15', category: '手机', price: 5999, stock: 100, tags: ['苹果', '旗舰'] },
  { name: 'MacBook Pro', category: '电脑', price: 14999, stock: 50, tags: ['苹果', '笔记本'] },
  { name: 'AirPods Pro', category: '耳机', price: 1799, stock: 200, tags: ['苹果', '无线'] },
  { name: '小米14', category: '手机', price: 3999, stock: 150, tags: ['小米', '旗舰'] },
  { name: 'ThinkPad X1', category: '电脑', price: 9999, stock: 30, tags: ['联想', '商务'] },
  { name: 'Sony WH-1000XM5', category: '耳机', price: 2499, stock: 80, tags: ['索尼', '降噪'] }
])
```

练习题：

```javascript
// 1. 查询所有手机
db.products.find({ category: '手机' })

// 2. 查询价格在 2000-6000 之间的商品，只显示 name 和 price
db.products.find(
  { price: { $gte: 2000, $lte: 6000 } },
  { name: 1, price: 1, _id: 0 }
)

// 3. 查询 tags 包含"苹果"的商品，按价格降序
db.products.find({ tags: '苹果' }).sort({ price: -1 })

// 4. 查询手机或耳机，按价格升序，只取前 3 条
db.products.find({
  $or: [{ category: '手机' }, { category: '耳机' }]
}).sort({ price: 1 }).limit(3)

// 5. 把所有手机的库存减少 10
db.products.updateMany(
  { category: '手机' },
  { $inc: { stock: -10 } }
)

// 6. 给 iPhone 15 添加标签 '热销'
db.products.updateOne(
  { name: 'iPhone 15' },
  { $addToSet: { tags: '热销' } }
)

// 7. 删除库存为 0 的商品
db.products.deleteMany({ stock: { $lte: 0 } })

// 8. 统计每个分类的商品数量
db.products.countDocuments({ category: '手机' })
db.products.countDocuments({ category: '电脑' })
```

---

## 七、小结

| 操作 | 命令 | 说明 |
|------|------|------|
| 插入单条 | `insertOne({})` | 返回 insertedId |
| 批量插入 | `insertMany([])` | 支持 ordered 选项 |
| 查询所有 | `find()` | 可链式 sort/skip/limit |
| 查询单条 | `findOne({})` | 返回第一条或 null |
| 统计数量 | `countDocuments({})` | 支持条件 |
| 更新单条 | `updateOne(条件, 操作)` | 配合 $set/$inc 等操作符 |
| 更新多条 | `updateMany(条件, 操作)` | 同上 |
| 删除单条 | `deleteOne({})` | 删除第一条匹配 |
| 删除多条 | `deleteMany({})` | 传 {} 删除所有 |

**常用查询操作符**：`$gt` `$gte` `$lt` `$lte` `$ne` `$in` `$nin` `$or` `$and` `$exists` `$regex`

**常用更新操作符**：`$set` `$unset` `$inc` `$push` `$pull` `$addToSet` `$pop` `$rename`

**下一篇**：Mongoose 连接与 Schema 建模——用 Node.js 代码操作 MongoDB，Schema 定义、数据类型、校验规则全解。
