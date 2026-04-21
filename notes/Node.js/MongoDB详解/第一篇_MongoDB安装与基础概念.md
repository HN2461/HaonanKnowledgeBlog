---
title: MongoDB 详解第一篇：安装与基础概念
date: 2026-04-21
category: Node.js
tags:
  - MongoDB
  - NoSQL
  - 数据库
  - mongosh
  - 安装配置
description: 从零理解 MongoDB 文档型数据库的核心概念，与 MySQL 的对比，完整安装步骤，以及 mongosh Shell 的基础操作。
---

# MongoDB 详解第一篇：安装与基础概念

> 在学 Mongoose 之前，先把 MongoDB 本身搞清楚。这篇从"数据库是什么"讲起，到装好 MongoDB、能在终端里跑命令为止。

---

## 一、为什么用 MongoDB

### 1.1 先理解"文档型数据库"

你可能用过 MySQL，数据存在表里，每一行的列是固定的，就像 Excel 表格——每一行必须有相同的列，不能多也不能少。

MongoDB 不一样，它把数据存成**文档（Document）**，格式就是 JSON（底层是 BSON）。同一个集合里，每条文档的字段可以完全不同：

```json
// 第一条文档
{ "name": "张三", "age": 25, "email": "zhangsan@example.com" }

// 第二条文档（多了 phone 字段，少了 email 字段，完全合法）
{ "name": "李四", "age": 30, "phone": "13800138000", "address": { "city": "北京" } }
```

这种灵活性在快速迭代的项目里非常有用——需求变了，直接加字段，不用改表结构。

### 1.2 MongoDB vs MySQL 概念对照

理解 MongoDB 最快的方式是和 MySQL 做对比：

| MySQL 概念 | MongoDB 概念 | 说明 |
|------------|--------------|------|
| database（数据库） | database（数据库） | 一样，都是最顶层的容器 |
| table（表） | collection（集合） | 存放数据的地方，但 MongoDB 不要求固定结构 |
| row（行） | document（文档） | 一条数据，MongoDB 里是一个 JSON 对象 |
| column（列） | field（字段） | 数据的属性，MongoDB 里每条文档可以不同 |
| primary key（主键） | `_id`（ObjectId） | MongoDB 自动生成，是一个 24 位十六进制字符串 |
| JOIN（联表查询） | `$lookup` / `populate` | MongoDB 也能关联，但设计理念上更倾向嵌套 |
| schema（表结构） | 无强制 schema | 原生 MongoDB 不限制结构，Mongoose 可以加约束 |

### 1.3 ObjectId 是什么

MongoDB 里每条文档都有一个 `_id` 字段，默认是 ObjectId 类型，长这样：

```
6642a1b2c3d4e5f678901234
```

它是一个 12 字节的值，由以下部分组成：

```
6642a1b2  c3d4e5  f678  901234
└─时间戳─┘ └─机器ID─┘└─进程ID─┘└─随机数─┘
  4字节      3字节    2字节    3字节
```

好处是：**不需要数据库自增，分布式环境下也能保证唯一**，而且从 ObjectId 里能直接提取出文档的创建时间。

### 1.4 MongoDB 适合什么场景

```
✅ 适合：
- 数据结构经常变化的项目（快速迭代）
- 嵌套层级深的数据（如文章 + 评论 + 回复）
- 需要水平扩展的大数据量场景
- JavaScript/Node.js 全栈项目（数据格式天然一致）
- 日志、用户行为、内容管理类系统

❌ 不太适合：
- 强事务需求（如银行转账，虽然 MongoDB 4.0+ 支持事务，但不如关系型数据库成熟）
- 数据关系极其复杂、需要大量 JOIN 的场景
- 需要严格 ACID 保证的金融核心系统
```

---

## 二、安装 MongoDB

### 2.1 安装说明

MongoDB 分两个独立组件，**都要装**：

| 组件 | 作用 |
|------|------|
| **MongoDB Server（mongod）** | 数据库服务本体，负责存储和管理数据 |
| **MongoDB Shell（mongosh）** | 命令行客户端，用来连接数据库、执行命令 |

> 官方安装页面有时只提示装 Server，Shell 需要单独下载。如果装完发现终端里没有 `mongosh` 命令，就是 Shell 没装。

### 2.2 Windows 安装

**第一步：下载 MongoDB Server**

打开 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)，选择：
- Version：最新版（当前 8.x）
- Platform：Windows
- Package：msi

下载后双击安装，安装过程中：
- 选择 **Complete** 安装类型
- 勾选 **Install MongoDB as a Service**（作为 Windows 服务自动启动）
- **取消勾选** "Install MongoDB Compass"（Compass 单独装更方便）

**第二步：下载 MongoDB Shell（mongosh）**

打开 [https://www.mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell)，下载 Windows 版本，解压后把 `mongosh.exe` 所在目录加入系统 PATH。

或者直接用 winget 安装：

```bash
winget install MongoDB.Shell
```

**第三步：验证安装**

```bash
# 检查 MongoDB 服务是否在运行
# 打开任务管理器 → 服务 → 找到 MongoDB，状态应为"正在运行"

# 或者用命令行检查
sc query MongoDB

# 连接数据库
mongosh
# 看到 > 提示符说明连接成功
```

**手动启动（如果没装成服务）**：

```bash
# 先创建数据目录
mkdir C:\data\db

# 启动 MongoDB
mongod --dbpath C:\data\db
```

### 2.3 macOS 安装

```bash
# 添加 MongoDB 官方 Homebrew tap
brew tap mongodb/brew

# 安装 MongoDB Community Edition
brew install mongodb-community

# 安装 mongosh
brew install mongosh

# 启动 MongoDB 服务
brew services start mongodb-community

# 验证
mongosh
```

### 2.4 Linux（Ubuntu）安装

```bash
# 导入 MongoDB 公钥
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

# 添加软件源
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# 安装
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod  # 开机自启

# 验证
mongosh
```

### 2.5 安装图形化工具 MongoDB Compass（推荐）

命令行适合学习，实际开发中用图形化工具效率更高。

打开 [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass) 下载安装。

连接方式：
```
连接字符串：mongodb://127.0.0.1:27017
点击 Connect 即可
```

Compass 能做什么：
- 可视化浏览数据库 → 集合 → 文档
- 图形化 CRUD 操作
- 聚合管道可视化构建（调试复杂查询神器）
- 索引管理
- 性能分析（explain plan 可视化）

---

## 三、mongosh 基础操作

### 3.1 连接数据库

```bash
# 连接本地默认端口（27017）
mongosh

# 连接指定地址和端口
mongosh "mongodb://127.0.0.1:27017"

# 连接带认证的数据库
mongosh "mongodb://username:password@127.0.0.1:27017/mydb"

# 连接后看到这个提示符说明成功：
# test>
# 默认连接到 test 数据库
```

### 3.2 数据库操作

```javascript
// 查看所有数据库（只显示有数据的库）
show dbs
// 输出：
// admin   40.00 KiB
// config  72.00 KiB
// local   40.00 KiB

// 切换到某个数据库（不存在会自动创建，但要插入数据后才真正出现在 show dbs 里）
use myapp

// 查看当前在哪个数据库
db
// 输出：myapp

// 删除当前数据库（谨慎！）
db.dropDatabase()
```

### 3.3 集合操作

```javascript
// 查看当前数据库的所有集合
show collections

// 创建集合（通常不需要手动创建，插入数据时自动创建）
db.createCollection('users')

// 删除集合（谨慎！）
db.users.drop()

// 查看集合里有多少文档
db.users.countDocuments()

// 查看集合的统计信息
db.users.stats()
```

### 3.4 mongosh 实用技巧

```javascript
// 查看帮助
help

// 查看某个对象的方法
db.users.help()

// 上下箭头：翻历史命令
// Tab 键：自动补全

// 清屏
cls

// 退出
exit
// 或 Ctrl + C 两次
```

---

## 四、理解 BSON

MongoDB 底层存储格式是 **BSON（Binary JSON）**，不是普通的 JSON 文本。

BSON 相比 JSON 的区别：

| 特性 | JSON | BSON |
|------|------|------|
| 格式 | 文本 | 二进制 |
| 支持的类型 | String/Number/Boolean/Array/Object/null | 以上 + Date/ObjectId/Binary/Decimal128 等 |
| 读写速度 | 慢（需要解析文本） | 快（直接操作二进制） |
| 文件大小 | 较小 | 略大（有类型信息） |

在 mongosh 里，你写的是 JavaScript 对象，mongosh 自动帮你转成 BSON 存储。所以你可以直接用 `new Date()`、`ObjectId()` 这些 JavaScript 对象：

```javascript
// 插入时用 JavaScript 的 Date 对象
db.events.insertOne({
  name: '活动名称',
  startTime: new Date('2026-05-01'),  // 存为 BSON Date 类型
  _id: new ObjectId()                  // 手动指定 ObjectId（通常不需要）
})
```

---

## 五、小结

| 知识点 | 核心要点 |
|--------|----------|
| 文档型数据库 | 数据存为 JSON 文档，结构灵活，同集合文档可以有不同字段 |
| 核心概念 | database → collection → document → field |
| ObjectId | 自动生成的唯一 ID，12 字节，含时间戳信息 |
| 安装 | Server（mongod）+ Shell（mongosh）两个组件都要装 |
| 启动 | Windows 作为服务自动启动；Mac 用 `brew services start mongodb-community` |
| 连接 | `mongosh` 连接本地，`mongosh "mongodb://host:port"` 连接远程 |
| 图形化工具 | MongoDB Compass，官方免费，强烈推荐 |

**下一篇**：MongoDB 原生 CRUD 操作——增删改查命令全解，查询操作符、更新操作符逐个讲透。
