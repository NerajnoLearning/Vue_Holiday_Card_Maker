import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Mock useReducedMotion composable
vi.mock('@/composables/useReducedMotion', () => ({
  useReducedMotion: () => ({
    prefersReducedMotion: { value: false },
  }),
}))

describe('LoadingSpinner.vue', () => {
  it('renders spinner with default props', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('renders with custom size', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: 'lg' },
    })

    expect(wrapper.find('.h-12').exists()).toBe(true)
  })

  it('renders with custom color', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { color: 'secondary' },
    })

    expect(wrapper.find('.border-gray-600').exists()).toBe(true)
  })

  it('renders fullscreen mode', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { fullScreen: true },
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    expect(wrapper.find('.backdrop-blur-sm').exists()).toBe(true)
  })

  it('displays custom message', () => {
    const message = 'Processing...'
    const wrapper = mount(LoadingSpinner, {
      props: { message },
    })

    expect(wrapper.text()).toContain(message)
  })

  it('includes accessibility attributes', () => {
    const wrapper = mount(LoadingSpinner)

    const status = wrapper.find('[role="status"]')
    expect(status.exists()).toBe(true)
    expect(status.attributes('aria-live')).toBe('polite')
  })

  it('includes screen reader text', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.find('.sr-only').text()).toBe('Loading...')
  })
})
