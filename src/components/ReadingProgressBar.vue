<template>
  <Teleport to="body">
    <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { calculateScrollProgress } from '../utils/scrollProgress'

const progress = ref(0)
let ticking = false

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight
  
  progress.value = calculateScrollProgress(scrollTop, scrollHeight, clientHeight)
}

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress()
      ticking = false
    })
    ticking = true
  }
}

const reset = () => {
  progress.value = 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

defineExpose({ reset })
</script>

<style>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  z-index: 9999;
  transition: width 0.1s ease-out;
  pointer-events: none;
}
</style>
