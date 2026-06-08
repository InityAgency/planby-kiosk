export type KioskEventType =
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'BREAK_START'
  | 'BREAK_END'
  | 'ABSENCE_START'
  | 'ABSENCE_END'
  | 'OTHER';

export interface KioskActivityOption {
  eventType: KioskEventType;
  label: string;
}

export interface KioskAbsenceReason {
  code: string;
  label: string;
}

export interface KioskStatus {
  kioskId: string;
  orgName: string;
  logoUrl: string | null;
  locationName: string;
  pinLength: number;
  timezone: string;
  status: string;
  currentTime: string;
  otherMenuTitle?: string;
  activities?: KioskActivityOption[];
  absenceReasons?: KioskAbsenceReason[];
  activityLabels?: Partial<Record<KioskEventType, string>>;
  lastActivity?: {
    employeeName: string;
    eventType: KioskEventType;
    timestamp: string;
  } | null;
}

export interface KioskEventResponse {
  success: boolean;
  message: string;
  employeeName?: string;
  timestamp: string;
  eventType: KioskEventType;
  warning?: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: { timestamp?: string };
}

export type ResultVariant = 'success-in' | 'success-out' | 'success-break' | 'warning' | 'error';

export interface PendingEvent {
  eventType: KioskEventType;
  reasonType?: string;
  note?: string;
}
