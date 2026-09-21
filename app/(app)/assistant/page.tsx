'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  User,
  Lightbulb,
  Zap,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FinancialAssistantService, AssistantFinancialContext } from '@/lib/services/assistant'
import { aggregateSpendingByCategory } from '@/lib/finance/transactions'
import { getBillUrgency } from '@/lib/finance/bills'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export default function AssistantPage() {
  const {
    financialProfile,
    userProfile,
    currency,
    safeToSpendDaily,
    remainingSalary,
    emergencyFundMonths,
    totalIncome,
    totalExpenses,
    totalSaved,
    bills,
    savingsGoals,
    transactions,
    categories,
  } = useFinancialData()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hello ${
        userProfile.full_name?.split(' ')[0] || 'there'
      }! I am your **LifePlan Financial Intelligence Engine**.\n\nI have authorized access to your live salary of ${formatMoney(
        financialProfile.monthly_salary || 7500,
        currency
      )}, your daily safe discretionary limit (${formatMoney(safeToSpendDaily, currency)}/day), and your ${emergencyFundMonths}-month emergency reserve.\n\nHow can I help optimize your finances today?`,
      timestamp: 'Just now',
    },
  ])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isAIConfigured = FinancialAssistantService.isAIConfigured()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const quickPrompts = [
    'How much can I spend this week?',
    'Where am I spending the most?',
    'Can I afford a $350 purchase?',
    'How is my emergency fund?',
    'Why is my budget over?',
  ]

  // Build authorized user context
  const now = new Date()
  const today = now.getDate()
  const payday = financialProfile.payday || 28
  const daysToPayday = payday >= today ? payday - today : 30 - today + payday

  const categoryAgg = aggregateSpendingByCategory(transactions, categories)
  const categoriesSpending = categoryAgg.map((c) => ({
    name: c.categoryName,
    spent: c.totalSpent,
    pct: c.percentageOfTotal,
  }))

  const topExpenses = transactions
    .filter((t) => t.type === 'expense')
    .slice(0, 5)
    .map((t) => ({ description: t.description, amount: t.amount, date: t.transaction_date }))

  const upcomingBills = bills.map((b) => ({
    name: b.name,
    amount: b.amount,
    due_date: b.due_date,
    urgency: getBillUrgency(b, now).urgency,
  }))

  const goalsSummary = savingsGoals.map((g) => ({
    name: g.name,
    target: g.target_amount,
    current: g.current_amount,
    pct: g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0,
  }))

  const assistantContext: AssistantFinancialContext = {
    salary: financialProfile.monthly_salary || 7500,
    totalIncome,
    totalExpenses,
    totalSaved,
    remainingSalary,
    safeToSpendDaily,
    emergencyFundMonths,
    daysToPayday,
    currency,
    categoriesSpending,
    topExpenses,
    upcomingBills,
    savingsGoals: goalsSummary,
  }

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input
    if (!promptText.trim() || isTyping) return

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await FinancialAssistantService.query(promptText.trim(), assistantContext)

      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsTyping(false)
      }, 500)
    } catch (err) {
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8 flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              LifePlan AI Assistant
            </h1>
            <Badge variant="default" className="text-[10px]">
              {isAIConfigured ? 'LLM Provider Online' : 'Rule Engine Active'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#9AAFA5] mt-0.5">
            Real-time contextual advice querying your verified salary, bills, and liquid reserves.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9AAFA5]">
          <ShieldCheck size={16} className="text-[#19D98A]" />
          <span>User Partitioned & Private</span>
        </div>
      </div>

      {/* Mode / LLM Provider Notice Banner */}
      {!isAIConfigured && (
        <div className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.08] text-xs text-[#9AAFA5] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Key size={15} className="text-[#63F2B0] shrink-0" />
            <span>
              Operating via <strong>LifePlan Financial Modeling Engine</strong>. To enable conversational LLMs (OpenAI, Gemini, Anthropic), configure your API key in environment variables.
            </span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 rounded-3xl bg-[#0B110E] border border-white/[0.06] p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-white/[0.1] text-white'
                  : 'bg-gradient-to-br from-[#063B28] to-[#19D98A] text-[#050806] shadow-[0_0_12px_rgba(25,217,138,0.3)]'
              }`}
            >
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#19D98A] text-[#050806] font-semibold rounded-tr-none'
                  : 'bg-[#101A15] border border-white/[0.06] text-white rounded-tl-none'
              }`}
            >
              {msg.text}
              <div
                className={`text-[9px] mt-2 font-normal ${
                  msg.sender === 'user' ? 'text-[#050806]/60 text-right' : 'text-[#60756C]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#063B28] text-[#19D98A] flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#101A15] border border-white/[0.06] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D98A] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D98A] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D98A] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 shrink-0">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-semibold text-[#9AAFA5] hover:text-white whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask anything about your salary, bills, vacation budget..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-12 px-4 rounded-2xl bg-[#0B110E] border border-white/[0.08] text-white text-xs placeholder:text-[#60756C] focus:outline-none focus:border-[#19D98A]/50 transition-colors"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="h-12 w-12 rounded-2xl bg-[#19D98A] text-[#050806] hover:bg-[#3EE8A2] p-0 flex items-center justify-center shrink-0 disabled:opacity-40"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  )
}
