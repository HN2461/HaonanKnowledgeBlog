<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <button 
          class="menu-btn" 
          :class="{ 'active': sidebarVisible }"
          @click="$emit('toggle-sidebar')" 
          aria-label="切换侧边栏"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <router-link to="/" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">个人技术博客</span>
        </router-link>
      </div>
      
      <div class="header-center">
        <TimeWeather />
        <MotivationalQuote />
      </div>
      
      <div class="header-right">
        <button class="search-btn" @click="goToSearch" aria-label="搜索">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        
        <button class="theme-btn" @click="toggleTheme" aria-label="切换主题">
          <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
        
        <AuthorProfile />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTheme, toggleTheme as toggle } from '../utils/theme'
import TimeWeather from './TimeWeather.vue'
import MotivationalQuote from './MotivationalQuote.vue'
import AuthorProfile from './AuthorProfile.vue'

const props = defineProps({
  sidebarVisible: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const isDark = ref(false)

defineEmits(['toggle-sidebar'])

const goToSearch = () => {
  router.push('/search')
}

const toggleTheme = () => {
  const newTheme = toggle()
  isDark.value = newTheme === 'dark'
}

onMounted(() => {
  isDark.value = getTheme() === 'dark'
  
  window.addEventListener('theme-change', (e) => {
    isDark.value = e.detail.isDark
  })
})
</script>

<style scoped>
.app-header {
  height: 64px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-theme .app-header {
  background-color: rgba(30, 30, 30, 0.85);
}

.header-content {
  height: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 auto;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex: 1 1 auto;
  min-width: 0;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.menu-btn:hover {
  background-color: var(--bg-secondary);
  transform: scale(1.05);
}

.menu-btn.active {
  background-color: var(--bg-secondary);
  color: var(--primary-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  display: none;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .logo-text {
    display: inline;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  
  .header-left,
  .header-right {
    flex: initial;
  }
}

.search-btn,
.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.search-btn:hover,
.theme-btn:hover {
  background-color: var(--bg-secondary);
  transform: scale(1.05);
}

.search-btn:active,
.theme-btn:active {
  transform: scale(0.95);
}
</style>
