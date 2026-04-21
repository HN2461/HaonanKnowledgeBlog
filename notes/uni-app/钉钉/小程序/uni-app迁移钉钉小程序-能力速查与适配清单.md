---
title: uni-app 迁移钉钉小程序：能力速查与适配清单
date: 2026-04-21
category: uni-app
tags:
  - uni-app
  - 钉钉小程序
  - 微信小程序
  - 项目迁移
  - 平台适配层
description: 面向已有 uni-app 微信小程序项目，逐类梳理哪些能力可以直接复用、哪些必须做钉钉专属适配、哪些不能机械替换，并给出每类的判断依据和代码示例。
---

# uni-app 迁移钉钉小程序：能力速查与适配清单

> 这篇文章解决一个很具体的问题：你手上有一个 uni-app 微信小程序项目，现在要迁到钉钉，不知道哪些代码能直接用、哪些要改、哪些根本不能机械替换。
>
> 不讲理论，直接给清单和判断依据。

---

## 一、结论先看

迁移前先建立一个认知：**迁移的核心难点不是页面，而是身份链路**。

大部分 uni-app 项目的请求层、上传层、路由、存储、提示反馈都已经用 `uni.*` 封装，这些天然跨端，迁钉钉时基本不用动。

真正需要改的只有两类：
1. **登录身份链路**：微信 `openid` → 钉钉 `authCode` + 企业组织身份
2. **微信专属字段扩散**：项目里直接读取 `wxopenid`、`WX_OPENID` 的地方

---

## 二、可以直接复用的能力

### 2.1 判断标准

一个能力能不能复用，看一条：**它依赖的是 `uni.*` 还是微信容器**。

依赖 `uni.*` 的 → 可以复用  
依赖 `wx.*` 或微信专属 API 的 → 需要处理

### 2.2 速查表

| 能力 | 典型写法 | 是否可复用 | 说明 |
|------|----------|-----------|------|
| 网络请求 | `uni.request` / `uni.$uv.http` | ✅ | 不依赖微信容器 |
| 页面跳转 | `uni.navigateTo` / `uni.reLaunch` | ✅ | 跨端通用 |
| 本地存储 | `uni.setStorageSync` / `uni.getStorageSync` | ✅ | 跨端通用 |
| 提示反馈 | `uni.showToast` / `uni.showModal` | ✅ | 跨端通用 |
| 图片上传 | `uni.uploadFile` | ✅ | 跨端通用 |
| 图片选择 | `uni.chooseImage` | ✅ | 跨端通用 |
| 图片预览 | `uni.previewImage` | ✅ | 跨端通用 |
| 文件下载 | `uni.downloadFile` | ✅ | 跨端通用 |
| 请求头注入（token + 租户ID） | 请求拦截器 | ✅ | 只要登录后能产出同类 token |
| WebSocket / 消息层 | 自研 WebSocket | ✅ | 只要登录后能产出同类业务身份 |
| 多租户上下文（schoolID） | 请求头 `schoolID` | ✅ | 继续保留，新增钉钉组织维度并存 |

### 2.3 请求层为什么可以复用

一个典型的可复用请求层长这样：

```js
// 请求拦截器
uni.$uv.http.interceptors.request.use(config => {
  const token = uni.getStorageSync('USER_INFO_TOKEN')
  const userInfo = uni.getStorageSync('USER_INFO') || {}
  const schoolID = userInfo.schoolID || configInfo.DEFAULT_SCHOOL_ID

  config.header.Authorization = token ? `Bearer ${token}` : undefined
  config.header.schoolID = schoolID
  return config
})
```

这里没有任何微信专属代码，只依赖本地缓存里的 `USER_INFO_TOKEN` 和 `USER_INFO.schoolID`。

**结论：只要钉钉登录后能把 token 和 schoolID 写入同样的缓存字段，请求层零改动。**

### 2.4 上传层为什么可以复用

```js
export const uploadImageFile = (filePath, schoolID) => {
  const token = uni.getStorageSync('USER_INFO_TOKEN')
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: configInfo.API_URL + '/basics/attachment/upload',
      filePath,
      name: 'file',
      header: {
        Authorization: token ? `Bearer ${token}` : '',
        schoolID: schoolID || configInfo.DEFAULT_SCHOOL_ID
      },
      // ...
    })
  })
}
```

同样，只依赖 token 和 schoolID，不依赖微信容器。

### 2.5 WebSocket 层为什么可以复用

WebSocket 连接时依赖的是：

```js
const userInfo = uni.getStorageSync('USER_INFO')
const token = uni.getStorageSync('USER_INFO_TOKEN')
const currentUser = uni.getStorageSync('currentUser')

// 用这三个字段建立连接
await connectionManager.connect(currentUser.id, currentUser, token, userInfo.schoolID)
```

没有微信专属依赖，只要钉钉登录后能产出同类业务身份，WebSocket 主链路可以直接复用。

---

## 三、必须做钉钉专属适配的能力

### 3.1 登录身份凭证

这是最核心的改造点。

| 对比项 | 微信 | 钉钉 |
|--------|------|------|
| 获取凭证 API | `wx.login()` → `res.code` | `dd.getAuthCode({ corpId })` → `res.authCode` |
| 用户标识 | `openid`（用户在当前小程序的唯一标识） | `userId`（用户在当前企业内的唯一标识） |
| 企业维度 | 无 | `corpId`（企业唯一标识，必须传） |
| 后端换取 | `code2Session` → `openid` | `authCode` → `userId` + `corpId` |

**改造方式：** 不要在业务页面里直接写平台判断，而是封装统一适配层：

```js
// util/platform/auth.js

// 钉钉小程序免登（在钉钉容器内）
export const requestDingTalkAuthCode = async (corpId) => {
  if (!corpId) throw new Error('缺少钉钉 CorpId')
  const ddInstance = await loadDingTalkJsApi()
  await waitForDingTalkReady(ddInstance)
  return new Promise((resolve, reject) => {
    ddInstance.runtime.permission.requestAuthCode({
      corpId,
      onSuccess: result => resolve(result?.code || result?.authCode || ''),
      onFail: error => reject(new Error(error?.errorMessage || '获取授权码失败'))
    })
  })
}
```

业务页面只调统一方法，不感知底层平台：

```js
// 登录页
const authCode = await requestDingTalkAuthCode(schoolConfig.dingtalkCorpID)
const result = await loginWithDingTalk({ authCode, schoolID })
```

### 3.2 平台环境识别

微信小程序里通常隐式依赖微信环境，迁钉钉后需要显式判断：

```js
// util/platform/runtime.js

// 获取 User-Agent（App端和H5端获取方式不同）
export const getRuntimeUserAgent = () => {
  // #ifdef APP-PLUS
  return plus?.navigator?.getUserAgent() || ''
  // #endif
  // #ifdef H5
  return window?.navigator?.userAgent || ''
  // #endif
  return ''
}

// 是否在钉钉容器内（钉钉内置浏览器 UA 含 "DingTalk"）
export const isDingTalkContainer = () =>
  /DingTalk/i.test(getRuntimeUserAgent())

// 是否在钉钉移动端（扫码等 JSAPI 仅移动端可用）
export const isDingTalkMobileContainer = () => {
  const ua = getRuntimeUserAgent()
  return /DingTalk/i.test(ua) && /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
}
```

### 3.3 组织选人、选部门

微信小程序里通常是自定义列表或业务接口，钉钉有原生的组织能力：

```js
// util/platform/picker.js
import complexPicker from 'dingtalk-jsapi/api/biz/contact/complexPicker'

export const pickOrgUsers = (options = {}) =>
  new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    complexPicker({
      title: options.title || '请选择人员',
      corpId: options.corpId,
      multiple: options.multiple ?? true,
      maxUsers: options.maxUsers ?? 100,
      pickedUsers: options.pickedUsers || [],
      pickedDepartments: options.pickedDepartments || [],
      disabledUsers: [],
      disabledDepartments: [],
      requiredUsers: [],
      requiredDepartments: [],
      permissionType: 'GLOBAL',
      responseUserOnly: false,
      startWithDepartmentId: 0,
      onSuccess: res => resolve(res),
      onFail: err => reject(err)
    })
    // #endif
  })
```

### 3.4 钉钉 SDK 初始化

微信小程序不需要额外初始化 SDK，钉钉需要。

**不推荐在 `main.js` 全局初始化**（会影响微信端性能），推荐按需懒加载：

```js
// util/platform/dingtalk.js
let ddLoadPromise = null

export const loadDingTalkJsApi = () => {
  if (window.dd?.runtime?.permission) return Promise.resolve(window.dd)
  if (ddLoadPromise) return ddLoadPromise

  ddLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://g.alicdn.com/dingding/dingtalk-jsapi/2.11.0/dingtalk.open.js'
    script.async = true
    script.onload = () => resolve(window.dd)
    script.onerror = () => {
      ddLoadPromise = null
      reject(new Error('钉钉 SDK 加载失败'))
    }
    document.head.appendChild(script)
  })

  return ddLoadPromise
}
```

---

## 四、不能机械替换的能力

这类能力在钉钉里没有直接对应的 API，需要重新设计业务方案。

### 4.1 微信手机号授权

**微信的做法：** `open-type="getPhoneNumber"` 按钮，用户点击后前端拿到加密手机号。

**钉钉没有这个能力。** 不要去找"钉钉版手机号按钮"，而是根据业务目的重新设计：

| 原来拿手机号的目的 | 钉钉里的替代方案 |
|------------------|----------------|
| 识别用户是谁 | 用钉钉组织身份（`userId` + `corpId`）识别，不需要手机号 |
| 注册或账号绑定 | 首次登录时引导用户手动填写手机号，或后端通过用户信息权限补齐 |
| 显示用户联系方式 | 申请 `Contact.User.mobile` 权限，通过后端接口获取 |

### 4.2 微信支付

**钉钉小程序没有和微信支付一比一对应的前端支付 API。**

不要先改代码，先开会确认：
1. 钉钉版本是否还需要支付功能
2. 支付对象是谁（个人用户 / 机构结算）
3. 是否改成外部 H5 收银台、线下收款或机构统一结算

### 4.3 微信订阅消息

微信订阅消息和钉钉消息体系是完全不同的两套机制。

| 微信 | 钉钉对应方案 |
|------|------------|
| 订阅消息（模板推送） | 工作通知（以应用名义推送给员工） |
| 群消息 | 企业群消息 / 群机器人消息 |
| 个人通知 | 单聊机器人消息 |
| 页面内提醒 | 页面红点 / 待办列表 / 站内消息中心 |

### 4.4 微信分享 / 开放数据组件

钉钉的社交语义和微信不同，不要默认兼容。逐项确认业务需求，再决定是否需要钉钉等价能力。

---

## 五、微信专属字段治理

### 5.1 找出所有扩散点

先搜索，再动手：

```bash
# 搜索微信专属字段
rg 'wxopenid|WX_OPENID|wxOpenID' src pages components

# 搜索微信登录相关
rg 'wx\.login|loginWithWeChatMini|ensureMiniOpenID|getOpenID' src pages components

# 搜索微信专属接口
rg 'LoginWeChat|getWeiXinCode|wxOpen' src api
```

### 5.2 常见扩散位置

| 位置 | 典型问题 | 处理方式 |
|------|----------|----------|
| 登录页 | `loginWithWeChatMini`、`ensureMiniOpenID`、`wxOpenID` 流程 | 改为统一 `platformAuth` 入口 |
| 登录接口 | `LoginWeChat`、`getWeiXinCode`、`wxOpen` 语义 | 后端新增钉钉身份接口，前端统一封装 |
| 个人资料页 | `wxopenid` 展示与微信绑定处理 | 拆分"微信绑定"和"主登录身份"语义 |
| 题库类组件 | 直接从缓存读取 `WX_OPENID` 作为答题标识 | 改为平台无关账号标识 |
| 业务申请页 | 直接读取 `USER_INFO.wxopenid` | 改为读取统一身份字段 |

### 5.3 治理策略：分两步走

**不要一次性全部删除**，先改写入，再迁移读取：

```js
// 第一步：登录成功后，改写入链路
// 旧写法
uni.setStorageSync('WX_OPENID', openid)

// 新写法：写入平台无关字段
uni.setStorageSync('USER_PLATFORM_ID', platformUserId)

// 第二步：业务页面改读取，过渡期保留兼容
const platformId = uni.getStorageSync('USER_PLATFORM_ID')
  || uni.getStorageSync('WX_OPENID')  // 兼容旧数据，迁移完成后删除
```

---

## 六、租户维度注意事项

如果你的项目已经有 `schoolID` 这类多租户维度，迁钉钉时要注意：

**`schoolID` 和 `corpId` 是并存关系，不是替代关系。**

- `schoolID`：你们系统里的业务租户 ID，继续保留
- `corpId`：钉钉里的企业组织 ID，新增

登录成功后同时保留两个维度：

```js
uni.setStorageSync('USER_INFO', {
  schoolID: 'school_001',    // 业务租户 ID，不变
  dingCorpId: 'ding_xxx',   // 钉钉组织 ID，新增
  dingUserId: 'user_xxx'    // 钉钉用户 ID，新增
})
```

---

## 七、推荐改造顺序

### 第一批：平台编译能力

1. `package.json` 接入 `mp-dingtalk` 自定义平台脚本
2. 验证首页在钉钉开发者工具里能打开

### 第二批：登录身份链路

1. 新建 `util/platform/runtime.js`、`util/platform/auth.js`、`util/platform/dingtalk.js`
2. 新建钉钉登录页（H5 免登 + OAuth 两条路径）
3. 后端提供钉钉身份换取接口
4. 验证登录成功，token 正常写入，接口请求正常

### 第三批：字段治理与组织能力

1. 全局搜索 `wxopenid`、`WX_OPENID`，逐步迁移
2. 新增 `util/platform/picker.js` 封装组织选人能力
3. 把微信入口、微信图标、微信绑定文案改为平台可配置

### 第四批：业务回归

1. 登录 → 路由 → 列表/详情 → 表单 → 上传 → WebSocket 消息
2. 手机钉钉和 PC 钉钉都测一遍

---

## 八、验收清单

**平台编译：**
- [ ] `package.json` 中 `mp-dingtalk` 配置正确
- [ ] 首页不白屏，静态资源正常

**登录链路：**
- [ ] 钉钉容器内 JSAPI 免登可以拿到 authCode
- [ ] OAuth 跳转回调可以拿到 code
- [ ] state 校验已实现，回调参数消费后已清理
- [ ] 登录成功后 `USER_INFO_TOKEN` 和 `USER_INFO.schoolID` 正常写入

**平台适配层：**
- [ ] 平台判断逻辑集中在 `util/platform/`，不散在业务页
- [ ] 钉钉 SDK 按需懒加载

**字段治理：**
- [ ] 业务页不再直接读取 `WX_OPENID` 缓存
- [ ] 接口请求头正常携带 token 和 schoolID

**业务回归：**
- [ ] 上传、WebSocket、列表、表单主链路正常
- [ ] 手机钉钉和 PC 钉钉都测过
