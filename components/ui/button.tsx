import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#19D98A] text-[#050806] hover:bg-[#3EE8A2] shadow-[0_4px_16px_rgba(25,217,138,0.25)] hover:shadow-[0_6px_20px_rgba(25,217,138,0.35)]',
        destructive:
          'bg-[#E05252] text-white hover:bg-[#F06565] shadow-[0_4px_16px_rgba(224,82,82,0.25)]',
        outline:
          'border border-white/10 bg-transparent text-[#F5FFF9] hover:bg-white/[0.06] hover:border-white/20',
        emeraldOutline:
          'border border-[#19D98A]/30 bg-[#19D98A]/5 text-[#19D98A] hover:bg-[#19D98A]/15 hover:border-[#19D98A]/50',
        secondary:
          'bg-[#101A15] text-[#F5FFF9] border border-white/[0.06] hover:bg-[#15231D] hover:border-white/[0.12]',
        ghost:
          'text-[#9AAFA5] hover:text-[#F5FFF9] hover:bg-white/[0.06]',
        link:
          'text-[#19D98A] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-13 rounded-2xl px-7 text-base font-bold',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
