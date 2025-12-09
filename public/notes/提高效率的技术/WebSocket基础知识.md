# WebSocket基础知识

## 1. WebSocket概述

### 1.1 什么是WebSocket？

WebSocket是一种在单个TCP连接上进行全双工通信的协议。它使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

**核心特点**：
- 建立在TCP协议之上
- 与HTTP协议有良好的兼容性
- 数据格式轻量，性能开销小
- 可以发送文本和二进制数据
- 没有同源限制，客户端可以与任意服务器通信
- 协议标识符是ws（加密为wss）

### 1.2 为什么需要WebSocket？

**传统HTTP的局限性**：

```javascript
// HTTP轮询方式 - 效率低下
setInterval(() => {
    fetch('/api/messages')
        .then(res => res.json())
        .then(data => updateUI(data))
}, 1000) // 每秒请求一次，大部分请求是无效的

// HTTP长轮询 - 占用连接
async function longPolling() {
    const response = await fetch('/api/messages', {
        // 服务器保持连接，有数据才返回
        timeout: 30000
    })
    const data = await response.json()
    updateUI(data)
    longPolling() // 继续下一次长轮询
}

// WebSocket方式 - 实时高效
const ws = new WebSocket('ws://localhost:8080')
ws.onmessage = (event) => {
    updateUI(JSON.parse(event.data)) // 服务器主动推送
}
```

### 1.3 WebSocket vs HTTP

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 通信方式 | 请求-响应 | 全双工 |
| 连接状态 | 无状态 | 有状态 |
| 数据推送 | 不支持（需轮询） | 原生支持 |
| 开销 | 每次请求都有完整头部 | 建立后数据帧开销小 |
| 实时性 | 低（依赖轮询频率） | 高（实时推送） |
| 适用场景 | 文档获取、表单提交 | 实时通信、推送通知 |

### 1.4 应用场景

1. **即时通讯**
   - 聊天应用（WhatsApp Web、微信网页版）
   - 客服系统
   - 团队协作工具（Slack、钉钉）

2. **实时数据推送**
   - 股票行情
   - 体育比分
   - 新闻推送
   - 监控大屏

3. **协同编辑**
   - 在线文档（Google Docs）
   - 代码协作（VS Code Live Share）
   - 白板应用

4. **游戏和娱乐**
   - 在线游戏
   - 直播弹幕
   - 实时投票

5. **物联网**
   - 设备监控
   - 远程控制
   - 数据采集

## 2. WebSocket工作原理

### 2.1 连接建立过程

WebSocket连接建立分为两个阶段：

#### 第一阶段：HTTP握手

客户端发起WebSocket连接请求：

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: http://example.com
```

关键请求头说明：
- `Upgrade: websocket` - 请求升级到WebSocket协议
- `Connection: Upgrade` - 设置连接为升级
- `Sec-WebSocket-Key` - 随机生成的Base64编码密钥
- `Sec-WebSocket-Version` - WebSocket协议版本

服务器响应：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

响应说明：
- `101 Switching Protocols` - 协议切换成功
- `Sec-WebSocket-Accept` - 基于客户端密钥生成的响应密钥

#### 第二阶段：数据传输

握手成功后，连接升级为WebSocket协议，可以进行双向数据传输。

### 2.2 数据帧格式

WebSocket使用帧（Frame）来传输数据：

```
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |     Extended payload length continued, if payload len == 127  |
     +-------------------------------+-------------------------------+
     |                               | Masking-key, if MASK set to 1 |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------+-------------------------------+
     |                     Payload Data continued ...                |
     +----------------------------------------------------------------+
```

帧类型（opcode）：
- `0x0` - 继续帧
- `0x1` - 文本帧
- `0x2` - 二进制帧
- `0x8` - 关闭帧
- `0x9` - Ping帧
- `0xA` - Pong帧

### 2.3 连接状态

WebSocket连接有四种状态：

```javascript
// WebSocket.readyState 的值
const WebSocketStates = {
    CONNECTING: 0,  // 正在连接
    OPEN: 1,        // 已连接，可以通信
    CLOSING: 2,     // 正在关闭
    CLOSED: 3       // 已关闭
}

// 使用示例
const ws = new WebSocket('ws://localhost:8080')

console.log(ws.readyState) // 0 (CONNECTING)

ws.onopen = () => {
    console.log(ws.readyState) // 1 (OPEN)
}

ws.onclose = () => {
    console.log(ws.readyState) // 3 (CLOSED)
}
```

### 2.4 心跳机制

WebSocket使用Ping/Pong帧来保持连接活跃：

```javascript
// 客户端心跳实现
class WebSocketWithHeartbeat {
    constructor(url) {
        this.url = url
        this.ws = null
        this.heartbeatInterval = 30000 // 30秒
        this.heartbeatTimer = null
        this.connect()
    }
    
    connect() {
        this.ws = new WebSocket(this.url)
        
        this.ws.onopen = () => {
            this.startHeartbeat()
        }
        
        this.ws.onclose = () => {
            this.stopHeartbeat()
        }
        
        this.ws.onmessage = (event) => {
            if (event.data === 'pong') {
                console.log('心跳响应')
            }
        }
    }
    
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send('ping')
            }
        }, this.heartbeatInterval)
    }
    
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
    }
}
```

## 3. 客户端WebSocket API

### 3.1 创建连接

```javascript
// 基本连接
const ws = new WebSocket('ws://localhost:8080')

// 安全连接（使用TLS/SSL）
const wss = new WebSocket('wss://secure.example.com')

// 指定子协议
const ws = new WebSocket('ws://localhost:8080', 'chat')

// 多个子协议（服务器选择其中一个）
const ws = new WebSocket('ws://localhost:8080', ['chat', 'superchat'])
```

### 3.2 事件处理

WebSocket提供四个事件：

```javascript
const ws = new WebSocket('ws://localhost:8080')

// 1. open - 连接建立
ws.onopen = function(event) {
    console.log('连接已建立')
    console.log('子协议：', ws.protocol)
    console.log('扩展：', ws.extensions)
    
    // 可以开始发送数据
    ws.send('Hello Server!')
}

// 2. message - 接收消息
ws.onmessage = function(event) {
    console.log('收到消息：', event.data)
    console.log('消息来源：', event.origin)
    
    // 处理不同类型的数据
    if (typeof event.data === 'string') {
        // 文本数据
        const json = JSON.parse(event.data)
        handleTextMessage(json)
    } else if (event.data instanceof Blob) {
        // 二进制数据（Blob）
        handleBlobMessage(event.data)
    } else if (event.data instanceof ArrayBuffer) {
        // 二进制数据（ArrayBuffer）
        handleArrayBufferMessage(event.data)
    }
}

// 3. error - 发生错误
ws.onerror = function(error) {
    console.error('WebSocket错误：', error)
    // 错误处理逻辑
    handleError(error)
}

// 4. close - 连接关闭
ws.onclose = function(event) {
    console.log('连接关闭')
    console.log('关闭代码：', event.code)
    console.log('关闭原因：', event.reason)
    console.log('是否正常关闭：', event.wasClean)
    
    // 重连逻辑
    if (!event.wasClean) {
        reconnect()
    }
}
```

### 3.3 发送数据

```javascript
// 发送文本数据
ws.send('Hello World')

// 发送JSON数据
const message = {
    type: 'chat',
    content: '你好',
    timestamp: Date.now()
}
ws.send(JSON.stringify(message))

// 发送二进制数据 - ArrayBuffer
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setInt32(0, 256)
ws.send(buffer)

// 发送二进制数据 - Blob
const blob = new Blob(['Hello'], {type: 'text/plain'})
ws.send(blob)

// 发送文件
const file = document.getElementById('file').files[0]
ws.send(file)

// 检查发送缓冲区
if (ws.bufferedAmount === 0) {
    // 所有数据已发送
} else {
    console.log(`还有 ${ws.bufferedAmount} 字节待发送`)
}
```

### 3.4 关闭连接

```javascript
// 正常关闭
ws.close()

// 指定关闭代码和原因
ws.close(1000, '正常关闭')

// 常见的关闭代码
const CloseCodes = {
    NORMAL: 1000,           // 正常关闭
    GOING_AWAY: 1001,       // 端点离开（浏览器页面关闭）
    PROTOCOL_ERROR: 1002,   // 协议错误
    UNSUPPORTED: 1003,      // 收到不支持的数据类型
    NO_STATUS: 1005,        // 没有收到状态码（保留）
    ABNORMAL: 1006,         // 异常关闭（保留）
    INVALID_DATA: 1007,     // 数据类型不一致
    POLICY_VIOLATION: 1008, // 违反策略
    TOO_BIG: 1009,         // 消息太大
    EXTENSION_ERROR: 1010,  // 扩展协商失败
    UNEXPECTED: 1011        // 意外情况
}

// 自定义关闭代码（3000-4999）
ws.close(3000, '自定义关闭原因')
```

### 3.5 属性

```javascript
// URL - WebSocket的绝对URL
console.log(ws.url) // "ws://localhost:8080/"

// readyState - 连接状态
console.log(ws.readyState) // 0, 1, 2, 3

// protocol - 服务器选定的子协议
console.log(ws.protocol) // "chat"

// extensions - 服务器选定的扩展
console.log(ws.extensions) // "permessage-deflate"

// bufferedAmount - 待发送数据的字节数
console.log(ws.bufferedAmount) // 0

// binaryType - 二进制数据类型
ws.binaryType = 'blob' // 默认值
ws.binaryType = 'arraybuffer' // 可选值
```

## 4. 服务端实现

### 4.1 Node.js原生实现

```javascript
const http = require('http')
const crypto = require('crypto')

// WebSocket GUID（固定值）
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

// 创建HTTP服务器
const server = http.createServer()

server.on('upgrade', (request, socket, head) => {
    // 获取客户端的Key
    const key = request.headers['sec-websocket-key']
    
    // 生成响应Key
    const hash = crypto
        .createHash('sha1')
        .update(key + WS_GUID)
        .digest('base64')
    
    // 发送握手响应
    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${hash}`,
        '',
        ''
    ].join('\r\n')
    
    socket.write(responseHeaders)
    
    // WebSocket连接建立成功
    socket.on('data', (buffer) => {
        // 解析WebSocket帧
        const frame = parseWebSocketFrame(buffer)
        console.log('收到消息：', frame.payload)
        
        // 发送响应
        const response = createWebSocketFrame('收到：' + frame.payload)
        socket.write(response)
    })
})

server.listen(8080, () => {
    console.log('WebSocket服务器运行在端口8080')
})
```

### 4.2 使用ws库

```bash
npm install ws
```

```javascript
const WebSocket = require('ws')

// 创建WebSocket服务器
const wss = new WebSocket.Server({ 
    port: 8080,
    clientTracking: true, // 跟踪客户端
    maxPayload: 10 * 1024 * 1024, // 最大消息10MB
})

// 连接事件
wss.on('connection', function connection(ws, req) {
    // 客户端信息
    const ip = req.socket.remoteAddress
    const port = req.socket.remotePort
    console.log(`新客户端连接 ${ip}:${port}`)
    
    // 设置二进制类型
    ws.binaryType = 'arraybuffer'
    
    // 接收消息
    ws.on('message', function incoming(data, isBinary) {
        console.log('收到消息：', data.toString())
        
        // 回显消息
        ws.send(`服务器收到: ${data}`, { binary: isBinary })
        
        // 广播给其他客户端
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary })
            }
        })
    })
    
    // 发送欢迎消息
    ws.send('欢迎连接WebSocket服务器！')
    
    // Ping-Pong心跳
    ws.isAlive = true
    ws.on('pong', function heartbeat() {
        this.isAlive = true
    })
    
    // 错误处理
    ws.on('error', function error(err) {
        console.error('WebSocket错误：', err)
    })
    
    // 连接关闭
    ws.on('close', function close(code, reason) {
        console.log(`客户端断开连接 ${code} ${reason}`)
    })
})

// 心跳检测
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate()
        }
        
        ws.isAlive = false
        ws.ping()
    })
}, 30000)

// 服务器关闭时清理
wss.on('close', function close() {
    clearInterval(interval)
})

console.log('WebSocket服务器运行在端口8080')
```

### 4.3 Express集成

```javascript
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Express路由
app.get('/', (req, res) => {
    res.send('WebSocket服务器运行中')
})

// WebSocket处理
wss.on('connection', (ws, req) => {
    // 从URL获取参数
    const userId = req.url.split('?userId=')[1]
    ws.userId = userId
    
    console.log(`用户 ${userId} 已连接`)
    
    ws.on('message', (message) => {
        // 处理消息
        const data = JSON.parse(message)
        handleMessage(ws, data)
    })
})

function handleMessage(ws, data) {
    switch(data.type) {
        case 'chat':
            broadcastMessage(ws, data)
            break
        case 'private':
            sendPrivateMessage(ws, data)
            break
        default:
            ws.send(JSON.stringify({
                type: 'error',
                message: '未知消息类型'
            }))
    }
}

function broadcastMessage(sender, data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'chat',
                from: sender.userId,
                message: data.message,
                timestamp: Date.now()
            }))
        }
    })
}

function sendPrivateMessage(sender, data) {
    wss.clients.forEach((client) => {
        if (client.userId === data.to && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'private',
                from: sender.userId,
                message: data.message,
                timestamp: Date.now()
            }))
        }
    })
}

server.listen(8080, () => {
    console.log('服务器运行在端口8080')
})
```

## 5. 浏览器兼容性

### 5.1 兼容性检查

```javascript
// 检查浏览器是否支持WebSocket
function checkWebSocketSupport() {
    if ('WebSocket' in window) {
        console.log('浏览器支持WebSocket')
        return true
    } else if ('MozWebSocket' in window) {
        // Firefox旧版本
        window.WebSocket = window.MozWebSocket
        console.log('浏览器支持MozWebSocket')
        return true
    } else {
        console.log('浏览器不支持WebSocket')
        return false
    }
}

// 使用示例
if (checkWebSocketSupport()) {
    const ws = new WebSocket('ws://localhost:8080')
    // ...
} else {
    // 降级方案：使用轮询或长轮询
    fallbackToPolling()
}
```

### 5.2 浏览器支持情况

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | 16+ | 完全支持 |
| Firefox | 11+ | 完全支持 |
| Safari | 7+ | 完全支持 |
| Edge | 12+ | 完全支持 |
| IE | 10+ | IE10部分支持，IE11完全支持 |
| Opera | 12.1+ | 完全支持 |
| iOS Safari | 6+ | 完全支持 |
| Android Browser | 4.4+ | 完全支持 |

### 5.3 降级方案

```javascript
// WebSocket降级方案
class RealtimeConnection {
    constructor(url) {
        this.url = url
        this.connection = null
        this.init()
    }
    
    init() {
        if ('WebSocket' in window) {
            this.useWebSocket()
        } else if ('EventSource' in window) {
            this.useSSE() // Server-Sent Events
        } else {
            this.useLongPolling() // 长轮询
        }
    }
    
    useWebSocket() {
        this.connection = new WebSocket(this.url.replace('http', 'ws'))
        this.connection.onmessage = (e) => this.onMessage(e.data)
    }
    
    useSSE() {
        this.connection = new EventSource(this.url + '/sse')
        this.connection.onmessage = (e) => this.onMessage(e.data)
    }
    
    useLongPolling() {
        const poll = async () => {
            try {
                const response = await fetch(this.url + '/poll')
                const data = await response.text()
                this.onMessage(data)
                poll() // 继续轮询
            } catch (error) {
                setTimeout(poll, 5000) // 错误后5秒重试
            }
        }
        poll()
    }
    
    onMessage(data) {
        // 处理消息
        console.log('收到消息：', data)
    }
    
    send(data) {
        if (this.connection instanceof WebSocket) {
            this.connection.send(data)
        } else {
            // 使用HTTP POST发送
            fetch(this.url + '/send', {
                method: 'POST',
                body: data
            })
        }
    }
}
```

## 6. 总结

WebSocket为Web应用提供了真正的实时双向通信能力，是现代Web开发中不可或缺的技术。掌握WebSocket的基础知识是实现聊天、推送、协作等实时功能的基础。

关键要点：
1. WebSocket基于TCP，通过HTTP升级而来
2. 提供全双工通信，服务器可主动推送
3. 相比HTTP轮询，性能更好、实时性更高
4. 浏览器原生支持，API简单易用
5. 需要考虑连接管理、错误处理、降级方案

下一步学习：
- [WebSocket聊天实战](./WebSocket聊天实战.md) - 实现完整的聊天应用
- [WebSocket进阶与优化](./WebSocket进阶与优化.md) - 性能优化和最佳实践
