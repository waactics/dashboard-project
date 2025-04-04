import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsDashboard from './components/StatsDashboard';
import './styles/App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  // petfinder api credentials
  const API_KEY = 'eVxejWL2rnLsigLC3kyL4WsitGCXnooIbZCyazhNholCA4Gdyo';
  const API_SECRET = 'TpqFgmetg56yNYr8DBnFBtpef4ImFjoomRiv1Aww';

  // get oauth token
  const getAccessToken = async () => {
    try {
      const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: API_KEY,
          client_secret: API_SECRET
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (err) {
      console.error('Error getting access token:', err);
      throw err;
    }
  };

  // fetch pets from API
  const fetchPets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // first get access token
      const token = await getAccessToken();
      setAccessToken(token);
      
      // then fetch pets with retry logic
      const petsResponse = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!petsResponse.ok) {
        // if unauthorized, try refreshing token once
        if (petsResponse.status === 401) {
          const newToken = await getAccessToken();
          setAccessToken(newToken);
          const retryResponse = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch pets: ${retryResponse.status}`);
          }
          
          const retryData = await retryResponse.json();
          setPets(retryData.animals || []);
          setFilteredPets((retryData.animals || []).slice(0, 10));
          return;
        }
        
        throw new Error(`Failed to fetch pets: ${petsResponse.status}`);
      }

      const result = await petsResponse.json();
      const petsData = result.animals || [];
      setPets(petsData);
      setFilteredPets(petsData.slice(0, 10));
    } catch (err) {
      setError(err.message);
      setPets([]);
      setFilteredPets([]);
      console.error('API Error:', err);
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

  useEffect(() => {
    fetchPets();
  }, []);

  return (
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
        {!isLoading && !error && (
          <Dashboard pets={filteredPets} />
        )}
      </main>
    </div>
  );
}

export default App;