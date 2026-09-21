'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BarChart3,
  Receipt,
  Users,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  // Strict 5 tabs per product specification
  const tabs = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Family', href: '/family', icon: Users },
    { name: 'More', href: '/more', icon: Menu },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#070B09]/95 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            pathname === tab.href ||
            (tab.href !== '/home' && pathname.startsWith(`${tab.href}/`))

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 text-[10px] sm:text-[11px] font-medium transition-all active:scale-95',
                isActive
                  ? 'text-[#19D98A] font-bold'
                  : 'text-[#60756C] hover:text-[#9AAFA5]'
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(
                    'transition-transform duration-200',
                    isActive ? 'scale-110 text-[#19D98A]' : 'text-[#60756C]'
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#19D98A] shadow-[0_0_8px_rgba(25,217,138,0.8)]" />
                )}
              </div>
              <span className="mt-1 leading-none">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
