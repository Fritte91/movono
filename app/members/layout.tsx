import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Analytics />
      <SpeedInsights />
      <SiteFooter />
    </div>
  )
}
