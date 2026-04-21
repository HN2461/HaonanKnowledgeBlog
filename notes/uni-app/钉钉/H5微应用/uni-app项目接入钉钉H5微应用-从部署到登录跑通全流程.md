---
title: uni-app 项目接入钉钉 H5 微应用：从部署到登录跑通全流程
date: 2026-04-21
category: uni-app
tags:
  - uni-app
  - 钉钉H5微应用
  - 钉钉登录
  - H5部署
  - 前后端联调
description: 面向已有 uni-app 项目，完整梳理接入钉钉 H5 微应用的落地步骤，涵盖为什么优先走 H5 微应用、钉钉后台配置、H5 部署、双链路登录实现、联调验收清单。
---

# uni-app 项目接入钉钉 H5 微应用：从部署到登录跑通全流程

> 适合谁看：你有一个已经在跑的 uni-app 项目，现在要接入钉钉，让用户能从钉钉工作台打开系统并完成登录。
>
> 这篇文章不讲钉钉小程序改造，专门讲 **H5 微应用** 这条路——为什么优先走这条路、后台怎么配、H5 怎么部署、登录链路怎么实现、联调时怎么验收。

---

## 一、为什么优先走 H5 微应用，而不是直接改钉钉小程序

很多人拿到"接入钉钉"的需求，第一反应是把项目改成钉钉小程序。但对于已有 uni-app 项目，**H5 微应用通常是更合理的第一阶段方案**。

| 对比项 | 钉钉 H5 微应用 | 钉钉小程序 |
|--------|--------------|-----------|
| 代码改动量 | 小，主要是登录链路 | 大，需要平台适配、wx 替换、运行时兼容 |
| 部署方式 | 部署到自己服务器，实时生效 | 上传到钉钉平台，走审核发布 |
| 更新速度 | 改完直接上线 | 需要重新上传版本 |
| 适合阶段 | 快速验证、先跑通链路 | 长期维护、需要深度钉钉能力 |
| 登录方式 | OAuth 跳转 / JSAPI 免登 | `dd.getAuthCode` 小程序免登 |

**结论：先用 H5 微应用让系统在钉钉里跑起来，验证登录链路和业务可用性，再决定是否继续演进成钉钉小程序。**

---

## 二、整体流程概览

```
钉钉开放平台
  └─ 创建企业内部应用（H5 微应用）
       └─ 配置首页地址、可信域名、权限点
            └─ 发布应用

你的服务器
  └─ uni-app 编译 H5 产物
       └─ 部署到 HTTPS 域名
            └─ Nginx 配置（SPA 路由 + 接口代理）

前端代码
  └─ 登录页识别钉钉容器
       ├─ 钉钉内：JSAPI 免登（dd.ready → requestAuthCode）
       └─ 钉钉外：OAuth 跳转（构建授权 URL → 回调取 code）
            └─ 发给后端换取业务 token → 落盘登录态 → 进入系统
```

---

## 三、钉钉开放平台配置

### 3.1 创建应用

1. 进入 [钉钉开放平台](https://open-dev.dingtalk.com)
2. 「应用开发」→「企业内部开发」→「H5 微应用」→「创建应用」
3. 填写应用名称、描述、图标

> 第一阶段建议选**企业内部应用**，不要一上来就选第三方企业应用。企业内部应用流程更简单，适合先跑通链路。

### 3.2 配置首页地址

这是最关键的一步。建议首页地址直接指向登录页，而不是系统内部页面：

```
https://你的域名/#/pages/login/index?schoolID=你的学校ID
```

为什么这样配：
- 登录页是系统入口，天然适合作为首页
- 带上 `schoolID` 参数，登录链路能直接读取，不依赖默认值兜底
- 出问题时排查范围最小

如果需要支持 PC 钉钉，PC 端首页地址先和移动端保持一致即可。

### 3.3 配置可信域名

至少要把以下域名加入可信域名：
- H5 页面所在域名
- 接口请求域名
- 静态资源域名（如果和页面域名不同）

注意：
- 必须使用 HTTPS
- 域名要和真实访问域名完全一致（含子域名、端口）
- 配置变更后需要重新发布才生效

### 3.4 配置权限点

登录链路至少需要获取用户身份相关权限。最低要求：

- 通讯录个人信息读权限（获取用户 userId）

没有配权限，前端即使拿到授权码，后端换用户信息时也会报权限错误。

### 3.5 配置可见范围

第一阶段建议把可见范围收小：
- 只给联调人员
- 只给测试部门

这样有两个好处：灰度验证、出问题不大面积扩散。

### 3.6 发布应用

钉钉后台很多配置不是"保存即生效"，**必须发布后才对工作台用户可见**。

联调前确认：
- 应用已保存
- 应用已发布
- 用户端能在工作台看到入口

---

## 四、H5 产物部署

### 4.1 编译 H5 产物

目标是钉钉 H5 微应用，发布的是 **uni-app H5 产物**，不是微信小程序产物。

HBuilderX 方式：「发行」→「网站-H5 手机版」

命令行方式：
```bash
npm run build:h5
```

产物目录：`unpackage/dist/build/h5/`

### 4.2 路由模式建议先用 hash

uni-app H5 默认是 hash 路由（`/#/pages/...`），建议第一阶段保持不变：
- hash 路由部署更省事，不需要额外的 Nginx 配置
- 钉钉 OAuth 回调 URL 解析需要兼容 hash 场景，hash 模式下更简单

如果确实需要 history 模式，在 `manifest.json` 里配置：
```json
"h5": {
  "router": {
    "mode": "history",
    "base": "/"
  }
}
```

### 4.3 Nginx 配置

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate     /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/h5;
    index index.html;

    # SPA 路由：所有路径都回到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 接口代理
    location /api/ {
        proxy_pass http://your-backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# HTTP 强制跳 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

### 4.4 部署后检查清单

- [ ] HTTPS 证书有效，手机钉钉可访问
- [ ] 访问任意路由不 404（SPA 路由回退正常）
- [ ] 静态资源正常加载
- [ ] 接口代理正常（`/api` 能到后端）
- [ ] WebSocket 地址可用（如果项目有 IM 功能）

---

## 五、登录链路实现

### 5.1 两条登录路径

钉钉 H5 微应用需要区分两种场景：

| 场景 | 路径 | 原理 |
|------|------|------|
| 在钉钉 App 内打开 | JSAPI 免登 | `dd.ready` → `requestAuthCode`，用户无感知 |
| 普通浏览器 / App 原生端 | OAuth 授权跳转 | 跳转到钉钉授权页，回调带 code |

**入口分流逻辑：**

```js
// 登录页点击"钉钉登录"
const handleDingTalkLogin = () => {
  if (isDingTalkContainer()) {
    // 在钉钉容器内：走 JSAPI 免登
    uni.navigateTo({ url: `/secondary/dingTalkH5Login/index?schoolID=${schoolID}` })
  } else {
    // 不在钉钉容器：走 OAuth 跳转
    uni.navigateTo({ url: `/secondary/dingTalkLogin/index?schoolID=${schoolID}` })
  }
}
```

### 5.2 JSAPI 免登流程（钉钉容器内）

这是钉钉 H5 微应用的核心登录方式，用户打开即自动登录，无感知。

**完整流程：**

```
onLoad
  → 读取 schoolID（路由参数 > 本地缓存 > 默认值）
  → 拉取学校配置（含 dingtalkCorpID、dingtalkClientID）
  → 校验配置完整性
  → 二次确认在钉钉容器内（防御性校验）
  → requestDingTalkAuthCode(corpId)  ← JSAPI 静默获取授权码
  → 发给后端 /login/dingtalk/h5
  → completeDingTalkLogin（落盘 + 跳转首页）
```

**关键代码：**

```js
// 钉钉 H5 免登页
const startLogin = async () => {
  try {
    // 1. 确保有 schoolID
    ensureSchoolContext()

    // 2. 拉取学校钉钉配置
    await loadSchoolConfig()

    // 3. 校验配置（dingtalkLoginApp、dingtalkCorpID、dingtalkClientID）
    validateSchoolConfig()

    // 4. 二次确认在钉钉容器内
    if (!isDingTalkContainer()) {
      throw new Error('请在钉钉中打开')
    }

    // 5. JSAPI 静默获取授权码（不需要先 dd.config，但需要在 dd.ready 中调用）
    const authCode = await requestDingTalkAuthCode(schoolConfig.dingtalkCorpID)

    // 6. 发给后端换取业务 token
    const loginRes = await dingTalkH5Login({ authCode, schoolID })

    // 7. 统一落盘登录态
    await completeDingTalkLogin(loginRes)
  } catch (error) {
    showError(error.message)
  }
}
```

**注意：** `requestAuthCode` 不需要先执行 `dd.config`，但必须在 `dd.ready` 中调用。

### 5.3 OAuth 跳转流程（普通浏览器 / App）

这条路径适用于不在钉钉容器内的场景，分两个阶段：

**第一次进入（首次）：** 没有 code → 构建授权 URL → 跳转到钉钉授权页

**第二次进入（回调）：** 钉钉授权后回调，URL 中带 code → 取出 code → 发给后端

```js
const obtainOAuthCode = async () => {
  const redirectUri = buildRedirectUri()  // H5 端用当前页面 URL，App 端用固定后端路径

  // 检查 URL 中是否已有 code（回调返回的）
  const callbackResult = resolveDingTalkAuthCodeFromUrl(window.location.href)
  const code = callbackResult.code || callbackResult.authCode || ''

  if (code) {
    // 校验 state 防 CSRF
    const isCurrentCallback = validateOAuthState(callbackResult.state)
    if (isCurrentCallback) return callbackResult
  }

  // 首次进入：生成 state，构建授权 URL，跳转
  const state = createDingTalkOAuthState()
  saveDingTalkOAuthState(state)

  const authUrl = buildDingTalkOAuthUrl({
    clientId: schoolConfig.dingtalkClientID,
    redirectUri,
    corpId: schoolConfig.dingtalkCorpID,
    state
  })

  // App 端：弹出 WebView 等待授权
  if (isAppPlusRuntime()) {
    return await openDingTalkAuthWebview({ authUrl, redirectUri })
  }

  // H5 端：整页跳转（用 replace 避免用户点返回回到中间态）
  window.location.replace(authUrl)
  return null  // 页面已跳走，等回调
}
```

**state 校验逻辑：**

```js
const validateOAuthState = (callbackState) => {
  const expectedState = getDingTalkOAuthState()
  clearDingTalkOAuthState()

  // 本地没有 state：可能是历史残留参数，清理后重新发起
  if (!expectedState) {
    clearDingTalkOAuthCallbackParamsInCurrentUrl()
    return false
  }

  // state 不匹配：可能是伪造请求
  if (!callbackState || callbackState !== expectedState) {
    clearDingTalkOAuthCallbackParamsInCurrentUrl()
    throw new Error('登录状态校验失败，请重试')
  }

  clearDingTalkOAuthCallbackParamsInCurrentUrl()
  return true
}
```

**为什么要清理 URL 中的回调参数：**

H5 hash 路由下，`code`、`state` 可能残留在地址栏 search 中。如果不清理，下次再进入登录页时会把历史参数误判为"本次回调"，导致 state 校验失败。

### 5.4 登录结果统一落盘

两条登录路径拿到后端返回结果后，统一走同一套落盘逻辑：

```js
// util/auth/dingtalkLogin.js
export const completeDingTalkLogin = async (loginResult) => {
  const { token, userInfo } = loginResult

  // 写入和微信登录相同的缓存字段，保证请求层、WebSocket 等底座无需改动
  uni.setStorageSync('USER_INFO_TOKEN', token)
  uni.setStorageSync('USER_INFO', userInfo)
  uni.setStorageSync('currentUser', userInfo)

  // 触发全局登录态就绪事件
  uni.$emit('AUTH_SESSION_READY', userInfo)

  return { targetUrl: '/pages/index/index' }
}
```

---

## 六、学校配置接口约定

钉钉登录链路依赖后端返回的学校配置，前端不写死钉钉参数。

**后端需要返回的字段：**

```json
{
  "code": 200,
  "data": {
    "schoolID": "school_001",
    "dingtalkLoginApp": 1,
    "dingtalkClientID": "dingxxxxxx",
    "dingtalkCorpID": "dingyyyyyy"
  }
}
```

| 字段 | 说明 | 必须 |
|------|------|------|
| `dingtalkLoginApp` | 是否开启钉钉登录（1=开启） | 是 |
| `dingtalkClientID` | 钉钉应用 AppKey，OAuth 授权 URL 必需 | 是 |
| `dingtalkCorpID` | 钉钉企业 CorpID，JSAPI 免登必需 | 是 |

**前端校验逻辑：**

```js
const validateSchoolConfig = (config) => {
  if (config.dingtalkLoginApp !== 1) {
    throw new Error('当前学校未开启钉钉登录，请联系管理员')
  }
  if (!config.dingtalkCorpID) {
    throw new Error('缺少钉钉 CorpID 配置，请联系管理员')
  }
  if (!config.dingtalkClientID) {
    throw new Error('缺少钉钉 ClientID 配置，请联系管理员')
  }
}
```

---

## 七、后端接口约定

### 7.1 钉钉内 H5 免登接口

```
POST /login/dingtalk/h5
Body: { authCode: "xxx", schoolID: "school_001" }

Response:
{
  "code": 200,
  "data": {
    "token": "Bearer xxx",
    "userInfo": {
      "userId": "user_001",
      "name": "张三",
      "schoolID": "school_001"
    }
  }
}
```

后端处理：用 `authCode` + 学校钉钉应用配置 → 换取钉钉用户身份 → 映射本地账号 → 签发业务 token

### 7.2 OAuth 登录接口

```
POST /login/dingtalk/pc
Body: { code: "xxx", schoolID: "school_001", clientType: "APP" }
```

后端处理：用 `code` + `clientID` + `clientSecret` → 换取用户 accessToken → 获取用户信息 → 映射本地账号 → 签发业务 token

---

## 八、联调验收清单

### 8.1 打开验证

- [ ] 工作台能看到应用入口
- [ ] 手机钉钉点击后能打开页面
- [ ] 页面不白屏，静态资源不 404
- [ ] PC 钉钉也能打开（如果需要支持）

### 8.2 登录验证

- [ ] 登录页能正确读取 `schoolID`（从 URL 参数）
- [ ] 学校配置接口能返回钉钉配置（`dingtalkCorpID`、`dingtalkClientID`）
- [ ] 钉钉内打开时能走 JSAPI 免登链路，拿到 `authCode`
- [ ] 钉钉外打开时能走 OAuth 跳转链路，回调后拿到 `code`
- [ ] state 校验正常，回调参数消费后已清理

### 8.3 会话验证

- [ ] 登录成功后 `USER_INFO_TOKEN`、`USER_INFO`、`currentUser` 正常写入
- [ ] 页面能进入系统首页
- [ ] 后续接口请求能带上 token 和 schoolID

### 8.4 业务基础验证

- [ ] 首页能打开
- [ ] 至少一条列表页和一条详情页能打开
- [ ] 上传功能正常
- [ ] WebSocket 消息链路正常（如果有）

---

## 九、常见问题排查

### 问题 1：工作台点进去白屏

排查顺序：
1. HTTPS 证书是否有效
2. 域名是否在钉钉后台可信域名白名单里
3. Nginx 是否配置了 SPA 路由回退（`try_files $uri /index.html`）
4. 静态资源路径是否正确

### 问题 2：JSAPI 免登拿不到 authCode

排查顺序：
1. 当前是否真的在钉钉容器内（UA 是否含 `DingTalk`）
2. 钉钉 SDK 是否加载成功
3. `dd.ready` 是否正常触发（有没有超时）
4. `corpId` 是否正确（和钉钉后台的企业 ID 一致）
5. 应用是否已发布（未发布的应用配置不生效）

### 问题 3：OAuth 回调后 state 校验失败

排查顺序：
1. 是否是历史残留参数（上次登录的 code/state 没有清理）
2. 是否在同一个浏览器 tab 里完成了授权（跨 tab 会导致 state 不匹配）
3. 本地存储是否被清空（state 存在 storage 里）

### 问题 4：后端换用户信息失败

排查顺序：
1. 钉钉后台是否配置了通讯录读权限
2. 应用是否已发布
3. `authCode` 是否已过期（有效期 5 分钟，一次性使用）
4. 后端使用的 `clientID`/`clientSecret` 是否和钉钉后台一致

### 问题 5：登录成功但进不了系统

排查顺序：
1. `USER_INFO_TOKEN` 是否正常写入
2. `USER_INFO.schoolID` 是否存在（请求层依赖这个字段）
3. 跳转的目标路由是否正确
4. 目标页面是否有权限校验拦截

---

## 十、推荐的首页 URL 方案

结合实际项目经验，推荐首页 URL 格式：

```
https://你的域名/#/pages/login/index?schoolID=学校ID
```

**不建议：**
- 首页直接配成业务 tab 页（登录态没建好时更难定位问题）
- 不带 `schoolID`（依赖默认值兜底，多学校场景排查困难）
- 使用 HTTP（钉钉强制要求 HTTPS）

---

## 十一、后续演进方向

H5 微应用跑通后，可以根据业务需要决定是否继续演进：

1. **继续优化 H5 体验**：性能优化、离线缓存、PWA
2. **演进成钉钉小程序**：需要平台适配层改造，体验更接近原生
3. **接入更多钉钉能力**：扫码（JSAPI）、选人选部门（complexPicker）、工作通知推送

不管走哪条路，H5 微应用阶段跑通的登录链路和业务验证都是有价值的基础。
