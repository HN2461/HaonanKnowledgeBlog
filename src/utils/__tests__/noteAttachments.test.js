import { describe, expect, it } from 'vitest'
import {
  buildAttachmentUrl,
  encodePathSegments,
  getAttachmentPreviewType,
  isPreviewableAttachment
} from '../noteAttachments'

describe('noteAttachments', () => {
  it('encodes attachment paths and keeps the configured base path', () => {
    expect(encodePathSegments('CSS/布局 示例/弹性与网格.html')).toBe(
      'CSS/%E5%B8%83%E5%B1%80%20%E7%A4%BA%E4%BE%8B/%E5%BC%B9%E6%80%A7%E4%B8%8E%E7%BD%91%E6%A0%BC.html'
    )

    expect(buildAttachmentUrl('CSS/布局 示例/弹性与网格.html', '/HaonanKnowledgeBlog/')).toBe(
      '/HaonanKnowledgeBlog/notes/CSS/%E5%B8%83%E5%B1%80%20%E7%A4%BA%E4%BE%8B/%E5%BC%B9%E6%80%A7%E4%B8%8E%E7%BD%91%E6%A0%BC.html'
    )
  })

  it('recognizes html attachments from ext or path', () => {
    expect(getAttachmentPreviewType({ ext: 'html' })).toBe('html')
    expect(getAttachmentPreviewType({ ext: '.HTM' })).toBe('html')
    expect(getAttachmentPreviewType({ path: 'CSS/demo/layout-playground.HTML' })).toBe('html')
    expect(isPreviewableAttachment({ path: 'CSS/demo/layout-playground.html' })).toBe(true)
  })

  it('ignores non html attachments', () => {
    expect(getAttachmentPreviewType({ ext: 'zip' })).toBeNull()
    expect(getAttachmentPreviewType({ path: 'CSS/demo/layout-playground.js' })).toBeNull()
    expect(isPreviewableAttachment({ path: 'CSS/demo/layout-playground.pdf' })).toBe(false)
  })
})
