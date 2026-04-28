## 一：变量提升与经典循环问题
[JavaScript 变量与作用域](https://www.yuque.com/chenhaonan-b76av/kststh/gfp24wnx13y0gghg)



## <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">二</font>：数据访问安全机制
### **一、 可选链操作符 (**`?.`**)**
**精准定义**：  
可选链操作符 (`?.`) 允许你安全地访问嵌套对象的属性或调用其方法，而无需明确验证链中的每个引用是否有效。

**核心逻辑**：  
当 `?.` 左侧的表达式为 `null` 或 `undefined` 时，整个表达式会**立即短路**，返回 `undefined`。无论后续属性是否存在，都不会再尝试访问，从而避免报错。

**与传统**`.`**操作符的关键区别**：

1. `obj.property`：
    - `obj`** 存在**， `property` 不存在 => 返回 `undefined` (**不会报错**)。
    - `obj`** 不存在**（为 `null` / `undefined`）=> **抛出 **`TypeError` (如：`Cannot read properties of undefined`)。
2. `obj?.property`：
    - `obj`** 存在**， `property` 不存在 => 返回 `undefined`。
    - `obj`** 不存在**（为 `null` / `undefined`）=> **安全地返回 **`undefined`。

**结论**：可选链的核心价值在于处理**链式访问起点可能为 **`null/undefined` 的情况，从根本上防止因访问不存在的根对象而导致的运行时错误。

---

### **二、 空值合并操作符 (**`??`**)**
**精准定义**：  
空值合并操作符 (`??`) 是一个逻辑运算符，它在其左侧操作数为 `null` 或 `undefined` 时，返回其右侧的操作数；否则返回其左侧的操作数。

**“空值”的含义**：  
这里的“空值”特指 `null` 和 `undefined`。之所以命名为“空值合并”，是因为它专门用于将这两种空值“合并”为一个预先定义的默认值。

**与逻辑或 (**`||`**) 的核心区别**：

+ `||` 会在左侧操作数为 **任何“假值”** (`false`, `0`, `""`, `null`, `undefined`, `NaN`) 时返回右侧。
+ `??` **只关心 **`null`** 或 **`undefined`。这在处理可能为合法假值（如数字 `0`、空字符串 `""`）的场景时非常关键。

**面试示例**：

```javascript
const count = 0;
console.log(count || 10); // 10 (0是假值，所以被忽略了)
console.log(count ?? 10); // 0 (0不是null/undefined，所以被保留)
```

---

## 三：闭包与垃圾回收
### **一、内存管理、垃圾回收与内存泄漏**
**1. 垃圾回收机制**  
JavaScript 引擎通过**自动垃圾回收**机制管理内存，其核心目标是**识别并释放程序中不再使用的内存**。

**主要算法**：

+ **标记清除**（主流）：
    1. **标记阶段**：从根对象（全局变量等）出发，遍历所有可达对象，并标记为“活动”。
    2. **清除阶段**：回收所有未被标记为“活动”的对象所占用的内存。
+ **标记整理**：  
在“标记清除”的基础上，增加**整理阶段**：将所有存活的对象移动到内存的一端，从而消除内存碎片，使空闲内存连续，提高后续内存分配效率。
+ **引用计数**（较少使用）：  
跟踪每个值被引用的次数。当引用计数变为 `0` 时，立即回收。其**致命缺点是无法处理“循环引用”**（两个对象相互引用），导致内存无法被释放，容易造成泄漏。

**2. 内存泄漏**  
指程序中已分配的内存，由于某种原因**未能被垃圾回收机制释放**，导致可用内存逐渐减少的现象。

**常见原因及规避**：

+ **意外的全局变量**：未声明的变量会成为全局对象的属性，永远不会被回收。
+ **被遗忘的定时器或事件监听器**：如果持有对外部变量的引用，且未及时清除，相关内存无法释放。
+ **脱离DOM的引用**：在JS中保留了某个DOM元素的引用，即使该元素已从页面上移除。
+ **闭包的不合理使用**（见下文详解）。

**内存泄漏 vs. 内存溢出**：

+ **内存泄漏**是程序**长期运行**后，因垃圾无法回收而导致的**内存使用逐渐增长**的问题。
+ **内存溢出**是程序在**某一时刻**申请的内存**超过了系统能提供的最大内存**，导致程序崩溃。长期的内存泄漏最终可能引发内存溢出。

---

### **二、 闭包**
**精准定义**：  
闭包是指一个函数（内部函数）与其被创建时所处的词法作用域（外部函数）的组合。该内部函数可以**记住并访问**其外部作用域的变量，即使外部函数已经执行完毕。

**形成闭包的三个核心条件**：

1. **函数嵌套**：一个函数（外部函数）内部定义了另一个函数（内部函数）。
2. **内部函数引用了外部函数的变量或参数**。
3. **内部函数被暴露出去**（例如，通过`return`、赋值给全局变量、作为事件处理器等），使其在外部函数执行完毕后依然可被调用。

**为什么闭包可能导致内存泄漏？**  
因为闭包会**长期持有其外部作用域变量的引用**，导致这些本应在外部函数执行结束后被回收的变量，因为仍被内部函数引用而无法被垃圾回收器释放。

**如何释放闭包占用的内存？**  
**关键：切断引用**。

```javascript
function outer() {
  let largeData = /* ...一个很大的数据... */;
  return function inner() {
    console.log('I remember the scope.');
  };
}

let closureFn = outer(); // 此时闭包形成，`largeData` 不会被释放

// ...使用 closureFn ...

closureFn = null; // **关键步骤**：将持有闭包的变量设为 `null`
// 现在，对闭包函数 `inner` 的引用被切断。
// 垃圾回收器在下次运行时，会发现 `inner` 及其引用的 `largeData` 不再可达，从而安全回收。
```

**总结**：闭包是JavaScript强大功能的体现，但需注意其生命周期。当闭包不再需要时，应主动将其引用置为 `null`，以便垃圾回收器工作。

---

## 四：arguments的使用
在调用函数时，浏览器每次都会传递两个隐含的参数：

1. 函数的上下文对象 this
2. 封装实参的对象 arguments

当我们不确定有多少个参数传递的时候，可以使用 `arguments` 来获取。在 JS 中，`arguments` 实际上是当前函数的一个内置对象。所有函数都内置了一个 `arguments` 对象，`arguments` 对象中存储了传递的所有实参。

（1）`arguments` 是一个伪类数组对象，它也可以通过索引来操作数据，通过 `arguments.length` 可以获取实参的长度。伪数组并不是真正意义上的数组：

+ 具有数组的 `length` 属性。
+ 按照索引的顺序进行存储。
+ 它没有真正数组的一些方法。

（2）在调用函数时，我们所传递的实参都会在 `arguments` 中保存。

（3）我们即使不定义形参，也可以通过 `arguments` 来使用实参，只不过比较麻烦。

+ `arguments[0]` 表示第一个实参。
+ `arguments[1]` 表示第二个实参。



## 五：函数this
[this](https://www.yuque.com/chenhaonan-b76av/kststh/ryp3542sytemripg)

## 六：原型链
[JavaScript原型链](https://www.yuque.com/chenhaonan-b76av/kststh/ie0i6ag16g3f5467)

## 七：构造函数与语法糖形式的Class
[es5构造函数与es6的语法糖Class](https://www.yuque.com/chenhaonan-b76av/kststh/bcuys3x7c6eaao19)



## <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">八：toString方法</font>
既可以转字符串又可以判断类型。

[JavaScript 类型检测与原型链深度解析笔记](https://www.yuque.com/chenhaonan-b76av/kststh/gw92m40ypgsd1c9h)



## 九：数组
[JavaScript 数组](https://www.yuque.com/chenhaonan-b76av/kststh/taokgbz0xeducwk0)

## 十：字符串
[字符串](https://www.yuque.com/chenhaonan-b76av/kststh/td02eemvfpltgd2b)

## 十一：包装类
[包装类](https://www.yuque.com/chenhaonan-b76av/kststh/hoanz4d7gusosdd2)





## 十二：宏任务、微任务
[宏/微任务](https://www.yuque.com/chenhaonan-b76av/kststh/kzzy0hfskrp7sdx5)



## 十三：offset、client、scroll
[offset、client、scroll](https://www.yuque.com/chenhaonan-b76av/kststh/loup521vk3zlxucg)

## 十四：易混淆 DOM 事件对比
[易混淆 DOM 事件对比](https://www.yuque.com/chenhaonan-b76av/kststh/syif4x1824mxog3d)

## 十五：Map / Set 基础到实战：事件订阅管理
[Map / Set 基础到实战：事件订阅管理](https://www.yuque.com/chenhaonan-b76av/kststh/xn8dvy26obhuympy)

## **<font style="color:rgb(38, 38, 38);">十六：前端模块的导入与导出，import与export</font>**
[前端模块的导入与导出](https://www.yuque.com/chenhaonan-b76av/kststh/alag7st8czgr4gfn)

## 十七：
## 十八：
## 十九：
## 二十：
