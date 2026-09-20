'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Plus, Target, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Home', href: '/home', icon: LayoutDashboard },
    { name: 'History', href: '/transactions', icon: Receipt },
    { name: 'Add', href: '/transactions/new', isAction: true },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'More', href: '/more', icon: Menu },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#070B09]/95 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative -top-4 flex items-center justify-center"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] shadow-[0_4px_20px_rgba(25,217,138,0.4)] active:scale-95 transition-transform">
                  <Plus size={28} strokeWidth={2.5} />
                </div>
              </Link>
            )
          }

          const Icon = tab.icon!
          const isActive = pathname === tab.href || (tab.href !== '/home' && pathname.startsWith(`${tab.href}/`))

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all',
                isActive ? 'text-[#19D98A]' : 'text-[#60756C] hover:text-[#9AAFA5]'
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#19D98A]" />
                )}
              </div>
              <span className="mt-1">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
