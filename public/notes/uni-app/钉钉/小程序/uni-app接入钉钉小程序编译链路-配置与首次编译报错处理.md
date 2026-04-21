---
title: uni-app 接入钉钉小程序编译链路：配置与首次编译报错处理
date: 2026-04-21
category: uni-app
tags:
  - uni-app
  - 钉钉小程序
  - mp-dingtalk
  - 编译配置
  - 踩坑记录
description: 记录 uni-app 项目接入钉钉小程序编译链路的完整配置步骤，以及首次编译时最常见的 CE1000.01 cannot resolve module 报错原因与修复方式。
---

# uni-app 接入钉钉小程序编译链路：配置与首次编译报错处理

> 这篇文章解决两个问题：
> 1. uni-app 项目怎么配置钉钉小程序编译入口
> 2. 首次编译时遇到 `cannot resolve module` 报错怎么处理
>
> 适合刚开始接入钉钉小程序、还没跑通编译链路的开发者。

---

## 一、为什么需要单独配置

uni-app 没有内置的钉钉小程序平台，钉钉小程序需要通过**自定义平台**方式接入，底层走 `mp-alipay` 编译通道。

如果你的项目 `package.json` 里没有 `uni-app.scripts` 配置，就没有钉钉构建入口，HBuilderX 菜单里也不会出现"钉钉小程序"选项。

---

## 二、package.json 配置

在项目根目录的 `package.json` 里新增以下两块：

```json
{
  "scripts": {
    "dev:mp-dingtalk": "uni -p mp-alipay",
    "build:mp-dingtalk": "uni build -p mp-alipay"
  },
  "uni-app": {
    "scripts": {
      "mp-dingtalk": {
        "title": "钉钉小程序",
        "env": {
          "UNI_PLATFORM": "mp-alipay"
        },
        "define": {
          "MP-DINGTALK": true
        }
      }
    }
  }
}
```

**三个关键点：**

**1. `UNI_PLATFORM: "mp-alipay"`**

钉钉小程序在 uni-app 里没有独立平台，走支付宝小程序的编译通道。看到 `mp-alipay` 不要慌，这是 uni-app 官方对钉钉的适配方式，不是配错了。

**2. `MP-DINGTALK: true`**

注入自定义条件编译常量，后续可以在代码里用 `#ifdef MP-DINGTALK` 隔离钉钉专属逻辑：

```js
// #ifdef MP-DINGTALK
dd.getAuthCode({ corpId, success: res => { /* ... */ } })
// #endif
```

**3. `package.json` 里不要写注释**

uni-app 解析 `package.json` 时不支持注释，写了注释会导致扩展配置失效，HBuilderX 菜单里不会出现钉钉小程序选项。

---

## 三、验收方式

配置完成后：

**HBuilderX 方式：**
顶部菜单 → 运行 → 运行到小程序模拟器，列表里出现"钉钉小程序"，选择后能编译出产物并导入钉钉开发者工具。

**CLI 方式：**
```bash
npm run dev:mp-dingtalk   # 开发模式
npm run build:mp-dingtalk # 生产构建
```

---

## 四、首次编译常见报错：CE1000.01 cannot resolve module

配置完成后首次编译，很可能遇到这个报错：

```
error[CE1000.01]: xxx/index.js:xxx:xx
cannot resolve module '@/xxx/xxx.js'
```

### 4.1 报错原因

这个报错的根本原因是：**函数体内使用了 `require()` 动态引入带 `@/` 别名的模块**。

```js
// ❌ 触发报错的写法
function someMethod() {
  const configInfo = require('@/configInfo/index.js').default
  // ...
}
```

钉钉小程序走 `mp-alipay` 编译通道，编译器只能**静态分析**文件顶部的 `import` 语句来解析模块依赖。函数体内的 `require()` 属于运行时动态引入，编译期无法解析带 `@/` 别名的路径，所以报错。

### 4.2 为什么微信小程序没有这个问题

微信小程序的编译器对函数体内 `require()` 的处理更宽松，所以同样的代码在微信端能跑，到钉钉（`mp-alipay` 通道）就报错了。

这也是为什么从微信小程序迁移到钉钉时，首次编译经常会遇到这个问题。

### 4.3 修复方式

把函数体内的 `require()` 改为文件顶部的静态 `import`：

```js
// ✅ 正确写法：顶部静态 import
import configInfo from '@/configInfo/index.js'

function someMethod() {
  // 直接使用已导入的变量
  console.log(configInfo.API_URL)
}
```

**如果顶部已经有同名 import，只需删掉函数体内的重复 require：**

```js
// 顶部已有
import configInfo from '@/configInfo/index.js'

function someMethod() {
  // ❌ 删掉这行重复的 require
  // const configInfo = require('@/configInfo/index.js').default

  // 直接用顶部已导入的 configInfo
  console.log(configInfo.API_URL)
}
```

### 4.4 批量排查方式

如果项目里有多处这样的写法，可以全局搜索：

```bash
# 搜索函数体内的 require
rg "require\('@/" src pages components --include="*.vue" --include="*.js"
```

找到后逐一改为顶部静态 `import`。

### 4.5 根本规范

**微信 / 支付宝 / 钉钉小程序均不支持函数体内 `require()` 动态引入带 `@/` 别名的模块。**

统一规范：**模块引入一律写在文件顶部 `import`，不在函数体内使用 `require()`。**

---

## 五、其他首次编译常见问题

### 5.1 HBuilderX 菜单里没有出现"钉钉小程序"

排查顺序：
1. `package.json` 里是否有注释（有注释会导致解析失败）
2. `uni-app.scripts` 的层级是否正确（必须在 `package.json` 根层级）
3. 重启 HBuilderX 后重新打开项目

### 5.2 编译产物导入钉钉开发者工具后白屏

排查顺序：
1. 是否还有其他 `CE1000.01` 报错没有修复（编译有报错时产物可能不完整）
2. 钉钉开发者工具是否选择了正确的产物目录（`unpackage/dist/dev/mp-alipay/`）
3. 首页路由是否正确（`pages.json` 里的第一个页面）

### 5.3 条件编译 `#ifdef MP-DINGTALK` 不生效

排查顺序：
1. `package.json` 里 `define` 中的 `MP-DINGTALK` 是否为 `true`（不是字符串 `"true"`）
2. 是否用的是 `mp-dingtalk` 这个自定义脚本编译，而不是直接用 `mp-alipay`

---

## 六、编译链路验收清单

- [ ] `package.json` 中 `uni-app.scripts.mp-dingtalk` 配置正确
- [ ] `package.json` 中没有注释
- [ ] HBuilderX 菜单里出现"钉钉小程序"选项
- [ ] 编译无报错（或报错已全部修复）
- [ ] 编译产物可导入钉钉开发者工具
- [ ] 首页在钉钉开发者工具中不白屏
- [ ] 静态资源正常加载
- [ ] 基础路由跳转正常
