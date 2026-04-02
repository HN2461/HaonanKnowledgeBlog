const EXTERNAL_ATTACHMENT_DIR = '外部附件'

/**
 * 将相对路径编码成浏览器可访问的静态资源地址。
 * @param {string} filePath - `public/notes/` 下的相对路径。
 * @returns {string} 编码后的路径片段。
 */
export function encodePathSegments(filePath) {
  return String(filePath || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/**
 * 生成笔记或附件资源的访问地址。
 * @param {string} filePath - `public/notes/` 下的相对路径。
 * @param {string} [baseUrl='/'] - Vite 运行时的 `BASE_URL`。
 * @returns {string} 可用于 `fetch` 的资源地址。
 */
export function buildNoteAssetUrl(filePath, baseUrl = '/') {
  const normalizedBase = String(baseUrl || '/').endsWith('/')
    ? String(baseUrl || '/')
    : `${String(baseUrl || '/')}/`

  return `${normalizedBase}notes/${encodePathSegments(filePath)}`
}

/**
 * 清理导出文件名中的非法字符，避免浏览器下载后在系统层失败。
 * @param {string} name - 希望展示给用户的文件名。
 * @param {string} [fallback='knowledge-export'] - 兜底名称。
 * @returns {string} 可安全下载的文件名。
 */
export function sanitizeExportName(name, fallback = 'knowledge-export') {
  const safeName = String(name || '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

  return safeName || fallback
}

function walkTree(tree, visitor) {
  ;(Array.isArray(tree) ? tree : []).forEach((item) => {
    visitor(item)
    if (item?.type === 'directory' && Array.isArray(item.children) && item.children.length > 0) {
      walkTree(item.children, visitor)
    }
  })
}

function countDirectoryEntries(children = []) {
  let noteCount = 0
  const attachmentPaths = new Set()

  walkTree(children, (item) => {
    if (item?.type === 'file') {
      noteCount += 1
      ;(Array.isArray(item.attachments) ? item.attachments : []).forEach((attachment) => {
        const attachmentPath = String(attachment?.path || '').trim()
        if (attachmentPath) {
          attachmentPaths.add(attachmentPath)
        }
      })
    }
  })

  return {
    noteCount,
    attachmentCount: attachmentPaths.size
  }
}

/**
 * 拉平导出用的文档列表，便于搜索与单篇选择。
 * @param {Array} tree - `notes-index.json` 提供的树结构。
 * @returns {Array} 所有文档节点。
 */
export function flattenExportNotes(tree = []) {
  const notes = []

  walkTree(tree, (item) => {
    if (item?.type === 'file') {
      notes.push(item)
    }
  })

  return notes
}

/**
 * 拉平目录节点并附带规模信息，便于“整目录导出”展示。
 * @param {Array} tree - `notes-index.json` 提供的树结构。
 * @returns {Array} 所有目录节点摘要。
 */
export function flattenExportDirectories(tree = []) {
  const directories = []

  walkTree(tree, (item) => {
    if (item?.type !== 'directory') {
      return
    }

    const { noteCount, attachmentCount } = countDirectoryEntries(item.children)
    directories.push({
      ...item,
      noteCount,
      attachmentCount,
      depth: String(item.path || '').split('/').filter(Boolean).length
    })
  })

  return directories
}

/**
 * 汇总目录导出时需要抓取的文档与附件，并去重附件路径。
 * @param {Object} directory - 目录节点。
 * @returns {{notes: Array, attachments: Array}} 导出条目。
 */
export function collectDirectoryExportEntries(directory) {
  const notes = []
  const attachments = []
  const seenAttachments = new Set()

  walkTree(directory?.children || [], (item) => {
    if (item?.type !== 'file') {
      return
    }

    notes.push(item)

    ;(Array.isArray(item.attachments) ? item.attachments : []).forEach((attachment) => {
      const attachmentPath = String(attachment?.path || '').trim()
      if (!attachmentPath || seenAttachments.has(attachmentPath)) {
        return
      }

      seenAttachments.add(attachmentPath)
      attachments.push(attachment)
    })
  })

  return {
    notes,
    attachments
  }
}

/**
 * 汇总一组自选文档需要打包的 Markdown 与附件，并去重附件路径。
 * @param {Array} notes - 选中的文档节点集合。
 * @returns {{notes: Array, attachments: Array}} 导出条目。
 */
export function collectNoteExportEntries(notes = []) {
  const normalizedNotes = Array.isArray(notes)
    ? notes.filter((item) => item?.type === 'file' && item.path)
    : []

  const attachments = []
  const seenAttachments = new Set()

  normalizedNotes.forEach((note) => {
    ;(Array.isArray(note.attachments) ? note.attachments : []).forEach((attachment) => {
      const attachmentPath = String(attachment?.path || '').trim()
      if (!attachmentPath || seenAttachments.has(attachmentPath)) {
        return
      }

      seenAttachments.add(attachmentPath)
      attachments.push(attachment)
    })
  })

  return {
    notes: normalizedNotes,
    attachments
  }
}

/**
 * 为 ZIP 内部文件生成相对路径。目录外部附件会被单独归档，避免路径越界。
 * @param {string} filePath - 文档或附件的原始路径。
 * @param {string} directoryPath - 当前导出的目录路径。
 * @returns {string} ZIP 内部使用的相对路径。
 */
export function getArchiveRelativePath(filePath, directoryPath) {
  const normalizedFilePath = String(filePath || '').replace(/\\/g, '/').replace(/^\/+/, '')
  const normalizedDirectoryPath = String(directoryPath || '').replace(/\\/g, '/').replace(/^\/+/, '')

  if (!normalizedDirectoryPath) {
    return normalizedFilePath
  }

  if (normalizedFilePath.startsWith(`${normalizedDirectoryPath}/`)) {
    return normalizedFilePath.slice(normalizedDirectoryPath.length + 1)
  }

  return `${EXTERNAL_ATTACHMENT_DIR}/${normalizedFilePath}`
}

function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function fetchNoteResource(filePath, baseUrl, responseType = 'text', fetchImpl = fetch) {
  const response = await fetchImpl(buildNoteAssetUrl(filePath, baseUrl))
  if (!response.ok) {
    throw new Error(`资源下载失败：${filePath}`)
  }

  if (responseType === 'blob') {
    return response.blob()
  }

  return response.text()
}

/**
 * 导出单篇原始 Markdown 源文件。
 * @param {Object} note - 文档节点。
 * @param {Object} options - 导出选项。
 * @param {string} [options.baseUrl='/'] - Vite 运行时的 `BASE_URL`。
 * @param {Function} [options.fetchImpl=fetch] - 便于测试替换的 fetch 实现。
 * @returns {Promise<string>} 实际下载的文件名。
 */
export async function exportNoteSource(note, { baseUrl = '/', fetchImpl = fetch } = {}) {
  if (!note?.path) {
    throw new Error('未找到可导出的文档')
  }

  const markdownContent = await fetchNoteResource(note.path, baseUrl, 'text', fetchImpl)
  const filename = `${sanitizeExportName(note.title || note.filename || note.path.replace('.md', ''), 'note')}.md`
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })

  triggerBrowserDownload(blob, filename)
  return filename
}

/**
 * 将目录内的 Markdown 与已声明附件打包成 ZIP。
 * @param {Object} directory - 目录节点。
 * @param {Object} options - 导出选项。
 * @param {string} [options.baseUrl='/'] - Vite 运行时的 `BASE_URL`。
 * @param {Function} [options.fetchImpl=fetch] - 便于测试替换的 fetch 实现。
 * @returns {Promise<{filename: string, noteCount: number, attachmentCount: number}>} 导出结果摘要。
 */
export async function exportDirectoryArchive(directory, { baseUrl = '/', fetchImpl = fetch } = {}) {
  if (!directory?.path) {
    throw new Error('未找到可导出的目录')
  }

  const { notes, attachments } = collectDirectoryExportEntries(directory)
  if (notes.length === 0) {
    throw new Error('该目录下暂无可导出的文档')
  }

  // ZIP 导出不是高频操作，按需加载可避免拖慢首页首屏体积。
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const rootFolderName = sanitizeExportName(directory.name || directory.path.split('/').pop(), 'notes')
  const rootFolder = zip.folder(rootFolderName)

  if (!rootFolder) {
    throw new Error('创建压缩包失败')
  }

  await Promise.all(
    notes.map(async (note) => {
      const markdownContent = await fetchNoteResource(note.path, baseUrl, 'text', fetchImpl)
      rootFolder.file(getArchiveRelativePath(note.path, directory.path), markdownContent)
    })
  )

  await Promise.all(
    attachments.map(async (attachment) => {
      const attachmentBlob = await fetchNoteResource(attachment.path, baseUrl, 'blob', fetchImpl)
      rootFolder.file(getArchiveRelativePath(attachment.path, directory.path), attachmentBlob)
    })
  )

  rootFolder.file(
    '导出说明.txt',
    [
      `导出目录: ${directory.path}`,
      `文档数量: ${notes.length}`,
      `附件数量: ${attachments.length}`,
      `导出时间: ${new Date().toISOString()}`
    ].join('\n')
  )

  const archiveBlob = await zip.generateAsync({ type: 'blob' })
  const filename = `${sanitizeExportName(rootFolderName, 'notes')}.zip`

  triggerBrowserDownload(archiveBlob, filename)

  return {
    filename,
    noteCount: notes.length,
    attachmentCount: attachments.length
  }
}

/**
 * 将用户自选的多篇 Markdown 与附件打包成 ZIP。
 * @param {Array} notes - 选中的文档节点集合。
 * @param {Object} options - 导出选项。
 * @param {string} [options.baseUrl='/'] - Vite 运行时的 `BASE_URL`。
 * @param {Function} [options.fetchImpl=fetch] - 便于测试替换的 fetch 实现。
 * @returns {Promise<{filename: string, noteCount: number, attachmentCount: number}>} 导出结果摘要。
 */
export async function exportSelectedNotesArchive(notes, { baseUrl = '/', fetchImpl = fetch } = {}) {
  const { notes: selectedNotes, attachments } = collectNoteExportEntries(notes)
  if (selectedNotes.length === 0) {
    throw new Error('请先选择至少一篇文档')
  }

  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const rootFolderName = selectedNotes.length === 1
    ? `${sanitizeExportName(selectedNotes[0].title || selectedNotes[0].filename || 'note', 'note')}-打包导出`
    : `自选文档-${selectedNotes.length}篇`
  const rootFolder = zip.folder(rootFolderName)

  if (!rootFolder) {
    throw new Error('创建压缩包失败')
  }

  await Promise.all(
    selectedNotes.map(async (note) => {
      const markdownContent = await fetchNoteResource(note.path, baseUrl, 'text', fetchImpl)
      rootFolder.file(note.path, markdownContent)
    })
  )

  await Promise.all(
    attachments.map(async (attachment) => {
      const attachmentBlob = await fetchNoteResource(attachment.path, baseUrl, 'blob', fetchImpl)
      rootFolder.file(attachment.path, attachmentBlob)
    })
  )

  rootFolder.file(
    '导出说明.txt',
    [
      `导出范围: 自选文档`,
      `文档数量: ${selectedNotes.length}`,
      `附件数量: ${attachments.length}`,
      '文档列表:',
      ...selectedNotes.map((note) => `- ${note.path}`),
      `导出时间: ${new Date().toISOString()}`
    ].join('\n')
  )

  const archiveBlob = await zip.generateAsync({ type: 'blob' })
  const filename = `${sanitizeExportName(rootFolderName, 'selected-notes')}.zip`

  triggerBrowserDownload(archiveBlob, filename)

  return {
    filename,
    noteCount: selectedNotes.length,
    attachmentCount: attachments.length
  }
}
