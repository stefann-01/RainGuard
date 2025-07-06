import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying fresh WeatherConsumer contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);

  // Chainlink Functions configuration for Sepolia
  const router = "0xD0daae2231E9CB96b94C8512223533293C3693Bf"; // Sepolia Functions Router
  const donId = ethers.zeroPadValue("0x66756e2d657468657265756d2d7365706f6c69612d310000000000000000", 32); // Sepolia DON ID
  const subscriptionId = 5274; // Your actual subscription ID

  console.log("🔗 Router:", router);
  console.log("🆔 DON ID:", donId);
  console.log("📋 Subscription ID:", subscriptionId);

  // Deploy the contract
  console.log("📦 Deploying WeatherConsumer...");
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer");
  const weatherConsumer = await WeatherConsumer.deploy(router, donId, subscriptionId);
  
  console.log("⏳ Waiting for deployment confirmation...");
  await weatherConsumer.waitForDeployment();
  
  const contractAddress = await weatherConsumer.getAddress();
  console.log("✅ WeatherConsumer deployed to:", contractAddress);

  // Verify the configuration
  console.log("\n🔍 Verifying configuration...");
  console.log("👤 Contract owner:", await weatherConsumer.owner());
  console.log("📋 Subscription ID:", (await weatherConsumer.s_subscriptionId()).toString());
  console.log("🆔 DON ID:", await weatherConsumer.s_donId());

  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Go to https://functions.chain.link");
  console.log("2. Connect your wallet (Sepolia network)");
  console.log("3. Add consumer:", contractAddress);
  console.log("4. Upload your AccuWeather API key as a secret");
  console.log("5. Test with: yarn hardhat run scripts/request-weather.ts --network sepolia");
  
  console.log("\n📝 Contract address to save:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 