import { LiveClock } from '@/components/live-clock';
import { BrandHeader } from '@/components/brand-header';
import { buildKioskOtherMenu } from '@/lib/kiosk-other-menu';
import { formatLastActivity } from '@/lib/labels';
import type { KioskEventType, KioskStatus } from '@/lib/types';

interface HomeScreenProps {
  status: KioskStatus;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onOther: () => void;
}

export function HomeScreen({ status, onCheckIn, onCheckOut, onOther }: HomeScreenProps) {
  const lastActivity = status.lastActivity;
  const hasOtherMenu = buildKioskOtherMenu(
    status.activities ?? [],
    status.absenceReasons ?? [],
  ).length > 0;

  return (
    <section className="screen screen--home">
      <BrandHeader
        orgName={status.orgName}
        logoUrl={status.logoUrl}
        locationName={status.locationName}
      />

      <LiveClock timeZone={status.timezone} />

      <div className="home-actions">
        <button type="button" className="action-btn action-btn--in" onClick={onCheckIn}>
          ULAZ
        </button>
        <button type="button" className="action-btn action-btn--out" onClick={onCheckOut}>
          IZLAZ
        </button>
        {hasOtherMenu ? (
          <button type="button" className="action-btn action-btn--other" onClick={onOther}>
            OSTALO
          </button>
        ) : null}
      </div>

      {lastActivity ? (
        <p className="last-activity">
          {formatLastActivity(
            lastActivity.employeeName,
            lastActivity.eventType as KioskEventType,
            lastActivity.timestamp,
            status.timezone,
            status.activityLabels,
          )}
        </p>
      ) : null}
    </section>
  );
}
