import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientProviders } from "./client-providers"
import { PerformanceMonitor } from "@/components/performance-monitor"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "Movono - Your Ultimate Movie Experience",
  description: "Discover, track, and explore movies with Movono. Your personal movie companion with advanced search, collections, and recommendations.",
  keywords: "movies, streaming, watchlist, collections, movie database, film recommendations",
  authors: [{ name: "Movono Team" }],
  creator: "Movono",
  publisher: "Movono",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://movono.vercel.app'),
  openGraph: {
    title: "Movono - Your Ultimate Movie Experience",
    description: "Discover, track, and explore movies with Movono. Your personal movie companion with advanced search, collections, and recommendations.",
    url: 'https://movono.vercel.app',
    siteName: 'Movono',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Movono - Movie Discovery Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Movono - Your Ultimate Movie Experience",
    description: "Discover, track, and explore movies with Movono. Your personal movie companion with advanced search, collections, and recommendations.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://img.yts.mx" />
        <link rel="preconnect" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://witpoqobiuvhokyjopod.supabase.co" />
        
        {/* DNS prefetch for additional domains */}
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://img.yts.mx" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="dns-prefetch" href="https://witpoqobiuvhokyjopod.supabase.co" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/placeholder.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/cinema1.jpg" as="image" type="image/jpeg" />
        
        {/* Performance meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* PWA meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Movono" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/movono16.ico" type="image/x-icon" sizes="16x16" />
        <link rel="icon" href="/movono32.ico" type="image/x-icon" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            {children}
            <PerformanceMonitor />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
