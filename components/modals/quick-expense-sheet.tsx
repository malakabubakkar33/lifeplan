'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  PlusCircle,
  Camera,
  Upload,
  Calendar,
  CreditCard,
  User,
  Tag,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'

interface QuickExpenseSheetProps {
  isOpen: boolean
  onClose: () => void
  initialType?: 'expense' | 'income' | 'transfer'
}

export function QuickExpenseSheet({
  isOpen,
  onClose,
  initialType = 'expense',
}: QuickExpenseSheetProps) {
  const { categories, familyMembers, currency, userProfile, addTransaction } = useFinancialData()

  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(initialType)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [familyMemberId, setFamilyMemberId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [notes, setNotes] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleReceiptSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setReceiptPreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0 || !description.trim()) return

    setIsSubmitting(true)

    try {
      addTransaction({
        clerk_user_id: userProfile.clerk_user_id,
        category_id: categoryId || null,
        family_member_id: familyMemberId || null,
        type,
        amount: numericAmount,
        description: description.trim(),
        transaction_date: date,
        payment_method: paymentMethod,
        receipt_url: receiptPreview || (receiptFile ? `/receipts/${receiptFile.name}` : null),
        notes: notes.trim() || null,
      })

      // Reset form
      setAmount('')
      setDescription('')
      setNotes('')
      setReceiptFile(null)
      setReceiptPreview(null)
      onClose()
    } catch (err) {
      console.error('Failed to log transaction:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal / Sheet Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#0B110E] border-t sm:border border-white/[0.1] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-7 z-10 max-h-[92vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          {/* Grab Bar for Mobile */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] text-[#9AAFA5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="mb-5">
            <h3 className="text-xl font-black text-white tracking-tight">Record Transaction</h3>
            <p className="text-xs text-[#9AAFA5] mt-0.5">
              Log an outflow, salary credit, or goal transfer in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#101A15] border border-white/[0.06]">
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
                    ? 'bg-[#63F2B0] text-[#050806] shadow-md'
                    : 'text-[#9AAFA5] hover:text-white'
                }`}
              >
                Transfer
              </button>
            </div>

            {/* Large Amount Input */}
            <div className="p-4 rounded-2xl bg-[#101A15] border border-white/[0.06] focus-within:border-[#19D98A]/50 transition-colors text-center">
              <label className="text-[10px] font-bold text-[#60756C] uppercase tracking-wider block mb-1">
                Transaction Amount ({currency})
              </label>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-[#19D98A]">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-3xl sm:text-4xl font-black text-white text-center focus:outline-none w-48 placeholder-white/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Weekly Grocery Run, Metro Pass, Coffee"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs placeholder:text-[#60756C] focus:outline-none focus:border-[#19D98A]/50"
              />
            </div>

            {/* Category & Family Member Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#19D98A]/50"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0B110E] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Family Member (Optional)</label>
                <select
                  value={familyMemberId}
                  onChange={(e) => setFamilyMemberId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#19D98A]/50"
                >
                  <option value="" className="bg-[#0B110E] text-[#60756C]">None (General Household)</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0B110E] text-white">
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#19D98A]/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#19D98A]/50"
                >
                  <option value="Credit Card" className="bg-[#0B110E]">Credit Card</option>
                  <option value="Debit Card" className="bg-[#0B110E]">Debit Card</option>
                  <option value="Cash" className="bg-[#0B110E]">Cash</option>
                  <option value="Bank Transfer" className="bg-[#0B110E]">Bank Transfer</option>
                  <option value="Apple Pay" className="bg-[#0B110E]">Apple Pay / Google Pay</option>
                  <option value="Other" className="bg-[#0B110E]">Other</option>
                </select>
              </div>
            </div>

            {/* Receipt Upload & Preview */}
            <div>
              <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Receipt Attachment</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#101A15] border border-dashed border-white/[0.15] hover:border-[#19D98A]/40 text-xs text-[#9AAFA5] hover:text-white cursor-pointer transition-colors">
                  <Camera size={16} className="text-[#19D98A]" />
                  <span>{receiptFile ? receiptFile.name : 'Upload Receipt Photo or Document'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptSelect}
                    className="hidden"
                  />
                </label>
                {receiptPreview && (
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#19D98A]/30 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#9AAFA5] mb-1.5 block">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101A15] border border-white/[0.08] text-white text-xs placeholder:text-[#60756C] focus:outline-none focus:border-[#19D98A]/50"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm hover:bg-[#3EE8A2] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(25,217,138,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : `Record ${type === 'expense' ? 'Expense' : type === 'income' ? 'Income' : 'Transfer'}`}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
