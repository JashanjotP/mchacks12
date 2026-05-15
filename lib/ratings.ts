export const RATING_MAX = 5

/** Converts legacy 1–10 ratings to 1–5; leaves 1–5 values unchanged. */
export function normalizeToFivePoint(rating: number): number {
  if (!rating || rating <= 0) return 0
  if (rating > RATING_MAX) return Math.min(RATING_MAX, rating / 2)
  return rating
}

export function formatRatingDisplay(rating: number): string {
  const n = normalizeToFivePoint(rating)
  return n > 0 ? n.toFixed(1) : '—'
}

export type RatingTier = 'green' | 'amber' | 'red' | 'empty'

/** Green 4.0+, amber 2.5–3.9, red below 2.5. */
export function getRatingTier(rating: number): RatingTier {
  const n = normalizeToFivePoint(rating)
  if (n <= 0) return 'empty'
  if (n >= 4) return 'green'
  if (n >= 2.5 && n <= 3.9) return 'amber'
  if (n < 2.5) return 'red'
  return 'amber'
}

/** Bucket counts for stars 1–5 (index 0 = 1 star). */
export function ratingDistributionOutOfFive(
  ratings: number[]
): number[] {
  const counts = new Array(RATING_MAX).fill(0)
  ratings.forEach((raw) => {
    const n = normalizeToFivePoint(raw)
    if (n < 1) return
    const bucket = Math.min(RATING_MAX - 1, Math.max(0, Math.round(n) - 1))
    counts[bucket]++
  })
  return counts
}
