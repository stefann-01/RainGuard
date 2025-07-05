// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {
    WeatherType,
    Operator,
    WeatherCondition,
    Offer,
    Investment,
    InsuranceRequest
} from "./IInsuranceManager.sol";
import { IInsuranceManager } from "./IInsuranceManager.sol";
import { EventsLib } from "./EventsLib.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract InsuranceManager is IInsuranceManager, Ownable {
    // Storage
    uint256 public requestCount;
    mapping(uint256 => InsuranceRequest) public requests;
    mapping(address => int256) public expertReputation;

    // Create a new insurance request with multiple weather conditions
    function createRequest(
        string memory title,
        string memory description,
        uint256 amount,
        WeatherCondition[] memory conditions,
        string memory location,
        uint256 start,
        uint256 end
    ) external {
        require(amount > 0, "Amount must be positive");
        require(start < end, "Invalid time period");
        require(conditions.length > 0, "At least one condition required");
        uint256 requestId = requestCount;
        InsuranceRequest storage req = requests[requestId];
        req.id = requestId;
        req.title = title;
        req.description = description;
        req.user = msg.sender;
        req.amount = amount;
        req.location = location;
        req.start = start;
        req.end = end;
        req.status = 0; // pending
        for (uint256 i = 0; i < conditions.length; i++) {
            req.conditions.push(conditions[i]);
        }
        requestCount++;
        emit InsuranceRequestCreated(requestId, msg.sender);
    }

    // Experts submit offers for a request
    function submitOffer(uint256 requestId, uint256 premium) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.user != address(0), "Request does not exist");
        require(req.status == 0, "Request not pending");
        require(premium > 0, "Premium must be positive");
        Offer memory offer = Offer({
            expert: msg.sender,
            premium: premium,
            timestamp: block.timestamp
        });
        req.offers.push(offer);
        uint256 offerId = req.offers.length - 1;
        emit OfferSubmitted(requestId, offerId, msg.sender);
    }

    // Only request creator can select an offer
    function selectOffer(uint256 requestId, uint256 offerId) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.user == msg.sender, "Not request creator");
        require(req.status == 0, "Request not pending");
        require(offerId < req.offers.length, "Invalid offerId");
        req.selectedOffer = offerId;
        req.status = 1; // funding
        emit OfferSelected(requestId, offerId);
    }

    // Investors fund the pool for the selected request
    function fundPool(uint256 requestId) external payable {
        InsuranceRequest storage req = requests[requestId];
        require(req.status == 1, "Not in funding phase");
        require(msg.value > 0, "No funds sent");
        // Add or update investment
        bool found = false;
        for (uint256 i = 0; i < req.investments.length; i++) {
            if (req.investments[i].investor == msg.sender) {
                req.investments[i].amount += msg.value;
                found = true;
                break;
            }
        }
        if (!found) {
            req.investments.push(Investment({
                investor: msg.sender,
                amount: msg.value
            }));
        }
        req.totalFunded += msg.value;
        emit PoolFunded(requestId, msg.sender, msg.value);
        // Funding goal is amount (coverage only)
        if (req.totalFunded >= req.amount) {
            req.status = 2; // premium payment phase
            // PolicyActivated will be emitted after premium is paid
        }
    }

    // User pays premium after pool is funded; premium is distributed to investors
    function payPremium(uint256 requestId) external payable {
        InsuranceRequest storage req = requests[requestId];
        require(req.user == msg.sender, "Only request creator can pay premium");
        require(req.status == 2, "Not in premium payment phase");
        require(req.offers.length > 0, "No offer selected");
        require(req.selectedOffer < req.offers.length, "Invalid selected offer");
        uint256 premium = req.offers[req.selectedOffer].premium;
        require(msg.value == premium, "Incorrect premium amount");
        // Calculate total investment
        uint256 totalFunded = 0;
        for (uint256 i = 0; i < req.investments.length; i++) {
            totalFunded += req.investments[i].amount;
        }
        require(totalFunded >= req.amount, "Pool not fully funded");
        // Calculate expert share (5%)
        uint256 expertShare = (premium * 5) / 100;
        address expert = req.offers[req.selectedOffer].expert;
        (bool sentExpert, ) = expert.call{value: expertShare}("");
        require(sentExpert, "Expert payment failed");
        // Distribute remaining premium (95%) to investors
        uint256 remainingPremium = premium - expertShare;
        for (uint256 i = 0; i < req.investments.length; i++) {
            uint256 share = (remainingPremium * req.investments[i].amount) / totalFunded;
            (bool sent, ) = req.investments[i].investor.call{value: share}("");
            require(sent, "Premium distribution failed");
        }
        req.status = 3; // active
        emit PolicyActivated(requestId, requestId);
    }

    // Settle the policy after the period ends; mock oracle integration
    function settlePolicy(uint256 requestId, bool conditionMet) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.status == 3, "Policy not active");
        require(block.timestamp >= req.end, "Policy period not ended");
        // In production, call oracle and check all conditions
        // For now, use conditionMet as a mock result
        bool payout = conditionMet;
        req.payout = payout;
        if (payout) {
            // Pay out to user from the pool
            uint256 payoutAmount = req.amount;
            require(address(this).balance >= payoutAmount, "Insufficient contract balance");
            (bool sent, ) = req.user.call{value: payoutAmount}("");
            require(sent, "Payout failed");
        }
        req.status = 4; // expired
        emit PolicySettled(requestId, payout);
        // Update expert reputation
        address expert = req.offers[req.selectedOffer].expert;
        if (payout) {
            updateReputation(expert, -10); // Penalize expert for mispricing
        } else {
            updateReputation(expert, 5); // Reward expert for correct pricing
        }
    }

    // Investors can withdraw their funds if policy did not default
    function withdrawInvestment(uint256 requestId) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.status == 4, "Policy not settled");
        require(!req.payout, "Policy defaulted, no withdrawal");
        uint256 amount = 0;
        for (uint256 i = 0; i < req.investments.length; i++) {
            if (req.investments[i].investor == msg.sender && req.investments[i].amount > 0) {
                amount = req.investments[i].amount;
                req.investments[i].amount = 0; // Prevent double-withdrawal
                break;
            }
        }
        require(amount > 0, "No funds to withdraw");
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");
    }

    // Update expert reputation (simple logic)
    function updateReputation(address expert, int256 scoreChange) public {
        expertReputation[expert] += scoreChange;
        emit ReputationUpdated(expert, scoreChange);
    }
} 