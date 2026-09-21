'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Smartphone, X } from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { IOSInstallSheet } from './ios-install-sheet'

export function InstallBanner() {
  const { isInstalled, isIOS, canPrompt, promptInstall } = usePWAInstall()
  const [dismissed, setDismissed] = useState(true)
  const [showIOSSheet, setShowIOSSheet] = useState(false)

  useEffect(() => {
    // Check if dismissed previously in localStorage
    const isDismissed = localStorage.getItem('lifeplan_pwa_banner_dismissed')
    if (!isDismissed) {
      setDismissed(false)
    }
  }, [])

  if (isInstalled || dismissed) return null

  // If neither iOS nor canPrompt, don't show prompt banner
  if (!isIOS && !canPrompt) return null

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('lifeplan_pwa_banner_dismissed', 'true')
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSSheet(true)
    } else if (canPrompt) {
      await promptInstall()
    }
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-md mx-auto z-40"
        >
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B110E]/95 backdrop-blur-xl border border-[#19D98A]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(25,217,138,0.15)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#063B28] to-[#19D98A] flex items-center justify-center text-[#050806] shrink-0 font-bold shadow-[0_0_12px_rgba(25,217,138,0.3)]">
                <Smartphone size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Make LifePlan an App</h4>
                <p className="text-[11px] text-[#9AAFA5] leading-tight mt-0.5">
                  Install on your Home Screen for instantaneous offline access.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-lg bg-[#19D98A] text-[#050806] font-bold text-xs hover:bg-[#3EE8A2] active:scale-95 transition-all shadow-[0_2px_8px_rgba(25,217,138,0.3)]"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-[#60756C] hover:text-[#9AAFA5] transition-colors"
                aria-label="Dismiss banner"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <IOSInstallSheet
        isOpen={showIOSSheet}
        onClose={() => setShowIOSSheet(false)}
      />
    </>
  )
}
