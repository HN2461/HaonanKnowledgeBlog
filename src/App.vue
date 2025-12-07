<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <router-view v-slot="{ Component, route }">
      <Transition 
        name="page-fade" 
        mode="out-in"
        @after-enter="scrollToTop"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkTheme = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(() => {
  // 从 localStorage 读取主题设置
  const savedTheme = localStorage.getItem('theme')
  isDarkTheme.value = savedTheme === 'dark'
  
  // 监听主题切换事件
  window.addEventListener('theme-change', (e) => {
    isDarkTheme.value = e.detail.isDark
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
