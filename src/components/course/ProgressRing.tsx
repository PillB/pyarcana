'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 5,
  showLabel = true,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const [displayProgress, setDisplayProgress] = useState(0)

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 1200, bounce: 0 })

  useEffect(() => {
    motionValue.set(progress)
  }, [progress, motionValue])

  useEffect(() => {
    return springValue.on('change', (v) => setDisplayProgress(v))
  }, [springValue])

  const offset = circumference - (displayProgress / 100) * circumference

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className || ''}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`progress-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.55 0.22 285)" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 195)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.92 0.01 280)"
          strokeWidth={strokeWidth}
          className="dark:stroke-muted/40"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-gradient-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}
