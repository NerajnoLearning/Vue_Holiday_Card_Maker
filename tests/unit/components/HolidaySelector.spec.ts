import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HolidaySelector from '@/components/templates/HolidaySelector.vue'
import TemplateCard from '@/components/templates/TemplateCard.vue'
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates'

describe('HolidaySelector.vue', () => {
  it('renders all template cards', () => {
    const wrapper = mount(HolidaySelector, {
      global: {
        stubs: {
          TemplateCard: true,
          TransitionGroup: false,
        },
      },
    })

    const templateCards = wrapper.findAllComponents({ name: 'TemplateCard' })
    expect(templateCards.length).toBe(HOLIDAY_TEMPLATES.length)
  })

  it('passes correct props to template cards', () => {
    const wrapper = mount(HolidaySelector, {
      props: {
        selectedTemplate: 'christmas',
      },
      global: {
        stubs: {
          TransitionGroup: false,
        },
      },
    })

    const firstCard = wrapper.findComponent(TemplateCard)
    expect(firstCard.props('template')).toBeDefined()
    expect(firstCard.props('template').id).toBe(HOLIDAY_TEMPLATES[0].id)
  })

  it('marks selected template correctly', () => {
    const selectedId = 'valentine'
    const wrapper = mount(HolidaySelector, {
      props: {
        selectedTemplate: selectedId,
      },
      global: {
        stubs: {
          TransitionGroup: false,
        },
      },
    })

    const cards = wrapper.findAllComponents(TemplateCard)
    const selectedCard = cards.find((card) => card.props('template').id === selectedId)

    expect(selectedCard?.props('selected')).toBe(true)
  })

  it('emits select event when template is clicked', async () => {
    const wrapper = mount(HolidaySelector, {
      global: {
        stubs: {
          TransitionGroup: false,
        },
      },
    })

    const firstCard = wrapper.findComponent(TemplateCard)
    await firstCard.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([HOLIDAY_TEMPLATES[0].id])
  })

  it('uses christmas as default selected template', () => {
    const wrapper = mount(HolidaySelector, {
      global: {
        stubs: {
          TransitionGroup: false,
        },
      },
    })

    const cards = wrapper.findAllComponents(TemplateCard)
    const christmasCard = cards.find((card) => card.props('template').id === 'christmas')

    expect(christmasCard?.props('selected')).toBe(true)
  })

  it('renders with responsive grid layout', () => {
    const wrapper = mount(HolidaySelector, {
      global: {
        stubs: {
          TemplateCard: true,
          TransitionGroup: false,
        },
      },
    })

    expect(wrapper.find('.grid').exists()).toBe(true)
    expect(wrapper.find('.grid-cols-2').exists()).toBe(true)
    expect(wrapper.find('.md\\:grid-cols-4').exists()).toBe(true)
  })
})
