'use client'

import React, { createContext, useContext } from 'react'
import { ClerkProvider, useUser as useClerkUser } from '@clerk/nextjs'

interface AuthContextType {
  isLoaded: boolean
  isSignedIn: boolean
  isLiveClerk: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoaded: true,
  isSignedIn: true,
  isLiveClerk: false,
})

export const isLiveClerk = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('xxxx')
)

function InnerClerkSync({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useClerkUser()
  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn: Boolean(isSignedIn), isLiveClerk: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export function LifePlanAuthProvider({ children }: { children: React.ReactNode }) {
  if (!isLiveClerk) {
    return (
      <AuthContext.Provider value={{ isLoaded: true, isSignedIn: true, isLiveClerk: false }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#19D98A',
          colorBackground: '#0B110E',
          borderRadius: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        elements: {
          card: {
            background: '#0B110E',
            border: '1px solid rgba(255,255,255,0.06)',
          },
          formFieldInput: {
            background: '#101A15',
            borderColor: 'rgba(255,255,255,0.1)',
            color: '#F5FFF9',
          },
          headerTitle: { color: '#F5FFF9' },
          headerSubtitle: { color: '#9AAFA5' },
          socialButtonsBlockButton: {
            background: '#101A15',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#F5FFF9',
          },
          formButtonPrimary: {
            background: '#19D98A',
            color: '#050806',
            fontWeight: '700',
          },
          footerActionLink: { color: '#19D98A' },
        },
      }}
    >
      <InnerClerkSync>{children}</InnerClerkSync>
    </ClerkProvider>
  )
}

export function useAppAuth() {
  return useContext(AuthContext)
}
