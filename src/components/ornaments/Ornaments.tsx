'use client'

import { cn } from '@/lib/utils'

// === Art Nouveau / Alphonse Mucha decorative SVG components ===
// All use currentColor or var(--gold) for theming

interface OrnamentProps {
  className?: string
  opacity?: number
}

// Mucha Halo — concentric ring with 12 floral ticks, behind hero
export function MuchaHalo({ className, opacity = 1 }: OrnamentProps) {
  const ticks = Array.from({ length: 12 }, (_, i) => (
    <path
      key={i}
      d="M200 20 Q205 40 200 60 Q195 40 200 20 Z"
      transform={`rotate(${i * 30} 200 200)`}
      fill="var(--gold)"
      fillOpacity={0.15}
      stroke="var(--gold)"
      strokeWidth={1}
    />
  ))
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn('pointer-events-none', className)}
      style={{ opacity }}
      fill="none"
    >
      <circle cx="200" cy="200" r="190" stroke="var(--halo)" strokeWidth="2" />
      <circle cx="200" cy="200" r="170" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="140" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="1 3" opacity={0.5} />
      {ticks}
    </svg>
  )
}

// Botanical Corner Ornament — quarter-arc stem + 3 leaves
export function CornerOrnament({ className, opacity = 0.3, rotate = 0 }: OrnamentProps & { rotate?: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn('pointer-events-none', className)}
      style={{ opacity, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      fill="none"
    >
      <path d="M5 75 Q 30 50 55 35 Q 65 25 75 5" stroke="var(--gold)" strokeWidth="1.2" />
      <path d="M25 55 Q 15 50 18 40 Q 28 45 25 55 Z" fill="var(--gold)" fillOpacity="0.15" stroke="var(--gold)" strokeWidth="0.5" />
      <path d="M45 40 Q 35 35 38 25 Q 50 32 45 40 Z" fill="var(--gold)" fillOpacity="0.15" stroke="var(--gold)" strokeWidth="0.5" />
      <path d="M62 22 Q 52 18 55 8 Q 67 14 62 22 Z" fill="var(--gold)" fillOpacity="0.15" stroke="var(--gold)" strokeWidth="0.5" />
      <circle cx="75" cy="5" r="2" fill="var(--rose)" />
    </svg>
  )
}

// Section Divider Vine — full-width flowing stem + blossom
export function DividerVine({ className, opacity = 0.4 }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={cn('pointer-events-none w-full', className)}
      style={{ opacity }}
      fill="none"
    >
      <path d="M0 20 Q 200 5 400 20 T 800 20 T 1200 20" stroke="var(--gold)" strokeWidth="1" />
      <path d="M590 20 Q 600 8 610 20 Q 600 32 590 20 Z" fill="var(--rose)" fillOpacity="0.6" stroke="var(--gold)" strokeWidth="0.5" />
      <circle cx="600" cy="20" r="3" fill="var(--accent)" />
      <path d="M580 20 Q 575 15 570 20 Q 575 25 580 20 Z" fill="var(--gold)" fillOpacity="0.3" />
      <path d="M620 20 Q 625 15 630 20 Q 625 25 620 20 Z" fill="var(--gold)" fillOpacity="0.3" />
    </svg>
  )
}

// Circuit-Vine — PCB traces morphing into leaves (AI × Art Nouveau)
export function CircuitVine({ className, opacity = 0.08 }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('pointer-events-none', className)}
      style={{ opacity }}
      fill="none"
    >
      <path d="M10 100 H 60 V 60 H 100" stroke="var(--teal-dusty)" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="2" fill="var(--gold)" stroke="none" />
      <path d="M100 60 Q 110 40 120 50 Q 115 70 100 60 Z" fill="var(--primary)" fillOpacity="0.2" stroke="var(--teal-dusty)" strokeWidth="0.4" />
      <path d="M120 50 H 180" stroke="var(--teal-dusty)" strokeWidth="0.6" strokeDasharray="3 2" />
      <circle cx="180" cy="50" r="1.5" fill="var(--gold)" stroke="none" />
      <path d="M60 100 V 140 H 100" stroke="var(--teal-dusty)" strokeWidth="0.6" />
      <path d="M100 140 Q 90 160 110 165 Q 120 150 100 140 Z" fill="var(--primary)" fillOpacity="0.15" stroke="var(--teal-dusty)" strokeWidth="0.4" />
      <circle cx="100" cy="140" r="1.5" fill="var(--gold)" stroke="none" />
    </svg>
  )
}

// Card Frame — 4 corner ornaments for premium cards
export function CardFrame({ className, opacity = 0.25 }: OrnamentProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} style={{ opacity }}>
      <div className="absolute left-0 top-0">
        <CornerOrnament opacity={1} />
      </div>
      <div className="absolute right-0 top-0 scale-x-[-1]">
        <CornerOrnament opacity={1} />
      </div>
      <div className="absolute left-0 bottom-0 scale-y-[-1]">
        <CornerOrnament opacity={1} />
      </div>
      <div className="absolute right-0 bottom-0 scale-x-[-1] scale-y-[-1]">
        <CornerOrnament opacity={1} />
      </div>
    </div>
  )
}

// Floral Bullet — for lists
export function FloralBullet({ className, opacity = 0.6 }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn('inline-block shrink-0', className)}
      style={{ opacity }}
      fill="none"
    >
      <circle cx="10" cy="10" r="3" fill="var(--gold)" fillOpacity="0.3" stroke="var(--gold)" strokeWidth="0.8" />
      <path d="M10 2 Q 12 6 10 8 Q 8 6 10 2 Z" fill="var(--gold)" fillOpacity="0.2" />
      <path d="M10 18 Q 12 14 10 12 Q 8 14 10 18 Z" fill="var(--gold)" fillOpacity="0.2" />
      <path d="M2 10 Q 6 12 8 10 Q 6 8 2 10 Z" fill="var(--gold)" fillOpacity="0.2" />
      <path d="M18 10 Q 14 12 12 10 Q 14 8 18 10 Z" fill="var(--gold)" fillOpacity="0.2" />
    </svg>
  )
}
