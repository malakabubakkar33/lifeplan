'use client'

import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Percent,
  Flame,
  ShieldCheck,
  Wallet,
  Users,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  computeMonthlyFlowTrend,
  computeSavingsRateTrend,
  computeCategoryDistribution,
} from '@/lib/finance/analytics'
import { aggregateSpendingByFamily } from '@/lib/finance/transactions'

export default function AnalyticsPage() {
  const { financialProfile, currency, transactions, categories, familyMembers } = useFinancialData()
  const [timeFilter, setTimeFilter] = useState<'this_month' | 'last_month' | '3m' | '6m' | '1y'>('6m')

  const monthCountMap = {
    this_month: 1,
    last_month: 2,
    '3m': 3,
    '6m': 6,
    '1y': 12,
  }

  const flowData = computeMonthlyFlowTrend(transactions, monthCountMap[timeFilter])
  const savingsData = computeSavingsRateTrend(flowData)
  const categoryData = computeCategoryDistribution(transactions, categories)
  const familySpending = aggregateSpendingByFamily(transactions, familyMembers)

  // Aggregated KPIs across filtered period
  const totalPeriodIncome = flowData.reduce((sum, d) => sum + d.income, 0)
  const totalPeriodExpenses = flowData.reduce((sum, d) => sum + d.expenses, 0)
  const totalPeriodSavings = flowData.reduce((sum, d) => sum + d.savings, 0)
  const avgSavingsRate = totalPeriodIncome > 0
    ? Math.round((totalPeriodSavings / totalPeriodIncome) * 100)
    : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header & Time Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Analytics & Trends
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Verified inflow vs outflow ratios, category distributions, and savings trajectory.
          </p>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0B110E] border border-white/[0.06] self-start sm:self-auto overflow-x-auto scrollbar-none">
          {[
            { label: 'This Month', key: 'this_month' },
            { label: 'Last Month', key: 'last_month' },
            { label: '3 Months', key: '3m' },
            { label: '6 Months', key: '6m' },
            { label: '1 Year', key: '1y' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTimeFilter(item.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                timeFilter === item.key
                  ? 'bg-[#19D98A] text-[#050806] shadow-md'
                  : 'text-[#9AAFA5] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] text-[#60756C] font-bold uppercase">Total Inflows</div>
          <div className="text-lg sm:text-xl font-black text-[#19D98A] mt-0.5">
            +{formatMoney(totalPeriodIncome, currency)}
          </div>
          <p className="text-[10px] text-[#9AAFA5] mt-0.5">Salary & credits</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] text-[#60756C] font-bold uppercase">Total Living Outflows</div>
          <div className="text-lg sm:text-xl font-black text-[#E05252] mt-0.5">
            -{formatMoney(totalPeriodExpenses, currency)}
          </div>
          <p className="text-[10px] text-[#9AAFA5] mt-0.5">Fixed & variable</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] text-[#60756C] font-bold uppercase">Capital Saved</div>
          <div className="text-lg sm:text-xl font-black text-[#63F2B0] mt-0.5">
            {formatMoney(totalPeriodSavings, currency)}
          </div>
          <p className="text-[10px] text-[#9AAFA5] mt-0.5">Transfers into vaults</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] text-[#60756C] font-bold uppercase">Avg Savings Rate</div>
          <div className="text-lg sm:text-xl font-black text-white mt-0.5">
            {avgSavingsRate}%
          </div>
          <p className="text-[10px] text-[#19D98A] mt-0.5">
            {avgSavingsRate >= 20 ? 'Optimal (≥20%)' : 'Target: 20%'}
          </p>
        </div>
      </div>

      {/* Chart 1: Monthly Inflow vs Outflow Bar Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Cash Flow: Inflow vs. Outflow</h3>
              <p className="text-[11px] text-[#60756C]">Computed from real monthly ledger entries</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#19D98A]" />
              <span className="text-[#9AAFA5]">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]" />
              <span className="text-[#9AAFA5]">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" stroke="#60756C" tick={{ fontSize: 11 }} />
              <YAxis stroke="#60756C" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#070B09',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#fff',
                }}
              />
              <Bar dataKey="income" name="Income" fill="#19D98A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#E05252" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: Donut Category Distribution & Savings Rate Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Donut */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3EE8A2]/10 text-[#3EE8A2] flex items-center justify-center">
              <PieIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Expense Category Distribution</h3>
              <p className="text-[11px] text-[#60756C]">Where your capital is actually going</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <p className="text-xs text-[#60756C]">No category expenses logged</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070B09',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      fontSize: 12,
                      color: '#fff',
                    }}
                    formatter={(value: any) => formatMoney(value, currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Mini Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/[0.04]">
            {categoryData.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[#9AAFA5] truncate">{c.name}</span>
                <span className="text-white font-bold ml-auto">{formatMoney(c.value, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Rate Trend Area Chart */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Historical Savings Rate Progression</h3>
              <p className="text-[11px] text-[#60756C]">Monthly percentage of income saved</p>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#19D98A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#19D98A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" stroke="#60756C" tick={{ fontSize: 11 }} />
                <YAxis stroke="#60756C" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070B09',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#fff',
                  }}
                  formatter={(val: any) => `${val}%`}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Savings Rate"
                  stroke="#19D98A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs flex justify-between items-center">
            <span className="text-[#9AAFA5]">Golden Benchmark: 20%</span>
            <span className="font-bold text-[#19D98A]">Current: {avgSavingsRate}%</span>
          </div>
        </div>
      </div>

      {/* Family Expenses Breakdown */}
      {familySpending.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Family Member Expense Comparison</h3>
              <p className="text-[11px] text-[#60756C]">Aggregated spending by household member</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {familySpending.map((fam) => (
              <div key={fam.memberId} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xs font-bold text-white">{fam.memberName}</div>
                <div className="text-[10px] text-[#60756C]">{fam.relationship}</div>
                <div className="text-base font-black text-[#19D98A] mt-2">
                  {formatMoney(fam.totalSpent, currency)}
                </div>
                <div className="text-[10px] text-[#9AAFA5] mt-0.5">{fam.transactionCount} transactions</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
