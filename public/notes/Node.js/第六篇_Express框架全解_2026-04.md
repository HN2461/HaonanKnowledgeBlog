---
title: 第六篇：Express 框架全解
date: 2026-04-18
category: Node.js
tags:
  - Node.js
  - Express
  - Express5
  - 路由
  - 中间件
  - ejs
  - 静态资源
  - 错误处理
description: 深入掌握 Express 框架的路由系统、中间件机制、静态资源服务、ejs 模板引擎，以及 Express 5 新特性、错误处理最佳实践和生产级项目结构。
---

# 第六篇：Express 框架全解

> Express 是 Node.js 最流行的 Web 框架，极简但不简陋。理解它的中间件模型，是理解所有 Node.js 框架的基础。2024 年 10 月，Express 5 正式发布，带来了原生 async/await 支持和更严格的安全机制。

---

## 一、Express 初体验

### 1.1 安装与基础使用

```bash
mkdir my-server
cd my-server
npm init -y
# 安装 Express 5（当前最新稳定版）
npm install express
```

```javascript
// index.js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

```bash
node index.js
```

### 1.2 Express 5 新特性（2024 年 10 月正式发布）

Express 5 是 Express 4 发布 10 年后的重大更新，主要改进：

**① 原生 async/await 错误处理**

```javascript
// Express 4：async 路由必须手动 try/catch
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    next(err)  // 必须手动传给 next
  }
})

// Express 5：async 路由抛出的错误自动传给错误处理中间件
app.get('/users', async (req, res) => {
  const users = await User.find()  // 如果抛出错误，自动传给错误处理中间件
  res.json(users)
})
```

**② 路由语法变化（底层 path-to-regexp 升级）**

```javascript
// Express 4：通配符写法
app.get('*', handler)

// Express 5：必须命名通配符
app.get('/*splat', handler)
// 如果你还希望匹配根路径 /
app.get('/{*splat}', handler)

// Express 4：可选参数
app.get('/users/:id?', handler)

// Express 5：可选参数新语法
app.get('/users{/:id}', handler)
```

**③ 移除了废弃的方法**

```javascript
// Express 5 移除了：
// app.del() → 改用 app.delete()
// req.param(name) → 改用 req.params / req.query / req.body
// res.json(status, obj) → 改用 res.status(status).json(obj)
```

**④ req.body 不再默认为空对象**

```javascript
// Express 5：如果没有配置 body parser，req.body 是 undefined
// 必须显式配置：
app.use(express.json())
app.use(express.urlencoded({ extended: false }))  // extended 默认改为 false
```

### 1.3 Express vs 原生 http 模块

```javascript
// 原生 http：手动判断路径和方法，代码冗长
const http = require('http')
http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify([]))
  } else if (req.method === 'POST' && req.url === '/users') {
    // 还要手动解析请求体...
  }
})

// Express：声明式路由，简洁清晰，自动解析请求体
const express = require('express')
const app = express()
app.use(express.json())
app.get('/users', (req, res) => res.json([]))
app.post('/users', (req, res) => {
  const { name } = req.body  // 自动解析好了
  res.status(201).json({ name })
})
```

---

## 二、路由系统

### 2.1 基础路由

```javascript
const express = require('express')
const app = express()

// GET 请求
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: '张三' }])
})

// POST 请求
app.post('/users', (req, res) => {
  res.status(201).json({ message: '创建成功' })
})

// PUT 请求
app.put('/users/:id', (req, res) => {
  res.json({ message: '更新成功' })
})

// DELETE 请求
app.delete('/users/:id', (req, res) => {
  res.status(204).send()
})

// 匹配所有 HTTP 方法
app.all('/test', (req, res) => {
  res.send(`收到 ${req.method} 请求`)
})
```

### 2.2 路由参数

```javascript
// 路径参数（:xxx）
// req.params — 包含路径参数的对象
app.get('/users/:id', (req, res) => {
  const { id } = req.params  // req.params.id
  res.json({ id, name: '用户' + id })
})

// 多个路径参数
app.get('/posts/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params
  res.json({ year, month, day })
})

// Express 5 可选参数语法变化：
// Express 4：app.get('/users/:id?', handler)
// Express 5：app.get('/users{/:id}', handler)  ← 新语法
app.get('/users{/:id}', (req, res) => {
  const id = req.params.id || 'all'
  res.json({ id })
})

// 查询字符串参数（?key=value）
// req.query — 包含查询参数的对象（值均为字符串）
app.get('/search', (req, res) => {
  const { keyword, page = '1', limit = '10' } = req.query
  // GET /search?keyword=node&page=2
  // 注意：page 和 limit 是字符串，需要转换
  res.json({ keyword, page: Number(page), limit: Number(limit) })
})

// ⚠️ 废弃：req.param(name) 在 Express 5 中已移除
// 不要使用 req.param('id')，改用：
// req.params.id（路径参数）
// req.query.id（查询参数）
// req.body.id（请求体参数）
```

### 2.3 请求体参数

```javascript
// 必须先配置中间件解析请求体
app.use(express.json())                        // 解析 JSON
app.use(express.urlencoded({ extended: true })) // 解析表单

app.post('/users', (req, res) => {
  const { name, email } = req.body
  res.status(201).json({ name, email })
})
```

### 2.4 Router 模块化路由

当路由很多时，把所有路由写在一个文件里会很乱。用 `Router` 拆分：

```javascript
// routes/users.js
const express = require('express')
const router = express.Router()

// 这里的路径是相对于挂载点的
router.get('/', (req, res) => {
  res.json([{ id: 1, name: '张三' }])
})

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: '创建成功' })
})

module.exports = router

// routes/articles.js
const router = require('express').Router()

router.get('/', (req, res) => res.json([]))
router.post('/', (req, res) => res.status(201).json({}))

module.exports = router

// app.js — 挂载路由
const express = require('express')
const app = express()

app.use(express.json())

const usersRouter = require('./routes/users')
const articlesRouter = require('./routes/articles')

app.use('/api/users', usersRouter)      // /api/users/xxx
app.use('/api/articles', articlesRouter) // /api/articles/xxx

app.listen(3000)
```

---

## 三、中间件机制

### 3.1 什么是中间件

中间件是一个函数，接收 `req`、`res`、`next` 三个参数：

```javascript
function myMiddleware(req, res, next) {
  // 处理逻辑
  console.log('中间件执行了')

  // 调用 next() 把控制权交给下一个中间件
  next()

  // 如果不调用 next()，请求会一直挂起
}
```

中间件的执行是**洋葱模型**：

```
请求 → 中间件1 → 中间件2 → 路由处理 → 中间件2 → 中间件1 → 响应
```

### 3.2 全局中间件

```javascript
const express = require('express')
const app = express()

// 全局中间件：对所有请求生效
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// 解析 JSON 请求体（内置中间件）
app.use(express.json())

// 解析 URL 编码的表单数据
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello')
})
```

### 3.3 路由级中间件

```javascript
// 只对特定路径生效
app.use('/api', (req, res, next) => {
  console.log('API 请求')
  next()
})

// 只对特定路由生效（作为第二个参数传入）
function checkLogin(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: '请先登录' })
  }
  next()
}

app.get('/profile', checkLogin, (req, res) => {
  res.json({ name: '用户信息' })
})

// 多个中间件
app.post('/admin/users', checkLogin, checkAdmin, (req, res) => {
  res.json({ message: '创建成功' })
})
```

### 3.4 错误处理中间件

错误处理中间件有**四个参数**（`err, req, res, next`），必须放在所有路由之后：

```javascript
// 在路由中抛出错误
app.get('/error', (req, res, next) => {
  // 方式一：直接抛出
  throw new Error('出错了')

  // 方式二：传给 next（推荐，尤其是异步代码）
  next(new Error('出错了'))
})

// 异步路由中的错误处理
app.get('/async', async (req, res, next) => {
  try {
    const data = await someAsyncOperation()
    res.json(data)
  } catch (err) {
    next(err)  // 把错误传给错误处理中间件
  }
})

// 错误处理中间件（必须是四个参数）
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  })
})
```

### 3.5 内置中间件

```javascript
// 解析 JSON 请求体
app.use(express.json())

// 解析 URL 编码的表单数据
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use(express.static('public'))
app.use('/static', express.static('public'))  // 带路径前缀
```

### 3.6 常用第三方中间件

```bash
npm i cors morgan
```

```javascript
const cors = require('cors')
const morgan = require('morgan')

// 跨域支持
app.use(cors())
// 或者精细配置
app.use(cors({
  origin: 'http://localhost:5173',  // 允许的前端地址
  credentials: true                  // 允许携带 Cookie
}))

// HTTP 请求日志
app.use(morgan('dev'))
// dev 格式：GET /api/users 200 5.123 ms - 45
```

---

## 四、静态资源服务

### 4.1 基础用法

```javascript
// 把 public 目录下的文件作为静态资源
app.use(express.static('public'))

// 访问 public/index.html → http://localhost:3000/index.html
// 访问 public/css/style.css → http://localhost:3000/css/style.css
// 访问 public/images/logo.png → http://localhost:3000/images/logo.png
```

### 4.2 注意事项

```javascript
// 1. 路径是相对于启动 node 的目录，不是文件所在目录
// 推荐用绝对路径
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// 2. 可以设置虚拟路径前缀
app.use('/assets', express.static(path.join(__dirname, 'public')))
// 访问：http://localhost:3000/assets/style.css

// 3. 多个静态目录
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
// 按顺序查找，找到就返回

// 4. 静态资源中间件要放在路由之前
app.use(express.static('public'))  // 先处理静态文件
app.get('/', (req, res) => { ... }) // 再处理路由
```

---

## 五、ejs 模板引擎

### 5.1 安装与配置

```bash
npm install ejs
```

```javascript
const express = require('express')
const app = express()

// 设置模板引擎
app.set('view engine', 'ejs')

// 设置模板文件目录（默认是 views/）
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  // 渲染 views/index.ejs，传入数据
  res.render('index', {
    title: '首页',
    users: [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ]
  })
})
```

### 5.2 ejs 语法

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= title %></h1>

  <!-- 输出变量（自动转义 HTML，防 XSS） -->
  <p>欢迎，<%= username %></p>

  <!-- 输出原始 HTML（不转义，谨慎使用） -->
  <div><%- htmlContent %></div>

  <!-- 条件判断 -->
  <% if (isLoggedIn) { %>
    <p>已登录</p>
  <% } else { %>
    <p>未登录</p>
  <% } %>

  <!-- 循环 -->
  <ul>
    <% users.forEach(user => { %>
      <li><%= user.id %> - <%= user.name %></li>
    <% }) %>
  </ul>

  <!-- 引入其他模板（partials） -->
  <%- include('partials/header') %>
  <%- include('partials/footer', { year: 2026 }) %>
</body>
</html>
```

### 5.3 ejs 标签总结

| 标签 | 说明 |
|------|------|
| `<%= xxx %>` | 输出变量（HTML 转义，防 XSS） |
| `<%- xxx %>` | 输出原始 HTML（不转义，谨慎使用） |
| `<% code %>` | 执行 JS 代码（不输出） |
| `<%# 注释 %>` | 注释（不输出到 HTML） |
| `<%- include('path') %>` | 引入子模板 |
| `<%- include('path', { key: val }) %>` | 引入子模板并传参 |

---

## 六、express-generator 脚手架

### 6.1 安装与使用

```bash
# 官方更推荐直接用 npx，避免全局安装旧版本
npx express-generator --view=ejs my-project

# 如果你经常新建脚手架项目，再考虑全局安装
# npm install -g express-generator

# 进入目录，安装依赖
cd my-project
npm install

# 启动（默认端口 3000）
npm start
```

### 6.2 生成的项目结构

```
my-project/
├── app.js              ← 应用主文件（中间件配置、路由挂载）
├── bin/
│   └── www             ← 启动脚本（设置端口、启动 HTTP 服务器）
├── public/             ← 静态资源
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/             ← 路由文件
│   ├── index.js        ← 首页路由
│   └── users.js        ← 用户路由
├── views/              ← ejs 模板
│   ├── error.ejs
│   └── index.ejs
└── package.json
```

---

## 七、res 对象常用方法速查

```javascript
// ── 发送响应 ──
// res.send([body]) — 发送响应（自动设置 Content-Type）
//   body: string | Buffer | object | Array
res.send('Hello')
res.send(Buffer.from('binary data'))
res.send({ key: 'value' })  // 自动序列化为 JSON

// res.json([body]) — 发送 JSON 响应
//   body: 任意可序列化的值
res.json({ key: 'value' })
res.status(201).json({ id: 1 })

// ⚠️ 废弃（Express 5 已移除）：
// res.json(status, obj)  → 改用 res.status(status).json(obj)
// res.jsonp(obj, status) → 改用 res.status(status).jsonp(obj)
// res.send(body, status) → 改用 res.status(status).send(body)
// res.send(status)       → 改用 res.sendStatus(status)
// res.sendfile()         → 改用 res.sendFile()（注意大写 F）

// res.sendFile(path[, options][, fn]) — 发送文件
//   path: 文件绝对路径（必须是绝对路径）
//   options.root: 相对路径的根目录
//   options.maxAge: 缓存时间（毫秒）
//   fn: 发送完成后的回调 (err) => void
res.sendFile(path.join(__dirname, 'file.pdf'))

// res.download(path[, filename][, options][, fn]) — 触发文件下载
//   path: 文件路径
//   filename: 下载时显示的文件名（可选）
res.download('./report.pdf', '报告.pdf')

// res.redirect([status,] url) — 重定向
//   status: HTTP 状态码（默认 302）
//   url: 目标 URL
res.redirect('/login')
res.redirect(301, '/new-url')

// res.end([data][, encoding]) — 结束响应（无内容）
res.end()

// ── 设置响应头 ──
// res.set(field[, value]) / res.header(field[, value])
res.set('X-Custom', 'value')
res.set({ 'X-A': '1', 'X-B': '2' })

// res.type(type) — 设置 Content-Type
res.type('json')       // application/json
res.type('text/html')
res.type('.html')      // 根据扩展名自动识别
res.type('text/html')

// ── Cookie ──
res.cookie('name', 'value', { httpOnly: true, maxAge: 86400000 })
// 如果设置时传过 path / domain / sameSite，清除时要带上同样的选项
res.clearCookie('name')

// ── 渲染模板 ──
res.render('index', { title: '首页' })

// ── 链式调用 ──
res.status(400).set('X-Error', 'true').json({ error: '参数错误' })
```

---

## 八、生产级项目结构推荐

```
my-api/
├── src/
│   ├── app.js              ← Express 应用配置
│   ├── server.js           ← 启动入口
│   ├── routes/             ← 路由层（只做路由分发）
│   │   ├── index.js        ← 汇总所有路由
│   │   ├── users.js
│   │   └── articles.js
│   ├── controllers/        ← 控制器层（处理请求/响应）
│   │   ├── userController.js
│   │   └── articleController.js
│   ├── services/           ← 业务逻辑层
│   │   ├── userService.js
│   │   └── articleService.js
│   ├── models/             ← 数据模型层（Mongoose Schema）
│   │   ├── User.js
│   │   └── Article.js
│   ├── middleware/         ← 自定义中间件
│   │   ├── auth.js         ← JWT 认证
│   │   ├── validate.js     ← 参数校验
│   │   └── errorHandler.js ← 统一错误处理
│   └── utils/              ← 工具函数
│       ├── response.js     ← 统一响应格式
│       └── logger.js       ← 日志工具
├── .env                    ← 环境变量（不提交 git）
├── .env.example            ← 环境变量模板
└── package.json
```

```javascript
// src/app.js
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes')

const app = express()

// ── 安全与基础中间件 ──
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── 路由 ──
app.use('/api/v1', routes)

// ── 404 处理 ──
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

// ── 统一错误处理（必须放最后）──
app.use(errorHandler)

module.exports = app

// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`)

  // Mongoose 校验错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ code: 400, message: errors.join(', ') })
  }

  // MongoDB 唯一索引冲突
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({ code: 409, message: `${field} 已存在` })
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ code: 401, message: 'token 无效' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ code: 401, message: 'token 已过期' })
  }

  // 默认 500
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  })
}
```

---

## 九、小结

| 知识点 | 核心要点 |
|--------|----------|
| Express 5 | 原生 async/await 错误处理，路由语法变化，需要 Node.js 18+ |
| 路由 | `app.get/post/put/delete(path, handler)` |
| 路由参数 | `req.params`（路径参数）/ `req.query`（查询参数）/ `req.body`（请求体） |
| Router | 模块化路由，`app.use('/prefix', router)` 挂载 |
| 中间件 | `(req, res, next)` 三参数，调用 `next()` 传递控制权 |
| 错误中间件 | `(err, req, res, next)` 四参数，放在所有路由之后 |
| 静态资源 | `express.static(path.join(__dirname, 'public'))` |
| ejs | `<%= %>` 输出（转义），`<%- %>` 输出（不转义），`<% %>` 执行代码 |
| 项目结构 | routes → controllers → services → models 分层架构 |

**下一篇**预告：MongoDB 数据库实战，从安装配置到 Mongoose ODM，掌握文档型数据库的 CRUD 操作、聚合管道和关联查询。
