/**
 * LifePlan Financial Engine — Salary & Runway Calculations
 */

export interface SalaryRunwayMetrics {
  salary: number
  totalExpenses: number
  totalSaved: number
  remainingSalary: number
  percentSpent: number
  daysToPayday: number
  daysInMonth: number
  safeToSpendDaily: number
  cashFlowRatio: number
}

/**
 * Calculates days remaining until the next payday.
 * @param payday Day of the month (1-31)
 * @param currentDate Optional reference date (defaults to today)
 */
export function calculateDaysToPayday(payday: number, currentDate: Date = new Date()): number {
  const today = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const safePayday = Math.min(payday, daysInCurrentMonth)

  if (safePayday >= today) {
    return safePayday - today
  }

  // Payday is in the next month
  const daysLeftThisMonth = daysInCurrentMonth - today
  const nextMonthDays = new Date(currentYear, currentMonth + 2, 0).getDate()
  const safeNextPayday = Math.min(payday, nextMonthDays)
  return daysLeftThisMonth + safeNextPayday
}

/**
 * Calculates core salary runway and discretionary cash flow metrics.
 */
export function calculateSalaryMetrics(
  salary: number,
  totalExpenses: number,
  totalSaved: number,
  payday: number = 28,
  currentDate: Date = new Date()
): SalaryRunwayMetrics {
  const validSalary = Math.max(0, salary)
  const remainingSalary = Math.max(0, validSalary - totalExpenses - totalSaved)
  const percentSpent = validSalary > 0
    ? Math.min(100, Math.round(((totalExpenses + totalSaved) / validSalary) * 100))
    : 0

  const daysToPayday = calculateDaysToPayday(payday, currentDate)
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Discretionary daily limit based on days remaining until next payday
  const daysDivisor = Math.max(1, daysToPayday)
  const safeToSpendDaily = Math.round((remainingSalary / daysDivisor) * 100) / 100

  // Cash flow ratio (Inflows vs Outflows)
  const totalOutflows = totalExpenses + totalSaved
  const cashFlowRatio = totalOutflows > 0
    ? Math.round((validSalary / totalOutflows) * 100) / 100
    : validSalary > 0 ? 10 : 1

  return {
    salary: validSalary,
    totalExpenses,
    totalSaved,
    remainingSalary,
    percentSpent,
    daysToPayday,
    daysInMonth,
    safeToSpendDaily,
    cashFlowRatio,
  }
}
