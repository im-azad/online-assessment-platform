"use client";

import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1f3c] flex items-center justify-between px-8 z-50">
      {/* Left: Powered by AKIJ Resource */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300">Powered by</span>
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-0.5">
            <span className="text-sm font-black text-white tracking-tight">Azad</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">
            RESOURCE
          </span>
        </div>
      </div>

      {/* Right: Helpline + Email */}
      <div className="flex items-center gap-6 text-sm text-slate-300">
        <span className="text-slate-400 hidden md:inline">Helpline</span>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-slate-400" />
          <span>+88 1234 56789</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-slate-400" />
          <span>me.azad99@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}
