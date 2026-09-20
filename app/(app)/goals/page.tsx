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
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export default function GoalsPage() {
  const {
    savingsGoals,
    financialProfile,
    currency,
    userProfile,
    emergencyFundMonths,
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

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalName || !targetAmount) return

    addSavingsGoal({
      clerk_user_id: userProfile.clerk_user_id,
      name: goalName,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      deadline: deadline || null,
      icon,
      color: '#19D98A',
      status: 'active',
      notes: notes || null,
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

  const emergencyGoal = savingsGoals.find((g) => g.id === 'goal_1')
  const otherGoals = savingsGoals.filter((g) => g.id !== 'goal_1')

  const totalSavedAllGoals = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalTargetAllGoals = savingsGoals.reduce((sum, g) => sum + g.target_amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Savings Goals & Emergency Runway
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Turn future aspirations into automated milestone targets.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="self-start sm:self-auto gap-2">
          <Plus size={16} />
          <span>New Savings Goal</span>
        </Button>
      </div>

      {/* Emergency Fund Highlight Banner */}
      {emergencyGoal && (
        <Card glow className="bg-gradient-to-br from-[#0B1510] via-[#0B110E] to-[#050806] border-[#19D98A]/30">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#19D98A] text-[#050806] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(25,217,138,0.3)]">
                    <ShieldCheck size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {emergencyGoal.name}
                    </h2>
                    <p className="text-xs text-[#9AAFA5]">
                      Liquid living reserve safely shielded against sudden shocks
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#9AAFA5] leading-relaxed">
                  Based on your monthly fixed requirements (
                  {formatMoney(
                    (financialProfile.rent || 0) +
                      (financialProfile.utilities || 0) +
                      (financialProfile.groceries || 0) +
                      (financialProfile.debt || 0),
                    currency
                  )}
                  /mo), your current balance provides a{' '}
                  <span className="text-[#19D98A] font-bold">{emergencyFundMonths} months</span> safety cushion.
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white font-bold">
                      {formatMoney(emergencyGoal.current_amount, currency)}{' '}
                      <span className="text-[#60756C] font-normal">
                        of {formatMoney(emergencyGoal.target_amount, currency)}
                      </span>
                    </span>
                    <span className="text-[#19D98A]">
                      {Math.round((emergencyGoal.current_amount / emergencyGoal.target_amount) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round((emergencyGoal.current_amount / emergencyGoal.target_amount) * 100)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  onClick={() => setDepositGoalId(emergencyGoal.id)}
                  className="gap-2 shadow-[0_4px_20px_rgba(25,217,138,0.3)]"
                >
                  <DollarSign size={16} />
                  Deposit to Emergency Fund
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Tally Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Total Capital Accumulated</div>
            <div className="text-2xl font-black text-[#19D98A] mt-1">
              {formatMoney(totalSavedAllGoals, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Across {savingsGoals.length} goal vaults</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Cumulative Target Cap</div>
            <div className="text-2xl font-black text-white mt-1">
              {formatMoney(totalTargetAllGoals, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Long-term objective total</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Monthly Target Inflow</div>
            <div className="text-2xl font-black text-[#63F2B0] mt-1">
              {formatMoney(financialProfile.savings_target || 1800, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">From regular cash flow allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
          const remaining = Math.max(0, goal.target_amount - goal.current_amount)

          return (
            <Card key={goal.id} className="bg-[#0B110E] hover:border-white/20 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center font-bold">
                    <Target size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{goal.name}</h3>
                    {goal.deadline && (
                      <div className="flex items-center gap-1 text-[11px] text-[#60756C] mt-1">
                        <Calendar size={11} /> Target: {goal.deadline}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteSavingsGoal(goal.id)}
                  className="p-1.5 text-[#60756C] hover:text-[#E05252] hover:bg-[#E05252]/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {goal.notes && (
                  <p className="text-xs text-[#9AAFA5] bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] leading-relaxed">
                    {goal.notes}
                  </p>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white font-bold">
                      {formatMoney(goal.current_amount, currency)}{' '}
                      <span className="text-[#60756C] font-normal">
                        / {formatMoney(goal.target_amount, currency)}
                      </span>
                    </span>
                    <span className="text-[#19D98A]">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                  <div className="text-[11px] text-[#60756C] flex justify-between pt-1">
                    <span>{formatMoney(remaining, currency)} remaining</span>
                    <span>{pct >= 100 ? '🎉 Goal Achieved!' : 'In Progress'}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setDepositGoalId(goal.id)}
                  variant="secondary"
                  className="w-full text-xs font-bold gap-2"
                >
                  <DollarSign size={14} className="text-[#19D98A]" />
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Deposit Modal */}
      <Dialog open={!!depositGoalId} onOpenChange={(open) => !open && setDepositGoalId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
            <DialogDescription>
              Record an allocation into this savings vault from your monthly funds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                Contribution Amount ({currency})
              </label>
              <Input
                type="number"
                placeholder="e.g. 250"
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
              Confirm Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Goal Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
            <DialogDescription>
              Set up a milestone target with target date and planned savings amount.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateGoal} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Goal Title</label>
              <Input
                required
                placeholder="e.g. Vacation in Tokyo, Home Downpayment"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                  Target Amount ({currency})
                </label>
                <Input
                  type="number"
                  required
                  placeholder="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                  Starting Balance ({currency})
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                Target Deadline (Optional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                Notes / Motivation (Optional)
              </label>
              <Input
                placeholder="e.g. Planned for family anniversary in autumn"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
