import { useState } from 'react';

function Header({ onRefresh, onSearch, onFilter }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterAge, setFilterAge] = useState('');
  
    const handleSearchChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      onSearch(term, { type: filterType, gender: filterGender, age: filterAge });
    };
  
    const handleFilterChange = (filterName, value) => {
      if (filterName === 'type') setFilterType(value);
      if (filterName === 'gender') setFilterGender(value);
      if (filterName === 'age') setFilterAge(value);
      
      onSearch(searchTerm, { 
        ...{ type: filterType, gender: filterGender, age: filterAge },
        [filterName]: value 
      });
    };
  
    return (
      <header>
        <h1>FurEver Friend Finder</h1>
        <div className="features">
          <button onClick={onRefresh}>Refresh Data</button>
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search pets..." 
          />
          
          {/* filter dropdowns */}
          <select 
            value={filterType}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Types</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
          </select>
          
          <select 
            value={filterGender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          
          <select 
            value={filterAge}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Ages</option>
            <option value="Baby">Baby</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </header>
    );
  }

  export default Header;