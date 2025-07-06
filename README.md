# 🌧️ RainGuard - On-Chain Weather Insurance Protocol

RainGuard is a decentralized weather insurance protocol built on Ethereum using Chainlink Functions to fetch real-time weather data from AccuWeather API.

## 🚀 Features

- **Real-time Weather Data**: Fetch current weather conditions using Chainlink Functions
- **Smart Contract Insurance**: Automated insurance payouts based on weather conditions
- **Decentralized Oracle**: Reliable weather data through Chainlink's decentralized network
- **Web3 Frontend**: Modern React/Next.js interface for interacting with the protocol

## 🏗️ Architecture

### Smart Contracts
- `WeatherConsumer.sol` - Main contract for fetching weather data via Chainlink Functions
- Weather insurance logic for automated payouts
- Integration with AccuWeather API through Chainlink Functions

### Frontend
- Next.js application with Web3 integration
- Real-time weather data display
- Insurance policy management interface

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- MetaMask or other Web3 wallet
- Sepolia testnet ETH
- AccuWeather API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RainGuard
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cd packages/hardhat
   # Create .env file with your private key
   echo "__RUNTIME_DEPLOYER_PRIVATE_KEY=your_private_key_here" > .env
   ```

## 🔧 Configuration

### Chainlink Functions Setup

1. **Create Subscription**
   - Go to [Chainlink Functions](https://functions.chain.link)
   - Connect your wallet (Sepolia network)
   - Create a new subscription
   - Fund it with LINK tokens

2. **Upload Secrets**
   - Add your AccuWeather API key as a secret
   - Configure the secret name as `apiKey`

3. **Deploy Contract**
   ```bash
   cd packages/hardhat
   yarn hardhat run scripts/deploy-fresh-weather.ts --network sepolia
   ```

4. **Add Consumer**
   - Add your deployed contract address to the subscription
   - Update the contract with your subscription ID

## 🚀 Usage

### Deploy Smart Contracts
```bash
cd packages/hardhat
yarn hardhat run scripts/deploy-fresh-weather.ts --network sepolia
```

### Request Weather Data
```bash
yarn hardhat run scripts/request-weather-fresh.ts --network sepolia
```

### Start Frontend
```bash
cd packages/nextjs
yarn dev
```

## 📁 Project Structure

```
RainGuard/
├── packages/
│   ├── hardhat/           # Smart contracts & deployment
│   │   ├── contracts/     # Solidity contracts
│   │   ├── deploy/        # Deployment scripts
│   │   └── scripts/       # Utility scripts
│   └── nextjs/           # Frontend application
│       ├── app/          # Next.js app directory
│       ├── components/   # React components
│       └── services/     # Web3 services
├── README.md
└── package.json
```

## 🔗 Chainlink Functions Flow

1. **Request Initiation**: Smart contract calls `sendRequest()`
2. **Off-chain Execution**: DON nodes execute JavaScript code
3. **API Call**: Fetch weather data from AccuWeather
4. **Response Processing**: Parse and format data
5. **On-chain Update**: Contract state updated with weather data

## 🧪 Testing

```bash
cd packages/hardhat
yarn hardhat test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## ⚠️ Security

- Never commit private keys or API keys
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet deployment
- Follow security best practices for smart contract development

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.
