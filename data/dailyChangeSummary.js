// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-21',
  items: [
    {
      category: '内容上新',
      time: '20:37',
      title: '钉钉与企业微信第三方登录系列文章全量上新',
      summary: '新增钉钉小程序、钉钉 H5 微应用、企业微信三大专题共 20 篇文章，涵盖迁移方案选型、能力速查清单、编译链路接入、双链路登录实现、常见误区核验、企业微信 JSSDK 接入等核心主题，并为钉钉和企业微信目录各新增一篇阅读指南。',
      content: '第一点：钉钉小程序新增 6 篇（技术选型与分阶段改造方案、能力速查与适配清单、编译链路配置与首次报错处理、阅读指南，以及原有的迁移超详细指南、实战改造清单、wx替换清单、ID速查、微信能力对照、PC扫码登录方案共 10 篇完整覆盖）；第二点：钉钉 H5 微应用新增 3 篇（从部署到登录跑通全流程、双链路登录完整实现-JSAPI免登与OAuth授权、登录常见误区与官方规则核验，加上原有的从0到1开发指南、扫一扫JSAPI对接清单、uni-app适配模板共 6 篇）；第三点：企业微信新增 8 篇（开发从0到1、常见ID速查、小程序登录接入方案、JSSDK接入签名流程、网页授权登录PC扫码、H5微应用从0到1、uni-app编译H5接入、阅读指南）；第四点：第三方登录对比目录新增钉钉与企业微信登录实现笔记 1 篇；第五点：generateNotesIndex.js 修复 README.md 被误收录为文章的问题，改为阅读指南文章形式正常展示。',
    },
    {
      category: '内容上新',
      time: '21:09',
      title: 'MongoDB 详解系列 7 篇全量上新',
      summary: '在 Node.js 目录下新建 MongoDB详解 文件夹，将原第七篇拆分并大幅扩充为 7 篇从0到1的细讲文章，覆盖安装概念、原生CRUD、Mongoose建模、CRUD与中间件、关联查询与聚合管道、索引优化与事务、完整项目实战。',
      content: '第一点：第一篇——MongoDB安装与基础概念，含文档型数据库原理、与MySQL对比、ObjectId解析、Windows/Mac/Linux安装步骤、mongosh基础操作；第二点：第二篇——MongoDB原生CRUD操作，含insertOne/insertMany、find全套查询操作符（$gt/$in/$regex/$or等）、updateOne/updateMany及所有更新操作符（$set/$inc/$push/$pull等）、deleteOne/deleteMany，附综合练习题；第三点：第三篇——Mongoose连接与Schema建模，含连接配置、所有数据类型详解（String/Number/ObjectId/Array/Map等）、校验规则（required/min/max/enum/validate）、字符串转换、Schema选项、虚拟字段；第四点：第四篇——Mongoose CRUD与中间件，含create/find/findById/findByIdAndUpdate/delete全套API、链式查询、lean优化、pre save密码加密、pre find软删除过滤、实例方法与静态方法；第五点：第五篇——关联查询与聚合管道，含populate基础/选字段/配置对象/多级嵌套、aggregate全套阶段（$match/$group/$sort/$project/$lookup/$unwind/$facet）、分页+总数一次查询、标签热度统计等实战场景；第六点：第六篇——索引优化与事务，含explain执行计划、单字段/复合/文本/TTL/稀疏/部分索引、最左前缀原则、事务基本写法与withTransaction简洁写法、转账和库存扣减实战；第七点：第七篇——完整项目实战，从零搭建 Express+MongoDB 笔记管理API，含用户注册登录（bcrypt+JWT）、笔记CRUD、分页搜索、软删除自动过滤，串联所有知识点。',
    },
    {
      category: '功能更新',
      time: '21:35',
      title: 'Node.js 系列目录结构整理',
      summary: '删除第七、八篇概览文件，目录直接指向 MongoDB详解 和 接口与会话控制详解 两个子文件夹，结构更清晰。',
      content: '第一点：删除 第七篇_MongoDB数据库实战_2026-04.md 和 第八篇_接口开发与会话控制_2026-04.md 两个已被详解文件夹替代的概览文件；第二点：更新 Node.js/目录.md，第七、八篇入口直接指向各自详解系列的目录页，去掉多余的导读层级；第三点：重新生成 notes-index.json，总笔记数 307 篇。',
    },
    {
      category: '内容上新',
      time: '21:26',
      title: '接口与会话控制详解系列 7 篇全量上新',
      summary: '在 Node.js 目录下新建 接口与会话控制详解 文件夹，将原第八篇拆分并大幅扩充为 7 篇从0到1的细讲文章，覆盖 RESTful 规范、Apipost 测试、Cookie、Session、JWT、密码安全与接口防护、完整认证系统实战。',
      content: '第一点：第一篇——RESTful接口设计规范，含REST核心思想、URL名词设计、HTTP方法语义（GET/POST/PUT/PATCH/DELETE）、状态码详解（200/201/204/400/401/403/404/409/500）、统一响应格式封装、全局错误处理中间件；第二点：第二篇——Apipost接口测试工具，含安装使用、发送GET/POST/PUT/DELETE请求、设置请求头和token、环境变量配置、自动提取token脚本、完整测试流程示例；第三点：第三篇——Cookie原理与实战，含HTTP无状态协议、Cookie工作流程、cookie-parser安装使用、设置/读取/删除Cookie、maxAge/httpOnly/secure/sameSite/path/domain选项详解、签名Cookie防篡改；第四点：第四篇——Session原理与实战，含Session与Cookie的关系、express-session完整配置、登录/退出/鉴权实战、MemoryStore的局限、Redis持久化方案（connect-redis）、Session固定攻击防御；第五点：第五篇——JWT认证原理与实战，含JWT三段结构（Header/Payload/Signature）、签名防篡改原理、jwt.sign/verify/decode详解、鉴权中间件、角色权限中间件、双Token方案（access 15分钟+refresh 7天）、刷新机制、前端axios拦截器配合、JWT局限性；第六点：第六篇——密码安全与接口防护，含bcrypt加盐慢哈希原理、saltRounds选择、express-validator参数校验（isEmail/isLength/isInt/matches/custom）、校验中间件封装、express-rate-limit限流（登录5次/注册3次/验证码1次）、helmet安全响应头、环境变量管理；第七点：第七篇——完整认证系统实战，从零搭建包含注册/登录/刷新/退出/用户信息/管理员接口的完整项目，串联所有知识点，含双Token、RefreshToken TTL索引、角色权限控制、参数校验、限流、helmet。',
    },
  ],
}
