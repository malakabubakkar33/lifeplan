'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  UserProfile,
  FinancialProfile,
  FamilyMember,
  Category,
  Transaction,
  Bill,
  Budget,
  SavingsGoal,
  MonthlyPlan,
  Notification,
  FinancialInsight,
} from '@/types/database'

// ─── Default Sample Data ───────────────────────────────────────
const defaultUserProfile: UserProfile = {
  id: 'usr_default',
  clerk_user_id: 'user_active',
  full_name: 'Alex Morgan',
  email: 'alex.morgan@lifeplan.app',
  avatar_url: null,
  currency: 'USD',
  country: 'United States',
  timezone: 'America/New_York',
  monthly_salary: 7500,
  payday: 28,
  onboarding_completed: true,
  setup_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const defaultFinancialProfile: FinancialProfile = {
  id: 'fp_default',
  clerk_user_id: 'user_active',
  monthly_salary: 7500,
  salary_type: 'monthly',
  payday: 28,
  rent: 1800,
  utilities: 260,
  groceries: 700,
  transportation: 380,
  education: 450,
  healthcare: 200,
  debt: 350,
  insurance: 280,
  personal_budget: 450,
  savings_target: 1800,
  emergency_target: 600,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const defaultFamilyMembers: FamilyMember[] = [
  {
    id: 'fam_1',
    clerk_user_id: 'user_active',
    name: 'Sarah Morgan',
    relationship: 'Spouse',
    date_of_birth: '1992-06-15',
    avatar_url: null,
    monthly_budget: 850,
    notes: 'Household manager, wellness & personal care',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fam_2',
    clerk_user_id: 'user_active',
    name: 'Leo Morgan',
    relationship: 'Child',
    date_of_birth: '2018-04-12',
    avatar_url: null,
    monthly_budget: 400,
    notes: 'Grade 2 tuition, soccer academy, books',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fam_3',
    clerk_user_id: 'user_active',
    name: 'Maya Morgan',
    relationship: 'Child',
    date_of_birth: '2021-09-03',
    avatar_url: null,
    monthly_budget: 300,
    notes: 'Pre-school, art classes, pediatric visits',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const defaultCategories: Category[] = [
  { id: 'cat_1', clerk_user_id: 'user_active', name: 'Housing & Rent', icon: 'Home', color: '#19D98A', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_2', clerk_user_id: 'user_active', name: 'Groceries & Food', icon: 'ShoppingCart', color: '#3EE8A2', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_3', clerk_user_id: 'user_active', name: 'Utilities & Bills', icon: 'Zap', color: '#63F2B0', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_4', clerk_user_id: 'user_active', name: 'Transport & Fuel', icon: 'Car', color: '#0F8C5C', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_5', clerk_user_id: 'user_active', name: 'Children & School', icon: 'GraduationCap', color: '#10B981', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_6', clerk_user_id: 'user_active', name: 'Healthcare & Med', icon: 'HeartPulse', color: '#34D399', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_7', clerk_user_id: 'user_active', name: 'Debt & Loans', icon: 'CreditCard', color: '#9AAFA5', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_8', clerk_user_id: 'user_active', name: 'Personal & Leisure', icon: 'Sparkles', color: '#A8F7D4', type: 'expense', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_9', clerk_user_id: 'user_active', name: 'Primary Salary', icon: 'Briefcase', color: '#19D98A', type: 'income', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_10', clerk_user_id: 'user_active', name: 'Freelance & Bonus', icon: 'TrendingUp', color: '#3EE8A2', type: 'income', is_default: true, created_at: new Date().toISOString() },
  { id: 'cat_11', clerk_user_id: 'user_active', name: 'Emergency Savings', icon: 'ShieldCheck', color: '#19D98A', type: 'transfer', is_default: true, created_at: new Date().toISOString() },
]

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const dStr = (dayOffset: number) => {
  const d = new Date()
  d.setDate(d.getDate() - dayOffset)
  return d.toISOString().split('T')[0]
}

const defaultTransactions: Transaction[] = [
  {
    id: 'tx_1',
    clerk_user_id: 'user_active',
    category_id: 'cat_9',
    family_member_id: null,
    type: 'income',
    amount: 7500,
    description: 'Monthly Salary - Acme Technologies',
    transaction_date: dStr(1),
    payment_method: 'Direct Deposit',
    receipt_url: null,
    notes: 'Net salary after tax and 401(k) match',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[8],
  },
  {
    id: 'tx_2',
    clerk_user_id: 'user_active',
    category_id: 'cat_1',
    family_member_id: null,
    type: 'expense',
    amount: 1800,
    description: 'Monthly Apartment Lease',
    transaction_date: dStr(2),
    payment_method: 'ACH Transfer',
    receipt_url: null,
    notes: 'Includes reserved parking space',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[0],
  },
  {
    id: 'tx_3',
    clerk_user_id: 'user_active',
    category_id: 'cat_2',
    family_member_id: 'fam_1',
    type: 'expense',
    amount: 182.45,
    description: 'Whole Foods Market - Weekly Pantry',
    transaction_date: dStr(3),
    payment_method: 'Apple Pay',
    receipt_url: null,
    notes: 'Organic produce, dairy, bakery items',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[1],
    family_member: defaultFamilyMembers[0],
  },
  {
    id: 'tx_4',
    clerk_user_id: 'user_active',
    category_id: 'cat_5',
    family_member_id: 'fam_2',
    type: 'expense',
    amount: 350.00,
    description: "Leo's Grade 2 Tuition & Books",
    transaction_date: dStr(4),
    payment_method: 'Debit Card',
    receipt_url: null,
    notes: 'Term fee and reading materials',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[4],
    family_member: defaultFamilyMembers[1],
  },
  {
    id: 'tx_5',
    clerk_user_id: 'user_active',
    category_id: 'cat_4',
    family_member_id: null,
    type: 'expense',
    amount: 72.80,
    description: 'Chevron Fuel Station - Full Tank',
    transaction_date: dStr(5),
    payment_method: 'Credit Card',
    receipt_url: null,
    notes: 'Weekly commuter tank',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[3],
  },
  {
    id: 'tx_6',
    clerk_user_id: 'user_active',
    category_id: 'cat_10',
    family_member_id: null,
    type: 'income',
    amount: 950.00,
    description: 'Design Consulting - FinTech Client',
    transaction_date: dStr(6),
    payment_method: 'Wire Transfer',
    receipt_url: null,
    notes: 'Mobile design sprints and audit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[9],
  },
  {
    id: 'tx_7',
    clerk_user_id: 'user_active',
    category_id: 'cat_3',
    family_member_id: null,
    type: 'expense',
    amount: 145.20,
    description: 'Electric & Gas Utility Bill',
    transaction_date: dStr(7),
    payment_method: 'Autopay',
    receipt_url: null,
    notes: 'Summer power usage billing cycle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[2],
  },
  {
    id: 'tx_8',
    clerk_user_id: 'user_active',
    category_id: 'cat_5',
    family_member_id: 'fam_3',
    type: 'expense',
    amount: 120.00,
    description: "Maya's Pre-school Art & Ballet Class",
    transaction_date: dStr(8),
    payment_method: 'Credit Card',
    receipt_url: null,
    notes: 'Monthly weekend activity sessions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[4],
    family_member: defaultFamilyMembers[2],
  },
  {
    id: 'tx_9',
    clerk_user_id: 'user_active',
    category_id: 'cat_7',
    family_member_id: null,
    type: 'expense',
    amount: 350.00,
    description: 'Auto Loan Financing Installment',
    transaction_date: dStr(9),
    payment_method: 'Bank Transfer',
    receipt_url: null,
    notes: 'Monthly fixed loan repayment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[6],
  },
  {
    id: 'tx_10',
    clerk_user_id: 'user_active',
    category_id: 'cat_11',
    family_member_id: null,
    type: 'transfer',
    amount: 600.00,
    description: 'Emergency Reserve Monthly Deposit',
    transaction_date: dStr(10),
    payment_method: 'Auto-transfer',
    receipt_url: null,
    notes: 'High yield savings transfer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[10],
  },
  {
    id: 'tx_11',
    clerk_user_id: 'user_active',
    category_id: 'cat_2',
    family_member_id: null,
    type: 'expense',
    amount: 64.30,
    description: "Trader Joe's Snack Restock",
    transaction_date: dStr(11),
    payment_method: 'Apple Pay',
    receipt_url: null,
    notes: 'School lunch snacks and fruit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[1],
  },
  {
    id: 'tx_12',
    clerk_user_id: 'user_active',
    category_id: 'cat_8',
    family_member_id: null,
    type: 'expense',
    amount: 88.50,
    description: 'Family Italian Trattoria Dinner',
    transaction_date: dStr(12),
    payment_method: 'Credit Card',
    receipt_url: null,
    notes: 'Friday night family celebration',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[7],
  },
]

const defaultBills: Bill[] = [
  {
    id: 'bill_1',
    clerk_user_id: 'user_active',
    name: 'Apartment Rent',
    amount: 1800,
    due_date: 1,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_1',
    status: 'paid',
    paid_at: dStr(2),
    reminder_enabled: true,
    notes: 'Due on 1st of every month',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[0],
  },
  {
    id: 'bill_2',
    clerk_user_id: 'user_active',
    name: 'Electricity & Gas Grid',
    amount: 145,
    due_date: 22,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_3',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Utility company direct draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[2],
  },
  {
    id: 'bill_3',
    clerk_user_id: 'user_active',
    name: 'Gigabit Fiber Internet',
    amount: 85,
    due_date: 24,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_3',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Home office internet fiber plan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[2],
  },
  {
    id: 'bill_4',
    clerk_user_id: 'user_active',
    name: 'Comprehensive Health Cover',
    amount: 280,
    due_date: 26,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_6',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Family dental and health insurance policy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[5],
  },
  {
    id: 'bill_5',
    clerk_user_id: 'user_active',
    name: 'Auto Loan Repayment',
    amount: 350,
    due_date: 28,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_7',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Financing credit union automatic debit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[6],
  },
  {
    id: 'bill_6',
    clerk_user_id: 'user_active',
    name: 'Netflix & Media Cloud',
    amount: 34.99,
    due_date: 29,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_8',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Family 4K plan with Apple bundle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[7],
  },
]

const defaultSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal_1',
    clerk_user_id: 'user_active',
    name: 'Emergency Fund (6 Months)',
    target_amount: 25000,
    current_amount: 18400,
    deadline: `${currentYear}-12-31`,
    icon: 'ShieldCheck',
    color: '#19D98A',
    status: 'active',
    notes: '6 months of living expenses safely deposited in high-yield account',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'goal_2',
    clerk_user_id: 'user_active',
    name: 'Family Summer Trip to Alps',
    target_amount: 4500,
    current_amount: 3250,
    deadline: `${currentYear}-08-15`,
    icon: 'Plane',
    color: '#3EE8A2',
    status: 'active',
    notes: 'Flight tickets, chalets, and excursions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'goal_3',
    clerk_user_id: 'user_active',
    name: 'Kids University Reserve',
    target_amount: 50000,
    current_amount: 14800,
    deadline: `${currentYear + 8}-09-01`,
    icon: 'GraduationCap',
    color: '#63F2B0',
    status: 'active',
    notes: '529 education savings plan for Leo & Maya',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'goal_4',
    clerk_user_id: 'user_active',
    name: 'Electric SUV Downpayment',
    target_amount: 12000,
    current_amount: 8200,
    deadline: `${currentYear + 1}-03-31`,
    icon: 'Car',
    color: '#0F8C5C',
    status: 'active',
    notes: 'Zero-emission family vehicle upgrade',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const defaultNotifications: Notification[] = [
  {
    id: 'notif_1',
    clerk_user_id: 'user_active',
    title: 'Upcoming Bill Reminder',
    message: 'Electricity & Gas Grid ($145) is due in 2 days on the 22nd.',
    type: 'bill',
    read: false,
    action_url: '/bills',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notif_2',
    clerk_user_id: 'user_active',
    title: 'Emergency Fund Milestone 🎉',
    message: 'You have crossed 73% of your Emergency Fund goal ($18,400 / $25,000)!',
    type: 'goal',
    read: false,
    action_url: '/goals',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'notif_3',
    clerk_user_id: 'user_active',
    title: 'Payday Countdown',
    message: 'Monthly salary ($7,500) will be credited in 8 days on the 28th.',
    type: 'info',
    read: true,
    action_url: '/home',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]

const defaultInsights: FinancialInsight[] = [
  {
    id: 'ins_1',
    type: 'success',
    title: 'Healthy Savings Rate',
    message: 'You are currently saving 24% of your total income, exceeding the 20% benchmark.',
    icon: 'TrendingUp',
  },
  {
    id: 'ins_2',
    type: 'info',
    title: 'Safe-To-Spend Daily Budget',
    message: 'With fixed bills covered, your daily safe discretionary limit is $48.50.',
    icon: 'Wallet',
  },
  {
    id: 'ins_3',
    type: 'tip',
    title: 'Family Spending Optimization',
    message: 'Children school activities are well within the planned monthly budget of $700.',
    icon: 'Sparkles',
  },
]

// ─── Context Interface ────────────────────────────────────────
interface FinancialContextType {
  userProfile: UserProfile
  financialProfile: FinancialProfile
  familyMembers: FamilyMember[]
  categories: Category[]
  transactions: Transaction[]
  bills: Bill[]
  savingsGoals: SavingsGoal[]
  notifications: Notification[]
  insights: FinancialInsight[]
  currentMonthPlan: MonthlyPlan
  // Computed values
  totalIncome: number
  totalExpenses: number
  totalSaved: number
  safeToSpendDaily: number
  remainingSalary: number
  emergencyFundMonths: number
  unreadCount: number
  currency: string
  // Mutators
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  toggleBillPaid: (id: string) => void
  addBill: (bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>) => void
  updateBill: (id: string, bill: Partial<Bill>) => void
  deleteBill: (id: string) => void
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => void
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>) => void
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void
  contributeToGoal: (id: string, amount: number) => void
  deleteSavingsGoal: (id: string) => void
  updateFinancialProfile: (fp: Partial<FinancialProfile>) => void
  updateUserProfile: (up: Partial<UserProfile>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  resetToDemoData: () => void
  exportAllDataJSON: () => string
  importDataJSON: (jsonStr: string) => boolean
}

const FinancialContext = createContext<FinancialContextType | null>(null)

const STORAGE_KEY = 'lifeplan_v1_financial_state'

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(defaultFinancialProfile)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(defaultFamilyMembers)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions)
  const [bills, setBills] = useState<Bill[]>(defaultBills)
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultSavingsGoals)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.userProfile) setUserProfile(parsed.userProfile)
        if (parsed.financialProfile) setFinancialProfile(parsed.financialProfile)
        if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers)
        if (parsed.categories) setCategories(parsed.categories)
        if (parsed.transactions) setTransactions(parsed.transactions)
        if (parsed.bills) setBills(parsed.bills)
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals)
        if (parsed.notifications) setNotifications(parsed.notifications)
      }
    } catch (e) {
      console.warn('Could not parse stored LifePlan state, using defaults', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!isLoaded) return
    try {
      const stateToSave = {
        userProfile,
        financialProfile,
        familyMembers,
        categories,
        transactions,
        bills,
        savingsGoals,
        notifications,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {
      console.error('Failed to save LifePlan state to localStorage', e)
    }
  }, [
    isLoaded,
    userProfile,
    financialProfile,
    familyMembers,
    categories,
    transactions,
    bills,
    savingsGoals,
    notifications,
  ])

  // Computed values
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSaved = transactions
    .filter((t) => t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0)

  const remainingSalary = Math.max(0, (financialProfile.monthly_salary || 7500) - totalExpenses - totalSaved)

  // Days left in current month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const currentDay = now.getDate()
  const daysRemaining = Math.max(1, daysInMonth - currentDay)
  const safeToSpendDaily = Math.round((remainingSalary / daysRemaining) * 100) / 100

  // Emergency fund calculations (fixed monthly expenses)
  const monthlyFixed =
    financialProfile.rent +
    financialProfile.utilities +
    financialProfile.debt +
    financialProfile.insurance +
    financialProfile.groceries
  const emergencyGoal = savingsGoals.find((g) => g.id === 'goal_1')
  const emergencyFundMonths =
    monthlyFixed > 0 && emergencyGoal ? Math.round((emergencyGoal.current_amount / monthlyFixed) * 10) / 10 : 5.8

  const unreadCount = notifications.filter((n) => !n.read).length

  // Current Month Plan
  const currentMonthPlan: MonthlyPlan = {
    id: `plan_${currentYear}_${currentMonth}`,
    clerk_user_id: userProfile.clerk_user_id,
    month: currentMonth,
    year: currentYear,
    salary: financialProfile.monthly_salary,
    total_fixed_expenses: monthlyFixed,
    total_variable_expenses:
      financialProfile.education +
      financialProfile.transportation +
      financialProfile.personal_budget +
      financialProfile.healthcare,
    total_savings: financialProfile.savings_target,
    emergency_fund: financialProfile.emergency_target,
    remaining_amount: remainingSalary,
    notes: 'Balanced 50/30/20 target distribution',
    is_finalized: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Operations
  const addTransaction = (tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: categories.find((c) => c.id === tx.category_id),
      family_member: familyMembers.find((f) => f.id === tx.family_member_id),
    }
    setTransactions((prev) => [newTx, ...prev])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates, updated_at: new Date().toISOString() }
          if (updates.category_id) {
            updated.category = categories.find((c) => c.id === updates.category_id)
          }
          if (updates.family_member_id) {
            updated.family_member = familyMembers.find((f) => f.id === updates.family_member_id)
          }
          return updated
        }
        return t
      })
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleBillPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const isNowPaid = b.status !== 'paid'
          return {
            ...b,
            status: isNowPaid ? 'paid' : 'pending',
            paid_at: isNowPaid ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }
        }
        return b
      })
    )
  }

  const addBill = (bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: categories.find((c) => c.id === bill.category_id),
    }
    setBills((prev) => [...prev, newBill])
  }

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b))
    )
  }

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id))
  }

  const addFamilyMember = (member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `fam_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setFamilyMembers((prev) => [...prev, newMember])
  }

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m))
    )
  }

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setSavingsGoals((prev) => [...prev, newGoal])
  }

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g))
    )
  }

  const contributeToGoal = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              current_amount: g.current_amount + amount,
              updated_at: new Date().toISOString(),
            }
          : g
      )
    )
    // Also record transfer transaction
    const targetGoal = savingsGoals.find((g) => g.id === id)
    addTransaction({
      clerk_user_id: userProfile.clerk_user_id,
      category_id: 'cat_11',
      family_member_id: null,
      type: 'transfer',
      amount: amount,
      description: `Contribution to ${targetGoal ? targetGoal.name : 'Savings Goal'}`,
      transaction_date: new Date().toISOString().split('T')[0],
      payment_method: 'Internal Transfer',
      receipt_url: null,
      notes: `Allocated to ${targetGoal ? targetGoal.name : 'goal'}`,
    })
  }

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const updateFinancialProfile = (fp: Partial<FinancialProfile>) => {
    setFinancialProfile((prev) => ({ ...prev, ...fp, updated_at: new Date().toISOString() }))
  }

  const updateUserProfile = (up: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...up, updated_at: new Date().toISOString() }))
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const resetToDemoData = () => {
    setUserProfile(defaultUserProfile)
    setFinancialProfile(defaultFinancialProfile)
    setFamilyMembers(defaultFamilyMembers)
    setCategories(defaultCategories)
    setTransactions(defaultTransactions)
    setBills(defaultBills)
    setSavingsGoals(defaultSavingsGoals)
    setNotifications(defaultNotifications)
    localStorage.removeItem(STORAGE_KEY)
  }

  const exportAllDataJSON = () => {
    const data = {
      userProfile,
      financialProfile,
      familyMembers,
      categories,
      transactions,
      bills,
      savingsGoals,
      notifications,
      exportedAt: new Date().toISOString(),
      app: 'LifePlan PWA',
    }
    return JSON.stringify(data, null, 2)
  }

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed.userProfile) setUserProfile(parsed.userProfile)
      if (parsed.financialProfile) setFinancialProfile(parsed.financialProfile)
      if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers)
      if (parsed.categories) setCategories(parsed.categories)
      if (parsed.transactions) setTransactions(parsed.transactions)
      if (parsed.bills) setBills(parsed.bills)
      if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals)
      if (parsed.notifications) setNotifications(parsed.notifications)
      return true
    } catch (e) {
      console.error('Import error:', e)
      return false
    }
  }

  return (
    <FinancialContext.Provider
      value={{
        userProfile,
        financialProfile,
        familyMembers,
        categories,
        transactions,
        bills,
        savingsGoals,
        notifications,
        insights: defaultInsights,
        currentMonthPlan,
        totalIncome,
        totalExpenses,
        totalSaved,
        safeToSpendDaily,
        remainingSalary,
        emergencyFundMonths,
        unreadCount,
        currency: userProfile.currency || 'USD',
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toggleBillPaid,
        addBill,
        updateBill,
        deleteBill,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        addSavingsGoal,
        updateSavingsGoal,
        contributeToGoal,
        deleteSavingsGoal,
        updateFinancialProfile,
        updateUserProfile,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
        exportAllDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancialData() {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialProvider')
  }
  return context
}
