'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Baby,
  User,
  PlusCircle,
  Calendar,
  CreditCard,
  Trash2,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export default function FamilyMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { familyMembers, transactions, currency, deleteTransaction } = useFinancialData()

  const member = familyMembers.find((m) => m.id === resolvedParams.id)

  if (!member) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-white">Family member not found</h2>
        <Link href="/family" className="text-sm text-[#19D98A] mt-2 inline-block">
          Return to Family Overview
        </Link>
      </div>
    )
  }

  const memberTxs = transactions.filter((t) => t.family_member_id === member.id)
  const totalSpent = memberTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const pct = member.monthly_budget > 0 ? Math.min(100, Math.round((totalSpent / member.monthly_budget) * 100)) : 0
  const remaining = Math.max(0, member.monthly_budget - totalSpent)

  const isChild = member.relationship.toLowerCase().includes('child')

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/family"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9AAFA5] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Family
        </Link>

        <Link
          href={`/transactions/new`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#19D98A] text-[#050806] text-xs font-bold hover:bg-[#3EE8A2] transition-colors"
        >
          <PlusCircle size={15} />
          Add Expense for {member.name.split(' ')[0]}
        </Link>
      </div>

      {/* Member Hero Card */}
      <Card className="bg-[#0B110E] border-white/[0.08]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-base ${
                  isChild ? 'bg-[#19D98A]/15 text-[#19D98A]' : 'bg-white/[0.08] text-white'
                }`}
              >
                {isChild ? <Baby size={28} /> : <User size={28} />}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{member.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {member.relationship}
                  </Badge>
                  {member.notes && (
                    <span className="text-xs text-[#9AAFA5] truncate max-w-md">
                      • {member.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#60756C]">Monthly Allocated Budget</div>
              <div className="text-2xl font-black text-white mt-0.5">
                {formatMoney(member.monthly_budget, currency)}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.04] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#9AAFA5]">
                Spent: <span className="text-white font-bold">{formatMoney(totalSpent, currency)}</span>
              </span>
              <span className={pct > 90 ? 'text-[#E05252]' : 'text-[#19D98A]'}>
                {pct}% utilized ({formatMoney(remaining, currency)} remaining)
              </span>
            </div>
            <Progress value={pct} />
          </div>
        </CardContent>
      </Card>

      {/* Member Transactions */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="pb-3 border-b border-white/[0.04]">
          <CardTitle className="text-base font-bold">Dedicated Expenses Ledger</CardTitle>
          <p className="text-xs text-[#9AAFA5]">
            All transactions and receipts attributed directly to {member.name}.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-2.5">
          {memberTxs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#60756C]">
              No expenses attributed to {member.name} yet this month.
            </div>
          ) : (
            memberTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group"
              >
                <div>
                  <div className="text-sm font-bold text-white">{tx.description}</div>
                  <div className="text-xs text-[#9AAFA5] flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[#60756C]">
                      <Calendar size={12} /> {tx.transaction_date}
                    </span>
                    {tx.category && (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-[#A8B8B0]">
                        {tx.category.name}
                      </span>
                    )}
                    {tx.payment_method && (
                      <span className="text-[11px] text-[#60756C] flex items-center gap-1">
                        <CreditCard size={11} /> {tx.payment_method}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      -{formatMoney(tx.amount, currency)}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#60756C] hover:text-[#E05252] rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
