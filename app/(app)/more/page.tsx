'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  Sparkles,
  CalendarClock,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Bot,
  Bell,
  Settings,
  User,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { Card, CardContent } from '@/components/ui/card'

const menuSections = [
  {
    title: 'Financial Management',
    items: [
      { name: 'Family & Children', href: '/family', icon: Users, desc: 'Allowances & school tuition' },
      { name: 'Smart Monthly Plan', href: '/plans', icon: Sparkles, desc: '50/30/20 target distribution' },
      { name: 'Bills & Subscriptions', href: '/bills', icon: CalendarClock, desc: 'Upcoming payments & due dates' },
      { name: 'Month History', href: '/months', icon: Calendar, desc: 'Past archived statements' },
    ],
  },
  {
    title: 'Intelligence & Insights',
    items: [
      { name: 'Analytics & Trends', href: '/analytics', icon: BarChart3, desc: 'Visual charts and ratios' },
      { name: 'AI Financial Advisor', href: '/assistant', icon: Bot, desc: 'Smart contextual advice' },
      { name: 'Reports & Data Vault', href: '/reports', icon: FileSpreadsheet, desc: 'CSV export and backup' },
      { name: 'Notifications', href: '/notifications', icon: Bell, desc: 'Reminders & milestones' },
    ],
  },
  {
    title: 'Account & Preferences',
    items: [
      { name: 'User Profile', href: '/profile', icon: User, desc: 'Identity & credentials' },
      { name: 'Settings', href: '/settings', icon: Settings, desc: 'Currency & alert rules' },
    ],
  },
]

export default function MoreMenuPage() {
  const { userProfile, unreadCount } = useFinancialData()

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* User Header */}
      <div className="p-4 rounded-3xl bg-[#0B110E] border border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-black text-lg">
            {userProfile.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{userProfile.full_name || 'Alex Morgan'}</h2>
            <p className="text-xs text-[#60756C]">{userProfile.email || 'alex@lifeplan.app'}</p>
          </div>
        </div>

        <Link
          href="/profile"
          className="text-xs font-semibold text-[#19D98A] px-3 py-1.5 rounded-xl bg-[#19D98A]/10 border border-[#19D98A]/20"
        >
          View Profile
        </Link>
      </div>

      {/* Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-xs font-bold text-[#60756C] uppercase tracking-wider px-2">
            {section.title}
          </h3>
          <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] text-[#19D98A] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[#19D98A] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#60756C]">{item.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.name === 'Notifications' && unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#19D98A] text-[#050806] text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-[#60756C]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
