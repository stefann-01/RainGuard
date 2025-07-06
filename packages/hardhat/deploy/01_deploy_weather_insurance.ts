import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("🚀 Deploying WeatherInsurance contract with Chainlink Functions...");

  // Chainlink Functions configuration for Sepolia
  const router = "0xD0daae2231E9CB96b94C8512223533293C3693Bf"; // Sepolia Functions Router
  const donId = "0x66756e2d657468657265756d2d7365706f6c69612d310000000000000000"; // Sepolia DON ID
  const subscriptionId = 1; // You'll need to create a subscription and replace this

  console.log("📡 Chainlink Functions Configuration:");
  console.log("   Router:", router);
  console.log("   DON ID:", donId);
  console.log("   Subscription ID:", subscriptionId);
  console.log("");
  console.log("⚠️  IMPORTANT: You need to:");
  console.log("   1. Create a Chainlink Functions subscription");
  console.log("   2. Fund the subscription with LINK tokens");
  console.log("   3. Update the subscriptionId in this script");
  console.log("");

  await deploy("WeatherInsurance", {
    from: deployer,
    args: [router, donId, subscriptionId],
    log: true,
    waitConfirmations: 1,
  });

  console.log("✅ WeatherInsurance contract deployed successfully!");
  console.log("");
  console.log("🔗 Next steps:");
  console.log("1. Create Chainlink Functions subscription at: https://functions.chain.link/");
  console.log("2. Fund subscription with LINK tokens");
  console.log("3. Upload your API key as a secret");
  console.log("4. Test with real API calls!");
  console.log("");
  console.log("🌤️ This contract will make REAL calls to OpenWeather API!");
};

func.id = "deploy_weather_insurance";
func.tags = ["WeatherInsurance"];

export default func; 