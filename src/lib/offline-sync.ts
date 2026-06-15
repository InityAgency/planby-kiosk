import { syncOfflineEvents } from '@/lib/api';
import {
  getOfflineQueue,
  removeProcessedEvents,
  type QueuedKioskEvent,
} from '@/lib/offline-queue';

/**
 * Pokušava poslati offline queue na backend kad se mreža vrati.
 */
export async function flushOfflineQueue(token: string): Promise<number> {
  const queue = getOfflineQueue();
  if (!queue.length) return 0;

  const response = await syncOfflineEvents(token, queue);
  const processedKeys = queue.slice(0, response.processed).map((e) => e.idempotencyKey);
  removeProcessedEvents(processedKeys);

  return response.processed;
}

export function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  if (err instanceof Error) {
    return (
      err.message.includes('Failed to fetch') ||
      err.message.includes('NetworkError') ||
      err.message.includes('mrež')
    );
  }
  return false;
}

export function buildQueuedEvent(
  event: Omit<QueuedKioskEvent, 'timestamp' | 'idempotencyKey'>,
): QueuedKioskEvent {
  return {
    ...event,
    timestamp: new Date().toISOString(),
    idempotencyKey: crypto.randomUUID(),
  };
}
