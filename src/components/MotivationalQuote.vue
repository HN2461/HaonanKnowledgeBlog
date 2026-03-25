<template>
  <div class='motivational-quote'>
    <div class='quote-head'>
      <span class='quote-label'>随机问候</span>
      <button class='quote-refresh' type='button' :disabled='isLoading' @click='loadQuote'>
        {{ isLoading ? '更新中' : '换一句' }}
      </button>
    </div>
    <p class='quote-text' :class="{ 'is-loading': isLoading }">{{ currentQuote }}</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const fallbackQuotes = [
  '学习不是囤积信息，而是让问题下次出现时更从容。',
  '把今天遇到的坑写下来，明天会感谢现在的自己。',
  '知识库的价值，在于需要时能马上找到答案。',
  '把抽象概念写成案例，理解才会真正落地。',
  '记录不是为了显得努力，而是为了真正复用经验。',
  '持续整理，比一次性冲刺更能形成自己的体系。'
]

const currentQuote = ref(fallbackQuotes[new Date().getDate() % fallbackQuotes.length])
const isLoading = ref(false)

let requestController = null

const getRandomFallbackQuote = () => {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
  return fallbackQuotes[randomIndex]
}

const sanitizeQuote = (quote) => {
  return quote.replace(/\s+/g, ' ').trim()
}

const loadQuote = async () => {
  if (requestController) {
    requestController.abort()
  }

  const controller = new AbortController()
  requestController = controller
  isLoading.value = true

  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=i&c=k&encode=text', {
      cache: 'no-store',
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`request failed: ${response.status}`)
    }

    const nextQuote = sanitizeQuote(await response.text())

    if (!nextQuote) {
      throw new Error('empty quote')
    }

    currentQuote.value = nextQuote
  } catch (error) {
    if (error.name === 'AbortError') {
      return
    }

    console.warn('获取随机问候失败，已切换到本地备用文案', error)
    currentQuote.value = getRandomFallbackQuote()
  } finally {
    if (requestController === controller) {
      requestController = null
      isLoading.value = false
    }
  }
}

onMounted(() => {
  // 角落面板使用 v-if 渲染，因此每次重新展开都会拿到一条新问候。
  loadQuote()
})

onUnmounted(() => {
  if (requestController) {
    requestController.abort()
  }
})
</script>

<style scoped>
.motivational-quote {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.14);
  border-radius: 12px;
  background: rgba(var(--primary-color-rgb), 0.035);
}

.quote-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.quote-label {
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.quote-refresh {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.18s ease;
}

.quote-refresh:hover:not(:disabled) {
  color: var(--primary-color);
}

.quote-refresh:disabled {
  cursor: wait;
  opacity: 0.72;
}

.quote-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.quote-text.is-loading {
  color: var(--text-tertiary);
}
</style>
