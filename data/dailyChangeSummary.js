// 这里只保留“当天”的消息摘要。
// 主人说“汇总消息”时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-16',
  items: [
    {
      category: '内容上新',
      time: '10:12',
      title: '新增“项目复用技术”分类并迁移首篇文章',
      summary: '博客新增独立的“项目复用技术”文件夹，用来专门沉淀那些可以从项目中抽出来、后续继续封装复用的技术文章，首篇已迁移为 uni-app 人脸摄像机封装专题。',
      content: '今天在 public/notes 下新增了“项目复用技术/uni-app”分类，并将原先放在 uni-app 微信小程序目录里的人脸摄像机封装文章迁移过去，文件名调整为更适合新分类长期扩展的 01 开头形式；同时将文章 frontmatter 和开头说明改为“项目复用技术”语义，让后续从不同项目中抽出来的可封装能力都能统一沉淀到这个专门目录下。'
    },
    {
      category: '内容上新',
      time: '11:08',
      title: '新增 uni-app 语音输入与语音转文字封装专题',
      summary: '项目复用技术目录下新增第 2 篇 uni-app 文章，系统整理按住说话、上滑取消、H5 录音兼容、语音转文字接口接入与自动发送链路的可复用方案。',
      content: '今天在 public/notes/项目复用技术/uni-app 下新增了第 2 篇文章，围绕语音输入功能沉淀一套长期可复用的技术方案：从录音为什么容易写乱讲起，补齐非 H5 使用 uni.getRecorderManager、H5 使用 getUserMedia + MediaRecorder 的平台分流思路，整理 voicePermission、录音能力层、语音转文字接口层、交互层与文本发送链路复用的拆分方式，并给出可直接起步的模板代码、交互状态设计、接入顺序与常见排障清单。'
    },
    {
      category: '问题修复',
      time: '11:24',
      title: '补齐项目复用技术文章中的 JSDoc 注释',
      summary: '为项目复用技术目录下的 uni-app 人脸摄像机封装和语音输入封装两篇文章补上 JSDoc 风格注释，让导出函数、关键方法、参数、返回值和边界行为更清楚。',
      content: '今天继续完善 public/notes/项目复用技术/uni-app 目录下的两篇模板文章，给 useCamera.js、faceImage.js、facePermission.js、useFaceCaptureFlow.js，以及 useVoiceRecorder、voicePermission、speech 上传层、按住说话与上滑取消等关键代码示例统一补上 JSDoc 注释。这样后续从博客里直接复制这些模板到其他项目时，函数用途、参数含义、返回值结构和边界行为都会更容易看懂，也更符合“可复用技术沉淀”的目标。'
    },
    {
      category: '内容上新',
      time: '11:43',
      title: '新增 uni-app 附件上传与智能预览封装专题',
      summary: '基于 util/tools.js 里最值得复用的一组能力，新增一篇附件上传与预览专题，系统整理图片、文件、视频上传、智能预览分流、文件大小格式化和文件图标映射的统一封装思路。',
      content: '今天继续从 util/tools.js 提炼可沉淀的项目复用能力，在 public/notes/项目复用技术/uni-app 下新增了第 3 篇文章，主题聚焦“附件上传与智能预览封装”。文章没有直接复述具体项目代码，而是把 uploadImageFile、uploadVideo、previewAttachment、formatFileSize、isImage、getFileIconName 这一组能力抽象成通用方案，重点讲清上传统一返回结构、图片/文档/本地文件的预览分流、失败兜底、文件展示信息工具，以及哪些工具适合单独成篇、哪些不值得优先单独沉淀。'
    },
    {
      category: '内容上新',
      time: '12:02',
      title: '新增 uni-app 自定义 tabBar 与角标同步封装专题',
      summary: '基于 tabBarConfig.js、tabBarBadge.js 和 safeArea.js，新补一篇 tabBar 配置、角标同步和安全区适配的复用文章，专门整理多角色入口、badge 刷新和底部安全区统一计算方案。',
      content: '今天继续从 util 目录里提炼可沉淀方案，在 public/notes/项目复用技术/uni-app 下新增了第 4 篇文章，主题聚焦“自定义 tabBar 与角标同步封装”。文章把 tabBarConfig.js、tabBarBadge.js、safeArea.js 这三块能力组合起来，系统讲清角色化 tab 配置、页面路径归一化、全局 badge 事件同步、原生 tabBar 与自定义 tabBar 角标校准、底部安全区统一计算，以及哪些坑最容易在多角色门户和校园类项目里反复出现。'
    },
    {
      category: '问题修复',
      time: '12:19',
      title: '将项目复用技术文章改为脱离来源上下文的手册风格',
      summary: '把项目复用技术目录下的 uni-app 文章继续去来源化，移除对具体工具文件和来源项目的依赖表述，调整成看完就能直接套用的通用手册风格。',
      content: '今天继续整理 public/notes/项目复用技术/uni-app 目录下的复用文章，将还残留的来源上下文表述进一步收口。重点把附件上传与智能预览、自定义 tabBar 与角标同步两篇文章中对 tools.js、tabBarConfig.js、tabBarBadge.js、safeArea.js 等来源文件的描述改成纯能力导向写法，同时把示例路径和模块名调整为更通用的形式，让这些笔记在脱离原始项目后也能单独阅读、单独复制、单独落地。'
    },
    {
      category: '内容上新',
      time: '12:41',
      title: '新增 uni-app WebSocket 与 STOMP 封装专题',
      summary: '项目复用技术目录下新增第 5 篇 uni-app 文章，系统整理 WebSocket 与 STOMP 的协议常量、帧处理、连接管理、自动重连、消息解析与页面消费方式。',
      content: '今天继续围绕实时通信能力沉淀可直接复用的通用方案，在 public/notes/项目复用技术/uni-app 下新增了第 5 篇文章，主题聚焦“WebSocket 与 STOMP 封装”。文章按协议常量、STOMP 帧构建与拆帧、底层客户端、连接管理、自动重连、订阅恢复、消息标准化和页面薄消费这几层来讲，不依赖具体来源项目路径，重点沉淀一套适合聊天、通知、在线状态、实时提醒等场景直接照着搭的实时通信模板。'
    },
    {
      category: '问题修复',
      time: '12:52',
      title: '继续收敛复用文章中的来源项目痕迹',
      summary: '把项目复用技术目录下的现有 uni-app 文章进一步改成纯手册口吻，去掉来源工具文件和来源项目依赖，让文章单独存在时也能直接照着用。',
      content: '今天继续整理 public/notes/项目复用技术/uni-app 目录下的现有文章，把“附件上传与智能预览”“自定义 tabBar 与角标同步”等文章里对来源工具文件和来源项目的依赖表述再往下收一层，同时把示例路径、模块名和开头说明进一步通用化，让这些文章在不依赖任何上下文的情况下也能作为独立手册直接使用。'
    },
    {
      category: '内容上新',
      time: '13:06',
      title: '把 WebSocket 能力拆成专题文件夹逐篇沉淀',
      summary: '项目复用技术目录下为 WebSocket 单独建立专题文件夹，不再只保留一篇总览，而是按 STOMP 帧、客户端、连接管理、消息解析与服务层继续拆成可逐篇照着搭的文档。',
      content: '今天将 uni-app 的 WebSocket 相关沉淀升级成一个可持续扩展的专题目录，在 public/notes/项目复用技术/uni-app/WebSocket 下补齐专题结构：把原本的总览文章移入专题作为第 1 篇，并新增 STOMP 帧封装、StompClient 客户端、连接管理与自动重连、消息解析与服务层 4 个分篇。这样后面在别的项目里接入 WebSocket / STOMP 时，不需要一次性啃完一篇大文，而可以按“协议层 -> 客户端 -> 重连管理 -> 消息服务”逐步研究、逐步模仿、逐步照着搭。'
    },
    {
      category: '内容上新',
      time: '13:18',
      title: '补齐 WebSocket 专题的适配器篇与目录页',
      summary: '继续扩展 WebSocket 专题，新增 MessageServiceAdapter 与页面接入文章，并补了一篇专题目录页，把整组文档串成清晰阅读顺序。',
      content: '今天继续完善 public/notes/项目复用技术/uni-app/WebSocket 专题，新增了第 6 篇 “MessageServiceAdapter 与页面接入实战”，专门讲如何把 ConnectionManager、MessageService 和页面层桥接成统一入口；同时新增目录页，把总览、STOMP 帧、客户端、连接管理、消息解析与服务层、页面接入这几篇串成完整阅读顺序，方便后续在其他项目里直接按专题路径逐步搭建。'
    }
  ]
}
