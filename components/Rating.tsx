// components/ui/rating.tsx
import React from 'react'
import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Rating({ value, onChange, readOnly = false, size = 'md' }: RatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          className={!readOnly ? 'cursor-pointer' : ''}
          disabled={readOnly}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}