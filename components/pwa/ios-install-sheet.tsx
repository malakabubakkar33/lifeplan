'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share, PlusSquare, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react'

interface IOSInstallSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function IOSInstallSheet({ isOpen, onClose }: IOSInstallSheetProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Bottom Sheet / Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0B110E] border-t sm:border border-white/[0.1] rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          {/* Grab handle for mobile */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] text-[#9AAFA5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] p-0.5 flex items-center justify-center shadow-[0_0_25px_rgba(25,217,138,0.3)]">
              <div className="w-full h-full bg-[#050806] rounded-[14px] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
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
              <h3 className="text-xl font-black text-white tracking-tight">Add LifePlan to Home Screen</h3>
              <p className="text-xs text-[#9AAFA5] mt-0.5">Install on your iPhone in 4 quick taps</p>
            </div>
          </div>

          {/* Visual Step Cards */}
          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101A15] border border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Tap the Safari Share button</span>
                  <div className="inline-flex items-center justify-center p-1 rounded-md bg-[#050806] text-[#19D98A] border border-white/[0.1]">
                    <Share size={15} />
                  </div>
                </div>
                <p className="text-xs text-[#9AAFA5] mt-0.5">
                  Located at the bottom of Safari's browser toolbar.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101A15] border border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Choose "Add to Home Screen"</span>
                  <div className="inline-flex items-center justify-center p-1 rounded-md bg-[#050806] text-[#19D98A] border border-white/[0.1]">
                    <PlusSquare size={15} />
                  </div>
                </div>
                <p className="text-xs text-[#9AAFA5] mt-0.5">
                  Scroll down the share sheet menu to find this option.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101A15] border border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-[#19D98A]/15 text-[#19D98A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Tap "Add" in top-right corner</span>
                  <span className="text-xs font-bold text-[#19D98A] px-2 py-0.5 rounded bg-[#19D98A]/10 border border-[#19D98A]/20">
                    Add
                  </span>
                </div>
                <p className="text-xs text-[#9AAFA5] mt-0.5">
                  Confirm the installation without any App Store download.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101A15] border border-[#19D98A]/20 shadow-[0_0_15px_rgba(25,217,138,0.05)]">
              <div className="w-7 h-7 rounded-lg bg-[#19D98A] text-[#050806] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-[#F5FFF9]">Launch LifePlan like a native app</span>
                <p className="text-xs text-[#9AAFA5] mt-0.5">
                  Opens full-screen with offline support and zero browser bars.
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F8C5C] to-[#19D98A] text-[#050806] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(25,217,138,0.3)]"
            >
              Got It, Let's Install
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
