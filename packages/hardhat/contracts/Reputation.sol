// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Reputation {
    event ReputationUpdated(address indexed expert, int256 scoreChange, int256 newScore);

    mapping(address => int256) public expertScores;

    function updateReputation(address expert, int256 scoreChange) external {
        expertScores[expert] += scoreChange;
        emit ReputationUpdated(expert, scoreChange, expertScores[expert]);
    }

    function getReputation(address expert) external view returns (int256) {
        return expertScores[expert];
    }
} 