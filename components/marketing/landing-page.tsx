'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Users,
  CalendarClock,
  Target,
  BarChart3,
  Bot,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Apple,
  Laptop,
  Check,
  HelpCircle,
  PiggyBank,
  Percent,
} from 'lucide-react'
import { IOSInstallSheet } from '@/components/pwa/ios-install-sheet'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function LandingPage() {
  const { isIOS, isInstalled } = usePWAInstall()
  const [showIOSSheet, setShowIOSSheet] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How is LifePlan different from typical budgeting apps?',
      a: 'LifePlan is engineered around your monthly salary cycle rather than arbitrary calendar months. It automatically applies the proven 50/30/20 framework to your actual rent, bills, groceries, and debt, giving you a live daily safe-to-spend discretionary balance so you never run out before payday.',
    },
    {
      q: 'Does LifePlan work on my iPhone Home Screen as an app?',
      a: 'Yes! LifePlan is a full Progressive Web App (PWA). You can install it straight to your iPhone Home Screen via Safari Share → Add to Home Screen, or 1-tap install on Android and Desktop. It runs standalone without browser address bars.',
    },
    {
      q: 'How does Family and Children expense management work?',
      a: 'You can add family members (spouse, children, dependents) and assign individual monthly budgets. For children, you get dedicated categorization for school tuition, uniforms, books, pediatric healthcare, and sports activities.',
    },
    {
      q: 'What happens when a new month starts?',
      a: 'LifePlan automatically rolls over into a fresh monthly planning period. Your recurring bills, salary parameters, savings targets, and family members carry forward automatically, while the previous month is permanently archived as an immutable historical record.',
    },
    {
      q: 'Is my financial information private and secure?',
      a: 'Absolutely. Authentication is powered by enterprise-grade Clerk identity with multi-factor authentication. Every financial record is bound to your private user ID, isolated behind PostgreSQL Row Level Security (RLS), and never shared or sold.',
    },
  ]

  const featureCards = [
    {
      icon: Wallet,
      title: 'Smart Salary Planning',
      desc: 'Automatic 50/30/20 allocation tailored to your specific rent, utilities, and grocery commitments.',
      badge: 'Core Engine',
    },
    {
      icon: Users,
      title: 'Family & Children Ledgers',
      desc: 'Track allowances, school fees, pediatric healthcare, and family member spending in real time.',
      badge: 'Household',
    },
    {
      icon: CalendarClock,
      title: 'Bills & Subscriptions',
      desc: 'Never miss an electricity, tuition, or insurance bill with countdowns and 1-tap paid settlement.',
      badge: 'Due Dates',
    },
    {
      icon: Target,
      title: 'Savings & Emergency Vaults',
      desc: 'Track 3-6 months of liquid living expenses and dedicated milestone vaults with deadlines.',
      badge: 'Reserves',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Trends',
      desc: 'Visual inflow vs. outflow, category breakdown donuts, and savings rate trajectory with Recharts.',
      badge: 'Insights',
    },
    {
      icon: Calendar,
      title: 'Previous Month History',
      desc: 'Explore every past closed monthly statement without overwriting historical financial reality.',
      badge: 'Archive',
    },
    {
      icon: Bot,
      title: 'AI Financial Assistant',
      desc: 'Authorized contextual intelligence analyzing your real daily limits, debt payoff, and savings capacity.',
      badge: 'Intelligence',
    },
    {
      icon: Smartphone,
      title: 'Native PWA Experience',
      desc: 'Instant installation on iPhone and Android with offline-friendly cache resilience and zero lag.',
      badge: 'Mobile-First',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050806] text-[#F5FFF9] selection:bg-[#19D98A]/30 selection:text-[#19D98A]">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#063B28] via-[#0B6B45] to-[#19D98A] text-[#050806] text-xs font-bold py-2 px-4 text-center">
        <span>✨ Welcome to LifePlan PWA — Installable on iPhone, Android & Desktop. No app store needed!</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#050806]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(25,217,138,0.25)]">
              <div className="w-full h-full bg-[#070B09] rounded-[10px] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M24 40 C16 35, 8 26, 10 16 C12 8, 22 6, 28 12 C32 16, 30 24, 24 28"
                    stroke="#F5FFF9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M14 32 L20 24 L26 28 L36 14"
                    stroke="#19D98A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Life<span className="text-[#19D98A]">Plan</span>
              </span>
              <p className="text-[10px] text-[#60756C] font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                Plan Today. Secure Tomorrow.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#9AAFA5]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pwa" className="hover:text-white transition-colors">PWA Install</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-xs font-bold text-[#9AAFA5] hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/setup"
              className="px-4 py-2 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-xs hover:bg-[#3EE8A2] active:scale-95 transition-all shadow-[0_2px_12px_rgba(25,217,138,0.3)]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#19D98A]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* PWA Badges Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#0B110E] border border-white/[0.08] mb-6 shadow-inner">
            <span className="px-2.5 py-0.5 rounded-xl bg-[#19D98A]/15 text-[#19D98A] text-[11px] font-bold">
              ● Progressive Web App
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#9AAFA5] font-semibold px-2">
              <Apple size={12} /> iPhone
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-[11px] text-[#9AAFA5] font-semibold px-2">
              <Smartphone size={12} /> Android
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-[11px] text-[#9AAFA5] font-semibold px-2">
              <Laptop size={12} /> Desktop
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.08]">
            Take Control of <br />
            <span className="bg-gradient-to-r from-white via-[#F5FFF9] to-[#19D98A] bg-clip-text text-transparent">
              Your Monthly Salary
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-[#9AAFA5] max-w-2xl mx-auto mt-5 leading-relaxed font-normal">
            Plan your salary, manage household expenses, track children&apos;s education costs, automate recurring bills, and build your emergency runway — all in one elegant mobile app.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 max-w-md mx-auto">
            <Link
              href="/setup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#19D98A] text-[#050806] font-extrabold text-sm sm:text-base hover:bg-[#3EE8A2] active:scale-98 transition-all shadow-[0_8px_30px_rgba(25,217,138,0.35)] flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={() => {
                if (isIOS) setShowIOSSheet(true)
                else window.location.href = '/install'
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#101A15] text-white font-bold text-sm sm:text-base border border-white/[0.1] hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2"
            >
              <Smartphone size={18} className="text-[#19D98A]" />
              <span>Install PWA</span>
            </button>
          </div>

          {/* Value Badges Below Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-12 text-left">
            <div className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
              <div className="text-xs text-[#60756C] font-semibold">Budget Engine</div>
              <div className="text-sm font-black text-white mt-0.5">50/30/20 Framework</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
              <div className="text-xs text-[#60756C] font-semibold">Runway Health</div>
              <div className="text-sm font-black text-[#19D98A] mt-0.5">6 Mos Safe Buffer</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
              <div className="text-xs text-[#60756C] font-semibold">Household</div>
              <div className="text-sm font-black text-white mt-0.5">Children Ledgers</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B110E] border border-white/[0.06]">
              <div className="text-xs text-[#60756C] font-semibold">Data Privacy</div>
              <div className="text-sm font-black text-[#63F2B0] mt-0.5">Postgres RLS Guard</div>
            </div>
          </div>

          {/* Interactive Mobile Phone Preview */}
          <div className="mt-14 max-w-sm sm:max-w-md mx-auto relative">
            {/* Emerald glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#19D98A]/20 via-[#0B6B45]/10 to-transparent blur-3xl -z-10 rounded-[48px]" />

            {/* Phone Chassis */}
            <div className="p-3 bg-[#070B09] rounded-[48px] border-4 border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(25,217,138,0.15)]">
              {/* Dynamic Island / Speaker */}
              <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>

              {/* Phone Screen Mockup Content */}
              <div className="bg-[#050806] rounded-[36px] p-4 text-left space-y-4 border border-white/[0.06] overflow-hidden">
                {/* App Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F8C5C] to-[#19D98A] flex items-center justify-center text-[#050806] font-black text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-[10px] text-[#60756C]">Good morning</div>
                      <div className="text-xs font-bold text-white leading-none">Alex Morgan</div>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#101A15] flex items-center justify-center text-[#19D98A]">
                    <Sparkles size={14} />
                  </div>
                </div>

                {/* Salary Card */}
                <div className="p-4 rounded-2xl bg-[#0B110E] border border-[#19D98A]/25 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <div className="text-[10px] font-semibold text-[#9AAFA5]">Monthly Net Salary</div>
                  <div className="text-2xl font-black text-white mt-0.5">Rs. 150,000</div>
                  <div className="text-[10px] text-[#19D98A] font-bold mt-1">
                    Remaining: Rs. 58,500 (39%)
                  </div>

                  {/* Circular & Metric Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.04] text-[10px]">
                    <div>
                      <div className="text-[#60756C]">Planned</div>
                      <div className="font-bold text-white">Rs. 142k</div>
                    </div>
                    <div>
                      <div className="text-[#60756C]">Spent</div>
                      <div className="font-bold text-[#E05252]">Rs. 91.5k</div>
                    </div>
                    <div>
                      <div className="text-[#60756C]">Saved</div>
                      <div className="font-bold text-[#19D98A]">Rs. 30k</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-[#101A15] text-[#19D98A] font-bold border border-white/[0.04]">
                    + Expense
                  </div>
                  <div className="p-2 rounded-xl bg-[#101A15] text-white font-bold border border-white/[0.04]">
                    + Income
                  </div>
                  <div className="p-2 rounded-xl bg-[#101A15] text-white font-bold border border-white/[0.04]">
                    Pay Bill
                  </div>
                  <div className="p-2 rounded-xl bg-[#101A15] text-white font-bold border border-white/[0.04]">
                    + Goal
                  </div>
                </div>

                {/* Mini Categories */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-white">Monthly Plan</span>
                    <span className="text-[#19D98A]">62% Utilized</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B110E] border border-white/[0.04] flex items-center justify-between text-[11px]">
                    <span className="text-[#9AAFA5]">Housing & Rent</span>
                    <span className="font-bold text-white">Rs. 35,000</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B110E] border border-white/[0.04] flex items-center justify-between text-[11px]">
                    <span className="text-[#9AAFA5]">Children & School</span>
                    <span className="font-bold text-white">Rs. 15,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#070B09] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#19D98A]">Simple 4-Step Journey</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">How LifePlan Works</h2>
            <p className="text-sm text-[#9AAFA5] mt-2">
              From entering your paycheck to seeing daily safe-to-spend allowances in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] relative">
              <div className="w-10 h-10 rounded-xl bg-[#19D98A]/15 text-[#19D98A] font-black flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white">Setup Your Profile</h3>
              <p className="text-xs text-[#9AAFA5] mt-1.5 leading-relaxed">
                Enter your monthly salary, chosen currency, and payday cycle in our guided setup wizard.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] relative">
              <div className="w-10 h-10 rounded-xl bg-[#19D98A]/15 text-[#19D98A] font-black flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white">Configure Household</h3>
              <p className="text-xs text-[#9AAFA5] mt-1.5 leading-relaxed">
                Add spouse, dependents, and recurring obligations like rent, utilities, and school fees.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] relative">
              <div className="w-10 h-10 rounded-xl bg-[#19D98A]/15 text-[#19D98A] font-black flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white">Generate 50/30/20 Plan</h3>
              <p className="text-xs text-[#9AAFA5] mt-1.5 leading-relaxed">
                LifePlan computes optimal category targets and daily safe-to-spend limits with live sliders.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0B110E] border border-[#19D98A]/30 relative shadow-[0_0_25px_rgba(25,217,138,0.1)]">
              <div className="w-10 h-10 rounded-xl bg-[#19D98A] text-[#050806] font-black flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-white">Track & Secure</h3>
              <p className="text-xs text-[#9AAFA5] mt-1.5 leading-relaxed">
                Add expenses in seconds, settle bills on time, watch emergency reserves grow, and review past months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#19D98A]">Comprehensive Financial Suite</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Engineered For Real Life</h2>
            <p className="text-sm text-[#9AAFA5] mt-2">
              Every tool you need to manage your personal and household finances in one unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-3xl bg-[#0B110E] border border-white/[0.06] hover:border-[#19D98A]/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.04] text-[#19D98A] flex items-center justify-center group-hover:bg-[#19D98A]/15 transition-colors">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-[#60756C] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03]">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#19D98A] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#9AAFA5] mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PWA INSTALLATION SPOTLIGHT */}
      <section id="pwa" className="py-20 bg-gradient-to-b from-[#070B09] to-[#050806] border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-[36px] bg-[#0B110E] border border-[#19D98A]/25 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#19D98A]">Zero App Store Friction</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Install as a True Native Progressive Web App
              </h2>
              <p className="text-xs sm:text-sm text-[#9AAFA5] mt-3 leading-relaxed">
                Save space and launch instantly. LifePlan runs in full standalone mode with no browser URL bar, automatic service-worker caching, and offline access to your financial records.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    if (isIOS) setShowIOSSheet(true)
                    else window.location.href = '/install'
                  }}
                  className="px-6 py-3 rounded-xl bg-[#19D98A] text-[#050806] font-bold text-xs sm:text-sm hover:bg-[#3EE8A2] transition-all shadow-[0_4px_16px_rgba(25,217,138,0.3)] flex items-center gap-2"
                >
                  <Smartphone size={16} />
                  <span>Install on iPhone or Android</span>
                </button>
                <Link
                  href="/install"
                  className="px-5 py-3 rounded-xl bg-[#101A15] text-white font-semibold text-xs sm:text-sm border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                >
                  Desktop Instructions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY & PRIVACY SECTION */}
      <section id="security" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#19D98A]">Bank-Grade Isolation</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Your Financial Data Belongs Solely to You
              </h2>
              <p className="text-sm text-[#9AAFA5] mt-3 leading-relaxed">
                LifePlan does not sell your transactional data or share household ledgers. Everything is cryptographically partitioned by Clerk authentication tokens and Supabase Row Level Security.
              </p>

              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Clerk Identity Protection</h4>
                    <p className="text-xs text-[#9AAFA5] mt-0.5">MFA-ready secure login with zero plaintext credential handling.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">PostgreSQL Row Level Security</h4>
                    <p className="text-xs text-[#9AAFA5] mt-0.5">Enforced database-level user isolation preventing any cross-user data leakage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Encrypted Vault Exports</h4>
                    <p className="text-xs text-[#9AAFA5] mt-0.5">Download your complete transaction CSV and JSON backup with one tap anytime.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#0B110E] border border-white/[0.08] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#063B28] text-[#19D98A] flex items-center justify-center font-bold">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Privacy Architecture</h3>
                  <p className="text-xs text-[#9AAFA5]">Defense-in-depth engineering</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
                  <span className="text-[#9AAFA5]">Authentication Provider</span>
                  <span className="font-bold text-white">Clerk Enterprise</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
                  <span className="text-[#9AAFA5]">Database Layer</span>
                  <span className="font-bold text-white">Supabase PostgreSQL</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
                  <span className="text-[#9AAFA5]">Client Storage</span>
                  <span className="font-bold text-[#19D98A]">Zero Cloud Leakage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#070B09] border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#19D98A]">Answers & Guidance</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-[#0B110E] border border-white/[0.06] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#19D98A] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#60756C] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#19D98A]' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#9AAFA5] leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Take Command of <br />
            <span className="text-[#19D98A]">Your Financial Future?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9AAFA5] max-w-xl mx-auto mt-4">
            Join thousands of individuals and families who plan their salary today to secure tomorrow.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/setup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#19D98A] text-[#050806] font-extrabold text-sm sm:text-base hover:bg-[#3EE8A2] active:scale-98 transition-all shadow-[0_8px_30px_rgba(25,217,138,0.35)]"
            >
              Get Started Free Now
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#101A15] text-white font-bold text-sm sm:text-base border border-white/[0.1] hover:bg-white/[0.04] transition-all"
            >
              Returning Member Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#070B09] border-t border-white/[0.06] py-12 text-xs text-[#9AAFA5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#19D98A] text-[#050806] flex items-center justify-center font-black">
              L
            </div>
            <span className="font-bold text-white">LifePlan</span>
            <span className="text-[#60756C]">© 2026. Plan Today. Secure Tomorrow.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/install" className="hover:text-white transition-colors">Install App</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/setup" className="hover:text-white transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>

      {/* iOS Safari Instruction Sheet */}
      <IOSInstallSheet
        isOpen={showIOSSheet}
        onClose={() => setShowIOSSheet(false)}
      />
    </div>
  )
}
