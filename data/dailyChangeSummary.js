// 这里只保留'当天'的消息摘要。
// 主人说'汇总消息'时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: "2026-05-24",
  items: [
    {
      category: "功能更新",
      time: "21:09",
      title: "修正文档 frontmatter、MCP 导航归位与 Codex Plugin 官方口径",
      summary:
        "补齐 `AI工具` 目录下多篇缺 frontmatter 的正式文档与目录页，清理 Gemini 目录里重复错位的“谷歌MCP”正文副本，并按 OpenAI 官方资料修正 Codex Plugin 文章中的发布日期与规模口径。",
      content:
        "第一点：为 `public/notes/AI工具/01_AI编辑器流/` 下的 Cursor、Kiro、Trae、Windsurf 目录页补齐 frontmatter，为 `public/notes/AI工具/02_终端Agent流/Gemini/目录.md` 补齐 frontmatter，修复这些目录页在索引中只能回退到文件名显示的问题；第二点：将 `public/notes/AI工具/02_终端Agent流/Gemini/谷歌MCP_配置手册.md` 从重复正文改成导览说明页，明确真正的实操正文统一放在 `public/notes/AI工具/03_规则机制层/MCP/谷歌MCP_配置手册.md` 维护，避免搜索与列表出现两篇同内容同文件名文章；第三点：为 MCP 主文补齐 frontmatter，并把标题从“Codex MCP 复刻配置手册”校准为更符合目录语义的“谷歌 MCP 配置手册（Windows，Chrome DevTools MCP 复刻）”；第四点：为 `public/notes/AI工具/04_Agent框架层/龙虾/` 下 6 篇正式文章与 `目录.md` 统一补齐 frontmatter，修复站内索引里出现 `第一篇_OpenClaw...`、`第六篇_龙虾命令与配置文件一页速查图` 这类下划线文件名直出的问题；第五点：为 `public/notes/AI工具/02_终端Agent流/Codex/中转切换与Node排障/对比报告/` 下两份 Node 环境报告补齐 frontmatter，让它们在站内搜索和详情页中显示为人类可读标题；第六点：将 `public/notes/AI工具/03_规则机制层/Plugin/02_Codex插件体系/第二篇_CodexPlugin体系详解与实战_2026-05.md` 中关于 Codex Plugin 的官方口径改为 2026-03-26 官方帮助中心更新，并把“100 万开发者”修正为基于 OpenAI 官方产品页可确认的“300 万+ 开发者每周使用 Codex”和“90+ 插件”；第七点：按仓库规则先把昨日 `data/dailyChangeSummary.js` 的 2026-05-23 三条摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的当日摘要。",
    },
    {
      category: "问题修复",
      time: "21:19",
      title: "修复个人角落弹层在笔记页被遮挡",
      summary:
        "为头部“角落”弹层补上独立层级和小屏高度兜底，避免在文章详情页被吸顶条或其它浮层压住。",
      content:
        "第一点：在 `src/components/AppHeader.vue` 为 `corner-popover` 补充显式 `z-index`，让 Teleport 到 `body` 的个人角落面板稳定高于笔记页吸顶条与内容层；第二点：补充 `max-height` 和 `overflow-y: auto`，让窄屏或较矮视口下的天气、提醒、问候内容可以完整显示并支持内部滚动；第三点：同步按仓库规则把昨日 `2026-05-23` 的三条开发摘要迁移归档到 `data/history/2026-05-21_30.js`，再重建今天的 `data/dailyChangeSummary.js`。",
    },
    {
      category: "问题修复",
      time: "22:07",
      title: "收紧 MCP 概念口径并补齐面试题库",
      summary:
        "修正 MCP 主文里把协议过度简化成“工具层”的表述，补上官方 `tools`、`resources`、`prompts` 原语，并把面试题库拆成概念、架构安全、项目落地 3 组正式稿。",
      content:
        "第一点：更新 `public/notes/AI工具/03_规则机制层/MCP/01_概念与原理/第一篇_MCP是什么与开放标准核心认知.md`，把 MCP 从“可被 Agent 调用的工具层”收紧为更准确的“标准能力入口协议”，补充官方 `tools`、`resources`、`prompts` 三类常见原语，并把 `Host / Client / Server` 的定义改得更接近官方架构语义；第二点：同步修正文中“浏览器 MCP 属于哪一层”的解释，明确“浏览器类、文件类、搜索类”是面向选型的业务分类，不等于协议层 primitive；第三点：更新 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第一篇_常用MCP分类与选型总览.md`，把“搜索与知识检索类”扩写为“搜索、阅读与知识检索类”，并补充“搜索资料偏 tool、阅读内容偏 resource、知识问答通常是组合结果”的说明；第四点：把 `public/notes/AI工具/03_规则机制层/MCP/03_面试题库与回答模板/README.md` 从占位说明升级成正式导航，并新增 `第一组_概念与主流度问题.md`、`第二组_架构与安全边界问题.md`、`第三组_项目落地与收益评估问题.md` 三篇带 frontmatter 的正式题库稿，统一采用“问题原文 + 30 秒回答 + 2 分钟展开 + 追问应对 + 可反问面试官的问题”结构，方便后续继续扩写和直接面试复述。",
    },
    {
      category: "内容上新",
      time: "22:11",
      title: "更新 CC Switch 专题到 v3.15.0 并补 MiMo 1M 长上下文说明",
      summary:
        "刷新 `CCSwitch` 专题目录与 4 篇正文的官方口径，把版本基线更新到 2026-05-24，补入 Claude Desktop 面板、Routing Support、Full URL Endpoint Mode 与 MiMo `[1m]` 长上下文配置说明。",
      content:
        "第一点：更新 `public/notes/AI工具/05_辅助工具层/CCSwitch/目录.md`，把专题说明改为以 `2026-05-24` 官方资料为准，并同步调整 4 篇文章的入口文案；第二点：更新 `第一篇_CCSwitch快速上手与核心概念_2026-04.md`，把版本基线从 `v3.14.1` 刷到 `v3.15.0`，补充 Claude Desktop 独立管理面板、Provider Routing Support 标识、Full URL Endpoint Mode、Codex OAuth 实时模型列表与 Claude Code `supports1m` 角色映射，同时修正 `OpenCode` 配置路径和“导出为 SQL”这两处过时表述；第三点：更新 `第二篇_CCSwitch接入中转站与计费排查_2026-04.md`，把“最新版本”从 `v3.13.0` 校正到 `v3.15.0`，并补充新版模型发现、Anthropic 兼容 `/models`、Full URL Endpoint Mode 与模型探测失败时的更稳排障判断；第四点：更新 `第三篇_ClaudeCode对接小米MiMoTokenPlan配置说明_2026-05.md`，补入 MiMo 当前文档对 `mimo-v2.5-pro[1m]` 的 1M 长上下文写法和 `/context` 自检方式；第五点：更新 `第四篇_CCSwitch跨电脑导出导入与云同步实战_2026-05.md`，将核对时间刷新到 `2026-05-24`，并明确本文讨论的是应用内 `JSON` 备份导出路径。",
    },
    {
      category: "问题修复",
      time: "22:25",
      title: "重写 Plugin 系列官方口径并修正命令与 Marketplace 说明",
      summary:
        "按 OpenAI 与 Claude Code 官方资料重写 Plugin 系列 4 篇正文和目录页，集中修正 Codex / Claude Code 的命令入口、Marketplace 名称、manifest 规则与能力边界，避免把两套插件体系混写。",
      content:
        "第一点：重写 `public/notes/AI工具/03_规则机制层/Plugin/目录.md` 与四篇正文，统一把 Plugin 收紧为“打包与分发层”，不再把 Skill、MCP、Rules 与 Plugin 的边界写混；第二点：更新 `第一篇_Plugin插件是什么与为什么_2026-05.md`，修正“Skill 无法对外发布”“所有工具都可一行命令安装”等过于绝对的说法，并把支持现状收敛到已核对的 Codex、Claude Code、Cursor、Windsurf、Kiro 五类工具；第三点：重写 `第二篇_CodexPlugin体系详解与实战_2026-05.md`，改用 `openai/plugins` 官方仓库、本机 `~/.codex/plugins/cache/` 与 `~/.codex/config.toml` 为主线，明确 `codex plugin marketplace add|upgrade|remove` 才是当前可直接确认的 CLI 入口，修正旧稿把 Codex 写成 `/plugin install`、把用户配置误写成 `~/.agents/plugins/marketplace.json`、把 Marketplace 简化成固定“官方/项目/用户三级”的问题；第四点：重写 `第三篇_ClaudeCodePlugin体系详解与实战_2026-05.md`，补入 `claude-plugins-official` 官方市场、`anthropics/claude-plugins-community` 社区市场、`anthropics/claude-code` demo 市场，以及 `user / project / local / managed` 四种 scope，改正旧稿中“每个插件必须有 plugin.json”“最小 manifest 必须含 name/version/description”“/plugin status 是主命令”等过时口径；第五点：重写 `第四篇_Plugin选型指南与团队落地_2026-05.md`，把选型建议改成更贴近工程实践的四层判断，并补上“不要把 Codex 命令写成 Claude Code 命令”“不要把 marketplace 仓库结构和用户配置路径混为一谈”两类高频误区。",
    },
    {
      category: '问题修复',
      time: '22:32',
      title: '校正 Agent Skills 系列对 Cursor 与 Claude 的过时口径',
      summary:
        '重写 Skill 系列目录页和 4 篇正文中关于 Cursor、Claude Code 与 Agent Skills 标准字段的表述，修正“Cursor 只有 rules”“Claude 只有 commands”这类已过时结论，并同步重建站内笔记索引。',
      content:
        '第一点：更新 `public/notes/AI工具/03_规则机制层/Skill/目录.md` 与四篇正文，把复核时间统一刷新到 `2026-05-24`，并把总口径从“Codex/Kiro 用 skills，Cursor 偏 rules，Claude 偏 commands”修正为“各家都已正式支持 skills，但长期规范与快捷入口仍应分别落在 rules / AGENTS / CLAUDE / commands”；第二点：在 `第一篇_AgentSkills开放标准与各工具兼容性全解.md` 中补入 Cursor `2.4` 已官方支持 Agent Skills、Claude Code 已有正式 skills 文档且 custom commands 并入 skills 的结论，同时把 `metadata`、`license`、`compatibility` 从“统一降级字段”改为 Agent Skills 规范层字段；第三点：在 `第二篇_AgentSkills高级用法与进阶技巧.md` 中重分“规范层字段”“产品专属扩展”“版本敏感说法”，避免再把 Claude 已文档化的能力与真正缺乏跨工具共识的能力混写；第四点：在 `第三篇_AgentSkills场景模板与案例库.md` 与 `第四篇_AgentSkills团队协作与社区资源.md` 中改写 Cursor 与 Claude 的落地建议，明确 Cursor 现在是 skills 与 rules 并存、Claude 现在是 skills 为主再按需补 commands；第五点：按仓库规则执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检并成功运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表与搜索能读到这轮修正文案。',
    },
    {
      category: '内容上新',
      time: '22:34',
      title: '新增前端开发搜索资料 MCP 详细推荐清单',
      summary:
        '在 `MCP/02_常用MCP清单` 下新增面向前端开发者的搜索资料型 MCP 推荐稿，结合官方资料详细对比 Context7、Exa、GitHub MCP、Brave Search、Tavily 的定位、场景、优缺点和组合建议。',
      content:
        '第一点：新增 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第二篇_前端开发常用搜索资料MCP推荐_2026-05.md`，按“查官方文档、找最新资料、读源码与 Issue、批量抽取页面内容”四类前端高频场景，详细推荐 `Context7`、`Exa MCP`、`GitHub MCP`、`Brave Search MCP`、`Tavily MCP` 五个资料检索型 MCP，并给出优先级、适用场景、优势局限和组合建议；第二点：更新 `public/notes/AI工具/03_规则机制层/MCP/02_常用MCP清单/第一篇_常用MCP分类与选型总览.md`，为“搜索、阅读与知识检索类 MCP”补上第二篇详细清单入口，让总览页和单篇深挖页形成前后承接；第三点：按仓库规则先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 做 Node 运行时预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表与搜索立刻能检索到这篇新清单；第四点：本次推荐优先采用官方资料与官方仓库核对当前口径，包括 Context7 官方文档、Exa 官方文档、GitHub 官方 MCP 文档与仓库、Brave Search MCP 官方仓库、Tavily MCP 官方文档，尽量避免把过时的社区二手整理直接写进笔记。',
    },
    {
      category: '内容上新',
      time: '23:08',
      title: '补充前端开发常用 Skills 清单并接入 Skill 场景目录',
      summary:
        '新增一篇面向前端开发者的 Skills 推荐清单，按“现成可参考”和“强烈建议自定义”两类整理 `frontend-design`、`browser`、`responsive-debug`、`accessibility-audit`、`component-patterns`、`performance-audit` 的适用场景与优先级，并把它挂到 Skill 场景模板目录下。',
      content:
        '第一点：新增 `public/notes/AI工具/03_规则机制层/Skill/03_场景模板与案例库/补充篇_前端开发常用Skills清单与选型建议_2026-05.md`，围绕“前端开发最常用哪些 skills”这个问题，按“现成可参考”和“更适合自己做”两类整理前端技能清单，重点解释为什么页面实现应优先看 `frontend-design`、真实验收应优先看 `browser`，以及为什么 `responsive-debug`、`accessibility-audit`、`component-patterns`、`performance-audit` 更适合团队自己沉淀；第二点：更新 `public/notes/AI工具/03_规则机制层/Skill/03_场景模板与案例库/第三篇_AgentSkills场景模板与案例库.md`，补一段“延伸阅读”，把这篇前端补充清单接到主文末尾；第三点：更新 `public/notes/AI工具/03_规则机制层/Skill/目录.md`，让根目录页也能直接把“前端开发常用 skills 清单”引导给主人；第四点：本次整理优先依据 Kiro 官方 Agent Skills 文档、Cursor 官方 Agent Skills 文档与 `2.4` 更新说明、Claude Code 官方 skills 文档，以及本机当前可确认存在的 Codex `frontend-design` 与 `browser` skills，不把“官方支持 skills 机制”和“官方已经自带某个前端 skill”混写；第五点：按仓库规则先执行 `pwsh -File scripts/checkNodeRuntime.ps1` 预检，再运行 `npm run generate:index`，同步刷新 `public/notes-index.json` 与 `public/search-index.json`，确保站内列表和搜索立即收录这篇补充清单。',
    },
  ],
};
