'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Home,
  Zap,
  ShoppingCart,
  Car,
  Users,
  CreditCard,
  HeartPulse,
  PiggyBank,
  CheckCircle2,
  Sparkles,
  Percent,
} from 'lucide-react'
import { CURRENCIES, formatMoney } from '@/lib/finance/currency'

interface SetupData {
  currency: string
  monthly_salary: number
  salary_type: 'monthly' | 'biweekly' | 'weekly'
  payday: number
  additional_income: number
  rent: number
  utilities: number
  groceries: number
  transportation: number
  has_family: boolean
  children_count: number
  family_budget: number
  debt: number
  healthcare: number
  insurance: number
  savings_target: number
  emergency_target: number
}

const initialData: SetupData = {
  currency: 'USD',
  monthly_salary: 7500,
  salary_type: 'monthly',
  payday: 28,
  additional_income: 500,
  rent: 1800,
  utilities: 250,
  groceries: 700,
  transportation: 380,
  has_family: true,
  children_count: 2,
  family_budget: 700,
  debt: 350,
  healthcare: 200,
  insurance: 280,
  savings_target: 1500,
  emergency_target: 500,
}

export default function SetupWizardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SetupData>(initialData)

  const update = (fields: Partial<SetupData>) => {
    setData((prev) => ({ ...prev, ...fields }))
  }

  // Real-time calculations
  const totalIncome = Number(data.monthly_salary) + Number(data.additional_income)
  const totalNeeds =
    Number(data.rent) +
    Number(data.utilities) +
    Number(data.groceries) +
    Number(data.transportation) +
    Number(data.debt) +
    Number(data.healthcare) +
    Number(data.insurance)
  const totalWants = Number(data.family_budget)
  const totalSavings = Number(data.savings_target) + Number(data.emergency_target)
  const totalAllocated = totalNeeds + totalWants + totalSavings
  const netRemaining = totalIncome - totalAllocated

  const needsPercent = totalIncome > 0 ? Math.round((totalNeeds / totalIncome) * 100) : 0
  const wantsPercent = totalIncome > 0 ? Math.round((totalWants / totalIncome) * 100) : 0
  const savingsPercent = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0

  const handleFinish = () => {
    try {
      const stored = localStorage.getItem('lifeplan_v1_financial_state')
      let state = stored ? JSON.parse(stored) : {}
      state.financialProfile = {
        ...(state.financialProfile || {}),
        monthly_salary: data.monthly_salary,
        salary_type: data.salary_type,
        payday: data.payday,
        rent: data.rent,
        utilities: data.utilities,
        groceries: data.groceries,
        transportation: data.transportation,
        debt: data.debt,
        education: data.family_budget * 0.5,
        healthcare: data.healthcare,
        insurance: data.insurance,
        personal_budget: data.family_budget * 0.5,
        savings_target: data.savings_target,
        emergency_target: data.emergency_target,
      }
      state.userProfile = {
        ...(state.userProfile || {}),
        currency: data.currency,
        monthly_salary: data.monthly_salary,
        payday: data.payday,
        setup_completed: true,
      }
      localStorage.setItem('lifeplan_v1_financial_state', JSON.stringify(state))
    } catch (e) {
      console.error(e)
    }
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-[#050806] text-[#F5FFF9] flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#19D98A] flex items-center justify-center text-[#050806] shadow-[0_0_15px_rgba(25,217,138,0.3)]">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight">LifePlan Wizard</span>
            <p className="text-[11px] text-[#60756C]">Step {step} of 11: Personal Financial Architecture</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/home')}
          className="text-xs text-[#9AAFA5] hover:text-[#19D98A] transition-colors"
        >
          Skip to Demo
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl w-full mx-auto my-6">
        <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0F8C5C] via-[#19D98A] to-[#63F2B0] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 11) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0B110E] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* STEP 1: Currency */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <DollarSign size={28} />
                  <h2 className="text-2xl font-black">Select Your Currency</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Choose your primary currency. All budgets, reports, and calculations will format according to your region.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => update({ currency: c.code })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        data.currency === c.code
                          ? 'border-[#19D98A] bg-[#19D98A]/10 text-white shadow-[0_0_20px_rgba(25,217,138,0.15)]'
                          : 'border-white/[0.08] bg-[#101A15] text-[#9AAFA5] hover:border-white/20'
                      }`}
                    >
                      <div className="text-xl font-bold text-[#19D98A]">{c.symbol}</div>
                      <div className="font-semibold text-sm text-white mt-1">{c.code}</div>
                      <div className="text-xs text-[#60756C] truncate">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Monthly Salary & Payday */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <DollarSign size={28} />
                  <h2 className="text-2xl font-black">Monthly Net Salary & Payday</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Enter your take-home monthly salary (after taxes) and the day of the month you get paid.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                      Monthly Take-Home Salary ({data.currency})
                    </label>
                    <input
                      type="number"
                      value={data.monthly_salary}
                      onChange={(e) => update({ monthly_salary: Number(e.target.value) })}
                      className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">Salary Frequency</label>
                      <select
                        value={data.salary_type}
                        onChange={(e) => update({ salary_type: e.target.value as any })}
                        className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">Payday (Day of month)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={data.payday}
                        onChange={(e) => update({ payday: Number(e.target.value) })}
                        className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Additional Income */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <Sparkles size={28} />
                  <h2 className="text-2xl font-black">Additional Income Streams</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Do you have side freelancing, bonuses, investments dividends, or secondary income?
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Estimated Secondary Monthly Income ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.additional_income}
                    onChange={(e) => update({ additional_income: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                  <p className="text-xs text-[#60756C] mt-2">
                    Total combined income: {formatMoney(totalIncome, data.currency)} / month
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Housing & Rent */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <Home size={28} />
                  <h2 className="text-2xl font-black">Housing & Rent / Mortgage</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Enter your primary housing cost (monthly rent, mortgage, or home loan payment).
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Monthly Housing ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.rent}
                    onChange={(e) => update({ rent: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                  <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#9AAFA5]">
                    Housing is {Math.round((data.rent / (totalIncome || 1)) * 100)}% of your income. Standard guideline recommends keeping it under 30%.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Utilities & Subscriptions */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <Zap size={28} />
                  <h2 className="text-2xl font-black">Utilities & Bills</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Electricity, gas, water, home fiber internet, and streaming subscriptions.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Average Total Monthly Utilities ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.utilities}
                    onChange={(e) => update({ utilities: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Groceries & Food */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <ShoppingCart size={28} />
                  <h2 className="text-2xl font-black">Groceries & Living</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Estimated monthly food, pantry, supermarket, and household necessities.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Monthly Groceries Budget ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.groceries}
                    onChange={(e) => update({ groceries: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                </div>
              </div>
            )}

            {/* STEP 7: Transportation & Car */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <Car size={28} />
                  <h2 className="text-2xl font-black">Transportation & Fuel</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Car fuel, public transit passes, tolls, parking, and vehicle maintenance.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Monthly Transport ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.transportation}
                    onChange={(e) => update({ transportation: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                </div>
              </div>
            )}

            {/* STEP 8: Family & Children */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <Users size={28} />
                  <h2 className="text-2xl font-black">Family & Children Expenses</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Are you managing finances for a family or children? LifePlan lets you attribute expenses per member.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#101A15] border border-white/[0.08]">
                    <span className="font-semibold text-sm">Managing Family Expenses?</span>
                    <button
                      type="button"
                      onClick={() => update({ has_family: !data.has_family })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        data.has_family ? 'bg-[#19D98A]' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-black transition-transform ${
                          data.has_family ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {data.has_family && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">Children Count</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={data.children_count}
                          onChange={(e) => update({ children_count: Number(e.target.value) })}
                          className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                          Family & School Budget ({data.currency})
                        </label>
                        <input
                          type="number"
                          value={data.family_budget}
                          onChange={(e) => update({ family_budget: Number(e.target.value) })}
                          className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 9: Debt & Loans */}
            {step === 9 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <CreditCard size={28} />
                  <h2 className="text-2xl font-black">Debt & Loan Repayments</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Auto loans, student loans, personal financing, or credit card minimums.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                    Monthly Debt Installments ({data.currency})
                  </label>
                  <input
                    type="number"
                    value={data.debt}
                    onChange={(e) => update({ debt: Number(e.target.value) })}
                    className="w-full text-2xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#19D98A]"
                  />
                </div>
              </div>
            )}

            {/* STEP 10: Healthcare & Insurance */}
            {step === 10 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <HeartPulse size={28} />
                  <h2 className="text-2xl font-black">Healthcare & Insurance</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Health, dental, auto, and life insurance premiums plus regular medications.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                      Healthcare & Meds ({data.currency})
                    </label>
                    <input
                      type="number"
                      value={data.healthcare}
                      onChange={(e) => update({ healthcare: Number(e.target.value) })}
                      className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                      Insurance Policies ({data.currency})
                    </label>
                    <input
                      type="number"
                      value={data.insurance}
                      onChange={(e) => update({ insurance: Number(e.target.value) })}
                      className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: Savings & Emergency Target */}
            {step === 11 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#19D98A]">
                  <PiggyBank size={28} />
                  <h2 className="text-2xl font-black">Savings & Emergency Reserve</h2>
                </div>
                <p className="text-sm text-[#9AAFA5]">
                  Set your monthly targets for long-term investments and liquid emergency fund contributions.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                      Monthly Savings Target ({data.currency})
                    </label>
                    <input
                      type="number"
                      value={data.savings_target}
                      onChange={(e) => update({ savings_target: Number(e.target.value) })}
                      className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                      Emergency Fund Target ({data.currency})
                    </label>
                    <input
                      type="number"
                      value={data.emergency_target}
                      onChange={(e) => update({ emergency_target: Number(e.target.value) })}
                      className="w-full bg-[#101A15] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#19D98A]"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Live 50/30/20 Budget Bar Preview */}
        <div className="mt-6 bg-[#0B110E] border border-white/[0.06] rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-[#9AAFA5] flex items-center gap-1.5">
              <Percent size={14} className="text-[#19D98A]" />
              Smart 50/30/20 Allocation Meter
            </span>
            <span className={netRemaining >= 0 ? 'text-[#19D98A]' : 'text-[#E05252]'}>
              Remaining: {formatMoney(netRemaining, data.currency)}
            </span>
          </div>
          <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(needsPercent, 100)}%` }}
              className="bg-[#19D98A] h-full"
              title={`Needs: ${needsPercent}%`}
            />
            <div
              style={{ width: `${Math.min(wantsPercent, 100)}%` }}
              className="bg-[#3EE8A2] h-full"
              title={`Wants: ${wantsPercent}%`}
            />
            <div
              style={{ width: `${Math.min(savingsPercent, 100)}%` }}
              className="bg-[#63F2B0] h-full"
              title={`Savings: ${savingsPercent}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#60756C] mt-2">
            <span>Needs: {needsPercent}% (target 50%)</span>
            <span>Wants: {wantsPercent}% (target 30%)</span>
            <span>Savings: {savingsPercent}% (target 20%)</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Controls */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between py-4 border-t border-white/[0.06]">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold hover:bg-white/[0.08] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 11 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm shadow-[0_4px_20px_rgba(25,217,138,0.25)] hover:bg-[#3EE8A2] transition-all"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#19D98A] to-[#3EE8A2] text-[#050806] font-extrabold text-sm shadow-[0_4px_24px_rgba(25,217,138,0.4)] hover:scale-[1.02] transition-all"
          >
            <CheckCircle2 size={18} />
            Complete & Launch LifePlan
          </button>
        )}
      </div>
    </div>
  )
}
