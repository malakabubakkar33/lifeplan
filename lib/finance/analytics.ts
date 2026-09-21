/**
 * LifePlan Financial Engine — Analytics & Trends Aggregator
 */

import { Transaction, Category } from '@/types/database'

export interface MonthFlowDataPoint {
  month: string
  year: number
  income: number
  expenses: number
  savings: number
  surplus: number
}

export interface SavingsRateDataPoint {
  month: string
  rate: number
}

/**
 * Computes monthly flow data for charts over the last N months from actual transactions.
 */
export function computeMonthlyFlowTrend(
  transactions: Transaction[],
  monthCount: number = 6,
  referenceDate: Date = new Date()
): MonthFlowDataPoint[] {
  const result: MonthFlowDataPoint[] = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const label = `${monthNames[d.getMonth()]}`

    // Filter transactions in this month
    const monthlyTxs = transactions.filter((t) => {
      if (!t.transaction_date) return false
      const td = new Date(t.transaction_date)
      return td.getFullYear() === y && td.getMonth() + 1 === m
    })

    const income = monthlyTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

    const expenses = monthlyTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

    const savings = monthlyTxs
      .filter((t) => t.type === 'transfer')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

    const surplus = income - expenses - savings

    result.push({
      month: label,
      year: y,
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(savings),
      surplus: Math.round(surplus),
    })
  }

  return result
}

/**
 * Computes historical savings rate percentages over time.
 */
export function computeSavingsRateTrend(flowTrend: MonthFlowDataPoint[]): SavingsRateDataPoint[] {
  return flowTrend.map((point) => {
    const rate = point.income > 0
      ? Math.min(100, Math.max(0, Math.round((point.savings / point.income) * 100)))
      : 0
    return {
      month: point.month,
      rate,
    }
  })
}

/**
 * Computes category distribution for Pie/Donut charts from current period transactions.
 */
export function computeCategoryDistribution(
  transactions: Transaction[],
  categories: Category[]
): { name: string; value: number; color: string }[] {
  const expenseTxs = transactions.filter((t) => t.type === 'expense')
  const map = new Map<string, number>()

  for (const t of expenseTxs) {
    const catId = t.category_id || 'uncategorized'
    map.set(catId, (map.get(catId) || 0) + (Number(t.amount) || 0))
  }

  const items: { name: string; value: number; color: string }[] = []

  map.forEach((val, catId) => {
    const cat = categories.find((c) => c.id === catId)
    items.push({
      name: cat ? cat.name : 'Other',
      value: Math.round(val),
      color: cat ? cat.color : '#60756C',
    })
  })

  return items.sort((a, b) => b.value - a.value)
}
