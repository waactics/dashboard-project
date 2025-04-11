import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAnimalById } from '../apiService';

function AnimalDetail({ pets }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the close handler
  const handleClose = () => {
    navigate('/'); // Navigate back to home
  };

  useEffect(() => {
    console.log('Current ID:', id);
    console.log('Available pets:', pets);

    const loadAnimal = async () => {
      const cachedAnimal = pets.find(pet => pet.id.toString() === id);
      if (cachedAnimal) {
        setAnimal(cachedAnimal);
        setLoading(false);
        return;
      }

      try {
        const response = await fetchAnimalById(id);
        console.log('DEBUG - API response:', response);
        setAnimal(response.animal);
      } catch (error) {
        console.error('Error loading animal:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimal();
  }, [id, pets]);

  if (loading) return <div className="loading">Loading details...</div>;
  if (!animal) return <div className="error">Animal not found</div>;

  return (
    <div className="animal-detail-overlay" onClick={() => navigate('/')}>
      <div className="animal-detail-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => navigate('/')}>×</button>
        
        <h2>{animal.name || 'Unnamed Pet'}</h2>
      
      <div className="detail-grid">
        <div className="detail-images">
          {animal.photos?.map((photo, index) => (
            <img 
              key={index} 
              src={photo.medium} 
              alt={`${animal.name} ${index + 1}`}
              onError={(e) => e.target.src = '/placeholder.jpg'}
            />
          ))}
        </div>
        
        <div className="detail-info">
          <p><strong>Type:</strong> {animal.type || 'Unknown'}</p>
          <p><strong>Breed:</strong> {animal.breeds?.primary || 'Unknown'}</p>
          <p><strong>Gender:</strong> {animal.gender || 'Unknown'}</p>
          <p><strong>Age:</strong> {animal.age || 'Unknown'}</p>
          <p><strong>Size:</strong> {animal.size || 'Unknown'}</p>
          <p><strong>Status:</strong> {animal.status || 'Unknown'}</p>
          {animal.contact?.email && (
            <p><strong>Contact:</strong> {animal.contact.email}</p>
          )}
        </div>
      </div>
      
      {animal.description && (
        <div className="full-description">
          <h3>About</h3>
          <p>{animal.description}</p>
        </div>
      )}
      
      {animal.url && (
        <a href={animal.url} target="_blank" rel="noopener noreferrer" className="adopt-link">
          View Adoption Details
        </a>
      )}

      </div>
    </div>
  );
}

export default AnimalDetail;