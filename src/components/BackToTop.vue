<template>
  <transition name="fade">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" aria-label="返回顶部">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-hover);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 50;
}

.back-to-top:hover {
  background-color: var(--primary-hover);
  transform: translateY(-4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
