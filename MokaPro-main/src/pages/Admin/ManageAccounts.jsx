import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import './ManageAccounts.css';

// Gambar untuk icon (sesuaikan path-nya dengan struktur folder Anda)
import cashierIcon from '../../assets/role-cashier.png';
import baristaIcon from '../../assets/role-barista.png';
import adminIcon from '../../assets/role-admin.png';

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State Form
  const [formData, setFormData] = useState({ name: '', roleId: 'cashier', username: '', password: '' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mokapro_accounts')) || [];
    setAccounts(saved);
  }, []);

  const saveToLocalStorage = (newAccounts) => {
    setAccounts(newAccounts);
    localStorage.setItem('mokapro_accounts', JSON.stringify(newAccounts));
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingId(account.id);
      setFormData({ name: account.name, roleId: account.roleId, username: account.username, password: account.password });
    } else {
      setEditingId(null);
      setFormData({ name: '', roleId: 'cashier', username: '', password: '' });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Tentukan Icon & Role Title & Destination berdasarkan roleId
    let icon = cashierIcon;
    let roleTitle = 'Kasir';
    let destination = '/cashier';
    
    if (formData.roleId === 'barista') { icon = baristaIcon; roleTitle = 'Barista / Dapur'; destination = '/kds'; }
    if (formData.roleId === 'admin') { icon = adminIcon; roleTitle = 'Admin / Pengelola'; destination = '/admin'; }

    const newAccountData = {
      ...formData,
      roleTitle,
      icon,
      destination
    };

    if (editingId) {
      // Edit Mode
      const updated = accounts.map(acc => acc.id === editingId ? { ...acc, ...newAccountData } : acc);
      saveToLocalStorage(updated);
      alert('Akun berhasil diperbarui!');
    } else {
      // Tambah Baru
      const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
      const newAccount = { id: newId, ...newAccountData };
      saveToLocalStorage([...accounts, newAccount]);
      alert('Akun baru berhasil ditambahkan!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus akun ini?')) {
      const filtered = accounts.filter(acc => acc.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  return (
    <div className="manage-accounts-page">
      <DashboardNavbar role="admin" userName="Pengelola 01" userRoleLabel="Admin" />
      
      <main className="manage-accounts-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Kelola Akun Karyawan</h1>
            <p className="page-subtitle">Tambahkan, ubah, atau hapus akses login karyawan.</p>
          </div>
          <button className="btn-add-account" onClick={() => handleOpenModal()}>+ Tambah Akun</button>
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
              {accounts.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>Belum ada akun terdaftar.</td></tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td><strong>{acc.name}</strong></td>
                    <td>{acc.roleTitle}</td>
                    <td>{acc.username}</td>
                    <td>
                      <span className="password-dots">••••••••</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleOpenModal(acc)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(acc.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL TAMBAH/EDIT AKUN */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
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