// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-30',
  items: [
    {
      category: '内容上新',
      time: '21:51',
      title: '整理 Codex 排障资料并补齐十篇文档元信息',
      summary: '将 Codex 中转切换与 Node 故障资料整理成可转发专题包，并为 Codex 根目录下 10 篇文章统一校正文档写法，补齐 frontmatter、标题一致性和相关规则。',
      content: '第一点：将原 `public/notes/Node问题/` 下的主文、采集脚本与双机对比报告整体迁移到 `public/notes/AI工具/Codex/中转切换与Node排障/`，避免继续挂在“Node问题”分类下造成误导；第二点：把主文重命名为 `第一篇_Codex中转切换后Node调用失败排查修复实录_2026-04.md`，并统一改成 `AI工具` 分类，正文里同步替换旧 `Node问题` 路径引用；第三点：重写专题 `目录.md`，增加“适合谁看、目录结构、转给别人时怎么说、切中转后最快自检动作”等内容，方便直接分享给别人复现排查；第四点：在主文里保留并补强 `shell_environment_policy`、`inherit = \"core\"`、`CC Switch` provider 配置快照、`C:\\Users\\HN246\\.cc-switch\\cc-switch.db` 等关键线索；第五点：为 `public/notes/AI工具/Codex/` 根目录下前 9 篇缺失 frontmatter 的文章统一补上 `title/date/category/tags/description`，让它们符合当前仓库笔记规范；第六点：修正第十篇和中转排障第一篇的 frontmatter 标题与 H1，补回“第X篇：”系列前缀，解决页面标题显示和系列命名不一致的问题；第七点：在 `AGENTS.md` 的笔记发布规范中新增“页面显示名称应统一”的规则，明确 `frontmatter.title`、正文 H1、目录页入口和详情页标题要一致，系列文章默认保留“第X篇：”前缀；第八点：更新 `public/notes/AI工具/Codex/目录.md` 增加专题入口，并重新生成笔记索引、搜索索引与通知数据。',
    },
    {
      category: '内容上新',
      time: '11:01',
      title: '新增《前端里的各种帧 Frame 全解》',
      summary: '在"常用缺易忘/浏览器与网络"下新增一篇系统梳理前端所有"帧"概念的文章，覆盖渲染帧、关键帧、rAF、调用栈帧、视频帧、iframe、媒体流帧、帧缓冲共 8 类。',
      content: '第一点：新增文章 `public/notes/常用缺易忘/浏览器与网络/前端里的各种帧_Frame全解.md`，系统梳理前端开发中所有叫"帧"的概念；第二点：覆盖渲染帧（60fps/16.7ms 帧预算、掉帧 jank）、CSS 关键帧（@keyframes）、Web Animations API 关键帧、requestAnimationFrame（与 setInterval 对比）、调用栈帧（Stack Frame、火焰图）、视频帧（canvas 抓帧、VideoFrame API）、iframe（内联框架、sandbox）、WebRTC 媒体流帧、WebGL 帧缓冲共 8 类；第三点：文章末尾附有一张树状总结图和快速记忆对照表，方便查阅。',
    },
    {
      category: '功能更新',
      time: '15:13',
      title: '历史消息拆分为按10天分片的文件结构',
      summary: '将 historyNotifications.js 从单一大文件重构为聚合入口 + data/history/ 分片目录，每10天一个文件，同时补齐了4月29日缺失的归档记录，并更新 AGENTS.md 归档规则。',
      content: '第一点：新建 data/history/ 目录，将历史消息按10天拆分为 2026-04-01_10.js、2026-04-11_20.js、2026-04-21_30.js 三个分片文件；第二点：data/historyNotifications.js 改为聚合入口，只做 import + 展开，对外导出名不变，generateNotifications.js 无需任何修改；第三点：补齐4月29日缺失的归档记录（共10条改动，含 SVG 入门笔记、ElementPlus 第七至十篇、CSS 第三篇重写、HTML 附件预览功能、AGENTS 规则补充等）；第四点：更新 AGENTS.md 归档规则，明确归档时找对应分片文件追加，新月份需新建分片并在聚合入口同步添加 import。',
    },
    {
      category: '功能更新',
      time: '09:48',
      title: '精简 Node 问题目录并保留报告归档结构',
      summary: '保留 Node问题 下的对比报告目录结构，删除不再需要的对比入口模板文件，并重新生成笔记索引。',
      content: '第一点：保留 `public/notes/Node问题/对比报告/公司电脑/` 与 `public/notes/Node问题/对比报告/个人电脑/` 两个归档子目录，继续作为公司电脑基准报告和个人电脑报告的固定存放位置；第二点：删除 `public/notes/Node问题/对比入口模板_公司电脑_vs_个人电脑.md`，避免 Node问题 目录里多一份重复性的说明文档；第三点：同步更新 `public/notes/Node问题/目录.md`，移除已删除模板的入口，保持目录页只展示真正需要保留的内容；第四点：执行 `npm run generate:index`，确认删除模板后索引已刷新，当前总站笔记数更新为 338 篇。',
    },
    {
      category: '问题修复',
      time: '15:18',
      title: '清理 AGENTS 重复规则并修复历史消息 id 格式',
      summary: '针对规则执行口径混乱问题，移除 AGENTS.md 中重复的 Global Engineering Rules 段；同时修复 history 分片里不符合 id 规范的 2026-04-18 归档条目。',
      content: '第一点：删除 AGENTS.md 末尾重复的 Global Engineering Rules 块，避免同一规则出现两份导致后续执行标准不一致；第二点：将 `data/history/2026-04-11_20.js` 中 `history-2026-04-18-early` 更正为合规 `history-2026-04-18`；第三点：把同日拆分的两个 2026-04-18 归档对象合并为一个对象，保留全部 items，避免同日重复节点和结构歧义。',
    },
  ],
}
