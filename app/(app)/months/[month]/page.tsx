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
  Printer,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { filterTransactionsByMonth, calculateTransactionTotals, aggregateSpendingByCategory } from '@/lib/finance/transactions'

export default function MonthArchiveDetailPage({
  params,
}: {
  params: Promise<{ month: string }>
}) {
  const resolvedParams = use(params)
  const { currency, transactions, categories } = useFinancialData()

  // Parse year and month
  const monthId = resolvedParams.month
  const [yearStr, monthNumStr] = monthId.split('-')
  const year = parseInt(yearStr, 10) || new Date().getFullYear()
  const monthNum = parseInt(monthNumStr, 10) || (new Date().getMonth() + 1)

  const dateObj = new Date(year, monthNum - 1, 1)
  const monthTitle = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Compute real data for this month from user transactions
  const monthTxs = filterTransactionsByMonth(transactions, year, monthNum)
  const totals = calculateTransactionTotals(monthTxs)
  const categoryBreakdown = aggregateSpendingByCategory(monthTxs, categories)
  const surplus = totals.totalIncome - totals.totalExpenses - totals.totalTransfers

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/months"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9AAFA5] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Months Archive
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white/[0.04] text-[#9AAFA5] hover:text-white transition-colors text-xs flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Statement</span>
          </button>
          <Badge variant="default" className="text-xs">
            Statement Locked & Audited
          </Badge>
        </div>
      </div>

      {/* Month Hero Card */}
      <Card className="bg-[#0B110E] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center font-bold">
                <Calendar size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{monthTitle}</h1>
                <p className="text-xs text-[#9AAFA5] mt-0.5">Official Historical Statement Archive</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#60756C]">Net Monthly Cash Surplus</div>
              <div
                className={`text-2xl font-black mt-0.5 ${
                  surplus >= 0 ? 'text-[#19D98A]' : 'text-[#E05252]'
                }`}
              >
                {surplus >= 0 ? '+' : ''}
                {formatMoney(surplus, currency)}
              </div>
            </div>
          </div>

          {/* 3 Summary Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/[0.04]">
            <div className="p-4 rounded-2xl bg-white/[0.02]">
              <div className="text-[10px] text-[#60756C] uppercase font-bold">Total Inflows Deposited</div>
              <div className="text-lg font-black text-white mt-1">
                +{formatMoney(totals.totalIncome, currency)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02]">
              <div className="text-[10px] text-[#60756C] uppercase font-bold">Total Living Outflows</div>
              <div className="text-lg font-black text-white mt-1">
                -{formatMoney(totals.totalExpenses, currency)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02]">
              <div className="text-[10px] text-[#60756C] uppercase font-bold">Transferred into Savings</div>
              <div className="text-lg font-black text-[#19D98A] mt-1">
                {formatMoney(totals.totalTransfers, currency)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown for this month */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white px-1">Audited Category Breakdown</h2>

        <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#60756C]">
              No transactions recorded for this billing period.
            </div>
          ) : (
            categoryBreakdown.map((cat) => (
              <div key={cat.categoryId} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.categoryName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{cat.categoryName}</div>
                    <div className="text-[11px] text-[#60756C]">
                      {cat.transactionCount} entries • {cat.percentageOfTotal}% of monthly expenses
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-white">
                    {formatMoney(cat.totalSpent, currency)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Itemized Transactions for this month */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white px-1">
          Itemized Transactions ({monthTxs.length})
        </h2>

        <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {monthTxs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#60756C]">No itemized entries found.</div>
          ) : (
            monthTxs.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">{t.description}</div>
                  <div className="text-[10px] text-[#60756C] mt-0.5">
                    {t.transaction_date} • {t.payment_method || 'Cash'}
                  </div>
                </div>
                <div
                  className={`font-black ${
                    t.type === 'income' ? 'text-[#19D98A]' : t.type === 'transfer' ? 'text-[#63F2B0]' : 'text-white'
                  }`}
                >
                  {t.type === 'income' ? '+' : t.type === 'transfer' ? '⇄' : '-'}
                  {formatMoney(t.amount, currency)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
