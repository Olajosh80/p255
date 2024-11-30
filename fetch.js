async function fetchDexScreenerData(pairAddress) {
  const apiUrl = `https://api.dexscreener.com/latest/dex/pairs/${pairAddress}`;

  try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data from DexScreener API:', error);
      return null;
  }
}

// Example usage:
const pairAddress = 'EaWM2rWyqKucBNcvX3pPcJYvXZSDwukvFnAKYdCsvszm'; // Replace with your pair address
fetchDexScreenerData(pairAddress).then(data => {
  if (data) {
      console.log('Fetched data:', data);
  }
});