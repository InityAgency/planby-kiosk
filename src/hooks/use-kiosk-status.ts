import { useCallback, useEffect, useState } from 'react';

import { fetchKioskStatus } from '@/lib/api';
import type { KioskStatus } from '@/lib/types';

const HEARTBEAT_MS = 30_000;

export function useKioskStatus(token: string) {
  const [status, setStatus] = useState<KioskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchKioskStatus(token);
      setStatus(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kiosk nije dostupan');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { status, error, loading, refresh };
}
