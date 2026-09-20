'use client'

import React, { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  FileSpreadsheet,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function MonthArchiveDetailPage({
  params,
}: {
  params: Promise<{ month: string }>
}) {
  const resolvedParams = use(params)
  const { currency } = useFinancialData()

  // Format month label
  const monthId = resolvedParams.month
  const [yearStr, monthNumStr] = monthId.split('-')
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthNumStr, 10) - 1, 1)
  const monthTitle = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' })

  const income = 7500
  const expenses = 5120
  const savings = 1800
  const surplus = income - expenses - savings

  const categories = [
    { name: 'Housing & Rent', amount: 1800, pct: 35 },
    { name: 'Household Groceries', amount: 680, pct: 13 },
    { name: 'Utilities & Bills', amount: 260, pct: 5 },
    { name: 'Transportation & Fuel', amount: 370, pct: 7 },
    { name: 'Children Tuition & School', amount: 450, pct: 9 },
    { name: 'Healthcare & Meds', amount: 190, pct: 4 },
    { name: 'Debt Repayment', amount: 350, pct: 7 },
    { name: 'Personal & Leisure', amount: 420, pct: 8 },
    { name: 'Liquid Savings & Goals', amount: 1800, pct: 35 },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/months"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9AAFA5] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Months Archive
        </Link>
        <Badge variant="default" className="text-xs">
          Statement Locked & Audited
        </Badge>
      </div>

      {/* Month Hero Card */}
      <Card className="bg-[#0B110E] border-white/[0.08]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center font-bold">
                <Calendar size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{monthTitle}</h1>
                <p className="text-xs text-[#9AAFA5] mt-0.5">Official Historical Statement Archive</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#60756C]">Net Monthly Cash Surplus</div>
              <div className="text-2xl font-black text-[#19D98A] mt-0.5">
                +{formatMoney(surplus, currency)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/[0.04]">
            <div className="p-3.5 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Total Income Deposited</div>
              <div className="text-base font-bold text-white mt-0.5">
                +{formatMoney(income, currency)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Total Living Outflows</div>
              <div className="text-base font-bold text-white mt-0.5">
                -{formatMoney(expenses, currency)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Total Capital Saved</div>
              <div className="text-base font-bold text-[#63F2B0] mt-0.5">
                {formatMoney(savings, currency)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorical Breakdown */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="border-b border-white/[0.04] pb-4">
          <CardTitle className="text-base font-bold text-white">
            Archived Expense Allocation
          </CardTitle>
          <p className="text-xs text-[#9AAFA5]">Category tallies finalized at end of billing cycle</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {categories.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{c.name}</span>
                <span className="text-[#9AAFA5]">{formatMoney(c.amount, currency)}</span>
              </div>
              <Progress value={c.pct} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
