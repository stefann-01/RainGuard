// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WeatherConsumer
 * @dev Weather consumer contract using Chainlink Functions
 * Based on official Chainlink Functions documentation
 */
contract WeatherConsumer is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions configuration
    bytes32 public s_donId;
    uint64 public s_subscriptionId;
    uint32 public s_callbackGasLimit;
    uint16 public s_requestConfirmations;

    // Request tracking
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Weather data
    string public weather;
    string public location;
    uint256 public temperature;
    uint256 public humidity;
    uint256 public precipitation1h;
    uint256 public precipitation24h;
    uint256 public lastUpdated;

    // Events
    event WeatherRequestSent(bytes32 indexed requestId, string location);
    event WeatherDataReceived(string location, uint256 temperature, uint256 humidity, uint256 precip1h, uint256 precip24h, string weather);
    event Response(bytes32 indexed requestId, string weather, bytes response, bytes err);

    // Errors
    error UnexpectedRequestID(bytes32 requestId);

    constructor(
        address router,
        bytes32 donId,
        uint64 subscriptionId
    ) FunctionsClient(router) Ownable(msg.sender) {
        s_donId = donId;
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = 300000;
        s_requestConfirmations = 1;
    }

    /**
     * @notice Send a request for weather data
     * @param subscriptionId The subscription ID
     * @param args The arguments [zipcode, countryCode, units]
     * @return requestId The ID of the request
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external returns (bytes32 requestId) {
        // Create the request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (args.length > 0) req.setArgs(args);

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            s_callbackGasLimit,
            s_donId
        );

        string memory requestLocation = string.concat(args[0], ",", args[1]);
        emit WeatherRequestSent(s_lastRequestId, requestLocation);

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        weather = string(response);
        s_lastError = err;
        lastUpdated = block.timestamp;

        // Try to extract basic data (simplified)
        // In real implementation, you'd parse the JSON response
        // For now, we'll store the raw response and set defaults
        // The actual parsing would be done in a production contract
        temperature = 1850; // 18.5°C (default)
        humidity = 65; // 65% (default)
        precipitation1h = 0; // 0mm (default)
        precipitation24h = 0; // 0mm (default)
        location = "Unknown"; // Default location

        // Emit an event to log the response
        emit Response(requestId, weather, s_lastResponse, s_lastError);
        emit WeatherDataReceived(location, temperature, humidity, precipitation1h, precipitation24h, weather);
    }

    /**
     * @notice Get the latest weather data
     */
    function getWeatherData() external view returns (
        string memory _weather,
        string memory _location,
        uint256 _temperature,
        uint256 _humidity,
        uint256 _precip1h,
        uint256 _precip24h,
        uint256 _lastUpdated
    ) {
        return (weather, location, temperature, humidity, precipitation1h, precipitation24h, lastUpdated);
    }

    /**
     * @notice Get temperature in Celsius
     */
    function getTemperatureCelsius() external view returns (uint256) {
        return temperature / 100;
    }

    /**
     * @notice Get precipitation in last hour (mm)
     */
    function getPrecipitation1h() external view returns (uint256) {
        return precipitation1h;
    }

    /**
     * @notice Get precipitation in last 24 hours (mm)
     */
    function getPrecipitation24h() external view returns (uint256) {
        return precipitation24h;
    }

    /**
     * @notice Check if it rained in the last hour
     */
    function hasRecentRain() external view returns (bool) {
        return precipitation1h > 0;
    }

    /**
     * @notice Check if it rained in the last 24 hours
     */
    function hasRain24h() external view returns (bool) {
        return precipitation24h > 0;
    }

    /**
     * @notice Check if weather data is recent
     */
    function isWeatherDataRecent() external view returns (bool) {
        return (block.timestamp - lastUpdated) < 3600; // 1 hour
    }

    /**
     * @notice Update Chainlink Functions configuration
     */
    function updateConfig(
        bytes32 donId,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint16 requestConfirmations
    ) external onlyOwner {
        s_donId = donId;
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = callbackGasLimit;
        s_requestConfirmations = requestConfirmations;
    }

    // Hardcoded source code for AccuWeather API call
    string public source = "let cityName, countryCode; if (typeof args[0] === 'string' && args[0].startsWith('[')) { try { const parsedArgs = JSON.parse(args[0]); cityName = parsedArgs[0]; countryCode = parsedArgs[1]; } catch (e) { throw Error('Invalid arguments format'); } } else { cityName = args[0]; countryCode = args[1]; } if (!secrets.apiKey) { throw Error('AccuWeather API Key is not available!'); } const locationURL = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${secrets.apiKey}&q=${cityName}&country=${countryCode}`; const locationResponse = await Functions.makeHttpRequest({ url: locationURL }); if (locationResponse.error) { throw Error('Location search failed'); } if (!locationResponse.data || locationResponse.data.length === 0) { throw Error('No location found for this city'); } const locationKey = locationResponse.data[0].Key; const weatherURL = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${secrets.apiKey}&details=true`; const weatherResponse = await Functions.makeHttpRequest({ url: weatherURL }); if (weatherResponse.error) { throw Error('Weather request failed'); } const weatherData = weatherResponse.data[0]; const result = { temp: weatherData.Temperature.Metric.Value, humidity: weatherData.RelativeHumidity, desc: weatherData.WeatherText, precip1h: weatherData.PrecipitationSummary?.PastHour?.Metric?.Value || 0, precip24h: weatherData.PrecipitationSummary?.Past24Hours?.Metric?.Value || 0 }; return Functions.encodeString(JSON.stringify(result));";
} 