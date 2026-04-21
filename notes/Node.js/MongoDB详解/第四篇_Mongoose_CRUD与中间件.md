---
title: MongoDB 详解第四篇：Mongoose CRUD 与中间件
date: 2026-04-21
category: Node.js
tags:
  - MongoDB
  - Mongoose
  - CRUD
  - 中间件
  - 钩子
  - 链式查询
description: 系统掌握 Mongoose 的增删改查 API，包括 create/find/update/delete 全套方法、链式查询技巧、lean 优化，以及 pre/post 中间件的实战用法（密码加密、软删除过滤）。
---

# MongoDB 详解第四篇：Mongoose CRUD 与中间件

> Schema 定义好了，接下来就是用 Model 操作数据。这篇把 Mongoose 的增删改查 API 逐个讲透，再讲中间件（钩子）怎么用。

---

## 一、创建文档

### 1.1 两种创建方式

**方式一：new + save**

```javascript
const User = require('./models/User')

// 第一步：创建文档实例（此时还没存到数据库）
const user = new User({
  username: '张三',
  email: 'zhangsan@example.com',
  password: '123456',
  age: 25
})

// 第二步：保存到数据库
// save() 返回 Promise，保存成功后返回保存后的文档（含 _id、createdAt 等）
const savedUser = await user.save()
console.log('创建成功，ID:', savedUser._id)
```

这种方式的好处是：可以在 `save()` 之前修改文档，或者做一些判断：

```javascript
const user = new User({ username: '张三', email: 'zhangsan@example.com' })

// 保存前可以修改
user.role = 'admin'
user.isActive = true

// 也可以用 isNew 判断是否是新文档
console.log(user.isNew)  // true（还没保存）

await user.save()
console.log(user.isNew)  // false（已保存）
```

**方式二：Model.create**

```javascript
// 更简洁，直接一步完成
// Model.create(data) → Promise<Document>
const user = await User.create({
  username: '李四',
  email: 'lisi@example.com',
  password: '123456'
})
console.log('创建成功:', user._id)
```

`create` 内部就是 `new Model(data).save()`，两种方式等价。

### 1.2 批量创建

```javascript
// Model.insertMany(docs[, options]) → Promise<Document[]>
const users = await User.insertMany([
  { username: '王五', email: 'wangwu@example.com', password: '123456' },
  { username: '赵六', email: 'zhaoliu@example.com', password: '123456' },
  { username: '钱七', email: 'qianqi@example.com', password: '123456' }
])
console.log('批量创建了', users.length, '条')

// ordered: false — 遇到错误跳过，继续插入其他文档
await User.insertMany(docs, { ordered: false })
```

> **insertMany vs create 的区别**：`insertMany` 不会触发 Mongoose 中间件（pre save 钩子不会执行），`create` 会。如果你有密码加密等钩子，用 `create` 而不是 `insertMany`。

### 1.3 校验错误处理

```javascript
try {
  await User.create({ username: 'A' })  // 用户名太短，会触发校验错误
} catch (err) {
  if (err.name === 'ValidationError') {
    // err.errors 是一个对象，键是字段名，值是错误信息
    const messages = Object.values(err.errors).map(e => e.message)
    console.log('校验失败:', messages)
    // ['用户名至少3个字符', '邮箱不能为空', '密码不能为空']
  }
}

// 唯一约束冲突（email 重复）
try {
  await User.create({ email: 'existing@example.com', ... })
} catch (err) {
  if (err.code === 11000) {
    // err.keyValue 是重复的字段和值
    const field = Object.keys(err.keyValue)[0]
    console.log(`${field} 已存在`)
  }
}
```

---

## 二、查询文档

### 2.1 find — 查询多条

```javascript
// Model.find(filter, projection, options) → Query
// 返回 Query 对象，await 后得到文档数组

// 查询所有
const users = await User.find()

// 按条件查询
const activeUsers = await User.find({ isActive: true })

// 多个条件（AND 关系）
const adminUsers = await User.find({ role: 'admin', isActive: true })

// 使用操作符
const adults = await User.find({ age: { $gte: 18 } })
```

### 2.2 findById / findOne

```javascript
// findById：按 _id 查询（最常用）
// Model.findById(id) → Query<Document | null>
const user = await User.findById('6642a1b2c3d4e5f678901234')
// 找不到返回 null，不报错

// findOne：按条件查询第一条
// Model.findOne(filter) → Query<Document | null>
const user = await User.findOne({ email: 'zhangsan@example.com' })

// 处理找不到的情况
const user = await User.findById(id)
if (!user) {
  return res.status(404).json({ message: '用户不存在' })
}
```

### 2.3 链式查询

Query 对象支持链式调用，可以在 `await` 之前叠加各种条件：

```javascript
// select：选择字段（投影）
// 字段名前加 - 表示排除
const users = await User.find()
  .select('username email role')      // 只返回这三个字段（+ _id）
  .select('-password -__v')           // 排除这两个字段

// sort：排序（1 升序，-1 降序）
const users = await User.find()
  .sort({ createdAt: -1 })            // 按创建时间降序
  .sort({ age: 1, username: -1 })     // 多字段排序

// skip + limit：分页
const page = 2
const limit = 10
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit)

// 完整的链式查询示例
const result = await User
  .find({ role: 'user', isActive: true })
  .select('username email age createdAt')
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(20)
```

### 2.4 统计数量

```javascript
// countDocuments：统计匹配的文档数
const total = await User.countDocuments()                    // 总数
const activeCount = await User.countDocuments({ isActive: true })

// 分页时同时获取数据和总数（并行，性能更好）
const [users, total] = await Promise.all([
  User.find({ isActive: true }).skip(0).limit(10),
  User.countDocuments({ isActive: true })
])
```

### 2.5 lean() — 性能优化

```javascript
// 默认情况下，find 返回的是 Mongoose 文档对象
// 它有很多方法（save、toJSON 等），但也有额外开销

// .lean() 返回普通 JavaScript 对象，没有 Mongoose 方法
// 性能比普通查询快 2-3 倍，适合只读场景（列表页、API 返回等）
const users = await User.find().lean()

// lean 的文档是普通对象，不能调用 .save() 等方法
// 适合：只需要读取数据，不需要修改后保存
// 不适合：需要调用文档方法（如 user.save()）的场景

// lean 也支持虚拟字段
const users = await User.find().lean({ virtuals: true })
```

### 2.6 处理 ObjectId 格式错误

```javascript
// 如果传入的 id 格式不是合法的 ObjectId，findById 会抛出 CastError
try {
  const user = await User.findById('not-a-valid-id')
} catch (err) {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID 格式不正确' })
  }
}

// 或者提前校验
const mongoose = require('mongoose')
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: 'ID 格式不正确' })
}
```

---

## 三、更新文档

### 3.1 findByIdAndUpdate — 最常用

```javascript
// Model.findByIdAndUpdate(id, update, options) → Query<Document | null>
//
// 重要选项：
//   new: true — 返回更新后的文档（默认 false，返回更新前的）
//   runValidators: true — 更新时也执行 Schema 校验（默认 false）
//   upsert: true — 找不到时自动创建

const updated = await User.findByIdAndUpdate(
  '6642a1b2c3d4e5f678901234',
  { $set: { age: 26, updatedAt: new Date() } },
  { new: true, runValidators: true }
)

if (!updated) {
  return res.status(404).json({ message: '用户不存在' })
}
```

### 3.2 findOneAndUpdate

```javascript
// 按条件查找并更新
const user = await User.findOneAndUpdate(
  { email: 'zhangsan@example.com' },
  { $set: { isActive: false } },
  { new: true }
)
```

### 3.3 updateMany — 批量更新

```javascript
// 不返回文档，返回更新结果
const result = await User.updateMany(
  { role: 'user' },
  { $set: { isActive: true } }
)
console.log('匹配:', result.matchedCount, '条')
console.log('修改:', result.modifiedCount, '条')
```

### 3.4 常用更新操作符

```javascript
await User.findByIdAndUpdate(id, {
  // $set：设置字段值（最常用）
  $set: {
    username: '新名字',
    'address.city': '上海'   // 修改嵌套字段
  },

  // $unset：删除字段
  $unset: { phone: '' },

  // $inc：数值增减
  $inc: { loginCount: 1, score: -10 },

  // $push：向数组末尾添加元素
  $push: { tags: '新标签' },

  // $pull：从数组删除指定元素
  $pull: { tags: '旧标签' },

  // $addToSet：添加到数组，但不重复
  $addToSet: { tags: 'vip' },

  // $push + $each：一次添加多个元素
  $push: { tags: { $each: ['标签1', '标签2'] } }
}, { new: true })
```

### 3.5 直接修改文档实例后 save

```javascript
// 先查出来，修改，再保存
const user = await User.findById(id)
if (!user) throw new Error('用户不存在')

user.username = '新名字'
user.age = 26
// isModified() 可以检查字段是否被修改
console.log(user.isModified('username'))  // true

await user.save()  // 只更新被修改的字段
```

这种方式会触发 pre save 钩子，适合需要钩子处理的场景（如密码修改后重新加密）。

---

## 四、删除文档

### 4.1 findByIdAndDelete

```javascript
// 删除并返回被删除的文档
const deleted = await User.findByIdAndDelete(id)
if (!deleted) {
  return res.status(404).json({ message: '用户不存在' })
}
```

### 4.2 deleteMany

```javascript
// 批量删除，返回 { deletedCount: n }
const result = await User.deleteMany({ isActive: false })
console.log('删除了', result.deletedCount, '条')
```

### 4.3 软删除（推荐）

真实项目里很少真正删除数据，通常用软删除：

```javascript
// 软删除：不真正删除，只标记
const user = await User.findByIdAndUpdate(
  id,
  { $set: { isDeleted: true, deletedAt: new Date() } },
  { new: true }
)

// 查询时过滤掉已删除的（配合中间件自动处理，见下一节）
const users = await User.find({ isDeleted: { $ne: true } })
```

---

## 五、Mongoose 中间件（钩子）

中间件是 Mongoose 最强大的特性之一，可以在特定操作前后自动执行逻辑。

### 5.1 中间件类型

| 类型 | 触发时机 | 常见用途 |
|------|----------|----------|
| `pre('save')` | 保存前 | 密码加密、数据格式化 |
| `post('save')` | 保存后 | 发送通知、记录日志 |
| `pre('find')` | 查询前 | 自动过滤软删除数据 |
| `pre('findOneAndUpdate')` | 更新前 | 自动设置 updatedAt |
| `pre('deleteOne')` | 删除前 | 级联删除关联数据 |

### 5.2 Mongoose 9 的重要变化

```javascript
// ❌ Mongoose 8 及以前的写法（Mongoose 9 不再支持 next 参数）
userSchema.pre('save', function(next) {
  // 做一些事情
  next()
})

// ✅ Mongoose 9 推荐写法：async 函数（不需要 next）
userSchema.pre('save', async function() {
  // 做一些事情
  // 直接 return 或函数结束即可
})

// ✅ 也可以返回 Promise
userSchema.pre('save', function() {
  return someAsyncOperation()
})
```

### 5.3 实战：密码加密

这是 pre save 最经典的用法：

```javascript
// src/models/User.js
const bcrypt = require('bcrypt')  // npm install bcrypt

userSchema.pre('save', async function() {
  // this 指向当前文档实例

  // isModified('password')：只有 password 字段被修改时才重新加密
  // 避免每次 save 都重新加密（如只修改了 username）
  if (!this.isModified('password')) return

  // bcrypt.hash(明文, saltRounds)
  // saltRounds 越大越安全，但越慢，10 是推荐值
  this.password = await bcrypt.hash(this.password, 10)
})

// 在 Model 上添加验证密码的方法
userSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
}
```

使用：

```javascript
// 创建用户时，密码自动加密
const user = await User.create({
  username: '张三',
  email: 'zhangsan@example.com',
  password: '123456'  // 存入数据库时自动变成哈希值
})

// 登录时验证密码
const user = await User.findOne({ email: 'zhangsan@example.com' })
const isMatch = await user.comparePassword('123456')  // true
const isMatch2 = await user.comparePassword('wrong')  // false
```

### 5.4 实战：软删除自动过滤

每次查询都手动加 `{ isDeleted: { $ne: true } }` 很麻烦，用中间件自动处理：

```javascript
// 在所有查询操作前，自动过滤软删除的文档
const queryMethods = ['find', 'findOne', 'findOneAndUpdate', 'countDocuments']

userSchema.pre(queryMethods, function() {
  // this 指向 Query 对象
  // this.getFilter() 获取当前查询条件
  const filter = this.getFilter()

  // 如果查询条件里没有显式指定 isDeleted，自动加上过滤
  if (filter.isDeleted === undefined) {
    this.where({ isDeleted: { $ne: true } })
  }
})
```

这样之后，所有查询都自动排除软删除的文档，不需要手动加条件。

### 5.5 实战：post save 发送通知

```javascript
// 保存后执行（post hook）
// 第一个参数是保存后的文档
userSchema.post('save', function(doc) {
  // 这里可以发邮件、推送通知等
  console.log(`用户 ${doc.username} 已保存，ID: ${doc._id}`)
})

// post 也可以是 async
userSchema.post('save', async function(doc) {
  // 发送欢迎邮件（示例）
  if (doc.isNew) {
    await sendWelcomeEmail(doc.email)
  }
})
```

### 5.6 实战：删除前级联清理

```javascript
// 删除用户前，先删除该用户的所有文章
userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  // document: true — 监听文档实例的 deleteOne()（user.deleteOne()）
  // query: false — 不监听 Model.deleteOne() 查询
  const Article = require('./Article')
  await Article.deleteMany({ author: this._id })
  console.log(`已清理用户 ${this._id} 的所有文章`)
})

// 使用
const user = await User.findById(id)
await user.deleteOne()  // 触发钩子，自动清理文章
```

---

## 六、实例方法与静态方法

### 6.1 实例方法（methods）

实例方法挂在文档实例上，通过 `doc.方法名()` 调用：

```javascript
// 定义实例方法
userSchema.methods.toSafeObject = function() {
  // 返回不含敏感字段的对象
  const obj = this.toObject()
  delete obj.password
  delete obj.isDeleted
  return obj
}

userSchema.methods.isAdmin = function() {
  return this.role === 'admin'
}

// 使用
const user = await User.findById(id)
const safeUser = user.toSafeObject()  // 不含 password
console.log(user.isAdmin())           // true/false
```

### 6.2 静态方法（statics）

静态方法挂在 Model 上，通过 `Model.方法名()` 调用：

```javascript
// 定义静态方法
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findActiveUsers = function(options = {}) {
  return this.find({ isActive: true, isDeleted: { $ne: true } }, null, options)
}

// 使用
const user = await User.findByEmail('ZHANGSAN@EXAMPLE.COM')
const users = await User.findActiveUsers({ sort: { createdAt: -1 } })
```

---

## 七、小结

| 操作 | 方法 | 说明 |
|------|------|------|
| 创建 | `Model.create(data)` | 触发 pre save 钩子 |
| 批量创建 | `Model.insertMany([])` | 不触发 pre save 钩子 |
| 查询所有 | `Model.find(filter)` | 返回数组 |
| 查询单条 | `Model.findById(id)` / `findOne(filter)` | 找不到返回 null |
| 统计 | `Model.countDocuments(filter)` | 返回数字 |
| 更新 | `Model.findByIdAndUpdate(id, update, { new: true })` | new: true 返回更新后 |
| 批量更新 | `Model.updateMany(filter, update)` | 返回 { modifiedCount } |
| 删除 | `Model.findByIdAndDelete(id)` | 返回被删除的文档 |
| 批量删除 | `Model.deleteMany(filter)` | 返回 { deletedCount } |
| 性能优化 | `.lean()` | 返回普通对象，快 2-3 倍 |
| 密码加密 | `pre('save')` + bcrypt | 只在 password 修改时触发 |
| 软删除过滤 | `pre(['find', ...])` | 自动加 isDeleted 条件 |

**下一篇**：关联查询与聚合管道——populate 关联查询、aggregate 管道全套操作符详解。
