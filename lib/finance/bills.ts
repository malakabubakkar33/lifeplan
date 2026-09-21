/**
 * LifePlan Financial Engine — Bills Processing & Urgency States
 */

import { Bill } from '@/types/database'

export type BillUrgency = 'paid' | 'overdue' | 'due_today' | 'due_soon' | 'upcoming'

export interface ProcessedBill extends Bill {
  urgency: BillUrgency
  urgencyLabel: string
  daysDifference: number
}

/**
 * Categorize bill urgency based on the day of the month.
 */
export function getBillUrgency(bill: Bill, currentDate: Date = new Date()): {
  urgency: BillUrgency
  urgencyLabel: string
  daysDifference: number
} {
  if (bill.status === 'paid') {
    return { urgency: 'paid', urgencyLabel: 'Paid & Settled', daysDifference: 0 }
  }

  const today = currentDate.getDate()
  const diff = bill.due_date - today

  if (diff < 0) {
    return { urgency: 'overdue', urgencyLabel: `Overdue by ${Math.abs(diff)}d`, daysDifference: diff }
  }
  if (diff === 0) {
    return { urgency: 'due_today', urgencyLabel: 'Due Today', daysDifference: 0 }
  }
  if (diff <= 5) {
    return { urgency: 'due_soon', urgencyLabel: `Due in ${diff}d`, daysDifference: diff }
  }

  return { urgency: 'upcoming', urgencyLabel: `Due on ${bill.due_date}th`, daysDifference: diff }
}

/**
 * Processes and sorts a list of bills by urgency priority.
 */
export function processBills(bills: Bill[], currentDate: Date = new Date()): ProcessedBill[] {
  const urgencyWeight: Record<BillUrgency, number> = {
    due_today: 1,
    overdue: 2,
    due_soon: 3,
    upcoming: 4,
    paid: 5,
  }

  return bills
    .map((b) => {
      const status = getBillUrgency(b, currentDate)
      return {
        ...b,
        urgency: status.urgency,
        urgencyLabel: status.urgencyLabel,
        daysDifference: status.daysDifference,
      }
    })
    .sort((a, b) => {
      const weightDiff = urgencyWeight[a.urgency] - urgencyWeight[b.urgency]
      if (weightDiff !== 0) return weightDiff
      return a.due_date - b.due_date
    })
}
