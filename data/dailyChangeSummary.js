// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
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
}
