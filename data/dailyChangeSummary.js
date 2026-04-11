// 这里只保留"当天"的消息摘要。
// 后续主人说"汇总消息"时，Codex 会基于当天 git / 文件变动刷新这里的内容。
// 规则：
// 1. 只保留当天日期；如果 date 不是今天，先清空旧内容再写新内容。
// 2. items 里的每条消息都要写 category、title、summary，推荐同时写 time（HH:mm）。
// 3. Git 提交不要写进这里，Git 会作为独立分类自动展示。
// 4. 当天消息归档到 historyNotifications.js 时，优先按 items 逐条归档，保留 time 和一行 summary。

export const dailyChangeSummary = {
  date: "2026-04-11",
  items: [
    {
      category: "内容上新",
      time: "10:00",
      title: "新增 6 篇 Kiro 系列笔记",
      summary:
        "完整覆盖 Kiro 快速上手、Specs 规格系统、Steering 上下文管理、Hooks 自动化、MCP 集成与工作流实战，每篇均含 frontmatter、目录导航与参考资料。",
      content:
        "本次新增 Kiro 系列共 6 篇笔记，从安装入门到六大核心功能逐篇展开，包含大量代码示例与实战配置，并附有与 Claude Code、Codex 的横向对比，适合希望系统学习 Kiro 的读者按顺序阅读。",
    },
    {
      category: "内容上新",
      time: "10:00",
      title: "更新 Kiro 目录文件",
      summary:
        "目录文件重写为推荐阅读顺序 + 覆盖主题 + 快速查找三区块结构，方便按需跳转。",
      content:
        "目录文件新增推荐阅读顺序列表、按功能模块分组的覆盖主题区块，以及常见问题到对应篇目的快速查找映射表。",
    },
    {
      category: "内容上新",
      title: "新增 Agent Skills 系列笔记共 4 篇",
      summary:
        "系统整理 Agent Skills 开放标准，涵盖各工具兼容性对比、高级用法、场景模板与团队协作，经官方文档多轮核实。",
      content:
        "第一篇：开放标准与各工具兼容性全解，含 Claude Code / Kiro / Cursor / Codex / Gemini CLI 路径、字段、调用方式详细对比；第二篇：高级用法，含参数传递、shell 动态注入、context:fork 子代理、hooks 正确格式、压缩行为；第三篇：12 个开箱即用场景模板（代码审查、提交、部署、文档、规范、调试）；第四篇：团队协作与社区资源，含 Git 共享方案、LobeHub / OpenAI Skills Catalog 导航、Skills vs Steering 选择原则。",
    },
  ],
};
