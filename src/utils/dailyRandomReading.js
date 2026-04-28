export const DAILY_RANDOM_READING_STORAGE_KEY = 'daily-random-reading'
export const DAILY_RANDOM_READING_TARGET = 3
export const DAILY_RANDOM_READING_HISTORY_LIMIT = 48

function padNumber(value) {
  return String(value).padStart(2, '0')
}

export function getDailyRandomReadingDate(date = new Date()) {
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1)
  const day = padNumber(date.getDate())
  return `${year}-${month}-${day}`
}

export function createEmptyDailyRandomReadingState(date = getDailyRandomReadingDate()) {
  return {
    date,
    target: DAILY_RANDOM_READING_TARGET,
    completedCount: 0,
    recentItems: []
  }
}

function normalizeReadingItem(item) {
  if (!item || typeof item !== 'object') {
    return null
  }

  const path = String(item.path || '')
    .trim()
    .replace(/\.md$/i, '')

  if (!path) {
    return null
  }

  const title = String(item.title || path.split('/').pop() || '未命名文章').trim()

  return {
    path,
    title: title || '未命名文章'
  }
}

export function normalizeDailyRandomReadingState(
  rawState,
  date = getDailyRandomReadingDate()
) {
  if (!rawState || typeof rawState !== 'object' || rawState.date !== date) {
    return createEmptyDailyRandomReadingState(date)
  }

  const target = Number.isInteger(rawState.target) && rawState.target > 0
    ? rawState.target
    : DAILY_RANDOM_READING_TARGET

  const seenPaths = new Set()
  const recentItems = Array.isArray(rawState.recentItems)
    ? rawState.recentItems
      .slice(-DAILY_RANDOM_READING_HISTORY_LIMIT * 2)
      .reverse()
      .reduce((result, item) => {
        const normalizedItem = normalizeReadingItem(item)
        if (!normalizedItem || seenPaths.has(normalizedItem.path)) {
          return result
        }

        seenPaths.add(normalizedItem.path)
        result.push(normalizedItem)
        return result
      }, [])
      .reverse()
      .slice(-DAILY_RANDOM_READING_HISTORY_LIMIT)
    : []

  const rawCompletedCount = Number.parseInt(rawState.completedCount, 10)
  const completedCount = Number.isFinite(rawCompletedCount)
    ? Math.max(rawCompletedCount, 0)
    : recentItems.length

  return {
    date,
    target,
    completedCount,
    recentItems
  }
}

function hasStorageSupport() {
  return typeof localStorage !== 'undefined'
}

export function loadDailyRandomReadingState(date = getDailyRandomReadingDate()) {
  if (!hasStorageSupport()) {
    return createEmptyDailyRandomReadingState(date)
  }

  try {
    const rawValue = localStorage.getItem(DAILY_RANDOM_READING_STORAGE_KEY)
    if (!rawValue) {
      return createEmptyDailyRandomReadingState(date)
    }

    return normalizeDailyRandomReadingState(JSON.parse(rawValue), date)
  } catch {
    return createEmptyDailyRandomReadingState(date)
  }
}

export function saveDailyRandomReadingState(state) {
  const normalizedState = normalizeDailyRandomReadingState(state)

  if (!hasStorageSupport()) {
    return normalizedState
  }

  try {
    localStorage.setItem(
      DAILY_RANDOM_READING_STORAGE_KEY,
      JSON.stringify(normalizedState)
    )
  } catch {
    return normalizedState
  }

  return normalizedState
}

export function resetDailyRandomReadingState(date = getDailyRandomReadingDate()) {
  return createEmptyDailyRandomReadingState(date)
}

export function buildDailyRandomReadingPool(notes = []) {
  const seenPaths = new Set()

  return notes.reduce((result, note) => {
    const normalizedItem = normalizeReadingItem({
      path: note?.path,
      title: note?.title || note?.frontmatterTitle || note?.fileTitle
    })

    if (!normalizedItem || seenPaths.has(normalizedItem.path)) {
      return result
    }

    seenPaths.add(normalizedItem.path)
    result.push(normalizedItem)
    return result
  }, [])
}

function clampRandomValue(randomValue) {
  if (typeof randomValue !== 'number' || Number.isNaN(randomValue)) {
    return Math.random()
  }

  if (randomValue <= 0) {
    return 0
  }

  if (randomValue >= 1) {
    return 0.999999
  }

  return randomValue
}

export function selectRandomReadingCandidate(
  notes = [],
  excludedPaths = [],
  randomValue = Math.random()
) {
  const excludedSet = new Set(
    excludedPaths
      .map((path) => String(path || '').trim().replace(/\.md$/i, ''))
      .filter(Boolean)
  )

  const candidates = buildDailyRandomReadingPool(notes).filter((note) => {
    return !excludedSet.has(note.path)
  })

  if (candidates.length === 0) {
    return null
  }

  const index = Math.floor(clampRandomValue(randomValue) * candidates.length)
  return candidates[index] || null
}

export function getDailyRandomReadingProgress(state) {
  const normalizedState = normalizeDailyRandomReadingState(state)
  const progressCount = Math.min(normalizedState.completedCount, normalizedState.target)
  const target = normalizedState.target

  return {
    completedCount: normalizedState.completedCount,
    progressCount,
    target,
    remainingCount: Math.max(target - progressCount, 0),
    percent: target > 0 ? Math.round((progressCount / target) * 100) : 0,
    isComplete: normalizedState.completedCount >= target
  }
}

export function pickNextDailyRandomReading(
  state,
  notes = [],
  currentPath = '',
  options = {}
) {
  const normalizedState = normalizeDailyRandomReadingState(
    state,
    options.date || getDailyRandomReadingDate()
  )

  const recentPaths = normalizedState.recentItems.map((item) => item.path)
  const normalizedCurrentPath = String(currentPath || '').trim().replace(/\.md$/i, '')
  const currentPathList = normalizedCurrentPath ? [normalizedCurrentPath] : []

  let nextItem = selectRandomReadingCandidate(
    notes,
    [...recentPaths, ...currentPathList],
    options.randomValue
  )

  if (!nextItem) {
    nextItem = selectRandomReadingCandidate(
      notes,
      currentPathList,
      options.randomValue
    )
  }

  if (!nextItem) {
    nextItem = selectRandomReadingCandidate(notes, [], options.randomValue)
  }

  if (!nextItem) {
    return {
      action: 'empty',
      state: normalizedState,
      nextItem: null
    }
  }

  const nextState = {
    ...normalizedState,
    completedCount: normalizedState.completedCount + 1,
    recentItems: [...normalizedState.recentItems, nextItem].slice(-DAILY_RANDOM_READING_HISTORY_LIMIT)
  }

  return {
    action: nextState.completedCount === normalizedState.target ? 'complete' : 'advance',
    state: nextState,
    nextItem
  }
}
