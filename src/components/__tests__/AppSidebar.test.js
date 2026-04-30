import { mount, flushPromises } from '@vue/test-utils'
import AppSidebar from '../AppSidebar.vue'

const routeState = vi.hoisted(() => ({
  name: 'Home',
  params: {},
  fullPath: '/'
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeState
}))

vi.mock('@/utils/indexData', () => ({
  loadNotesIndex: async () => {
    const response = await fetch('/notes-index.json')
    return response.json()
  }
}))

const setViewportWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  })
}

describe('AppSidebar', () => {
  beforeEach(() => {
    setViewportWidth(500)
    routeState.name = 'Home'
    routeState.params = {}
    routeState.fullPath = '/'
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ tree: [] })
    })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not render overlay when sidebar is hidden on mobile', async () => {
    const wrapper = mount(AppSidebar, {
      props: {
        visible: false
      },
      global: {
        stubs: {
          FileTree: true,
          SidebarExportModal: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.find('.sidebar-overlay').exists()).toBe(false)
  })

  it('renders overlay when sidebar is visible on mobile', async () => {
    const wrapper = mount(AppSidebar, {
      props: {
        visible: true
      },
      global: {
        stubs: {
          FileTree: true,
          SidebarExportModal: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.find('.sidebar-overlay').exists()).toBe(true)
    expect(wrapper.find('.app-sidebar .sidebar-overlay').exists()).toBe(false)
  })

  it('opens export modal from sidebar actions menu when notes exist', async () => {
    setViewportWidth(1280)
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        tree: [
          {
            type: 'directory',
            name: '电脑',
            path: '电脑',
            children: []
          }
        ]
      })
    }))

    const wrapper = mount(AppSidebar, {
      props: {
        visible: true
      },
      global: {
        stubs: {
          FileTree: true,
          SidebarExportModal: {
            props: ['modelValue'],
            template: '<div v-if="modelValue" class="sidebar-export-modal-stub"></div>'
          }
        }
      }
    })

    await flushPromises()

    const actionsBtn = wrapper.find('.actions-btn')
    expect(actionsBtn.attributes('disabled')).toBeUndefined()

    await actionsBtn.trigger('click')
    expect(wrapper.find('.actions-menu').exists()).toBe(true)

    const exportEntry = wrapper.findAll('.actions-menu-item').find((item) => item.text().includes('导出资料'))
    expect(exportEntry).toBeTruthy()

    await exportEntry.trigger('click')
    expect(wrapper.find('.actions-menu').exists()).toBe(false)
    expect(wrapper.find('.sidebar-export-modal-stub').exists()).toBe(true)
  })

  it('enables quick actions for current note route', async () => {
    setViewportWidth(1280)
    routeState.name = 'NoteDetail'
    routeState.params = {
      path: '电脑/电脑网络/代理与VPN/代理网络问题处理指南'
    }
    routeState.fullPath = '/note/电脑/电脑网络/代理与VPN/代理网络问题处理指南'

    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        tree: [
          {
            type: 'directory',
            name: '代理与VPN',
            path: '电脑/电脑网络/代理与VPN',
            children: [
              {
                type: 'file',
                title: '代理网络问题处理指南',
                filename: '代理网络问题处理指南.md',
                path: '电脑/电脑网络/代理与VPN/代理网络问题处理指南.md',
                attachments: []
              }
            ]
          }
        ]
      })
    }))

    const wrapper = mount(AppSidebar, {
      props: {
        visible: true
      },
      global: {
        stubs: {
          FileTree: true,
          SidebarExportModal: true,
          Teleport: true
        }
      }
    })

    await flushPromises()
    await wrapper.find('.actions-btn').trigger('click')

    const items = wrapper.findAll('.actions-menu-item')
    expect(items[0].attributes('disabled')).toBeUndefined()
    expect(items[0].text()).toContain('导出当前文章')
    expect(items[0].text()).toContain('代理网络问题处理指南')
    expect(items[1].attributes('disabled')).toBeUndefined()
    expect(items[1].text()).toContain('电脑/电脑网络/代理与VPN')
    expect(items[2].attributes('disabled')).toBeUndefined()
  })

  it('shows desktop title expand control without manual resize handle', async () => {
    setViewportWidth(1280)

    const wrapper = mount(AppSidebar, {
      props: {
        visible: true,
        expanded: false
      },
      global: {
        stubs: {
          FileTree: true,
          SidebarExportModal: true,
          Teleport: true
        }
      }
    })

    await flushPromises()

    const widthToggleBtn = wrapper.find('.width-toggle-btn')
    expect(widthToggleBtn.exists()).toBe(true)
    expect(widthToggleBtn.text()).toContain('展开')

    await widthToggleBtn.trigger('click')
    expect(wrapper.emitted('toggle-expand')).toHaveLength(1)

    expect(wrapper.find('.sidebar-resize-handle').exists()).toBe(false)
  })
})
