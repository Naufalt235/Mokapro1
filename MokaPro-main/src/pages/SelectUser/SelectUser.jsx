import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import './SelectUser.css';

// IMPORT GAMBAR
const roleCashierIcon = new URL('../../assets/role-cashier.png', import.meta.url).href;
const roleBaristaIcon = new URL('../../assets/role-barista.png', import.meta.url).href;
const roleAdminIcon = new URL('../../assets/role-admin.png', import.meta.url).href;

// KARTU UTAMA
const MAIN_ROLES = [
  { id: 'cashier', name: 'Kasir', roleTitle: 'Kasir', icon: roleCashierIcon, destination: '/cashier' },
  { id: 'barista', name: 'Barista', roleTitle: 'Barista / Dapur', icon: roleBaristaIcon, destination: '/kds' },
  { id: 'admin', name: 'Pengelola', roleTitle: 'Admin / Pengelola', icon: roleAdminIcon, destination: '/admin' }
];

// === 3 AKUN UTAMA YANG DIKUNCI DI KODE ===
const CORE_ACCOUNTS = [
  { id: 'core-1', roleId: 'cashier', name: 'Kasir 01', roleTitle: 'Kasir', username: 'kasir01', password: 'kasir123' },
  { id: 'core-2', roleId: 'barista', name: 'Barista 01', roleTitle: 'Barista / Dapur', username: 'barista01', password: 'barista123' },
  { id: 'core-3', roleId: 'admin', name: 'Pengelola 01', roleTitle: 'Admin / Pengelola', username: 'admin01', password: 'admin123' }
];

export default function SelectUser() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCardClick = (role) => {
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Ambil akun tambahan dari localStorage (jika ada)
    const extraAccounts = JSON.parse(localStorage.getItem('mokapro_extra_accounts')) || [];
    
    // 2. Gabungkan Akun Utama + Akun Tambahan
    const allAccounts = [...CORE_ACCOUNTS, ...extraAccounts];

    // 3. Cari akun yang cocok
    const matchedAccount = allAccounts.find(acc => 
      acc.roleId === selectedRole.id && 
      acc.username === cleanUsername && 
      acc.password === cleanPassword
    );

    if (matchedAccount) {
      // Simpan user yang aktif untuk ditampilkan di Navbar
      localStorage.setItem('mokapro_current_user', JSON.stringify(matchedAccount));
      navigate(selectedRole.destination);
    } else {
      setError('Username atau Password salah untuk role ini!');
    }
  };

  return (
    <div className="select-user-page">
      <PublicNavbar />
      <main className="select-user-main">
        <div className="select-user-container">
          <div className="select-user-top-actions">
            <button type="button" className="select-user-back-btn" onClick={() => navigate('/')}>
              <svg className="back-arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Kembali</span>
            </button>
          </div>
          <section className="select-user-header">
            <span className="select-user-eyebrow">AKSES OPERASIONAL</span>
            <h1 className="select-user-title">Pilih akun karyawan</h1>
            <p className="select-user-subtitle">Pilih peran Anda, lalu masukkan Username dan Password.</p>
          </section>
          <section className="select-user-grid">
            {MAIN_ROLES.map((role) => (
              <div key={role.id} className="role-card" onClick={() => handleCardClick(role)}>
                <div className="role-card-icon-wrap">
                  <img src={role.icon} alt={role.roleTitle} className="role-card-icon" />
                </div>
                <div className="role-card-content">
                  <h2 className="role-card-name">{role.name}</h2>
                  <p className="role-card-role-title">{role.roleTitle}</p>
                  <p className="role-card-desc">Akses sistem MokaPro</p>
                </div>
                <div className="role-card-action">
                  <span>Login Sekarang</span>
                  <svg className="role-action-arrow" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {selectedRole && (
        <div className="login-modal-overlay" onClick={() => setSelectedRole(null)}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login {selectedRole.name}</h2>
            <p className="modal-subtitle">Masukkan akun {selectedRole.roleTitle} Anda</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" className="modal-input" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" className="modal-input" />
              </div>
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setSelectedRole(null)}>Batal</button>
                <button type="submit" className="btn-login">Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="select-user-footer">
        <div className="select-user-footer-container">
          <p className="select-user-footer-copy">© 2026 Moka Pro POS &amp; Roastery OS.</p>
          <div className="select-user-footer-status">
            <div className="status-indicator"><span className="status-dot"></span><span className="status-text">Cloud Tersinkronisasi</span></div>
            <span className="status-separator">•</span>
            <span className="terminal-id">Terminal #01</span>
          </div>
        </div>
      </footer>
    </div>
  );
}