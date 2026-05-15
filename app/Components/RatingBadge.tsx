'use client'

import { formatRatingDisplay, getRatingTier } from '@/lib/ratings'
import { cn } from '@/lib/utils'

const BADGE_BASE =
  'font-bold px-3 py-2 rounded-lg inline-block shadow-sm border min-w-[3.5rem] text-center'

const TIER_STYLES = {
  green:
    'bg-emerald-300 text-emerald-900 border-emerald-400',
  amber:
    'bg-amber-300 text-amber-800 border-amber-200',
  red:
    'bg-red-300 text-red-900 border-red-400',
  empty:
    'bg-stone-300 text-stone-500 border-stone-200',
} as const

type RatingBadgeProps = {
  rating: number
  className?: string
}

/** Rating pill: green (>4), yellow (2.5–3.9), red (<2.5). */
export function RatingBadge({ rating, className }: RatingBadgeProps) {
  const tier = getRatingTier(rating)

  return (
    <span
      className={cn(BADGE_BASE, TIER_STYLES[tier], 'text-xl', className)}
    >
      {formatRatingDisplay(rating)}
    </span>
  )
}
