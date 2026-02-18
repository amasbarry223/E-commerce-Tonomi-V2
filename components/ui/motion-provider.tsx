'use client'

import { ReactNode, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

interface MotionProviderProps {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <MotionConfig
      reducedMotion={reducedMotion ? 'always' : 'user'}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </MotionConfig>
  )
}
