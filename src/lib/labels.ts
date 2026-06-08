import type { KioskEventType, ResultVariant } from '@/lib/types';

const EVENT_LABELS: Record<KioskEventType, string> = {
  CHECK_IN: 'ULAZ',
  CHECK_OUT: 'IZLAZ',
  BREAK_START: 'Pauza — početak',
  BREAK_END: 'Pauza — kraj',
  ABSENCE_START: 'Liječnik / izlaz',
  ABSENCE_END: 'Povratak',
  OTHER: 'Ostalo',
};

export function getEventLabel(
  eventType: KioskEventType,
  labels?: Partial<Record<KioskEventType, string>>,
): string {
  return labels?.[eventType] ?? EVENT_LABELS[eventType];
}

export function formatLastActivity(
  employeeName: string,
  eventType: KioskEventType,
  timestamp: string,
  timeZone?: string,
  labels?: Partial<Record<KioskEventType, string>>,
): string {
  const time = new Date(timestamp).toLocaleTimeString('hr-HR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });
  const shortName = employeeName
    .split(' ')
    .map((part, index) => (index === 0 ? part : `${part.charAt(0)}.`))
    .join(' ');
  return `${shortName} — ${getEventLabel(eventType, labels)} ${time}`;
}

export function formatClock(date: Date, timeZone?: string): { dateLine: string; timeLine: string } {
  return {
    dateLine: date.toLocaleDateString('hr-HR', {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    timeLine: date.toLocaleTimeString('hr-HR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

export function resolveResultVariant(
  eventType: KioskEventType,
  success: boolean,
  warning?: string,
): ResultVariant {
  if (!success) return 'error';
  if (warning) return 'warning';
  if (eventType === 'CHECK_IN') return 'success-in';
  if (eventType === 'CHECK_OUT') return 'success-out';
  if (eventType === 'BREAK_START' || eventType === 'BREAK_END') return 'success-break';
  return 'success-in';
}

export const ABSENCE_REASONS = [
  { value: 'doctor', label: 'Liječnik' },
  { value: 'personal', label: 'Osobni razlozi' },
  { value: 'official', label: 'Službeni izlaz' },
  { value: 'other', label: 'Ostalo' },
] as const;
