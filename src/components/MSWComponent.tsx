"use client";

import React, { useEffect, useState } from "react";

export function MSWComponent() {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV === "development") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
        });
        setMswReady(true);
      } else {
        setMswReady(true);
      }
    };

    initMSW();
  }, []);

  return null;
}
