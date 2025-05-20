"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Film } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function ConfirmPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          setError('Invalid confirmation link')
          return
        }

        const { error } = await supabaseClient.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          console.error('Confirmation error:', error)
          setError(error.message)
          return
        }

        toast({
          title: "Email confirmed!",
          description: "Your email has been verified successfully.",
        })

        // Redirect to login after successful confirmation
        router.push('/login?confirmed=true')
      } catch (err: any) {
        console.error('Confirmation error:', err)
        setError(err.message || 'An error occurred during confirmation')
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [router, searchParams, toast])

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
            {isLoading ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Confirming your email...</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-red-500">Confirmation Failed</h1>
                <p className="text-muted-foreground">{error}</p>
                <Button asChild>
                  <Link href="/signup">Try Again</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-green-500">Email Confirmed!</h1>
                <p className="text-muted-foreground">Your email has been successfully verified.</p>
                <Button asChild>
                  <Link href="/login">Continue to Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 