import React from 'react';
import ResultTable from './components/ResultTable';
import './styles.css';

function App() {
  return (
    <div className="container">
      <h1>Quản lý người dùng (React CRUD)</h1>
      <ResultTable />
    </div>
  );
}

export default App;
