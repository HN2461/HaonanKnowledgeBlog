# 第3章　编写 JavaScript 的方式与加载机制

## 3.1 内联脚本、内部脚本、外部脚本

### 三种脚本编写方式概览

在网页中编写JavaScript代码有三种主要方式，每种方式都有其适用场景和特点：

| 方式 | 定义位置 | 适用场景 | 优缺点 |
|------|---------|----------|--------|
| 内联脚本 | HTML元素的事件属性中 | 简单的事件响应 | 简单但不易维护 |
| 内部脚本 | HTML文档的`<script>`标签内 | 页面特定的逻辑 | 便于调试但增加文档大小 |
| 外部脚本 | 独立的.js文件中 | 可复用的功能模块 | 可缓存、易维护但需额外请求 |

### 内联脚本 (Inline Scripts)

内联脚本直接写在HTML元素的事件属性中，是最简单但也最不推荐的方式：

```html
<!-- 内联脚本示例 -->
<button onclick="alert('Hello World!')">点击我</button>

<a href="javascript:void(0)" onclick="showDetails()">查看详情</a>

<form onsubmit="return validateForm()">
    <input type="text" name="username" required>
    <button type="submit">提交</button>
</form>
```

**内联脚本的问题：**
```html
<!-- ❌ 不推荐：代码与结构混合 -->
<button onclick="
    if(confirm('确定要删除吗？')) {
        fetch('/api/delete/' + this.dataset.id, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                this.parentNode.remove();
            }
        });
    }
" data-id="123">删除</button>
```

### 内部脚本 (Internal Scripts) 

内部脚本写在HTML文档的`<script>`标签内：

```html
<!DOCTYPE html>
<html>
<head>
    <title>内部脚本示例</title>
</head>
<body>
    <button id="myButton">点击我</button>
    
    <script>
        // 内部脚本 - 页面特定的功能
        document.addEventListener('DOMContentLoaded', function() {
            const button = document.getElementById('myButton');
            
            /**
             * 处理按钮点击事件
             */
            button.addEventListener('click', function() {
                console.log('按钮被点击了');
                this.textContent = '已点击';
                this.disabled = true;
            });
        });
        
        // 页面特定的配置
        const pageConfig = {
            title: '当前页面配置',
            version: '1.0.0',
            features: ['search', 'filter', 'sort']
        };
        
        /**
         * 初始化页面功能
         * @param {Object} config - 页面配置对象
         */
        function initializePage(config) {
            document.title = config.title;
            console.log('页面初始化完成，版本:', config.version);
        }
        
        initializePage(pageConfig);
    </script>
</body>
</html>
```

**内部脚本的适用场景：**
- 页面特定的配置和初始化代码
- 需要访问页面内联数据的脚本
- 原型开发和调试阶段

### 外部脚本 (External Scripts)

外部脚本存储在独立的.js文件中，通过`src`属性引用：

```html
<!-- HTML文件 -->
<!DOCTYPE html>
<html>
<head>
    <title>外部脚本示例</title>
</head>
<body>
    <div id="app"></div>
    
    <!-- 引用外部脚本 -->
    <script src="js/utils.js"></script>
    <script src="js/components.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

```javascript
// js/utils.js - 工具函数库
/**
 * 工具函数集合
 */
const Utils = {
    /**
     * 格式化日期
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(date) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
};
```

```javascript
// js/components.js - 组件库
/**
 * UI组件库
 */
const Components = {
    /**
     * 创建按钮组件
     * @param {string} text - 按钮文本
     * @param {Function} onClick - 点击事件处理函数
     * @returns {HTMLElement} 按钮元素
     */
    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'btn btn-primary';
        button.addEventListener('click', onClick);
        return button;
    },

    /**
     * 创建模态框
     * @param {string} title - 模态框标题
     * @param {string} content - 模态框内容
     */
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // 关闭功能
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        return modal;
    }
};
```

```javascript
// js/app.js - 主应用逻辑
/**
 * 主应用类
 */
class App {
    constructor() {
        this.container = document.getElementById('app');
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.createUI();
        this.bindEvents();
        console.log('应用初始化完成');
    }

    /**
     * 创建用户界面
     */
    createUI() {
        const title = document.createElement('h1');
        title.textContent = '我的应用';
        
        const button = Components.createButton('显示信息', () => {
            this.showInfo();
        });
        
        this.container.appendChild(title);
        this.container.appendChild(button);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 页面加载完成事件
        window.addEventListener('load', () => {
            console.log('页面加载完成时间:', Utils.formatDate(new Date()));
        });
    }

    /**
     * 显示信息模态框
     */
    showInfo() {
        const modal = Components.createModal(
            '应用信息',
            `<p>当前时间: ${Utils.formatDate(new Date())}</p>
             <p>这是一个使用外部脚本构建的应用</p>`
        );
        document.body.appendChild(modal);
    }
}

// 创建应用实例
const app = new App();
```

### 最佳实践与选择标准

#### 选择决策树

```
脚本类型选择
├── 是否需要复用？
│   ├── 是 → 外部脚本
│   └── 否 ↓
├── 代码是否复杂（>10行）？
│   ├── 是 → 内部脚本或外部脚本
│   └── 否 ↓
├── 是否需要SEO友好？
│   ├── 是 → 避免内联脚本
│   └── 否 → 可考虑内联脚本（不推荐）
```

#### 最佳实践规则

1. **优先使用外部脚本**
```html
<!-- ✅ 推荐 -->
<script src="js/main.js"></script>

<!-- ❌ 避免 -->
<script>
    // 大量代码写在这里...
</script>
```

2. **合理组织文件结构**
```
project/
├── index.html
├── js/
│   ├── utils/
│   │   ├── date.js
│   │   └── ajax.js
│   ├── components/
│   │   ├── modal.js
│   │   └── button.js
│   └── main.js
├── css/
└── assets/
```

3. **使用模块化开发**
```javascript
// 现代模块化方式
// math.js
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// main.js  
import { add, multiply } from './math.js';

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
```

4. **遵循关注点分离原则**
```html
<!-- ✅ 推荐：结构、样式、行为分离 -->
<button id="submitBtn" class="btn-primary">提交</button>

<script>
document.getElementById('submitBtn').addEventListener('click', handleSubmit);
</script>

<!-- ❌ 避免：混合在一起 -->
<button onclick="handleSubmit()" style="color: blue;">提交</button>
```

---

## 3.2 script 标签与执行顺序

### script 标签的基本语法

`<script>`标签是在HTML中嵌入JavaScript的标准方式，具有多个重要属性：

```html
<!-- 基本语法结构 -->
<script 
    src="脚本文件路径"
    type="脚本类型" 
    async="异步加载"
    defer="延迟执行"
    crossorigin="跨域设置"
    integrity="完整性校验">
    // 内联JavaScript代码
</script>
```

#### 常用属性详解

| 属性 | 说明 | 示例 |
|------|------|------|
| `src` | 外部脚本文件路径 | `src="js/main.js"` |
| `type` | 脚本MIME类型 | `type="text/javascript"` (默认) |
| `async` | 异步加载和执行 | `async` |
| `defer` | 延迟到DOM解析完成后执行 | `defer` |
| `crossorigin` | 跨域资源共享 | `crossorigin="anonymous"` |
| `integrity` | 子资源完整性校验 | `integrity="sha384-xxx"` |

```html
<!-- 各种script标签示例 -->
<!DOCTYPE html>
<html>
<head>
    <!-- 1. 基本外部脚本 -->
    <script src="js/config.js"></script>
    
    <!-- 2. 带类型声明的脚本 -->
    <script type="text/javascript" src="js/legacy.js"></script>
    
    <!-- 3. ES6模块 -->
    <script type="module" src="js/modern.js"></script>
    
    <!-- 4. 异步脚本 -->
    <script async src="js/analytics.js"></script>
    
    <!-- 5. 延迟脚本 -->
    <script defer src="js/main.js"></script>
    
    <!-- 6. 跨域脚本 -->
    <script crossorigin="anonymous" src="https://cdn.example.com/library.js"></script>
</head>
<body>
    <!-- 7. 内联脚本 -->
    <script>
        console.log('页面开始加载');
    </script>
</body>
</html>
```

### 脚本执行顺序规则

#### 默认执行顺序（同步加载）

浏览器按照`<script>`标签在文档中出现的顺序执行：

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        console.log('1. Head中的内联脚本');
        var globalVar = 'Global';
    </script>
    
    <script src="js/first.js"></script>  <!-- 2. 第一个外部脚本 -->
    <script src="js/second.js"></script> <!-- 3. 第二个外部脚本 -->
</head>
<body>
    <script>
        console.log('4. Body开始处的脚本');
        console.log('访问globalVar:', globalVar);
    </script>
    
    <div id="content">页面内容</div>
    
    <script>
        console.log('5. Body结束处的脚本');
        // 此时DOM元素已经可以访问
        document.getElementById('content').style.color = 'blue';
    </script>
</body>
</html>
```

```javascript
// js/first.js
console.log('2. First.js 执行');
/**
 * 第一个脚本中定义的函数
 */
function firstFunction() {
    return 'First script loaded';
}
```

```javascript  
// js/second.js
console.log('3. Second.js 执行');
/**
 * 第二个脚本可以访问前面脚本的内容
 */
function secondFunction() {
    console.log('调用第一个脚本的函数:', firstFunction());
}
```

#### 执行阻塞行为

同步脚本会阻塞HTML解析：

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        console.log('开始执行脚本');
        
        // 模拟耗时操作（不推荐在实际项目中使用）
        const start = Date.now();
        while (Date.now() - start < 2000) {
            // 阻塞2秒
        }
        
        console.log('脚本执行完毕');
    </script>
</head>
<body>
    <!-- 这里的内容要等待上面的脚本执行完才能显示 -->
    <h1>页面标题</h1>
    <p>这段文字要等脚本执行完才显示</p>
</body>
</html>
```

### 依赖管理与执行时机

#### 脚本依赖问题

```html
<!-- ❌ 错误的依赖顺序 -->
<script>
    // 此时jQuery还未加载，会报错
    $('body').addClass('loaded'); // ReferenceError: $ is not defined
</script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- ✅ 正确的依赖顺序 -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    // 确保jQuery已加载
    $(document).ready(function() {
        $('body').addClass('loaded');
    });
</script>
```

#### 依赖检测与错误处理

```javascript
/**
 * 检查依赖是否加载的工具函数
 * @param {string} dependencyName - 依赖名称
 * @param {Function} callback - 依赖加载后的回调
 * @param {number} timeout - 超时时间（毫秒）
 */
function waitForDependency(dependencyName, callback, timeout = 5000) {
    const startTime = Date.now();
    
    function check() {
        if (window[dependencyName]) {
            callback();
        } else if (Date.now() - startTime > timeout) {
            console.error(`依赖 ${dependencyName} 加载超时`);
        } else {
            setTimeout(check, 100);
        }
    }
    
    check();
}

// 使用示例
waitForDependency('jQuery', function() {
    console.log('jQuery已加载，可以安全使用');
    $('.my-element').fadeIn();
});
```

#### DOM就绪状态处理

```javascript
/**
 * 确保DOM就绪的跨浏览器解决方案
 * @param {Function} callback - DOM就绪后执行的函数
 */
function domReady(callback) {
    if (document.readyState === 'loading') {
        // DOM仍在加载中
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        // DOM已经加载完成
        callback();
    }
}

// 使用示例
domReady(function() {
    console.log('DOM已就绪');
    
    // 安全地访问DOM元素
    const button = document.getElementById('myButton');
    if (button) {
        button.addEventListener('click', handleClick);
    }
});

/**
 * 按钮点击处理函数
 * @param {Event} event - 点击事件对象
 */
function handleClick(event) {
    console.log('按钮被点击');
    event.target.textContent = '已点击';
}
```

#### 模块化依赖管理

现代JavaScript使用ES6模块来管理依赖：

```html
<!-- HTML文件 -->
<!DOCTYPE html>
<html>
<head>
    <!-- 启用ES6模块 -->
    <script type="module" src="js/app.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

```javascript
// js/utils.js - 工具模块
/**
 * 实用工具函数
 */
export const utils = {
    /**
     * 生成随机ID
     * @returns {string} 随机ID字符串
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    /**
     * 格式化货币
     * @param {number} amount - 金额
     * @returns {string} 格式化后的货币字符串
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    }
};

export default utils;
```

```javascript
// js/components.js - 组件模块  
import { utils } from './utils.js';

/**
 * 产品卡片组件
 */
export class ProductCard {
    constructor(product) {
        this.product = product;
        this.id = utils.generateId();
    }

    /**
     * 渲染产品卡片
     * @returns {HTMLElement} 产品卡片DOM元素
     */
    render() {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${this.product.name}</h3>
            <p>价格: ${utils.formatCurrency(this.product.price)}</p>
            <button data-product-id="${this.id}">加入购物车</button>
        `;
        
        return card;
    }
}
```

```javascript
// js/app.js - 主应用模块
import { utils } from './utils.js';
import { ProductCard } from './components.js';

/**
 * 主应用类
 */
class App {
    constructor() {
        this.products = [
            { name: 'iPhone 14', price: 5999 },
            { name: 'MacBook Pro', price: 12999 },
            { name: 'AirPods Pro', price: 1899 }
        ];
        
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        console.log('应用初始化开始');
        this.renderProducts();
        this.bindEvents();
        console.log('应用初始化完成');
    }

    /**
     * 渲染产品列表
     */
    renderProducts() {
        const container = document.getElementById('app');
        
        this.products.forEach(product => {
            const card = new ProductCard(product);
            container.appendChild(card.render());
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-product-id]')) {
                const productId = e.target.dataset.productId;
                console.log('添加产品到购物车:', productId);
            }
        });
    }
}

// 自动初始化应用
new App();
```

---

## 3.3 async 与 defer 差异

### 同步加载的问题

传统的同步脚本加载会阻塞HTML解析，影响页面性能：

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 同步脚本 - 阻塞HTML解析 -->
    <script src="large-library.js"></script> <!-- 3秒下载时间 -->
    <script src="another-script.js"></script> <!-- 2秒下载时间 -->
</head>
<body>
    <!-- 这些内容要等待上面所有脚本下载并执行完才能显示 -->
    <h1>页面内容</h1>
    <p>用户需要等待5秒才能看到这些内容</p>
</body>
</html>
```

**同步加载的问题：**
1. **阻塞渲染**：脚本下载和执行期间，页面显示空白
2. **串行加载**：脚本必须按顺序下载，无法并行
3. **用户体验差**：首屏渲染时间长

### async 属性详解

`async`属性让脚本异步加载，下载完成后立即执行：

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 异步脚本 - 不阻塞HTML解析 -->
    <script async src="analytics.js"></script>
    <script async src="ads.js"></script>
    <script async src="social-widgets.js"></script>
</head>
<body>
    <h1>页面内容</h1>
    <p>这些内容会立即显示，不等待脚本加载</p>
</body>
</html>
```

#### async执行时序图

```
HTML解析    ████████████████████████████████████
analytics   ████ 执行
ads              ██████ 执行  
social               ████████ 执行
页面显示    ████████████████████████████████████
```

#### async适用场景

```javascript
// analytics.js - 统计代码（独立运行）
/**
 * 网站统计代码 - 不依赖其他脚本
 */
(function() {
    // 发送页面访问统计
    fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        })
    });
})();
```

```javascript
// ads.js - 广告代码（独立运行）  
/**
 * 广告加载代码 - 不影响主要功能
 */
window.addEventListener('load', function() {
    const adContainer = document.getElementById('ad-container');
    if (adContainer) {
        // 异步加载广告内容
        loadAdvertisement(adContainer);
    }
});

/**
 * 加载广告
 * @param {HTMLElement} container - 广告容器
 */
function loadAdvertisement(container) {
    // 广告加载逻辑
}
```

### defer 属性详解  

`defer`属性让脚本延迟到HTML解析完成后按顺序执行：

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 延迟脚本 - 保持执行顺序 -->
    <script defer src="jquery.js"></script>
    <script defer src="app.js"></script>  <!-- 依赖jquery.js -->
    <script defer src="init.js"></script> <!-- 依赖app.js -->
</head>
<body>
    <h1>页面内容</h1>
    <div id="app">应用容器</div>
    
    <!-- 脚本会在DOM解析完成后按顺序执行 -->
</body>
</html>
```

#### defer执行时序图

```
HTML解析    ████████████████████████████████████
jquery.js   ████████                              执行
app.js           ██████                          执行  
init.js               ████                      执行
页面显示    ████████████████████████████████████
```

#### defer使用示例

```javascript
// jquery.js（第三方库）
// jQuery库代码...

// app.js - 主应用逻辑（依赖jQuery）
/**
 * 主应用初始化
 */
$(document).ready(function() {
    console.log('应用开始初始化');
    
    // 初始化UI组件
    initializeComponents();
    
    // 绑定事件处理
    bindEventHandlers();
});

/**
 * 初始化UI组件
 */
function initializeComponents() {
    $('.carousel').carousel();
    $('.tooltip').tooltip();
    $('.modal').modal();
}

/**
 * 绑定事件处理器
 */
function bindEventHandlers() {
    $('#submit-btn').on('click', handleSubmit);
    $('#search-input').on('input', handleSearch);
}
```

```javascript
// init.js - 最后的初始化代码（依赖app.js）
/**
 * 应用最终初始化
 */
$(document).ready(function() {
    console.log('执行最终初始化');
    
    // 加载用户数据
    loadUserData();
    
    // 启动自动保存
    startAutoSave();
    
    console.log('应用初始化完成');
});

/**
 * 加载用户数据
 */
function loadUserData() {
    // 数据加载逻辑
}

/**
 * 启动自动保存功能
 */
function startAutoSave() {
    setInterval(() => {
        // 自动保存逻辑
    }, 30000);
}
```

### async vs defer 对比

#### 详细对比表

| 特性 | 同步 | async | defer |
|------|------|-------|-------|
| **下载时机** | 立即下载，阻塞解析 | 并行下载，不阻塞 | 并行下载，不阻塞 |
| **执行时机** | 下载完立即执行 | 下载完立即执行 | DOM解析完后执行 |
| **执行顺序** | 严格按标签顺序 | 不保证顺序 | 严格按标签顺序 |
| **DOM访问** | 取决于标签位置 | 可能DOM未完成 | DOM一定完成 |
| **适用场景** | 关键依赖脚本 | 独立功能脚本 | 需要DOM的脚本 |

#### 实际应用决策

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 关键CSS和配置（同步） -->
    <link rel="stylesheet" href="critical.css">
    <script>
        // 关键配置（同步）
        window.APP_CONFIG = { version: '1.0.0' };
    </script>
    
    <!-- 独立功能（async） -->
    <script async src="analytics.js"></script>
    <script async src="chat-widget.js"></script>
    
    <!-- 主要功能（defer） -->
    <script defer src="vendor/jquery.js"></script>
    <script defer src="vendor/bootstrap.js"></script>
    <script defer src="app.js"></script>
</head>
<body>
    <div id="app">应用内容</div>
</body>
</html>
```

#### 性能测试对比

```javascript
/**
 * 性能测试工具函数
 */
const PerformanceTest = {
    /**
     * 测量脚本加载性能
     */
    measureLoadTime() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            console.log('性能指标:');
            console.log('DOM解析时间:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            console.log('页面加载完成时间:', navigation.loadEventEnd - navigation.loadEventStart);
            console.log('首次渲染时间:', navigation.domContentLoadedEventStart - navigation.fetchStart);
        });
    },

    /**
     * 测量资源加载时间
     */
    measureResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.name.endsWith('.js')) {
                    console.log(`脚本 ${resource.name}:`);
                    console.log(`  下载时间: ${resource.responseEnd - resource.fetchStart}ms`);
                    console.log(`  大小: ${resource.transferSize} bytes`);
                }
            });
        });
    }
};

// 启用性能监控
PerformanceTest.measureLoadTime();
PerformanceTest.measureResourceTiming();
```

#### 选择建议

```javascript
/**
 * 脚本加载策略选择指南
 */
const LoadingStrategy = {
    // 同步加载：关键脚本
    sync: [
        'polyfills.js',      // 兼容性垫片
        'config.js',         // 应用配置
        'error-handler.js'   // 错误处理
    ],
    
    // 异步加载：独立功能
    async: [
        'analytics.js',      // 统计代码
        'ads.js',           // 广告代码
        'social-share.js',  // 社交分享
        'chat.js'           // 在线客服
    ],
    
    // 延迟加载：依赖DOM的脚本
    defer: [
        'jquery.js',        // DOM库
        'ui-components.js', // UI组件
        'app.js',          // 主应用
        'init.js'          // 初始化脚本
    ]
};
```

---

## 3.4 阻塞与性能优化

### 渲染阻塞的原因

JavaScript执行会阻塞DOM构建和页面渲染，影响用户体验：

#### 主要阻塞原因

1. **同步脚本下载**：阻塞HTML解析
2. **脚本执行时间**：长时间计算阻塞渲染
3. **DOM操作频繁**：引起多次重绘重排
4. **资源加载顺序**：关键资源加载过晚

```javascript
// ❌ 阻塞渲染的问题代码
console.log('开始执行耗时操作');

// 长时间运行的同步代码
for (let i = 0; i < 10000000; i++) {
    // 复杂计算
    Math.sqrt(i * Math.random());
}

console.log('耗时操作完成'); // 页面在此期间完全无响应
```

### 性能优化策略

#### 1. 优化脚本加载顺序

```html
<!DOCTYPE html>
<html>
<head>
    <!-- ✅ 正确的加载策略 -->
    
    <!-- 关键CSS优先加载 -->
    <link rel="stylesheet" href="critical.css">
    
    <!-- 关键脚本立即加载 -->
    <script>
        // 关键配置和错误处理
        window.onerror = function(msg, url, line) {
            console.error('脚本错误:', msg, 'at', url, ':', line);
        };
    </script>
    
    <!-- 非关键资源使用预加载 -->
    <link rel="preload" href="js/main.js" as="script">
    <link rel="preload" href="webfonts/font.woff2" as="font" crossorigin>
    
    <!-- 第三方脚本异步加载 -->
    <script async src="//www.google-analytics.com/analytics.js"></script>
    
    <!-- 应用脚本延迟加载 -->
    <script defer src="js/vendor.js"></script>
    <script defer src="js/app.js"></script>
</head>
<body>
    <div id="app">应用内容</div>
</body>
</html>
```

#### 2. 使用Web Workers处理耗时计算

```javascript
// main.js - 主线程
/**
 * 使用Web Worker处理耗时计算
 * @param {Array} data - 需要处理的数据
 */
function processLargeDataset(data) {
    return new Promise((resolve, reject) => {
        // 创建Worker
        const worker = new Worker('js/data-processor.js');
        
        // 发送数据给Worker
        worker.postMessage(data);
        
        // 监听Worker返回结果
        worker.onmessage = function(e) {
            resolve(e.data);
            worker.terminate(); // 清理Worker
        };
        
        worker.onerror = reject;
    });
}

// 使用示例
const largeDataset = new Array(1000000).fill(0).map((_, i) => i);

console.log('开始处理数据...');
processLargeDataset(largeDataset)
    .then(result => {
        console.log('数据处理完成:', result.length);
        // 更新UI
        document.getElementById('result').textContent = `处理了 ${result.length} 条数据`;
    })
    .catch(error => {
        console.error('处理失败:', error);
    });

console.log('主线程继续执行，页面保持响应');
```

```javascript
// js/data-processor.js - Worker线程
/**
 * Worker中的数据处理逻辑
 */
self.onmessage = function(e) {
    const data = e.data;
    
    console.log('Worker开始处理数据...');
    
    // 耗时的数据处理
    const result = data
        .filter(num => num % 2 === 0)  // 过滤偶数
        .map(num => num * num)         // 平方计算
        .sort((a, b) => a - b);       // 排序
    
    console.log('Worker数据处理完成');
    
    // 返回结果给主线程
    self.postMessage(result);
};
```

#### 3. 优化DOM操作

```javascript
/**
 * DOM操作优化示例
 */
class DOMOptimizer {
    /**
     * ❌ 性能差的DOM操作
     */
    static inefficientDOMUpdate(items) {
        const container = document.getElementById('list');
        
        // 每次操作都会触发重排重绘
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.name;
            div.style.padding = '10px';
            div.style.margin = '5px';
            container.appendChild(div); // 多次DOM操作
        });
    }
    
    /**
     * ✅ 优化后的DOM操作
     */
    static efficientDOMUpdate(items) {
        const container = document.getElementById('list');
        
        // 使用文档片段减少DOM操作
        const fragment = document.createDocumentFragment();
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.name;
            div.className = 'list-item'; // 使用CSS类而不是内联样式
            fragment.appendChild(div);
        });
        
        // 一次性添加到DOM
        container.appendChild(fragment);
    }
    
    /**
     * 使用虚拟滚动优化大列表
     */
    static createVirtualList(items, containerHeight = 400, itemHeight = 50) {
        const container = document.getElementById('virtual-list');
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        
        let scrollTop = 0;
        
        /**
         * 渲染可见项目
         */
        function renderVisibleItems() {
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount, items.length);
            
            // 清空容器
            container.innerHTML = '';
            
            // 创建可见项目
            for (let i = startIndex; i < endIndex; i++) {
                const item = document.createElement('div');
                item.textContent = items[i].name;
                item.style.height = itemHeight + 'px';
                item.style.position = 'absolute';
                item.style.top = (i * itemHeight) + 'px';
                container.appendChild(item);
            }
        }
        
        // 监听滚动事件
        container.addEventListener('scroll', (e) => {
            scrollTop = e.target.scrollTop;
            renderVisibleItems();
        });
        
        // 初始渲染
        renderVisibleItems();
    }
}
```

### 代码分割与懒加载

#### 1. 动态导入实现代码分割

```javascript
/**
 * 代码分割和懒加载策略
 */
class LazyLoader {
    /**
     * 基于路由的代码分割
     */
    static async loadRouteComponent(routeName) {
        try {
            switch (routeName) {
                case 'home':
                    const { HomePage } = await import('./components/HomePage.js');
                    return new HomePage();
                    
                case 'profile':
                    const { ProfilePage } = await import('./components/ProfilePage.js');
                    return new ProfilePage();
                    
                case 'admin':
                    // 管理员页面按需加载
                    const { AdminPanel } = await import('./components/AdminPanel.js');
                    return new AdminPanel();
                    
                default:
                    const { NotFound } = await import('./components/NotFound.js');
                    return new NotFound();
            }
        } catch (error) {
            console.error('组件加载失败:', error);
            throw error;
        }
    }
    
    /**
     * 基于交互的懒加载
     */
    static setupInteractionBasedLoading() {
        // 鼠标悬停时预加载
        document.querySelectorAll('[data-hover-load]').forEach(element => {
            element.addEventListener('mouseenter', async () => {
                const module = element.dataset.hoverLoad;
                try {
                    await import(module);
                    console.log(`预加载模块: ${module}`);
                } catch (error) {
                    console.error(`预加载失败: ${module}`, error);
                }
            });
        });
        
        // 滚动到视窗时加载
        const observer = new IntersectionObserver(async (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const module = entry.target.dataset.lazyLoad;
                    if (module) {
                        try {
                            const loadedModule = await import(module);
                            loadedModule.initialize(entry.target);
                            observer.unobserve(entry.target);
                        } catch (error) {
                            console.error(`懒加载失败: ${module}`, error);
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('[data-lazy-load]').forEach(element => {
            observer.observe(element);
        });
    }
}

// 使用示例
document.addEventListener('DOMContentLoaded', () => {
    LazyLoader.setupInteractionBasedLoading();
});
```

#### 2. 资源预加载策略

```javascript
/**
 * 资源预加载管理器
 */
class ResourcePreloader {
    constructor() {
        this.loadedResources = new Set();
        this.loadingPromises = new Map();
    }
    
    /**
     * 预加载脚本
     * @param {string} src - 脚本路径
     * @returns {Promise} 加载完成的Promise
     */
    preloadScript(src) {
        if (this.loadedResources.has(src)) {
            return Promise.resolve();
        }
        
        if (this.loadingPromises.has(src)) {
            return this.loadingPromises.get(src);
        }
        
        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            link.onload = () => {
                this.loadedResources.add(src);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
        
        this.loadingPromises.set(src, promise);
        return promise;
    }
    
    /**
     * 智能预加载策略
     */
    async intelligentPreload() {
        // 基于网络状况调整预加载策略
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === '4g' && !connection.saveData) {
                // 高速网络，积极预加载
                await Promise.all([
                    this.preloadScript('js/features/advanced.js'),
                    this.preloadScript('js/features/charts.js'),
                    this.preloadScript('js/features/editor.js')
                ]);
            } else if (connection.effectiveType === '3g') {
                // 中速网络，选择性预加载
                await this.preloadScript('js/features/essential.js');
            }
            // 低速网络不预加载
        }
    }
    
    /**
     * 用户行为预测预加载
     */
    setupBehaviorPrediction() {
        // 基于用户行为模式预加载
        const userInteractions = [];
        
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-route]');
            if (target) {
                userInteractions.push({
                    route: target.dataset.route,
                    timestamp: Date.now()
                });
                
                // 预测下一个可能访问的页面
                this.predictNextRoute(userInteractions);
            }
        });
    }
    
    /**
     * 预测下一个路由
     * @param {Array} interactions - 用户交互历史
     */
    predictNextRoute(interactions) {
        if (interactions.length > 2) {
            const recent = interactions.slice(-3);
            // 简单的预测逻辑（实际项目中可以使用更复杂的算法）
            const nextRoute = recent[recent.length - 1].route + '-details';
            this.preloadScript(`js/routes/${nextRoute}.js`).catch(() => {
                // 预测错误，忽略
            });
        }
    }
}

// 初始化预加载器
const preloader = new ResourcePreloader();
preloader.intelligentPreload();
preloader.setupBehaviorPrediction();
```

---

## 3.5 浏览器缓存与 JS 加载策略

### 浏览器缓存机制

浏览器缓存是提升JavaScript加载性能的关键技术：

#### HTTP缓存头设置

```javascript
// 服务器端缓存配置示例 (Express.js)
/**
 * 配置静态资源缓存
 */
app.use('/js', express.static('public/js', {
    maxAge: '1y',  // JavaScript文件缓存1年
    etag: true,    // 启用ETag
    lastModified: true
}));

// 带版本号的资源永久缓存
app.get('/js/:version/:filename', (req, res) => {
    const { version, filename } = req.params;
    
    // 设置强缓存
    res.set({
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    
    res.sendFile(`public/js/${version}/${filename}`);
});
```

#### Service Worker缓存策略

```javascript
// sw.js - Service Worker文件
/**
 * Service Worker缓存策略
 */
const CACHE_NAME = 'js-cache-v1';
const JS_CACHE_URLS = [
    '/js/vendor.js',
    '/js/app.js',
    '/js/utils.js'
];

/**
 * 安装事件 - 预缓存资源
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(JS_CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

/**
 * 请求拦截 - 缓存优先策略
 */
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/js/')) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        // 返回缓存，同时更新缓存
                        fetch(event.request)
                            .then(response => {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, responseClone));
                            });
                        return cachedResponse;
                    }
                    
                    // 缓存未命中，从网络获取
                    return fetch(event.request)
                        .then(response => {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone));
                            return response;
                        });
                })
        );
    }
});
```

### 版本控制与缓存失效

#### 文件指纹策略

```javascript
// build-script.js - 构建脚本示例
/**
 * 生成带哈希的文件名
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 为文件生成内容哈希
 * @param {string} filePath - 文件路径
 * @returns {string} 文件哈希值
 */
function generateFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

/**
 * 构建带版本号的资源
 */
function buildVersionedAssets() {
    const jsDir = 'src/js';
    const outputDir = 'dist/js';
    const manifest = {};
    
    fs.readdirSync(jsDir).forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(jsDir, file);
            const hash = generateFileHash(filePath);
            const basename = path.parse(file).name;
            const versionedName = `${basename}.${hash}.js`;
            
            // 复制文件到输出目录
            fs.copyFileSync(filePath, path.join(outputDir, versionedName));
            
            // 更新manifest
            manifest[file] = versionedName;
        }
    });
    
    // 生成资源映射文件
    fs.writeFileSync('dist/asset-manifest.json', JSON.stringify(manifest, null, 2));
    
    console.log('构建完成，生成的资源映射:', manifest);
}

buildVersionedAssets();
```

#### 动态资源加载器

```javascript
/**
 * 动态资源加载器，支持版本控制
 */
class AssetLoader {
    constructor() {
        this.manifest = null;
        this.loadedScripts = new Set();
    }
    
    /**
     * 初始化，加载资源映射
     */
    async init() {
        try {
            const response = await fetch('/asset-manifest.json');
            this.manifest = await response.json();
            console.log('资源映射加载成功:', this.manifest);
        } catch (error) {
            console.error('资源映射加载失败:', error);
            // 降级到默认文件名
            this.manifest = null;
        }
    }
    
    /**
     * 获取资源的实际URL
     * @param {string} assetName - 资源名称
     * @returns {string} 实际的资源URL
     */
    getAssetUrl(assetName) {
        if (this.manifest && this.manifest[assetName]) {
            return `/js/${this.manifest[assetName]}`;
        }
        // 降级处理
        return `/js/${assetName}`;
    }
    
    /**
     * 动态加载脚本
     * @param {string} scriptName - 脚本名称
     * @returns {Promise} 加载完成的Promise
     */
    loadScript(scriptName) {
        const scriptUrl = this.getAssetUrl(scriptName);
        
        if (this.loadedScripts.has(scriptUrl)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                this.loadedScripts.add(scriptUrl);
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load ${scriptUrl}`));
            document.head.appendChild(script);
        });
    }
    
    /**
     * 批量加载脚本
     * @param {Array} scriptNames - 脚本名称数组
     * @returns {Promise} 所有脚本加载完成的Promise
     */
    loadScripts(scriptNames) {
        return Promise.all(scriptNames.map(name => this.loadScript(name)));
    }
}

// 使用示例
const assetLoader = new AssetLoader();

assetLoader.init().then(() => {
    // 根据页面需要动态加载脚本
    if (location.pathname.includes('/dashboard')) {
        assetLoader.loadScripts(['charts.js', 'dashboard.js']);
    } else if (location.pathname.includes('/editor')) {
        assetLoader.loadScript('editor.js');
    }
});
```

### 现代加载策略

#### HTTP/2推送和预加载

```javascript
/**
 * 现代浏览器加载策略
 */
class ModernLoadingStrategy {
    /**
     * 智能预加载
     */
    static setupIntelligentPreloading() {
        // 基于用户代理和网络条件的预加载
        if ('serviceWorker' in navigator && 'connection' in navigator) {
            const connection = navigator.connection;
            
            // 只在良好网络条件下进行预加载
            if (connection.effectiveType === '4g' && !connection.saveData) {
                this.preloadCriticalResources();
            }
        }
    }
    
    /**
     * 预加载关键资源
     */
    static preloadCriticalResources() {
        const criticalScripts = [
            '/js/vendor.js',
            '/js/app.js'
        ];
        
        criticalScripts.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    /**
     * 模块预加载策略
     */
    static setupModulePreloading() {
        // ES6模块的预加载
        const moduleGraph = {
            'app.js': ['utils.js', 'components.js'],
            'components.js': ['ui-lib.js'],
            'utils.js': []
        };
        
        /**
         * 预加载模块依赖
         * @param {string} moduleName - 模块名称
         */
        function preloadModuleDependencies(moduleName) {
            const dependencies = moduleGraph[moduleName] || [];
            
            dependencies.forEach(dep => {
                const link = document.createElement('link');
                link.rel = 'modulepreload';
                link.href = `/js/modules/${dep}`;
                document.head.appendChild(link);
                
                // 递归预加载依赖的依赖
                preloadModuleDependencies(dep);
            });
        }
        
        // 预加载主模块的依赖
        preloadModuleDependencies('app.js');
    }
    
    /**
     * 渐进式加载
     */
    static setupProgressiveLoading() {
        // 定义加载优先级
        const loadingQueue = [
            { priority: 'critical', scripts: ['polyfills.js', 'vendor.js'] },
            { priority: 'high', scripts: ['app.js', 'router.js'] },
            { priority: 'medium', scripts: ['analytics.js', 'utils.js'] },
            { priority: 'low', scripts: ['animations.js', 'extras.js'] }
        ];
        
        /**
         * 按优先级加载脚本
         */
        async function loadByPriority() {
            for (const group of loadingQueue) {
                console.log(`加载${group.priority}优先级脚本`);
                
                const promises = group.scripts.map(script => 
                    assetLoader.loadScript(script)
                );
                
                await Promise.all(promises);
                
                // 给浏览器一些时间处理已加载的脚本
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        // 在空闲时间开始渐进式加载
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadByPriority);
        } else {
            setTimeout(loadByPriority, 100);
        }
    }
}

// 初始化现代加载策略
document.addEventListener('DOMContentLoaded', () => {
    ModernLoadingStrategy.setupIntelligentPreloading();
    ModernLoadingStrategy.setupModulePreloading();
    ModernLoadingStrategy.setupProgressiveLoading();
});
```

---

## 本章总结

JavaScript的编写方式和加载机制是前端性能优化的基础。通过本章学习，我们掌握了：

### 🎯 核心知识点

1. **三种脚本方式**：内联、内部、外部脚本的特点和选择标准
2. **执行顺序控制**：script标签属性和依赖管理策略
3. **异步加载机制**：async vs defer的差异和应用场景
4. **性能优化技术**：代码分割、懒加载、Web Workers
5. **缓存策略**：浏览器缓存、Service Worker、版本控制

### 📈 性能优化要点

- **优先级加载**：关键资源同步，非关键资源异步
- **代码分割**：按需加载，减少初始包大小
- **缓存利用**：合理设置缓存策略，提升重复访问性能
- **现代技术**：利用HTTP/2、预加载、Service Worker等技术

### 💡 最佳实践建议

1. 优先使用外部脚本，便于维护和缓存
2. 合理使用async和defer，避免阻塞渲染
3. 实施代码分割和懒加载，优化首屏性能
4. 配置适当的缓存策略，平衡性能和更新
5. 监控性能指标，持续优化加载策略

---

**下一章预告：** 我们将进入第二篇"语法基础"，从第4章"变量与常量"开始，深入学习JavaScript的核心语法特性，包括作用域、变量提升等重要概念。
