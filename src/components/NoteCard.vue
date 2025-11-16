<template>
  <router-link :to="`/note/${note.path.replace('.md', '')}`" class="note-card">
    <div class="card-gradient"></div>
    <div class="card-content">
      <div class="card-header">
        <span class="card-category">{{ note.category }}</span>
      </div>
      
      <h3 class="card-title">{{ note.title }}</h3>
      <p class="card-description">{{ note.description }}</p>
      
      <div class="card-footer">
        <div class="card-tags">
          <span v-for="tag in note.tags.slice(0, 3)" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
        <div class="card-meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {{ formatDate(note.date) }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<style scoped>
.note-card {
  position: relative;
  display: block;
  background-color: var(--bg-primary);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: var(--text-primary);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 0;
}

.note-card:hover::before {
  opacity: 1;
}

.note-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.note-card:hover .card-gradient {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 24px;
}

.card-header {
  margin-bottom: 12px;
}

.card-category {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.tag {
  padding: 4px 10px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s;
}

.note-card:hover .tag {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
}

.card-meta {
  display: flex;
  gap: 12px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .card-content {
    padding: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .card-description {
    font-size: 13px;
  }
}
</style>
