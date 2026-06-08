import type { KioskAbsenceReason, KioskActivityOption, KioskEventType } from '@/lib/types';

export type KioskOtherMenuItem =
  | { id: string; label: string; kind: 'event'; eventType: KioskEventType }
  | { id: string; label: string; kind: 'absence'; reasonType: string }
  | { id: string; label: string; kind: 'note' };

/** Flat list for the OSTALO screen — absence reasons are top-level buttons, not a sub-menu. */
export function buildKioskOtherMenu(
  activities: KioskActivityOption[],
  absenceReasons: KioskAbsenceReason[],
): KioskOtherMenuItem[] {
  const core = activities.filter((activity) => activity.eventType !== 'ABSENCE_START');
  const absenceEndIndex = core.findIndex((activity) => activity.eventType === 'ABSENCE_END');
  const splitAt = absenceEndIndex >= 0 ? absenceEndIndex : core.length;

  const before = core.slice(0, splitAt).map((activity) => toMenuItem(activity));
  const after = core.slice(splitAt).map((activity) => toMenuItem(activity));
  const absences = absenceReasons.map((reason) => ({
    id: `absence-${reason.code}`,
    label: reason.label,
    kind: 'absence' as const,
    reasonType: reason.code,
  }));

  return [...before, ...absences, ...after];
}

function toMenuItem(activity: KioskActivityOption): KioskOtherMenuItem {
  if (activity.eventType === 'OTHER') {
    return { id: 'other', label: activity.label, kind: 'note' };
  }
  return {
    id: activity.eventType,
    label: activity.label,
    kind: 'event',
    eventType: activity.eventType,
  };
}
