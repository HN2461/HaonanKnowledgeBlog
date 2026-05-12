# 快速开始 🚀

> 5 分钟部署你的个人博客到 GitHub Pages

## 前置要求

- ✅ GitHub 账号
- ✅ 安装 [Git](https://git-scm.com/)
- ✅ 安装 [Node.js](https://nodejs.org/) (v20+)

## 部署步骤

### 1️⃣ Fork 本项目

点击页面右上角的 `Fork` 按钮

### 2️⃣ 克隆到本地

```bash
git clone https://github.com/你的用户名/HaonanKnowledgeBlog.git
cd HaonanKnowledgeBlog
```

### 3️⃣ 修改配置（⚠️ 重要）

打开 `vite.config.js`，修改 `base` 为你的仓库名：

```js
base: '/你的仓库名/'  // 例如：'/my-blog/'
```

### 4️⃣ 本地测试

```bash
npm install
npm run dev
```

访问：`http://127.0.0.1:5173/你的仓库名/#/`

### 5️⃣ 配置 GitHub Actions

创建文件 `.github/workflows/deploy-pages.yml`，内容见 [详细文档](docs/别人下载后如何部署自己的博客.md#-第五步配置-github-actions-自动部署)

### 6️⃣ 启用 GitHub Pages

1. 进入仓库 `Settings` -> `Pages`
2. `Source` 选择 `GitHub Actions`

### 7️⃣ 提交并部署

```bash
git add .
git commit -m "配置 GitHub Pages"
git push origin main
```

等待 1-3 分钟，访问：`https://你的用户名.github.io/你的仓库名/`

## 🎉 完成！

现在你可以在 `public/notes/` 中添加文章，每次 `git push` 都会自动部署。

## 📚 详细文档

- [完整部署指南](docs/别人下载后如何部署自己的博客.md)
- [项目说明](README.md)

## ❓ 遇到问题？

- 白屏？检查 `vite.config.js` 中的 `base` 配置
- 新文章不显示？执行 `npm run generate:index`
- 部署失败？查看 GitHub Actions 日志

更多问题见 [常见问题](docs/别人下载后如何部署自己的博客.md#-常见问题与解决方案)
