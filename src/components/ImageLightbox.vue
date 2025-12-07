<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div 
        v-if="isOpen" 
        class="image-lightbox-overlay"
        @click="close"
      >
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="close" title="关闭">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <img 
            :src="imageSrc" 
            :alt="imageAlt"
            :style="imageStyle"
            class="lightbox-image"
            @load="onImageLoad"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const isOpen = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')
const naturalWidth = ref(0)
const naturalHeight = ref(0)

/**
 * 计算图片显示尺寸
 * 最大为视口的 90%，保持宽高比
 */
const imageStyle = computed(() => {
  if (!naturalWidth.value || !naturalHeight.value) {
    return {}
  }
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const maxWidth = viewportWidth * 0.9
  const maxHeight = viewportHeight * 0.9
  
  const scale = Math.min(
    1,
    maxWidth / naturalWidth.value,
    maxHeight / naturalHeight.value
  )
  
  return {
    width: `${naturalWidth.value * scale}px`,
    height: `${naturalHeight.value * scale}px`
  }
})

const open = (src, alt = '') => {
  imageSrc.value = src
  imageAlt.value = alt
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const onImageLoad = (e) => {
  naturalWidth.value = e.target.naturalWidth
  naturalHeight.value = e.target.naturalHeight
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

// 监听窗口大小变化，重新计算图片尺寸
const handleResize = () => {
  if (isOpen.value) {
    // 触发 computed 重新计算
    naturalWidth.value = naturalWidth.value
  }
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

defineExpose({ open, close, isOpen })
</script>

<style scoped>
.image-lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: zoom-out;
}

.lightbox-content {
  position: relative;
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-image {
  display: block;
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
}

/* 过渡动画 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-active .lightbox-image,
.lightbox-leave-active .lightbox-image {
  transition: transform 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .lightbox-image {
  transform: scale(0.9);
}

.lightbox-leave-to .lightbox-image {
  transform: scale(0.9);
}
</style>
