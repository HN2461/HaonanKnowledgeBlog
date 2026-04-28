<template>
  <div id='app' :class="{ 'dark-theme': isDarkTheme }">
    <router-view v-slot='{ Component, route }'>
      <Transition
        name='page-fade'
        mode='out-in'
        @after-enter='scrollToTop'
      >
        <component :is='Component' :key='route.path' />
      </Transition>
    </router-view>
    <TerminalMode ref='terminal' />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import TerminalMode from './components/TerminalMode.vue'
import { getTheme } from './utils/theme'
import { ensureSearchWarmup } from './utils/searchWarmup'

const isDarkTheme = ref(false)
const terminal = ref(null)

const applyThemeClass = (isDark) => {
  document.documentElement.classList.toggle('dark-theme', isDark)
  document.body.classList.toggle('dark-theme', isDark)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
}

const handleThemeChange = (event) => {
  isDarkTheme.value = event.detail.isDark
  applyThemeClass(isDarkTheme.value)
}

onMounted(() => {
  isDarkTheme.value = getTheme() === 'dark'
  applyThemeClass(isDarkTheme.value)
  window.addEventListener('theme-change', handleThemeChange)

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const shouldDeferWarmup = connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType)

  if (shouldDeferWarmup) {
    return
  }

  const scheduleWarmup = () => ensureSearchWarmup()

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(scheduleWarmup, { timeout: 2000 })
  } else {
    window.setTimeout(scheduleWarmup, 1200)
  }
})

onUnmounted(() => {
  window.removeEventListener('theme-change', handleThemeChange)
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

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
