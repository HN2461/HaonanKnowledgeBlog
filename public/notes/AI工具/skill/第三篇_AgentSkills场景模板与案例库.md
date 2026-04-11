---
title: Agent Skills 场景模板与案例库
date: 2026-04-11
category: AI工具
tags:
  - Agent Skills
  - SKILL.md
  - 模板
  - 代码审查
  - 部署
  - 文档生成
description: 按场景分类整理的 Agent Skills 完整可用模板，涵盖代码审查、提交规范、部署、文档生成、项目规范、调试诊断六大类，每个模板开箱即用。
---

# Agent Skills 场景模板与案例库

> 所有模板使用标准字段，在 Claude Code、Kiro、Cursor、Codex 等工具中均可直接使用。
> Claude Code 专有字段（`disable-model-invocation`、`context: fork` 等）已在模板中标注。

---

## 一、代码审查类

### 1.1 通用代码审查

```
code-review/
└── SKILL.md
```

```markdown
---
name: code-review
description: Review code for bugs, security vulnerabilities, performance issues, and best practices. Use when asked to review, check, or audit code quality.
---

## 审查维度

### 安全性

- SQL 注入、XSS、CSRF 风险
- 敏感信息硬编码（密钥、密码、token）
- 输入验证是否完整
- 权限检查是否到位

### 正确性

- 边界条件和空值处理
- 错误处理是否完整
- 异步逻辑是否正确（竞态条件、未处理的 Promise）
- 类型安全

### 性能

- 不必要的循环嵌套
- 重复的数据库/API 调用
- 内存泄漏风险

### 可维护性

- 命名是否清晰
- 函数职责是否单一
- 重复代码是否可以抽象
- 注释是否必要且准确

## 输出格式

每个问题按以下格式报告：

**[级别]** 文件名:行号
问题描述
建议修复方式

级别：🔴 严重 / 🟡 警告 / 🔵 建议
```

### 1.2 PR 审查（Claude Code，带实时数据）

```
pr-review/
└── SKILL.md
```

```markdown
---
name: pr-review
description: Review a pull request for code quality, security, and test coverage. Use when reviewing PRs or preparing code for merge.
context: fork
agent: Explore
allowed-tools: Bash(gh *)
disable-model-invocation: true
---

## PR 信息（实时）

- Diff：!`gh pr diff`
- 描述：!`gh pr view`
- 评论：!`gh pr view --comments`
- 变更文件：!`gh pr diff --name-only`

## 审查任务

1. 理解 PR 目的和变更范围
2. 逐文件检查代码质量
3. 识别安全风险
4. 确认测试覆盖率
5. 检查是否有遗漏的边界情况

## 输出

生成结构化审查报告，包含：

- 总体评价（通过 / 需修改 / 阻塞）
- 问题列表（按严重程度排序）
- 改进建议
```

---

## 二、提交规范类

### 2.1 规范化 commit message

```
commit/
└── SKILL.md
```

```markdown
---
name: commit
description: Stage and commit current changes with a well-formatted commit message. Use when ready to commit.
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *) Bash(git diff *)
---

## 提交流程

1. 运行 `git status` 查看变更
2. 运行 `git diff` 理解具体改动
3. 根据变更生成符合规范的 commit message
4. 运行 `git add .` 暂存
5. 运行 `git commit -m "..."` 提交

## Commit Message 规范

格式：`<类型>(<范围>): <描述>`

类型：

- `feat`：新功能
- `fix`：修复 bug
- `docs`：文档变更
- `style`：格式调整（不影响逻辑）
- `refactor`：重构
- `test`：测试相关
- `chore`：构建/工具链

示例：

- `feat(auth): 添加 OAuth2 登录支持`
- `fix(api): 修复用户列表分页错误`
- `docs(readme): 更新安装说明`

描述：中文，动词开头，不超过 50 字，不加句号。
```

### 2.2 生成 CHANGELOG

```
changelog/
└── SKILL.md
```

````markdown
---
name: changelog
description: Generate a CHANGELOG entry from recent git commits. Use when preparing a release or updating CHANGELOG.md.
disable-model-invocation: true
allowed-tools: Bash(git log *) Bash(git tag *)
---

## 生成 CHANGELOG

> 以下 `!` 语法为 Claude Code 专有，其他工具请改用 `allowed-tools` 让 Claude 自行运行 git 命令。

1. 获取最近的 tag：!`git tag --sort=-version:refname | head -5`
2. 获取自上次 tag 以来的提交：!`git log $(git describe --tags --abbrev=0)..HEAD --oneline`

## 输出格式

```markdown
## [版本号] - YYYY-MM-DD

### 新功能

- ...

### 修复

- ...

### 其他

- ...
```
````

按 feat/fix/其他 分类整理提交，去掉无意义的提交（merge、chore 等）。

```

---

## 三、部署类

### 3.1 通用部署检查

```

deploy/
├── SKILL.md
└── scripts/
└── pre-deploy-check.sh

````

`SKILL.md`：

```markdown
---
name: deploy
description: Deploy the application to staging or production. Use when deploying or releasing.
disable-model-invocation: true
allowed-tools: Bash(npm *) Bash(git *) Bash(sh *)
---

## 部署流程

### 部署前检查
> 以下 `!` 语法为 Claude Code 专有，其他工具请让 Claude 自行运行这些命令。

1. 确认当前分支：!`git branch --show-current`
2. 确认最新提交：!`git log --oneline -3`
3. 运行预检脚本：`sh scripts/pre-deploy-check.sh`

### 部署步骤

部署目标：$ARGUMENTS（staging 或 production）

**staging：**
1. `npm run test`
2. `npm run build`
3. `npm run deploy:staging`
4. 验证：访问 staging URL 确认正常

**production：**
1. 确认 staging 已验证
2. `npm run test`
3. `npm run build`
4. `npm run deploy:production`
5. 验证：访问生产 URL，检查关键功能

### 部署后
- 记录部署时间和版本
- 监控错误日志 5 分钟
````

`scripts/pre-deploy-check.sh`：

```bash
#!/bin/bash
echo "=== 部署前检查 ==="

# 检查未提交变更
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 存在未提交的变更，请先提交"
  exit 1
fi

# 检查测试
echo "运行测试..."
npm test -- --run
if [ $? -ne 0 ]; then
  echo "❌ 测试失败，终止部署"
  exit 1
fi

echo "✅ 预检通过"
```

---

## 四、文档生成类

### 4.1 函数/模块文档

```
write-docs/
└── SKILL.md
```

````markdown
---
name: write-docs
description: Generate documentation for functions, classes, or modules. Use when asked to document, add comments, or write JSDoc/docstring.
---

## 文档生成规范

### JavaScript / TypeScript（JSDoc）

```javascript
/**
 * 函数用途（一句话）
 *
 * @param {类型} 参数名 - 参数说明
 * @returns {类型} 返回值说明
 * @throws {Error} 异常情况说明
 *
 * @example
 * // 使用示例
 * const result = functionName(arg);
 */
```
````

### Python（docstring）

```python
def function_name(param: type) -> type:
    """
    函数用途（一句话）

    Args:
        param: 参数说明

    Returns:
        返回值说明

    Raises:
        ValueError: 异常情况说明

    Example:
        >>> result = function_name(arg)
    """
```

## 要求

- 用中文写注释
- 示例要真实可运行
- 异常情况必须说明
- 不写废话注释（如 `# 设置变量 x 为 1`）

```

### 4.2 README 生成

```

write-readme/
├── SKILL.md
└── references/
└── readme-template.md

````

`SKILL.md`：

```markdown
---
name: write-readme
description: Generate or update a README.md for a project. Use when creating a new project README or updating an existing one.
---

## README 生成流程

1. 分析项目结构：了解技术栈、入口文件、配置文件
2. 读取 package.json / pyproject.toml 等获取项目信息
3. 参考模板：[readme-template.md](references/readme-template.md)
4. 生成完整 README

## 必须包含的章节

- 项目名称和一句话描述
- 功能特性（3-5 条）
- 快速开始（安装 + 运行）
- 使用说明
- 配置项说明（如有）
- 贡献指南
- License
````

`references/readme-template.md`：

````markdown
# 项目名称

> 一句话描述

## ✨ 功能特性

- 特性 1
- 特性 2

## 🚀 快速开始

### 安装

```bash
npm install
```
````

### 运行

```bash
npm run dev
```

## 📖 使用说明

...

## ⚙️ 配置

| 配置项 | 说明 | 默认值 |
| ------ | ---- | ------ |
| ...    | ...  | ...    |

## 🤝 贡献

欢迎提交 Issue 和 PR。

## 📄 License

MIT

```

---

## 五、项目规范类

### 5.1 前端代码规范

```

frontend-conventions/
└── SKILL.md

````

```markdown
---
name: frontend-conventions
description: Frontend coding conventions for this project. Use when writing React/Vue components, CSS, or frontend JavaScript.
---

## 组件规范（React）

- 使用函数组件 + Hooks，不用 class 组件
- Props 用 TypeScript interface 定义，放在组件文件顶部
- 组件文件名 PascalCase，如 `UserCard.tsx`
- 每个文件只导出一个主组件

## 样式规范

- 使用 CSS Modules，文件名 `ComponentName.module.css`
- 类名 camelCase
- 不使用内联样式（动态样式除外）
- 颜色、间距使用 CSS 变量

## 状态管理

- 组件内状态用 `useState`
- 跨组件共享状态用 Context 或 Zustand
- 服务端状态用 React Query

## 命名规范

- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 类型/接口：PascalCase
- 事件处理函数：`handle` 前缀，如 `handleSubmit`

## 禁止事项

- 不直接修改 props
- 不在 render 里定义函数（用 useCallback）
- 不忽略 ESLint 警告（除非有充分理由并加注释）
````

### 5.2 API 设计规范

```
api-conventions/
└── SKILL.md
```

````markdown
---
name: api-conventions
description: REST API design conventions for this project. Use when designing or implementing API endpoints.
---

## URL 规范

- 资源名用复数名词：`/users`、`/orders`
- 层级关系用路径：`/users/{id}/orders`
- 动作用 HTTP 方法，不用动词 URL

## HTTP 方法

| 方法   | 用途     | 示例                 |
| ------ | -------- | -------------------- |
| GET    | 查询     | `GET /users`         |
| POST   | 创建     | `POST /users`        |
| PUT    | 全量更新 | `PUT /users/{id}`    |
| PATCH  | 部分更新 | `PATCH /users/{id}`  |
| DELETE | 删除     | `DELETE /users/{id}` |

## 响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```
````

错误响应：

```json
{
  "code": 40001,
  "message": "用户不存在",
  "data": null
}
```

## 状态码

- `200`：成功
- `201`：创建成功
- `400`：请求参数错误
- `401`：未认证
- `403`：无权限
- `404`：资源不存在
- `500`：服务器错误

## 分页

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

```

---

## 六、调试诊断类

### 6.1 错误诊断

```

debug/
└── SKILL.md

````

```markdown
---
name: debug
description: Diagnose and fix errors, bugs, and unexpected behavior. Use when encountering errors, exceptions, or incorrect output.
---

## 诊断流程

### 第一步：理解错误
- 完整错误信息是什么？
- 错误发生在哪个文件/行号？
- 什么操作触发了这个错误？
- 是否可以稳定复现？

### 第二步：定位根因
- 检查错误堆栈，找到最初抛出的位置
- 检查相关变量的值（在错误发生前后）
- 检查最近的代码变更（`git log --oneline -10`）
- 检查依赖版本是否有变化

### 第三步：修复
- 最小化修改，只改必要的部分
- 修复后验证原始场景不再报错
- 检查修复是否引入新问题

### 第四步：防止复发
- 是否需要加单元测试？
- 是否需要加错误处理？
- 是否需要加日志？

## 常见错误模式

- `undefined is not a function`：检查对象是否为 null/undefined
- `Cannot read property of undefined`：检查链式访问，用可选链 `?.`
- `CORS error`：检查后端 CORS 配置
- `Module not found`：检查路径和依赖安装
- `Promise rejection`：检查 async/await 的 try/catch
````

### 6.2 性能分析

```
perf-audit/
└── SKILL.md
```

```markdown
---
name: perf-audit
description: Analyze and optimize code performance. Use when code is slow, has high memory usage, or needs performance optimization.
---

## 性能分析维度

### 时间复杂度

- 识别 O(n²) 或更高复杂度的循环
- 检查是否有可以用 Map/Set 替代数组查找的场景
- 检查递归是否有记忆化优化

### 数据库/API 调用

- 是否有 N+1 查询问题
- 是否有可以批量处理的串行请求
- 是否缺少必要的索引

### 内存

- 是否有未清理的事件监听器
- 是否有大对象被意外保留在闭包中
- 是否有无限增长的缓存

### 前端特有

- 是否有不必要的重渲染（React.memo、useMemo、useCallback）
- 是否有大列表未做虚拟化
- 是否有未懒加载的大模块

## 输出

列出性能问题，按影响程度排序，每条给出：

- 问题描述
- 预估影响
- 具体优化方案
- 代码示例
```

---

## 七、模板速查表

| 场景           | skill 名               | 是否需要 disable-model-invocation | 是否建议 context: fork |
| -------------- | ---------------------- | --------------------------------- | ---------------------- |
| 代码审查       | `code-review`          | ❌ 自动触发更好                   | ❌                     |
| PR 审查        | `pr-review`            | ✅ 手动控制时机                   | ✅ 需要 gh CLI         |
| 提交代码       | `commit`               | ✅ 防止误触发                     | ❌                     |
| 生成 CHANGELOG | `changelog`            | ✅                                | ❌                     |
| 部署           | `deploy`               | ✅ 必须手动                       | ❌                     |
| 写文档         | `write-docs`           | ❌                                | ❌                     |
| 写 README      | `write-readme`         | ❌                                | ❌                     |
| 前端规范       | `frontend-conventions` | ❌ 背景知识类                     | ❌                     |
| API 规范       | `api-conventions`      | ❌ 背景知识类                     | ❌                     |
| 调试           | `debug`                | ❌                                | ❌                     |
| 性能分析       | `perf-audit`           | ❌                                | ✅ 可选                |

---

## 参考资料

- [Agent Skills 官方规范](https://agentskills.io/specification)
- [OpenAI Skills Catalog](https://github.com/openai/skills)
- [LobeHub Skills Marketplace](https://lobehub.com/skills)
- [Playbooks Skills](https://playbooks.com/skills)
