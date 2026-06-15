import { useCallback, useEffect, useMemo, useState } from 'react';

import { PIN_LENGTH } from '@/lib/constants';
import { submitKioskEvent } from '@/lib/api';
import { enqueueOfflineEvent, getOfflineQueueCount } from '@/lib/offline-queue';
import { buildQueuedEvent, isNetworkError } from '@/lib/offline-sync';
import { resolveResultVariant } from '@/lib/labels';
import { useKioskStatus } from '@/hooks/use-kiosk-status';
import { ActivityScreen } from '@/screens/activity-screen';
import { HomeScreen } from '@/screens/home-screen';
import { PinScreen } from '@/screens/pin-screen';
import { ResultScreen } from '@/screens/result-screen';
import type { KioskEventResponse, KioskEventType, PendingEvent } from '@/lib/types';

type Screen = 'home' | 'activity' | 'pin' | 'result';

interface KioskAppProps {
  token: string;
}

export function KioskApp({ token }: KioskAppProps) {
  const { status, error, loading, refresh, offlineQueueCount, setOfflineQueueCount } =
    useKioskStatus(token);
  const [screen, setScreen] = useState<Screen>('home');
  const [pending, setPending] = useState<PendingEvent | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<KioskEventResponse | null>(null);

  const pinLength = status?.pinLength ?? PIN_LENGTH;

  useEffect(() => {
    setOfflineQueueCount(getOfflineQueueCount());
  }, [setOfflineQueueCount]);

  const resetFlow = useCallback(() => {
    setScreen('home');
    setPending(null);
    setPin('');
    setPinError(null);
    setShake(false);
    setResult(null);
    void refresh();
  }, [refresh]);

  function startEvent(
    eventType: KioskEventType,
    meta?: { reasonType?: string; note?: string },
  ) {
    setPending({ eventType, ...meta });
    setPin('');
    setPinError(null);
    setScreen('pin');
  }

  async function handleConfirmPin() {
    if (!pending || pin.length !== pinLength) return;

    setSubmitting(true);
    setPinError(null);

    try {
      const response = await submitKioskEvent(token, {
        eventType: pending.eventType,
        pin,
        reasonType: pending.reasonType,
        note: pending.note,
        idempotencyKey: crypto.randomUUID(),
      });

      setResult(response);

      if (!response.success) {
        setPinError(response.message);
        setShake(true);
        window.setTimeout(() => setShake(false), 500);
        if (response.message.includes('Zaključano')) {
          setPin('');
        }
        return;
      }

      setScreen('result');
    } catch (err) {
      if (isNetworkError(err) && pending) {
        const queued = buildQueuedEvent({
          eventType: pending.eventType,
          pin,
          reasonType: pending.reasonType,
          note: pending.note,
        });
        enqueueOfflineEvent(queued);
        setOfflineQueueCount(getOfflineQueueCount());

        setResult({
          success: true,
          eventType: pending.eventType,
          message: 'Nema mreže — događaj spremljen lokalno i bit će poslan kad se veza vrati.',
          warning: 'offline',
          timestamp: new Date().toISOString(),
        });
        setScreen('result');
        return;
      }

      setPinError(err instanceof Error ? err.message : 'Greška pri slanju');
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    } finally {
      setSubmitting(false);
    }
  }

  const resultVariant = useMemo(() => {
    if (!result) return 'success-in';
    return resolveResultVariant(result.eventType, result.success, result.warning);
  }, [result]);

  if (loading && !status) {
    return (
      <main className="kiosk-shell kiosk-shell--center">
        <p className="muted">Učitavanje kioska…</p>
      </main>
    );
  }

  if (error && !status) {
    return (
      <main className="kiosk-shell kiosk-shell--center">
        <div className="error-card">
          <h1>Kiosk nije dostupan</h1>
          <p>{error}</p>
          <p className="muted">Provjerite link i internetsku vezu tableta.</p>
        </div>
      </main>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <main className="kiosk-shell">
      {offlineQueueCount > 0 ? (
        <div className="offline-banner" role="status">
          {offlineQueueCount} događaj(a) čeka slanje
        </div>
      ) : null}

      {screen === 'home' ? (
        <HomeScreen
          status={status}
          onCheckIn={() => startEvent('CHECK_IN')}
          onCheckOut={() => startEvent('CHECK_OUT')}
          onOther={() => setScreen('activity')}
        />
      ) : null}

      {screen === 'activity' ? (
        <ActivityScreen
          menuTitle={status.otherMenuTitle ?? 'Odabir aktivnosti'}
          activities={status.activities ?? []}
          absenceReasons={status.absenceReasons ?? []}
          onBack={() => setScreen('home')}
          onSelect={startEvent}
        />
      ) : null}

      {screen === 'pin' && pending ? (
        <PinScreen
          pending={pending}
          pinLength={pinLength}
          pin={pin}
          error={pinError}
          shake={shake}
          submitting={submitting}
          activityLabels={status.activityLabels}
          onPinChange={setPin}
          onConfirm={() => void handleConfirmPin()}
          onCancel={resetFlow}
        />
      ) : null}

      {screen === 'result' && result ? (
        <ResultScreen result={result} variant={resultVariant} onDone={resetFlow} />
      ) : null}
    </main>
  );
}
