import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'LifePlan — Plan Today. Secure Tomorrow.',
    template: '%s | LifePlan',
  },
  description: 'Complete personal and family financial management. Track salary, expenses, bills, savings goals, and family budgets in one beautiful app.',
  keywords: ['finance', 'budget', 'expenses', 'salary', 'savings', 'family budget', 'bills', 'financial planning'],
  authors: [{ name: 'LifePlan' }],
  creator: 'LifePlan',
  publisher: 'LifePlan',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LifePlan',
    startupImage: [
      {
        url: '/icons/splash-2048x2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'LifePlan',
    title: 'LifePlan — Plan Today. Secure Tomorrow.',
    description: 'Complete personal and family financial management app.',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050806' },
    { media: '(prefers-color-scheme: light)', color: '#050806' },
  ],
}
import Script from 'next/script'
import { LifePlanAuthProvider } from '@/components/providers/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <LifePlanAuthProvider>
          {children}
        </LifePlanAuthProvider>
        {/* PWA Service Worker registration */}
        <Script
          id="pwa-service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
