'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppAuth } from '@/components/providers/auth-provider'
import { motion } from 'framer-motion'

export default function SplashPage() {
  const { isLoaded, isSignedIn, isLiveClerk } = useAppAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<'splash' | 'done'>('splash')

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('done')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase === 'done' && isLoaded) {
      if (isSignedIn) {
        // Check if onboarding was completed
        const onboardingDone = localStorage.getItem('lifeplan_onboarding_done')
        if (!onboardingDone) {
          router.replace('/onboarding')
        } else {
          router.replace('/home')
        }
      } else {
        const onboardingDone = localStorage.getItem('lifeplan_onboarding_done')
        if (!onboardingDone) {
          router.replace('/onboarding')
        } else {
          router.replace('/sign-in')
        }
      }
    }
  }, [phase, isLoaded, isSignedIn, router])

  return (
    <div className="splash-screen" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(25,217,138,0.12) 0%, transparent 70%), #050806',
      zIndex: 9999,
    }}>
      {/* Animated background orbs */}
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25,217,138,0.08) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo + wordmark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1 }}
      >
        {/* Logo mark */}
        <motion.div
          animate={{ boxShadow: ['0 0 20px rgba(25,217,138,0.2)', '0 0 40px rgba(25,217,138,0.4)', '0 0 20px rgba(25,217,138,0.2)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #063B28 0%, #0B6B45 50%, #19D98A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Leaf + upward graph */}
            <path
              d="M24 40 C16 35, 8 26, 10 16 C12 8, 22 6, 28 12 C32 16, 30 24, 24 28"
              stroke="#F5FFF9"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M14 32 L20 24 L26 28 L36 14"
              stroke="#19D98A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M32 14 L36 14 L36 18"
              stroke="#19D98A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#F5FFF9',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            Life<span style={{ color: '#19D98A' }}>Plan</span>
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#9AAFA5',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Plan Today. Secure Tomorrow.
          </p>
        </motion.div>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 60,
          display: 'flex',
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#19D98A' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </div>
  )
}
