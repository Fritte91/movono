import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "./client-providers"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata title and description
export const metadata = {
  title: "Movono - Premium Film Community",
  description: "Your exclusive source for high-quality film torrents",
  generator: 'v0.dev',
  icons: [
    { rel: 'icon', type: 'image/x-icon', sizes: '16x16', url: '/movono16.ico' },
    { rel: 'icon', type: 'image/x-icon', sizes: '32x32', url: '/movono32.ico' },
    { rel: 'shortcut icon', url: '/movono32.ico' },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" sizes="16x16" href="/movono16.ico" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/movono32.ico" />
        <link rel="shortcut icon" href="/movono32.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
