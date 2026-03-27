# 附录D：Vuex 速查表

> 目标：把 Vuex 的读写方式与核心概念快速整理。

---

## D.1 核心概念

- `state`：状态
- `getters`：派生
- `mutations`：同步修改（commit）
- `actions`：异步/复杂逻辑（dispatch）

---

## D.2 常用读写

读取：

- `this.$store.state.xxx`
- `this.$store.getters.xxx`

修改：

- `this.$store.commit('mutationName', payload)`
- `this.$store.dispatch('actionName', payload)`

---

## D.3 map 辅助函数

- `mapState`
- `mapGetters`
- `mapMutations`
- `mapActions`

命名空间模块：

- `mapState('user', ['token'])`
- `this.$store.commit('user/setToken', token)`

---

## D.4 经典约束

- mutation 必须同步
- 异步逻辑放 action
