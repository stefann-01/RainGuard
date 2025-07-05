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
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Reputation } from "./Reputation.sol";

contract InsuranceManager is IInsuranceManager, Ownable {
    address public usdc;
    Reputation public reputation;

    constructor(address initialOwner, address usdcAddress) Ownable(initialOwner) {
        usdc = usdcAddress;
        reputation = new Reputation();
    }
    // Storage
    uint256 public requestCount;
    uint256[] public requestIds; // Track all request IDs
    mapping(uint256 => InsuranceRequest) public requests;

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
        requestIds.push(requestId);
        emit EventsLib.InsuranceRequestCreated(requestId, msg.sender);
    }

    // Experts submit offers for a request
    function submitOffer(uint256 requestId, uint256 premium, string memory description) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.user != address(0), "Request does not exist");
        require(req.status == 0, "Request not pending");
        require(premium > 0, "Premium must be positive");
        uint256 offerId = req.offers.length;
        Offer memory offer = Offer({
            id: offerId,
            expert: msg.sender,
            premium: premium,
            timestamp: block.timestamp,
            description: description
        });
        req.offers.push(offer);
        emit EventsLib.OfferSubmitted(requestId, offerId, msg.sender);
    }

    // Only request creator can select an offer
    function selectOffer(uint256 requestId, uint256 offerId) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.user == msg.sender, "Not request creator");
        require(req.status == 0, "Request not pending");
        require(offerId < req.offers.length, "Invalid offerId");
        req.selectedOffer = req.offers[offerId];
        req.status = 1; // funding
        emit EventsLib.OfferSelected(requestId, offerId);
    }

    // Investors fund the pool for the selected request using USDC
    function fundPool(uint256 requestId, uint256 amount) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.status == 1, "Not in funding phase");
        require(amount > 0, "No funds sent");
        // Transfer USDC from sender to contract
        require(IERC20(usdc).transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        // Add or update investment
        bool found = false;
        for (uint256 i = 0; i < req.investments.length; i++) {
            if (req.investments[i].investor == msg.sender) {
                req.investments[i].amount += amount;
                found = true;
                break;
            }
        }
        if (!found) {
            req.investments.push(Investment({
                investor: msg.sender,
                amount: amount
            }));
        }
        req.totalFunded += amount;
        emit EventsLib.PoolFunded(requestId, msg.sender, amount);
        // Funding goal is amount (coverage only)
        if (req.totalFunded >= req.amount) {
            req.status = 2; // premium payment phase
            // PolicyActivated will be emitted after premium is paid
        }
    }

    // User pays premium after pool is funded; premium is distributed to investors and expert using USDC
    function payPremium(uint256 requestId, uint256 amount) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.user == msg.sender, "Only request creator can pay premium");
        require(req.status == 2, "Not in premium payment phase");
        require(req.offers.length > 0, "No offer selected");
        require(req.selectedOffer.expert != address(0), "Invalid selected offer");
        uint256 premium = req.selectedOffer.premium;
        require(amount == premium, "Incorrect premium amount");
        // Transfer USDC from sender to contract
        require(IERC20(usdc).transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        // Calculate total investment
        uint256 totalFunded = req.totalFunded;
        require(totalFunded >= req.amount, "Pool not fully funded");
        // Calculate expert share (5%)
        uint256 expertShare = (premium * 5) / 100;
        address expert = req.selectedOffer.expert;
        require(IERC20(usdc).transfer(expert, expertShare), "Expert payment failed");
        // Distribute remaining premium (95%) to investors
        uint256 remainingPremium = premium - expertShare;
        for (uint256 i = 0; i < req.investments.length; i++) {
            uint256 share = (remainingPremium * req.investments[i].amount) / totalFunded;
            require(IERC20(usdc).transfer(req.investments[i].investor, share), "Premium distribution failed");
        }
        req.status = 3; // active
        emit EventsLib.PolicyActivated(requestId, requestId);
    }

    // Settle the policy after the period ends; check oracle data and handle payouts
    function settlePolicy(uint256 requestId) external {
        InsuranceRequest storage req = requests[requestId];
        require(req.status == 3, "Policy not active");
        require(block.timestamp >= req.end, "Policy period not ended");
        
        // In production, call oracle to get data for this requestId
        // For now, we'll use a mock oracle call
        bool conditionMet = mockOracleCall(requestId);
        
        req.payout = conditionMet;
        if (conditionMet) {
            // Pay out to user from the pool in USDC
            uint256 payoutAmount = req.amount;
            require(IERC20(usdc).balanceOf(address(this)) >= payoutAmount, "Insufficient USDC balance");
            require(IERC20(usdc).transfer(req.user, payoutAmount), "Payout failed");
        }
        
        req.status = 4; // expired
        emit EventsLib.PolicySettled(requestId, conditionMet);
        
        // Update expert reputation
        address expert = req.selectedOffer.expert;
        if (conditionMet) {
            reputation.updateReputation(expert, -10); // Penalize expert for mispricing
        } else {
            reputation.updateReputation(expert, 5); // Reward expert for correct pricing
        }
    }

    // Mock oracle function - in production this would call the actual oracle
    function mockOracleCall(uint256 requestId) internal view returns (bool) {
        // This is where you'd call the oracle contract to get data for requestId
        // For now, return a mock result (you can make this configurable)
        return false; // Mock: no payout
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
        require(IERC20(usdc).transfer(msg.sender, amount), "Withdrawal failed");
    }

    // Getter for basic InsuranceRequest fields (excluding arrays to avoid stack too deep)
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
        uint256 selectedOfferId
    ) {
        InsuranceRequest storage req = requests[requestId];
        return (
            req.id,
            req.title,
            req.description,
            req.user,
            req.amount,
            req.location,
            req.start,
            req.end,
            req.status,
            req.totalFunded,
            req.payout,
            req.selectedOffer.id
        );
    }

    // Array getters - return entire arrays
    function getOffers(uint256 requestId) external view returns (Offer[] memory) {
        return requests[requestId].offers;
    }

    function getInvestments(uint256 requestId) external view returns (Investment[] memory) {
        return requests[requestId].investments;
    }

    function getConditions(uint256 requestId) external view returns (WeatherCondition[] memory) {
        return requests[requestId].conditions;
    }

    // Getter for all request IDs
    function getAllRequestIds() external view returns (uint256[] memory) {
        return requestIds;
    }
} 