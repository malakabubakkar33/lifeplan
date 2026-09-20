import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#19D98A]/15 text-[#19D98A] border-[#19D98A]/30',
        secondary:
          'border-transparent bg-white/[0.08] text-[#F5FFF9]',
        destructive:
          'border-transparent bg-[#E05252]/15 text-[#E05252] border-[#E05252]/30',
        warning:
          'border-transparent bg-[#E09B35]/15 text-[#E09B35] border-[#E09B35]/30',
        outline:
          'text-[#F5FFF9] border-white/15',
        success:
          'border-transparent bg-[#19D98A]/15 text-[#19D98A] border-[#19D98A]/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
