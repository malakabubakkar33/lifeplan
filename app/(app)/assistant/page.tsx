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
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
    emergencyFundMonths,
    bills,
    savingsGoals,
  } = useFinancialData()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hello ${
        userProfile.full_name?.split(' ')[0] || 'there'
      }! I am your **LifePlan AI Financial Advisor**. I have real-time access to your cash flow, family budgets, upcoming bills, and emergency reserves.\n\nHow can I help you strengthen your financial health today?`,
      timestamp: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const quickPrompts = [
    'Analyze my 50/30/20 budget balance',
    'How is my emergency fund health?',
    'Can I afford a $1,200 vacation next month?',
    'How can I save $400 more this month?',
    'Review my upcoming bills schedule',
  ]

  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase()
    const salary = financialProfile.monthly_salary || 7500

    if (q.includes('50/30/20') || q.includes('balance') || q.includes('budget')) {
      return `### 📊 50/30/20 Budget Assessment\n\n- **Monthly Net Income**: ${formatMoney(
        salary,
        currency
      )}\n- **Fixed Needs**: ~42% (${formatMoney(
        (financialProfile.rent || 0) +
          (financialProfile.utilities || 0) +
          (financialProfile.groceries || 0) +
          (financialProfile.debt || 0),
        currency
      )})\n- **Discretionary Wants**: ~10%\n- **Savings & Reserves**: ~26%\n\n> **Key Takeaway**: You are in an **exceptionally healthy position**! Your fixed necessities remain well below the 50% threshold, allowing you to invest 26% of your salary into wealth creation and emergency reserves.`
    }

    if (q.includes('emergency') || q.includes('runway') || q.includes('fund')) {
      return `### 🛡️ Emergency Reserve Audit\n\n- **Current Runway**: **${emergencyFundMonths} months**\n- **Recommended Horizon**: 6 months\n- **Target Status**: **Strong & Secure**\n\nWith your monthly fixed commitments covered, your family can comfortably navigate unexpected job transitions or medical emergencies for over 5.5 months without touching long-term retirement accounts.`
    }

    if (q.includes('vacation') || q.includes('afford') || q.includes('trip')) {
      return `### ✈️ Vacation Affordability Check\n\n- **Daily Discretionary Limit**: ${formatMoney(
        safeToSpendDaily,
        currency
      )}/day\n- **Monthly Unallocated Buffer**: ${formatMoney(
        financialProfile.savings_target * 0.4,
        currency
      )}\n\n**Verdict**: **Yes, you can afford it!** However, rather than withdrawing from your primary liquid checking account, allocate $400/mo over the next 3 months into your **Family Summer Vacation Goal**, which already has substantial progress.`
    }

    if (q.includes('bill') || q.includes('due')) {
      const pendingCount = bills.filter((b) => b.status !== 'paid').length
      return `### 🗓️ Upcoming Bills Schedule\n\nYou have **${pendingCount} pending bills** remaining this billing cycle.\n\n- Ensure your checking account has at least **${formatMoney(
        bills.reduce((s, b) => (b.status !== 'paid' ? s + b.amount : s), 0),
        currency
      )}** ready for scheduled direct drafts before the 28th payday.`
    }

    return `### 💡 Personalized Financial Guidance\n\nLooking at your profile with **${formatMoney(
      salary,
      currency
    )}/mo** income:\n\n1. **Safe-to-Spend Daily**: Maintain spending within **${formatMoney(
      safeToSpendDaily,
      currency
    )}/day** to preserve your end-of-month cash surplus.\n2. **High-Yield Automation**: Automate your savings deposit of **${formatMoney(
      financialProfile.savings_target,
      currency
    )}** right on payday (${financialProfile.payday}th of month) so you "pay yourself first".\n3. **Debt Acceleration**: Consider adding $50/mo extra to your lowest-balance debt loan to eliminate interest early.`
  }

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input
    if (!q.trim()) return

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiReply = generateAIResponse(q)
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] shadow-[0_0_20px_rgba(25,217,138,0.3)]">
            <Bot size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">LifePlan AI Advisor</h1>
              <Badge variant="default" className="text-[10px]">
                Active Context
              </Badge>
            </div>
            <p className="text-xs text-[#9AAFA5]">Contextual guidance synced with your live data</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0 mt-1">
                <Sparkles size={16} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#19D98A] text-[#050806] font-semibold shadow-md'
                  : 'bg-[#0B110E] text-[#F5FFF9] border border-white/[0.08] shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">{m.text}</div>
              <div
                className={`text-[10px] mt-2 text-right ${
                  m.sender === 'user' ? 'text-black/60' : 'text-[#60756C]'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-white/[0.08] text-white flex items-center justify-center shrink-0 mt-1">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="bg-[#0B110E] border border-white/[0.08] px-4 py-3 rounded-2xl flex items-center gap-1.5 text-xs text-[#9AAFA5]">
              <span className="w-2 h-2 rounded-full bg-[#19D98A] animate-pulse" />
              <span>Analyzing financial model...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-[#9AAFA5] hover:text-white transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="shrink-0 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Ask anything about your budget, savings, or spending..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm bg-[#0B110E] border-white/[0.1] rounded-2xl h-12"
          />
          <Button type="submit" disabled={!input.trim()} className="h-12 px-5 rounded-2xl">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  )
}
