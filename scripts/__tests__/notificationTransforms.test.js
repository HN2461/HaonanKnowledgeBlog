import { describe, expect, it } from 'vitest'
import {
  normalizeDailySummaryNotifications,
  normalizeHistoryNotifications
} from '../notificationTransforms'

describe('notificationTransforms', () => {
  it('uses each daily summary item time instead of a fixed 09:00', () => {
    const items = normalizeDailySummaryNotifications(
      {
        date: '2026-04-03',
        items: [
          {
            category: '问题修复',
            time: '22:36',
            title: '根目录入口改为完整根目录导航',
            summary: '首页与搜索面板的根目录入口恢复完整展示。'
          }
        ]
      },
      {
        todayDate: '2026-04-03'
      }
    )

    expect(items).toHaveLength(1)
    expect(items[0].date).toBe('2026-04-03T22:36:00+08:00')
  })

  it('flattens grouped history items into single-line notifications with their own time', () => {
    const items = normalizeHistoryNotifications([
      {
        id: 'history-2026-04-02',
        date: '2026-04-02',
        items: [
          {
            time: '16:10',
            title: '资料导出中心升级为双栏结构',
            summary: '支持单篇、整目录与多篇打包导出。'
          },
          {
            time: '19:58',
            title: '站点头部接入消息通知中心',
            summary: '通知抽屉与详情弹窗上线。'
          }
        ]
      }
    ])

    expect(items).toHaveLength(2)
    expect(items[0].id).toBe('history-2026-04-02-1')
    expect(items[0].date).toBe('2026-04-02T16:10:00+08:00')
    expect(items[0].summary).toBe('支持单篇、整目录与多篇打包导出。')
    expect(items[1].date).toBe('2026-04-02T19:58:00+08:00')
    expect(items[1].category).toBe('历史消息')
  })
})
