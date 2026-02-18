'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const skeletonVariants = cva('rounded-md', {
  variants: {
    variant: {
      default: 'bg-accent animate-shimmer',
      card: 'bg-accent animate-shimmer rounded-lg',
      text: 'bg-accent animate-shimmer h-4',
      image: 'bg-accent animate-shimmer aspect-square',
      avatar: 'bg-accent animate-shimmer rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface SkeletonProps extends React.ComponentProps<'div'>, VariantProps<typeof skeletonVariants> {
  variant?: 'default' | 'card' | 'text' | 'image' | 'avatar'
}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
