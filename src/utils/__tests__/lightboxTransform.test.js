import { describe, expect, it } from 'vitest'
import {
  clampScale,
  getBoundedPosition,
  getNextScale,
  LIGHTBOX_SCALE_STEP,
  MAX_LIGHTBOX_SCALE,
  MIN_LIGHTBOX_SCALE,
  projectPositionForScale
} from '../lightboxTransform'

describe('lightboxTransform helpers', () => {
  it('clamps scale into the supported range', () => {
    expect(clampScale(0.2)).toBe(MIN_LIGHTBOX_SCALE)
    expect(clampScale(10)).toBe(MAX_LIGHTBOX_SCALE)
    expect(clampScale(2.5)).toBe(2.5)
  })

  it('keeps panned position within visible bounds', () => {
    const bounded = getBoundedPosition(
      { x: 500, y: -500 },
      {
        contentWidth: 600,
        contentHeight: 400,
        viewportWidth: 300,
        viewportHeight: 200,
        scale: 2
      }
    )

    expect(bounded).toEqual({
      x: 450,
      y: -300
    })
  })

  it('returns zero offsets when content does not exceed the viewport', () => {
    expect(getBoundedPosition(
      { x: 100, y: -100 },
      {
        contentWidth: 100,
        contentHeight: 100,
        viewportWidth: 600,
        viewportHeight: 400,
        scale: 1
      }
    )).toEqual({ x: 0, y: 0 })
  })

  it('computes next scale from wheel direction', () => {
    expect(getNextScale(1, -1)).toBe(1 + LIGHTBOX_SCALE_STEP)
    expect(getNextScale(1.2, 1)).toBe(1)
  })

  it('projects the current pan position around the pointer when zooming', () => {
    expect(projectPositionForScale(
      { x: 0, y: 0 },
      1,
      2,
      { x: 120, y: -40 }
    )).toEqual({
      x: -120,
      y: 40
    })
  })
})
