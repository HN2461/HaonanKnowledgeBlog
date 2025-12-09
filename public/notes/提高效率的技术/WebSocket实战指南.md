# WebSocket实战指南 - 从入门到聊天应用

## 1. WebSocket基础概念

### 1.1 什么是WebSocket？

WebSocket是一种在单个TCP连接上进行全双工通信的协议。它使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

**与传统HTTP的区别**：
- **HTTP**：请求-响应模式，客户端发起请求，服务器响应
- **WebSocket**：全双工通信，双方都可以随时发送消息

```javascript
// HTTP轮询方式（传统）
setInterval(() => {
    fetch('/api/messages')
        .then(res => res.json())
        .then(data => console.log(data))
}, 1000) // 每秒轮询一次，效率低

// WebSocket方式（现代）
const ws = new WebSocket('ws://localhost:8080')
ws.onmessage = (event) => {
    console.log(event.data) // 服务器主动推送，实时性高
}
```

### 1.2 WebSocket的优势

1. **实时性高**：服务器可以主动推送消息
2. **性能好**：避免了HTTP的请求头开销
3. **持久连接**：一次握手，持续通信
4. **双向通信**：客户端和服务器地位对等

### 1.3 WebSocket的应用场景

- 即时通讯（IM聊天）
- 实时推送（消息通知）
- 在线协作（协同编辑）
- 实时数据（股票行情）
- 在线游戏（多人对战）
- 直播弹幕（实时互动）

## 2. WebSocket工作原理

### 2.1 连接建立过程

WebSocket连接建立分为两个阶段：

**1. HTTP握手阶段**
```http
// 客户端发送握手请求
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

// 服务器响应
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

**2. 数据传输阶段**
握手成功后，连接升级为WebSocket协议，开始双向通信。

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
```

### 2.3 连接状态

WebSocket连接有以下几种状态：

```javascript
// WebSocket.readyState 的值
const states = {
    0: 'CONNECTING',  // 正在连接
    1: 'OPEN',        // 已连接
    2: 'CLOSING',     // 正在关闭
    3: 'CLOSED'       // 已关闭
}
```

## 3. 客户端WebSocket API

### 3.1 创建连接

```javascript
// 创建WebSocket连接
const ws = new WebSocket('ws://localhost:8080/chat')

// 支持wss（WebSocket Secure）加密连接
const wss = new WebSocket('wss://secure.example.com/chat')

// 可以指定子协议
const ws = new WebSocket('ws://localhost:8080', ['chat', 'superchat'])
```

### 3.2 事件处理

```javascript
class WebSocketClient {
    constructor(url) {
        this.ws = new WebSocket(url)
        this.init()
    }
    
    init() {
        // 连接打开
        this.ws.onopen = (event) => {
            console.log('连接已建立')
            this.ws.send('Hello Server!')
        }
        
        // 接收消息
        this.ws.onmessage = (event) => {
            console.log('收到消息:', event.data)
            // 处理不同类型的数据
            if (event.data instanceof Blob) {
                // 处理二进制数据
                this.handleBinaryData(event.data)
            } else {
                // 处理文本数据
                this.handleTextData(event.data)
            }
        }
        
        // 连接关闭
        this.ws.onclose = (event) => {
            console.log('连接已关闭', event.code, event.reason)
            // 可以实现重连逻辑
            this.reconnect()
        }
        
        // 连接错误
        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error)
        }
    }
    
    // 发送消息
    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(data)
        } else {
            console.log('WebSocket未连接')
        }
    }
}
```

### 3.3 发送数据

```javascript
// 发送文本
ws.send('Hello World')

// 发送JSON
ws.send(JSON.stringify({
    type: 'message',
    content: '你好',
    timestamp: Date.now()
}))

// 发送二进制数据
const buffer = new ArrayBuffer(8)
ws.send(buffer)

// 发送Blob
const blob = new Blob(['Hello'], {type: 'text/plain'})
ws.send(blob)
```

### 3.4 关闭连接

```javascript
// 正常关闭
ws.close()

// 带状态码和原因关闭
ws.close(1000, '正常关闭')

// 常见的关闭状态码
const closeCodes = {
    1000: '正常关闭',
    1001: '端点离开',
    1002: '协议错误',
    1003: '数据类型错误',
    1006: '异常关闭',
    1007: '数据格式错误',
    1008: '策略违规',
    1009: '消息过大',
    1010: '扩展协商失败',
    1011: '服务器错误'
}
```

## 4. 服务端实现（Node.js）

### 4.1 使用ws库

```bash
npm install ws
```

```javascript
// server.js
const WebSocket = require('ws')

// 创建WebSocket服务器
const wss = new WebSocket.Server({ 
    port: 8080,
    // 可以验证连接
    verifyClient: (info) => {
        // 验证逻辑
        return true
    }
})

// 连接事件
wss.on('connection', (ws, req) => {
    console.log('新客户端连接')
    
    // 获取客户端信息
    const clientIp = req.socket.remoteAddress
    
    // 接收消息
    ws.on('message', (message) => {
        console.log('收到消息:', message.toString())
        
        // 回复消息
        ws.send(`服务器收到: ${message}`)
        
        // 广播给所有客户端
        broadcast(message)
    })
    
    // 连接关闭
    ws.on('close', () => {
        console.log('客户端断开连接')
    })
    
    // 错误处理
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error)
    })
    
    // 发送欢迎消息
    ws.send(JSON.stringify({
        type: 'welcome',
        message: '欢迎连接到服务器'
    }))
})

// 广播函数
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    })
}
```

### 4.2 心跳检测

```javascript
// 心跳检测防止连接断开
class WebSocketServer {
    constructor(port) {
        this.wss = new WebSocket.Server({ port })
        this.clients = new Map()
        this.init()
    }
    
    init() {
        this.wss.on('connection', (ws) => {
            const clientId = this.generateId()
            
            // 初始化客户端信息
            this.clients.set(clientId, {
                ws: ws,
                isAlive: true,
                lastPing: Date.now()
            })
            
            // 心跳响应
            ws.on('pong', () => {
                const client = this.clients.get(clientId)
                if (client) {
                    client.isAlive = true
                    client.lastPing = Date.now()
                }
            })
            
            ws.on('close', () => {
                this.clients.delete(clientId)
            })
        })
        
        // 定期检查心跳
        this.heartbeatInterval = setInterval(() => {
            this.clients.forEach((client, id) => {
                if (!client.isAlive) {
                    // 心跳超时，关闭连接
                    client.ws.terminate()
                    this.clients.delete(id)
                    return
                }
                
                client.isAlive = false
                client.ws.ping() // 发送ping帧
            })
        }, 30000) // 30秒检查一次
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9)
    }
}
```

## 5. 聊天应用实战

### 5.1 消息协议设计

```javascript
// 消息类型定义
const MessageTypes = {
    // 系统消息
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    
    // 用户消息
    MESSAGE: 'message',
    TYPING: 'typing',
    
    // 聊天室管理
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    USER_LIST: 'user_list',
    
    // 文件传输
    FILE_START: 'file_start',
    FILE_CHUNK: 'file_chunk',
    FILE_END: 'file_end'
}

// 消息格式
const messageFormat = {
    type: 'message',        // 消息类型
    from: 'userId',         // 发送者
    to: 'userId/roomId',    // 接收者
    content: 'Hello',       // 消息内容
    timestamp: 1234567890,  // 时间戳
    messageId: 'msg_123',   // 消息ID
    extra: {}               // 扩展字段
}
```

### 5.2 完整的聊天客户端类

```javascript
// ChatClient.js
class ChatClient {
    constructor(serverUrl, userId) {
        this.serverUrl = serverUrl
        this.userId = userId
        this.ws = null
        this.messageHandlers = new Map()
        this.messageQueue = []
        this.isConnected = false
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.reconnectDelay = 1000
    }
    
    // 连接服务器
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.serverUrl)
                
                this.ws.onopen = () => {
                    console.log('WebSocket连接成功')
                    this.isConnected = true
                    this.reconnectAttempts = 0
                    
                    // 发送认证信息
                    this.send({
                        type: MessageTypes.CONNECT,
                        userId: this.userId,
                        timestamp: Date.now()
                    })
                    
                    // 发送队列中的消息
                    this.flushMessageQueue()
                    
                    resolve()
                }
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data)
                }
                
                this.ws.onclose = (event) => {
                    console.log('WebSocket连接关闭', event.code)
                    this.isConnected = false
                    
                    // 自动重连
                    if (event.code !== 1000) {
                        this.reconnect()
                    }
                }
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket错误', error)
                    reject(error)
                }
                
            } catch (error) {
                reject(error)
            }
        })
    }
    
    // 重连逻辑
    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('重连次数超过最大限制')
            this.onMaxReconnectReached()
            return
        }
        
        this.reconnectAttempts++
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
        
        console.log(`${delay}ms后进行第${this.reconnectAttempts}次重连`)
        
        setTimeout(() => {
            this.connect()
        }, delay)
    }
    
    // 发送消息
    send(data) {
        const message = typeof data === 'string' ? data : JSON.stringify(data)
        
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message)
        } else {
            // 加入消息队列
            this.messageQueue.push(message)
            console.log('消息已加入队列，等待连接恢复')
        }
    }
    
    // 处理接收的消息
    handleMessage(data) {
        try {
            const message = JSON.parse(data)
            console.log('收到消息:', message)
            
            // 调用对应的消息处理器
            const handler = this.messageHandlers.get(message.type)
            if (handler) {
                handler(message)
            }
            
            // 触发通用消息事件
            this.onMessage(message)
            
        } catch (error) {
            console.error('消息解析失败:', error)
        }
    }
    
    // 注册消息处理器
    on(type, handler) {
        this.messageHandlers.set(type, handler)
    }
    
    // 发送聊天消息
    sendMessage(content, to = null) {
        const message = {
            type: MessageTypes.MESSAGE,
            from: this.userId,
            to: to,
            content: content,
            timestamp: Date.now(),
            messageId: this.generateMessageId()
        }
        
        this.send(message)
        return message
    }
    
    // 发送输入状态
    sendTyping(to) {
        this.send({
            type: MessageTypes.TYPING,
            from: this.userId,
            to: to,
            timestamp: Date.now()
        })
    }
    
    // 加入房间
    joinRoom(roomId) {
        this.send({
            type: MessageTypes.JOIN_ROOM,
            userId: this.userId,
            roomId: roomId,
            timestamp: Date.now()
        })
    }
    
    // 离开房间
    leaveRoom(roomId) {
        this.send({
            type: MessageTypes.LEAVE_ROOM,
            userId: this.userId,
            roomId: roomId,
            timestamp: Date.now()
        })
    }
    
    // 清理队列消息
    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()
            this.ws.send(message)
        }
    }
    
    // 关闭连接
    close() {
        if (this.ws) {
            this.ws.close(1000, '正常关闭')
        }
    }
    
    // 工具方法
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // 可重写的回调方法
    onMessage(message) {}
    onMaxReconnectReached() {}
}

export default ChatClient
```
