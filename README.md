# 🌧️ RainGuard

**Decentralized Peer-to-Peer Weather Insurance Protocol**

RainGuard is a decentralized insurance protocol that uses trusted weather data to trigger automatic payouts for climate-related risks. It enables anyone to build tailored protection against unpredictable weather events like droughts, heatwaves, or storms, without dealing with traditional insurers or slow, manual claims processes.

## 🚀 Features

- **Weather-Based Insurance**: Create custom insurance policies based on specific weather conditions, locations, and timeframes
- **Expert-Driven Pricing**: Risk experts compete to offer the best premium rates through transparent bidding
- **Automated Payouts**: Smart contracts automatically trigger payouts when weather conditions are met
- **Gasless Transactions**: Circle Paymaster integration enables gasless transactions paid in USDT
- **Reputation System**: Experts build reputation scores based on their risk assessment accuracy
- **Real-Time Data**: Chainlink Functions integration with AccuWeather for reliable weather data
- **User-Friendly Interface**: Clean, intuitive UI designed for users with no blockchain experience

## 🏗️ Architecture

### Smart Contracts

The protocol consists of several smart contracts deployed on **Mantle** and **Zircuit**:

- **`InsuranceManager`**: Core contract handling the entire insurance lifecycle
- **`Reputation`**: Manages expert reputation scores and performance tracking
- **`EventsLib`**: Event definitions for contract interactions
- **`MockUSDC`**: Test USDC token for development
- **`OracleMock`**: Mock oracle for testing weather data integration

### Frontend

Built with modern web technologies:
- **Next.js 15** (App Router) with TypeScript
- **Scaffold-ETH 2** hooks for seamless blockchain interactions
- **RainbowKit** for wallet connections
- **Tailwind CSS** with DaisyUI for styling
- **Wagmi** for Ethereum interactions

## 📋 Insurance Lifecycle

1. **Request Creation**: Users create insurance requests with coverage amount, location, timeframe, and weather conditions
2. **Expert Bidding**: Risk experts submit offers with premiums and risk assessments
3. **Offer Selection**: Users select the best offer based on premium and expert reputation
4. **Pool Funding**: Investors fund the payout pool with USDC
5. **Premium Payment**: Users pay premiums, automatically distributed to experts (5%) and investors (95%)
6. **Policy Activation**: Smart contract activates the policy for the specified timeframe
7. **Automatic Settlement**: Chainlink Functions fetch weather data and trigger payouts if conditions are met
8. **Reputation Update**: Expert reputation scores are updated based on payout accuracy

## 🛠️ Tech Stack

### Backend
- **Solidity** ^0.8.0
- **Hardhat** for development and testing
- **OpenZeppelin** contracts for security
- **Chainlink Functions** for oracle integration
- **Circle Paymaster** for gasless transactions

### Frontend
- **Next.js** 15 with App Router
- **TypeScript** for type safety
- **Wagmi** + **RainbowKit** for Web3 integration
- **Tailwind CSS** + **DaisyUI** for styling
- **React Query** for data fetching
- **Zustand** for state management

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.18.3
- Yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RainGuard
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp packages/hardhat/.env.example packages/hardhat/.env
   cp packages/nextjs/.env.example packages/nextjs/.env
   ```

4. **Start local development**
   ```bash
   # Start local blockchain
   yarn chain
   
   # Deploy contracts (in a new terminal)
   yarn deploy
   
   # Start frontend (in a new terminal)
   yarn start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Debug interface: http://localhost:3000/debug

## 📖 Usage

### For Users

1. **Create Insurance Request**
   - Navigate to the "Create Request" page
   - Define weather conditions (rain, wind, temperature, etc.)
   - Set coverage amount, location, and timeframe
   - Submit your request

2. **Review Expert Offers**
   - Browse offers from risk experts
   - Compare premiums and reputation scores
   - Select the best offer for your needs

3. **Pay Premium**
   - Once the pool is funded, pay your premium
   - Premium is automatically distributed to experts and investors

4. **Monitor Policy**
   - Track your policy status in real-time
   - View countdown to policy expiry
   - Receive automatic payout if conditions are met

### For Experts

1. **Submit Offers**
   - Review open insurance requests
   - Analyze weather risks and historical data
   - Submit competitive premium offers with detailed assessments

2. **Build Reputation**
   - Earn reputation points for accurate risk assessments
   - Avoid penalties for mispriced risks
   - Establish credibility in the ecosystem

### For Investors

1. **Fund Pools**
   - Browse available insurance pools
   - Contribute USDC to fund payouts
   - Earn returns if no payout is triggered

2. **Monitor Investments**
   - Track funding progress in real-time
   - View potential returns and risks
   - Withdraw funds after policy settlement

## 🔧 Development

### Available Scripts

```bash
# Blockchain
yarn chain          # Start local blockchain
yarn deploy         # Deploy contracts
yarn test           # Run tests
yarn compile        # Compile contracts

# Frontend
yarn start          # Start development server
yarn build          # Build for production
yarn lint           # Run linter
yarn format         # Format code

# Deployment
yarn vercel         # Deploy to Vercel
yarn ipfs           # Deploy to IPFS
```

### Contract Functions

#### Core Functions
- `createRequest()`: Create new insurance request
- `submitOffer()`: Submit expert offer
- `selectOffer()`: Select winning offer
- `fundPool()`: Fund insurance pool
- `payPremium()`: Pay insurance premium
- `settlePolicy()`: Settle policy with weather data

#### Getter Functions
- `getRequestBasic()`: Get basic request information
- `getOffers()`: Get all offers for a request
- `getOfferById()`: Get specific offer details
- `getInvestments()`: Get pool investments
- `getConditions()`: Get weather conditions
- `getAllRequestIds()`: Get all request IDs

## 🔒 Security

- **OpenZeppelin**: Industry-standard security contracts
- **Comprehensive Testing**: Full test coverage for all contracts
- **Access Control**: Role-based permissions and ownership controls
- **Oracle Security**: Chainlink Functions for reliable data feeds
- **Gas Optimization**: Efficient contract design for cost-effective operations

## 🌐 Networks

### Mainnet
- **Mantle**
- **Zircuit**

### Testnet
- **Mantle Testnet**
- **Local Hardhat**

## 📋 Deployed Contracts

### Zircuit Testnet
- **InsuranceManager**: `0x7C655115aC55C333Fa6B392C5984698AB60d020f`
- **Explorer**: https://explorer.zircuit.com/address/0x7C655115aC55C333Fa6B392C5984698AB60d020f

### Mantle Testnet
- **InsuranceManager**: `0x9847C817983D90faA45bC71bCa461AD8f246f2e9`
- **Explorer**: https://explorer.mantle.xyz/address/0x9847C817983D90faA45bC71bCa461AD8f246f2e9

---

**RainGuard** - Insurance without middlemen, powered by data and governed by its participants.
