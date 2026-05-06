// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-06',
  items: [
    {
      category: '内容上新',
      time: '22:56',
      title: '补充数组笔记的空位速查与现代数组方法',
      summary: '在不改动原有主体内容和注释的前提下，为 `09_JavaScript数组.md` 新增空位行为速查、`includes()`/`indexOf()` 差异、`slice()` 与展开运算符在稀疏数组下的区别、ES2023 复制型数组方法，以及查找场景下的 `Set` 补充说明。',
      content: '第一点：本次只对 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 做插入式补充，不覆盖主人已有段落，不删除原注释；第二点：新增“空位在不同方法中的表现速查”，集中对比 `forEach`、`map`、`filter`、`some`、`every`、`reduce`、`find`、`Array.from()`、展开运算符、`slice()`、`concat()`、`flat()`、`join()` 对稀疏数组空位的不同处理；第三点：补充 `includes()` 与 `indexOf()` 在 `NaN` 和空位场景下的行为差异，降低后续学习查找方法时的混淆；第四点：新增 `slice()` 与 `[...arr]` 在稀疏数组下“不完全等价”的提醒，并补充 `toSorted()`、`toReversed()`、`toSpliced()`、`with()` 这组现代不改原数组的方法；第五点：按仓库要求先执行 `scripts/checkNodeRuntime.ps1` 预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。'
    },
    {
      category: '内容上新',
      time: '22:27',
      title: '按原笔记风格回调数组文章并只保留必要纠错',
      summary: '将 `09_JavaScript数组.md` 从“改写式整理”回调为更接近主人原有讲法和注释风格的版本，仅保留 `length`、`splice()`、`map()`、`copyWithin()` 等确实有误的内容修正。',
      content: '第一点：保留并恢复 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 里原本偏“小白解释 + 注释辅助理解”的写法，不再按另一套结构重写整篇；第二点：继续保留 frontmatter，保证列表页、搜索页和详情页标题、日期、分类、标签与摘要可稳定读取；第三点：仅修正几处明确错误，包括把 `length` 误写成访问器属性、把 `splice()` 误写成返回修改后的原数组、把 `push/unshift` 误说成只看第一个参数、把 `map()` 对空位的行为写错，以及 `copyWithin()` 第二个示例沿用上一次执行结果导致的错误结论；第四点：同步把 `forEach` 的 `undefined` 拼写、`filter` 对“空位”的表述，以及总结表里的返回值说明改准，其余原有讲法尽量不碰；第五点：按仓库要求重新执行 Node 运行时预检与 `npm run generate:index`，同步刷新 `public/notes-index.json` 和 `public/search-index.json`。'
    },
    {
      category: '内容上新',
      time: '22:36',
      title: '补强 JavaScript 字符串笔记并修正 Unicode 与正则细节',
      summary: '在尽量保留 `10_字符串.md` 原有结构和内容的前提下，补齐 frontmatter，修正 `slice()`、`replaceAll()`、`matchAll()`、`substr()`、`String.raw()`、字符串反转示例等高频误区，并补充 Unicode 与官方参考资料。',
      content: '第一点：为 `public/notes/我的总结/JS/辅助资料/10_字符串.md` 补齐 frontmatter，统一标题、日期、分类、标签与摘要，保证详情页、列表页和搜索页后续能稳定读取一致标题；第二点：保留原有“创建、查找、截取、修改、转换、示例、兼容性”的主体结构不动，只对明确错误或容易误导的知识点做增补式修正，包括把字符串 `slice()` 的“返回空数组”纠正为“返回空字符串”，把 `substr()` 的标准状态改为“已废弃、仅为兼容旧网页保留”，把 `replaceAll()` 与 `matchAll()` 对正则的全局标志要求补全为会抛 `TypeError` 的规范行为；第三点：把 `String.raw()` 的 Windows 路径示例改成真正可执行且不自相矛盾的写法，避免正文里出现本身就会被错误转义的字符串字面量；第四点：修复“字符串反转”示例中函数内连续 `return` 导致后两种写法永远不会执行的问题，改成三个独立函数，并补上表情符号场景，顺带说明 `split('')` 会按 UTF-16 代码单元拆分；第五点：新增 `at()`、`isWellFormed()`、`toWellFormed()`、Unicode 代理对与 `Array.from()`/扩展运算符的补充说明，让主人晚上继续扩写时可以直接从“负索引、Unicode、坏字符串、现代 API”几条线往下写；第六点：文末补上 MDN 官方参考链接，便于后续继续查证和扩写。'
    },
    {
      category: '问题修复',
      time: '22:43',
      title: '隐藏笔记详情页头部的标签胶囊显示',
      summary: '移除详情页头部对 `note.tags` 的可视化渲染，避免主人误以为是 Markdown 正文把 `tags` 原文渲染出来。',
      content: '第一点：排查后确认 `09_JavaScript数组.md` 与 `10_字符串.md` 的 frontmatter 都能被正文剥离，页面上看到的并不是 YAML 原文残留，而是 `src/views/NoteDetailPage.vue` 头部主动把 `note.tags` 渲染成了一排标签胶囊；第二点：本次仅删除详情页模板里的 `note-tags` 展示块以及对应样式，保留 frontmatter 数据本身不变，因此搜索、索引、分类和后续脚本逻辑仍可继续使用 `tags`；第三点：这样处理后，页面不再显示这排标签，但不会影响 `public/notes-index.json` 和 `public/search-index.json` 里基于标签的检索能力。'
    },
    {
      category: '问题修复',
      time: '22:46',
      title: '清理字符串笔记正文里的 font HTML 标签',
      summary: '按主人的反馈清理 `10_字符串.md` 正文里残留的 `<font>` / `</font>` 标签，只保留文本内容与 Markdown 语义，不改动知识点本身。',
      content: '第一点：重新核对后确认主人说的是 Markdown 正文里的 HTML 标签，而不是页面头部显示的标签胶囊；第二点：本次对 `public/notes/我的总结/JS/辅助资料/10_字符串.md` 做的是纯清洗操作，批量移除所有 `<font ...>` 与 `</font>`，保留原有文字、行内代码、强调和段落结构，不借机改写原有知识点；第三点：复查后该文件里不再有残留 `font` 标签，当前只剩模板字符串代码示例中的 `<strong>`，那属于代码演示内容本身，不是正文污染。'
    },
    {
      category: '功能更新',
      time: '21:15',
      title: '图片灯箱升级为可缩放拖拽的成熟查看器',
      summary: '将站内图片与 Mermaid 图预览从“静态弹层”升级为支持滚轮缩放、双击放大、拖拽平移和键盘控制的查看器，放大后可左右上下拖动查看细节。',
      content: '第一点：重写 `src/components/ImageLightbox.vue`，将原先只做居中展示的简易弹层升级为带顶部工具栏的查看器，支持放大、缩小、重置、Esc 关闭，并实时显示当前缩放比例；第二点：新增滚轮缩放、双击快速放大/还原、按住拖拽平移和方向键平移能力，让图片和 Mermaid 图在放大后可以像成熟产品那样查看局部细节，而不是只能弹出一个固定大小的预览；第三点：新增 `src/utils/lightboxTransform.js`，抽离缩放边界、拖拽边界和以鼠标位置为中心缩放的几何计算，避免复杂交互逻辑全部堆在组件里；第四点：补充 `src/utils/__tests__/lightboxTransform.test.js`，覆盖缩放夹取、边界约束和缩放投影计算，降低后续继续打磨查看器时引入交互回归的风险。'
    },
    {
      category: '功能更新',
      time: '21:01',
      title: 'Mermaid 图表现已支持点击放大预览',
      summary: '把 Markdown 中渲染出的 Mermaid 图接入现有图片灯箱，站内图表现在支持点击放大和键盘触发预览，不再只能原尺寸查看。',
      content: '第一点：在 `src/components/MarkdownRenderer.vue` 中为 Mermaid 渲染后的 `svg` 绑定点击与键盘事件，直接复用现有 `imageClick` 事件和 `ImageLightbox` 组件，不额外新建一套预览弹层；第二点：新增 `src/utils/mermaidPreview.js`，把渲染后的 SVG 标记安全转成 `data:image/svg+xml` 地址，保证灯箱可以像预览普通图片一样预览站内 Mermaid 图；第三点：补充 `src/utils/__tests__/mermaidPreview.test.js`，覆盖 SVG 预览地址生成逻辑，避免后续修改时把图表放大能力悄悄弄坏；第四点：为 Mermaid SVG 增加 `cursor`、`focus` 和轻微 hover 反馈，让主人更容易意识到“这张图可以点开看大图”。'
    },
    {
      category: '功能更新',
      time: '20:46',
      title: 'Markdown 现已支持 Mermaid 图表渲染并重写第八篇类型检测笔记',
      summary: '为站内 Markdown 渲染器补上 Mermaid 支持，修复 `mermaid` 代码块不显示的问题，同时重写 `08_类型检测与原型链深度解析.md`，补齐各类类型检测方法的适用场景、缺点与面试回答模板。',
      content: '第一点：在 `src/utils/markdown.js` 中为 `mermaid` fenced code block 增加专门渲染分支，输出独立的 Mermaid 容器与源码兜底结构，不再把图表当普通代码块处理；第二点：在 `src/components/MarkdownRenderer.vue` 中接入 `mermaid` 运行时，采用 `initialize` + `run` 的方式在 DOM 更新后自动把 `.mermaid` 节点渲染为 SVG，并在失败时自动回退到源码展示；第三点：补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，覆盖 Mermaid fenced block 的 HTML 输出，确保后续回归能及时发现图表渲染结构变化；第四点：重写 `public/notes/我的总结/JS/辅助资料/08_类型检测与原型链深度解析.md`，补齐 `typeof`、`instanceof`、`constructor`、`Array.isArray()`、`Object.prototype.toString.call()` 的适用场景与缺点，新增原型链关系图、面试追问版回答模板和自测题，方便主人直接拿来复述；第五点：补齐该笔记的 frontmatter，统一标题、日期、分类、标签和摘要，方便列表页与搜索页稳定读取。'
    },
    {
      category: '功能更新',
      time: '20:41',
      title: 'Markdown 代码块新增行号与自动折叠',
      summary: '给站点 Markdown 代码块补上头部信息、行号 gutter 和超过 10 行自动折叠/展开能力，同时保留原有语法高亮与复制按钮。',
      content: '第一点：在 `src/utils/markdown.js` 里接管 fenced code block 渲染，统一输出代码块头部、语言标签、总行数、行号 gutter 与折叠按钮，不再依赖后置 DOM 拼装来生成结构；第二点：新增 `src/utils/markdownCodeBlocks.js` 作为代码块辅助工具，集中处理语言名规范化、行数统计、行号生成和折叠阈值，方便后续复用与维护；第三点：重构 `src/components/MarkdownRenderer.vue` 的交互层，保留原有复制按钮能力，并把复制逻辑改成更稳的事件绑定方式，同时为超过 10 行的代码块补上展开/收起交互；第四点：补充 `src/utils/__tests__/markdownCodeBlocks.test.js`，覆盖语言标签、行数统计与渲染输出的关键断言，确保新代码块样式和折叠规则可回归验证。'
    },
    {
      category: '内容上新',
      time: '18:15',
      title: '重写 JavaScript 数组笔记并修正关键概念错误',
      summary: '重构 `09_JavaScript数组.md` 为“纠错 + 深入版”，系统修正数组 `length`、空位、`splice()` 返回值、`map()` 对稀疏数组行为、`copyWithin()` 示例等高频误区，并补上现代不可变数组方法与权威参考链接。',
      content: '第一点：为 `public/notes/我的总结/JS/辅助资料/09_JavaScript数组.md` 补齐 frontmatter，统一标题、日期、分类、标签与摘要，保证文章元信息可被列表页与搜索正确读取；第二点：重写数组本质与 `length` 章节，明确数组是特殊对象、合法索引如何与 `length` 联动、`length` 更接近“最大索引 + 1”而非真实元素个数，并强调空位不等于 `undefined`；第三点：集中修正原文中的关键错误，包括“`length` 是访问器属性”的误导性说法、`splice()` 返回值错误、`push/unshift` 参数规则错误、`map()` 对空位的处理错误，以及 `copyWithin()` 第二个示例串用前一个执行结果导致的结论偏差；第四点：新增稀疏数组专节，系统解释 `delete`、空位、`forEach`、`map`、`filter`、`reduce`、`flat` 对空位的不同处理，降低初学者后续学习迭代方法时的理解断层；第五点：补充 `toSorted()`、`toSpliced()`、`toReversed()`、`with()` 等现代复制型方法，帮助区分“改原数组”和“不改原数组”的两套思维；第六点：按仓库要求完成 UTF-8 无 BOM 校验，执行运行时预检与 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。'
    },
    {
      category: '内容上新',
      time: '17:59',
      title: '补充 Class 与构造函数双链继承的开场总述',
      summary: '在 `07_es5构造函数与es6语法糖Class.md` 开头新增一段“快速理解”分点总结，先整体串起实例成员链与静态成员链，方便进入正文前快速建立全局图。 ',
      content: '第一点：按主人的原文表述把总结拆成 4 个分点，完整保留“函数 `prototype`、构造函数 `__proto__`、实例查找链、静态查找链、两链互不交叉”的核心描述；第二点：将该总结放到笔记最开头，作为正文前的快速理解入口，减少后文阅读时来回拼接概念的成本；第三点：不改动原有正文结构，仅在顶部新增概览，保持后续详细讲解与示例代码可继续顺序阅读。'
    },
    {
      category: '问题修复',
      time: '15:19',
      title: '纠正 Class 与构造函数笔记中的关键错误并清理 HTML 标记',
      summary: '修订 `07_es5构造函数与es6语法糖Class.md` 的高风险错误示例，并把残留的 `<font>` 富文本标记清理成纯 Markdown，提升可读性与可维护性。',
      content: '第一点：修正 `super` 章节的规则描述，明确“`super()` 仅用于子类 constructor 调父类构造函数”，并补充 `super.method()` / `super.prop` 可在实例方法或静态方法中访问父类成员，避免两种语义混淆；第二点：修正私有字段示例，移除类外直接写 `obj.#field` 的误导性 try/catch 写法，改为注释说明其属于解析期 `SyntaxError`，并用 `eval` 演示可捕获错误；第三点：修复用户示例中的密码校验逻辑，去掉哈希函数里的 `Date.now()`，改为确定性结果，确保 `verifyPassword` 示例具备可验证一致性；第四点：补充“易错点速记（纠错版）”，集中解释 `super`、私有字段、`instanceof` 与运行环境差异；第五点：清理 `instanceof` 小节里残留的 `<font>` 富文本标记，统一改成纯 Markdown 强调与列表，避免正文混杂 HTML；第六点：按规范执行运行时预检与 `npm run generate:index`，同步更新笔记索引文件。'
    },
    {
      category: '内容上新',
      time: '14:50',
      title: '原型链笔记补回图解并升级为小白详细版',
      summary: '按“先图后文”重写 `06_JavaScript原型链.md`，新增 Mermaid + ASCII 双图解，补充属性查找流程图与 new 执行图，并把每个核心概念改成白话解释 + 可运行示例。',
      content: '第一点：在 `public/notes/我的总结/JS/辅助资料/06_JavaScript原型链.md` 增加三张图（关系图、属性查找流程图、new 执行流程图），并保留 ASCII 兜底图，避免渲染器不支持 Mermaid 时无法阅读；第二点：正文改为小白路径，按“关键词拆分 -> 最小例子 -> 查找流程 -> 易错点 -> 自测题”展开，重点区分 `prototype`、`[[Prototype]]`、`__proto__`、`constructor`；第三点：新增 `constructor` 的“小三角关系图”，单独解释“构造函数 -> prototype -> constructor 回指 -> 实例内部原型”这一圈关系，并补充它为什么会失真、为什么不适合单独拿来做类型判断；第四点：新增高频误区纠正（如 constructor 失真、instanceof 本质、class 语法糖关系）和可直接复制执行的验证代码，降低记忆负担；第五点：修复 Mermaid 兼容性问题，移除图 1 与图 3 节点文字中会触发解析器误判的 `[[Prototype]]`、括号与引号，改为“内部原型”等普通文本并在图下补解释；第六点：完成 UTF-8 无 BOM 校验，并执行运行时预检与 `npm run generate:index` 同步更新索引文件。'
    },
    {
      category: '内容上新',
      time: '14:40',
      title: '重写 JavaScript 原型链笔记并完成概念纠错',
      summary: '重构 `06_JavaScript原型链.md` 为“纠错 + 完整版”，补齐 frontmatter，统一 `prototype`、`[[Prototype]]`、`__proto__`、`constructor`、`instanceof` 与 `new` 流程的准确表述，新增可运行自测代码与复习口诀。',
      content: '第一点：重写 `public/notes/我的总结/JS/辅助资料/06_JavaScript原型链.md` 全文结构，改为“核心概念 -> 查找机制 -> 误区纠正 -> 代码自测”的学习路径，降低阅读跳跃；第二点：修正“prototype 是每个对象都有”“实例通过 prototype 找原型”“constructor 恒等可靠”等常见误解，明确函数属性与对象内部原型的边界；第三点：新增 `instanceof` 本质说明与简化实现，补充 `new` 五步流程、原型方法节省内存原因和 class 语法糖关系；第四点：补充可直接运行的断言示例与复习口诀，便于主人快速自检是否真正掌握原型链；第五点：按仓库规范完成 UTF-8 无 BOM 写入校验，并执行 Node 运行时预检与 `npm run generate:index`，同步刷新索引文件。'
    },
    {
      category: '内容上新',
      time: '14:34',
      title: '补全 JS this 规则并完善箭头函数小白说明',
      summary: '重写并扩充 `05_this.md`，将“this 永远是 window”等不严谨表述修正为严格模式/调用方式区分，新增“箭头函数小白版”与 `setTimeout`/事件监听丢 this 的并排对照拆解，并附 MDN 权威参考链接。',
      content: '第一点：重构 `public/notes/我的总结/JS/辅助资料/05_this.md` 的整体结构，保留原有学习主线但改为“规则 + 反例 + 修复”方式，降低理解门槛；第二点：明确普通函数、对象方法、构造调用、call/apply/bind 在严格模式与非严格模式下的 this 差异，修正“默认就是 window”的过度简化；第三点：新增回调 this 误区章节，区分“接收回调的方法 this”和“回调函数 this”两套独立规则，并补充 `forEach(thisArg)`、`setTimeout`、`addEventListener` 的可执行示例；第四点：新增“箭头函数小白版（最通俗）”章节，并把 `setTimeout(this.fn)` 与 `addEventListener("click", this.fn)` 按“等价拆解 -> this 指向 -> 直接后果 -> 共同点/区别”并排讲解，帮助快速建立场景判断；第五点：补充终极防丢模板与一步判断法，文末保留 MDN 参考资料链接便于持续核验。'
    },
    {
      category: '问题修复',
      time: '11:11',
      title: 'JS 与 Vue 目录页顺序化改造完成',
      summary: '将 `JS常识.md` 与 `Vue.md` 统一改为纯目录页，并把 JS 辅助资料、Vue 辅助资料与 Vue 随记统一重命名为“章节号/附录号_标题”格式，补齐缺失章节文件与本地链接，解决阅读顺序不明确和跳读成本高的问题。',
      content: '第一点：重构 `public/notes/我的总结/JS/JS常识.md` 为目录页，仅保留阅读顺序与章节入口，并将 `辅助资料` 统一重命名为 `01` 到 `20` 的有序文件名；第二点：新增 `public/notes/我的总结/JS/辅助资料/02_数据访问安全机制.md`、`03_闭包与垃圾回收.md`、`04_arguments的使用.md`，把主线章节拆分成独立文档；第三点：重构 `public/notes/我的总结/Vue/Vue.md` 为目录页，仅保留 1 到 11 的阅读路径，并新增 `public/notes/我的总结/Vue/vue辅助/01_插值语法.md` 作为本地入口；第四点：将 `public/notes/我的总结/Vue/vue辅助/` 原有文件统一重命名为 `02` 到 `11` 的有序文件名（如 `02_Vue指令与自定义指令.md`、`11_Vue3_Composition_API核心笔记.md`），并同步修正目录链接；第五点：将 `public/notes/我的总结/Vue/vue随记/` 统一为附录命名（`附录01_Vue2的Webpack工程化详解.md`、`附录02_Vue3的Vite工程化详解.md`、`附录03_Vue的name属性.md`），并在 `Vue.md` 的扩展阅读区使用同名入口；第六点：按仓库规则执行运行时预检和 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`。',
    },
  ],
}
