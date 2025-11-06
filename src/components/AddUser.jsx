import React, { useState } from 'react';

// component AddUser: dùng để thêm người dùng mới
function AddUser({ onAdd, onClose }) {
  //  lưu thông tin người dùng mới nhập
  const [user, setUser] = useState({
    name: '', username: '', email: '',
    address: { street: '', city: '' },
    phone: '', website: ''
  });

  // hàm xử lý khi người dùng nhập dữ liệu vào các ô input
  const handleChange = (e) => {
    const { id, value } = e.target;
    // street hoặc city thì cập nhật trong object address
    if (['street', 'city'].includes(id)) {
      setUser(u => ({ ...u, address: { ...u.address, [id]: value } }));
    } else {
      setUser(u => ({ ...u, [id]: value }));
    }
  };

  // hàm xử lý khi người dùng nhấn nút lưu
  const handleAdd = () => {
    //  Name và Username không được để trống
    if (!user.name.trim() || !user.username.trim()) {
      alert('Vui lòng điền Name và Username');
      return;
    }
    //hàm onAdd (truyền từ component cha) để thêm user mới
    onAdd(user);
    // đóng modal
    onClose();
  };

  //jsx hiển thị form nhập thông tin người dùng mới
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

export default AddUser;
