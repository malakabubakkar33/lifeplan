'use client'

import React, { useState } from 'react'
import {
  CalendarClock,
  Plus,
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export default function BillsPage() {
  const { bills, categories, currency, userProfile, toggleBillPaid, addBill, deleteBill } = useFinancialData()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [billName, setBillName] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [billDueDate, setBillDueDate] = useState('15')
  const [billCategory, setBillCategory] = useState(categories[0]?.id || '')
  const [billRecurring, setBillRecurring] = useState(true)

  const totalMonthlyBills = bills.reduce((sum, b) => sum + b.amount, 0)
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0)
  const totalPending = bills.filter((b) => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0)

  const now = new Date()
  const today = now.getDate()

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!billName || !billAmount) return

    addBill({
      clerk_user_id: userProfile.clerk_user_id,
      name: billName,
      amount: parseFloat(billAmount),
      due_date: parseInt(billDueDate, 10) || 1,
      recurring: billRecurring,
      recurrence_type: 'monthly',
      category_id: billCategory || null,
      status: 'pending',
      paid_at: null,
      reminder_enabled: true,
      notes: null,
    })

    setBillName('')
    setBillAmount('')
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bills & Subscriptions
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Never miss a payment. Track due dates, automated debits, and paid statuses.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="self-start sm:self-auto gap-2">
          <Plus size={16} />
          <span>Add Recurring Bill</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Total Monthly Fixed Bills</div>
            <div className="text-2xl font-black text-white mt-1">
              {formatMoney(totalMonthlyBills, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">{bills.length} active recurring commitments</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Settled / Paid</div>
            <div className="text-2xl font-black text-[#19D98A] mt-1">
              {formatMoney(totalPaid, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">
              {bills.filter((b) => b.status === 'paid').length} of {bills.length} bills settled
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0B110E]">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-[#60756C]">Remaining Outstanding</div>
            <div className="text-2xl font-black text-[#E09B35] mt-1">
              {formatMoney(totalPending, currency)}
            </div>
            <p className="text-[11px] text-[#9AAFA5] mt-1">Pending payments this cycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {bills.map((bill) => {
          const isPaid = bill.status === 'paid'
          const isOverdue = !isPaid && bill.due_date < today
          const isDueSoon = !isPaid && bill.due_date >= today && bill.due_date <= today + 5

          return (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isPaid
                  ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                  : isOverdue
                  ? 'bg-[#E05252]/5 border-[#E05252]/30 shadow-[0_0_20px_rgba(224,82,82,0.06)]'
                  : 'bg-[#0B110E] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isPaid
                      ? 'bg-[#19D98A] text-[#050806] shadow-sm'
                      : 'border-2 border-white/20 text-transparent hover:border-[#19D98A]'
                  }`}
                  title={isPaid ? 'Mark as pending' : 'Mark as paid'}
                >
                  <Check size={18} strokeWidth={3} />
                </button>

                <div>
                  <div className={`text-base font-bold ${isPaid ? 'line-through text-[#60756C]' : 'text-white'}`}>
                    {bill.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#9AAFA5] mt-0.5">
                    <span className="flex items-center gap-1 text-[#60756C]">
                      <CalendarClock size={13} />
                      Due on day {bill.due_date}
                    </span>
                    {bill.category && (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-[#A8B8B0]">
                        {bill.category.name}
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-[11px] font-bold text-[#E05252] flex items-center gap-1">
                        <AlertTriangle size={12} /> Overdue by {today - bill.due_date} days
                      </span>
                    )}
                    {isDueSoon && (
                      <span className="text-[11px] font-bold text-[#E09B35] flex items-center gap-1">
                        <Clock size={12} /> Due in {bill.due_date - today} days
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-base font-black text-white">
                    {formatMoney(bill.amount, currency)}
                  </div>
                  <Badge
                    variant={isPaid ? 'success' : isOverdue ? 'destructive' : isDueSoon ? 'warning' : 'secondary'}
                    className="text-[10px] capitalize mt-0.5"
                  >
                    {isPaid ? 'Paid' : isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Pending'}
                  </Badge>
                </div>

                <button
                  onClick={() => deleteBill(bill.id)}
                  className="p-2 text-[#60756C] hover:text-[#E05252] hover:bg-[#E05252]/10 rounded-lg transition-all"
                  title="Remove bill"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Bill Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Fixed Bill</DialogTitle>
            <DialogDescription>
              LifePlan will remind you and automatically account for this bill in your monthly plans.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBill} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Bill Name</label>
              <Input
                required
                placeholder="e.g. Fiber Internet, Gym Membership, Car Insurance"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Amount ({currency})</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Due Day (1-31)</label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Category</label>
              <select
                value={billCategory}
                onChange={(e) => setBillCategory(e.target.value)}
                className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Bill</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
