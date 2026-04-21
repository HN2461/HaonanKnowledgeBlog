---
title: 钉钉双链路登录完整实现：JSAPI 免登与 OAuth 授权
date: 2026-04-21
category: uni-app
tags:
  - 钉钉登录
  - JSAPI免登
  - OAuth授权
  - 双链路设计
  - uni-app
description: 深入讲解钉钉登录的双链路设计思路，涵盖 SDK 懒加载单例、dd.ready 等待、state 防伪、hash 路由参数残留清理、App WebView 拦截、会话统一落盘等完整技术细节。
---

# 钉钉双链路登录完整实现：JSAPI 免登与 OAuth 授权

> 这篇文章不讲钉钉开放平台的基础配置，而是深入讲解钉钉登录的**双链路设计**——为什么要拆两条路、每条路的完整流程、SDK 懒加载、state 防伪、hash 路由参数残留、App WebView 拦截等技术细节。
>
> 适合已经了解钉钉登录基础概念，想看完整实现方案的开发者。

---

## 一、为什么需要双链路

钉钉登录不是"一套代码走天下"，而是必须根据运行环境走不同的路径：

| 场景 | 路径 | 用户体验 | 技术原理 |
|------|------|----------|----------|
| 在钉钉 App 内打开 H5 | JSAPI 免登 | 打开即登录，无感知 | `dd.ready` → `requestAuthCode`，类似微信小程序 `wx.login` |
| 普通浏览器 / App 原生端 | OAuth 授权跳转 | 跳转到授权页，手动确认 | 构建授权 URL → 用户授权 → 回调带 code |

**为什么不能只用一条路：**
- JSAPI 免登只能在钉钉容器内使用，普通浏览器里调用会报错
- OAuth 跳转在钉钉容器内也能用，但体验不如 JSAPI 免登（多一次跳转）

**结论：入口处先判断环境，再分流到对应的登录页。**

---

## 二、入口分流设计

### 2.1 环境判断

```js
// util/platform/runtime.js

/**
 * 获取 User-Agent（App端和H5端获取方式不同）
 */
export const getRuntimeUserAgent = () => {
  // #ifdef APP-PLUS
  return plus?.navigator?.getUserAgent() || ''
  // #endif
  // #ifdef H5
  return window?.navigator?.userAgent || ''
  // #endif
  return ''
}

/**
 * 是否在钉钉容器内（钉钉内置浏览器 UA 含 "DingTalk"）
 */
export const isDingTalkContainer = () =>
  /DingTalk/i.test(getRuntimeUserAgent())
```

### 2.2 登录页分流逻辑

```js
// 登录页点击"钉钉登录"
const handleDingTalkLogin = () => {
  // 先检查隐私协议、schoolID 等前置条件...

  if (isDingTalkContainer()) {
    // 在钉钉容器内：走 JSAPI 免登
    uni.navigateTo({
      url: `/secondary/dingTalkH5Login/index?schoolID=${schoolID}`
    })
  } else {
    // 不在钉钉容器：走 OAuth 跳转
    uni.navigateTo({
      url: `/secondary/dingTalkLogin/index?schoolID=${schoolID}`
    })
  }
}
```

---

## 三、JSAPI 免登链路（钉钉容器内）

### 3.1 完整流程

```
onLoad
  → 读取 schoolID
  → 拉取学校配置（含 dingtalkCorpID）
  → 校验配置完整性
  → 二次确认在钉钉容器内（防御性校验）
  → loadDingTalkJsApi（懒加载 SDK）
  → waitForDingTalkReady（等待 dd.ready）
  → requestAuthCode({ corpId })
  → 发给后端 /login/dingtalk/h5
  → completeDingTalkLogin（落盘 + 跳转）
```

### 3.2 SDK 懒加载单例

**为什么要懒加载：** 不在 `main.js` 全局初始化，避免影响微信端性能。

**为什么要单例：** 多次点击登录时，不重复插入 script 标签，不重复发起加载。

```js
// util/platform/dingtalk.js
let dingTalkSdkPromise = null

export const loadDingTalkJsApi = () => {
  // 已加载，直接返回
  if (window.dd?.runtime?.permission) {
    return Promise.resolve(window.dd)
  }

  // 加载中，复用同一个 Promise
  if (dingTalkSdkPromise) {
    return dingTalkSdkPromise
  }

  dingTalkSdkPromise = new Promise((resolve, reject) => {
    // 处理边缘情况：script 标签已存在但 Promise 单例丢失（如页面热重载）
    const existingScript = document.getElementById('app-dingtalk-jsapi-sdk')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.dd))
      existingScript.addEventListener('error', () => reject(new Error('SDK加载失败')))
      return
    }

    // 动态创建 script 标签
    const script = document.createElement('script')
    script.id = 'app-dingtalk-jsapi-sdk'
    script.src = 'https://g.alicdn.com/dingding/dingtalk-jsapi/2.11.0/dingtalk.open.js'
    script.async = true
    script.onload = () => resolve(window.dd)
    script.onerror = () => {
      dingTalkSdkPromise = null  // 加载失败时重置单例，允许下次重试
      reject(new Error('SDK加载失败'))
    }
    document.head.appendChild(script)
  })

  return dingTalkSdkPromise
}
```

### 3.3 等待 dd.ready（带超时保护）

SDK 加载完成后，还不能立即调用 JSAPI，必须等待钉钉容器初始化完成。

```js
export const waitForDingTalkReady = (ddInstance, timeoutMs = 5000) =>
  new Promise((resolve, reject) => {
    if (!ddInstance) {
      reject(new Error('钉钉JSAPI未就绪'))
      return
    }

    // 超时兜底：5秒内 dd.ready 没触发则 reject
    const timeout = setTimeout(() => {
      reject(new Error('钉钉环境初始化超时'))
    }, timeoutMs)

    // dd.ready：容器初始化完成
    ddInstance.ready(() => {
      clearTimeout(timeout)
      resolve(ddInstance)
    })

    // dd.error：容器初始化失败
    ddInstance.error(error => {
      clearTimeout(timeout)
      reject(new Error(error?.message || '钉钉环境初始化失败'))
    })
  })
```

### 3.4 获取免登授权码

```js
// util/platform/auth.js
export const requestDingTalkAuthCode = async (corpId) => {
  if (!corpId) throw new Error('缺少钉钉 CorpId')

  // 1. 懒加载 SDK
  const ddInstance = await loadDingTalkJsApi()

  // 2. 等待 dd.ready
  await waitForDingTalkReady(ddInstance)

  // 3. 调用 JSAPI 获取授权码
  return new Promise((resolve, reject) => {
    ddInstance.runtime.permission.requestAuthCode({
      corpId,
      onSuccess: result => {
        // 兼容 code 和 authCode 两种字段名
        resolve(result?.code || result?.authCode || '')
      },
      onFail: error => {
        reject(new Error(error?.errorMessage || '获取授权码失败'))
      }
    })
  })
}
```

**注意：** `requestAuthCode` 不需要先执行 `dd.config`，但必须在 `dd.ready` 中调用。

### 3.5 发给后端换取业务 token

```js
const authCode = await requestDingTalkAuthCode(schoolConfig.dingtalkCorpID)

const loginRes = await dingTalkH5Login({
  authCode,
  schoolID
})

await completeDingTalkLogin(loginRes)
```

---

## 四、OAuth 授权链路（普通浏览器 / App）

### 4.1 完整流程

```
onLoad
  → 读取 schoolID
  → 拉取学校配置
  → 检查 URL 中是否已有 code（回调返回的）
  ├─ 有 code → 校验 state → 清理 URL 参数 → 发给后端 → 落盘跳转
  └─ 无 code → 生成 state → 构建授权 URL → 跳转授权页（或 App WebView）
```

### 4.2 OAuth 授权 URL 构建

```js
export const buildDingTalkOAuthUrl = ({
  clientId,
  redirectUri,
  corpId,
  state
}) => {
  if (!clientId || !redirectUri) return ''

  const params = {
    redirect_uri: redirectUri,
    response_type: 'code',
    client_id: clientId,
    scope: corpId ? 'openid corpid' : 'openid',
    state: state || `dingtalk_login_${Date.now()}`,
    prompt: 'consent'
  }
  if (corpId) params.corpId = corpId

  return `https://login.dingtalk.com/oauth2/auth?${buildQueryString(params)}`
}
```

### 4.3 state 防伪机制

**为什么需要 state：** 防止别人拼接一个外部授权回调 URL 直接打到你的页面，造成"不是本次登录发起的 code"也被送去后端换 token。

**完整流程：**

```js
// 发起 OAuth 前：生成并缓存 state
const state = createDingTalkOAuthState()  // `dingtalk_login_${Date.now()}_${random}`
saveDingTalkOAuthState(state)

// 回调后：校验 state
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

### 4.4 hash 路由参数残留问题

**问题场景：** uni-app H5 使用 hash 路由，钉钉把 `code`、`state` 拼在 URL search（`?`）里。登录成功后即使切到别的页面，这些参数也可能继续残留在地址栏。下次再进入登录页时，会把历史参数误判为"本次回调"。

**解决方案：** 成功识别并消费回调后，立即清理 URL 中的 `code`、`authCode`、`state`：

```js
export const clearDingTalkOAuthCallbackParamsInCurrentUrl = () => {
  if (!window?.history?.replaceState) return

  const currentUrl = window.location.href
  const cleanedUrl = stripDingTalkOAuthCallbackParams(currentUrl)
  if (!cleanedUrl || cleanedUrl === currentUrl) return

  // 用 replaceState 替换当前历史记录，不刷新页面
  window.history.replaceState(null, document.title, cleanedUrl)
}

// 清理逻辑：从 search 和 hash 中删除 code/authCode/state
export const stripDingTalkOAuthCallbackParams = (url) => {
  const parsedUrl = new URL(url)
  const keysToRemove = ['code', 'authCode', 'state']

  // 清理 search 部分
  keysToRemove.forEach(key => parsedUrl.searchParams.delete(key))

  // 清理 hash 部分（uni-app hash 路由）
  const hash = parsedUrl.hash || ''
  if (hash.includes('?')) {
    const queryIndex = hash.indexOf('?')
    const hashPath = hash.substring(0, queryIndex)
    const hashQuery = hash.substring(queryIndex + 1)
    const hashSearchParams = new URLSearchParams(hashQuery)

    keysToRemove.forEach(key => hashSearchParams.delete(key))

    const nextHashQuery = hashSearchParams.toString()
    parsedUrl.hash = nextHashQuery ? `${hashPath}?${nextHashQuery}` : hashPath
  }

  return parsedUrl.toString()
}
```

### 4.5 App 端 WebView 拦截

App 端不能整页跳转到钉钉授权页（会影响 App 页面栈），而是弹出 WebView 局部封装：

```js
export const openDingTalkAuthWebview = ({ authUrl, redirectUri, title = '钉钉登录' }) =>
  new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (!plus?.webview) {
      reject(new Error('App环境未准备完成'))
      return
    }

    // 创建 WebView
    const webviewId = `dingtalk-auth-${Date.now()}`
    const authWebview = plus.webview.create(authUrl, webviewId, {
      popGesture: 'close',
      titleNView: {
        autoBackButton: true,
        titleText: title
      }
    })

    let settled = false

    // 拦截 URL 跳转（核心！）
    authWebview.overrideUrlLoading({ mode: 'reject' }, event => {
      const currentUrl = event?.url || ''

      // 不是回调地址，不处理
      if (!currentUrl.startsWith(redirectUri)) return

      // 是回调地址，从 URL 中提取 code
      const callbackResult = resolveDingTalkAuthCodeFromUrl(currentUrl)
      const code = callbackResult.code || callbackResult.authCode || ''

      if (!code) {
        finish(reject, new Error('授权码为空'))
        return
      }

      finish(resolve, callbackResult)
    })

    // 用户手动关闭
    authWebview.addEventListener('close', () => {
      if (!settled) {
        settled = true
        reject(new Error('用户已取消登录'))
      }
    })

    // 显示 WebView
    authWebview.show('slide-in-right', 180)

    // 统一关闭函数
    const finish = (handler, payload) => {
      if (settled) return
      settled = true
      try {
        authWebview.close('auto')
      } catch (e) {}
      handler(payload)
    }
    // #endif
  })
```

### 4.6 H5 端两阶段处理

H5 端 OAuth 是两阶段的：

**第一次进入（首次）：** 没有 code → 跳转到钉钉授权页

```js
const obtainOAuthCode = async () => {
  // 检查 URL 中是否已有 code
  const callbackResult = resolveDingTalkAuthCodeFromUrl(window.location.href)
  const code = callbackResult.code || callbackResult.authCode || ''

  if (code) {
    // 已是回调，校验 state 后返回
    const isValid = validateOAuthState(callbackResult.state)
    if (isValid) return callbackResult
  }

  // 首次进入：生成 state，跳转授权页
  const state = createDingTalkOAuthState()
  saveDingTalkOAuthState(state)

  const authUrl = buildDingTalkOAuthUrl({
    clientId: schoolConfig.dingtalkClientID,
    redirectUri: buildUniH5PageUrl('/secondary/dingTalkLogin/index', { schoolID }),
    corpId: schoolConfig.dingtalkCorpID,
    state
  })

  // 用 replace 避免用户点返回回到中间态
  window.location.replace(authUrl)
  return null  // 页面已跳走，等回调
}
```

**第二次进入（回调）：** 钉钉授权后回调，URL 中带 code → 取出 code → 发给后端

```js
// 页面重新加载后，再次执行 obtainOAuthCode
// 这次 URL 中已有 code，直接进入 if (code) 分支
```

### 4.7 回调地址构建

App 端和 H5 端的回调地址不同：

```js
const buildRedirectUri = () => {
  if (isAppPlusRuntime()) {
    // App 端：固定后端路径，仅用于 WebView 拦截
    return `${configInfo.API_URL.replace(/\/api$/, '')}/dingtalk/app-login-callback`
  }

  // H5 端：当前页面 URL（含 schoolID 参数）
  return buildUniH5PageUrl('/secondary/dingTalkLogin/index', { schoolID })
}
```

---

## 五、会话统一落盘

两条登录路径拿到后端返回结果后，统一走同一套落盘逻辑：

```js
// util/auth/dingtalkLogin.js
export const completeDingTalkLogin = async (loginResult) => {
  const { token, userInfo } = resolveLoginPayload(loginResult)

  // 写入和微信登录相同的缓存字段，保证请求层、WebSocket 等底座无需改动
  uni.setStorageSync('USER_INFO_TOKEN', token)
  uni.setStorageSync('USER_INFO', userInfo)
  uni.setStorageSync('currentUser', userInfo)

  // 触发全局登录态就绪事件
  uni.$emit('AUTH_SESSION_READY', userInfo)

  // 根据账号类型决定跳转页
  const targetUrl = userInfo.isParent ? '/pages/parent/index' : '/pages/index/index'
  return { targetUrl }
}
```

**为什么要统一落盘：**
- 不同账号类型（普通账号、家长账号）的本地存储规则不完全相同
- 如果在登录页里临时散写，后续很容易在不同登录方式之间写出不同版本的逻辑

---

## 六、关键技术细节

### 6.1 URL 参数解析（兼容 search 和 hash）

uni-app H5 使用 hash 路由，钉钉回调参数可能出现在两个位置：

```js
// 普通 URL：https://xxx.com/callback?code=abc
// hash 路由：https://xxx.com/#/page?code=abc

export const resolveDingTalkAuthCodeFromUrl = (url) => {
  const result = { code: '', authCode: '', state: '' }

  const parseQuery = (queryString) => {
    const searchParams = new URLSearchParams(queryString.replace(/^\?/, ''))
    if (!result.code) result.code = searchParams.get('code') || ''
    if (!result.authCode) result.authCode = searchParams.get('authCode') || ''
    if (!result.state) result.state = searchParams.get('state') || ''
  }

  try {
    const parsedUrl = new URL(url)
    // 解析 search 部分
    parseQuery(parsedUrl.search)
    // 解析 hash 部分
    const hash = parsedUrl.hash || ''
    if (hash.includes('?')) {
      parseQuery(hash.substring(hash.indexOf('?') + 1))
    }
  } catch (e) {
    // 降级为手动字符串截取
  }

  return result
}
```

### 6.2 学校配置优先级

```js
// 确保 schoolID 存在
const ensureSchoolContext = () => {
  schoolID.value = String(
    schoolID.value ||                          // 页面参数
    uni.getStorageSync('USER_INFO')?.schoolID ||  // 本地缓存
    configInfo.DEFAULT_SCHOOL_ID ||            // 全局默认
    ''
  ).trim()

  if (!schoolID.value) throw new Error('缺少学校ID')

  // 写回 storage，确保后续接口请求能取到
  const currentUserInfo = uni.getStorageSync('USER_INFO') || {}
  uni.setStorageSync('USER_INFO', { ...currentUserInfo, schoolID: schoolID.value })
}
```

### 6.3 配置完整性校验

```js
const validateSchoolConfig = (config) => {
  if (config.dingtalkLoginApp !== 1) {
    throw new Error('当前学校未开启钉钉登录')
  }
  if (!config.dingtalkCorpID) {
    throw new Error('缺少钉钉 CorpID 配置')
  }
  if (!config.dingtalkClientID) {
    throw new Error('缺少钉钉 ClientID 配置')
  }
}
```

---

## 七、常见问题排查

### 问题 1：SDK 加载失败

排查顺序：
1. 是否在 H5 环境（小程序端没有 window）
2. CDN 地址是否可访问
3. 网络是否正常
4. 是否有 CSP 策略拦截

### 问题 2：dd.ready 超时

排查顺序：
1. SDK 是否真的加载成功（`window.dd` 是否存在）
2. 是否在钉钉容器内（UA 是否含 `DingTalk`）
3. 钉钉客户端版本是否过低

### 问题 3：requestAuthCode 报错

排查顺序：
1. `corpId` 是否正确（和钉钉后台的企业 ID 一致）
2. 应用是否已发布（未发布的应用配置不生效）
3. 是否在 `dd.ready` 中调用（在 ready 之前调用会报错）

### 问题 4：OAuth 回调后 state 校验失败

排查顺序：
1. 是否是历史残留参数（上次登录的 code/state 没有清理）
2. 是否在同一个浏览器 tab 里完成了授权
3. 本地存储是否被清空

### 问题 5：登录成功但进不了系统

排查顺序：
1. `USER_INFO_TOKEN` 是否正常写入
2. `USER_INFO.schoolID` 是否存在（请求层依赖这个字段）
3. 跳转的目标路由是否正确
4. 目标页面是否有权限校验拦截

---

## 八、最佳实践建议

### 8.1 SDK 懒加载，不全局初始化

不要在 `main.js` 里全局初始化钉钉 SDK，会影响微信端性能。按需懒加载，用单例 Promise 防止重复加载。

### 8.2 state 校验不能省略

OAuth 链路里，state 是防 CSRF 的关键保护，不能因为"测试时没问题"就删掉。

### 8.3 回调参数消费后立即清理

hash 路由下，回调参数会残留在地址栏，必须在消费后立即清理，避免下次误判。

### 8.4 会话落盘统一收口

不要在登录页里临时散写本地存储，统一走 `completeDingTalkLogin`，便于后续维护和账号类型扩展。

### 8.5 防御性校验不嫌多

虽然登录页入口已经判断过环境，登录页内部仍然建议再次确认，避免用户通过异常路由误入。

---

## 九、完整代码示例

### 9.1 JSAPI 免登页

```js
// dingTalkH5Login/index.vue
const startLogin = async () => {
  try {
    // 1. 确保有 schoolID
    ensureSchoolContext()

    // 2. 拉取学校钉钉配置
    await loadSchoolConfig()
    validateSchoolConfig()

    // 3. 二次确认在钉钉容器内
    if (!isDingTalkContainer()) {
      throw new Error('请在钉钉中打开')
    }

    // 4. JSAPI 静默获取授权码
    const authCode = await requestDingTalkAuthCode(schoolConfig.dingtalkCorpID)

    // 5. 发给后端换取业务 token
    const loginRes = await dingTalkH5Login({ authCode, schoolID })

    // 6. 统一落盘登录态
    await completeDingTalkLogin(loginRes)
  } catch (error) {
    showError(error.message)
  }
}
```

### 9.2 OAuth 登录页

```js
// dingTalkLogin/index.vue
const startLogin = async () => {
  try {
    ensureSchoolContext()
    await loadSchoolConfig()
    validateSchoolConfig()

    const callbackResult = await obtainOAuthCode()
    const code = callbackResult?.code || callbackResult?.authCode || ''

    if (!code) {
      // H5 端首次进入，页面已跳走，等回调
      return
    }

    // 发给后端换取业务 token
    const loginRes = await dingTalkOAuthLogin({ code, schoolID, clientType: 'APP' })
    await completeDingTalkLogin(loginRes)
  } catch (error) {
    clearDingTalkOAuthState()
    showError(error.message)
  }
}
```

---

## 十、总结

钉钉双链路登录的核心要点：

1. **入口分流**：根据 `isDingTalkContainer()` 判断走哪条路
2. **SDK 懒加载**：单例 Promise，防止重复加载
3. **dd.ready 等待**：必须等容器初始化完成，带超时保护
4. **state 防伪**：OAuth 链路必须校验 state，防 CSRF
5. **参数清理**：hash 路由下回调参数会残留，消费后立即清理
6. **会话统一**：两条路径最终都走同一套落盘逻辑
