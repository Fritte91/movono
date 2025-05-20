'use client'

import { createBrowserClient } from '@supabase/ssr'

export default function TestEnv() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const checkEnv = () => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Environment Variables Test</h1>
      <button 
        onClick={checkEnv}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Check Environment Variables
      </button>
    </div>
  )
} 