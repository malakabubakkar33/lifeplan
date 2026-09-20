'use client'

import React, { useState } from 'react'
import {
  Settings,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Trash2,
  CheckCircle2,
  Globe,
  Database,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { CURRENCIES } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const {
    userProfile,
    financialProfile,
    currency,
    updateUserProfile,
    updateFinancialProfile,
    resetToDemoData,
  } = useFinancialData()

  const [name, setName] = useState(userProfile.full_name || '')
  const [email, setEmail] = useState(userProfile.email || '')
  const [selectedCurrency, setSelectedCurrency] = useState(currency)
  const [payday, setPayday] = useState(financialProfile.payday?.toString() || '28')
  const [billReminders, setBillReminders] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile({
      full_name: name,
      email,
      currency: selectedCurrency,
    })
    updateFinancialProfile({
      payday: parseInt(payday, 10) || 28,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Configure regional currency, notification rules, and vault preferences.
          </p>
        </div>

        <Button onClick={handleSave} className="self-start sm:self-auto gap-2 text-xs font-bold">
          {isSaved ? <CheckCircle2 size={16} /> : <Settings size={16} />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Preferences'}</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <CardTitle className="text-base font-bold text-white">Profile & Identity</CardTitle>
            <p className="text-xs text-[#9AAFA5]">Your primary account information</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">Email Address</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Financial Timing */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <CardTitle className="text-base font-bold text-white">Currency & Timing</CardTitle>
            <p className="text-xs text-[#9AAFA5]">
              Configure formatting and monthly salary countdown triggers
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                  Operating Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-[#101A15] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#19D98A]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code} - {c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9AAFA5] block mb-2">
                  Monthly Payday (Day 1-31)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={payday}
                  onChange={(e) => setPayday(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <CardTitle className="text-base font-bold text-white">Alert Preferences</CardTitle>
            <p className="text-xs text-[#9AAFA5]">Control in-app alerts and notifications</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div>
                <div className="text-sm font-semibold text-white">Bill Due Date Alerts</div>
                <div className="text-xs text-[#9AAFA5]">
                  Get alerted 48 hours before any scheduled recurring payment
                </div>
              </div>
              <Switch checked={billReminders} onCheckedChange={setBillReminders} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div>
                <div className="text-sm font-semibold text-white">Budget Caution Thresholds</div>
                <div className="text-xs text-[#9AAFA5]">
                  Receive notifications when any category hits 80% utilization
                </div>
              </div>
              <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
            </div>
          </CardContent>
        </Card>

        {/* Database & Cloud Sync Status */}
        <Card className="bg-[#0B110E]">
          <CardHeader className="border-b border-white/[0.04] pb-4">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-[#19D98A]" />
              <CardTitle className="text-base font-bold text-white">Storage & Sync Engine</CardTitle>
            </div>
            <p className="text-xs text-[#9AAFA5]">Local offline vault and Supabase PostgreSQL persistence</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#9AAFA5]">Client Storage Vault</span>
              <span className="text-[#19D98A] font-bold">IndexedDB / LocalStorage Active</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#9AAFA5]">PWA Service Worker</span>
              <span className="text-[#19D98A] font-bold">Registered (Offline Enabled)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#9AAFA5]">Supabase PostgreSQL Sync</span>
              <span className="text-[#63F2B0] font-bold">Ready for Cloud Credentials</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-[#150A0A] border-[#E05252]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#E05252]">Danger Zone</CardTitle>
            <p className="text-xs text-[#9AAFA5]">Irreversible actions for testing and data management</p>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0">
            <div>
              <div className="text-xs font-semibold text-white">Reset Application Data</div>
              <div className="text-[11px] text-[#9AAFA5]">
                Clear your custom data and restore default demo state
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to reset all data to default demo state?')) {
                  resetToDemoData()
                }
              }}
              className="text-xs font-bold gap-1.5"
            >
              <Trash2 size={14} />
              Reset Data
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
