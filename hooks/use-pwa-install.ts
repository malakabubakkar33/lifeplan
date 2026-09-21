'use client'

import { useState, useEffect } from 'react'

export interface PWAInstallState {
  isSupported: boolean
  isInstalled: boolean
  isIOS: boolean
  isAndroid: boolean
  isDesktop: boolean
  canPrompt: boolean
  promptInstall: () => Promise<boolean>
}

export function usePWAInstall(): PWAInstallState {
  const [isSupported, setIsSupported] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [canPrompt, setCanPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect standalone display mode
    const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    const installed = isStandaloneMedia || isIOSStandalone
    setIsInstalled(installed)

    // OS Detection
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua)
    const android = /android/.test(ua)
    const desktop = !ios && !android

    setIsIOS(ios)
    setIsAndroid(android)
    setIsDesktop(desktop)

    // Service Worker support
    const swSupported = 'serviceWorker' in navigator
    setIsSupported(swSupported)

    // Capture beforeinstallprompt for Android and Desktop Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanPrompt(true)
    }

    // Capture appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setCanPrompt(false)
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch (e) {
      console.error('Error invoking PWA install prompt:', e)
      return false
    }
  }

  return {
    isSupported,
    isInstalled,
    isIOS,
    isAndroid,
    isDesktop,
    canPrompt,
    promptInstall,
  }
}
