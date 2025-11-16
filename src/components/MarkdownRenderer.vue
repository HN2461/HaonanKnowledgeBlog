<template>
  <div class="markdown-renderer">
    <div class="markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const renderedContent = computed(() => {
  return renderMarkdown(props.content)
})
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
}

.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
}

/* 标题样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-primary);
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(h4) {
  font-size: 1em;
}

/* 段落样式 */
.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

/* 链接样式 */
.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 4px;
}

/* 引用样式 */
.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 0 1em;
  color: var(--text-secondary);
  border-left: 4px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 4px;
}

/* 代码块样式 */
.markdown-body :deep(pre) {
  margin: 16px 0;
  padding: 16px;
  overflow: auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  position: relative;
}

.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #d4d4d4;
}

.markdown-body :deep(:not(pre) > code) {
  padding: 2px 6px;
  background-color: var(--bg-tertiary);
  border-radius: 3px;
  color: var(--danger-color);
}

/* 表格样式 */
.markdown-body :deep(table) {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
  overflow: auto;
  display: block;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
}

.markdown-body :deep(table th) {
  background-color: var(--bg-tertiary);
  font-weight: 600;
}

.markdown-body :deep(table tr:nth-child(even)) {
  background-color: var(--bg-secondary);
}

/* 图片样式 */
.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

/* 分割线样式 */
.markdown-body :deep(hr) {
  height: 1px;
  margin: 24px 0;
  background-color: var(--border-color);
  border: 0;
}

/* 任务列表样式 */
.markdown-body :deep(input[type="checkbox"]) {
  margin-right: 8px;
}

/* 高亮文本 */
.markdown-body :deep(mark) {
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 2px;
}
</style>
