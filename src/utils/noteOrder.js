const chineseSequenceNumbers = {
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9,
  '十': 10
}

const numericPrefixPattern = /^(\d{1,3})(?=[\s._\-、]|[^\d]|$)/
const arabicSequencePattern = /^第\s*(\d+)\s*[章节篇讲]/
const chineseSequencePattern = /^第\s*([一二三四五六七八九十]+)\s*[章节篇讲]/
const sequenceTitlePrefixPattern = /^(?:\d{1,3}[\s._\-、:：]*|第\s*(?:\d+|[一二三四五六七八九十]+)\s*[章节篇讲][\s._\-、:：]*)/
const specialKeywords = ['目录', '补充', '番外']
const orderFieldNames = ['order', 'sort', 'sequence', 'index', '排序', '顺序', '序号']

const normalizeSequenceLabel = (value = '') => {
  const label = String(value || '').trim()
  if (!label) {
    return ''
  }

  return label.padStart(Math.max(2, label.length), '0')
}

const extractSequenceLabel = (filename = '') => {
  const normalizedName = String(filename || '').trim()

  let match = normalizedName.match(numericPrefixPattern)
  if (match) {
    return normalizeSequenceLabel(match[1])
  }

  match = normalizedName.match(arabicSequencePattern)
  if (match) {
    return normalizeSequenceLabel(match[1])
  }

  match = normalizedName.match(chineseSequencePattern)
  if (match) {
    const value = chineseSequenceNumbers[match[1]]
    return value ? normalizeSequenceLabel(String(value)) : ''
  }

  return ''
}

const normalizeNoteOrderValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return null
  }

  return parsed
}

const hasSpecialKeyword = (value = '') => {
  return specialKeywords.some((keyword) => String(value || '').includes(keyword))
}

const getNoteFilename = (note = {}) => {
  if (note.filename) {
    return String(note.filename)
  }

  const normalizedPath = String(note.path || '').replace(/\\/g, '/')
  const pathFilename = normalizedPath.split('/').filter(Boolean).pop()

  return pathFilename || String(note.title || '')
}

const compareByExplicitOrder = (noteA = {}, noteB = {}) => {
  const orderA = getNoteOrder(noteA)
  const orderB = getNoteOrder(noteB)
  const hasOrderA = orderA !== null
  const hasOrderB = orderB !== null

  if (!hasOrderA && !hasOrderB) {
    return null
  }

  if (hasOrderA && hasOrderB) {
    return orderA - orderB
  }

  return hasOrderA ? -1 : 1
}

export const extractSequenceNumber = (filename = '') => {
  const label = extractSequenceLabel(filename)
  if (!label) {
    return null
  }

  return parseInt(label, 10)
}

export const getNoteOrder = (note = {}) => {
  for (const fieldName of orderFieldNames) {
    const normalizedValue = normalizeNoteOrderValue(note?.[fieldName])
    if (normalizedValue !== null) {
      return normalizedValue
    }
  }

  return null
}

export const stripLeadingSequencePrefix = (title = '') => {
  return String(title || '')
    .trim()
    .replace(sequenceTitlePrefixPattern, '')
    .trim()
}

export const formatNoteDisplayTitle = (title = '', filename = '') => {
  const normalizedTitle = String(title || '').trim()
  const sequenceLabel = extractSequenceLabel(filename)

  if (!sequenceLabel) {
    return normalizedTitle
  }

  const baseTitle = stripLeadingSequencePrefix(normalizedTitle) || normalizedTitle
  return `${sequenceLabel}. ${baseTitle}`
}

export const compareByFilenameOrder = (filenameA = '', filenameB = '') => {
  const nameA = String(filenameA || '')
  const nameB = String(filenameB || '')
  const numA = extractSequenceNumber(nameA)
  const numB = extractSequenceNumber(nameB)
  const isSpecialA = hasSpecialKeyword(nameA)
  const isSpecialB = hasSpecialKeyword(nameB)

  if (numA !== null && numB !== null) {
    return numA - numB || nameA.localeCompare(nameB, 'zh-CN')
  }

  if (numA !== null) return -1
  if (numB !== null) return 1

  if (isSpecialA && !isSpecialB) return 1
  if (!isSpecialA && isSpecialB) return -1

  return nameA.localeCompare(nameB, 'zh-CN')
}

export const compareNotesBySequence = (noteA = {}, noteB = {}) => {
  const explicitOrderDiff = compareByExplicitOrder(noteA, noteB)
  if (explicitOrderDiff !== null && explicitOrderDiff !== 0) {
    return explicitOrderDiff
  }

  return compareByFilenameOrder(getNoteFilename(noteA), getNoteFilename(noteB))
}

const getNoteTimestamp = (note = {}) => {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const time = new Date(value).getTime()
    if (!Number.isNaN(time)) {
      return time
    }
  }

  return 0
}

export const compareNotesByNewest = (noteA = {}, noteB = {}) => {
  const timeDiff = getNoteTimestamp(noteB) - getNoteTimestamp(noteA)
  if (timeDiff !== 0) {
    return timeDiff
  }

  return compareNotesBySequence(noteA, noteB)
}

export const compareNotesByOldest = (noteA = {}, noteB = {}) => {
  const timeDiff = getNoteTimestamp(noteA) - getNoteTimestamp(noteB)
  if (timeDiff !== 0) {
    return timeDiff
  }

  return compareNotesBySequence(noteA, noteB)
}
