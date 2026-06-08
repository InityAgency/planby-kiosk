interface PinPadProps {
  pinLength: number;
  value: string;
  disabled?: boolean;
  shake?: boolean;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

export function PinPad({ pinLength, value, disabled, shake, onChange, onConfirm }: PinPadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  function appendDigit(digit: string) {
    if (disabled || value.length >= pinLength) return;
    onChange(value + digit);
  }

  function removeDigit() {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }

  function handleConfirm() {
    if (disabled || value.length !== pinLength) return;
    onConfirm();
  }

  return (
    <div className={`pin-pad ${shake ? 'pin-pad--shake' : ''}`}>
      <div className="pin-pad__display" aria-label="PIN unos">
        {Array.from({ length: pinLength }).map((_, index) => (
          <span key={index} className={`pin-pad__dot ${index < value.length ? 'pin-pad__dot--filled' : ''}`}>
            {index < value.length ? '•' : ''}
          </span>
        ))}
      </div>

      <div className="pin-pad__grid">
        {digits.slice(0, 9).map((digit) => (
          <button
            key={digit}
            type="button"
            className="pin-pad__key"
            disabled={disabled}
            onClick={() => appendDigit(digit)}
          >
            {digit}
          </button>
        ))}
        <button type="button" className="pin-pad__key pin-pad__key--muted" disabled={disabled} onClick={removeDigit}>
          Obriši
        </button>
        <button type="button" className="pin-pad__key" disabled={disabled} onClick={() => appendDigit('0')}>
          0
        </button>
        <button
          type="button"
          className="pin-pad__key pin-pad__key--confirm"
          disabled={disabled || value.length !== pinLength}
          onClick={handleConfirm}
        >
          Potvrdi
        </button>
      </div>
    </div>
  );
}
