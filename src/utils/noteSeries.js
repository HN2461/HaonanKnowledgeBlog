import { compareNotesBySequence, extractSequenceNumber, getNoteOrder } from '@/utils/noteOrder'

export const normalizeNotePath = (value = '') => {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
}

export const getNotePathSegments = (value = '') => {
  return normalizeNotePath(value)
    .split('/')
    .filter(Boolean)
}

const getDirectorySegments = (value = '') => {
  const segments = getNotePathSegments(value)
  if (segments.length === 0) {
    return []
  }

  const lastSegment = segments[segments.length - 1]
  if (lastSegment.endsWith('.md')) {
    return segments.slice(0, -1)
  }

  return segments
}

export const getNoteDirectoryPath = (noteOrPath = '') => {
  const sourcePath = typeof noteOrPath === 'string'
    ? noteOrPath
    : noteOrPath?.path || ''

  return getDirectorySegments(sourcePath).join('/')
}

export const buildCategoryBreadcrumbs = (categoryPath = '') => {
  const segments = getDirectorySegments(categoryPath)

  return segments.map((segment, index) => ({
    name: segment,
    path: segments.slice(0, index + 1).join('/')
  }))
}

export const getPrimarySeriesPath = (noteOrPath = '') => {
  const directorySegments = getDirectorySegments(typeof noteOrPath === 'string'
    ? noteOrPath
    : noteOrPath?.path || '')

  if (directorySegments.length >= 2) {
    return directorySegments.slice(0, 2).join('/')
  }

  return directorySegments.join('/')
}

export const getPrimarySeriesName = (noteOrPath = '') => {
  const path = getPrimarySeriesPath(noteOrPath)
  const segments = getNotePathSegments(path)
  return segments[segments.length - 1] || ''
}

export const getImmediateChildCategoryPath = (fullPath = '', parentPath = '') => {
  const normalizedFullPath = normalizeNotePath(fullPath)
  const normalizedParentPath = normalizeNotePath(parentPath)

  if (!normalizedFullPath || !normalizedParentPath) {
    return ''
  }

  if (normalizedFullPath === normalizedParentPath) {
    return normalizedFullPath
  }

  if (!normalizedFullPath.startsWith(normalizedParentPath + '/')) {
    return ''
  }

  const parentSegments = getNotePathSegments(normalizedParentPath)
  const childSegments = getNotePathSegments(normalizedFullPath)
  const nextSegment = childSegments[parentSegments.length]

  if (!nextSegment) {
    return normalizedParentPath
  }

  return [...parentSegments, nextSegment].join('/')
}

export const getImmediateChildCategoryName = (fullPath = '', parentPath = '') => {
  const childPath = getImmediateChildCategoryPath(fullPath, parentPath)
  if (!childPath || childPath === normalizeNotePath(parentPath)) {
    return ''
  }

  const segments = getNotePathSegments(childPath)
  return segments[segments.length - 1] || ''
}

export const getSequenceLabel = (note = {}) => {
  const explicitOrder = getNoteOrder(note)
  if (explicitOrder !== null) {
    return String(explicitOrder).padStart(2, '0')
  }

  const rawValue = note.filename || note.path || note.title || ''
  const sequence = extractSequenceNumber(rawValue)

  if (sequence === null) {
    return ''
  }

  return String(sequence).padStart(2, '0')
}

export const getNotesInDirectory = (allNotes = [], directoryPath = '') => {
  const normalizedDirectoryPath = normalizeNotePath(directoryPath)

  return [...allNotes]
    .filter((note) => getNoteDirectoryPath(note) === normalizedDirectoryPath)
    .sort(compareNotesBySequence)
}

export const getAdjacentNotes = (notes = [], currentNotePath = '') => {
  const orderedNotes = [...notes].sort(compareNotesBySequence)
  const normalizedCurrentPath = normalizeNotePath(currentNotePath)
  const index = orderedNotes.findIndex((note) => normalizeNotePath(note.path) === normalizedCurrentPath)

  return {
    orderedNotes,
    index,
    prev: index > 0 ? orderedNotes[index - 1] : null,
    next: index >= 0 && index < orderedNotes.length - 1 ? orderedNotes[index + 1] : null
  }
}

export const groupNotesByImmediateChild = (notes = [], parentPath = '') => {
  const groups = new Map()
  const normalizedParentPath = normalizeNotePath(parentPath)

  notes.forEach((note) => {
    const groupPath = getImmediateChildCategoryPath(getNoteDirectoryPath(note), normalizedParentPath)
      || normalizedParentPath
    const groupName = groupPath === normalizedParentPath
      ? getNotePathSegments(normalizedParentPath).slice(-1)[0] || normalizedParentPath
      : getImmediateChildCategoryName(groupPath, normalizedParentPath)

    if (!groups.has(groupPath)) {
      groups.set(groupPath, {
        path: groupPath,
        name: groupName,
        notes: []
      })
    }

    groups.get(groupPath).notes.push(note)
  })

  return [...groups.values()].map((group) => ({
    ...group,
    notes: [...group.notes].sort(compareNotesBySequence)
  }))
}
