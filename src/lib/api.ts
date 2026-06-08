import { config } from '@/lib/config';
import type { ApiEnvelope, KioskEventResponse, KioskEventType, KioskStatus } from '@/lib/types';

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

async function kioskFetch<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${config.apiUrl}/v1/kiosk${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string | string[] }
    | null;

  if (!response.ok) {
    const message =
      body && 'message' in body
        ? Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message
        : 'Greška pri komunikaciji s poslužiteljem';
    throw new Error(message ?? 'Nepoznata greška');
  }

  return unwrap(body as ApiEnvelope<T>);
}

export function fetchKioskStatus(token: string): Promise<KioskStatus> {
  return kioskFetch<KioskStatus>(token, '/status');
}

export function submitKioskEvent(
  token: string,
  payload: {
    eventType: KioskEventType;
    pin: string;
    reasonType?: string;
    note?: string;
    idempotencyKey?: string;
  },
): Promise<KioskEventResponse> {
  return kioskFetch<KioskEventResponse>(token, '/event', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function syncOfflineEvents(
  token: string,
  events: Array<{
    eventType: KioskEventType;
    pin: string;
    timestamp: string;
    reasonType?: string;
    note?: string;
    idempotencyKey?: string;
  }>,
) {
  return kioskFetch<{ processed: number; results: KioskEventResponse[] }>(token, '/sync', {
    method: 'POST',
    body: JSON.stringify({ events }),
  });
}
