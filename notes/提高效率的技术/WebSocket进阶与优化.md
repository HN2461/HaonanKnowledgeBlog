# WebSocket进阶与优化

## 1. 连接管理与重连机制

### 1.1 智能重连策略

```javascript
class SmartWebSocketClient {
    constructor(url, options = {}) {
        this.url = url
        this.options = {
            maxReconnectDelay: 30000,      // 最大重连延迟
            reconnectDecay: 1.5,            // 重连延迟增长系数
            timeoutInterval: 2000,          // 连接超时时间
            maxReconnectAttempts: Infinity, // 最大重连次数
            ...options
        }
        
        this.ws = null
        this.reconnectAttempts = 0
        this.shouldReconnect = true
        this.listeners = new Map()
        this.messageQueue = []
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                resolve()
                return
            }
            
            const timeout = setTimeout(() => {
                reject(new Error('连接超时'))
                this.ws?.close()
            }, this.options.timeoutInterval)
            
            try {
                this.ws = new WebSocket(this.url)
                
                this.ws.onopen = () => {
                    clearTimeout(timeout)
                    console.log('✅ WebSocket连接成功')
                    this.reconnectAttempts = 0
                    this.flushMessageQueue()
                    this.emit('open')
                    resolve()
                }
                
                this.ws.onclose = (event) => {
                    console.log('❌ WebSocket连接关闭', event.code, event.reason)
                    this.emit('close', event)
                    
                    if (this.shouldReconnect && !event.wasClean) {
                        this.reconnect()
                    }
                }
                
                this.ws.onerror = (error) => {
                    clearTimeout(timeout)
                    console.error('❌ WebSocket错误', error)
                    this.emit('error', error)
                    reject(error)
                }
                
                this.ws.onmessage = (event) => {
                    this.emit('message', event.data)
                }
                
            } catch (error) {
                clearTimeout(timeout)
                reject(error)
            }
        })
    }
    
    reconnect() {
        if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            console.error('重连次数已达上限')
            this.emit('reconnectFailed')
            return
        }
        
        this.reconnectAttempts++
        const delay = Math.min(
            this.options.reconnectDecay ** this.reconnectAttempts * 1000,
            this.options.maxReconnectDelay
        )
        
        console.log(`⏱️ ${delay}ms后进行第${this.reconnectAttempts}次重连`)
        
        setTimeout(() => {
            this.connect()
                .then(() => {
                    console.log('✅ 重连成功')
                    this.emit('reconnected')
                })
                .catch(() => {
                    if (this.shouldReconnect) {
                        this.reconnect()
                    }
                })
        }, delay)
    }
    
    send(data) {
        const message = typeof data === 'string' ? data : JSON.stringify(data)
        
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(message)
            return true
        } else {
            // 加入队列
            this.messageQueue.push(message)
            console.log('📦 消息已缓存，等待连接恢复')
            return false
        }
    }
    
    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()
            this.ws.send(message)
        }
        console.log('✅ 消息队列已发送')
    }
    
    on(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(handler)
    }
    
    emit(event, ...args) {
        const handlers = this.listeners.get(event) || []
        handlers.forEach(handler => handler(...args))
    }
    
    close() {
        this.shouldReconnect = false
        this.ws?.close(1000, '正常关闭')
    }
}
```

## 2. 性能优化

### 2.1 消息压缩

```javascript
// 使用pako库进行压缩
import pako from 'pako'

class CompressedWebSocket {
    constructor(url, options = {}) {
        this.url = url
        this.ws = null
        this.compressionThreshold = options.compressionThreshold || 1024 // 1KB
        this.enableCompression = options.enableCompression !== false
    }
    
    connect() {
        this.ws = new WebSocket(this.url)
        this.ws.binaryType = 'arraybuffer'
        
        this.ws.onmessage = (event) => {
            const message = this.decompress(event.data)
            this.onMessage(message)
        }
    }
    
    send(data) {
        const message = typeof data === 'string' ? data : JSON.stringify(data)
        
        if (this.shouldCompress(message)) {
            const compressed = this.compress(message)
            this.ws.send(compressed)
        } else {
            this.ws.send(message)
        }
    }
    
    shouldCompress(message) {
        return this.enableCompression && 
               message.length > this.compressionThreshold
    }
    
    compress(data) {
        // 添加压缩标志
        const flag = new Uint8Array([1]) // 1 表示压缩
        const compressed = pako.deflate(data)
        
        // 合并标志和压缩数据
        const result = new Uint8Array(flag.length + compressed.length)
        result.set(flag)
        result.set(compressed, flag.length)
        
        console.log(`压缩: ${data.length} -> ${result.length} (${Math.round(result.length/data.length*100)}%)`)
        return result
    }
    
    decompress(data) {
        if (typeof data === 'string') {
            return data
        }
        
        const view = new Uint8Array(data)
        const flag = view[0]
        
        if (flag === 1) {
            // 数据已压缩
            const compressed = view.slice(1)
            const decompressed = pako.inflate(compressed, { to: 'string' })
            return decompressed
        } else {
            // 未压缩
            return new TextDecoder().decode(view.slice(1))
        }
    }
    
    onMessage(message) {
        // 处理解压后的消息
        console.log('收到消息:', message)
    }
}
```

### 2.2 消息批处理

```javascript
class BatchedWebSocket {
    constructor(url, options = {}) {
        this.url = url
        this.ws = null
        this.batchSize = options.batchSize || 10
        this.batchInterval = options.batchInterval || 100 // ms
        this.messageBuffer = []
        this.batchTimer = null
    }
    
    connect() {
        this.ws = new WebSocket(this.url)
        
        this.ws.onmessage = (event) => {
            const batch = JSON.parse(event.data)
            if (Array.isArray(batch)) {
                batch.forEach(msg => this.handleMessage(msg))
            } else {
                this.handleMessage(batch)
            }
        }
    }
    
    send(message) {
        this.messageBuffer.push(message)
        
        if (this.messageBuffer.length >= this.batchSize) {
            this.flush()
        } else if (!this.batchTimer) {
            this.batchTimer = setTimeout(() => {
                this.flush()
            }, this.batchInterval)
        }
    }
    
    flush() {
        if (this.messageBuffer.length === 0) return
        
        const batch = this.messageBuffer.splice(0, this.batchSize)
        
        if (this.ws?.readyState === WebSocket.OPEN) {
            // 批量发送
            if (batch.length === 1) {
                this.ws.send(JSON.stringify(batch[0]))
            } else {
                this.ws.send(JSON.stringify(batch))
            }
            
            console.log(`📦 批量发送 ${batch.length} 条消息`)
        }
        
        // 清除定时器
        if (this.batchTimer) {
            clearTimeout(this.batchTimer)
            this.batchTimer = null
        }
        
        // 如果还有剩余消息，继续处理
        if (this.messageBuffer.length > 0) {
            this.batchTimer = setTimeout(() => {
                this.flush()
            }, this.batchInterval)
        }
    }
    
    handleMessage(message) {
        // 处理单条消息
        console.log('处理消息:', message)
    }
}
```

## 3. 安全性

### 3.1 身份认证与授权

```javascript
// JWT认证的WebSocket
class SecureWebSocket {
    constructor(url, token) {
        this.url = url
        this.token = token
        this.ws = null
        this.authenticated = false
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            // 在URL中传递token（也可以在连接后发送）
            const wsUrl = `${this.url}?token=${encodeURIComponent(this.token)}`
            this.ws = new WebSocket(wsUrl)
            
            this.ws.onopen = () => {
                // 发送认证消息
                this.authenticate()
                    .then(resolve)
                    .catch(reject)
            }
            
            this.ws.onerror = reject
        })
    }
    
    authenticate() {
        return new Promise((resolve, reject) => {
            const authMessage = {
                type: 'auth',
                token: this.token
            }
            
            // 设置认证超时
            const timeout = setTimeout(() => {
                reject(new Error('认证超时'))
            }, 5000)
            
            // 等待认证响应
            const handler = (event) => {
                const message = JSON.parse(event.data)
                
                if (message.type === 'auth_success') {
                    clearTimeout(timeout)
                    this.authenticated = true
                    this.ws.removeEventListener('message', handler)
                    resolve()
                } else if (message.type === 'auth_error') {
                    clearTimeout(timeout)
                    this.ws.removeEventListener('message', handler)
                    reject(new Error(message.error))
                }
            }
            
            this.ws.addEventListener('message', handler)
            this.ws.send(JSON.stringify(authMessage))
        })
    }
    
    send(data) {
        if (!this.authenticated) {
            throw new Error('未认证，无法发送消息')
        }
        
        // 添加签名
        const message = {
            ...data,
            signature: this.sign(data)
        }
        
        this.ws.send(JSON.stringify(message))
    }
    
    sign(data) {
        // 简单的签名示例（实际应使用更安全的方法）
        const dataStr = JSON.stringify(data)
        return btoa(dataStr + this.token).substring(0, 16)
    }
}
```

### 3.2 防御攻击

```javascript
// 限流和防护
class ProtectedWebSocket {
    constructor(url, options = {}) {
        this.url = url
        this.ws = null
        
        // 限流设置
        this.rateLimit = {
            maxMessages: options.maxMessages || 100,    // 每个窗口最大消息数
            windowMs: options.windowMs || 60000,         // 时间窗口（毫秒）
            messages: [],                                // 消息时间戳记录
        }
        
        // 消息大小限制
        this.maxMessageSize = options.maxMessageSize || 10 * 1024 // 10KB
        
        // 黑名单
        this.blacklist = new Set()
    }
    
    connect() {
        this.ws = new WebSocket(this.url)
        
        this.ws.onmessage = (event) => {
            // 验证消息
            if (this.validateMessage(event.data)) {
                this.handleMessage(JSON.parse(event.data))
            }
        }
    }
    
    validateMessage(data) {
        // 检查消息大小
        if (data.length > this.maxMessageSize) {
            console.warn('消息过大，已拒绝')
            return false
        }
        
        // 检查JSON格式
        try {
            const message = JSON.parse(data)
            
            // XSS防护：清理HTML
            if (typeof message.content === 'string') {
                message.content = this.sanitize(message.content)
            }
            
            return true
        } catch (error) {
            console.warn('无效的消息格式')
            return false
        }
    }
    
    sanitize(text) {
        // HTML实体转义
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        }
        
        return text.replace(/[&<>"'\/]/g, char => escapeMap[char])
    }
    
    send(data) {
        // 检查限流
        if (!this.checkRateLimit()) {
            console.warn('发送频率过高，消息已被限制')
            return false
        }
        
        // 检查消息大小
        const message = JSON.stringify(data)
        if (message.length > this.maxMessageSize) {
            console.warn('消息过大，无法发送')
            return false
        }
        
        this.ws.send(message)
        return true
    }
    
    checkRateLimit() {
        const now = Date.now()
        
        // 清理过期记录
        this.rateLimit.messages = this.rateLimit.messages
            .filter(timestamp => now - timestamp < this.rateLimit.windowMs)
        
        // 检查是否超限
        if (this.rateLimit.messages.length >= this.rateLimit.maxMessages) {
            return false
        }
        
        // 记录新消息
        this.rateLimit.messages.push(now)
        return true
    }
    
    handleMessage(message) {
        console.log('安全消息:', message)
    }
}
```

## 4. 调试与监控

### 4.1 调试工具

```javascript
// WebSocket调试器
class WebSocketDebugger {
    constructor(ws, options = {}) {
        this.ws = ws
        this.logs = []
        this.options = {
            logToConsole: options.logToConsole !== false,
            maxLogs: options.maxLogs || 1000,
            logLevel: options.logLevel || 'info'
        }
        
        this.intercept()
    }
    
    intercept() {
        // 保存原始方法
        const originalSend = this.ws.send.bind(this.ws)
        const originalClose = this.ws.close.bind(this.ws)
        
        // 拦截send
        this.ws.send = (data) => {
            this.log('send', data, 'outgoing')
            originalSend(data)
        }
        
        // 拦截close
        this.ws.close = (code, reason) => {
            this.log('close', { code, reason }, 'system')
            originalClose(code, reason)
        }
        
        // 拦截事件
        this.ws.addEventListener('open', () => {
            this.log('open', null, 'system')
        })
        
        this.ws.addEventListener('message', (event) => {
            this.log('message', event.data, 'incoming')
        })
        
        this.ws.addEventListener('error', (error) => {
            this.log('error', error, 'error')
        })
        
        this.ws.addEventListener('close', (event) => {
            this.log('close', { code: event.code, reason: event.reason }, 'system')
        })
    }
    
    log(type, data, direction) {
        const entry = {
            type,
            data,
            direction,
            timestamp: Date.now(),
            time: new Date().toISOString()
        }
        
        // 添加到日志
        this.logs.push(entry)
        
        // 限制日志大小
        if (this.logs.length > this.options.maxLogs) {
            this.logs.shift()
        }
        
        // 控制台输出
        if (this.options.logToConsole) {
            const emoji = {
                'outgoing': '📤',
                'incoming': '📥',
                'system': '⚙️',
                'error': '❌'
            }[direction] || '📝'
            
            console.log(
                `${emoji} [WS ${type}]`,
                `[${new Date().toLocaleTimeString()}]`,
                data
            )
        }
    }
    
    // 获取日志统计
    getStats() {
        const stats = {
            totalMessages: this.logs.length,
            sent: this.logs.filter(l => l.direction === 'outgoing').length,
            received: this.logs.filter(l => l.direction === 'incoming').length,
            errors: this.logs.filter(l => l.type === 'error').length,
            duration: 0
        }
        
        if (this.logs.length > 0) {
            const first = this.logs[0].timestamp
            const last = this.logs[this.logs.length - 1].timestamp
            stats.duration = last - first
        }
        
        return stats
    }
    
    // 导出日志
    export(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2)
        } else if (format === 'csv') {
            const headers = ['time', 'type', 'direction', 'data']
            const rows = this.logs.map(log => [
                log.time,
                log.type,
                log.direction,
                JSON.stringify(log.data)
            ])
            
            return [headers, ...rows]
                .map(row => row.join(','))
                .join('\n')
        }
    }
    
    // 清空日志
    clear() {
        this.logs = []
    }
}
```

## 5. 最佳实践

### 5.1 错误处理

```javascript
// 完善的错误处理
class RobustWebSocket {
    constructor(url) {
        this.url = url
        this.ws = null
        this.errorHandlers = new Map()
        
        // 错误类型
        this.errorTypes = {
            CONNECTION_FAILED: 'connection_failed',
            AUTHENTICATION_FAILED: 'auth_failed',
            MESSAGE_SEND_FAILED: 'send_failed',
            TIMEOUT: 'timeout',
            PROTOCOL_ERROR: 'protocol_error'
        }
    }
    
    onError(type, handler) {
        this.errorHandlers.set(type, handler)
    }
    
    handleError(type, error) {
        const handler = this.errorHandlers.get(type)
        if (handler) {
            handler(error)
        } else {
            console.error(`未处理的错误 [${type}]:`, error)
        }
    }
}
```

### 5.2 使用建议

1. **连接管理**
   - 实现自动重连机制
   - 设置合理的重连延迟和次数
   - 处理连接状态变化

2. **消息处理**
   - 使用消息队列缓存离线消息
   - 实现消息确认机制
   - 处理消息重复和丢失

3. **性能优化**
   - 合理使用消息压缩
   - 实现消息批处理
   - 控制消息频率

4. **安全性**
   - 使用wss://加密连接
   - 实现身份认证
   - 验证和清理消息内容

5. **监控调试**
   - 记录关键日志
   - 监控性能指标
   - 实现错误上报

## 总结

WebSocket进阶优化涉及多个方面：

1. **连接稳定性** - 重连机制、心跳检测、状态管理
2. **性能提升** - 消息压缩、批处理、二进制协议
3. **安全保障** - 认证授权、消息加密、攻击防御
4. **开发体验** - 调试工具、监控系统、错误处理

通过这些优化，可以构建稳定、高效、安全的WebSocket应用。

## 相关文档

- [WebSocket基础知识](./WebSocket基础知识.md)
- [WebSocket聊天实战](./WebSocket聊天实战.md)
