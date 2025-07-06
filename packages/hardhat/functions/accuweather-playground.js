// AccuWeather API test for Chainlink Functions Playground
// Based on official AccuWeather API documentation: https://developer.accuweather.com/apis
// Copy this entire code into: https://functions.chain.link/playground

// Arguments: ["Paris", "FR"]
// Secrets: apiKey = YOUR_ACCUWEATHER_API_KEY

// Parse arguments properly - handle both string and array formats
let cityName, countryCode;

if (typeof args[0] === 'string' && args[0].startsWith('[')) {
  // Arguments passed as JSON string
  try {
    const parsedArgs = JSON.parse(args[0]);
    cityName = parsedArgs[0];
    countryCode = parsedArgs[1];
  } catch (e) {
    throw Error('Invalid arguments format');
  }
} else {
  // Arguments passed as array
  cityName = args[0];
  countryCode = args[1];
}

console.log('=== ACCUWEATHER API TEST ===');
console.log('Arguments:', args);
console.log('City:', cityName);
console.log('Country:', countryCode);
console.log('API Key available:', !!secrets.apiKey);
console.log('API Key length:', secrets.apiKey ? secrets.apiKey.length : 0);

if (!secrets.apiKey) {
  throw Error('No API key provided');
}

// Step 1: Get location key using Locations API
const locationURL = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${secrets.apiKey}&q=${cityName}&country=${countryCode}`;

console.log('Searching for location:', locationURL);

const locationResponse = await Functions.makeHttpRequest({
  url: locationURL
});

if (locationResponse.error) {
  console.error('Location search failed:', locationResponse.error);
  throw Error('Location search failed');
}

console.log('Location response received');
console.log('Response data length:', locationResponse.data ? locationResponse.data.length : 0);

if (!locationResponse.data || locationResponse.data.length === 0) {
  console.log('No location data found. Response:', JSON.stringify(locationResponse));
  throw Error('No location found for this city');
}

const locationKey = locationResponse.data[0].Key;
const locationName = locationResponse.data[0].LocalizedName;
const locationCountry = locationResponse.data[0].Country.LocalizedName;

console.log('Found location:', locationName, locationCountry, 'Key:', locationKey);

// Step 2: Get current weather conditions using Current Conditions API
const weatherURL = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${secrets.apiKey}&details=true`;

console.log('Getting weather from:', weatherURL);

const weatherResponse = await Functions.makeHttpRequest({
  url: weatherURL
});

if (weatherResponse.error) {
  console.error('Weather request failed:', weatherResponse.error);
  throw Error('Weather request failed');
}

console.log('Weather response received');

const weatherData = weatherResponse.data[0];

// Return only essential weather data to stay under 256 bytes
const essentialData = {
  temp: weatherData.Temperature.Metric.Value,
  humidity: weatherData.RelativeHumidity,
  desc: weatherData.WeatherText,
  precip1h: weatherData.PrecipitationSummary?.PastHour?.Metric?.Value || 0,
  precip24h: weatherData.PrecipitationSummary?.Past24Hours?.Metric?.Value || 0
};

console.log('Final result:', JSON.stringify(essentialData));

return Functions.encodeString(JSON.stringify(essentialData)); 