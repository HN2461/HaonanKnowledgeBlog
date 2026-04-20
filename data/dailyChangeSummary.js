// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-20',
  items: [
    {
      category: '内容上新',
      time: '20:42',
      title: '新增 Fetch API 避坑指南',
      summary: '整理主人的 Fetch API 学习笔记，完善格式与内容后发布到"常用缺易忘/开发的基础知识/网络"目录，补充 AbortSignal.timeout() 新 API、超时控制两种方案、主动取消请求和通用封装模板。',
      content: '新增文章：Fetch API 避坑指南，放置于 public/notes/常用缺易忘/开发的基础知识/网络 目录。内容包含：① 规范 frontmatter（title/date/category/tags/description）；② 核心特点速览与两种请求写法（GET/POST）；③ response.ok vs response.status 区别详解；④ HTTP 状态码与业务 code 两套规则对比表；⑤ 超时控制两种方案（AbortSignal.timeout() 新 API + AbortController 兼容方案）；⑥ 主动取消请求用法；⑦ 通用封装函数（含超时降级逻辑）；⑧ 常见疑问解答与五条避坑核心原则。'
    },
    {
      category: '内容上新',
      time: '21:21',
      title: '新增前端代码混淆接入实施记录',
      summary: '整理 Vue 3 + Vue CLI 5 + Webpack 5 项目接入 webpack-obfuscator 的完整实战记录，含原理解析、踩坑六大坑、多框架适配方案及验证脚本，发布到"项目复用技术/前端工程化与安全"目录。',
      content: '新增文章：前端代码混淆接入实施记录，放置于 public/notes/项目复用技术/前端工程化与安全 目录。内容包含：① webpack-obfuscator 工作机制与执行阶段顺序；② Vue CLI 配置加载时机（NODE_ENV 注入时序）；③ 依赖版本对照表（Webpack 4/5/Vite）；④ vue.config.js 完整配置（obfuscatorOptions + obfuscatorExcludes）；⑤ 六大踩坑记录（NODE_ENV 时序、glob 路径前缀、selfDefending 冲突等）；⑥ 混淆强度 L0-L5 降级策略；⑦ 多框架接入指南（Vue CLI 4/5、Vite、Next.js、Nuxt 3）；⑧ PowerShell/Bash/Node.js 三套验证脚本。'
    },
    {
      category: '功能更新',
      time: '21:49',
      title: '消息弹框优化：换行展示与高度限制',
      summary: '消息详情弹框内容改为逐条换行展示，同时限制弹框最大高度，内容过多时内部滚动，不再撑大弹框。',
      content: '优化消息通知详情弹框的展示效果。内容包含：① 修复 content 字段全角分号分隔的条目无法换行的问题；② detailParagraphs 计算属性新增按「；」拆分逻辑，同时识别「内容包含：」前缀单独成行；③ 弹框面板加入 max-height 限制（min(80vh, 640px)）；④ 弹框内容区改为 overflow-y: auto，内容多时内部滚动；⑤ 修复 content 路径末尾斜杠紧跟句号导致视觉异常的问题。'
    },
    {
      category: '功能更新',
      time: '23:18',
      title: '通知中心配色方案升级：活泼主题色系',
      summary: '为六种分类标签重新设计配色方案，采用更鲜明活泼的主题色系，全部 tab 改用深灰黑中性色，历史消息改用紫粉色与全部明显区分，整体视觉辨识度大幅提升。',
      content: '第一点：六种分类标签配色升级（内容上新薄荷绿 #10b981、功能更新天蓝 #0ea5e9、问题修复琥珀橙 #f59e0b、系统公告玫瑰红 #f43f5e、历史消息紫粉 #a855f7、Git 提交青橙 #f97316）；第二点：全部 tab 改用深灰黑中性色（#374151），避免与功能更新蓝色撞色；第三点：顶部筛选 tab 未激活状态带淡色提示，激活后边框加粗、背景加深、字重 800；第四点：标签边框统一加上 1px solid 增强视觉层次；第五点：深色模式配色同步调整为更亮的对应色系。'
    }
  ]
}
