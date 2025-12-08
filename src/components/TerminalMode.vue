<template>
  <Teleport to="body">
    <Transition name="terminal-slide">
      <div v-if="visible" class="terminal-container" @click="handleContainerClick">
        <div class="terminal-window" @click.stop>
          <!-- 终端头部 -->
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="control-btn close" @click="close"></span>
              <span class="control-btn minimize"></span>
              <span class="control-btn maximize"></span>
            </div>
            <div class="terminal-title">Terminal - {{ currentPath }}</div>
          </div>
          
          <!-- 终端主体 -->
          <div ref="terminalBody" class="terminal-body" @click="focusInput">
            <!-- 欢迎信息 -->
            <div v-if="showWelcome" class="welcome-message">
              <pre>{{ welcomeArt }}</pre>
              <p>Welcome to <span class="highlight">HaonanKnowledgeBlog Terminal</span></p>
              <p>Type 'help' for available commands</p>
            </div>
            
            <!-- 历史输出 -->
            <div v-for="(item, index) in outputHistory" :key="index" class="output-item">
              <div v-if="item.type === 'input'" class="input-line">
                <span class="prompt">{{ item.prompt }}</span>
                <span class="command-text">{{ item.text }}</span>
              </div>
              <div v-else-if="item.type === 'output'" class="output-line" v-html="item.text"></div>
              <div v-else-if="item.type === 'error'" class="error-line">{{ item.text }}</div>
            </div>
            
            <!-- 当前输入行 -->
            <div class="input-container">
              <span class="prompt">{{ currentPrompt }}</span>
              <input
                ref="terminalInput"
                v-model="currentInput"
                @keydown="handleKeyDown"
                class="terminal-input"
                spellcheck="false"
              />
              <span class="cursor">█</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const showWelcome = ref(true)
const currentInput = ref('')
const currentPath = ref('~')
const outputHistory = ref([])
const commandHistory = ref([])
const historyIndex = ref(-1)
const terminalBody = ref(null)
const terminalInput = ref(null)
const currentTheme = ref('default')

let notesData = null

// 命令描述
const commandDescriptions = {
  help: '显示帮助信息',
  ls: '列出文章分类',
  cd: '切换目录',
  cat: '查看文章内容',
  open: '在浏览器中打开',
  search: '搜索文章',
  clear: '清屏',
  pwd: '显示当前目录',
  whoami: '显示用户信息',
  date: '显示当前时间',
  echo: '输出文本',
  history: '命令历史',
  theme: '切换主题',
  stats: '博客统计',
  exit: '退出终端'
}

const welcomeArt = `
╔════════════════════════════╗
║   Haonan Knowledge Blog    ║
║      Terminal v1.0.0       ║
╚════════════════════════════╝`

const currentPrompt = computed(() => `[guest@blog ${currentPath.value}]$ `)

// 命令处理器
const commands = {
  help: () => `📚 Available Commands:
  ${Object.keys(commands).map(cmd => `<span style="color: #00bfff">${cmd.padEnd(10)}</span> - ${commandDescriptions[cmd] || 'No description'}`).join('\n  ')}
  
💡 Tips:
  • Use <span style="color: #ff69b4">Tab</span> for auto-completion
  • Use <span style="color: #ff69b4">↑/↓</span> for command history
  • Type <span style="color: #00bfff">theme</span> to change terminal theme`,
  
  ls: async () => {
    await loadNotesData()
    if (!notesData) return 'Error: Failed to load data'
    
    let output = ''
    const categories = notesData.categories || []
    categories.forEach(cat => {
      output += `📁 ${cat.name}/ (${cat.notes.length} files)\n`
    })
    return output || 'No files found'
  },
  
  cd: (args) => {
    if (!args[0]) {
      currentPath.value = '~'
      return ''
    }
    currentPath.value = args[0] === '..' ? '~' : args[0]
    return `Changed to: ${currentPath.value}`
  },
  
  cat: async (args) => {
    if (!args[0]) return 'Usage: cat <filename>'
    await loadNotesData()
    if (!notesData) return 'Error: Failed to load data'
    
    const filename = args[0].replace('.md', '')
    const note = notesData.allNotes.find(n => 
      n.filename?.includes(filename) || n.title?.includes(filename)
    )
    
    if (!note) return `File not found: ${args[0]}`
    return `Title: ${note.title}\nDate: ${note.date}\nCategory: ${note.category}\n\n${note.description}`
  },
  
  open: async (args) => {
    if (!args[0]) return 'Usage: open <filename>'
    await loadNotesData()
    if (!notesData) return 'Error: Failed to load data'
    
    const filename = args[0].replace('.md', '')
    const note = notesData.allNotes.find(n => 
      n.filename?.includes(filename) || n.title?.includes(filename)
    )
    
    if (!note) return `File not found: ${args[0]}`
    
    router.push(`/note/${note.path.replace('.md', '')}`)
    setTimeout(() => { visible.value = false }, 500)
    return `Opening: ${note.title}`
  },
  
  search: (args) => {
    if (!args[0]) return 'Usage: search <query>'
    const query = args.join(' ')
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setTimeout(() => { visible.value = false }, 500)
    return `Searching for: "${query}"`
  },
  
  clear: () => {
    outputHistory.value = []
    showWelcome.value = false
    return null
  },
  
  pwd: () => {
    return `Current directory: <span style="color: #ffbd2e">${currentPath.value}</span>`
  },
  
  whoami: () => {
    return `👤 Guest user\n📧 contact@haonan.blog\n🌐 HaonanKnowledgeBlog`
  },
  
  date: () => {
    return new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long'
    })
  },
  
  echo: (args) => {
    return args.join(' ')
  },
  
  history: () => {
    if (commandHistory.value.length === 0) return 'No command history'
    return commandHistory.value.map((cmd, i) => `${(i + 1).toString().padStart(4)} ${cmd}`).join('\n')
  },
  
  theme: (args) => {
    const theme = args[0] || 'default'
    const themes = ['default', 'matrix', 'ocean', 'sunset']
    
    if (!themes.includes(theme)) {
      return `Available themes: ${themes.join(', ')}`
    }
    
    currentTheme.value = theme
    localStorage.setItem('terminal-theme', theme)
    applyTheme(theme)
    return `Theme changed to: ${theme}`
  },
  
  stats: async () => {
    await loadNotesData()
    if (!notesData) return 'Error: Failed to load data'
    
    const totalWords = notesData.allNotes.reduce((acc, note) => acc + (note.wordCount || 0), 0)
    const categories = notesData.categories?.length || 0
    const articles = notesData.allNotes?.length || 0
    
    return `📊 Blog Statistics:
    Articles: ${articles}
    Categories: ${categories}
    Total Words: ${totalWords.toLocaleString()}
    Avg Words/Article: ${Math.round(totalWords / articles).toLocaleString()}`
  },
  
  exit: () => {
    setTimeout(() => { visible.value = false }, 100)
    return 'Goodbye! 👋'
  }
}

// 加载数据
const loadNotesData = async () => {
  if (notesData) return
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
    notesData = await response.json()
  } catch (error) {
    console.error('Failed to load notes:', error)
  }
}

// Tab自动补全
const handleTabCompletion = () => {
  const input = currentInput.value.trim()
  const parts = input.split(' ')
  const cmd = parts[0]
  
  if (parts.length === 1) {
    // 补全命令
    const matchingCommands = Object.keys(commands).filter(c => c.startsWith(cmd))
    if (matchingCommands.length === 1) {
      currentInput.value = matchingCommands[0] + ' '
    } else if (matchingCommands.length > 1) {
      outputHistory.value.push({
        type: 'output',
        text: `Suggestions: <span style="color: #00bfff">${matchingCommands.join(', ')}</span>`
      })
      scrollToBottom()
    }
  } else if (cmd === 'theme') {
    // 补全主题
    const themes = ['default', 'matrix', 'ocean', 'sunset']
    const matchingThemes = themes.filter(t => t.startsWith(parts[1] || ''))
    if (matchingThemes.length === 1) {
      currentInput.value = `theme ${matchingThemes[0]}`
    } else if (matchingThemes.length > 1) {
      outputHistory.value.push({
        type: 'output',
        text: `Themes: <span style="color: #ff69b4">${matchingThemes.join(', ')}</span>`
      })
      scrollToBottom()
    }
  }
}

// 应用主题
const applyTheme = (theme) => {
  const terminal = document.querySelector('.terminal-body')
  if (!terminal) return
  
  const themes = {
    default: { bg: '#0c0c0c', text: '#00ff00', prompt: '#ffbd2e' },
    matrix: { bg: '#000000', text: '#00ff00', prompt: '#00ff00' },
    ocean: { bg: '#001f3f', text: '#7fdbff', prompt: '#39cccc' },
    sunset: { bg: '#2c1810', text: '#ffdc00', prompt: '#ff851b' }
  }
  
  const t = themes[theme] || themes.default
  terminal.style.backgroundColor = t.bg
  terminal.style.color = t.text
  document.documentElement.style.setProperty('--terminal-prompt-color', t.prompt)
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (terminalBody.value) {
    terminalBody.value.scrollTop = terminalBody.value.scrollHeight
  }
}

// 键盘事件处理
const handleKeyDown = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    handleTabCompletion()
  } else
  if (e.key === 'Enter') {
    e.preventDefault()
    executeCommand()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
    } else {
      historyIndex.value = -1
      currentInput.value = ''
    }
  } else if (e.ctrlKey && e.key === 'c') {
    e.preventDefault()
    currentInput.value = ''
  } else if (e.ctrlKey && e.key === 'l') {
    e.preventDefault()
    commands.clear()
  }
}

// 执行命令
const executeCommand = async () => {
  const input = currentInput.value.trim()
  if (!input) return
  
  outputHistory.value.push({
    type: 'input',
    prompt: currentPrompt.value,
    text: input
  })
  
  commandHistory.value.push(input)
  historyIndex.value = -1
  
  const [cmd, ...args] = input.split(' ')
  currentInput.value = ''
  
  if (commands[cmd]) {
    try {
      const result = await commands[cmd](args)
      if (result !== null) {
        outputHistory.value.push({
          type: 'output',
          text: result
        })
      }
    } catch (error) {
      outputHistory.value.push({
        type: 'error',
        text: `Error: ${error.message}`
      })
    }
  } else {
    outputHistory.value.push({
      type: 'error',
      text: `Command not found: ${cmd}. Type 'help' for commands.`
    })
  }
  
  scrollToBottom()
}

// 公开方法
const open = () => {
  visible.value = true
  nextTick(() => { terminalInput.value?.focus() })
}
const close = () => { visible.value = false }
const focusInput = () => { terminalInput.value?.focus() }
const handleContainerClick = (e) => {
  if (e.target === e.currentTarget) close()
}

// 全局快捷键
const handleGlobalKeyDown = (e) => {
  if (e.ctrlKey && (e.key === '~' || e.key === '`')) {
    e.preventDefault()
    visible.value ? close() : open()
  } else if (visible.value && e.key === 'Escape') {
    close()
  }
}

watch(visible, (newVal) => {
  if (newVal) nextTick(() => focusInput())
})

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown)
  
  // 恢复保存的主题
  const savedTheme = localStorage.getItem('terminal-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
    nextTick(() => applyTheme(savedTheme))
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown)
})

defineExpose({ open, close })
</script>

<style scoped>
.terminal-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.terminal-window {
  width: 100%;
  max-width: 900px;
  height: 600px;
  max-height: 80vh;
  background: #0c0c0c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.control-btn.close { background: #ff5f56; }
.control-btn.minimize { background: #ffbd2e; }
.control-btn.maximize { background: #27c93f; }

.terminal-title {
  flex: 1;
  text-align: center;
  color: #888;
  font-size: 13px;
}

.terminal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  color: #00ff00;
  font-size: 14px;
  line-height: 1.5;
  background: #0c0c0c;
}

.welcome-message {
  margin-bottom: 20px;
  animation: fadeIn 0.5s;
}

.welcome-message pre {
  color: #ffbd2e;
  font-size: 12px;
  margin: 0 0 16px 0;
}

.welcome-message p {
  margin: 4px 0;
  color: #888;
}

.welcome-message .highlight {
  color: #00ff00;
  font-weight: bold;
}

.output-item {
  margin-bottom: 4px;
  animation: typewriter 0.3s;
}

.input-line {
  display: flex;
  color: #fff;
}

.output-line {
  color: #00ff00;
  white-space: pre-wrap;
}

.error-line {
  color: #ff5f56;
}

.input-container {
  display: flex;
  align-items: center;
}

.prompt {
  color: var(--terminal-prompt-color, #ffbd2e);
  margin-right: 8px;
  white-space: nowrap;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  caret-color: transparent;
}

.cursor {
  color: #00ff00;
  animation: blink 1s infinite;
  margin-left: 2px;
}

.terminal-body::-webkit-scrollbar {
  width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-body::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes typewriter {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.terminal-slide-enter-active,
.terminal-slide-leave-active {
  transition: all 0.3s;
}

.terminal-slide-enter-from,
.terminal-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
