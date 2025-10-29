import { describe, it, expect } from 'vitest'
import { useGreetingCard } from '@/composables/useGreetingCard'
import type { GreetingCardData } from '@/types/greeting-card'

describe('useGreetingCard', () => {
  it('should initialize with null cardData', () => {
    const { cardData } = useGreetingCard()

    expect(cardData.value).toBeNull()
  })

  it('should expose cardData and updateCard', () => {
    const { cardData, updateCard } = useGreetingCard()

    expect(cardData).toBeDefined()
    expect(updateCard).toBeDefined()
    expect(typeof updateCard).toBe('function')
  })

  it('should be a reactive composable', () => {
    const { cardData } = useGreetingCard()

    // cardData should be a ref
    expect('value' in cardData).toBe(true)
  })
})
