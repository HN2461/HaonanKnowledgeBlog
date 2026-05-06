export const MIN_LIGHTBOX_SCALE = 1
export const MAX_LIGHTBOX_SCALE = 5
export const LIGHTBOX_SCALE_STEP = 0.24

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function clampScale(scale) {
  return clamp(Number(scale) || MIN_LIGHTBOX_SCALE, MIN_LIGHTBOX_SCALE, MAX_LIGHTBOX_SCALE)
}

export function getBoundedOffset(offset, contentSize, viewportSize, scale) {
  const safeScale = clampScale(scale)
  const scaledSize = Math.max((Number(contentSize) || 0) * safeScale, 0)
  const safeViewportSize = Math.max(Number(viewportSize) || 0, 0)
  const maxOffset = Math.max((scaledSize - safeViewportSize) / 2, 0)

  if (maxOffset === 0) {
    return 0
  }

  return clamp(Number(offset) || 0, -maxOffset, maxOffset)
}

export function getBoundedPosition(position = {}, metrics = {}) {
  const {
    x = 0,
    y = 0
  } = position

  const {
    contentWidth = 0,
    contentHeight = 0,
    viewportWidth = 0,
    viewportHeight = 0,
    scale = MIN_LIGHTBOX_SCALE
  } = metrics

  return {
    x: getBoundedOffset(x, contentWidth, viewportWidth, scale),
    y: getBoundedOffset(y, contentHeight, viewportHeight, scale)
  }
}

export function getNextScale(currentScale, deltaY) {
  const direction = deltaY < 0 ? 1 : -1
  return clampScale((Number(currentScale) || MIN_LIGHTBOX_SCALE) + direction * LIGHTBOX_SCALE_STEP)
}

export function projectPositionForScale(position = {}, previousScale, nextScale, pointer = {}) {
  const safePrevScale = clampScale(previousScale)
  const safeNextScale = clampScale(nextScale)

  if (safePrevScale === safeNextScale) {
    return {
      x: Number(position.x) || 0,
      y: Number(position.y) || 0
    }
  }

  const ratio = safeNextScale / safePrevScale
  const pointerX = Number(pointer.x) || 0
  const pointerY = Number(pointer.y) || 0
  const currentX = Number(position.x) || 0
  const currentY = Number(position.y) || 0

  return {
    x: pointerX - (pointerX - currentX) * ratio,
    y: pointerY - (pointerY - currentY) * ratio
  }
}
