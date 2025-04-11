import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsDashboard from './components/StatsDashboard';
import AnimalDetail from './components/AnimalDetail';
import { fetchAnimals, fetchAnimalById } from './apiService';
import './styles/App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnimalDetails = async (id) => {
    try {
      setIsLoading(true);
      // First check if animal exists in cached pets
      const cachedAnimal = pets.find(pet => pet.id.toString() === id);
      if (cachedAnimal) {
        setSelectedAnimal(cachedAnimal);
        return;
      }
      
      // If not in cache, fetch from API
      const response = await fetchAnimalById(id);
      setSelectedAnimal(response.animal);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch pets from api
  const fetchPets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchAnimals();
      const petsData = result.animals || [];

      setPets(petsData);
      setFilteredPets(petsData.slice(0, 10));
    } catch (err) {
      setError(err.message);
      setPets([]);
      setFilteredPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // handle search and filters
  const handleSearch = (searchTerm, filters = {}) => {
    if (!searchTerm && !filters.type && !filters.gender && !filters.age) {
      setFilteredPets(pets.slice(0, 10));
      return;
    }
    
    const term = searchTerm?.toLowerCase() || '';
    const filtered = pets.filter(pet => {
      const matchesSearch = !term || 
        pet.name?.toLowerCase().includes(term) ||
        pet.breeds?.primary?.toLowerCase().includes(term) ||
        pet.description?.toLowerCase().includes(term);
      
      const matchesType = !filters.type || pet.type === filters.type;
      const matchesGender = !filters.gender || pet.gender === filters.gender;
      const matchesAge = !filters.age || pet.age === filters.age;
      
      return matchesSearch && matchesType && matchesGender && matchesAge;
    });
    
    setFilteredPets(filtered.slice(0, 10));
  };

  return (
    <Router>
    <div className="app">
      <Header 
        onRefresh={fetchPets} 
        onSearch={handleSearch} 
      />
      
      <StatsDashboard pets={filteredPets} />
      
      <main>
        {isLoading && <div className="loading">Loading pets data...</div>}
        {error && (
          <div className="error">
            {error}
            <button onClick={fetchPets} className="retry-btn">Retry</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard pets={filteredPets} />} />
          <Route
            path="/animal/:id"
            element={ <AnimalDetail pets={pets}/> }
          />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;