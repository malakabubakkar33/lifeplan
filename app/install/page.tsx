'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Smartphone,
  Apple,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Share,
  PlusSquare,
  Download,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { IOSInstallSheet } from '@/components/pwa/ios-install-sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function InstallPage() {
  const { isInstalled, isIOS, isAndroid, isDesktop, canPrompt, promptInstall } = usePWAInstall()
  const [showIOSSheet, setShowIOSSheet] = useState(false)
  const [installedSuccess, setInstalledSuccess] = useState(false)

  const handleInstallAction = async () => {
    if (isIOS) {
      setShowIOSSheet(true)
    } else if (canPrompt) {
      const res = await promptInstall()
      if (res) setInstalledSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#050806] text-[#F5FFF9] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9AAFA5] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to LifePlan
          </Link>

          <Badge variant={isInstalled ? 'default' : 'secondary'} className="text-xs">
            {isInstalled ? '● App Installed' : canPrompt || isIOS ? '● Install Ready' : '● Web Mode'}
          </Badge>
        </div>

        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-[#0B1410] via-[#0B110E] to-[#050806] border-[#19D98A]/30 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <CardContent className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] mx-auto flex items-center justify-center text-[#050806] shadow-[0_0_30px_rgba(25,217,138,0.35)]">
              <ShieldCheck size={36} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Install LifePlan PWA
              </h1>
              <p className="text-sm text-[#9AAFA5] mt-1 max-w-md mx-auto">
                Get the full native application experience on your phone or desktop. Instant launch, offline persistence, and zero browser chrome.
              </p>
            </div>

            {/* Current Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
              <span className="text-[#9AAFA5]">Current Status:</span>
              {isInstalled || installedSuccess ? (
                <span className="font-bold text-[#19D98A] flex items-center gap-1">
                  <CheckCircle2 size={14} /> Installed (Standalone Mode)
                </span>
              ) : canPrompt || isIOS ? (
                <span className="font-bold text-[#63F2B0] flex items-center gap-1">
                  <Sparkles size={14} /> Ready for 1-Tap Installation
                </span>
              ) : (
                <span className="font-bold text-[#9AAFA5] flex items-center gap-1">
                  <AlertCircle size={14} /> Running in Standard Browser
                </span>
              )}
            </div>

            {/* Primary Action Button */}
            {(!isInstalled && !installedSuccess) && (
              <div className="pt-2">
                <Button
                  onClick={handleInstallAction}
                  className="w-full sm:w-auto px-8 py-3 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2] text-sm shadow-[0_4px_20px_rgba(25,217,138,0.3)]"
                >
                  <Download size={16} className="mr-2" />
                  Install LifePlan on This Device
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Specific Instructions Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Platform Instructions</h2>

          {/* iOS Card */}
          <div className={`p-5 rounded-2xl bg-[#0B110E] border transition-all ${isIOS ? 'border-[#19D98A]/40 shadow-[0_0_20px_rgba(25,217,138,0.1)]' : 'border-white/[0.06]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white">
                  <Apple size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">iPhone & iPad (Safari)</h3>
              </div>
              {isIOS && <Badge variant="default" className="text-[10px]">Your Device</Badge>}
            </div>

            <ol className="space-y-2 text-xs text-[#9AAFA5]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[#19D98A] font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>Open LifePlan in Apple Safari.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[#19D98A] font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <span className="flex items-center gap-1.5">
                  Tap the <Share size={13} className="text-[#19D98A]" /> <strong>Share</strong> button on the bottom bar.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[#19D98A] font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <span className="flex items-center gap-1.5">
                  Select <PlusSquare size={13} className="text-[#19D98A]" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[#19D98A] font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                <span>Tap <strong>Add</strong> in the top-right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSSheet(true)}
              className="mt-4 text-xs font-bold text-[#19D98A] hover:underline flex items-center gap-1"
            >
              View Step-By-Step Visual Guide →
            </button>
          </div>

          {/* Android Card */}
          <div className={`p-5 rounded-2xl bg-[#0B110E] border transition-all ${isAndroid ? 'border-[#19D98A]/40 shadow-[0_0_20px_rgba(25,217,138,0.1)]' : 'border-white/[0.06]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-[#19D98A]">
                  <Smartphone size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">Android (Chrome / Edge / Samsung)</h3>
              </div>
              {isAndroid && <Badge variant="default" className="text-[10px]">Your Device</Badge>}
            </div>

            <p className="text-xs text-[#9AAFA5] leading-relaxed">
              When prompted, tap <strong>Install App</strong> or open the browser menu (three dots) and tap <strong>Add to Home screen</strong> or <strong>Install application</strong>.
            </p>

            {canPrompt && (
              <Button
                onClick={() => promptInstall()}
                className="mt-4 text-xs h-9 bg-[#19D98A] text-[#050806] font-bold hover:bg-[#3EE8A2]"
              >
                Trigger Android Install
              </Button>
            )}
          </div>

          {/* Desktop Card */}
          <div className={`p-5 rounded-2xl bg-[#0B110E] border transition-all ${isDesktop ? 'border-[#19D98A]/40' : 'border-white/[0.06]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white">
                  <Laptop size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">Desktop (Chrome / Edge / Safari)</h3>
              </div>
              {isDesktop && <Badge variant="default" className="text-[10px]">Your Device</Badge>}
            </div>

            <p className="text-xs text-[#9AAFA5] leading-relaxed">
              In Google Chrome or Microsoft Edge, click the <strong>Install icon</strong> in the right side of the address bar. LifePlan will open in an isolated desktop window.
            </p>
          </div>
        </div>
      </div>

      <IOSInstallSheet
        isOpen={showIOSSheet}
        onClose={() => setShowIOSSheet(false)}
      />
    </div>
  )
}
