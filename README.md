# 个人技术博客

一个基于 Vue3 + Vite 构建的静态个人技术博客网站，支持 Markdown 笔记展示、全文搜索、主题切换等功能。

---

## � 快速部署

> **想要部署自己的博客？** 请查看以下文档：
> 
> - � [5 分钟快速开始](QUICK_START.md) - 最简化的部署步骤
> - 📚 [详细部署指南](docs/别人下载后如何部署自己的博客.md) - 新手友好的完整教程
> 
> **核心步骤**：Fork 项目 → 修改 `vite.config.js` 中的 `base` → 配置 GitHub Actions → 推送代码

---

## ✨ 功能特性

- 📝 支持 Markdown 格式笔记展示
- 🗂️ 自动识别文件夹结构，生成分类导航
- 🔍 全文搜索功能
- 🎨 浅色/深色主题切换
- 📱 响应式设计，支持移动端
- 🚀 静态网站，快速部署到 GitHub Pages

---

## 📦 如何部署到 GitHub Pages

> **最终效果**：部署成功后，你的网站地址是 `https://你的GitHub用户名.github.io/你的仓库名/`

### 第一步：准备工作

确保你已经安装：
- ✅ [Git](https://git-scm.com/)
- ✅ [Node.js](https://nodejs.org/)（建议 v20 或更高版本）
- ✅ 拥有一个 [GitHub](https://github.com/) 账号

### 第二步：获取项目代码

**方式 A：Fork 本项目（推荐）**

1. 点击本项目页面右上角的 `Fork` 按钮
2. Fork 到你的 GitHub 账号下
3. 在本地克隆你的 Fork 仓库：

```bash
git clone https://github.com/你的GitHub用户名/HaonanKnowledgeBlog.git
cd HaonanKnowledgeBlog
```

**方式 B：下载 ZIP 后上传到新仓库**

1. 点击 `Code` -> `Download ZIP` 下载项目
2. 在 GitHub 创建一个新仓库（例如命名为 `my-blog`）
3. 解压后在项目目录执行：

```bash
git init
git add .
git commit -m "初始化博客项目"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/你的仓库名.git
git push -u origin main
```

### 第三步：修改配置（⚠️ 重要）

打开 `vite.config.js` 文件，找到 `base` 配置项，改成你的仓库名：

```js
export default defineConfig({
  base: '/你的仓库名/',  // 👈 改这里！例如：'/my-blog/'
  // ...其他配置
})
```

> ⚠️ **注意**：如果不修改这一步，部署后会出现白屏或资源 404 错误！

### 第四步：本地测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问：`http://127.0.0.1:5173/你的仓库名/#/`

如果能正常访问，说明配置正确！

### 第五步：配置 GitHub Actions 自动部署

在项目根目录创建文件：`.github/workflows/deploy-pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate notes index
        run: npm run generate:index

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 第六步：在 GitHub 启用 Pages

1. 进入你的 GitHub 仓库
2. 点击 `Settings`（设置）
3. 左侧菜单找到 `Pages`
4. 在 `Build and deployment` 部分：
   - `Source` 选择 **`GitHub Actions`**

### 第七步：提交并触发部署

```bash
git add .
git commit -m "配置 GitHub Pages 自动部署"
git push origin main
```

推送后：
1. 进入仓库的 `Actions` 页面
2. 查看部署进度（通常需要 1-3 分钟）
3. 部署成功后，访问：`https://你的GitHub用户名.github.io/你的仓库名/`

🎉 **恭喜！你的博客已经上线了！**

---

## 📝 如何添加和管理笔记

### 添加新笔记

1. 在 `public/notes/` 目录下创建分类文件夹（例如 `JavaScript`）
2. 在文件夹中创建 `.md` 文件
3. 在文件开头添加 frontmatter 元信息（推荐）：

```markdown
---
title: 我的第一篇文章
date: 2026-05-12
category: JavaScript
tags:
  - 基础
  - 入门
description: 这是一篇关于 JavaScript 基础的文章
---

# 我的第一篇文章

这里是正文内容...
```

### 更新索引

每次添加或修改笔记后，运行：

```bash
npm run generate:index
```

这会重新生成 `public/notes-index.json`，让搜索功能能找到新文章。

### 提交更新

```bash
git add .
git commit -m "新增文章：我的第一篇文章"
git push origin main
```

推送后 GitHub Actions 会自动重新部署。

---

## 🛠️ 本地开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 生成笔记索引
npm run generate:index

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm test
```

---

## 📁 项目结构

```
HaonanKnowledgeBlog/
├── .github/
│   └── workflows/          # GitHub Actions 配置
├── public/
│   ├── notes/              # 📝 笔记存放目录（你的文章放这里）
│   └── notes-index.json    # 自动生成的索引文件
├── src/
│   ├── components/         # Vue 组件
│   ├── views/              # 页面组件
│   ├── router/             # 路由配置
│   ├── utils/              # 工具函数
│   └── styles/             # 样式文件
├── scripts/
│   └── generateNotesIndex.js  # 索引生成脚本
├── vite.config.js          # ⚠️ 重要：需要修改 base 配置
└── package.json
```

---

## ❓ 常见问题

### Q1: 部署后网站白屏怎么办？

**A:** 99% 是因为 `vite.config.js` 中的 `base` 配置不正确。

- ✅ 正确：`base: '/my-blog/'`（你的仓库名）
- ❌ 错误：`base: '/HaonanKnowledgeBlog/'`（原作者的仓库名）

### Q2: 新文章不显示怎么办？

**A:** 添加文章后忘记执行 `npm run generate:index`。

解决方法：
```bash
npm run generate:index
git add .
git commit -m "更新索引"
git push
```

### Q3: GitHub Actions 部署失败怎么办？

**A:** 进入仓库的 `Actions` 页面，点击失败的任务查看日志。

常见原因：
- Node.js 版本不兼容（确保使用 v20+）
- 依赖安装失败（检查 `package.json`）
- 构建错误（查看错误日志修复代码）

### Q4: 如何自定义域名？

**A:** 在 GitHub 仓库的 `Settings` -> `Pages` -> `Custom domain` 中配置。

需要在你的域名提供商处添加 CNAME 记录指向 `你的GitHub用户名.github.io`。

---

## 🔧 技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **路由**：Vue Router (Hash 模式)
- **Markdown 渲染**：Markdown-it
- **代码高亮**：Highlight.js
- **测试**：Vitest

---

## 📚 更多文档

- [详细部署指南](docs/别人下载后如何部署自己的博客.md)
- [模态框最佳实践](docs/MODAL_BEST_PRACTICES.md)

---

## 📄 License

MIT

---

## 💬 反馈与支持

如果在使用过程中遇到问题，欢迎：
- 提交 [Issue](../../issues)
- 发起 [Pull Request](../../pulls)

**祝你使用愉快！** 🎉
