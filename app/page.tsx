'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppAuth } from '@/components/providers/auth-provider'
import { LandingPage } from '@/components/marketing/landing-page'
import { SplashScreen } from '@/components/common/splash-screen'

export default function RootPage() {
  const { isLoaded, isSignedIn } = useAppAuth()
  const router = useRouter()
  const [isStandalone, setIsStandalone] = useState(false)
  const [checkingStandalone, setCheckingStandalone] = useState(true)

  useEffect(() => {
    // Check if launched as installed PWA standalone app
    const standaloneMedia = window.matchMedia('(display-mode: standalone)').matches
    const iosStandalone = (window.navigator as any).standalone === true
    const runningStandalone = standaloneMedia || iosStandalone
    setIsStandalone(runningStandalone)
    setCheckingStandalone(false)

    // If running in standalone PWA mode, direct directly to the application
    if (runningStandalone) {
      const onboardingDone = localStorage.getItem('lifeplan_onboarding_done')
      if (!onboardingDone) {
        router.replace('/onboarding')
      } else {
        router.replace('/home')
      }
    }
  }, [router])

  if (checkingStandalone && isStandalone) {
    return <SplashScreen />
  }

  return <LandingPage />
}
