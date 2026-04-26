import { ref } from 'vue'
import { ensureSearchReady } from '@/utils/search'

export const searchWarmupStatus = ref('idle')

let warmupPromise = null

export function ensureSearchWarmup() {
  if (searchWarmupStatus.value === 'ready') {
    return Promise.resolve()
  }

  if (warmupPromise) {
    return warmupPromise
  }

  searchWarmupStatus.value = 'loading'

  warmupPromise = ensureSearchReady()
    .then(() => {
      searchWarmupStatus.value = 'ready'
    })
    .catch((error) => {
      searchWarmupStatus.value = 'idle'
      throw error
    })
    .finally(() => {
      warmupPromise = null
    })

  return warmupPromise
}
