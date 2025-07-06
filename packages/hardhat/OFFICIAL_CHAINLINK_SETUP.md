# Official Chainlink Functions Weather Setup Guide

This guide follows the [official Chainlink Functions documentation](https://docs.chain.link/chainlink-functions/getting-started) to implement weather data fetching using Chainlink Functions.

## Overview

We're implementing a weather insurance protocol that:
1. Uses Chainlink Functions to fetch real-time weather data from OpenWeather API
2. Stores weather data on-chain for insurance calculations
3. Follows the official Chainlink Functions patterns and best practices

## Contract Architecture

### WeatherConsumer.sol
- **Inherits**: `FunctionsClient` and `Ownable`
- **Key Features**:
  - Sends weather requests via Chainlink Functions
  - Stores weather data on-chain
  - Handles API responses and errors
  - Provides utility functions for data access

### Key Components

1. **FunctionsClient Integration**: Uses official Chainlink Functions client
2. **Request Management**: Tracks request IDs and responses
3. **Weather Data Storage**: Stores temperature, humidity, location, and timestamp
4. **Error Handling**: Proper error handling for failed requests
5. **Events**: Emits events for request tracking and data updates

## Setup Steps

### 1. Prerequisites

- MetaMask wallet with Sepolia testnet configured
- Testnet ETH and LINK tokens
- OpenWeather API key (free at https://openweathermap.org/api)

### 2. Deploy the Contract

```bash
# Deploy to Sepolia
yarn deploy --network sepolia
```

The contract will be deployed with:
- **Router**: `0xD0daae2231E9CB96b94C8512223533293C3693Bf` (Sepolia)
- **DON ID**: `0x66756e2d657468657265756d2d7365706f6c69612d31000000000000000000`
- **Subscription ID**: `0` (will be updated after creation)

### 3. Create Chainlink Functions Subscription

1. Go to [functions.chain.link](https://functions.chain.link)
2. Connect your MetaMask wallet (Sepolia network)
3. Accept Terms of Service
4. Click "Create Subscription"
5. Provide email and subscription name
6. Approve subscription creation

### 4. Fund Your Subscription

1. After subscription creation, click "Add funds"
2. Add at least 2 LINK tokens
3. Confirm the transaction

### 5. Add Consumer to Subscription

1. In your subscription dashboard, click "Add consumer"
2. Enter your deployed contract address
3. Confirm the transaction

### 6. Update Contract Configuration

After getting your subscription ID, update the contract:

```bash
# Update subscription ID (replace with your actual subscription ID)
yarn hardhat run scripts/update-subscription.ts --network sepolia
```

### 7. Upload API Key as Secret

```bash
# Install functions toolkit if not already installed
npm install -g @chainlink/functions-toolkit

# Upload your OpenWeather API key
npx functions upload-secrets \
  --secrets apiKey=YOUR_OPENWEATHER_API_KEY \
  --slot-id 1 \
  --don-id sepolia-1
```

### 8. Test the Contract

```bash
# Test the contract
yarn hardhat run scripts/test-weather-consumer.ts --network sepolia
```

## Usage

### Request Weather Data

```solidity
// Request weather for New York (10001, US) in Celsius
weatherConsumer.sendRequest(
    subscriptionId,  // Your subscription ID
    ["10001", "US", "metric"]  // [zipcode, country, units]
);
```

### Get Weather Data

```solidity
// Get current weather data
(
    string memory _weather,
    string memory _location,
    uint256 _temperature,
    uint256 _humidity,
    uint256 _lastUpdated
) = weatherConsumer.getWeatherData();

// Get temperature in Celsius
uint256 tempCelsius = weatherConsumer.getTemperatureCelsius();

// Check if data is recent (< 1 hour)
bool isRecent = weatherConsumer.isWeatherDataRecent();
```

## JavaScript Source Code

The contract includes hardcoded JavaScript source code that:

1. **Geocoding**: Converts zipcode to coordinates using OpenWeather Geocoding API
2. **Weather Data**: Fetches current weather using coordinates
3. **Data Processing**: Extracts temperature, humidity, and description
4. **Response Format**: Returns JSON string with weather data

### Source Code Features

- **Error Handling**: Proper error handling for API failures
- **Secret Management**: Uses `secrets.apiKey` for API authentication
- **Data Validation**: Validates API responses before processing
- **Flexible Units**: Supports metric/imperial units
- **Location Data**: Includes location name in response

## Network Configuration

### Sepolia Testnet
- **Router**: `0xD0daae2231E9CB96b94C8512223533293C3693Bf`
- **DON ID**: `0x66756e2d657468657265756d2d7365706f6c69612d31000000000000000000`
- **LINK Token**: `0x779877A7B0D9E8603169DdbD7836e478b4624789`

### Mainnet (when ready)
- **Router**: `0xA9d587a00A31A4D9f2B5B7B3C8C8C8C8C8C8C8C8C`
- **DON ID**: `0x66756e2d657468657265756d2d31000000000000000000000000000000000000`
- **LINK Token**: `0x514910771AF9Ca656af840dff83E8264EcF986CA`

## Troubleshooting

### Common Issues

1. **"Request failed"**: Check API key and network connectivity
2. **"Geocoding request failed"**: Verify zipcode and country code format
3. **"Weather request failed"**: Check OpenWeather API status
4. **Insufficient funds**: Ensure subscription has enough LINK tokens

### Debug Steps

1. **Check subscription balance**: Visit functions.chain.link
2. **Verify API key**: Test API key directly with OpenWeather
3. **Check network**: Ensure wallet is on Sepolia testnet
4. **Review logs**: Check transaction logs for error details

## Next Steps

1. **Insurance Logic**: Add insurance calculation functions
2. **Automation**: Implement Chainlink Automation for regular updates
3. **Multiple Locations**: Support multiple weather locations
4. **Data Validation**: Add more robust data validation
5. **Gas Optimization**: Optimize contract for gas efficiency

## Resources

- [Chainlink Functions Documentation](https://docs.chain.link/chainlink-functions/getting-started)
- [OpenWeather API Documentation](https://openweathermap.org/api)
- [Chainlink Functions Playground](https://functions.chain.link/playground)
- [Chainlink Functions Subscription Manager](https://functions.chain.link) 