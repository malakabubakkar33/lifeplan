'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCw, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(25,217,138,0.08) 0%, transparent 60%), #050806',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#F5FFF9',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(11, 17, 14, 0.85)',
          border: '1px solid rgba(25, 217, 138, 0.15)',
          borderRadius: '24px',
          padding: '40px 24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(25,217,138,0.05)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(25, 217, 138, 0.1)',
            border: '1px solid rgba(25, 217, 138, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#19D98A',
          }}
        >
          <WifiOff size={38} />
        </motion.div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A8B8B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          You are Offline
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#9AAFA5',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          LifePlan works offline for cached data, but this action requires an active internet connection. Please check your network and try again.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              background: '#19D98A',
              color: '#050806',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(25,217,138,0.3)',
            }}
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/home"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F5FFF9',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
