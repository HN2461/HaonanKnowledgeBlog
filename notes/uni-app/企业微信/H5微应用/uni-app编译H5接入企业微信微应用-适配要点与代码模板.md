# uni-app编译H5接入企业微信微应用-适配要点与代码模板

> 参考钉钉文档：`docs/钉钉/03-H5微应用/01-知识文档/uni-app编译H5接入钉钉微应用-适配要点与代码模板.md`

---

## 1. 接入思路

uni-app 编译 H5 后，在企业微信内置浏览器中打开，通过 OAuth2 授权获取用户身份，再接入 JSSDK 调用企业微信 JS 能力。

**改动范围**：

- `main.js`：引入企业微信 JSSDK
- `App.vue`：登录入口，检测企业微信环境并触发授权
- `util/platform/wxwork.js`：企业微信平台工具函数
- `util/auth/wxworkLogin.js`：H5 登录逻辑
- `pages.json`：无需改动（H5 路由由 uni-app 管理）
- `manifest.json`：H5 相关配置

---

## 2. manifest.json 配置

```json
{
  "h5": {
    "title": "应用名称",
    "router": {
      "mode": "history",
      "base": "/"
    },
    "devServer": {
      "port": 8080,
      "disableHostCheck": true
    }
  }
}
```

> 注意：企业微信 H5 微应用建议使用 `history` 路由模式，避免 hash 模式下 URL 签名问题。

---

## 3. JSSDK 引入方式

**新版（推荐）**：

```javascript
// main.js
// #ifdef H5
import * as ww from "@wecom/jssdk";
window.ww = ww;
// #endif
```

或 CDN：

```html
<script src="https://wwcdn.weixin.qq.com/node/open/js/wecom-jssdk-2.3.4.js"></script>
```

**旧版（存量项目）**：

```javascript
// main.js，注意企业微信客户端用 1.2.0，不是 1.6.0
// #ifdef H5
import "@/static/js/jweixin-1.2.0.js";
import "@/static/js/jwxwork-1.0.0.js"; // 从 https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js 下载
// #endif
```

---

## 4. 目录结构建议

```
util/
├── platform/
│   └── wxwork.js          ← 企业微信平台工具（环境检测、JSSDK 初始化）
├── auth/
│   ├── wxworkLogin.js     ← H5 登录逻辑（OAuth2 授权）
│   └── wxworkOAuth.js     ← OAuth2 URL 构造
api/
└── wxwork.js            ← 企业微信相关接口
```

---

## 4. 核心代码模板

### 4.1 平台工具（util/platform/wxwork.js）

```javascript
/**
 * 企业微信平台工具函数
 */

/**
 * 检测是否在企业微信浏览器中
 */
export const isWxworkBrowser = () => {
  // #ifdef H5
  return /wxwork/i.test(navigator.userAgent);
  // #endif
  return false;
};

/**
 * 检测是否 iOS 设备
 */
export const isIOS = () => {
  return /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(navigator.userAgent);
};

/**
 * 获取当前页面 URL（用于签名，不含 # 及后面部分）
 * iOS SPA 问题：记录首次进入的 URL
 */
let _firstPageUrl = "";
export const getSignUrl = () => {
  // #ifdef H5
  if (!_firstPageUrl) {
    _firstPageUrl = window.location.href.split("#")[0];
  }
  return isIOS() ? _firstPageUrl : window.location.href.split("#")[0];
  // #endif
  return "";
};

/**
 * 初始化企业微信 JSSDK
 * @param {string[]} jsApiList - 需要使用的 JS 接口列表
 */
export const initWxworkSDK = async (jsApiList = []) => {
  // #ifdef H5
  if (!isWxworkBrowser()) return;

  const signUrl = getSignUrl();

  try {
    // 并行获取企业签名和应用签名
    const [wxRes, agentRes] = await Promise.all([
      uni.$uv.http.post("/api/wxwork/getWxConfig", {
        url: encodeURIComponent(signUrl),
      }),
      uni.$uv.http.post("/api/wxwork/getAgentConfig", {
        url: encodeURIComponent(signUrl),
      }),
    ]);

    const wxConfig = wxRes.data.data;
    const agentConfig = agentRes.data.data;

    await new Promise((resolve, reject) => {
      wx.config({
        beta: true,
        debug: false,
        appId: wxConfig.corpId,
        timestamp: wxConfig.timestamp,
        nonceStr: wxConfig.nonceStr,
        signature: wxConfig.signature,
        jsApiList: ["scanQRCode", "previewFile", "chooseImage", ...jsApiList],
      });

      wx.ready(() => {
        const ua = navigator.userAgent;
        const isAndroid = /Android|Linux/i.test(ua);

        const agentOptions = {
          corpid: agentConfig.corpId,
          agentid: agentConfig.agentId,
          timestamp: agentConfig.timestamp,
          nonceStr: agentConfig.nonceStr,
          signature: agentConfig.signature,
          jsApiList: [
            "selectEnterpriseContact",
            "openUserProfile",
            "previewFile",
          ],
        };

        if (isAndroid) {
          wx.invoke("agentConfig", agentOptions, (res) => {
            res.err_msg === "agentConfig:ok" ? resolve() : reject(res);
          });
        } else {
          wx.agentConfig({
            ...agentOptions,
            success: resolve,
            fail: reject,
          });
        }
      });

      wx.error(reject);
    });

    console.log("[wxwork] JSSDK 初始化成功");
  } catch (err) {
    console.error("[wxwork] JSSDK 初始化失败：", err);
  }
  // #endif
};
```

### 4.2 登录逻辑（util/auth/wxworkLogin.js）

```javascript
import { isWxworkBrowser } from "@/util/platform/wxwork.js";

// 从配置文件读取，避免硬编码
// 实际项目中从 configInfo/ 或环境变量读取
const getWxworkConfig = () => ({
  corpId:
    uni.getStorageSync("wxworkCorpId") || process.env.VUE_APP_WXWORK_CORP_ID,
  agentId:
    uni.getStorageSync("wxworkAgentId") || process.env.VUE_APP_WXWORK_AGENT_ID,
});

/**
 * 企业微信 H5 微应用登录入口
 * 在 App.vue onLaunch 中调用
 */
export const wxworkH5Login = async () => {
  // #ifdef H5
  if (!isWxworkBrowser()) {
    console.warn("[wxwork] 非企业微信浏览器，跳过登录");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    return await loginWithCode(code);
  } else {
    redirectToAuth();
  }
  // #endif
};

/**
 * 用 code 换取 token
 */
const loginWithCode = async (code) => {
  try {
    const res = await uni.$uv.http.post("/api/wxwork/h5Login", { code });
    if (res.data.code !== 200) {
      uni.showToast({ title: res.data.msg || "登录失败", icon: "error" });
      return;
    }

    const { token, userInfo } = res.data.data;
    uni.setStorageSync("token", token);
    uni.setStorageSync("userInfo", userInfo);

    // 清除 URL 中的 code 和 state 参数
    const cleanUrl = window.location.href
      .replace(/[?&]code=[^&]+/, "")
      .replace(/[?&]state=[^&]+/, "")
      .replace(/\?$/, "");
    window.history.replaceState({}, "", cleanUrl);

    return { token, userInfo };
  } catch (err) {
    console.error("[wxwork] code 换取 token 失败：", err);
    throw err;
  }
};

/**
 * 跳转企业微信 OAuth2 授权
 */
const redirectToAuth = () => {
  const { corpId, agentId } = getWxworkConfig();
  const redirectUri = encodeURIComponent(window.location.href);
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&agentid=${agentId}&state=wxwork#wechat_redirect`;
  window.location.href = authUrl;
};
```

### 4.3 API 接口（api/wxwork.js）

```javascript
import { uni } from "@/util/tools.js";

/**
 * 企业微信 H5 登录（code 换 token）
 */
export const wxworkH5LoginApi = (params, config = {}) =>
  uni.$uv.http.post("/api/wxwork/h5Login", params, config);

/**
 * 获取企业微信 wx.config 签名参数
 */
export const getWxConfigApi = (params, config = {}) =>
  uni.$uv.http.post("/api/wxwork/getWxConfig", params, config);

/**
 * 获取企业微信 agentConfig 签名参数
 */
export const getAgentConfigApi = (params, config = {}) =>
  uni.$uv.http.post("/api/wxwork/getAgentConfig", params, config);
```

### 4.4 App.vue 接入

```javascript
// App.vue
import { wxworkH5Login } from "@/util/auth/wxworkLogin.js";
import { initWxworkSDK } from "@/util/platform/wxwork.js";

export default {
  async onLaunch() {
    // #ifdef H5
    try {
      await wxworkH5Login();
      // 登录成功后初始化 JSSDK
      await initWxworkSDK();
    } catch (err) {
      console.error("[App] 企业微信初始化失败：", err);
    }
    // #endif
  },
};
```

---

## 5. 后端接口约定（前后端对接清单）

| 接口                         | 方法 | 说明                                   |
| ---------------------------- | ---- | -------------------------------------- |
| `/api/wxwork/h5Login`        | POST | code 换取 token，body: `{ code }`      |
| `/api/wxwork/getWxConfig`    | POST | 获取 wx.config 签名，body: `{ url }`   |
| `/api/wxwork/getAgentConfig` | POST | 获取 agentConfig 签名，body: `{ url }` |

**getWxConfig 返回格式**：

```json
{
  "code": 200,
  "data": {
    "corpId": "ww1234567890abcdef",
    "timestamp": 1714000000,
    "nonceStr": "Wm3WZYTPz0wzccnW",
    "signature": "0f9de62fce790f9a083d5c99e95740ceb90c27ed"
  }
}
```

**getAgentConfig 返回格式**：

```json
{
  "code": 200,
  "data": {
    "corpId": "ww1234567890abcdef",
    "agentId": "1000002",
    "timestamp": 1714000000,
    "nonceStr": "Wm3WZYTPz0wzccnW",
    "signature": "xxx"
  }
}
```

---

## 6. 适配要点汇总

| 要点             | 说明                                                           |
| ---------------- | -------------------------------------------------------------- |
| 路由模式         | 建议 `history` 模式，避免 hash 影响签名                        |
| iOS URL 问题     | 记录首次进入 URL，签名始终用这个 URL                           |
| JSSDK 引入       | 需要同时引入 `jweixin` 和 `jwxwork` 两个文件                   |
| agentConfig 顺序 | 必须在 `wx.ready` 回调内调用                                   |
| iOS/Android 差异 | iOS 用 `wx.agentConfig`，Android 用 `wx.invoke('agentConfig')` |
| code 一次性      | 获取后立即换取 token，换取成功后清除 URL 中的 code             |
| 可信域名         | 必须在管理后台配置，且与页面域名完全一致                       |
| 可信 IP          | 后端服务器 IP 必须在管理后台配置                               |
