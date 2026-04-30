---
title: 第九篇：Codex 本地数据目录详解（关键文件与 Rules 深入版）
date: 2026-03-10
category: AI工具
tags:
  - Codex
  - 本地数据目录
  - auth.json
  - Rules
  - 日志
description: 深入拆解 Codex 本地 .codex 目录中的认证、配置、规则、技能和日志文件，帮助排查登录、权限、命令执行与团队规范相关问题。
---

# 第九篇：Codex 本地数据目录详解（关键文件与 Rules 深入版）

> 更新时间：2026-03-10  
> 定位：本机 Codex “关键文件与安全边界”讲透。  
> 适用：你需要排查登录、配置、权限或命令执行问题时。

章节导航（点击跳转）：

[[toc]]

---

## 0. 先讲清一件事：`.codex` 到底是什么

`C:\Users\Administrator\.codex` 是 Codex 桌面应用的本地数据目录。  
它不是项目代码，也不是缓存垃圾桶，而是 **“账号认证 + 全局配置 + 规则 + 技能库 + 运行日志”** 的落地位置。  
所以这里的每个关键文件，都会直接影响 Codex 是否能正常用、能不能执行命令、以及是否符合你的团队规范。

### 0.1 读者说明（很重要）
- 本文出现的配置、路径与规则示例，均来自作者电脑的 Codex 本地数据目录，仅作为“示例参考”。  
- 你的电脑实际内容可能不同，请以自己的 `.codex` 文件为准。

---

## 1. `C:\Users\Administrator\.codex\auth.json`

### 1.1 作用
保存 Codex 的认证信息，客户端发起请求时会读取它。

### 1.2 本机当前内容（原样）
```json
{
  "OPENAI_API_KEY": "4HW9J8S0-NBN9-3ZKP-UYJJ-1ZEHGFVQPVRV",
  "auth_mode": "apikey"
}
```

### 1.3 字段逐条解释
| 字段 | 含义 | 在本机的值 | 影响 |
| --- | --- | --- | --- |
| auth_mode | 认证方式标记 | apikey | 决定 Codex 使用哪种鉴权流程 |
| OPENAI_API_KEY | API Key 字符串 | 4HW9J8S0-NBN9-3ZKP-UYJJ-1ZEHGFVQPVRV | 作为身份凭据参与请求 |

### 1.4 常见问题与排查
| 现象 | 可能原因 | 优先检查 |
| --- | --- | --- |
| 请求提示鉴权失败 | key 失效或被替换 | `OPENAI_API_KEY` 是否正确 |
| 账户切换后仍是旧账号 | 文件未刷新 | 重新登录或手动更新 |

### 1.5 与其他文件的关系
`config.toml` 里 `experimental_bearer_token` 与该文件的 `OPENAI_API_KEY` 在本机是同一个值，说明认证凭据被多处引用。  
因此改 key 时必须同时确认配置是否同步。

---

## 2. `C:\Users\Administrator\.codex\config.toml`

### 2.1 作用
Codex 的全局配置文件，决定“模型用哪个、服务端去哪、功能开不开、MCP 怎么启动、工作区信任级别”。

### 2.2 文件格式说明
TOML 是一种人类可读的配置格式，语法简单、结构清晰，非常适合写配置。

### 2.3 本机当前配置（原样）
```toml
model_provider = "yunyi"
model = "gpt-5.2-codex"
model_reasoning_effort = "xhigh"
model_context_window = 1000000
model_auto_compact_token_limit = 900000
service_tier = "fast"

[model_providers.yunyi]
name = "yunyi"
base_url = "https://yunyi.cfd/codex"
wire_api = "responses"
experimental_bearer_token = "4HW9J8S0-NBN9-3ZKP-UYJJ-1ZEHGFVQPVRV"
requires_openai_auth = true

[features]
fast_mode = true
enable_request_compression = true

[model_providers.sub2api]
name = "sub2api"
base_url = "https://ai.rpcod.com"
wire_api = "responses"
requires_openai_auth = true

[projects.'\\?\C:\Users\Administrator\Desktop\git项目\wisdomCampusClient（PC）']
trust_level = "trusted"

[projects.'C:\Users\Administrator']
trust_level = "trusted"

[projects.'C:\Windows\system32']
trust_level = "trusted"

[projects.'\\?\C:\Users\Administrator\Desktop\git项目\wisdomCampusApp（小程序）']
trust_level = "trusted"

[projects.'C:\Windows\System32']
trust_level = "trusted"

[projects.'\\?\C:\Users\Administrator\Desktop\知识库\HaonanKnowledgeBlog']
trust_level = "trusted"

[windows]
sandbox = "elevated"

[notice.model_migrations]
"gpt-5.2-codex" = "gpt-5.3-codex"
"gpt-5.3-codex" = "gpt-5.4"

[mcp_servers]

[mcp_servers.chrome-devtools]
command = "cmd"
args = ["/c", "npx", "-y", "chrome-devtools-mcp@latest", "--no-usage-statistics"]
env = { SystemRoot = "C:\\Windows", PROGRAMFILES = "C:\\Program Files", npm_config_cache = "C:\\Users\\Administrator\\.codex\\npm-cache", CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS = "1" }
startup_timeout_ms = 20000
```

### 2.4 顶层字段解释（按本机配置）
| 字段 | 作用 | 本机值 | 你能直观感受到的影响 |
| --- | --- | --- | --- |
| model_provider | 当前模型提供方标识 | "yunyi" | 决定请求走哪个服务端 |
| model | 模型名称 | "gpt-5.2-codex" | 影响响应能力与价格策略 |
| model_reasoning_effort | 推理强度/深度配置项 | "xhigh" | 影响推理质量与延迟 |
| model_context_window | 上下文窗口上限 | 1000000 | 决定能放多长上下文 |
| model_auto_compact_token_limit | 自动压缩触发阈值 | 900000 | 接近上限会自动压缩 |
| service_tier | 服务速度档位 | "fast" | 影响响应延迟 |

### 2.5 分组解释（重点）
| 分组 | 作用 | 本机关键字段 |
| --- | --- | --- |
| [model_providers.yunyi] | 主提供方连接信息 | base_url, wire_api, experimental_bearer_token |
| [model_providers.sub2api] | 备用提供方配置 | base_url, wire_api |
| [features] | 功能开关 | fast_mode, enable_request_compression |
| [projects.*] | 工作区信任级别 | trust_level |
| [windows] | Windows 沙箱策略 | sandbox |
| [notice.model_migrations] | 模型迁移提示 | "gpt-5.2-codex" -> "gpt-5.3-codex" |
| [mcp_servers.chrome-devtools] | MCP 启动配置 | command, args, env, startup_timeout_ms |

### 2.6 `mcp_servers.chrome-devtools` 分组详解
| 字段 | 作用 | 本机值 |
| --- | --- | --- |
| command | 启动命令 | "cmd" |
| args | 启动参数 | ["/c", "npx", "-y", "chrome-devtools-mcp@latest", "--no-usage-statistics"] |
| env | 环境变量 | SystemRoot, PROGRAMFILES, npm_config_cache, CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS |
| startup_timeout_ms | 启动超时 | 20000 |

### 2.7 常见问题与排查
| 现象 | 可能原因 | 优先检查 |
| --- | --- | --- |
| 连接失败 | base_url 或 token 无效 | [model_providers.*] |
| 功能不生效 | 相关开关未打开 | [features] |
| 命令权限不足 | 工作区未被信任 | [projects.*] |
| MCP 启动失败 | npm 或命令参数异常 | [mcp_servers.chrome-devtools] |

---

## 3. `C:\Users\Administrator\.codex\AGENTS.md`

### 3.1 作用
这是 Codex 的“团队工作规约”，用于约束编码风格、注释规则、编码格式与提交习惯。

### 3.2 来源说明（解决中文乱码）
这份 `AGENTS.md` 是我从他人处拿到的“防乱码版本”，核心目的是：  
统一编码与注释规范，避免 Codex 输出或写入文件时出现中文乱码、BOM 头或不可读字符。

### 3.3 本机规则要点（逐条解释）
| 规则主题 | 内容摘要 | 为什么重要 |
| --- | --- | --- |
| 统一编码 | 全部文件 UTF-8 无 BOM | 避免跨系统乱码 |
| 中文内容规范 | 中文注释必须可读 | 避免排错困难 |
| 注释规范 | 说明“为什么这样做” | 便于维护 |
| Java 文件保存规则 | Java 文件 UTF-8 无 BOM | 避免 `\\ufeff` 编译报错 |
| \\ufeff 处理规则 | BOM 报错排查流程 | 快速定位问题 |
| 提交前检查 | 编译 + 人工检查 | 先暴露问题 |
| 变更原则 | 逻辑与注释分开提交 | 便于回溯 |

### 3.4 维护建议
- 只保留“必须遵守”的规则，避免冗长。
- 团队规则更新后及时同步，否则不同人结果会不一致。

### 3.5 附：本机 AGENTS.md 原文（保持文件一致）
```
\# Global Engineering Rules



\## 中文、注释、编码、BOM 规则



\### 1. 统一编码

\- 所有源码与配置文件统一使用 UTF-8（无 BOM）。

\- 禁止使用 UTF-8 with BOM、GBK、ANSI 等编码混用。

\- 全局/项目级编码统一设置为 UTF-8。

\- 属性文件（`.properties`）默认编码统一为 UTF-8。

\- 创建 UTF-8 格式文件时，必须确保为“无 BOM”格式。



\### 2. 中文内容规范

\- 中文注释、日志、文档必须保证可读，禁止出现乱码（如“鍥藉”等乱码字符）。

\- 发现乱码时，优先检查文件实际编码与 IDE 显示编码是否一致。



\### 3. 注释规范

\- 保留已有业务注释，不随意删除历史说明和关键 `//` 注释块。

\- 新增代码必须补充必要注释，核心说明“为什么这样做”，避免空泛注释（如仅写“处理数据”）。

\- 接口方法注释至少包含：用途、参数说明、返回值说明、异常/边界行为说明。



\### 4. Java 文件保存规则

\- 保存 Java 文件时强制使用 UTF-8 no BOM 格式。

\- 批量修改文件后，必须抽查文件头字节（确认无 `EF BB BF` 这三个 BOM 标识字节）。



\### 5. java: 非法字符: '\\ufeff' 处理规则

该报错核心原因为文件包含 BOM 头，处理步骤：

1\. 定位报错的 Java 文件；

2\. 使用工具移除文件头的 BOM 标识；

3\. 批量扫描同目录下所有 `.java` 文件，排查是否存在同类问题；

4\. 重新编译文件验证问题是否解决。



\### 6. 工具链与提交前检查

\- IDE 默认编码设置为 UTF-8，且关闭“UTF-8 with BOM”选项。

\- 代码提交前执行一次编译（如 `mvn -DskipTests compile`），提前暴露编码/注释问题。

\- 若涉及注释修改，提交前人工检查中文可读性与注释完整性。



\### 7. 变更原则

\- 功能改动与注释改动尽量分开提交，便于后续回溯变更记录。

\- 修复编码问题时，不修改业务逻辑，仅做“移除 BOM/调整编码”的最小必要修改。
```

---

## 4. `C:\Users\Administrator\.codex\rules\default.rules`

### 4.1 作用
这是命令执行白名单文件。  
它描述“哪些命令前缀可以被直接允许执行”，从而控制 Codex 的命令执行权限边界。

### 4.2 规则语法（可读理解）
```
prefix_rule(
  pattern=[可执行文件路径, "-Command", "PowerShell 命令字符串..."],
  decision="allow"
)
```

### 4.3 本机统计
- 规则条数：73  
- 决策类型：全部为 allow  
- 可执行程序：仅 `C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\pwsh.exe`

### 4.4 命令类型分布（本机统计）
| 命令关键词 | 出现次数 | 说明 |
| --- | ---: | --- |
| Get-Content | 47 | 读取文件内容 |
| Select-String | 15 | 文本搜索 |
| rg | 6 | 快速全文搜索 |
| Get-ChildItem | 7 | 列目录/文件 |
| Write-Output | 5 | 输出格式化 |
| git | 1 | 只出现一次 git diff |
| npm / npx | 1 / 1 | 少量构建/执行 |

### 4.5 本机示例（原样截取）
```
prefix_rule(pattern=["C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\pwsh.exe", "-Command", "Get-Location; Get-ChildItem -Force | Select-Object Name,Mode"], decision="allow")
prefix_rule(pattern=["C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\pwsh.exe", "-Command", "$p='C:\Users\Administrator\Desktop\git项目\wisdomCampusClient（PC）\src\views\general\approve_center\formDesigner\index.vue';$i=1;Get-Content -LiteralPath $p | ForEach-Object {('{0,4}: {1}' -f $i,$_);$i++}"], decision="allow")
```

### 4.6 风险提示与建议
- 这是“命令级白名单”，不当配置会放大权限。
- 规则应保持“最小必要原则”，过期规则要及时清理。

---

## 5. `C:\Users\Administrator\.codex\skills\`

### 5.1 作用
技能库目录，用于存放 Codex 内置或扩展的技能资源。  
技能通常由说明文档、脚本与素材组成，用于指导 Codex 完成特定任务。

### 5.2 本机实际结构（简化）
```
skills\
  .system\
    skill-creator\
      SKILL.md
      license.txt
      agents\openai.yaml
      assets\skill-creator.png
      assets\skill-creator-small.svg
      references\openai_yaml.md
      scripts\generate_openai_yaml.py
      scripts\init_skill.py
      scripts\quick_validate.py
    skill-installer\
      SKILL.md
      LICENSE.txt
      agents\openai.yaml
      assets\skill-installer.png
      assets\skill-installer-small.svg
      scripts\github_utils.py
      scripts\install-skill-from-github.py
      scripts\list-skills.py
```

### 5.3 关键文件说明
| 路径 | 作用 |
| --- | --- |
| SKILL.md | 技能说明与使用规则 |
| agents\openai.yaml | 该技能的代理配置 |
| assets\*.png / *.svg | 技能图标与资源 |
| scripts\*.py | 技能辅助脚本 |
| references\*.md | 参考资料 |

### 5.4 使用建议
- `.system` 为系统内置技能目录，建议不要随意改动。
- 自定义技能建议新建目录并保持结构清晰。

---

## 6. 相关格式与概念小知识

### 6.1 TOML
配置文件常用格式，强调可读性与结构化，适合人直接编辑。

### 6.2 JSON Lines
每行一个 JSON 记录，适合日志与流式数据存储。

### 6.3 SQLite WAL
SQLite 使用 WAL 模式会生成 `-wal` 与 `-shm` 文件用于事务日志与共享内存索引。

---

## 参考资料（外部）
- [OpenAI Codex App 介绍](https://openai.com/index/introducing-the-codex-app/)
- [TOML 规范（英文）](https://toml.io/en/v1.1.0)
- [TOML 规范（中文）](https://toml.io/cn/)
- [JSON Lines 规范](https://jsonlines.org/)
- [SQLite WAL 说明](https://sqlite.org/wal.html)
- [SQLite WAL 格式说明](https://www.sqlite.org/walformat.html)
