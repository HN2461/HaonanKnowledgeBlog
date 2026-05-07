---
title: Vue Router 超详细总笔记
date: 2026-04-27
category: Vue
tags:
  - Vue Router
  - Vue2
  - Vue3
  - 路由守卫
  - 动态路由
  - 传参
description: 面向长期复习的一站式 Vue Router 总笔记，系统整理基础概念、Vue2/Vue3 差异、路由配置项、每种传参形式、导航方式、嵌套与命名视图、守卫、历史模式、动态添加路由、滚动行为、懒加载与高频踩坑。
---

# Vue Router 超详细总笔记

> 这篇笔记的目标是：以后复习 Vue Router，只看这一篇就够。
>
> 所以它不是“只讲项目套路”的版本，也不是“只讲入门 demo”的版本，而是尽量把 Vue Router 的知识点按体系讲全。
>
> 阅读建议：
>
> - 第一次学：从前往后看
> - 复习时：优先看“速记总览”和“高频易混点”
> - 写代码时：直接跳到对应专题查

---

## 一、速记总览

这一节先帮你建立总图，后面再细讲。

### 1. Vue Router 是什么

Vue Router 是 Vue 官方的路由管理器，用来完成：

- URL 和组件的映射
- 单页应用中的无刷新切换
- 浏览器前进、后退管理
- 参数传递
- 嵌套路由
- 路由守卫
- 懒加载
- 动态添加路由

### 2. Router 中最常见的 8 个对象/概念

- `route`：单个路由规则
- `routes`：路由规则数组
- `router`：路由器实例
- `<router-link>`：声明式导航
- `<router-view>`：路由出口
- `$route` / `useRoute()`：当前路由信息
- `$router` / `useRouter()`：操作路由的对象
- `meta`：路由元信息，自定义附加数据

### 3. 复习时最容易混的 6 组内容

#### `route` 和 `router`

- `route` 是“当前去哪了”
- `router` 是“整个路由器对象”

#### `params` 和 `query`

- `params` 更像路径参数
- `query` 更像查询参数

#### Hash 和 History

- Hash：带 `#`
- History：不带 `#`，但刷新需要后端兜底

#### 动态参数路由 和 动态添加路由

- `/user/:id` 是动态参数路由
- `router.addRoute()` 是动态添加路由

#### 声明式导航 和 编程式导航

- `<router-link>` 是声明式
- `router.push()` 是编程式

#### 路由组件 和 普通组件

- 路由组件通常由路由规则切换出来
- 普通组件通常由父组件 `import` 并注册使用

### 4. 一句话掌握 Vue Router 的本质

> Vue Router 的本质，是一套“地址变化后该渲染哪个组件”的规则系统。

---

## 二、为什么需要 Vue Router

### 1. 传统多页应用 MPA

多页应用中：

- 一个地址通常对应一个 HTML 页面
- 点击链接会重新请求整个页面
- 浏览器重新加载页面资源

特点：

- 刷新明显
- 页面切换体验一般
- 由服务器负责页面返回

### 2. 单页应用 SPA

Vue 常见开发模式是单页应用：

- 整个网站通常只有一个 `index.html`
- 后续页面切换由前端 JavaScript 控制
- 地址变了，但页面不整刷

特点：

- 切换快
- 交互体验流畅
- URL 仍可表示当前页面位置

### 3. Vue Router 的作用

它在 SPA 里负责：

1. 监听地址变化
2. 匹配对应路由
3. 在 `<router-view>` 中渲染对应组件
4. 管理浏览器历史记录

所以 Router 不是“简单的跳转插件”，而是：

> SPA 的页面组织与导航系统。

---

## 三、Vue2 和 Vue3 的 Router 差异

这部分特别重要，因为很多资料混写，容易抄错。

| 对比项 | Vue 2 | Vue 3 |
| --- | --- | --- |
| Router 版本 | `vue-router@3` | `vue-router@4` |
| 创建方式 | `new VueRouter()` | `createRouter()` |
| 历史模式配置 | `mode: 'hash'` / `mode: 'history'` | `createWebHashHistory()` / `createWebHistory()` |
| 挂载方式 | `new Vue({ router })` | `app.use(router)` |
| 组件中获取 | `this.$route` / `this.$router` | `useRoute()` / `useRouter()` 或 `this` |
| 404 通配写法 | 常见 `*` | `/:pathMatch(.*)*` |
| 动态注册路由 | `addRoutes()`（Vue Router 3 已废弃） | `addRoute()`（Vue Router 4 移除了 `addRoutes`） |

### 记忆方法

- Vue2 是“构造函数风格”
- Vue3 是“工厂函数风格”

### 新项目建议

如果你是写新项目：

- 默认优先掌握 Vue3 + Vue Router 4

如果你是维护旧项目：

- Vue2 的 Router 也必须能读

因为两者：

- 本质概念是通的
- 只是 API 表现不同

---

## 四、核心概念全解

## 4.1 `route`

`route` 指单个路由规则。

最基本写法：

```js
{
  path: '/home',
  component: HomePage
}
```

意思：

- 当路径匹配 `/home`
- 渲染 `HomePage`

## 4.2 `routes`

`routes` 指由多个路由规则组成的数组。

```js
const routes = [
  { path: '/home', component: HomePage },
  { path: '/about', component: AboutPage }
]
```

## 4.3 `router`

`router` 是通过 `createRouter()` 或 `new VueRouter()` 创建的路由器实例。

它负责：

- 路由匹配
- 导航切换
- 历史记录管理
- 守卫注册
- 动态添加路由

## 4.4 `$route` / `useRoute()`

表示当前路由信息对象，偏“读”。

常见字段：

- `route.path`
- `route.name`
- `route.params`
- `route.query`
- `route.hash`
- `route.fullPath`
- `route.meta`
- `route.matched`
- `route.redirectedFrom`

## 4.5 `$router` / `useRouter()`

表示整个路由器对象，偏“操作”。

常见方法：

- `push`
- `replace`
- `back`
- `forward`
- `go`
- `addRoute`
- `removeRoute`
- `hasRoute`
- `getRoutes`

## 4.6 `<router-link>`

负责跳转。

相当于 Vue Router 版的导航链接。

优点：

- 不刷新整页
- 自动跟历史记录联动
- 支持对象式跳转
- 支持激活态 class

## 4.7 `<router-view>`

负责显示匹配到的组件。

如果有嵌套路由：

- 父组件里必须继续放 `<router-view>`

---

## 五、最小可运行示例

下面先用 Vue3 写一份完整最小版。

### 1. 安装

```bash
npm install vue-router@4
```

### 2. `src/router/index.js`

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

### 3. `main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

const app = createApp(App)

// 必须先注册路由，再挂载应用
app.use(router)
app.mount('#app')
```

### 4. `App.vue`

```vue
<template>
  <div>
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>

    <!-- 路由组件显示出口 -->
    <router-view />
  </div>
</template>
```

### 5. 复习时一定要会说的 3 步

1. 写 `routes`
2. 创建 `router`
3. `app.use(router)`，模板中放 `<router-view>`

---

## 六、路由规则对象都能写什么

这是非常重要的一节。很多人只会写 `path` 和 `component`，其实一个路由规则还可以写很多配置。

常见字段：

- `path`
- `name`
- `component`
- `components`
- `redirect`
- `alias`
- `children`
- `meta`
- `props`
- `beforeEnter`

### 1. `path`

路径。

```js
{
  path: '/home'
}
```

### 2. `name`

命名路由。

```js
{
  path: '/home',
  name: 'home'
}
```

### 3. `component`

单个视图组件。

```js
{
  path: '/home',
  component: HomePage
}
```

### 4. `components`

命名视图，一个路由同时渲染多个区域。注意是复数 `components`，不是 `component`。

```js
{
  path: '/dashboard',
  components: {
    default: DashboardPage,   // 对应 <router-view />（无 name）
    sidebar: SidebarPanel,    // 对应 <router-view name="sidebar" />
    header: HeaderPanel       // 对应 <router-view name="header" />
  }
}
```

模板里需要对应写多个 `<router-view>`：

```vue
<template>
  <router-view name="header" />
  <router-view name="sidebar" />
  <router-view />            <!-- default -->
</template>
```

容易忘的点：

- 用了 `components`（复数），模板里就必须有对应 `name` 的 `<router-view>`，否则那个区域什么都不渲染
- `default` 对应没有 `name` 属性的 `<router-view />`
- 普通单组件路由用 `component`（单数），命名视图才用 `components`（复数）

### 5. `redirect`

重定向，访问 A 路径自动跳到 B。

```js
// 字符串写法
{ path: '/', redirect: '/home' }

// 命名路由写法（推荐，路径改了也不用改这里）
{ path: '/', redirect: { name: 'home' } }

// 函数写法（可以根据条件动态决定跳哪里）
{
  path: '/',
  redirect: to => {
    const token = localStorage.getItem('token')
    return token ? '/home' : '/login'
  }
}
```

容易忘的点：

- `redirect` 会改变 URL，用户最终看到的是目标路径
- 和 `alias` 的区别：`redirect` 跳走了，`alias` URL 不变但渲染同一个组件

### 6. `alias`

别名，让同一个组件可以被多个路径访问，但 URL 不会跳转。

```js
{
  path: '/home',
  alias: '/index',       // 访问 /index，URL 保持 /index，但渲染 HomePage
  component: HomePage
}

// 也可以配多个别名
{
  path: '/home',
  alias: ['/index', '/main'],
  component: HomePage
}
```

容易忘的点：

- `alias` 不改变 URL，用户访问 `/index` 看到的地址栏还是 `/index`
- `redirect` 会改变 URL，用户访问 `/` 地址栏会变成 `/home`
- 别名常用于：旧路径兼容、SEO 多入口、短路径映射

### 7. `children`

嵌套子路由，父路由下再挂一层路由。

```js
{
  path: '/home',
  component: HomeLayout,
  children: [
    {
      path: '',          // 空字符串 = 访问 /home 时默认渲染这个
      component: HomeDefaultPage
    },
    {
      path: 'hot',       // 不加 /，最终路径是 /home/hot
      name: 'home-hot',
      component: HomeHotPage
    },
    {
      path: 'new',
      name: 'home-new',
      component: HomeNewPage
    }
  ]
}
```

容易忘的点：

- 子路由 `path` 不加 `/`，写相对路径，最终会自动拼成 `/home/hot`
- 如果加了 `/` 变成 `/hot`，就是绝对路径，和父路由没有嵌套关系了
- 父组件 `HomeLayout` 里必须有 `<router-view />`，否则子路由没地方渲染
- `path: ''` 表示访问父路径 `/home` 时默认展示的子组件（也可以用 `redirect` 代替）
- 子路由也可以继续嵌套 `children`，形成多级嵌套

### 8. `meta`

路由元信息，自定义数据。

```js
{
  path: '/cart',
  component: CartPage,
  meta: {
    title: '购物车',
    requiresAuth: true
  }
}
```

### 9. `props`

把路由参数转成组件的 `props`，让组件不用直接依赖 `$route` / `useRoute()`，更易复用和测试。

有三种写法：

**布尔值（最常用）**：把 `params` 全量映射成 props

```js
{
  path: '/user/:id',
  component: UserDetailPage,
  props: true   // route.params.id 会作为 prop id 传给组件
}
```

组件里直接用 `defineProps(['id'])` 接收，不用再写 `useRoute()`。

**函数（最灵活）**：可以同时取 params、query，还能加固定值

```js
{
  path: '/user/:id',
  component: UserDetailPage,
  props: route => ({
    id: route.params.id,
    from: route.query.from,   // query 也能传进来
    title: '用户详情'          // 固定值也行
  })
}
```

**对象（较少用）**：只能传固定值，不能取路由参数

```js
{
  path: '/about',
  component: AboutPage,
  props: { source: 'router' }
}
```

容易忘的点：

- `props: true` 只映射 `params`，不映射 `query`；想要 `query` 必须用函数写法
- 命名视图时，`props` 要对每个视图分别配置：`props: { default: true, sidebar: false }`
- 用了 `props` 之后，组件里就不需要再 `import { useRoute }` 了，组件更纯粹

### 10. `beforeEnter`

路由独享守卫。

```js
{
  path: '/admin',
  component: AdminPage,
  beforeEnter: (to, from) => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      return '/home'
    }
  }
}
```

---

## 七、`<router-link>` 详细讲透

很多人只知道 `to="/home"`，其实它支持很多形式。

## 7.1 最基础写法

```vue
<router-link to="/home">首页</router-link>
```

## 7.2 对象写法

```vue
<router-link :to="{ path: '/home' }">首页</router-link>
```

## 7.3 命名路由写法

```vue
<router-link :to="{ name: 'home' }">首页</router-link>
```

## 7.4 携带 `query`

```vue
<router-link
  :to="{
    name: 'search',
    query: {
      keyword: 'vue',
      page: 2
    }
  }"
>
  搜索
</router-link>
```

## 7.5 携带 `params`

前提：路由必须有占位符，且必须用 `name` 而不是 `path`。

```vue
<router-link
  :to="{
    name: 'user-detail',
    params: {
      id: 1001
    }
  }"
>
  用户详情
</router-link>
```

对应的路由规则必须有 `:id` 占位符：

```js
{
  path: '/user/:id',
  name: 'user-detail',
  component: UserDetailPage
}
```

容易忘的点：

- 必须用 `name` 配合 `params`，不能用 `path` 配 `params`
- 用 `path` 时 `params` 会被直接忽略（Vue Router 4 会有控制台警告）
- 如果想用 `path`，就自己把参数拼进去：`:to="'/user/' + item.id"`
- `params` 参数会体现在 URL 路径里（`/user/1001`），刷新不丢失
- 组件里用 `route.params.id` 或 `props: true` 接收

## 7.6 带 `hash`

跳转到页面内的锚点位置。

```vue
<router-link
  :to="{
    path: '/article',
    hash: '#comment'
  }"
>
  跳到评论区
</router-link>
```

容易忘的点：

- `hash` 值要带 `#`，写成 `'#comment'` 而不是 `'comment'`
- 跳转后 URL 变成 `/article#comment`，浏览器会自动滚动到 `id="comment"` 的元素
- 可以配合 `scrollBehavior` 做更精细的滚动控制

## 7.7 `replace`

默认 `<router-link>` 是 `push` 行为，会新增历史记录，用户可以点浏览器后退回来。

加了 `replace` 之后，不新增历史记录，直接替换当前记录：

```vue
<router-link to="/login" replace>登录</router-link>
```

等价于编程式导航：

```js
router.replace('/login')
```

什么时候用 `replace`：

- 登录成功后跳首页，不希望用户后退回登录页
- 表单提交成功后跳结果页，不希望后退重复提交
- 重定向场景，不需要保留中间跳转记录

## 7.8 激活样式

Vue Router 会自动给当前激活的链接加 class，有两个，含义不同：

- `router-link-active`：**模糊匹配**，当前路径包含该链接路径时就加。比如当前在 `/home/hot`，`/home` 的链接也会加这个 class
- `router-link-exact-active`：**精确匹配**，当前路径和链接路径完全一致才加

```
当前路径：/home/hot

/home      → router-link-active ✓（包含关系）
/home/hot  → router-link-active ✓ + router-link-exact-active ✓（完全匹配）
/about     → 都不加
```

实际开发中，导航菜单高亮通常用 `router-link-active`（模糊匹配），这样父级菜单也能跟着高亮。

单条链接精确高亮用 `router-link-exact-active`。

自定义 class 名：

`active-class` 和 `exact-active-class` 是 `<router-link>` 的属性，用来把默认的 class 名替换成你自己的名字：

```
router-link-active       ← 默认 class 名（加在 HTML 元素上的）
active-class="active"    ← 用这个属性把它改名叫 "active"

router-link-exact-active          ← 默认 class 名
exact-active-class="exact-active" ← 用这个属性把它改名叫 "exact-active"
```

```vue
<router-link to="/home" active-class="active" exact-active-class="exact-active">
  首页
</router-link>
```

加了之后，元素上就不再是 `router-link-active`，而是你写的 `active`。

全局统一配置（推荐，不用每个链接都写）：

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active'
})
```

## 7.9 自定义模式 `custom`

高级用法，完全自定义渲染，不再输出默认的 `<a>` 标签。

```vue
<router-link to="/home" custom v-slot="{ href, navigate, isActive, isExactActive }">
  <span
    :class="{ active: isActive, 'exact-active': isExactActive }"
    @click="navigate"
  >
    首页
  </span>
</router-link>
```

`v-slot` 暴露的常用变量：

- `href`：解析后的目标 URL 字符串，可以绑给 `<a>` 的 `href`
- `navigate`：触发导航的函数，绑给点击事件
- `isActive`：是否模糊激活（对应 `router-link-active`）
- `isExactActive`：是否精确激活（对应 `router-link-exact-active`）

适合场景：

- UI 组件库里的菜单项，不能直接用 `<a>` 标签
- 需要在链接外层包一层复杂结构
- 需要同时拿到 `href` 和激活状态做自定义渲染

---

## 八、`<router-view>` 详细讲透

## 8.1 基本写法

```vue
<router-view />
```

## 8.2 嵌套路由中的作用

如果父路由有 `children`，父组件中必须写：

```vue
<router-view />
```

否则子页面没有显示位置。

## 8.3 命名视图中的写法

```vue
<router-view name="header" />
<router-view />
<router-view name="footer" />
```

## 8.4 配合插槽使用

`<router-view>` 提供了 `v-slot`，让你能拿到当前匹配的组件和路由信息，自己控制渲染方式。

```vue
<router-view v-slot="{ Component, route }">
  <component :is="Component" :key="route.fullPath" />
</router-view>
```

- `Component`：当前路由匹配到的组件，等价于路由规则里的 `component`
- `route`：当前路由信息对象，等价于 `useRoute()` 的返回值

直接写 `<component :is="Component" />` 和写 `<router-view />` 效果一样，但中间可以插入其他东西。

**用途一：加过渡动画**

```vue
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

**用途二：配合 keep-alive 缓存**

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

**用途三：用 `key` 强制刷新组件**

```vue
<router-view v-slot="{ Component, route }">
  <!-- key 变化时，组件会销毁重建，解决同组件不同参数不刷新的问题 -->
  <component :is="Component" :key="route.fullPath" />
</router-view>
```

这三种也可以组合用：

```vue
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </transition>
</router-view>
```

---

## 九、路由传参，一次彻底讲全

这一节是重中之重。

你提到“每个传参形式都要讲”，那这里我把常见方式全部整理出来。

## 9.1 先建立分类

路由传参常见有三类：

1. `query` 传参
2. `params` 传参
3. `props` 接参

注意：

- `query` 和 `params` 是“路由层传”
- `props` 是“组件层接”

---

## 十、`query` 传参的所有常见形式

`query` 参数最终会出现在地址栏 `?` 后面。

例如：

```text
/detail?id=1001&from=list
```

### 1. 字符串拼接，静态值

```vue
<router-link to="/detail?id=1001">详情</router-link>
```

### 2. 字符串拼接，动态值

```vue
<router-link :to="`/detail?id=${item.id}`">
  详情
</router-link>
```

### 3. 多个 `query`

```vue
<router-link :to="`/detail?id=${item.id}&from=list&type=hot`">
  详情
</router-link>
```

### 4. 对象写法，推荐

```vue
<router-link
  :to="{
    path: '/detail',
    query: {
      id: item.id,
      from: 'list'
    }
  }"
>
  详情
</router-link>
```

### 5. 对象写法 + `name`

```vue
<router-link
  :to="{
    name: 'detail',
    query: {
      id: item.id,
      from: 'list'
    }
  }"
>
  详情
</router-link>
```

### 6. 编程式导航传 `query`

```js
router.push({
  path: '/detail',
  query: {
    id: item.id,
    from: 'list'
  }
})
```

### 7. 接收 `query`

#### Vue2

```js
this.$route.query.id
this.$route.query.from
```

#### Vue3

```js
const route = useRoute()
console.log(route.query.id)
console.log(route.query.from)
```

### 8. `query` 的特点

- 地址栏可见
- 刷新不会丢
- 非常适合列表页筛选条件
- 适合分页、排序、关键词、tab 状态

---

## 十一、`params` 传参的所有常见形式

`params` 一般依赖动态路径占位符。

例如路由规则：

```js
{
  path: '/detail/:id',
  name: 'detail',
  component: DetailPage
}
```

这里的 `:id` 就是占位符。

## 11.1 字符串拼接，静态值

```vue
<router-link to="/detail/1001">详情</router-link>
```

## 11.2 字符串拼接，动态值

```vue
<router-link :to="`/detail/${item.id}`">
  详情
</router-link>
```

## 11.3 多个 `params`

路由：

```js
{
  path: '/detail/:id/:type',
  name: 'detail',
  component: DetailPage
}
```

跳转：

```vue
<router-link :to="`/detail/${item.id}/hot`">
  详情
</router-link>
```

## 11.4 对象写法，推荐

```vue
<router-link
  :to="{
    name: 'detail',
    params: {
      id: item.id
    }
  }"
>
  详情
</router-link>
```

## 11.5 编程式导航传 `params`

```js
router.push({
  name: 'detail',
  params: {
    id: item.id
  }
})
```

## 11.6 接收 `params`

#### Vue2

```js
this.$route.params.id
```

#### Vue3

```js
const route = useRoute()
console.log(route.params.id)
```

## 11.7 `params` 的重要注意点

### 注意点 1：通常要有占位符

Vue3 中常规 `params` 用法，路由里通常要写动态段：

```js
path: '/detail/:id'
```

### 注意点 2：对象写法时推荐配合 `name`

推荐：

```js
router.push({
  name: 'detail',
  params: { id: 1001 }
})
```

### 注意点 3：同时写了 `path` 和 `params`，`params` 会被直接忽略

这不是"可能"，而是确定行为。Vue Router 4 会在控制台输出警告：

> `"/detail" was passed with params but they will be ignored. Use a named route alongside params instead.`

比如：

```js
// 错误写法，params 会被忽略
router.push({
  path: '/detail',
  params: { id: 1001 }
})
```

正确做法：

```js
// 方式一：用 name 配合 params
router.push({ name: 'detail', params: { id: 1001 } })

// 方式二：用 path 自己拼参数
router.push({ path: `/detail/${item.id}` })
```

### 注意点 4：`params` 更适合资源标识

例如：

- 用户 id
- 文章 id
- 订单 id

---

## 十二、`query` 和 `params` 的区别总结

| 对比项 | `query` | `params` |
| --- | --- | --- |
| 地址表现 | `?id=1` | `/detail/1` |
| 是否需要占位符 | 不需要 | 通常需要 |
| 刷新是否丢失 | 不丢 | 不丢 |
| 更适合场景 | 搜索、分页、筛选 | 详情页、资源 id |
| 对象写法常搭配 | `path` 或 `name` 都行 | 推荐 `name` |

### 最推荐记法

- 列表条件用 `query`
- 详情标识用 `params`

---

## 十三、`props` 接参三种写法

`props` 的意义是：

> 把路由信息转换成组件的 `props`，减少组件对 `$route` 或 `useRoute()` 的直接依赖。

## 13.1 对象写法

比较少用，一般用于固定值。

```js
{
  path: '/detail/:id',
  name: 'detail',
  component: DetailPage,
  props: {
    title: '详情页',
    source: 'router'
  }
}
```

组件接收：

```vue
<script setup>
const props = defineProps(['title', 'source'])
</script>
```

## 13.2 布尔值写法

最常见，用于把 `params` 全量映射给组件。

```js
{
  path: '/detail/:id',
  name: 'detail',
  component: DetailPage,
  props: true
}
```

组件接收：

```vue
<script setup>
const props = defineProps(['id'])
</script>
```

### 说明

这里会把 `route.params.id` 自动传成组件的 `id`。

## 13.3 函数写法

最灵活，也是项目里最推荐的高级写法。

```js
{
  path: '/detail/:id',
  name: 'detail',
  component: DetailPage,
  props: route => ({
    id: route.params.id,
    from: route.query.from,
    title: '详情'
  })
}
```

组件接收：

```vue
<script setup>
const props = defineProps(['id', 'from', 'title'])
</script>
```

### 函数写法的优势

- 可以同时取 `params`
- 可以同时取 `query`
- 可以带固定值
- 组件内部更干净

---

## 十四、所有常见跳转形式一次列全

## 14.1 声明式导航

### 1. 最基础字符串

```vue
<router-link to="/home">首页</router-link>
```

### 2. 对象 + `path`

```vue
<router-link :to="{ path: '/home' }">首页</router-link>
```

### 3. 对象 + `name`

```vue
<router-link :to="{ name: 'home' }">首页</router-link>
```

### 4. 对象 + `query`

```vue
<router-link
  :to="{
    name: 'search',
    query: {
      keyword: 'vue'
    }
  }"
>
  搜索
</router-link>
```

### 5. 对象 + `params`

```vue
<router-link
  :to="{
    name: 'detail',
    params: {
      id: 1001
    }
  }"
>
  详情
</router-link>
```

### 6. 对象 + `query` + `hash`

```vue
<router-link
  :to="{
    path: '/article',
    query: {
      id: 1
    },
    hash: '#comment'
  }"
>
  评论区
</router-link>
```

## 14.2 编程式导航

### 1. `push`

新增一条历史记录，用户可以点后退回来。

```js
// 字符串路径
router.push('/home')

// 对象 + path
router.push({ path: '/home' })

// 对象 + name（推荐，路径改了不用改这里）
router.push({ name: 'home' })

// 带 params（必须用 name，不能用 path）
router.push({ name: 'detail', params: { id: 1001 } })

// 带 query
router.push({ path: '/search', query: { keyword: 'vue', page: 1 } })

// 带 hash
router.push({ path: '/article', hash: '#comment' })
```

Vue Router 4 中 `push` 返回 Promise，可以 `await` 等待导航完成或捕获失败：

```js
// 捕获导航失败（被守卫拦截、重复导航等）
try {
  await router.push({ name: 'home' })
} catch (err) {
  console.log('导航失败', err)
}
```

### 2. `replace`

替换当前历史记录，用户点后退回不来。

```js
router.replace('/login')
router.replace({ name: 'login' })
```

什么时候用 `replace` 而不是 `push`：

- 登录成功后跳首页，不希望后退回登录页
- 表单提交成功后跳结果页，不希望后退重复提交
- 重定向场景

也可以在 `push` 里加 `replace: true`，效果一样：

```js
router.push({ name: 'home', replace: true })
```

### 3. `back` / `forward` / `go`

操作浏览器历史记录栈：

```js
router.back()      // 后退一步，等价于 router.go(-1)
router.forward()   // 前进一步，等价于 router.go(1)

router.go(-1)      // 后退 1 步
router.go(-2)      // 后退 2 步
router.go(1)       // 前进 1 步
router.go(0)       // 刷新当前页
```

注意：如果历史记录不够，`go` 会静默失败，不报错。

### 4. 登录拦截 + 回跳完整写法

这是项目里最常见的场景，分两步：

**第一步：守卫里记录来源路径**

```js
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    // 把当前要去的路径存进 query，登录后用来回跳
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }
})
```

**第二步：登录成功后跳回去**

```js
// 登录成功后
const redirect = route.query.redirect || '/home'
router.replace(redirect)  // 用 replace，不留登录页历史记录
```

用 `replace` 而不是 `push`，是为了让用户登录后点后退不会再回到登录页。

---

## 十五、嵌套路由详细讲透

## 15.1 为什么要嵌套

常见场景：

- 页面里还有子区域切换
- 主布局固定，内容区切换
- 一个父页面下有多个 tab 子页面

## 15.2 路由配置

```js
{
  path: '/home',
  component: HomeLayout,
  children: [
    {
      path: 'hot',
      name: 'home-hot',
      component: HomeHotPage
    },
    {
      path: 'new',
      name: 'home-new',
      component: HomeNewPage
    }
  ]
}
```

## 15.3 父组件必须预留出口

```vue
<template>
  <div>
    <h1>首页布局</h1>

    <router-link to="/home/hot">热门</router-link>
    <router-link to="/home/new">最新</router-link>

    <!-- 子路由显示位置 -->
    <router-view />
  </div>
</template>
```

## 15.4 子路由路径写法

### 推荐写法

```js
path: 'hot'
```

### 不推荐乱写成绝对路径

```js
path: '/home/hot'
```

虽然某些场景能工作，但它的语义已经不是真正的“相对子路由”了。

### 复习结论

> 子路由一般写相对路径，不加 `/`。

---

## 十六、命名视图详细讲透

命名视图的作用：

> 一个路由同时渲染多个视图区域。

## 16.1 路由配置

```js
{
  path: '/dashboard',
  components: {
    default: DashboardPage,
    header: HeaderPanel,
    sidebar: SidebarPanel
  }
}
```

## 16.2 模板写法

```vue
<template>
  <router-view name="header" />
  <router-view name="sidebar" />
  <router-view />
</template>
```

### 说明

- `default` 对应默认 `<router-view />`
- 其他名字对应 `<router-view name="xxx" />`

### 使用场景

- 特殊布局区域
- 某些复杂后台页

---

## 十七、命名路由、重定向、别名、404

## 17.1 命名路由

```js
{
  path: '/home',
  name: 'home',
  component: HomePage
}
```

为什么推荐：

- 跳转稳定
- 改路径成本低
- `params` 对象传参更方便

## 17.2 重定向

### 字符串写法

```js
{
  path: '/',
  redirect: '/home'
}
```

### 命名写法

```js
{
  path: '/',
  redirect: { name: 'home' }
}
```

## 17.3 别名

```js
{
  path: '/home',
  alias: '/index',
  component: HomePage
}
```

### 区别总结

- `redirect`：访问 A，跳到 B
- `alias`：A 和 B 都能访问同一个路由

## 17.4 404 页面

Vue3 常见写法：

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFoundPage
}
```

### 为什么不是直接 `*`

因为 Vue Router 4 推荐用动态参数 + 正则匹配的形式来兜底所有路径。

### 注意

404 路由必须放最后。

---

## 十八、动态路由匹配语法进阶

这一节是很多教程不会细讲，但 Router 本身很重要的能力。

## 18.1 基本动态参数

```js
{
  path: '/user/:id'
}
```

可匹配：

```text
/user/1
/user/2
/user/10086
```

## 18.2 多个动态参数

```js
{
  path: '/order/:orderId/:type'
}
```

## 18.3 自定义正则匹配

例如只匹配数字 id：

```js
{
  path: '/user/:id(\\d+)'
}
```

### 含义

- `:id` 是参数名
- `(\\d+)` 表示只匹配数字

## 18.4 可重复参数

```js
{
  path: '/chapters/:chapters+'
}
```

`+` 表示：

- 至少一个
- 可重复

## 18.5 可选重复参数

```js
{
  path: '/chapters/:chapters*'
}
```

`*` 表示：

- 可有可无
- 可重复

## 18.6 可选参数

```js
{
  path: '/user/:id?'
}
```

`?` 表示这个参数可选。

### 复习提醒

这块属于“路径匹配语法”，比普通传参更底层。

---

## 十九、路由组件复用与更新问题

这一节必须重视。

### 为什么会复用

当从：

```text
/user/1
```

切到：

```text
/user/2
```

时，匹配的仍然是同一个组件。

所以 Vue 很可能直接复用原组件实例。

### 后果

- `mounted` 不重新执行
- 数据可能不更新

### 解决方案 1：`watch`

```vue
<script setup>
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()

watch(
  () => route.params.id,
  (newId) => {
    fetchUserDetail(newId)
  },
  { immediate: true }
)

function fetchUserDetail(id) {
  console.log('请求用户详情', id)
}
</script>
```

### 解决方案 2：组件内更新守卫

#### Vue2 / 选项式

```js
beforeRouteUpdate(to, from, next) {
  this.fetchDetail(to.params.id)
  next()
}
```

#### Vue3 / 组合式

```js
onBeforeRouteUpdate((to) => {
  console.log('根据新 id 重新请求', to.params.id)
})
```

---

## 二十、路由守卫完整整理

路由守卫是高频考点，也是项目高频能力。

## 20.1 守卫分类

Vue Router 常见守卫：

- 全局前置守卫 `beforeEach`
- 全局解析守卫 `beforeResolve`
- 全局后置守卫 `afterEach`
- 路由独享守卫 `beforeEnter`
- 组件内守卫

组件内常见：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

Vue3 组合式：

- `onBeforeRouteUpdate`
- `onBeforeRouteLeave`

## 20.2 全局前置守卫

```js
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})
```

### 最常见用途

- 登录拦截
- 白名单控制
- 登录后回跳控制

## 20.3 全局解析守卫

```js
router.beforeResolve((to, from) => {
  console.log('所有组件和独享守卫解析完成后执行')
})
```

### 常见用途

- 最终确认前做额外检查
- 某些依赖异步数据的场景

## 20.4 全局后置守卫

```js
router.afterEach((to, from) => {
  document.title = to.meta.title || '默认标题'
})
```

后置守卫还支持第三个参数 `failure`，可以判断导航是否失败：

```js
router.afterEach((to, from, failure) => {
  if (!failure) {
    // 导航成功，做埋点
    sendToAnalytics(to.fullPath)
  }
})
```

### 常见用途

- 页面标题
- 埋点统计
- 关闭 loading
- 区分导航成功/失败做差异化处理

### 注意

后置守卫不能中断导航。

## 20.5 路由独享守卫

```js
{
  path: '/admin',
  component: AdminPage,
  beforeEnter: (to, from) => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      return '/home'
    }
  }
}
```

### 重要特性：不响应 params/query/hash 变化

`beforeEnter` 只在从不同路由进入时触发。

如果只是 `params`、`query`、`hash` 发生变化（比如从 `/user/1` 到 `/user/2`），`beforeEnter` 不会重新执行。

这是一个高频踩坑点：

```js
// 从 /user/1 跳到 /user/2，beforeEnter 不会再触发
// 如果需要响应参数变化，应该用 beforeRouteUpdate 或 watch
```

### 支持传入函数数组（复用守卫逻辑）

```js
function checkRole(to) {
  if (localStorage.getItem('role') !== 'admin') {
    return '/home'
  }
}

function checkExpiry(to) {
  if (isTokenExpired()) {
    return '/login'
  }
}

{
  path: '/admin',
  component: AdminPage,
  beforeEnter: [checkRole, checkExpiry]
}
```

这样可以把守卫逻辑拆成小函数，在多条路由间复用。

### 适合场景

- 某一条路由有特殊限制
- 需要复用多个守卫逻辑

## 20.6 组件内守卫

### `beforeRouteEnter`

进入当前路由组件前执行。

注意：

- 此时组件实例还没创建
- 不能直接用 `this`

```js
beforeRouteEnter(to, from, next) {
  next(vm => {
    console.log(vm)
  })
}
```

### `beforeRouteUpdate`

当前组件被复用，但路由变化时触发。

```js
beforeRouteUpdate(to, from, next) {
  this.fetchDetail(to.params.id)
  next()
}
```

### `beforeRouteLeave`

离开当前组件前执行。

Vue2 / 选项式写法（需要调用 `next`）：

```js
beforeRouteLeave(to, from, next) {
  const ok = window.confirm('确定离开吗？')
  if (!ok) {
    return next(false)  // Vue2 / 选项式：用 next(false) 取消
  }
  next()
}
```

Vue3 / 组合式写法（直接 `return false`）：废除了 next,

```js
onBeforeRouteLeave(() => {
  const ok = window.confirm('确定离开吗？')
  if (!ok) {
    return false  // Vue Router 4 组合式：直接 return false
  }
})
```

## 20.7 Vue3 组合式守卫

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to) => {
  console.log('参数变化', to.params.id)
})

onBeforeRouteLeave(() => {
  const ok = window.confirm('确定离开吗？')
  if (!ok) {
    return false
  }
})
```

### 注意

组合式 API 中没有 `onBeforeRouteEnter` 对应写法。

---

## 二十一、守卫执行顺序要知道

一个常见导航中，大致顺序是：

1. 失活组件的 `beforeRouteLeave`
2. 全局前置守卫 `beforeEach`
3. 复用组件的 `beforeRouteUpdate`
4. 路由独享守卫 `beforeEnter`
5. 解析异步组件
6. 激活组件的 `beforeRouteEnter`
7. 全局解析守卫 `beforeResolve`
8. 导航确认
9. 全局后置守卫 `afterEach`
10. DOM 更新
11. `beforeRouteEnter` 中 `next(vm => {})` 回调执行

### 复习提醒

真正最常考的是：

- `beforeEach`
- `beforeEnter`
- `beforeRouteLeave`

---

## 二十二、路由元信息 `meta` 详细讲透

`meta` 就是路由上的自定义信息。

## 22.1 最基础用法

```js
{
  path: '/cart',
  component: CartPage,
  meta: {
    title: '购物车',
    requiresAuth: true
  }
}
```

## 22.2 常见用途

- 页面标题
- 是否需要登录
- 角色权限
- 菜单图标
- 是否隐藏
- 是否缓存
- 面包屑文案
- 详情页高亮哪个菜单

## 22.3 常见字段示例

```js
meta: {
  title: '用户管理',
  requiresAuth: true,
  roles: ['admin'],
  hidden: false,
  keepAlive: true,
  icon: 'user',
  activeMenu: '/system/user'
}
```

---

## 二十三、路由历史模式完整讲透

## 23.1 Hash 模式

写法：

```js
createWebHashHistory()
```

URL 例子：

```text
http://localhost:5173/#/home
```

优点：

- 部署简单
- 对静态托管友好
- 刷新通常不 404

缺点：

- 地址里带 `#`
- 不够美观

## 23.2 History 模式

写法：

```js
createWebHistory()
```

部署在子路径时可以传 `base`：

```js
// 部署在 /my-app/ 下
createWebHistory('/my-app/')
```

URL 例子：

```text
http://localhost:5173/home
```

优点：

- 地址更自然
- 更像真实站点路径

缺点：

- 刷新时需要后端回退到 `index.html`

## 23.3 Memory 模式

写法：

```js
createMemoryHistory()
```

用途：

- 非浏览器环境
- SSR 某些场景

平时前端页面项目里接触较少。

## 23.4 History 刷新 404 原因

因为浏览器刷新 `/user/1` 时，会直接请求服务器这个路径。

如果服务器没有对应物理资源，就会返回 404。

Nginx 常见配置：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 二十四、滚动行为 `scrollBehavior`

它用来控制路由切换后的滚动位置。

## 24.1 基础写法

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  }
})
```

## 24.2 参数说明

- `to`：去哪里
- `from`：从哪里来
- `savedPosition`：浏览器前进后退时保存的位置

## 24.3 常见返回值

### 回顶部

```js
return { top: 0 }
```

### 恢复原位置

```js
if (savedPosition) {
  return savedPosition
}
```

### 滚动到锚点

```js
if (to.hash) {
  return {
    el: to.hash
  }
}
```

---

## 二十五、懒加载路由

当项目变大时，应该按需加载页面组件。

## 25.1 静态导入

```js
import UserPage from '@/views/UserPage.vue'
```

## 25.2 懒加载导入

```js
{
  path: '/user',
  component: () => import('@/views/UserPage.vue')
}
```

### 优点

- 减少首屏包体积
- 访问页面时再加载资源

### 常见建议

- 业务页面优先懒加载
- 非常核心的入口页可按需决定

---

## 二十六、`keep-alive` 和 Router 的关系

虽然 `keep-alive` 不是 Vue Router 专属 API，但路由场景里特别常用。

## 26.1 为什么需要缓存

例如：

- 列表页筛选后进详情页，再返回时保留状态
- tab 页面频繁切换不想重载
- 表单切换后不想丢内容

## 26.2 基本写法

```vue
<router-view v-slot="{ Component, route }">
  <keep-alive :include="cachedViews">
    <component :is="Component" :key="route.name" />
  </keep-alive>
</router-view>
```

## 26.3 `include` / `exclude` / `max`

```vue
<keep-alive :include="['user-list']" />
<keep-alive :exclude="['user-detail']" />
<keep-alive :max="10" />
```

## 26.4 注意

- `include` / `exclude` 依赖组件名
- 缓存不是越多越好
- 列表页更适合缓存，详情页不一定适合

## 26.5 缓存组件的额外生命周期

- `activated`
- `deactivated`

适合处理：

- 定时器恢复
- 定时器暂停
- 某些缓存页面的状态恢复

---

## 二十七、Composition API 和 Router

Vue3 中路由常与组合式 API 搭配使用。

## 27.1 `useRoute()`

```js
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
console.log(route.query.keyword)
```

## 27.2 `useRouter()`

```js
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/home')
```

## 27.3 监听路由变化

```js
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.fullPath,
  (newPath) => {
    console.log('路由变化了', newPath)
  }
)
```

## 27.4 组合式守卫

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to) => {
  console.log(to.params.id)
})

onBeforeRouteLeave(() => {
  return window.confirm('确定离开吗？')
})
```

---

## 二十八、数据获取和 Router 的关系

通常有两类思路：

## 28.1 进入页面后再请求

最常见。

```js
onMounted(() => {
  fetchData()
})
```

优点：

- 逻辑简单

缺点：

- 进入页面后才看到加载过程

## 28.2 导航前准备数据

可结合守卫。

```js
router.beforeResolve(async (to) => {
  console.log('可在此做某些数据确认')
})
```

### 复习结论

平时最常见仍然是：

- 进入组件后请求
- 配合参数监听或 `beforeRouteUpdate`

---

## 二十九、动态路由：两种“动态”必须彻底分开

这是 Router 最容易被说乱的知识点。

## 29.1 动态参数路由

例如：

```js
{
  path: '/user/:id',
  name: 'user-detail',
  component: UserDetailPage
}
```

这里“动态”的意思是：

- 路由规则固定
- 只是参数值变化

## 29.2 动态添加路由

例如：

```js
router.addRoute({
  path: '/report',
  name: 'report',
  component: () => import('@/views/ReportPage.vue')
})
```

这里“动态”的意思是：

- 项目运行后
- 再把某条路由规则加进去

### 结论

这两个不是一回事。

---

## 三十、动态添加路由详细讲透

## 30.1 `addRoute()`

添加一级路由：

```js
router.addRoute({
  path: '/report',
  name: 'report',
  component: () => import('@/views/ReportPage.vue')
})
```

## 30.2 给父路由添加子路由

```js
router.addRoute('system', {
  path: 'user',
  name: 'system-user',
  component: () => import('@/views/system/UserPage.vue')
})
```

这里 `'system'` 是父路由的 `name`。

## 30.3 `removeRoute()`

```js
router.removeRoute('report')
```

## 30.4 `hasRoute()`

```js
router.hasRoute('report')
```

## 30.5 `getRoutes()`

```js
console.log(router.getRoutes())
```

## 30.6 动态添加后重新匹配

有些场景下，你在导航过程中新增路由后，当前导航还未重新命中新路由。

常见处理方式是重新返回目标地址：

```js
router.beforeEach((to) => {
  if (!hasLoadedRoutes) {
    // 加载动态路由后
    return to.fullPath
  }
})
```

---

## 三十一、导航失败 `Navigation Failures`

当导航没有真正完成时，就可能出现导航失败。

例如：

- 重复跳到当前页面
- 被守卫拦截
- 跳转过程中出错

## 31.1 常见现象

你可能会看到：

- 重复跳转报错
- Promise 被 reject

## 31.2 处理思路

### 1. 不要无意义重复跳转

例如已经在当前页，就别再 `push` 同一路由。

### 2. 对异步跳转做错误捕获

```js
try {
  await router.push({ name: 'home' })
} catch (error) {
  console.log(error)
}
```

### 3. 理解：不是所有跳转失败都是 bug

有些失败本身就是正常控制结果。

---

## 三十二、项目里是否“都是动态路由”

不是。

更准确的说法是：

> 很多后台项目会把“权限页”做成动态添加路由，但公共骨架通常仍然是静态路由。

### 常见静态路由

- 登录页
- 404 页
- 首页
- 布局页

### 常见动态权限路由

- 系统管理
- 报表中心
- 角色管理
- 某些业务模块

### 为什么通常不是全动态

因为全动态会导致：

- 启动逻辑复杂
- 刷新恢复麻烦
- 排错更困难

---

## 三十三、Vue2 常见写法速查

## 33.1 创建路由器

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/HomePage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomePage
    }
  ]
})

export default router
```

## 33.2 在 `main.js` 中注册

```js
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

## 33.3 组件中使用

```js
export default {
  mounted() {
    console.log(this.$route.params.id)
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    }
  }
}
```

---

## 三十四、Vue3 常见写法速查

## 34.1 创建路由器

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

## 34.2 注册

```js
const app = createApp(App)
app.use(router)
app.mount('#app')
```

## 34.3 组件中使用

```js
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
```

---

## 三十五、高频面试/复习问答

### 1. Vue Router 的作用是什么

建立 URL 和组件的映射关系，实现单页应用中的无刷新导航。

### 2. `route` 和 `router` 有什么区别

- `route` 是当前路由信息对象，偏"读"（path、params、query、meta 等）
- `router` 是整个路由器实例，偏"操作"（push、replace、addRoute 等）

### 3. `params` 和 `query` 的区别

| 对比项 | `params` | `query` |
| --- | --- | --- |
| 地址表现 | `/detail/1` | `/detail?id=1` |
| 是否需要占位符 | 通常需要 | 不需要 |
| 刷新是否丢失 | 不丢 | 不丢 |
| 对象写法搭配 | 推荐 `name` | `path` 或 `name` 都行 |
| 适合场景 | 资源 id、详情页 | 搜索、分页、筛选 |

### 4. `router-link` 和 `a` 标签区别

- `router-link` 不刷新整页，通过 History API 或 hash 切换，不会重新请求资源
- `router-link` 自动处理激活样式（`router-link-active`）
- `router-link` 在 History 模式下会阻止默认跳转行为
- `a` 标签走传统页面跳转，会重新加载整个页面

### 5. 为什么详情页参数变了，组件不一定重新挂载

因为 Vue Router 可能复用同一个组件实例（`/user/1` → `/user/2` 匹配同一组件）。

`mounted` 不会重新执行，需要用 `watch` 监听 `route.params` 或使用 `beforeRouteUpdate` 守卫来响应变化。

### 6. 守卫有哪些，分别在什么时机执行

- 全局前置 `beforeEach`：每次导航触发，最先执行，常用于登录拦截
- 全局解析 `beforeResolve`：所有组件守卫和异步组件解析完后执行
- 全局后置 `afterEach`：导航确认后执行，不能中断导航，常用于埋点、改标题
- 路由独享 `beforeEnter`：进入该路由时执行，params/query/hash 变化不触发
- 组件内 `beforeRouteEnter`：进入前执行，此时组件实例未创建，不能用 `this`
- 组件内 `beforeRouteUpdate`：路由变化但组件复用时执行
- 组件内 `beforeRouteLeave`：离开前执行，常用于防止未保存就离开

### 7. Hash 和 History 区别

| 对比项 | Hash | History |
| --- | --- | --- |
| URL 表现 | 带 `#` | 不带 `#` |
| 底层原理 | 监听 `hashchange` 事件 | 使用 HTML5 `pushState` / `replaceState` |
| 刷新是否 404 | 不会，`#` 后内容不发给服务器 | 会，需要服务器配置回退 |
| 部署难度 | 简单，静态托管友好 | 需要服务器配合 |
| SEO | 较差 | 较好 |

### 8. Hash 模式和 History 模式的底层原理

**Hash 模式：**

- URL 中 `#` 后面的内容是 hash，浏览器不会把 hash 部分发给服务器
- 通过监听 `window.addEventListener('hashchange', ...)` 感知路由变化
- 改变 hash 用 `location.hash = '/home'`

**History 模式：**

- 依赖 HTML5 History API：`pushState()`、`replaceState()`、`popstate` 事件
- `pushState` 可以改变 URL 但不触发页面刷新
- 通过监听 `window.addEventListener('popstate', ...)` 感知前进后退
- 刷新时浏览器会真实请求该路径，服务器需要配置所有路径都返回 `index.html`

### 9. 动态路由是什么

要分两种回答：

- `/user/:id`：动态参数路由，路由规则固定，只是参数值变化
- `router.addRoute()`：动态添加路由，运行时把新路由规则注册进去

### 10. 如何实现权限路由（后台项目常考）

完整流程：

1. 用户登录，获取 token 和角色/权限信息
2. 存入 Pinia/Vuex
3. 根据权限过滤出该用户可访问的路由表
4. 调用 `router.addRoute()` 动态注册这些路由
5. 在 `beforeEach` 中判断：未登录跳登录页，已登录但路由未加载则先加载再跳转
6. 刷新后需要重新执行步骤 3-4（因为内存中的动态路由会丢失）

```js
router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')

  if (!token) {
    if (to.name !== 'login') return { name: 'login' }
    return
  }

  const userStore = useUserStore()

  if (!userStore.routesLoaded) {
    await userStore.loadDynamicRoutes()  // 请求权限，addRoute
    return to.fullPath  // 重新导航，命中新加的路由
  }
})
```

### 11. 路由懒加载是什么，为什么要用

懒加载就是把路由组件改成动态 `import`：

```js
// 静态导入：打包时全部打进主包
import UserPage from '@/views/UserPage.vue'

// 懒加载：访问该路由时才加载对应 chunk
component: () => import('@/views/UserPage.vue')
```

原理：利用 Webpack/Vite 的代码分割（code splitting），每个懒加载路由会被打成独立的 chunk 文件。

好处：减少首屏 JS 体积，加快首屏加载速度。

### 12. `router.push` 返回的是什么

Vue Router 4 中 `router.push()` 返回一个 `Promise`，可以用 `await` 等待导航完成：

```js
// 可以捕获导航失败
try {
  await router.push({ name: 'home' })
} catch (err) {
  // 导航被守卫拦截或其他失败
}
```

Vue Router 3 中 `push` 没有返回 Promise（需要传回调）。

### 13. `beforeRouteEnter` 为什么不能用 `this`

因为 `beforeRouteEnter` 在导航确认之前执行，此时组件实例还没有被创建，所以 `this` 是 `undefined`。

这是唯一一个支持给 `next` 传回调的守卫：

```js
beforeRouteEnter(to, from, next) {
  next(vm => {
    // 导航确认后，组件实例通过 vm 传入
    vm.fetchData()
  })
}
```

Vue3 组合式 API 中没有对应的 `onBeforeRouteEnter`，因为 `setup()` 执行时导航已经确认，可以直接在 `setup` 里做初始化。

### 14. `redirect` 和 `alias` 的区别

- `redirect`：访问 `/`，URL 会变成 `/home`，用户看到的是 `/home`
- `alias`：访问 `/index`，URL 保持 `/index`，但渲染的是 `/home` 对应的组件

```js
// redirect：URL 会跳转
{ path: '/', redirect: '/home' }

// alias：URL 不变，但渲染同一个组件
{ path: '/home', alias: '/index', component: HomePage }
```

### 15. 嵌套路由子路由 path 加不加 `/` 的区别

- 不加 `/`（相对路径）：最终路径是父路径 + 子路径，如 `/home/hot`
- 加 `/`（绝对路径）：直接以 `/` 开头，不再拼接父路径

子路由推荐写相对路径（不加 `/`），语义更清晰，也更符合嵌套关系。

---

## 三十六、高频踩坑清单

### 1. 子路由路径前面加了 `/`

结果变成绝对路径。

### 2. 父组件没写 `<router-view>`

子路由没有显示位置。

### 3. 用 `path` 配 `params`

Vue Router 4 中这是确定行为：`params` 会被直接忽略，控制台会有警告。必须用 `name` 配 `params`，或者用 `path` 自己拼参数进路径。

### 4. 详情页切换 id 不更新

组件被复用，需要监听参数或使用更新守卫。

### 5. History 模式刷新 404

服务器没做回退配置。

### 6. `keep-alive` 没生效

组件名、缓存策略、`key` 配置不匹配。

### 7. 动态路由刷新后丢失

因为刷新后内存中的动态注册结果没了，需要重新注入。

### 8. 404 放前面

会拦掉后面的正常路由。

### 9. 命名路由乱起名

后期维护困难。

### 10. 菜单和路由写两份

容易不同步。

---

## 三十七、最终复习结论

复习 Vue Router 时，真正要抓住的是下面这些主线：

### 主线 1：路由是什么

它本质上是：

- URL 和组件的映射关系

### 主线 2：怎么跳

- `<router-link>`
- `router.push`
- `router.replace`
- `router.go`

### 主线 3：怎么传参

- `query`
- `params`
- `props`

### 主线 4：怎么组织页面

- 命名路由
- 重定向
- 嵌套路由
- 命名视图
- 404

### 主线 5：怎么控制导航

- 全局守卫
- 路由独享守卫
- 组件内守卫

### 主线 6：怎么适应复杂场景

- 懒加载
- 缓存
- 滚动恢复
- 动态添加路由

### 主线 7：最容易混的点

- `route` vs `router`
- `params` vs `query`
- 动态参数路由 vs 动态添加路由
- Hash vs History

---

## 三十八、这篇之后，你再学什么最顺

如果你把这篇已经吃透，下一步最适合接着学：

1. `Pinia` / `Vuex`
   因为用户信息、角色、菜单和路由经常联动
2. `axios` 请求封装
   因为 401、token 失效、登录回跳常和 Router 配合
3. 菜单树、面包屑、标签页导航
   因为这些通常都依赖路由表
4. 权限系统完整链路
   包括登录、角色、菜单、动态路由、按钮级权限

如果你能把这几块和 Router 串起来，就不只是“会用路由”，而是真正具备中等项目的页面组织能力了。
