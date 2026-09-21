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
  FileSpreadsheet,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { computeMonthlyFlowTrend } from '@/lib/finance/analytics'

export default function MonthsHistoryPage() {
  const { currency, transactions } = useFinancialData()

  // Generate the last 12 historical months from actual data
  const now = new Date()
  const historyTrend = computeMonthlyFlowTrend(transactions, 12, now)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Previous Months History
        </h1>
        <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
          Archived monthly statements, historical cash flow, and immutable financial records.
        </p>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {historyTrend.map((m) => {
          const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month) + 1
          const monthId = `${m.year}-${monthIndex.toString().padStart(2, '0')}`

          return (
            <Link
              key={monthId}
              href={`/months/${monthId}`}
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
                        {m.month} {m.year}
                      </h3>
                      <Badge variant="secondary" className="text-[10px]">
                        Audited Statement
                      </Badge>
                    </div>
                    <p className="text-xs text-[#60756C] mt-0.5">
                      Net Surplus: <span className="text-[#19D98A] font-semibold">{formatMoney(m.surplus, currency)}</span>
                    </p>
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
          )
        })}
      </div>
    </div>
  )
}
