import { describe, expect, it } from 'vitest'
import { buildRootTopics, getRootDirectoryPaths } from '../notePresentation'

describe('notePresentation', () => {
  it('returns root directory paths in tree order', () => {
    const tree = [
      { type: 'directory', path: 'alpha' },
      { type: 'file', path: 'alpha/01-intro.md' },
      { type: 'directory', path: 'beta' }
    ]

    expect(getRootDirectoryPaths(tree)).toEqual(['alpha', 'beta'])
  })

  it('builds root topics with ordered directory paths and aggregated note stats', () => {
    const notes = [
      {
        path: 'beta/topic/02-guide.md',
        date: '2026-04-01',
        lastModified: '2026-04-01T09:00:00+08:00',
        tags: ['api']
      },
      {
        path: 'alpha/01-intro.md',
        date: '2026-03-30',
        lastModified: '2026-03-30T09:00:00+08:00',
        tags: ['basics']
      },
      {
        path: 'alpha/sub/02-advanced.md',
        date: '2026-04-02',
        lastModified: '2026-04-02T09:00:00+08:00',
        tags: ['basics', 'advanced']
      }
    ]

    const topics = buildRootTopics(notes, {
      orderedPaths: ['alpha', 'beta']
    })

    expect(topics.map((topic) => topic.path)).toEqual(['alpha', 'beta'])
    expect(topics[0].notesCount).toBe(2)
    expect(topics[0].latestDate).toBe('2026-04-02')
    expect(topics[0].featuredTags).toEqual(['basics', 'advanced'])
    expect(topics[1].notesCount).toBe(1)
  })
})
