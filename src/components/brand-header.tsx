interface BrandHeaderProps {
  orgName: string;
  logoUrl?: string | null;
  locationName?: string;
}

export function BrandHeader({ orgName, logoUrl, locationName }: BrandHeaderProps) {
  return (
    <header className="brand">
      <div className="brand__logos">
        {logoUrl ? (
          <img src={logoUrl} alt={orgName} className="brand__org-logo" />
        ) : (
          <div className="brand__org-placeholder">{orgName.charAt(0)}</div>
        )}
        <div className="brand__planby">
          <span className="brand__planby-mark">planby</span>
          <span className="brand__planby-sub">kiosk</span>
        </div>
      </div>
      <div className="brand__meta">
        <h1 className="brand__org-name">{orgName}</h1>
        {locationName ? <p className="brand__location">{locationName}</p> : null}
      </div>
    </header>
  );
}
