// 这里只保留"当天"的消息摘要。
// 后续主人说"汇总消息"时，Codex 会基于当天 git / 文件变动刷新这里的内容。
// 规则：
// 1. 只保留当天日期；如果 date 不是今天，先清空旧内容再写新内容。
// 2. items 里的每条消息都要写 category、title、summary，推荐同时写 time（HH:mm）。
// 3. Git 提交不要写进这里，Git 会作为独立分类自动展示。
// 4. 当天消息归档到 historyNotifications.js 时，优先按 items 逐条归档，保留 time 和一行 summary。

export const dailyChangeSummary = {
  date: "2026-04-12",
  items: [
    {
      category: "功能更新",
      time: "22:02",
      title: "分类页改为直接显示目录.md 导读",
      summary:
        "现在进入任意分类时，会在文章列表上方直接展示该目录下的目录.md 内容，同时目录文章本身继续隐藏，不再挤进普通文章顺序里。",
      content:
        "本次修改 src/views/NoteListPage.vue，为分类页新增“目录导读”区块，自动读取当前分类目录下的 目录.md，渲染前会去掉 frontmatter 和重复的大标题，并把目录里的相对 Markdown 链接转换成站内分类页、文章页或附件链接；这样左侧和文章序列里不再显示目录.md，但分类页本身仍然能承担导航总览作用。",
    },
    {
      category: "问题修复",
      time: "21:54",
      title: "修复详情页顶部导航文字被裁切",
      summary:
        "调整文章详情页面包屑导航的行高、最小高度和裁切方式，解决导航栏里中文底部被遮住的问题。",
      content:
        "本次修改 src/views/NoteDetailPage.vue 中顶部导航条的样式，提升 breadcrumb 区域的 min-height 与 line-height，并取消外层 track 的垂直裁切；这样在文章详情页顶部显示“首页 / 分类 / 当前文章”时，中文文字不会再出现下边缘被切掉的情况。",
    },
    {
      category: "功能更新",
      time: "21:46",
      title: "新增文章 frontmatter 排序字段 order",
      summary:
        "笔记索引与前端目录改为优先读取 frontmatter 里的 order 值，并把各目录下的目录.md 从文章序列中移出，让同一目录下的阅读顺序可以人工固定。",
      content:
        "本次更新为 scripts/generateNotesIndex.js、noteOrder.js、noteSeries.js 增加了 order 排序支持，左侧知识目录、分类页默认顺序、详情页同专题导航和上一篇下一篇都会优先按 order 排列；同时目录结构里的 目录.md 不再进入索引文章序列，左侧文件夹本身可直接进入对应分类页，旧的 /note/.../目录 链接也会自动跳转到 /category/...；另外已为 public/notes/电脑/系统与文件/ 和电脑网络下的现有笔记补上顺序值，方便后续继续按人为定义的阅读顺序维护。",
    },
    {
      category: "内容上新",
      time: "21:17",
      title: "补充 4 篇电脑系统与网络基础笔记",
      summary:
        "围绕电脑目录继续扩写系统与文件、电脑网络两条主线，新增 UAC 与管理员权限、启动项与 MSConfig、IP 与 DNS 基础、hosts 与防火墙基础共 4 篇实用笔记。",
      content:
        "本次新增 public/notes/电脑/系统与文件/Windows 管理员权限、UAC 与以管理员身份运行.md、Windows 启动项、任务管理器、MSConfig 与常用系统配置工具.md，以及 public/notes/电脑/电脑网络/网络基础/ 下的两篇网络基础笔记与目录页；内容统一按微软官方资料整理，并同步更新电脑总目录、系统与文件目录、电脑网络目录，便于后续继续扩展电脑配置类知识。",
    },
    {
      category: "内容上新",
      time: "20:28",
      title: "新增 Windows C盘常见系统文件夹说明",
      summary:
        "在新的电脑一级目录下补充系统与文件笔记，系统梳理 Program Files、Program Files (x86)、ProgramData、Users、AppData、System32 与 SysWOW64 的职责和区别。",
      content:
        "新笔记现放在 public/notes/电脑/系统与文件/ 目录下，按微软官方资料解释 C 盘常见系统目录的用途，重点说明 64 位系统中的 Program Files 与 Program Files (x86) 分工、ProgramData 与 AppData 的区别，以及 System32 / SysWOW64 的反直觉命名。",
    },
    {
      category: "功能更新",
      time: "20:36",
      title: "新增电脑一级目录与子分类",
      summary:
        "新建电脑一级目录，并补上系统与文件、电脑网络两个子层级，后续电脑类内容可以按主题继续沉淀。",
      content:
        "这次将电脑相关内容从通用常识中独立出来，新增 public/notes/电脑/目录.md 作为总入口，同时建立系统与文件、电脑网络两个子目录，方便后续持续补充电脑基础、网络与排障类笔记。",
    },
    {
      category: "功能更新",
      time: "20:43",
      title: "重整旧网络与代理内容到电脑网络体系",
      summary:
        "将原来的网络与代理笔记按内容拆分到电脑网络下的网络排障、代理与VPN两个位置，附件也随文归位。",
      content:
        "原 public/notes/网络与代理 下的电脑WIFI图标消失修复已迁入 public/notes/电脑/电脑网络/网络排障/，代理网络问题处理指南与清理代理残留.bat 已迁入 public/notes/电脑/电脑网络/代理与VPN/，并补充了对应目录说明，避免电脑类内容继续留在旧分类中。",
    },
    {
      category: "内容上新",
      time: "21:02",
      title: "补强系统与文件专题为多篇官方资料笔记",
      summary:
        "把原本只有一篇的系统与文件目录扩成总览、用户与应用数据、资源管理器显示设置、C盘清理、路径变量等多篇内容，统一以微软官方资料为主线整理。",
      content:
        "本次围绕 public/notes/电脑/系统与文件/ 重新整理专题结构，新增 Windows 用户目录、Public、AppData、ProgramData 详解，Windows 文件扩展名、隐藏文件与资源管理器显示设置，Windows C盘空间清理：Storage Sense、临时文件与 Windows.old，Windows 常见系统路径与环境变量速查，并重写目录页与总览文末配套阅读，方便按问题类型查找。",
    },
  ],
};
