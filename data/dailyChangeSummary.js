// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
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
}
