import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import SalesChart from '../../components/SalesChart/SalesChart'; // Import Grafik
import './Reports.css';

export default function Reports() {
  const [history, setHistory] = useState([]);
  const [totalPendapatan, setTotalPendapatan] = useState(0);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('mokapro_history')) || [];
    setHistory(savedHistory);
    setTotalPendapatan(savedHistory.reduce((acc, curr) => acc + curr.total, 0));
  }, []);

  return (
    <div className="reports-page">
      <DashboardNavbar role="admin" userName="Pengelola 01" userRoleLabel="Admin" />
      <main className="reports-main">
        <h1 className="page-title">Laporan Penjualan & Shift</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Penjualan Hari Ini</p>
            <h2>Rp {totalPendapatan.toLocaleString('id-ID')}</h2>
          </div>
          <div className="stat-card">
            <p>Total Transaksi</p>
            <h2>{history.length} Pesanan</h2>
          </div>
          <div className="stat-card">
            <p>Produk Terlaris</p>
            <h2>Kopi Gula Aren</h2>
          </div>
          <div className="stat-card">
            <p>Kas Shift Aktif</p>
            <h2>Sesuai Register</h2>
          </div>
        </div>

        <div className="report-content">
          <div className="chart-area">
            <h3>Grafik Tren Penjualan Harian (Jam Sibuk)</h3>
            {/* Menggunakan Komponen Grafik */}
            <div className="chart-box">
              <SalesChart history={history} />
            </div>
          </div>
          
          <div className="summary-area">
            <h3>Rekapitulasi Shift Kasir</h3>
            <ul className="summary-list">
              <li><span>Kasir Bertugas</span> <strong>Semua Kasir</strong></li>
              <li><span>Modal Kas Awal</span> <strong>Rp 500.000</strong></li>
              <li><span>Tunai Masuk</span> <strong className="text-green">Rp {history.filter(h => h.method === 'Tunai').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID')}</strong></li>
              <li><span>QRIS / Non-Tunai</span> <strong className="text-blue">Rp {history.filter(h => h.method === 'QRIS').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID')}</strong></li>
            </ul>
            <button className="btn-close-shift">Tutup Shift & Cetak Rekap</button>
          </div>
        </div>
      </main>
    </div>
  );
}