'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  GraduationCap,
  Heart,
  Baby,
  User,
  ChevronRight,
  TrendingUp,
  Receipt,
  Trash2,
  BookOpen,
  Shirt,
  Bus,
  Activity,
  HeartPulse,
  Utensils,
  DollarSign,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function FamilyPage() {
  const { familyMembers, transactions, currency, userProfile, addFamilyMember, deleteFamilyMember } =
    useFinancialData()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('Child')
  const [monthlyBudget, setMonthlyBudget] = useState('400')
  const [notes, setNotes] = useState('')

  const totalAllocated = familyMembers.reduce((sum, m) => sum + m.monthly_budget, 0)

  // Calculate actual spending per member this month
  const memberSpending = familyMembers.map((m) => {
    const spent = transactions
      .filter((t) => t.family_member_id === m.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const pct = m.monthly_budget > 0 ? Math.min(100, Math.round((spent / m.monthly_budget) * 100)) : 0
    const remaining = Math.max(0, m.monthly_budget - spent)
    return {
      ...m,
      spent,
      remaining,
      pct,
    }
  })

  const totalSpentAcrossFamily = memberSpending.reduce((sum, m) => sum + m.spent, 0)

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addFamilyMember({
      clerk_user_id: userProfile.clerk_user_id,
      name: name.trim(),
      relationship,
      date_of_birth: null,
      avatar_url: null,
      monthly_budget: parseFloat(monthlyBudget) || 0,
      notes: notes.trim() || null,
    })

    setName('')
    setMonthlyBudget('400')
    setNotes('')
    setIsAddOpen(false)
  }

  // Children members & children-specific expenses
  const childrenMembers = familyMembers.filter((m) => m.relationship.toLowerCase().includes('child'))
  const childrenTxs = transactions.filter((t) => {
    const mem = familyMembers.find((m) => m.id === t.family_member_id)
    return mem && mem.relationship.toLowerCase().includes('child')
  })
  const totalChildrenSpending = childrenTxs.reduce((sum, t) => sum + t.amount, 0)

  const childExpenseCategories = [
    { name: 'School Tuition', icon: GraduationCap, color: '#19D98A', desc: 'Tuition & academic term fees' },
    { name: 'Books & Supplies', icon: BookOpen, color: '#3EE8A2', desc: 'Stationery, art & reading' },
    { name: 'Uniform & Clothing', icon: Shirt, color: '#63F2B0', desc: 'School uniform & seasonal shoes' },
    { name: 'School Transit', icon: Bus, color: '#0F8C5C', desc: 'Bus pass, carpooling & fuel' },
    { name: 'Activities & Sports', icon: Activity, color: '#10B981', desc: 'Soccer, ballet & clubs' },
    { name: 'Pediatric Medical', icon: HeartPulse, color: '#34D399', desc: 'Vaccines & dentist visits' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Family & Household Management
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Oversee household allowances, track dependents, and manage child-specific expenses.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto gap-2 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
        >
          <Plus size={16} />
          <span>Add Family Member</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Household Members</div>
          <div className="text-xl font-black text-white mt-0.5">{familyMembers.length} Members</div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">{childrenMembers.length} dependents / children</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Total Monthly Allowances</div>
          <div className="text-xl font-black text-[#19D98A] mt-0.5">
            {formatMoney(totalAllocated, currency)}
          </div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">Allocated discretionary budgets</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Spent This Month</div>
          <div className="text-xl font-black text-white mt-0.5">
            {formatMoney(totalSpentAcrossFamily, currency)}
          </div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">Recorded member expenses</p>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white px-1">Household Members</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {memberSpending.map((m) => {
            const isChild = m.relationship.toLowerCase().includes('child')
            return (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-[#0B110E] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isChild ? 'bg-[#19D98A]/15 text-[#19D98A]' : 'bg-white/[0.06] text-white'
                      }`}
                    >
                      {isChild ? <Baby size={20} /> : <User size={20} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{m.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {m.relationship}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/family/${m.id}`}
                      className="p-2 rounded-xl bg-white/[0.03] text-[#9AAFA5] hover:text-white transition-colors"
                      title="View member ledger"
                    >
                      <ChevronRight size={16} />
                    </Link>
                    <button
                      onClick={() => deleteFamilyMember(m.id)}
                      className="p-2 rounded-xl text-[#60756C] hover:text-[#E05252] transition-colors"
                      title="Remove member"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Allowances */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#60756C]">Monthly Utilized</span>
                    <span className="font-bold text-[#19D98A]">{m.pct}%</span>
                  </div>
                  <Progress value={m.pct} className="h-1.5" />
                  <div className="flex justify-between text-[11px] text-[#9AAFA5] pt-1">
                    <span>Spent: {formatMoney(m.spent, currency)}</span>
                    <span>Budget: {formatMoney(m.monthly_budget, currency)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Children Expense Management Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border border-[#19D98A]/25 space-y-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Baby size={18} className="text-[#19D98A]" />
              <h2 className="text-base font-black text-white">Children&apos;s Expense Ledger</h2>
            </div>
            <p className="text-xs text-[#9AAFA5] mt-0.5">
              Dedicated tracking for academic tuition, supplies, sports, and healthcare.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[10px] text-[#60756C] uppercase font-bold">Total Child Spending</div>
            <div className="text-xl font-black text-[#19D98A] mt-0.5">
              {formatMoney(totalChildrenSpending, currency)}
            </div>
          </div>
        </div>

        {/* Children Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {childExpenseCategories.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.name}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 hover:border-white/[0.1] transition-colors"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                  <Icon size={16} />
                </div>
                <div className="text-xs font-bold text-white">{c.name}</div>
                <p className="text-[10px] text-[#60756C] leading-snug">{c.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Family Member Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Full Name</label>
              <Input
                placeholder="e.g. Leo Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Dependent">Dependent</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">
                  Monthly Allowance ({currency})
                </label>
                <Input
                  type="number"
                  placeholder="400"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Notes (Optional)</label>
              <Input
                placeholder="e.g. Grade 2 tuition, school transit, personal care"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
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
