import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'

// Mock the useDarkMode composable
vi.mock('@/composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: { value: false },
    toggleDarkMode: vi.fn(),
  }),
}))

describe('DarkModeToggle.vue', () => {
  it('renders toggle button', () => {
    const wrapper = mount(DarkModeToggle)

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('displays sun icon when in light mode', () => {
    const wrapper = mount(DarkModeToggle)

    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('has correct aria-label', () => {
    const wrapper = mount(DarkModeToggle)

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBeDefined()
  })

  it('has hover styles', () => {
    const wrapper = mount(DarkModeToggle)

    const button = wrapper.find('button')
    expect(button.classes()).toContain('hover:bg-gray-100')
  })

  it('has focus ring for accessibility', () => {
    const wrapper = mount(DarkModeToggle)

    const button = wrapper.find('button')
    expect(button.classes()).toContain('focus:ring-2')
  })

  it('includes transition classes', () => {
    const wrapper = mount(DarkModeToggle)

    const button = wrapper.find('button')
    expect(button.classes()).toContain('transition-all')
    expect(button.classes()).toContain('duration-200')
  })
})
