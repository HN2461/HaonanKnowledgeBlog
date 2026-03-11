import { describe, it, expect, beforeEach } from 'vitest'
import {
  STORAGE_KEY,
  DESKTOP_DEFAULT_FONT_SIZE,
  MOBILE_DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  getDefaultFontSize,
  getFontSize,
  setFontSize,
  resetFontSize
} from '../fontSizeStorage'

describe('fontSizeStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return desktop default size when no saved value exists on desktop viewport', () => {
    expect(getFontSize(1366)).toBe(DESKTOP_DEFAULT_FONT_SIZE)
  })

  it('should return mobile default size when no saved value exists on mobile viewport', () => {
    expect(getFontSize(768)).toBe(MOBILE_DEFAULT_FONT_SIZE)
  })

  it('should prioritize saved value when it is valid', () => {
    localStorage.setItem(STORAGE_KEY, '19')

    expect(getFontSize(375)).toBe(19)
    expect(getFontSize(1366)).toBe(19)
  })

  it('should fallback to viewport default size when saved value is invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid')
    expect(getFontSize(375)).toBe(MOBILE_DEFAULT_FONT_SIZE)

    localStorage.setItem(STORAGE_KEY, String(MAX_FONT_SIZE + 1))
    expect(getFontSize(1440)).toBe(DESKTOP_DEFAULT_FONT_SIZE)
  })

  it('should clamp font size into valid range when saving', () => {
    setFontSize(MIN_FONT_SIZE - 5)
    expect(getFontSize(1366)).toBe(MIN_FONT_SIZE)

    setFontSize(MAX_FONT_SIZE + 5)
    expect(getFontSize(1366)).toBe(MAX_FONT_SIZE)
  })

  it('should reset to viewport default size and persist it', () => {
    setFontSize(20)

    const mobileReset = resetFontSize(390)
    expect(mobileReset).toBe(MOBILE_DEFAULT_FONT_SIZE)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(String(MOBILE_DEFAULT_FONT_SIZE))

    const desktopReset = resetFontSize(1440)
    expect(desktopReset).toBe(DESKTOP_DEFAULT_FONT_SIZE)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(String(DESKTOP_DEFAULT_FONT_SIZE))
  })

  it('should return breakpoint-specific value from getDefaultFontSize', () => {
    expect(getDefaultFontSize(375)).toBe(MOBILE_DEFAULT_FONT_SIZE)
    expect(getDefaultFontSize(1024)).toBe(DESKTOP_DEFAULT_FONT_SIZE)
  })
})
