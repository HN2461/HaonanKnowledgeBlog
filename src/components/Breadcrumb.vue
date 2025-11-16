<template>
  <div class="breadcrumb-bar">
    <div class="breadcrumb-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// 面包屑导航组件
</script>

<style scoped>
.breadcrumb-bar {
  height: 48px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: -1px;
  z-index: 10;
  margin: -20px -20px 0 -20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 确保背景完全不透明，向上延伸覆盖空隙 */
.breadcrumb-bar::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-secondary);
  z-index: -1;
}

.breadcrumb-content {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .breadcrumb-bar {
    height: 44px;
    margin: -20px -20px 0 -20px;
  }
  
  .breadcrumb-content {
    font-size: 12px;
    padding: 0 16px;
  }
}
</style>
