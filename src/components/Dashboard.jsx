import DataCard from './DataCard';

function Dashboard({ pets, onAnimalSelect }) {
  if (!pets || !Array.isArray(pets)) {
    return <div className="no-results">No pets data available</div>;
  }

  return (
    <div className="dashboard-container">
      {pets.length > 0 ? (
        pets.map(pet => (
          <DataCard
            key={pet.id || Math.random()}
            item={pet}
            onClick={onAnimalSelect}
          />
        ))
      ) : (
        <div className="no-results">No matching pets found</div>
      )}
    </div>
  );
}

export default Dashboard;