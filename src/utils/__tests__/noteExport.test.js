import {
  collectNoteExportEntries,
  collectDirectoryExportEntries,
  exportDirectoryArchive,
  exportNoteSource,
  exportSelectedNotesArchive,
  flattenExportDirectories,
  getArchiveRelativePath
} from '../noteExport'

const treeFixture = [
  {
    type: 'directory',
    name: '网络与代理',
    path: '网络与代理',
    children: [
      {
        type: 'file',
        title: '代理网络问题处理指南',
        filename: '代理网络问题处理指南.md',
        path: '网络与代理/代理网络问题处理指南.md',
        attachments: [
          {
            name: '清理代理残留.bat',
            path: '网络与代理/清理代理残留.bat'
          }
        ]
      },
      {
        type: 'directory',
        name: '子目录',
        path: '网络与代理/子目录',
        children: [
          {
            type: 'file',
            title: '第二篇',
            filename: '第二篇.md',
            path: '网络与代理/子目录/第二篇.md',
            attachments: [
              {
                name: '清理代理残留.bat',
                path: '网络与代理/清理代理残留.bat'
              },
              {
                name: '跨目录附件.pdf',
                path: '外部资料/跨目录附件.pdf'
              }
            ]
          }
        ]
      }
    ]
  }
]

describe('noteExport', () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    globalThis.URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds directory summaries with note and attachment counts', () => {
    const directories = flattenExportDirectories(treeFixture)

    expect(directories).toHaveLength(2)
    expect(directories[0].path).toBe('网络与代理')
    expect(directories[0].noteCount).toBe(2)
    expect(directories[0].attachmentCount).toBe(2)
    expect(directories[1].path).toBe('网络与代理/子目录')
    expect(directories[1].noteCount).toBe(1)
  })

  it('deduplicates attachments when collecting directory export entries', () => {
    const { notes, attachments } = collectDirectoryExportEntries(treeFixture[0])

    expect(notes).toHaveLength(2)
    expect(attachments).toHaveLength(2)
    expect(attachments.map((item) => item.path)).toEqual([
      '网络与代理/清理代理残留.bat',
      '外部资料/跨目录附件.pdf'
    ])
  })

  it('deduplicates attachments when collecting selected note export entries', () => {
    const { notes, attachments } = collectNoteExportEntries([
      treeFixture[0].children[0],
      treeFixture[0].children[1].children[0]
    ])

    expect(notes).toHaveLength(2)
    expect(attachments).toHaveLength(2)
    expect(attachments.map((item) => item.path)).toEqual([
      '网络与代理/清理代理残留.bat',
      '外部资料/跨目录附件.pdf'
    ])
  })

  it('moves external attachments into a dedicated archive directory', () => {
    expect(getArchiveRelativePath('网络与代理/子目录/第二篇.md', '网络与代理')).toBe('子目录/第二篇.md')
    expect(getArchiveRelativePath('外部资料/跨目录附件.pdf', '网络与代理')).toBe('外部附件/外部资料/跨目录附件.pdf')
  })

  it('exports a single note as markdown', async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# 标题\n\n正文')
      })
    )

    const filename = await exportNoteSource(treeFixture[0].children[0], {
      baseUrl: '/HaonanKnowledgeBlog/',
      fetchImpl
    })

    expect(filename).toBe('代理网络问题处理指南.md')
    expect(fetchImpl).toHaveBeenCalledWith('/HaonanKnowledgeBlog/notes/%E7%BD%91%E7%BB%9C%E4%B8%8E%E4%BB%A3%E7%90%86/%E4%BB%A3%E7%90%86%E7%BD%91%E7%BB%9C%E9%97%AE%E9%A2%98%E5%A4%84%E7%90%86%E6%8C%87%E5%8D%97.md')
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  it('exports a directory archive with markdown files and deduplicated attachments', async () => {
    const fetchImpl = vi.fn((url) => {
      if (url.endsWith('.md')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# 文档')
        })
      }

      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['binary'], { type: 'application/octet-stream' }))
      })
    })

    const result = await exportDirectoryArchive(treeFixture[0], {
      baseUrl: '/HaonanKnowledgeBlog/',
      fetchImpl
    })

    expect(result).toEqual({
      filename: '网络与代理.zip',
      noteCount: 2,
      attachmentCount: 2
    })
    expect(fetchImpl).toHaveBeenCalledTimes(4)
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  it('exports selected notes archive with deduplicated attachments', async () => {
    const fetchImpl = vi.fn((url) => {
      if (url.endsWith('.md')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# 文档')
        })
      }

      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['binary'], { type: 'application/octet-stream' }))
      })
    })

    const result = await exportSelectedNotesArchive([
      treeFixture[0].children[0],
      treeFixture[0].children[1].children[0]
    ], {
      baseUrl: '/HaonanKnowledgeBlog/',
      fetchImpl
    })

    expect(result).toEqual({
      filename: '自选文档-2篇.zip',
      noteCount: 2,
      attachmentCount: 2
    })
    expect(fetchImpl).toHaveBeenCalledTimes(4)
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })
})
