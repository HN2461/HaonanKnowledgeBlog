---
title: 前端里的各种"帧"——Frame 全解
date: 2026-04-30
category: 浏览器与网络
tags:
  - 帧
  - 渲染
  - 动画
  - 性能
  - JavaScript
  - CSS
description: 前端学习中会反复遇到"帧"这个词，但它在不同场景含义完全不同。本文系统梳理前端开发中所有"帧"的概念，包括渲染帧、关键帧、调用栈帧、视频帧、iframe 等，一次搞清楚。
---

# 前端里的各种"帧"——Frame 全解

学前端时"帧"这个词会在很多地方冒出来，但每次含义都不一样。这篇文章把前端开发里所有叫"帧"的东西统一梳理一遍。

---

## 一、渲染帧（Render Frame）

### 是什么

浏览器每次把页面"画"到屏幕上，就完成了一帧。显示器有刷新率，60Hz 的屏幕每秒刷新 60 次，也就是每秒 60 帧（60fps）。

```
屏幕刷新率 60Hz  →  每秒 60 帧  →  每帧预算 ≈ 16.7ms
屏幕刷新率 120Hz →  每秒 120 帧 →  每帧预算 ≈ 8.3ms
```

### 帧预算（Frame Budget）

浏览器每帧能用的时间叫"帧预算"。在 60fps 下，一帧只有 16.7ms。这 16.7ms 里浏览器要完成：

```
JS 执行 → 样式计算 → 布局 → 绘制 → 合成 → 显示
```

浏览器自身需要约 6ms 处理合成和显示，留给开发者的 JS + 样式 + 布局实际只有约 10ms。

### 掉帧（Dropped Frame / Jank）

如果某一帧的工作超过了 16.7ms，浏览器来不及在下一次刷新前完成，就会跳过这一帧，用户看到的就是"卡顿"或"抖动"，英文叫 **jank**。

```
正常：帧1(16ms) → 帧2(16ms) → 帧3(16ms) → 流畅
掉帧：帧1(16ms) → 帧2(50ms) → 帧3(16ms) → 卡顿！
```

### 在哪里能看到

Chrome DevTools → Performance 面板录制后，顶部绿色条就是帧率，红色块表示掉帧。

---

## 二、关键帧（Keyframe）

### CSS 关键帧 `@keyframes`

CSS 动画里，你只需要定义几个"关键时间点"的状态，浏览器自动补全中间的过渡，这些关键时间点就叫关键帧。

```css
@keyframes slide-in {
  0%   { transform: translateX(-100%); opacity: 0; }
  60%  { transform: translateX(10px); }
  100% { transform: translateX(0);    opacity: 1; }
}

.box {
  animation: slide-in 0.4s ease-out;
}
```

`0%`、`60%`、`100%` 就是三个关键帧，中间的动画由浏览器插值计算。

`from` 等价于 `0%`，`to` 等价于 `100%`。

### Web Animations API 关键帧

JS 里也可以用关键帧，通过 `element.animate()` 传入关键帧数组：

```javascript
element.animate(
  [
    { transform: 'translateX(-100%)', opacity: 0 },  // 关键帧 1
    { transform: 'translateX(10px)',  offset: 0.6 }, // 关键帧 2（60% 处）
    { transform: 'translateX(0)',     opacity: 1 },  // 关键帧 3
  ],
  { duration: 400, easing: 'ease-out' }
)
```

### 视频/编解码里的关键帧（I 帧）

视频压缩里也有关键帧，叫 **I 帧（Intra-coded frame）**，是完整的图像数据。其他帧（P 帧、B 帧）只存储与关键帧的差异，依赖关键帧才能解码。前端处理视频时偶尔会遇到这个概念，但通常不需要手动干预。

---

## 三、动画帧请求（requestAnimationFrame）

### 是什么

`requestAnimationFrame`（简称 rAF）是浏览器提供的 API，让你在**下一帧渲染前**执行一段代码。

```javascript
function animate(timestamp) {
  // timestamp 是当前帧的时间戳（毫秒）
  box.style.transform = `translateX(${timestamp * 0.1 % 500}px)`
  requestAnimationFrame(animate) // 注册下一帧
}

requestAnimationFrame(animate) // 启动
```

### 和 setInterval 的区别

| 对比项 | `setInterval` | `requestAnimationFrame` |
|--------|--------------|------------------------|
| 执行时机 | 固定时间间隔，不管屏幕刷新 | 与屏幕刷新同步 |
| 后台标签页 | 继续执行，浪费资源 | 自动暂停，省电 |
| 帧率适配 | 固定，120Hz 屏幕不受益 | 自动适配屏幕刷新率 |
| 动画流畅度 | 可能和刷新率错位，抖动 | 天然同步，流畅 |

### 取消动画帧

```javascript
const id = requestAnimationFrame(animate)
cancelAnimationFrame(id) // 取消
```

### 常见用途

- 手写 JS 动画（Canvas、WebGL）
- 滚动监听节流（比 scroll 事件更高效）
- 游戏循环
- 在 DOM 更新后读取布局信息（避免强制同步布局）

---

## 四、调用栈帧（Stack Frame / Call Frame）

### 是什么

JS 引擎执行函数时，会把函数的执行上下文压入调用栈，每一个执行上下文就叫一个**栈帧（Stack Frame）**。

```javascript
function c() { /* 执行中 */ }
function b() { c() }
function a() { b() }
a()
```

调用栈变化过程：

```
调用 a()  →  [a]
调用 b()  →  [a, b]
调用 c()  →  [a, b, c]
c 返回    →  [a, b]
b 返回    →  [a]
a 返回    →  []
```

### 在哪里能看到

Chrome DevTools → Sources 面板打断点后，右侧 **Call Stack** 面板显示的就是当前所有栈帧。

Performance 面板里的**火焰图（Flame Chart）**，每一个色块也是一个栈帧，纵向堆叠表示调用深度。

### 栈溢出（Stack Overflow）

递归没有终止条件时，栈帧不断叠加，超出引擎限制就会报错：

```javascript
function infinite() { infinite() }
infinite()
// Uncaught RangeError: Maximum call stack size exceeded
```

---

## 五、视频帧（Video Frame）

### 是什么

视频本质是连续的图像序列，每一张图像就是一帧。前端用 `<video>` 播放视频时，浏览器每次解码并显示的一张图像就是一个视频帧。

### 抓取视频帧

用 Canvas 可以把当前视频帧"截图"下来：

```javascript
const video = document.querySelector('video')
const canvas = document.createElement('canvas')
canvas.width = video.videoWidth
canvas.height = video.videoHeight

const ctx = canvas.getContext('2d')
ctx.drawImage(video, 0, 0) // 把当前帧画到 canvas

// 导出为图片
const dataURL = canvas.toDataURL('image/png')
```

### VideoFrame API（新）

现代浏览器提供了 `VideoFrame` API，可以更精细地操作视频帧，常用于 WebCodecs（视频编解码）场景：

```javascript
// 从 canvas 创建一帧
const frame = new VideoFrame(canvas, { timestamp: 0 })
frame.close() // 用完必须手动释放
```

### 帧率（FPS）

视频的帧率决定流畅度。常见值：

- 24fps：电影标准，有"电影感"
- 30fps：普通视频
- 60fps：游戏录屏、高帧率视频
- 120fps：高刷屏内容

---

## 六、iframe（内联框架）

### 是什么

`<iframe>` 是 HTML 标签，全称 **Inline Frame（内联框架）**，用于在当前页面里嵌入另一个独立的 HTML 页面。

```html
<iframe
  src="https://example.com"
  width="800"
  height="600"
  title="嵌入的页面"
></iframe>
```

### 和其他"帧"的关系

iframe 里的"frame"是"框架/窗口"的意思，和动画帧、渲染帧是完全不同的概念，只是中文都翻译成"帧"。

### 常见用途

- 嵌入第三方内容（地图、支付页面、视频播放器）
- 沙箱隔离（用 `sandbox` 属性限制权限）
- 微前端架构（子应用隔离）

### sandbox 属性

```html
<!-- 最严格的沙箱，禁止几乎所有操作 -->
<iframe src="demo.html" sandbox></iframe>

<!-- 允许脚本执行，但仍然隔离 -->
<iframe src="demo.html" sandbox="allow-scripts"></iframe>

<!-- 允许脚本 + 允许同源访问 -->
<iframe src="demo.html" sandbox="allow-scripts allow-same-origin"></iframe>
```

### 性能注意

每个 iframe 都是独立的浏览上下文，有独立的 DOM、JS 引擎、渲染管线，开销比普通 DOM 大得多。不要滥用。

---

## 七、WebRTC / 媒体流帧

### 是什么

用 `getUserMedia` 获取摄像头/麦克风时，视频流也是由连续的帧组成的。WebRTC 传输视频时会协商帧率（如 30fps）。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ video: true })
const video = document.querySelector('video')
video.srcObject = stream

// 用 canvas 抓取实时帧
function captureFrame() {
  ctx.drawImage(video, 0, 0)
  requestAnimationFrame(captureFrame) // 每帧都抓
}
```

---

## 八、WebGL 帧缓冲（Framebuffer）

### 是什么

WebGL 渲染时，GPU 把渲染结果先写入**帧缓冲（Framebuffer）**，再输出到屏幕。可以创建离屏帧缓冲，实现后处理效果（模糊、阴影等）。

```javascript
const gl = canvas.getContext('webgl')
const framebuffer = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
// 渲染到这个帧缓冲，而不是直接到屏幕
```

这个概念主要在 WebGL / Three.js 深度开发时才会遇到。

---

## 九、一张图总结

```
前端里的"帧"
│
├── 渲染帧（Render Frame）
│   屏幕每次刷新 = 一帧，60fps = 每帧 16.7ms
│   超时 → 掉帧 → 卡顿（jank）
│
├── 关键帧（Keyframe）
│   CSS @keyframes / Web Animations API
│   动画的"锚点"，浏览器自动补中间过渡
│
├── 动画帧请求（requestAnimationFrame）
│   在下一帧渲染前执行回调
│   比 setInterval 更流畅、更省电
│
├── 调用栈帧（Stack Frame）
│   函数调用时压栈的执行上下文
│   DevTools Call Stack / 火焰图里能看到
│
├── 视频帧（Video Frame）
│   视频的每一张图像
│   可用 canvas.drawImage(video) 抓取
│
├── iframe（内联框架）
│   嵌入独立页面的 HTML 标签
│   "frame" = 框架，和动画帧无关
│
├── 媒体流帧（WebRTC Frame）
│   摄像头/麦克风视频流的每一帧
│   可配合 rAF + canvas 实时处理
│
└── 帧缓冲（Framebuffer）
    WebGL 渲染目标，GPU 写入的缓冲区
    用于离屏渲染和后处理效果
```

---

## 十、快速记忆

| 场景 | 叫什么 | 核心概念 |
|------|--------|---------|
| 屏幕刷新 | 渲染帧 | 60fps = 16.7ms/帧，超时掉帧 |
| CSS 动画 | 关键帧 | `@keyframes` 定义锚点状态 |
| JS 动画循环 | 动画帧 | `requestAnimationFrame` |
| 函数调用栈 | 栈帧 | DevTools Call Stack |
| 视频播放 | 视频帧 | canvas 可抓取当前帧 |
| 嵌入页面 | iframe | 独立浏览上下文，开销大 |
| 摄像头流 | 媒体流帧 | WebRTC + getUserMedia |
| WebGL 渲染 | 帧缓冲 | GPU 离屏渲染目标 |
