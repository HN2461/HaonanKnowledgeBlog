const TOKEN_SEPARATOR_RE = /[\s,，、|/]+/g
const CJK_CHAR_RE = /[\u3400-\u9fff]/

function normalizeText(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
}

function normalizeLooseText(value = '') {
  return normalizeText(value)
    .replace(/[\\/_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value = '') {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isMeaningfulTerm(term = '') {
  const normalizedTerm = normalizeText(term)

  if (!normalizedTerm) {
    return false
  }

  if (CJK_CHAR_RE.test(normalizedTerm)) {
    return normalizedTerm.length >= 1
  }

  return normalizedTerm.length >= 2
}

function buildSearchableText(bookmark = {}) {
  return [
    bookmark.title,
    bookmark.domain,
    bookmark.category,
    bookmark.type,
    bookmark.shelf,
    bookmark.sourceGroup,
    bookmark.reason,
    bookmark.originalPath,
    ...(Array.isArray(bookmark.tags) ? bookmark.tags : [])
  ].join(' ')
}

function countOccurrences(text = '', term = '') {
  const normalizedText = normalizeText(text)
  const normalizedTerm = normalizeText(term)

  if (!normalizedText || !normalizedTerm) {
    return 0
  }

  const matches = normalizedText.match(new RegExp(escapeRegExp(normalizedTerm), 'g'))
  return matches ? matches.length : 0
}

function scoreBookmark(bookmark = {}, query = '') {
  const terms = getBookmarkSearchTerms(query)
  const fallbackQuery = normalizeText(query)

  if (terms.length === 0 && !fallbackQuery) {
    return 0
  }

  const normalizedTitle = normalizeText(bookmark.title)
  const normalizedDomain = normalizeText(bookmark.domain)
  const normalizedCategory = normalizeText(bookmark.category)
  const normalizedType = normalizeText(bookmark.type)
  const normalizedSourceGroup = normalizeText(bookmark.sourceGroup)
  const normalizedTags = normalizeText((bookmark.tags || []).join(' '))
  const normalizedReason = normalizeText(bookmark.reason)
  const normalizedPath = normalizeText(bookmark.originalPath)
  const looseText = normalizeLooseText(buildSearchableText(bookmark))
  const searchableText = normalizeText(buildSearchableText(bookmark))
  const queryTerms = terms.length > 0 ? terms : [fallbackQuery]

  let score = 0

  for (const term of queryTerms) {
    const looseTerm = normalizeLooseText(term)
    const matched =
      normalizedTitle.includes(term) ||
      normalizedDomain.includes(term) ||
      normalizedCategory.includes(term) ||
      normalizedType.includes(term) ||
      normalizedSourceGroup.includes(term) ||
      normalizedTags.includes(term) ||
      normalizedReason.includes(term) ||
      normalizedPath.includes(term) ||
      searchableText.includes(term) ||
      looseText.includes(looseTerm)

    if (!matched) {
      return 0
    }

    score += normalizedTitle.includes(term) ? 26 : 0
    score += normalizedDomain.includes(term) ? 16 : 0
    score += normalizedTags.includes(term) ? 14 : 0
    score += normalizedCategory.includes(term) ? 10 : 0
    score += normalizedType.includes(term) ? 8 : 0
    score += normalizedSourceGroup.includes(term) ? 8 : 0
    score += normalizedReason.includes(term) ? 8 : 0
    score += normalizedPath.includes(term) ? 6 : 0
    score += Math.min(6, countOccurrences(searchableText, term))
  }

  return score
}

export function getBookmarkSearchTerms(query = '') {
  const normalizedQuery = normalizeText(query)

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

export function escapeHtml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function highlightBookmarkText(text = '', query = '') {
  const safeText = escapeHtml(text)
  const terms = getBookmarkSearchTerms(query)

  if (terms.length === 0) {
    return safeText
  }

  return terms
    .sort((termA, termB) => termB.length - termA.length)
    .reduce((result, term) => {
      if (!term) {
        return result
      }

      return result.replace(new RegExp(`(${escapeRegExp(term)})`, 'gi'), '<mark>$1</mark>')
    }, safeText)
}

export function filterBookmarks(bookmarks = [], options = {}) {
  const {
    query = '',
    category = '',
    shelf = '',
    type = '',
    sourceGroup = ''
  } = options

  const filteredItems = bookmarks
    .filter((bookmark) => !category || bookmark.category === category)
    .filter((bookmark) => !shelf || bookmark.shelf === shelf)
    .filter((bookmark) => !type || bookmark.type === type)
    .filter((bookmark) => !sourceGroup || bookmark.sourceGroup === sourceGroup)
    .map((bookmark) => ({
      ...bookmark,
      searchScore: scoreBookmark(bookmark, query)
    }))

  const hasQuery = normalizeText(query).length > 0

  if (!hasQuery) {
    return filteredItems
  }

  return filteredItems
    .filter((bookmark) => bookmark.searchScore > 0)
    .sort((bookmarkA, bookmarkB) => {
      if (bookmarkB.searchScore !== bookmarkA.searchScore) {
        return bookmarkB.searchScore - bookmarkA.searchScore
      }

      return String(bookmarkA.title || '').localeCompare(String(bookmarkB.title || ''), 'zh-CN')
    })
}

export function groupBookmarksByCategory(bookmarks = [], categories = []) {
  return categories
    .map((category) => {
      const items = bookmarks.filter((bookmark) => bookmark.category === category.name)
      if (items.length === 0) {
        return null
      }

      return {
        category: category.name,
        description: category.description || '',
        items
      }
    })
    .filter(Boolean)
}
