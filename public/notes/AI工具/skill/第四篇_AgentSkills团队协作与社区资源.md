---
title: Agent Skills 团队协作与社区资源
date: 2026-04-11
category: AI工具
tags:
  - Agent Skills
  - SKILL.md
  - 团队协作
  - 社区资源
  - 分发
  - LobeHub
  - Codex Skills Catalog
description: 讲解如何通过 Git 在团队中共享和管理 skills，如何从社区导入现成 skill，以及企业级分发方案。附主流社区资源导航。
---

# Agent Skills 团队协作与社区资源

---

## 一、为什么要共享 Skills

Skills 的最大价值不是个人使用，而是**把团队的隐性知识变成可复用的显性资产**：

- 新人入职，直接用 `deploy` skill 就能按规范部署，不用问老人
- 代码审查标准写进 `code-review` skill，每次审查结果一致
- 项目规范放在 `frontend-conventions` skill，不用反复在 PR 里纠正同样的问题
- 一个人写好的 skill，整个团队都能用

---

## 二、通过 Git 共享 Skills

### 2.1 项目级 skills（推荐）

把 `.kiro/skills/`（或 `.claude/skills/`）目录提交到 git，所有人 clone 后自动获得：

```
my-project/
├── .kiro/
│   └── skills/
│       ├── code-review/
│       │   └── SKILL.md
│       ├── deploy/
│       │   ├── SKILL.md
│       │   └── scripts/
│       │       └── pre-deploy-check.sh
│       └── frontend-conventions/
│           └── SKILL.md
├── src/
└── package.json
```

`.gitignore` 里**不要**忽略 `.kiro/skills/`，确保它被追踪。

### 2.2 独立 skills 仓库

适合跨项目共享，或者想开源给社区：

```
team-skills/
├── README.md
├── code-review/
│   └── SKILL.md
├── deploy/
│   ├── SKILL.md
│   └── scripts/
│       └── check.sh
└── api-conventions/
    └── SKILL.md
```

各工具从 GitHub 导入的方式：

| 工具        | 导入方式                                                                          |
| ----------- | --------------------------------------------------------------------------------- |
| Kiro IDE    | Kiro 面板 → Agent Steering & Skills → `+` → Import a skill → GitHub URL           |
| Cursor      | Settings → Rules → Add Rule → Remote Rule (Github) → 输入 URL                     |
| Gemini CLI  | `gemini skills install https://github.com/org/repo.git --path skills/code-review` |
| Claude Code | 手动 clone 后复制到 `~/.claude/skills/` 或 `.claude/skills/`                      |

> URL 要指向 skill 的子目录（包含 SKILL.md 的那一层），不能是仓库根目录。

### 2.3 Skills 的版本管理建议

```bash
# 修改 skill 时，像改代码一样走 PR 流程
git checkout -b update/code-review-skill
# 修改 .kiro/skills/code-review/SKILL.md
git add .kiro/skills/
git commit -m "code-review skill: 增加安全审查维度"
git push origin update/code-review-skill
# 提 PR，团队 review 后合并
```

**为什么要 review skill 的变更？**

- skill 影响所有人的 AI 行为，改错了会导致全团队的 AI 输出偏差
- PR 记录了 skill 的演进历史，方便回溯

---

## 三、全局 Skills（个人跨项目使用）

放在全局目录的 skill 在所有项目中都可用：

| 工具        | 全局路径                                                               |
| ----------- | ---------------------------------------------------------------------- |
| Claude Code | `~/.claude/skills/`                                                    |
| Kiro        | `~/.kiro/skills/`                                                      |
| Cursor      | `~/.cursor/skills/`                                                    |
| Codex       | `~/.codex/skills/`                                                     |
| Gemini CLI  | `~/.gemini/skills/` 或 `~/.agents/skills/`（两者等价，后者跨工具通用） |

适合放全局的 skill：

- 个人代码风格偏好
- 通用的 commit / changelog 规范
- 个人常用的调试流程
- 跨项目通用的文档模板

**全局 vs 项目级冲突时**，项目级优先（所有工具一致）。

---

## 四、Gemini CLI 的 skills link 命令

Gemini CLI 提供了一个特别实用的命令，通过 symlink 链接本地 skills 目录，不需要复制文件：

```bash
# 把本地 skills 仓库链接到全局
gemini skills link /path/to/team-skills-repo

# 链接到项目级
gemini skills link /path/to/team-skills-repo --scope workspace

# 查看已链接的 skills
gemini skills list

# 安装特定 skill（复制，不是链接）
gemini skills install https://github.com/org/repo.git --path skills/code-review

# 卸载
gemini skills uninstall code-review
```

symlink 的好处：本地仓库更新后，skill 立即生效，不需要重新导入。

---

## 五、社区资源导航

### 5.1 官方 / 半官方

| 平台                    | 地址                                                             | 说明                                                                         |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| OpenAI Skills Catalog   | [github.com/openai/skills](https://github.com/openai/skills)     | OpenAI 官方维护，分 System / Curated / Experimental 三层，约 35 个精选 skill |
| Kiro Skills（官方示例） | [github.com/kirodotdev/Kiro](https://github.com/kirodotdev/Kiro) | Kiro 官方仓库，含示例 skills                                                 |
| Agent Skills 规范       | [agentskills.io](https://agentskills.io)                         | 标准规范官网，含验证工具                                                     |

### 5.2 社区市场

| 平台                       | 地址                                                                                 | 特点                                              |
| -------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| LobeHub Skills Marketplace | [lobehub.com/skills](https://lobehub.com/skills)                                     | 最大的社区市场，数千个 skill，支持按工具/分类筛选 |
| Playbooks                  | [playbooks.com/skills](https://playbooks.com/skills)                                 | 专注开发工作流，质量较高                          |
| AgentSkillsHub             | [agentskillshub.dev](https://agentskillshub.dev)                                     | 安全审核过的 skill 市场                           |
| DataCamp Top Skills        | [datacamp.com/blog/top-agent-skills](https://www.datacamp.com/blog/top-agent-skills) | 精选 100+ 高质量 skill 列表                       |

### 5.3 OpenAI Skills Catalog 分层说明

```
github.com/openai/skills/
├── system/          # 内置，随 Codex 自动安装（skill-creator、skill-installer）
├── curated/         # OpenAI 审核，可按名称安装
│   ├── git-workflow/
│   ├── code-review/
│   ├── deploy-aws/
│   └── ...（约 35 个）
└── experimental/    # 社区贡献，需 GitHub URL 安装
```

在 Codex 里安装 curated skill：

```
$ codex --enable skills
> /skills install code-review
```

### 5.4 LobeHub 使用技巧

LobeHub 是目前最大的 skill 社区，搜索时可以按工具过滤：

- 搜索框输入关键词（如 `deploy`、`review`、`documentation`）
- 左侧筛选 Compatible Tools（Claude Code / Cursor / Codex 等）
- 每个 skill 页面有 SKILL.md 预览和 GitHub 链接
- 可以直接复制 GitHub URL 导入到各工具

---

## 六、企业级分发

### 6.1 Claude Code 企业管理

Claude Code 支持通过 managed settings 向组织内所有用户分发 skills。具体配置格式以官方最新文档为准，大致思路如下：

- 管理员在 managed settings 里指定 skills 来源仓库
- 可设置强制安装的 skill（用户无法删除）
- 可禁止特定 skill 被使用

> 企业管理功能持续更新，建议参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/settings) 获取最新配置格式。

### 6.2 通过 monorepo 管理

大型团队可以在 monorepo 里统一管理 skills：

```
company-monorepo/
├── packages/
│   ├── frontend/
│   │   └── .claude/skills/    # 前端专用 skills
│   └── backend/
│       └── .claude/skills/    # 后端专用 skills
├── .claude/skills/            # 全项目通用 skills
└── .kiro/skills/              # Kiro 用户的通用 skills
```

Claude Code 支持从嵌套目录自动发现 skills，编辑 `packages/frontend/` 下的文件时，会自动加载 `packages/frontend/.claude/skills/` 里的 skills。

### 6.3 Cursor 的 Remote Rule 导入

Cursor 支持从 GitHub 导入 skill，适合团队统一管理：

1. 把 skills 放在公司 GitHub 仓库
2. 每个开发者：Settings → Rules → Add Rule → Remote Rule (Github)
3. 输入 skill 目录的 GitHub URL
4. Cursor 自动同步更新（仓库更新后重新导入即可）

---

## 七、Skills 质量评估标准

从社区导入 skill 前，建议按以下标准评估：

| 维度             | 检查点                                                |
| ---------------- | ----------------------------------------------------- |
| description 质量 | 是否清晰描述了用途和触发场景？关键词是否充分？        |
| 正文质量         | 步骤是否清晰？是否有具体示例？                        |
| 脚本安全         | scripts/ 里的脚本是否有潜在风险？是否会修改系统文件？ |
| 维护状态         | 最近是否有更新？issues 是否有回应？                   |
| 兼容性           | compatibility 字段是否说明了环境要求？                |
| 许可证           | license 字段是否明确？是否允许商业使用？              |

**安全提示**：导入社区 skill 前，务必阅读 SKILL.md 和 scripts/ 里的所有内容，特别是包含 shell 脚本的 skill。

---

## 八、Skills 与 Steering / Rules 的选择

很多工具同时有 skills 和 steering/rules，容易混淆：

| 特性       | Skills                     | Steering（Kiro）/ Rules（Cursor）/ CLAUDE.md |
| ---------- | -------------------------- | -------------------------------------------- |
| 加载时机   | 按需，匹配时才加载         | 始终加载                                     |
| 适合内容   | 具体工作流、操作步骤       | 项目规范、编码风格、背景信息                 |
| Token 消耗 | 低（只在需要时）           | 高（每次都在上下文）                         |
| 可移植性   | 跨工具通用                 | 工具专有                                     |
| 适合场景   | 部署、审查、生成等具体任务 | 代码风格、命名规范、项目背景                 |

**经验法则**：

- 如果是"每次写代码都需要知道的规范" → Steering / CLAUDE.md
- 如果是"特定任务才需要的操作指南" → Skills

---

## 参考资料

- [OpenAI Skills Catalog](https://github.com/openai/skills)
- [LobeHub Skills Marketplace](https://lobehub.com/skills)
- [Playbooks Skills](https://playbooks.com/skills)
- [AgentSkillsHub](https://agentskillshub.dev)
- [Gemini CLI Skills 管理文档](https://geminicli.com/docs/cli/skills/)
- [Claude Code 企业管理文档](https://docs.anthropic.com/en/docs/claude-code/settings)
