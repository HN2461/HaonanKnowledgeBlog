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
    {
      category: '内容上新',
      time: '19:19',
      title: '重构全栈项目从 0 到 1 上线实战笔记',
      summary:
        '将“Vue + Express + MongoDB 完整上线检查清单”升级为零基础完整实战手册，覆盖服务器购买登录、环境安装、前后端上传部署、MongoDB 安全、PM2 守护、Nginx 反向代理、域名 HTTPS、防火墙和故障排查。',
      content:
        '第一点：重写 `public/notes/电脑/网站部署/全栈部署入门/07-完整上线检查清单.md`，把原来的清单式内容扩展为从本地项目准备到生产验收的连续部署路线；第二点：补充服务器购买、安全组放行、DNS A 记录、SSH 登录、Ubuntu 初始化、Node.js LTS、Nginx、MongoDB、PM2、Certbot HTTPS 等最小操作单元，并为关键步骤写入成功验证标准；第三点：补充开发环境转生产环境的改造要点，包括前端接口地址、Vite 环境变量、开发代理和 Nginx 生产代理区别、Express 端口与数据库连接环境变量、CORS 白名单；第四点：补充 MongoDB 开启认证、创建专用用户、限制 `bindIp: 127.0.0.1`、备份恢复命令和 27017 不公网裸露的安全底线；第五点：补充常见报错 FAQ，覆盖域名打不开、首页 403 / 404、Vue 子路由刷新 404、API 502 / 404、CORS、MongoDB 认证失败、ECONNREFUSED、HTTPS 证书失败、PM2 online 但接口异常；第六点：同步更新网站部署目录和全栈部署入门目录，并重新生成 `public/notes-index.json` 与 `public/search-index.json`。',
    },
  ],
}
