'use client'

import React, { useState, useEffect } from 'react'
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
  Calendar,
  Globe,
  Plus,
  Trash2,
} from 'lucide-react'
import { CURRENCIES, formatMoney } from '@/lib/finance/currency'
import { generateMonthlyPlan } from '@/lib/finance/monthly-plan'
import { useFinancialData } from '@/lib/context/financial-context'

interface SetupData {
  monthly_salary: number
  currency: string
  payday: number
  rent: number
  utilities: number
  groceries: number
  transportation: number
  children_budget: number
  healthcare: number
  debt: number
  savings_target: number
  emergency_target: number
  familyMembers: { name: string; relationship: string; budget: number }[]
}

const defaultSetup: SetupData = {
  monthly_salary: 150000,
  currency: 'PKR',
  payday: 28,
  rent: 35000,
  utilities: 10000,
  groceries: 20000,
  transportation: 8000,
  children_budget: 15000,
  healthcare: 5000,
  debt: 7000,
  savings_target: 20000,
  emergency_target: 10000,
  familyMembers: [
    { name: 'Spouse', relationship: 'Spouse', budget: 10000 },
    { name: 'Child 1', relationship: 'Child', budget: 8000 },
  ],
}

const SETUP_STORAGE_KEY = 'lifeplan_setup_wizard_draft'

export default function SetupWizardPage() {
  const router = useRouter()
  const { updateFinancialProfile, updateUserProfile, addFamilyMember } = useFinancialData()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SetupData>(defaultSetup)
  const [isGenerating, setIsGenerating] = useState(false)
  const [planGenerated, setPlanGenerated] = useState(false)

  // Restore autosaved progress if available
  useEffect(() => {
    try {
      const draft = localStorage.getItem(SETUP_STORAGE_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed.data) setData(parsed.data)
        if (parsed.step && parsed.step <= 13) setStep(parsed.step)
      }
    } catch (e) {
      console.warn('Could not restore setup draft', e)
    }
  }, [])

  // Autosave progress
  const update = (fields: Partial<SetupData>) => {
    setData((prev) => {
      const next = { ...prev, ...fields }
      localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify({ data: next, step }))
      return next
    })
  }

  const handleNext = () => {
    const nextStep = step + 1
    setStep(nextStep)
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify({ data, step: nextStep }))
  }

  const handleBack = () => {
    const prevStep = Math.max(1, step - 1)
    setStep(prevStep)
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify({ data, step: prevStep }))
  }

  const handleAddMember = () => {
    setData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: 'New Member', relationship: 'Child', budget: 5000 }],
    }))
  }

  const handleRemoveMember = (idx: number) => {
    setData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== idx),
    }))
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    // Persist all data into Financial Context & Supabase
    updateFinancialProfile({
      monthly_salary: data.monthly_salary,
      payday: data.payday,
      rent: data.rent,
      utilities: data.utilities,
      groceries: data.groceries,
      transportation: data.transportation,
      education: data.children_budget,
      healthcare: data.healthcare,
      debt: data.debt,
      savings_target: data.savings_target,
      emergency_target: data.emergency_target,
    })

    updateUserProfile({
      currency: data.currency,
      monthly_salary: data.monthly_salary,
      payday: data.payday,
      setup_completed: true,
      onboarding_completed: true,
    })

    // Add family members
    data.familyMembers.forEach((m) => {
      addFamilyMember({
        clerk_user_id: 'user_active',
        name: m.name,
        relationship: m.relationship,
        date_of_birth: null,
        avatar_url: null,
        monthly_budget: m.budget,
        notes: null,
      })
    })

    // Simulate animated generation for 1.8s
    setTimeout(() => {
      setIsGenerating(false)
      setPlanGenerated(true)
      localStorage.removeItem(SETUP_STORAGE_KEY)
      localStorage.setItem('lifeplan_onboarding_done', 'true')
    }, 1800)
  }

  // Real-time plan computation
  const plan = generateMonthlyPlan({
    salary: data.monthly_salary,
    rent: data.rent,
    utilities: data.utilities,
    groceries: data.groceries,
    transportation: data.transportation,
    education: data.children_budget,
    healthcare: data.healthcare,
    debt: data.debt,
    insurance: 3000,
    personal_budget: 10000,
    savings_target: data.savings_target,
    emergency_target: data.emergency_target,
    familyBudgets: data.familyMembers.map((m) => ({ name: m.name, amount: m.budget })),
  })

  // Steps definition: 12 Core Steps + Step 13 Family + Step 14 Final Generation
  const stepTitles = [
    'Monthly Salary',
    'Preferred Currency',
    'Monthly Payday',
    'Housing / Rent',
    'Utilities & Subscriptions',
    'Groceries & Household',
    'Transportation & Fuel',
    'Children & Education',
    'Healthcare & Insurance',
    'Debt & Loan Repayments',
    'Savings Target',
    'Emergency Fund Target',
    'Household Family Setup',
  ]

  return (
    <div className="min-h-screen bg-[#050806] text-[#F5FFF9] flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] flex items-center justify-center text-[#050806] shadow-[0_0_15px_rgba(25,217,138,0.3)]">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight">Financial Setup Wizard</h1>
            <p className="text-[11px] text-[#60756C]">
              {step <= 13 ? `Step ${step} of 13: ${stepTitles[step - 1]}` : 'Ready to Generate Your Plan'}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/home')}
          className="text-xs text-[#9AAFA5] hover:text-[#19D98A] transition-colors"
        >
          Skip to App
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl w-full mx-auto my-4">
        <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0F8C5C] via-[#19D98A] to-[#63F2B0] transition-all duration-300 rounded-full"
            style={{ width: `${(Math.min(step, 13) / 13) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl w-full mx-auto my-auto py-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Monthly Salary */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 1</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">What is your monthly net salary?</h2>
                <p className="text-xs text-[#9AAFA5]">Your take-home income after tax and payroll deductions.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Income</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.monthly_salary}
                    onChange={(e) => update({ monthly_salary: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Currency */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 2</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Select your primary currency</h2>
                <p className="text-xs text-[#9AAFA5]">All budgets and statements will display with this currency.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => update({ currency: c.code })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      data.currency === c.code
                        ? 'bg-[#101A15] border-[#19D98A] shadow-[0_0_15px_rgba(25,217,138,0.15)]'
                        : 'bg-[#0B110E] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{c.name}</div>
                    <div className="text-xs text-[#19D98A] font-extrabold mt-0.5">{c.code} ({c.symbol})</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payday */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 3</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Which day of the month is payday?</h2>
                <p className="text-xs text-[#9AAFA5]">Used to calculate your live runway countdown and safe-to-spend limits.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-3">
                <div className="text-4xl font-black text-[#19D98A]">{data.payday}th</div>
                <input
                  type="range"
                  min="1"
                  max="31"
                  value={data.payday}
                  onChange={(e) => update({ payday: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#19D98A] h-2 bg-white/[0.08] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#60756C]">
                  <span>1st</span>
                  <span>15th</span>
                  <span>31st</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Housing */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 4</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Housing, rent, or mortgage</h2>
                <p className="text-xs text-[#9AAFA5]">Your primary monthly shelter payment.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Housing</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.rent}
                    onChange={(e) => update({ rent: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Utilities */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 5</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Utilities & Subscriptions</h2>
                <p className="text-xs text-[#9AAFA5]">Electricity, gas, internet, mobile, water, and recurring services.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Estimated Utilities</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.utilities}
                    onChange={(e) => update({ utilities: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Groceries */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 6</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Monthly Groceries & Food</h2>
                <p className="text-xs text-[#9AAFA5]">Supermarket runs, household staples, and weekly pantry restocks.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Groceries Budget</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.groceries}
                    onChange={(e) => update({ groceries: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: Transport */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 7</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Transportation & Fuel</h2>
                <p className="text-xs text-[#9AAFA5]">Gasoline, public transit, tolls, parking, and maintenance.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Transport</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.transportation}
                    onChange={(e) => update({ transportation: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Children */}
          {step === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 8</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Children & Education</h2>
                <p className="text-xs text-[#9AAFA5]">Tuition fees, textbooks, uniforms, sports, and school activities.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Children Allocation</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.children_budget}
                    onChange={(e) => update({ children_budget: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: Healthcare */}
          {step === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 9</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Healthcare & Medical</h2>
                <p className="text-xs text-[#9AAFA5]">Prescriptions, dental, wellness, and routine doctor visits.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Healthcare</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.healthcare}
                    onChange={(e) => update({ healthcare: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 10: Debt */}
          {step === 10 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 10</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Debt & Loan Repayments</h2>
                <p className="text-xs text-[#9AAFA5]">Credit cards, auto loans, personal financing, or student debt.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Debt Payments</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.debt}
                    onChange={(e) => update({ debt: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 11: Savings Target */}
          {step === 11 && (
            <motion.div
              key="step-11"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 11</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Monthly Savings Target</h2>
                <p className="text-xs text-[#9AAFA5]">Long-term wealth building, investments, and milestone goals.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Savings</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.savings_target}
                    onChange={(e) => update({ savings_target: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 12: Emergency Fund */}
          {step === 12 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Step 12</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Emergency Fund Contribution</h2>
                <p className="text-xs text-[#9AAFA5]">Liquid safety runway to buffer against unexpected surprises.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-center space-y-2">
                <div className="text-xs font-bold text-[#60756C] uppercase">Monthly Emergency Deposit</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-[#19D98A]">{data.currency}</span>
                  <input
                    type="number"
                    value={data.emergency_target}
                    onChange={(e) => update({ emergency_target: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent text-4xl font-black text-white text-center focus:outline-none w-56"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 13: Household Setup */}
          {step === 13 && (
            <motion.div
              key="step-13"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">Household Setup</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Who is part of your household?</h2>
                <p className="text-xs text-[#9AAFA5]">Assign custom allowances for your spouse, children, or dependents.</p>
              </div>

              <div className="space-y-3">
                {data.familyMembers.map((member, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">{member.name}</div>
                        <div className="text-[10px] text-[#60756C]">{member.relationship} • {formatMoney(member.budget, data.currency)}/mo</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1.5 text-[#60756C] hover:text-[#E05252] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleAddMember}
                  className="w-full py-3 rounded-2xl bg-[#101A15] border border-dashed border-white/[0.15] text-xs font-bold text-[#19D98A] hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Add Household Member</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 14: Final Generation Screen */}
          {step === 14 && (
            <motion.div
              key="step-14"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] mx-auto flex items-center justify-center text-[#050806] shadow-[0_0_35px_rgba(25,217,138,0.4)]">
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={40} />
                  </motion.div>
                ) : (
                  <CheckCircle2 size={42} strokeWidth={2.5} />
                )}
              </div>

              <div>
                <h2 className="text-3xl font-black text-white">
                  {isGenerating ? 'Generating Your Smart Plan...' : 'Your Monthly Plan Is Ready!'}
                </h2>
                <p className="text-xs sm:text-sm text-[#9AAFA5] mt-1 max-w-sm mx-auto">
                  {isGenerating
                    ? 'Optimizing your 50/30/20 category allocations and daily safe-to-spend limit...'
                    : 'Your personalized financial architecture has been compiled and saved to your secure vault.'}
                </p>
              </div>

              {!isGenerating && (
                <div className="p-5 rounded-3xl bg-[#0B110E] border border-white/[0.08] text-left space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#9AAFA5]">Monthly Net Salary</span>
                    <span className="font-extrabold text-white">{formatMoney(plan.salary, data.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#9AAFA5]">Essential Needs (50% target)</span>
                    <span className="font-bold text-[#19D98A]">{plan.needsPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#9AAFA5]">Discretionary Buffer</span>
                    <span className="font-bold text-[#63F2B0]">{formatMoney(plan.remainingAmount, data.currency)}</span>
                  </div>
                </div>
              )}

              {isGenerating ? (
                <div className="py-4 text-xs font-bold text-[#19D98A] animate-pulse">
                  Applying real mathematical modeling...
                </div>
              ) : (
                <button
                  onClick={() => router.push('/home')}
                  className="w-full py-4 px-6 rounded-2xl bg-[#19D98A] text-[#050806] font-extrabold text-base hover:bg-[#3EE8A2] active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(25,217,138,0.35)]"
                >
                  Open My Dashboard →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Controls */}
      {step <= 13 && (
        <div className="max-w-xl w-full mx-auto flex items-center justify-between py-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#9AAFA5] hover:text-white disabled:opacity-30 disabled:hover:text-[#9AAFA5] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {step < 13 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-xs hover:bg-[#3EE8A2] active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_2px_10px_rgba(25,217,138,0.25)]"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStep(14)
                handleGeneratePlan()
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F8C5C] to-[#19D98A] text-[#050806] font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(25,217,138,0.3)]"
            >
              <Sparkles size={16} />
              <span>Generate My Monthly Plan</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
