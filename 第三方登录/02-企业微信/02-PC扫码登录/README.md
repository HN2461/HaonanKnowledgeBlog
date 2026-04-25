# 企业微信 PC 扫码登录文档

> 覆盖场景：系统浏览器扫码登录（`ww.createWWLoginPanel` 内嵌组件）+ 账号绑定/解绑。
> 文档基于实际项目代码提炼，脱离具体项目，可直接作为下次开发的参考模板。

---

## 文档列表

### 01 — 网页授权登录原理与 API

**文件**：[01-企业微信网页授权登录_PC扫码登录_ww.createWWLoginPanel.md](./01-知识文档/01-企业微信网页授权登录_PC扫码登录_ww.createWWLoginPanel.md)

**适合什么时候读**：项目启动阶段，了解企业微信 PC 扫码登录的两种方式、开发前准备、参数说明、错误码时。

**核心内容**：
- 网页授权登录 vs H5 微应用 OAuth2 的区别（授权 URL、适用场景）
- 两种登录方式：内嵌组件（`createWWLoginPanel`）vs 构造链接跳转
- `createWWLoginPanel` 初始化参数详解
- 快速登录（桌面端一键登录）的触发条件
- 后端用 code 换取用户信息的接口
- 常见错误码对照表（-31020 ~ -31040）

---

### 02 — 账号绑定实现方案

**文件**：[02-企业微信账号绑定实现方案_PC端扫码绑定.md](./01-知识文档/02-企业微信账号绑定实现方案_PC端扫码绑定.md)

**适合什么时候读**：专门实现账号绑定功能时，需要深入了解绑定链路的完整细节。

**核心内容**：
- `redirect_type: 'callback'` 隐藏参数的作用（不传则扫码后页面跳走）
- 完整流程图（从点击"马上绑定"到关闭弹窗）
- 绑定组件完整实现：三态 UI、SDK 加载、容器就绪检测（轮询 offsetWidth）、防重复初始化、postMessage 错误监听
- 父组件协作：学校配置控制显示、destroy-on-close 弹窗、乐观更新
- 解绑实现
- 与钉钉绑定的实现对比
- 5 个踩坑记录（含 redirect_type 隐藏参数、容器尺寸为 0、-31020 等）

---

## 快速定位

| 我想做的事 | 看哪篇 |
| --- | --- |
| 了解企业微信 PC 登录的两种方式 | 01 |
| 了解 createWWLoginPanel 参数 | 01 第4节 |
| 实现账号绑定 | 02 |
| 排查扫码后页面跳走 | 02 踩坑① |
| 排查 -31020 错误 | 02 踩坑③ |
| 排查扫码后无错误提示 | 02 踩坑④ |
| 下次新项目快速接入绑定 | 02 第8节 |

---

## 与钉钉 PC 微应用的关键差异

| 对比项 | 企业微信 | 钉钉 |
| --- | --- | --- |
| SDK | `ww.createWWLoginPanel` | `DTFrameLogin` |
| 回调模式参数 | 必须传 `redirect_type: 'callback'` | 不需要 |
| 绑定接口参数 | `{ code, schoolID }` | `{ code }` |
| 容器就绪检测 | 轮询 `offsetWidth > 0` | `$nextTick` 即可 |
| 防重机制 | `isInitializing`（失败时重置） | `isBinding`（不重置） |
| 重试方式 | 重新调 `initWeComBind()` | `window.location.reload()` |
| postMessage 错误结构 | `ww-iframe-handle:call` | `{success:false, errorMsg}` |
