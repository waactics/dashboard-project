import { useState } from 'react';

function Header({ onRefresh, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <header>
      <h1>Data Dashboard</h1>
      <div className="features">
        <button onClick={onRefresh}>Refresh Data</button>
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..." 
        />
      </div>
    </header>
  );
}

export default Header;