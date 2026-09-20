'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  CalendarClock,
  Target,
  AlertTriangle,
  Info,
  ChevronRight,
  CheckCheck,
} from 'lucide-react'
import { useFinancialData } from '@/lib/context/financial-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useFinancialData()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true))
  const unreadTotal = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-[#9AAFA5] mt-0.5">
            Automated alerts for pending bills, savings milestones, and budget thresholds.
          </p>
        </div>

        {unreadTotal > 0 && (
          <Button
            variant="outline"
            onClick={markAllNotificationsRead}
            className="self-start sm:self-auto gap-2 text-xs font-semibold"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-[#19D98A] text-[#050806]'
              : 'bg-[#101A15] text-[#9AAFA5] hover:text-white border border-white/[0.06]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'unread'
              ? 'bg-[#19D98A] text-[#050806]'
              : 'bg-[#101A15] text-[#9AAFA5] hover:text-white border border-white/[0.06]'
          }`}
        >
          Unread ({unreadTotal})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B110E] border border-white/[0.06]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#60756C] flex items-center justify-center mx-auto mb-3">
              <Bell size={24} />
            </div>
            <h3 className="text-base font-bold text-white">All caught up!</h3>
            <p className="text-xs text-[#9AAFA5] mt-1">No unread alerts at this time.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const isBill = notif.type === 'bill'
            const isGoal = notif.type === 'goal'
            const isWarning = notif.type === 'warning'

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !notif.read
                    ? 'bg-[#0B110E] border-[#19D98A]/30 shadow-[0_0_20px_rgba(25,217,138,0.05)]'
                    : 'bg-white/[0.02] border-white/[0.04] opacity-75'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isBill
                        ? 'bg-[#E09B35]/15 text-[#E09B35]'
                        : isGoal
                        ? 'bg-[#19D98A]/15 text-[#19D98A]'
                        : isWarning
                        ? 'bg-[#E05252]/15 text-[#E05252]'
                        : 'bg-white/[0.06] text-white'
                    }`}
                  >
                    {isBill ? (
                      <CalendarClock size={18} />
                    ) : isGoal ? (
                      <Target size={18} />
                    ) : isWarning ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Info size={18} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          !notif.read ? 'text-white' : 'text-[#9AAFA5]'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#19D98A] shadow-[0_0_8px_#19D98A]" />
                      )}
                    </div>
                    <p className="text-xs text-[#9AAFA5] mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-[#60756C] mt-2 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {notif.action_url && (
                  <Link
                    href={notif.action_url}
                    className="p-2 text-[#60756C] hover:text-[#19D98A] hover:bg-white/[0.04] rounded-lg transition-colors shrink-0"
                    title="View details"
                  >
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
