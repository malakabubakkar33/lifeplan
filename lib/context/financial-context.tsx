'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
import {
  calculateSalaryMetrics,
  calculateDaysToPayday,
} from '@/lib/finance/salary'
import {
  calculateTransactionTotals,
  aggregateSpendingByCategory,
  aggregateSpendingByFamily,
} from '@/lib/finance/transactions'
import {
  processBills,
} from '@/lib/finance/bills'
import {
  processGoals,
  calculateEmergencyFundRunway,
} from '@/lib/finance/goals'
import {
  generateMonthlyPlan,
} from '@/lib/finance/monthly-plan'
import {
  getFinancialStateAction,
  createTransactionAction,
  deleteTransactionAction,
  createBillAction,
  toggleBillPaidAction,
  deleteBillAction,
  createFamilyMemberAction,
  deleteFamilyMemberAction,
  createSavingsGoalAction,
  contributeToGoalAction,
  deleteSavingsGoalAction,
  saveFinancialProfileAction,
  saveUserProfileAction,
} from '@/app/actions/financial-actions'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { isLiveClerk } from '@/components/providers/auth-provider'

// ─── Default Initial State ───────────────────────────────────────
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
    amount: 7500.00,
    description: 'Monthly Salary Credit',
    transaction_date: dStr(1),
    payment_method: 'Direct Deposit',
    receipt_url: null,
    notes: 'Direct wire from employer',
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
    amount: 1800.00,
    description: 'Apartment Lease Payment',
    transaction_date: dStr(2),
    payment_method: 'Bank Transfer',
    receipt_url: null,
    notes: 'Monthly fixed housing rent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[0],
  },
  {
    id: 'tx_3',
    clerk_user_id: 'user_active',
    category_id: 'cat_2',
    family_member_id: null,
    type: 'expense',
    amount: 182.40,
    description: 'Organic Groceries & Produce',
    transaction_date: dStr(3),
    payment_method: 'Credit Card',
    receipt_url: null,
    notes: 'Weekly fresh groceries',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[1],
  },
  {
    id: 'tx_4',
    clerk_user_id: 'user_active',
    category_id: 'cat_5',
    family_member_id: 'fam_2',
    type: 'expense',
    amount: 350.00,
    description: "Leo's Grade 2 School Tuition",
    transaction_date: dStr(4),
    payment_method: 'Debit Card',
    receipt_url: null,
    notes: 'Monthly academic term fee',
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
    amount: 72.00,
    description: 'Family Vehicle Fuel & Tolls',
    transaction_date: dStr(5),
    payment_method: 'Apple Pay',
    receipt_url: null,
    notes: 'Gas tank refill',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[3],
  },
  {
    id: 'tx_6',
    clerk_user_id: 'user_active',
    category_id: 'cat_11',
    family_member_id: null,
    type: 'transfer',
    amount: 600.00,
    description: 'Emergency Reserve Monthly Deposit',
    transaction_date: dStr(6),
    payment_method: 'Auto-transfer',
    receipt_url: null,
    notes: 'High yield savings transfer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[10],
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
    name: 'High-Speed Fiber Internet',
    amount: 85,
    due_date: 15,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_3',
    status: 'pending',
    paid_at: null,
    reminder_enabled: true,
    notes: 'Home gigabit connection',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[2],
  },
  {
    id: 'bill_4',
    clerk_user_id: 'user_active',
    name: 'Family Health Insurance',
    amount: 280,
    due_date: 5,
    recurring: true,
    recurrence_type: 'monthly',
    category_id: 'cat_6',
    status: 'paid',
    paid_at: dStr(6),
    reminder_enabled: true,
    notes: 'Comprehensive medical coverage',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: defaultCategories[5],
  },
]

const currentYear = now.getFullYear()
const defaultSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal_1',
    clerk_user_id: 'user_active',
    name: 'Emergency Fund (6 Mos)',
    target_amount: 25000,
    current_amount: 18400,
    deadline: `${currentYear}-12-31`,
    icon: 'ShieldCheck',
    color: '#19D98A',
    status: 'active',
    notes: 'Liquid safety runway for mortgage, food & utilities',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'goal_2',
    clerk_user_id: 'user_active',
    name: 'Family Summer Vacation',
    target_amount: 4500,
    current_amount: 3150,
    deadline: `${currentYear + 1}-06-30`,
    icon: 'Plane',
    color: '#3EE8A2',
    status: 'active',
    notes: '10-day trip to Mediterranean coast',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const defaultNotifications: Notification[] = [
  {
    id: 'notif_1',
    clerk_user_id: 'user_active',
    title: 'Upcoming Bill Reminder',
    message: 'Electricity & Gas Grid ($145) is due in 3 days.',
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
    message: 'Children school activities are well within the planned monthly budget.',
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
  storageMode: 'cloud' | 'local_vault'
  // Computed values
  totalIncome: number
  totalExpenses: number
  totalSaved: number
  safeToSpendDaily: number
  remainingSalary: number
  emergencyFundMonths: number
  unreadCount: number
  currency: string
  // Operations
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
  const clerkUser = isLiveClerk ? useClerkUser() : null
  const [isLoaded, setIsLoaded] = useState(false)
  const [storageMode, setStorageMode] = useState<'cloud' | 'local_vault'>('local_vault')

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(defaultFinancialProfile)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(defaultFamilyMembers)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions)
  const [bills, setBills] = useState<Bill[]>(defaultBills)
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultSavingsGoals)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)

  // Hydrate from localStorage first, then sync with server action if available
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
      console.warn('Using default LifePlan state', e)
    } finally {
      setIsLoaded(true)
    }

    // Try cloud sync if Clerk user is signed in
    async function syncCloud() {
      try {
        const res = await getFinancialStateAction()
        if (res.success && res.data) {
          setStorageMode('cloud')
          if (res.data.userProfile) setUserProfile(res.data.userProfile)
          if (res.data.financialProfile) setFinancialProfile(res.data.financialProfile)
          if (res.data.transactions?.length) setTransactions(res.data.transactions)
          if (res.data.bills?.length) setBills(res.data.bills)
          if (res.data.familyMembers?.length) setFamilyMembers(res.data.familyMembers)
          if (res.data.savingsGoals?.length) setSavingsGoals(res.data.savingsGoals)
          if (res.data.categories?.length) setCategories(res.data.categories)
        } else {
          setStorageMode('local_vault')
        }
      } catch (err) {
        setStorageMode('local_vault')
      }
    }

    syncCloud()
  }, [])

  // Sync Clerk user information into profile when signed in
  useEffect(() => {
    if (clerkUser?.user) {
      const u = clerkUser.user
      setUserProfile((prev) => ({
        ...prev,
        clerk_user_id: u.id,
        full_name: u.fullName || prev.full_name,
        email: u.primaryEmailAddress?.emailAddress || prev.email,
        avatar_url: u.imageUrl || prev.avatar_url,
      }))
    }
  }, [clerkUser?.user])

  // Save to local vault
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
      console.error('Failed to save state to localStorage', e)
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

  // Computed Metrics from pure financial engine
  const totals = calculateTransactionTotals(transactions)
  const salary = financialProfile.monthly_salary || 7500
  const salaryMetrics = calculateSalaryMetrics(
    salary,
    totals.totalExpenses,
    totals.totalTransfers,
    financialProfile.payday || 28
  )

  const fixedMonthly =
    Number(financialProfile.rent || 0) +
    Number(financialProfile.utilities || 0) +
    Number(financialProfile.debt || 0) +
    Number(financialProfile.insurance || 0) +
    Number(financialProfile.groceries || 0)

  const emergencyGoal = savingsGoals.find((g) => g.id === 'goal_1') || savingsGoals[0]
  const emergencyAmount = emergencyGoal ? emergencyGoal.current_amount : 18400
  const runwayCalc = calculateEmergencyFundRunway(emergencyAmount, fixedMonthly)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Current Month Plan generated by 50/30/20 engine
  const planOutput = generateMonthlyPlan({
    salary,
    rent: Number(financialProfile.rent || 0),
    utilities: Number(financialProfile.utilities || 0),
    groceries: Number(financialProfile.groceries || 0),
    transportation: Number(financialProfile.transportation || 0),
    education: Number(financialProfile.education || 0),
    healthcare: Number(financialProfile.healthcare || 0),
    debt: Number(financialProfile.debt || 0),
    insurance: Number(financialProfile.insurance || 0),
    personal_budget: Number(financialProfile.personal_budget || 0),
    savings_target: Number(financialProfile.savings_target || 0),
    emergency_target: Number(financialProfile.emergency_target || 0),
    familyBudgets: familyMembers.map((m) => ({ name: m.name, amount: m.monthly_budget })),
    existingBills: bills.map((b) => ({ name: b.name, amount: b.amount, recurring: b.recurring, status: b.status })),
  })

  const currentMonthPlan: MonthlyPlan = {
    id: `plan_${now.getFullYear()}_${now.getMonth() + 1}`,
    clerk_user_id: userProfile.clerk_user_id,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    salary: planOutput.salary,
    total_fixed_expenses: planOutput.totalFixed,
    total_variable_expenses: planOutput.totalVariable,
    total_savings: planOutput.totalSavings,
    emergency_fund: planOutput.emergencyFund,
    remaining_amount: planOutput.remainingAmount,
    notes: 'Automated 50/30/20 Plan',
    is_finalized: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Mutations
  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: categories.find((c) => c.id === tx.category_id),
      family_member: familyMembers.find((f) => f.id === tx.family_member_id),
    }

    setTransactions((prev) => [newTx, ...prev])

    // Background server action
    createTransactionAction(tx).catch((e) => console.warn('Cloud sync offline:', e))
  }, [categories, familyMembers])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
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
  }, [categories, familyMembers])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    deleteTransactionAction(id).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const toggleBillPaid = useCallback((id: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const isNowPaid = b.status !== 'paid'
          const newStatus = isNowPaid ? 'paid' : 'pending'
          const newPaidAt = isNowPaid ? new Date().toISOString() : null

          toggleBillPaidAction(id, newStatus, newPaidAt).catch((e) => console.warn('Cloud sync offline:', e))

          return {
            ...b,
            status: newStatus as any,
            paid_at: newPaidAt,
            updated_at: new Date().toISOString(),
          }
        }
        return b
      })
    )
  }, [])

  const addBill = useCallback((bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: categories.find((c) => c.id === bill.category_id),
    }
    setBills((prev) => [newBill, ...prev])
    createBillAction(bill).catch((e) => console.warn('Cloud sync offline:', e))
  }, [categories])

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b))
    )
  }, [])

  const deleteBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id))
    deleteBillAction(id).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `fam_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setFamilyMembers((prev) => [...prev, newMember])
    createFamilyMemberAction(member).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const updateFamilyMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m))
    )
  }, [])

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id))
    deleteFamilyMemberAction(id).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setSavingsGoals((prev) => [...prev, newGoal])
    createSavingsGoalAction(goal).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g))
    )
  }, [])

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newAmt = g.current_amount + amount
          contributeToGoalAction(id, newAmt).catch((e) => console.warn('Cloud sync offline:', e))
          return { ...g, current_amount: newAmt, updated_at: new Date().toISOString() }
        }
        return g
      })
    )
  }, [])

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
    deleteSavingsGoalAction(id).catch((e) => console.warn('Cloud sync offline:', e))
  }, [])

  const updateFinancialProfile = useCallback((fp: Partial<FinancialProfile>) => {
    setFinancialProfile((prev) => {
      const next = { ...prev, ...fp, updated_at: new Date().toISOString() }
      saveFinancialProfileAction(next).catch((e) => console.warn('Cloud sync offline:', e))
      return next
    })
  }, [])

  const updateUserProfile = useCallback((up: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...up, updated_at: new Date().toISOString() }
      saveUserProfileAction(next).catch((e) => console.warn('Cloud sync offline:', e))
      return next
    })
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const resetToDemoData = useCallback(() => {
    setUserProfile(defaultUserProfile)
    setFinancialProfile(defaultFinancialProfile)
    setFamilyMembers(defaultFamilyMembers)
    setCategories(defaultCategories)
    setTransactions(defaultTransactions)
    setBills(defaultBills)
    setSavingsGoals(defaultSavingsGoals)
    setNotifications(defaultNotifications)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const exportAllDataJSON = useCallback(() => {
    return JSON.stringify({
      userProfile,
      financialProfile,
      familyMembers,
      categories,
      transactions,
      bills,
      savingsGoals,
      notifications,
      exportDate: new Date().toISOString(),
      version: 'LifePlan-1.0',
    }, null, 2)
  }, [userProfile, financialProfile, familyMembers, categories, transactions, bills, savingsGoals, notifications])

  const importDataJSON = useCallback((jsonStr: string): boolean => {
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
  }, [])

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
        storageMode,
        totalIncome: totals.totalIncome,
        totalExpenses: totals.totalExpenses,
        totalSaved: totals.totalTransfers,
        safeToSpendDaily: salaryMetrics.safeToSpendDaily,
        remainingSalary: salaryMetrics.remainingSalary,
        emergencyFundMonths: runwayCalc.runwayMonths,
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
  const ctx = useContext(FinancialContext)
  if (!ctx) {
    throw new Error('useFinancialData must be used within FinancialProvider')
  }
  return ctx
}
