import {
  formatNotificationDate,
  formatNotificationMeta,
  normalizeNotificationItem,
  normalizeNotificationsPayload
} from '../notifications'

describe('notifications utilities', () => {
  it('normalizes a notification item with sensible defaults', () => {
    const item = normalizeNotificationItem({
      title: '优化布局',
      content: '调整首页与侧栏布局',
      date: '2026-04-02T10:00:00+08:00',
      category: '功能更新',
      source: 'git',
      shortHash: 'abc123'
    })

    expect(item.title).toBe('优化布局')
    expect(item.summary).toContain('调整首页与侧栏布局')
    expect(item.shortHash).toBe('abc123')
    expect(item.category).toBe('Git 提交')
  })

  it('sorts pinned items before newer regular items', () => {
    const payload = normalizeNotificationsPayload({
      notifications: [
        {
          id: 'latest-git',
          title: '普通更新',
          content: '最新普通更新',
          date: '2026-04-02T10:00:00+08:00',
          pinned: false
        },
        {
          id: 'manual-top',
          title: '置顶公告',
          content: '这个消息需要优先展示',
          date: '2026-03-01T10:00:00+08:00',
          pinned: true
        }
      ]
    })

    expect(payload.notifications[0].id).toBe('manual-top')
    expect(payload.notifications[1].id).toBe('latest-git')
  })

  it('formats notification date and git meta copy', () => {
    expect(formatNotificationDate('2026-04-02T10:00:00+08:00')).toBe('2026.04.02 10:00')
    expect(formatNotificationDate('2026-04-02')).toBe('2026.04.02')
    expect(formatNotificationMeta({
      date: '2026-04-02T10:00:00+08:00',
      category: 'Git 提交',
      source: 'git',
      shortHash: '9e29731'
    })).toBe('2026.04.02 10:00 路 Git 提交 路 #9e29731')
  })

  it('keeps business notifications in their own category', () => {
    const payload = normalizeNotificationsPayload({
      notifications: [
        {
          title: '资料导出中心升级',
          content: '支持多选打包与当前目录导出',
          category: '功能更新',
          source: 'daily-summary',
          date: '2026-04-02T21:07:00+08:00'
        }
      ]
    })

    expect(payload.notifications[0].category).toBe('功能更新')
    expect(payload.notifications[0].tag).toBe('功能更新')
    expect(formatNotificationMeta(payload.notifications[0])).toBe('2026.04.02 21:07')
  })
})
