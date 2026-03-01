# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 常用命令

- `npm run dev` - 启动开发服务器（端口 3000）
- `npm run build` - 生成笔记索引并构建生产版本
- `npm run generate:index` - 从 public/notes/ 重新生成 notes-index.json
- `npm run test` - 运行测试套件
- `npm run test:watch` - 以监视模式运行测试

**重要提示**：`npm run build` 命令会在构建前自动运行 `npm run generate:index`。在 public/notes/ 中添加或修改笔记后，务必重新生成索引。

## 项目架构

这是一个静态 Vue 3 博客，渲染存储在文件系统中的 Markdown 笔记。架构遵循以下关键模式：

### 笔记索引生成

构建过程依赖 [generateNotesIndex.js](scripts/generateNotesIndex.js)，它会：
1. 递归扫描 [public/notes/](public/notes/) 中的 Markdown 文件
2. 解析每个文件的 frontmatter（使用 gray-matter）
3. 生成带有分类的层级树结构
4. 创建扁平化列表用于搜索
5. 写入 [public/notes-index.json](public/notes-index.json)

**智能排序**：笔记会智能排序以处理阿拉伯数字（"第1章"、"第10章"）和中文数字（"第一篇"、"第二篇"）。命名为"目录"、"补充"或"番外"的文件会被放在最后。

### Markdown 渲染流水线

[utils/markdown.js](src/utils/markdown.js) 配置了 markdown-it 实例，包含：
- 通过 highlight.js 进行语法高亮
- 通过 markdown-it-anchor 自动生成带 ID 的标题
- 通过 markdown-it-toc-done-right 生成目录
- 保留中文字符的自定义 slugify
- 图片懒加载
- 外部链接在新标签页打开

### 搜索系统

[utils/search.js](src/utils/search.js) 使用 fuse.js，具有：
- 多字段加权搜索（标题、内容、描述、标签、分类）
- 模糊匹配与相关性评分
- 存储在 localStorage 中的搜索历史（最多 10 条）
- 匹配位置周围的内容摘要提取

### 路由

[router/index.js](src/router/index.js) 使用基于 hash 的路由：
- `/` - 首页
- `/category/:category` - 笔记列表页
- `/note/:path(*)` - 笔记详情页（捕获嵌套路径）
- `/search` - 搜索页
- `/editor` - 编辑器页
- `/relaxation` - 休闲模式页

### 主题系统

主题切换使用：
- `#app` 容器上的 CSS 类 `dark-theme`
- localStorage 键 `theme` 进行持久化
- 自定义事件 `theme-change` 进行组件通信

### 弹窗最佳实践

**关键**：所有弹窗必须使用 `<Teleport to="body">` 以避免被 AppHeader 的 z-index 限制。详见 [docs/MODAL_BEST_PRACTICES.md](docs/MODAL_BEST_PRACTICES.md)。

Z-index 层级（定义在 [modal-guidelines.css](src/styles/modal-guidelines.css) 中）：
- `--z-header: 100` - 顶部导航栏
- `--z-sidebar: 99` - 移动端侧边栏
- `--z-dropdown: 200` - 下拉菜单
- `--z-modal: 9999` - 普通弹窗
- `--z-modal-high: 10000` - 高优先级弹窗

[BaseModal.vue](src/components/BaseModal.vue) 组件已正确实现此功能，应尽可能复用。

## 重要目录

- `public/notes/` - 按分类文件夹组织的 Markdown 源文件
- `public/notes-index.json` - 自动生成的索引（请勿手动编辑）
- `src/components/` - Vue 组件（BaseModal、MarkdownRenderer 等）
- `src/views/` - 页面级组件
- `src/utils/` - 工具函数（markdown、search、theme 等）
- `scripts/` - 构建脚本

## 配置

- [vite.config.js](vite.config.js) - Base 路径为 `/HaonanKnowledgeBlog/`，用于 GitHub Pages 部署
- [src/config/site.js](src/config/site.js) - 站点元数据、作者信息
- [vitest.config.js](vitest.config.js) - 使用 jsdom 环境的测试配置

## 添加新笔记

1. 在 `public/notes/<分类>/` 中创建 Markdown 文件
2. 可选：添加 frontmatter：
   ```yaml
   ---
   title: 文章标题
   date: 2025-01-15
   tags: [JavaScript, Vue3]
   description: 文章简短描述
   ---
   ```
3. 运行 `npm run generate:index` 更新 notes-index.json

## 测试

测试使用 Vitest 和 jsdom。示例测试文件：[utils/__tests__/scrollProgress.test.js](src/utils/__tests__/scrollProgress.test.js)。测试工具包括 @vue/test-utils。
