'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Trash2,
  Calendar,
  CreditCard,
  User,
  SlidersHorizontal,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QuickExpenseSheet } from '@/components/modals/quick-expense-sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function TransactionsPage() {
  const { transactions, categories, familyMembers, currency, deleteTransaction } = useFinancialData()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [familyFilter, setFamilyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  const [quickSheetOpen, setQuickSheetOpen] = useState(false)
  const [quickSheetType, setQuickSheetType] = useState<'expense' | 'income' | 'transfer'>('expense')
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)

  // Filter and sort transactions
  const filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false
    if (categoryFilter !== 'all' && tx.category_id !== categoryFilter) return false
    if (familyFilter !== 'all' && tx.family_member_id !== familyFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const matchDesc = tx.description.toLowerCase().includes(q)
      const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(q) : false
      const matchMethod = tx.payment_method ? tx.payment_method.toLowerCase().includes(q) : false
      if (!matchDesc && !matchNotes && !matchMethod) return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
    }
    if (sortBy === 'oldest') {
      return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
    }
    if (sortBy === 'highest') {
      return b.amount - a.amount
    }
    if (sortBy === 'lowest') {
      return a.amount - b.amount
    }
    return 0
  })

  // Summary tallies
  const totalIn = filtered.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalOut = filtered.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const totalTrans = filtered.filter((t) => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0)

  const openSheet = (type: 'expense' | 'income' | 'transfer') => {
    setQuickSheetType(type)
    setQuickSheetOpen(true)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Transactions Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Audit, categorize, and filter every inflow, expense, and savings transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => openSheet('expense')}
            className="text-xs h-10 bg-[#E05252] text-white font-bold hover:bg-[#d44343]"
          >
            + Add Expense
          </Button>
          <Button
            onClick={() => openSheet('income')}
            className="text-xs h-10 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
          >
            + Add Income
          </Button>
        </div>
      </div>

      {/* Summary Tallies Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#60756C] font-bold uppercase">Total Inflow</div>
            <div className="text-lg font-black text-[#19D98A] mt-0.5">
              +{formatMoney(totalIn, currency)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#19D98A]/10 text-[#19D98A] flex items-center justify-center">
            <ArrowDownLeft size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#60756C] font-bold uppercase">Total Outflow</div>
            <div className="text-lg font-black text-white mt-0.5">
              -{formatMoney(totalOut, currency)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#E05252]/10 text-[#E05252] flex items-center justify-center">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#60756C] font-bold uppercase">Savings Transfers</div>
            <div className="text-lg font-black text-[#63F2B0] mt-0.5">
              {formatMoney(totalTrans, currency)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#63F2B0]/10 text-[#63F2B0] flex items-center justify-center">
            <PiggyBank size={18} />
          </div>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
        {(['all', 'expense', 'income', 'transfer'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
              typeFilter === t
                ? 'bg-[#19D98A] text-[#050806] shadow-md'
                : 'text-[#9AAFA5] hover:text-white'
            }`}
          >
            {t === 'all' ? 'All Transactions' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="sm:col-span-2 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60756C]" />
          <input
            type="text"
            placeholder="Search description, payment method, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#0B110E] border border-white/[0.08] text-white text-xs placeholder:text-[#60756C] focus:outline-none focus:border-[#19D98A]/50"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[#0B110E] border border-white/[0.08] text-xs text-[#9AAFA5] focus:outline-none focus:border-[#19D98A]/50 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0B110E] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full h-10 px-3 rounded-xl bg-[#0B110E] border border-white/[0.08] text-xs text-[#9AAFA5] focus:outline-none focus:border-[#19D98A]/50 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-3xl bg-[#0B110E] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#60756C] mx-auto flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div className="text-sm font-bold text-white">No transactions found</div>
            <p className="text-xs text-[#9AAFA5] max-w-sm mx-auto">
              Try adjusting your search criteria or log a new transaction.
            </p>
            <Button
              onClick={() => openSheet('expense')}
              className="mt-2 text-xs bg-[#19D98A] text-[#050806] font-bold"
            >
              + Log New Transaction
            </Button>
          </div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-[#19D98A]/15 text-[#19D98A]'
                      : tx.type === 'transfer'
                      ? 'bg-[#63F2B0]/15 text-[#63F2B0]'
                      : 'bg-[#E05252]/15 text-[#E05252]'
                  }`}
                >
                  {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{tx.description}</span>
                    {tx.receipt_url && (
                      <button
                        onClick={() => setSelectedReceipt(tx.receipt_url)}
                        className="text-[10px] font-bold text-[#19D98A] px-1.5 py-0.5 rounded bg-[#19D98A]/10 hover:bg-[#19D98A]/20 transition-colors flex items-center gap-1 shrink-0"
                        title="View receipt"
                      >
                        <ImageIcon size={10} /> Receipt
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-[#60756C] mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{tx.category?.name || 'General'}</span>
                    <span>•</span>
                    <span>{tx.transaction_date}</span>
                    {tx.family_member && (
                      <>
                        <span>•</span>
                        <span className="text-[#9AAFA5]">{tx.family_member.name}</span>
                      </>
                    )}
                    {tx.payment_method && (
                      <>
                        <span>•</span>
                        <span>{tx.payment_method}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-sm sm:text-base font-black ${
                      tx.type === 'income'
                        ? 'text-[#19D98A]'
                        : tx.type === 'transfer'
                        ? 'text-[#63F2B0]'
                        : 'text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '⇄' : '-'}
                    {formatMoney(tx.amount, currency)}
                  </div>
                  <div className="text-[10px] text-[#60756C] capitalize">{tx.type}</div>
                </div>

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-2 rounded-xl text-[#60756C] hover:text-[#E05252] hover:bg-white/[0.04] transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Action Sheet */}
      <QuickExpenseSheet
        isOpen={quickSheetOpen}
        onClose={() => setQuickSheetOpen(false)}
        initialType={quickSheetType}
      />

      {/* Receipt Image Modal */}
      <Dialog open={Boolean(selectedReceipt)} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
        <DialogContent className="bg-[#0B110E] border-white/[0.1] text-white max-w-md p-4">
          <DialogHeader>
            <DialogTitle>Receipt Attachment</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {selectedReceipt && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedReceipt}
                alt="Transaction receipt"
                className="w-full max-h-96 object-contain rounded-xl border border-white/[0.06]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
