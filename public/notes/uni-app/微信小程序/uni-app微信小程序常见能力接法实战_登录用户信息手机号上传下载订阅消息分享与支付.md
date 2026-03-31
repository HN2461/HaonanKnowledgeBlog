---
title: uni-app 微信小程序常见能力接法实战：登录、用户信息、手机号、上传下载、订阅消息、分享与支付
date: 2026-03-31
category: uni-app
tags:
  - uni-app
  - 微信小程序
  - 登录
  - 订阅消息
  - 支付
description: 面向长期维护公司 uni-app 项目的开发者，梳理微信小程序里最常见的能力接法，讲清登录、头像昵称、手机号、上传下载、订阅消息、分享与支付的稳妥实践。
---

# uni-app 微信小程序常见能力接法实战：登录、用户信息、手机号、上传下载、订阅消息、分享与支付

> 这是这一组 `uni-app 微信小程序` 笔记的第 3 篇。  
> 截至 `2026-03-31`，我继续对照 `uni-app` 官方文档、微信开放文档和微信支付商户文档，把“能力到底怎么接”这一层单独拆出来讲。  
> 如果前两篇解决的是“它是怎么跑的”和“工程应该怎么组织”，那这一篇要解决的是：`公司里的 uni-app 项目，做微信小程序时，最常见的能力到底应该怎么接才稳。`

## 一、先说结论：能力接入先分 3 类，不要一上来就到处写 `wx.*`

很多人接手公司项目后，看到是微信小程序，就会本能地直接写：

- `wx.login`
- `wx.requestSubscribeMessage`
- `wx.requestPayment`
- `wx.chooseMessageFile`

这么写不是绝对错，但长期维护时很容易把跨端能力、微信专属能力、页面协议能力混在一起。

更稳的做法是先分 3 类：

| 能力类型 | 典型能力 | 建议接法 |
| --- | --- | --- |
| `uni-app` 已封装能力 | 登录、上传、下载 | 优先 `uni.*` |
| 微信页面/组件协议能力 | 头像昵称、手机号、页面分享 | 按微信规定的页面生命周期或组件 `open-type` 来接 |
| 微信专属开放能力 | 订阅消息、部分支付细节、部分专属文件能力 | `#ifdef MP-WEIXIN` 中使用 `wx.*` 收口 |

所以这一篇你可以先记住一句话：

`能用 uni 就先用 uni，只有当能力本身就是微信专属协议时，才退到 wx，并且一定用条件编译把边界收住。`

## 二、做公司项目时，我更建议你遵守这 4 条总原则

### 1. 微信登录态，不等于你的业务登录态

`uni.login` 或 `wx.login` 拿到的只是微信登录凭证，不是你业务系统最终可用的 token。

### 2. 从当前官方口径看，已经不适合再把“拉完整 userInfo”当成新项目主路径

截至 `2026-03-31`，微信开放文档关于这块更强调的是“头像昵称填写”能力，也就是：

- 头像用 `button open-type="chooseAvatar"`
- 昵称用 `input type="nickname"`

`uni-app` 文档里仍然保留了 `uni.getUserInfo`、`uni.getUserProfile`，但如果你是做新项目，或者在改老项目，我更建议你优先按微信当前推荐能力来设计流程。

这里我是在综合 `uni-app` 文档和微信现行开放能力文档后做的实战判断。

### 3. 只要能力背后依赖用户点击、弹窗授权、平台安全校验，就不要做成“页面一打开自动跑”

像下面这些能力，都不适合在 `onLoad` 里自动乱调：

- 手机号
- 订阅消息
- 支付
- 分享

### 4. 业务页不要自己散着拼能力细节，最好统一收口成 service

比如：

- `loginByWechatMiniProgram`
- `bindPhoneByWechat`
- `uploadCommonFile`
- `requestWechatSubscribe`
- `payByWechatMiniProgram`

这样以后你改平台规则，只需要改一层，不用全项目到处翻。

## 三、登录：项目里最容易搞错的，不是怎么拿 `code`，而是怎么理解 `code`

微信官方文档明确写了两件事：

1. `wx.login` 返回的 `code` 有效期是 `5 分钟`
2. 后端要用这个 `code` 调 `code2Session`，换 `openid`、`unionid`、`session_key`

而 `uni-app` 文档也明确保留了 `uni.login`、`uni.checkSession` 这套封装。

所以在 `uni-app` 微信小程序里，比较稳的写法是：

1. 前端先 `uni.login`
2. 拿到 `code` 立刻发后端
3. 后端完成 `code2Session`
4. 后端再结合你自己的账号体系，发业务 token 给前端

代码骨架可以这样写：

```js
export function loginByWechatMiniProgram() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        if (!loginRes.code) {
          reject(new Error('微信登录未拿到 code'))
          return
        }

        try {
          const { data } = await uni.request({
            url: 'https://api.example.com/auth/wechat-mini/login',
            method: 'POST',
            data: {
              code: loginRes.code
            }
          })

          uni.setStorageSync('token', data.token)
          uni.setStorageSync('userInfo', data.userInfo)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: reject
    })
  })
}
```

这里最容易踩的坑有 4 个：

1. 不要把微信返回的 `code` 存很久再用，它只有 `5 分钟`
2. 不要让前端自己把 `openid` 当最终登录结果，真正的登录态应该由你后端签发
3. `uni.checkSession` 检查的是微信登录态是否过期，不是你业务 token 是否过期
4. 你的业务 token 失效时，不一定等于微信 session 也失效了，这两套状态不要混成一套

如果你项目里有“静默登录 + token 续期”逻辑，建议拆成两层：

- 微信层：`code / session_key / checkSession`
- 业务层：`token / refreshToken / 登录用户信息`

这样后面排错不会乱。

## 四、用户信息：新项目别再把“直接拿完整头像昵称”当默认主路径

`uni-app` 文档里仍然有：

- `uni.getUserInfo`
- `uni.getUserProfile`

而且文档也提醒了，微信基础库 `2.10.4` 之后，`uni.getUserInfo` 获取的 `userInfo` 是匿名数据，建议使用 `uni.getUserProfile`。

但如果你把视角切到微信官方现行文档，会发现当前更强调的是“头像昵称填写”：

- 基础库 `2.21.2+` 支持
- 头像用 `chooseAvatar`
- 昵称用 `type="nickname"`
- 基础库 `2.24.4+` 起接入内容安全检测
- 开发者工具与真机表现可能不完全一致

所以我更建议这样理解：

`uni.getUserInfo / uni.getUserProfile` 你要认识，但做新项目或改造老项目时，头像昵称这一段最好优先跟着微信当前的组件式能力走。

更稳的页面写法示意：

```vue
<template>
  <view class="profile-form">
    <!-- #ifdef MP-WEIXIN -->
    <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
      <image class="avatar" :src="form.avatarUrl || defaultAvatar" mode="aspectFill" />
    </button>

    <input
      class="nickname-input"
      type="nickname"
      :value="form.nickName"
      placeholder="请输入昵称"
      @blur="onNicknameBlur"
    />
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      defaultAvatar: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
      form: {
        avatarUrl: '',
        nickName: ''
      }
    }
  },
  methods: {
    onChooseAvatar(e) {
      this.form.avatarUrl = e.detail.avatarUrl || ''
    },
    onNicknameBlur(e) {
      this.form.nickName = (e.detail.value || '').trim()
    }
  }
}
</script>
```

你在项目里真正该做的是：

1. 前端拿头像临时路径和昵称输入值
2. 前端把资料提交到后端
3. 后端再决定是否落库、是否再做一层风控或审核

这里也有 3 个常见误区：

1. 误以为开发者工具表现就等于真机表现，实际上微信文档明确提醒这里可能不完全一致
2. 误以为头像和昵称只要拿到就一定可靠，实际上微信已经把内容安全校验接进流程
3. 误以为用户资料逻辑和登录逻辑必须绑死，其实很多项目更适合拆成“先登录，后补资料”

## 五、手机号：现在最重要的不是“会接”，而是别把两个 `code` 用混

微信“手机号快速验证组件”文档把几个重点写得非常直白：

1. `button` 用 `open-type="getPhoneNumber"`
2. 通过 `bindgetphonenumber` 回调拿 `e.detail.code`
3. 后端用 `phonenumber.getPhoneNumber` 消费这个 `code`
4. 这个 `code` 有效期 `5 分钟`，且 `只能消费一次`
5. 这个 `code` 和 `wx.login` 的 `code` 不是一个东西，`不能混用`
6. 新方式 `不再需要提前调用 wx.login`

另外还有一个非常容易漏掉的点：

`手机号快速验证组件从 2023-08-28 起按次收费，标准单价 0.03 元 / 次，每个小程序账号有 1000 次体验额度。`

所以公司项目里，你至少要把这两件事同步给产品和后端：

- 技术上：这是一条单独的换号链路，不是登录链路顺手附带的字段
- 成本上：这是会计费的，不是无限免费点

前端写法可以这样落：

```vue
<template>
  <!-- #ifdef MP-WEIXIN -->
  <button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
    绑定手机号
  </button>
  <!-- #endif -->
</template>

<script>
export default {
  methods: {
    async onGetPhoneNumber(e) {
      const { code, errMsg } = e.detail || {}

      if (!code) {
        uni.showToast({
          title: errMsg || '用户未授权手机号',
          icon: 'none'
        })
        return
      }

      await uni.request({
        url: 'https://api.example.com/user/bind-phone',
        method: 'POST',
        data: {
          phoneCode: code
        },
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        }
      })

      uni.showToast({
        title: '手机号绑定成功',
        icon: 'success'
      })
    }
  }
}
</script>
```

这里我建议你项目里明确把字段名写成：

- `loginCode`
- `phoneCode`

不要都叫 `code`。

否则过几个月你自己回来看接口日志，都很容易分不清。

## 六、上传下载：优先 `uni.uploadFile`、`uni.downloadFile`，但要记住“小程序是临时文件世界”

`uni-app` 官方文档里把上传下载分得很清楚：

- `uni.uploadFile`：上传本地资源到开发者服务器，`POST multipart/form-data`
- `uni.downloadFile`：下载资源到本地临时路径

文档里还有几个非常关键的微信小程序实战点：

1. 小程序运行前要配置域名白名单
2. 微信小程序上传只支持单文件上传，多文件要循环调用
3. 下载得到的大多是临时文件路径，不是永久文件
4. 如果要在下次启动后继续访问，需要 `uni.saveFile`
5. 上传和下载都可以拿到任务对象，监听进度或中断
6. 网络超时时间可以统一在 `manifest.json` 的 `networkTimeout` 配

### 1. 上传的稳妥思路

上传这件事，我更建议你拆成两步：

1. 先选文件
2. 再上传

如果是图片、视频，优先对应专用选择 API：

- `uni.chooseImage`
- `uni.chooseVideo`
- `uni.chooseMedia`

如果是非媒体文件，再看：

- `uni.chooseFile`
- 微信专属的 `wx.chooseMessageFile`

上传示例：

```js
export function uploadSingleImage(filePath) {
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: 'https://api.example.com/common/upload',
      filePath,
      name: 'file',
      header: {
        Authorization: `Bearer ${uni.getStorageSync('token')}`
      },
      formData: {
        bizType: 'avatar'
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`上传失败，状态码：${res.statusCode}`))
          return
        }

        resolve(JSON.parse(res.data))
      },
      fail: reject
    })

    uploadTask.onProgressUpdate((progressRes) => {
      console.log('上传进度', progressRes.progress)
    })
  })
}
```

公司项目里，上传最常见的 5 个坑是：

1. 前端以为多文件可以一次传，结果微信小程序端实际得循环调
2. 只校验前端后缀，不校验后端 MIME 和实际内容
3. token 放在 query 里到处飘，最好还是走 header 或后端签名
4. 大文件上传失败后没有重试和取消策略
5. 前端直接拿临时路径当永久地址展示

### 2. 下载的稳妥思路

如果只是“下载后立即预览或打开”，临时路径通常够用。

如果是：

- 离线查看
- 下次启动继续用
- 做缓存资源

那就应该在下载成功后主动 `uni.saveFile`。

示例：

```js
export function downloadAndCacheFile(url) {
  return new Promise((resolve, reject) => {
    const downloadTask = uni.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`下载失败，状态码：${res.statusCode}`))
          return
        }

        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => resolve(saveRes.savedFilePath),
          fail: reject
        })
      },
      fail: reject
    })

    downloadTask.onProgressUpdate((progressRes) => {
      console.log('下载进度', progressRes.progress)
    })
  })
}
```

如果你项目里有“导出 Excel、下载 PDF、下载报告附件”，建议把下载流程统一成：

1. 后端先返回真实下载地址或签名地址
2. 前端 `uni.downloadFile`
3. 需要长期留存时 `uni.saveFile`
4. 最后 `uni.openDocument` 或跳到业务页里预览

## 七、订阅消息：这是最适合 `#ifdef MP-WEIXIN` 收口的一类能力

`wx.requestSubscribeMessage` 这类能力，本质上就不是跨端能力。

所以这里别硬上“全平台统一抽象”，最稳的思路反而是：

- 业务层统一入口
- 微信实现单独条件编译

微信官方文档里，关于订阅消息至少要记住这些规则：

1. 基础库 `2.4.4+` 才支持
2. 一次最多可订阅 `5` 条消息
3. 一次性模板和永久模板 `不能混用`
4. `2.8.2` 开始，用户发生点击行为或发起支付回调后，才可以调起订阅界面
5. 返回结果里每个模板 ID 都会对应 `accept / reject / ban / filter`

也就是说，这个能力你不能在页面打开时偷偷调，更不能在无用户操作的异步流程里乱调。

比较稳的封装方式：

```js
export function requestWechatSubscribeMessage(tmplIds) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.requestSubscribeMessage({
      tmplIds,
      success: (res) => resolve(res),
      fail: reject
    })
    // #endif
  })
}
```

业务使用时这样调：

```js
async function onSubscribeClick() {
  const res = await requestWechatSubscribeMessage([
    'TEMPLATE_ID_1',
    'TEMPLATE_ID_2'
  ])

  console.log('订阅结果', res)
}
```

但这里还有一个特别容易被误解的点：

`用户同意订阅，不等于消息就会自动发出去。`

后面仍然需要：

1. 你在公众平台配置好模板
2. 后端在合适的业务时机调用发送接口
3. 业务方自己定义拒绝、关闭主开关、模板下线时怎么兜底

所以订阅消息不能只看前端按钮，要把它当成一条完整链路：

- 前端申请订阅
- 后端记录订阅结果或业务时机
- 后端发送消息
- 用户侧最终收到

## 八、分享：小程序里分享不是“你想什么时候发就什么时候发”

`uni-app` 官方文档和微信页面文档都说明了一件事：

- 小程序分享主要依赖页面级 `onShareAppMessage`
- 转发到朋友圈走 `onShareTimeline`
- 页面内也可以通过 `<button open-type="share">` 触发

而 `uni-app` 分享文档也明确提到：

`小程序不支持像 App 那样用 API 主动呼起分享菜单，本质上还是用户主动点击触发。`

所以微信小程序分享这块，你不要按 App 的思路理解。

更常见的页面写法是：

```js
export default {
  data() {
    return {
      detailId: '',
      shareTitle: '这篇内容值得转给同事看'
    }
  },
  onLoad(query) {
    this.detailId = query.id || ''
  },
  onShareAppMessage() {
    return {
      title: this.shareTitle,
      path: `/pages/article/detail?id=${this.detailId}`
    }
  },
  onShareTimeline() {
    return {
      title: this.shareTitle,
      query: `id=${this.detailId}`
    }
  }
}
```

页面里如果要做显式分享按钮，可以这样：

```vue
<template>
  <!-- #ifdef MP-WEIXIN -->
  <button open-type="share">
    分享给同事
  </button>
  <!-- #endif -->
</template>
```

分享这块常见的 4 个问题：

1. `path` 写错，别人点开进不到正确页面
2. 页面依赖运行时状态，但分享路径没把关键参数带上
3. 朋友圈和转发给好友的参数理解混了，结果只测了一种
4. 想做“页面一加载就自动弹出分享”，这不符合小程序的交互逻辑

## 九、支付：前端只负责拉起，不负责定义“订单最终成功”

支付一定要把责任边界想清楚。

微信官方 `wx.requestPayment` 文档和微信支付商户文档都在强调同一件事：

1. 前端调起支付前，要先有后端统一下单结果
2. 拉起支付需要的关键参数包括：
   - `timeStamp`
   - `nonceStr`
   - `package`
   - `signType`
   - `paySign`
3. 前端拉起支付的回调结果只能作为交互反馈
4. 订单最终状态要以后端“查询订单 + 支付成功回调通知”为准

微信支付商户文档在 `2025-02-26` 更新的小程序调起支付页面里，把这点写得非常明确：

`前端回调并不保证绝对可靠，不可只依赖前端回调判断订单支付状态。`

所以公司项目里，支付一定要按这个边界来拆：

1. 前端点“立即支付”
2. 前端请求你后端创建订单
3. 后端调用微信支付统一下单，返回支付参数
4. 前端用这些参数拉起支付
5. 前端支付完成后只做“等待确认”或“查询中”提示
6. 后端以支付通知和订单查询结果更新最终状态

更稳的前端封装可以这样写：

```js
export async function payByWechatMiniProgram(orderId) {
  const { data } = await uni.request({
    url: 'https://api.example.com/pay/wechat-mini/create',
    method: 'POST',
    data: {
      orderId
    },
    header: {
      Authorization: `Bearer ${uni.getStorageSync('token')}`
    }
  })

  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: resolve,
      fail: reject
    })
    // #endif
  })
}
```

这里最该避免的 5 个坑：

1. 前端自己拼签名参数
2. 把支付成功页等同于订单最终成功页
3. 用户取消支付后不做订单状态回收
4. 后端没有支付回调补偿机制
5. 同一个订单重复点击，结果并发创建多笔支付单

更稳的页面体验通常是：

- `success`：提示“支付发起成功，正在确认订单状态”
- `fail cancel`：提示“已取消支付”
- 其他失败：提示“支付未完成，请重试”

但真正跳结果页之前，最好再查一次后端订单状态。

## 十、把这一篇压成 10 条最实用的项目规则

如果你以后在公司里带人接 `uni-app` 微信小程序能力，我建议直接把下面 10 条当团队共识：

1. 能用 `uni.*` 的能力先用 `uni.*`，微信专属能力再退到 `wx.*`
2. 所有 `wx.*` 都尽量收口到 `#ifdef MP-WEIXIN`
3. 微信登录态和业务登录态必须拆开理解
4. `wx.login` 的 `code`、手机号组件的 `code`，字段名不要混成一个
5. 新项目的头像昵称流程，优先参考微信当前“头像昵称填写”能力
6. 上传下载先记住“临时文件路径不是永久文件路径”
7. 订阅消息必须由用户点击触发，不要在页面初始化时调
8. 分享是用户触发能力，不是你想什么时候弹就什么时候弹
9. 支付前端只负责拉起，不负责定义最终支付成功
10. 任何能力只要背后有平台授权、计费、风控、审核，就不要只从前端单点看问题，要把整条链路画出来

## 十一、这一篇我对照的官方资料

截至 `2026-03-31`，这篇主要对照了以下官方资料：

- `uni-app` 登录文档：`https://uniapp.dcloud.net.cn/api/plugins/login.html`
- `uni-app` 上传下载文档：`https://uniapp.dcloud.net.cn/api/request/network-file.html`
- `uni-app` 页面生命周期文档：`https://uniapp.dcloud.net.cn/tutorial/page`
- `uni-app` 分享文档：`https://uniapp.dcloud.net.cn/api/plugins/share`
- 微信登录文档：`https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html`
- 微信头像昵称填写：`https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html`
- 微信手机号快速验证组件：`https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html`
- 微信订阅消息：`https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html`
- 微信页面文档：`https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html`
- 微信支付拉起支付：`https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestPayment.html`
- 微信支付商户文档“小程序调起支付”：`https://pay.weixin.qq.com/doc/v3/merchant/4012791898`

下一篇，我更建议继续写：

`uni-app 微信小程序性能优化与包体治理实战：首屏、分包、长列表、图片、setData 与真机排障`
