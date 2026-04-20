// 历史消息归档。
// 每次清空 dailyChangeSummary.js 前，将当天的 items 逐条归档到这里。
// 推荐结构：
// 1. 以 date 为当天日期分组；
// 2. items 中每条都保留 time、title、summary；
// 3. content 可选，不写时默认沿用 summary。
export const historyNotifications = [
  {
    id: "history-2026-04-02",
    date: "2026-04-02",
    items: [
      {
        category: "功能更新",
        time: "16:10",
        title: "资料导出中心升级为双栏结构",
        summary: "支持单篇、整目录与多篇打包导出，导出入口更清晰。",
      },
      {
        category: "功能更新",
        time: "19:58",
        title: "站点头部接入消息通知中心",
        summary: "通知抽屉与详情弹窗上线，最近动态可以直接在站内查看。",
      },
      {
        category: "功能更新",
        time: "21:07",
        title: "历史消息归档能力接入通知中心",
        summary: "当日消息开始支持归档回看，旧摘要不会再随着次日清空而消失。",
      },
      {
        category: "功能更新",
        time: "21:12",
        title: "消息抽屉宽度调整到 520px",
        summary: "抽屉阅读区变宽，长标题和长摘要的浏览体验更稳定。",
      },
      {
        category: "问题修复",
        time: "23:55",
        title: "修复消息卡片纯英文内容溢出",
        summary: "长英文和长路径不再把消息卡片撑破，列表排版更稳。",
      },
      {
        category: "问题修复",
        time: "23:56",
        title: "修复卡片 hover 裁切与导出弹窗摘要溢出",
        summary: "修掉 hover 位移被裁切和导出弹窗右侧摘要溢出的问题。",
      },
    ],
  },
  {
    id: "history-2026-04-03",
    date: "2026-04-03",
    items: [
      {
        category: "内容上新",
        time: "23:19",
        title: "休闲模式升级为沉浸式频道页",
        summary:
          "休闲模式从旧版按钮堆叠页改成带 Hero、节奏提示和频道切换卡片的沉浸式布局，整体更像轻杂志式的情绪补给页。",
      },
      {
        category: "内容上新",
        time: "23:19",
        title: "补齐休闲模式三种视图的真实布局切换",
        summary:
          "把原先几乎没有视觉差异的网格、长卡、拼贴三种视图补成真实布局效果，不再只是切换按钮文案。",
      },
      {
        category: "内容上新",
        time: "21:10",
        title: "站点品牌图标改为新版灯泡 Logo",
        summary:
          "浏览器页签图标与站内左上角品牌标识统一切换为新版灯泡图标，站点识别度更高。",
      },
      {
        category: "内容上新",
        time: "21:18",
        title: "新增 uni-app 通用基础专题",
        summary:
          '在 uni-app 目录下新增"通用基础"子专题，先把跨端共性知识从微信小程序系列里抽离出来。',
      },
      {
        category: "内容上新",
        time: "21:32",
        title: "补齐 4 篇 uni-app 基础笔记",
        summary:
          "新增跨端编译与平台边界、应用与页面生命周期、工程结构与配置、路由请求缓存上传下载与条件编译 4 篇基础稿。",
      },
      {
        category: "内容上新",
        time: "21:44",
        title: "重构 uni-app 微信篇阅读分工",
        summary:
          '为微信小程序目录里的 8 篇文章补上"建议先读"引导，明确哪些共性知识应先回到通用基础专题学习。',
      },
      {
        category: "内容上新",
        time: "21:58",
        title: "补强微信小程序系列代码讲解",
        summary:
          "针对登录、手机号、上传下载、支付、web-view、性能优化、组件通信等关键示例补充逐段代码说明。",
      },
      {
        category: "内容上新",
        time: "22:05",
        title: "uni-app 分类页改为专题分区展示",
        summary:
          '为 uni-app 专题增加"通用基础 / 微信小程序"分区导读与专题入口，不再只按一整页平铺卡片展示。',
      },
      {
        category: "内容上新",
        time: "22:11",
        title: "笔记详情页补上专题导航与顺序跳转",
        summary:
          "详情页新增同专题导航、系列切换与更贴合专题顺序的上一篇下一篇跳转，卡片标题也改用 frontmatter 标题展示。",
      },
      {
        category: "内容上新",
        time: "22:16",
        title: "新增 uv-ui 入门安装与小程序配置专题",
        summary:
          "围绕 uv-ui 的安装方式、扩展配置、主题样式和微信小程序常见踩坑补齐一篇起步资料。",
      },
      {
        category: "内容上新",
        time: "22:22",
        title: "重写 uv-ui 请求使用指南",
        summary:
          "把原来 uv-ui 请求笔记升级为更贴近实战的小程序请求封装方案，补齐拦截器、上传下载、custom 参数和常见坑。",
      },
      {
        category: "内容上新",
        time: "22:36",
        title: "根目录入口改为完整根目录导航",
        summary:
          "首页与搜索面板的根目录入口不再按篇数截断，改为按真实顶层目录顺序展示，和左侧知识目录保持一致。",
      },
    ],
  },
  {
    id: "history-2026-04-11",
    date: "2026-04-11",
    items: [
      {
        category: "内容上新",
        time: "10:00",
        title: "新增 6 篇 Kiro 系列笔记",
        summary: "完整覆盖 Kiro 快速上手、Specs 规格系统、Steering 上下文管理、Hooks 自动化、MCP 集成与工作流实战，每篇均含 frontmatter、目录导航与参考资料。",
      },
      {
        category: "内容上新",
        time: "10:00",
        title: "更新 Kiro 目录文件",
        summary: "目录文件重写为推荐阅读顺序 + 覆盖主题 + 快速查找三区块结构，方便按需跳转。",
      },
      {
        category: "内容上新",
        time: "11:00",
        title: "新增 Agent Skills 系列笔记共 4 篇",
        summary: "系统整理 Agent Skills 开放标准，涵盖各工具兼容性对比、高级用法、场景模板与团队协作，经官方文档多轮核实。",
      },
      {
        category: "内容上新",
        time: "14:00",
        title: "新增《AI 工具规则文档》系列笔记共 5 篇",
        summary: "独立新建 Rules 文件夹，系统介绍 AGENTS.md 开放标准、CLAUDE.md 记忆系统、Cursor/Windsurf/Kiro 规则文档、Gemini CLI 与 GitHub Copilot 指令文件，搜索资料后详细撰写。",
      },
    ],
  },
  {
    id: "history-2026-04-12",
    date: "2026-04-12",
    items: [
      {
        category: "功能更新",
        time: "22:02",
        title: "4 月 12 日站点结构与内容整理归档",
        summary: "当天完成电脑专题扩展、分类页目录导读、详情页导航裁切修复和笔记顺序接管等一组整理，已从当日摘要转入历史消息。",
        content: "归档 2026-04-12 的站点变更摘要，涵盖电脑专题内容补充、旧网络与代理内容迁移、frontmatter order 排序接管、分类页目录导读增强，以及文章详情页顶部导航文字裁切修复，方便后续在通知中心按历史消息继续追溯。",
      },
    ],
  },
  {
    id: "history-2026-04-14",
    date: "2026-04-14",
    items: [
      {
        category: "问题修复",
        time: "21:24",
        title: "修复移动端阅读页滚动与定位体验",
        summary: "文章详情页在手机视图下改为更稳定的滚动容器方案，阅读进度、目录高亮、返回顶部和阅读位置恢复都会跟随真实滚动区域工作。",
        content: "归档 2026-04-14 的问题修复摘要：文章详情页改为更稳定的移动端滚动容器方案，阅读进度、目录高亮、返回顶部和阅读位置恢复都跟随真实滚动区域工作，避免内容截断和定位异常。",
      },
      {
        category: "内容上新",
        time: "23:04",
        title: "将 Cursor 专题重构为 8 篇官方主线文章",
        summary: "AI 工具目录下的 Cursor 专题已从 28 篇细分稿压缩为 8 篇主线文章，目录、搜索索引与阅读顺序同步切到新的能力分组结构。",
        content: "归档 2026-04-14 的内容上新摘要：Cursor 专题重构为 8 篇主线文章，围绕安装迁移、核心交互、上下文治理、本地工作流、协作自动化、工具权限、团队治理和数据科学排障重新组织阅读结构。",
      },
      {
        category: "内容上新",
        time: "21:26",
        title: "上线 Windsurf 专题并扩展为 4 篇官方深挖内容",
        summary: "AI 工具目录下新增 Windsurf 专题，已经形成从入门总览、官方最新深拆、Code/Plan/Ask 模式分工到 Rules/AGENTS.md/Skills/Workflows 项目治理的连续阅读链路。",
        content: "归档 2026-04-14 的内容上新摘要：Windsurf 专题已形成从快速上手、官方文档深拆，到模式分工与项目治理实战的 4 篇连续文章，方便后续继续扩展到 MCP、Hooks、Terminal 和 Worktrees 方向。",
      },
    ],
  },
  {
    id: "history-2026-04-15",
    date: "2026-04-15",
    items: [
      {
        category: "内容上新",
        time: "16:18",
        title: "uni-app 人脸摄像机封装专题升级为长教程版",
        summary: "把原先偏提纲式的人脸摄像机文章重写为更细的长教程，完整补齐能力边界、分层思路、工具函数模板、页面骨架、业务套法、接入顺序和排障方法。",
        content: "归档 2026-04-15 的内容上新摘要：将 uni-app 人脸摄像机封装专题从简版说明升级为可长期复用的长教程版本，补齐为什么人脸页容易写乱、相机能力层/图片处理层/权限处理层/识别流程层/业务适配层的拆分思路，以及 useCamera.js、faceImage.js、facePermission.js、useFaceCaptureFlow.js 与完整页面骨架的详细讲解。",
      }
    ]
  },
  {
    id: "history-2026-04-16",
    date: "2026-04-16",
    items: [
      {
        category: "内容上新",
        time: "10:12",
        title: "新增“项目复用技术”分类并迁移首篇文章",
        summary: "博客新增独立的“项目复用技术”文件夹，用来专门沉淀那些可以从项目中抽出来、后续继续封装复用的技术文章，首篇已迁移为 uni-app 人脸摄像机封装专题。",
        content: "归档 2026-04-16 的内容上新摘要：博客新增独立的“项目复用技术”文件夹，用来专门沉淀那些可以从项目中抽出来、后续继续封装复用的技术文章，首篇已迁移为 uni-app 人脸摄像机封装专题。"
      },
      {
        category: "内容上新",
        time: "11:08",
        title: "新增 uni-app 语音输入与语音转文字封装专题",
        summary: "项目复用技术目录下新增第 2 篇 uni-app 文章，系统整理按住说话、上滑取消、H5 录音兼容、语音转文字接口接入与自动发送链路的可复用方案。",
        content: "归档 2026-04-16 的内容上新摘要：项目复用技术目录下新增第 2 篇 uni-app 文章，系统整理按住说话、上滑取消、H5 录音兼容、语音转文字接口接入与自动发送链路的可复用方案。"
      },
      {
        category: "问题修复",
        time: "11:24",
        title: "补齐项目复用技术文章中的 JSDoc 注释",
        summary: "为项目复用技术目录下的 uni-app 人脸摄像机封装和语音输入封装两篇文章补上 JSDoc 风格注释，让导出函数、关键方法、参数、返回值和边界行为更清楚。",
        content: "归档 2026-04-16 的问题修复摘要：为项目复用技术目录下的 uni-app 人脸摄像机封装和语音输入封装两篇文章补上 JSDoc 风格注释，让导出函数、关键方法、参数、返回值和边界行为更清楚。"
      },
      {
        category: "内容上新",
        time: "11:43",
        title: "新增 uni-app 附件上传与智能预览封装专题",
        summary: "基于最值得复用的一组能力，新增一篇附件上传与预览专题，系统整理图片、文件、视频上传、智能预览分流、文件大小格式化和文件图标映射的统一封装思路。",
        content: "归档 2026-04-16 的内容上新摘要：新增一篇附件上传与预览专题，系统整理图片、文件、视频上传、智能预览分流、文件大小格式化和文件图标映射的统一封装思路。"
      },
      {
        category: "内容上新",
        time: "12:02",
        title: "新增 uni-app 自定义 tabBar 与角标同步封装专题",
        summary: "基于 tabBar 配置、角标同步和安全区适配方案，新补一篇专门整理多角色入口、badge 刷新和底部安全区统一计算的复用文章。",
        content: "归档 2026-04-16 的内容上新摘要：新增一篇专门整理多角色入口、badge 刷新和底部安全区统一计算的 uni-app 复用文章。"
      },
      {
        category: "问题修复",
        time: "12:19",
        title: "将项目复用技术文章改为脱离来源上下文的手册风格",
        summary: "把项目复用技术目录下的 uni-app 文章继续去来源化，移除对具体工具文件和来源项目的依赖表述，调整成看完就能直接套用的通用手册风格。",
        content: "归档 2026-04-16 的问题修复摘要：把项目复用技术目录下的 uni-app 文章继续去来源化，移除对具体工具文件和来源项目的依赖表述，调整成看完就能直接套用的通用手册风格。"
      },
      {
        category: "内容上新",
        time: "12:41",
        title: "新增 uni-app WebSocket 与 STOMP 封装专题",
        summary: "项目复用技术目录下新增第 5 篇 uni-app 文章，系统整理 WebSocket 与 STOMP 的协议常量、帧处理、连接管理、自动重连、消息解析与页面消费方式。",
        content: "归档 2026-04-16 的内容上新摘要：项目复用技术目录下新增第 5 篇 uni-app 文章，系统整理 WebSocket 与 STOMP 的协议常量、帧处理、连接管理、自动重连、消息解析与页面消费方式。"
      },
      {
        category: "问题修复",
        time: "12:52",
        title: "继续收敛复用文章中的来源项目痕迹",
        summary: "把项目复用技术目录下的现有 uni-app 文章进一步改成纯手册口吻，去掉来源工具文件和来源项目依赖，让文章单独存在时也能直接照着用。",
        content: "归档 2026-04-16 的问题修复摘要：把项目复用技术目录下的现有 uni-app 文章进一步改成纯手册口吻，去掉来源工具文件和来源项目依赖，让文章单独存在时也能直接照着用。"
      },
      {
        category: "内容上新",
        time: "13:06",
        title: "把 WebSocket 能力拆成专题文件夹逐篇沉淀",
        summary: "项目复用技术目录下为 WebSocket 单独建立专题文件夹，不再只保留一篇总览，而是按 STOMP 帧、客户端、连接管理、消息解析与服务层继续拆成可逐篇照着搭的文档。",
        content: "归档 2026-04-16 的内容上新摘要：项目复用技术目录下为 WebSocket 单独建立专题文件夹，不再只保留一篇总览，而是按 STOMP 帧、客户端、连接管理、消息解析与服务层继续拆成可逐篇照着搭的文档。"
      },
      {
        category: "内容上新",
        time: "13:18",
        title: "补齐 WebSocket 专题的适配器篇与目录页",
        summary: "继续扩展 WebSocket 专题，新增 MessageServiceAdapter 与页面接入文章，并补了一篇专题目录页，把整组文档串成清晰阅读顺序。",
        content: "归档 2026-04-16 的内容上新摘要：继续扩展 WebSocket 专题，新增 MessageServiceAdapter 与页面接入文章，并补了一篇专题目录页，把整组文档串成清晰阅读顺序。"
      },
      {
        category: "内容上新",
        time: "13:32",
        title: "新增 WebSocket 接入检查清单篇",
        summary: "WebSocket 专题继续补齐第 7 篇落地清单，从后端协议确认、目录搭建、STOMP 帧联调、连接重连、消息解析到页面接入逐项列出验收点。",
        content: "归档 2026-04-16 的内容上新摘要：WebSocket 专题继续补齐第 7 篇落地清单，从后端协议确认、目录搭建、STOMP 帧联调、连接重连、消息解析到页面接入逐项列出验收点。"
      },
      {
        category: "问题修复",
        time: "13:49",
        title: "将 WebSocket 专题改成跨端通用写法",
        summary: "把 WebSocket 专题从“偏 uni-app 视角”继续收敛成“跨端核心 + 运行时适配”的写法，并补充字段映射可配置、PC Vue 挂载方式和运行时差异说明。",
        content: "归档 2026-04-16 的问题修复摘要：把 WebSocket 专题从“偏 uni-app 视角”继续收敛成“跨端核心 + 运行时适配”的写法，并补充字段映射可配置、PC Vue 挂载方式和运行时差异说明。"
      },
      {
        category: "内容上新",
        time: "13:56",
        title: "新增 WebSocket 跨运行时适配篇",
        summary: "WebSocket 专题新增第 8 篇，专门讲 uni-app 与 PC Vue 如何共用核心层，只替换底层 socket adapter 和服务挂载方式。",
        content: "归档 2026-04-16 的内容上新摘要：WebSocket 专题新增第 8 篇，专门讲 uni-app 与 PC Vue 如何共用核心层，只替换底层 socket adapter 和服务挂载方式。"
      },
      {
        category: "问题修复",
        time: "21:22",
        title: "增强 WebSocket 专题中的 STOMP 规范表述",
        summary: "把 WebSocket 专题从“项目经验口吻”进一步收紧到“项目级实现 + 明确规范边界”的写法，补齐 heart-beat 协商、header 转义、content-length 和 WebSocket message 边界说明。",
        content: "归档 2026-04-16 的问题修复摘要：把 WebSocket 专题从“项目经验口吻”进一步收紧到“项目级实现 + 明确规范边界”的写法，补齐 heart-beat 协商、header 转义、content-length 和 WebSocket message 边界说明。"
      },
      {
        category: "问题修复",
        time: "21:22",
        title: "收紧 WebSocket 客户端与消息解析模板的一致性",
        summary: "同步调整 StompClient 与 MessageParser 两篇文章，让心跳协商、消息缓冲和字段映射可配置真正落到代码模板里，不再只停留在正文说明。",
        content: "归档 2026-04-16 的问题修复摘要：同步调整 StompClient 与 MessageParser 两篇文章，让心跳协商、消息缓冲和字段映射可配置真正落到代码模板里，不再只停留在正文说明。"
      }
    ]
  },
  {
    id: 'history-2026-04-17',
    date: '2026-04-17',
    items: [
      {
        category: '内容上新',
        time: '23:59',
        title: '4 月 17 日网络基础短文批量上新归档',
        summary: '归档当天围绕常用缺易忘网络目录补齐的一组高频短文，涵盖登录态、跨域、安全、缓存、状态码、上传下载与请求治理等主题。',
        content: '归档 2026-04-17 的历史消息摘要：当天主要围绕 public/notes/常用缺易忘/开发的基础知识/网络 补齐一组高频短文，覆盖 Cookie/Session/JWT、CORS/CSRF/SameSite、Access Token/Refresh Token、AbortController、OAuth2、预签名上传、分片上传、缓存协商、状态码差异、实时通信与请求治理等主题，并同步刷新了站内索引与通知数据。'
      }
    ]
  },
  {
    id: 'history-2026-04-18-early',
    date: '2026-04-18',
    items: [
      {
        category: '问题修复',
        time: '15:24',
        title: '网络基础笔记收敛为两篇前端手册',
        summary: '将原本零散拆开的状态码、缓存、跨域、认证、上传下载、实时通信与请求治理短文，按前端联调视角重构为两篇主文，阅读路径更集中。',
      },
      {
        category: '问题修复',
        time: '15:25',
        title: '清理网络目录里的重复碎片稿',
        summary: '删除同主题的多篇短文，减少目录噪音和搜索重复结果，让常用缺易忘的网络目录更适合前端复习与联调排障。',
      },
      {
        category: '功能更新',
        time: '15:26',
        title: '同步刷新笔记索引与通知数据',
        summary: '根据新的笔记结构重建 notes 索引和通知数据，确保首页、搜索、分类页与通知中心都反映这次网络专题重构。',
      }
    ]
  },
  {
    id: 'history-2026-04-18',
    date: '2026-04-18',
    items: [
      {
        category: '内容上新',
        time: '18:00',
        title: 'Node.js 从零到实战系列 8 篇全部完结',
        summary: '新增第八篇《接口开发与会话控制》，至此 8 篇全部完成，覆盖 Buffer、fs、HTTP、模块化、npm、Express、MongoDB、RESTful 接口与 JWT 认证完整链路。',
        content: '新增第八篇，内容涵盖 RESTful 设计规范、apipost 测试工具、Cookie/Session/JWT 三种会话控制方案、bcrypt 密码加密、express-validator 参数校验、express-rate-limit 限流、helmet 安全头，以及完整的用户注册登录实战代码。',
      },
      {
        category: '内容上新',
        time: '18:37',
        title: 'Node.js 系列 8 篇深度升级：废弃标记 + 参数说明 + 最新特性',
        summary: '逐篇核查官方文档，标记废弃 API、补全函数参数说明、新增 Node.js 22+ 新特性和 Mongoose 9 变更，确保内容与当前最新版本一致。',
        content: '核查要点：① 废弃标记：buf.slice() 改 subarray()、fs.rmdir recursive 改 fs.rm()、Mongoose 9 pre 中间件不再接收 next()、Express 5 移除 res.json(status,obj) 等；② 参数补全：fs.readFile/writeFile/rm/createReadStream、http.createServer/listen、res.cookie、jwt.sign/verify 等所有主要函数；③ 新特性：Node.js 22 内置 fetch（稳定）/WebSocket 客户端/node:test/SQLite（实验性）/TypeScript 直接运行（实验性）；④ npm 新增 exports 条件导出字段和 overrides 依赖覆盖字段。',
      }
    ]
  },
  {
    id: 'history-2026-04-19',
    date: '2026-04-19',
    items: [
      {
        category: '内容上新',
        time: '11:05',
        title: 'Node.js 第五篇补充包管理基础概念与纠错',
        summary: '为 npm 包管理与 nvm 版本管理篇新增"零、基础概念"章节，补充包/包管理工具/常用工具表格的定义说明，并纠正 exports 字段版本号、nvm-windows 不支持 .nvmrc、npm audit fix --force 风险等三处错误。',
        content: '第一点：新增零章节，包含包的定义（package = 一组特定功能的源码集合）、包管理工具的作用（下载/更新/删除/上传）及跨语言类比、前端常用工具对比表（npm/yarn/pnpm/cnpm）；第二点：纠错三处，exports 字段从"Node 12+"改为"Node 12.7+ 引入，12.17+ 稳定"，nvm-windows 明确标注不支持 .nvmrc 文件，npm audit fix --force 补充破坏性变更风险说明。',
      },
      {
        category: '内容上新',
        time: '12:51',
        title: 'Node.js 第六篇 Express 框架全解内容补充（第一轮）',
        summary: '补充 req 对象速查表、body-parser 历史说明、自定义 404 路由、ejs 独立使用示例、nodemon 提示，并修复章节编号缺失问题，章节从一到十连续完整。',
        content: '第一点：新增七、req 对象常用属性速查（method/url/params/query/body/headers/cookies 等）；第二点：2.3 节补充 body-parser 历史说明（Express 4.16+ 已内置，老项目了解即可）；第三点：2.5 节新增自定义 404 路由（app.all 通配符用法及 Express 5 写法变化）；第四点：5.4 节新增 ejs 独立使用示例（ejs.render / ejs.renderFile）；第五点：1.1 节补充 nodemon 开发启动提示；第六点：修复三、中间件机制和六、express-generator 脚手架的章节标题丢失问题，修正重复的"八"和跳号的"十一"，章节编号现为一至十连续。',
      },
      {
        category: '内容上新',
        time: '13:10',
        title: 'Node.js 第六篇 Express 框架全解补充概念解释与代码讲解（第二、三轮）',
        summary: '针对零基础学习者，在每个核心章节前补充"是什么、为什么"的概念解释，并对所有核心代码块逐行补充注释和说明。',
        content: '第一点：新增概念节，包括 Express 框架定义、路由概念与匹配过程、路由参数三种类型对比、中间件概念与洋葱模型、静态资源定义、模板引擎原理与 SSR/CSR 对比、req/res 对象说明、分层架构职责表；第二点：代码讲解补充，包括 app 创建流程、HTTP 方法语义、urlencoded 参数含义、next() 不调用的后果、return 的必要性、err.status 含义、cors/morgan 工作原理、app.set 配置项说明、生产级 app.js 和 errorHandler 逐行解释。',
      },
      {
        category: '内容上新',
        time: '17:55',
        title: 'Node.js 第七篇 MongoDB 数据库实战补充图形化工具章节',
        summary: '根据参考资料，在第七篇末尾新增"图形化管理工具"章节，介绍 MongoDB Compass、Robo 3T、Navicat 三款工具，并在小结表格中补充对应条目。',
        content: '第一点：新增十一章节"图形化管理工具"，包含三款工具对比表（Compass 官方免费/Robo 3T 免费/Navicat 收费）及 Compass 连接步骤说明，并附实战提醒（Aggregation Pipeline Builder 调试聚合管道效率高）；第二点：小结表格新增"图形化工具"行；第三点：原章节"十一、小结"顺延为"十二、小结"。',
      },
    ],
  },
];
