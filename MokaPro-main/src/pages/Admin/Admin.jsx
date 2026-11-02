import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import './Admin.css';

export default function Admin() {
  const [stats, setStats] = useState({ totalPenjualan: 0, totalKDS: 0, bahanMenipis: 0 });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('mokapro_history')) || [];
    const totalPenjualan = history.reduce((acc, curr) => acc + curr.total, 0);

    const kds = JSON.parse(localStorage.getItem('mokapro_kds')) || [];
    const totalKDS = kds.filter(o => o.status !== 'Selesai').length;

    const bahanMenipis = 2; // Angka statis sementara

    setStats({ totalPenjualan, totalKDS, bahanMenipis });
  }, []);

  return (
    <div className="admin-page">
      <DashboardNavbar role="admin" userName="Pengelola 01" userRoleLabel="Admin" />
      <main className="admin-main">
        <div className="welcome-header">
          <h1>Selamat datang, Pengelola MokaPro</h1>
          <p>Pantau operasi kafe dan pilih modul pengelolaan.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Penjualan</p>
            <h2>Rp {(stats.totalPenjualan / 1000000).toFixed(2)} jt</h2>
          </div>
          <div className="stat-card">
            <p>Pesanan KDS</p>
            <h2>{stats.totalKDS}</h2>
          </div>
          <div className="stat-card">
            <p>Bahan Menipis</p>
            <h2>{stats.bahanMenipis}</h2>
          </div>
          <div className="stat-card">
            <p>Status</p>
            <h2>Demo Aktif</h2>
          </div>
        </div>

        <div className="module-grid">
          <Link to="/cashier" className="module-card">
            <div className="icon">🛒</div>
            <h3>Kasir & Pembayaran</h3>
            <span>Buka modul →</span>
          </Link>
          <Link to="/kds" className="module-card">
            <div className="icon">☕</div>
            <h3>Antrean KDS</h3>
            <span>Buka modul →</span>
          </Link>
          <Link to="/admin/inventory" className="module-card">
            <div className="icon">📦</div>
            <h3>Inventaris & Restock</h3>
            <span>Buka modul →</span>
          </Link>
          <Link to="/admin/reports" className="module-card">
            <div className="icon">📊</div>
            <h3>Laporan & Shift</h3>
            <span>Buka modul →</span>
          </Link>
          <Link to="/admin/history" className="module-card">
            <div className="icon">🧾</div>
            <h3>Riwayat Transaksi</h3>
            <span>Buka modul →</span>
          </Link>
          <Link to="/admin/menu" className="module-card">
            <div className="icon">⚙️</div>
            <h3>Menu & Resep</h3>
            <span>Buka modul →</span>
          </Link>
          
          {/* Kartu Baru untuk Kelola Akun */}
          <Link to="/admin/accounts" className="module-card">
            <div className="icon">👥</div>
            <h3>Kelola Akun</h3>
            <span>Buka modul →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}