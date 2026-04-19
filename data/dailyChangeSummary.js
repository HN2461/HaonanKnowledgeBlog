// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-19',
  items: [
    {
      category: '内容上新',
      time: '11:05',
      title: 'Node.js 第五篇补充包管理基础概念与纠错',
      summary: '为 npm 包管理与 nvm 版本管理篇新增"零、基础概念"章节，补充包/包管理工具/常用工具表格的定义说明，并纠正 exports 字段版本号、nvm-windows 不支持 .nvmrc、npm audit fix --force 风险等三处错误。',
      content: '新增零章节：① 包的定义（package = 一组特定功能的源码集合）；② 包管理工具的作用（下载/更新/删除/上传）及跨语言类比；③ 前端常用工具对比表（npm/yarn/pnpm/cnpm）。纠错三处：① exports 字段从"Node 12+"改为"Node 12.7+ 引入，12.17+ 稳定"；② nvm-windows 明确标注不支持 .nvmrc 文件；③ npm audit fix --force 补充破坏性变更风险说明。'
    },
    {
      category: '内容上新',
      time: '12:51',
      title: 'Node.js 第六篇 Express 框架全解内容补充（第一轮）',
      summary: '补充 req 对象速查表、body-parser 历史说明、自定义 404 路由、ejs 独立使用示例、nodemon 提示，并修复章节编号缺失问题，章节从一到十连续完整。',
      content: '新增内容：① 七、req 对象常用属性速查（method/url/params/query/body/headers/cookies 等）；② 2.3 节补充 body-parser 历史说明（Express 4.16+ 已内置，老项目了解即可）；③ 2.5 节新增自定义 404 路由（app.all 通配符用法及 Express 5 写法变化）；④ 5.4 节新增 ejs 独立使用示例（ejs.render / ejs.renderFile）；⑤ 1.1 节补充 nodemon 开发启动提示。修复问题：三、中间件机制和六、express-generator 脚手架的章节标题在之前编辑中丢失，已补回；修正重复的"八"和跳号的"十一"，章节编号现为一至十连续。'
    },
    {
      category: '内容上新',
      time: '13:10',
      title: 'Node.js 第六篇 Express 框架全解补充概念解释（第二轮）',
      summary: '针对零基础学习者，在每个核心章节前补充"是什么、为什么"的概念解释，包括 Express 框架定义、路由概念与匹配过程、路由参数三种类型对比、中间件概念与洋葱模型、静态资源定义、模板引擎原理与 SSR/CSR 对比、req/res 对象说明、分层架构职责表。',
      content: '新增概念节：① 1.0 Express 是什么（框架定义、与原生 http 对比的价值）；② 2.0 路由是什么（分发规则、生活类比、三要素、匹配过程）；③ 2.2 路由参数三种类型（路径参数/查询参数/请求体参数对比表）；④ 2.4 为什么需要 Router（职责分离、目录结构示意）；⑤ 3.0 中间件是什么（快递类比、能做什么、执行顺序、洋葱模型图解）；⑥ 3.2/3.3/3.4 各类中间件加概念说明；⑦ 4.0 什么是静态资源（静态 vs 动态）；⑧ 5.0 什么是模板引擎（邮件模板类比、字符串拼接痛点、SSR vs CSR 说明）；⑨ 7/8 章 req/res 对象加一句话定义；⑩ 9.0 为什么要分层（职责分离、分层对比表）。'
    },
    {
      category: '内容上新',
      time: '15:07',
      title: 'Node.js 第六篇 Express 框架全解补充代码行内讲解（第三轮）',
      summary: '针对零基础学习者，对所有核心代码块逐行补充注释和说明，包括 app 创建流程、HTTP 方法语义、urlencoded 参数含义、next() 不调用的后果、return 的必要性、err.status 含义、cors/morgan 工作原理、app.set 配置项说明、生产级 app.js 和 errorHandler 逐行解释。',
      content: '代码讲解补充：① 1.1 基础代码逐步拆解（require/app/listen 每步说明）；② 2.1 HTTP 方法语义（GET查/POST增/PUT改/DELETE删）及 204 状态码说明；③ 2.3 urlencoded extended 参数含义（qs vs querystring）；④ 3.1 中间件函数注释（next 不调用的后果、return 终止请求）；⑤ 3.2 全局中间件注释（express.json 必须放路由前的原因）；⑥ 3.3 路由级中间件注释（return 防止重复发响应的原因）；⑦ 3.4 错误处理注释（next(err) 跳过普通中间件、err.status||500 含义）；⑧ 3.5 内置中间件加说明文字；⑨ 3.6 cors/morgan 工作原理注释；⑩ 5.1 app.set 含义及 res.render 工作流程；⑪ 9章 app.js 和 errorHandler 逐行注释（limit/NODE_ENV/module.exports 等）。'
    },
    {
      category: '内容上新',
      time: '17:55',
      title: 'Node.js 第七篇 MongoDB 数据库实战补充图形化工具章节',
      summary: '根据参考资料，在第七篇末尾新增"图形化管理工具"章节，介绍 MongoDB Compass、Robo 3T、Navicat 三款工具，并在小结表格中补充对应条目。',
      content: '新增十一章节：图形化管理工具，包含三款工具对比表（Compass 官方免费/Robo 3T 免费/Navicat 收费）及 Compass 连接步骤说明，并附实战提醒（Aggregation Pipeline Builder 调试聚合管道效率高）；小结表格新增"图形化工具"行。原章节"十一、小结"顺延为"十二、小结"。'
    }
  ]
}
