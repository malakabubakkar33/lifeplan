'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  PiggyBank,
  Check,
  CreditCard,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HomePage() {
  const {
    userProfile,
    financialProfile,
    transactions,
    bills,
    savingsGoals,
    insights,
    totalIncome,
    totalExpenses,
    totalSaved,
    safeToSpendDaily,
    remainingSalary,
    emergencyFundMonths,
    currency,
    toggleBillPaid,
    contributeToGoal,
  } = useFinancialData()

  // State for quick deposit modal
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  const handleDeposit = () => {
    if (!depositGoalId || !depositAmount) return
    const amt = parseFloat(depositAmount)
    if (amt > 0) {
      contributeToGoal(depositGoalId, amt)
      setDepositGoalId(null)
      setDepositAmount('')
    }
  }

  // Days until payday
  const now = new Date()
  const today = now.getDate()
  const payday = financialProfile.payday || 28
  const daysToPayday = payday >= today ? payday - today : 30 - today + payday

  const salary = financialProfile.monthly_salary || 7500
  const percentSpent = Math.min(100, Math.round(((totalExpenses + totalSaved) / salary) * 100))

  const emergencyGoal = savingsGoals.find((g) => g.id === 'goal_1') || savingsGoals[0]
  const emergencyPct = emergencyGoal
    ? Math.min(100, Math.round((emergencyGoal.current_amount / emergencyGoal.target_amount) * 100))
    : 74

  const recentTxs = transactions.slice(0, 5)
  const upcomingBills = bills.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {userProfile.full_name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Your finances are in great shape. You have{' '}
            <span className="text-[#19D98A] font-semibold">{daysToPayday} days</span> until next salary.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/transactions/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-xs sm:text-sm hover:bg-[#3EE8A2] transition-all shadow-[0_4px_16px_rgba(25,217,138,0.25)] active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>
          <Link
            href="/plans"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101A15] border border-white/[0.08] text-white font-semibold text-xs sm:text-sm hover:bg-white/[0.05] transition-all"
          >
            <Sparkles size={16} className="text-[#19D98A]" />
            <span>Smart Plan</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Core Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Salary & Discretionary Tracker */}
        <Card glow className="bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border-[#19D98A]/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center">
                <Wallet size={18} />
              </div>
              <CardTitle className="text-sm font-semibold text-[#9AAFA5]">Monthly Cash Flow</CardTitle>
            </div>
            <Badge variant="success" className="text-[10px]">Active Month</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {formatMoney(remainingSalary, currency)}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9AAFA5] mt-1">
                <span>Remaining of</span>
                <span className="font-semibold text-white">{formatMoney(salary, currency)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#60756C]">Monthly Utilized</span>
                <span className="text-[#19D98A]">{percentSpent}%</span>
              </div>
              <Progress value={percentSpent} />
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-[#9AAFA5]">Daily Discretionary Limit</span>
              <span className="font-bold text-[#19D98A]">{formatMoney(safeToSpendDaily, currency)}/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Spent & Outflows */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E05252]/15 text-[#E05252] flex items-center justify-center">
                <TrendingDown size={18} />
              </div>
              <CardTitle className="text-sm font-semibold text-[#9AAFA5]">Total Outflows</CardTitle>
            </div>
            <span className="text-xs text-[#60756C]">Fixed + Variable</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {formatMoney(totalExpenses, currency)}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9AAFA5] mt-1">
                <span>Income recorded:</span>
                <span className="font-semibold text-[#19D98A]">+{formatMoney(totalIncome, currency)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] text-[#60756C]">Housing & Rent</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {formatMoney(financialProfile.rent || 1800, currency)}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] text-[#60756C]">Utilities & Bills</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {formatMoney(financialProfile.utilities || 260, currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Emergency Fund & Savings */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3EE8A2]/15 text-[#3EE8A2] flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <CardTitle className="text-sm font-semibold text-[#9AAFA5]">Emergency Runway</CardTitle>
            </div>
            <Badge variant="default" className="text-[10px]">
              {emergencyFundMonths} Months Safe
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {formatMoney(emergencyGoal?.current_amount || 18400, currency)}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9AAFA5] mt-1">
                <span>Target:</span>
                <span className="font-semibold text-white">{formatMoney(emergencyGoal?.target_amount || 25000, currency)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#60756C]">Fund Health Progress</span>
                <span className="text-[#3EE8A2]">{emergencyPct}%</span>
              </div>
              <Progress value={emergencyPct} indicatorColor="bg-gradient-to-r from-[#10B981] to-[#3EE8A2]" />
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-xs text-[#9AAFA5]">Recommended: 6 mos</span>
              <button
                onClick={() => setDepositGoalId(emergencyGoal?.id || 'goal_1')}
                className="text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
              >
                + Deposit Funds
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Insights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.05] hover:border-[#19D98A]/30 transition-colors"
          >
            <div className="p-2 rounded-xl bg-[#19D98A]/10 text-[#19D98A] shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">{ins.title}</h4>
              <p className="text-[11px] text-[#9AAFA5] mt-0.5 leading-relaxed">{ins.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Upcoming Bills & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bills Section */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Upcoming Bills & Recurring</CardTitle>
              <p className="text-xs text-[#9AAFA5] mt-0.5">Click any bill to mark as paid</p>
            </div>
            <Link
              href="/bills"
              className="text-xs font-semibold text-[#19D98A] hover:underline flex items-center gap-1"
            >
              Manage Bills <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingBills.map((bill) => {
              const isPaid = bill.status === 'paid'
              return (
                <div
                  key={bill.id}
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                    isPaid
                      ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                      : 'bg-[#101A15] border-white/[0.06] hover:border-[#19D98A]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isPaid
                          ? 'bg-[#19D98A] text-[#050806]'
                          : 'border border-white/20 text-transparent group-hover:border-[#19D98A]'
                      }`}
                    >
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isPaid ? 'line-through text-[#60756C]' : 'text-white'}`}>
                        {bill.name}
                      </div>
                      <div className="text-[11px] text-[#9AAFA5] flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} className="text-[#60756C]" />
                        <span>Due {bill.due_date}th of month</span>
                        <span className="text-[#60756C]">•</span>
                        <span>{bill.recurring ? 'Monthly' : 'One-time'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {formatMoney(bill.amount, currency)}
                    </div>
                    <Badge variant={isPaid ? 'secondary' : 'warning'} className="text-[9px] mt-0.5">
                      {isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Transactions Section */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
              <p className="text-xs text-[#9AAFA5] mt-0.5">Latest expenses, salary, and savings</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-[#19D98A] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentTxs.map((tx) => {
              const isIncome = tx.type === 'income'
              const isTransfer = tx.type === 'transfer'
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-[#19D98A]/15 text-[#19D98A]'
                          : isTransfer
                          ? 'bg-[#3EE8A2]/15 text-[#3EE8A2]'
                          : 'bg-white/[0.06] text-[#9AAFA5]'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft size={18} /> : isTransfer ? <PiggyBank size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semibold text-white truncate">{tx.description}</div>
                      <div className="text-[11px] text-[#60756C] flex items-center gap-1.5 mt-0.5">
                        <span>{tx.transaction_date}</span>
                        {tx.family_member && (
                          <>
                            <span>•</span>
                            <span className="text-[#19D98A]">{tx.family_member.name}</span>
                          </>
                        )}
                        {tx.payment_method && (
                          <>
                            <span>•</span>
                            <span>{tx.payment_method}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <div
                      className={`text-sm font-bold ${
                        isIncome ? 'text-[#19D98A]' : isTransfer ? 'text-[#63F2B0]' : 'text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatMoney(tx.amount, currency)}
                    </div>
                    <div className="text-[10px] text-[#60756C] uppercase font-medium mt-0.5">
                      {tx.type}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Deposit Modal */}
      <Dialog open={!!depositGoalId} onOpenChange={(open) => !open && setDepositGoalId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit into Savings Goal</DialogTitle>
            <DialogDescription>
              Transfer funds directly from your monthly cash flow into this target reserve.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Deposit Amount ({currency})</label>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositGoalId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={!depositAmount || parseFloat(depositAmount) <= 0}>
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
