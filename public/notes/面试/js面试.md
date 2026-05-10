---
title: JavaScript 基础面试题
date: 2026-05-10
category: 面试
tags:
  - JavaScript
  - 数据类型
  - 作用域
  - 异步
description: JavaScript 基础面试题，包括数据类型、作用域、事件循环、类型转换等核心概念。
---

# JavaScript 基础
## 1、数据类型
数据类型分为两种：基本数据类型与引用数据类型。

基本数据类型有：number、string、boolean、null、undefined。

引用数据类型有：array、function等（除了基本数据类型都是引用数据类型）

基本数据类型的主要特点是赋值方式是传值，并且值存在栈中。

引用数据类型的主要特点是赋值方式是传址，并且值存在堆中。

## 2、数据类型判断
JavaScript 中常用的数据类型判断方法有以下 6 种：

1. **typeof 操作符**：用于区分基本数据类型，无法区分具体对象类型。例如，`typeof 123` 返回 `"number"`。
2. **instanceof 操作符**：用于判断对象是否属于某个类（或其子类），不能用于基本数据类型。例如，`[] instanceof Array` 返回 `true`。
3. **Object.prototype.toString.call() 方法**：返回表示调用它的对象所属类的字符串。例如，`Object.prototype.toString.call([])` 返回 `"[object Array]"`。
4. **constructor 属性**：返回对象所属类的构造函数。例如，`[].constructor` 返回 `Array`。
5. **Array.isArray() 方法**：判断一个值是否为数组。例如，`Array.isArray([])` 返回 `true`。
6. **=== 运算符**：进行全等的类型判断，比较值和类型。例如，`5 === "5"` 返回 `false`。

## 3、如何判断是否是数组
+ **instanceof 运算符**：`arr instanceof Array`
+ **constructor 法**：`arr.constructor === Array`
+ **Object.prototype.toString.call() 方法**：`Object.prototype.toString.call(arr) === "[object Array]"`
+ **Array.isArray()**：`Array.isArray(arr)`

## 4、运行机制
JavaScript 的运行机制是事件循环机制。JavaScript 是单线程执行的，将任务分为同步和异步。同步任务进入主线程，异步任务进入事件队列。当主线程代码执行完毕后，会从事件队列中读取异步任务并推到主线程中执行，此过程不断重复，称为事件循环机制。

**补充**：事件循环分为两个阶段：宏任务（如 script、setTimeout）和微任务（如 Promise、MutationObserver）。微任务优先于宏任务执行。

## 5、undefined 和 null 的区别
+ **null**：表示为空，代表此处不应当有值的存在，一个对象可以是 null，代表空对象，而 null 本身也是对象。
+ **undefined**：表示『不存在』，JavaScript 是动态类型语言，成员可能不存在，这就是 undefined 的意义所在。

**补充**：`typeof null` 返回 `"object"` 是 JavaScript 的历史遗留问题，实际开发中应避免使用 `null`，尽量使用 `undefined` 表示无值。

## 6、== 和 === 的区别
+ **==（双等）**：仅比较值是否相等，无需比较类型。例如，`5 == "5"` 返回 `true`。
+ **===（三等）**：同时比较值和数据类型。例如，`5 === "5"` 返回 `false`。

## 7、js 中布尔值为 false 的六种情况
+ `undefined`（未定义找不到值时出现）
+ `null`(代表空值)
+ `NaN`(无法计算时候出现表示非数值，typeof(NaN)是number类型)
+ `false`
+ `0`
+ 空字符串 (`''`、`""`、`` ``)

## 8、null typeof 为什么是 object
因为在javaScript中，不同的对象都是使用二进制存储的，如果二进制前三位都是0的话，系统会判断为是Object类型，而null的二进制全是0，自然也就判断为Object

## 9、this 指向
+ 函数直接调用，this 指向全局对象（浏览器中为 `window`，Node.js 中为 `global`）。
+ 函数作为对象的方法调用，this 指向调用方法的对象。
+ new 构造函数时，this 指向实例对象。
+ 事件函数中，this 指向事件源。
+ 定时器环境 this 指向全局对象。
+ 箭头函数中没有自己的 this，它指向外层作用域的 this。
+ Call、apply、bind 可以更改 this 的指向。

## 10、改变 this 指向的方法及区别
+ **共同点**：call、apply、bind 的第一个参数都是 this 要指向的对象，都可以传递后续参数。
+ **不同点**：
    - **bind**：返回对应函数，不会执行，需要手动调用。例如，`const func = fn.bind(obj)`。
    - **apply、call**：立即调用。例如，`fn.apply(obj)` 或 `fn.call(obj)`。
    - **apply 和 call**：功能一样，但参数传递形式不同。call 将参数按顺序传递，apply 将参数放在数组里。例如，`fn.call(obj, arg1, arg2)` 和 `fn.apply(obj, [arg1, arg2])`。

## 11、构造函数中的 new 做了什么
1. 创建一个新空对象。
2. 将构造函数的原型对象赋值到实例对象的原型链上。
3. 改变构造函数的 this 指向，使其指向新的实例对象。
4. 依次执行代码，赋值。
5. 返回实例对象。如果构造函数中显式返回了一个对象，则返回该对象；否则返回新创建的实例。

## 12、arguments 的特点
+ arguments 只在函数中存在（箭头函数除外）。
+ arguments 是一个类数组对象，具有 length 属性，可通过下标访问。
+ 存储传入的所有实参。
+ 不能调用数组的方法，但可以通过 `Array.prototype.slice.call(arguments)` 转换为数组。

## 13、continue/break/return 的区别
+ **return**：结束循环语句，函数遇到 return 则结束执行，将 return 后的值作为函数调用的返回值。
+ **continue**：结束当次循环，继续执行下次循环。
+ **break**：跳出本轮循环，只能结束离 break 最近的一层循环。

## 14、数组方法
+ **push()**：向数组末尾添加元素，返回新长度。
+ **unshift()**：向数组开头添加元素，返回新长度。
+ **shift()**：删除数组第一个元素，返回被删除的元素。
+ **pop()**：删除数组最后一个元素，返回被删除的元素。
+ **splice()**：删除、替换或添加元素。例如，`arr.splice(index, deleteCount, item1, item2, ...)`。
+ **join()**：将数组元素连接成字符串，返回结果字符串。
+ **split()**：将字符串分割为数组，返回新数组。
+ **reverse()**：反转数组，返回原数组。
+ **map()**：创建新数组，新数组的元素为原数组元素调用函数后的返回值。
+ **filter()**：创建新数组，包含原数组中通过测试的元素。
+ **concat()**：合并两个或多个数组，返回新数组。
+ **forEach()**：对数组的每个元素执行一次提供的函数。

## 15、map() 对比 forEach()
map有返回值，可以开辟新空间，return出来一个length和原数组一致的数组，即便数组元素是undefined或者是null。

forEach默认无返回值，返回结果为undefined，可以通过在函数体内部使用索引修改数组元素。

map的处理速度比forEach快，而且返回一个新的数组，方便链式调用其他数组新方法

## 16、数组转字符串、字符串转数组
+ **join()**：将数组转换为字符串。例如，`[1, 2, 3].join()` 返回 `"1,2,3"`。
+ **split()**：将字符串转换为数组。例如，`"1,2,3".split(",")` 返回 `["1", "2", "3"]`。

## 17、阻止事件冒泡和默认事件的方法
+ **e.stopPropagation()**：阻止事件冒泡。
+ **e.preventDefault()**：阻止默认行为。
+ **return false**：在特定情况下同时阻止事件冒泡和默认事件（需根据事件绑定方式判断）。

## 18、innerHTML 与 innerText 的区别
+ **写入时**：innerText 不识别 HTML 标签，innerHTML 识别 HTML 标签。
+ **读取时**：innerText 返回元素内的文本内容，去除空格、换行和标签；innerHTML 返回元素内的 HTML 内容，保留空格和换行。

## 19、事件代理（事件委托）
将事件处理任务添加到上一级元素，利用事件冒泡机制。优点包括减少注册时间、简化 DOM 节点更新、支持新增节点事件绑定。缺点包括不支持不冒泡的事件、层级多可能导致被中间层阻止、可能频繁调用处理函数。

## 20、本地存储方法及特点
+ **sessionStorage**：仅在当前会话有效，关闭页面或浏览器后清除，内存较小，单页面内共享数据。
+ **localStorage**：长久保存整个网站的数据，无过期时间，内存较大，多页面可共享数据。
+ **cookie**：传统存储方式，有大小限制，每次请求都会携带，需手动管理。

## 21、数组去重方法
1. 利用新旧数组遍历对比法。
2. 利用新语法 `new Set()`。例如，`[...new Set(array)]`。
3. `filter` 与 `indexOf` 结合。例如，`array.filter((item, index) => array.indexOf(item) === index)`。
4. `includes()` 的妙用。例如，`array.filter((item, index) => !array.includes(item, index + 1))`。
5. 利用对象属性不重复进行判断。例如，`array.reduce((acc, item) => ({ ...acc, [item]: item }), {})`。

## 22、事件三要素
+ 事件源：触发事件的 DOM 元素。
+ 事件类型：事件的种类，如 `click`、`mouseover` 等。
+ 事件处理程序：事件触发时执行的函数。

## 23、DOM 事件流
+ **定义**：事件从页面中接受的顺序，事件发生时在元素节点之间按特定顺序传播。
+ **阶段**：
    1. **捕获阶段**：事件从 Document 节点自上而下向目标节点传播。
    2. **当前目标阶段**：目标节点处理事件。
    3. **冒泡阶段**：事件从目标节点自下而上向 Document 节点传播。

## 24、作用域与预解析
+ **作用域**：变量起作用的范围，JavaScript 中有全局作用域和局部作用域。
+ **预解析**：JavaScript 解析器在运行代码前会将 `var` 和 `function` 声明的变量提升到当前作用域的最前面。
+ **代码执行**：从上到下执行 JS 语句。

# JavaScript 高级
## 1、原型与原型链
+ **原型**：
    - 所有引用类型都有一个 `__proto__`（隐式原型）属性，属性值是一个普通对象。
    - 所有函数都有一个 `prototype`（原型）属性，属性值是一个普通对象。
    - 引用类型的 `__proto__` 属性指向其构造函数的 `prototype`。
+ **原型链**：访问对象属性时，若对象本身未找到，则沿 `__proto__` 链向上查找，直至 `null`。

## 2、闭包及其缺点
+ **定义**：一个函数访问另一个函数中的变量，形成闭包。
+ **优点**：延伸变量生命周期，允许外部操作函数内部变量。
+ **缺点**：变量生命周期长，可能导致内存泄漏。
+ **解决方法**：用完后手动释放，尽量少用闭包。

## 3、内存溢出与内存泄露
+ **内存溢出**：程序运行所需内存超过剩余内存时抛出的错误。
+ **内存泄露**：占用的内存未及时释放，积累过多导致内存溢出。
+ **常见内存泄露**：意外的全局变量、未清理的事件回调、闭包、未清理的定时器、大量循环打印控制台日志。

## 4、递归函数及特性
+ 函数调用自身。
+ 特性：
    1. 重复执行。
    2. 调用自身。
    3. 必须有控制条件，避免死循环。

## 5、对象的创建
1. `Object` 构造函数模式。
2. 对象字面量模式。
3. 工厂模式。
4. 自定义构造函数模式。
5. 构造函数 + 原型的组合模式。
6. `class` 创建。

## 6、原生 Ajax 基本请求
+ **GET 请求**：获取资源。
+ **POST 请求**：提交资源。
+ **JSON 返回值**：服务器返回 JSON 格式数据。

![](https://cdn.nlark.com/yuque/0/2025/png/50923934/1750403145820-2c4917a6-2fa0-40b9-a875-a45706bf1119.png)

## 7、跨域
+ **同源**：协议、域名、端口号必须完全相同。
+ **跨域解决方法**：JSONP、CORS、搭建代理服务器。

## 8、Axios 请求方式
+ **GET 请求**：获取资源。
+ **POST 请求**：提交资源。
+ **PUT 请求**：更新整个资源。
+ **PATCH 请求**：部分更新资源。
+ **DELETE 请求**：删除资源。

## 9、线程和进程
+ **线程**：程序执行的基本单位，共享进程资源，可独立调度。
+ **进程**：操作系统资源分配的基本单位，相互独立。
+ **例子**：视频播放器中，一个进程内可能有多个线程执行不同任务（如读取文件、解码、播放）。

## 10、同步与异步（微任务、宏任务）
+ **同步代码（微任务）**：按顺序执行，阻塞后续代码。
+ **异步代码（宏任务）**：后台执行，完成后调用回调函数。
+ 常见异步操作：网络请求、定时器、事件监听等。
+ 异步处理方式：回调函数、Promise、async/await。
+ **事件循环**：先执行栈中的同步任务，再执行微任务队列中的任务，最后执行宏任务队列中的任务。

## 11、对象的继承
+ 原型链继承。
+ 原型链 + 构造函数的组合继承。
+ ES6 中，`class` 通过 `extends` 和 `super` 关键字实现继承。

## 12、深浅拷贝区别
+ **浅拷贝**：拷贝引用，新对象改变时原对象也会改变。
+ **深拷贝**：拷贝所有层级数据，新对象改变不影响原对象。

> 深浅拷贝主要区别在复杂数据类型，对于基本数据类型，没有区别，改变拷贝的数据，都不会改变原数据
>
> **浅拷贝（shallow copy）**：
> 浅拷贝只拷贝引用（地址值），当拷贝的新对象发生改变时，原对象也会发生相同的改变，也就是说，浅拷贝会影响原来的元素
>
> **深拷贝（deep copy）**：
> 每一级的数据都会拷贝，拷贝后，两个对象拥有不同的地址，当拷贝出来的对象发生改变时，原对象内容不会改变，两者互不影响

## 13、如何实现深拷贝
+ `Object.assign()`：仅浅拷贝对象的自身可枚举属性。
+ `JSON.parse(JSON.stringify())`：可实现简单深拷贝，但无法处理函数、`undefined`、`Date`、`RegExp` 等特殊类型。
+ 手写递归方法：可处理复杂数据类型。
+ jQuery 的 `extend` 方法。
+ lodash 函数库（如 `_.cloneDeep`）。

## 14、节流和防抖的目的
都是为了**限制函数的执行频次**，以优化函数触发频率过高导致的响应速度跟不上触发频率，防止在短时间内频繁触发同一事件而出现延迟，假死或卡顿的现象

## 15、防抖与节流
> **防抖**：如果不断在 delay 之前重新触发，那么定时器会不断重新计时，最终会在最后一次完后才执行。
>
> **节流**：目前有一事件 A 设置了定时器，那么在 delay 之前触发，都只会触发一次。

## 16、防抖节流应用场景
+ **防抖**：表单校验、搜索框模糊查询、文本编辑器实时保存。
+ **节流**：高频事件（如点击、滑动、resize、scroll）、下拉加载、视频播放记录时间。

## 17、防抖函数简单版
```javascript
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
```

## 18、节流函数定时器版
```javascript
function throttle(func, delay) {
  let timer;
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
```

## 19、懒加载
懒加载也就是延迟加载。当访问一个页面的时候，先把img元素或是其他元素的背景图片路径替换成一张大小为1*1px图片的路径（这样就只需请求一次，俗称占位图），

只有当图片出现在浏览器的可视区域内时，才设置图片真正的路径，让图片显示出来。这就是图片懒加载。

## 20、懒加载的优点
+ 页面加载速度快。
+ 减轻服务器压力。
+ 节约流量。
+ 提升用户体验。

## 21、预加载
提前加载可能需要的资源，后续使用时直接从缓存取资源。预加载简单来说就是将所有所需的资源提前请求加载到本地，这样后面在需要用到时就直接从缓存取资源。

## 22、预加载的目的
减少用户等待时间，避免页面加载过慢导致的空白显示。在网页全部加载之前，对一些主要内容进行加载，以提供给用户更好的体验，减少等待的时间。否则，如果一个页面的内容过于庞大，没有使用预加载技术的页面就会长时间的展现为一片空白，直到所有内容加载完毕。

# ES6-ES14
## 1、ES6 的新特性
+ 类语法。
+ 模块化。
+ 箭头函数。
+ 函数参数默认值。
+ 模板字符串。
+ 解构赋值。
+ 延展操作符。
+ 对象属性简写。
+ Promise。
+ Let 与 Const 等。

## 2、let，const，var 的区别
+ **var**：有变量提升，无块级作用域，与顶级对象挂钩。
+ **let、const**：无变量提升，有块级作用域，不与顶级对象挂钩。
+ **let**：可定义不赋值。
+ **const**：必须赋值，不可修改变量值（但可修改复杂数据类型的内部内容）。

## 3、箭头函数与普通函数的区别
+ 箭头函数有简写方式，一个参数时可省略小括号，函数体为单句时可省略大括号。
+ 不可作为构造函数，不能使用 new。
+ 无 arguments 对象。
+ this 是静态的，始终指向函数声明时所在作用域的 this 值。

## 4、数据类型
string、number、boolean、null、undefined、object、Symbol。

## 5、Promise
异步编程解决方案，解决回调地狱问题。

+ 三种状态：pending（等待中）、fulfilled（成功）、rejected（失败）。
+ 使用 new 创建，参数为回调函数，回调函数中有两个参数（成功回调和失败回调）。
+ 使用 .then 处理成功结果，.catch 处理错误，可结合 async/await 使用。

## 6、模块化使用
+ **暴露**：
    - 分别暴露：`export const name = value;`
    - 统一暴露：`export { name1, name2 };`
    - 默认暴露：`export default value;`
+ **导入**：
    - 通用导入：`import module from 'file';`
    - 解构导入：`import { name1, name2 } from 'file';`
    - 默认导入：`import def from 'file';`

## 7、Object.getOwnPropertyDescriptors
返回指定对象所有自身属性的描述对象，包括：

+ value：属性值。
+ writable：是否可写。
+ configurable：是否可删除。
+ enumerable：是否可遍历。

## 8、类的私有属性、私有方法、静态属性、静态方法
+ **私有属性和方法**：使用 `#` 定义，只能在类内部使用。
+ **静态属性和方法**：使用 `static` 定义，构造函数可直接使用，实例对象无法使用。

## 9、ES6 新增数据结构
+ **Set**：集合，成员唯一。
+ **Map**：键值对集合，键可以是任意类型。
+ **WeakSet** 和 **WeakMap**：与 Set 和 Map 类似，但引用弱化，垃圾回收更高效。

## 10、模板字符串
使用反引号（`` ` ``）定义字符串，支持多行和表达式嵌入。例如：

```javascript
const name = "John";
const age = 30;
const str = `Name: ${name}, Age: ${age}`;
```

## 11、解构赋值
从数组或对象中提取值并赋给变量。例如：

```javascript
const [a, b] = [1, 2];
const { name, age } = { name: "John", age: 30 };
```

## 12、扩展运算符
+ 用于数组或字符串的展开。例如：

```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
```

+ 用于对象的展开。例如：

```javascript
const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };
```

## 13、Promise.all() 和 Promise.race()
+ **Promise.all()**：等待所有 Promise 完成，返回结果数组。例如：

```javascript
Promise.all([promise1, promise2]).then(([result1, result2]) => {});
```

+ **Promise.race()**：哪个 Promise 最先完成就返回哪个结果。例如：

```javascript
Promise.race([promise1, promise2]).then(result => {});
```

## 14、async/await
+ **async**：声明异步函数，返回 Promise。
+ **await**：等待 Promise 结果。例如：

```javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

## 15、Proxy 和 Reflect
+ **Proxy**：创建对象的代理，拦截和自定义操作。例如：

```javascript
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  }
};
const proxy = new Proxy(obj, handler);
```

+ **Reflect**：提供操作对象的方法，与 Proxy 配合使用。例如：

```javascript
Reflect.get(obj, 'property');
```

## 16、Symbol
Symbol 是一种唯一且不可变的数据类型，常用于创建对象的唯一属性名。例如：

```javascript
const uniqueSymbol = Symbol('description');
const obj = {
  [uniqueSymbol]: 'value'
};
```

## 17、模块热替换（HMR）
在开发过程中，无需刷新页面即可更新模块内容，常用于 React、Vue 等框架的开发环境。

## 18、Intl 对象
提供语言敏感的数据格式化和操作，支持不同地区的日期、货币、数字格式。例如：

```javascript
const date = new Date();
const formattedDate = new Intl.DateTimeFormat('zh-CN').format(date);
```

## 19、Atomics 对象
提供一组静态方法，用于原子操作，常用于共享内存的并发编程。

## 20、SharedArrayBuffer
允许多个 JavaScript 线程共享同一块内存，配合 Atomics 使用，实现并发编程。

## 21、BigInt
表示任意精度的整数，解决 JavaScript 中 Number 类型精度限制问题。例如：

```javascript
const bigInt = 123456789012345678901234567890n;
```

## 22、可选链操作符（?.）
安全访问对象深层属性，避免报错。例如：

```javascript
const value = obj?.prop?.subProp;
```

## 23、空值合并操作符（??）
提供默认值，仅当值为 null 或 undefined 时生效。例如：

```javascript
const result = value ?? defaultValue;
```

## 24、动态 import()
动态加载模块，返回 Promise。例如：

```javascript
const module = await import('module-path');
```

## 25、监听器选项（如 { once: true }）
为事件监听器提供选项，如只执行一次。例如：

```javascript
element.addEventListener('click', handler, { once: true });
```

## 26、trimStart() 和 trimEnd()
去除字符串两端空白字符。例如：

```javascript
const str = '   Hello   ';
console.log(str.trimStart()); // 'Hello   '
console.log(str.trimEnd());   // '   Hello'
```

## 27、String.prototype.matchAll()
返回字符串中所有匹配正则表达式的迭代器。例如：

```javascript
const regex = /word/g;
const str = 'word word';
const matches = str.matchAll(regex);
for (const match of matches) {
  console.log(match);
}
```

## 28、Array.prototype.flat() 和 flatMap()
+ **flat()**：将数组拍平指定层级。例如：

```javascript
[1, [2, [3]]].flat(2); // [1, 2, 3]
```

+ **flatMap()**：映射后拍平一层。例如：

```javascript
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

## 29、Object.fromEntries()
将键值对列表转换为对象。例如：

```javascript
const entries = [['a', 1], ['b', 2]];
const obj = Object.fromEntries(entries); // { a: 1, b: 2 }
```

## 30、Map 和 Set 的新方法
+ **Map.prototype.groupBy()**：根据条件分组。
+ **Set.prototype.union()**：返回两个集合的并集。

## 31、Error Causes
为错误对象提供原因属性，便于调试。例如：

```javascript
throw new Error('message', { cause: someValue });
```

## 32、Intl.Segmenter
提供文本分词功能，支持语言敏感的文本分割。例如：

```javascript
const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' });
const segments = segmenter.segment('Hello World');
```

## 33、Intl.ListFormat
格式化列表为本地化字符串。例如：

```javascript
const formatter = new Intl.ListFormat('zh-CN', { style: 'long' });
console.log(formatter.format(['Apple', 'Banana'])); // 'Apple 和 Banana'
```

## 34、Intl.RelativeTimeFormat
格式化相对时间。例如：

```javascript
const rtf = new Intl.RelativeTimeFormat('zh-CN');
console.log(rtf.format(-1, 'day')); // '昨天'
```

## 35、Intl.DateTimeFormat 的新选项
支持更多日期时间格式化选项，如时区偏移。

## 36、Intl.PluralRules
提供语言敏感的复数规则，用于格式化消息。例如：

```javascript
const pluralRules = new Intl.PluralRules('en-US');
console.log(pluralRules.select(1)); // 'one'
console.log(pluralRules.select(2)); // 'other'
```

## 37、Intl.NumberFormat 的新选项
支持更多数字格式化选项，如货币显示。

## 38、Intl.Locale
表示语言标签，提供语言相关信息。例如：

```javascript
const locale = new Intl.Locale('zh-CN');
console.log(locale.language); // 'zh'
```

## 39、Intl.Collator 的新选项
支持更多字符串比较选项，如忽略标点。

## 40、Intl.DateTimeFormat 的 timeStyle 和 dateStyle 选项
简化日期时间格式化配置。例如：

```javascript
new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full', timeStyle: 'long' });
```

