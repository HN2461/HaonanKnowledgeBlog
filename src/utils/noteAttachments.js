const HTML_ATTACHMENT_EXTENSIONS = new Set(['html', 'htm'])

const normalizeBaseUrl = (baseUrl = '/') => {
  let normalized = String(baseUrl || '/').trim()

  if (!normalized) {
    normalized = '/'
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`
  }

  return normalized
}

export const encodePathSegments = (filePath) => {
  return String(filePath || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export const buildAttachmentUrl = (filePath, baseUrl = '/') => {
  return `${normalizeBaseUrl(baseUrl)}notes/${encodePathSegments(filePath)}`
}

export const getAttachmentExt = (attachment = {}) => {
  const explicitExt = String(attachment.ext || '').trim().replace(/^\./, '').toLowerCase()
  if (explicitExt) {
    return explicitExt
  }

  const path = String(attachment.path || '').trim()
  const pathMatch = path.match(/\.([a-z0-9]+)$/i)
  return pathMatch ? pathMatch[1].toLowerCase() : ''
}

export const getAttachmentPreviewType = (attachment = {}) => {
  const ext = getAttachmentExt(attachment)
  return HTML_ATTACHMENT_EXTENSIONS.has(ext) ? 'html' : null
}

export const isPreviewableAttachment = (attachment = {}) => {
  return getAttachmentPreviewType(attachment) !== null
}
