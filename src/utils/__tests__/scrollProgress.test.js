import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { calculateScrollProgress } from '../scrollProgress'

describe('calculateScrollProgress', () => {
  /**
   * Feature: reading-experience-enhancement, Property 1: Scroll progress percentage calculation
   * Validates: Requirements 1.1, 1.2
   * 
   * For any scroll position (scrollTop), document height (scrollHeight), and viewport height (clientHeight),
   * the calculated progress percentage SHALL equal Math.min(100, Math.max(0, (scrollTop / (scrollHeight - clientHeight)) * 100)),
   * ensuring the result is always between 0 and 100 inclusive.
   */
  it('should always return a value between 0 and 100 for any valid inputs', () => {
    fc.assert(
      fc.property(
        fc.nat(10000),  // scrollTop: 0 to 10000
        fc.integer({ min: 100, max: 20000 }),  // scrollHeight: 100 to 20000
        fc.integer({ min: 50, max: 2000 }),    // clientHeight: 50 to 2000
        (scrollTop, scrollHeight, clientHeight) => {
          const progress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight)
          
          // Property: result is always between 0 and 100
          expect(progress).toBeGreaterThanOrEqual(0)
          expect(progress).toBeLessThanOrEqual(100)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should calculate correct progress percentage according to formula', () => {
    fc.assert(
      fc.property(
        fc.nat(10000),
        fc.integer({ min: 500, max: 20000 }),
        fc.integer({ min: 100, max: 499 }),
        (scrollTop, scrollHeight, clientHeight) => {
          // Ensure scrollHeight > clientHeight for valid calculation
          const progress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight)
          const maxScroll = scrollHeight - clientHeight
          const expectedProgress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100))
          
          // Property: calculated value matches expected formula
          expect(progress).toBeCloseTo(expectedProgress, 10)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 when scrollHeight equals clientHeight (no scrollable content)', () => {
    fc.assert(
      fc.property(
        fc.nat(1000),
        fc.integer({ min: 100, max: 2000 }),
        (scrollTop, height) => {
          // When scrollHeight === clientHeight, maxScroll is 0
          const progress = calculateScrollProgress(scrollTop, height, height)
          expect(progress).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 100 when scrollTop reaches maxScroll', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 10000 }),
        fc.integer({ min: 100, max: 499 }),
        (scrollHeight, clientHeight) => {
          const maxScroll = scrollHeight - clientHeight
          const progress = calculateScrollProgress(maxScroll, scrollHeight, clientHeight)
          expect(progress).toBe(100)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 when scrollTop is 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 10000 }),
        fc.integer({ min: 100, max: 499 }),
        (scrollHeight, clientHeight) => {
          const progress = calculateScrollProgress(0, scrollHeight, clientHeight)
          expect(progress).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })
})
