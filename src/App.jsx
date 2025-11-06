// Import các hook và file CSS
import React, { useState, useEffect } from 'react';
import './App.css';

//Component SearchForm: hiển thị ô nhập để người dùng gõ từ khóa tìm kiếm.
function SearchForm({ onChangeValue, keyword }) {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Tìm theo name hoặc username"
        value={keyword}
        onChange={e => onChangeValue(e.target.value)}
      />
    </div>
  );
}

//Component AddUser: chứa form để thêm người dùng mới.
function AddUser({ onAdd, onClose }) {
  const [user, setUser] = useState({
    name: '', username: '', email: '',
    address: { street: '', city: '' },
    phone: '', website: ''
  });

  //Hàm handleChange: cập nhật state user khi người dùng nhập dữ liệu vào các ô input.
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (['street', 'city'].includes(id)) {
      setUser(u => ({ ...u, address: { ...u.address, [id]: value } }));
    } else {
      setUser(u => ({ ...u, [id]: value }));
    }
  };
//Hàm handleAdd: kiểm tra thông tin bắt buộc (Name và Username).
  const handleAdd = () => {
    if (!user.name.trim() || !user.username.trim()) {
      alert('Vui lòng điền Name và Username');
      return;
    }
    onAdd(user);
    onClose();
  };

  return (
    <div>
      <div style={{ display: 'grid', gap: 8 }}>
        <input id="name" placeholder="Name" value={user.name} onChange={handleChange} />
        <input id="username" placeholder="Username" value={user.username} onChange={handleChange} />
        <input id="email" placeholder="Email" value={user.email} onChange={handleChange} />
        <input id="street" placeholder="Street" value={user.address.street} onChange={handleChange} />
        <input id="city" placeholder="City" value={user.address.city} onChange={handleChange} />
        <input id="phone" placeholder="Phone" value={user.phone} onChange={handleChange} />
        <input id="website" placeholder="Website" value={user.website} onChange={handleChange} />
        <div className="actions">
          <button onClick={handleAdd}>Lưu</button>
          <button className="secondary" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

//Component EditUserModal: hiển thị form sửa thông tin người dùng.
function EditUserModal({ editing, onChangeEditing, onSave, onClose }) {
  if (!editing) return null;
  const handleChange = (field, value) => {
    if (['street', 'city'].includes(field)) {
      onChangeEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      onChangeEditing({ ...editing, [field]: value });
    }
  };

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

//Component ResultTable: là phần chính quản lý danh sách người dùng.
function ResultTable() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  //Lấy dữ liệu người dùng từ API JSONPlaceholder khi component được mount.
  //Sau khi fetch xong, cập nhật vào users và tắt trạng thái loading.
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(u => {
    const kw = keyword.toLowerCase();
    return u.name.toLowerCase().includes(kw) || u.username.toLowerCase().includes(kw);
  });

  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: prev.length + 1 }]);
  };

  const saveUser = (edited) => {
    setUsers(prev => prev.map(u => u.id === edited.id ? edited : u));
    setEditing(null);
  };

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div>
      <div className="header">
        <SearchForm onChangeValue={setKeyword} keyword={keyword} />
        <button onClick={() => setShowAdd(true)}>Thêm</button>
      </div>
      {loading ? <div className="loading">Đang tải dữ liệu...</div> : (
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
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm người dùng</h3>
            <AddUser onAdd={addUser} onClose={() => setShowAdd(false)} />
          </div>
        </div>
      )}
      <EditUserModal editing={editing} onChangeEditing={setEditing} onSave={saveUser} onClose={() => setEditing(null)} />
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Quản lý người dùng (React CRUD)</h1>
      <ResultTable />
    </div>
  );
}

export default App;
