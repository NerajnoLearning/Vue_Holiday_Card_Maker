import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

describe('ErrorMessage.vue', () => {
  it('renders message from props', () => {
    const message = 'An error occurred'
    const wrapper = mount(ErrorMessage, {
      props: { message },
    })

    expect(wrapper.text()).toContain(message)
  })

  it('renders message from default slot', () => {
    const message = 'Slot content error'
    const wrapper = mount(ErrorMessage, {
      slots: {
        default: message,
      },
    })

    expect(wrapper.text()).toContain(message)
  })

  it('includes error icon', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Error' },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies correct styling', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Error' },
    })

    expect(wrapper.classes()).toContain('text-red-600')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('renders without message when no prop or slot provided', () => {
    const wrapper = mount(ErrorMessage)

    // Should still render the icon
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
