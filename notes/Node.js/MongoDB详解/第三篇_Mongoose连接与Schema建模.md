---
title: MongoDB 详解第三篇：Mongoose 连接与 Schema 建模
date: 2026-04-21
category: Node.js
tags:
  - MongoDB
  - Mongoose
  - Schema
  - 数据建模
  - 数据校验
  - 虚拟字段
description: 从零掌握 Mongoose ODM，包括安装连接、Schema 定义、所有数据类型详解、校验规则配置、虚拟字段和 Schema 选项，以及 Model 的创建和使用。
---

# MongoDB 详解第三篇：Mongoose 连接与 Schema 建模

> Mongoose 是 Node.js 里操作 MongoDB 的 ODM（Object Document Mapper）。它在 MongoDB 原生驱动的基础上加了一层：Schema 约束、数据校验、中间件、更友好的 API。这篇从安装开始，把 Schema 建模讲透。

---

## 一、Mongoose 是什么，为什么用它

### 1.1 原生驱动 vs Mongoose

MongoDB 官方提供了 Node.js 驱动（`mongodb` 包），可以直接操作数据库。但原生驱动没有数据结构约束，任何数据都能存进去，容易出问题：

```javascript
// 原生驱动：没有任何约束
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db('myapp')

// 这两条都能插入，但数据结构完全不一致，后续处理很麻烦
await db.collection('users').insertOne({ name: '张三', age: 25 })
await db.collection('users').insertOne({ username: 'lisi', age: '三十岁' })  // age 是字符串！
```

Mongoose 解决了这个问题：

```javascript
// Mongoose：有 Schema 约束
const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 }
})

// age 传字符串会自动转换或报错，name 不传会报校验错误
await User.create({ name: '张三', age: 25 })
```

### 1.2 Mongoose 提供了什么

- **Schema**：定义数据结构和类型
- **数据校验**：保存前自动校验，不合法直接报错
- **中间件（钩子）**：在保存/查询/删除前后执行自定义逻辑
- **虚拟字段**：不存数据库，但可以在查询结果里计算出来
- **populate**：关联查询，自动填充关联文档
- **更友好的 API**：链式查询、Promise 支持

### 1.3 版本说明

```
Mongoose 9（2025年11月）：当前最新版，要求 Node.js 18+
Mongoose 8：要求 Node.js 16+
Mongoose 7：移除了回调函数支持，全面转向 Promise/async-await

⚠️ Mongoose 7+ 起，所有方法不再接受回调函数，必须用 Promise 或 async/await
```

---

## 二、安装与项目结构

### 2.1 安装

```bash
mkdir mongoose-demo
cd mongoose-demo
npm init -y
npm install mongoose express
```

### 2.2 推荐的项目结构

```
mongoose-demo/
├── src/
│   ├── models/          ← Schema 和 Model 定义
│   │   ├── User.js
│   │   └── Article.js
│   ├── routes/          ← 路由
│   └── db.js            ← 数据库连接
├── index.js             ← 入口文件
└── package.json
```

---

## 三、连接数据库

### 3.1 基础连接

新建 `src/db.js`：

```javascript
// src/db.js
const mongoose = require('mongoose')

// 连接字符串格式：
// mongodb://[用户名:密码@]主机[:端口]/数据库名[?选项]
const MONGODB_URI = 'mongodb://127.0.0.1:27017/myapp'

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB 连接成功')
  } catch (err) {
    console.error('❌ MongoDB 连接失败:', err.message)
    process.exit(1)  // 连接失败直接退出进程
  }
}

module.exports = connectDB
```

在入口文件里调用：

```javascript
// index.js
const express = require('express')
const connectDB = require('./src/db')

const app = express()
app.use(express.json())

// 先连接数据库，再启动服务器
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('🚀 服务器运行在 http://localhost:3000')
  })
})
```

### 3.2 连接选项

```javascript
await mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
  // 服务器选择超时：多少毫秒内找不到可用服务器就报错（默认 30000ms）
  serverSelectionTimeoutMS: 5000,

  // 连接池最大连接数（默认 5）
  // 生产环境根据并发量调整，一般 10-20
  maxPoolSize: 10,

  // 连接池最小连接数（默认 0）
  minPoolSize: 2,

  // socket 超时（默认 0，不超时）
  socketTimeoutMS: 45000,
})
```

### 3.3 监听连接事件

```javascript
// src/db.js（完整版）
const mongoose = require('mongoose')

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
      serverSelectionTimeoutMS: 5000
    })
    console.log('✅ MongoDB 连接成功')
  } catch (err) {
    console.error('❌ MongoDB 连接失败:', err.message)
    process.exit(1)
  }
}

// 连接断开时（网络波动等）
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB 连接断开，Mongoose 会自动重连')
})

// 连接出错时
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 连接错误:', err)
})

// 优雅关闭：收到 SIGINT（Ctrl+C）时，先关闭数据库连接再退出
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB 连接已关闭')
  process.exit(0)
})

module.exports = connectDB
```

### 3.4 连接字符串格式

```javascript
// 本地无认证
'mongodb://127.0.0.1:27017/myapp'

// 本地有认证
'mongodb://admin:password123@127.0.0.1:27017/myapp?authSource=admin'

// MongoDB Atlas（云数据库）
'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myapp'

// 副本集（生产环境高可用）
'mongodb://host1:27017,host2:27017,host3:27017/myapp?replicaSet=rs0'
```

---

## 四、定义 Schema

Schema 是数据结构的"蓝图"，定义了集合里的文档有哪些字段、每个字段是什么类型、有什么约束。

### 4.1 最简单的 Schema

```javascript
// src/models/User.js
const { Schema, model } = require('mongoose')

// 第一步：定义 Schema（数据结构）
const userSchema = new Schema({
  name: String,    // 最简写法：只指定类型
  age: Number,
  email: String,
  isActive: Boolean
})

// 第二步：用 Schema 创建 Model
// model('Model名称', schema)
// Model 名称通常用单数大写，Mongoose 自动转为复数小写作为集合名
// 'User' → 集合名 'users'
const User = model('User', userSchema)

// 第三步：导出 Model
module.exports = User
```

### 4.2 字段配置对象写法

实际项目里，字段通常需要更多配置，用对象写法：

```javascript
const userSchema = new Schema({
  name: {
    type: String,           // 字段类型（必填）
    required: true,         // 是否必填
    trim: true,             // 自动去除首尾空格
    minlength: 2,           // 最小长度
    maxlength: 20           // 最大长度
  },
  age: {
    type: Number,
    min: 0,                 // 最小值
    max: 150,               // 最大值
    default: 0              // 默认值
  },
  email: {
    type: String,
    required: true,
    unique: true,           // 唯一约束（会创建唯一索引）
    lowercase: true         // 保存前自动转小写
  }
})
```

---

## 五、Schema 数据类型详解

### 5.1 基础类型

```javascript
const demoSchema = new Schema({
  // String：字符串
  name: String,
  // 等价于：
  name: { type: String },

  // Number：数字（整数和浮点数都是 Number）
  age: Number,
  price: Number,

  // Boolean：布尔值
  isActive: Boolean,

  // Date：日期
  birthday: Date,
  createdAt: { type: Date, default: Date.now },  // 默认当前时间

  // Buffer：二进制数据（如文件内容）
  avatar: Buffer,

  // Mixed：任意类型（不推荐，失去了 Schema 的意义）
  meta: Schema.Types.Mixed,
  // 或简写：
  meta: {}
})
```

### 5.2 ObjectId — 关联其他文档

```javascript
const articleSchema = new Schema({
  title: String,

  // 存储另一个文档的 _id，用于关联查询
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'   // 关联的 Model 名称，populate 时用到
  }
})
```

### 5.3 数组类型

```javascript
const userSchema = new Schema({
  // 字符串数组
  tags: [String],
  // 等价于：
  tags: { type: [String], default: [] },

  // 数字数组
  scores: [Number],

  // ObjectId 数组（关联多个文档）
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // 对象数组（嵌套 Schema）
  addresses: [{
    city: String,
    province: String,
    isDefault: { type: Boolean, default: false }
  }]
})
```

### 5.4 嵌套对象

```javascript
const userSchema = new Schema({
  // 嵌套对象（直接写）
  address: {
    city: String,
    province: String,
    zipCode: String
  },

  // 嵌套对象（用子 Schema，可复用）
  profile: profileSchema
})

// 访问嵌套字段
const user = await User.findOne({ 'address.city': '北京' })
await User.updateOne({ _id: id }, { $set: { 'address.city': '上海' } })
```

### 5.5 Map 类型

```javascript
// Map：键值对，键是字符串，值是指定类型
const userSchema = new Schema({
  // 存储用户的各种偏好设置
  preferences: {
    type: Map,
    of: String  // 值的类型
  }
})

// 使用
const user = new User({
  preferences: new Map([
    ['theme', 'dark'],
    ['language', 'zh-CN']
  ])
})

// 访问
user.preferences.get('theme')  // 'dark'
user.preferences.set('fontSize', '14px')
```

---

## 六、校验规则详解

### 6.1 内置校验器

```javascript
const userSchema = new Schema({
  // required：必填
  name: {
    type: String,
    required: true,                          // 简单写法
    required: [true, '姓名不能为空'],         // 自定义错误信息
    required: function() {                   // 动态必填（函数返回 true 则必填）
      return this.role !== 'guest'
    }
  },

  // String 专属校验
  username: {
    type: String,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'],
    enum: {
      values: ['admin', 'user', 'guest'],
      message: '角色必须是 admin、user 或 guest'
    }
  },

  // Number 专属校验
  age: {
    type: Number,
    min: [0, '年龄不能为负数'],
    max: [150, '年龄不合法']
  },

  // 默认值
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },

  // 默认值也可以是函数（每次创建文档时调用）
  token: {
    type: String,
    default: () => Math.random().toString(36).slice(2)
  }
})
```

### 6.2 自定义校验器

```javascript
const userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      // validator 函数：返回 true 表示校验通过，false 表示失败
      validator: function(v) {
        return /^1[3-9]\d{9}$/.test(v)
      },
      message: props => `${props.value} 不是有效的手机号`
    }
  },

  // 异步校验（检查邮箱是否已存在）
  email: {
    type: String,
    validate: {
      validator: async function(v) {
        // this 指向当前文档
        // isNew 表示是新建文档（更新时不重复校验）
        if (!this.isNew) return true
        const count = await mongoose.model('User').countDocuments({ email: v })
        return count === 0
      },
      message: '该邮箱已被注册'
    }
  }
})
```

### 6.3 字符串转换选项

```javascript
const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,   // 保存前自动转小写
    uppercase: false,  // 保存前自动转大写（和 lowercase 互斥）
    trim: true         // 保存前自动去除首尾空格
  }
})

// 这些转换在保存前自动执行，不需要手动处理
const user = new User({ email: '  ZHANGSAN@EXAMPLE.COM  ' })
await user.save()
// 实际存储的是：'zhangsan@example.com'
```

---

## 七、Schema 选项

Schema 的第二个参数是选项对象：

```javascript
const userSchema = new Schema({
  name: String,
  // ...
}, {
  // timestamps：自动添加 createdAt 和 updatedAt 字段
  // 强烈推荐开启，几乎所有业务表都需要
  timestamps: true,

  // versionKey：禁用 __v 字段（Mongoose 用来做乐观锁的版本号）
  // 如果不需要乐观锁，可以关掉，减少字段干扰
  versionKey: false,

  // collection：自定义集合名（默认是 Model 名的复数小写）
  // 'User' → 默认集合名 'users'
  // 如果你想用 'user_info' 这样的名字：
  collection: 'user_info',

  // strict：严格模式（默认 true）
  // true：保存时忽略 Schema 未定义的字段
  // false：允许保存任意字段（不推荐）
  strict: true,

  // toJSON / toObject：控制文档转换时的行为
  toJSON: {
    virtuals: true,   // 包含虚拟字段
    versionKey: false // 不包含 __v
  },
  toObject: {
    virtuals: true
  }
})
```

---

## 八、虚拟字段（Virtuals）

虚拟字段不存储在数据库里，但可以在查询结果上计算出来，非常适合做"派生数据"。

### 8.1 基础用法

```javascript
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  birthday: Date
})

// 定义虚拟字段：全名
userSchema.virtual('fullName').get(function() {
  // ⚠️ 必须用普通函数，不能用箭头函数（需要 this 指向文档）
  return `${this.firstName} ${this.lastName}`
})

// 定义虚拟字段：年龄（根据生日计算）
userSchema.virtual('age').get(function() {
  if (!this.birthday) return null
  const today = new Date()
  const birth = new Date(this.birthday)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
})
```

使用：

```javascript
const user = await User.findOne({ firstName: '三' })
console.log(user.fullName)  // '张 三'
console.log(user.age)       // 根据生日计算出的年龄
```

### 8.2 虚拟字段默认不出现在 JSON 里

```javascript
// 默认情况下，虚拟字段不会出现在 JSON 输出里
const user = await User.findOne({})
console.log(JSON.stringify(user))  // 没有 fullName 字段！

// 需要在 Schema 选项里开启
const userSchema = new Schema({ ... }, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 或者在查询时指定
const user = await User.findOne({}).lean({ virtuals: true })
```

### 8.3 虚拟字段的 setter

```javascript
// 虚拟字段也可以有 setter，用于解析输入
userSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`
  })
  .set(function(v) {
    // 设置 fullName 时，自动拆分到 firstName 和 lastName
    const parts = v.split(' ')
    this.firstName = parts[0]
    this.lastName = parts[1] || ''
  })

// 使用
const user = new User()
user.fullName = '张 三'
console.log(user.firstName)  // '张'
console.log(user.lastName)   // '三'
```

---

## 九、Model 的创建与使用

### 9.1 model() 函数

```javascript
// mongoose.model(name, schema[, collection])
//   name: Model 名称（字符串），用于 populate 的 ref 引用
//   schema: Schema 实例
//   collection: 可选，自定义集合名（也可以在 Schema 选项里设置）

const User = mongoose.model('User', userSchema)
// 集合名：users（自动复数化小写）

const Category = mongoose.model('Category', categorySchema)
// 集合名：categories（自动处理不规则复数）

// 如果自动复数化不对，手动指定
const Staff = mongoose.model('Staff', staffSchema, 'staff')
// 集合名：staff（不复数化）
```

### 9.2 完整的 Model 文件示例

```javascript
// src/models/User.js
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    match: [/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名包含非法字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '邮箱格式不正确']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6位']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: '角色值不合法'
    },
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, '简介最多200字'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // 软删除字段
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true,   // 自动 createdAt / updatedAt
  versionKey: false   // 不要 __v
})

// 虚拟字段：用于 populate 时的关联文章
userSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'author'
})

// 导出前不暴露密码（toJSON 时自动移除）
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password
    delete ret.isDeleted
    delete ret.deletedAt
    return ret
  }
})

const User = model('User', userSchema)
module.exports = User
```

---

## 十、小结

| 知识点 | 核心要点 |
|--------|----------|
| Mongoose 作用 | 在原生驱动上加 Schema 约束、校验、中间件、populate |
| 连接数据库 | `mongoose.connect(uri)` 返回 Promise，用 async/await |
| Schema 定义 | `new Schema({ 字段: 类型或配置对象 })` |
| 常用类型 | String / Number / Boolean / Date / ObjectId / Array / Mixed |
| 校验规则 | required / min / max / minlength / maxlength / enum / match / validate |
| 字符串转换 | lowercase / uppercase / trim（保存前自动处理） |
| Schema 选项 | timestamps / versionKey / collection / strict / toJSON |
| 虚拟字段 | `.virtual('name').get(fn)` — 不存数据库，查询时计算 |
| 创建 Model | `model('ModelName', schema)` — 集合名自动复数化 |

**下一篇**：Mongoose CRUD 与中间件——增删改查 API 全解、链式查询技巧、pre/post 钩子实战（密码加密、软删除过滤）。
