"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else if (!isLoading) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return null;
}
