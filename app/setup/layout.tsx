'use client'

import React from 'react'
import { FinancialProvider } from '@/lib/context/financial-context'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <FinancialProvider>{children}</FinancialProvider>
}
