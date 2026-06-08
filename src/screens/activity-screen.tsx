import { useMemo, useState } from 'react';

import { buildKioskOtherMenu } from '@/lib/kiosk-other-menu';
import type { KioskAbsenceReason, KioskActivityOption, KioskEventType } from '@/lib/types';

interface ActivityScreenProps {
  menuTitle: string;
  activities: KioskActivityOption[];
  absenceReasons: KioskAbsenceReason[];
  onBack: () => void;
  onSelect: (eventType: KioskEventType, meta?: { reasonType?: string; note?: string }) => void;
}

export function ActivityScreen({
  menuTitle,
  activities,
  absenceReasons,
  onBack,
  onSelect,
}: ActivityScreenProps) {
  const [pendingNote, setPendingNote] = useState(false);
  const [note, setNote] = useState('');

  const menuItems = useMemo(
    () => buildKioskOtherMenu(activities, absenceReasons),
    [activities, absenceReasons],
  );

  function handleItemClick(item: ReturnType<typeof buildKioskOtherMenu>[number]) {
    if (item.kind === 'absence') {
      onSelect('ABSENCE_START', { reasonType: item.reasonType });
      return;
    }
    if (item.kind === 'note') {
      setPendingNote(true);
      return;
    }
    onSelect(item.eventType);
  }

  if (pendingNote) {
    const noteLabel = menuItems.find((item) => item.kind === 'note')?.label ?? 'Napomena';

    return (
      <section className="screen screen--activity">
        <div className="screen__top">
          <button type="button" className="ghost-btn" onClick={() => setPendingNote(false)}>
            ← Natrag
          </button>
          <h2>{noteLabel}</h2>
        </div>
        <label className="note-field">
          <span>Razlog (max 100 znakova)</span>
          <textarea
            value={note}
            maxLength={100}
            rows={4}
            placeholder="Unesite kratki opis..."
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="primary-btn"
          onClick={() => onSelect('OTHER', { note: note.trim().slice(0, 100) || undefined })}
        >
          Nastavi na PIN
        </button>
      </section>
    );
  }

  return (
    <section className="screen screen--activity">
      <div className="screen__top">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Natrag
        </button>
        <h2>{menuTitle}</h2>
      </div>

      {menuItems.length ? (
        <div className="activity-list">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="activity-btn"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="muted">Nema dostupnih aktivnosti. Provjerite postavke organizacije.</p>
      )}
    </section>
  );
}
