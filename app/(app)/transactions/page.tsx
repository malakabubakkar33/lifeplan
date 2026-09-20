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
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function TransactionsPage() {
  const { transactions, categories, familyMembers, currency, deleteTransaction } = useFinancialData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [familyFilter, setFamilyFilter] = useState<string>('all')

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
  })

  // Summary tallies
  const totalIn = filtered.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalOut = filtered.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const totalTrans = filtered.filter((t) => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Transactions Log
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Search, filter, and audit every income, expense, and transfer item.
          </p>
        </div>

        <Link
          href="/transactions/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-sm hover:bg-[#3EE8A2] transition-all shadow-[0_4px_16px_rgba(25,217,138,0.25)] self-start sm:self-auto"
        >
          <PlusCircle size={17} />
          <span>New Transaction</span>
        </Link>
      </div>

      {/* Tally Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#60756C] font-semibold">Total Inflow</div>
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
            <div className="text-xs text-[#60756C] font-semibold">Total Outflow</div>
            <div className="text-lg font-black text-white mt-0.5">
              -{formatMoney(totalOut, currency)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] text-white flex items-center justify-center">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#60756C] font-semibold">Savings Transfers</div>
            <div className="text-lg font-black text-[#63F2B0] mt-0.5">
              {formatMoney(totalTrans, currency)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#63F2B0]/10 text-[#63F2B0] flex items-center justify-center">
            <PiggyBank size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#0B110E] p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60756C]" />
            <Input
              placeholder="Search by description, merchant, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-[#101A15] text-[#9AAFA5] border border-white/[0.08] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#19D98A]"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
              <option value="transfer">Transfers Only</option>
            </select>

            {/* Category selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#101A15] text-[#9AAFA5] border border-white/[0.08] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#19D98A]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Family member selector */}
            <select
              value={familyFilter}
              onChange={(e) => setFamilyFilter(e.target.value)}
              className="bg-[#101A15] text-[#9AAFA5] border border-white/[0.08] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#19D98A]"
            >
              <option value="all">All Members</option>
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B110E] border border-white/[0.06]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#60756C] flex items-center justify-center mx-auto mb-3">
              <Search size={24} />
            </div>
            <h3 className="text-base font-bold text-white">No transactions found</h3>
            <p className="text-xs text-[#9AAFA5] mt-1">
              Try adjusting your search or filters to see more results.
            </p>
          </div>
        ) : (
          filtered.map((tx) => {
            const isIncome = tx.type === 'income'
            const isTransfer = tx.type === 'transfer'
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-[#19D98A]/15 text-[#19D98A]'
                        : isTransfer
                        ? 'bg-[#63F2B0]/15 text-[#63F2B0]'
                        : 'bg-white/[0.06] text-[#9AAFA5]'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft size={20} /> : isTransfer ? <PiggyBank size={20} /> : <ArrowUpRight size={20} />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{tx.description}</div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9AAFA5] mt-0.5">
                      <span className="flex items-center gap-1 text-[#60756C]">
                        <Calendar size={12} /> {tx.transaction_date}
                      </span>
                      {tx.category && (
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-[#A8B8B0]">
                          {tx.category.name}
                        </span>
                      )}
                      {tx.family_member && (
                        <span className="px-2 py-0.5 rounded-md bg-[#19D98A]/10 text-[10px] text-[#19D98A] font-medium flex items-center gap-1">
                          <User size={10} /> {tx.family_member.name}
                        </span>
                      )}
                      {tx.payment_method && (
                        <span className="text-[11px] text-[#60756C] flex items-center gap-1">
                          <CreditCard size={11} /> {tx.payment_method}
                        </span>
                      )}
                    </div>
                    {tx.notes && (
                      <p className="text-[11px] text-[#60756C] mt-1 italic truncate max-w-md">
                        "{tx.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pl-3">
                  <div className="text-right">
                    <div
                      className={`text-base font-black ${
                        isIncome ? 'text-[#19D98A]' : isTransfer ? 'text-[#63F2B0]' : 'text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatMoney(tx.amount, currency)}
                    </div>
                    <Badge variant={isIncome ? 'success' : isTransfer ? 'default' : 'secondary'} className="text-[9px] uppercase mt-0.5">
                      {tx.type}
                    </Badge>
                  </div>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-[#60756C] hover:text-[#E05252] hover:bg-[#E05252]/10 rounded-lg transition-all"
                    title="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
