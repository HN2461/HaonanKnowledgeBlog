# 附录C：Vue Router 速查表

> 目标：把 Router 的常用 API 与概念做成速查。

---

## C.1 常见组件

- `<router-view />`：路由出口
- `<router-link to="/path" />`：声明式导航

---

## C.2 常见 API

- `this.$router.push('/home')`
- `this.$router.replace('/home')`
- `this.$router.go(-1)`

获取当前路由信息：

- `this.$route.path`
- `this.$route.query`
- `this.$route.params`

---

## C.3 动态路由

- 配置：`/detail/:id`
- 获取：`this.$route.params.id`

---

## C.4 query vs params

- query：`/search?keyword=vue`
- params：`/detail/123`

---

## C.5 导航守卫

- 全局前置：`router.beforeEach((to, from, next) => next())`
- 全局后置：`router.afterEach((to) => { ... })`

常见用途：

- 鉴权
- 设置标题
- 埋点统计
