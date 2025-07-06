import { ethers } from "hardhat";

async function main() {
  console.log("Testing WeatherConsumer contract...");

  // Get the deployed contract
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer");
  const weatherConsumer = await WeatherConsumer.attach("YOUR_CONTRACT_ADDRESS_HERE");
  console.log("Contract address:", await weatherConsumer.getAddress());

  // Get current weather data
  console.log("\n=== Current Weather Data ===");
  const weatherData = await weatherConsumer.getWeatherData();
  console.log("Weather:", weatherData[0]);
  console.log("Location:", weatherData[1]);
  console.log("Temperature (0.01°C):", weatherData[2].toString());
  console.log("Humidity (%):", weatherData[3].toString());
  console.log("Last Updated:", new Date(Number(weatherData[4]) * 1000).toLocaleString());

  // Check if data is recent
  const isRecent = await weatherConsumer.isWeatherDataRecent();
  console.log("Data is recent (< 1 hour):", isRecent);

  // Get temperature in Celsius
  const tempCelsius = await weatherConsumer.getTemperatureCelsius();
  console.log("Temperature (°C):", tempCelsius.toString());

  // Get contract configuration
  console.log("\n=== Contract Configuration ===");
  const donId = await weatherConsumer.s_donId();
  const subscriptionId = await weatherConsumer.s_subscriptionId();
  const callbackGasLimit = await weatherConsumer.s_callbackGasLimit();
  const requestConfirmations = await weatherConsumer.s_requestConfirmations();

  console.log("DON ID:", donId);
  console.log("Subscription ID:", subscriptionId.toString());
  console.log("Callback Gas Limit:", callbackGasLimit.toString());
  console.log("Request Confirmations:", requestConfirmations.toString());

  // Get source code
  const source = await weatherConsumer.source();
  console.log("\n=== Source Code Length ===");
  console.log("Source code length:", source.length, "characters");

  console.log("\n=== Test Complete ===");
  console.log("To request weather data, call sendRequest() with:");
  console.log("- subscriptionId: Your subscription ID");
  console.log("- args: ['10001', 'US', 'metric'] (zipcode, country, units)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 