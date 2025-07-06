import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying WeatherConsumer contract...");
  console.log("Deployer:", deployer);

  // Chainlink Functions configuration for Sepolia
  const router = "0xD0daae2231E9CB96b94C8512223533293C3693Bf"; // Sepolia Functions Router
  const donId = ethers.zeroPadValue("0x66756e2d657468657265756d2d7365706f6c69612d310000000000000000", 32); // Sepolia DON ID
  const subscriptionId = 0; // Will be set after deployment

  console.log("Router:", router);
  console.log("DON ID:", donId);
  console.log("Subscription ID:", subscriptionId);

  const weatherConsumer = await deploy("WeatherConsumer", {
    from: deployer,
    args: [router, donId, subscriptionId],
    log: true,
    waitConfirmations: 1,
  });

  console.log("WeatherConsumer deployed to:", weatherConsumer.address);
  console.log("\n=== NEXT STEPS ===");
  console.log("1. Go to https://functions.chain.link");
  console.log("2. Connect your wallet (Sepolia network)");
  console.log("3. Create a subscription");
  console.log("4. Fund your subscription with LINK tokens");
  console.log("5. Add consumer:", weatherConsumer.address);
  console.log("6. Update the contract with your subscription ID");
  console.log("7. Upload your OpenWeather API key as a secret");
  console.log("8. Test the contract!");
};

func.id = "deploy_weather_consumer";
func.tags = ["WeatherConsumer"];

export default func; 