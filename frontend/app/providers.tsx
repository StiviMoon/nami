'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import { PwaRegister } from '@/components/pwa-register';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,      // 5 min — datos frescos sin re-fetch
        gcTime: 1000 * 60 * 10,        // 10 min — mantiene en caché tras unmount
        retry: (failureCount, error: Error) => {
          // No reintentar en errores de cliente (4xx)
          if (error?.message && /4\d\d/.test(error.message)) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,   // evita re-fetches al cambiar de tab
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={client}>
      <PwaRegister />
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
}
