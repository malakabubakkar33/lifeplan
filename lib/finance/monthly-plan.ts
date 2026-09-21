/**
 * LifePlan Financial Engine — Smart Monthly Plan Generator
 */

export interface MonthlyPlanInput {
  salary: number
  rent: number
  utilities: number
  groceries: number
  transportation: number
  education: number
  healthcare: number
  debt: number
  insurance: number
  personal_budget: number
  savings_target: number
  emergency_target: number
  familyBudgets?: { name: string; amount: number }[]
  existingBills?: { name: string; amount: number; recurring: boolean; status?: string }[]
}

export type BudgetStatus = 'healthy' | 'warning' | 'over_budget'

export interface PlannedCategory {
  id: string
  name: string
  icon: string
  color: string
  planned: number
  actual: number
  remaining: number
  percentageOfIncome: number
  percentageUsed: number
  status: BudgetStatus
  type: 'needs' | 'wants' | 'savings'
}

export interface MonthlyPlanOutput {
  salary: number
  totalFixed: number
  totalVariable: number
  totalSavings: number
  emergencyFund: number
  totalPlanned: number
  remainingAmount: number
  needsTotal: number
  wantsTotal: number
  savingsTotal: number
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  categories: PlannedCategory[]
  warnings: string[]
  suggestions: string[]
  isOverBudget: boolean
}

/**
 * Pure generator function for a balanced monthly financial plan.
 */
export function generateMonthlyPlan(input: MonthlyPlanInput): MonthlyPlanOutput {
  const {
    salary = 0,
    rent = 0,
    utilities = 0,
    groceries = 0,
    transportation = 0,
    education = 0,
    healthcare = 0,
    debt = 0,
    insurance = 0,
    personal_budget = 0,
    savings_target = 0,
    emergency_target = 0,
    familyBudgets = [],
    existingBills = [],
  } = input

  // Calculate bill obligations that are not already captured in rent/utilities
  const activeBills = existingBills.filter(
    (b) => b.recurring && b.status !== 'cancelled'
  )
  const totalBillsAmount = activeBills.reduce((sum, b) => sum + b.amount, 0)

  // Needs (50% guideline): Essential living commitments
  const fixedNeeds = {
    Housing: rent,
    Utilities: utilities,
    Groceries: groceries,
    Transport: transportation,
    Debt: debt,
    Healthcare: healthcare,
    Insurance: insurance,
  }

  // Wants (30% guideline): Discretionary, personal, family leisure
  const familyTotal = familyBudgets.reduce((sum, f) => sum + f.amount, 0)
  const variableWants = {
    Personal: personal_budget,
    Education: education,
    Family: familyTotal,
  }

  // Savings (20% guideline): Reserves and wealth creation
  const savingsReserves = {
    Savings: savings_target,
    Emergency: emergency_target,
  }

  const needsTotal = Object.values(fixedNeeds).reduce((a, b) => a + b, 0)
  const wantsTotal = Object.values(variableWants).reduce((a, b) => a + b, 0)
  const savingsTotal = Object.values(savingsReserves).reduce((a, b) => a + b, 0)

  const totalFixed = rent + utilities + debt + insurance
  const totalVariable = groceries + transportation + healthcare + education + personal_budget + familyTotal
  const totalSavings = savings_target
  const emergencyFund = emergency_target

  const totalPlanned = needsTotal + wantsTotal + savingsTotal
  const remainingAmount = salary - totalPlanned

  const needsPercentage = salary > 0 ? Math.round((needsTotal / salary) * 100) : 0
  const wantsPercentage = salary > 0 ? Math.round((wantsTotal / salary) * 100) : 0
  const savingsPercentage = salary > 0 ? Math.round((savingsTotal / salary) * 100) : 0

  // Build structured categories with initial 0 actual spending
  const defaultCategoryList: PlannedCategory[] = [
    {
      id: 'housing',
      name: 'Housing & Rent',
      icon: 'Home',
      color: '#19D98A',
      planned: rent,
      actual: 0,
      remaining: rent,
      percentageOfIncome: salary > 0 ? Math.round((rent / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'utilities',
      name: 'Utilities & Bills',
      icon: 'Zap',
      color: '#63F2B0',
      planned: utilities,
      actual: 0,
      remaining: utilities,
      percentageOfIncome: salary > 0 ? Math.round((utilities / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'groceries',
      name: 'Groceries & Household',
      icon: 'ShoppingCart',
      color: '#0B6B45',
      planned: groceries,
      actual: 0,
      remaining: groceries,
      percentageOfIncome: salary > 0 ? Math.round((groceries / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'transport',
      name: 'Transport & Fuel',
      icon: 'Car',
      color: '#063B28',
      planned: transportation,
      actual: 0,
      remaining: transportation,
      percentageOfIncome: salary > 0 ? Math.round((transportation / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'education',
      name: 'Education & Children',
      icon: 'GraduationCap',
      color: '#19D98A',
      planned: education,
      actual: 0,
      remaining: education,
      percentageOfIncome: salary > 0 ? Math.round((education / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'wants',
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      icon: 'HeartPulse',
      color: '#34D399',
      planned: healthcare,
      actual: 0,
      remaining: healthcare,
      percentageOfIncome: salary > 0 ? Math.round((healthcare / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'debt',
      name: 'Debt & Loan Repayments',
      icon: 'CreditCard',
      color: '#9AAFA5',
      planned: debt,
      actual: 0,
      remaining: debt,
      percentageOfIncome: salary > 0 ? Math.round((debt / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'needs',
    },
    {
      id: 'personal',
      name: 'Personal & Lifestyle',
      icon: 'Sparkles',
      color: '#A8F7D4',
      planned: personal_budget,
      actual: 0,
      remaining: personal_budget,
      percentageOfIncome: salary > 0 ? Math.round((personal_budget / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'wants',
    },
    {
      id: 'savings',
      name: 'Savings & Investments',
      icon: 'TrendingUp',
      color: '#19D98A',
      planned: savings_target,
      actual: 0,
      remaining: savings_target,
      percentageOfIncome: salary > 0 ? Math.round((savings_target / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'savings',
    },
    {
      id: 'emergency',
      name: 'Emergency Fund Runway',
      icon: 'ShieldCheck',
      color: '#63F2B0',
      planned: emergency_target,
      actual: 0,
      remaining: emergency_target,
      percentageOfIncome: salary > 0 ? Math.round((emergency_target / salary) * 100) : 0,
      percentageUsed: 0,
      status: 'healthy',
      type: 'savings',
    },
  ]

  const categories: PlannedCategory[] = defaultCategoryList.filter((c) => c.planned > 0)

  // Append any custom family members
  familyBudgets.forEach((fam, idx) => {
    if (fam.amount > 0) {
      categories.push({
        id: `fam_${idx}`,
        name: `${fam.name}'s Allowance`,
        icon: 'Users',
        color: '#10B981',
        planned: fam.amount,
        actual: 0,
        remaining: fam.amount,
        percentageOfIncome: salary > 0 ? Math.round((fam.amount / salary) * 100) : 0,
        percentageUsed: 0,
        status: 'healthy',
        type: 'wants',
      })
    }
  })

  // Warnings and constructive suggestions
  const warnings: string[] = []
  const suggestions: string[] = []

  if (remainingAmount < 0) {
    warnings.push(`Planned budget exceeds salary by ${Math.abs(remainingAmount).toLocaleString()}`)
  }
  if (needsPercentage > 60) {
    warnings.push(`Essential needs (${needsPercentage}%) exceed the suggested 50% threshold. Consider refinancing debt or reviewing recurring bills.`)
  }
  if (savingsPercentage < 15 && salary > 0) {
    suggestions.push(`Your savings rate is ${savingsPercentage}%. Strive for at least 20% to build wealth and compound reserves.`)
  } else if (savingsPercentage >= 20) {
    suggestions.push(`Outstanding savings rate of ${savingsPercentage}%! You are meeting the golden benchmark for financial independence.`)
  }

  return {
    salary,
    totalFixed,
    totalVariable,
    totalSavings,
    emergencyFund,
    totalPlanned,
    remainingAmount,
    needsTotal,
    wantsTotal,
    savingsTotal,
    needsPercentage,
    wantsPercentage,
    savingsPercentage,
    categories,
    warnings,
    suggestions,
    isOverBudget: remainingAmount < 0,
  }
}
