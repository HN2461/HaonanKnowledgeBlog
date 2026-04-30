import { mount } from '@vue/test-utils'
import AppLayout from '../AppLayout.vue'

const setViewportWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  })
}

describe('AppLayout', () => {
  beforeEach(() => {
    setViewportWidth(1280)
  })

  it('toggles expanded label mode without width state', async () => {
    const wrapper = mount(AppLayout, {
      slots: {
        default: '<div class="layout-test-slot">content</div>'
      },
      global: {
        stubs: {
          AppHeader: {
            props: ['sidebarVisible'],
            emits: ['toggle-sidebar'],
            template: '<button class="header-toggle" @click="$emit(\'toggle-sidebar\')">{{ sidebarVisible }}</button>'
          },
          AppSidebar: {
            props: ['visible', 'expanded'],
            emits: ['close', 'toggle-expand'],
            template: `
              <div
                class="sidebar-stub"
                :data-visible="String(visible)"
                :data-expanded="String(expanded)"
              >
                <button class="toggle-expanded" @click="$emit('toggle-expand')">toggle expanded</button>
              </div>
            `
          }
        }
      }
    })

    await wrapper.vm.$nextTick()

    const getSidebar = () => wrapper.find('.sidebar-stub')

    expect(getSidebar().attributes('data-expanded')).toBe('false')

    await wrapper.find('.toggle-expanded').trigger('click')
    expect(getSidebar().attributes('data-expanded')).toBe('true')

    await wrapper.find('.toggle-expanded').trigger('click')
    expect(getSidebar().attributes('data-expanded')).toBe('false')
  })
})
