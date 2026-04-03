---
title: uni-app 工程结构与配置基础：App.vue、main.js、pages.json、manifest.json、uni.scss 与 static
date: 2026-04-03
category: uni-app 通用基础
tags:
  - uni-app
  - 工程结构
  - pages.json
  - manifest.json
  - easycom
description: 从 App.vue、main.js、pages.json、manifest.json 到 uni.scss、static 与组件目录，梳理 uni-app 项目最核心的工程结构和配置职责。
---

# uni-app 工程结构与配置基础：App.vue、main.js、pages.json、manifest.json、uni.scss 与 static

> 这是这一组 `uni-app 通用基础` 笔记的第 3 篇。  
> 这一篇不讲某个平台的开发者工具，也不讲微信、钉钉的特殊配置，只讲 uni-app 项目里最基础、最该先分清楚的工程结构。  
> 很多项目一开始就埋雷，不是因为业务复杂，而是因为“文件职责混了”。

## 一、先说结论：uni-app 项目最怕的不是文件多，而是“配置放错层”

一个中大型 uni-app 项目里，最容易混掉的往往是下面这些东西：

- 应用级入口
- 页面注册
- 页面窗口样式
- tabBar
- 分包
- 应用名称、版本、appid
- 网络超时
- 全局样式变量
- 静态资源目录
- 平台专属配置

最后就会出现很典型的问题：

1. 页面明明写了，却跳不过去
2. tabBar 行为不对
3. 某个平台权限或配置始终不生效
4. 资源被打进了不该进的包
5. 同一类配置散在多个地方，谁都不敢动

更稳的做法不是“靠经验记”，而是把每个文件的职责固定下来。

## 二、先把几个最核心的文件分清楚

### 1. `main.js`

它是应用入口。

通常适合放：

- 应用初始化挂载
- 全局插件注册
- 全局状态、全局方法注入
- 根实例启动相关代码

不适合放：

- 页面路由配置
- 页面窗口样式
- 大量平台专属业务逻辑

### 2. `App.vue`

它是应用级容器。

通常适合放：

- 应用生命周期
- 全局样式
- 应用级初始化逻辑

要记住：

`App.vue` 解决的是“整个应用”的问题，不是某个页面的问题。

### 3. `pages.json`

这是 uni-app 项目里最重要的配置文件之一。

官方定义里，它负责对 uni-app 进行全局配置，决定：

- 页面路径
- 默认窗口样式
- 原生导航栏
- 原生 tabBar
- 分包
- 启动模式
- `easycom` 自动引入规则

也就是说，页面能不能被编译、路由能不能识别、tabBar 怎么表现，核心都绕不开它。

### 4. `manifest.json`

这个文件更偏“应用和平台发行配置”。

它更适合承载：

- 应用名称
- appid
- 版本号
- 网络超时
- 各平台打包配置
- 平台专属声明与能力配置

一句话区分：

- `pages.json` 更偏页面与界面配置
- `manifest.json` 更偏应用与平台配置

### 5. `uni.scss`

更适合放全局样式变量，比如：

- 主题色
- 文字颜色
- 间距变量
- 圆角、边框、层级变量

如果一个项目样式越来越难统一，很多时候不是页面写得乱，而是缺少一个稳定的全局变量层。

### 6. `static`

这是静态资源目录。

通常放：

- 图片
- 图标
- 音视频资源
- 需要作为静态文件直接引用的资源

工程简介里还提到，`static` 支持平台子目录，比如：

- `mp-weixin`
- `app`
- `web`

这样可以把平台专属资源和通用资源分开。

## 三、真正高频用到的，是 `pages.json`

如果只看一个文件，`pages.json` 一定是 uni-app 项目里最该先吃透的。

它最常见的几个配置块有：

### 1. `pages`

定义页面路径。

你可以先把它理解成：

`哪些页面会被编译进项目，先看 pages。`

### 2. `globalStyle`

定义默认窗口表现，比如导航栏、标题、背景色等默认样式。

### 3. `tabBar`

配置底部 tab。

要记住一条通用规则：

`tabBar 页面必须先在 pages 里定义，然后再在 tabBar 里引用。`

代码跳转到 tabBar 页面时，也要用 `uni.switchTab`，不能用 `uni.navigateTo` 或 `uni.redirectTo`。

### 4. `easycom`

官方文档明确提到：

`easycom` 是自动开启的，你可以在 `pages.json` 里做个性化规则配置。

它的价值很大：

- 组件不需要每页都手动引入注册
- 目录规范清楚时，组件使用体验会非常顺

但也要注意：

- 组件命名要稳定
- 页面名和组件名不要制造混淆
- 目录结构要统一，不然自动引入会变成“自动迷路”

### 5. `subPackages`

用来做分包加载。

它是页面组织问题，不是单纯的性能优化小技巧。

### 6. `preloadRule`

分包预下载规则。

适合在有明确业务流转路径的项目里提前规划，而不是等启动慢了再补。

## 四、`manifest.json` 更适合管“应用级”和“平台级”内容

很多人容易把 `manifest.json` 理解成“另一个路由文件”，其实不是。

更稳的理解方式是：

`manifest.json` 主要解决“这个应用是谁、怎么发、各平台怎么配”的问题。`

典型适合放这里的内容有：

- 应用名称
- 版本号
- appid
- 网络超时
- 平台打包参数
- 平台能力开关

比如你以后做：

- App 打包
- 小程序发行
- 某个平台特有能力配置

很多都不会落在 `pages.json`，而会落在 `manifest.json`。

## 五、推荐一套更稳的 uni-app 项目目录思路

如果是长期维护项目，我更推荐你把目录先收成下面这个思路：

```text
src/
  pages/          页面
  components/     通用组件
  layouts/        布局壳层
  services/       请求、上传、登录、缓存等服务封装
  stores/         状态管理
  utils/          纯工具函数
  styles/         全局样式与变量
  platform/       平台专属适配
static/           静态资源
App.vue
main.js
pages.json
manifest.json
uni.scss
```

这种结构的重点不是“好看”，而是便于长期维护：

- 页面归页面
- 组件归组件
- 服务归服务
- 平台差异单独收口

## 六、最容易混的 4 组职责，我建议你直接背下来

### 1. `App.vue` 和页面

- `App.vue` 管整个应用
- 页面只管当前页面

### 2. `pages.json` 和 `manifest.json`

- `pages.json` 管页面、窗口、tabBar、分包、easycom
- `manifest.json` 管应用、发行、平台配置

### 3. `static` 和业务目录里的临时文件

- 稳定静态资源放 `static`
- 不要把资源散在业务目录里长期失控

### 4. 通用配置和平台专属配置

- 通用配置尽量收在统一配置层
- 平台差异通过平台配置或条件编译收口

## 七、做 uni-app 工程时，我更建议你固定这 9 条规则

1. 新页面先注册，再写跳转。
2. 页面和 tabBar 相关内容优先检查 `pages.json`。
3. 应用名称、版本、appid、网络超时优先看 `manifest.json`。
4. `easycom` 能解决的组件引入问题，不要手动写得满项目都是。
5. 静态资源尽量统一进入 `static`。
6. 平台专属资源可以放平台子目录，不要和通用资源乱混。
7. 分包是工程结构问题，不是最后一刻的补丁。
8. 不要手改编译产物，应该改源配置和源代码。
9. 一个文件只解决一类职责，后面项目才不容易失控。

## 八、这一篇后面最适合接什么

把工程结构分清楚以后，后面更适合继续补：

1. 生命周期与路由落点
2. 条件编译和平台差异收口
3. 请求、缓存、上传下载等通用能力封装
4. 各平台专属配置和专属能力

也就是说：

`工程结构不是“目录问题”，而是你后面所有开发方式的地基。`

## 参考资料

- [工程简介](https://uniapp.dcloud.net.cn/tutorial/project.html)
- [App.vue / App.uvue](https://uniapp.dcloud.net.cn/collocation/App.html)
- [pages.json 页面路由](https://uniapp.dcloud.net.cn/collocation/pages.html)
- [完整 manifest.json](https://uniapp.dcloud.net.cn/tutorial/app-manifest.html)
- [页面](https://uniapp.dcloud.net.cn/tutorial/page.html)
