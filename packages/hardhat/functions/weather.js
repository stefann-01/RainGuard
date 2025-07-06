// This function fetches weather data from OpenWeather API
// Args: [zipcode, countryCode, units]
// Secrets: apiKey (OpenWeather API key)

if (!secrets.apiKey) {
  throw Error("OpenWeather API Key is not available!")
}

const zipCode = args[0];
const countryCode = args[1];
const units = args[2] || "metric";

console.log(`Fetching weather for: ${zipCode}, ${countryCode}`);

// First, get coordinates from zipcode
const geoCodingURL = "http://api.openweathermap.org/geo/1.0/zip";
const geoCodingRequest = Functions.makeHttpRequest({
    url: geoCodingURL,
    method: "GET",
    params: {
        zip: `${zipCode},${countryCode}`,
        appid: secrets.apiKey
    }
});

const geoCodingResponse = await geoCodingRequest;
if (geoCodingResponse.error) {
    console.error(geoCodingResponse.error);
    throw Error("Geocoding request failed");
}

console.log("Geocoding response:", geoCodingResponse.data);

const latitude = geoCodingResponse.data.lat;
const longitude = geoCodingResponse.data.lon;

// Now get weather data
const weatherURL = "https://api.openweathermap.org/data/2.5/weather";
const weatherRequest = Functions.makeHttpRequest({
    url: weatherURL,
    method: "GET",
    params: {
        lat: latitude,
        lon: longitude,
        appid: secrets.apiKey,
        units: units
    }
});

const weatherResponse = await weatherRequest;
if (weatherResponse.error) {
    console.error(weatherResponse.error);
    throw Error("Weather request failed");
}

console.log("Weather response:", weatherResponse.data);

// Extract weather data
const temperature = weatherResponse.data.main.temp;
const humidity = weatherResponse.data.main.humidity;
const description = weatherResponse.data.weather[0].description;
const location = weatherResponse.data.name;

// Create result object
const result = {
    temperature: temperature,
    humidity: humidity,
    description: description,
    location: location,
    units: units,
    timestamp: Date.now()
};

console.log("Final result:", result);

// Return encoded result
return Functions.encodeString(JSON.stringify(result)); 