// ================================================================
// LifePlan — Database TypeScript Types
// Auto-aligned with Supabase schema
// ================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Enums ────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense' | 'transfer'
export type BillStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'
export type RecurrenceType = 'monthly' | 'quarterly' | 'yearly' | 'once'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'bill' | 'goal' | 'budget'
export type SalaryType = 'monthly' | 'biweekly' | 'weekly'
export type CategoryType = 'income' | 'expense' | 'transfer'
export type BudgetStatus = 'healthy' | 'warning' | 'over_budget'

// ─── Database Row Types ────────────────────────────────────────

export interface UserProfile {
  id: string
  clerk_user_id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  currency: string
  country: string | null
  timezone: string | null
  monthly_salary: number
  payday: number | null
  onboarding_completed: boolean
  setup_completed: boolean
  created_at: string
  updated_at: string
}

export interface FinancialProfile {
  id: string
  clerk_user_id: string
  monthly_salary: number
  salary_type: SalaryType
  payday: number
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
  created_at: string
  updated_at: string
}

export interface FamilyMember {
  id: string
  clerk_user_id: string
  name: string
  relationship: string
  date_of_birth: string | null
  avatar_url: string | null
  monthly_budget: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  clerk_user_id: string
  name: string
  icon: string
  color: string
  type: CategoryType
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  clerk_user_id: string
  category_id: string | null
  family_member_id: string | null
  type: TransactionType
  amount: number
  description: string
  transaction_date: string
  payment_method: string | null
  receipt_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined
  category?: Category
  family_member?: FamilyMember
}

export interface Bill {
  id: string
  clerk_user_id: string
  name: string
  amount: number
  due_date: number
  recurring: boolean
  recurrence_type: RecurrenceType
  category_id: string | null
  status: BillStatus
  paid_at: string | null
  reminder_enabled: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // Joined
  category?: Category
}

export interface Budget {
  id: string
  clerk_user_id: string
  month: number
  year: number
  category_id: string | null
  planned_amount: number
  actual_amount: number
  created_at: string
  updated_at: string
  // Joined
  category?: Category
  // Computed
  remaining?: number
  percentage_used?: number
  status?: BudgetStatus
}

export interface SavingsGoal {
  id: string
  clerk_user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  status: GoalStatus
  notes: string | null
  created_at: string
  updated_at: string
  // Computed
  remaining?: number
  percentage?: number
  monthly_required?: number
}

export interface MonthlyPlan {
  id: string
  clerk_user_id: string
  month: number
  year: number
  salary: number
  total_fixed_expenses: number
  total_variable_expenses: number
  total_savings: number
  emergency_fund: number
  remaining_amount: number
  notes: string | null
  is_finalized: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  clerk_user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  action_url: string | null
  created_at: string
}

export interface FinancialGoal {
  id: string
  clerk_user_id: string
  title: string
  description: string | null
  target_amount: number
  current_amount: number
  deadline: string | null
  status: GoalStatus
  created_at: string
  updated_at: string
}

// ─── Insert Types (omit auto-generated fields) ─────────────────

export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
export type FinancialProfileInsert = Omit<FinancialProfile, 'id' | 'created_at' | 'updated_at'>
export type FamilyMemberInsert = Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>
export type TransactionInsert = Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'category' | 'family_member'>
export type BillInsert = Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'category'>
export type BudgetInsert = Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'category' | 'remaining' | 'percentage_used' | 'status'>
export type SavingsGoalInsert = Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'remaining' | 'percentage' | 'monthly_required'>
export type MonthlyPlanInsert = Omit<MonthlyPlan, 'id' | 'created_at' | 'updated_at'>
export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>
export type FinancialGoalInsert = Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>

// ─── Update Types ──────────────────────────────────────────────

export type UserProfileUpdate = Partial<UserProfileInsert>
export type FinancialProfileUpdate = Partial<FinancialProfileInsert>
export type FamilyMemberUpdate = Partial<FamilyMemberInsert>
export type CategoryUpdate = Partial<CategoryInsert>
export type TransactionUpdate = Partial<TransactionInsert>
export type BillUpdate = Partial<BillInsert>
export type BudgetUpdate = Partial<BudgetInsert>
export type SavingsGoalUpdate = Partial<SavingsGoalInsert>
export type MonthlyPlanUpdate = Partial<MonthlyPlanInsert>
export type FinancialGoalUpdate = Partial<FinancialGoalInsert>

// ─── App-level computed types ──────────────────────────────────

export interface DashboardData {
  profile: UserProfile | null
  financialProfile: FinancialProfile | null
  currentMonthPlan: MonthlyPlan | null
  recentTransactions: Transaction[]
  upcomingBills: Bill[]
  savingsGoals: SavingsGoal[]
  budgets: Budget[]
  insights: FinancialInsight[]
  totalIncome: number
  totalExpenses: number
  totalSaved: number
  remaining: number
}

export interface FinancialInsight {
  id: string
  type: 'info' | 'warning' | 'success' | 'tip'
  title: string
  message: string
  icon: string
}

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
  familyBudgets: { name: string; amount: number }[]
  existingBills: Bill[]
}

export interface MonthlyPlanOutput {
  salary: number
  totalFixed: number
  totalVariable: number
  totalSavings: number
  emergencyFund: number
  remaining: number
  categories: BudgetCategory[]
  warnings: string[]
  suggestions: string[]
}

export interface BudgetCategory {
  name: string
  icon: string
  color: string
  planned: number
  actual: number
  remaining: number
  percentage: number
  percentageUsed: number
  status: BudgetStatus
}

export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
}

export interface MonthYear {
  month: number
  year: number
  label: string
}
