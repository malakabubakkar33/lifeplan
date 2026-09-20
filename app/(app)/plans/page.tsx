'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  PieChart,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function MonthlyPlansPage() {
  const {
    financialProfile,
    transactions,
    currency,
    currentMonthPlan,
    updateFinancialProfile,
  } = useFinancialData()

  const [salary, setSalary] = useState(financialProfile.monthly_salary || 7500)
  const [rent, setRent] = useState(financialProfile.rent || 1800)
  const [utilities, setUtilities] = useState(financialProfile.utilities || 260)
  const [groceries, setGroceries] = useState(financialProfile.groceries || 700)
  const [transportation, setTransportation] = useState(financialProfile.transportation || 380)
  const [debt, setDebt] = useState(financialProfile.debt || 350)
  const [savingsTarget, setSavingsTarget] = useState(financialProfile.savings_target || 1500)
  const [emergencyTarget, setEmergencyTarget] = useState(financialProfile.emergency_target || 500)
  const [personalBudget, setPersonalBudget] = useState(financialProfile.personal_budget || 450)
  const [isSaved, setIsSaved] = useState(false)

  // Needs, Wants, Savings calculations
  const totalNeeds = rent + utilities + groceries + transportation + debt
  const totalWants = personalBudget
  const totalSavings = savingsTarget + emergencyTarget
  const totalAllocated = totalNeeds + totalWants + totalSavings
  const netRemaining = salary - totalAllocated

  const needsPct = salary > 0 ? Math.round((totalNeeds / salary) * 100) : 0
  const wantsPct = salary > 0 ? Math.round((totalWants / salary) * 100) : 0
  const savingsPct = salary > 0 ? Math.round((totalSavings / salary) * 100) : 0

  // Category breakdown
  const planCategories = [
    { name: 'Housing & Rent', planned: rent, icon: 'Home', actual: 1800, color: '#19D98A' },
    { name: 'Utilities & Subscriptions', planned: utilities, icon: 'Zap', actual: 145, color: '#3EE8A2' },
    { name: 'Groceries & Living', planned: groceries, icon: 'ShoppingCart', actual: 246, color: '#63F2B0' },
    { name: 'Transport & Fuel', planned: transportation, icon: 'Car', actual: 72, color: '#0F8C5C' },
    { name: 'Debt & Loan Payments', planned: debt, icon: 'CreditCard', actual: 350, color: '#9AAFA5' },
    { name: 'Personal & Lifestyle', planned: personalBudget, icon: 'Sparkles', actual: 88, color: '#10B981' },
    { name: 'Investments & Goals', planned: savingsTarget, icon: 'TrendingUp', actual: 600, color: '#34D399' },
    { name: 'Emergency Fund Runway', planned: emergencyTarget, icon: 'ShieldCheck', actual: 600, color: '#19D98A' },
  ]

  const handleSavePlan = () => {
    updateFinancialProfile({
      monthly_salary: salary,
      rent,
      utilities,
      groceries,
      transportation,
      debt,
      savings_target: savingsTarget,
      emergency_target: emergencyTarget,
      personal_budget: personalBudget,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart Monthly Financial Plan
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Automated 50/30/20 budget framework adjusted to your real household expenses.
          </p>
        </div>

        <Button onClick={handleSavePlan} className="self-start sm:self-auto gap-2">
          {isSaved ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
          <span>{isSaved ? 'Plan Updated & Locked!' : 'Update & Lock Plan'}</span>
        </Button>
      </div>

      {/* 50/30/20 Rule Visual Banner */}
      <Card glow className="bg-gradient-to-br from-[#0B1510] via-[#0B110E] to-[#050806] border-[#19D98A]/25">
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Percent size={18} className="text-[#19D98A]" />
                <h2 className="text-lg font-black text-white">Rule Allocation Health</h2>
              </div>
              <p className="text-xs text-[#9AAFA5] mt-1">
                Standard: 50% Needs, 30% Wants, 20% Savings. Your customized split is calculated below.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#60756C]">Unallocated Cash Cushion</div>
              <div
                className={`text-xl font-black ${
                  netRemaining >= 0 ? 'text-[#19D98A]' : 'text-[#E05252]'
                }`}
              >
                {formatMoney(netRemaining, currency)}
              </div>
            </div>
          </div>

          {/* Tri-color Split Bar */}
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-white/[0.08] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(needsPct, 100)}%` }}
                className="bg-[#19D98A] h-full"
                title={`Needs: ${needsPct}%`}
              />
              <div
                style={{ width: `${Math.min(wantsPct, 100)}%` }}
                className="bg-[#3EE8A2] h-full"
                title={`Wants: ${wantsPct}%`}
              />
              <div
                style={{ width: `${Math.min(savingsPct, 100)}%` }}
                className="bg-[#63F2B0] h-full"
                title={`Savings: ${savingsPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between text-[#9AAFA5]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#19D98A]" /> Needs
                  </span>
                  <span className="font-bold text-white">{needsPct}%</span>
                </div>
                <div className="font-bold text-white mt-1">{formatMoney(totalNeeds, currency)}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between text-[#9AAFA5]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3EE8A2]" /> Wants
                  </span>
                  <span className="font-bold text-white">{wantsPct}%</span>
                </div>
                <div className="font-bold text-white mt-1">{formatMoney(totalWants, currency)}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between text-[#9AAFA5]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#63F2B0]" /> Savings
                  </span>
                  <span className="font-bold text-white">{savingsPct}%</span>
                </div>
                <div className="font-bold text-white mt-1">{formatMoney(totalSavings, currency)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown: Planned vs Actuals */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="border-b border-white/[0.04] pb-4">
          <CardTitle className="text-base font-bold text-white">
            Category Budget Breakdown (Planned vs Actuals)
          </CardTitle>
          <p className="text-xs text-[#9AAFA5]">
            Real-time monitoring of expenses against planned targets for the current billing cycle.
          </p>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {planCategories.map((cat) => {
            const pctUsed = cat.planned > 0 ? Math.min(100, Math.round((cat.actual / cat.planned) * 100)) : 0
            const remaining = Math.max(0, cat.planned - cat.actual)
            const isOver = cat.actual > cat.planned

            return (
              <div key={cat.name} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                    <Badge variant={isOver ? 'destructive' : pctUsed > 80 ? 'warning' : 'success'} className="text-[10px]">
                      {isOver ? 'Over Budget' : pctUsed > 80 ? 'Caution' : 'On Track'}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      {formatMoney(cat.actual, currency)}{' '}
                      <span className="text-xs font-normal text-[#60756C]">
                        / {formatMoney(cat.planned, currency)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={pctUsed} />
                  <div className="flex justify-between text-[11px] text-[#60756C]">
                    <span>{pctUsed}% utilized</span>
                    <span>{formatMoney(remaining, currency)} remaining</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Fine-tune Sliders Card */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="border-b border-white/[0.04] pb-4">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#19D98A]" />
            <CardTitle className="text-base font-bold text-white">Fine-tune Monthly Targets</CardTitle>
          </div>
          <p className="text-xs text-[#9AAFA5]">
            Adjust individual expense commitments to see how they impact your net monthly surplus.
          </p>
        </CardHeader>

        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Housing / Rent</span>
                <span className="text-white font-bold">{formatMoney(rent, currency)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="50"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Groceries & Supermarket</span>
                <span className="text-white font-bold">{formatMoney(groceries, currency)}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="25"
                value={groceries}
                onChange={(e) => setGroceries(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Transportation</span>
                <span className="text-white font-bold">{formatMoney(transportation, currency)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={transportation}
                onChange={(e) => setTransportation(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Savings Target</span>
                <span className="text-white font-bold">{formatMoney(savingsTarget, currency)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Emergency Fund Target</span>
                <span className="text-white font-bold">{formatMoney(emergencyTarget, currency)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={emergencyTarget}
                onChange={(e) => setEmergencyTarget(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#9AAFA5]">Personal & Lifestyle</span>
                <span className="text-white font-bold">{formatMoney(personalBudget, currency)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={personalBudget}
                onChange={(e) => setPersonalBudget(Number(e.target.value))}
                className="w-full accent-[#19D98A] cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
