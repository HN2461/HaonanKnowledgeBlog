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
      time: '23:04',
      title: '将 Cursor 专题重构为 8 篇官方主线文章',
      summary: 'AI 工具目录下的 Cursor 专题已从 28 篇细分稿压缩为 8 篇主线文章，目录、搜索索引与阅读顺序同步切到新的能力分组结构。',
      content: '今天对 public/notes/AI工具/Cursor 做了整组内容收敛：重新研究 Cursor 官方 docs、pricing、dashboard 与 troubleshooting 资料后，把安装迁移、核心交互、上下文治理、本地工作流、协作自动化、工具权限、团队治理和数据科学排障分别合并成 8 篇主线文章，并删除旧的 28 篇拆分稿，减少重复主题和目录噪声。'
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
