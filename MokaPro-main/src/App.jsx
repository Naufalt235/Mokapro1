import { Routes, Route } from 'react-router-dom';

// Import halaman
import Welcome from './pages/Welcome/Welcome';
import SelectUser from './pages/SelectUser/SelectUser';
import CashierPin from './pages/CashierPin/CashierPin';
import BaristaPin from './pages/BaristaPin/BaristaPin';
import AdminPin from './pages/AdminPin/AdminPin';

import Cashier from './pages/Cashier/Cashier';
import KDS from './pages/KDS/KDS';
import Admin from './pages/Admin/Admin';
import History from './pages/History/History';
import Shift from './pages/Shift/Shift';
import Inventory from './pages/Admin/Inventory';
import Menu from './pages/Admin/Menu';
import Reports from './pages/Admin/Reports';
import HistoryAdmin from './pages/Admin/HistoryAdmin'; // Riwayat Khusus Admin
import ManageAccounts from './pages/Admin/ManageAccounts'; // Kelola Akun

export default function App() {
  return (
    <Routes>
      {/* RUTE AWAL & AUTENTIKASI */}
      <Route path="/" element={<Welcome />} />
      <Route path="/select-user" element={<SelectUser />} />
      
      {/* RUTE PIN (Jika masih ingin menggunakan halaman PIN lama) */}
      <Route path="/cashier/pin" element={<CashierPin />} />
      <Route path="/barista/pin" element={<BaristaPin />} />
      <Route path="/admin/pin" element={<AdminPin />} />

      {/* RUTE KASIR */}
      <Route path="/cashier" element={<Cashier />} />
      <Route path="/history" element={<History />} />
      <Route path="/cashier/shift" element={<Shift />} />

      {/* RUTE BARISTA (KDS) */}
      <Route path="/kds" element={<KDS />} />

      {/* RUTE ADMIN / PENGELOLA */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/inventory" element={<Inventory />} />
      <Route path="/admin/menu" element={<Menu />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/history" element={<HistoryAdmin />} />
      <Route path="/admin/accounts" element={<ManageAccounts />} />
    </Routes>
  );
}