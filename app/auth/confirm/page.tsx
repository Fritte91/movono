"use client"

import { Suspense } from "react"
import { Film } from "lucide-react"
import Link from "next/link"
import { EmailConfirmation } from "./email-confirmation"

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">Movono</span>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <Suspense fallback={
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Confirming your email...</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </div>
            }>
              <EmailConfirmation />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
} 