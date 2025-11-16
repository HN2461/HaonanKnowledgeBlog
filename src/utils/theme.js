// 主题管理

// 获取当前主题
export function getTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme
  }
  
  // 检测系统主题
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// 设置主题
export function setTheme(theme) {
  localStorage.setItem('theme', theme)
  
  // 触发主题变更事件
  const event = new CustomEvent('theme-change', {
    detail: { isDark: theme === 'dark' }
  })
  window.dispatchEvent(event)
}

// 切换主题
export function toggleTheme() {
  const currentTheme = getTheme()
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
  return newTheme
}

// 监听系统主题变化
export function watchSystemTheme(callback) {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      callback(e.matches ? 'dark' : 'light')
    })
  }
}
