import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function truncate(str: string, length: number = 50) {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function generateId() {
  return crypto.randomUUID()
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function safeParseFloat(value: string | number): number {
  const n = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  return isNaN(n) ? 0 : n
}
