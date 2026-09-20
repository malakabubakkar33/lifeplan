import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const secretKey = process.env.CLERK_SECRET_KEY

const hasValidClerkKeys = Boolean(
  publishableKey &&
  publishableKey.startsWith('pk_') &&
  secretKey &&
  secretKey.startsWith('sk_')
)

const clerkHandler = hasValidClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      try {
        const { userId } = await auth()
        if (userId && request.nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/home', request.url))
        }
      } catch (e) {
        console.error('Clerk middleware auth error:', e)
      }
      return NextResponse.next()
    })
  : null

export default async function middleware(request: NextRequest, event: any) {
  if (clerkHandler) {
    try {
      return await clerkHandler(request, event)
    } catch (e) {
      console.error('Middleware execution error:', e)
      return NextResponse.next()
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

