/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700
} as const

/**
 * Animation easing functions
 */
export const ANIMATION_EASING = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounceOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
} as const

/**
 * Common transition classes for Tailwind
 */
export const TRANSITION_CLASSES = {
  all: 'transition-all',
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  transform: 'transition-transform',
  shadow: 'transition-shadow'
} as const

/**
 * Animation delays (in milliseconds)
 */
export const ANIMATION_DELAY = {
  none: 0,
  short: 75,
  medium: 150,
  long: 300
} as const

/**
 * Stagger delay for list animations (in milliseconds)
 */
export const STAGGER_DELAY = 50
