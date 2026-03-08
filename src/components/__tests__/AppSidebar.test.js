import { mount, flushPromises } from '@vue/test-utils'
import AppSidebar from '../AppSidebar.vue'

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
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
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
          FileTree: true
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
          FileTree: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.find('.sidebar-overlay').exists()).toBe(true)
    expect(wrapper.find('.app-sidebar .sidebar-overlay').exists()).toBe(false)
  })
})
