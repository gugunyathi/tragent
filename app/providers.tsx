"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppStoreProvider } from "@/hooks/use-app-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStoreProvider>
          <Toaster />
          <Sonner />
          {children}
        </AppStoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
