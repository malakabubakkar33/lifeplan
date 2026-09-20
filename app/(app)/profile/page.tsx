'use client'

import React from 'react'
import Link from 'next/link'
import {
  User,
  ShieldCheck,
  Mail,
  Calendar,
  Settings,
  DollarSign,
  FileSpreadsheet,
  ArrowRight,
  LogOut,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { formatMoney } from '@/lib/finance/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { userProfile, financialProfile, currency } = useFinancialData()

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          User Account & Security
        </h1>
        <p className="text-sm text-[#9AAFA5] mt-0.5">
          Manage your personal credentials, subscription tier, and vault security.
        </p>
      </div>

      {/* Main Profile Hero Card */}
      <Card className="bg-[#0B110E] border-white/[0.08]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-black text-2xl shadow-[0_0_30px_rgba(25,217,138,0.25)]">
                {userProfile.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">{userProfile.full_name || 'Alex Morgan'}</h2>
                  <Badge variant="default" className="text-[10px]">
                    Pro Vault
                  </Badge>
                </div>
                <p className="text-xs text-[#9AAFA5] mt-1 flex items-center gap-1.5">
                  <Mail size={13} /> {userProfile.email || 'alex.morgan@lifeplan.app'}
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Settings size={14} />
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/[0.04]">
            <div className="p-3 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Primary Currency</div>
              <div className="text-sm font-bold text-white mt-0.5">{currency}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Monthly Salary</div>
              <div className="text-sm font-bold text-[#19D98A] mt-0.5">
                {formatMoney(financialProfile.monthly_salary || 7500, currency)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02]">
              <div className="text-xs text-[#60756C]">Payday Schedule</div>
              <div className="text-sm font-bold text-white mt-0.5">
                Every {financialProfile.payday || 28}th of month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Links */}
      <div className="space-y-2">
        <Link
          href="/reports"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-white/20 transition-all text-sm font-semibold text-white group"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={18} className="text-[#19D98A]" />
            <span>View Monthly Statement & Audit Report</span>
          </div>
          <ArrowRight size={16} className="text-[#60756C] group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/settings"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#0B110E] border border-white/[0.06] hover:border-white/20 transition-all text-sm font-semibold text-white group"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-[#63F2B0]" />
            <span>Vault Security & Sync Preferences</span>
          </div>
          <ArrowRight size={16} className="text-[#60756C] group-hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  )
}
