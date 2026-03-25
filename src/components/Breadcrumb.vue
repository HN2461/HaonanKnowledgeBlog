<template>
  <nav class="breadcrumb-content" aria-label="路径导航">
    <slot></slot>
  </nav>
</template>

<script setup>
// 面包屑导航组件
</script>

<style scoped>
.breadcrumb-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.6;
}

.breadcrumb-content :deep(a) {
  color: var(--text-secondary);
}

.breadcrumb-content :deep(a:hover) {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .breadcrumb-content {
    font-size: 11px;
  }
}
</style>
