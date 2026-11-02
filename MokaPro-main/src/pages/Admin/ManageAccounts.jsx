import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import './ManageAccounts.css';

// === DAFTAR 3 AKUN UTAMA (Hanya untuk ditampilkan, tidak bisa dihapus) ===
const CORE_ACCOUNTS = [
  { id: 'core-1', name: 'Kasir 01', roleTitle: 'Kasir', username: 'kasir01', password: 'kasir123', isCore: true },
  { id: 'core-2', name: 'Barista 01', roleTitle: 'Barista / Dapur', username: 'barista01', password: 'barista123', isCore: true },
  { id: 'core-3', name: 'Pengelola 01', roleTitle: 'Admin / Pengelola', username: 'admin01', password: 'admin123', isCore: true }
];

export default function ManageAccounts() {
  const [extraAccounts, setExtraAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', roleId: 'cashier', username: '', password: '' });

  // Ambil hanya akun tambahan dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mokapro_extra_accounts')) || [];
    setExtraAccounts(saved);
  }, []);

  const saveToLocalStorage = (newAccounts) => {
    setExtraAccounts(newAccounts);
    localStorage.setItem('mokapro_extra_accounts', JSON.stringify(newAccounts));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    let roleTitle = 'Kasir';
    if (formData.roleId === 'barista') roleTitle = 'Barista / Dapur';
    if (formData.roleId === 'admin') roleTitle = 'Admin / Pengelola';

    const newAccount = {
      id: `extra-${Date.now()}`,
      ...formData,
      roleTitle,
      isCore: false
    };

    saveToLocalStorage([...extraAccounts, newAccount]);
    alert('Akun baru berhasil ditambahkan!');
    setShowModal(false);
    setFormData({ name: '', roleId: 'cashier', username: '', password: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus akun ini?')) {
      const filtered = extraAccounts.filter(acc => acc.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // Gabungkan Akun Utama & Akun Tambahan untuk ditampilkan di tabel
  const allAccountsToDisplay = [...CORE_ACCOUNTS, ...extraAccounts];

  return (
    <div className="manage-accounts-page">
      <DashboardNavbar role="admin" />
      
      <main className="manage-accounts-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Kelola Akun Karyawan</h1>
            <p className="page-subtitle">Akun utama tidak dapat dihapus. Anda dapat menambah atau menghapus akun tambahan.</p>
          </div>
          <button className="btn-add-account" onClick={() => setShowModal(true)}>+ Tambah Akun Baru</button>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Karyawan</th>
                <th>Role</th>
                <th>Username</th>
                <th>Password</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allAccountsToDisplay.map((acc) => (
                <tr key={acc.id} style={{ backgroundColor: acc.isCore ? '#f9fafb' : 'transparent' }}>
                  <td>
                    <strong>{acc.name}</strong> 
                    {acc.isCore && <span style={{fontSize: '10px', color: '#10b981', marginLeft: '8px', fontWeight: 'bold'}}>(UTAMA)</span>}
                  </td>
                  <td>{acc.roleTitle}</td>
                  <td>{acc.username}</td>
                  <td>
                    <span className="password-dots">••••••••</span>
                  </td>
                  <td>
                    {acc.isCore ? (
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Dikunci</span>
                    ) : (
                      <button className="btn-delete" onClick={() => handleDelete(acc.id)}>Hapus</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Tambah Akun Baru</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nama Karyawan</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" placeholder="Contoh: Kasir 02" />
              </div>
              <div className="form-group">
                <label>Role / Jabatan</label>
                <select value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})} className="form-input">
                  <option value="cashier">Kasir</option>
                  <option value="barista">Barista / Dapur</option>
                  <option value="admin">Admin / Pengelola</option>
                </select>
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="form-input" placeholder="Username untuk login" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="text" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-input" placeholder="Password untuk login" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-save">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}