'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { type ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 60 * 1000, // 20 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '2px solid #2563eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
            },
            success: { style: { border: '2px solid #22c55e' } },
            error: { style: { border: '2px solid #ef4444' } },
          }}
        />
        <Analytics />
      </ThemeProvider>
    </QueryClientProvider>
  );
} 