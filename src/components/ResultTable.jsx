import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import AddUser from './AddUser';

//  modal dùng để chỉnh sửa thông tin người dùng
function EditUserModal({ editing, onChangeEditing, onSave, onClose }) {
  // nếu không có user đang chỉnh sửa thì không hiển thị modal
  if (!editing) return null;

  // xử lý thay đổi dữ liệu trong form chỉnh sửa
  const handleChange = (field, value) => {
    if (['street', 'city'].includes(field)) {
      onChangeEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      onChangeEditing({ ...editing, [field]: value });
    }
  };

  // jsx cho giao diện modal chỉnh sửa
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Chỉnh sửa người dùng</h3>
        <input value={editing.name} onChange={e => handleChange('name', e.target.value)} />
        <input value={editing.username} onChange={e => handleChange('username', e.target.value)} />
        <input value={editing.email} onChange={e => handleChange('email', e.target.value)} />
        <input value={editing.address?.street || ''} onChange={e => handleChange('street', e.target.value)} />
        <input value={editing.address?.city || ''} onChange={e => handleChange('city', e.target.value)} />
        <input value={editing.phone} onChange={e => handleChange('phone', e.target.value)} />
        <input value={editing.website} onChange={e => handleChange('website', e.target.value)} />
        <div className="actions">
          <button onClick={() => onSave(editing)}>Lưu</button>
          <button className="secondary" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// component chính hiển thị bảng dữ liệu người dùng
function ResultTable() {
  // Các state chính của ứng dụng
  const [users, setUsers] = useState([]);          // Danh sách người dùng
  const [keyword, setKeyword] = useState('');      // Từ khóa tìm kiếm
  const [showAdd, setShowAdd] = useState(false);   // Trạng thái hiển thị modal thêm mới
  const [editing, setEditing] = useState(null);    // Dữ liệu người dùng đang chỉnh sửa
  const [loading, setLoading] = useState(true);    // Trạng thái đang tải dữ liệu

  //  Lấy dữ liệu từ API JSONPlaceholder khi component mount
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  //lọc danh sách theo từ khóa (name hoặc username)
  const filtered = users.filter(u => {
    const kw = (keyword || '').toLowerCase();
    return (u.name || '').toLowerCase().includes(kw) || (u.username || '').toLowerCase().includes(kw);
  });

  // thêm người dùng mới
  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: prev.length ? Math.max(...prev.map(x=>x.id))+1 : 1 }]);
  };

  // lưu thông tin người dùng sau khi chỉnh sửa
  const saveUser = (edited) => {
    setUsers(prev => prev.map(u => u.id === edited.id ? edited : u));
    setEditing(null);
  };

  // xóa người dùng theo ID
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  // giao diện chính: ô tìm kiếm + bảng kết quả + các modal
  return (
    <div>
      {/* Thanh công cụ gồm tổng số người và ô tìm kiếm */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="small">Tổng: {users.length} người</div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <SearchForm onChangeValue={setKeyword} keyword={keyword} />
          <button onClick={() => setShowAdd(true)}>Thêm</button>
        </div>
      </div>

      {/* Hiển thị bảng dữ liệu hoặc thông báo đang tải */}
      {loading ? <div className="loading">Đang tải dữ liệu</div> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>City</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.address?.city}</td>
                <td>
                  <button onClick={() => setEditing(u)}>Sửa</button>
                  <button className="danger" onClick={() => deleteUser(u.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal thêm người dùng */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm người dùng</h3>
            <AddUser onAdd={addUser} onClose={() => setShowAdd(false)} />
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa người dùng */}
      <EditUserModal editing={editing} onChangeEditing={setEditing} onSave={saveUser} onClose={() => setEditing(null)} />
    </div>
  );
}

export default ResultTable;
