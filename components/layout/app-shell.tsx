'use client'

import React from 'react'
import { FinancialProvider } from '@/lib/context/financial-context'
import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { Header } from './header'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-[#050806] text-[#F5FFF9] flex flex-row selection:bg-[#19D98A]/30 selection:text-[#19D98A]">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Header />
          <main className="flex-1 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pt-4 sm:pt-6">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </FinancialProvider>
  )
}
