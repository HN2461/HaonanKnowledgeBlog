### WebSocket 简介
WebSocket 是一种网络传输协议，位于 OSI 模型的应用层。它允许在客户端和服务器之间建立持久连接，进行全双工通信，解决了传统 HTTP 协议无法实现服务器主动推送数据的问题。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/jpeg/50923934/1750904856632-f0396e48-cc1b-4d60-bb4c-bdba1cfddbf8.jpeg)

### WebSocket 特点
+ **双向通信**：客户端和服务器可以同时发送和接收数据。
+ **低延迟**：相比 HTTP，减少了请求头的冗余信息，连接建立后不会频繁断开重连，降低了延迟。
+ **节省带宽**：连接建立后，后续的消息传递不需要额外的请求头，节省了网络资源。
+ **实时推送**：服务器可以主动向客户端推送消息，不需要客户端频繁地轮询服务器。

### WebSocket 协议
WebSocket 协议使用 `ws`（无加密）或 `wss`（加密）作为协议标识符。其握手过程基于 HTTP 协议，通过在 HTTP 请求中添加特定的头信息（如 `Upgrade: websocket`）来实现协议升级。

### WebSocket 的应用场景
+ **即时聊天系统**：如在线客服、社交聊天应用等。
+ **实时数据推送**：如股票行情、体育赛事比分、天气预报等。
+ **在线游戏**：需要频繁的数据交换和极低的延迟，WebSocket 可以保证游戏的流畅性和公平性。
+ **协同办公**：如多人同时编辑文档，实时同步编辑内容。
+ **物联网设备通信**：实现设备数据的实时上传和控制指令的即时下发。
+ **实时监控**：如视频监控、设备状态监控等。

### WebSocket 的基本使用（以 JavaScript 为例）
+ **创建 WebSocket 对象**：

```javascript
let ws = new WebSocket('ws://example.com/socket');
```

+ **事件处理**：

```javascript
ws.onopen = function(event) {
  console.log('连接已打开');
};
ws.onmessage = function(event) {
  console.log('收到消息:', event.data);
};
ws.onerror = function(event) {
  console.error('出现错误:', event);
};
ws.onclose = function(event) {
  console.log('连接已关闭');
};
```

+ **发送消息**：

```javascript
ws.send('Hello, server!');
```

+ **关闭连接**：

```javascript
ws.close();
```

### WebSocket 与 HTTP 的区别
+ **通信方式**：HTTP 是请求 - 响应模式，半双工；WebSocket 是双向通信，全双工。
+ **连接模型**：HTTP 每次通信需新建连接；WebSocket 建立一次连接后持久存在。
+ **消息结构**：HTTP 头部冗长，传输开销大；WebSocket 头部精简，支持二进制传输。
+ **服务端主动推送**：HTTP 不支持；WebSocket 支持。

### WebSocket 的服务端实现
+ 常见的服务端库：
    - **Node.js**：`ws` 库
    - **Python**：`websockets` 库
    - **Java**：`Java WebSocket API`
+ 以 Node.js 的 `ws` 库为例，服务端代码：

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('收到消息:', message);
        ws.send('消息已收到');
    });
    ws.send('欢迎连接到 WebSocket 服务器');
});
```

### WebSocket 的安全注意事项
+ **加密连接**：使用 `wss://` 加密协议，防止数据被窃取。
+ **身份验证**：在建立连接前进行身份验证，确保只有授权用户可以连接。
+ **防止攻击**：限制连接数量、设置消息大小限制等，防止恶意攻击。

### WebSocket 的局限性
+ **网络支持**：部分老旧浏览器或网络环境可能不支持 WebSocket，需要进行兼容性处理。
+ **协议复杂性**：相较于简单的 HTTP 请求 - 响应模式，WebSocket 的协议和实现相对复杂。

### WebSocket 的使用建议
+ **选择合适的场景**：在需要实时通信的场景中使用 WebSocket，而对于传统请求 - 响应模式的场景，HTTP 协议可能更合适。
+ **考虑兼容性**：在使用 WebSocket 之前，检查目标用户的浏览器或客户端是否支持该协议。
+ **合理管理连接**：及时关闭不再需要的 WebSocket 连接，避免浪费资源。





