---
title: 第七篇：MongoDB 数据库实战
date: 2026-04-18
category: Node.js
tags:
  - Node.js
  - MongoDB
  - Mongoose
  - 数据库
  - CRUD
  - NoSQL
  - 聚合管道
  - 索引优化
description: 从零掌握 MongoDB 文档型数据库，理解与关系型数据库的区别，通过 Mongoose ODM 进行 Schema 定义、数据校验、CRUD 操作、关联查询和聚合管道，以及索引优化和事务处理。
---

# 第七篇：MongoDB 数据库实战

> MongoDB 是文档型数据库，天然适合 JavaScript 生态——数据以 JSON 格式存储，和前后端数据格式完全一致。这篇文章从概念到实战，覆盖 MongoDB 的核心用法和 Mongoose 的高级特性。

---

## 一、MongoDB 基础概念

### 1.1 MongoDB vs 关系型数据库

| 概念 | MySQL（关系型） | MongoDB（文档型） |
|------|-----------------|-------------------|
| 数据库 | database | database |
| 表 | table | collection（集合） |
| 行 | row | document（文档） |
| 列 | column | field（字段） |
| 主键 | id（整数） | _id（ObjectId） |
| 关联 | JOIN | $lookup / populate |
| 数据格式 | 固定结构（Schema） | 灵活结构（JSON/BSON） |

### 1.2 MongoDB 的优势

- **灵活的数据结构**：同一集合中的文档可以有不同字段
- **天然 JSON 格式**：与 JavaScript 无缝对接
- **水平扩展**：分片（Sharding）支持海量数据
- **嵌套文档**：复杂数据结构无需多表关联

### 1.3 安装 MongoDB

```bash
# Windows：下载安装包
# https://www.mongodb.com/try/download/community

# Mac（使用 Homebrew）
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB 服务
# Windows：作为服务自动启动，或手动：
mongod --dbpath C:\data\db

# Mac/Linux：
brew services start mongodb-community
# 或
mongod --dbpath /usr/local/var/mongodb
```

> **实战提醒**：MongoDB Server 和 `mongosh` 是两套组件。跟着官方安装页操作时，如果终端里找不到 `mongosh`，通常是 Shell 没装或没加到 PATH，不是数据库本身没装好。

### 1.4 MongoDB Shell 基础操作

```bash
# 连接 MongoDB
mongosh

# 查看所有数据库
show dbs

# 切换/创建数据库
use myapp

# 查看当前数据库
db

# 查看所有集合
show collections
```

---

## 二、MongoDB 原生操作

### 2.1 插入文档

```javascript
// 插入单条
db.users.insertOne({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  createdAt: new Date()
})

// 插入多条
db.users.insertMany([
  { name: '李四', age: 30 },
  { name: '王五', age: 28 }
])
```

### 2.2 查询文档

```javascript
// 查询所有
db.users.find()

// 条件查询
db.users.find({ age: 25 })
db.users.find({ age: { $gt: 20 } })  // age > 20

// 常用查询操作符
db.users.find({ age: { $gt: 20, $lt: 30 } })  // 20 < age < 30
db.users.find({ name: { $in: ['张三', '李四'] } })  // name 在数组中
db.users.find({ name: { $regex: /张/ } })  // 正则匹配

// 查询单条
db.users.findOne({ name: '张三' })

// 投影（只返回指定字段）
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排序、分页
db.users.find().sort({ age: -1 }).skip(0).limit(10)
```

### 2.3 更新文档

```javascript
// 更新单条
db.users.updateOne(
  { name: '张三' },           // 查询条件
  { $set: { age: 26 } }      // 更新操作
)

// 更新多条
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
)

// 常用更新操作符
// $set：设置字段值
// $unset：删除字段
// $inc：数值增减
// $push：向数组添加元素
// $pull：从数组删除元素

db.users.updateOne(
  { name: '张三' },
  {
    $set: { email: 'new@example.com' },
    $inc: { loginCount: 1 },
    $push: { tags: 'vip' }
  }
)
```

### 2.4 删除文档

```javascript
// 删除单条
db.users.deleteOne({ name: '张三' })

// 删除多条
db.users.deleteMany({ age: { $lt: 18 } })

// 删除所有
db.users.deleteMany({})
```

---

## 三、Mongoose：Node.js 中使用 MongoDB

Mongoose 是 Node.js 的 MongoDB ODM（Object Document Mapper），提供了：
- Schema 定义（数据结构约束）
- 数据校验
- 中间件（钩子）
- 更友好的 API

**当前版本说明**：
- Mongoose 9（2025 年 11 月发布）：当前最新版，要求 Node.js 18+
- Mongoose 8：要求 Node.js 16+
- Mongoose 7：移除了回调函数支持，全面转向 Promise/async-await
- ⚠️ **Mongoose 7+ 起，所有方法不再接受回调函数**，必须使用 Promise 或 async/await

### 3.1 安装与连接

```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose')

// mongoose.connect(uri[, options]) → Promise
//   uri: MongoDB 连接字符串
//     格式：mongodb://[user:pass@]host[:port]/dbname[?options]
//   options（常用）：
//     serverSelectionTimeoutMS: 服务器选择超时（默认 30000ms）
//     socketTimeoutMS: socket 超时（默认 0，不超时）
//     maxPoolSize: 连接池最大连接数（默认 5）
//     minPoolSize: 连接池最小连接数（默认 0）
//     connectTimeoutMS: 连接超时（默认 30000ms）

// 连接数据库（推荐写法）
async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
      serverSelectionTimeoutMS: 5000  // 5秒内连不上就报错
    })
    console.log('MongoDB 连接成功')
  } catch (err) {
    console.error('连接失败:', err.message)
    process.exit(1)
  }
}
connectDB()

// 监听连接事件
mongoose.connection.on('connected', () => {
  console.log('已连接到 MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('连接错误:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 连接断开')
})

// 优雅关闭连接
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB 连接已关闭')
  process.exit(0)
})
```

### 3.2 定义 Schema

```javascript
const { Schema, model } = require('mongoose')

// 定义用户 Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, '姓名不能为空'],  // 必填，自定义错误信息
    trim: true,                         // 自动去除首尾空格
    minlength: [2, '姓名至少2个字符'],
    maxlength: [20, '姓名最多20个字符']
  },
  email: {
    type: String,
    required: true,
    unique: true,                       // 唯一索引
    lowercase: true,                    // 自动转小写
    match: [/^\S+@\S+\.\S+$/, '邮箱格式不正确']
  },
  age: {
    type: Number,
    min: [0, '年龄不能为负数'],
    max: [150, '年龄不合法'],
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],  // 枚举值
    default: 'user'
  },
  tags: [String],                       // 字符串数组
  address: {                            // 嵌套对象
    city: String,
    province: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // 自动添加 createdAt 和 updatedAt 字段
})

// 创建 Model（对应数据库中的集合，自动转为复数小写：users）
const User = model('User', userSchema)

module.exports = User
```

### 3.3 Schema 数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `String` | 字符串 | `name: String` |
| `Number` | 数字（整数或浮点数） | `age: Number` |
| `Boolean` | 布尔值 | `isActive: Boolean` |
| `Date` | 日期 | `createdAt: Date` |
| `Buffer` | 二进制数据 | `avatar: Buffer` |
| `ObjectId` | MongoDB ObjectId | `author: Schema.Types.ObjectId` |
| `Array` | 数组 | `tags: [String]` |
| `Mixed` | 任意类型 | `meta: Schema.Types.Mixed` |
| `Map` | 键值对（Mongoose 5.1+） | `preferences: Map` |
| `Decimal128` | 高精度小数 | `price: Schema.Types.Decimal128` |
| `UUID` | UUID（不同版本和序列化场景下可能表现为字符串或 BSON UUID） | `id: Schema.Types.UUID` |
| `Double` | 64位浮点数（Mongoose 8.4+） | `score: Schema.Types.Double` |
| `Int32` | 32位整数（Mongoose 8.4+） | `count: Schema.Types.Int32` |

**Schema 选项（第二个参数）**：

```javascript
const userSchema = new Schema({ ... }, {
  timestamps: true,          // 自动添加 createdAt 和 updatedAt
  versionKey: false,         // 禁用 __v 字段（默认 '__v'）
  collection: 'my_users',    // 自定义集合名（默认自动复数化）
  strict: true,              // 严格模式：忽略 Schema 未定义的字段（默认 true）
  toJSON: { virtuals: true },  // toJSON 时包含虚拟字段
  toObject: { virtuals: true } // toObject 时包含虚拟字段
})
```

**⚠️ Mongoose 9 UUID 提醒**：

```javascript
// Mongoose 9 对 UUID 的表现和旧版本不同
// 实战里如果要输出给前端，建议显式转成字符串
const schema = new Schema({ uuid: 'UUID' })
const doc = new Model({ uuid: new bson.UUID() })
await doc.save()

// 推荐在统一输出层做字符串转换
mongoose.Schema.Types.UUID.get(v => v == null ? v : v.toString())
```

---

## 四、Mongoose CRUD 操作

### 4.1 创建文档

```javascript
const User = require('./models/User')

// 方式一：new + save
// doc.save([options]) → Promise<Document>
//   options.validateBeforeSave: boolean，保存前是否校验（默认 true）
const user = new User({
  name: '张三',
  email: 'zhangsan@example.com',
  age: 25
})
await user.save()
console.log('创建成功:', user._id)

// 方式二：Model.create(docs[, options]) → Promise<Document | Document[]>
//   docs: 单个对象或对象数组
//   options.session: ClientSession，用于事务
const newUser = await User.create({
  name: '李四',
  email: 'lisi@example.com',
  age: 30
})

// 批量创建
// Model.insertMany(docs[, options]) → Promise<Document[]>
//   options.ordered: boolean，是否有序插入（默认 true，遇错停止）
//   options.rawResult: boolean，是否返回原始结果（默认 false）
const users = await User.insertMany([
  { name: '王五', email: 'wangwu@example.com' },
  { name: '赵六', email: 'zhaoliu@example.com' }
], { ordered: false })  // ordered: false 遇错继续插入其他文档
```

### 4.2 查询文档

```javascript
// Model.find(filter[, projection][, options]) → Query
//   filter: 查询条件对象（空对象 {} 查询所有）
//   projection: 字段投影（可选）
//   options: { sort, skip, limit, lean, ... }

// 查询所有
const allUsers = await User.find()

// 条件查询
const adults = await User.find({ age: { $gte: 18 } })

// Model.findById(id[, projection][, options]) → Query
//   id: ObjectId 或字符串
const user = await User.findById('64a1b2c3d4e5f6789012345')

// Model.findOne(filter[, projection][, options]) → Query
const user = await User.findOne({ email: 'zhangsan@example.com' })

// 选择字段（投影）
// .select(fields) — fields 为空格分隔的字段名，- 前缀表示排除
const users = await User.find().select('name email -_id')
// 或
const users2 = await User.find({}, 'name email')

// 排序：.sort(fields) — 1 升序，-1 降序
const users3 = await User.find().sort({ createdAt: -1 })

// 分页：.skip(n).limit(n)
const page = 1
const limit = 10
const users4 = await User.find()
  .skip((page - 1) * limit)
  .limit(limit)

// 统计数量
// Model.countDocuments(filter[, options]) → Query<number>
const count = await User.countDocuments({ isActive: true })

// .lean() — 返回普通 JS 对象而非 Mongoose 文档（性能更好，但没有文档方法）
const users5 = await User.find().lean()

// 链式查询
const users6 = await User
  .find({ role: 'user', isActive: true })
  .select('name email age')
  .sort({ age: 1 })
  .skip(0)
  .limit(20)
  .lean()
```

### 4.3 更新文档

```javascript
// Model.findByIdAndUpdate(id, update[, options]) → Query<Document | null>
//   id: ObjectId 或字符串
//   update: 更新操作（$set、$inc 等）
//   options:
//     new: boolean，返回更新后的文档（默认 false，返回更新前）
//     runValidators: boolean，是否运行 Schema 校验（默认 false）
//     upsert: boolean，不存在时是否创建（默认 false）
//     select: string，返回的字段
const updated = await User.findByIdAndUpdate(
  '64a1b2c3d4e5f6789012345',
  { $set: { age: 26 } },
  { new: true, runValidators: true }
)

// Model.findOneAndUpdate(filter, update[, options]) → Query<Document | null>
await User.findOneAndUpdate(
  { email: 'zhangsan@example.com' },
  { $set: { name: '张三三' } },
  { new: true }
)

// 更新多条
const result = await User.updateMany(
  { role: 'user' },
  { $set: { isActive: true } }
)
console.log('更新了', result.modifiedCount, '条')

// 常用更新操作符
await User.findByIdAndUpdate(id, {
  $set: { name: '新名字' },          // 设置字段
  $unset: { address: '' },           // 删除字段
  $inc: { loginCount: 1 },           // 数值增加
  $push: { tags: '新标签' },         // 数组添加元素
  $pull: { tags: '旧标签' },         // 数组删除元素
  $addToSet: { tags: '不重复标签' }  // 数组添加（不重复）
})
```

### 4.4 删除文档

```javascript
// 按 id 删除
await User.findByIdAndDelete('64a1b2c3d4e5f6789012345')

// 按条件删除单条
await User.findOneAndDelete({ email: 'test@example.com' })

// 删除多条
const result = await User.deleteMany({ isActive: false })
console.log('删除了', result.deletedCount, '条')
```

---

## 五、关联查询（populate）

### 5.1 定义关联

```javascript
// models/Article.js
const articleSchema = new Schema({
  title: { type: String, required: true },
  content: String,
  author: {
    type: Schema.Types.ObjectId,  // 存储 User 的 _id
    ref: 'User',                   // 关联的 Model 名称
    required: true
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
})

const Article = model('Article', articleSchema)
```

### 5.2 populate 查询

```javascript
// 查询文章时，自动填充 author 字段
const articles = await Article.find()
  .populate('author', 'name email')  // 只填充 name 和 email 字段
  .sort({ createdAt: -1 })

// 结果：
// {
//   title: '文章标题',
//   author: {
//     _id: '...',
//     name: '张三',
//     email: 'zhangsan@example.com'
//   }
// }

// 多级 populate
const articles = await Article.find()
  .populate({
    path: 'author',
    select: 'name',
    populate: {
      path: 'department',  // 如果 User 还关联了 Department
      select: 'name'
    }
  })
```

---

## 六、Mongoose 中间件（钩子）

```javascript
// ── Mongoose 9 重要变化 ──
// ⚠️ Mongoose 9 中，pre 中间件不再接收 next() 参数
// 必须使用 async 函数或返回 Promise

// ❌ Mongoose 8 及以前的写法（Mongoose 9 不再支持）
// userSchema.pre('save', function(next) {
//   // ...
//   next()
// })

// ✅ Mongoose 9 推荐写法：async 函数
userSchema.pre('save', async function() {
  // this 指向当前文档
  if (this.isModified('password')) {
    const bcrypt = require('bcrypt')
    this.password = await bcrypt.hash(this.password, 10)
  }
  // 不需要调用 next()
})

// ✅ 或者返回 Promise
userSchema.pre('save', function() {
  return new Promise((resolve) => {
    // 异步操作
    resolve()
  })
})

// 保存后执行（post hook）
userSchema.post('save', function(doc) {
  console.log('用户已保存:', doc._id)
})

// 查询前执行（软删除过滤）
userSchema.pre('find', function() {
  // this 指向 Query 对象
  this.where({ isDeleted: { $ne: true } })
})

// 也可以用 findOne、findOneAndUpdate 等
userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
  this.where({ isDeleted: { $ne: true } })
})

// 删除前执行
userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  // document: true 表示监听文档实例的 deleteOne()
  // query: false 表示不监听 Model.deleteOne() 查询
  console.log('即将删除文档:', this._id)
})
```

---

## 七、聚合管道（Aggregation Pipeline）

聚合管道是 MongoDB 最强大的功能之一，可以对数据进行复杂的统计和转换。

### 7.1 聚合管道基础

```javascript
// 聚合管道：文档依次经过每个阶段处理
// 类似工厂流水线：原料 → 工序1 → 工序2 → 成品

const result = await User.aggregate([
  // 阶段1：$match — 过滤（类似 WHERE）
  { $match: { isActive: true, age: { $gte: 18 } } },

  // 阶段2：$group — 分组统计（类似 GROUP BY）
  {
    $group: {
      _id: '$role',           // 按 role 字段分组
      count: { $sum: 1 },     // 统计每组数量
      avgAge: { $avg: '$age' }, // 计算平均年龄
      maxAge: { $max: '$age' }, // 最大年龄
      minAge: { $min: '$age' }  // 最小年龄
    }
  },

  // 阶段3：$sort — 排序（类似 ORDER BY）
  { $sort: { count: -1 } },

  // 阶段4：$limit — 限制数量
  { $limit: 10 }
])

// 结果示例：
// [
//   { _id: 'user', count: 150, avgAge: 28.5, maxAge: 65, minAge: 18 },
//   { _id: 'admin', count: 5, avgAge: 35.2, maxAge: 50, minAge: 25 }
// ]
```

### 7.2 常用聚合操作符

```javascript
// ── $project：选择/重命名/计算字段 ──
await User.aggregate([
  {
    $project: {
      name: 1,                          // 保留 name
      email: 1,                         // 保留 email
      _id: 0,                           // 排除 _id
      fullName: { $concat: ['$firstName', ' ', '$lastName'] },  // 拼接
      ageGroup: {
        $cond: {
          if: { $gte: ['$age', 18] },
          then: '成年',
          else: '未成年'
        }
      }
    }
  }
])

// ── $lookup：关联查询（类似 LEFT JOIN）──
await Article.aggregate([
  {
    $lookup: {
      from: 'users',          // 关联的集合名（注意是集合名，不是 Model 名）
      localField: 'author',   // 本集合的字段
      foreignField: '_id',    // 关联集合的字段
      as: 'authorInfo'        // 结果存放的字段名（数组）
    }
  },
  // 展开数组（一对一关联时使用）
  { $unwind: '$authorInfo' },
  {
    $project: {
      title: 1,
      'authorInfo.name': 1,
      'authorInfo.email': 1
    }
  }
])

// ── $unwind：展开数组字段 ──
// 文档：{ name: '张三', tags: ['js', 'node', 'vue'] }
// unwind 后变成三条文档：
// { name: '张三', tags: 'js' }
// { name: '张三', tags: 'node' }
// { name: '张三', tags: 'vue' }
await User.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// ── $addFields：添加新字段 ──
await User.aggregate([
  {
    $addFields: {
      fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      isAdult: { $gte: ['$age', 18] }
    }
  }
])

// ── $facet：多维度统计（一次查询返回多个结果）──
await Product.aggregate([
  {
    $facet: {
      // 按分类统计数量
      byCategory: [
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ],
      // 价格区间统计
      byPriceRange: [
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 100, 500, 1000, 5000],
            default: '5000+',
            output: { count: { $sum: 1 }, avgPrice: { $avg: '$price' } }
          }
        }
      ],
      // 总数
      total: [{ $count: 'count' }]
    }
  }
])
```

### 7.3 Mongoose 中使用聚合

```javascript
// 统计每个分类的文章数和平均阅读量
const stats = await Article.aggregate([
  { $match: { status: 'published' } },
  {
    $group: {
      _id: '$category',
      articleCount: { $sum: 1 },
      avgViews: { $avg: '$views' },
      totalViews: { $sum: '$views' }
    }
  },
  { $sort: { articleCount: -1 } }
])

// 分页 + 总数（一次查询）
const page = 1
const limit = 10
const [result] = await User.aggregate([
  { $match: { isActive: true } },
  {
    $facet: {
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ],
      total: [{ $count: 'count' }]
    }
  }
])

const { data, total } = result
const totalCount = total[0]?.count || 0
```

---

## 八、索引优化

### 8.1 为什么需要索引

```javascript
// 没有索引：全集合扫描，O(n) 复杂度
// 有索引：B-tree 查找，O(log n) 复杂度

// 查看查询执行计划
const explain = await User.find({ email: 'test@example.com' }).explain('executionStats')
console.log(explain.executionStats.totalDocsExamined)  // 没有索引时 = 总文档数
```

### 8.2 在 Mongoose Schema 中定义索引

```javascript
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,    // 唯一索引（最常用）
    index: true      // 普通索引
  },
  username: {
    type: String,
    index: true
  },
  age: Number,
  createdAt: Date
})

// 复合索引（多字段联合索引）
userSchema.index({ username: 1, createdAt: -1 })
// 1 = 升序，-1 = 降序

// 文本索引（全文搜索）
userSchema.index({ title: 'text', content: 'text' })

// TTL 索引（自动过期删除）
// 适合：验证码、临时 token、日志等
const sessionSchema = new Schema({
  token: String,
  createdAt: { type: Date, default: Date.now }
})
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })  // 1小时后自动删除

// 稀疏索引（只索引有该字段的文档）
userSchema.index({ phone: 1 }, { sparse: true })
```

### 8.3 索引使用原则

```
✅ 适合建索引的字段：
- 经常作为查询条件的字段（WHERE 子句）
- 经常用于排序的字段（ORDER BY）
- 外键字段（关联查询）
- 唯一性约束字段

❌ 不适合建索引的字段：
- 很少查询的字段
- 数据量很小的集合（全扫描更快）
- 频繁写入的字段（索引会降低写入性能）
- 基数很低的字段（如 boolean，只有 true/false）

📌 复合索引的最左前缀原则：
索引 { a: 1, b: 1, c: 1 } 可以支持：
- 查询 a
- 查询 a + b
- 查询 a + b + c
但不能支持：
- 只查询 b
- 只查询 c
- 只查询 b + c
```

---

## 九、事务（Transactions）

MongoDB 4.0+ 支持多文档事务（需要副本集或分片集群）：

```javascript
const mongoose = require('mongoose')

// 转账示例：从 A 账户转钱到 B 账户
async function transfer(fromId, toId, amount) {
  // 开启 session
  const session = await mongoose.startSession()

  try {
    // 开启事务
    session.startTransaction()

    // 扣减 A 的余额
    const fromUser = await User.findByIdAndUpdate(
      fromId,
      { $inc: { balance: -amount } },
      { new: true, session }  // 必须传入 session
    )

    if (!fromUser || fromUser.balance < 0) {
      throw new Error('余额不足')
    }

    // 增加 B 的余额
    await User.findByIdAndUpdate(
      toId,
      { $inc: { balance: amount } },
      { session }
    )

    // 记录转账记录
    await Transaction.create([{
      from: fromId,
      to: toId,
      amount,
      createdAt: new Date()
    }], { session })

    // 提交事务
    await session.commitTransaction()
    console.log('转账成功')

  } catch (err) {
    // 回滚事务
    await session.abortTransaction()
    throw err
  } finally {
    // 结束 session
    session.endSession()
  }
}
```

---

## 十、实战：用户 CRUD API

```javascript
// routes/users.js
const express = require('express')
const router = express.Router()
const User = require('../models/User')

// 获取用户列表（分页 + 搜索）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, role } = req.query

    // 构建查询条件
    const query = {}
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },  // 不区分大小写
        { email: { $regex: keyword, $options: 'i' } }
      ]
    }
    if (role) query.role = role

    // 并行查询数据和总数（性能优化）
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -__v')  // 排除敏感字段
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),  // 返回普通 JS 对象，比 Mongoose 文档更快
      User.countDocuments(query)
    ])

    res.json({
      code: 200,
      data: {
        list: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v')
    if (!user) return res.status(404).json({ code: 404, message: '用户不存在' })
    res.json({ code: 200, data: user })
  } catch (err) {
    // ObjectId 格式错误
    if (err.name === 'CastError') {
      return res.status(400).json({ code: 400, message: 'ID 格式不正确' })
    }
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 创建用户
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    const { password, __v, ...userData } = user.toObject()
    res.status(201).json({ code: 201, data: userData })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ code: 400, message: errors.join(', ') })
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]
      return res.status(409).json({ code: 409, message: `${field} 已存在` })
    }
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    // runValidators: true 确保更新时也执行 Schema 校验
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password -__v')

    if (!user) return res.status(404).json({ code: 404, message: '用户不存在' })
    res.json({ code: 200, data: user })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 删除用户（软删除）
router.delete('/:id', async (req, res) => {
  try {
    // 软删除：不真正删除，只标记 isDeleted = true
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )
    if (!user) return res.status(404).json({ code: 404, message: '用户不存在' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

module.exports = router
```

---

## 十一、图形化管理工具

命令行操作适合学习，实际开发中更推荐用图形化工具来查看和管理数据。

| 工具 | 费用 | 特点 | 下载 |
|------|------|------|------|
| **MongoDB Compass** | 免费 | 官方出品，功能全面，支持聚合管道可视化 | [compass 官网](https://www.mongodb.com/products/compass) |
| **Robo 3T（Studio 3T 免费版）** | 免费 | 轻量，老牌工具，社区常用 | [github releases](https://github.com/Studio3T/robomongo/releases) |
| **Navicat for MongoDB** | 收费 | 界面统一，同时支持 MySQL/PostgreSQL/MongoDB | [navicat 官网](https://www.navicat.com.cn/) |

### 推荐：MongoDB Compass

```
1. 下载安装 MongoDB Compass
2. 连接字符串填写：mongodb://127.0.0.1:27017
3. 点击 Connect
4. 左侧可以看到所有数据库 → 集合 → 文档
5. 支持可视化 CRUD、聚合管道构建、索引管理、性能分析
```

> **实战提醒**：Compass 内置的 Aggregation Pipeline Builder 非常好用，可以逐阶段预览聚合结果，调试复杂管道时效率极高。

---

## 十二、小结

| 知识点 | 核心要点 |
|--------|----------|
| MongoDB 概念 | collection（集合）/ document（文档）/ field（字段）/ ObjectId |
| Mongoose 连接 | `mongoose.connect('mongodb://127.0.0.1:27017/dbname')` |
| Schema 定义 | 字段类型、校验规则（required/min/max/enum）、默认值、`timestamps: true` |
| 创建 | `Model.create(data)` 或 `new Model(data).save()` |
| 查询 | `find()`、`findById()`、`findOne()`，链式 `select/sort/skip/limit/lean` |
| 更新 | `findByIdAndUpdate(id, { $set: {} }, { new: true, runValidators: true })` |
| 删除 | `findByIdAndDelete(id)` 或软删除 `$set: { isDeleted: true }` |
| 关联 | `ref: 'ModelName'` + `.populate('field', 'name email')` |
| 聚合管道 | `$match → $group → $sort → $project → $lookup` |
| 索引 | `unique: true`、复合索引、TTL 索引，遵循最左前缀原则 |
| 事务 | `mongoose.startSession()` + `session.startTransaction()` |
| 图形化工具 | MongoDB Compass（官方免费）、Robo 3T（免费）、Navicat（收费） |

**下一篇**预告：接口开发规范与会话控制，RESTful 设计、apipost 测试工具、Cookie 与 Session 的原理与实现，以及 JWT 无状态认证。
