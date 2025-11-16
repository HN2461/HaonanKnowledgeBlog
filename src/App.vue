<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkTheme = ref(false)

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
</style>
