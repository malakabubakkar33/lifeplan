import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, addMonths, subMonths } from 'date-fns'
import { MonthYear } from '@/types/database'

// ─── Current month/year ───────────────────────────────────────────
export function getCurrentMonthYear(): MonthYear {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  return { month, year, label: format(now, 'MMMM yyyy') }
}

// ─── Get month label ────────────────────────────────────────────
export function getMonthLabel(month: number, year: number): string {
  const date = new Date(year, month - 1, 1)
  return format(date, 'MMMM yyyy')
}

// ─── Get previous months list ────────────────────────────────────
export function getPreviousMonths(count: number = 12): MonthYear[] {
  const months: MonthYear[] = []
  let date = new Date()
  for (let i = 0; i < count; i++) {
    date = subMonths(date, 1)
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMMM yyyy'),
    })
  }
  return months
}

// ─── Format date for display ─────────────────────────────────────
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr)
  } catch {
    return dateString
  }
}

// ─── Format relative date ─────────────────────────────────────────
export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString)
  const now = new Date()
  const diff = differenceInDays(now, date)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`
  return format(date, 'MMM d')
}

// ─── Bill due status ───────────────────────────────────────────────
export function getBillDueStatus(dueDay: number): 'overdue' | 'due_today' | 'due_soon' | 'upcoming' {
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Bill due date this month
  const dueDate = new Date(currentYear, currentMonth, dueDay)

  const diff = differenceInDays(dueDate, today)

  if (diff < 0) return 'overdue'
  if (diff === 0) return 'due_today'
  if (diff <= 5) return 'due_soon'
  return 'upcoming'
}

// ─── Days until due ────────────────────────────────────────────────
export function daysUntilDue(dueDay: number): number {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  if (dueDay >= currentDay) {
    return dueDay - currentDay
  } else {
    // Already passed this month — next month
    return daysInMonth - currentDay + dueDay
  }
}

// ─── Check if date is in current month ────────────────────────────
export function isCurrentMonth(dateString: string): boolean {
  const date = parseISO(dateString)
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  return isWithinInterval(date, { start, end })
}

// ─── Get greeting based on time ───────────────────────────────────
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

// ─── Format month for DB queries ──────────────────────────────────
export function toDateRangeFilter(month: number, year: number) {
  const start = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
  const end = format(new Date(year, month, 0), 'yyyy-MM-dd')
  return { start, end }
}
