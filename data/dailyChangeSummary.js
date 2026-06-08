// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-06-08',
  items: [
    {
      category: '内容上新',
      time: '18:29',
      title: '新增全栈部署入门系列文档',
      summary:
        '在网站部署目录下新增“全栈部署入门”系列，按官方资料把 SSH、Linux、Nginx、HTTPS、Node / Express / PM2、MongoDB 生产安全、宝塔面板和完整上线清单整理成小白可跟学的部署文档。',
      content:
        '第一点：新增 `public/notes/电脑/网站部署/全栈部署入门/` 目录，并写入系列目录与 7 篇正文，覆盖部署学习路线、SSH 与 Linux 服务器基础、Nginx 静态站点 / 反向代理 / HTTPS、Node / Express / PM2 生产运行、MongoDB 认证 / 网络隔离 / 备份、宝塔面板部署与避坑、Vue + Express + MongoDB 完整上线检查清单；第二点：每篇文档都补充资料核对时间、frontmatter、官方资料来源和小白式解释，把“必学 / 建议学 / 后续学”分类讲清楚；第三点：Nginx、PM2、Express、MongoDB、备份脚本、环境变量、防火墙等代码块都加入解释性注释，说明为什么这样配置；第四点：更新 `public/notes/电脑/网站部署/目录.md`，把全栈部署入门系列挂入网站部署目录；第五点：按当日汇总规则，先将 2026-06-07 的旧日报原样迁移到 `data/history/2026-06-01_10.js`，再写入 2026-06-08 新日报；第六点：修正 Kiro 笔记测试里已经过期的旧目录路径，让测试指向当前真实的 `AI工具/01_AI编辑器流/Kiro/` 目录。',
    },
  ],
}
