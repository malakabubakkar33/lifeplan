import { Currency } from '@/types/database'

// ─── Supported currencies ──────────────────────────────────────
export const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', locale: 'ur-PK' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
]

// ─── Get currency config ────────────────────────────────────────
export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

// ─── Format money ────────────────────────────────────────────────
export function formatMoney(
  amount: number,
  currencyCode: string = 'PKR',
  options: { compact?: boolean; showSign?: boolean } = {}
): string {
  const currency = getCurrency(currencyCode)
  const { compact, showSign } = options

  if (isNaN(amount)) return `${currency.symbol} 0`

  let formatted: string

  if (compact && Math.abs(amount) >= 100000) {
    // Pakistani lakh/crore format
    if (currencyCode === 'PKR') {
      if (Math.abs(amount) >= 10000000) {
        formatted = `${currency.symbol} ${(amount / 10000000).toFixed(2)}Cr`
      } else if (Math.abs(amount) >= 100000) {
        formatted = `${currency.symbol} ${(amount / 100000).toFixed(2)}L`
      } else {
        formatted = `${currency.symbol} ${amount.toLocaleString('en-PK')}`
      }
    } else {
      const num = Math.abs(amount)
      if (num >= 1000000000) {
        formatted = `${currency.symbol} ${(amount / 1000000000).toFixed(1)}B`
      } else if (num >= 1000000) {
        formatted = `${currency.symbol} ${(amount / 1000000).toFixed(1)}M`
      } else {
        formatted = `${currency.symbol} ${(amount / 1000).toFixed(1)}K`
      }
    }
  } else {
    formatted = `${currency.symbol} ${Math.abs(amount).toLocaleString(currency.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  if (showSign && amount > 0) return `+${formatted}`
  if (amount < 0) return `-${formatted}`
  return formatted
}

// ─── Parse money string to number ────────────────────────────────
export function parseMoney(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

// ─── Calculate percentage ────────────────────────────────────────
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((value / total) * 100), 100)
}

// ─── Format percentage ────────────────────────────────────────────
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}
