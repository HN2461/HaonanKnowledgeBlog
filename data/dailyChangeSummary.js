// 仅保留“当天”的消息摘要。
// 后续主人说“汇总消息”时，Codex 会基于当天 git / 文件变动刷新这里的内容。
// 规则：
// 1. 只保留当天日期；若 date 不是今天，先清空旧内容再写新内容。
// 2. items 中每条消息都必须带 category，供通知中心分类展示。
// 3. Git 提交不写进这里，Git 会单独作为“Git 提交”分类展示。

export const dailyChangeSummary = {
  date: "2026-04-03",
  items: [],
};
