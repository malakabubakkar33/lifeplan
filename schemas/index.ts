import { z } from 'zod'

// ─── Financial Profile Setup ────────────────────────────────────
export const financialProfileSchema = z.object({
  monthly_salary: z.number().min(1, 'Salary is required').max(100000000, 'Invalid salary amount'),
  salary_type: z.enum(['monthly', 'biweekly', 'weekly']).default('monthly'),
  payday: z.number().min(1).max(31).default(1),
  rent: z.number().min(0, 'Cannot be negative').default(0),
  utilities: z.number().min(0).default(0),
  groceries: z.number().min(0).default(0),
  transportation: z.number().min(0).default(0),
  education: z.number().min(0).default(0),
  healthcare: z.number().min(0).default(0),
  debt: z.number().min(0).default(0),
  insurance: z.number().min(0).default(0),
  personal_budget: z.number().min(0).default(0),
  savings_target: z.number().min(0).default(0),
  emergency_target: z.number().min(0).default(0),
})

// ─── User Profile ───────────────────────────────────────────────
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  currency: z.string().length(3, 'Invalid currency code').default('PKR'),
  country: z.string().optional(),
  timezone: z.string().optional(),
  monthly_salary: z.number().min(0).default(0),
  payday: z.number().min(1).max(31).default(1),
})

// ─── Transaction ─────────────────────────────────────────────────
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required').max(200),
  transaction_date: z.string().min(1, 'Date is required'),
  category_id: z.string().uuid().optional().nullable(),
  family_member_id: z.string().uuid().optional().nullable(),
  payment_method: z.enum(['cash', 'card', 'bank_transfer', 'mobile_payment', 'cheque', 'other']).default('cash'),
  notes: z.string().max(500).optional().nullable(),
})

// ─── Bill ────────────────────────────────────────────────────────
export const billSchema = z.object({
  name: z.string().min(1, 'Bill name is required').max(100),
  amount: z.number().min(0, 'Amount cannot be negative'),
  due_date: z.number().min(1).max(31),
  recurring: z.boolean().default(true),
  recurrence_type: z.enum(['monthly', 'quarterly', 'yearly', 'once']).default('monthly'),
  category_id: z.string().uuid().optional().nullable(),
  reminder_enabled: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable(),
})

// ─── Savings Goal ────────────────────────────────────────────────
export const savingsGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  target_amount: z.number().min(1, 'Target amount must be greater than 0'),
  current_amount: z.number().min(0).default(0),
  deadline: z.string().optional().nullable(),
  icon: z.string().default('target'),
  color: z.string().default('#19D98A'),
  notes: z.string().max(500).optional().nullable(),
})

// ─── Financial Goal ──────────────────────────────────────────────
export const financialGoalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(100),
  description: z.string().max(500).optional().nullable(),
  target_amount: z.number().min(1, 'Target must be greater than 0'),
  current_amount: z.number().min(0).default(0),
  deadline: z.string().optional().nullable(),
})

// ─── Family Member ───────────────────────────────────────────────
export const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  relationship: z.string().min(1, 'Relationship is required'),
  date_of_birth: z.string().optional().nullable(),
  monthly_budget: z.number().min(0).default(0),
  notes: z.string().max(500).optional().nullable(),
})

// ─── Category ────────────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  icon: z.string().default('circle'),
  color: z.string().default('#19D98A'),
  type: z.enum(['income', 'expense', 'transfer']),
})

// ─── Budget Entry ────────────────────────────────────────────────
export const budgetSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  category_id: z.string().uuid(),
  planned_amount: z.number().min(0),
})

// ─── Notification Update ─────────────────────────────────────────
export const notificationUpdateSchema = z.object({
  read: z.boolean(),
})

// ─── Goal Contribution ───────────────────────────────────────────
export const goalContributionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

// Type exports
export type FinancialProfileFormData = z.infer<typeof financialProfileSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type TransactionFormData = z.infer<typeof transactionSchema>
export type BillFormData = z.infer<typeof billSchema>
export type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>
export type FinancialGoalFormData = z.infer<typeof financialGoalSchema>
export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type BudgetFormData = z.infer<typeof budgetSchema>
