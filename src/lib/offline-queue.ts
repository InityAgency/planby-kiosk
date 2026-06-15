import type { KioskEventType } from '@/lib/types';

const STORAGE_KEY = 'planby-kiosk-offline-queue';

export interface QueuedKioskEvent {
  eventType: KioskEventType;
  pin: string;
  timestamp: string;
  reasonType?: string;
  note?: string;
  idempotencyKey: string;
}

function readQueue(): QueuedKioskEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueuedKioskEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(events: QueuedKioskEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function enqueueOfflineEvent(event: QueuedKioskEvent): void {
  const queue = readQueue();
  queue.push(event);
  writeQueue(queue);
}

export function getOfflineQueue(): QueuedKioskEvent[] {
  return readQueue();
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function removeProcessedEvents(keys: string[]): void {
  const remaining = readQueue().filter((e) => !keys.includes(e.idempotencyKey));
  writeQueue(remaining);
}

export function getOfflineQueueCount(): number {
  return readQueue().length;
}
