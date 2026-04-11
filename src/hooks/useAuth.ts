import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setCredentials, logout } from "@/store/slices/authSlice";
import { mockUsers } from "@/mocks/data";
import type { User } from "@/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (email: string, password: string): Promise<{ user: User; token: string }> => {
      return new Promise((resolve, reject) => {
        const foundUser = mockUsers.find((u) => u.email === email);
        if (foundUser) {
          const token = `mock-token-${foundUser.id}`;
          dispatch(setCredentials({ user: foundUser, token }));
          resolve({ user: foundUser, token });
        } else {
          reject(new Error("Invalid credentials"));
        }
      });
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
  };
}
