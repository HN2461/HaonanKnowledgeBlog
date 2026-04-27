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
  {
    id: 'history-2026-04-20',
    date: '2026-04-20',
    items: [
      {
        category: '内容上新',
        time: '20:42',
        title: '新增 Fetch API 避坑指南',
        summary: '整理主人的 Fetch API 学习笔记，完善格式与内容后发布到"常用缺易忘/开发的基础知识/网络"目录，补充 AbortSignal.timeout() 新 API、超时控制两种方案、主动取消请求和通用封装模板。',
        content: '第一点：新增文章 Fetch API 避坑指南，放置于 public/notes/常用缺易忘/开发的基础知识/网络 目录；第二点：内容包含核心特点速览与两种请求写法（GET/POST）；第三点：response.ok vs response.status 区别详解；第四点：HTTP 状态码与业务 code 两套规则对比表；第五点：超时控制两种方案（AbortSignal.timeout() 新 API + AbortController 兼容方案）；第六点：主动取消请求用法与通用封装函数（含超时降级逻辑）；第七点：常见疑问解答与五条避坑核心原则。',
      },
      {
        category: '内容上新',
        time: '21:21',
        title: '新增前端代码混淆接入实施记录',
        summary: '整理 Vue 3 + Vue CLI 5 + Webpack 5 项目接入 webpack-obfuscator 的完整实战记录，含原理解析、踩坑六大坑、多框架适配方案及验证脚本，发布到"项目复用技术/前端工程化与安全"目录。',
        content: '第一点：新增文章前端代码混淆接入实施记录，放置于 public/notes/项目复用技术/前端工程化与安全 目录；第二点：内容包含 webpack-obfuscator 工作机制与执行阶段顺序；第三点：Vue CLI 配置加载时机（NODE_ENV 注入时序）；第四点：依赖版本对照表（Webpack 4/5/Vite）；第五点：vue.config.js 完整配置（obfuscatorOptions + obfuscatorExcludes）；第六点：六大踩坑记录（NODE_ENV 时序、glob 路径前缀、selfDefending 冲突等）；第七点：混淆强度 L0-L5 降级策略；第八点：多框架接入指南（Vue CLI 4/5、Vite、Next.js、Nuxt 3）；第九点：PowerShell/Bash/Node.js 三套验证脚本。',
      },
      {
        category: '功能更新',
        time: '21:49',
        title: '消息弹框优化：换行展示与高度限制',
        summary: '消息详情弹框内容改为逐条换行展示，同时限制弹框最大高度，内容过多时内部滚动，不再撑大弹框。',
        content: '第一点：修复 content 字段全角分号分隔的条目无法换行的问题；第二点：detailParagraphs 计算属性新增按「；」拆分逻辑，同时识别「内容包含：」前缀单独成行；第三点：弹框面板加入 max-height 限制（min(80vh, 640px)）；第四点：弹框内容区改为 overflow-y: auto，内容多时内部滚动；第五点：修复 content 路径末尾斜杠紧跟句号导致视觉异常的问题。',
      },
      {
        category: '功能更新',
        time: '23:18',
        title: '通知中心配色方案升级：活泼主题色系',
        summary: '为六种分类标签重新设计配色方案，采用更鲜明活泼的主题色系，全部 tab 改用深灰黑中性色，历史消息改用紫粉色与全部明显区分，整体视觉辨识度大幅提升。',
        content: '第一点：六种分类标签配色升级（内容上新薄荷绿 #10b981、功能更新天蓝 #0ea5e9、问题修复琥珀橙 #f59e0b、系统公告玫瑰红 #f43f5e、历史消息紫粉 #a855f7、Git 提交青橙 #f97316）；第二点：全部 tab 改用深灰黑中性色（#374151），避免与功能更新蓝色撞色；第三点：顶部筛选 tab 未激活状态带淡色提示，激活后边框加粗、背景加深、字重 800；第四点：标签边框统一加上 1px solid 增强视觉层次；第五点：深色模式配色同步调整为更亮的对应色系。',
      },
    ],
  },
  {
    id: 'history-2026-04-21',
    date: '2026-04-21',
    items: [
      {
        category: '内容上新',
        time: '20:37',
        title: '钉钉与企业微信第三方登录系列文章全量上新',
        summary: '新增钉钉小程序、钉钉 H5 微应用、企业微信三大专题共 20 篇文章，涵盖迁移方案选型、能力速查清单、编译链路接入、双链路登录实现、常见误区核验、企业微信 JSSDK 接入等核心主题，并为钉钉和企业微信目录各新增一篇阅读指南。',
        content: '第一点：钉钉小程序新增 6 篇（技术选型与分阶段改造方案、能力速查与适配清单、编译链路配置与首次报错处理、阅读指南，以及原有的迁移超详细指南、实战改造清单、wx替换清单、ID速查、微信能力对照、PC扫码登录方案共 10 篇完整覆盖）；第二点：钉钉 H5 微应用新增 3 篇（从部署到登录跑通全流程、双链路登录完整实现-JSAPI免登与OAuth授权、登录常见误区与官方规则核验，加上原有的从0到1开发指南、扫一扫JSAPI对接清单、uni-app适配模板共 6 篇）；第三点：企业微信新增 8 篇（开发从0到1、常见ID速查、小程序登录接入方案、JSSDK接入签名流程、网页授权登录PC扫码、H5微应用从0到1、uni-app编译H5接入、阅读指南）；第四点：第三方登录对比目录新增钉钉与企业微信登录实现笔记 1 篇；第五点：generateNotesIndex.js 修复 README.md 被误收录为文章的问题，改为阅读指南文章形式正常展示。',
      },
      {
        category: '内容上新',
        time: '21:09',
        title: 'MongoDB 详解系列 7 篇全量上新',
        summary: '在 Node.js 目录下新建 MongoDB详解 文件夹，将原第七篇拆分并大幅扩充为 7 篇从0到1的细讲文章，覆盖安装概念、原生CRUD、Mongoose建模、CRUD与中间件、关联查询与聚合管道、索引优化与事务、完整项目实战。',
        content: '第一点：第一篇——MongoDB安装与基础概念，含文档型数据库原理、与MySQL对比、ObjectId解析、Windows/Mac/Linux安装步骤、mongosh基础操作；第二点：第二篇——MongoDB原生CRUD操作，含insertOne/insertMany、find全套查询操作符（$gt/$in/$regex/$or等）、updateOne/updateMany及所有更新操作符（$set/$inc/$push/$pull等）、deleteOne/deleteMany，附综合练习题；第三点：第三篇——Mongoose连接与Schema建模，含连接配置、所有数据类型详解（String/Number/ObjectId/Array/Map等）、校验规则（required/min/max/enum/validate）、字符串转换、Schema选项、虚拟字段；第四点：第四篇——Mongoose CRUD与中间件，含create/find/findById/findByIdAndUpdate/delete全套API、链式查询、lean优化、pre save密码加密、pre find软删除过滤、实例方法与静态方法；第五点：第五篇——关联查询与聚合管道，含populate基础/选字段/配置对象/多级嵌套、aggregate全套阶段（$match/$group/$sort/$project/$lookup/$unwind/$facet）、分页+总数一次查询、标签热度统计等实战场景；第六点：第六篇——索引优化与事务，含explain执行计划、单字段/复合/文本/TTL/稀疏/部分索引、最左前缀原则、事务基本写法与withTransaction简洁写法、转账和库存扣减实战；第七点：第七篇——完整项目实战，从零搭建 Express+MongoDB 笔记管理API，含用户注册登录（bcrypt+JWT）、笔记CRUD、分页搜索、软删除自动过滤，串联所有知识点。',
      },
      {
        category: '内容上新',
        time: '21:26',
        title: '接口与会话控制详解系列 7 篇全量上新',
        summary: '在 Node.js 目录下新建 接口与会话控制详解 文件夹，将原第八篇拆分并大幅扩充为 7 篇从0到1的细讲文章，覆盖 RESTful 规范、Apipost 测试、Cookie、Session、JWT、密码安全与接口防护、完整认证系统实战。',
        content: '第一点：第一篇——RESTful接口设计规范；第二点：第二篇——Apipost接口测试工具；第三点：第三篇——Cookie原理与实战；第四点：第四篇——Session原理与实战；第五点：第五篇——JWT认证原理与实战；第六点：第六篇——密码安全与接口防护；第七点：第七篇——完整认证系统实战。',
      },
      {
        category: '功能更新',
        time: '21:35',
        title: 'Node.js 系列目录结构整理',
        summary: '删除第七、八篇概览文件，目录直接指向 MongoDB详解 和 接口与会话控制详解 两个子文件夹，结构更清晰。',
        content: '第一点：删除 第七篇_MongoDB数据库实战_2026-04.md 和 第八篇_接口开发与会话控制_2026-04.md 两个已被详解文件夹替代的概览文件；第二点：更新 Node.js/目录.md，第七、八篇入口直接指向各自详解系列的目录页；第三点：重新生成 notes-index.json，总笔记数 307 篇。',
      },
    ],
  },
  {
    id: 'history-2026-04-22',
    date: '2026-04-22',
    items: [
      {
        category: '内容上新',
        time: '20:43',
        title: '新增 Web安全 分类：SVG文件上传与XSS攻击详解',
        summary: '新建 Web安全 目录，首篇文章系统讲解 SVG 文件上传为何会引发 XSS 攻击，从 SVG 本质、攻击原理、真实案例到五种防御方案全面覆盖，扩展安全知识面。',
        content: '第一点：新建 public/notes/Web安全 目录，发布首篇文章《SVG文件上传为什么会引发XSS攻击？》；第二点：文章内容涵盖 SVG 是 XML 文本而非普通图片的本质说明、四种攻击方式（script标签/onload事件/use引用/CDATA绕过）、img标签与直接访问URL的安全差异对比表、Stored XSS 攻击链路说明；第三点：列举 Plane/Umbraco/Traccar/Halo 等真实开源项目漏洞案例；第四点：提供五种防御方案（禁止SVG/服务端净化/响应头配置/转PNG/隔离域名）及对比表，附 DOMPurify+jsdom 和 sharp 代码示例；第五点：顺带介绍 SVG 的 XXE 漏洞攻击面；第六点：重新生成 notes-index.json，总笔记数 308 篇。',
      },
      {
        category: '内容上新',
        time: '20:50',
        title: '新增前端开发必知的常见网络安全攻击',
        summary: '在 Web安全 目录下新增第二篇文章，用生活化比喻讲清楚 XSS、CSRF、SQL注入、XXE、SSRF、点击劫持、中间人攻击七种常见攻击的原理、示例代码和防御方案，附快速记忆表和前端安全习惯清单。',
        content: '第一点：XSS 跨站脚本攻击，含存储型/反射型/DOM型三种分类、危险写法示例（innerHTML/eval）、DOMPurify 净化方案和 CSP 响应头配置；第二点：CSRF 跨站请求伪造，含自动提交表单攻击示例、CSRF Token 方案和 SameSite Cookie 配置；第三点：SQL 注入，含注释符绕过登录示例、参数化查询防御方案；第四点：XXE XML外部实体注入，含读取 /etc/passwd 示例、禁用外部实体配置；第五点：SSRF 服务器端请求伪造，含 AWS 元数据接口攻击示例、URL 校验防御代码；第六点：点击劫持，含透明 iframe 攻击示例、X-Frame-Options 响应头防御；第七点：中间人攻击，含公共 WiFi 场景说明、HTTPS+HSTS 防御；第八点：七种攻击快速记忆对比表；第九点：前端安全习惯清单（输入处理/Cookie/请求/页面/依赖五个维度）；第十点：重新生成 notes-index.json，总笔记数 309 篇。',
      },
    ],
  },
  {
    id: 'history-2026-04-23',
    date: '2026-04-23',
    items: [
      {
        category: '内容上新',
        time: '19:33',
        title: '新增第三方登录对接系列：PC端钉钉/微信/企业微信 OAuth2.0 全攻略',
        summary: '在"项目复用技术"目录下新建"第三方登录对接"分类，发布第一篇文章，系统讲解钉钉、微信开放平台、企业微信三家 PC 端扫码登录的 OAuth2.0 对接方案，重点覆盖内嵌 iframe 弹框渲染、window.postMessage 回调监听与安全校验、window 跳转三种方式，附 Vue 3 组件示例和三平台对比速查表。',
        content: '第一点：新建 public/notes/项目复用技术/第三方登录对接 目录，发布《PC端第三方扫码登录全攻略（钉钉/微信/企业微信）》；第二点：讲解 OAuth2.0 授权码模式核心流程，说明 code 一次性、后端换取 access_token 的安全原则；第三点：钉钉部分——DDLogin.js 初始化、goto 参数构造、监听 login.dingtalk.com 的 postMessage 拿 loginTmpCode 再跳转换 code；第四点：微信开放平台部分——WxLogin.js 初始化、self_redirect:true 参数说明、监听 open.weixin.qq.com 的 postMessage 解析回调 URL 拿 code；第五点：企业微信部分——WwLogin.js 初始化、监听 open.work.weixin.qq.com 的 postMessage 拿 { code, state } 对象；第六点：三种 window 跳转方式对比（整页跳转/Ajax不跳转/新窗口轮询）；第七点：常见问题汇总（redirect_uri 域名不匹配、state 防 CSRF、postMessage origin 白名单校验、code 只能用一次、弹框关闭清理监听、钉钉新版 API 迁移说明）；第八点：Vue 3 弹框组件完整示例；第九点：重新生成 notes-index.json，总笔记数 310 篇。',
      },
      {
        category: '内容上新',
        time: '19:54',
        title: '新增 window 对象常用 API 速查文章',
        summary: '在"常用缺易忘"目录下新增一篇 window 对象实战速查文章，覆盖 location 跳转、history 路由、navigator 设备判断、postMessage 跨窗口通信、open/close 窗口控制、定时器、滚动、存储、requestAnimationFrame、getComputedStyle、crypto、performance、matchMedia 等前端高频 API，每个配实战场景代码。',
        content: '第一点：location 对象——URL 读取、URLSearchParams 解析参数、href/replace/assign 三种跳转方式区别、hash 修改不刷新；第二点：history 对象——back/forward/go 前进后退、pushState/replaceState 修改 URL 不刷新（SPA 核心）、popstate 事件监听、OAuth 回调后清理 URL 实战；第三点：navigator 对象——userAgent 判断移动端/iOS/微信/钉钉/企业微信、clipboard 剪贴板读写、geolocation 地理位置、sendBeacon 页面关闭前可靠发数据；第四点：postMessage 跨窗口通信——向 iframe/父页面/子窗口发消息、origin 白名单安全校验、钉钉/微信扫码登录 iframe 回调监听实战；第五点：window.open/close——打开新窗口参数详解、轮询检测子窗口关闭实现 OAuth 弹窗；第六点：定时器——setTimeout/setInterval/clearTimeout/clearInterval、防抖和节流实现；第七点：全局事件——load/DOMContentLoaded/beforeunload/visibilitychange/online/offline/resize/scroll/hashchange；第八点：scrollTo/scrollBy 平滑滚动、scrollY/scrollX 读取位置；第九点：localStorage/sessionStorage 存储与对象序列化；第十点：requestAnimationFrame 动画帧；第十一点：getComputedStyle 获取计算样式；第十二点：crypto.randomUUID 生成 UUID、performance 性能监控、matchMedia 媒体查询；第十三点：常用属性速查表汇总；第十四点：重新生成 notes-index.json，总笔记数 311 篇。',
      },
      {
        category: '功能更新',
        time: '20:26',
        title: '搜索全面升级：跳转按钮 + 增强搜索页 + 多词 AND/OR 模式',
        summary: '头部搜索浮层底部新增"查看全部结果"跳转按钮；独立搜索页支持逗号分隔多词搜索、全部包含/任意包含模式切换、分类单选筛选、每页条数（10/20/50）、分页器；搜索引擎改为全文 includes 精确匹配，彻底解决 Fuse.js 模糊误判问题。',
        content: '第一点：KnowledgeSearchPanel.vue overlay 模式底部新增"还有 N 条未显示 · 查看全部 N 条结果"跳转按钮，携带关键词跳转到 /search 页；第二点：SearchPage.vue 重构为独立增强搜索页，支持逗号分隔多词输入（如"vue,钉钉"），有多词时搜索框右侧出现"全部/任意"模式切换按钮；第三点：搜索引擎（search.js）改为全文 includes 精确匹配，AND 模式要求每个词都出现，OR 模式只需包含任意一个词，彻底替换 Fuse.js 模糊匹配；第四点：分类筛选改为单选（点击切换，再点取消），底部分页器左侧每页条数选择（10/20/50），右侧页码导航；第五点：修复 overlay 内容超出视口被截断的问题。',
      },
    ],
  },
  {
    id: 'history-2026-04-25',
    date: '2026-04-25',
    items: [
      {
        category: '内容上新',
        time: '16:55',
        title: '4 月 25 日第三方登录专题整理归档',
        summary: '归档当天围绕第三方登录专题迁移与 frontmatter 补全的一组内容整理，方便后续继续在通知中心回看。',
        content: '第一点：16:43｜第三方登录系列迁移重组：精心整理版替换旧目录｜将精心整理的"第三方登录"文件夹迁移到 public/notes/uni-app/第三方登录，结构更完整，新增 PC微应用、排障记录、改造过程等内容；同步删除旧的钉钉、企业微信、第三方登录对比三个目录，重新生成索引，总笔记数 322 篇。；第二点：16:55｜第三方登录系列 19 篇文章补全 frontmatter｜为 public/notes/uni-app/第三方登录 目录下所有缺少 frontmatter 的文章补全 title、date、category、tags、description 字段，共处理 19 篇，覆盖概念速查、钉钉 H5/PC/小程序、企业微信 H5/PC/小程序及对比笔记全部子目录。',
      },
    ],
  },
  {
    id: 'history-2026-04-26',
    date: '2026-04-26',
    items: [
      {
        category: '内容上新',
        time: '20:10',
        title: '新增 CC Switch 完整使用指南（v3.14.1）',
        summary: '基于官方 CHANGELOG 和中文 README 全力核实，彻底重写 CC Switch 笔记，内容与 v3.14.1 实际版本完全对齐。',
        content: '第一点：拉取官方完整 CHANGELOG（115KB）和中文 README，发现原文章存在多处错误：支持工具实为 6 款（v3.14.0 新增 Hermes Agent）、"本地代理"在 v3.14.0 已统一改名为"Local Routing"、界面操作描述与实际 v3.14.1 不符；第二点：彻底重写 public/notes/AI工具/CC Switch/第一篇_CCSwitch快速上手与核心概念_2026-04.md，新增界面结构解析、版本演进简史（v3.0.0 至 v3.14.1 关键里程碑）、Hermes Agent 说明、本地路由注意事项（开启时无法切换官方 Provider）、系统托盘操作方式等；第三点：同步更新目录.md 的描述与覆盖主题，重新生成 notes-index.json 索引。',
      },
      {
        category: '功能更新',
        time: '19:34',
        title: '站内搜索改为碎片记忆友好的混合检索',
        summary: '搜索从纯 includes 过滤升级为"多字段精确命中 + Fuse 模糊兜底"混合检索，支持空格分词、路径召回、逐词高亮和真正的搜索预热。',
        content: '第一点：重写 src/utils/search.js，搜索字段覆盖 title、description、tags、category、filename、path、content，保留精确命中优先的排序，同时让 Fuse.js 真正参与模糊兜底；第二点：SearchPage.vue 与 KnowledgeSearchPanel.vue 改为支持空格或逗号分词，多词查询会逐词高亮，不再只认整句；第三点：searchWarmup.js 预热阶段改为直接初始化完整搜索引擎，而不是只拉取 JSON；第四点：新增 src/utils/__tests__/search.test.js，补上碎片词检索、路径召回、多词 AND/OR、高亮与历史归一化的测试样例。',
      },
    ],
  },
];
