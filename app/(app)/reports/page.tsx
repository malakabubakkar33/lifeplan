'use client'

import React, { useState } from 'react'
import {
  FileSpreadsheet,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  FileText,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const {
    financialProfile,
    userProfile,
    currency,
    transactions,
    bills,
    savingsGoals,
    familyMembers,
    exportAllDataJSON,
    importDataJSON,
    resetToDemoData,
  } = useFinancialData()

  const [message, setMessage] = useState('')

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Description', 'Amount', 'Payment Method', 'Notes']
    const rows = transactions.map((t) => [
      t.id,
      t.transaction_date,
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.payment_method || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `LifePlan_Transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadJSON = () => {
    const jsonStr = exportAllDataJSON()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `LifePlan_Backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (importDataJSON(content)) {
        setMessage('Backup restored successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to restore backup file.')
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  const handlePrint = () => {
    window.print()
  }

  const salary = financialProfile.monthly_salary || 7500
  const totalNeeds =
    (financialProfile.rent || 0) +
    (financialProfile.utilities || 0) +
    (financialProfile.groceries || 0) +
    (financialProfile.transportation || 0) +
    (financialProfile.debt || 0)
  const totalSavings = (financialProfile.savings_target || 0) + (financialProfile.emergency_target || 0)
  const totalFamily = familyMembers.reduce((s, m) => s + m.monthly_budget, 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Health Report & Vault
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Audit-grade monthly financial report, tax CSV exports, and offline vault backups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={handlePrint} className="gap-2 text-xs font-semibold">
            <Printer size={15} />
            Print Report
          </Button>
          <Button onClick={handleDownloadCSV} className="gap-2 text-xs font-bold">
            <Download size={15} />
            Export CSV
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-[#19D98A]/15 border border-[#19D98A]/30 text-[#19D98A] text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Printable Report Document Card */}
      <Card className="bg-[#0B110E] border-white/[0.08] shadow-2xl print:border-none print:shadow-none">
        <CardContent className="p-6 sm:p-10 space-y-8">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#19D98A] text-[#050806] flex items-center justify-center font-bold">
                  LP
                </div>
                <span className="text-xl font-black text-white">LifePlan Monthly Statement</span>
              </div>
              <p className="text-xs text-[#60756C] mt-1">
                Statement Period: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#9AAFA5]">Account Holder</div>
              <div className="text-base font-bold text-white">{userProfile.full_name || 'Alex Morgan'}</div>
              <div className="text-xs text-[#60756C]">{userProfile.email || 'alex@lifeplan.app'}</div>
            </div>
          </div>

          {/* Health Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#19D98A]/10 to-transparent border border-[#19D98A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#19D98A] uppercase tracking-wider">
                Overall Financial Health Rating
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">Tier 1: Exceptional Security</h2>
              <p className="text-xs text-[#9AAFA5] mt-1 max-w-lg">
                Your low debt ratio, high savings rate (26%), and robust emergency fund place your household
                in the top tier of financial resilience.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#050806]/80 px-4 py-2.5 rounded-xl border border-white/[0.06]">
              <div className="text-3xl font-black text-[#19D98A]">92</div>
              <div className="text-[10px] text-[#9AAFA5] leading-tight">
                out of<br />100 pts
              </div>
            </div>
          </div>

          {/* Core Balance Sheet Table */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Monthly Cash Flow Architecture
            </h3>
            <div className="border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 bg-white/[0.03] p-3 text-xs font-semibold text-[#9AAFA5]">
                <span>Component</span>
                <span>Allocation Category</span>
                <span className="text-right">Monthly Amount</span>
              </div>

              <div className="divide-y divide-white/[0.04] text-xs">
                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Monthly Take-Home Salary</span>
                  <span className="text-[#19D98A]">Primary Inflow</span>
                  <span className="text-right font-black text-[#19D98A]">
                    +{formatMoney(salary, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Housing (Rent/Mortgage)</span>
                  <span className="text-[#9AAFA5]">Fixed Necessity (50% rule)</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(financialProfile.rent || 0, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Household Groceries & Food</span>
                  <span className="text-[#9AAFA5]">Living Necessity</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(financialProfile.groceries || 0, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Utilities & Subscriptions</span>
                  <span className="text-[#9AAFA5]">Fixed Operations</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(financialProfile.utilities || 0, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Transportation & Fuel</span>
                  <span className="text-[#9AAFA5]">Commute</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(financialProfile.transportation || 0, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Debt Installments</span>
                  <span className="text-[#9AAFA5]">Liabilities</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(financialProfile.debt || 0, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center">
                  <span className="font-bold text-white">Family & Child Allowances</span>
                  <span className="text-[#9AAFA5]">Household Dependents</span>
                  <span className="text-right font-bold text-white">
                    -{formatMoney(totalFamily, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3.5 items-center bg-[#19D98A]/5">
                  <span className="font-bold text-[#19D98A]">Savings & Emergency Accumulation</span>
                  <span className="text-[#19D98A]">Wealth & Reserve Building</span>
                  <span className="text-right font-black text-[#19D98A]">
                    {formatMoney(totalSavings, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Vault Management */}
      <Card className="bg-[#0B110E]">
        <CardHeader className="border-b border-white/[0.04] pb-4">
          <CardTitle className="text-base font-bold text-white">Data Vault & Portability</CardTitle>
          <p className="text-xs text-[#9AAFA5]">
            You own 100% of your financial records. Export encrypted JSON snapshots or restore at any time.
          </p>
        </CardHeader>
        <CardContent className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleDownloadJSON} className="gap-2 text-xs">
              <Download size={15} />
              Export JSON Vault Backup
            </Button>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#101A15] hover:bg-white/[0.06] text-white text-xs font-semibold cursor-pointer transition-colors">
              <Upload size={15} className="text-[#19D98A]" />
              Restore Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset to standard demo financial data?')) resetToDemoData()
            }}
            className="text-xs text-[#E05252] hover:underline font-semibold flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            Reset to Sample Seed Data
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
