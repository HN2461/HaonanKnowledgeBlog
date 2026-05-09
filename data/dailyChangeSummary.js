// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-09',
  items: [
    {
      category: '内容上新',
      time: '10:49',
      title: '新增《绝对路径与相对路径详解》',
      summary: '在 JS 辅助资料中新增第 22 篇文章，系统讲解绝对路径与相对路径的概念、区别、使用场景及常见陷阱',
      content: '文章包含：路径基础概念、Windows/Linux/URL 路径格式、相对路径符号详解、HTML/CSS/JS/Node.js 中的路径使用、常见陷阱（Node.js 相对路径、Windows 分隔符等）、实战练习题、最佳实践建议。适合前端初学者系统学习路径知识。'
    },
    {
      category: '内容上新',
      time: '11:17',
      title: '完善《第10篇：Vue Router 超详细总笔记》守卫章节',
      summary: '大幅扩充路由守卫相关内容，新增完整导航解析流程、next 进化对比、守卫实战示例等核心知识点',
      content: '补充内容包括：完整的 12 步导航解析流程、Vue Router 3/4 中 next 的进化对比表、beforeRouteEnter 在组合式 API 中的写法、afterEach 的 failure 参数详解、8 个守卫实战示例（登录权限、动态权限、保存草稿、数据刷新、Loading 控制、埋点统计等）、嵌套路由 meta 检查注意事项、高频面试问答补充（守卫执行顺序、next 区别、meta 合并等）、踩坑清单扩充（新增 7 个守卫相关常见错误）。使文档更适合长期复习和实战参考。'
    }
  ],
}
