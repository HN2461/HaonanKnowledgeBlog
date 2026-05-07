---
title: Map与Set事件订阅管理器
date: 2026-05-07
category: 我的总结/JS/辅助资料
tags:
  - JavaScript
  - Map
  - Set
  - 事件订阅
  - 设计模式
description: 从ES6 Map/Set基础概念到事件订阅管理器实战，详解如何使用Map和Set构建高效的事件系统。
---

目标：**一次复习，长期可用**。这篇笔记从 ES6 的 Map / Set 概念讲起，再过渡到你写的事件订阅管理器（EventManager），由浅入深，避免以后复习时还要先翻 Map / Set 的资料。

---

## 一、为什么要学 Map / Set（先讲“为什么”）
在实际开发中，我们经常遇到这些需求：

+ 需要 **用某个“标识”快速找到对应的数据**（例如：事件名 → 回调列表）
+ 需要 **保证数据不重复**（例如：同一个回调不要被绑定多次）
+ 需要 **频繁增删、查询**，而不是只读

如果只用：

+ **普通对象 + 数组**：
    - 对象键只能是字符串
    - 数组需要手动去重
    - API 语义不清晰

👉 ES6 提供了 **Map / Set**，专门解决这些问题。

---

## 二、Map：映射 / 字典（有键 + 有值）
### 1️⃣ Map 是什么（概念）
**Map = 键值对的集合**（程序员常叫：映射 / 字典）

+ 一个键，只能对应一个值
+ 键具有唯一性，不会重复
+ 键可以是 **任意类型**（字符串、对象、函数都行）

心智模型：

+ 键 👉 门牌号
+ 值 👉 房子
+ 用键找值

### 2️⃣ Map 的核心特性
+ ❌ 不会出现重复键
+ ✅ 键存在时，`set` 会 **覆盖值，不会新建键**
+ ✅ 非常适合「**一一对应关系**」的场景

### 3️⃣ Map 常用 API（必背）
| API | 中文说法 | 作用 |
| --- | --- | --- |
| `map.set(key, value)` | 设置键值 | 新建或覆盖键值对 |
| `map.get(key)` | 取值 | 通过键获取值 |
| `map.has(key)` | 判断是否存在 | 判断是否有这个键 |
| `map.delete(key)` | 删除键 | 删除指定键和值 |
| `map.clear()` | 清空 | 清空所有键值对 |
| `map.size` | 长度 | 键值对数量 |


### 4️⃣ 示例
```javascript
const m = new Map();

m.set('click', 123);
m.set('click', 456); // 覆盖，不是新增

m.size; // 1
m.get('click'); // 456
```

---

## 三、Set：集合（只有值 + 自动去重）
### 1️⃣ Set 是什么（概念）
**Set = 一组不重复的值的集合**（程序员常叫：集合）

+ 没有键名，只有值
+ 值具有唯一性
+ 适合用来 **去重、存唯一成员**

心智模型：

+ 一个箱子
+ 只关心「有没有这个东西」
+ 不关心顺序和索引

### 2️⃣ Set 的核心特性
+ ❌ 没有 `get` 方法（因为没有键）
+ ✅ 自动去重
+ ✅ 可迭代（`forEach` / `for...of`）

### 3️⃣ Set 常用 API（必背）
| API | 中文说法 | 作用 |
| --- | --- | --- |
| `set.add(value)` | 添加元素 | 自动去重 |
| `set.has(value)` | 是否存在 | 判断是否包含 |
| `set.delete(value)` | 删除元素 | 精准删除 |
| `set.clear()` | 清空 | 清空所有元素 |
| `set.size` | 数量 | 元素个数 |


### 4️⃣ 示例
```javascript
const s = new Set();

const fn = () => {};
s.add(fn);
s.add(fn);

s.size; // 1
```

---

## 四、为什么 Map + Set 是黄金组合
这是**事件管理器设计的核心思想**

### 组合含义
+ **Map**：事件名 → 回调集合
+ **Set**：同一事件下的所有回调（唯一）

```javascript
Map
├── 'login'  → Set(fn1, fn2)
├── 'logout' → Set(fn3)
```

### 对比普通方案
| 方案 | 问题 |
| --- | --- |
| 对象 + 数组 | 键受限、回调重复、维护复杂 |
| Map + Set | 语义清晰、自动去重、易维护 |


---

## 五、事件订阅管理器（EventManager）实战
有了前面的概念，这一段只是在“**组合使用 Map 和 Set**”

### 1️⃣ 设计目标
+ 一个事件 → 多个回调
+ 回调不重复
+ 可绑定 / 可解绑 / 可触发
+ 支持跨文件、跨组件通信

---

## 六、EventManager 核心实现（逐步理解）
```javascript
class EventManager {
  constructor() {
    // Map：事件名 -> Set(回调)
    this.listeners = new Map();
  }
```

### ① on：绑定事件
```javascript
on(event, callback) {
  if (!this.listeners.has(event)) {
    this.listeners.set(event, new Set());
  }
  this.listeners.get(event).add(callback);
}
```

**逻辑拆解：**

1. Map 里有没有这个事件名？
2. 没有 → 新建事件名，对应一个空 Set
3. 往 Set 里加回调（自动去重）

---

### ② off：解绑事件
```javascript
off(event, callback) {
  if (this.listeners.has(event)) {
    this.listeners.get(event).delete(callback);
  }
}
```

**关键点（非常重要）：**

+ 必须是 **同一个函数引用**
+ 匿名函数无法精准解绑

---

### ③ emit：触发事件
```javascript
emit(event, data) {
  if (this.listeners.has(event)) {
    this.listeners.get(event).forEach(cb => cb(data));
  }
}
```

**核心思想：**

+ 找到事件对应的 Set
+ 遍历执行所有回调
+ 实现“一对多通知”

---

## 七、完整流程一句话总结
**on**：Map 按事件分组，Set 存唯一回调

**off**：从指定事件的 Set 中精准删回调

**emit**：遍历 Set，执行所有回调

👉 最终效果：

+ 任意地方监听事件
+ 任意地方触发事件
+ 模块之间完全解耦

---

## 八、实战使用场景（你以后一定会用）
+ 登录成功：
    - 更新用户信息
    - 关闭登录弹窗
    - 显示欢迎语
+ 全局通知 / 消息系统
+ 跨组件通信（不依赖 props / emit）

---

## 九、Map / Set 速记口诀（复习用）
+ **Map**：有键有值，用 `set` 存，用 `get` 取
+ **Set**：只有值，用 `add` 存，不用 `get`
+ **去重 → Set**
+ **映射关系 → Map**

---

这篇笔记你以后只要：

1️⃣ 想不起 Map / Set → 直接看前半部分  
2️⃣ 想不起事件管理器 → 看后半部分

就能 **无缝衔接**。

