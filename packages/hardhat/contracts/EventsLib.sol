// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library EventsLib {
    event InsuranceRequestCreated(uint256 indexed requestId, address indexed user);
    event OfferSubmitted(uint256 indexed requestId, uint256 indexed offerId, address indexed expert);
    event OfferSelected(uint256 indexed requestId, uint256 indexed offerId);
    event PoolFunded(uint256 indexed poolId, address indexed investor, uint256 amount);
    event PolicyActivated(uint256 indexed requestId, uint256 indexed poolId);
    event PolicySettled(uint256 indexed requestId, bool payout);
    event ReputationUpdated(address indexed expert, int256 scoreChange);
} 