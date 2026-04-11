"use client";

import { MSWComponent } from "@/components/MSWComponent";
import { Providers } from "@/components/providers";

export function CombinedProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MSWComponent />
      <Providers>{children}</Providers>
    </>
  );
}
