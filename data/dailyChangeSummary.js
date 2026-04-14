// 这里只保留“当天”的消息摘要。
// 主人说“汇总消息”时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-14',
  items: [
    {
      category: '问题修复',
      time: '21:24',
      title: '修复移动端阅读页滚动与定位体验',
      summary: '文章详情页在手机视图下改为更稳定的滚动容器方案，阅读进度、目录高亮、返回顶部和阅读位置恢复都会跟随真实滚动区域工作。',
      content: '今天重点修复了 src/views/NoteDetailPage.vue、src/components/AppLayout.vue、src/components/ReadingToolbar.vue、src/components/TableOfContents.vue 的移动端滚动问题，并新增 src/utils/scrollContainer.js 与对应测试，让文章页不再因为 100vh 和内层滚动容器而出现内容截断、进度异常或目录定位不准。'
    },
    {
      category: '内容上新',
      time: '21:25',
      title: '完善 Cursor 官方资料专题并校正关键表述',
      summary: 'AI 工具目录下的 Cursor 专题已扩展为完整系列，并重新对照官方文档收紧了模型、权限、GitHub、Slack、远程环境与常见问题等易误解内容。',
      content: '今天集中补齐了 public/notes/AI工具/Cursor 下的多篇专题文章与目录页，把内容扩展到覆盖安装、Rules、MCP、CLI、Bugbot、模型选择、隐私、团队治理、GitHub、Slack、Data Science 和排障等主题，同时对第 5、9、12、25、26、27、28 篇进行了官方口径校验，尽量避免旧截图或经验化说法误导读者。'
    },
    {
      category: '内容上新',
      time: '21:26',
      title: '上线 Windsurf 专题并扩展为 4 篇官方深挖内容',
      summary: 'AI 工具目录下新增 Windsurf 专题，已经形成从入门总览、官方最新深拆、Code/Plan/Ask 模式分工到 Rules/AGENTS.md/Skills/Workflows 项目治理的连续阅读链路。',
      content: '今天新建并持续完善了 public/notes/AI工具/Windsurf 目录，围绕 Windsurf 官方 docs、pricing 和 changelog 连续产出 4 篇中文文章，重点覆盖最新模式口径、Adaptive 与 quota 变化、模式切换策略，以及项目治理层的 Rules、AGENTS.md、Skills、Workflows 分工，方便站内后续继续往 MCP、Hooks、Terminal、Worktrees 方向扩展。'
    }
  ]
}
