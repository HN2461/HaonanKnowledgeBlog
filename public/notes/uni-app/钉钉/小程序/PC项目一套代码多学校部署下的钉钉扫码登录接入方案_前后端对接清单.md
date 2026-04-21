---
title: PC 项目一套代码多学校部署下的钉钉扫码登录接入方案：前后端对接清单
date: 2026-03-31
category: uni-app
tags:
  - 钉钉扫码登录
  - 第三方企业应用
  - PC 项目
  - 多学校部署
  - 前后端联调
description: 面向“一套代码、多学校独立部署、按域名返回学校配置”的 PC 项目，梳理钉钉第三方企业应用扫码登录的接入思路、配置项、接口约定、权限要求与常见坑位。
---

# PC 项目一套代码多学校部署下的钉钉扫码登录接入方案：前后端对接清单

> 适用场景  
> 你们的 PC 项目是一套代码，发布到不同学校自己的服务器上。  
> 每个学校一个独立域名。  
> 前端每次打包只切 2 个基础域名：
> - API 基础域名
> - WebSocket 基础域名
>
> 页面打开后，前端根据当前域名请求后端，后端返回该学校的基础信息、权限配置和钉钉登录参数。

## 一、先说结论

按你们现在的业务形态，钉钉登录建议这样定：

1. 应用类型按 `第三方企业应用` 设计
2. 保持 `一套代码 + 多学校独立部署 + 不同域名`
3. 前端构建阶段仍然只保留：
   - `API_BASE_URL`
   - `WS_BASE_URL`
4. 学校差异和钉钉登录参数都由后端按域名动态返回
5. 登录主键优先使用：
   - `corpId + unionId`
6. 第一阶段先把登录链路跑通：
   - `authCode -> userAccessToken -> 当前授权用户信息 -> 你们自己的登录态`

一句话记忆：

`前端只负责拿配置、展示二维码、接住回调；后端负责换钉钉身份、绑定学校用户、签发你们自己的登录态。`

## 二、为什么这个场景要按第三方企业应用理解

你们不是只给自己公司内部用，而是：

- 自己公司内部也要用
- 还要给多所学校用
- 不同学校是不同钉钉组织
- 学校用户希望通过钉钉扫码登录你们的 PC 项目

这更接近钉钉官方定义里的：

`第三方企业应用`

而不是：

`企业内部应用`

钉钉官方在网页登录文档里明确提到：

`企业内部应用不支持跨组织授权登录`

所以只要你们的目标是“多个学校都能用钉钉登录同一套产品能力”，主方案就应该优先按第三方企业应用设计。

## 三、你们当前架构和钉钉登录是可以兼容的

你们现在的架构可以概括成：

- 一套前端代码
- 不同学校不同部署
- 不同学校不同域名
- 前端打开登录页时，根据域名向后端请求学校配置
- 后端根据域名返回学校基础信息

这套方案和钉钉扫码登录并不冲突。

真正需要补的，只是：

1. 后端返回学校基础信息时，要顺便返回钉钉登录配置
2. 登录回调页要固定在当前学校域名下
3. 前后端统一钉钉字段命名和登录失败分支

## 四、官方主线登录流程

截至 `2026-03-31`，我对照钉钉开放平台的新文档，网页登录更推荐按下面这条链路理解：

1. 前端展示钉钉扫码登录入口
2. 用户扫码或跳转到钉钉授权页
3. 钉钉回调到当前学校域名下的 `redirect_uri`
4. 前端从地址栏拿到 `authCode`
5. 前端把 `authCode` 发给你们后端
6. 后端调用 `获取用户 token` 接口，换用户级 `accessToken`
7. 后端调用 `获取用户通讯录个人信息` 接口，获取当前授权用户信息
8. 后端根据 `corpId + unionId` 查本地账号
9. 后端生成你们自己的 `session/jwt`
10. 前端登录完成，进入系统

建议你们内部统一把这条链路记成：

`二维码/授权页 -> authCode -> userAccessToken -> 当前用户信息 -> 本地登录态`

## 五、不要先把旧接口当主线

钉钉开放平台里还可以搜到旧接口：

- `根据sns临时授权码获取用户信息`

但这页已经被放在历史文档路径下，而且适用语境和新网页登录主线不完全一致。

如果你们后端现在只是做了一个草稿，建议尽快核对：

`是不是已经按新链路在实现`

新链路重点看这两页：

- `获取用户token`
- `获取用户通讯录个人信息`

如果后端还在优先扩旧链路，后面越改越容易混乱。

## 六、你们最适合的配置策略

按你们当前模式，前端构建配置建议继续保持最小化：

### 构建阶段仍然只保留

- `API_BASE_URL`
- `WS_BASE_URL`

### 运行阶段由后端返回学校配置

后端根据当前域名返回：

- 学校基础信息
- 主题配置
- 是否开启钉钉登录
- 钉钉登录参数
- 登录后当前学校可见模块

这意味着：

`钉钉登录的 clientId、corpId、redirectUri，不建议长期写死在前端环境文件里。`

你现在可以先写死做联调，但正式方案建议全部改成后端返回。

## 七、建议前后端统一的钉钉字段命名

钉钉文档里有些地方写：

- `Client ID / Client Secret`

有些地方又写：

- `AppKey / AppSecret`
- `SuiteKey / SuiteSecret`

为了避免前后端聊天时越聊越乱，建议你们自己项目内部统一叫法：

### 应用级字段

- `dingClientId`
- `dingClientSecret`

### 学校/组织级字段

- `dingCorpId`

### 登录过程字段

- `dingAuthCode`
- `dingUserAccessToken`
- `dingRefreshToken`

### 用户标识字段

- `dingUnionId`
- `dingOpenId`
- `dingMobile`

这样以后你们内部无论前端、后端、产品、测试，提到的名字都统一。

## 八、建议你们内部统一的主键策略

### 学校主键

优先使用：

- `schoolId`：你们自己系统里的学校主键
- `dingCorpId`：该学校在钉钉里的组织标识

### 用户绑定主键

建议第一阶段优先按：

`dingCorpId + dingUnionId`

原因：

- `corpId` 可以确保知道用户属于哪所学校
- `unionId` 比纯手机号更稳定
- `openId` 可以存，但不建议先拿来当唯一主键

### 不建议第一阶段用这些做唯一主键

- 手机号
- 昵称
- 纯 `openId`

尤其是第三方企业应用场景下，手机号可能脱敏，拿它做唯一绑定很危险。

## 九、登录页初始化接口，建议后端返回这些字段

你们现在登录页已经是“按域名拿学校配置”，那就建议把钉钉登录字段一起带回来。

接口可以类似：

`GET /public/school/bootstrap`

返回示例：

```json
{
  "schoolId": "school_001",
  "schoolName": "某某实验学校",
  "schoolCode": "SCH001",
  "logo": "https://xxx/logo.png",
  "themeColor": "#1677ff",
  "modules": [
    "dashboard",
    "student",
    "class",
    "course"
  ],
  "auth": {
    "dingLoginEnabled": true,
    "dingLoginMode": "qrcode",
    "dingClientId": "dingxxxxxx",
    "dingCorpId": "dingyyyyyy",
    "dingRedirectUri": "https://school-a.example.com/auth/dingtalk/callback",
    "dingScope": "openid corpid",
    "dingPrompt": "consent"
  }
}
```

### 字段说明

- `dingLoginEnabled`
  - 当前学校是否开启钉钉登录
- `dingLoginMode`
  - 登录方式，建议先约定：
  - `redirect`
  - `qrcode`
- `dingClientId`
  - 当前学校使用的钉钉应用标识
- `dingCorpId`
  - 当前学校的钉钉组织标识
- `dingRedirectUri`
  - 当前学校域名下的固定回调页地址
- `dingScope`
  - 建议先统一为 `openid corpid`
- `dingPrompt`
  - 建议先统一为 `consent`

### 超短对接表

如果你现在只想先和后端把第一轮联调跑通，建议先只对齐下面这几组字段。

先提醒一句，避免你们首轮联调时把字段要杂了：

`当前 PC 网页扫码登录第一批通常不需要 agentId，也不需要 miniAppId。`

这两个字段更偏：

- 工作台内 H5/JSAPI 场景
- 工作台应用管理场景
- 真正使用钉钉小程序产物的场景

#### 1. 登录页初始化接口最少返回这些

| 字段名 | 谁提供 | 是否必需 | 用途 | 备注 |
| --- | --- | --- | --- | --- |
| `schoolId` | 后端 | 是 | 标识当前学校 | 由域名匹配出来 |
| `dingLoginEnabled` | 后端 | 是 | 是否显示钉钉登录入口 | `false` 时前端直接隐藏 |
| `dingClientId` | 后端 | 是 | 标识当前钉钉应用 | 前端拼登录地址要用 |
| `dingCorpId` | 后端 | 建议有 | 指定当前学校钉钉组织 | 已知学校时建议返回 |
| `dingRedirectUri` | 后端 | 是 | 钉钉授权回调地址 | 必须是当前学校域名下地址 |
| `dingScope` | 后端 | 是 | 授权范围 | 第一版建议固定 `openid corpid` |
| `dingPrompt` | 后端 | 是 | 授权页行为 | 第一版建议固定 `consent` |
| `dingLoginUrl` | 后端 | 可选 | 直接给前端可用登录地址 | 如果后端拼好，前端更省事 |

#### 2. 回调登录接口前端最少传这些

| 字段名 | 谁提供 | 是否必需 | 用途 | 备注 |
| --- | --- | --- | --- | --- |
| `authCode` | 前端 | 是 | 钉钉回调返回的临时授权码 | `code` 和 `authCode` 取任一即可 |
| `state` | 前端 | 是 | 防重放、防串请求 | 回调页必须校验 |
| `schoolId` | 前端 | 建议有 | 明确当前学校上下文 | 也可以让后端继续按域名判断 |

#### 3. 回调登录接口后端最少返回这些

| 字段名 | 谁提供 | 是否必需 | 用途 | 备注 |
| --- | --- | --- | --- | --- |
| `token` | 后端 | 是 | 你们自己的登录态 | 不要把钉钉用户 token 直接给前端当系统 token |
| `refreshToken` | 后端 | 建议有 | 刷新你们自己的登录态 | 按你们现有体系决定 |
| `userInfo` | 后端 | 是 | 当前系统用户信息 | 至少带本地用户 ID、姓名、学校 ID |
| `menus` | 后端 | 建议有 | 登录后页面权限 | 你们本来就有学校权限控制 |
| `bindStatus` | 后端 | 建议有 | 是否已完成本地账号绑定 | 未绑定时方便走补绑流程 |

#### 4. 后端内部最少要拿到这些钉钉字段

| 字段名 | 来源 | 是否建议落库 | 用途 |
| --- | --- | --- | --- |
| `corpId` | 用户 token 接口返回 | 是 | 校验当前授权组织是不是这所学校 |
| `unionId` | 用户通讯录个人信息接口返回 | 是 | 作为跨学校/跨应用识别的重要标识 |
| `openId` | 用户通讯录个人信息接口返回 | 建议存 | 便于排查网页登录链路问题 |
| `mobile` | 用户通讯录个人信息接口返回 | 可选 | 辅助匹配，不建议单独做唯一主键 |
| `nick` | 用户通讯录个人信息接口返回 | 可选 | 仅展示用途 |

一句话版可以直接发给后端：

`登录页给我 dingClientId、dingCorpId、dingRedirectUri、dingScope、dingPrompt；回调时我给你 authCode 和 state；你登录成功后还我自己的 token、userInfo、menus。`

## 十、前端第一阶段可以先写死哪些值

如果你现在还在等后端接口统一，前端可以先临时写一个固定对象：

```js
const dingConfig = {
  dingLoginEnabled: true,
  dingLoginMode: 'qrcode',
  dingClientId: 'dingxxxxxx',
  dingCorpId: 'dingyyyyyy',
  dingRedirectUri: `${window.location.origin}/auth/dingtalk/callback`,
  dingScope: 'openid corpid',
  dingPrompt: 'consent'
}
```

后面等后端接口准备好了，再把这里改成：

`const dingConfig = bootstrap.auth`

也就是说：

`现在先写死，后面再变量化`

这完全没问题。

## 十一、前端如何拼授权地址

如果你们不是直接让后端返回完整 `loginUrl`，前端自己拼接时，建议统一成下面这套参数：

```text
https://login.dingtalk.com/oauth2/auth
?redirect_uri=...
&response_type=code
&client_id=...
&scope=openid%20corpid
&state=...
&prompt=consent
&corpId=...
```

### 这里有几个关键点

1. `redirect_uri` 需要 urlencode
2. `response_type` 固定是 `code`
3. `scope` 官方当前只支持：
   - `openid`
   - `openid corpid`
4. 你们这种“已知当前学校”的场景，建议优先用：
   - `openid corpid`
5. 如果已经知道当前学校 `corpId`，建议把 `corpId` 参数也带上
6. `state` 一定要带，并在回调页校验

## 十二、二维码模式需要特别注意的坑

如果你们继续做“登录页展示二维码”这条线，要重点记住钉钉官方的一条要求：

`嵌入二维码的页面必须和 redirect_uri 页面同源`

也就是说：

- 登录页是 `https://school-a.example.com/login`
- 回调页最好也是 `https://school-a.example.com/auth/dingtalk/callback`

不要做成：

- 登录页在学校域名
- 回调页却跳到另外一个认证域名
- 然后还想在当前页内嵌二维码

这种很容易出现“二维码能扫、授权后没反应”的问题。

### 官方二维码脚本

```html
<script src="https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js"></script>
```

### 你们现在这种一校一域名部署，其实是适合做二维码同源的

因为每个学校自己的登录页和自己的回调页，本来就都在当前学校域名下。

## 十三、回调页前端应该做什么

建议你们单独做一个固定路由：

`/auth/dingtalk/callback`

这个页面只做三件事：

1. 解析 URL 参数：
   - `authCode`
   - `code`
   - `state`
   - `error`
2. 校验 `state`
3. 把 `authCode` 发给后端登录接口

### 注意

钉钉网页登录文档里提到：

`code 和 authCode 一致，取任一即可`

所以前端可以写成：

```js
const authCode = params.get('authCode') || params.get('code')
```

## 十四、建议你们和后端统一的登录接口

前端不要直接感知钉钉全部细节，建议统一通过你们自己的后端接口完成登录。

接口示例：

`POST /public/auth/dingtalk/login`

请求体：

```json
{
  "authCode": "xxxx",
  "state": "xxxx"
}
```

返回成功示例：

```json
{
  "token": "your-jwt-token",
  "refreshToken": "your-refresh-token",
  "userInfo": {
    "userId": "local_user_001",
    "name": "张三",
    "schoolId": "school_001"
  },
  "menus": [
    "dashboard",
    "student",
    "class"
  ]
}
```

前端收到后只做：

1. 保存你们自己的登录态
2. 缓存菜单权限
3. 跳转首页

## 十五、后端登录接口内部应完成什么

后端真正要做的事情建议统一成这几步：

1. 根据当前请求域名确认学校
2. 校验该学校是否开启钉钉登录
3. 用 `authCode` 调 `获取用户token`
4. 拿到：
   - `accessToken`
   - `refreshToken`
   - `expireIn`
   - `corpId`
5. 再调 `获取用户通讯录个人信息`
6. 取到：
   - `unionId`
   - `openId`
   - `mobile`
   - `nick`
7. 校验：
   - 当前 `corpId` 是否和学校匹配
   - 当前用户是否已绑定
8. 绑定成功后，签发你们自己的登录态

## 十六、建议统一的失败场景和错误码

这一步非常重要。

如果前后端不先统一失败分支，后面联调时会特别痛苦。

建议先约定这几个业务错误码：

- `SCHOOL_NOT_FOUND`
- `SCHOOL_DING_LOGIN_DISABLED`
- `DING_CALLBACK_INVALID`
- `DING_AUTH_FAILED`
- `DING_CORP_NOT_MATCHED`
- `USER_NOT_BOUND`
- `USER_DISABLED`
- `USER_NOT_IN_CURRENT_SCHOOL`

### 推荐含义

- `SCHOOL_NOT_FOUND`
  - 域名无法匹配学校
- `SCHOOL_DING_LOGIN_DISABLED`
  - 当前学校没有开启钉钉登录
- `DING_CALLBACK_INVALID`
  - `authCode/state` 异常
- `DING_AUTH_FAILED`
  - 钉钉换 token 或取用户信息失败
- `DING_CORP_NOT_MATCHED`
  - 用户授权出来的 `corpId` 不是当前学校
- `USER_NOT_BOUND`
  - 这个钉钉用户还没有绑定你们系统账号
- `USER_DISABLED`
  - 本地账号已禁用
- `USER_NOT_IN_CURRENT_SCHOOL`
  - 账号存在，但不属于当前学校

## 十七、关于手机号的建议

钉钉官方文档里提到：

`第三方企业应用无法获取用户完整手机号，可能会脱敏`

所以你们第一阶段登录不要依赖：

- “扫码后拿手机号去匹配本地用户”

更稳的做法是：

- 先通过 `corpId + unionId` 找绑定关系

手机号可以用于：

- 页面展示
- 辅助校验
- 人工排查

但不建议作为第一阶段的唯一登录主键。

## 十八、你们现在最该和后端统一的清单

下面这份清单，建议你直接拿去和后端对：

### 1. 应用类型

- 是否已经按 `第三方企业应用` 创建

### 2. 学校配置返回字段

- 是否能在登录页初始化接口中返回：
  - `dingLoginEnabled`
  - `dingLoginMode`
  - `dingClientId`
  - `dingCorpId`
  - `dingRedirectUri`
  - `dingScope`
  - `dingPrompt`

### 3. 当前后端主链路

- 是否已经按：
  - `authCode -> userAccessToken -> 当前授权用户信息`
- 还是还在走旧的 `sns/getuserinfo_bycode`

### 4. 绑定主键

- 是否统一按：
  - `corpId + unionId`

### 5. 错误码

- 是否已经定义：
  - 学校未开通
  - 用户未绑定
  - corpId 不匹配
  - 钉钉授权失败

### 6. 回调地址

- 当前学校域名下的 `redirect_uri` 是否和开放平台配置一致

## 十九、第一阶段建议怎么落地

如果你们现在还处于“二维码草稿已通，但接口还没统一”的阶段，我建议落地顺序按这个来：

1. 前端先写死一套 `dingConfig`
2. 后端确认应用类型和主链路
3. 后端统一登录接口返回格式
4. 前端完成：
   - 登录页
   - 回调页
   - 登录成功后的跳转和错误提示
5. 后端再把登录参数并入学校初始化配置
6. 前端把写死配置改成后端返回变量

这条路线最稳，不容易一开始就把事情搞得太重。

## 二十、官方资料

下面这些是我这次对照的官方资料，建议你们前后端至少都快速过一遍：

- [钉钉开放平台《实现网页方式登录应用（登录第三方网站）》](https://open.dingtalk.com/document/dingstart/tutorial-obtaining-user-personal-information)
- [钉钉开放平台《获取登录用户的访问凭证》](https://open.dingtalk.com/document/development/obtain-identity-credentials)
- [钉钉开放平台《获取用户token》](https://open.dingtalk.com/document/development/obtain-user-token)
- [钉钉开放平台《获取用户通讯录个人信息》](https://open.dingtalk.com/document/development/dingtalk-retrieve-user-information)
- [钉钉开放平台《应用类型介绍》](https://open.dingtalk.com/document/dingstart/application-type-introduction)
- [钉钉开放平台《添加接口调用权限》](https://open.dingtalk.com/document/development/add-api-permission)
- [钉钉开放平台《根据sns临时授权码获取用户信息》](https://open.dingtalk.com/document/development/obtain-the-user-information-based-on-the-sns-temporary-authorization)

## 二十一、最后给你们一句最短版本的实施建议

对你们当前项目，最适合的方案不是“推翻现有架构重做统一认证中心”，而是：

`保持一套代码和当前按域名返回学校配置的方案不变，把钉钉扫码登录参数并入学校配置，由后端统一完成 authCode 换身份和本地登录态签发。`

这条路和你们现有系统最贴近，也最容易先跑通。
