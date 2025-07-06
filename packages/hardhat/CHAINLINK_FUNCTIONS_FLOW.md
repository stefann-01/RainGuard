# Chainlink Functions Flow Chart

## 📋 Overview
Chainlink Functions enables smart contracts to request off-chain data and computation through a decentralized oracle network.

---

## 🔄 Request Phase

### 1. Contract Initiates Request
- **Smart Contract** calls `sendRequest()` function
- **Parameters**: subscription ID, arguments (API keys, location, units)
- **Gas**: Contract pays for request execution
- **Event**: `RequestSent` emitted with request ID

### 2. Request Processing
- **Chainlink Router** receives the request
- **DON (Decentralized Oracle Network)** nodes are selected
- **Request** is queued for execution
- **Status**: Request moves to "In Progress"

---

## ⚙️ Execution Phase

### 3. Off-Chain Execution
- **DON Nodes** execute the JavaScript source code
- **Environment**: Isolated runtime environment
- **API Calls**: Nodes fetch data from external APIs (AccuWeather, etc.)
- **Secrets**: API keys retrieved from Chainlink secrets management
- **Processing**: Data parsed and formatted

### 4. Response Preparation
- **Data Validation**: Nodes verify response integrity
- **Consensus**: Multiple nodes must agree on response
- **Encoding**: Response encoded for on-chain consumption
- **Size Limit**: Response must fit within 256-byte limit

---

## 📤 Response Phase

### 5. Response Submission
- **Consensus Reached**: DON nodes agree on final response
- **On-Chain Call**: `fulfillRequest()` function called
- **Parameters**: request ID, response data, error status
- **Gas**: Chainlink pays for fulfillment transaction

### 6. Contract Update
- **State Change**: Contract storage updated with weather data
- **Event**: `RequestFulfilled` emitted
- **Callback**: Optional callback function executed
- **Status**: Request marked as "Completed"

---

## 🏗️ Key Components

### Smart Contract Functions
- `sendRequest(subscriptionId, args)` - Initiates request
- `fulfillRequest(requestId, response, err)` - Receives response
- `_fulfillRequest(requestId, response, err)` - Internal fulfillment

### Chainlink Infrastructure
- **Router Contract** - Entry point for requests
- **DON Nodes** - Execute off-chain code
- **Secrets Management** - Secure API key storage
- **Subscription System** - Billing and access control

### JavaScript Source Code
- **API Integration** - External data fetching
- **Data Processing** - Parse and format responses
- **Error Handling** - Graceful failure management
- **Response Formatting** - Prepare for on-chain consumption

---

## 🔧 Setup Requirements

### Contract Deployment
- Deploy consumer contract
- Set correct DON ID (bytes32 format)
- Configure subscription ID

### Subscription Management
- Create subscription on Chainlink Functions
- Fund subscription with LINK tokens
- Add consumer contract address
- Upload API secrets

### Testing Flow
- Deploy contract → Add to subscription → Upload secrets → Send request → Monitor execution → Verify response

---

## ⚠️ Common Issues

### Request Failures
- Insufficient subscription balance
- Invalid API keys or secrets
- Response exceeds 256-byte limit
- Network connectivity issues

### Contract Issues
- Wrong DON ID format
- Incorrect subscription ID
- Missing consumer registration
- Gas limit exceeded

### Execution Errors
- API rate limits exceeded
- Invalid location codes
- Malformed JavaScript code
- Timeout during execution 