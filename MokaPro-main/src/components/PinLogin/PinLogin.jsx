import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../PublicNavbar/PublicNavbar';
import './PinLogin.css';

/**
 * Reusable PinLogin component
 * Digunakan untuk halaman PIN Kasir, Barista, dan Admin
 */
export default function PinLogin({
  roleName = 'Kasir 01',
  roleSubtitle = 'Kasir · Cabang Utama Toko',
  roleLabel = 'Kasir',
  roleIcon,
  roleIconAlt = 'Role icon',
  expectedPin = '1234',
  destination = '/cashier'
}) {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!pin.trim()) {
      setErrorMessage('Silakan masukkan PIN');
      return;
    }

    // LOGIKA BARU: Hanya menerima PIN yang persis sama
    if (pin === expectedPin) {
      setErrorMessage('');
      navigate(destination);
    } else {
      // Pesan error tidak lagi membocorkan PIN yang benar
      setErrorMessage('PIN salah! Silakan coba lagi.');
    }
  };

  return (
    <div className="pin-login-page">
      <PublicNavbar />

      <main className="pin-login-main">
        <div className="pin-card">
          {/* Back Action */}
          <div className="pin-card-top">
            <button
              type="button"
              className="pin-back-btn"
              onClick={() => navigate('/select-user')}
            >
              <svg
                className="pin-back-arrow"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Ganti pengguna</span>
            </button>
          </div>

          {/* Role Header */}
          <div className="pin-card-center">
            {roleIcon && (
              <div className="pin-icon-wrap">
                <img src={roleIcon} alt={roleIconAlt} className="pin-icon-img" />
              </div>
            )}
            <h1 className="pin-title">Masukkan PIN</h1>
            <p className="pin-role-name">{roleName}</p>
            <p className="pin-role-sub">{roleSubtitle}</p>
          </div>

          {/* Form PIN */}
          <form className="pin-form" onSubmit={handleSubmit}>
            <label htmlFor="pin-input" className="pin-input-label">
              PIN Karyawan
            </label>
            <input
              id="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              className={`pin-input ${errorMessage ? 'pin-input-error' : ''}`}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder=""
              autoComplete="current-password"
            />

            {errorMessage && (
              <span className="pin-error-text" role="alert">
                {errorMessage}
              </span>
            )}

            <button type="submit" className="pin-submit-btn">
              <span>Masuk</span>
              <svg
                className="pin-submit-arrow"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Helper Note (Saya hapus teks PIN-nya agar lebih aman) */}
          <p className="pin-helper-note">
            Pastikan Anda tidak membagikan PIN Anda kepada siapapun.
          </p>
        </div>
      </main>

      <footer className="pin-login-footer">
        <div className="pin-login-footer-container">
          <p className="pin-login-footer-copy">
            © 2026 Moka Pro POS &amp; Roastery OS. Dirancang untuk operasional kopi spesialitas.
          </p>

          <div className="pin-login-footer-status">
            <div className="status-indicator">
              <span className="status-dot" aria-hidden="true"></span>
              <span className="status-text">Cloud Tersinkronisasi</span>
            </div>
            <span className="status-separator" aria-hidden="true">•</span>
            <span className="terminal-id">Terminal #01</span>
          </div>
        </div>
      </footer>
    </div>
  );
}