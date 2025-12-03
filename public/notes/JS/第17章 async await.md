# 第17章　async / await

async/await是ES2017引入的异步编程语法糖，基于Promise构建，让异步代码看起来像同步代码，极大提升了异步编程的可读性和可维护性。

## 17.1 async函数原理

理解async函数的本质和工作机制。

### async函数基础

async函数本质上是Generator函数的语法糖：

```javascript
/**
 * async函数原理示例
 */
const AsyncFunctionExamples = {
    /**
     * async函数基本特性
     */
    basicAsyncFeatures() {
        console.log('=== async函数基本特性 ===');
        
        // async函数总是返回Promise
        async function simpleAsync() {
            return 'hello world';
        }
        
        console.log('async函数返回值:', simpleAsync()); // Promise对象
        
        simpleAsync().then(result => {
            console.log('async函数结果:', result); // 'hello world'
        });
        
        // 等价的Promise写法
        function promiseVersion() {
            return Promise.resolve('hello world');
        }
        
        console.log('Promise版本一致性:', 
            simpleAsync().constructor === promiseVersion().constructor
        );
        
        // async函数中抛出异常
        async function asyncWithError() {
            if (Math.random() > 0.5) {
                throw new Error('随机错误');
            }
            return '成功结果';
        }
        
        asyncWithError().then(
            result => console.log('成功:', result),
            error => console.log('错误:', error.message)
        );
        
        // 返回Promise的async函数
        async function asyncReturnsPromise() {
            return Promise.resolve('嵌套Promise');
        }
        
        asyncReturnsPromise().then(result => {
            console.log('嵌套Promise结果:', result); // 自动展开
        });
    },
    
    /**
     * async函数的执行机制
     */
    asyncExecutionMechanism() {
        console.log('=== async函数执行机制 ===');
        
        // 执行顺序分析
        async function executionOrder() {
            console.log('1. async函数开始');
            
            // 同步代码立即执行
            console.log('2. 同步代码执行');
            
            // 遇到await会暂停
            const result = await Promise.resolve('异步结果');
            
            // await后的代码进入微任务队列
            console.log('3. await后的代码:', result);
            
            return 'async完成';
        }
        
        console.log('调用前');
        
        const promise = executionOrder();
        console.log('调用后，async函数返回:', promise);
        
        promise.then(result => {
            console.log('4. 最终结果:', result);
        });
        
        console.log('调用async函数后的同步代码');
        
        // 模拟async函数的Generator实现
        function* asyncGenerator() {
            console.log('Generator开始');
            const result = yield Promise.resolve('生成器异步结果');
            console.log('Generator继续:', result);
            return 'Generator完成';
        }
        
        function runGenerator(gen) {
            const iterator = gen();
            
            function handle(result) {
                if (!result.done) {
                    return Promise.resolve(result.value)
                        .then(res => handle(iterator.next(res)))
                        .catch(err => handle(iterator.throw(err)));
                }
                return result.value;
            }
            
            return handle(iterator.next());
        }
        
        setTimeout(() => {
            console.log('=== Generator模拟async ===');
            runGenerator(asyncGenerator).then(result => {
                console.log('Generator模拟结果:', result);
            });
        }, 1000);
    },
    
    /**
     * async函数的变体形式
     */
    asyncVariants() {
        console.log('=== async函数变体 ===');
        
        // 箭头函数版本
        const asyncArrow = async () => {
            return 'arrow async';
        };
        
        // 对象方法
        const obj = {
            async asyncMethod() {
                return 'method async';
            },
            
            // 简写形式
            async shorthand() {
                return 'shorthand async';
            }
        };
        
        // 类方法
        class AsyncClass {
            async asyncMethod() {
                return 'class async method';
            }
            
            static async staticAsyncMethod() {
                return 'static async method';
            }
        }
        
        // 立即执行async函数
        (async () => {
            console.log('立即执行async函数');
            
            try {
                const results = await Promise.all([
                    asyncArrow(),
                    obj.asyncMethod(),
                    obj.shorthand(),
                    new AsyncClass().asyncMethod(),
                    AsyncClass.staticAsyncMethod()
                ]);
                
                console.log('所有async变体结果:', results);
            } catch (error) {
                console.log('执行错误:', error.message);
            }
        })();
        
        // async函数作为参数
        function executeAsync(asyncFn) {
            console.log('执行传入的async函数');
            return asyncFn().then(result => {
                console.log('async参数结果:', result);
                return result;
            });
        }
        
        executeAsync(async () => {
            return '参数async函数';
        });
    }
};

AsyncFunctionExamples.basicAsyncFeatures();
setTimeout(() => AsyncFunctionExamples.asyncExecutionMechanism(), 500);
setTimeout(() => AsyncFunctionExamples.asyncVariants(), 1500);
```

### async函数与Promise对比

```javascript
/**
 * async与Promise对比示例
 */
const AsyncPromiseComparison = {
    /**
     * 代码风格对比
     */
    codeStyleComparison() {
        console.log('=== 代码风格对比 ===');
        
        // Promise链式写法
        function promiseChain() {
            return fetch('/api/user/123')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络错误');
                    }
                    return response.json();
                })
                .then(user => {
                    console.log('获取用户:', user.name);
                    return fetch(`/api/posts/${user.id}`);
                })
                .then(response => response.json())
                .then(posts => {
                    console.log('获取文章:', posts.length, '篇');
                    return posts;
                })
                .catch(error => {
                    console.log('Promise链错误:', error.message);
                    throw error;
                });
        }
        
        // async/await写法
        async function asyncAwaitStyle() {
            try {
                const response = await fetch('/api/user/123');
                
                if (!response.ok) {
                    throw new Error('网络错误');
                }
                
                const user = await response.json();
                console.log('获取用户:', user.name);
                
                const postsResponse = await fetch(`/api/posts/${user.id}`);
                const posts = await postsResponse.json();
                
                console.log('获取文章:', posts.length, '篇');
                return posts;
                
            } catch (error) {
                console.log('async/await错误:', error.message);
                throw error;
            }
        }
        
        // 模拟API调用进行测试
        global.fetch = (url) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (url.includes('user')) {
                        resolve({
                            ok: true,
                            json: () => Promise.resolve({ id: 123, name: 'John' })
                        });
                    } else if (url.includes('posts')) {
                        resolve({
                            ok: true,
                            json: () => Promise.resolve([
                                { id: 1, title: 'Post 1' },
                                { id: 2, title: 'Post 2' }
                            ])
                        });
                    } else {
                        reject(new Error('未知API'));
                    }
                }, 200);
            });
        };
        
        console.log('执行Promise链式调用:');
        promiseChain().then(
            result => console.log('Promise结果:', result?.length),
            error => console.log('Promise失败')
        );
        
        setTimeout(() => {
            console.log('执行async/await调用:');
            asyncAwaitStyle().then(
                result => console.log('async结果:', result?.length),
                error => console.log('async失败')
            );
        }, 1000);
    },
    
    /**
     * 错误处理对比
     */
    errorHandlingComparison() {
        console.log('=== 错误处理对比 ===');
        
        // Promise错误处理
        function promiseErrorHandling() {
            return Promise.resolve('start')
                .then(value => {
                    console.log('Promise步骤1:', value);
                    if (Math.random() > 0.7) {
                        throw new Error('步骤1失败');
                    }
                    return 'step1-success';
                })
                .then(value => {
                    console.log('Promise步骤2:', value);
                    if (Math.random() > 0.7) {
                        throw new Error('步骤2失败');
                    }
                    return 'step2-success';
                })
                .catch(error => {
                    console.log('Promise捕获错误:', error.message);
                    return 'error-recovered';
                })
                .then(value => {
                    console.log('Promise最终结果:', value);
                    return value;
                });
        }
        
        // async/await错误处理
        async function asyncErrorHandling() {
            try {
                let value = 'start';
                
                console.log('async步骤1:', value);
                if (Math.random() > 0.7) {
                    throw new Error('步骤1失败');
                }
                value = 'step1-success';
                
                console.log('async步骤2:', value);
                if (Math.random() > 0.7) {
                    throw new Error('步骤2失败');
                }
                value = 'step2-success';
                
                console.log('async最终结果:', value);
                return value;
                
            } catch (error) {
                console.log('async捕获错误:', error.message);
                return 'error-recovered';
            }
        }
        
        // 执行对比测试
        promiseErrorHandling().then(result => {
            console.log('Promise处理完成:', result);
        });
        
        asyncErrorHandling().then(result => {
            console.log('async处理完成:', result);
        });
    },
    
    /**
     * 性能和调试对比
     */
    performanceAndDebugging() {
        console.log('=== 性能和调试对比 ===');
        
        // 调用栈信息对比
        function promiseStackTrace() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Promise深层错误'));
                }, 100);
            }).then(result => {
                return result.toUpperCase();
            }).catch(error => {
                console.log('Promise错误堆栈:');
                console.log(error.stack.split('\n').slice(0, 3).join('\n'));
                throw error;
            });
        }
        
        async function asyncStackTrace() {
            try {
                const result = await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('async深层错误'));
                    }, 100);
                });
                
                return result.toUpperCase();
                
            } catch (error) {
                console.log('async错误堆栈:');
                console.log(error.stack.split('\n').slice(0, 3).join('\n'));
                throw error;
            }
        }
        
        // 测试堆栈信息
        promiseStackTrace().catch(() => {
            console.log('Promise错误已处理');
        });
        
        setTimeout(() => {
            asyncStackTrace().catch(() => {
                console.log('async错误已处理');
            });
        }, 200);
        
        // 内存使用对比（概念性演示）
        function memoryUsageDemo() {
            console.log('内存使用特点:');
            console.log('Promise: 创建多个Promise对象，链式调用');
            console.log('async/await: 单个Promise，更少的中间对象');
            
            const promiseMemory = Array.from({ length: 5 }, (_, i) => 
                Promise.resolve(i).then(x => x * 2)
            );
            
            const asyncMemory = async () => {
                const results = [];
                for (let i = 0; i < 5; i++) {
                    results.push(await Promise.resolve(i * 2));
                }
                return results;
            };
            
            Promise.all(promiseMemory).then(results => {
                console.log('Promise内存使用结果:', results);
            });
            
            asyncMemory().then(results => {
                console.log('async内存使用结果:', results);
            });
        }
        
        setTimeout(memoryUsageDemo, 500);
    }
};

AsyncPromiseComparison.codeStyleComparison();
setTimeout(() => AsyncPromiseComparison.errorHandlingComparison(), 1000);
setTimeout(() => AsyncPromiseComparison.performanceAndDebugging(), 2000);
```

---

## 17.2 await的暂停机制

深入理解await关键字的工作原理。

### await执行机制

### 暂停和恢复过程

---

## 17.3 try/catch异步错误处理

### 异步错误捕获

### 错误处理最佳实践

---

## 17.4 异步流程写法优化

### 并发执行优化

### 循环和迭代处理

---

**本章总结**

**下一章预告**
