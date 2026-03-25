<template>
  <AppLayout>
    <div class='search-page'>
      <KnowledgeSearchPanel
        variant='page'
        :initial-query='initialQuery'
        :max-visible-results='24'
        auto-focus
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import KnowledgeSearchPanel from '@/components/KnowledgeSearchPanel.vue'

const route = useRoute()

const initialQuery = computed(() => {
  const query = route.query.q
  return query ? String(query) : ''
})
</script>

<style scoped>
.search-page {
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 24px;
}
</style>
