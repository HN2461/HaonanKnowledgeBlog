// 历史消息聚合入口。
// 实际数据按"每 10 天一个文件"存放在 data/history/ 目录下。
// 归档新内容时，找到对应的分片文件追加即可，不要直接修改本文件。
//
// 分片命名规则：YYYY-MM-DD1_DD2.js，例如：
//   2026-04-01_10.js  → 4 月 1 日至 10 日
//   2026-04-11_20.js  → 4 月 11 日至 20 日
//   2026-04-21_30.js  → 4 月 21 日至 30 日
//
// 新增分片时，在下方 import 列表末尾追加一行，并在 historyNotifications 数组里展开。

import { history_2026_04_01_10 } from './history/2026-04-01_10.js'
import { history_2026_04_11_20 } from './history/2026-04-11_20.js'
import { history_2026_04_21_30 } from './history/2026-04-21_30.js'
import { history_2026_05_01_10 } from './history/2026-05-01_10.js'

export const historyNotifications = [
  ...history_2026_04_01_10,
  ...history_2026_04_11_20,
  ...history_2026_04_21_30,
  ...history_2026_05_01_10,
]
