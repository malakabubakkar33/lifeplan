'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  CalendarClock,
  Target,
  Calendar,
  FileSpreadsheet,
  Bot,
  User,
  Settings,
  Bell,
  Smartphone,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useFinancialData } from '@/lib/context/financial-context'
import { useAppAuth } from '@/components/providers/auth-provider'
import { IOSInstallSheet } from '@/components/pwa/ios-install-sheet'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export default function MoreMenuPage() {
  const router = useRouter()
  const { userProfile, unreadCount } = useFinancialData()
  const { isLiveClerk } = useAppAuth()
  const clerk = isLiveClerk ? useClerk() : null
  const { isIOS, isInstalled } = usePWAInstall()
  const [showIOSSheet, setShowIOSSheet] = useState(false)

  const handleSignOut = async () => {
    if (clerk) {
      await clerk.signOut()
    }
    router.push('/sign-in')
  }

  const financialItems = [
    { name: 'Smart Monthly Plan', href: '/plans', icon: Sparkles, desc: '50/30/20 target distribution & fine-tuning' },
    { name: 'Bills & Subscriptions', href: '/bills', icon: CalendarClock, desc: 'Upcoming payments, recurring due dates' },
    { name: 'Savings & Goals', href: '/goals', icon: Target, desc: 'Emergency fund & milestone targets' },
    { name: 'Previous Months History', href: '/months', icon: Calendar, desc: 'Audited statements and past performance' },
    { name: 'Reports & Statements', href: '/reports', icon: FileSpreadsheet, desc: 'Download CSV audit logs and PDFs' },
    { name: 'AI Financial Assistant', href: '/assistant', icon: Bot, desc: 'Authorized contextual advisory' },
  ]

  const accountItems = [
    { name: 'Profile Information', href: '/profile', icon: User, desc: 'Identity, currency & payday settings' },
    { name: 'Application Settings', href: '/settings', icon: Settings, desc: 'Preferences, security & data export' },
    { name: 'Notifications', href: '/notifications', icon: Bell, desc: 'Bill alerts & budget thresholds', count: unreadCount },
  ]

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-8">
      {/* Header Profile Summary */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0B110E] border border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-black text-xl shadow-[0_0_15px_rgba(25,217,138,0.25)]">
            {userProfile.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {userProfile.full_name || 'Alex Morgan'}
            </h2>
            <p className="text-xs text-[#60756C] mt-0.5">{userProfile.email || 'alex@lifeplan.app'}</p>
          </div>
        </div>

        <Link
          href="/profile"
          className="text-xs font-bold text-[#19D98A] px-3 py-1.5 rounded-xl bg-[#19D98A]/10 border border-[#19D98A]/20 hover:bg-[#19D98A]/20 transition-colors"
        >
          View Profile
        </Link>
      </div>

      {/* PWA Install Quick Action */}
      {!isInstalled && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#063B28] via-[#0B110E] to-[#070B09] border border-[#19D98A]/30 flex items-center justify-between shadow-[0_4px_20px_rgba(25,217,138,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#19D98A] text-[#050806] flex items-center justify-center font-bold shrink-0">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Install LifePlan App</div>
              <div className="text-[11px] text-[#9AAFA5]">Standalone mode on your Home Screen</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isIOS) setShowIOSSheet(true)
              else router.push('/install')
            }}
            className="px-3 py-1.5 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-xs hover:bg-[#3EE8A2] transition-colors"
          >
            Install
          </button>
        </div>
      )}

      {/* Group 1: Financial Management */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#60756C] uppercase tracking-wider px-2">
          Financial Management
        </h3>
        <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {financialItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] text-[#19D98A] flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#19D98A] transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#60756C]">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#60756C] group-hover:text-white transition-colors shrink-0" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Group 2: Account & Preferences */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#60756C] uppercase tracking-wider px-2">
          Account & Preferences
        </h3>
        <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {accountItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] text-white flex items-center justify-center shrink-0">
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
                  {item.count && item.count > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-[#19D98A] text-[#050806] text-[10px] font-black flex items-center justify-center">
                      {item.count}
                    </span>
                  ) : null}
                  <ChevronRight size={16} className="text-[#60756C] group-hover:text-white transition-colors shrink-0" />
                </div>
              </Link>
            )
          })}

          {/* Dedicated Install Link */}
          <Link
            href="/install"
            className="flex items-center justify-between p-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] text-[#63F2B0] flex items-center justify-center shrink-0">
                <Smartphone size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#19D98A] transition-colors">
                  PWA Installation Guide
                </div>
                <div className="text-[11px] text-[#60756C]">iPhone, Android & Desktop instructions</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#60756C] group-hover:text-white transition-colors shrink-0" />
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-2">
        <button
          onClick={handleSignOut}
          className="w-full p-4 rounded-3xl bg-[#0B110E] border border-white/[0.06] hover:border-[#E05252]/40 text-[#E05252] font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span>Sign Out of LifePlan</span>
        </button>
      </div>

      <IOSInstallSheet
        isOpen={showIOSSheet}
        onClose={() => setShowIOSSheet(false)}
      />
    </div>
  )
}
