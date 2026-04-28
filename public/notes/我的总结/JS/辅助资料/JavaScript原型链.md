我们所创建的每一个函数，解析器都会向函数中添加一个属性prototype,这个属性对应着一个对象，这个对象就是我们所谓的原型对象(**<font style="color:#FF0000;">prototype是属性名，它的值是一个对象，这个对象叫原型对象</font>**),**<font style="color:#FF0000;">默认</font>**情况下，它是一个**<font style="color:#FF0000;">空</font>**对象

如果我们的函数作为普通函数调用，prototype没有任何作用，

当**<font style="color:#FF0000;">函数以构造函数的形式调用</font>**时，它所**<font style="color:#FF0000;">创建的对象</font>**都会**<font style="color:#FF0000;">有</font>**一个**<font style="color:#FF0000;">隐含的属性</font>**，**<font style="color:#FF0000;">指向该构造函数的原型对象，</font>**我们通过**<font style="color:#FF0000;">__proto__</font>**来**<font style="color:#FF0000;">访问该属性。</font>**

<font style="color:rgba(0, 0, 0, 0.8);">原型对象也是函数对象，所以它也有原型</font>

<font style="color:rgba(0, 0, 0, 0.8);">当我们使用一个对象的属性或方法时，会先在自身中寻找，自身中如果有，则直接使用，如果没有，则去原型对象中寻找，如果原型对象中有，则使用，如果没有，则去原型对象的原型中寻找，直到找到</font><font style="color:#DF2A3F;">Object</font><font style="color:rgba(0, 0, 0, 0.8);">对象的原型，</font>`<font style="color:rgb(0, 0, 0);">Object.prototype</font>`<font style="color:rgba(0, 0, 0, 0.8);"> 是原型链的「终点」，它的 </font>`<font style="color:rgb(0, 0, 0);">[[Prototype]]</font>`<font style="color:rgba(0, 0, 0, 0.8);">（原型）是 </font>`<font style="color:rgb(0, 0, 0);">null</font>`<font style="color:rgba(0, 0, 0, 0.8);">，当访问对象的某个属性时，若沿原型链一直查到 </font>`<font style="color:rgb(0, 0, 0);">Object.prototype</font>`<font style="color:rgba(0, 0, 0, 0.8);"> 仍未找到，会继续查 </font>`<font style="color:rgb(0, 0, 0);">Object.prototype</font>`<font style="color:rgba(0, 0, 0, 0.8);"> 的原型（即 </font>`<font style="color:rgb(0, 0, 0);">null</font>`<font style="color:rgba(0, 0, 0, 0.8);">），此时直接返回 </font>`<font style="color:rgb(0, 0, 0);">undefined</font>`<font style="color:rgba(0, 0, 0, 0.8);">（不会再继续查找）</font>

+ **<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">构造函数</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">：</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">是一个「函数对象」，有自己的属性 / 方法，这些和原型无关，只能通过 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">实例对象.xxx</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 访问；</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">有一个 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">prototype</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 属性 → </font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">专门指向原型对象</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">，这是构造函数和原型对象的 “单向通道”。</font>
+ **<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">原型对象</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">：</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">是一个「普通对象」，存所有实例共享的方法 / 属性，节省内存；</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">天生自带 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">constructor</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 属性 → </font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">反向指向构造函数</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">，相当于 “回形针”，能通过原型找到它的构造函数；</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">有一个 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">__proto__</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 属性 → </font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">指向顶层原型（Object.prototype）</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">，这是原型链的 “向上通道”。</font>
+ **<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">实例对象</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">：</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">是构造函数 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">new</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 出来的普通对象，有自己的属性，这些是 “私有的”；</font>
+ <font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">有一个 </font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">__proto__</font>`<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);"> 属性 → </font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">指向构造函数的原型对象（Phone.prototype）</font>**<font style="color:rgb(31, 35, 41);background-color:rgba(0, 0, 0, 0);">，这是实例能访问原型方法的 “关键通道”。</font>

我来为你提供可以直接查看的Mermaid图表代码，并提供查看方案：



<!-- 这是一个文本绘图，源码为：graph LR
    %% 定义节点
    A[Person 构造函数]
    B[Student 构造函数]
    C[Person.prototype]
    D[Student.prototype]
    E[Object.prototype]
    F[Function.prototype]
    G[student1 实例]
    H[student2 实例]
    I[person3 实例]
    
    %% 原型继承关系
    B -->|prototype| D
    D -->|__proto__| C
    C -->|__proto__| E
    E -->|__proto__| null[null]
    
    %% 构造函数原型链
    A -->|__proto__| F
    B -->|__proto__| F
    F -->|__proto__| E
    
    %% 实例指向原型
    G -->|__proto__| D
    H -->|__proto__| D
    I -->|__proto__| C
    
    %% constructor指向
    C -->|constructor| A
    D -->|constructor| B -->
![](https://cdn.nlark.com/yuque/__mermaid_v3/6d30df68c6830f948c94bc43c7d4c953.svg)

### 1. **构造函数和原型对象**
```javascript
function Person(name) {
    this.name = name;
}

// 构造函数有prototype属性，指向原型对象
console.log(Person.prototype); // 原型对象
```

### 2. **原型对象有constructor指向构造函数**
```javascript
console.log(Person.prototype.constructor === Person); // true
```

### 3. **实例对象的__proto__指向构造函数的原型对象**
```javascript
const p = new Person('张三');
console.log(p.__proto__ === Person.prototype); // true
```

### 4. **构造函数的__proto__指向Function.prototype**
```javascript
console.log(Person.__proto__ === Function.prototype); // true
```

### 5. **原型链的顶端**
```javascript
// 原型对象的__proto__指向Object.prototype
console.log(Person.prototype.__proto__ === Object.prototype); // true

// Object.prototype的__proto__是null
console.log(Object.prototype.__proto__); // null
```

## 完整原型链示例：
```javascript
function Person(name) {
    this.name = name;
}

const p = new Person('张三');

// 完整原型链：
// p -> Person.prototype -> Object.prototype -> null

console.log(p.__proto__ === Person.prototype); // true
console.log(p.__proto__.__proto__ === Object.prototype); // true
console.log(p.__proto__.__proto__.__proto__ === null); // true
```

## 需要注意的几个关键点：
1. **proto**** vs prototype**
    - `__proto__` 是每个对象都有的属性（非标准，但浏览器实现）
    - `prototype` 是函数才有的属性（构造函数特有）
2. **Function的特殊性**

```javascript
// Function比较特殊
console.log(Function.__proto__ === Function.prototype); // true

// Object也是函数
console.log(Object.__proto__ === Function.prototype); // true
```

3. **标准的获取原型的方法**

```javascript
// 推荐使用Object.getPrototypeOf()而不是__proto__
console.log(Object.getPrototypeOf(p) === Person.prototype); // true
```

## 图解原型链：
```plain
实例对象(p)
    ↓ __proto__
构造函数原型(Person.prototype)
    ↓ __proto__
Object.prototype
    ↓ __proto__
null

构造函数(Person)
    ↓ __proto__
Function.prototype
    ↓ __proto__
Object.prototype
    ↓ __proto__
null
```

需要注意：

+ `__proto__` 是浏览器实现的非标准属性，ES5标准是`Object.getPrototypeOf()`
+ 函数的原型链：函数→Function.prototype→Object.prototype→null
+ 实例的原型链：实例→构造函数.prototype→Object.prototype→null

