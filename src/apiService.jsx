// utils/apiService.js
const API_KEY = 'eVxejWL2rnLsigLC3kyL4WsitGCXnooIbZCyazhNholCA4Gdyo';
const API_SECRET = 'TpqFgmetg56yNYr8DBnFBtpef4ImFjoomRiv1Aww';

let accessToken = '';
let tokenExpiration = 0;

const animalCache = new Map();

async function getAccessToken(forceRefresh = false) {
  //return cached token if it's still valid (typically lasts 1 hour)
  if (!forceRefresh && accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

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

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000; // 1 min buffer
  return accessToken;
}


export async function fetchAnimals() {
  try {
    const token = await getAccessToken();
    const response = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try refreshing once
        const newToken = await getAccessToken(true); // Force refresh
        const retryResponse = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Failed to fetch pets: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }
      throw new Error(`Failed to fetch pets: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err; // Re-throw to let the caller handle it
  }
}


export async function fetchAnimalById(id) {
  console.log('Fetching animal with ID:', id);

    // check cache first
    if (animalCache.has(id)) {
      return { animal: animalCache.get(id) };
    }

  try {
    const token = await getAccessToken();
    const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try refreshing once
        const newToken = await getAccessToken(true); // Force refresh
        const retryResponse = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Failed to fetch animal: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }
      throw new Error(`Failed to fetch animal: ${response.status}`);
    }

    const data = await response.json();
    // cache the result
    animalCache.set(id, data.animal);
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}