<template>
  <div class="table-of-contents" v-if="toc.length > 0">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-nav">
      <a
        v-for="item in toc"
        :key="item.slug"
        :href="`#${item.slug}`"
        :class="['toc-item', `toc-level-${item.level}`, { active: activeSlug === item.slug }]"
        @click.prevent="scrollToHeading(item.slug)"
      >
        {{ item.text }}
      </a>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  toc: {
    type: Array,
    default: () => []
  }
})

const activeSlug = ref('')
let scrollContainer = null

// 监听 toc 变化
watch(() => props.toc, (newToc) => {
  if (newToc.length > 0) {
    setTimeout(() => {
      updateActiveSlug()
    }, 200)
  }
}, { immediate: true })

const scrollToHeading = (slug) => {
  const element = document.getElementById(slug)
  if (element && scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const scrollTop = scrollContainer.scrollTop
    const offset = elementRect.top - containerRect.top + scrollTop - 100
    
    scrollContainer.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
  }
}

const updateActiveSlug = () => {
  if (!scrollContainer || props.toc.length === 0) return
  
  const containerRect = scrollContainer.getBoundingClientRect()
  const scrollTop = scrollContainer.scrollTop
  
  const headings = props.toc.map(item => {
    const element = document.getElementById(item.slug)
    if (element) {
      const rect = element.getBoundingClientRect()
      const offsetTop = rect.top - containerRect.top + scrollTop
      return {
        slug: item.slug,
        offsetTop: offsetTop,
        viewportTop: rect.top
      }
    }
    return null
  }).filter(Boolean)

  if (headings.length === 0) return

  // 找到当前可见区域内最靠上的标题
  let activeHeading = headings[0]
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].offsetTop <= scrollTop + 100) {
      activeHeading = headings[i]
      break
    }
  }
  
  activeSlug.value = activeHeading.slug
}

let scrollHandler = null

onMounted(() => {
  nextTick(() => {
    // 查找主内容区域的滚动容器
    scrollContainer = document.querySelector('.main-content')
    
    if (scrollContainer) {
      scrollHandler = () => {
        updateActiveSlug()
      }
      scrollContainer.addEventListener('scroll', scrollHandler, { passive: true })
      
      // 初始化时更新一次
      setTimeout(() => {
        updateActiveSlug()
      }, 100)
    }
  })
})

onUnmounted(() => {
  if (scrollHandler && scrollContainer) {
    scrollContainer.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
.table-of-contents {
  position: sticky;
  top: 80px;
  padding: 16px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.toc-item {
  padding: 6px 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.6;
  transition: color 0.2s;
  display: block;
  border-left: 2px solid transparent;
}

.toc-item:hover {
  color: var(--primary-color);
}

.toc-item.active {
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 500;
}

.toc-level-1 {
  padding-left: 8px;
  font-weight: 500;
  margin-top: 8px;
}

.toc-level-2 {
  padding-left: 16px;
  margin-top: 4px;
}

.toc-level-3 {
  padding-left: 28px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.toc-level-4 {
  padding-left: 40px;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 简洁的滚动条 */
.table-of-contents::-webkit-scrollbar {
  width: 6px;
}

.table-of-contents::-webkit-scrollbar-track {
  background: transparent;
}

.table-of-contents::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.table-of-contents::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>
