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
  Bell,
  BellOff,
  Edit2,
  Tag,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { processBills, getBillUrgency, BillUrgency } from '@/lib/finance/bills'

export default function BillsPage() {
  const { bills, categories, currency, userProfile, toggleBillPaid, addBill, updateBill, deleteBill } = useFinancialData()

  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'paid' | 'overdue' | 'recurring'>('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBillId, setEditingBillId] = useState<string | null>(null)

  // Form states
  const [billName, setBillName] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [billDueDate, setBillDueDate] = useState('15')
  const [billCategory, setBillCategory] = useState(categories[0]?.id || '')
  const [billRecurring, setBillRecurring] = useState(true)
  const [billReminder, setBillReminder] = useState(true)

  const now = new Date()
  const processedBills = processBills(bills, now)

  const totalMonthlyBills = bills.reduce((sum, b) => sum + b.amount, 0)
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0)
  const totalPending = bills.filter((b) => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0)

  // Filter bills
  const filtered = processedBills.filter((b) => {
    if (filterTab === 'paid') return b.status === 'paid'
    if (filterTab === 'overdue') return b.urgency === 'overdue'
    if (filterTab === 'upcoming') return b.status !== 'paid' && b.urgency !== 'overdue'
    if (filterTab === 'recurring') return b.recurring
    return true
  })

  const handleOpenAdd = () => {
    setBillName('')
    setBillAmount('')
    setBillDueDate('15')
    setBillCategory(categories[0]?.id || '')
    setBillRecurring(true)
    setBillReminder(true)
    setEditingBillId(null)
    setIsAddOpen(true)
  }

  const handleOpenEdit = (b: any) => {
    setBillName(b.name)
    setBillAmount(b.amount.toString())
    setBillDueDate(b.due_date.toString())
    setBillCategory(b.category_id || categories[0]?.id || '')
    setBillRecurring(b.recurring)
    setBillReminder(b.reminder_enabled)
    setEditingBillId(b.id)
    setIsAddOpen(true)
  }

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = parseFloat(billAmount)
    if (!billName.trim() || !numericAmount || numericAmount <= 0) return

    if (editingBillId) {
      updateBill(editingBillId, {
        name: billName.trim(),
        amount: numericAmount,
        due_date: parseInt(billDueDate, 10) || 1,
        category_id: billCategory || null,
        recurring: billRecurring,
        reminder_enabled: billReminder,
      })
    } else {
      addBill({
        clerk_user_id: userProfile.clerk_user_id,
        name: billName.trim(),
        amount: numericAmount,
        due_date: parseInt(billDueDate, 10) || 1,
        recurring: billRecurring,
        recurrence_type: 'monthly',
        category_id: billCategory || null,
        status: 'pending',
        paid_at: null,
        reminder_enabled: billReminder,
        notes: null,
      })
    }

    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bills & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Automate due dates, settle payments, and stay ahead of billing cycles.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="self-start sm:self-auto gap-2 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]">
          <Plus size={16} />
          <span>Add Recurring Bill</span>
        </Button>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Monthly Commitments</div>
          <div className="text-xl font-black text-white mt-0.5">
            {formatMoney(totalMonthlyBills, currency)}
          </div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">{bills.length} active recurring commitments</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Settled This Cycle</div>
          <div className="text-xl font-black text-[#19D98A] mt-0.5">
            {formatMoney(totalPaid, currency)}
          </div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">
            {bills.filter((b) => b.status === 'paid').length} of {bills.length} bills settled
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-[#60756C] uppercase">Outstanding Pending</div>
          <div className="text-xl font-black text-[#EAB308] mt-0.5">
            {formatMoney(totalPending, currency)}
          </div>
          <p className="text-[11px] text-[#9AAFA5] mt-0.5">Remaining to be settled</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B110E] border border-white/[0.06] overflow-x-auto scrollbar-none">
        {(['all', 'upcoming', 'paid', 'overdue', 'recurring'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterTab(t)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap ${
              filterTab === t
                ? 'bg-[#19D98A] text-[#050806] shadow-md'
                : 'text-[#9AAFA5] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Bills Ledger List */}
      <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-sm font-bold text-white">No bills match this filter</div>
            <p className="text-xs text-[#9AAFA5]">All commitments in this category are settled or none exist.</p>
          </div>
        ) : (
          filtered.map((bill) => (
            <div
              key={bill.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Due Date Indicator Box */}
                <div
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                    bill.status === 'paid'
                      ? 'bg-[#19D98A]/15 text-[#19D98A]'
                      : bill.urgency === 'overdue'
                      ? 'bg-[#E05252]/15 text-[#E05252]'
                      : bill.urgency === 'due_today'
                      ? 'bg-[#EAB308]/20 text-[#EAB308] animate-pulse'
                      : 'bg-white/[0.04] text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold leading-none">Due</span>
                  <span className="text-base leading-none mt-0.5">{bill.due_date}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{bill.name}</span>
                    <Badge
                      variant={
                        bill.status === 'paid'
                          ? 'default'
                          : bill.urgency === 'overdue'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {bill.urgencyLabel}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-[#60756C] mt-0.5 flex items-center gap-2">
                    <span>{bill.category?.name || 'General Utility'}</span>
                    <span>•</span>
                    <span>{bill.recurring ? 'Monthly Recurring' : 'One-time'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {bill.reminder_enabled ? <Bell size={11} className="text-[#19D98A]" /> : <BellOff size={11} />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Amount */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <div className="text-base font-black text-white">{formatMoney(bill.amount, currency)}</div>
                  <div className="text-[10px] text-[#60756C]">
                    {bill.status === 'paid' ? `Settled` : 'Payment due'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`text-xs h-9 font-bold ${
                      bill.status === 'paid'
                        ? 'bg-[#19D98A]/20 text-[#19D98A] border border-[#19D98A]/30 hover:bg-[#19D98A]/30'
                        : 'bg-[#101A15] border border-white/[0.1] text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {bill.status === 'paid' ? '✓ Paid' : 'Mark Paid'}
                  </Button>

                  <button
                    onClick={() => handleOpenEdit(bill)}
                    className="p-2 rounded-xl text-[#60756C] hover:text-white hover:bg-white/[0.04] transition-colors"
                    title="Edit bill"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="p-2 rounded-xl text-[#60756C] hover:text-[#E05252] hover:bg-white/[0.04] transition-colors"
                    title="Delete bill"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Bill Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white">
          <DialogHeader>
            <DialogTitle>{editingBillId ? 'Edit Bill Commitment' : 'Add Recurring Bill'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveBill} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Bill Name</label>
              <Input
                placeholder="e.g. Electric Grid, Fiber Internet, Water"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Amount ({currency})</label>
                <Input
                  type="number"
                  placeholder="145.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Due Day (1-31)</label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="15"
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9AAFA5] block mb-1.5">Category</label>
              <select
                value={billCategory}
                onChange={(e) => setBillCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0B110E] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs font-semibold text-white">Monthly Recurring</span>
              <input
                type="checkbox"
                checked={billRecurring}
                onChange={(e) => setBillRecurring(e.target.checked)}
                className="accent-[#19D98A] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs font-semibold text-white">Send Push / In-App Reminder</span>
              <input
                type="checkbox"
                checked={billReminder}
                onChange={(e) => setBillReminder(e.target.checked)}
                className="accent-[#19D98A] w-4 h-4 cursor-pointer"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBillId ? 'Update Bill' : 'Save Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
