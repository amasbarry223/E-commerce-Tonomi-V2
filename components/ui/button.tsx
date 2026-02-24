'use client'

import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { fastTransition } from '@/lib/animations'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  ripple?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ripple = true,
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const rippleTimeoutsRef = React.useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  React.useEffect(() => {
    const timeouts = rippleTimeoutsRef.current
    return () => {
      timeouts.forEach((id) => clearTimeout(id))
      timeouts.clear()
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { id, x, y }])
      const timeoutId = setTimeout(() => {
        rippleTimeoutsRef.current.delete(id)
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      rippleTimeoutsRef.current.set(id, timeoutId)
    }

    if (!loading && !disabled && onClick) {
      onClick(e)
    }
  }

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={buttonRef}
      type={asChild ? undefined : "button"}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{
            width: 200,
            height: 200,
            x: ripple.x - 100,
            y: ripple.y - 100,
            opacity: [1, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={fastTransition}
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </motion.div>
      )}
      <Slottable>
        {asChild ? (
          children
        ) : (
          <motion.span
            animate={loading ? { opacity: 0 } : { opacity: 1 }}
            transition={fastTransition}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </Slottable>
    </Comp>
  )
}

export { Button, buttonVariants }
