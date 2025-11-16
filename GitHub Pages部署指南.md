# GitHub Pages 部署指南

## 📝 已完成的修改

1. **✅ vite.config.js 配置已更新**
   - 添加了 `base: './'` 配置，确保资源路径在GitHub Pages上正确加载

2. **✅ Vue Router 已改为Hash模式**
   - 将 `createWebHistory` 改为 `createWebHashHistory`
   - 避免在GitHub Pages刷新页面时出现404错误

3. **✅ GitHub Actions Workflow已创建**
   - 文件位置：`.github/workflows/deploy.yml`
   - 支持自动部署到GitHub Pages

## 🚀 部署步骤

### 第一步：提交代码到GitHub

```bash
# 添加所有修改
git add .

# 提交更改
git commit -m "配置GitHub Pages部署"

# 推送到主分支（main或master）
git push origin main
```

### 第二步：配置GitHub仓库

1. **打开您的GitHub仓库页面**
2. **点击仓库的 `Settings`（设置）标签**
3. **在左侧菜单找到 `Pages` 选项**

### 第三步：配置GitHub Pages

在Pages设置页面：

1. **Source（源）设置**：
   - 选择 `GitHub Actions` 作为源
   - （新版GitHub会自动检测到workflow文件）

2. **等待部署完成**：
   - 首次部署可能需要几分钟
   - 可以在仓库的 `Actions` 标签页查看部署进度

### 第四步：访问您的网站

部署成功后，您的网站将可通过以下地址访问：
```
https://[您的GitHub用户名].github.io/[仓库名]/
```

例如：
- 用户名：`HN246`
- 仓库名：`HaonanKnowledgeBlog`
- 访问地址：`https://HN246.github.io/HaonanKnowledgeBlog/`

## 🔧 可选配置

### 使用自定义域名

如果您有自己的域名，可以：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为您的域名（如：`blog.example.com`）
3. 在域名服务商配置DNS指向GitHub Pages

### 手动触发部署

除了推送代码自动部署外，您还可以：

1. 进入仓库的 `Actions` 页面
2. 选择 `Deploy to GitHub Pages` workflow
3. 点击 `Run workflow` 按钮手动触发部署

## ⚠️ 注意事项

1. **首次部署可能需要等待几分钟**
2. **确保仓库是公开的（Public）**，私有仓库需要GitHub Pro账户才能使用Pages
3. **URL中会包含 `#/` 符号**（因为使用了Hash模式路由）
4. **静态资源缓存问题**：如果更新后看不到变化，请清除浏览器缓存

## 🐛 常见问题解决

### 问题1：页面空白
- 检查浏览器控制台是否有404错误
- 确认 `vite.config.js` 中的 `base` 配置正确

### 问题2：样式丢失
- 检查构建后的 `dist` 文件夹是否正常
- 确认所有资源路径使用相对路径

### 问题3：部署失败
- 查看 GitHub Actions 的错误日志
- 确认 `node_modules` 没有被提交到仓库

## 📊 部署状态检查

您可以在仓库添加部署状态徽章：

```markdown
[![Deploy Status](https://github.com/[用户名]/[仓库名]/actions/workflows/deploy.yml/badge.svg)](https://github.com/[用户名]/[仓库名]/actions/workflows/deploy.yml)
```

## 🎉 恭喜！

完成以上步骤后，您的Vue项目就成功部署到GitHub Pages了！
