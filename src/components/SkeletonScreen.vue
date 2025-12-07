<template>
  <div class="skeleton-screen" :class="`skeleton-${type}`">
    <!-- 文章骨架屏 -->
    <template v-if="type === 'article'">
      <div class="skeleton-article">
        <div class="skeleton-title skeleton-shimmer"></div>
        <div class="skeleton-meta">
          <div class="skeleton-meta-item skeleton-shimmer"></div>
          <div class="skeleton-meta-item skeleton-shimmer"></div>
          <div class="skeleton-meta-item skeleton-shimmer"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-shimmer" style="width: 100%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 95%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 88%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 100%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 72%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 100%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 90%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 85%"></div>
        </div>
      </div>
    </template>

    <!-- 卡片骨架屏 -->
    <template v-else-if="type === 'card'">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-card-title skeleton-shimmer"></div>
        <div class="skeleton-card-desc">
          <div class="skeleton-line skeleton-shimmer" style="width: 100%"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 80%"></div>
        </div>
        <div class="skeleton-card-meta">
          <div class="skeleton-tag skeleton-shimmer"></div>
          <div class="skeleton-tag skeleton-shimmer"></div>
        </div>
      </div>
    </template>

    <!-- 列表骨架屏 -->
    <template v-else-if="type === 'list'">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-list-title skeleton-shimmer"></div>
        <div class="skeleton-list-meta skeleton-shimmer"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'article',
    validator: (value) => ['article', 'card', 'list'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-screen {
  width: 100%;
}

/* 闪烁动画 */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary, #e0e0e0) 25%,
    var(--bg-secondary, #f0f0f0) 50%,
    var(--bg-tertiary, #e0e0e0) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 文章骨架屏 */
.skeleton-article {
  padding: 24px;
}

.skeleton-title {
  height: 36px;
  width: 70%;
  margin-bottom: 20px;
}

.skeleton-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.skeleton-meta-item {
  height: 16px;
  width: 80px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
}

/* 卡片骨架屏 */
.skeleton-card {
  padding: 20px;
  background-color: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-card-title {
  height: 24px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-card-desc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.skeleton-card-desc .skeleton-line {
  height: 14px;
}

.skeleton-card-meta {
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  height: 24px;
  width: 60px;
  border-radius: 12px;
}

/* 列表骨架屏 */
.skeleton-list-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.skeleton-list-title {
  height: 20px;
  width: 50%;
  margin-bottom: 8px;
}

.skeleton-list-meta {
  height: 14px;
  width: 30%;
}

/* 淡出过渡 */
.skeleton-screen {
  transition: opacity 0.2s ease;
}
</style>
