import { useNavigate } from 'react-router-dom';

function DataCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="data-card"
      onClick={() => navigate(`/animal/${item.id}`)}
    >
      <h3>{item.name || 'Unnamed Pet'}</h3>
      {item.photos?.[0]?.medium && (
        <img 
          src={item.photos[0].medium} 
          alt={item.name} 
          className="pet-image"
        />
      )}
      <p><strong>Type:</strong> {item.type || 'Unknown'}</p>
      <p><strong>Breed:</strong> {item.breeds?.primary || 'Unknown'}</p>
      <p><strong>Gender:</strong> {item.gender || 'Unknown'}</p>
      <p><strong>Age:</strong> {item.age || 'Unknown'}</p>
      {item.description && (
        <p className="description">{item.description.substring(0, 100)}...</p>
      )}
    </div>
  );
}
  
  export default DataCard;