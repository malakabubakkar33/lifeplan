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
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

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
    return {
      ...m,
      spent,
      pct,
    }
  })

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    addFamilyMember({
      clerk_user_id: userProfile.clerk_user_id,
      name,
      relationship,
      date_of_birth: null,
      avatar_url: null,
      monthly_budget: parseFloat(monthlyBudget) || 0,
      notes: notes || null,
    })

    setName('')
    setMonthlyBudget('400')
    setNotes('')
    setIsAddOpen(false)
  }

  // Children-specific transactions
  const childrenTxs = transactions.filter((t) => {
    const mem = familyMembers.find((m) => m.id === t.family_member_id)
    return mem && mem.relationship.toLowerCase().includes('child')
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Family & Children Finances
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Manage allowances, school fees, pediatric healthcare, and family allocations.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="self-start sm:self-auto gap-2">
          <Plus size={16} />
          <span>Add Family Member</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Total Family Members</div>
            <div className="text-2xl font-black text-white mt-1">{familyMembers.length} Dependents</div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Spouse, children, and parents</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Monthly Family Budget Pool</div>
            <div className="text-2xl font-black text-[#19D98A] mt-1">
              {formatMoney(totalAllocated, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Cumulative allocated allowances</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Children Expenses Tracked</div>
            <div className="text-2xl font-black text-[#63F2B0] mt-1">
              {formatMoney(
                childrenTxs.reduce((sum, t) => sum + t.amount, 0),
                currency
              )}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Tuition, hobbies, and clothing</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberSpending.map((member) => {
          const isChild = member.relationship.toLowerCase().includes('child')
          return (
            <Card key={member.id} className="bg-[#0B110E] hover:border-white/20 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      isChild
                        ? 'bg-[#19D98A]/15 text-[#19D98A]'
                        : 'bg-white/[0.08] text-white'
                    }`}
                  >
                    {isChild ? <Baby size={22} /> : <User size={22} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{member.name}</h3>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {member.relationship}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={() => deleteFamilyMember(member.id)}
                  className="p-1.5 text-[#60756C] hover:text-[#E05252] hover:bg-[#E05252]/10 rounded-lg transition-colors"
                  title="Remove member"
                >
                  <Trash2 size={14} />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {member.notes && (
                  <p className="text-xs text-[#9AAFA5] bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] leading-relaxed">
                    {member.notes}
                  </p>
                )}

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#60756C]">Utilized this Month</span>
                    <span className={member.pct > 90 ? 'text-[#E05252]' : 'text-[#19D98A]'}>
                      {formatMoney(member.spent, currency)} / {formatMoney(member.monthly_budget, currency)}
                    </span>
                  </div>
                  <Progress value={member.pct} />
                </div>

                <Link
                  href={`/family/${member.id}`}
                  className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs font-semibold text-[#9AAFA5] hover:text-[#19D98A] transition-colors"
                >
                  <span>View Member Ledger</span>
                  <ChevronRight size={14} />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Children Expenses Activity Log */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Children & Education Ledger</CardTitle>
              <p className="text-xs text-[#9AAFA5]">Tuition, extracurricular activities, and supplies</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {childrenTxs.length === 0 ? (
            <p className="text-xs text-[#60756C] text-center py-4">No child-attributed expenses recorded yet.</p>
          ) : (
            childrenTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{tx.description}</div>
                  <div className="text-xs text-[#9AAFA5] flex items-center gap-2 mt-0.5">
                    <span>{tx.transaction_date}</span>
                    <span>•</span>
                    <span className="text-[#19D98A]">{tx.family_member?.name}</span>
                    {tx.payment_method && (
                      <>
                        <span>•</span>
                        <span>{tx.payment_method}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm font-black text-white">
                  -{formatMoney(tx.amount, currency)}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Assign dedicated budgets and track individual expenses for household members.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Full Name</label>
              <Input
                required
                placeholder="e.g. Leo Morgan, Sarah, Grandfather"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other Dependent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                  Monthly Budget ({currency})
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
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                Notes / Scope (Optional)
              </label>
              <Input
                placeholder="e.g. Grade 2 tuition, soccer academy, dental checkups"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
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
