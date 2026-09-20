'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  CalendarClock,
  Users,
  Target,
  FileSpreadsheet,
  BarChart3,
  Bot,
  Bell,
  Settings,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Bills & Due Dates', href: '/bills', icon: CalendarClock },
  { name: 'Family & Children', href: '/family', icon: Users },
  { name: 'Savings & Goals', href: '/goals', icon: Target },
  { name: 'Smart Monthly Plan', href: '/plans', icon: Sparkles },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports & Export', href: '/reports', icon: FileSpreadsheet },
  { name: 'AI Advisor', href: '/assistant', icon: Bot, badge: 'Smart' },
  { name: 'Notifications', href: '/notifications', icon: Bell, hasBadge: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { userProfile, safeToSpendDaily, unreadCount, currency } = useFinancialData()

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
            <p className="text-[11px] text-[#60756C] font-medium tracking-tight">Plan Today. Secure Tomorrow.</p>
          </div>
        </Link>
      </div>

      {/* Quick Add Button */}
      <div className="px-4 py-3">
        <Link
          href="/transactions/new"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm shadow-[0_4px_16px_rgba(25,217,138,0.25)] hover:bg-[#3EE8A2] transition-all active:scale-[0.98]"
        >
          <PlusCircle size={17} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-[#60756C] uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[#19D98A]/10 text-[#19D98A] border border-[#19D98A]/20 font-semibold'
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
              {isActive && <ChevronRight size={14} className="text-[#19D98A]/70" />}
            </Link>
          )
        })}

        <div className="px-3 pt-4 pb-1.5 text-[11px] font-semibold text-[#60756C] uppercase tracking-wider">
          Insights & Tools
        </div>
        {navItems.slice(6).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[#19D98A]/10 text-[#19D98A] border border-[#19D98A]/20 font-semibold'
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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#19D98A]/15 text-[#19D98A] border border-[#19D98A]/30">
                  {item.badge}
                </span>
              )}
              {item.hasBadge && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#19D98A] text-[#050806] text-[11px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Mini Safe to Spend Widget */}
      <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-[#101A15] to-[#0B110E] border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-[#9AAFA5] mb-1">
          <span>Safe-to-Spend</span>
          <span className="text-[10px] text-[#19D98A] font-semibold">Today</span>
        </div>
        <div className="text-xl font-black text-[#F5FFF9]">
          {formatMoney(safeToSpendDaily, currency)}
          <span className="text-xs font-normal text-[#60756C]"> /day</span>
        </div>
        <p className="text-[11px] text-[#60756C] mt-1">Calculated after fixed bills & savings</p>
      </div>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-white/[0.04] flex items-center justify-between">
        <Link href="/profile" className="flex items-center gap-3 group flex-1">
          <div className="w-9 h-9 rounded-full bg-[#19D98A]/20 border border-[#19D98A]/40 text-[#19D98A] font-bold text-xs flex items-center justify-center">
            {userProfile.full_name?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white group-hover:text-[#19D98A] transition-colors truncate">
              {userProfile.full_name || 'Alex Morgan'}
            </p>
            <p className="text-[11px] text-[#60756C] truncate">{userProfile.email || 'alex@lifeplan.app'}</p>
          </div>
        </Link>
        <Link
          href="/settings"
          className="p-2 rounded-lg text-[#60756C] hover:text-[#F5FFF9] hover:bg-white/[0.04] transition-colors"
          title="Settings"
        >
          <Settings size={17} />
        </Link>
      </div>
    </aside>
  )
}
