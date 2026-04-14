import { describe, expect, it } from 'vitest'
import { isScrollableElement, resolveScrollableContainer } from '../scrollContainer'

const createMockElement = ({ overflowY = 'auto', clientHeight = 0, scrollHeight = 0 } = {}) => {
  const element = document.createElement('div')
  element.style.overflowY = overflowY

  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: clientHeight
  })

  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight
  })

  return element
}

describe('scrollContainer', () => {
  it('identifies scrollable containers by overflow and height difference', () => {
    const element = createMockElement({
      overflowY: 'auto',
      clientHeight: 320,
      scrollHeight: 640
    })

    expect(isScrollableElement(element)).toBe(true)
  })

  it('ignores containers that only overflow visually but cannot scroll', () => {
    const element = createMockElement({
      overflowY: 'visible',
      clientHeight: 320,
      scrollHeight: 640
    })

    expect(isScrollableElement(element)).toBe(false)
  })

  it('falls back to the first candidate when none of them scroll', () => {
    const first = createMockElement({
      overflowY: 'visible',
      clientHeight: 320,
      scrollHeight: 320
    })
    const second = createMockElement({
      overflowY: 'visible',
      clientHeight: 320,
      scrollHeight: 320
    })

    expect(resolveScrollableContainer(first, second)).toBe(first)
  })

  it('prefers the first candidate that is actually scrollable', () => {
    const first = createMockElement({
      overflowY: 'visible',
      clientHeight: 320,
      scrollHeight: 320
    })
    const second = createMockElement({
      overflowY: 'auto',
      clientHeight: 320,
      scrollHeight: 640
    })

    expect(resolveScrollableContainer(first, second)).toBe(second)
  })
})
