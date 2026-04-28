## 一、setup 函数
### 1.1 基本使用
+ **作用**：Vue3新增的配置项，组合式API的入口
+ **位置**：所有组合式API（数据、方法、计算属性、监听器等）都写在setup函数中
+ **返回值**：
    - 返回**对象**：对象中的属性/方法可直接在模板中使用
    - 返回**函数**：函数返回值会直接渲染到页面（了解即可）

### 1.2 执行时机
+ **在 **`beforeCreate`** 之前执行**
+ **this 为 undefined**，无法通过this访问组件实例

### 1.3 与Vue2.x选项式API的兼容性
+ ✅ Vue2中的data/methods/computed **可以访问** setup中定义的属性
+ ❌ setup中 **不能访问** Vue2中的data/methods/computed

### 1.4 setup语法糖
```vue
<script setup name="组件名">
  // 直接写组合式API代码，无需return
</script>

```

+ **简化写法**：省去setup()函数和return
+ **组件命名**：可通过 `name` 属性直接指定，或借助插件 `vite-plugin-vue-setup-extend`

---

## 二、响应式核心API
### 2.1 reactive
```javascript
import { reactive } from 'vue'

let state = reactive({ name: '张三', age: 18 })
```

+ **作用**：定义响应式对象（只能用于**对象类型**）
+ **原理**：返回Proxy实例，实现深层响应式
+ **注意**：重新赋值整个对象会丢失响应式

### 2.2 ref
```javascript
import { ref } from 'vue'

let count = ref(0)        // 基本类型
let user = ref({ name: '李四' })  // 对象类型
```

+ **作用**：定义响应式变量（基本类型+对象类型）
+ **访问方式**：JS中用 `.value`，模板中直接使用
+ **原理**：对象类型内部也是通过reactive实现

### 2.3 ref vs reactive 对比
| 特性 | ref | reactive |
| --- | --- | --- |
| 数据类型 | 基本类型 + 对象类型 | 仅对象类型 |
| 访问方式 | `.value` | 直接访问 |
| 整体替换 | 可以（`.value = 新值`） | 会丢失响应式 |
| 解构 | 不影响响应式 | 解构后丢失响应式 |


**使用原则**：

+ 基本类型 → 必须用 `ref`
+ 对象类型且需要整体替换 → 用 `ref`
+ 对象类型且层级深 → 推荐 `reactive`

### 2.4 toRef 与 toRefs
```javascript
import { toRef, toRefs } from 'vue'

let state = reactive({ name: '张三', age: 18 })

// 单个属性转换
let name = toRef(state, 'name')

// 批量转换
let { name, age } = toRefs(state)
```

+ **作用**：保持响应式的同时，解构reactive对象的属性
+ **注意**：转换后得到的是ref对象，访问时仍需 `.value`

---

## 三、计算属性 computed
```javascript
import { computed, ref } from 'vue'

let firstName = ref('张')
let lastName = ref('三')

// 只读写法
let fullName = computed(() => firstName.value + lastName.value)

// 可读写写法
let fullName = computed({
  get: () => firstName.value + lastName.value,
  set: (val) => {
    // 处理赋值逻辑
  }
})
```

---

## 四、侦听器 watch
### 4.1 watch 可监视的数据类型
1. ref定义的数据
2. reactive定义的数据
3. 函数返回的值（getter函数）
4. 包含上述内容的数组

### 4.2 不同情况的监视写法
```javascript
import { ref, reactive, watch } from 'vue'

// 1. ref基本类型
let count = ref(0)
watch(count, (newVal, oldVal) => {})

// 2. ref对象类型（需开启深度监视）
let user = ref({ name: '张三' })
watch(user, (newVal, oldVal) => {}, { deep: true })

// 3. reactive对象类型（默认深度监视）
let state = reactive({ name: '张三' })
watch(state, (newVal, oldVal) => {})  // 注意：oldVal无法正确获取

// 4. 监视对象中的某个属性（函数写法）
watch(() => state.name, (newVal, oldVal) => {})

// 5. 监视多个数据
watch([() => state.name, () => state.age], ([newName, newAge], [oldName, oldAge]) => {})
```

### 4.3 watch 返回值
+ watch 返回一个**停止监听的函数**

```javascript
const stop = watch(count, () => {})
stop()  // 停止监听
```

### 4.4 watch vs watchEffect
| 特性 | watch | watchEffect |
| --- | --- | --- |
| 执行时机 | 惰性（数据变化才执行） | 立即执行 |
| 依赖追踪 | 手动指定 | 自动追踪代码中的依赖 |
| 获取旧值 | ✅ 可以 | ❌ 只能获取新值 |
| 适用场景 | 需要精确控制依赖和获取旧值 | 异步操作、自动收集依赖 |


```javascript
// watchEffect 示例
watchEffect(async () => {
  let res = await axios.get(`/api/list?author=${keyword.value}`)
  list.value = res.data
})
```

---

## 五、生命周期钩子
### 5.1 生命周期对照表
| Vue2 | Vue3 | 说明 |
| --- | --- | --- |
| beforeCreate | setup | setup取代 |
| created | setup | setup取代 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载后（常用） |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新后 |
| beforeDestroy | onBeforeUnmount | 卸载前 |
| destroyed | onUnmounted | 卸载后 |


### 5.2 使用示例
```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
  // 常用于：发起请求、操作DOM、添加事件监听
})

onUnmounted(() => {
  console.log('组件即将卸载')
  // 常用于：清理定时器、移除事件监听
})
```

---

## 六、自定义 Hook
### 6.1 概述
+ **本质**：封装组合式API逻辑的函数
+ **优势**：代码复用、逻辑分离、提高可维护性
+ **命名规范**：`useXxx`

### 6.2 示例结构
```javascript
// hooks/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  
  onMounted(() => document.addEventListener('mousemove', update))
  onUnmounted(() => document.removeEventListener('mousemove', update))
  
  return { x, y }
}
```

### 6.3 在组件中使用
```vue
<script setup>
import { useMouse } from '@/hooks/useMouse'
let { x, y } = useMouse()
</script>

```

---

## 七、ref 标签属性（模板引用）
### 7.1 获取DOM元素
```vue
<template>
  <input ref="inputRef" />
</template>
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value.focus()  // 操作DOM
})
</script>

```

### 7.2 获取组件实例
```vue
<!-- 父组件 -->
<template>
  <ChildComponent ref="childRef" />
</template>
<script setup>
import { ref } from 'vue'

const childRef = ref(null)
// 访问子组件数据前，需子组件用 defineExpose 暴露
</script>
<!-- 子组件 -->
<script setup>
import { defineExpose } from 'vue'
const msg = 'hello'
defineExpose({ msg })  // 暴露给父组件
</script>

```

---

## 八、常见易错点总结
1. **reactive直接赋值丢失响应式**

```javascript
// ❌ 错误
let state = reactive({ list: [] })
state = { list: newList }  // 丢失响应式

// ✅ 正确
Object.assign(state, { list: newList })
```

2. **watch监视ref对象需开启deep**

```javascript
let obj = ref({ a: 1 })
// ❌ 修改obj.value.a不会触发
watch(obj, () => {})
// ✅ 需开启深度监视
watch(obj, () => {}, { deep: true })
```

3. **reactive定义的数据，watch无法获取正确的oldValue**
4. **ref对象在模板中使用无需.value**

---

## 九、快速参考
```javascript
// 常用导入
import { ref, reactive, computed, watch, watchEffect, 
         onMounted, onUnmounted, toRefs, defineExpose } from 'vue'

// 响应式定义
let count = ref(0)
let state = reactive({ name: '' })

// 计算属性
let double = computed(() => count.value * 2)

// 侦听器
watch(count, (newVal) => {})
watchEffect(() => { /* 自动依赖追踪 */ })

// 生命周期
onMounted(() => { /* 组件挂载后 */ })

// 暴露给父组件
defineExpose({ count })
```

