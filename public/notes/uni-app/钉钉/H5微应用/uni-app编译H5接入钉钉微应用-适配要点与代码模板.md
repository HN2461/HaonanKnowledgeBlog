# uni-app 编译 H5 接入钉钉微应用 - 适配要点与代码模板

> 本文专门面向"已有 uni-app 微信小程序项目，要编译成 H5 跑在钉钉微应用里"的场景。
> 基础流程见 [钉钉H5微应用-从0到1开发指南](./钉钉H5微应用-从0到1开发指南.md)，本文只讲 uni-app 特有的差异和坑。
>
> 说明：本文保留的是“通用模板”写法，适合新项目或 PoC 快速起步；**当前仓库的实际落地并不是** `util/platform/dingtalkH5.js + main.js + npm dingtalk-jsapi` 这套。
> 当前项目请优先对照以下真实代码入口：
>
> - `pages/login/index.vue`：登录页入口分流（钉钉内走 H5 免登，钉钉外走 OAuth）
> - `secondary/dingTalkH5Login/index.vue`：钉钉容器内 H5 免登页
> - `secondary/dingTalkLogin/index.vue`：普通 H5 / App 原生端 OAuth 登录页
> - `api/dingtalk.js`：钉钉 JSAPI 鉴权接口封装
> - `util/platform/dingtalk.js`：动态加载 JSAPI SDK、`dd.ready`、通用业务 JSAPI 鉴权
> - `util/platform/scan.js`：统一扫码入口，钉钉原生扫码和 `uni.scanCode` 降级
> - `util/platform/auth.js`：OAuth URL 拼装、授权码提取、登录专用免登能力
> - `util/platform/runtime.js`：运行时与钉钉容器判断
> - `util/auth/dingtalkLogin.js`：登录成功后的统一会话落盘
>
> 排查当前仓库问题时，请以这些文件和《[研究-钉钉微应用登录-项目实现核验结论](./研究-钉钉微应用登录-项目实现核验结论.md)》为准，不要直接按本文模板假设项目已安装 `dingtalk-jsapi` 依赖。

---

## 一、结论先看

uni-app 编译 H5 接入钉钉微应用是**可行的**，但有几个关键点必须处理：

1. 钉钉 JSAPI SDK 只能在 H5 端加载，必须用条件编译或运行时判断隔离
2. H5 端的 tabBar、导航栏是 div 模拟的，高度计算和小程序不同
3. `rpx` 在 H5 端会转成 `vw`，整体没问题，但部分动态计算场景需注意
4. H5 端存在跨域问题，小程序端没有，需要 Nginx 代理或后端配置 CORS
5. 登录场景下 `requestAuthCode` / `getAuthCode` 不需要先 `dd.config`，但仍建议放在 `dd.ready` 里调用；通讯录、分享等其他 JSAPI 仍要先 `dd.config`

---

## 二、dingtalk-jsapi 的正确引入方式

### 2.1 安装

```bash
npm install dingtalk-jsapi --save
```

### 2.2 只在 H5 端引入（条件编译）

`dingtalk-jsapi` 只能在浏览器环境运行，不能在小程序端引入，否则编译报错。

```js
// util/platform/dingtalkH5.js

// #ifdef H5
import * as dd from 'dingtalk-jsapi/entry/union'
import requestAuthCode from 'dingtalk-jsapi/api/runtime/permission/requestAuthCode'
// #endif
```

> `entry/union` 是按需引入入口，比直接 `import 'dingtalk-jsapi'` 体积小很多，推荐用这个。

### 2.3 在 main.js 里初始化（H5 端）

```js
// main.js
// #ifdef H5
import 'dingtalk-jsapi/entry/union'
// #endif
```

---

## 三、完整的钉钉 H5 平台工具模块

新建 `util/platform/dingtalkH5.js`，把所有钉钉 H5 相关能力收口到这里：

```js
// util/platform/dingtalkH5.js
// 钉钉 H5 微应用平台能力封装
// 只在 H5 端使用，其他端不引入此文件

// #ifdef H5
import * as dd from 'dingtalk-jsapi/entry/union'
import requestAuthCode from 'dingtalk-jsapi/api/runtime/permission/requestAuthCode'

/**
 * 判断当前是否在钉钉环境
 */
export function isDingtalk() {
  return navigator.userAgent.toLowerCase().includes('dingtalk')
}

/**
 * 通用业务 JSAPI 鉴权
 * 只在你后续还要调用通讯录、分享、选人等需签名接口时使用。
 * 如果当前目标只是微应用免登，可直接跳过此步骤。
 * 调用时机：应用启动时调用一次（hash 路由），或每次路由变化时调用（history 路由）
 * @param {string} corpId - 企业 corpId
 */
export async function initDDConfig(corpId) {
  // hash 路由取 # 前面的部分，history 路由取完整 URL
  const url = location.href.split('#')[0]

  try {
    // 调用后端鉴权配置接口
    const res = await uni.$uv.http.get('/register/dingtalk/jsapi-config', {
      params: { url, corpId }
    })
    const { agentId, timeStamp, nonceStr, signature } = res.data.data

    await new Promise((resolve, reject) => {
      dd.config({
        agentId,    // 必填，微应用 ID（agentId）
        corpId,     // 必填，企业 ID
        timeStamp,  // 必填，生成签名的时间戳
        nonceStr,   // 必填，生成签名的随机串
        signature,  // 必填，签名
        type: 0,    // 0 表示微应用，1 表示钉钉工作台
        jsApiList: [
          'runtime.info',
          'biz.contact.choose',
          'device.notification.confirm',
          'device.notification.alert',
          'device.notification.prompt',
          'biz.util.openLink',
          'biz.util.previewImage',
        ]
      })

      dd.ready(resolve)
      dd.error(reject)
    })

    console.log('[钉钉H5] JSAPI 鉴权成功')
    return true
  } catch (err) {
    console.error('[钉钉H5] JSAPI 鉴权失败', err)
    return false
  }
}

/**
 * 获取免登授权码
 * 官方说明：requestAuthCode / getAuthCode 不需要先 dd.config，
 * 但仍应在 dd.ready 中调用，确保钉钉容器初始化完成。
 * @param {string} corpId - 企业 corpId
 */
export async function getAuthCode(corpId) {
  await new Promise((resolve, reject) => {
    dd.ready(resolve)
    dd.error(reject)
  })

  return new Promise((resolve, reject) => {
    requestAuthCode({
      corpId,
      onSuccess: (info) => resolve(info.code || info.authCode),
      onFail: (err) => reject(err)
    })
  })
}

/**
 * 钉钉 H5 完整登录流程
 * @param {string} corpId - 企业 corpId
 */
export async function loginWithDingtalkH5(corpId) {
  // 1. 获取免登码（登录场景不必先 initDDConfig）
  const authCode = await getAuthCode(corpId)

  // 2. 发给后端换系统 token
  const res = await uni.$uv.http.post('/api/auth/dingtalk-login', {
    authCode,
    corpId
  })

  if (res.data.code !== 200) {
    uni.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
    return null
  }

  // 3. 写入本地存储（和微信登录保持一致的字段）
  const { token, userInfo } = res.data.data
  uni.setStorageSync('USER_INFO_TOKEN', token)
  uni.setStorageSync('USER_INFO', userInfo)

  return userInfo
}
// #endif
```

---

## 四、登录页改造（条件编译隔离）

在 `pages/login/index.vue` 里，用条件编译区分微信和钉钉 H5 登录入口：

```vue
<template>
  <view>
    <!-- 账号密码登录（通用，不需要条件编译） -->
    <view class="login-form">
      <!-- ... 原有表单 ... -->
    </view>

    <!-- 微信快捷登录（只在微信小程序端显示） -->
    <!-- #ifdef MP-WEIXIN -->
    <button @click="handleWechatLogin">微信一键登录</button>
    <!-- #endif -->

    <!-- 钉钉 H5 自动登录提示（只在 H5 端显示） -->
    <!-- #ifdef H5 -->
    <view v-if="isDingtalkEnv" class="dd-login-tip">
      检测到钉钉环境，正在自动登录...
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// #ifdef H5
import { isDingtalk, loginWithDingtalkH5 } from '@/util/platform/dingtalkH5.js'
// #endif

const isDingtalkEnv = ref(false)

onMounted(async () => {
  // #ifdef H5
  if (isDingtalk()) {
    isDingtalkEnv.value = true
    // 自动触发钉钉登录
    const corpId = 'your-corpId' // 从配置或后端获取
    const userInfo = await loginWithDingtalkH5(corpId)
    if (userInfo) {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
  // #endif
})
</script>
```

---

## 五、uni-app H5 编译的关键差异点

### 5.1 tabBar 和导航栏高度

H5 端的 tabBar 和导航栏是 div 模拟的，不是原生控件。

影响：
- `100vh` 包含了导航栏高度，直接用 `100vh` 会导致内容被遮挡
- 底部悬浮元素如果用 `bottom: 0`，会和 tabBar 重叠

解决方案：用 uni-app 提供的 CSS 变量：

```css
/* 内容区域顶部距离（导航栏高度） */
padding-top: var(--window-top);

/* 内容区域底部距离（tabBar 高度） */
padding-bottom: var(--window-bottom);

/* 正确的全屏高度 */
height: calc(100vh - var(--window-top) - var(--window-bottom));
```

### 5.2 rpx 在 H5 端的表现

uni-app H5 端会把 `rpx` 转成 `vw`（基于 750px 设计稿），整体没问题。

注意点：
- 动态设置 `style` 时，如果用 JS 计算 `rpx` 值，H5 端不会自动转换，需要手动换算
- 换算公式：`px = rpx / 750 * 100vw`，或者用 `uni.upx2px(rpx值)` 转换

```js
// 正确：用 uni.upx2px 转换
const heightPx = uni.upx2px(200) // 200rpx 转成 px

// 错误：直接拼 rpx 字符串给 style
// style="height: 200rpx"  ← H5 端不生效
```

### 5.3 跨域问题

小程序端没有跨域限制，H5 端有。

解决方案一：Nginx 反向代理（推荐生产环境）

```nginx
location /api/ {
    proxy_pass http://your-backend-server/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

解决方案二：开发阶段用 uni-app devServer 代理

在 `manifest.json` 里配置：

```json
"h5": {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "https://your-backend-server.com",
        "changeOrigin": true,
        "pathRewrite": { "^/api": "" }
      }
    }
  }
}
```

### 5.4 H5 端不支持的 API

以下 API 在 H5 端不可用，需要条件编译处理：

| 不可用 API | H5 替代方案 |
|---|---|
| `uni.scanCode` | 无原生替代，可用第三方 JS 扫码库 |
| `uni.makePhoneCall` | `location.href = 'tel:xxx'` |
| `uni.openDocument` | `window.open(url)` |
| `uni.vibrateLong` / `uni.vibrateShort` | 无替代 |
| `uni.getNetworkType` | `navigator.onLine` |

### 5.5 页面生命周期差异

H5 端组件内不支持 `onLoad`、`onShow` 等页面生命周期，需要用 Vue 的生命周期替代：

```js
// 小程序端可以用
onLoad(() => { ... })
onShow(() => { ... })

// H5 端组件内要改成
onMounted(() => { ... })
// onShow 的等价处理需要用路由守卫或 visibilitychange 事件
```

---

## 六、manifest.json H5 相关配置

```json
{
  "h5": {
    "title": "校园管理系统",
    "router": {
      "mode": "hash"
    },
    "devServer": {
      "port": 8080,
      "disableHostCheck": true,
      "proxy": {
        "/api": {
          "target": "https://your-backend.com",
          "changeOrigin": true
        }
      }
    },
    "publicPath": "/"
  }
}
```

---

## 七、调试方法

### 7.1 本地开发调试

钉钉 H5 微应用必须在钉钉环境里才能调用 JSAPI，本地调试有两种方式：

**方式一：内网穿透（推荐）**

用 ngrok 或 frp 把本地开发服务器暴露到公网，然后在钉钉开放平台配置这个临时域名。

```bash
# 用 ngrok 暴露本地 8080 端口
ngrok http 8080
# 得到类似 https://xxxx.ngrok.io 的地址
# 把这个地址配到钉钉开放平台的「应用首页地址」
```

**方式二：直接部署测试环境**

每次改完代码，编译 H5 产物，上传到测试服务器，用手机钉钉扫码访问。

### 7.2 钉钉调试工具

- 手机钉钉：在应用里打开，摇一摇可以唤出调试面板（部分版本支持）
- PC 钉钉：F12 开发者工具可以直接用
- 钉钉开发者工具：下载地址见官方文档，支持模拟器调试

### 7.3 非钉钉环境的降级处理

开发阶段在普通浏览器里调试时，`isDingtalk()` 返回 false，可以跳过钉钉登录，直接走账号密码登录：

```js
onMounted(async () => {
  // #ifdef H5
  if (isDingtalk()) {
    // 钉钉环境：自动免登
    await loginWithDingtalkH5(corpId)
  } else {
    // 非钉钉环境（普通浏览器）：显示账号密码登录表单
    console.log('[开发调试] 非钉钉环境，跳过自动登录')
  }
  // #endif
})
```

---

## 八、当前仓库的实际落地范围

| 文件 | 改动内容 | 影响范围 |
|---|---|---|
| `pages/login/index.vue` | 新增钉钉登录按钮与 H5 入口分流 | H5 / App 登录入口 |
| `secondary/dingTalkH5Login/index.vue` | 钉钉容器内调用 `requestAuthCode` 静默免登 | 仅钉钉 H5 微应用 |
| `secondary/dingTalkLogin/index.vue` | 普通 H5 / App 走 OAuth 回调登录 | 普通浏览器 H5 + App 原生端 |
| `api/dingtalk.js` | 钉钉 JSAPI 签名接口封装 | 钉钉平台接口层 |
| `util/platform/dingtalk.js` | 动态加载 SDK、`dd.ready`、通用 JSAPI 鉴权 | 钉钉公共平台层 |
| `util/platform/scan.js` | 统一扫码入口，内部切换钉钉原生扫码 / `uni.scanCode` | 钉钉扫码能力层 |
| `util/platform/auth.js` | OAuth / 免登登录专用能力 | 登录平台层 |
| `util/platform/runtime.js` | 运行时判断与钉钉容器识别 | 登录分流层 |
| `util/auth/dingtalkLogin.js` | 统一写入 token、用户信息、问候语并派发会话就绪事件 | 会话落盘层 |

当前仓库**没有**新增 `dingtalk-jsapi` npm 依赖，也**没有**通过 `main.js` 预先初始化钉钉 SDK；而是由 `util/platform/dingtalk.js` 在 H5 端按需动态加载 CDN 脚本。

微信小程序端代码仍然不需要整体迁移，现有实现通过条件编译和运行时判断，把钉钉能力隔离在登录链路内。

---

## 九、验收清单

- [ ] 钉钉开放平台应用已创建并发布
- [ ] 可信域名已配置（包含前端域名和接口域名）
- [ ] H5 产物已部署，HTTPS 可访问
- [ ] 在手机钉钉里打开应用，首页不白屏
- [ ] `dd.ready` 已正常触发（登录场景不必先 `dd.config`）
- [ ] `requestAuthCode` / `getAuthCode` 能拿到 `authCode`
- [ ] `authCode` 发给后端后能换回系统 token
- [ ] `USER_INFO_TOKEN`、`USER_INFO` 正常写入
- [ ] 请求头携带 token 正常，接口返回正常
- [ ] 微信小程序端功能不受影响
