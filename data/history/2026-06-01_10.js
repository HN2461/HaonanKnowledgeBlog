// 历史消息归档 —— 2026-06-01 至 2026-06-10
// 归档时追加到本文件末尾的数组即可。
export const history_2026_06_01_10 = [
  {
    id: 'history-2026-06-02',
    date: '2026-06-02',
    items: [
      {
        category: '问题修复',
        time: '20:59',
        title: '修复 GitHub 拉取走代理问题并补强 Git 代理排障笔记',
        summary:
          '将 Git 全局代理明确指向 Clash / Mihomo 当前混合端口 `127.0.0.1:7897`，恢复仓库对 GitHub 的 HTTPS 连通；同时补强现有 Git 与代理专题笔记，把“浏览器能上 GitHub 但 `git pull` 还是超时”的判断思路、验证命令和回退方法写完整。',
        content:
          '第一点：执行 `git config --global http.proxy http://127.0.0.1:7897` 与 `git config --global https.proxy http://127.0.0.1:7897`，让本机 Git 走 Clash / Mihomo 当前混合端口；第二点：使用 `git ls-remote origin` 直接验证远程仓库可达，确认之前的 `Failed to connect to github.com port 443` 已恢复为可正常拉取远程分支列表；第三点：更新 `public/notes/常用缺易忘/工具速查/Git命令速查与常见问题.md`，把“先看远程是 HTTPS 还是 SSH”“浏览器能上不代表 Git 能上”“Clash 端口变化导致旧代理失效”“用 `git ls-remote origin` 做最小验证”这些关键排障点补成完整流程；第四点：同步更新 `public/notes/电脑/电脑网络/代理与VPN/代理网络问题处理指南.md`，补入终端 / Git 视角的单独排查段，解释为什么代理软件已启动时浏览器可用但 Git 依然超时，并给出按 `127.0.0.1:7897` 配置与撤销 Git 代理的命令模板；第五点：按仓库规则先将旧 `data/dailyChangeSummary.js` 中 2026-05-31 的摘要归档到新增历史分片 `data/history/2026-05-31_31.js`，并在 `data/historyNotifications.js` 中挂入聚合入口；第六点：执行 Node 运行时预检，并重新生成站内索引与通知数据，让这次笔记补强能被站内搜索和消息抽屉立即收录。',
      },
      {
        category: '内容上新',
        time: '21:18',
        title: '新增 Cloud Codex 终端零基础入门文章',
        summary:
          '在 Codex 专题新增一篇面向终端零基础用户的入门文章，用真实场景讲清 `pwd`、`cd`、`dir`、`type`、`mkdir`、`Ctrl + C` 等最常用 PowerShell 基础操作，并同步补上专题目录入口与站内搜索索引。',
        content:
          '第一点：新增 `public/notes/AI工具/02_终端Agent流/Codex/第十四篇_CloudCodex终端基础操作入门_零基础版_2026-06.md`，定位是给“会用 `cd 路径`，但其他终端操作还不顺手”的主人补最小必需基础；第二点：正文采用“场景带命令”的写法，不扩成 PowerShell 大全，而是围绕“我现在在哪、我怎么进项目、我怎么看目录、我怎么停掉命令、我怎么在 Cloud Codex 里跑最小开发流”来讲；第三点：同步更新 `public/notes/AI工具/02_终端Agent流/Codex/目录.md`，把这篇文章挂到 Codex 学习目录的前置补充位置，让终端基础薄弱的读者能先补一层再进入主线；第四点：按仓库规则先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 通过 Node 预检，再运行 `npm run generate:index`，让 `public/notes-index.json` 与 `public/search-index.json` 收录新文章，确保站内搜索和分类索引可见。',
      },
    ],
  },
  {
    id: 'history-2026-06-04',
    date: '2026-06-04',
    items: [
      {
        category: '内容上新',
        time: '21:39',
        title: '将 Codex 专题精简为 7 章并合并配置总手册',
        summary:
          '根据主人阅读反馈，将配置心智、配置字段字典和 HN246 本机配置实战三篇重复内容合并为一篇“第三篇：Codex 配置总手册”，并把 Codex 专题进一步收束为“目录 + 7 篇主文”。',
        content:
          '第一点：新增 `03_Codex配置总手册.md`，把原配置心智模型、配置字段字典、HN246 本机配置重构实战三块内容合成一篇长文，统一讲 `config.toml`、provider、模型、审批、沙箱、MCP、Desktop、Windows 路径、CCSwitch 跨机路径污染、token 脱敏和替换验证流程；第二点：删除原 `03_Codex配置心智模型.md`、`05_Codex配置字段字典.md` 和 `09_Codex_CCSwitch本机配置重构实战_HN246版.md`，避免三篇文章反复讲同一批配置字段；第三点：将后续文章顺延为 `05_Codex_CLI插件App三端联动实战.md`、`06_Codex命令与配置文件速查.md`、`07_Codex当前常用功能与进阶工作流手册.md`，并同步修正 frontmatter 标题、正文 H1、目录入口和站内链接；第四点：重写 `目录.md` 为“精简 7 章版”，明确配置相关内容以后只维护第三篇，其他文章只按线路、三端、命令和功能分工补充；第五点：删除此前保留的历史跳转页和重复附录后，继续保持 Codex 目录为少数主文结构；第六点：按仓库归档规则先将旧 `data/dailyChangeSummary.js` 中 2026-06-02 的两条消息迁移到新增历史分片 `data/history/2026-06-01_10.js`，并在 `data/historyNotifications.js` 中挂入聚合入口。',
      },
      {
        category: '问题修复',
        time: '21:30',
        title: '修复左侧标题展开模式跳转后丢失',
        summary:
          '修复左侧菜单顶部“展开完整标题模式”在切换文章后恢复默认的问题，让完整标题显示状态跨文章跳转继续保持。',
        content:
          '第一点：恢复左侧目录原本的选择事件逻辑，避免把问题误修成移动端点击文章不关闭侧栏；第二点：在 `AppLayout.vue` 中为桌面端完整标题模式增加 `localStorage` 持久化，点击“展开/恢复”时写入状态，布局因文章路由切换重新挂载后再读回状态；第三点：补充 `AppLayout.test.js` 用例，验证完整标题模式在布局重新挂载后仍保持展开，防止之后切换文章时再次丢失。',
      },
    ],
  },
  {
    id: 'history-2026-06-05',
    date: '2026-06-05',
    items: [
      {
        category: '内容上新',
        time: '17:09',
        title: '核对并完善 Node.js 系列资料时效性',
        summary:
          '按官方资料重新核对 Node.js 系列笔记，把版本基线更新到 Node.js 24 LTS，补充 Node 26 Current、Node 20 EOL、Express 5、Mongoose 9 等最新状态，并移除容易误导的新旧写法混用。',
        content:
          '第一点：更新 `public/notes/Node.js/目录.md`，新增官方核对来源表，明确 Node.js 24 LTS 是学习和生产新项目基线，Node.js 26 属于 Current / Latest 线，Node.js 20 已 EOL；第二点：修订 `第一篇_Node.js入门与Buffer_2026-04.md`，更新安装建议、npm 版本提示、Node.js 新能力状态，并把 Buffer 旧 API 说明改成更准确的废弃 / 兼容提醒；第三点：修订 `第五篇_npm包管理与nvm版本管理_2026-04.md`，把旧教程中的 Node 14/22 示例改为历史项目与当前 LTS 的区别，补充 2026-06-05 的版本判断说明；第四点：修订 `第六篇_Express框架全解_2026-04.md`，按 Express 5 官方迁移思路强化通配路由、Promise 错误处理、Node 版本要求等重点；第五点：修订 Mongoose 相关两篇文章，明确 Mongoose 9 要求 Node.js 20.19+，建议搭配 Node.js 24 LTS；第六点：移除 Node.js 两篇 Markdown 文件头 BOM，并按规则归档 2026-06-04 的旧日报摘要。',
      },
      {
        category: '功能更新',
        time: '20:21',
        title: '新增文章沉浸式阅读模式',
        summary:
          '在阅读导航球展开面板的字体大小后面加入“沉浸阅读”开关，开启后同步折叠左侧知识菜单和右侧文章目录，并让代码块自动换行完整展示；退出后恢复进入沉浸前的左右栏状态。',
        content:
          '第一点：`ReadingToolbar` 新增沉浸阅读按钮与激活态，位置放在字体大小控制之后，和阅读显示方式形成连续分组；第二点：`NoteDetailPage` 负责沉浸状态，开启时折叠右侧目录并收束文章容器宽度，退出时恢复进入沉浸前的右侧目录状态；第三点：`MarkdownRenderer` 支持代码块自动换行，沉浸阅读开启时自动隐藏代码行号并完整展示长行内容，退出后恢复横向滚动；第四点：`AppLayout` 监听阅读沉浸事件，临时收起左侧知识菜单，退出后恢复进入沉浸前的左侧菜单可见与展开状态；第五点：补充 `AppLayout` 单测验证沉浸模式开启 / 关闭时，左栏在进入前展开和进入前收起两种情况下都能正确恢复。',
      },
    ],
  },
  {
    id: 'history-2026-06-06',
    date: '2026-06-06',
    items: [
      {
        category: '内容上新',
        time: '15:26',
        title: '按 MongoDB 官方资料重写整套入门到项目实战笔记',
        summary:
          '对 `public/notes/Node.js/MongoDB详解/` 目录下的 7 篇正文与系列目录逐篇按 MongoDB 官方手册、MongoDB Node.js Driver 官方文档和 Mongoose 官方文档重新校正，补齐当前版本认知、建模思路、索引与事务边界，并继续补成带行内解释的小白注释版代码示例。',
        content:
          '第一点：重写 `目录.md`，新增官方资料基线、学习路线、能力目标和快速查找，让整套系列从目录页开始就围绕“入门到项目落地”组织；第二点：重写第一篇到第七篇的知识结构，把安装、BSON、ObjectId、原生 CRUD、Mongoose 建模、中间件、关联查询、聚合、索引、事务和项目实战都改成更贴近当前官方文档与实际项目的讲法；第三点：补入 MongoDB Manual、mongosh、Node.js Driver、Mongoose 等官方来源，并重点纠正 `findOneAndUpdate` 返回结果、嵌入与引用取舍、复合索引 / ESR 思路、事务里不要 `Promise.all()` 等容易被旧教程讲偏的点；第四点：把第二篇到第七篇的关键代码示例继续补成“小白注释版”，让 CRUD、Schema、`lean()`、`populate()`、聚合、索引与事务示例都能直接看懂每一行在做什么，并顺手清理第二篇与第五篇残留的旧内容尾巴；第五点：按仓库要求先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检通过后，多次运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保新内容和注释版示例能被站内目录和搜索收录。',
      },
      {
        category: '内容上新',
        time: '22:22',
        title: '补齐接口与会话控制系列的前后端联调篇',
        summary:
          '为 `public/notes/Node.js/接口与会话控制详解/` 新增第八篇前后端联调与常见问题排查，并同步更新系列目录、第七篇下一篇提示和笔记索引，让认证系统学习路径从原理、后端实战延伸到真实项目联调。',
        content:
          '新增 `第八篇_前后端联调与常见问题排查.md`，补充从空文件夹创建认证项目、安装依赖、配置 `.env`、设置 CORS、前端 axios 自动携带和刷新 token、localStorage 与 httpOnly Cookie 的取舍、refresh token 哈希入库、安全退出、常见 401/403/429/E11000/CastError 等错误排查，以及接入文章模块的毕业练习；同时把 `目录.md` 从 7 篇更新为 8 篇，新增快速查找入口，并在第七篇末尾补上通往第八篇的阅读提示；按规则执行 Node 运行时预检后运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
      },
    ],
  },
  {
    id: 'history-2026-06-07',
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
  },
]
