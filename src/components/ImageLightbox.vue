<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="image-lightbox-overlay"
        @click="onOverlayClick"
      >
        <div class="lightbox-shell" @click.stop>
          <div class="lightbox-toolbar">
            <div class="lightbox-toolbar__meta">
              <span class="lightbox-toolbar__label">{{ imageAlt || '图片预览' }}</span>
              <span class="lightbox-toolbar__scale">{{ Math.round(scale * 100) }}%</span>
            </div>

            <div class="lightbox-toolbar__actions">
              <button type="button" class="lightbox-action" title="缩小" @click="zoomOut">-</button>
              <button type="button" class="lightbox-action" title="还原" @click="resetTransform">重置</button>
              <button type="button" class="lightbox-action" title="放大" @click="zoomIn">+</button>
              <button class="lightbox-close" @click="close" title="关闭">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div
            ref="viewportRef"
            class="lightbox-viewport"
            :class="{
              'is-zoomed': scale > MIN_LIGHTBOX_SCALE,
              'is-dragging': isDragging
            }"
            @wheel.prevent="onWheel"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @pointerleave="onPointerUp"
            @dblclick.prevent="onDoubleClick"
          >
            <img
              ref="imageRef"
              :src="imageSrc"
              :alt="imageAlt"
              :style="imageStyle"
              class="lightbox-image"
              draggable="false"
              @load="onImageLoad"
            />
          </div>

          <div class="lightbox-hint">
            滚轮缩放，按住拖拽平移，双击快速放大/还原
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import {
  clampScale,
  getBoundedPosition,
  getNextScale,
  MIN_LIGHTBOX_SCALE,
  projectPositionForScale
} from '@/utils/lightboxTransform'

const isOpen = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const scale = ref(MIN_LIGHTBOX_SCALE)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const viewportRef = ref(null)
const imageRef = ref(null)
const dragState = ref({
  pointerId: null,
  startX: 0,
  startY: 0,
  startOffsetX: 0,
  startOffsetY: 0
})

const baseSize = computed(() => {
  if (!naturalWidth.value || !naturalHeight.value || !viewportRef.value) {
    return { width: 0, height: 0 }
  }

  const viewportWidth = viewportRef.value.clientWidth
  const viewportHeight = viewportRef.value.clientHeight

  if (!viewportWidth || !viewportHeight) {
    return { width: 0, height: 0 }
  }

  const fitScale = Math.min(
    1,
    viewportWidth / naturalWidth.value,
    viewportHeight / naturalHeight.value
  )

  return {
    width: naturalWidth.value * fitScale,
    height: naturalHeight.value * fitScale
  }
})

const lightboxMetrics = computed(() => ({
  contentWidth: baseSize.value.width,
  contentHeight: baseSize.value.height,
  viewportWidth: viewportRef.value?.clientWidth || 0,
  viewportHeight: viewportRef.value?.clientHeight || 0,
  scale: scale.value
}))

const imageStyle = computed(() => ({
  width: `${baseSize.value.width}px`,
  height: `${baseSize.value.height}px`,
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`
}))

const applyBoundedPosition = (nextPosition) => {
  position.value = getBoundedPosition(nextPosition, lightboxMetrics.value)
}

const resetTransform = () => {
  scale.value = MIN_LIGHTBOX_SCALE
  position.value = { x: 0, y: 0 }
}

const setScale = (nextScale, pointer = { x: 0, y: 0 }) => {
  const boundedScale = clampScale(nextScale)
  const projectedPosition = projectPositionForScale(
    position.value,
    scale.value,
    boundedScale,
    pointer
  )

  scale.value = boundedScale
  applyBoundedPosition(projectedPosition)
}

const zoomIn = () => {
  setScale(scale.value + 0.4)
}

const zoomOut = () => {
  setScale(scale.value - 0.4)
}

const open = async (src, alt = '') => {
  imageSrc.value = src
  imageAlt.value = alt
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  resetTransform()
}

const close = () => {
  isOpen.value = false
  document.body.style.overflow = ''
  isDragging.value = false
  dragState.value.pointerId = null
}

const onImageLoad = () => {
  naturalWidth.value = imageRef.value?.naturalWidth || 0
  naturalHeight.value = imageRef.value?.naturalHeight || 0
  resetTransform()
}

const onOverlayClick = () => {
  close()
}

const onWheel = (event) => {
  if (!viewportRef.value) return

  const rect = viewportRef.value.getBoundingClientRect()
  const pointer = {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2
  }

  setScale(getNextScale(scale.value, event.deltaY), pointer)
}

const onDoubleClick = (event) => {
  if (!viewportRef.value) return

  if (scale.value > MIN_LIGHTBOX_SCALE + 0.01) {
    resetTransform()
    return
  }

  const rect = viewportRef.value.getBoundingClientRect()
  const pointer = {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2
  }

  setScale(2.2, pointer)
}

const onPointerDown = (event) => {
  if (scale.value <= MIN_LIGHTBOX_SCALE || !viewportRef.value) {
    return
  }

  isDragging.value = true
  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startOffsetX: position.value.x,
    startOffsetY: position.value.y
  }

  viewportRef.value.setPointerCapture?.(event.pointerId)
}

const onPointerMove = (event) => {
  if (!isDragging.value || dragState.value.pointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  applyBoundedPosition({
    x: dragState.value.startOffsetX + deltaX,
    y: dragState.value.startOffsetY + deltaY
  })
}

const onPointerUp = (event) => {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  isDragging.value = false
  viewportRef.value?.releasePointerCapture?.(event.pointerId)
  dragState.value.pointerId = null
}

const handleKeydown = (event) => {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    zoomIn()
    return
  }

  if (event.key === '-') {
    event.preventDefault()
    zoomOut()
    return
  }

  if (event.key === '0') {
    event.preventDefault()
    resetTransform()
    return
  }

  if (scale.value <= MIN_LIGHTBOX_SCALE) {
    return
  }

  const STEP = 48

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    applyBoundedPosition({ x: position.value.x + STEP, y: position.value.y })
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    applyBoundedPosition({ x: position.value.x - STEP, y: position.value.y })
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    applyBoundedPosition({ x: position.value.x, y: position.value.y + STEP })
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    applyBoundedPosition({ x: position.value.x, y: position.value.y - STEP })
  }
}

const handleResize = () => {
  if (!isOpen.value) return
  applyBoundedPosition(position.value)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  if (isOpen.value) {
    document.body.style.overflow = ''
  }
})

defineExpose({
  open,
  close,
  isOpen,
  zoomIn,
  zoomOut,
  resetTransform
})
</script>

<style scoped>
.image-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 34%),
    rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(10px);
}

.lightbox-shell {
  width: min(92vw, 1440px);
  height: min(90vh, 960px);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lightbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.74);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.lightbox-toolbar__meta {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.lightbox-toolbar__label {
  max-width: min(48vw, 620px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.94);
  font-size: 0.96rem;
  font-weight: 600;
}

.lightbox-toolbar__scale {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

.lightbox-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lightbox-action,
.lightbox-close {
  height: 38px;
  min-width: 38px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}

.lightbox-close {
  padding: 0;
}

.lightbox-action:hover,
.lightbox-close:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.22);
}

.lightbox-viewport {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.76)),
    rgba(2, 6, 23, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 32px 80px rgba(0, 0, 0, 0.35);
  touch-action: none;
}

.lightbox-viewport.is-zoomed {
  cursor: grab;
}

.lightbox-viewport.is-dragging {
  cursor: grabbing;
}

.lightbox-image {
  display: block;
  max-width: none;
  max-height: none;
  user-select: none;
  -webkit-user-drag: none;
  object-fit: contain;
  transform-origin: center center;
  transition: transform 0.16s ease;
  will-change: transform;
}

.lightbox-viewport.is-dragging .lightbox-image {
  transition: none;
}

.lightbox-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.86rem;
  letter-spacing: 0.02em;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .image-lightbox-overlay {
    padding: 14px;
  }

  .lightbox-shell {
    width: 100%;
    height: 100%;
  }

  .lightbox-toolbar {
    flex-wrap: wrap;
  }

  .lightbox-toolbar__meta,
  .lightbox-toolbar__actions {
    width: 100%;
  }

  .lightbox-toolbar__actions {
    justify-content: space-between;
  }

  .lightbox-toolbar__label {
    max-width: none;
  }
}
</style>
