// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-04-29',
  items: [
    {
      category: '内容上新',
      time: '09:55',
      title: 'HTML 分类新增 SVG 入门笔记',
      summary: '新增第七篇《SVG入门——看懂图标代码不再懵》，从 viewBox 坐标系、常用元素到 path 的 d 属性命令全解，配合真实图标代码拆解，帮助看懂别人写的 SVG。',
      content: '第一点：讲解 SVG 与普通图片的区别，以及 viewBox 坐标系的直观理解方式；第二点：覆盖 circle、rect、line、polyline、polygon、ellipse 六种基础图形元素及其属性；第三点：详解 fill、stroke、currentColor 样式属性，说明 currentColor 为何是图标库的标准做法；第四点：系统讲解 path 的 d 属性所有命令（M/L/H/V/Z/Q/C/A），含大小写区别（绝对/相对坐标）；第五点：实战拆解关闭按钮、搜索图标、向上箭头、月亮图标四个真实案例；第六点：补充 transform 变换用法和常见问题解答；第七点：更新 HTML 目录，索引从 334 篇增至 335 篇。',
    },
    {
      category: '内容上新',
      time: '09:30',
      title: 'ElementPlus 专题新增第七至第十篇',
      summary: '基于 2026-04-29 查阅的 Element Plus 官方文档（v2.13.7），补全导航体系、表单进阶、数据展示扩展、反馈与浮层补全四篇，ElementPlus 专题正式扩展为十篇完整系列，同步更新目录文件与笔记索引。',
      content: '第一点：新增第七篇《导航体系：Menu、Tabs、Breadcrumb、Steps、Dropdown 怎么组织后台页面结构》，覆盖侧边菜单与 Vue Router 联动、折叠菜单、动态路由菜单生成、多页签关闭、面包屑动态生成、步骤条引导、Dropdown 收纳操作，附完整后台框架示例；第二点：新增第八篇《表单进阶：Cascader、TreeSelect、Transfer、Checkbox、Radio、Switch、Slider、Rate》，覆盖级联选择懒加载、树形选择多选、穿梭框搜索、全选半选、Switch 切换前确认、Slider 范围选择、Rate 只读模式，附 Form 联动校验完整示例；第三点：新增第九篇《数据展示扩展：Descriptions、Timeline、Collapse、Tag、Badge、Statistic、Skeleton、Result、Empty》，覆盖详情页字段展示、操作历史时间轴、折叠面板、动态标签增删、徽章计数、数字指标卡片、骨架屏占位、结果页（含 404/403/500）、空状态，附完整详情页组合示例；第四点：新增第十篇《反馈与浮层补全：Tooltip、Popover、Popconfirm、Notification、Alert + 虚拟化组件》，补全 disabled 按钮 Tooltip 方案、Popover 用户信息卡片、Popconfirm 轻确认、Notification 位置与不自动关闭、Alert 页面内嵌，以及 VirtualizedSelect/VirtualizedTable/InfiniteScroll 的适用时机与基础用法，附反馈组件层次对比表；第五点：更新 ElementPlus/目录.md，将"待写内容"标注为已完成，阅读顺序延伸至第十篇，官方组件覆盖情况表同步更新；第六点：重新生成 notes-index.json，总笔记数 334 篇。',
    },
    {
      category: '内容上新',
      time: '11:55',
      title: 'ElementPlus 第一篇纠错与完善',
      summary: '对第一篇《快速认识 Element Plus》进行核实与修正：修复代码示例错误、补充 zIndex 默认值说明、完善按需导入配置说明、补充 TypeScript Volar 支持、优化暗黑模式覆盖写法。',
      content: '第一点：修复第六节代码示例被拆成两个独立代码块的错误，合并为完整的 .vue 单文件组件；第二点：修正第四节 main.js 完整引入写法，将全局配置 size/zIndex 拆为独立小节，并补充说明 zIndex 官方默认值是 2000（不是 3000），避免读者误以为 3000 是默认值；第三点：修正第五节 vite.config.js 按需导入配置，移除 AutoImport 里多余的 imports: ["vue"]，并补充说明该字段的实际用途，避免误导；第四点：第七节国际化补充说明 el-config-provider 同时可配 size 和 z-index，以及按需导入时全局配置的正确方式；第五点：第九节 SCSS 方案补充 @forward 必须在 @use 之前的规则，以及按需导入场景需要额外配置 scss.additionalData 的说明；第六点：第十节暗黑模式补充精确控制 classList.add/remove 的写法，以及覆盖变量文件必须在 Element Plus 暗黑变量之后引入的顺序说明；第七点：第十一节新增第五个坑：TypeScript 项目需要在 tsconfig.json 加 element-plus/global 才有组件类型提示；第八点：同步更新记忆版要点。',
    },
    {
      category: '内容上新',
      time: '16:51',
      title: 'CSS 第三篇补齐现代布局实战缺口',
      summary: '对《第三篇 现代布局：从弹性到网格》补强 Flex 和 Grid 的关键桥接知识，新增 gap/auto margin/order、Grid 项目对齐、自动放置与防撑爆内容，并压缩重复示例段落。',
      content: '第一点：在 Flex 章节新增 `gap` 与 `auto margin` 的实战用法，补清楚为什么现代项目更常用 gap 管项目间距，以及 `margin-left:auto`、`margin-top:auto` 如何把项目推到主轴尽头；第二点：新增 `order` 小节，说明它只改变视觉顺序、不改变 HTML 顺序，并补充可访问性与移动端局部重排边界；第三点：在 Grid 章节新增 `justify-items`、`align-items`、`place-items` 与 `justify-self`、`place-self`，补齐“格子划好了以后，项目在格子里怎么摆”的关键知识；第四点：新增 `grid-auto-flow`、`grid-auto-rows`、隐式网格与 `minmax(0, 1fr)` 防撑爆说明，解决读者学会语法后仍容易遇到的自动排布和长内容撑坏布局问题；第五点：压缩 `grid-template-areas` 重复示例，避免篇幅耗在重复讲解；第六点：执行 `npm run generate:index`，刷新笔记索引与搜索索引。',
    },
    {
      category: '问题修复',
      time: '20:53',
      title: 'ElementPlus 专题核对官方文档并修正文案覆盖声明',
      summary: '深度复核 Element Plus 专题后，修正第三篇对 Button `text/link` 的表述偏差，补充 Space 与 Text 的常用能力，并把目录页的组件覆盖清单改为与实际文章范围一致。',
      content: '第一点：复核第三篇《基础组件：Button、Icon、Container、Space、Text 怎么搭出像样的后台界面》，修正“`type=\'text\'` 废弃”与现行 `text` 布尔属性容易混淆的问题，明确区分旧 `type=\'text\'`、新 `text` 和 `link` 的适用场景；第二点：在第三篇补充 Button 的 `icon`、ButtonGroup、`dashed` 能力说明，以及 Space 的 `spacer`、`fill` / `fill-ratio`、Text 的 `line-clamp`、`tag` 等官方文档里高频但原文遗漏的能力点；第三点：修正 `ElementPlus/目录.md` 中“已覆盖组件”过度乐观的问题，把统计改成“本专题主讲覆盖 / 仍未系统展开”两列，避免把示例里顺带出现的组件误写成已系统覆盖；第四点：同步把第十篇摘要改成与正文实际范围一致，明确 `Loading`、`Tree`、`VirtualizedTree` 等仍值得后续继续补专题；第五点：重新生成 `public/notes-index.json` 与 `public/search-index.json`，确认本次文档修正已写入搜索索引。',
    },
    {
      category: '内容上新',
      time: '22:06',
      title: 'WebSocket 专题补上零基础前置入门篇',
      summary: '在项目复用技术 / WebSocket 专题前新增并继续补强一篇真正面向小白的前置知识文章，重点改成“协议无关的底层 WebSocket 通识版”：从 WebSocket 是什么、HTTP Upgrade 握手、底层通道和上层协议的边界，到浏览器与 uni-app 的最小写法、心跳、重连、关闭码、换协议时怎么拆，一次讲清，并同步更新专题目录与笔记索引。',
      content: '第一点：新增并持续补强 `public/notes/项目复用技术/WebSocket/00-WebSocket零基础入门_它是什么_为什么用_浏览器与uni-app怎么写.md`，按零基础视角系统讲解 WebSocket 的概念、适用场景、`ws/wss`、`readyState`、浏览器原生 API、`uni.connectSocket`、心跳、重连、订阅与 STOMP 的关系；第二点：把文章进一步改成“大众版、协议无关”的底层通识写法，补充 HTTP Upgrade 握手、`101 Switching Protocols`、`Sec-WebSocket-Protocol`、关闭码、WebSocket 本体与上层协议的职责边界，帮助以后看别家公司自定义实时协议时也能套同一套思路；第三点：专门增加“不要把 WebSocket、WebService、STOMP、Socket.IO 混在一起”的扫盲部分，并新增“如果公司不用 STOMP，也照鉴权、消息格式、心跳、重连、订阅这几问去拆”的分析框架；第四点：补了一组面试最常见的基础问法与短答法，避免只会看项目封装、不知道底层概念；第五点：更新 `public/notes/项目复用技术/WebSocket/目录.md`，把阅读顺序调整为先读 `00 前置篇`，再看后面的 01 至 08 封装实战；第六点：由于当前终端里的 Node 脚本运行触发本机环境异常，改用本地回退方式重建 `public/notes-index.json` 与 `public/search-index.json`，确认新文章已经写入搜索与分类索引，总笔记数维持为 336 篇。',
    },
    {
      category: '内容上新',
      time: '22:36',
      title: 'CSS 第三篇改写为更适合小白的 Grid 学习路径',
      summary: '结合“从 0 到吃透 Grid”的学习顺序，重写《第三篇 现代布局：从弹性到网格》的 Grid 章节，补上 frontmatter，并把对齐、合并单元格、响应式、自适应列数和常见坑点改成更口语化、更好记的讲法。',
      content: '第一点：为 `public/notes/CSS/第三篇_现代布局_从弹性到网格.md` 补充规范 frontmatter，新增 `title`、`date`、`category`、`tags`、`description`，让列表页与搜索索引能正确读取文章元信息；第二点：将第 8 章整体改写成“小白学习路径”结构，从 Flex 和 Grid 的区别、父级画格子、对齐属性辨析开始，一步讲到格子内对齐、默认 `stretch`、`align-self` 覆盖行为；第三点：补强 `span` 合并单元格、按网格线定位、`fr` / `repeat()` / `minmax()`、`repeat(auto-fit, minmax())` 响应式万能句，并加入 `auto-fit` / `auto-fill`、隐式网格、`grid-auto-flow`、`minmax(0, 1fr)` 等实战坑点说明；第四点：保留后台骨架和卡片墙等高频模板，但把讲解从“属性罗列”改成“先有画面再记属性”的口语化方式，降低第一次学习 Grid 的理解门槛；第五点：由于当前终端里的 Node 脚本运行仍会触发本机异常，本次改用本地回退方式同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保新 frontmatter 与正文摘要已进入索引。',
    },
    {
      category: '功能更新',
      time: '23:15',
      title: '文章详情页支持 HTML 示例附件弹窗预览',
      summary: '为笔记详情页接入 HTML 附件识别与弹窗预览能力，文章现在可以像挂附件一样挂学习型 demo，并在站内直接打开预览。',
      content: '第一点：新增 `src/utils/noteAttachments.js` 与对应测试，统一处理附件路径编码、HTML 扩展名识别和可预览判断，避免详情页里散落硬编码逻辑；第二点：新增 `src/components/HtmlAttachmentPreviewModal.vue`，用 `BaseModal + iframe sandbox` 承载 HTML 示例，并保留“新窗口打开”兜底入口；第三点：改造 `src/views/NoteDetailPage.vue` 的附件区，普通附件继续下载，`.html/.htm` 附件会额外显示“预览示例”按钮；第四点：为 `public/notes/CSS/第三篇_现代布局_从弹性到网格.md` 挂上首个示例附件，并新增一个可交互的现代布局示例页，支持切换 Flex / Grid、列数、gap 与对齐方式，右侧代码实时联动；第五点：由于当前终端里的 Node 脚本依旧无法执行，本次改用本地回退方式手动同步 `public/notes-index.json`、`public/search-index.json` 与通知数据，保证前端读取到的新附件信息一致。',
    },
    {
      category: '功能更新',
      time: '23:21',
      title: 'AGENTS 补充文章 HTML 示例预览约定',
      summary: '在仓库规则文档中补充“文章配套 HTML 学习示例”的统一实现约定，后续再做同类需求时会优先复用现有附件预览体系。',
      content: '第一点：在 `AGENTS.md` 的笔记发布规范中新增文章 HTML 示例预览规则，明确这类需求优先走“`attachments` + 详情页预览弹窗”机制，不另起独立路由；第二点：约定 `.html/.htm` 示例文件应放在 `public/notes/` 下并通过 frontmatter 的 `attachments` 显式声明；第三点：补充要求：详情页应同时保留下载 / 新窗口入口，并优先复用现有路径编码、附件识别和 `iframe sandbox` 预览逻辑；第四点：强调示例页尽量自包含，外部资源优先使用同目录相对路径，避免破坏 GitHub Pages `base` 路径和站内预览兼容性。',
    },
    {
      category: '功能更新',
      time: '23:37',
      title: '新增 Node 运行时预检与失败回退约定',
      summary: '定位出 Codex 终端里的 Node 失败与加密提供程序初始化异常有关后，补充了可复用的预检脚本和 AGENTS 规则，并明确区分“Codex 环境问题”和“主人自己终端正常”的场景。',
      content: '第一点：新增 `scripts/checkNodeRuntime.ps1`，会同时检测 `node -v` 与 `node -e`，并在命中 `ncrypto::CSPRNG(nullptr, 0)`、`NTE_PROVIDER_DLL_FAIL`、`0x8009001d` 时直接给出环境级诊断和回退建议；第二点：在 `AGENTS.md` 里补充 Node 运行时预检规则，要求以后在 Codex / 代理终端里执行任何 `node`、`npm`、`vite` 脚本前，优先先跑这份预检脚本；第三点：进一步明确约定：如果主人自己在外部 PowerShell / CMD 里 `node -e` 正常，而 Codex 终端预检失败，应优先判定为“Codex 命令执行环境与主人外部终端不一致”，不要误报成主人机器上的 Node 损坏；第四点：同步固化回退办法：改由主人在外部终端手动执行脚本，或由 Codex 走本地手动同步生成文件方案，减少后续重复卡在同一环境故障上。',
    },
  ],
}
