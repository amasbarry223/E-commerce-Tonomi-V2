'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { motion, PanInfo } from 'framer-motion'

import { cn } from '@/lib/utils'
import { overlayVariants, sheetVariants, getReducedMotionConfig, defaultTransition } from '@/lib/animations'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const sheetOverlayVariants = getReducedMotionConfig(overlayVariants)

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay asChild>
      <motion.div
        data-slot="sheet-overlay"
        className={cn(
          'fixed inset-0 z-50 bg-black/50',
          className,
        )}
        variants={sheetOverlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        {...props}
      />
    </SheetPrimitive.Overlay>
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const sheetContentVariants = getReducedMotionConfig(sheetVariants(side))

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const velocity = Math.abs(info.velocity.x) > Math.abs(info.velocity.y) 
      ? info.velocity.x 
      : info.velocity.y

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold || Math.abs(velocity) > 500) {
      // Fermer le sheet via Radix UI
      const closeEvent = new Event('close')
      document.dispatchEvent(closeEvent)
    }
  }

  const dragConstraints = React.useMemo(() => {
    if (side === 'right' || side === 'left') {
      return { left: 0, right: 0 }
    }
    return { top: 0, bottom: 0 }
  }, [side])

  const dragDirection = side === 'right' || side === 'left' ? 'x' : 'y'

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content asChild>
        <motion.div
          data-slot="sheet-content"
          className={cn(
            'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
            side === 'right' &&
              'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            side === 'left' &&
              'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            side === 'top' &&
              'inset-x-0 top-0 h-auto border-b',
            side === 'bottom' &&
              'inset-x-0 bottom-0 h-auto border-t',
            className,
          )}
          variants={sheetContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={defaultTransition}
          drag={dragDirection}
          dragConstraints={dragConstraints}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          {...props}
        >
          {children}
          <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </motion.div>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
