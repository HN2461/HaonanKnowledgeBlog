---
title: 快速认识 Element Plus：为什么它是 Vue 3 里常见的 PC 端组件库
date: 2026-04-28
category: Element Plus
tags:
  - Element Plus
  - Vue3
  - Vite
  - UI组件库
  - 后台管理系统
description: 基于 2026-04-28 查阅的 Element Plus 最新官方资料，作为 Element Plus 专题第一篇，先讲清它为什么常用于 Vue 3 的 PC 端项目，以及接入、按需导入、主题定制、国际化与暗黑模式的核心用法。
---

# 快速认识 Element Plus：为什么它是 Vue 3 里常见的 PC 端组件库

> 主人如果前面已经接触过移动端组件库，比如 `Vant`，  
> 那到了 PC 端后台、运营台、表单台、数据台，最常碰到的就是 `Element Plus`。
>
> 这一篇也是 **Element Plus 专题的第一篇**。
>
> 这一篇我按 **2026-04-28 查到的最新官方资料** 来写，  
> 目标不是讲历史，而是直接帮你弄清：
>
> **它是什么、什么时候用、在 Vue 3 + Vite 项目里到底怎么接。**

---

## 一、先记住一句话

`Element Plus` 可以先理解成：

**专门给 Vue 3 项目准备的一套 PC 端组件库。**

它最适合这些场景：

- 后台管理系统
- 数据表格很多的系统
- 表单很多的业务页面
- 弹窗、抽屉、分页、菜单、树形控件比较多的中后台

如果说：

- `Vant` 更偏移动端 H5
- 那 `Element Plus` 就更偏桌面端业务系统

这两个不是互相替代关系，而是**使用场景不同**。

---

## 二、最新官方资料先给主人说结论

我这次查的是 Element Plus 官方站和官方 GitHub Releases。

截至 **2026-04-28**：

- 官方最新正式版是 `2.13.7`
- GitHub Releases 标记的发布时间是 **2026-04-10**
- 官方文档仍然是围绕 **Vue 3** 使用
- 官方推荐在工程项目里优先使用 **Vite + 自动按需导入**

所以主人现在如果是在现代 Vue 3 项目里学 PC 端组件库，学 `Element Plus` 是对路的。

---

## 三、它和以前的 Element UI 不是一回事

这个地方很容易混。

你要先分清：

- `Element UI`
  - 老版本，主要对应 `Vue 2`
- `Element Plus`
  - 新版本，主要对应 `Vue 3`

所以你在 Vue 3 项目里，不要再去找 `Element UI` 的接法了。

你应该直接看 `Element Plus` 官方文档。

---

## 四、最小接入：先把它装进 Vue 3 + Vite 项目

先安装：

```bash
npm i element-plus
```

如果你只想先快速跑起来，最简单的是**完整引入**。

### 1. `main.js` 直接完整引入

```js
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus, {
  size: "default",
  zIndex: 3000,
});

app.mount("#app");
```

这里先看懂 3 件事：

- `app.use(ElementPlus)`：把整个组件库挂到项目里
- `import 'element-plus/dist/index.css'`：把默认样式引进来
- `size`、`zIndex`：这是官方支持的全局配置入口

如果主人是刚开始接触，先用这个方案最省脑子。

---

## 五、正式项目更常见：按需自动导入

完整引入很方便，但正式项目里更常见的是：

**只在用到的时候自动导入组件。**

官方快速开始里推荐的方案，是配合这两个插件：

- `unplugin-vue-components`
- `unplugin-auto-import`

先安装：

```bash
npm i element-plus
npm i -D unplugin-auto-import unplugin-vue-components
```

然后配置 `vite.config.js`：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
```

这样配完后，很多时候你在组件模板里直接写：

```vue
<template>
  <el-button type="primary">保存</el-button>
  <el-input v-model="keyword" placeholder="请输入关键词" />
</template>

<script setup>
import { ref } from "vue";

const keyword = ref("");
</script>
```

就不用每个页面都手动写一堆：

```js
import { ElButton, ElInput } from "element-plus";
```

这就是它在真实项目里最常见的接法。

---

## 六、给主人一个最像后台项目的页面例子

下面这段代码很有代表性。

它不是花哨 demo，而是最接近真实业务后台的写法：**搜索栏 + 表格 + 状态标签 + 分页**。

```vue
<script setup>
import { reactive, ref } from 'vue'

const query = reactive({
  keyword: '',
  status: ''
})

const tableData = ref([
  { id: 1, name: '首页装修', owner: '小王', status: '已上线' },
  { id: 2, name: '订单中心', owner: '小李', status: '开发中' },
  { id: 3, name: '用户画像', owner: '小周', status: '待排期' }
])

function handleSearch() {
  console.log('查询条件', query)
}
```

```vue
<template>
  <el-card class="panel-card">
    <template #header>
      <div class="panel-title">项目列表</div>
    </template>

    <el-form :inline="true" :model="query" class="toolbar">
      <el-form-item label="关键词">
        <el-input
          v-model="query.keyword"
          placeholder="请输入项目名"
          clearable
          style="width: 220px"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select
          v-model="query.status"
          placeholder="请选择状态"
          clearable
          style="width: 180px"
        >
          <el-option label="已上线" value="已上线" />
          <el-option label="开发中" value="开发中" />
          <el-option label="待排期" value="待排期" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="owner" label="负责人" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag
            :type="
              row.status === '已上线'
                ? 'success'
                : row.status === '开发中'
                  ? 'warning'
                  : 'info'
            "
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination background layout="total, prev, pager, next" :total="36" />
    </div>
  </el-card>
</template>

<style scoped>
.panel-card {
  margin: 24px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
}

.toolbar {
  margin-bottom: 16px;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
```

主人只要看这一段，就能马上感受到它为什么适合 PC 后台：

- 表单组件全
- 表格组件强
- 分页、弹窗、抽屉、树、日期选择器都现成
- 风格统一

这就是很多中后台项目爱用它的原因。

---

## 七、国际化：让分页、日期等默认文案显示中文

如果主人发现分页、日期控件这些内置文案不是你想要的语言，官方推荐用 `ConfigProvider`。

比如切成中文：

```vue
<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
```

这个写法很常见。

因为很多后台项目不只是自己写按钮文案，还要让：

- 分页
- 日期选择器
- 时间选择器
- 表格空态

这些组件内部默认文案也统一起来。

---

## 八、改主题：先学最常用的 CSS 变量方案

Element Plus 现在很强调 **CSS 变量**。

这对主人来说有个很大的好处：

**改主色，不一定非要折腾复杂编译。**

比如先改全局主色：

```css
:root {
  --el-color-primary: #0f766e;
  --el-border-radius-base: 10px;
}
```

如果你只想局部改某块区域，也可以把变量收在类名下面：

```css
.finance-panel {
  --el-card-border-color: #99f6e4;
  --el-button-bg-color: #0f766e;
}
```

这样比你一个个去覆盖 `.el-button`、`.el-card` 的样式要自然得多。

官方文档也明确更推荐优先通过变量来做样式定制。

---

## 九、要大改主题时，再上 SCSS 变量方案

如果你不是只想改几个颜色，而是想把整套主题系统改掉，那就可以走官方提供的 `SCSS` 变量方案。

比如新建：

`src/styles/element/index.scss`

```scss
@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #0f766e,
    ),
  )
);

@use "element-plus/theme-chalk/src/index.scss" as *;
```

然后在入口引入：

```js
import "./styles/element/index.scss";
```

这里要注意两点：

1. 既然你已经自己引入了 `index.scss`，就不要再同时引 `element-plus/dist/index.css`
2. 官方主题文档明确建议优先使用 `@use` / `@forward`，而不是旧的 `@import`

这个点其实也和前面那篇 SCSS 补充文刚好能连起来。

---

## 十、暗黑模式：官方已经给了标准接法

Element Plus 官方已经提供了暗黑模式变量文件。

先在入口引入：

```js
import "element-plus/theme-chalk/dark/css-vars.css";
```

如果只想固定暗黑模式，官方文档给的方式很直接：

```html
<html class="dark"></html>
```

如果你想动态切换，本质上就是切换 `html` 的 `dark` 类名：

```js
document.documentElement.classList.toggle("dark");
```

你还可以继续覆盖深色变量：

```css
html.dark {
  --el-bg-color: #0f172a;
  --el-text-color-primary: #e5e7eb;
}
```

也就是说：

- 默认主题靠 CSS 变量
- 暗黑模式也还是靠 CSS 变量

这套思路非常统一。

---

## 十一、主人最容易踩的几个坑

### 1. 把它和 Vue 2 的 Element UI 混了

这个是最常见坑。

现在主人如果是 Vue 3 项目，就直接看 `Element Plus`。

### 2. 同时引了两份样式

比如你已经写了：

```js
import "./styles/element/index.scss";
```

就别再重复引：

```js
import "element-plus/dist/index.css";
```

否则样式来源会变乱。

### 3. 只会“盖 class”，不会优先改变量

Element Plus 现在很多样式都已经变量化了。

所以主人改样式时，优先顺序建议是：

1. 先看有没有现成属性
2. 再看有没有 CSS 变量
3. 最后才去覆盖具体类名

这样维护成本更低。

### 4. 移动端页面也硬上 Element Plus

它是偏 PC 端的。

如果是手机 H5、触屏操作优先、底部弹层和手势交互很多，那一般还是移动端组件库更顺手。

---

## 十二、如果主人问我该怎么选

我会直接这么建议：

- 做后台管理系统、运营平台、表格密集型页面
  - 先学 `Element Plus`
- 做移动端 H5 页面
  - 先学移动端组件库
- 做品牌官网、营销页、强定制视觉页面
  - 组件库可以少一点，自己写样式的比例会更高

也就是说：

**Element Plus 最强的地方，不是“做任何页面都万能”，而是“做中后台特别省”。**

---

## 十三、给主人一份最短记忆版

如果主人现在只想先抓重点，那就记这 6 句：

1. `Element Plus` 是 `Vue 3` 常见的 PC 端组件库
2. 快速接入：`npm i element-plus`
3. 最简单：`app.use(ElementPlus)` + `import 'element-plus/dist/index.css'`
4. 正式项目更常见：`Vite + 自动按需导入`
5. 改主题优先用 `CSS 变量`
6. 中文、多语言、暗黑模式，官方都已经给了标准方案

---

## 十四、官方资料入口

这篇内容对应的官方资料我给主人放在这里，后面要继续深挖时直接看：

- 官方快速开始：
  - [https://element-plus.org/zh-CN/guide/quickstart.html](https://element-plus.org/zh-CN/guide/quickstart.html)
- 官方安装说明：
  - [https://element-plus.org/zh-CN/guide/installation.html](https://element-plus.org/zh-CN/guide/installation.html)
- 官方主题定制：
  - [https://element-plus.org/zh-CN/guide/theming.html](https://element-plus.org/zh-CN/guide/theming.html)
- 官方国际化：
  - [https://element-plus.org/zh-CN/guide/i18n.html](https://element-plus.org/zh-CN/guide/i18n.html)
- 官方暗黑模式：
  - [https://element-plus.org/zh-CN/guide/dark-mode.html](https://element-plus.org/zh-CN/guide/dark-mode.html)
- 官方发布记录：
  - [https://github.com/element-plus/element-plus/releases](https://github.com/element-plus/element-plus/releases)

---

## 十五、最后一句话总结

主人如果前面学到的是移动端组件库，那现在把 `Element Plus` 补上，刚好就是把 **Vue 项目里最常见的 PC 端 UI 组件库** 这一块拼完整。

它不是拿来替代 CSS 基础的。

它更像是：

**你已经会写 Vue 页面了，现在开始学会更高效率地搭中后台。**
