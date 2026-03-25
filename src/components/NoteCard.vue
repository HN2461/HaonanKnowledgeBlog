<template>
  <router-link :to="`/note/${note.path.replace('.md', '')}`" class='note-card'>
    <div class='card-head'>
      <span class='card-category'>{{ note.category }}</span>
      <span class='card-date'>{{ getNoteDateLabel(note) }}</span>
    </div>

    <div class='card-body'>
      <h3 class='card-title'>{{ note.title }}</h3>
      <p class='card-description'>{{ excerpt }}</p>
    </div>

    <div class='card-meta'>
      <span class='meta-item'>{{ formatWordCount(getNoteWordCount(note)) }} 字</span>
      <span class='meta-item'>{{ getNoteReadingMinutes(note) }} 分钟</span>
      <span class='meta-item'>{{ getAttachmentLabel(note.attachments) }}</span>
    </div>

    <div class='card-footer'>
      <div class='card-tags'>
        <span v-for='tag in (note.tags || []).slice(0, 3)' :key='tag' class='tag'>
          {{ tag }}
        </span>
      </div>
      <span class='card-cta'>打开</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatWordCount,
  getAttachmentLabel,
  getNoteDateLabel,
  getNoteExcerpt,
  getNoteReadingMinutes,
  getNoteWordCount
} from '@/utils/notePresentation'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const excerpt = computed(() => {
  return getNoteExcerpt(props.note, {
    maxLength: 120
  })
})
</script>

<style scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 18px 18px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.dark-theme .note-card {
  background: rgba(15, 23, 37, 0.94);
}

.note-card:hover {
  border-color: rgba(var(--primary-color-rgb), 0.36);
}

.card-head,
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-category {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(var(--primary-color-rgb), 0.08);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.card-date {
  color: var(--text-tertiary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.card-body {
  flex: 1;
}

.card-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 19px;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.card-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 12px;
  background: var(--bg-secondary);
}

.dark-theme .meta-item {
  background: rgba(11, 19, 32, 0.88);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 8px;
  border-radius: 999px;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 12px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.24);
}

.card-cta {
  flex-shrink: 0;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .note-card {
    padding: 16px;
    border-radius: 12px;
  }

  .card-title {
    font-size: 18px;
  }
}
</style>
