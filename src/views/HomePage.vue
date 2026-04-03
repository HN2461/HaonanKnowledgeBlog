<template>
  <AppLayout>
    <div class='home-page'>
      <section class='desk-shell'>
        <section class='desk-main'>
          <div class='desk-stage'>
            <div class='desk-intro'>
              <p class='desk-kicker'>知识入口</p>
              <h1 class='desk-title'>{{ siteConfig.hero.title }}</h1>
              <p class='desk-description'>{{ siteConfig.hero.subtitle }}</p>
              <p class='desk-summary'>{{ siteConfig.description }}</p>
            </div>

            <aside class='desk-usage'>
              <span class='desk-usage-label'>阅读方式</span>
              <p class='desk-usage-primary'>按左侧目录继续阅读</p>
              <p class='desk-usage-secondary'>需要找答案时，直接用头部搜索。</p>
            </aside>
          </div>
        </section>

        <section class='summary-panel summary-panel-stats'>
          <div class='panel-head'>
            <h2 class='panel-title'>档案概况</h2>
            <span class='panel-note'>持续整理中</span>
          </div>
          <dl class='summary-list'>
            <div class='summary-row'>
              <dt>笔记总数</dt>
              <dd>{{ stats.totalNotes }}</dd>
            </div>
            <div class='summary-row'>
              <dt>根专题</dt>
              <dd>{{ rootTopics.length }}</dd>
            </div>
            <div class='summary-row'>
              <dt>标签维度</dt>
              <dd>{{ stats.totalTags }}</dd>
            </div>
            <div class='summary-row'>
              <dt>附件资源</dt>
              <dd>{{ attachmentCount }}</dd>
            </div>
          </dl>
        </section>

        <section class='summary-panel summary-panel-updates'>
          <div class='panel-head'>
            <h2 class='panel-title'>最近更新</h2>
            <span class='panel-note'>{{ recentUpdates.length }} 条</span>
          </div>
          <div class='updates-list' v-if='recentUpdates.length > 0'>
            <router-link
              v-for='note in recentUpdates'
              :key='note.path'
              :to='`/note/${note.path.replace(".md", "")}`'
              class='update-link'
            >
              <span class='update-title'>{{ note.title }}</span>
              <span class='update-meta'>{{ note.category }} · {{ getNoteDateLabel(note) }}</span>
            </router-link>
          </div>
          <p v-else class='panel-empty'>索引加载完成后，这里会显示最近整理的内容。</p>
        </section>
      </section>

      <section class='section-block'>
        <div class='section-head'>
          <div>
            <p class='section-kicker'>最近解决的问题</p>
            <h2 class='section-title'>先从最近处理过的问题开始</h2>
          </div>
        </div>

        <template v-if='loading'>
          <div class='notes-grid'>
            <SkeletonScreen type='card' :count='4' />
          </div>
        </template>

        <template v-else>
          <div class='notes-grid' v-if='recentProblemNotes.length > 0'>
            <NoteCard
              v-for='note in recentProblemNotes'
              :key='note.path'
              :note='note'
            />
          </div>
          <div v-else class='empty-state'>
            <p>暂未检测到笔记内容，请先在 <code>public/notes/</code> 目录中补充 Markdown 文件。</p>
          </div>
        </template>
      </section>

      <section class='section-block'>
        <div class='section-head'>
          <div>
            <p class='section-kicker'>根专题索引</p>
            <h2 class='section-title'>按根目录进入知识体系</h2>
          </div>
        </div>

        <div class='topics-grid' v-if='rootTopics.length > 0'>
          <router-link
            v-for='topic in rootTopics'
            :key='topic.path'
            :to='`/category/${topic.path}`'
            class='topic-card'
          >
            <div class='topic-head'>
              <h3 class='topic-name'>{{ topic.name }}</h3>
              <span class='topic-count'>{{ topic.notesCount }} 篇</span>
            </div>
            <p class='topic-date'>最近整理：{{ topic.latestDate || '未标注日期' }}</p>
            <div class='topic-tags' v-if='topic.featuredTags.length > 0'>
              <span v-for='tag in topic.featuredTags' :key='tag' class='topic-tag'>{{ tag }}</span>
            </div>
          </router-link>
        </div>

        <div class='empty-state' v-else>
          <p>暂未生成根专题索引数据。</p>
        </div>
      </section>

      <section class='section-block'>
        <div class='section-head'>
          <div>
            <p class='section-kicker'>最近更新记录</p>
            <h2 class='section-title'>查看最近整理与补充的条目</h2>
          </div>
        </div>

        <div class='record-list' v-if='recentRecordNotes.length > 0'>
          <router-link
            v-for='note in recentRecordNotes'
            :key='note.path'
            :to='`/note/${note.path.replace(".md", "")}`'
            class='record-item'
          >
            <div class='record-meta'>
              <span>{{ note.category }}</span>
              <span>·</span>
              <span>{{ getNoteDateLabel(note) }}</span>
              <span>·</span>
              <span>{{ formatWordCount(getNoteWordCount(note)) }} 字</span>
            </div>
            <h3 class='record-title'>{{ note.title }}</h3>
            <p class='record-description'>{{ getNoteExcerpt(note, { maxLength: 150 }) }}</p>
          </router-link>
        </div>

        <div class='empty-state' v-else>
          <p>暂未检测到更新记录。</p>
        </div>
      </section>

      <BackToTop />
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import BackToTop from '@/components/BackToTop.vue'
import NoteCard from '@/components/NoteCard.vue'
import SkeletonScreen from '@/components/SkeletonScreen.vue'
import { siteConfig } from '@/config/site'
import {
  buildRootTopics,
  formatWordCount,
  getNoteDateLabel,
  getNoteExcerpt,
  getNoteWordCount
} from '@/utils/notePresentation'
import { compareNotesByNewest } from '@/utils/noteOrder'

const notesData = ref(null)
const loading = ref(true)

const allNotes = computed(() => {
  return notesData.value?.allNotes || []
})

const stats = computed(() => {
  const allTags = new Set()

  allNotes.value.forEach((note) => {
    const tags = Array.isArray(note.tags) ? note.tags : []
    tags.forEach((tag) => allTags.add(tag))
  })

  return {
    totalNotes: notesData.value?.totalNotes || 0,
    totalTags: allTags.size
  }
})

const attachmentCount = computed(() => {
  return allNotes.value.reduce((total, note) => {
    return total + (Array.isArray(note.attachments) ? note.attachments.length : 0)
  }, 0)
})

const sortedNotes = computed(() => {
  return [...allNotes.value].sort(compareNotesByNewest)
})

const recentProblemNotes = computed(() => {
  return sortedNotes.value.slice(0, 4)
})

const recentUpdates = computed(() => {
  return sortedNotes.value.slice(0, 5)
})

const recentRecordNotes = computed(() => {
  return sortedNotes.value.slice(0, 6)
})

const rootTopics = computed(() => {
  return buildRootTopics(allNotes.value)
    .sort((a, b) => {
      if (b.notesCount !== a.notesCount) {
        return b.notesCount - a.notesCount
      }

      return b.latestTimestamp - a.latestTimestamp
    })
    .slice(0, 6)
})

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
    notesData.value = await response.json()
  } catch (error) {
    console.error('加载笔记索引失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1180px;
  margin: 0 auto;
  padding-bottom: 36px;
}

.desk-shell {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.desk-main,
.summary-panel,
.section-block {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-primary);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.dark-theme .desk-main,
.dark-theme .summary-panel,
.dark-theme .section-block {
  background: rgba(15, 23, 37, 0.94);
}

.desk-main {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  min-height: clamp(300px, 44vh, 420px);
  padding: 28px 28px 54px;
}

.desk-stage {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 320px);
  gap: 24px;
  align-items: start;
  width: 100%;
}

.desk-intro {
  min-width: 0;
  align-self: start;
}

.desk-kicker,
.section-kicker {
  margin: 0 0 10px;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.desk-title {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(32px, 4.6vw, 48px);
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.desk-description {
  margin: 14px 0 0;
  max-width: 44rem;
  color: var(--text-secondary);
  font-size: 17px;
  line-height: 1.8;
}

.desk-summary {
  margin: 8px 0 0;
  max-width: 42rem;
  color: var(--text-tertiary);
  font-size: 14px;
  line-height: 1.8;
}

.desk-usage {
  align-self: start;
  justify-self: end;
  width: 100%;
  max-width: 320px;
  padding: 16px 18px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.12);
  border-radius: 14px;
  background: rgba(var(--primary-color-rgb), 0.035);
}

.dark-theme .desk-usage {
  background: rgba(11, 19, 32, 0.74);
}

.desk-usage-label {
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.desk-usage-primary {
  margin: 14px 0 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.45;
}

.desk-usage-secondary {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.summary-panel,
.section-block {
  padding: 22px;
}

.panel-head,
.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-title,
.section-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.3;
}

.panel-note {
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

.summary-list {
  margin: 18px 0 0;
}

.summary-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.08);
}

.summary-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.summary-row dt {
  color: var(--text-secondary);
  font-size: 14px;
}

.summary-row dd {
  margin: 0;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 18px;
  font-weight: 700;
}

.updates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.update-link {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.08);
}

.update-link:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.update-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
}

.update-meta {
  color: var(--text-tertiary);
  font-size: 12px;
}

.panel-empty,
.empty-state p {
  margin: 18px 0 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.section-block + .section-block {
  margin-top: 24px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.topic-card,
.record-item {
  display: block;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.dark-theme .topic-card,
.dark-theme .record-item {
  background: rgba(11, 19, 32, 0.88);
}

.topic-card:hover,
.record-item:hover {
  border-color: rgba(var(--primary-color-rgb), 0.34);
}

.topic-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.topic-name,
.record-title {
  margin: 0;
  color: var(--text-primary);
}

.topic-name {
  font-size: 18px;
}

.topic-count {
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
}

.topic-date {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.topic-tag {
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.24);
  color: var(--text-tertiary);
  font-size: 12px;
}

.record-list {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.record-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.record-title {
  margin-top: 10px;
  font-size: 18px;
  line-height: 1.45;
}

.record-description {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

@media (max-width: 1024px) {
  .desk-shell {
    grid-template-columns: 1fr;
  }

  .desk-main {
    min-height: auto;
    padding: 24px;
  }

  .desk-stage {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .desk-main,
  .summary-panel,
  .section-block {
    padding: 18px;
    border-radius: 14px;
  }

  .desk-title {
    font-size: 32px;
  }

  .desk-main {
    padding: 20px 18px;
  }

  .desk-stage {
    gap: 18px;
  }

  .desk-usage {
    justify-self: stretch;
    max-width: none;
  }

  .panel-title,
  .section-title {
    font-size: 22px;
  }
}
</style>
