# UV-UI框架 HTTP请求使用指南

> 适合小白快速上手的uv-ui请求教程，让你轻松处理前后端数据交互 🚀

## 一、快速开始

### 1.1 前置条件
确保你已经安装了uv-ui框架。如果还没安装，请先到[插件市场](https://ext.dcloud.net.cn/plugin?id=12287)下载。

### 1.2 基础配置（3步搞定）

#### 第1步：创建请求配置文件
在项目根目录创建 `/util/request/index.js`：

```javascript
// 导出请求配置函数
export const Request = (vm) => {
  // 设置基础配置
  uni.$uv.http.setConfig((config) => {
    config.baseURL = 'https://your-api.com'; // 👈 改成你的API地址
    config.timeout = 60000; // 超时时间60秒
    return config
  })
  
  // 请求拦截器（发送前处理）
  uni.$uv.http.interceptors.request.use((config) => {
    // 给所有请求加上token
    const token = uni.getStorageSync('token');
    if (token) {
      config.header.token = token;
    }
    return config
  })
  
  // 响应拦截器（接收后处理）
  uni.$uv.http.interceptors.response.use((response) => {
    const data = response.data
    
    // 请求成功但业务失败
    if (data.code !== 200) {
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
    
    // 返回真正的数据
    return data.data
  })
}
```

#### 第2步：在main.js中引入
```javascript
import App from './App'
import { Request } from '@/util/request/index'

// Vue2写法
const app = new Vue({
  ...App
})
app.$mount()
Request(app) // 👈 关键：初始化请求配置

// Vue3写法
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  Request(app) // 👈 关键：初始化请求配置
  return { app }
}
```

#### 第3步：创建API管理文件
在项目根目录创建 `/common/api.js`：

```javascript
// 用户登录
export const login = (data) => uni.$uv.http.post('/user/login', data)

// 获取用户信息
export const getUserInfo = () => uni.$uv.http.get('/user/info')

// 获取商品列表（带参数）
export const getGoodsList = (params) => uni.$uv.http.get('/goods/list', {
  params: params // GET请求参数放第二个参数的params里
})
```

## 二、基础用法（最常用）

### 2.1 GET请求
```javascript
// 方式1：直接调用
uni.$uv.http.get('/user/list', {
  params: {
    page: 1,
    pageSize: 10
  }
}).then(res => {
  console.log('用户列表：', res)
})

// 方式2：使用api文件（推荐）
import { getUserList } from '@/common/api.js'

getUserList({ page: 1, pageSize: 10 }).then(res => {
  console.log('用户列表：', res)
})

// 方式3：async/await写法（推荐）
async function loadUsers() {
  try {
    const res = await getUserList({ page: 1 })
    console.log('用户列表：', res)
  } catch(err) {
    console.error('加载失败：', err)
  }
}
```

### 2.2 POST请求
```javascript
// 登录示例
uni.$uv.http.post('/user/login', {
  username: 'admin',
  password: '123456'
}).then(res => {
  // 保存token
  uni.setStorageSync('token', res.token)
  uni.showToast({ title: '登录成功' })
})

// POST请求注意：
// 第2个参数是请求体数据
// 第3个参数才是配置项（如自定义header等）
uni.$uv.http.post('/api/save', 
  { name: '张三', age: 18 },  // 👈 请求数据
  { header: { 'X-Custom': 'value' } }  // 👈 配置项
)
```

## 三、进阶用法

### 3.1 文件上传
```javascript
// 上传图片
uni.chooseImage({
  count: 1,
  success: (res) => {
    const filePath = res.tempFilePaths[0]
    
    uni.$uv.http.upload('/api/upload', {
      filePath: filePath,  // 文件路径
      name: 'file',       // 后端接收字段名
      formData: {         // 额外参数
        type: 'avatar',
        userId: '123'
      },
      // 监听上传进度
      getTask: (task, options) => {
        task.onProgressUpdate((res) => {
          console.log('上传进度：', res.progress + '%')
        })
      }
    }).then(res => {
      console.log('上传成功，图片地址：', res.url)
    })
  }
})
```

### 3.2 文件下载
```javascript
uni.$uv.http.download('/api/download/file.pdf', {
  // 下载进度监听
  getTask: (task, options) => {
    task.onProgressUpdate((res) => {
      console.log('下载进度：', res.progress + '%')
    })
  }
}).then(res => {
  console.log('文件下载到：', res.tempFilePath)
  // 保存到本地
  uni.saveFile({
    tempFilePath: res.tempFilePath,
    success: (saveRes) => {
      console.log('保存成功：', saveRes.savedFilePath)
    }
  })
})
```

### 3.3 自定义参数（custom用法）
```javascript
// 某些请求不需要token
uni.$uv.http.get('/public/news', {
  params: { type: 'hot' },
  custom: {
    auth: false,  // 👈 在拦截器中判断，不加token
    loading: true // 👈 可以在拦截器中显示loading
  }
})

// 在拦截器中使用custom参数
uni.$uv.http.interceptors.request.use((config) => {
  // 根据custom.auth决定是否加token
  if (config.custom?.auth !== false) {
    config.header.token = getToken()
  }
  
  // 根据custom.loading显示加载框
  if (config.custom?.loading) {
    uni.showLoading({ title: '加载中...' })
  }
  
  return config
})
```

### 3.4 请求取消
```javascript
let requestTask = null

// 发起可取消的请求
uni.$uv.http.get('/api/search', {
  params: { keyword: '手机' },
  getTask: (task, options) => {
    requestTask = task  // 保存请求任务
  }
})

// 取消请求（比如用户快速输入时取消上一次搜索）
if (requestTask) {
  requestTask.abort()
}
```

## 四、完整拦截器示例

```javascript
// /util/request/index.js 完整版
export const Request = (vm) => {
  // 全局配置
  uni.$uv.http.setConfig((config) => {
    config.baseURL = process.env.VUE_APP_API_URL || 'https://api.example.com';
    config.timeout = 30000;
    config.header = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    return config
  })
  
  // 请求拦截器
  uni.$uv.http.interceptors.request.use((config) => {
    // 处理token
    const token = uni.getStorageSync('token')
    if (token && config.custom?.auth !== false) {
      config.header.Authorization = 'Bearer ' + token
    }
    
    // 显示loading
    if (config.custom?.loading) {
      uni.showLoading({ 
        title: config.custom.loadingText || '加载中...',
        mask: true 
      })
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'GET') {
      config.params = config.params || {}
      config.params._ = Date.now()
    }
    
    return config
  }, config => {
    return Promise.reject(config)
  })
  
  // 响应拦截器
  uni.$uv.http.interceptors.response.use((response) => {
    // 隐藏loading
    if (response.config?.custom?.loading) {
      uni.hideLoading()
    }
    
    const data = response.data
    
    // 根据你的后端约定处理
    if (data.code === 200) {
      return data.data || data
    } else if (data.code === 401) {
      // token过期
      uni.removeStorageSync('token')
      uni.showToast({ 
        title: '登录已过期',
        icon: 'none' 
      })
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/login/login' })
      }, 1500)
      return Promise.reject(data)
    } else {
      // 业务错误
      if (response.config?.custom?.toast !== false) {
        uni.showToast({
          title: data.message || '请求失败',
          icon: 'none'
        })
      }
      return Promise.reject(data)
    }
  }, (error) => {
    // 网络错误
    uni.hideLoading()
    
    if (error.statusCode === 0) {
      uni.showToast({ 
        title: '网络连接失败',
        icon: 'none' 
      })
    } else {
      uni.showToast({ 
        title: `请求失败(${error.statusCode})`,
        icon: 'none' 
      })
    }
    
    return Promise.reject(error)
  })
}
```

## 五、实战示例

### 5.1 登录流程
```javascript
// pages/login/login.vue
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      // 表单验证
      if (!this.form.username || !this.form.password) {
        uni.showToast({ 
          title: '请填写账号密码',
          icon: 'none' 
        })
        return
      }
      
      try {
        // 调用登录接口
        const res = await uni.$uv.http.post('/user/login', this.form, {
          custom: { loading: true, loadingText: '登录中...' }
        })
        
        // 保存登录信息
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('userInfo', res.userInfo)
        
        uni.showToast({ 
          title: '登录成功',
          success: () => {
            setTimeout(() => {
              uni.switchTab({ url: '/pages/index/index' })
            }, 1500)
          }
        })
      } catch(err) {
        console.error('登录失败：', err)
      }
    }
  }
}
```

### 5.2 列表分页加载
```javascript
// pages/goods/list.vue
export default {
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false
    }
  },
  onLoad() {
    this.loadList()
  },
  onReachBottom() {
    this.loadMore()
  },
  methods: {
    async loadList() {
      if (this.loading || this.finished) return
      
      this.loading = true
      
      try {
        const res = await uni.$uv.http.get('/goods/list', {
          params: {
            page: this.page,
            pageSize: this.pageSize
          }
        })
        
        if (this.page === 1) {
          this.list = res.list
        } else {
          this.list.push(...res.list)
        }
        
        // 判断是否加载完毕
        if (res.list.length < this.pageSize) {
          this.finished = true
        }
      } finally {
        this.loading = false
      }
    },
    
    loadMore() {
      if (!this.finished) {
        this.page++
        this.loadList()
      }
    },
    
    // 下拉刷新
    onPullDownRefresh() {
      this.page = 1
      this.finished = false
      this.loadList().then(() => {
        uni.stopPullDownRefresh()
      })
    }
  }
}
```

## 六、常见问题

### Q1: 如何处理不同环境的API地址？
```javascript
// 在.env文件中配置
// .env.development
VUE_APP_API_URL=http://localhost:3000

// .env.production  
VUE_APP_API_URL=https://api.production.com

// 使用
config.baseURL = process.env.VUE_APP_API_URL
```

### Q2: 如何统一处理错误？
```javascript
// 在响应拦截器中统一处理
const errorHandler = {
  400: '请求参数错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用'
}

// 响应拦截器中
if (error.statusCode && errorHandler[error.statusCode]) {
  uni.showToast({ 
    title: errorHandler[error.statusCode],
    icon: 'none' 
  })
}
```

### Q3: GET和POST请求参数位置不同？
- **GET请求**：所有配置都在第二个参数
- **POST请求**：第二个参数是数据，第三个参数才是配置

```javascript
// GET - 参数在第二个参数的params中
uni.$uv.http.get('/api', { params: {id: 1}, header: {} })

// POST - 数据在第二个，配置在第三个
uni.$uv.http.post('/api', {id: 1}, { header: {} })
```

## 七、小技巧

1. **请求防抖**：搜索框输入时，使用防抖避免频繁请求
2. **缓存策略**：对不常变化的数据进行本地缓存
3. **错误重试**：网络错误时可以自动重试1-2次
4. **请求合并**：同时需要多个接口数据时，使用Promise.all

```javascript
// 同时请求多个接口
const [userInfo, menuList, config] = await Promise.all([
  uni.$uv.http.get('/user/info'),
  uni.$uv.http.get('/menu/list'),
  uni.$uv.http.get('/system/config')
])
```

---

💡 **温馨提示**：以上就是uv-ui框架请求的核心用法，掌握这些足够应对90%的场景。遇到问题多看官方文档，多动手实践！

📚 **官方文档**：https://www.uvui.cn/js/http.html
