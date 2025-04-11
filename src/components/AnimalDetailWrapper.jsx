import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimalById } from '../apiService';
import AnimalDetail from './AnimalDetail';

function AnimalDetailWrapper({ pets }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnimal = async () => {
      const cachedAnimal = pets.find(pet => pet.id.toString() === id);
      if (cachedAnimal) {
        setAnimal(cachedAnimal);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchAnimalById(id);
        setAnimal(response.animal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnimal();
  }, [id, pets]);

  const handleClose = () => navigate('/');

  if (loading) return <div className="loading">Loading details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!animal) return <div className="error">Animal not found</div>;

  return <AnimalDetail animal={currentAnimal} onClose={() => navigate('/')} />;
}

export default AnimalDetailWrapper;