'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, WifiOff, Sparkles } from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { CURRENCIES } from '@/lib/finance/currency'

import { UserButton } from '@clerk/nextjs'
import { isLiveClerk } from '@/components/providers/auth-provider'

export function Header() {
  const { unreadCount, currency, updateUserProfile } = useFinancialData()
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-[#E09B35]/20 border-b border-[#E09B35]/30 px-4 py-2 text-center text-xs font-semibold text-[#E09B35] flex items-center justify-center gap-2">
          <WifiOff size={14} />
          <span>You are currently offline. Changes are saved locally and will sync once connected.</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-[#050806]/85 backdrop-blur-xl border-b border-white/[0.04]">
        {/* Left Side: Mobile Logo / Desktop Title */}
        <div className="flex items-center gap-3">
          <Link href="/home" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#19D98A] flex items-center justify-center text-[#050806] font-black text-sm">
              LP
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">LifePlan</span>
          </Link>
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#9AAFA5]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#19D98A] animate-pulse" />
            <span className="font-medium text-[#F5FFF9]">LifePlan Engine Active</span>
            <span className="text-[#60756C]">•</span>
            <span>Secure Financial Vault</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => updateUserProfile({ currency: e.target.value })}
            className="bg-[#101A15] text-[#9AAFA5] hover:text-[#F5FFF9] border border-white/[0.08] text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#19D98A]/50 transition-colors cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0B110E] text-white">
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>

          {/* AI Advisor Quick Button */}
          <Link
            href="/assistant"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19D98A]/10 border border-[#19D98A]/25 text-[#19D98A] text-xs font-bold hover:bg-[#19D98A]/20 transition-all"
          >
            <Sparkles size={14} />
            <span>AI Advisor</span>
          </Link>

          {/* Notifications Link */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-xl text-[#9AAFA5] hover:text-[#F5FFF9] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] transition-all"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#19D98A] shadow-[0_0_8px_#19D98A]" />
            )}
          </Link>

          {/* User Auth Control */}
          {mounted && isLiveClerk ? (
            <div className="flex items-center pl-1">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: 34, height: 34, borderRadius: 10 },
                  },
                }}
              />
            </div>
          ) : (
            <Link
              href="/profile"
              className="w-8 h-8 rounded-lg bg-[#19D98A]/15 border border-[#19D98A]/30 text-[#19D98A] font-bold text-xs flex items-center justify-center hover:scale-105 transition-transform"
            >
              LP
            </Link>
          )}
        </div>
      </header>
    </>
  )
}
