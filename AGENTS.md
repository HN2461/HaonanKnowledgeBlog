# Repository Guidelines（仓库指南）

## 快速规则
- 称呼用户为“主人”。
- 代码风格：2 空格缩进、单引号、无行尾分号。
- `src` 内部模块优先使用 `@/` 别名导入（见 `vite.config.js`）。
- 路由使用 hash history（`src/router/index.js`）。
- `public/notes-index.json` 为脚本生成文件，不建议手动修改。
- 变更 `public/notes/` 后必须运行 `npm run generate:index` 并提交 `public/notes-index.json`。
- `dist/` 为构建产物目录，不应手动修改。

## 项目结构与模块组织
- `src/main.js`：Vue 应用入口。
- `src/views/`：路由级页面组件。
- `src/components/`：可复用 UI 组件。
- `src/router/index.js`：路由定义，使用 hash history。
- `src/utils/`：通用工具函数；测试位于 `src/utils/__tests__/`。
- `src/styles/`：全局与通用样式。
- `public/notes/**`：Markdown 笔记内容。
- `scripts/generateNotesIndex.js`：扫描笔记并生成可搜索索引。

## 构建、测试与开发命令
- `npm install`：安装依赖。
- `npm run dev`：启动本地开发服务（默认 `http://localhost:3000`，自动打开浏览器）。
- `npm run generate:index`：重新生成分类与搜索索引。
- `npm run build`：先生成索引，再构建生产包到 `dist/`。
- `npm run preview`：本地预览生产构建结果。
- `npm test`：执行一次 Vitest 测试。
- `npm run test:watch`：以监听模式运行测试。
- `npm test -- --coverage`：输出覆盖率报告（`text`、`json`、`html`）。

## 代码风格与命名规范
- 技术栈使用 Vue 3 SFC + ESM JavaScript。
- 组件与页面文件使用 PascalCase（如 `NoteDetailPage.vue`）。
- 工具模块使用 camelCase（如 `scrollProgress.js`）。

## 测试规范
- 测试框架为 Vitest，环境为 `jsdom`，启用全局 API。
- 测试文件放在 `__tests__` 目录，并使用 `*.test.js` 命名。
- 新增工具逻辑或修复缺陷时，应同步新增或更新测试。
- 当前未强制覆盖率阈值；中大型改动建议附覆盖率结果。

## 提交与 Pull Request 规范
- 历史提交以中文祈使句、功能导向标题为主。
- 建议格式：`<范围>: <变更>`，例如 `阅读工具栏: 修复滚动位置恢复`。
- 避免使用 `优化`、`vue`、`1` 这类过于笼统的标题。
- PR 至少应包含：变更摘要、影响路径、执行过的命令（如 `npm test`、`npm run build`）、关联 issue、UI 变更截图或 GIF。

## 配置提示
- `vite.config.js` 中 `base: '/HaonanKnowledgeBlog/'` 用于 GitHub Pages 部署；部署路径变化时需同步更新。

## 运行与截图（实测可用）
- 执行“运行项目并截图”时，优先使用：`node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`。
- 避免使用复杂的 `Start-Process + npm + 重定向` 组合，部分终端策略可能拦截并报 `blocked by policy`。
- 本项目配置了 `base: '/HaonanKnowledgeBlog/'`，访问首页请使用：`http://127.0.0.1:5173/HaonanKnowledgeBlog/#/`。
- 截图默认使用 Chrome DevTools MCP 全页截图（`fullPage: true`），建议保存到 `docs/screenshots/`，命名 `home-YYYY-MM-DD-full.png`。

## Global Engineering Rules
### 统一编码
- 所有源码与配置文件统一使用 UTF-8（无 BOM）。
- 禁止使用 UTF-8 with BOM、GBK、ANSI 混用。
- 全局编码统一设置为 UTF-8。
- 项目编码统一设置为 UTF-8。
- 属性文件（`.properties`）默认编码统一为 UTF-8。
- 创建 UTF-8 文件时必须使用 UTF-8（无 BOM）。

### 中文内容规范
- 中文注释、中文日志、中文文档必须可读，不允许乱码（如鍥藉）。
- 发现乱码优先检查文件实际编码与 IDE 显示编码是否一致。

### 注释规范
- 保留已有业务注释，不随意删除历史说明和关键 `//` 注释块。
- 新增代码必须补充必要注释，说明为什么这样做，避免空泛注释。
- 接口方法注释至少包含：用途、参数、返回值、异常/边界行为。

### Java 文件保存规则
- 保存 Java 文件时强制 UTF-8 no BOM。
- 批量改文件后，必须抽查文件头字节，确认无 `EF BB BF`。

### `java: 非法字符: '\\ufeff'` 处理规则
- 该报错优先判定为 BOM 问题。
- 处理步骤：
- 1) 定位报错文件；
- 2) 移除文件头 BOM；
- 3) 批量扫描同目录 `.java` 文件是否也有 BOM；
- 4) 重新编译验证。

### 工具链与提交前检查
- IDE 默认编码设置为 UTF-8 且关闭 with BOM。
- 提交前执行一次编译（如 `mvn -DskipTests compile`）。
- 若涉及注释修改，提交前人工检查中文可读性与注释完整性。

### 变更原则
- 功能改动与注释改动尽量分开，便于回溯。
- 修编码问题时不改业务逻辑，只做最小必要修改。
