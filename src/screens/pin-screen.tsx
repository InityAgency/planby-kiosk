import { PinPad } from '@/components/pin-pad';
import { getEventLabel } from '@/lib/labels';
import type { PendingEvent } from '@/lib/types';

interface PinScreenProps {
  pending: PendingEvent;
  pinLength: number;
  pin: string;
  error?: string | null;
  shake: boolean;
  submitting: boolean;
  activityLabels?: Partial<Record<PendingEvent['eventType'], string>>;
  onPinChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PinScreen({
  pending,
  pinLength,
  pin,
  error,
  shake,
  submitting,
  activityLabels,
  onPinChange,
  onConfirm,
  onCancel,
}: PinScreenProps) {
  const isLockout = error?.includes('Zaključano');

  return (
    <section className="screen screen--pin">
      <div className="screen__top">
        <button type="button" className="ghost-btn" onClick={onCancel} disabled={submitting}>
          Odustani
        </button>
        <h2>{getEventLabel(pending.eventType, activityLabels)}</h2>
      </div>

      {error ? <p className={`pin-error ${isLockout ? 'pin-error--lockout' : ''}`}>{error}</p> : null}

      <PinPad
        pinLength={pinLength}
        value={pin}
        disabled={submitting || Boolean(isLockout)}
        shake={shake}
        onChange={onPinChange}
        onConfirm={onConfirm}
      />
    </section>
  );
}
