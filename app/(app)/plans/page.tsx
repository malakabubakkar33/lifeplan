'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  PieChart,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Plus,
  Home,
  Zap,
  ShoppingCart,
  Car,
  CreditCard,
  HeartPulse,
  GraduationCap,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { aggregateSpendingByCategory } from '@/lib/finance/transactions'
import { generateMonthlyPlan } from '@/lib/finance/monthly-plan'

export default function MonthlyPlansPage() {
  const {
    financialProfile,
    transactions,
    categories,
    familyMembers,
    currency,
    updateFinancialProfile,
  } = useFinancialData()

  const [salary, setSalary] = useState(financialProfile.monthly_salary || 7500)
  const [rent, setRent] = useState(financialProfile.rent || 1800)
  const [utilities, setUtilities] = useState(financialProfile.utilities || 260)
  const [groceries, setGroceries] = useState(financialProfile.groceries || 700)
  const [transportation, setTransportation] = useState(financialProfile.transportation || 380)
  const [education, setEducation] = useState(financialProfile.education || 450)
  const [debt, setDebt] = useState(financialProfile.debt || 350)
  const [healthcare, setHealthcare] = useState(financialProfile.healthcare || 200)
  const [personalBudget, setPersonalBudget] = useState(financialProfile.personal_budget || 450)
  const [savingsTarget, setSavingsTarget] = useState(financialProfile.savings_target || 1500)
  const [emergencyTarget, setEmergencyTarget] = useState(financialProfile.emergency_target || 500)

  const [isSaved, setIsSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Compute live actual spending per category from actual transactions
  const categorySpendingList = aggregateSpendingByCategory(transactions, categories)
  const getActualForCategory = (nameQuery: string): number => {
    const q = nameQuery.toLowerCase()
    const found = categorySpendingList.find((c) =>
      c.categoryName.toLowerCase().includes(q)
    )
    return found ? found.totalSpent : 0
  }

  // Generate dynamic 50/30/20 plan
  const plan = generateMonthlyPlan({
    salary,
    rent,
    utilities,
    groceries,
    transportation,
    education,
    healthcare,
    debt,
    insurance: 300,
    personal_budget: personalBudget,
    savings_target: savingsTarget,
    emergency_target: emergencyTarget,
    familyBudgets: familyMembers.map((m) => ({ name: m.name, amount: m.monthly_budget })),
  })

  // Map real actual spending to plan categories
  const detailedCategories = plan.categories.map((c) => {
    const actual = getActualForCategory(c.name.split(' ')[0])
    const remaining = Math.max(0, c.planned - actual)
    const pctUsed = c.planned > 0 ? Math.min(100, Math.round((actual / c.planned) * 100)) : 0
    return {
      ...c,
      actual,
      remaining,
      percentageUsed: pctUsed,
      status: pctUsed > 100 ? 'over_budget' : pctUsed >= 80 ? 'warning' : 'healthy',
    }
  })

  const handleSavePlan = () => {
    updateFinancialProfile({
      monthly_salary: salary,
      rent,
      utilities,
      groceries,
      transportation,
      education,
      healthcare,
      debt,
      savings_target: savingsTarget,
      emergency_target: emergencyTarget,
      personal_budget: personalBudget,
    })
    setIsSaved(true)
    setIsEditing(false)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleResetToProfile = () => {
    setSalary(financialProfile.monthly_salary || 7500)
    setRent(financialProfile.rent || 1800)
    setUtilities(financialProfile.utilities || 260)
    setGroceries(financialProfile.groceries || 700)
    setTransportation(financialProfile.transportation || 380)
    setEducation(financialProfile.education || 450)
    setDebt(financialProfile.debt || 350)
    setHealthcare(financialProfile.healthcare || 200)
    setPersonalBudget(financialProfile.personal_budget || 450)
    setSavingsTarget(financialProfile.savings_target || 1500)
    setEmergencyTarget(financialProfile.emergency_target || 500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart Monthly Financial Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            50/30/20 budget framework powered by your live income and verified expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs h-10 border-white/[0.1] text-[#9AAFA5] hover:text-white"
          >
            <Sliders size={15} className="mr-1.5" />
            {isEditing ? 'Close Sliders' : 'Fine-Tune Plan'}
          </Button>
          {isEditing && (
            <Button
              onClick={handleSavePlan}
              className="text-xs h-10 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
            >
              {isSaved ? <CheckCircle2 size={15} className="mr-1.5" /> : <Sparkles size={15} className="mr-1.5" />}
              Save Plan
            </Button>
          )}
        </div>
      </div>

      {/* 50/30/20 Macro Allocation Breakdown Banner */}
      <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border border-[#19D98A]/25 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-[#9AAFA5] font-semibold">Total Monthly Salary</div>
            <div className="text-3xl font-black text-white mt-0.5">{formatMoney(salary, currency)}</div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[#60756C]">Total Planned:</span>{' '}
              <span className="font-bold text-white">{formatMoney(plan.totalPlanned, currency)}</span>
            </div>
            <div>
              <span className="text-[#60756C]">Surplus:</span>{' '}
              <span className="font-extrabold text-[#19D98A]">{formatMoney(plan.remainingAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* 50/30/20 Color Bar */}
        <div className="h-3 w-full rounded-full bg-white/[0.06] flex overflow-hidden p-0.5 gap-1">
          <div
            style={{ width: `${plan.needsPercentage}%` }}
            className="h-full rounded-full bg-[#19D98A] transition-all duration-300"
            title={`Needs: ${plan.needsPercentage}%`}
          />
          <div
            style={{ width: `${plan.wantsPercentage}%` }}
            className="h-full rounded-full bg-[#63F2B0] transition-all duration-300"
            title={`Wants: ${plan.wantsPercentage}%`}
          />
          <div
            style={{ width: `${plan.savingsPercentage}%` }}
            className="h-full rounded-full bg-[#0B6B45] transition-all duration-300"
            title={`Savings: ${plan.savingsPercentage}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.04] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19D98A]" />
            <div>
              <span className="text-white font-bold">Needs ({plan.needsPercentage}%)</span>
              <div className="text-[10px] text-[#60756C]">{formatMoney(plan.needsTotal, currency)} (Target ≤50%)</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#63F2B0]" />
            <div>
              <span className="text-white font-bold">Wants ({plan.wantsPercentage}%)</span>
              <div className="text-[10px] text-[#60756C]">{formatMoney(plan.wantsTotal, currency)} (Target ≤30%)</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B45]" />
            <div>
              <span className="text-white font-bold">Savings ({plan.savingsPercentage}%)</span>
              <div className="text-[10px] text-[#60756C]">{formatMoney(plan.savingsTotal, currency)} (Target ≥20%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Fine-Tuning Sliders (when editing) */}
      {isEditing && (
        <div className="p-6 rounded-3xl bg-[#0B110E] border border-[#19D98A]/30 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#19D98A]" />
              <h3 className="text-sm font-bold text-white">Fine-Tune Monthly Allocations</h3>
            </div>
            <button
              onClick={handleResetToProfile}
              className="text-xs text-[#9AAFA5] hover:text-white flex items-center gap-1"
            >
              <RefreshCw size={13} /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Rent */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02]">
              <div className="flex justify-between">
                <span className="text-[#9AAFA5]">Housing / Rent</span>
                <span className="font-bold text-white">{formatMoney(rent, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={salary}
                step="50"
                value={rent}
                onChange={(e) => setRent(parseFloat(e.target.value))}
                className="w-full accent-[#19D98A] h-1.5 bg-white/[0.08] rounded cursor-pointer"
              />
            </div>

            {/* Groceries */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02]">
              <div className="flex justify-between">
                <span className="text-[#9AAFA5]">Groceries</span>
                <span className="font-bold text-white">{formatMoney(groceries, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={salary * 0.5}
                step="50"
                value={groceries}
                onChange={(e) => setGroceries(parseFloat(e.target.value))}
                className="w-full accent-[#19D98A] h-1.5 bg-white/[0.08] rounded cursor-pointer"
              />
            </div>

            {/* Utilities */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02]">
              <div className="flex justify-between">
                <span className="text-[#9AAFA5]">Utilities</span>
                <span className="font-bold text-white">{formatMoney(utilities, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={salary * 0.3}
                step="25"
                value={utilities}
                onChange={(e) => setUtilities(parseFloat(e.target.value))}
                className="w-full accent-[#19D98A] h-1.5 bg-white/[0.08] rounded cursor-pointer"
              />
            </div>

            {/* Savings */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02]">
              <div className="flex justify-between">
                <span className="text-[#9AAFA5]">Savings Target</span>
                <span className="font-bold text-[#19D98A]">{formatMoney(savingsTarget, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={salary * 0.6}
                step="50"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(parseFloat(e.target.value))}
                className="w-full accent-[#19D98A] h-1.5 bg-white/[0.08] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories Detailed Allocation Table/List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white px-1">Planned Categories Ledger</h2>

        <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {detailedCategories.map((cat) => (
            <div key={cat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 flex-1">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                    <span className="text-[10px] text-[#60756C] px-1.5 py-0.2 rounded bg-white/[0.04]">
                      {cat.percentageOfIncome}% of salary
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9AAFA5] mt-0.5">
                    Planned: {formatMoney(cat.planned, currency)} • Spent: {formatMoney(cat.actual, currency)}
                  </div>
                </div>
              </div>

              {/* Progress & Remaining */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64">
                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-[#60756C]">Utilized</span>
                    <span
                      className={
                        cat.status === 'over_budget'
                          ? 'text-[#E05252]'
                          : cat.status === 'warning'
                          ? 'text-[#EAB308]'
                          : 'text-[#19D98A]'
                      }
                    >
                      {cat.percentageUsed}%
                    </span>
                  </div>
                  <Progress value={cat.percentageUsed} className="h-1.5" />
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-white">
                    {formatMoney(cat.remaining, currency)}
                  </div>
                  <div className="text-[10px] text-[#60756C]">Remaining</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
