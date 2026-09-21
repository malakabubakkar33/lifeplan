'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050806]"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(25,217,138,0.12) 0%, transparent 70%), #050806',
      }}
    >
      {/* Background radial glow animation */}
      <motion.div
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25,217,138,0.12) 0%, transparent 70%)',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center Logo and Wordmark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-5 z-10"
      >
        {/* Logo Shield / Mark */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 25px rgba(25,217,138,0.25)',
              '0 0 50px rgba(25,217,138,0.45)',
              '0 0 25px rgba(25,217,138,0.25)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-22 h-22 rounded-3xl bg-gradient-to-br from-[#063B28] via-[#0B6B45] to-[#19D98A] flex items-center justify-center p-0.5"
        >
          <div className="w-full h-full bg-[#070B09] rounded-[22px] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
              <path
                d="M32 14 L36 14 L36 18"
                stroke="#19D98A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Life<span className="text-[#19D98A]">Plan</span>
          </h1>
          <p className="text-xs font-semibold text-[#9AAFA5] uppercase tracking-widest mt-1">
            Plan Today. Secure Tomorrow.
          </p>
        </div>
      </motion.div>

      {/* Subtle loader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-16 flex items-center gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-[#19D98A]"
          />
        ))}
      </motion.div>
    </div>
  )
}
