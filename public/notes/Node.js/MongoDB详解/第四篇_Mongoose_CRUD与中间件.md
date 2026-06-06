---
title: MongoDB 详解第四篇：Mongoose CRUD 与中间件
date: 2026-06-06
category: Node.js
tags:
  - MongoDB
  - Mongoose
  - CRUD
  - 中间件
  - 钩子
  - lean
description: 从业务代码视角掌握 Mongoose 常用 CRUD、查询链、更新方式选择、lean 优化和文档/查询中间件，建立更安全、更可维护的项目写法。
---

# MongoDB 详解第四篇：Mongoose CRUD 与中间件

> 这一篇的目标不是把方法名背一遍，而是让你知道“项目里应该怎么写更稳”。很多 bug 不是不会 CRUD，而是方法选错了。

---

## 一、创建数据时，先会区分 `create()` 和 `save()`

### 1.1 `create()`

```javascript
// create() 适合“我已经准备好数据了，直接存”
const user = await User.create({
  username: 'haonan',
  email: 'haonan@example.com',
  password: '123456'
})
```

适合：

- 一步创建
- 代码简洁
- 大多数普通新增场景

### 1.2 `new Model()` + `save()`

```javascript
// new User(...) 先创建文档实例
const user = new User({
  username: 'haonan',
  email: 'haonan@example.com',
  password: '123456'
})

// 这时还没保存进数据库，你还可以继续改字段
user.role = 'admin'

// 调用 save() 才真正写入数据库
await user.save()
```

适合：

- 创建前还要进一步处理数据
- 你想拿到文档实例并在保存前做更多判断

### 1.3 项目里怎么选

- 简单新增，用 `create()`
- 需要围绕文档实例做逻辑，用 `save()`

---

## 二、批量写入别只看快不快，还要看钩子和校验

```javascript
// insertMany() 一次性插入多条
// 适合批量导入、造测试数据
await User.insertMany([
  { username: 'u1', email: 'u1@example.com', password: '123456' },
  { username: 'u2', email: 'u2@example.com', password: '123456' }
])
```

`insertMany()` 很适合导入、初始化数据，但你要特别注意：

- 它和 `save()` / `create()` 的生命周期并不完全一样
- 如果你的业务依赖某些中间件，必须先确认这些中间件是否会按预期触发

这也是为什么项目里涉及密码加密、复杂校验时，很多团队仍然更谨慎地使用逐条创建逻辑。

---

## 三、读取数据时，真正常用的是这几组组合

### 3.1 查列表

```javascript
// 这是典型列表页写法：
// 查状态是 published 的文章
const list = await Article.find({ status: 'published' })
  .select('title tags author createdAt') // 只返回列表页需要的字段
  .sort({ createdAt: -1 }) // 最新文章排前面
  .skip(0) // 跳过前 0 条
  .limit(10) // 只拿 10 条
```

这是最标准的后台列表页写法。

### 3.2 查单条

```javascript
// findById(id) 是最直接的“按 _id 查一条”
const article = await Article.findById(articleId)
```

或者按业务条件查：

```javascript
// findOne() 适合“按多个业务条件查一条”
const article = await Article.findOne({
  _id: articleId,
  status: 'published'
})
```

### 3.3 统计总数

```javascript
// countDocuments() 用来统计满足条件的数据总数
const total = await Article.countDocuments({ status: 'published' })
```

做分页时通常配合 `Promise.all()`：

```javascript
// Promise.all 表示“两个异步操作并行执行”
// 一边查当前页数据，一边查总数
const [list, total] = await Promise.all([
  Article.find({ status: 'published' })
    .sort({ createdAt: -1 }) // 稳定排序
    .skip((page - 1) * pageSize) // 跳过前面页的数据
    .limit(pageSize) // 取当前页数量
    .lean(), // 只做展示时用 lean() 更轻
  Article.countDocuments({ status: 'published' })
])
```

这类并行很常见，但注意：

- 普通查询里可以这样做
- 事务里不要这么写，后面第六篇会专门讲

---

## 四、`lean()` 很重要，但不要乱用

```javascript
// lean() 后返回的是普通对象，不是 Mongoose 文档实例
const list = await Article.find({ status: 'published' }).lean()
```

`lean()` 会让查询结果变成普通 JavaScript 对象，而不是 Mongoose 文档实例。

好处：

- 更轻量
- 更快
- 很适合列表、纯展示接口

代价：

- 没有文档实例方法
- 不能直接 `save()`
- 某些依赖文档特性的行为不会存在

所以你可以记成：

- 只读列表接口，优先考虑 `lean()`
- 后续还要修改文档、调用实例方法时，不要轻易 `lean()`

---

## 五、更新数据时，方法选择决定你后面会不会掉坑

### 5.1 先查后改再保存

```javascript
// 先把这条用户查出来
const user = await User.findById(userId)

if (!user) {
  throw new Error('用户不存在')
}

// 拿到文档实例后，可以像改普通对象一样改字段
user.profile.city = '上海'

// save() 会把修改同步回数据库
await user.save()
```

适合：

- 你要基于旧值做复杂判断
- 你希望文档中间件逻辑清晰

### 5.2 `findByIdAndUpdate()` / `findOneAndUpdate()`

```javascript
const article = await Article.findByIdAndUpdate(
  articleId, // 直接按 _id 定位
  {
    $set: {
      title: '更新后的标题', // 改标题
      status: 'published'
    }
  },
  {
    new: true, // 返回更新后的文档
    runValidators: true // 更新时也执行 Schema 校验
  }
)
```

这里有两个高频配置一定要记住：

- `new: true` 返回更新后的文档
- `runValidators: true` 更新时也执行校验

### 5.3 项目里怎么选

- 复杂业务逻辑，优先“查出来后修改再 `save()`”
- 简单直接更新，`findOneAndUpdate()` 更高效

---

## 六、删除数据时，项目里常见的是软删除

```javascript
await Article.findByIdAndUpdate(articleId, {
  $set: {
    isDeleted: true, // 打上“已删除”标记
    deletedAt: new Date()
  }
})
```

然后在查询时统一过滤：

```javascript
// 以后查列表时，统一排除已删除数据
Article.find({ isDeleted: { $ne: true } })
```

软删除的优势：

- 方便恢复
- 方便审计
- 误删后还有缓冲空间

---

## 七、中间件是什么，为什么它这么适合做“统一规则”

Mongoose 中间件可以理解成：

在某些数据库动作之前或之后，自动执行一段逻辑。

最典型的用途：

- 密码加密
- 自动更新时间
- 软删除过滤
- 日志埋点

---

## 八、密码加密是最经典的文档中间件案例

```javascript
import bcrypt from 'bcrypt'

userSchema.pre('save', async function () {
  // 只有 password 被修改过时，才需要重新加密
  if (!this.isModified('password')) {
    return
  }

  // 把明文密码转换成哈希值
  this.password = await bcrypt.hash(this.password, 10)
})
```

这段代码背后的思路特别重要：

- 不是在每个注册接口里都手动写加密
- 而是把规则放到模型层，统一生效

这样后面无论谁调用 `save()`，密码都不会被明文存库。

---

## 九、查询中间件很适合做软删除默认过滤

```javascript
articleSchema.pre(/^find/, function () {
  // 先取到本次查询原本自带的过滤条件
  const filter = this.getFilter()

  // 如果业务层没主动指定 isDeleted 条件
  // 就默认过滤掉已删除的数据
  if (filter.isDeleted === undefined) {
    this.where({ isDeleted: { $ne: true } })
  }
})
```

这个写法的意义是：

- 平时查询自动排除已删除数据
- 只有你显式写了 `isDeleted` 条件时，才按你的条件查

这能明显减少业务层重复代码。

---

## 十、一个项目里很实用的完整模型片段

```javascript
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean, // 软删除标记
      default: false
    },
    deletedAt: Date // 删除时间
  },
  {
    timestamps: true, // 自动维护创建时间、更新时间
    versionKey: false
  }
)

articleSchema.pre(/^find/, function () {
  const filter = this.getFilter()

  if (filter.isDeleted === undefined) {
    this.where({ isDeleted: { $ne: true } })
  }
})
```

看起来代码不多，但已经解决了两个真实项目问题：

1. 自动带创建更新时间
2. 默认隐藏软删除数据

---

## 十一、新手高频踩坑提醒

### 11.1 以为 `lean()` 后还能 `save()`

不行。`lean()` 返回的是普通对象。

### 11.2 更新时忘记 `runValidators`

结果创建时规则严格，更新时反而脏数据进来了。

### 11.3 以为所有更新方式都会走同一种中间件

不同方法的生命周期不同，不能想当然。

### 11.4 把过多业务逻辑塞到中间件里

中间件适合“统一规则”，不适合承载复杂业务编排。

---

## 十二、小结

这一篇你最该形成的是“方法选择意识”：

1. 创建时知道 `create()` 和 `save()` 的区别
2. 查询时熟练使用 `select/sort/skip/limit/countDocuments`
3. 知道列表接口为什么适合 `lean()`
4. 更新时知道什么时候该先查后改、什么时候直接 `findOneAndUpdate()`
5. 学会用中间件统一处理密码加密和软删除过滤

### 官方资料

- Queries: https://mongoosejs.com/docs/queries.html
- Middleware: https://mongoosejs.com/docs/middleware.html
- Lean: https://mongoosejs.com/docs/tutorials/lean.html
- findOneAndUpdate: https://mongoosejs.com/docs/tutorials/findoneandupdate.html

**下一篇**：继续往项目深水区走，讲 `populate()`、`$lookup` 和聚合管道。
