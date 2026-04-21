# 钉钉 H5 微应用 — 扫一扫 JSAPI 前后端对接清单

> 场景：uni-app 编译为 H5 嵌入钉钉微应用，需要调起钉钉原生扫码界面，替代微信小程序的 `uni.scanCode`。
>
> 当前仓库实际落地请优先对照：
>
> - `api/dingtalk.js`
> - `util/platform/dingtalk.js`
> - `util/platform/scan.js`
> - `util/platform/runtime.js`
> - `pages/space/space.vue`
> - `guardStudentAccessSchool/history/index.vue`
> - `generalTwo/visitorManagement/index.vue`

---

## 一、结论速查

| 项目               | 结论                                         |
| ------------------ | -------------------------------------------- |
| 钉钉是否支持扫一扫 | ✅ 支持，JSAPI 为 `dd.biz.util.scan`         |
| 是否需要鉴权       | ✅ 需要，调用前必须完成 `dd.config` 签名鉴权 |
| 鉴权签名由谁生成   | 后端（需要 jsapi_ticket）                    |
| 前端需要什么       | 后端返回的签名四元组 + 钉钉 JSAPI SDK        |
| PC 端是否支持      | ❌ 不支持，仅移动端可用                      |

---

## 二、整体流程

```
前端进入页面
    │
    ▼
前端请求后端：GET /register/dingtalk/jsapi-config?url=当前页面URL
    │
    ▼
后端返回：{ agentId, corpId, timeStamp, nonceStr, signature }
    │
    ▼
前端调用 dd.config(...)
    │
    ▼
dd.ready(() => { dd.biz.util.scan(...) })
    │
    ▼
用户扫码，前端拿到 result.text（二维码内容字符串）
    │
    ▼
走原有业务逻辑（会议签到 / 进出校 / PC登录 等）
```

---

## 三、前端要做的事

### 3.1 引入钉钉 JSAPI SDK

当前仓库不是在 `index.html` 或 `main.js` 里全局注入钉钉 SDK，而是由 `util/platform/dingtalk.js` 在 H5 端按需动态加载 CDN 脚本。

如果你是新项目或 PoC，也可以用下面这两种通用方式接入：

在 `index.html`（H5 入口）的 `<head>` 里加载：

```html
<script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.3.0/dingtalk.open.js"></script>
```

或者 npm 方式：

```bash
npm install dingtalk-jsapi
```

```js
import * as dd from "dingtalk-jsapi";
```

### 3.2 页面初始化时完成 dd.config 鉴权

当前仓库对业务页不直接暴露 `dd.config`，而是统一收口到 `ensureDingTalkJsapiConfig` / `scanCodeCompat`。

如果你只是排查当前仓库，优先看下面这条真实调用链：

```js
import { scanCodeCompat } from '@/util/platform/scan.js'

const openCamera = async () => {
  const scanResult = await scanCodeCompat({ type: 'all' })
  if (scanResult.cancelled) return
  handleScanResult(scanResult.text)
}
```

其中 `scanCodeCompat` 在钉钉移动端 H5 内部会自动：

1. 调 `api/dingtalk.js` 的 `getDingTalkJsapiConfig`
2. 调 `util/platform/dingtalk.js` 的 `ensureDingTalkJsapiConfig`
3. 再执行 `dd.biz.util.scan`

如果你是做通用接入模板，也可以在 `onMounted` 或 `onShow` 里，请求后端拿签名，然后手工调用 `dd.config`：

```js
import { getDingTalkJsapiConfig } from "@/api/dingtalk"; // 后端接口，见第四节

const initDdConfig = async () => {
  // 当前页面完整 URL（不含 hash）
  const currentUrl = location.href.split("#")[0];

  const { data } = await getDingTalkJsapiConfig({ url: currentUrl });

  dd.config({
    agentId: data.agentId, // 微应用 ID
    corpId: data.corpId, // 企业 ID
    timeStamp: data.timeStamp, // 时间戳（字符串）
    nonceStr: data.nonceStr, // 随机字符串
    signature: data.signature, // 签名
    type: 0,
    jsApiList: ["biz.util.scan"], // 声明要用的 JSAPI，不带 dd. 前缀
  });
};
```

### 3.3 调用扫一扫

```js
/**
 * 钉钉微应用扫一扫
 * 说明：替代微信小程序的 uni.scanCode，仅在钉钉 H5 环境下调用。
 */
const openDdScan = () => {
  dd.ready(() => {
    dd.biz.util.scan({
      type: "all", // 'qrCode' | 'barCode' | 'all'
      onSuccess(result) {
        // result.text 即二维码内容，与 uni.scanCode 的 message.result 等价
        handleScanResult(result.text);
      },
      onFail(err) {
        // 用户主动取消时 errorCode 为 'cancel'，不弹错误提示
        if (err?.errorCode === "cancel") return;
        uni.showToast({ title: "扫码失败，请重试", icon: "none" });
      },
    });
  });
};
```

### 3.4 环境判断（钉钉 vs 微信小程序）

```js
/**
 * 判断当前是否在钉钉 App 内
 */
const isDingTalk = () => /dingtalk/i.test(navigator.userAgent)

/**
 * 统一扫码入口，自动区分平台
 */
const openCamera = () => {
  if (isDingTalk()) {
    openDdScan()
  } else {
    // 原有微信小程序逻辑保持不变
    uni.scanCode({ ... })
  }
}
```

当前仓库进一步细分了：

- `isDingTalkContainer()`：是否在钉钉容器里
- `isDingTalkMobileContainer()`：是否在钉钉移动端容器里
- `isDingTalkPcContainer()`：是否在钉钉 PC 容器里

其中扫码只允许移动端钉钉 H5 走原生 JSAPI，PC 钉钉会直接提示当前环境不支持扫码。

---

## 四、后端要做的事

> 以下内容提供给后端同学，前端只需知道"调哪个接口、拿什么字段"即可。

### 4.1 需要提供的接口

```
GET /register/dingtalk/jsapi-config
参数：url（当前页面完整 URL，不含 hash）
返回：
{
  "code": 200,
  "data": {
    "agentId": "xxx",
    "corpId": "dingxxxxxxxx",
    "timeStamp": "1712345678",
    "nonceStr": "abc123xyz",
    "signature": "xxxxxxxxxxxxxxxx"
  }
}
```

### 4.2 后端签名生成步骤

1. 用 `corpId` + `appKey` + `appSecret` 换取 `access_token`
   - 接口：`POST https://api.dingtalk.com/v1.0/oauth2/accessToken`

2. 用 `access_token` 换取 `jsapi_ticket`
   - 接口：`GET https://oapi.dingtalk.com/get_jsapi_ticket?access_token=xxx`
   - ticket 有效期 7200 秒，**必须缓存，不能每次都请求**

3. 用以下四个字段拼接字符串，SHA-1 签名：

   ```
   jsapi_ticket=xxx&noncestr=xxx&timestamp=xxx&url=xxx
   ```

   - 字段按字母序排列（jsapi_ticket → noncestr → timestamp → url）
   - url 必须与前端传来的完全一致（含路径、query，不含 hash）

4. 将 `agentId`、`corpId`、`timeStamp`、`nonceStr`、`signature` 返回给前端

### 4.3 注意事项（后端）

- `jsapi_ticket` 必须服务端缓存（Redis 或内存），不能每次调接口获取，否则会触发频率限制
- `url` 参数要做 URL decode 后再参与签名，避免编码不一致导致签名失败
- 多学校部署时，每个学校的 `appKey` / `appSecret` / `agentId` 不同，需按 `corpId` 路由到对应配置

---

## 五、前端接口封装示例

在 `api/dingtalk.js` 里新增：

```js
/**
 * 获取钉钉 JSAPI 鉴权配置
 * 说明：当前后端固定对接 Register 模块签名接口
 * @param {Object} params - 查询参数
 * @param {string} params.url - 当前页面完整 URL（不含 hash）
 * @param {string} [params.corpId] - 钉钉企业 CorpId，可选
 * @param {Object} config - uView 请求配置
 */
export const getDingTalkJsapiConfig = (params = {}, config = {}) =>
  uni.$uv.http.get('/register/dingtalk/jsapi-config', {
    ...config,
    params,
  })
```

当前仓库请求头里的 `schoolID` 由请求拦截器统一注入，一般不需要在业务页单独再传。

### 5.1 当前仓库实际落地点

本次扫码治理后的前端入口如下：

- 平台接口：`api/dingtalk.js`
- JSAPI 公共能力：`util/platform/dingtalk.js`
- 统一扫码入口：`util/platform/scan.js`
- 运行时判断：`util/platform/runtime.js`

第一批已接入页面：

- `pages/space/space.vue`
- `guardStudentAccessSchool/history/index.vue`
- `generalTwo/visitorManagement/index.vue`
- `general/office/meetingManagement/meetingCheck/index.vue`
- `teacherApp/issuanceSupplies/home/index.vue`
- `teacherApp/propertyManage/myProperty/index.vue`
- `teacherApp/moralEducationManagement/management/management.vue`

---

## 六、常见问题

| 问题                   | 原因                     | 解决                                                           |
| ---------------------- | ------------------------ | -------------------------------------------------------------- |
| `dd is not defined`    | SDK 未加载或加载时机太早 | 确认 `index.html` 里 script 标签已加入，或 npm 包已正确 import |
| 签名校验失败           | url 不一致 / ticket 过期 | 检查前端传的 url 是否含 hash；检查后端 ticket 缓存是否失效     |
| `biz.util.scan` 未授权 | `jsApiList` 里没有声明   | `dd.config` 的 `jsApiList` 加上 `'biz.util.scan'`              |
| PC 端点击无反应        | PC 钉钉不支持扫码        | 加 UA 判断，PC 端隐藏或禁用扫码入口                            |
| 用户取消扫码也弹错误   | 未过滤 cancel            | `onFail` 里判断 `err.errorCode === 'cancel'` 直接 return       |
