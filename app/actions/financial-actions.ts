'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import {
  Transaction,
  Bill,
  FamilyMember,
  SavingsGoal,
  FinancialProfile,
  UserProfile,
} from '@/types/database'

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
)

/**
 * Ensures authenticated Clerk user and returns userId.
 */
async function getAuthUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId || null
  } catch (e) {
    return null
  }
}

/**
 * Fetch complete financial state from Supabase for the authenticated user.
 */
export async function getFinancialStateAction() {
  const userId = await getAuthUserId()
  if (!userId) {
    return { success: false, error: 'Unauthorized', isConfigured: isSupabaseConfigured }
  }

  if (!isSupabaseConfigured) {
    return { success: false, isConfigured: false, message: 'Supabase credentials not configured, operating in local mode' }
  }

  try {
    const supabase = createSupabaseAdminClient()

    const [
      { data: userProfile },
      { data: financialProfile },
      { data: transactions },
      { data: bills },
      { data: familyMembers },
      { data: savingsGoals },
      { data: categories },
    ] = await Promise.all([
      supabase.from('users_profiles').select('*').eq('clerk_user_id', userId).single(),
      supabase.from('financial_profiles').select('*').eq('clerk_user_id', userId).single(),
      supabase.from('transactions').select('*').eq('clerk_user_id', userId).order('transaction_date', { ascending: false }),
      supabase.from('bills').select('*').eq('clerk_user_id', userId).order('due_date', { ascending: true }),
      supabase.from('family_members').select('*').eq('clerk_user_id', userId),
      supabase.from('savings_goals').select('*').eq('clerk_user_id', userId),
      supabase.from('categories').select('*').eq('clerk_user_id', userId),
    ])

    return {
      success: true,
      isConfigured: true,
      data: {
        userProfile,
        financialProfile,
        transactions: transactions || [],
        bills: bills || [],
        familyMembers: familyMembers || [],
        savingsGoals: savingsGoals || [],
        categories: categories || [],
      },
    }
  } catch (err: any) {
    console.error('getFinancialStateAction error:', err)
    return { success: false, error: err.message, isConfigured: isSupabaseConfigured }
  }
}

/**
 * Record a transaction in Supabase
 */
export async function createTransactionAction(tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) {
    return { success: true, localOnly: true, data: { ...tx, id: `tx_${Date.now()}` } }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...tx,
        clerk_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('createTransactionAction error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Delete a transaction from Supabase
 */
export async function deleteTransactionAction(txId: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', txId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('deleteTransactionAction error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Create or toggle bill
 */
export async function createBillAction(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) {
    return { success: true, localOnly: true, data: { ...bill, id: `bill_${Date.now()}` } }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('bills')
      .insert({
        ...bill,
        clerk_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('createBillAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function toggleBillPaidAction(billId: string, status: string, paidAt: string | null) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('bills')
      .update({ status, paid_at: paidAt })
      .eq('id', billId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('toggleBillPaidAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteBillAction(billId: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', billId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('deleteBillAction error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Family member actions
 */
export async function createFamilyMemberAction(member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) {
    return { success: true, localOnly: true, data: { ...member, id: `fam_${Date.now()}` } }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('family_members')
      .insert({
        ...member,
        clerk_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('createFamilyMemberAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteFamilyMemberAction(memberId: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('deleteFamilyMemberAction error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Savings goal actions
 */
export async function createSavingsGoalAction(goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) {
    return { success: true, localOnly: true, data: { ...goal, id: `goal_${Date.now()}` } }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        ...goal,
        clerk_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('createSavingsGoalAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function contributeToGoalAction(goalId: string, newAmount: number) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', goalId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('contributeToGoalAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteSavingsGoalAction(goalId: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', goalId)
      .eq('clerk_user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('deleteSavingsGoalAction error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Profiles
 */
export async function saveFinancialProfileAction(fp: Partial<FinancialProfile>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('financial_profiles')
      .upsert({
        ...fp,
        clerk_user_id: userId,
      })

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('saveFinancialProfileAction error:', err)
    return { success: false, error: err.message }
  }
}

export async function saveUserProfileAction(up: Partial<UserProfile>) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  if (!isSupabaseConfigured) return { success: true, localOnly: true }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('users_profiles')
      .upsert({
        ...up,
        clerk_user_id: userId,
      })

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('saveUserProfileAction error:', err)
    return { success: false, error: err.message }
  }
}
