'use client'

import React from 'react'
import Link from 'next/link'
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PastMonth {
  id: string
  name: string
  year: number
  income: number
  expenses: number
  savings: number
  surplus: number
  status: 'Audited' | 'Finalized'
}

const pastMonths: PastMonth[] = [
  { id: '2026-09', name: 'September 2026', year: 2026, income: 7500, expenses: 5120, savings: 1800, surplus: 580, status: 'Audited' },
  { id: '2026-08', name: 'August 2026', year: 2026, income: 8450, expenses: 5410, savings: 2200, surplus: 840, status: 'Finalized' },
  { id: '2026-07', name: 'July 2026', year: 2026, income: 7500, expenses: 4890, savings: 1950, surplus: 660, status: 'Audited' },
  { id: '2026-06', name: 'June 2026', year: 2026, income: 7200, expenses: 5040, savings: 1600, surplus: 560, status: 'Audited' },
  { id: '2026-05', name: 'May 2026', year: 2026, income: 7200, expenses: 4980, savings: 1550, surplus: 670, status: 'Audited' },
]

export default function MonthsHistoryPage() {
  const { currency } = useFinancialData()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Previous Months History
        </h1>
        <p className="text-sm text-[#9AAFA5] mt-0.5">
          Archived monthly financial statements, historical cash flow, and auditing records.
        </p>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {pastMonths.map((m) => (
          <Link
            key={m.id}
            href={`/months/${m.id}`}
            className="block p-5 rounded-3xl bg-[#0B110E] border border-white/[0.06] hover:border-[#19D98A]/40 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#19D98A] flex items-center justify-center font-bold">
                  <Calendar size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-[#19D98A] transition-colors">
                      {m.name}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {m.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#60756C] mt-0.5">Closed monthly statement</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-[#60756C]">Inflow</div>
                    <div className="font-bold text-[#19D98A]">+{formatMoney(m.income, currency)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#60756C]">Outflow</div>
                    <div className="font-bold text-white">-{formatMoney(m.expenses, currency)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#60756C]">Saved</div>
                    <div className="font-bold text-[#63F2B0]">{formatMoney(m.savings, currency)}</div>
                  </div>
                </div>

                <ChevronRight size={18} className="text-[#60756C] group-hover:text-white transition-colors shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
