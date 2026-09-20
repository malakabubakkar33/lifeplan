'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 1,
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="rgba(25,217,138,0.08)" stroke="rgba(25,217,138,0.2)" strokeWidth="1.5" />
        <path d="M25 50 L35 38 L43 44 L55 28" stroke="#19D98A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M51 28 L55 28 L55 32" stroke="#19D98A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="52" width="36" height="3" rx="1.5" fill="#063B28" />
        <circle cx="35" cy="38" r="3" fill="#19D98A" />
        <circle cx="43" cy="44" r="3" fill="#63F2B0" />
        <circle cx="55" cy="28" r="4" fill="#19D98A" />
      </svg>
    ),
    headline: 'Take Control of Your Money',
    description: 'Manage your salary, expenses, bills and savings from one simple and beautiful place.',
    accent: '#19D98A',
  },
  {
    id: 2,
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="rgba(25,217,138,0.08)" stroke="rgba(25,217,138,0.2)" strokeWidth="1.5" />
        <rect x="20" y="35" width="12" height="20" rx="3" fill="#063B28" />
        <rect x="34" y="28" width="12" height="27" rx="3" fill="#0B6B45" />
        <rect x="48" y="20" width="12" height="35" rx="3" fill="#19D98A" />
        <text x="23" y="62" fontSize="7" fill="#9AAFA5" fontFamily="Inter">20%</text>
        <text x="37" y="62" fontSize="7" fill="#9AAFA5" fontFamily="Inter">35%</text>
        <text x="51" y="62" fontSize="7" fill="#F5FFF9" fontFamily="Inter">45%</text>
      </svg>
    ),
    headline: 'Plan Every Rupee',
    description: 'Automatically organize your income into meaningful spending categories with smart budget planning.',
    accent: '#63F2B0',
  },
  {
    id: 3,
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="rgba(25,217,138,0.08)" stroke="rgba(25,217,138,0.2)" strokeWidth="1.5" />
        <circle cx="30" cy="32" r="9" fill="#063B28" stroke="#0B6B45" strokeWidth="2" />
        <circle cx="50" cy="32" r="9" fill="#063B28" stroke="#19D98A" strokeWidth="2" />
        <path d="M18 55 C18 47 23 44 30 44 C37 44 42 47 42 55" stroke="#9AAFA5" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M38 55 C38 47 43 44 50 44 C57 44 62 47 62 55" stroke="#19D98A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="32" r="4" fill="#9AAFA5" />
        <circle cx="50" cy="32" r="4" fill="#19D98A" />
      </svg>
    ),
    headline: 'Manage Your Family',
    description: "Track household expenses, children's spending, and family financial goals all in one place.",
    accent: '#19D98A',
  },
  {
    id: 4,
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="rgba(25,217,138,0.08)" stroke="rgba(25,217,138,0.2)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="20" stroke="#1A2E23" strokeWidth="8" fill="none" />
        <circle cx="40" cy="40" r="20"
          stroke="#19D98A"
          strokeWidth="8"
          fill="none"
          strokeDasharray="75 50"
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="45" textAnchor="middle" fontSize="12" fontWeight="700" fill="#F5FFF9" fontFamily="Inter">75%</text>
        <path d="M57 26 L62 21" stroke="#19D98A" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 33 L67 31" stroke="#63F2B0" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 40 L68 40" stroke="#19D98A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    headline: 'Build a Better Future',
    description: 'Track savings progress, build your emergency fund, and achieve your long-term financial goals.',
    accent: '#63F2B0',
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const router = useRouter()

  const complete = () => {
    localStorage.setItem('lifeplan_onboarding_done', 'true')
    router.push('/sign-in')
  }

  const next = () => {
    if (current < slides.length - 1) {
      setDirection(1)
      setCurrent((c) => c + 1)
    } else {
      complete()
    }
  }

  const prev = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    }
  }

  const slide = slides[current]

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#050806',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 24px 40px',
      paddingTop: 'max(60px, env(safe-area-inset-top, 60px))',
      paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 40% at 50% 20%, rgba(25,217,138,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#F5FFF9',
          letterSpacing: '-0.02em',
        }}>
          Life<span style={{ color: '#19D98A' }}>Plan</span>
        </div>
        <button
          onClick={complete}
          style={{ background: 'none', border: 'none', color: '#60756C', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', zIndex: 1 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, textAlign: 'center', width: '100%' }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            >
              {slide.icon}
            </motion.div>

            {/* Text */}
            <div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                fontWeight: 800,
                color: '#F5FFF9',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 16,
              }}>
                {slide.headline}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#9AAFA5',
                lineHeight: 1.6,
                maxWidth: 320,
              }}>
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, zIndex: 1 }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#19D98A' : '#1A2E23',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              animate={{ width: i === current ? 24 : 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          {current > 0 && (
            <button
              onClick={prev}
              style={{
                flex: '0 0 auto',
                padding: '14px 20px',
                borderRadius: 12,
                background: '#101A15',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9AAFA5',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
            >
              ←
            </button>
          )}
          <motion.button
            onClick={next}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 12,
              background: '#19D98A',
              border: 'none',
              color: '#050806',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              minHeight: 52,
            }}
          >
            {current === slides.length - 1 ? 'Get Started →' : 'Next →'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
