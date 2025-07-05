import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// Mapping of network names to USDC addresses
const usdcAddresses: Record<string, string> = {
  sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
  // Add other networks here, e.g.:
  // mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // goerli: "0x...",
};

const deployInsuranceManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const network = hre.network.name;
  let usdcAddress = usdcAddresses[network];
  if (!usdcAddress) {
    if (network === "localhost" || network === "hardhat") {
      const mockUSDC = await hre.deployments.get("MockUSDC");
      usdcAddress = mockUSDC.address;
    } else {
      throw new Error(`No USDC address configured for network: ${network}`);
    }
  }

  await deploy("InsuranceManager", {
    from: deployer,
    args: [deployer, usdcAddress],
    log: true,
    autoMine: true,
  });
};

export default deployInsuranceManager;
deployInsuranceManager.tags = ["InsuranceManager"];

/*
How to manage USDC addresses for multiple networks:
- Add the USDC address for each network to the usdcAddresses mapping above.
- When deploying, Hardhat will use the correct address based on the network name (e.g., sepolia, mainnet, goerli).
- To deploy to a different network, run: yarn deploy --network <networkName>
- If you want to use environment variables, you can also read the USDC address from process.env for each network.
*/
