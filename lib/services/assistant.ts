/**
 * LifePlan Financial Assistant Service
 * Clean abstraction supporting deterministic financial algorithmic analysis
 * and pluggable LLM provider integrations (OpenAI / Anthropic / Gemini).
 */

import { formatMoney } from '@/lib/finance/currency'

export interface AssistantFinancialContext {
  salary: number
  totalIncome: number
  totalExpenses: number
  totalSaved: number
  remainingSalary: number
  safeToSpendDaily: number
  emergencyFundMonths: number
  daysToPayday: number
  currency: string
  categoriesSpending: { name: string; spent: number; pct: number }[]
  topExpenses: { description: string; amount: number; date: string }[]
  upcomingBills: { name: string; amount: number; due_date: number; urgency: string }[]
  savingsGoals: { name: string; target: number; current: number; pct: number }[]
}

export interface AssistantResponse {
  answer: string
  mode: 'rule_engine' | 'ai_provider'
  sourceModel?: string
  confidence: number
  suggestions?: string[]
}

export class FinancialAssistantService {
  /**
   * Checks if an external AI LLM provider API key is set in environment.
   */
  static isAIConfigured(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GEMINI_API_KEY
    )
  }

  /**
   * Generates a context-aware answer based on the user's live authorized financial records.
   */
  static async query(
    prompt: string,
    context: AssistantFinancialContext
  ): Promise<AssistantResponse> {
    const q = prompt.toLowerCase()
    const cur = context.currency

    // 1. "How much can I spend this week / today?"
    if (q.includes('spend this week') || q.includes('daily') || q.includes('spend today') || q.includes('safe to spend') || q.includes('allowance')) {
      const weekly = Math.round(context.safeToSpendDaily * 7)
      return {
        mode: 'rule_engine',
        confidence: 0.98,
        answer: `### 💳 Discretionary Spending Allowance\n\nBased on your monthly salary of **${formatMoney(context.salary, cur)}**, with all fixed bills and savings accounted for, your current allowance is:\n\n- **Safe To Spend Daily**: **${formatMoney(context.safeToSpendDaily, cur)} / day**\n- **Weekly Discretionary Limit**: **${formatMoney(weekly, cur)} / week**\n- **Remaining for the Month**: **${formatMoney(context.remainingSalary, cur)}**\n- **Days until next payday**: **${context.daysToPayday} days**\n\n> 💡 *Advisement*: As long as your total daily non-essential purchases stay below ${formatMoney(context.safeToSpendDaily, cur)}, your budget will remain in surplus.`,
        suggestions: ['Where am I spending the most?', 'Review upcoming bills', 'Can I afford an extra expense?'],
      }
    }

    // 2. "Where am I spending the most?"
    if (q.includes('where am i spending') || q.includes('most') || q.includes('highest') || q.includes('top expense') || q.includes('breakdown')) {
      const topCats = context.categoriesSpending.slice(0, 3)
      const listStr = topCats.length > 0
        ? topCats.map((c, i) => `${i + 1}. **${c.name}**: ${formatMoney(c.spent, cur)} (${c.pct}% of total outflows)`).join('\n')
        : 'No categorized outflows logged yet for this billing cycle.'

      return {
        mode: 'rule_engine',
        confidence: 0.95,
        answer: `### 📊 Top Outflow Categories\n\nAnalyzing your actual transaction ledger for this period:\n\n${listStr}\n\n**Total Outflows Logged**: **${formatMoney(context.totalExpenses, cur)}** across all active categories.\n\n> 💡 *Recommendation*: Inspect your top category for recurring subscription creep or bulk purchases.`,
        suggestions: ['Analyze my 50/30/20 budget', 'How can I save $200 more?'],
      }
    }

    // 3. "Can I afford this expense?"
    if (q.includes('afford') || q.includes('buy') || q.includes('purchase')) {
      // Check if prompt contains an amount
      const numMatch = prompt.match(/\d+([.,]\d+)?/)
      const targetCost = numMatch ? parseFloat(numMatch[0].replace(',', '')) : 0

      if (targetCost > 0) {
        const canAfford = targetCost <= context.remainingSalary
        const pctOfRemaining = Math.round((targetCost / Math.max(1, context.remainingSalary)) * 100)

        return {
          mode: 'rule_engine',
          confidence: 0.95,
          answer: `### 🛍️ Affordability Audit: ${formatMoney(targetCost, cur)}\n\n- **Your Unallocated Salary Runway**: **${formatMoney(context.remainingSalary, cur)}**\n- **Impact on Discretionary Reserve**: **${pctOfRemaining}%**\n\n${
            canAfford
              ? `✅ **Yes, you can afford this purchase!** You will still have **${formatMoney(context.remainingSalary - targetCost, cur)}** discretionary buffer remaining before your next paycheck in ${context.daysToPayday} days.`
              : `⚠️ **Caution**: This expense exceeds your liquid discretionary balance of ${formatMoney(context.remainingSalary, cur)} by **${formatMoney(targetCost - context.remainingSalary, cur)}**. You would need to tap into savings or delay the purchase until payday.`
          }`,
          suggestions: ['How much can I spend this week?', 'How is my emergency fund?'],
        }
      }

      return {
        mode: 'rule_engine',
        confidence: 0.9,
        answer: `### 🛍️ Purchase Affordability Assessment\n\nYou currently have **${formatMoney(context.remainingSalary, cur)}** in discretionary cash runway and a daily safe-to-spend limit of **${formatMoney(context.safeToSpendDaily, cur)}/day**.\n\nTo run a precise check, ask: *"Can I afford a 150 purchase?"* with the exact amount.`,
      }
    }

    // 4. "How is my emergency fund?"
    if (q.includes('emergency') || q.includes('runway') || q.includes('reserve')) {
      const months = context.emergencyFundMonths
      return {
        mode: 'rule_engine',
        confidence: 0.98,
        answer: `### 🛡️ Emergency Reserve Status\n\n- **Liquid Living Runway**: **${months} Months**\n- **Recommended Standard**: 3 to 6 Months\n- **Health Verdict**: **${months >= 6 ? 'Exceptional 🌟' : months >= 3 ? 'Healthy & Robust 🛡️' : 'Needs Reinforcement ⚠️'}**\n\nYour emergency reserve can fund living necessities without touching investments or retirement assets.`,
        suggestions: ['How to increase savings rate?', 'What are my upcoming bills?'],
      }
    }

    // 5. "Why is my budget over?"
    if (q.includes('over budget') || q.includes('why is my budget') || q.includes('overspending')) {
      const isOver = context.remainingSalary <= 0
      return {
        mode: 'rule_engine',
        confidence: 0.92,
        answer: `### ⚠️ Budget Deficit Diagnostic\n\n${
          isOver
            ? `Your recorded expenses (${formatMoney(context.totalExpenses, cur)}) plus savings commitments (${formatMoney(context.totalSaved, cur)}) exceed your net salary (${formatMoney(context.salary, cur)}).\n\n**Action Items to Rebalance**:\n1. Review discretionary personal dining & shopping.\n2. Settle only critical recurring bills until the next payday.\n3. Temporarily adjust the monthly savings slider in the Smart Plan page.`
            : `Good news! Your budget is **not** over. You currently retain a healthy surplus of **${formatMoney(context.remainingSalary, cur)}** before your next salary cycle.`
        }`,
      }
    }

    // Fallback: General Financial Summary
    return {
      mode: 'rule_engine',
      confidence: 0.88,
      answer: `### 💡 LifePlan Financial Summary\n\n- **Monthly Salary**: ${formatMoney(context.salary, cur)}\n- **Total Logged Expenses**: ${formatMoney(context.totalExpenses, cur)}\n- **Emergency Runway**: ${context.emergencyFundMonths} months\n- **Daily Safe Discretionary**: ${formatMoney(context.safeToSpendDaily, cur)} / day\n\nFeel free to ask specific questions like:\n- *"How much can I spend this week?"*\n- *"Where am I spending the most?"*\n- *"Can I afford a $250 expense?"*\n- *"How is my emergency fund?"*`,
      suggestions: ['How much can I spend this week?', 'Where am I spending the most?', 'Can I afford a $200 dinner?'],
    }
  }
}
