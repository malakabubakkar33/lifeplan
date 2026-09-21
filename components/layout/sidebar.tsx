'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Sparkles,
  Receipt,
  CalendarClock,
  Users,
  Target,
  BarChart3,
  FileSpreadsheet,
  Bot,
  Bell,
  Settings,
  PlusCircle,
  ShieldCheck,
  LogOut,
  Smartphone,
} from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useFinancialData } from '@/lib/context/financial-context'
import { useAppAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Smart Plan', href: '/plans', icon: Sparkles },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Bills & Due Dates', href: '/bills', icon: CalendarClock },
  { name: 'Family & Children', href: '/family', icon: Users },
  { name: 'Savings & Goals', href: '/goals', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports & Export', href: '/reports', icon: FileSpreadsheet },
  { name: 'AI Assistant', href: '/assistant', icon: Bot, badge: 'Smart' },
  { name: 'Notifications', href: '/notifications', icon: Bell, hasBadge: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ onOpenAddExpense }: { onOpenAddExpense?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile, unreadCount } = useFinancialData()
  const { isLiveClerk } = useAppAuth()
  const clerk = isLiveClerk ? useClerk() : null

  const handleSignOut = async () => {
    if (clerk) {
      await clerk.signOut()
    }
    router.push('/sign-in')
  }

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col sticky top-0 h-screen bg-[#070B09] border-r border-white/[0.06] z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-white/[0.04]">
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#19D98A] to-[#0B6B45] flex items-center justify-center text-[#050806] shadow-[0_0_20px_rgba(25,217,138,0.3)] group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">LifePlan</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#19D98A]/20 text-[#19D98A]">PWA</span>
            </div>
            <p className="text-[10px] text-[#60756C] font-medium tracking-tight">Plan Today. Secure Tomorrow.</p>
          </div>
        </Link>
      </div>

      {/* Quick Add Button */}
      <div className="px-4 py-3">
        {onOpenAddExpense ? (
          <button
            onClick={onOpenAddExpense}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm shadow-[0_4px_16px_rgba(25,217,138,0.25)] hover:bg-[#3EE8A2] transition-all active:scale-[0.98]"
          >
            <PlusCircle size={17} />
            <span>Record Transaction</span>
          </button>
        ) : (
          <Link
            href="/transactions/new"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm shadow-[0_4px_16px_rgba(25,217,138,0.25)] hover:bg-[#3EE8A2] transition-all active:scale-[0.98]"
          >
            <PlusCircle size={17} />
            <span>Record Transaction</span>
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
        <div className="px-3 py-1.5 text-[10px] font-bold text-[#60756C] uppercase tracking-wider">
          Financial Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(`${item.href}/`))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-[#19D98A]/10 text-[#19D98A] border border-[#19D98A]/20 font-bold'
                  : 'text-[#9AAFA5] hover:text-[#F5FFF9] hover:bg-white/[0.04]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-[#19D98A]' : 'text-[#60756C] group-hover:text-[#F5FFF9]'
                  )}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#19D98A]/20 text-[#19D98A]">
                  {item.badge}
                </span>
              )}

              {item.hasBadge && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#19D98A] text-[#050806] text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}

        {/* PWA Install link in sidebar */}
        <div className="pt-2">
          <Link
            href="/install"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#63F2B0] hover:bg-white/[0.04] transition-all"
          >
            <Smartphone size={18} className="text-[#19D98A]" />
            <span>Install PWA App</span>
          </Link>
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-4 border-t border-white/[0.06] bg-[#050806]/60">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-3 group flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-bold text-xs shrink-0">
              {userProfile.full_name?.charAt(0) || 'A'}
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-bold text-white group-hover:text-[#19D98A] transition-colors truncate">
                {userProfile.full_name || 'Alex Morgan'}
              </div>
              <div className="text-[10px] text-[#60756C] truncate">{userProfile.email || 'alex@lifeplan.app'}</div>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-[#60756C] hover:text-[#E05252] hover:bg-white/[0.04] transition-colors shrink-0"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
