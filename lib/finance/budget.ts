import {
  FinancialProfile,
  Bill,
  MonthlyPlanInput,
  MonthlyPlanOutput,
  BudgetCategory,
  Budget,
  BudgetStatus,
  Transaction,
} from '@/types/database'

// ─── Calculate monthly plan ────────────────────────────────────────
export function generateMonthlyPlan(input: MonthlyPlanInput): MonthlyPlanOutput {
  const {
    salary,
    rent,
    utilities,
    groceries,
    transportation,
    education,
    healthcare,
    debt,
    insurance,
    personal_budget,
    savings_target,
    emergency_target,
    familyBudgets,
    existingBills,
  } = input

  // Sum fixed expenses
  const fixedExpenses = {
    Housing: rent,
    Utilities: utilities,
    Transport: transportation,
    Debt: debt,
    Insurance: insurance,
  }

  // Sum variable expenses
  const variableExpenses = {
    Groceries: groceries,
    Education: education,
    Healthcare: healthcare,
    Personal: personal_budget,
    ...Object.fromEntries(familyBudgets.map((f) => [f.name, f.amount])),
  }

  // Bill amounts (recurring)
  const billTotal = existingBills
    .filter((b) => b.recurring && b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0)

  const totalFixed = Object.values(fixedExpenses).reduce((a, b) => a + b, 0) + billTotal
  const totalVariable = Object.values(variableExpenses).reduce((a, b) => a + b, 0)
  const totalSavings = savings_target
  const emergencyFund = emergency_target
  const totalPlanned = totalFixed + totalVariable + totalSavings + emergencyFund
  const remaining = salary - totalPlanned

  // Build categories
  const categories: BudgetCategory[] = [
    ...[
      { name: 'Housing', icon: 'home', color: '#19D98A', planned: rent },
      { name: 'Utilities', icon: 'zap', color: '#63F2B0', planned: utilities },
      { name: 'Groceries', icon: 'shopping-cart', color: '#0B6B45', planned: groceries },
      { name: 'Transport', icon: 'car', color: '#063B28', planned: transportation },
      { name: 'Education', icon: 'book', color: '#19D98A', planned: education },
      { name: 'Healthcare', icon: 'heart', color: '#63F2B0', planned: healthcare },
      { name: 'Debt', icon: 'credit-card', color: '#9AAFA5', planned: debt },
      { name: 'Insurance', icon: 'shield', color: '#60756C', planned: insurance },
      { name: 'Personal', icon: 'user', color: '#19D98A', planned: personal_budget },
      { name: 'Savings', icon: 'piggy-bank', color: '#63F2B0', planned: savings_target },
      { name: 'Emergency', icon: 'alert-circle', color: '#0B6B45', planned: emergency_target },
    ].map((c) => ({
      ...c,
      actual: 0,
      remaining: c.planned,
      percentage: c.planned > 0 ? Math.round((c.planned / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy' as BudgetStatus,
    })),
    ...familyBudgets.map((f) => ({
      name: f.name,
      icon: 'users',
      color: '#19D98A',
      planned: f.amount,
      actual: 0,
      remaining: f.amount,
      percentage: f.amount > 0 ? Math.round((f.amount / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy' as BudgetStatus,
    })),
  ].filter((c) => c.planned > 0)

  // Warnings
  const warnings: string[] = []
  if (remaining < 0) {
    warnings.push(`Your planned expenses exceed your salary by Rs. ${Math.abs(remaining).toLocaleString()}`)
  }
  if (savings_target < salary * 0.1) {
    warnings.push('Savings target is below 10% of salary — consider increasing it')
  }
  if (emergency_target === 0) {
    warnings.push('No emergency fund allocated — this is a financial risk')
  }

  // Suggestions
  const suggestions: string[] = []
  if (remaining > 0) {
    suggestions.push(`You have Rs. ${remaining.toLocaleString()} unallocated — consider adding to savings or emergency fund`)
  }
  if (savings_target > 0 && savings_target >= salary * 0.2) {
    suggestions.push('Great savings target! You\'re on track for financial stability')
  }

  return {
    salary,
    totalFixed,
    totalVariable,
    totalSavings,
    emergencyFund,
    remaining,
    categories,
    warnings,
    suggestions,
  }
}

// ─── Budget status ────────────────────────────────────────────────
export function getBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return 'over_budget'
  if (percentage >= 80) return 'warning'
  return 'healthy'
}

// ─── Calculate budget from transactions ───────────────────────────
export function calculateBudgetActuals(
  budgets: Budget[],
  transactions: Transaction[]
): Budget[] {
  return budgets.map((budget) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category_id === budget.category_id && t.type === 'expense'
    )
    const actual = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
    const remaining = Math.max(budget.planned_amount - actual, 0)
    const percentageUsed = budget.planned_amount > 0
      ? Math.round((actual / budget.planned_amount) * 100)
      : 0
    return {
      ...budget,
      actual_amount: actual,
      remaining,
      percentage_used: percentageUsed,
      status: getBudgetStatus(percentageUsed),
    }
  })
}

// ─── Calculate monthly totals ─────────────────────────────────────
export function calculateMonthlyTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const net = income - expenses

  return { income, expenses, net }
}

// ─── Savings goal monthly contribution ───────────────────────────
export function calculateMonthlyRequired(
  target: number,
  current: number,
  deadline: string | null
): number {
  if (!deadline) return 0
  const months = Math.max(
    Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
    ),
    1
  )
  const remaining = Math.max(target - current, 0)
  return Math.ceil(remaining / months)
}

// ─── Generate financial insights ──────────────────────────────────
export function generateInsights(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
  budgets: Budget[],
  salary: number,
  currency: string
): { id: string; type: 'info' | 'warning' | 'success' | 'tip'; title: string; message: string; icon: string }[] {
  const insights = []

  const currentExpenses = currentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const previousExpenses = previousTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Spending vs last month
  if (previousExpenses > 0) {
    const change = ((currentExpenses - previousExpenses) / previousExpenses) * 100
    if (change > 20) {
      insights.push({
        id: 'spending-up',
        type: 'warning' as const,
        title: 'Higher spending this month',
        message: `You're spending ${Math.abs(change).toFixed(0)}% more than last month`,
        icon: 'trending-up',
      })
    } else if (change < -10) {
      insights.push({
        id: 'spending-down',
        type: 'success' as const,
        title: 'Great spending control!',
        message: `You're spending ${Math.abs(change).toFixed(0)}% less than last month`,
        icon: 'trending-down',
      })
    }
  }

  // Over-budget categories
  const overBudget = budgets.filter((b) => (b.status === 'over_budget'))
  if (overBudget.length > 0) {
    insights.push({
      id: 'over-budget',
      type: 'warning' as const,
      title: `${overBudget.length} category over budget`,
      message: `${overBudget.map((b) => b.category?.name ?? 'Category').join(', ')} exceeded planned amount`,
      icon: 'alert-triangle',
    })
  }

  // Savings rate
  const income = currentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || salary
  const savingsRate = income > 0 ? ((income - currentExpenses) / income) * 100 : 0

  if (savingsRate >= 20) {
    insights.push({
      id: 'savings-rate',
      type: 'success' as const,
      title: 'Excellent savings rate!',
      message: `You're saving ${savingsRate.toFixed(0)}% of your income — keep it up!`,
      icon: 'piggy-bank',
    })
  }

  return insights
}
