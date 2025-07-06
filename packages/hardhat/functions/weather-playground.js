// Weather API test for Chainlink Functions Playground
// Copy this entire code into: https://functions.chain.link/playground

// Arguments: ["10001", "US", "metric"]
// Replace with your actual OpenWeather API key in the secrets section

const zipCode = args[0];
const countryCode = args[1];
const units = args[2] || 'metric';

// Check if API key is available
if (!secrets.apiKey) {
  throw Error('OpenWeather API Key is not available!');
}

// Make the weather API request
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${secrets.apiKey}&units=${units}`;

console.log('Requesting weather for:', zipCode, countryCode, 'in', units);
console.log('API URL:', weatherURL);

const apiResponse = await Functions.makeHttpRequest({
  url: weatherURL
});

if (apiResponse.error) {
  console.error('API Error:', apiResponse.error);
  throw Error('Weather request failed');
}

const { data } = apiResponse;

console.log('API response data:', JSON.stringify(data, null, 2));

// Extract weather information
const result = {
  temperature: data.main.temp,
  humidity: data.main.humidity,
  description: data.weather[0].description,
  location: data.name,
  units: units,
  timestamp: Date.now()
};

console.log('Processed result:', JSON.stringify(result, null, 2));

// Return the weather data as encoded string
return Functions.encodeString(JSON.stringify(result)); 