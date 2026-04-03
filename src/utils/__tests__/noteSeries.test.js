import { describe, expect, it } from 'vitest'
import {
  buildCategoryBreadcrumbs,
  getAdjacentNotes,
  getImmediateChildCategoryName,
  getImmediateChildCategoryPath,
  getNoteDirectoryPath,
  getPrimarySeriesName,
  getSequenceLabel,
  groupNotesByImmediateChild
} from '../noteSeries'

describe('noteSeries', () => {
  it('builds breadcrumbs for nested category paths', () => {
    expect(buildCategoryBreadcrumbs('uni-app/微信小程序')).toEqual([
      { name: 'uni-app', path: 'uni-app' },
      { name: '微信小程序', path: 'uni-app/微信小程序' }
    ])
  })

  it('derives note directory and primary series from note path', () => {
    const note = {
      path: 'uni-app/微信小程序/03-能力实战.md'
    }

    expect(getNoteDirectoryPath(note)).toBe('uni-app/微信小程序')
    expect(getPrimarySeriesName(note)).toBe('微信小程序')
  })

  it('extracts immediate child categories relative to a parent path', () => {
    expect(getImmediateChildCategoryPath('uni-app/微信小程序/进阶', 'uni-app')).toBe('uni-app/微信小程序')
    expect(getImmediateChildCategoryName('uni-app/微信小程序/进阶', 'uni-app')).toBe('微信小程序')
  })

  it('keeps adjacent notes inside a sequence ordered series', () => {
    const notes = [
      { path: 'uni-app/微信小程序/03-能力实战.md', filename: '03-能力实战.md' },
      { path: 'uni-app/微信小程序/01-底层逻辑.md', filename: '01-底层逻辑.md' },
      { path: 'uni-app/微信小程序/02-工程结构.md', filename: '02-工程结构.md' }
    ]

    const result = getAdjacentNotes(notes, 'uni-app/微信小程序/02-工程结构.md')

    expect(result.index).toBe(1)
    expect(result.prev?.filename).toBe('01-底层逻辑.md')
    expect(result.next?.filename).toBe('03-能力实战.md')
  })

  it('groups notes by immediate child directory under a root topic', () => {
    const notes = [
      {
        path: 'uni-app/通用基础/01-是什么.md',
        filename: '01-是什么.md'
      },
      {
        path: 'uni-app/微信小程序/01-底层逻辑.md',
        filename: '01-底层逻辑.md'
      },
      {
        path: 'uni-app/微信小程序/02-工程结构.md',
        filename: '02-工程结构.md'
      }
    ]

    const groups = groupNotesByImmediateChild(notes, 'uni-app')

    expect(groups.map((group) => group.path)).toEqual([
      'uni-app/通用基础',
      'uni-app/微信小程序'
    ])
    expect(groups[1].notes.map((note) => note.filename)).toEqual([
      '01-底层逻辑.md',
      '02-工程结构.md'
    ])
  })

  it('formats a two-digit sequence label from filename order', () => {
    expect(getSequenceLabel({ filename: '3-能力实战.md' })).toBe('03')
    expect(getSequenceLabel({ filename: '补充说明.md' })).toBe('')
  })
})
