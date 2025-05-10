"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sheetVariants = cva(
  "fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out",
  {
    variants: {
      size: {
        default: "h-[90vh] sm:h-[70vh]",
        sm: "h-1/3",
        lg: "h-[90vh]",
        full: "h-screen",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sheetVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, children, open, onOpenChange, title, description, size, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open || false)
    const [isClosing, setIsClosing] = React.useState(false)
    const overlayRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      setIsOpen(open || false)
    }, [open])

    const handleClose = () => {
      setIsClosing(true)
      setTimeout(() => {
        setIsClosing(false)
        setIsOpen(false)
        onOpenChange?.(false)
      }, 300)
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        handleClose()
      }
    }

    if (!isOpen && !isClosing) return null

    return (
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleOverlayClick}>
        <div
          ref={ref}
          className={cn(sheetVariants({ size }), isClosing ? "translate-y-full" : "translate-y-0", className)}
          {...props}
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-background p-4">
            <div>
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">{children}</div>
        </div>
      </div>
    )
  },
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet }
