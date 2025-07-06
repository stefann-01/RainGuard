# Deployment Guide

This guide explains how to deploy the RainGuard insurance contracts to various networks including Zircuit and Mantle.

## Prerequisites

1. **Environment Setup**
   ```bash
   # Set your private key in .env file
   echo "__RUNTIME_DEPLOYER_PRIVATE_KEY=your_private_key_here" >> .env
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Compile Contracts**
   ```bash
   yarn compile
   ```

## Supported Networks

### Zircuit Networks
- **Mainnet**: `zircuit`
- **Testnet**: `zircuitTestnet`

### Mantle Networks
- **Mainnet**: `mantle`
- **Testnet**: `mantleTestnet`

### Other Networks
- **Local Development**: `localhost`
- **Ethereum**: `mainnet`, `sepolia`
- **Layer 2s**: `arbitrum`, `optimism`, `polygon`, `base`

## Deployment Commands

### Deploy All Contracts
```bash
# Deploy to specific network
yarn deploy --network <network_name>

# Examples:
yarn deploy --network zircuit
yarn deploy --network mantle
yarn deploy --network zircuitTestnet
yarn deploy --network mantleTestnet
```

### Deploy Specific Contracts
```bash
# Deploy only MockUSDC
yarn deploy --tags MockUSDC --network zircuit

# Deploy only InsuranceManager
yarn deploy --tags InsuranceManager --network mantle

# Deploy only Reputation
yarn deploy --tags Reputation --network zircuit

# Deploy only OracleMock
yarn deploy --tags OracleMock --network mantle
```

### Local Development
```bash
# Start local blockchain
yarn chain

# Deploy to local network
yarn deploy

# Start frontend
yarn start
```

## Network-Specific USDC Addresses

The deployment scripts automatically use the correct USDC address for each network:

| Network | USDC Address |
|---------|-------------|
| Zircuit Mainnet | `0x176211869cA2b568f2A7D4EE941E073a821EE1ff` |
| Zircuit Testnet | `0x176211869cA2b568f2A7D4EE941E073a821EE1ff` |
| Mantle Mainnet | `0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9` |
| Mantle Testnet | `0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9` |
| Sepolia | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| Ethereum Mainnet | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |

## Deployed Contract Addresses

### Zircuit Testnet
- **InsuranceManager**: `0x7C655115aC55C333Fa6B392C5984698AB60d020f`
- **Explorer**: https://explorer.zircuit.com/address/0x7C655115aC55C333Fa6B392C5984698AB60d020f

### Mantle Testnet
- **InsuranceManager**: `0x9847C817983D90faA45bC71bCa461AD8f246f2e9`
- **Explorer**: https://explorer.mantle.xyz/address/0x9847C817983D90faA45bC71bCa461AD8f246f2e9

## Gas Considerations

### Zircuit
- Zircuit is a ZK-rollup with low gas fees
- Recommended gas limit: 5,000,000
- Gas price: Auto (network will optimize)

### Mantle
- Mantle is a modular L2 with very low gas fees
- Recommended gas limit: 3,000,000
- Gas price: Auto (network will optimize)

## Verification

After deployment, you can verify your contracts on block explorers:

### Zircuit
- Mainnet: https://explorer.zircuit.com
- Testnet: https://explorer.zircuit.com

### Mantle
- Mainnet: https://explorer.mantle.xyz
- Testnet: https://explorer.testnet.mantle.xyz

## Troubleshooting

### Common Issues

1. **Insufficient Gas**
   ```bash
   # Check gas prices
   yarn hardhat console --network zircuit
   ```

2. **Wrong USDC Address**
   - Verify USDC addresses in `01_deploy_insurance_manager.ts`
   - Check network-specific USDC contracts

3. **Private Key Issues**
   ```bash
   # Generate new account
   yarn account:generate
   
   # Import existing account
   yarn account:import
   ```

### Network RPC Issues

If you encounter RPC issues, you can use alternative RPC endpoints:

**Zircuit**
- Mainnet: `https://zircuit1.p2pify.com`
- Alternative: `https://rpc.zircuit.com`

**Mantle**
- Mainnet: `https://rpc.mantle.xyz`
- Alternative: `https://mantle.drpc.org`

## Security Notes

1. **Private Key Security**
   - Never commit private keys to version control
   - Use environment variables for sensitive data
   - Consider using hardware wallets for mainnet deployments

2. **Contract Verification**
   - Always verify contracts after deployment
   - Keep deployment artifacts for verification

3. **Testing**
   - Test on testnets before mainnet deployment
   - Use local networks for development

## Monitoring Deployments

After deployment, monitor your contracts:

```bash
# Check deployment status
yarn hardhat deploy:list --network zircuit

# View deployment artifacts
cat packages/hardhat/deployments/zircuit/InsuranceManager.json
```

## Support

For issues with specific networks:
- Zircuit: https://docs.zircuit.com
- Mantle: https://docs.mantle.xyz
- Scaffold-ETH 2: https://docs.scaffoldeth.io 