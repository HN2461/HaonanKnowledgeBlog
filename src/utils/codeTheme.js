// 代码主题管理工具

const CODE_THEME_KEY = 'code-theme'

// 可用的代码主题列表
export const CODE_THEMES = [
  {
    id: 'atom-one-dark',
    name: 'Atom One Dark',
    description: 'VSCode 默认深色主题',
    file: 'atom-one-dark.css'
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: 'GitHub 深色主题',
    file: 'github-dark.css'
  },
  {
    id: 'vs2015',
    name: 'Visual Studio 2015',
    description: 'VS2015 经典深色主题',
    file: 'vs2015.css'
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: '经典 Monokai 配色',
    file: 'monokai.css'
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Nord 北欧风主题',
    file: 'nord.css'
  },
  {
    id: 'tokyo-night-dark',
    name: 'Tokyo Night',
    description: '东京夜晚主题',
    file: 'tokyo-night-dark.css'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Night Owl 夜猫子主题',
    file: 'night-owl.css'
  },
  {
    id: 'stackoverflow-dark',
    name: 'Stack Overflow Dark',
    description: 'Stack Overflow 深色主题',
    file: 'stackoverflow-dark.css'
  }
]

// 获取当前代码主题
export function getCurrentCodeTheme() {
  try {
    const saved = localStorage.getItem(CODE_THEME_KEY)
    if (saved && CODE_THEMES.some(t => t.id === saved)) {
      return saved
    }
  } catch (error) {
    console.error('读取代码主题失败:', error)
  }
  return 'vs2015' // 默认主题
}

// 设置代码主题
export function setCodeTheme(themeId) {
  try {
    if (!CODE_THEMES.some(t => t.id === themeId)) {
      console.warn('无效的主题 ID:', themeId)
      return false
    }

    localStorage.setItem(CODE_THEME_KEY, themeId)
    
    // 触发自定义事件通知主题变更
    window.dispatchEvent(new CustomEvent('code-theme-change', {
      detail: { themeId }
    }))
    
    return true
  } catch (error) {
    console.error('保存代码主题失败:', error)
    return false
  }
}

// 动态加载代码主题 CSS
export function loadCodeThemeCSS(themeId) {
  const theme = CODE_THEMES.find(t => t.id === themeId)
  if (!theme) {
    console.warn('主题不存在:', themeId)
    return
  }

  // 移除旧的主题样式
  const oldLink = document.getElementById('code-theme-css')
  if (oldLink) {
    oldLink.remove()
  }

  // 创建新的样式链接
  const link = document.createElement('link')
  link.id = 'code-theme-css'
  link.rel = 'stylesheet'
  link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme.file}`
  
  document.head.appendChild(link)
}

// 初始化代码主题
export function initCodeTheme() {
  const currentTheme = getCurrentCodeTheme()
  loadCodeThemeCSS(currentTheme)
}
