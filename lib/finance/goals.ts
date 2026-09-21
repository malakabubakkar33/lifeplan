/**
 * LifePlan Financial Engine — Savings & Goal Calculations
 */

import { SavingsGoal } from '@/types/database'

export interface ProcessedGoal extends SavingsGoal {
  percentageProgress: number
  remainingAmount: number
  monthlyContributionRequired: number
  monthsRemaining: number | null
}

/**
 * Calculates monthly required savings to hit a deadline.
 */
export function calculateRequiredMonthlyContribution(
  targetAmount: number,
  currentAmount: number,
  deadline: string | null,
  currentDate: Date = new Date()
): {
  monthlyContribution: number
  monthsRemaining: number | null
  remainingAmount: number
} {
  const remaining = Math.max(0, targetAmount - currentAmount)

  if (!deadline) {
    return {
      monthlyContribution: Math.round((remaining / 12) * 100) / 100, // default 1 year horizon
      monthsRemaining: null,
      remainingAmount: remaining,
    }
  }

  const targetDate = new Date(deadline)
  const diffYears = targetDate.getFullYear() - currentDate.getFullYear()
  const diffMonths = targetDate.getMonth() - currentDate.getMonth()
  const totalMonths = diffYears * 12 + diffMonths

  const safeMonths = Math.max(1, totalMonths)
  const monthlyContribution = Math.round((remaining / safeMonths) * 100) / 100

  return {
    monthlyContribution,
    monthsRemaining: totalMonths > 0 ? totalMonths : 0,
    remainingAmount: remaining,
  }
}

/**
 * Calculates emergency fund runway in months of fixed living expenses.
 */
export function calculateEmergencyFundRunway(
  emergencyFundAmount: number,
  monthlyFixedExpenses: number
): {
  runwayMonths: number
  benchmarkMonths: number
  healthStatus: 'critical' | 'moderate' | 'healthy' | 'exceptional'
} {
  if (monthlyFixedExpenses <= 0) {
    return {
      runwayMonths: 6,
      benchmarkMonths: 6,
      healthStatus: 'healthy',
    }
  }

  const runwayMonths = Math.round((emergencyFundAmount / monthlyFixedExpenses) * 10) / 10
  let healthStatus: 'critical' | 'moderate' | 'healthy' | 'exceptional' = 'moderate'

  if (runwayMonths < 2) healthStatus = 'critical'
  else if (runwayMonths < 4) healthStatus = 'moderate'
  else if (runwayMonths <= 6) healthStatus = 'healthy'
  else healthStatus = 'exceptional'

  return {
    runwayMonths,
    benchmarkMonths: 6,
    healthStatus,
  }
}

/**
 * Process list of savings goals with live math.
 */
export function processGoals(goals: SavingsGoal[], currentDate: Date = new Date()): ProcessedGoal[] {
  return goals.map((g) => {
    const pct = g.target_amount > 0
      ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100))
      : 0
    const calc = calculateRequiredMonthlyContribution(g.target_amount, g.current_amount, g.deadline, currentDate)

    return {
      ...g,
      percentageProgress: pct,
      remainingAmount: calc.remainingAmount,
      monthlyContributionRequired: calc.monthlyContribution,
      monthsRemaining: calc.monthsRemaining,
    }
  })
}
