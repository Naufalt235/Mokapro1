import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import roleCashierIcon from '../../assets/role-cashier.png';
import roleBaristaIcon from '../../assets/role-barista.png';
import roleAdminIcon from '../../assets/role-admin.png';
import './SelectUser.css';

// 3 Kartu Utama (Tampilan Statis)
const MAIN_ROLES = [
  { id: 'cashier', name: 'Kasir', roleTitle: 'Kasir', icon: roleCashierIcon, destination: '/cashier' },
  { id: 'barista', name: 'Barista', roleTitle: 'Barista / Dapur', icon: roleBaristaIcon, destination: '/kds' },
  { id: 'admin', name: 'Pengelola', roleTitle: 'Admin / Pengelola', icon: roleAdminIcon, destination: '/admin' }
];

export default function SelectUser() {
  const navigate = useNavigate();
  
  // State untuk Modal Login
  const [selectedRole, setSelectedRole] = useState(null); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fungsi saat kartu utama diklik
  const handleCardClick = (role) => {
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setError('');
  };

  // Fungsi validasi Login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Ambil semua akun dari localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('mokapro_accounts')) || [];
    
    // Cari akun yang cocok berdasarkan Role ID, Username, dan Password
    const matchedAccount = savedAccounts.find(acc => 
      acc.roleId === selectedRole.id && 
      acc.username === username && 
      acc.password === password
    );

    if (matchedAccount) {
      // SIMPAN DATA USER YANG LOGIN
      localStorage.setItem('mokapro_current_user', JSON.stringify(matchedAccount));
      
      // Login Sukses
      navigate(selectedRole.destination);
    } else {
      // Login Gagal
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

          {/* TAMPILAN 3 KARTU UTAMA */}
          <section className="select-user-grid" aria-label="Daftar peran karyawan">
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

      {/* MODAL LOGIN */}
      {selectedRole && (
        <div className="login-modal-overlay" onClick={() => setSelectedRole(null)}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login {selectedRole.name}</h2>
            <p className="modal-subtitle">Masukkan akun {selectedRole.roleTitle} Anda</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Masukkan username"
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Masukkan password"
                  className="modal-input"
                />
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