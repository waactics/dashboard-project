import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
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
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with PetFinder API');
      }

      const data = await response.json();
      return data.access_token;
    } catch (err) {
      console.error('Error getting access token:', err);
      throw err;
    }
  };

  // fetch pets from api
  const fetchPets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // first get access token
      const token = await getAccessToken();
      setAccessToken(token);
      
      // then fetch pets
      const petsResponse = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!petsResponse.ok) {
        throw new Error('Failed to fetch pets data');
      }

      const result = await petsResponse.json();
      setPets(result.animals || []);
      setFilteredPets((result.animals || []).slice(0, 10)); // Show first 10 by default
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPets(pets.slice(0, 10));
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = pets.filter(pet => 
      pet.name?.toLowerCase().includes(term) ||
      pet.breeds?.primary?.toLowerCase().includes(term) ||
      pet.type?.toLowerCase().includes(term) ||
      pet.gender?.toLowerCase().includes(term) ||
      pet.description?.toLowerCase().includes(term)
    );
    setFilteredPets(filtered.slice(0, 10));
  };

  // initial data fetch
  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="app">
      <Header 
        onRefresh={fetchPets} 
        onSearch={handleSearch} 
      />
      
      <main>
        {isLoading && <div className="loading">Loading pets data...</div>}
        {error && <div className="error">{error}</div>}
        {!isLoading && !error && (
          <Dashboard pets={filteredPets} />
        )}
      </main>
    </div>
  );
}

export default App;