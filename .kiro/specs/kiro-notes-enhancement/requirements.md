# Requirements Document

## Introduction

本功能旨在为 Vue 3 知识博客中的 `public/notes/AI工具/Kiro/` 目录补充完整的 Kiro 学习笔记体系。目前该目录仅有一个极简占位 `目录.md`，缺乏实质内容。需要基于 Kiro 官方文档（https://kiro.dev）搜索并整理真实资料，撰写覆盖 Kiro 核心功能的多篇中文学习笔记，风格参考同目录下 Claude Code 和 Codex 系列，面向中文学习者，最终更新目录并重新生成索引。

---

## Glossary

- **Note_Author**：负责搜索官方资料、撰写和发布笔记的执行角色（本 spec 中为 AI Agent）。
- **Note_File**：存放于 `public/notes/AI工具/Kiro/` 下的 Markdown 笔记文件。
- **Frontmatter**：每篇 Note_File 顶部以 `---` 包裹的 YAML 元信息块，包含 title、date、category、tags、description 字段。
- **Index_Script**：`npm run generate:index` 命令，扫描 `public/notes/` 并生成 `public/notes-index.json`。
- **Directory_File**：`public/notes/AI工具/Kiro/目录.md`，作为该系列的导航入口。
- **Kiro**：Amazon 出品的 AI IDE，具备 Specs、Hooks、Steering、Agent Loop、MCP 等核心功能。
- **Specs**：Kiro 的结构化需求与任务规划系统，包含 requirements、design、tasks 三层文档。
- **Hooks**：Kiro 的自动化触发机制，可在文件保存、Agent 完成等事件后执行自定义操作。
- **Steering**：Kiro 的持久化上下文注入机制，通过 `.kiro/steering/` 目录下的 Markdown 文件向 Agent 注入规则。
- **Agent_Loop**：Kiro 的 AI 自主执行循环，能够读写文件、执行命令、调用工具完成复杂任务。
- **MCP**：Model Context Protocol，Kiro 支持的工具扩展协议，可接入外部数据源和服务。

---

## Requirements

### Requirement 1：官方资料搜索与内容来源策略

**User Story:** As a Note_Author, I want to search and verify Kiro official documentation, so that all note content is accurate and traceable.

#### Acceptance Criteria

1. THE Note_Author SHALL search Kiro official sources including https://kiro.dev, https://docs.kiro.dev, and official GitHub repositories before writing any note.
2. WHEN official documentation is found, THE Note_Author SHALL cite the source URL in each note's header or reference section.
3. IF official documentation for a specific feature cannot be found, THEN THE Note_Author SHALL clearly mark that section as "待补充" and note the limitation.
4. THE Note_Author SHALL verify that all technical claims (commands, config fields, file paths) match the official documentation at time of writing.
5. WHEN a note references a specific Kiro version or feature availability, THE Note_Author SHALL include the date of the documentation snapshot.

---

### Requirement 2：笔记篇数与覆盖范围

**User Story:** As a learner, I want a structured series of Kiro notes covering all core features, so that I can learn Kiro systematically from beginner to advanced.

#### Acceptance Criteria

1. THE Note_Author SHALL produce exactly 6 Note_Files covering the following topics in order:
   - 第一篇：Kiro 快速上手与核心概念（安装、界面、Agent 基础交互）
   - 第二篇：Specs 系统详解（requirements / design / tasks 三层结构与工作流）
   - 第三篇：Steering 与上下文管理（steering 文件、持久规则注入、AGENTS.md 对比）
   - 第四篇：Hooks 自动化机制（事件触发、hook 配置、常见用例）
   - 第五篇：MCP 集成与工具扩展（MCP 协议、配置方式、常用 MCP 服务接入）
   - 第六篇：Kiro 工作流实战与最佳实践（完整项目开发流程、与 Claude Code / Codex 对比）
2. WHEN the series is complete, THE Directory_File SHALL list all 6 notes with navigation links and reading order guidance.
3. THE Note_Author SHALL ensure each note is self-contained and readable independently, while also forming a coherent series when read in order.

---

### Requirement 3：Frontmatter 规范

**User Story:** As a blog system, I want every note to have valid frontmatter, so that the index script can correctly parse and display metadata.

#### Acceptance Criteria

1. THE Note_File SHALL include a Frontmatter block at the very top of the file, enclosed in `---` delimiters.
2. THE Frontmatter SHALL contain all five required fields: `title`, `date`, `category`, `tags`, `description`.
3. THE `title` field SHALL match the H1 heading of the note body semantically.
4. THE `date` field SHALL use the format `YYYY-MM-DD`.
5. THE `category` field SHALL be set to `AI工具` for all Kiro notes.
6. THE `tags` field SHALL contain between 3 and 6 tags as a YAML array, and SHALL include `Kiro` as one of the tags.
7. THE `description` field SHALL be between 60 and 120 Chinese characters, suitable for display in search results and list pages.
8. IF a note contains no attachments, THEN THE Frontmatter SHALL NOT include an `attachments` field.

---

### Requirement 4：笔记内容质量标准

**User Story:** As a learner, I want each note to be detailed, practical, and beginner-friendly, so that I can follow along and apply the knowledge immediately.

#### Acceptance Criteria

1. THE Note_File SHALL be written in Simplified Chinese throughout the body content.
2. THE Note_File SHALL include a `[[toc]]` table of contents directive after the header block.
3. WHEN a feature involves a configuration file or command, THE Note_File SHALL include a code block with the exact syntax and inline comments explaining each field.
4. THE Note_File SHALL be at least 1500 Chinese characters in body length (excluding frontmatter and code blocks).
5. WHEN a concept is introduced for the first time in a note, THE Note_File SHALL provide a plain-language explanation before showing technical details.
6. THE Note_File SHALL include at least one practical example or step-by-step walkthrough per major section.
7. WHERE a feature has known limitations or caveats, THE Note_File SHALL include a "注意事项" or "常见问题" subsection.
8. THE Note_File SHALL use consistent heading levels: H1 for title, H2 for major sections, H3 for subsections.

---

### Requirement 5：文件命名与目录结构

**User Story:** As a blog system, I want note files to follow a consistent naming convention, so that URLs are predictable and the index script can process them correctly.

#### Acceptance Criteria

1. THE Note*File SHALL be named using the pattern `第N篇\_Kiro{主题描述}*{YYYY-MM}.md`, for example `第一篇\_Kiro快速上手与核心概念\_2026-07.md`.
2. THE Note_File SHALL be placed in `public/notes/AI工具/Kiro/` directory.
3. THE Directory_File SHALL be updated to include navigation links in the format `#/note/AI工具/Kiro/{filename_without_extension}`.
4. WHEN all Note_Files are created, THE Note_Author SHALL run the Index_Script (`npm run generate:index`) to regenerate `public/notes-index.json`.
5. THE Note_Author SHALL verify that the Index_Script completes without errors after all files are created.

---

### Requirement 6：目录文件（Directory_File）规范

**User Story:** As a learner, I want a well-organized directory page for the Kiro series, so that I can quickly find the right note and understand the reading order.

#### Acceptance Criteria

1. THE Directory_File SHALL include an update timestamp in the format `> 更新时间：YYYY-MM-DD`.
2. THE Directory_File SHALL include a "推荐阅读顺序" section listing all 6 notes with links and one-line descriptions.
3. THE Directory_File SHALL include a "覆盖主题" section summarizing the key topics across the series.
4. THE Directory_File SHALL include a "快速查找" section mapping common questions to the relevant note.
5. WHEN a new note is added to the series in the future, THE Directory_File SHALL be updated to reflect the addition.
