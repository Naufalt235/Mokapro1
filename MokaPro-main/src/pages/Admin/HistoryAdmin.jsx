import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import '../History/History.css'; // Pinjam CSS riwayat kasir

export default function HistoryAdmin() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('mokapro_history')) || [];
    setHistory(savedHistory);
  }, []);

  const totalPendapatan = history.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="history-page">
      {/* Ganti role menjadi admin agar navbar-nya menyesuaikan */}
      <DashboardNavbar role="admin" userName="Pengelola 01" userRoleLabel="Admin" />
      
      <main className="history-main">
        <div className="header-section">
          <h1 className="page-title">Riwayat Transaksi (Pengelola)</h1>
          <p className="page-subtitle">Daftar seluruh transaksi yang tercatat di sistem.</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span className="card-label">Jumlah transaksi tersimpan</span>
            <span className="card-value">{history.length}</span>
          </div>
          <div className="summary-card">
            <span className="card-label">Total nominal tersimpan</span>
            <span className="card-value">Rp {totalPendapatan.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="log-section">
          <div className="log-header">
            <h3>Log Pembayaran</h3>
          </div>
          
          {history.length === 0 ? (
            <div className="empty-log">
              <p>Belum ada transaksi. Silakan buat pesanan di halaman Kasir.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Waktu</th>
                  <th>Kasir</th>
                  <th>Meja / Tipe</th>
                  <th>Metode</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {history.map((trx) => (
                  <tr key={trx.id}>
                    <td><strong>{trx.id}</strong></td>
                    <td>{trx.date}</td>
                    <td>Kasir 01</td>
                    <td>{trx.table} ({trx.type})</td>
                    <td>{trx.method}</td>
                    <td>Rp {trx.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}