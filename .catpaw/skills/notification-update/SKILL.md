---
name: notification-update
description: 管理 HaonanKnowledgeBlog 站点通知消息的完整更新流程，包括写入每日变更摘要、归档历史消息、生成通知索引。当用户说"汇总消息""更新消息""写摘要""归档通知""生成通知"或完成代码/内容改动后需要记录变更时使用。
---

# 通知消息更新技能

管理站点的通知消息更新全流程。涉及的核心文件：

| 文件 | 作用 |
|------|------|
| `data/dailyChangeSummary.js` | 当日变更摘要（只保留当天） |
| `data/history/YYYY-MM-DD1_DD2.js` | 历史消息分片（每 10 天一个文件） |
| `data/historyNotifications.js` | 历史消息聚合入口（import + 展开所有分片） |
| `data/manualNotifications.js` | 手动维护的长期公告/置顶通知 |
| `scripts/generateNotifications.js` | 汇总生成 `public/notifications.json` |
| `public/notifications.json` | 前端读取的通知数据（脚本生成，勿手动改） |

## 流程一：写入当日变更摘要

完成代码/内容改动后，向 `data/dailyChangeSummary.js` 追加一条摘要。

### 前置检查

1. 读取 `data/dailyChangeSummary.js`，检查 `date` 字段是否为当天日期。
2. 如果 `date` 不是今天：必须先执行**流程二（归档旧消息）**，再写入当天新摘要。
3. 如果 `date` 已经是今天：直接在 `items` 数组追加。

### 写入规则

- **同一次对话内的多个改动合并为 1 条**，跨次对话才分条写。
- 每次对话最多新增 3 条。
- 必须先执行 `Get-Date -Format "HH:mm"` 获取当前时间填入 `time`，不允许估算。
- `category` 只能从以下四项中选一个：
  - `内容上新`：新增或大幅扩充笔记/文章内容
  - `功能更新`：站点功能、UI、交互、脚本逻辑改动
  - `问题修复`：修复 bug、错误内容、样式异常
  - `系统公告`：重要通知，会置顶展示，谨慎使用
- `title`：简洁标题，建议格式 `<范围>: <变更>`。
- `summary`：一句话摘要（60-120 字）。
- `content`：详细内容，按"第一点/第二点/..."列举，不填时前端回退显示 summary。

### 写入模板

```javascript
export const dailyChangeSummary = {
  date: 'YYYY-MM-DD',
  items: [
    {
      category: '内容上新',
      time: 'HH:mm',
      title: '标题',
      summary: '一句话摘要',
      content: '第一点：...；第二点：...；第三点：...'
    }
  ]
}
```

## 流程二：归档旧消息

当 `data/dailyChangeSummary.js` 的 `date` 不是今天时，必须先归档再写入新内容。

### 归档步骤

1. **确定目标分片文件**：
   - 分片命名规则：`YYYY-MM-DD1_DD2.js`，每 10 天一个。
   - 示例：4 月 1 日→10 日 → `2026-04-01_10.js`；4 月 21 日→30 日 → `2026-04-21_30.js`。
   - 根据旧摘要的 `date` 值计算落在哪个分片。

2. **读取目标分片**：
   - 如果文件已存在：读取现有内容。
   - 如果文件不存在：新建，初始结构见下方模板。

3. **迁移条目**：
   - 将旧 `items` **逐条迁移**到分片中对应日期对象的 `items` 数组。
   - **不得压缩、改写或汇总**，每条明细保留原有 `category`、`time`、`title`、`summary`、`content`。
   - 如果分片中已存在同日期对象（`id: 'history-YYYY-MM-DD'`），合并到同一个 `items` 数组，不重复新增日期对象。
   - 如果不存在同日期对象，新增一个日期对象。

4. **更新 `data/historyNotifications.js`**：
   - 如果新建了分片文件，在 import 列表末尾追加一行：
     ```javascript
     import { history_YYYY_M_D1_D2 } from './history/YYYY-MM-DD1_DD2.js'
     ```
   - 在 `historyNotifications` 数组末尾追加展开：
     ```javascript
     ...history_YYYY_M_D1_D2,
     ```

5. **清空 `data/dailyChangeSummary.js`**：
   - 归档完成后，将文件重置为当天日期的空摘要结构。

### 分片文件模板

```javascript
// 历史消息归档 —— YYYY-MM-DD1 至 YYYY-MM-DD2
// 归档时追加到本文件末尾的数组即可。
export const history_YYYY_M_D1_D2 = [
  {
    id: 'history-YYYY-MM-DD',
    date: 'YYYY-MM-DD',
    items: [
      {
        category: '内容上新',
        time: 'HH:mm',
        title: '标题',
        summary: '摘要',
        content: '详细内容'
      }
    ]
  }
]
```

### category 字段校验

分片中每个 `items` 条目**必须**包含 `category` 字段，值为以下四项之一：
- `内容上新` / `功能更新` / `问题修复` / `系统公告`

缺少 `category` 时前端时间轴回退显示"历史消息"标签，无法按类型分色。

## 流程三：生成通知索引

归档和写入摘要完成后，执行脚本生成前端数据：

```bash
npm run generate:notifications
```

该脚本会：
1. 读取 `dailyChangeSummary.js` + `manualNotifications.js` + `historyNotifications.js` + git log
2. 汇总写入 `public/notifications.json`

如果变更了 `public/notes/` 内容，还需要先执行：

```bash
npm run generate:index
```

## 流程四：汇总消息（用户主动触发）

当用户说"汇总消息"时：

1. 查看当天 git 变动（`git log --oneline --since="today"`）。
2. 查看 `data/dailyChangeSummary.js` 当前内容。
3. 根据实际变动刷新或补充当日分类摘要。
4. 执行 `npm run generate:notifications` 生成最新通知数据。
5. 如果有笔记变更，同时执行 `npm run generate:index`。

## 流程五：添加手动公告

长期公告/置顶通知写在 `data/manualNotifications.js`：

```javascript
export const manualNotifications = [
  {
    id: 'manual-xxx',
    title: '公告标题',
    content: '公告内容',
    date: 'YYYY-MM-DD',
    tag: '手动消息',
    pinned: true  // true=置顶
  }
]
```

当日开发汇总**不要**写进此文件，只写长期保留的公告。

## 完整工作流 Checklist

完成代码改动后按此顺序执行：

```
- [ ] 检查 dailyChangeSummary.js 的 date 是否为今天
- [ ] 如果不是今天：执行归档流程（流程二）
- [ ] 获取当前时间（Get-Date -Format "HH:mm"）
- [ ] 写入当日变更摘要（流程一）
- [ ] 执行 npm run generate:notifications（流程三）
- [ ] 如果变更了 public/notes/：执行 npm run generate:index
```
