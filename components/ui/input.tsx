import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#101A15] px-4 py-2 text-sm text-[#F5FFF9] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#60756C] focus-visible:outline-none focus-visible:border-[#19D98A]/60 focus-visible:ring-2 focus-visible:ring-[#19D98A]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
