/**
 * LifePlan Financial Engine — Transactions Processing & Aggregations
 */

import { Transaction, Category, FamilyMember } from '@/types/database'

export interface CategorySpendingSummary {
  categoryId: string
  categoryName: string
  color: string
  icon: string
  type: string
  totalSpent: number
  transactionCount: number
  percentageOfTotal: number
}

export interface FamilySpendingSummary {
  memberId: string
  memberName: string
  relationship: string
  totalSpent: number
  transactionCount: number
}

/**
 * Filter transactions by month and year.
 */
export function filterTransactionsByMonth(
  transactions: Transaction[],
  year: number,
  month: number // 1-12
): Transaction[] {
  return transactions.filter((t) => {
    if (!t.transaction_date) return false
    const d = new Date(t.transaction_date)
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })
}

/**
 * Calculates sum totals for income, expenses, and savings transfers.
 */
export function calculateTransactionTotals(transactions: Transaction[]): {
  totalIncome: number
  totalExpenses: number
  totalTransfers: number
  netSavings: number
} {
  let totalIncome = 0
  let totalExpenses = 0
  let totalTransfers = 0

  for (const t of transactions) {
    const amt = Number(t.amount) || 0
    if (t.type === 'income') {
      totalIncome += amt
    } else if (t.type === 'expense') {
      totalExpenses += amt
    } else if (t.type === 'transfer') {
      totalTransfers += amt
    }
  }

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalTransfers: Math.round(totalTransfers * 100) / 100,
    netSavings: Math.round((totalIncome - totalExpenses) * 100) / 100,
  }
}

/**
 * Aggregates actual expenses by category with percentages.
 */
export function aggregateSpendingByCategory(
  transactions: Transaction[],
  categories: Category[]
): CategorySpendingSummary[] {
  const expenseTxs = transactions.filter((t) => t.type === 'expense')
  const totalExpenseSum = expenseTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

  const map = new Map<string, { total: number; count: number }>()

  for (const tx of expenseTxs) {
    const catId = tx.category_id || 'uncategorized'
    const curr = map.get(catId) || { total: 0, count: 0 }
    curr.total += Number(tx.amount) || 0
    curr.count += 1
    map.set(catId, curr)
  }

  const summaries: CategorySpendingSummary[] = []

  map.forEach((val, catId) => {
    const category = categories.find((c) => c.id === catId)
    summaries.push({
      categoryId: catId,
      categoryName: category ? category.name : 'General & Uncategorized',
      color: category ? category.color : '#9AAFA5',
      icon: category ? category.icon : 'Tag',
      type: 'expense',
      totalSpent: Math.round(val.total * 100) / 100,
      transactionCount: val.count,
      percentageOfTotal: totalExpenseSum > 0 ? Math.round((val.total / totalExpenseSum) * 100) : 0,
    })
  })

  return summaries.sort((a, b) => b.totalSpent - a.totalSpent)
}

/**
 * Aggregates expenses by family member.
 */
export function aggregateSpendingByFamily(
  transactions: Transaction[],
  familyMembers: FamilyMember[]
): FamilySpendingSummary[] {
  const expenseTxs = transactions.filter((t) => t.type === 'expense' && t.family_member_id)

  const map = new Map<string, { total: number; count: number }>()

  for (const tx of expenseTxs) {
    const famId = tx.family_member_id!
    const curr = map.get(famId) || { total: 0, count: 0 }
    curr.total += Number(tx.amount) || 0
    curr.count += 1
    map.set(famId, curr)
  }

  const summaries: FamilySpendingSummary[] = []

  familyMembers.forEach((member) => {
    const stat = map.get(member.id) || { total: 0, count: 0 }
    summaries.push({
      memberId: member.id,
      memberName: member.name,
      relationship: member.relationship,
      totalSpent: Math.round(stat.total * 100) / 100,
      transactionCount: stat.count,
    })
  })

  return summaries.sort((a, b) => b.totalSpent - a.totalSpent)
}
