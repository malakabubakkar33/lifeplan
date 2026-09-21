'use client'

import React, { useState } from 'react'
import {
  Target,
  Plus,
  ShieldCheck,
  Calendar,
  PiggyBank,
  TrendingUp,
  Sparkles,
  Plane,
  Car,
  GraduationCap,
  Home,
  CheckCircle2,
  Trash2,
  DollarSign,
  Briefcase,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { processGoals, calculateEmergencyFundRunway } from '@/lib/finance/goals'

export default function GoalsPage() {
  const {
    savingsGoals,
    financialProfile,
    currency,
    userProfile,
    addSavingsGoal,
    contributeToGoal,
    deleteSavingsGoal,
  } = useFinancialData()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  // New goal form
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState('Target')
  const [notes, setNotes] = useState('')

  const now = new Date()
  const processedGoals = processGoals(savingsGoals, now)

  // Emergency runway benchmark
  const fixedMonthly =
    Number(financialProfile.rent || 0) +
    Number(financialProfile.utilities || 0) +
    Number(financialProfile.debt || 0) +
    Number(financialProfile.insurance || 0) +
    Number(financialProfile.groceries || 0)

  const emergencyGoal = savingsGoals.find((g) => g.id === 'goal_1') || savingsGoals[0]
  const emergencyAmount = emergencyGoal ? emergencyGoal.current_amount : 18400
  const runway = calculateEmergencyFundRunway(emergencyAmount, fixedMonthly)

  const totalSavedAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalTargetAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.target_amount, 0)

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    const target = parseFloat(targetAmount)
    if (!goalName.trim() || !target || target <= 0) return

    addSavingsGoal({
      clerk_user_id: userProfile.clerk_user_id,
      name: goalName.trim(),
      target_amount: target,
      current_amount: parseFloat(currentAmount) || 0,
      deadline: deadline || null,
      icon,
      color: '#19D98A',
      status: 'active',
      notes: notes.trim() || null,
    })

    setGoalName('')
    setTargetAmount('')
    setCurrentAmount('0')
    setDeadline('')
    setNotes('')
    setIsAddOpen(false)
  }

  const handleDeposit = () => {
    if (!depositGoalId || !depositAmount) return
    const amt = parseFloat(depositAmount)
    if (amt > 0) {
      contributeToGoal(depositGoalId, amt)
      setDepositGoalId(null)
      setDepositAmount('')
    }
  }

  const presets = [
    { name: 'Emergency Fund', icon: 'ShieldCheck', target: fixedMonthly * 6 },
    { name: 'Family Vacation', icon: 'Plane', target: 4500 },
    { name: 'Vehicle Downpayment', icon: 'Car', target: 10000 },
    { name: 'House Downpayment', icon: 'Home', target: 50000 },
    { name: 'Child University Fund', icon: 'GraduationCap', target: 30000 },
    { name: 'Business Startup Vault', icon: 'Briefcase', target: 20000 },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Savings & Financial Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Lock in milestones, track emergency runway, and automate monthly contributions.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto gap-2 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
        >
          <Plus size={16} />
          <span>New Goal Vault</span>
        </Button>
      </div>

      {/* Emergency Fund Benchmark Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border border-[#19D98A]/25 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#063B28] to-[#19D98A] flex items-center justify-center text-[#050806] font-black shrink-0 shadow-[0_0_20px_rgba(25,217,138,0.3)]">
              <ShieldCheck size={30} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Emergency Fund Health</h3>
                <Badge variant="default" className="text-[10px]">
                  {runway.healthStatus.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-[#9AAFA5] mt-0.5">
                Benchmark: 6 months of fixed living essentials ({formatMoney(fixedMonthly, currency)}/mo).
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-[#60756C]">Liquid Buffer Horizon</div>
            <div className="text-2xl font-black text-[#19D98A] mt-0.5">
              {runway.runwayMonths} Months Safe
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/[0.04]">
          <div className="p-3 rounded-2xl bg-white/[0.02]">
            <div className="text-[10px] text-[#60756C]">Current Reserve</div>
            <div className="text-sm font-bold text-white mt-0.5">{formatMoney(emergencyAmount, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02]">
            <div className="text-[10px] text-[#60756C]">6-Mo Target</div>
            <div className="text-sm font-bold text-white mt-0.5">{formatMoney(fixedMonthly * 6, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02]">
            <div className="text-[10px] text-[#60756C]">All Vaults Total</div>
            <div className="text-sm font-bold text-[#19D98A] mt-0.5">{formatMoney(totalSavedAcrossGoals, currency)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02]">
            <div className="text-[10px] text-[#60756C]">Monthly Deposit</div>
            <div className="text-sm font-bold text-[#63F2B0] mt-0.5">
              +{formatMoney(financialProfile.emergency_target || 500, currency)}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Goal Vaults List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white px-1">Active Goal Vaults</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {processedGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-3xl bg-[#0B110E] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center font-bold">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{goal.name}</h3>
                    <p className="text-[10px] text-[#60756C]">
                      Target: {formatMoney(goal.target_amount, currency)}
                      {goal.deadline && ` • Due ${goal.deadline}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => setDepositGoalId(goal.id)}
                    className="text-xs h-8 px-3 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
                  >
                    + Add Money
                  </Button>
                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="p-1.5 text-[#60756C] hover:text-[#E05252] transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Math */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9AAFA5]">{formatMoney(goal.current_amount, currency)} funded</span>
                  <span className="font-bold text-[#19D98A]">{goal.percentageProgress}%</span>
                </div>
                <Progress value={goal.percentageProgress} className="h-2" />
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#9AAFA5]">
                <span>Required monthly:</span>
                <span className="font-bold text-white">
                  {formatMoney(goal.monthlyContributionRequired, currency)} / mo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal Vault</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateGoal} className="space-y-4 py-2">
            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Quick Presets</label>
              <div className="grid grid-cols-3 gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setGoalName(p.name)
                      setTargetAmount(p.target.toString())
                      setIcon(p.icon)
                    }}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#19D98A]/40 text-[10px] text-left text-[#9AAFA5] hover:text-white transition-colors"
                  >
                    <div className="font-bold text-white truncate">{p.name}</div>
                    <div className="text-[#19D98A]">{formatMoney(p.target, currency)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Goal Title</label>
              <Input
                placeholder="e.g. Electric Vehicle Upgrade, Japan Trip"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Target Amount ({currency})</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Starting Balance</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Target Completion Date</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Notes (Optional)</label>
              <Input
                placeholder="Why is this milestone important?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Vault</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog open={Boolean(depositGoalId)} onOpenChange={(open) => !open && setDepositGoalId(null)}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Deposit into Savings Vault</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-[#9AAFA5]">
              Allocate funds into this vault. Your goal balance will automatically update.
            </p>
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">
                Deposit Amount ({currency})
              </label>
              <Input
                type="number"
                placeholder="500.00"
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
            <Button onClick={handleDeposit}>Confirm Deposit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
