'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Upload,
  CreditCard,
  User,
  Tag,
  Calendar,
  FileText,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewTransactionPage() {
  const router = useRouter()
  const { categories, familyMembers, currency, userProfile, addTransaction } = useFinancialData()

  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [familyMemberId, setFamilyMemberId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [notes, setNotes] = useState('')
  const [receiptName, setReceiptName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0 || !description) return

    addTransaction({
      clerk_user_id: userProfile.clerk_user_id,
      category_id: categoryId || null,
      family_member_id: familyMemberId || null,
      type,
      amount: parseFloat(amount),
      description,
      transaction_date: date,
      payment_method: paymentMethod,
      receipt_url: receiptName ? `/receipts/${receiptName}` : null,
      notes: notes || null,
    })

    router.push('/transactions')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/transactions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9AAFA5] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Transactions
        </Link>
      </div>

      <Card className="bg-[#0B110E] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <CardHeader className="border-b border-white/[0.04] pb-5">
          <CardTitle className="text-xl font-black text-white">Record Transaction</CardTitle>
          <p className="text-xs text-[#9AAFA5] mt-1">
            Log an expense, salary inflow, or internal savings transfer.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#101A15] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-[#E05252] text-white shadow-md'
                    : 'text-[#9AAFA5] hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  type === 'income'
                    ? 'bg-[#19D98A] text-[#050806] shadow-md'
                    : 'text-[#9AAFA5] hover:text-white'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('transfer')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  type === 'transfer'
                    ? 'bg-[#3EE8A2] text-[#050806] shadow-md'
                    : 'text-[#9AAFA5] hover:text-white'
                }`}
              >
                Transfer / Savings
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#60756C]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-3xl font-black bg-[#101A15] border border-white/[0.1] rounded-2xl pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#19D98A] tracking-tight"
                  autoFocus
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                Merchant / Description
              </label>
              <Input
                required
                placeholder="e.g. Whole Foods Market, Apple Store, Client Wire"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category & Member attribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                  Assign to Family Member (Optional)
                </label>
                <select
                  value={familyMemberId}
                  onChange={(e) => setFamilyMemberId(e.target.value)}
                  className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
                >
                  <option value="">General Household / Shared</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                  Transaction Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
                >
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer / ACH</option>
                  <option value="Cash">Cash</option>
                  <option value="Direct Deposit">Direct Deposit</option>
                </select>
              </div>
            </div>

            {/* Receipt Upload simulation */}
            <div>
              <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                Receipt Attachment (Optional)
              </label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                <Upload size={16} className="text-[#19D98A]" />
                <span className="text-xs text-[#9AAFA5]">
                  {receiptName ? `Attached: ${receiptName}` : 'Upload photo or PDF receipt'}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#9AAFA5] mb-2">
                Personal Notes (Optional)
              </label>
              <Input
                placeholder="Additional details, warranty tags, or tax memo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/transactions')}>
                Cancel
              </Button>
              <Button type="submit" disabled={!amount || !description}>
                Save Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
