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
]
