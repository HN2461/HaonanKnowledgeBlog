# Repository Guidelines（仓库指南）

## 快速规则
- 称呼用户为“主人”。
- 代码风格：2 空格缩进、单引号、无行尾分号。
- `src` 内部模块优先使用 `@/` 别名导入（见 `vite.config.js`）。
- 路由使用 hash history（`src/router/index.js`）。
- `public/notes-index.json` 为脚本生成文件，不建议手动修改。
- 变更 `public/notes/` 后必须运行 `npm run generate:index` 并提交 `public/notes-index.json`。
- `dist/` 为构建产物目录，不应手动修改。

## 笔记发布规范（新增）
- `public/notes/**/*.md` 的发布文章建议统一包含 YAML frontmatter，至少包含：
- `title`：文章标题（与正文 H1 一致或语义一致）。
- `date`：发布日期，格式 `YYYY-MM-DD`。
- `category`：分类名（应与目录语义一致）。
- `tags`：标签数组（建议 3-6 个，避免空标签）。
- `description`：摘要（建议 60-120 字，便于首页/搜索展示）。
- frontmatter 模板：
```yaml
---
title: 示例标题
date: 2026-03-14
category: 网络与代理
tags:
  - 标签1
  - 标签2
description: 这是一段用于列表页与搜索页展示的摘要。
---
```
- 每篇文章的独立附件必须在 frontmatter 通过 `attachments` 显式声明，不再按目录自动分配给同目录所有文章。
- `attachments` 支持写法：
```yaml
attachments:
  - 清理代理残留.bat
  - path: 网络与代理/xxx.zip
    name: 下载压缩包
```
- `attachments` 写文件名时默认按“当前文章所在目录”解析；写完整相对路径时按 `public/notes/` 根目录解析。
- 如果文章存在专属附件（如 `.bat`、`.zip`、`.pdf`），必须写入 `attachments`，否则前端不展示下载区。
- 如果主人要求“给某篇文章配一个可弹窗预览的学习型 HTML 示例 / 效果 demo”，优先复用现有“`attachments` + 详情页 HTML 预览弹窗”机制，不额外新建独立路由页面。
- 这类示例文件统一放在 `public/notes/` 下，建议与文章放在同目录或其子目录，并通过 frontmatter 的 `attachments` 显式声明 `.html` / `.htm` 文件。
- HTML 示例附件应默认保留下载 / 新窗口打开入口，同时在文章详情页提供“预览示例”按钮；新增实现时优先沿用现有附件识别、`iframe sandbox` 预览和路径编码逻辑。
- 示例页尽量做成自包含静态页面；若依赖图片、样式或脚本资源，优先使用同目录相对路径资源，避免破坏 GitHub Pages `base` 路径和站内 iframe 预览。
- frontmatter（程序元信息）必须放在文件最顶部，使用 `---` 包裹，且保持合法 YAML 键值结构。
- 渲染层必须剥离 frontmatter，且要兼容 `UTF-8 BOM`、`CRLF/LF` 换行，避免将元信息渲染到正文。
- 如页面出现 `title/date/tags` 原文内容，优先修复 frontmatter 解析逻辑，不通过删元信息回避问题。
- 涉及笔记详情页渲染改动时，提交前至少人工验证 1 篇带 frontmatter 的文章页面，确认“元信息不出现在正文中”。

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
- 在 Codex / 代理终端里准备执行任何 `node`、`npm`、`vite` 脚本前，优先先跑一次 `pwsh -File scripts/checkNodeRuntime.ps1` 做运行时预检。
- 如果预检里 `node -v` 正常、但 `node -e` 失败，并出现 `ncrypto::CSPRNG(nullptr, 0)`、`NTE_PROVIDER_DLL_FAIL` 或 `0x8009001d`，应判定为“当前终端环境的加密提供程序初始化异常”，不要盲目重复执行 `npm` / `node` 命令。
- 如果主人自己在外部 PowerShell / CMD 里执行 `node -e` 正常，而 Codex 终端里的预检失败，应优先判定为“Codex 命令执行环境与主人外部终端不一致”，不要误报为“主人机器上的 Node 坏了”。
- 出现上述异常时，优先改走“外部终端手动执行脚本”或“本地手动同步生成文件”的回退方案，并在回复主人时明确这是环境问题，不是仓库代码问题。

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

## 消息汇总协作规则
- 当日代码改动摘要文件固定为 `data/dailyChangeSummary.js`。
- Codex 每次完成"实际代码/脚本改动"后，应在该文件里补摘要条目；**同一次对话内完成的改动合并为 1 条，跨多次对话的不同改动才分条写**，每次对话最多新增 3 条。
- `data/dailyChangeSummary.js` 中每条消息必须包含以下字段：
  - `category`：分类（见下方分类说明，必填）
  - `time`：当前系统时间，格式 `HH:mm`（必填，写入前必须先执行 `Get-Date -Format "HH:mm"` 获取，不允许估算）
  - `title`：标题（必填）
  - `summary`：摘要（必填）
  - `content`：详细内容（建议填写，不填时前端回退显示 summary）
- **分类使用场景说明**（`category` 只能从以下四项中选一个）：
  - `内容上新`：新增或大幅扩充笔记/文章内容
  - `功能更新`：站点功能、UI、交互、脚本逻辑改动
  - `问题修复`：修复 bug、错误内容、样式异常
  - `系统公告`：重要通知，会置顶展示，谨慎使用
- `data/dailyChangeSummary.js` 只保留"当天"的摘要：如果文件中的 `date` 不是当天日期，必须先清空旧内容，再写入当天的新摘要，禁止保留历史日期摘要。
- 主人说"汇总消息"时，Codex 应优先查看当天的 git 变动与 `data/dailyChangeSummary.js`，刷新当日分类摘要内容，再执行 `npm run generate:notifications`，让头部通知抽屉展示最新汇总。
- 长期保留的公告、置顶通知继续写在 `data/manualNotifications.js`；当日开发汇总不要写进长期公告文件。
- `Git 提交` 为固定独立分类，由脚本自动从 git 历史生成；不要把 git 提交手动写进 `data/dailyChangeSummary.js`。
- 清空 `data/dailyChangeSummary.js` 前，必须先将当天所有改动**归并为一条**追加到 `data/history/` 目录下对应的分片文件（`id` 格式为 `history-YYYY-MM-DD`，`date` 写实际日期）；分片文件按"每 10 天一个文件"命名，例如 `2026-04-21_30.js` 覆盖 4 月 21 日至 30 日，归档前先确认日期落在哪个分片，若分片不存在则新建并在 `data/historyNotifications.js` 的 import 列表与展开数组中同步添加；归档条目的 `content` 字段须按"第一点：…；第二点：…"格式逐条列出当天每项改动，不得精简省略；追加后再执行 `npm run generate:notifications`。
- 归档条目的每个要点都必须保留 `time`（取该改动实际发生时间）、`title`、`summary` 信息，合并写入 `content` 时不得丢失任何一条的核心内容。
- `data/historyNotifications.js` 中每个 `items` 条目必须包含 `category` 字段，值从以下四项中选一个：`内容上新`、`功能更新`、`问题修复`、`系统公告`；缺少 `category` 时前端时间轴将回退显示"历史消息"标签，无法按类型分色。该规则同样适用于 `data/history/` 下的所有分片文件。

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
