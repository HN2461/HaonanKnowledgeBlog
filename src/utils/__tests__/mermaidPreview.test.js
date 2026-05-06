import { describe, expect, it } from 'vitest'
import { svgToDataUrl } from '../mermaidPreview'

describe('svgToDataUrl', () => {
  it('encodes svg markup as a data url for lightbox preview', () => {
    const result = svgToDataUrl('<svg viewBox="0 0 10 10"><text>图</text></svg>')

    expect(result.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
    expect(result).toContain(encodeURIComponent('<svg viewBox="0 0 10 10"><text>图</text></svg>'))
  })

  it('returns an empty string for empty markup', () => {
    expect(svgToDataUrl('')).toBe('')
  })
})
