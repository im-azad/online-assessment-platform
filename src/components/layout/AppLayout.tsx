"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f8]">
      <Header />
      <main className="flex-1 flex flex-col pt-16 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
