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
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  const { financialProfile, currency, transactions } = useFinancialData()
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m')

  // Sample historical data for charts
  const monthlyFlowData = [
    { month: 'May', income: 7200, expenses: 4950, savings: 1500 },
    { month: 'Jun', income: 7200, expenses: 5120, savings: 1600 },
    { month: 'Jul', income: 7500, expenses: 4800, savings: 1900 },
    { month: 'Aug', income: 8450, expenses: 5400, savings: 2200 },
    { month: 'Sep', income: 7500, expenses: 5100, savings: 1800 },
    { month: 'Oct', income: 8450, expenses: 4860, savings: 2100 },
  ]

  const categoryDistribution = [
    { name: 'Housing & Rent', value: financialProfile.rent || 1800, color: '#19D98A' },
    { name: 'Groceries', value: financialProfile.groceries || 700, color: '#3EE8A2' },
    { name: 'Transport', value: financialProfile.transportation || 380, color: '#63F2B0' },
    { name: 'Debt & Loans', value: financialProfile.debt || 350, color: '#0F8C5C' },
    { name: 'Utilities', value: financialProfile.utilities || 260, color: '#10B981' },
    { name: 'Education & Kids', value: 470, color: '#34D399' },
    { name: 'Personal & Leisure', value: financialProfile.personal_budget || 450, color: '#9AAFA5' },
    { name: 'Insurance & Health', value: 480, color: '#60756C' },
  ]

  const savingsRateTrend = [
    { month: 'May', rate: 21 },
    { month: 'Jun', rate: 22 },
    { month: 'Jul', rate: 25 },
    { month: 'Aug', rate: 26 },
    { month: 'Sep', rate: 24 },
    { month: 'Oct', rate: 27 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Analytics & Trends
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Visualize income stability, category allocation distribution, and savings trajectory.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#101A15] border border-white/[0.06] self-start sm:self-auto">
          {(['3m', '6m', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                timeRange === r
                  ? 'bg-[#19D98A] text-[#050806]'
                  : 'text-[#9AAFA5] hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0B110E]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-[#60756C]">
              <span>Savings Rate</span>
              <Percent size={14} className="text-[#19D98A]" />
            </div>
            <div className="text-2xl font-black text-[#19D98A] mt-1">26.8%</div>
            <p className="text-[11px] text-[#9AAFA5] mt-0.5">+2.4% vs last quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-[#60756C]">
              <span>Fixed Cost Ratio</span>
              <ShieldCheck size={14} className="text-[#63F2B0]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">42.5%</div>
            <p className="text-[11px] text-[#9AAFA5] mt-0.5">Well under 50% limit</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-[#60756C]">
              <span>Daily Burn Rate</span>
              <Flame size={14} className="text-[#E09B35]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {formatMoney(162, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-0.5">Average total daily spend</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-[#60756C]">
              <span>Wealth Growth Pace</span>
              <TrendingUp size={14} className="text-[#19D98A]" />
            </div>
            <div className="text-2xl font-black text-[#19D98A] mt-1">
              +{formatMoney(1950, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-0.5">Monthly net asset addition</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart: Income vs Outflow BarChart */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="border-b border-white/[0.04] pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white">
              Income vs Expenses & Savings
            </CardTitle>
            <p className="text-xs text-[#9AAFA5]">Monthly cash flow comparison over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#19D98A]" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2.5 h-2.5 rounded-sm bg-white/40" /> Expenses
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3EE8A2]" /> Savings
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#60756C" fontSize={12} tickLine={false} />
              <YAxis stroke="#60756C" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#070B09',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="income" fill="#19D98A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="rgba(255,255,255,0.3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#3EE8A2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Charts: Donut & Savings Rate Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Donut */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <CardTitle className="text-base font-bold text-white">
              Outflow Allocation by Category
            </CardTitle>
            <p className="text-xs text-[#9AAFA5]">Proportional breakdown of monthly living costs</p>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070B09',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-[#9AAFA5] truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate Trend Line/Area */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <CardTitle className="text-base font-bold text-white">
              Savings Rate Progression (%)
            </CardTitle>
            <p className="text-xs text-[#9AAFA5]">Percentage of gross income saved month-over-month</p>
          </CardHeader>
          <CardContent className="pt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsRateTrend}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#19D98A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#19D98A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#60756C" fontSize={12} tickLine={false} />
                <YAxis stroke="#60756C" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070B09',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#19D98A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
