import { useCallback, useEffect, useState } from 'react';

import { fetchKioskStatus } from '@/lib/api';
import { flushOfflineQueue } from '@/lib/offline-sync';
import type { KioskStatus } from '@/lib/types';

const HEARTBEAT_MS = 30_000;

export function useKioskStatus(token: string) {
  const [status, setStatus] = useState<KioskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchKioskStatus(token);
      setStatus(next);
      setError(null);

      const flushed = await flushOfflineQueue(token).catch(() => 0);
      if (flushed > 0) {
        setOfflineQueueCount(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kiosk nije dostupan');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), HEARTBEAT_MS);

    const onOnline = () => void refresh();
    window.addEventListener('online', onOnline);

    return () => {
      window.clearInterval(id);
      window.removeEventListener('online', onOnline);
    };
  }, [refresh]);

  return { status, error, loading, refresh, offlineQueueCount, setOfflineQueueCount };
}
