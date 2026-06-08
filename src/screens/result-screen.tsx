import { useEffect } from 'react';

import { RESULT_SCREEN_MS } from '@/lib/constants';
import type { KioskEventResponse, ResultVariant } from '@/lib/types';

interface ResultScreenProps {
  result: KioskEventResponse;
  variant: ResultVariant;
  onDone: () => void;
}

const ICONS: Record<ResultVariant, string> = {
  'success-in': '✓',
  'success-out': '✓',
  'success-break': '✓',
  warning: '⚠',
  error: '✗',
};

export function ResultScreen({ result, variant, onDone }: ResultScreenProps) {
  useEffect(() => {
    if (variant === 'error') return;
    const id = window.setTimeout(onDone, RESULT_SCREEN_MS);
    return () => window.clearTimeout(id);
  }, [onDone, variant]);

  return (
    <section className={`screen screen--result screen--result-${variant}`}>
      <div className="result-card">
        <span className="result-card__icon" aria-hidden>
          {ICONS[variant]}
        </span>
        <p className="result-card__message">{result.message}</p>
        {result.warning ? <p className="result-card__warning">{result.warning}</p> : null}
        {variant !== 'error' ? <p className="result-card__hint">Vraćanje za 5 sekundi…</p> : null}
      </div>
    </section>
  );
}
