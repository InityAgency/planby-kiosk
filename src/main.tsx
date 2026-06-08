import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';

import { KioskApp } from '@/kiosk-app';
import '@/index.css';

function KioskRoute() {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return (
      <main className="kiosk-shell kiosk-shell--center">
        <div className="error-card">
          <h1>Neispravan link</h1>
          <p>Kiosk URL mora sadržavati token.</p>
        </div>
      </main>
    );
  }

  return <KioskApp token={token} />;
}

function LandingPage() {
  return (
    <main className="kiosk-shell kiosk-shell--center">
      <div className="error-card">
        <h1>Planby Kiosk</h1>
        <p>Otvorite link s tokenom koji ste dobili u admin panelu:</p>
        <p className="muted">/kiosk/{'{token}'}</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/kiosk/:token" element={<KioskRoute />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
