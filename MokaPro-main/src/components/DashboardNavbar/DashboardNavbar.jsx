import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DashboardNavbar.css';

export default function DashboardNavbar({
  role = 'cashier',
  storeName = 'Cabang Utama Toko',
}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk menampung data user yang login
  const [user, setUser] = useState({ name: 'Memuat...', roleTitle: '...' });

  // Ambil data user dari localStorage saat komponen dimuat
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('mokapro_current_user'));
    if (currentUser) {
      setUser({ name: currentUser.name, roleTitle: currentUser.roleTitle });
    }
  }, [location.pathname]); // Update saat pindah halaman

  const getNavTabs = () => {
    if (role === 'cashier') {
      return [
        { label: 'Kasir', path: '/cashier' },
        { label: 'Riwayat Transaksi', path: '/history' },
        { label: 'Shift Kasir', path: '/cashier/shift' }
      ];
    }
    if (role === 'barista') {
      return [
        { label: 'Kitchen Display', path: '/kds' }
      ];
    }
    return [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Inventaris', path: '/admin/inventory' },
      { label: 'Menu', path: '/admin/menu' },
      { label: 'Laporan', path: '/admin/reports' },
      { label: 'Riwayat', path: '/admin/history' },
      { label: 'Akun', path: '/admin/accounts' }
    ];
  };

  const tabs = getNavTabs();

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-container">
        <div className="dashboard-navbar-left">
          <Link to="/" className="dashboard-navbar-brand">
            <div className="dashboard-logo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#DEBA8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 2.5v2" /><path d="M11 1.5v3" /><path d="M15 2.5v2" />
                <path d="M4 7.5h11v5.5a3.5 3.5 0 0 1-3.5 3.5h-4A3.5 3.5 0 0 1 4 13V7.5z" />
                <path d="M15 9.5h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2" /><path d="M3 20.5h14" />
              </svg>
            </div>
            <div className="dashboard-title">
              <span className="brand-moka">Moka</span>
              <span className="brand-pro">Pro</span>
            </div>
          </Link>

          <div className="dashboard-branch-pill">
            <svg className="pill-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><polyline points="9 21 9 12 15 12 15 21" />
            </svg>
            <span>{storeName}</span>
          </div>
        </div>

        <nav className="dashboard-navbar-center" aria-label="Menu navigasi operasional">
          <div className="dashboard-nav-pill-group">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link key={tab.path} to={tab.path} className={`dashboard-nav-tab ${isActive ? 'active' : ''}`}>
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="dashboard-navbar-right">
          <div className="dashboard-user-badge">
            {/* TAMPILKAN NAMA DINAMIS */}
            <span className="dashboard-user-name">{user.name}</span>
            <span className="dashboard-user-role">{user.roleTitle}</span>
          </div>

          <button type="button" className="dashboard-switch-user-btn" onClick={() => navigate('/select-user')}>
            <span>Ganti Pengguna</span>
            <svg className="switch-user-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}