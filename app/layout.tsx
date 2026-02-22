import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { MotionProvider } from '@/components/ui/motion-provider'
import { ErrorBoundaryProvider } from '@/components/providers/error-boundary-provider'
import { SkipLink } from '@/components/ui/skip-link'
import './globals.css'
import { LAYOUT_CONSTANTS } from '@/lib/constants'

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tonomi-accessoires.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'TONOMI ACCESSOIRES',
    template: '%s | TONOMI ACCESSOIRES',
  },
  description: `Découvrez notre collection de sacs, portefeuilles et accessoires de mode haut de gamme. ${LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD_LABEL}.`,
  icons: {
    icon: [
      { url: '/images/logo.png', type: 'image/png' },
      { url: '/images/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/logo.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo.png',
  },
  openGraph: {
    title: 'TONOMI ACCESSOIRES',
    description: 'Découvrez notre collection de sacs, portefeuilles et accessoires de mode haut de gamme.',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'TONOMI ACCESSOIRES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TONOMI ACCESSOIRES',
    description: 'Découvrez notre collection de sacs, portefeuilles et accessoires de mode haut de gamme.',
    images: ['/images/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a18" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        <SkipLink />
        <ErrorBoundaryProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </ErrorBoundaryProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
