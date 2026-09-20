'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignUp } from '@clerk/nextjs'
import { isLiveClerk } from '@/components/providers/auth-provider'
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex.morgan@lifeplan.app')
  const [password, setPassword] = useState('••••••••••••')

  const handleDemoSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('lifeplan_onboarding_done', 'true')
    router.push('/setup')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(25,217,138,0.1) 0%, transparent 60%), #050806',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        paddingTop: 'max(40px, env(safe-area-inset-top, 40px))',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #063B28 0%, #0B6B45 50%, #19D98A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 24px rgba(25,217,138,0.25)',
              color: '#050806',
            }}
          >
            <ShieldCheck size={30} strokeWidth={2.5} />
          </div>
        </Link>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#F5FFF9',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          Create your LifePlan Account
        </h1>
        <p style={{ color: '#9AAFA5', fontSize: '0.875rem' }}>
          Plan Today. Secure Tomorrow.
        </p>
      </div>

      {isLiveClerk ? (
        <SignUp
          routing="hash"
          appearance={{
            elements: {
              rootBox: { width: '100%', maxWidth: 400 },
              card: {
                background: '#0B110E',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                boxShadow: 'none',
                padding: '24px',
              },
              headerTitle: { display: 'none' },
              headerSubtitle: { display: 'none' },
              socialButtonsBlockButton: {
                background: '#101A15',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F5FFF9',
                borderRadius: 10,
                minHeight: 48,
              },
              socialButtonsBlockButtonText: { color: '#F5FFF9', fontWeight: 500 },
              dividerLine: { background: 'rgba(255,255,255,0.06)' },
              dividerText: { color: '#60756C' },
              formFieldLabel: { color: '#9AAFA5', fontSize: '0.8125rem', marginBottom: 6 },
              formFieldInput: {
                background: '#101A15',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F5FFF9',
                borderRadius: 10,
                minHeight: 48,
                fontSize: '0.9375rem',
              },
              formButtonPrimary: {
                background: '#19D98A',
                color: '#050806',
                fontWeight: 700,
                borderRadius: 10,
                minHeight: 48,
                fontSize: '0.9375rem',
              },
              footerActionText: { color: '#60756C' },
              footerActionLink: { color: '#19D98A', fontWeight: 600 },
              formFieldErrorText: { color: '#E05252' },
              alertText: { color: '#E05252' },
            },
          }}
        />
      ) : (
        /* Demo Mode Sign-Up Card */
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#0B110E',
            border: '1px solid rgba(25,217,138,0.2)',
            borderRadius: 24,
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(25,217,138,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(25,217,138,0.2)',
              color: '#19D98A',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <Sparkles size={16} />
            <span>Interactive Demo Registration</span>
          </div>

          <form onSubmit={handleDemoSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9AAFA5', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#101A15',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F5FFF9',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9AAFA5', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#101A15',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F5FFF9',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9AAFA5', marginBottom: 6 }}>
                Create Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#101A15',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F5FFF9',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: '#19D98A',
                color: '#050806',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(25,217,138,0.3)',
                marginTop: 8,
              }}
            >
              <span>Launch Financial Wizard</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#60756C',
            }}
          >
            Already have an account?{' '}
            <Link href="/sign-in" style={{ color: '#19D98A', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
