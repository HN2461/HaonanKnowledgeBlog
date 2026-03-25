import dayjs from 'dayjs'
import { calculateReadingTime, countWords } from '@/utils/readingTime'

const DEFAULT_EXCERPT = '这篇笔记正在整理摘要，点击进入查看完整内容。'

const frontmatterPattern = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/

const normalizeLineEndings = (text = '') => {
  return String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
}

export const stripFrontmatter = (text = '') => {
  const normalized = normalizeLineEndings(text)
  const match = normalized.match(frontmatterPattern)

  if (!match) {
    return normalized
  }

  const body = match[1] || ''
  const hasYamlKeyValue = /^[A-Za-z\u4e00-\u9fa5_][^:\n]*:\s*/m.test(body)

  if (!hasYamlKeyValue) {
    return normalized
  }

  return normalized.slice(match[0].length)
}

export const cleanNoteText = (input = '') => {
  const text = stripFrontmatter(input)

  return text
    .replace(/\[\[toc\]\]|\[toc\]/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|li|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}\d+\.\s+/gm, '')
    .replace(/^\s{0,3}[-*_]{3,}\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
}

export const clampExcerpt = (text = '', maxLength = 160) => {
  const normalized = cleanNoteText(text)

  if (!normalized) {
    return ''
  }

  if (normalized.length <= maxLength) {
    return normalized
  }

  return normalized.slice(0, maxLength).replace(/[，。；：、,\s]+$/u, '').trim() + '…'
}

export const escapeHtml = (text = '') => {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const getNoteTimestamp = (note = {}) => {
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

export const getNoteDateLabel = (note = {}, format = 'YYYY-MM-DD') => {
  const candidates = [note.date, note.lastModified]

  for (const value of candidates) {
    if (!value) {
      continue
    }

    const parsed = dayjs(value)
    if (parsed.isValid()) {
      return parsed.format(format)
    }
  }

  return '未标注日期'
}

export const getNoteWordCount = (note = {}) => {
  const explicitCount = Number(note.wordCount)

  if (Number.isFinite(explicitCount) && explicitCount > 0) {
    return explicitCount
  }

  if (typeof note.content === 'string' && note.content.trim()) {
    return countWords(note.content)
  }

  return 0
}

export const formatWordCount = (value = 0) => {
  return Number(value || 0).toLocaleString('zh-CN')
}

export const getNoteReadingMinutes = (note = {}) => {
  const explicitMinutes = Number(note.readingTime)
  if (Number.isFinite(explicitMinutes) && explicitMinutes > 0) {
    return explicitMinutes
  }

  const wordCount = getNoteWordCount(note)
  if (wordCount > 0) {
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (typeof note.content === 'string' && note.content.trim()) {
    return calculateReadingTime(note.content)
  }

  return 1
}

export const getAttachmentLabel = (attachments = []) => {
  if (Array.isArray(attachments) && attachments.length > 0) {
    return `${attachments.length} 个附件`
  }

  return '纯文本笔记'
}

export const getNoteExcerpt = (note = {}, options = {}) => {
  const {
    maxLength = 160,
    fallback = DEFAULT_EXCERPT,
    preferMatchedContent = ''
  } = options

  const candidates = [
    preferMatchedContent,
    note.description,
    note.content
  ]

  for (const value of candidates) {
    const excerpt = clampExcerpt(value, maxLength)
    if (excerpt) {
      return excerpt
    }
  }

  return fallback
}

export const buildRootTopics = (notes = []) => {
  const topics = new Map()

  notes.forEach((note) => {
    const rootName = String(note.path || '')
      .split('/')
      .filter(Boolean)[0]

    if (!rootName) {
      return
    }

    if (!topics.has(rootName)) {
      topics.set(rootName, {
        name: rootName,
        path: rootName,
        notesCount: 0,
        latestTimestamp: 0,
        latestDate: '',
        tags: new Map()
      })
    }

    const topic = topics.get(rootName)
    topic.notesCount += 1

    const timestamp = getNoteTimestamp(note)
    if (timestamp > topic.latestTimestamp) {
      topic.latestTimestamp = timestamp
      topic.latestDate = getNoteDateLabel(note)
    }

    const tags = Array.isArray(note.tags) ? note.tags : []
    tags.forEach((tag) => {
      topic.tags.set(tag, (topic.tags.get(tag) || 0) + 1)
    })
  })

  return [...topics.values()]
    .map((topic) => ({
      ...topic,
      featuredTags: [...topic.tags.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag)
    }))
    .sort((a, b) => {
      if (b.latestTimestamp !== a.latestTimestamp) {
        return b.latestTimestamp - a.latestTimestamp
      }

      return b.notesCount - a.notesCount
    })
}
