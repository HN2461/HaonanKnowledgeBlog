import Fuse from 'fuse.js'
import { cleanNoteText, escapeHtml, getNoteExcerpt } from '@/utils/notePresentation'
import { loadSearchIndex } from '@/utils/indexData'

let fuseInstance = null
let indexedNotes = []
let indexedData = null
let preparedNotes = []
let searchInitPromise = null

const SEARCH_HISTORY_KEY = 'search-history'
const SEARCH_HISTORY_LIMIT = 10
const GENERIC_NOTE_TITLES = new Set(['readme', '目录'])
const TOKEN_SEPARATOR_RE = /[\s,，、|/]+/g
const CJK_CHAR_RE = /[\u3400-\u9fff]/

function normalizeSearchValue(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
}

function normalizeLooseValue(value = '') {
  return normalizeSearchValue(value)
    .replace(/[\\/_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value = '') {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isMeaningfulTerm(term = '') {
  const normalized = normalizeSearchValue(term)

  if (!normalized) {
    return false
  }

  if (CJK_CHAR_RE.test(normalized)) {
    return normalized.length >= 1
  }

  return normalized.length >= 2
}

export function getSearchTerms(query = '') {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  return Array.from(
    new Set(
      normalizedQuery
        .split(TOKEN_SEPARATOR_RE)
        .map((item) => item.trim())
        .filter((item) => isMeaningfulTerm(item))
    )
  )
}

function buildQueryBundle(query = '') {
  const rawQuery = String(query || '').trim()
  const normalizedQuery = normalizeSearchValue(rawQuery)
  const terms = getSearchTerms(rawQuery)

  const highlightSource = terms.length > 0 ? terms : [normalizedQuery]
  const highlightTerms = Array.from(
    new Set(
      highlightSource
        .filter((item) => isMeaningfulTerm(item))
        .sort((a, b) => b.length - a.length)
    )
  )

  const fuseQueries = Array.from(
    new Set(
      [rawQuery, normalizedQuery, ...terms]
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    )
  )

  return {
    rawQuery,
    normalizedQuery,
    terms,
    highlightTerms,
    fuseQueries
  }
}

function buildPreparedNote(note = {}) {
  const fieldValues = {
    title: [note.title, note.frontmatterTitle, note.fileTitle].filter(Boolean).join(' '),
    description: note.description || '',
    tags: Array.isArray(note.tags) ? note.tags.join(' ') : '',
    category: note.category || '',
    filename: note.filename || '',
    path: note.path || '',
    content: note.content || ''
  }

  const fields = Object.fromEntries(
    Object.entries(fieldValues).map(([key, value]) => [key, normalizeSearchValue(value)])
  )

  const looseFields = Object.fromEntries(
    Object.entries(fieldValues).map(([key, value]) => [key, normalizeLooseValue(value)])
  )

  return {
    note,
    fields,
    looseFields,
    genericTitle: GENERIC_NOTE_TITLES.has(fields.title)
  }
}

function containsTerm(text = '', looseText = '', term = '') {
  const normalizedTerm = normalizeSearchValue(term)

  if (!normalizedTerm) {
    return false
  }

  if (text.includes(normalizedTerm)) {
    return true
  }

  return looseText.includes(normalizeLooseValue(normalizedTerm))
}

function countOccurrences(text = '', term = '') {
  const normalizedText = normalizeSearchValue(text)
  const normalizedTerm = normalizeSearchValue(term)

  if (!normalizedText || !normalizedTerm) {
    return 0
  }

  const matches = normalizedText.match(new RegExp(escapeRegExp(normalizedTerm), 'g'))
  return matches ? matches.length : 0
}

function getFieldMatch(meta, term = '') {
  const normalizedTerm = normalizeSearchValue(term)

  if (!normalizedTerm) {
    return {
      matched: false,
      score: 0,
      contentHits: 0
    }
  }

  const title = containsTerm(meta.fields.title, meta.looseFields.title, normalizedTerm)
  const description = containsTerm(meta.fields.description, meta.looseFields.description, normalizedTerm)
  const tags = containsTerm(meta.fields.tags, meta.looseFields.tags, normalizedTerm)
  const category = containsTerm(meta.fields.category, meta.looseFields.category, normalizedTerm)
  const filename = containsTerm(meta.fields.filename, meta.looseFields.filename, normalizedTerm)
  const path = containsTerm(meta.fields.path, meta.looseFields.path, normalizedTerm)
  const content = containsTerm(meta.fields.content, meta.looseFields.content, normalizedTerm)
  const contentHits = countOccurrences(meta.fields.content, normalizedTerm)

  const score =
    (title ? 20 : 0) +
    (tags ? 14 : 0) +
    (path ? 14 : 0) +
    (filename ? 10 : 0) +
    (description ? 8 : 0) +
    (category ? 6 : 0) +
    (content ? Math.min(10, 2 + contentHits * 1.2) : 0)

  return {
    matched: title || description || tags || category || filename || path || content,
    title,
    description,
    tags,
    category,
    filename,
    path,
    content,
    contentHits,
    score
  }
}

function collectExactMatches(meta, queryBundle) {
  const matchedTerms = new Set()
  let score = 0

  queryBundle.terms.forEach((term) => {
    const fieldMatch = getFieldMatch(meta, term)

    if (!fieldMatch.matched) {
      return
    }

    matchedTerms.add(term)
    score += fieldMatch.score
  })

  const phraseMatch = getFieldMatch(meta, queryBundle.normalizedQuery)
  if (phraseMatch.matched) {
    score += 24

    if (phraseMatch.title) {
      score += 14
    }

    if (phraseMatch.path || phraseMatch.filename) {
      score += 12
    }
  }

  if (matchedTerms.size > 0) {
    score += (matchedTerms.size / Math.max(queryBundle.terms.length, 1)) * 18
  }

  if (meta.genericTitle && !phraseMatch.title) {
    score -= 8
  }

  return {
    score: Math.max(0, score),
    matchedTerms,
    phraseMatched: phraseMatch.matched
  }
}

function collectFuzzyMatches(queryBundle) {
  const fuzzyMatches = new Map()

  if (!fuseInstance) {
    return fuzzyMatches
  }

  queryBundle.fuseQueries.forEach((query) => {
    const normalizedQuery = normalizeSearchValue(query)
    const termMatches = queryBundle.terms.includes(normalizedQuery)

    fuseInstance.search(query).slice(0, 80).forEach((result) => {
      const pathKey = result.item?.path

      if (!pathKey) {
        return
      }

      const current = fuzzyMatches.get(pathKey) || {
        item: result.item,
        bestScore: Number.POSITIVE_INFINITY,
        matchedTerms: new Set(),
        phraseMatched: false
      }

      current.bestScore = Math.min(current.bestScore, result.score ?? Number.POSITIVE_INFINITY)

      if (termMatches) {
        current.matchedTerms.add(normalizedQuery)
      }

      if (normalizedQuery === queryBundle.normalizedQuery) {
        current.phraseMatched = true
      }

      fuzzyMatches.set(pathKey, current)
    })
  })

  return fuzzyMatches
}

function passesMatchMode(queryTerms = [], exactTerms = new Set(), fuzzyTerms = new Set(), mode = 'AND') {
  if (queryTerms.length === 0) {
    return true
  }

  const hasTerm = (term) => exactTerms.has(term) || fuzzyTerms.has(term)

  if (mode === 'OR') {
    return queryTerms.some((term) => hasTerm(term))
  }

  return queryTerms.every((term) => hasTerm(term))
}

function getFuzzyScore(entry) {
  if (!entry || !Number.isFinite(entry.bestScore)) {
    return 0
  }

  return Math.max(0, (1 - entry.bestScore) * 28)
}

function getCoverageBonus(queryTerms = [], exactTerms = new Set(), fuzzyTerms = new Set()) {
  if (queryTerms.length === 0) {
    return 0
  }

  const matchedCount = queryTerms.filter((term) => exactTerms.has(term) || fuzzyTerms.has(term)).length
  return (matchedCount / queryTerms.length) * 20
}

function getSortTimestamp(note = {}) {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const timestamp = new Date(value).getTime()
    if (!Number.isNaN(timestamp)) {
      return timestamp
    }
  }

  return 0
}

function pickPrimaryTerm(queryBundle, exactTerms = new Set(), fuzzyTerms = new Set()) {
  const preferredTerms = [queryBundle.normalizedQuery, ...queryBundle.terms]

  return preferredTerms.find((term) => exactTerms.has(term) || fuzzyTerms.has(term)) || queryBundle.normalizedQuery || queryBundle.terms[0] || ''
}

// 初始化搜索引擎
export function initSearch(notes, data = null) {
  indexedNotes = Array.isArray(notes) ? notes : []
  preparedNotes = indexedNotes.map((note) => buildPreparedNote(note))
  indexedData = data && typeof data === 'object'
    ? {
      ...data,
      allNotes: indexedNotes
    }
    : {
      allNotes: indexedNotes
    }

  const options = {
    keys: [
      { name: 'title', weight: 0.3 },
      { name: 'description', weight: 0.18 },
      { name: 'tags', weight: 0.16 },
      { name: 'path', weight: 0.12 },
      { name: 'filename', weight: 0.08 },
      { name: 'category', weight: 0.06 },
      { name: 'content', weight: 0.1 }
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    distance: 300
  }

  fuseInstance = new Fuse(indexedNotes, options)
  return fuseInstance
}

export async function ensureSearchReady() {
  if (fuseInstance && indexedData) {
    return indexedData
  }

  if (!searchInitPromise) {
    searchInitPromise = loadSearchIndex()
      .then((data) => {
        const notes = data.allNotes || []
        initSearch(notes, data)
        return indexedData
      })
      .catch((error) => {
        searchInitPromise = null
        throw error
      })
  }

  return searchInitPromise
}

// 搜索笔记
export function searchNotes(query, mode = 'AND') {
  if (!fuseInstance) {
    console.warn('搜索引擎未初始化')
    return []
  }

  const queryBundle = buildQueryBundle(query)

  if (!queryBundle.rawQuery) {
    return []
  }

  if (queryBundle.terms.length === 0 && !isMeaningfulTerm(queryBundle.normalizedQuery)) {
    return []
  }

  const exactMatches = new Map()
  preparedNotes.forEach((meta) => {
    const exactEntry = collectExactMatches(meta, queryBundle)
    if (exactEntry.score > 0 || exactEntry.phraseMatched) {
      exactMatches.set(meta.note.path, exactEntry)
    }
  })

  const fuzzyMatches = collectFuzzyMatches(queryBundle)
  const candidatePaths = new Set([
    ...exactMatches.keys(),
    ...fuzzyMatches.keys()
  ])

  const results = []

  candidatePaths.forEach((pathKey) => {
    const note = indexedNotes.find((item) => item.path === pathKey)

    if (!note) {
      return
    }

    const exactEntry = exactMatches.get(pathKey) || {
      score: 0,
      matchedTerms: new Set(),
      phraseMatched: false
    }
    const fuzzyEntry = fuzzyMatches.get(pathKey) || {
      bestScore: Number.POSITIVE_INFINITY,
      matchedTerms: new Set(),
      phraseMatched: false
    }

    if (!passesMatchMode(queryBundle.terms, exactEntry.matchedTerms, fuzzyEntry.matchedTerms, mode)) {
      return
    }

    const relevanceScore =
      exactEntry.score +
      getFuzzyScore(fuzzyEntry) +
      getCoverageBonus(queryBundle.terms, exactEntry.matchedTerms, fuzzyEntry.matchedTerms)

    if (relevanceScore <= 0) {
      return
    }

    const primaryTerm = pickPrimaryTerm(queryBundle, exactEntry.matchedTerms, fuzzyEntry.matchedTerms)

    results.push({
      ...note,
      relevanceScore,
      matchedTerms: Array.from(new Set([
        ...exactEntry.matchedTerms,
        ...fuzzyEntry.matchedTerms
      ])),
      matchedContent: extractMatchedContent(note, primaryTerm || queryBundle.normalizedQuery)
    })
  })

  return results
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }

      return getSortTimestamp(b) - getSortTimestamp(a)
    })
    .slice(0, 100)
}

// 提取匹配的内容片段
function extractMatchedContent(item, query) {
  if (!item.content) {
    return getNoteExcerpt(item, {
      maxLength: 160
    })
  }

  const queryBundle = buildQueryBundle(query)
  const preferredTerms = [queryBundle.normalizedQuery, ...queryBundle.terms].filter(Boolean)
  const content = item.content
  const contentLower = content.toLowerCase()

  let matchIndex = -1
  let matchedTerm = ''

  preferredTerms.some((term) => {
    const index = contentLower.indexOf(term)

    if (index === -1) {
      return false
    }

    matchIndex = index
    matchedTerm = term
    return true
  })

  if (matchIndex !== -1) {
    const start = Math.max(0, matchIndex - 100)
    const end = Math.min(content.length, matchIndex + matchedTerm.length + 100)
    let excerpt = content.substring(start, end)

    if (start > 0) {
      excerpt = '...' + excerpt
    }

    if (end < content.length) {
      excerpt += '...'
    }

    return cleanNoteText(excerpt)
  }

  return getNoteExcerpt(item, {
    maxLength: 180
  })
}

export function highlightSearchText(text = '', query = '') {
  const safeText = escapeHtml(text || '')

  if (!safeText) {
    return ''
  }

  const { highlightTerms } = buildQueryBundle(query)

  if (highlightTerms.length === 0) {
    return safeText
  }

  return highlightTerms.reduce((result, term) => {
    if (!term) {
      return result
    }

    return result.replace(new RegExp(`(${escapeRegExp(term)})`, 'gi'), '<mark>$1</mark>')
  }, safeText)
}

// 保存搜索历史
export function saveSearchHistory(query) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : ''

  if (normalizedQuery.length <= 1) {
    return
  }

  const nextHistory = normalizeSearchHistory([
    normalizedQuery,
    ...getSearchHistory().filter((item) => item !== normalizedQuery)
  ])

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory))
}

// 获取搜索历史
export function getSearchHistory() {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    const parsedHistory = history ? JSON.parse(history) : []
    const normalizedHistory = normalizeSearchHistory(parsedHistory)

    if (JSON.stringify(parsedHistory) !== JSON.stringify(normalizedHistory)) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(normalizedHistory))
    }

    return normalizedHistory
  } catch (error) {
    console.error('读取搜索历史失败:', error)
    return []
  }
}

// 清除搜索历史
export function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}

function normalizeSearchHistory(history) {
  if (!Array.isArray(history)) {
    return []
  }

  return history
    .map((item) => typeof item === 'string' ? item.trim() : '')
    .filter((item, index, list) => item.length > 1 && list.indexOf(item) === index)
    .slice(0, SEARCH_HISTORY_LIMIT)
}
