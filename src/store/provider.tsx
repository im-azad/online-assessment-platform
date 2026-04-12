"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

export type { AppStore } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);
  
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<Skeleton className="w-full h-screen" />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
