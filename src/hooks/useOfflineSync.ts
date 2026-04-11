import { useEffect, useCallback, useState } from "react";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

interface SyncQueueItem<T> {
  id: string;
  data: T;
  timestamp: number;
  retries: number;
}

interface UseOfflineSyncOptions<T> {
  key: string;
  onSync?: (data: T) => Promise<void>;
  maxRetries?: number;
}

export function useOfflineSync<T>({
  key,
  onSync,
  maxRetries = 3,
}: UseOfflineSyncOptions<T>) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingItems, setPendingItems] = useState<SyncQueueItem<T>[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addToQueue = useCallback(
    async (data: T) => {
      const item: SyncQueueItem<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data,
        timestamp: Date.now(),
        retries: 0,
      };

      const queue = await idbGet<SyncQueueItem<T>[]>(`${key}_queue`) || [];
      queue.push(item);
      await idbSet(`${key}_queue`, queue);

      setPendingItems((prev) => [...prev, item]);

      if (isOnline && onSync) {
        await syncNow();
      }
    },
    [key, isOnline, onSync]
  );

  const syncNow = useCallback(async () => {
    if (!onSync || isSyncing) return;

    setIsSyncing(true);
    const queue = await idbGet<SyncQueueItem<T>[]>(`${key}_queue`) || [];

    const failedItems: SyncQueueItem<T>[] = [];

    for (const item of queue) {
      try {
        await onSync(item.data);
      } catch (error) {
        if (item.retries < maxRetries) {
          failedItems.push({ ...item, retries: item.retries + 1 });
        }
      }
    }

    await idbSet(`${key}_queue`, failedItems);
    setPendingItems(failedItems);
    setIsSyncing(false);
  }, [key, onSync, maxRetries, isSyncing]);

  const clearQueue = useCallback(async () => {
    await idbDel(`${key}_queue`);
    setPendingItems([]);
  }, [key]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (isOnline) {
      syncNow();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline, syncNow]);

  return {
    isOnline,
    pendingCount: pendingItems.length,
    isSyncing,
    addToQueue,
    syncNow,
    clearQueue,
  };
}
