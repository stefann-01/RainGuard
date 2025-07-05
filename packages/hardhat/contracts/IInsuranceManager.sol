// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Top-level type definitions for use across contracts

enum WeatherType { Rain, Wind, Tornado, Flood, Hail }
enum Operator { LessThan, GreaterThan, Equal }

struct WeatherCondition {
    WeatherType weatherType; // e.g., Wind
    Operator op;             // e.g., GreaterThan (for the count or threshold)
    uint256 aggregateValue;  // e.g., 100 (hours) or threshold value for simple cases
    uint256 subThreshold;    // e.g., 50 (km/h), 0 for simple cases
    Operator subOp;          // e.g., GreaterThan (for wind speed), 0 for simple cases
}

struct Offer {
    uint256 id;
    address expert;
    uint256 premium;
    uint256 timestamp;
    string description;
}

struct Investment {
    address investor;
    uint256 amount;
}

struct InsuranceRequest {
    uint256 id;
    string title;
    string description;
    address user;
    uint256 amount;
    WeatherCondition[] conditions;
    string location;
    uint256 start; // unix timestamp
    uint256 end; // unix timestamp
    uint8 status; // 0: pending, 1: funding, 2: premium, 3: active, 4: expired, 5: cancelled
    Offer[] offers;
    Offer selectedOffer; // full selected offer object
    Investment[] investments;
    uint256 totalFunded;
    bool payout; // true if payout was made
}

interface IInsuranceManager {
    function createRequest(
        string memory title,
        string memory description,
        uint256 amount,
        WeatherCondition[] memory conditions,
        string memory location,
        uint256 start,
        uint256 end
    ) external;

    function submitOffer(uint256 requestId, uint256 premium, string memory description) external;
    function selectOffer(uint256 requestId, uint256 offerId) external;
    function fundPool(uint256 requestId, uint256 amount) external;
    function payPremium(uint256 requestId, uint256 amount) external;
    function settlePolicy(uint256 requestId) external;
    function withdrawInvestment(uint256 requestId) external;

    function getRequestBasic(uint256 requestId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        address user,
        uint256 amount,
        string memory location,
        uint256 start,
        uint256 end,
        uint8 status,
        uint256 totalFunded,
        bool payout,
        uint256 selectedOfferId,
        address selectedExpert,
        uint256 selectedPremium,
        string memory selectedDescription
    );
    function getOffers(uint256 requestId) external view returns (Offer[] memory);
    function getInvestments(uint256 requestId) external view returns (Investment[] memory);
    function getConditions(uint256 requestId) external view returns (WeatherCondition[] memory);
    function getAllRequestIds() external view returns (uint256[] memory);
} 