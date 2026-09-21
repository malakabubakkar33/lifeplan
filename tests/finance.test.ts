/**
 * LifePlan Financial Engine — Test Suite
 */

import { calculateSalaryMetrics, calculateDaysToPayday } from '../lib/finance/salary'
import { generateMonthlyPlan } from '../lib/finance/monthly-plan'
import { calculateTransactionTotals, filterTransactionsByMonth } from '../lib/finance/transactions'
import { getBillUrgency, processBills } from '../lib/finance/bills'
import { calculateRequiredMonthlyContribution, calculateEmergencyFundRunway } from '../lib/finance/goals'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`)
  }
  console.log(`✓ ${message}`)
}

console.log('\n--- Running LifePlan Financial Engine Tests ---\n')

// 1. Salary & Runway Tests
const refDate = new Date('2026-09-15T12:00:00Z')
const daysToPayday = calculateDaysToPayday(28, refDate)
assert(daysToPayday === 13, `Days to payday 28 from 15th should be 13, got ${daysToPayday}`)

const salaryMetrics = calculateSalaryMetrics(150000, 50000, 20000, 28, refDate)
assert(salaryMetrics.remainingSalary === 80000, `Remaining salary should be 80000, got ${salaryMetrics.remainingSalary}`)
assert(salaryMetrics.percentSpent === 47, `Percent spent should be 47%, got ${salaryMetrics.percentSpent}%`)
assert(salaryMetrics.safeToSpendDaily > 0, `Safe to spend daily should be positive, got ${salaryMetrics.safeToSpendDaily}`)

// 2. Monthly Plan 50/30/20 Generator Tests
const plan = generateMonthlyPlan({
  salary: 150000,
  rent: 35000,
  utilities: 10000,
  groceries: 20000,
  transportation: 8000,
  education: 15000,
  healthcare: 5000,
  debt: 7000,
  insurance: 3000,
  personal_budget: 15000,
  savings_target: 20000,
  emergency_target: 10000,
})

assert(plan.totalPlanned === 148000, `Total planned should be 148000, got ${plan.totalPlanned}`)
assert(plan.remainingAmount === 2000, `Remaining amount should be 2000, got ${plan.remainingAmount}`)
assert(!plan.isOverBudget, 'Plan should not be over budget')
assert(plan.categories.length > 0, 'Plan should generate categorized allocations')

// 3. Transactions Totals Tests
const mockTxs: any[] = [
  { id: '1', type: 'income', amount: 150000, transaction_date: '2026-09-01' },
  { id: '2', type: 'expense', amount: 35000, transaction_date: '2026-09-02' },
  { id: '3', type: 'expense', amount: 20000, transaction_date: '2026-09-05' },
  { id: '4', type: 'transfer', amount: 15000, transaction_date: '2026-09-10' },
  { id: '5', type: 'expense', amount: 5000, transaction_date: '2026-08-15' },
]

const septTxs = filterTransactionsByMonth(mockTxs, 2026, 9)
assert(septTxs.length === 4, `September transactions should be 4, got ${septTxs.length}`)

const totals = calculateTransactionTotals(septTxs)
assert(totals.totalIncome === 150000, `Total income should be 150000, got ${totals.totalIncome}`)
assert(totals.totalExpenses === 55000, `Total expenses should be 55000, got ${totals.totalExpenses}`)
assert(totals.totalTransfers === 15000, `Total transfers should be 15000, got ${totals.totalTransfers}`)

// 4. Bills Urgency Tests
const billDueSoon: any = { id: 'b1', name: 'Electric', amount: 100, due_date: 18, status: 'pending' }
const billOverdue: any = { id: 'b2', name: 'Water', amount: 50, due_date: 10, status: 'pending' }
const billPaid: any = { id: 'b3', name: 'Internet', amount: 80, due_date: 5, status: 'paid' }

assert(getBillUrgency(billDueSoon, refDate).urgency === 'due_soon', 'Bill on 18th should be due_soon from 15th')
assert(getBillUrgency(billOverdue, refDate).urgency === 'overdue', 'Bill on 10th should be overdue from 15th')
assert(getBillUrgency(billPaid, refDate).urgency === 'paid', 'Paid bill should be marked paid')

// 5. Goals & Runway Tests
const goalCalc = calculateRequiredMonthlyContribution(12000, 6000, '2027-03-15', refDate)
assert(goalCalc.remainingAmount === 6000, `Remaining amount should be 6000, got ${goalCalc.remainingAmount}`)
assert(goalCalc.monthlyContribution > 0, `Monthly contribution should be positive, got ${goalCalc.monthlyContribution}`)

const runway = calculateEmergencyFundRunway(180000, 30000)
assert(runway.runwayMonths === 6, `Emergency runway should be 6 months, got ${runway.runwayMonths}`)
assert(runway.healthStatus === 'healthy', `Runway health status should be healthy, got ${runway.healthStatus}`)

console.log('\n✅ All LifePlan Financial Engine Tests Passed Successfully!\n')
