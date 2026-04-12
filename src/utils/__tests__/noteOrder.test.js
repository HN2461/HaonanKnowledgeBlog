import { describe, expect, it } from 'vitest'
import {
  compareByFilenameOrder,
  compareNotesBySequence,
  compareNotesByNewest,
  compareNotesByOldest,
  extractSequenceNumber,
  formatNoteDisplayTitle,
  getNoteOrder,
  stripLeadingSequencePrefix
} from '../noteOrder'

describe('noteOrder', () => {
  it('extracts sequence numbers from common note names', () => {
    expect(extractSequenceNumber('01-intro.md')).toBe(1)
    expect(extractSequenceNumber('第2篇 advanced.md')).toBe(2)
    expect(extractSequenceNumber('第三章 example.md')).toBe(3)
    expect(extractSequenceNumber('appendix.md')).toBeNull()
  })

  it('resolves explicit order from note metadata first', () => {
    expect(getNoteOrder({ order: 3 })).toBe(3)
    expect(getNoteOrder({ 排序: '7' })).toBe(7)
    expect(getNoteOrder({ order: 'abc' })).toBeNull()
  })

  it('orders numbered notes before appendix style notes', () => {
    const filenames = [
      'appendix.md',
      '02-structure.md',
      '01-basics.md'
    ]

    expect(filenames.sort(compareByFilenameOrder)).toEqual([
      '01-basics.md',
      '02-structure.md',
      'appendix.md'
    ])
  })

  it('puts notes with explicit order before filename-based notes', () => {
    const notes = [
      { filename: '08-handbook.md' },
      { filename: 'standalone.md', order: 2 },
      { filename: '01-basics.md', order: 1 }
    ]

    expect(notes.sort(compareNotesBySequence).map((note) => note.filename)).toEqual([
      '01-basics.md',
      'standalone.md',
      '08-handbook.md'
    ])
  })

  it('sorts same-date notes by explicit order before filename order', () => {
    const notes = [
      { filename: '03-api.md', date: '2026-03-31', order: 3 },
      { filename: '01-basics.md', date: '2026-03-31', order: 1 },
      { filename: '02-structure.md', date: '2026-03-31', order: 2 }
    ]

    expect(notes.sort(compareNotesByNewest).map((note) => note.filename)).toEqual([
      '01-basics.md',
      '02-structure.md',
      '03-api.md'
    ])
  })

  it('sorts notes by explicit order regardless of date', () => {
    const notes = [
      { filename: '08-handbook.md', date: '2026-04-02', order: 8 },
      { filename: '02-structure.md', date: '2026-03-31', order: 2 },
      { filename: '01-basics.md', date: '2026-03-30', order: 1 }
    ]

    expect(notes.sort(compareNotesBySequence).map((note) => note.filename)).toEqual([
      '01-basics.md',
      '02-structure.md',
      '08-handbook.md'
    ])
  })

  it('sorts by date asc and keeps explicit order for ties', () => {
    const notes = [
      { filename: '02-structure.md', date: '2026-03-31', order: 2 },
      { filename: '01-basics.md', date: '2026-03-31', order: 1 },
      { filename: '06-stability.md', date: '2026-04-01', order: 6 }
    ]

    expect(notes.sort(compareNotesByOldest).map((note) => note.filename)).toEqual([
      '01-basics.md',
      '02-structure.md',
      '06-stability.md'
    ])
  })

  it('formats display titles with the filename sequence', () => {
    expect(formatNoteDisplayTitle('Uni App Basics', '1-uni-app.md')).toBe('01. Uni App Basics')
    expect(formatNoteDisplayTitle('第2篇 Engineering', '02-engineering.md')).toBe('02. Engineering')
    expect(formatNoteDisplayTitle('Standalone Note', 'standalone.md')).toBe('Standalone Note')
  })

  it('removes sequence prefixes from titles before comparison', () => {
    expect(stripLeadingSequencePrefix('01. Uni App Basics')).toBe('Uni App Basics')
    expect(stripLeadingSequencePrefix('第2篇 API 实战')).toBe('API 实战')
  })
})
