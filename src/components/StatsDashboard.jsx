function StatsDashboard({ pets }) {
    if (!pets || pets.length === 0) return null;
  
    // calculate statistics
    const totalPets = pets.length;
    const types = {};
    const ages = [];
    const weights = [];
  
    pets.forEach(pet => {
      // count types
      if (pet.type) {
        types[pet.type] = (types[pet.type] || 0) + 1;
      }
      
      // collect ages (convert to numbers if possible)
      if (pet.age) {
        const ageNum = parseFloat(pet.age);
        if (!isNaN(ageNum)) ages.push(ageNum);
      }
      
      // collect weights
      if (pet.weight) {
        const weightNum = parseFloat(pet.weight);
        if (!isNaN(weightNum)) weights.push(weightNum);
      }
    });
  
    // calculate age statistics
    const calculateStats = (values) => {
      if (values.length === 0) return null;
      
      const sorted = [...values].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];
      const q1 = sorted[Math.floor(sorted.length / 4)];
      const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
      const mean = (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(1);
      
      return { min, max, median, q1, q3, mean };
    };
  
    const ageStats = calculateStats(ages);
    const weightStats = calculateStats(weights);
  
    // get most common type
    const mostCommonType = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b, '');
  
    return (
      <div className="stats-dashboard">
        <div className="stat-card">
          <h3>Total Pets</h3>
          <p className="stat-value">{totalPets}</p>
        </div>
        
        <div className="stat-card">
          <h3>Most Common Type</h3>
          <p className="stat-value">{mostCommonType || 'N/A'}</p>
          <p className="stat-detail">{types[mostCommonType]} pets</p>
        </div>
        
        {ageStats && (
          <div className="stat-card">
            <h3>Age Statistics</h3>
            <p className="stat-value">{ageStats.mean} years (avg)</p>
            <p className="stat-detail">
              Range: {ageStats.min}-{ageStats.max} yrs
            </p>
            <p className="stat-detail">
              Quartiles: {ageStats.q1}/{ageStats.median}/{ageStats.q3} yrs
            </p>
          </div>
        )}
        
        {weightStats && (
          <div className="stat-card">
            <h3>Weight Statistics</h3>
            <p className="stat-value">{weightStats.mean} lbs (avg)</p>
            <p className="stat-detail">
              Range: {weightStats.min}-{weightStats.max} lbs
            </p>
            <p className="stat-detail">
              Quartiles: {weightStats.q1}/{weightStats.median}/{weightStats.q3} lbs
            </p>
          </div>
        )}
      </div>
    );
  }
  
  export default StatsDashboard;