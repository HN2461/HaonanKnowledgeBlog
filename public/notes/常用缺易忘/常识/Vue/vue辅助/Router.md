---

## 一、为什么需要 Vue Router？（前置基础）
在讲 Vue Router 之前，先搞懂两个核心概念：

### 1. 多页应用（MPA） vs 单页应用（SPA）
+ **多页应用（MPA）**：传统网站，每个页面对应一个 `.html` 文件，点击链接时浏览器会**重新加载整个页面**（白屏闪烁），体验较差。
+ **单页应用（SPA）**：只有一个 `.html` 文件，页面切换通过 JavaScript 动态替换内容，**浏览器地址变了但页面不刷新**，体验像原生 APP 一样流畅。

### 2. Vue Router 的作用
Vue Router 是 Vue.js 官方的**路由管理器**，专门用来解决 SPA 的页面切换问题：

+ 管理浏览器地址与 Vue 组件的映射关系。
+ 实现页面间的无刷新跳转。
+ 提供路由参数、嵌套路由、路由守卫等高级功能。



---

## 二、核心概念（必须牢记）
把 Vue Router 想象成一个**「导航系统」**，以下是核心组成部分：

| 概念 | 通俗类比 | 作用说明 |
| --- | --- | --- |
| **Route** | 「单个导航地址」 | 对应一个页面路径（如 `/home`），包含路径、组件、参数等信息。 |
| **Routes** | 「导航地图」 | 一个数组，存储所有 Route 的映射关系（路径 → 组件）。 |
| **Router** | 「导航管理器」 | 核心实例，负责监听地址变化、匹配 Routes、渲染组件。 |
| `<router-link>` | 「导航按钮」 | 替代 `<a>` 标签，点击后无刷新切换路由，自动添加激活样式。 |
| `<router-view>` | 「页面显示区」 | 路由匹配到的组件会渲染在这里，一个页面可以有多个（命名视图）。 |
| **$route** | 「当前路由信息对象」 | 只读，包含当前路径、参数、查询字符串等信息（如 `$route.params.id`）。 |
| **$router** | 「路由操作对象」 | 可写，用于编程式跳转路由（如 `$router.push('/home')`）。 |


---

## 三、Vue 2 与 Vue 3 的版本差异
由于你正从 Vue 2 过渡到 Vue 3，必须明确两者适配的 Vue Router 版本和写法完全不同：

| 对比项 | Vue 2（Vue Router 3.x） | Vue 3（Vue Router 4.x） |
| --- | --- | --- |
| 适配 Vue 版本 | Vue 2.x | Vue 3.x |
| 安装命令 | `npm install vue-router@3` | `npm install vue-router@4` |
| 创建路由实例 | `new VueRouter({ ... })` | `createRouter({ ... })` |
| 路由模式 | `mode: 'hash'` 或 `mode: 'history'` | `history: createWebHashHistory()` 或 `createWebHistory()` |
| 挂载方式 | `new Vue({ router, ... })` | `app.use(router)` |
| 组件内使用 | `this.$router` / `this.$route` | 组合式 API：`useRouter()` / `useRoute()` |
| 路由守卫 | 选项式 API 写法 | 支持选项式 + 组合式 API 写法 |


---

## 四、Vue 3 完整教程（从 0 到 1）
我们以 Vue 3 + Vue Router 4 为例，一步步搭建一个完整的路由项目。

### 1. 环境准备
先创建一个 Vue 3 项目（如果已有可跳过）：

```bash
npm create vue@latest my-router-app
cd my-router-app
npm install
```

### 2. 安装 Vue Router 4
```bash
npm install vue-router@4
```

### 3. 创建路由配置文件
在 `src` 目录下新建 `router` 文件夹，再创建 `index.js`：

```javascript
// src/router/index.js
// 1. 导入 Vue Router 4 的核心函数
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

// 2. 导入页面组件（后续会创建这些组件）
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import User from '../views/User.vue'
import UserProfile from '../views/UserProfile.vue'
import UserPosts from '../views/UserPosts.vue'
import NotFound from '../views/NotFound.vue'

// 3. 定义路由表（Routes）：路径 → 组件的映射
const routes = [
  // 根路径重定向到首页（访问 / 自动跳转到 /home）
  {
    path: '/',
    redirect: '/home'
  },
  // 首页路由
  {
    path: '/home',
    name: 'Home', // 命名路由（可选，后续可通过 name 跳转）
    component: Home,
    meta: { title: '首页' } // 路由元信息（可选，存储自定义数据）
  },
  // 关于页路由
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我们' }
  },
  // 动态路由（:id 是动态参数，匹配 /user/1、/user/2 等）
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    props: true, // 开启 props 传参（推荐，替代 $route.params）
    // 嵌套路由（子路由）
    children: [
      {
        path: '', // 空路径，当访问 /user/1 时默认渲染
        redirect: 'profile'
      },
      {
        path: 'profile', // 子路径不需要加 /，完整路径为 /user/1/profile
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'posts',
        name: 'UserPosts',
        component: UserPosts
      }
    ]
  },
  // 404 路由（匹配所有未定义的路径，必须放在最后）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

// 4. 创建路由实例（Router）
const router = createRouter({
  // 路由模式：二选一
  // ① Hash 模式：地址带 #（如 http://localhost/#/home），无需后端配置，推荐开发用
  history: createWebHashHistory(),
  // ② History 模式：地址不带 #（如 http://localhost/home），需要后端配置，推荐生产用
  // history: createWebHistory(import.meta.env.BASE_URL),
  
  routes // 传入路由表
})

// 5. 全局前置路由守卫（每次路由跳转前触发）
router.beforeEach((to, from, next) => {
  // to：即将要进入的目标路由对象
  // from：当前导航正要离开的路由对象
  // next：必须调用的函数，用于 resolve 这个钩子
  
  // 示例：动态设置页面标题
  document.title = to.meta.title || '我的 Vue 应用'
  
  // 示例：登录验证（假设已登录状态存储在 localStorage）
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果路由需要登录但未登录，跳转到登录页
    next('/login')
  } else {
    // 否则正常跳转
    next()
  }
})

// 6. 导出路由实例
export default router
```

### 4. 在 main.js 中挂载路由
修改 `src/main.js`：

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 导入路由实例

const app = createApp(App)
app.use(router) // 挂载路由（必须在 mount 之前）
app.mount('#app')
```

### 5. 创建页面组件
在 `src` 目录下新建 `views` 文件夹，创建以下组件：

#### （1）首页组件 `Home.vue`
```vue
<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <h1>首页</h1>
    <p>欢迎来到首页！</p>
  </div>
</template>

```

#### （2）关于页组件 `About.vue`
```vue
<!-- src/views/About.vue -->
<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是一个 Vue Router 示例项目。</p>
  </div>
</template>

```

#### （3）用户页组件 `User.vue`（含嵌套路由）
```vue
<!-- src/views/User.vue -->
<template>
  <div class="user">
    <h1>用户中心</h1>
    <p>用户 ID：{{ id }}</p>
    
    <!-- 嵌套路由的导航链接 -->
    <div class="tab">
      <router-link to="profile">个人资料</router-link> |
      <router-link to="posts">用户帖子</router-link>
    </div>
    
    <!-- 嵌套路由的视图出口 -->
    <router-view></router-view>
  </div>
</template>
<script setup>
// 开启 props 传参后，直接通过 props 接收动态参数
const props = defineProps(['id'])
</script>

```

#### （4）用户资料组件 `UserProfile.vue`
```vue
<!-- src/views/UserProfile.vue -->
<template>
  <div class="user-profile">
    <h3>个人资料</h3>
    <p>这里是用户的个人资料。</p>
  </div>
</template>

```

#### （5）用户帖子组件 `UserPosts.vue`
```vue
<!-- src/views/UserPosts.vue -->
<template>
  <div class="user-posts">
    <h3>用户帖子</h3>
    <p>这里是用户发布的帖子。</p>
  </div>
</template>

```

#### （6）404 组件 `NotFound.vue`
```vue
<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/home">返回首页</router-link>
  </div>
</template>

```

### 6. 在 App.vue 中使用路由
修改 `src/App.vue`，添加导航链接和路由视图：

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav>
      <!-- 声明式导航：<router-link> -->
      <!-- to 属性：目标路径，也可以传对象（命名路由） -->
      <router-link to="/home">首页</router-link> |
      <router-link :to="{ name: 'About' }">关于我们</router-link> |
      <!-- 动态路由传参 -->
      <router-link :to="{ name: 'User', params: { id: 1 } }">用户 1</router-link> |
      <router-link :to="{ name: 'User', params: { id: 2 } }">用户 2</router-link>
    </nav>
    
    <!-- 路由视图出口：匹配到的组件会渲染在这里 -->
    <router-view></router-view>
  </div>
</template>
<style>
/* 导航链接激活样式（自动添加） */
.router-link-active {
  color: #42b983;
  font-weight: bold;
}
</style>

```

### 7. 编程式导航（组合式 API 写法）
除了用 `<router-link>` 声明式导航，还可以用 `useRouter` 进行编程式跳转：

```vue
<!-- 在任意组件中 -->
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter() // 路由操作对象
const route = useRoute()   // 当前路由信息对象

// 1. 跳转到指定路径（push：会向 history 栈添加新记录）
const goHome = () => {
  router.push('/home')
}

// 2. 通过命名路由跳转（推荐，更灵活）
const goToAbout = () => {
  router.push({ name: 'About' })
}

// 3. 动态路由传参
const goToUser = (userId) => {
  router.push({ name: 'User', params: { id: userId } })
}

// 4. 查询字符串传参（如 /user/1?tab=profile）
const goToUserWithQuery = () => {
  router.push({ 
    name: 'User', 
    params: { id: 1 }, 
    query: { tab: 'profile' } 
  })
  // 获取查询参数：route.query.tab
}

// 5. 替换当前路由（replace：不会向 history 栈添加新记录）
const replaceToHome = () => {
  router.replace('/home')
}

// 6. 前进/后退
const goBack = () => {
  router.go(-1) // 后退一页，等价于 router.back()
}
const goForward = () => {
  router.go(1) // 前进一页，等价于 router.forward()
}
</script>

```



---

## 五、Vue 2 完整写法（对比参考）
如果你还在维护 Vue 2 项目，以下是 Vue Router 3 的对应写法：

### 1. 路由配置文件 `src/router/index.js`
```javascript
// Vue Router 3 写法
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// 安装 Vue Router 插件
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home }
]

// 创建路由实例
const router = new VueRouter({
  mode: 'hash', // 路由模式
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  next() // 必须调用
})

export default router
```

### 2. main.js 挂载
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router, // 挂载路由
  render: h => h(App)
}).$mount('#app')
```

### 3. 组件内使用（选项式 API）
```vue
<script>
export default {
  methods: {
    goHome() {
      // Vue 2 中通过 this.$router 操作
      this.$router.push('/home')
    }
  },
  mounted() {
    // 通过 this.$route 获取当前路由信息
    console.log(this.$route.params.id)
  }
}
</script>

```



---

## 六、高级特性详解
### 1. 路由传参的三种方式
| 方式 | 写法示例 | 获取方式 | 特点 |
| --- | --- | --- | --- |
| **动态路由参数** | `path: '/user/:id'`，跳转：`params: { id: 1 }` | `$route.params.id` 或 `props: ['id']` | 参数在路径中（如 `/user/1`），刷新不丢失 |
| **查询字符串** | 跳转：`query: { tab: 'profile' }` | `$route.query.tab` | 参数在地址栏（如 `/user/1?tab=profile`），刷新不丢失 |
| **路由元信息** | `meta: { requiresAuth: true }` | `$route.meta.requiresAuth` | 不在地址栏，用于存储自定义数据（如权限、标题） |


### 2. 嵌套路由（子路由）
当一个页面内部有多个子页面时使用，如用户中心包含「个人资料」和「用户帖子」：

+ 父路由配置 `children` 数组。
+ 子路由的 `path` 不需要加 `/`，完整路径为父路径 + 子路径。
+ 父组件中必须添加 `<router-view>` 作为子路由的出口。

### 3. 路由守卫（拦截器）
路由守卫用于在路由跳转前后执行拦截逻辑，实现登录验证、权限控制、页面标题设置、埋点统计等功能。Vue Router 提供了三类守卫：**全局守卫**、**路由独享守卫**、**组件内守卫**。

#### 3.1 全局守卫（所有路由跳转都会触发）
全局守卫挂载在 `router` 实例上，影响每一个路由导航。

| 守卫名称 | 触发时机 | 是否有 `next` | 典型用途 |
| --- | --- | --- | --- |
| `router.beforeEach` | 导航被触发时，在全局、路由独享、组件内守卫 **之前** 执行 | 有 | 登录验证、全局权限控制、页面标题修改 |
| `router.beforeResolve` | 所有组件内守卫和异步路由组件被解析 **之后**，导航被确认 **之前** 执行 | 有 | 数据预获取、确保所有异步依赖准备就绪 |
| `router.afterEach` | 导航成功完成 **之后**（即组件已渲染）执行 | 无 | 关闭页面加载动画、埋点统计、滚动行为控制 |


```javascript
// 全局前置守卫（最常用）
router.beforeEach((to, from, next) => {
  // to: 即将进入的目标路由对象
  // from: 当前导航正要离开的路由对象
  // next: 必须调用的函数，用于 resolve 钩子

  // 示例：动态设置页面标题
  document.title = to.meta.title || '默认标题';

  // 示例：登录验证（假设登录状态存储在 localStorage）
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 未登录则跳转到登录页，并携带原目标路径以便登录后返回
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next(); // 允许导航
  }
});

// 全局解析守卫（通常用于确保异步数据加载完成）
router.beforeResolve((to, from, next) => {
  // 此时所有异步组件和守卫都已解析完毕，可在此做最后的检查
  // 例如：等待 store 中的用户信息加载完成
  next();
});

// 全局后置守卫（没有 next 参数，不能改变导航）
router.afterEach((to, from) => {
  // 关闭页面 loading 动画
  // 发送页面访问埋点
  // 恢复滚动位置等
});
```

> **❗****重要：**`next`** 的调用规则**
>
> + 必须确保 `next` 只被调用 **一次**（除非使用 `next(false)` 中断导航，此时导航会回到当前页）。
> + 在异步操作中（如 API 请求），必须在异步回调内调用 `next`，且确保不会在多个分支中重复调用。
> + 如果守卫中没有调用 `next`，导航将永远挂起。
> + 合法的 `next` 参数：
>     - `next()`：放行导航。
>     - `next(false)`：中断当前导航，浏览器地址会重置为 `from` 对应的地址。
>     - `next('/')` 或 `next({ name: 'Home' })`：跳转到其他路由。
>     - `next(error)`：传入一个 `Error` 实例，导航会被终止，并触发路由错误处理。
>

#### 3.2 路由独享守卫（只在特定路由上触发）
在路由配置中直接定义 `beforeEnter` 守卫，只对该路由生效。

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    beforeEnter: (to, from, next) => {
      // 仅在进入 /user/:id 时触发
      if (to.params.id > 100) {
        next(); // 允许访问
      } else {
        next('/error'); // 无效 ID 则跳转错误页
      }
    }
  }
];
```

> **注意**：路由独享守卫的 `next` 用法与全局守卫一致。
>

#### 3.3 组件内守卫（只在当前组件内生效）
组件内守卫可以写在 **选项式 API**（Vue 2 / Vue 3）或 **组合式 API**（Vue 3）中。

##### （1）Vue 2 / Vue 3 选项式 API 写法
```javascript
export default {
  // 进入组件前触发（此时组件实例尚未创建，无法访问 this）
  beforeRouteEnter(to, from, next) {
    // 可以访问组件实例的 vm 需要通过 next 回调获取
    next(vm => {
      // vm 是当前组件的实例，可以调用组件方法、访问 data 等
      vm.fetchData();
    });
  },
  // 路由参数变化但组件被复用时触发（如从 /user/1 跳到 /user/2）
  beforeRouteUpdate(to, from, next) {
    // 可以访问 this
    this.userId = to.params.id;
    this.fetchData();
    next();
  },
  // 离开组件前触发（如未保存表单时提示用户）
  beforeRouteLeave(to, from, next) {
    const confirmLeave = window.confirm('确定要离开吗？未保存的数据将会丢失。');
    if (confirmLeave) {
      next();
    } else {
      next(false); // 取消离开
    }
  }
};
```

##### （2）Vue 3 组合式 API 写法
```javascript
<script setup>
import { onBeforeRouteEnter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

// 进入组件前触发（组件尚未创建）
onBeforeRouteEnter((to, from, next) => {
  // 不能直接使用 this，需要通过 next 回调获取组件实例
  next(vm => {
    // vm 是组件实例，可以调用其中的方法
    vm.fetchData();
  });
});

// 路由参数变化但组件复用时触发（从 /user/1 到 /user/2）
onBeforeRouteUpdate(async (to, from, next) => {
  // 可以访问组件实例的响应式状态
  // 根据新参数重新获取数据
  await fetchUserData(to.params.id);
  next();
});

// 离开组件前触发
onBeforeRouteLeave((to, from, next) => {
  const confirmLeave = window.confirm('确定要离开吗？');
  if (confirmLeave) {
    next();
  } else {
    next(false);
  }
});
</script>

```

> **说明**：
>
> + `onBeforeRouteEnter` 是唯一一个在组件实例尚未创建时执行的守卫，因此无法直接访问 `this` 或组合式 API 中的变量，但可以通过 `next` 的回调获取实例。
> + `onBeforeRouteUpdate` 和 `onBeforeRouteLeave` 都可以直接访问组件内的响应式数据。
>

---

#### 3.4 守卫执行顺序
当一个导航发生时，所有守卫的调用顺序如下：

1. 导航被触发
2. 失活组件的 `beforeRouteLeave` 守卫
3. 全局 `beforeEach` 守卫
4. 重用的组件中调用 `beforeRouteUpdate` 守卫（如果有）
5. 路由独享 `beforeEnter` 守卫
6. 解析异步路由组件
7. 激活组件中调用 `beforeRouteEnter` 守卫
8. 全局 `beforeResolve` 守卫
9. 导航被确认
10. 全局 `afterEach` 守卫
11. 触发 DOM 更新
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数（此时组件实例已创建）

---

#### 3.5 常见应用场景示例
**场景一：登录验证 + 页面标题设置**

```javascript
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题';

  const publicPages = ['/login', '/register']; // 公开页面列表
  const authRequired = !publicPages.includes(to.path);
  const isLoggedIn = localStorage.getItem('token');

  if (authRequired && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
```

**场景二：动态路由参数变化时重新获取数据（组件复用场景）**

```javascript
// 使用 beforeRouteUpdate 或 watch $route
export default {
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params.id);
    next();
  },
  methods: {
    fetchData(id) {
      // 请求数据...
    }
  }
};
```

**场景三：离开页面时提示未保存修改**

```javascript
beforeRouteLeave(to, from, next) {
  if (this.formChanged) {
    const answer = window.confirm('有未保存的更改，确定要离开吗？');
    answer ? next() : next(false);
  } else {
    next();
  }
}
```

---

通过以上补充，你的路由守卫部分将更加完整、严谨，能够覆盖大多数实际开发需求。其他部分（如路由传参、嵌套路由、懒加载等）你的笔记已经非常详尽，无需大幅修改。

### 4. 路由模式：Hash vs History
| 对比项 | Hash 模式（`createWebHashHistory()`） | History 模式（`createWebHistory()`） |
| --- | --- | --- |
| 地址表现 | 带 `#`（如 `http://localhost/#/home`） | 不带 `#`（如 `http://localhost/home`） |
| 原理 | 监听 `window.onhashchange` 事件 | 使用 HTML5 History API（`pushState`/`replaceState`） |
| 后端配置 | 不需要 | **必须配置**，否则刷新页面会 404 |
| 适用场景 | 开发环境、简单项目 | 生产环境、对 URL 美观有要求的项目 |


#### History 模式的后端配置（关键！）
如果使用 History 模式，部署时必须配置后端，让所有请求都指向 `index.html`，否则刷新页面会 404。以下是常见服务器的配置：

**Nginx 配置：**

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache 配置：**

```plain
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

```

### 5. 命名视图（一个页面多个 `<router-view>`）
当一个页面需要同时渲染多个组件时使用，给 `<router-view>` 添加 `name` 属性：

```vue
<!-- App.vue -->
<template>
  <div>
    <router-view name="header"></router-view> <!-- 头部组件 -->
    <router-view></router-view> <!-- 默认主组件 -->
    <router-view name="footer"></router-view> <!-- 底部组件 -->
  </div>
</template>

```

路由配置：

```javascript
const routes = [
  {
    path: '/',
    components: {
      default: Home, // 默认视图对应 Home 组件
      header: Header, // 命名视图 header 对应 Header 组件
      footer: Footer  // 命名视图 footer 对应 Footer 组件
    }
  }
]
```



---

## 七、常见问题与解决方案
### 1. 路由参数变化但组件不更新
原因：Vue 会复用相同的组件（如从 `/user/1` 跳到 `/user/2`），不会重新创建组件实例，所以 `mounted` 钩子不会触发。

解决：

+ 用 `onBeforeRouteUpdate` 守卫（Vue 3）或 `beforeRouteUpdate`（Vue 2）监听参数变化。
+ 用 `watch` 监听 `$route.params`：

```vue
<script setup>
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
watch(() => route.params.id, (newId) => {
  // 参数变化时执行逻辑
  console.log('新的用户 ID：', newId)
})
</script>

```

### 2. 404 页面配置
在路由表最后添加一个匹配所有路径的路由：

```javascript
// Vue Router 4 写法
const routes = [
  // ... 其他路由
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]
```

### 3. 路由懒加载（性能优化）
当项目很大时，不要一次性加载所有组件，而是路由访问时再加载（懒加载）：

```javascript
// Vue 3 写法
const routes = [
  {
    path: '/about',
    component: () => import('../views/About.vue') // 懒加载
  }
]
```



---

## 八、总结
Vue Router 的核心就是「**地址 → 组件**」的映射，掌握以下几点即可：

1. 配置路由表（`routes`）：定义路径与组件的关系。
2. 使用 `<router-link>` 导航，`<router-view>` 渲染。
3. 用 `useRouter`（Vue 3）或 `this.$router`（Vue 2）编程式跳转。
4. 用路由守卫实现登录验证等拦截逻辑。
5. 注意 History 模式需要后端配置。

