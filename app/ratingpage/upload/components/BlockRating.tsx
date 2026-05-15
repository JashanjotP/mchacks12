'use client'

import React from 'react'

type BlockRatingProps = {
  value: number
  onChange: (value: number) => void
  lowLabel: string
  highLabel: string
  error?: string
}

export function BlockRating({
  value,
  onChange,
  lowLabel,
  highLabel,
  error,
}: BlockRatingProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} out of 5`}
            onClick={() => onChange(n)}
            className={`h-12 flex-1 rounded-md border-2 transition-all ${
              value >= n
                ? 'border-amber-500 bg-amber-400'
                : 'border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>1 — {lowLabel}</span>
        <span>5 — {highLabel}</span>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
    </div>
  )
}