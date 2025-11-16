<template>
  <div class="motivational-quote">
    <span class="quote-icon">{{ currentIcon }}</span>
    <span class="quote-text">{{ currentQuote }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentQuote = ref('加载中...')
const currentIcon = ref('💡')
const isLoading = ref(true)

// 备用语句库（API失败时使用）
const fallbackQuotes = [
  '学习是一场马拉松，不是短跑',
  '每天进步一点点，就是成功的开始',
  '代码改变世界，学习改变人生',
  '今天的努力，是明天的底气',
  '保持好奇心，永远在路上',
  '不积跬步，无以至千里',
  '坚持学习，时间会给你答案',
  '学习没有捷径，但有方法'
]

// 备用图标库
const fallbackIcons = ['💡', '✨', '🌟', '⭐', '🎯', '🚀', '💪', '📚', '🎓', '🔥']

// 从API获取随机emoji
const fetchEmoji = async () => {
  try {
    // 使用emoji API获取随机emoji
    const categories = ['smileys-emotion', 'people-body', 'animals-nature', 'food-drink', 'travel-places', 'activities', 'objects']
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    
    const response = await fetch(`https://emojihub.yurace.pro/api/random/category/${randomCategory}`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.htmlCode && data.htmlCode[0]) {
        // 将HTML实体转换为emoji
        const emoji = String.fromCodePoint(parseInt(data.htmlCode[0].replace('&#', '').replace(';', '')))
        currentIcon.value = emoji
        console.log('获取emoji成功:', emoji)
      } else {
        throw new Error('emoji数据格式错误')
      }
    } else {
      throw new Error('API请求失败')
    }
  } catch (error) {
    console.warn('获取emoji失败，使用备用图标:', error)
    // 使用备用图标
    const randomIndex = Math.floor(Math.random() * fallbackIcons.length)
    currentIcon.value = fallbackIcons[randomIndex]
  }
}

// 从API获取随机励志语句
const fetchQuote = async () => {
  try {
    // 使用一言API（Hitokoto）- 免费的中文名言API
    const response = await fetch('https://v1.hitokoto.cn/?c=i&c=k&encode=text')
    
    if (response.ok) {
      const quote = await response.text()
      currentQuote.value = quote
      console.log('获取励志语句成功:', quote)
    } else {
      throw new Error('API请求失败')
    }
  } catch (error) {
    console.warn('获取励志语句失败，使用备用语句:', error)
    // 使用备用语句
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
    currentQuote.value = fallbackQuotes[randomIndex]
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 同时获取emoji和励志语句
  fetchEmoji()
  fetchQuote()
})
</script>

<style scoped>
.motivational-quote {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 350px;
  min-width: 200px;
}

.quote-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.quote-text {
  line-height: 1.5;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .motivational-quote {
    max-width: 300px;
  }
  
  .quote-text {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .motivational-quote {
    max-width: 250px;
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .quote-icon {
    font-size: 14px;
  }
  
  .quote-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .motivational-quote {
    display: none;
  }
}
</style>
