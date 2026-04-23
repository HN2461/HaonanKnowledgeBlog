---
title: PC端第三方扫码登录全攻略（钉钉 / 微信 / 企业微信）
date: 2026-04-23
category: 项目复用技术
tags:
  - OAuth2.0
  - 钉钉登录
  - 微信登录
  - 企业微信登录
  - iframe
  - postMessage
  - window跳转
description: 系统梳理钉钉、微信、企业微信 PC 端 OAuth2.0 扫码登录对接方案，重点讲解内嵌弹框渲染、window 对象跳转与 postMessage 回调监听，帮助快速落地绑定/登录功能。
---

# PC 端第三方扫码登录全攻略（钉钉 / 微信 / 企业微信）

## 一、核心原理：OAuth2.0 授权码模式

三家平台的 PC 扫码登录都基于 **OAuth2.0 授权码（Authorization Code）模式**，流程一致：

```
用户扫码确认
    ↓
平台服务器 → 携带 code 重定向到 redirect_uri
    ↓
我方后端用 code + AppSecret → 换取 access_token
    ↓
用 access_token → 获取用户信息（openid / userid / unionid）
    ↓
完成登录 / 绑定
```

> **关键点**：`code` 是一次性的，有效期极短（约 5 分钟），必须立即在后端换取 `access_token`，不能暴露在前端。

---

## 二、弹框内嵌二维码的两种方式

PC 项目里常见的做法是弹出一个 Modal，里面展示扫码区域。有两种实现方式：

### 方式 A：重定向跳转（整页跳转）

点击按钮后，直接把当前页面跳转到平台的授权 URL，扫码完成后平台再把用户重定向回 `redirect_uri`。

```js
// 构造授权 URL 后直接跳转
window.location.href = authUrl
```

**缺点**：整页跳转，用户体验差，弹框场景不适用。

---

### 方式 B：内嵌 iframe（推荐，弹框场景标准做法）

平台提供官方 JS SDK，调用后会在指定容器内渲染一个 `<iframe>`，iframe 里展示二维码。用户扫码后，iframe 内部通过 `window.postMessage` 把临时凭证发送给父页面，父页面监听后再发起跳转或接口请求。

```
父页面（弹框）
  └── <iframe src="https://login.xxx.com/...">
          用户扫码
          ↓
          iframe 内部执行 parent.postMessage(data, origin)
  ↑
父页面 window.addEventListener('message', handler)
  ↓
拿到临时凭证 → 跳转 / 调后端接口
```

---

## 三、钉钉 PC 扫码登录

### 3.1 前置准备

1. 登录[钉钉开放平台](https://open.dingtalk.com/)，创建「扫码登录」应用
2. 获取 `AppID`（即 `appid`）
3. 配置「回调域名」，必须与 `redirect_uri` 的域名一致

### 3.2 引入官方 JS SDK

```html
<script src="https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js"></script>
```

### 3.3 渲染二维码容器

在弹框 HTML 里放一个空 div：

```html
<div id="dd_login_container"></div>
```

### 3.4 调用 DDLogin 初始化

```js
// goto 参数：钉钉授权地址，需要 encodeURIComponent 编码
const gotoUrl = encodeURIComponent(
  'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
  '?appid=YOUR_APPID' +
  '&response_type=code' +
  '&scope=snsapi_login' +
  '&state=STATE' +
  '&redirect_uri=' + encodeURIComponent('https://your-domain.com/callback')
)

DDLogin({
  id: 'dd_login_container',   // 容器 div 的 id
  goto: gotoUrl,
  style: 'border:none;background:#fff;',
  width: '365',
  height: '400'
})
```

### 3.5 监听 postMessage 回调

钉钉 iframe 扫码成功后，会向父页面发送 `message` 事件，`event.origin` 固定为 `https://login.dingtalk.com`，`event.data` 是 `loginTmpCode`（临时登录码）。

```js
function handleDingTalkMessage(event) {
  // 安全校验：只处理来自钉钉登录域的消息
  if (event.origin !== 'https://login.dingtalk.com') return

  const loginTmpCode = event.data
  console.log('收到钉钉 loginTmpCode：', loginTmpCode)

  // 用 loginTmpCode 换取正式 code，再跳转到 redirect_uri
  const finalUrl =
    'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
    '?appid=YOUR_APPID' +
    '&response_type=code' +
    '&scope=snsapi_login' +
    '&state=STATE' +
    '&redirect_uri=' + encodeURIComponent('https://your-domain.com/callback') +
    '&loginTmpCode=' + loginTmpCode

  window.location.href = finalUrl
}

// 注册监听（兼容旧浏览器）
if (window.addEventListener) {
  window.addEventListener('message', handleDingTalkMessage, false)
} else if (window.attachEvent) {
  window.attachEvent('onmessage', handleDingTalkMessage)
}
```

### 3.6 后端回调处理（redirect_uri 页面）

用户扫码后，浏览器会跳转到：

```
https://your-domain.com/callback?code=AUTH_CODE&state=STATE
```

后端拿到 `code` 后：

```
POST https://oapi.dingtalk.com/sns/gettoken
  → 换取 access_token

GET https://oapi.dingtalk.com/sns/getuserinfo
  → 获取 openid、unionid、用户信息
```

---

## 四、微信 PC 扫码登录（微信开放平台）

> 适用于「网站应用」，需要在[微信开放平台](https://open.weixin.qq.com/)注册并通过资质认证（需营业执照，300元/年）。

### 4.1 前置准备

1. 微信开放平台 → 网站应用 → 获取 `AppID` 和 `AppSecret`
2. 配置「授权回调域」（只填域名，不含路径和协议）

### 4.2 方式一：整页跳转（简单场景）

```js
const redirectUri = encodeURIComponent('https://your-domain.com/wx/callback')
const state = Math.random().toString(36).slice(2) // 防 CSRF 随机串，存入 sessionStorage

const wxAuthUrl =
  'https://open.weixin.qq.com/connect/qrconnect' +
  '?appid=YOUR_APPID' +
  '&redirect_uri=' + redirectUri +
  '&response_type=code' +
  '&scope=snsapi_login' +
  '&state=' + state +
  '#wechat_redirect'

window.location.href = wxAuthUrl
```

### 4.3 方式二：内嵌 iframe（弹框场景）

引入官方 JS：

```html
<script src="https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"></script>
```

初始化：

```js
const wxLogin = new WxLogin({
  self_redirect: true,   // true = 二维码扫描结果在 iframe 内跳转，父页面通过 postMessage 接收
  id: 'wx_login_container',
  appid: 'YOUR_APPID',
  scope: 'snsapi_login',
  redirect_uri: encodeURIComponent('https://your-domain.com/wx/callback'),
  state: sessionStorage.getItem('wx_state'),
  style: 'black',        // 二维码样式：black / white
  href: ''               // 可传自定义 CSS URL 覆盖样式
})
```

> **`self_redirect: true` 是关键**：设为 true 后，扫码结果不会整页跳转，而是在 iframe 内部跳转，同时通过 `postMessage` 把 `redirect_uri?code=xxx&state=xxx` 发给父页面。

### 4.4 监听微信 postMessage 回调

```js
window.addEventListener('message', function(event) {
  // 安全校验：只处理来自微信登录域的消息
  if (event.origin !== 'https://open.weixin.qq.com') return

  // event.data 是字符串，格式为完整的回调 URL
  // 例如：https://your-domain.com/wx/callback?code=CODE&state=STATE
  const callbackUrl = event.data

  // 解析 URL 拿到 code
  const url = new URL(callbackUrl)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  // 校验 state 防 CSRF
  if (state !== sessionStorage.getItem('wx_state')) {
    console.error('state 校验失败，疑似 CSRF 攻击')
    return
  }

  // 把 code 发给后端换取用户信息
  fetch('/api/wx/login', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()).then(data => {
    // 登录成功，关闭弹框，更新用户状态
  })
}, false)
```

### 4.5 后端换取用户信息

```
# 第一步：code 换 access_token
GET https://api.weixin.qq.com/sns/oauth2/access_token
  ?appid=APPID
  &secret=APPSECRET
  &code=CODE
  &grant_type=authorization_code

# 返回：access_token、openid、unionid

# 第二步：获取用户信息
GET https://api.weixin.qq.com/sns/userinfo
  ?access_token=ACCESS_TOKEN
  &openid=OPENID

# 返回：nickname、headimgurl、unionid 等
```

---

## 五、企业微信 PC 扫码登录

> 适用于企业内部系统，员工用企业微信扫码登录/绑定。需要在[企业微信管理后台](https://work.weixin.qq.com/)创建自建应用。

### 5.1 前置准备

1. 企业微信管理后台 → 应用管理 → 自建应用
2. 获取 `CorpID`（企业 ID）和 `AgentID`
3. 在应用详情 → 「网页授权及JS-SDK」→ 配置「可信域名」

### 5.2 方式一：整页跳转

```js
const redirectUri = encodeURIComponent('https://your-domain.com/wxwork/callback')
const state = Math.random().toString(36).slice(2)
sessionStorage.setItem('wxwork_state', state)

const authUrl =
  'https://open.work.weixin.qq.com/wwopen/sso/qrConnect' +
  '?appid=CORPID' +
  '&agentid=AGENTID' +
  '&redirect_uri=' + redirectUri +
  '&state=' + state

window.location.href = authUrl
```

### 5.3 方式二：内嵌 iframe（弹框场景）

引入官方 JS：

```html
<script src="https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js"></script>
```

初始化：

```js
const wwLogin = new WwLogin({
  id: 'wxwork_login_container',
  appid: 'CORPID',
  agentid: 'AGENTID',
  redirect_uri: encodeURIComponent('https://your-domain.com/wxwork/callback'),
  state: sessionStorage.getItem('wxwork_state'),
  href: '',        // 自定义 CSS URL（可选）
  lang: 'zh'       // zh / en
})
```

### 5.4 监听企业微信 postMessage 回调

企业微信 iframe 扫码成功后，同样通过 `postMessage` 通知父页面：

```js
window.addEventListener('message', function(event) {
  // 企业微信回调来源域
  if (event.origin !== 'https://open.work.weixin.qq.com') return

  // event.data 结构：{ code: 'xxx', state: 'xxx' }
  const { code, state } = event.data

  if (state !== sessionStorage.getItem('wxwork_state')) {
    console.error('state 校验失败')
    return
  }

  // 发给后端换取用户信息
  fetch('/api/wxwork/login', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()).then(data => {
    // 登录/绑定成功
  })
}, false)
```

### 5.5 后端换取用户信息

```
# 第一步：code 换 access_token
GET https://qyapi.weixin.qq.com/cgi-bin/gettoken
  ?corpid=CORPID
  &corpsecret=CORPSECRET

# 第二步：code 换 userid
GET https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo
  ?access_token=ACCESS_TOKEN
  &code=CODE

# 返回：userid（企业内唯一）、openid

# 第三步（可选）：userid 换用户详情
GET https://qyapi.weixin.qq.com/cgi-bin/user/get
  ?access_token=ACCESS_TOKEN
  &userid=USERID
```

---

## 六、三平台对比速查

| 对比项 | 钉钉 | 微信（开放平台） | 企业微信 |
|---|---|---|---|
| 适用场景 | 钉钉用户扫码 | 微信用户扫码 | 企业员工扫码 |
| 官方 JS SDK | `ddLogin.js` | `wxLogin.js` | `wwLogin.js` |
| iframe 回调来源 | `https://login.dingtalk.com` | `https://open.weixin.qq.com` | `https://open.work.weixin.qq.com` |
| postMessage data 格式 | 字符串（loginTmpCode） | 字符串（完整回调 URL） | 对象 `{ code, state }` |
| 后续操作 | 用 loginTmpCode 再跳转换 code | 直接解析 URL 拿 code | 直接拿 code |
| 用户唯一标识 | `openid` / `unionid` | `openid` / `unionid` | `userid`（企业内） |
| 资质要求 | 企业开发者认证 | 营业执照 + 300元/年 | 企业微信认证企业 |

---

## 七、window 对象跳转方式汇总

在弹框场景中，拿到 `code` 或临时凭证后，有三种处理方式：

### 7.1 整页跳转（不推荐用于弹框）

```js
window.location.href = callbackUrl
```

### 7.2 在当前页面发 Ajax（推荐）

```js
// 拿到 code 后直接 POST 给后端，不跳转页面
fetch('/api/login', { method: 'POST', body: JSON.stringify({ code }) })
  .then(res => res.json())
  .then(({ token, userInfo }) => {
    localStorage.setItem('token', token)
    closeModal()       // 关闭弹框
    updateUserState()  // 更新全局用户状态
  })
```

### 7.3 新窗口跳转（适合 redirect_uri 在独立页面的场景）

```js
// 打开新窗口展示二维码，扫码后新窗口关闭并通知父窗口
const popup = window.open(authUrl, 'oauth_popup', 'width=500,height=600')

// 父窗口轮询检测子窗口是否关闭
const timer = setInterval(() => {
  if (popup.closed) {
    clearInterval(timer)
    // 子窗口关闭后，父窗口刷新用户状态
    checkLoginStatus()
  }
}, 500)
```

---

## 八、常见问题与注意事项

### 8.1 redirect_uri 域名不匹配

**现象**：跳转后报 `redirect_uri 参数错误`  
**原因**：平台后台配置的回调域名与实际 `redirect_uri` 不一致  
**解决**：平台后台填写的是「域名」（不含路径），代码里的 `redirect_uri` 必须在该域名下

### 8.2 state 参数防 CSRF

每次发起授权前生成随机 `state`，存入 `sessionStorage`，回调时校验是否一致。不校验 state 存在 CSRF 风险。

```js
// 生成 state
const state = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
sessionStorage.setItem('oauth_state', state)

// 回调时校验
if (receivedState !== sessionStorage.getItem('oauth_state')) {
  throw new Error('state 不匹配，疑似 CSRF')
}
```

### 8.3 postMessage 安全校验

**必须校验 `event.origin`**，否则任何页面都能伪造消息：

```js
window.addEventListener('message', function(event) {
  // 白名单校验，不能省略
  const allowedOrigins = [
    'https://login.dingtalk.com',
    'https://open.weixin.qq.com',
    'https://open.work.weixin.qq.com'
  ]
  if (!allowedOrigins.includes(event.origin)) return
  // ... 处理消息
})
```

### 8.4 code 只能用一次

`code` 有效期约 5 分钟，且只能换一次 `access_token`。后端换取失败后不要重试，应引导用户重新扫码。

### 8.5 弹框关闭时清理监听

```js
// 弹框关闭时移除监听，避免内存泄漏
function onModalClose() {
  window.removeEventListener('message', handleMessage)
}
```

### 8.6 钉钉新版 API（2023+）

钉钉在 2023 年后推出了新版 OAuth2.0（基于 `https://login.dingtalk.com/oauth2/auth`），旧版 `oapi.dingtalk.com` 接口仍可用但建议迁移。新版流程与微信类似，直接用 `code` 换 `accessToken`，不再需要 `loginTmpCode` 中转。

---

## 九、Vue 3 弹框组件示例（以钉钉为例）

```vue
<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-box">
      <h3>钉钉扫码绑定</h3>
      <div id="dd_login_container"></div>
      <button @click="close">取消</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'success'])

function handleMessage(event) {
  if (event.origin !== 'https://login.dingtalk.com') return
  const loginTmpCode = event.data

  // 用 loginTmpCode 换 code（跳转方式）
  const finalUrl =
    'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
    '?appid=YOUR_APPID' +
    '&response_type=code' +
    '&scope=snsapi_login' +
    '&state=' + sessionStorage.getItem('dd_state') +
    '&redirect_uri=' + encodeURIComponent('https://your-domain.com/callback') +
    '&loginTmpCode=' + loginTmpCode

  window.location.href = finalUrl
}

function initDDLogin() {
  const state = Math.random().toString(36).slice(2)
  sessionStorage.setItem('dd_state', state)

  const gotoUrl = encodeURIComponent(
    'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
    '?appid=YOUR_APPID' +
    '&response_type=code' +
    '&scope=snsapi_login' +
    '&state=' + state +
    '&redirect_uri=' + encodeURIComponent('https://your-domain.com/callback')
  )

  // 等 DOM 渲染完再初始化
  setTimeout(() => {
    window.DDLogin({
      id: 'dd_login_container',
      goto: gotoUrl,
      style: 'border:none;background:#fff;',
      width: '365',
      height: '400'
    })
  }, 100)
}

watch(() => props.visible, (val) => {
  if (val) {
    initDDLogin()
    window.addEventListener('message', handleMessage, false)
  } else {
    window.removeEventListener('message', handleMessage)
  }
})

function close() {
  emit('close')
}

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
```

---

## 参考资料

- [钉钉开放平台 - 扫码登录文档](https://open.dingtalk.com/document/orgapp/scan-qr-code-to-log-on-to-third-party-websites)
- [微信开放平台 - 网站应用微信登录](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
- [企业微信 - 扫码授权登录](https://developer.work.weixin.qq.com/document/path/91025)
- [MDN - window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
