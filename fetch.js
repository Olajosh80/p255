const axios = require('axios');

async function fetchPumpTokenData(token) {
  const apiUrl = `https://gmgn.ai/defi/quotation/v1/tokens/sol/${token}`;
  
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (data.code !== 0 || data.msg !== "success") {
      console.error('API returned an error:', data.msg);
      return null;
    }

    return data.data.token;
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

// Usage example
(async () => {
  const token = 'CtpEhz9Ls7e1ansRPdNy3SFFTM9eKNnNtDuCUvK3pump'; // Replace with the desired token address
  const tokenData = await fetchPumpTokenData(token);

  if (tokenData) {
    console.log('Fetched Token Data:', tokenData);
  } else {
    console.log('Failed to fetch token data.');
  }
})();
