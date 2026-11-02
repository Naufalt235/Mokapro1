import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import SalesChart from '../../components/SalesChart/SalesChart'; // Import Grafik
import './Shift.css';

export default function Shift() {
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: 'Memuat...', roleTitle: 'Kasir' });
  const MODAL_AWAL = 500000;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('mokapro_history')) || [];
    setHistory(savedHistory);

    const savedUser = JSON.parse(localStorage.getItem('mokapro_current_user'));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const totalPenjualan = history.reduce((acc, curr) => acc + curr.total, 0);
  const totalTransaksi = history.length;

  const getProdukTerlaris = () => {
    if (history.length === 0) return { name: '-', qty: 0 };
    const itemCounts = {};
    history.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    let maxItem = '-'; let maxQty = 0;
    for (const [name, qty] of Object.entries(itemCounts)) {
      if (qty > maxQty) { maxQty = qty; maxItem = name; }
    }
    return { name: maxItem, qty: maxQty };
  };

  const produkTerlaris = getProdukTerlaris();
  const pendapatanTunai = history.filter(h => h.method === 'Tunai').reduce((acc, curr) => acc + curr.total, 0);
  const pendapatanQRIS = history.filter(h => h.method === 'QRIS').reduce((acc, curr) => acc + curr.total, 0);
  const totalKasLaci = MODAL_AWAL + pendapatanTunai;

  const handleTutupShift = () => {
    if (history.length === 0) return alert("Belum ada transaksi hari ini.");

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "LAPORAN REKAPITULASI SHIFT KASIR MOKAPRO\n";
    csvContent += `Tanggal Cetak:,${new Date().toLocaleString('id-ID')}\n`;
    csvContent += `Kasir:,${currentUser.name}\n\n`;
    csvContent += "RINGKASAN SHIFT\n";
    csvContent += `Total Penjualan,Rp ${totalPenjualan}\n`;
    csvContent += `Total Transaksi,${totalTransaksi}\n`;
    csvContent += `Modal Kas Awal,Rp ${MODAL_AWAL}\n`;
    csvContent += `Tunai Masuk,Rp ${pendapatanTunai}\n`;
    csvContent += `QRIS Masuk,Rp ${pendapatanQRIS}\n`;
    csvContent += `Total Kas di Laci,Rp ${totalKasLaci}\n\n`;
    csvContent += "DETAIL TRANSAKSI\nID Transaksi,Waktu,Tipe,Meja,Metode,Total\n";
    history.forEach(trx => {
      csvContent += `${trx.id},"${trx.date}",${trx.type},${trx.table},${trx.method},${trx.total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Shift_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="shift-page">
      <DashboardNavbar role="cashier" />
      <main className="shift-main">
        <h1 className="page-title">Rekapitulasi Shift Kasir</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Penjualan Hari Ini</p>
            <h2>Rp {totalPenjualan.toLocaleString('id-ID')}</h2>
            <span className="stat-tag">Total keseluruhan</span>
          </div>
          <div className="stat-card">
            <p>Total Transaksi</p>
            <h2>{totalTransaksi} Pesanan</h2>
            <span className="stat-tag">Transaksi berhasil</span>
          </div>
          <div className="stat-card">
            <p>Produk Terlaris</p>
            <h2>{produkTerlaris.name}</h2>
            <span className="stat-tag">{produkTerlaris.qty} cup terjual</span>
          </div>
          <div className="stat-card">
            <p>Kas Shift Aktif</p>
            <h2>Sesuai Register</h2>
            <span className="stat-tag">Balanced</span>
          </div>
        </div>

        <div className="shift-content">
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
              <li><span>Kasir Bertugas</span> <strong>{currentUser.name}</strong></li>
              <li><span>Modal Kas Awal</span> <strong>Rp {MODAL_AWAL.toLocaleString('id-ID')}</strong></li>
              <li><span>Tunai Masuk</span> <strong className="text-green">Rp {pendapatanTunai.toLocaleString('id-ID')}</strong></li>
              <li><span>QRIS / Non-Tunai</span> <strong className="text-blue">Rp {pendapatanQRIS.toLocaleString('id-ID')}</strong></li>
              <li className="total-kas-row">
                <span>Total Kas di Laci</span> 
                <strong>Rp {totalKasLaci.toLocaleString('id-ID')}</strong>
              </li>
            </ul>
            <button className="btn-close-shift" onClick={handleTutupShift}>
              Tutup Shift & Cetak Rekap
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}