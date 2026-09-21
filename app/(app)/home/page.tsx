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
  Plus,
  Users,
  Check,
  CreditCard,
  ExternalLink,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuickExpenseSheet } from '@/components/modals/quick-expense-sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { processBills } from '@/lib/finance/bills'
import { processGoals } from '@/lib/finance/goals'

export default function HomePage() {
  const {
    userProfile,
    financialProfile,
    transactions,
    bills,
    savingsGoals,
    familyMembers,
    insights,
    totalIncome,
    totalExpenses,
    totalSaved,
    safeToSpendDaily,
    remainingSalary,
    emergencyFundMonths,
    currency,
    storageMode,
    toggleBillPaid,
    contributeToGoal,
    addFamilyMember,
    addSavingsGoal,
  } = useFinancialData()

  // Modal states
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false)
  const [expenseSheetType, setExpenseSheetType] = useState<'expense' | 'income' | 'transfer'>('expense')
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  // Quick modals for Goal and Family Member
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')

  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState('')
  const [newFamilyRel, setNewFamilyRel] = useState('Child')
  const [newFamilyBudget, setNewFamilyBudget] = useState('300')

  const handleDeposit = () => {
    if (!depositGoalId || !depositAmount) return
    const amt = parseFloat(depositAmount)
    if (amt > 0) {
      contributeToGoal(depositGoalId, amt)
      setDepositGoalId(null)
      setDepositAmount('')
    }
  }

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalName || !newGoalTarget) return
    addSavingsGoal({
      clerk_user_id: userProfile.clerk_user_id,
      name: newGoalName,
      target_amount: parseFloat(newGoalTarget),
      current_amount: 0,
      deadline: `${new Date().getFullYear() + 1}-12-31`,
      icon: 'Target',
      color: '#19D98A',
      status: 'active',
      notes: null,
    })
    setNewGoalName('')
    setNewGoalTarget('')
    setIsAddGoalOpen(false)
  }

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamilyName) return
    addFamilyMember({
      clerk_user_id: userProfile.clerk_user_id,
      name: newFamilyName,
      relationship: newFamilyRel,
      date_of_birth: null,
      avatar_url: null,
      monthly_budget: parseFloat(newFamilyBudget) || 0,
      notes: null,
    })
    setNewFamilyName('')
    setNewFamilyBudget('300')
    setIsAddFamilyOpen(false)
  }

  // Days until payday
  const now = new Date()
  const today = now.getDate()
  const payday = financialProfile.payday || 28
  const daysToPayday = payday >= today ? payday - today : 30 - today + payday

  const salary = financialProfile.monthly_salary || 7500
  const plannedExpenses =
    Number(financialProfile.rent || 0) +
    Number(financialProfile.utilities || 0) +
    Number(financialProfile.groceries || 0) +
    Number(financialProfile.transportation || 0) +
    Number(financialProfile.debt || 0) +
    Number(financialProfile.healthcare || 0) +
    Number(financialProfile.education || 0) +
    Number(financialProfile.personal_budget || 0)
  const plannedSavings = Number(financialProfile.savings_target || 0) + Number(financialProfile.emergency_target || 0)
  const totalPlanned = plannedExpenses + plannedSavings
  const plannedPercent = salary > 0 ? Math.min(100, Math.round((totalPlanned / salary) * 100)) : 0
  const actualSpentPercent = salary > 0 ? Math.min(100, Math.round(((totalExpenses + totalSaved) / salary) * 100)) : 0

  // Circular gauge calculations
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (actualSpentPercent / 100) * circumference

  // Process bills and goals with pure financial engines
  const processedBillsList = processBills(bills, now).slice(0, 3)
  const processedGoalsList = processGoals(savingsGoals, now).slice(0, 2)
  const recentTxs = transactions.slice(0, 5)

  const openQuickAction = (type: 'expense' | 'income' | 'transfer') => {
    setExpenseSheetType(type)
    setExpenseSheetOpen(true)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. GREETING & HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-black text-lg shadow-[0_0_15px_rgba(25,217,138,0.25)] group-hover:scale-105 transition-transform">
              {userProfile.full_name?.charAt(0) || 'A'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#19D98A] border-2 border-[#050806]" />
          </Link>
          <div>
            <div className="text-xs text-[#9AAFA5] flex items-center gap-1.5">
              <span>Good morning,</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.04] text-[#19D98A]">
                {daysToPayday}d to payday
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {userProfile.full_name?.split(' ')[0] || 'Alex'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {storageMode === 'local_vault' && (
            <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
              🛡️ Local Vault
            </Badge>
          )}
          <Link
            href="/notifications"
            className="w-10 h-10 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-center text-[#9AAFA5] hover:text-white transition-colors"
          >
            <Sparkles size={18} className="text-[#19D98A]" />
          </Link>
        </div>
      </div>

      {/* 2. MAIN SALARY & RUNWAY CARD WITH CIRCULAR INDICATOR */}
      <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border border-[#19D98A]/25 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(25,217,138,0.08)]">
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#19D98A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          {/* Left: Salary & Remaining Balance */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#9AAFA5]">
              <Wallet size={15} className="text-[#19D98A]" />
              <span>Monthly Salary</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatMoney(salary, currency)}
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-xs text-[#60756C]">Unspent Discretionary:</span>
              <span className="text-base font-extrabold text-[#19D98A]">
                {formatMoney(remainingSalary, currency)}
              </span>
            </div>
          </div>

          {/* Right: Circular Spending Gauge */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#101A15]/80 border border-white/[0.06] shrink-0 self-start sm:self-auto">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#19D98A"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-white leading-none">{actualSpentPercent}%</span>
                <span className="text-[9px] text-[#60756C] font-semibold mt-0.5">utilized</span>
              </div>
            </div>

            <div className="text-left text-xs space-y-1">
              <div>
                <div className="text-[10px] text-[#60756C]">Safe-to-Spend</div>
                <div className="font-extrabold text-[#19D98A]">
                  {formatMoney(safeToSpendDaily, currency)}/day
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#60756C]">Planned Buffer</div>
                <div className="font-bold text-white">{plannedPercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Financial Pill Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/[0.04]">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] font-semibold text-[#60756C] uppercase">Planned Outflows</div>
            <div className="text-sm font-bold text-white mt-0.5">{formatMoney(totalPlanned, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] font-semibold text-[#60756C] uppercase">Actual Spent</div>
            <div className="text-sm font-bold text-[#E05252] mt-0.5">-{formatMoney(totalExpenses, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] font-semibold text-[#60756C] uppercase">Saved & Vaults</div>
            <div className="text-sm font-bold text-[#19D98A] mt-0.5">+{formatMoney(totalSaved, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] font-semibold text-[#60756C] uppercase">Emergency Runway</div>
            <div className="text-sm font-bold text-[#63F2B0] mt-0.5">{emergencyFundMonths} Months Safe</div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS ROW */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#60756C] uppercase tracking-wider px-1">
          Quick Operations
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => openQuickAction('expense')}
            className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-[#E05252]/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 group text-center min-h-[56px]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E05252]/15 text-[#E05252] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={18} />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#E05252] transition-colors">
              Add Expense
            </span>
          </button>

          <button
            onClick={() => openQuickAction('income')}
            className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-[#19D98A]/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 group text-center min-h-[56px]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownLeft size={18} />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#19D98A] transition-colors">
              Add Income
            </span>
          </button>

          <Link
            href="/bills"
            className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-white/[0.2] active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 group text-center min-h-[56px]"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
            <span className="text-xs font-bold text-white transition-colors">
              Pay Bill
            </span>
          </Link>

          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-[#63F2B0]/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 group text-center min-h-[56px]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#63F2B0]/15 text-[#63F2B0] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PiggyBank size={18} />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#63F2B0] transition-colors">
              Add Goal
            </span>
          </button>

          <button
            onClick={() => setIsAddFamilyOpen(true)}
            className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-[#10B981]/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 group text-center min-h-[56px] col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#10B981] transition-colors">
              Add Family
            </span>
          </button>
        </div>
      </div>

      {/* 4. SMART MONTHLY PLAN PREVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-white">Your Monthly Plan</h2>
            <p className="text-[11px] text-[#60756C]">Core 50/30/20 category allocations</p>
          </div>
          <Link
            href="/plans"
            className="text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
          >
            <span>Full Plan</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-white">Housing & Rent</span>
              <span className="text-[#9AAFA5]">{formatMoney(financialProfile.rent || 1800, currency)}</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="text-[10px] text-[#60756C] mt-1.5 flex justify-between">
              <span>Fixed living necessity</span>
              <span className="text-[#19D98A]">Covered</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-white">Groceries & Living</span>
              <span className="text-[#9AAFA5]">{formatMoney(financialProfile.groceries || 700, currency)}</span>
            </div>
            <Progress value={65} className="h-2" />
            <div className="text-[10px] text-[#60756C] mt-1.5 flex justify-between">
              <span>65% consumed</span>
              <span className="text-[#63F2B0]">On Track</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-white">Savings Target</span>
              <span className="text-[#9AAFA5]">{formatMoney(financialProfile.savings_target || 1500, currency)}</span>
            </div>
            <Progress value={80} className="h-2" />
            <div className="text-[10px] text-[#60756C] mt-1.5 flex justify-between">
              <span>80% funded</span>
              <span className="text-[#19D98A]">Strong</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. UPCOMING BILLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-white">Upcoming Bills</h2>
            <p className="text-[11px] text-[#60756C]">Recurring commitments & due dates</p>
          </div>
          <Link
            href="/bills"
            className="text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
          >
            <span>All Bills</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {processedBillsList.map((bill) => (
            <div
              key={bill.id}
              className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between gap-3 hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    bill.status === 'paid'
                      ? 'bg-[#19D98A]/15 text-[#19D98A]'
                      : bill.urgency === 'overdue'
                      ? 'bg-[#E05252]/15 text-[#E05252]'
                      : 'bg-white/[0.06] text-white'
                  }`}
                >
                  {bill.due_date}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{bill.name}</div>
                  <div className="text-[10px] text-[#60756C] flex items-center gap-2 mt-0.5">
                    <span>{bill.urgencyLabel}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#9AAFA5]">{formatMoney(bill.amount, currency)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleBillPaid(bill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  bill.status === 'paid'
                    ? 'bg-[#19D98A]/20 text-[#19D98A] border border-[#19D98A]/30'
                    : 'bg-[#101A15] border border-white/[0.08] text-[#9AAFA5] hover:text-white'
                }`}
              >
                {bill.status === 'paid' ? '✓ Paid' : 'Mark Paid'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SAVINGS GOALS & EMERGENCY RUNWAY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-white">Savings Goals</h2>
            <p className="text-[11px] text-[#60756C]">Milestones & liquid reserves</p>
          </div>
          <Link
            href="/goals"
            className="text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
          >
            <span>Manage Goals</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {processedGoalsList.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center">
                    <PiggyBank size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{g.name}</h4>
                    <p className="text-[10px] text-[#60756C]">Target: {formatMoney(g.target_amount, currency)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setDepositGoalId(g.id)}
                  className="text-xs font-bold text-[#19D98A] hover:underline"
                >
                  + Add Money
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9AAFA5]">{formatMoney(g.current_amount, currency)}</span>
                  <span className="font-bold text-[#19D98A]">{g.percentageProgress}%</span>
                </div>
                <Progress value={g.percentageProgress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. RECENT TRANSACTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
            <p className="text-[11px] text-[#60756C]">Latest cash inflows and outflows</p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="rounded-2xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-[#19D98A]/15 text-[#19D98A]'
                      : tx.type === 'transfer'
                      ? 'bg-[#63F2B0]/15 text-[#63F2B0]'
                      : 'bg-[#E05252]/15 text-[#E05252]'
                  }`}
                >
                  {tx.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tx.description}</div>
                  <div className="text-[10px] text-[#60756C] mt-0.5">
                    {tx.category?.name || 'General'} • {tx.transaction_date}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-xs font-black ${
                    tx.type === 'income'
                      ? 'text-[#19D98A]'
                      : tx.type === 'transfer'
                      ? 'text-[#63F2B0]'
                      : 'text-white'
                  }`}
                >
                  {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '⇄' : '-'}
                  {formatMoney(tx.amount, currency)}
                </div>
                <div className="text-[10px] text-[#60756C]">{tx.payment_method || 'Cash'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. FINANCIAL INSIGHT CARD */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0B110E] border border-[#19D98A]/20 flex items-start gap-3.5 shadow-[0_4px_20px_rgba(25,217,138,0.05)]">
        <div className="w-10 h-10 rounded-2xl bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white">{insights[0]?.title || 'Healthy Cash Runway'}</h4>
          <p className="text-xs text-[#9AAFA5] mt-1 leading-relaxed">
            {insights[0]?.message || 'With fixed obligations planned, your daily safe discretionary limit is maintained.'}
          </p>
        </div>
      </div>

      {/* Quick Expense Bottom Sheet / Modal */}
      <QuickExpenseSheet
        isOpen={expenseSheetOpen}
        onClose={() => setExpenseSheetOpen(false)}
        initialType={expenseSheetType}
      />

      {/* Goal Deposit Modal */}
      <Dialog open={Boolean(depositGoalId)} onOpenChange={(open) => !open && setDepositGoalId(null)}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Deposit into Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-[#9AAFA5]">
              Allocate funds from your liquid checking balance into this savings vault.
            </p>
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">
                Deposit Amount ({currency})
              </label>
              <Input
                type="number"
                placeholder="250.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDepositGoalId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeposit}>
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Add Goal Modal */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Goal Name</label>
              <Input
                placeholder="e.g. New Laptop, Vacation, House"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Target Amount ({currency})</label>
              <Input
                type="number"
                placeholder="5000"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Family Modal */}
      <Dialog open={isAddFamilyOpen} onOpenChange={setIsAddFamilyOpen}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFamily} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Member Name</label>
              <Input
                placeholder="e.g. Maya Morgan"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Relationship</label>
                <select
                  value={newFamilyRel}
                  onChange={(e) => setNewFamilyRel(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Monthly Allowance ({currency})</label>
                <Input
                  type="number"
                  placeholder="300"
                  value={newFamilyBudget}
                  onChange={(e) => setNewFamilyBudget(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddFamilyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
