"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { UserCircle, ChevronDown, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/login": "Azad Resource",
  "/candidate/dashboard": "Dashboard",
  "/employer/dashboard": "Online Test",
  "/employer/create-exam": "Online Test",
};

const ROLE_LABELS: Record<string, string> = {
  employer: "Employer",
  candidate: "Candidate",
};

export function Header() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoginPage = pathname === "/login";
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    router.replace("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center z-50 shadow-sm px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-0 min-w-[180px]">
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-[#1c1c3a] tracking-tight">AK</span>
            <span className="text-xl font-black text-primary tracking-tight italic">IJ</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest -mt-0.5">
            RESOURCE
          </span>
        </div>
      </div>

      {/* Center: Page Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-base font-semibold text-slate-700">{title}</h1>
      </div>

      {/* Right: User dropdown */}
      <div className="min-w-[180px] flex justify-end" ref={dropdownRef}>
        {!isLoginPage && isAuthenticated && user ? (
          <div className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer rounded-xl hover:bg-slate-50 px-2 py-1 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <UserCircle className="h-7 w-7" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                {user.refId && (
                  <p className="text-[11px] text-slate-500">Ref. ID - {user.refId}</p>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ml-1 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown panel */}
            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info row */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                      <User className="w-3 h-3" />
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                    {user.refId && (
                      <span className="text-[11px] text-slate-400">#{user.refId}</span>
                    )}
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
