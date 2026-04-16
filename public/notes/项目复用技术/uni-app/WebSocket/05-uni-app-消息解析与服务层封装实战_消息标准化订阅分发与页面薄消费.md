---
title: uni-app 消息解析与服务层封装实战：消息标准化、订阅分发与页面薄消费
date: 2026-04-16
category: 项目复用技术
tags:
  - uni-app
  - WebSocket
  - 消息解析
  - 实时聊天
  - 服务层封装
  - STOMP
description: 这是 WebSocket 专题的第 5 篇，专门讲消息解析和服务层如何封，包括后端字段标准化、不同消息类型解析、订阅分发、消息回调注册，以及页面层如何只消费统一服务而不直接碰 socket 细节。
---

# uni-app 消息解析与服务层封装实战：消息标准化、订阅分发与页面薄消费

> 这是 `项目复用技术 / uni-app / WebSocket` 专题的第 5 篇。  
> 这一篇不再讲“怎么连”，而是讲：
>
> `连上以后，消息怎么统一解析，服务层怎么统一暴露给页面。`

## 一、为什么消息解析层一定值得单独抽

很多后端的消息结构天然不适合页面直接渲染。

常见问题有：

1. 字段名不一致
2. 文件消息 content 里包了一层 JSON
3. 位置消息 content 里又是另一种结构
4. 语音时长藏在 `jsonInfo`
5. 模板消息和普通消息混在一起

如果这些都让页面自己兼容，页面层会越来越脏。

所以消息解析层的核心目标只有一个：

`把后端不稳定消息，收口成前端稳定消息对象。`

## 二、消息解析层最适合统一什么

至少统一下面这些东西：

1. `messageId`
2. `content`
3. `type`
4. `timestamp`
5. `senderData`
6. `fileInfo`
7. `locationData`
8. `duration`

### 推荐模板：基础解析入口

```js
export default class MessageParser {
  /**
   * 解析接收到的消息。
   * 用途：把后端原始消息转换成页面可直接消费的统一消息对象。
   * 参数：rawMessage 为后端原始消息。
   * 返回值：标准化后的消息对象；解析失败时返回 null。
   * 边界行为：会兼容字段别名、默认值、时间戳回退和特殊消息类型。
   */
  static parseIncomingMessage(rawMessage) {
    try {
      const messageId = rawMessage.messageId || rawMessage.recordID
      const content = rawMessage.content || rawMessage.sendContent
      const type = this.normalizeIncomingType(rawMessage)
      const timestamp =
        rawMessage.timestamp ||
        (rawMessage.sendTime ? new Date(rawMessage.sendTime).getTime() : Date.now())

      const parsedContent = this.parseContent(type, content)

      let displayContent = parsedContent
      let locationData = null

      if ([2, 3, 4, 5].includes(type) && Array.isArray(parsedContent) && parsedContent.length > 0) {
        displayContent = parsedContent[0].src || parsedContent[0].filePath || ''
      } else if (type === 6) {
        locationData = parsedContent
        displayContent = locationData?.name || '[位置]'
      }

      return {
        messageId,
        fromUserID: rawMessage.fromUserID,
        fromUserName: rawMessage.fromUserName || rawMessage.fromUserID || '对方',
        toUserID: rawMessage.toUserID,
        toGroupID: rawMessage.toGroupID,
        type,
        content: displayContent,
        fileInfo: parsedContent,
        locationData,
        duration: this.extractDuration(rawMessage),
        destination: rawMessage.destination,
        timestamp,
        status: 'success',
      }
    } catch (error) {
      return null
    }
  }
}
```

## 三、为什么消息类型一定要统一

很多项目里后端会给你：

1. `type`
2. `chatType`
3. `messageType`

甚至有的系统模板消息根本没有标准 `type`，只有业务意义上的 `messageType`。

所以你至少要有一个统一入口：

```js
/**
 * 规范化接收消息类型。
 * 用途：兼容 type/chatType/messageType 等不同字段来源，并统一映射为标准类型数字。
 * 参数：rawMessage 为原始消息对象。
 * 返回值：标准消息类型数字。
 * 边界行为：无法识别时回退到文本消息类型 1。
 */
static normalizeIncomingType(rawMessage = {}) {
  const parsedType = Number(rawMessage.type || rawMessage.chatType)
  if (parsedType >= 1 && parsedType <= 6) {
    return parsedType
  }
  return 1
}
```

这一步的意义不是“少写一个 if”，而是：

后面页面不再关心后端到底给的是哪一种字段名。

## 四、文件消息和位置消息为什么必须单独解析

因为它们和普通文本消息完全不是一种数据结构。

### 1. 文件类消息

文件类消息最常见的几种情况：

1. 已经是数组
2. 是 JSON 字符串
3. 直接就是 URL
4. 结构里字段名不统一

### 推荐模板：文件类解析

```js
/**
 * 解析文件类消息内容。
 * 用途：兼容 JSON 数组、单对象和直接 URL 三种常见格式。
 * 参数：content 为文件类消息原始内容。
 * 返回值：统一后的文件对象数组。
 * 边界行为：JSON 解析失败时会退化成把 content 当 URL 处理。
 */
static parseFileContent(content) {
  try {
    if (!content) return []

    if (Array.isArray(content)) {
      return content.map((file) => this.normalizeFileFields(file))
    }

    if (typeof content === 'string' && (content.startsWith('http://') || content.startsWith('https://'))) {
      return [{
        src: content,
        filePath: content,
        url: content,
      }]
    }

    const files = JSON.parse(content)

    if (!Array.isArray(files)) {
      return [this.normalizeFileFields(files)]
    }

    return files.map((file) => this.normalizeFileFields(file))
  } catch (error) {
    return [{
      src: content,
      filePath: content,
      url: content,
    }]
  }
}
```

### 2. 文件字段标准化为什么特别值钱

后端文件对象常见的不统一字段有：

1. `id`
2. `fileId`
3. `attachmentID`
4. `src`
5. `url`
6. `filePath`
7. `path`

所以你最好统一做一层：

```js
/**
 * 标准化文件对象字段。
 * 用途：统一不同后端返回结构里的 id、fileName、src、size 等字段。
 * 参数：file 为原始文件对象。
 * 返回值：标准化后的文件对象。
 * 边界行为：非对象输入时原样返回。
 */
static normalizeFileFields(file) {
  if (!file || typeof file !== 'object') return file

  return {
    id: file.id || file.fileId || file.attachmentID,
    fileName: file.fileName || file.name || file.filename,
    fileType: file.fileType || file.type || file.ext,
    fileSize: file.fileSize || file.size || 0,
    size: file.fileSize || file.size || 0,
    src: file.src || file.url || file.filePath || file.path,
    url: file.src || file.url || file.filePath || file.path,
    filePath: file.src || file.url || file.filePath || file.path,
    ...file,
  }
}
```

### 3. 位置消息也最好单独解

因为它通常是对象或者 JSON 字符串，和普通文本完全不一样。

```js
static parseLocationContent(content) {
  try {
    if (!content) return null
    if (typeof content === 'object') return content
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}
```

## 五、语音时长为什么最好从解析层统一提取

语音消息里最容易出现一个问题：

时长不一定就在顶层字段里。

有些接口会把它塞到：

1. `jsonInfo.duration`
2. 顶层 `duration`

所以这一步最好也集中做：

```js
/**
 * 提取语音时长。
 * 用途：优先从 jsonInfo 中读取 duration，其次读取顶层 duration。
 * 参数：rawMessage 为原始消息对象。
 * 返回值：Number，语音时长秒数。
 * 边界行为：解析失败时返回 0。
 */
static extractDuration(rawMessage) {
  if (rawMessage.jsonInfo) {
    try {
      const jsonInfo =
        typeof rawMessage.jsonInfo === 'string'
          ? JSON.parse(rawMessage.jsonInfo)
          : rawMessage.jsonInfo

      if (jsonInfo && jsonInfo.duration) {
        return jsonInfo.duration
      }
    } catch (e) {}
  }

  return rawMessage.duration || 0
}
```

## 六、为什么消息服务层不应该只是“转发一下”

很多人写 service 层时，会把它写得很薄：

1. 收消息
2. 直接 callback

但真正有复用价值的 service 层，至少还应该负责：

1. 订阅管理
2. 回调注册
3. 历史消息加载
4. 强制下线特殊消息
5. 本地缓存
6. 页面层统一消费入口

## 七、推荐模板：MessageService 的思路

```js
class MessageService {
  constructor(connectionManager) {
    this.connectionManager = connectionManager
    this.subscriptions = new Map()
    this.messageCallbacks = []
    this.forceOfflineCallbacks = []
  }

  /**
   * 处理私聊消息。
   * 用途：统一对原始消息做字段补齐、标准化解析、模板渲染和本地缓存，再广播给页面。
   * 参数：rawMessage 为原始消息；headers 为 STOMP 头。
   * 返回值：Promise<void>。
   * 边界行为：解析失败时直接跳过，不影响其他消息。
   */
  async onPrivateMessage(rawMessage, headers = {}) {
    const message = MessageParser.parseIncomingMessage(rawMessage)
    if (!message) return

    this._saveMessageToLocal(message)
    this._triggerMessageCallbacks(message)
  }

  /**
   * 注册消息回调。
   * 用途：页面层通过这个方法声明“有新消息时通知我”。
   * 参数：callback 为消息回调函数。
   * 返回值：无。
   * 边界行为：重复注册同一个函数时不会重复添加。
   */
  onMessage(callback) {
    if (typeof callback !== 'function') return
    if (this.messageCallbacks.includes(callback)) return
    this.messageCallbacks.push(callback)
  }

  /**
   * 移除消息回调。
   * 用途：页面卸载时取消监听，避免重复触发和内存泄漏。
   * 参数：callback 为消息回调函数。
   * 返回值：无。
   * 边界行为：不存在时直接返回。
   */
  offMessage(callback) {
    let index = this.messageCallbacks.indexOf(callback)
    while (index > -1) {
      this.messageCallbacks.splice(index, 1)
      index = this.messageCallbacks.indexOf(callback)
    }
  }

  _triggerMessageCallbacks(message) {
    this.messageCallbacks.forEach((callback) => {
      try {
        callback(message)
      } catch (error) {}
    })
  }
}
```

## 八、为什么页面层要“薄消费”

页面层最重要的原则就是：

`页面不要直接碰 WebSocket 协议细节。`

页面更适合拿到的是：

1. 已经解析好的消息对象
2. 已经标准化的连接状态
3. 已经封装好的发送方法

### 推荐页面用法

```js
let messageService = null

const initMessageService = () => {
  messageService = uni.$messageService

  if (!messageService) return

  messageService.onMessageReceived((message) => {
    console.log('收到消息', message)
  })
}
```

### 为什么这很重要

因为如果页面层还要自己知道：

1. STOMP frame
2. connection status
3. 重连次数
4. 文件消息怎么解析

那你这整套抽象就白做了。

## 九、这一层最容易踩的坑

1. 解析层只处理文本，不处理文件和位置
2. 后端字段名直接透给页面
3. 语音时长每个页面自己提
4. 页面直接监听 socket 原始消息
5. service 层没有统一回调注册和销毁
6. 文件字段不统一，页面预览一会儿看 `src` 一会儿看 `url`
7. 本地缓存、模板消息、特殊消息混在页面里处理

## 十、建议的接入顺序

如果你自己搭这一层，我建议顺序是：

1. 先定义前端统一消息对象结构
2. 再写 `parseIncomingMessage`
3. 再写文件 / 位置 / 语音时长等类型细分解析
4. 再写 MessageService 的回调注册与广播
5. 最后页面层只消费 service

## 十一、最后浓缩成一句话

如果只留一句结论，我会写：

`消息解析与服务层最值得沉淀的，不是“把消息显示出来”，而是“后端原始消息 -> 前端统一消息对象 -> 页面薄消费”这条稳定链路。`

## 参考资料

1. [MDN: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
2. [STOMP 1.2 官方规范](https://stomp.github.io/stomp-specification-1.2.html)
