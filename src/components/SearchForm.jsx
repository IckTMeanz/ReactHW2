import React from 'react';
//Component SearchForm: dùng để nhập từ khóa tìm kiếm người dùng
function SearchForm({ onChangeValue, keyword }) {
  return (
    //Thẻ bao quanh input, có class controls để định dạng giao diện
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

export default SearchForm;
