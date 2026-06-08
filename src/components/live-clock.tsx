import { formatClock } from '@/lib/labels';
import { useClock } from '@/hooks/use-clock';

interface LiveClockProps {
  timeZone?: string;
}

export function LiveClock({ timeZone }: LiveClockProps) {
  const now = useClock();
  const { dateLine, timeLine } = formatClock(now, timeZone);

  return (
    <div className="clock">
      <p className="clock__date">{dateLine}</p>
      <p className="clock__time">{timeLine}</p>
    </div>
  );
}
