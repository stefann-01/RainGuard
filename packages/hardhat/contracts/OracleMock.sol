// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OracleMock {
    event WeatherDataRequested(uint256 indexed requestId, string location, uint256 start, uint256 end);
    event WeatherDataFulfilled(uint256 indexed requestId, uint256 rainfall);

    function requestWeatherData(uint256 requestId, string memory location, uint256 start, uint256 end) external {}
    function fulfillWeatherData(uint256 requestId, uint256 rainfall) external {}
} 